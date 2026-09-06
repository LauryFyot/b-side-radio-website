// Data access layer for the admin application.
// Centralizes auth calls, bootstrap reads, media uploads, and publish writes.
// Keeps Supabase queries in one place so hooks/components stay UI-focused.
import { supabase } from './supabaseClient';
import { isDbId, toSlug, toTimeInput } from '../utils/adminHelpers';

const ADMIN_MEDIA_BUCKET = import.meta.env.VITE_SUPABASE_MEDIA_BUCKET || 'admin-media';

// Normalize Supabase errors into explicit JS exceptions.
async function throwOnError(result, fallbackMessage) {
  if (result.error) {
    throw new Error(result.error.message || fallbackMessage);
  }
  return result.data;
}

function getFileExtension(fileName) {
  const normalizedName = String(fileName || '').toLowerCase();
  const parts = normalizedName.split('.');
  return parts.length > 1 ? parts.pop() : '';
}

function buildStoragePath(folder, file) {
  const extension = getFileExtension(file.name);
  const timestamp = Date.now();
  const randomPart = globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2, 10);
  const safeName = toSlug(file.name.replace(/\.[^.]+$/, '')) || 'asset';
  const extensionSuffix = extension ? `.${extension}` : '';

  return `${folder}/${safeName}-${timestamp}-${randomPart}${extensionSuffix}`;
}

export async function uploadAdminFile(file, folder) {
  if (!supabase) {
    throw new Error('Supabase is not initialized.');
  }

  if (!file) {
    throw new Error('No file selected.');
  }

  const path = buildStoragePath(folder, file);
  const uploadResult = await supabase.storage.from(ADMIN_MEDIA_BUCKET).upload(path, file, {
    upsert: false,
    contentType: file.type || undefined
  });

  if (uploadResult.error) {
    throw new Error(uploadResult.error.message || 'Unable to upload file.');
  }

  const publicResult = supabase.storage.from(ADMIN_MEDIA_BUCKET).getPublicUrl(path);
  const publicUrl = publicResult.data?.publicUrl || '';

  if (publicUrl === '') {
    throw new Error('Unable to resolve the uploaded file URL.');
  }

  return publicUrl;
}

export async function getCurrentUser() {
  if (!supabase) {
    throw new Error('Supabase config missing (.env).');
  }

  const sessionResult = await supabase.auth.getSession();
  if (sessionResult.error) {
    throw sessionResult.error;
  }

  return sessionResult.data.session?.user || null;
}

export async function signInWithEmail(email, password) {
  if (!supabase) {
    throw new Error('Supabase config missing (.env).');
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw error;
  }

  return data.user || null;
}

export async function signOutUser() {
  if (!supabase) {
    return;
  }
  await supabase.auth.signOut();
}

export async function fetchBootstrapData() {
  // Read all datasets needed by the admin UI in parallel.
  if (!supabase) {
    throw new Error('Supabase config missing (.env).');
  }

  const [shows, slots, covers, tracks, videos, comments] = await Promise.all([
    throwOnError(
      await supabase.from('shows').select('id,name,slug,description,cover_url,is_active').order('id', { ascending: true }),
      'Unable to load shows.'
    ),
    throwOnError(
      await supabase
        .from('show_slots')
        .select('id,show_id,day_of_week,start_time,end_time,priority,is_active')
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true })
        .order('id', { ascending: true }),
      'Unable to load show slots.'
    ),
    throwOnError(
      await supabase.from('featured_covers').select('id,image_url,title,artist,release_year,remixed_by,sort_order,is_active').order('sort_order', { ascending: true }).order('id', { ascending: true }),
      'Unable to load featured covers.'
    ),
    throwOnError(
      await supabase.from('favorite_tracks').select('id,title,dj_name,recommended_by,cover_url,buy_url,mp3_url,sort_order,is_active').order('sort_order', { ascending: true }).order('id', { ascending: true }),
      'Unable to load favorite tracks.'
    ),
    throwOnError(
      await supabase.from('featured_videos').select('id,slot,title,youtube_url,is_active').order('slot', { ascending: true }).order('id', { ascending: true }),
      'Unable to load featured videos.'
    ),
    throwOnError(
      await supabase.from('comments').select('id,author_name,author_email,body,status,created_at').order('created_at', { ascending: false }).limit(200),
      'Unable to load comments.'
    )
  ]);

  return {
    shows: Array.isArray(shows) ? shows : [],
    slots: Array.isArray(slots) ? slots : [],
    covers: Array.isArray(covers) ? covers : [],
    tracks: Array.isArray(tracks) ? tracks : [],
    videos: Array.isArray(videos) ? videos : [],
    comments: Array.isArray(comments) ? comments : []
  };
}

async function deleteByIds(table, ids) {
  // Helper for bulk deletes on persisted IDs.
  if (!supabase || !Array.isArray(ids) || ids.length === 0) {
    return;
  }

  await throwOnError(await supabase.from(table).delete().in('id', ids), `Unable to delete rows in ${table}.`);
}

async function upsertRows(table, rows, transformRow) {
  if (!supabase) {
    throw new Error('Supabase is not initialized.');
  }

  if (!Array.isArray(rows) || rows.length === 0) {
    return;
  }

  const payload = rows.map(transformRow).filter(Boolean);
  if (payload.length === 0) {
    return;
  }

  await throwOnError(await supabase.from(table).upsert(payload), `Unable to upsert ${table}.`);
}

async function insertRows(table, rows, transformRow) {
  if (!supabase) {
    throw new Error('Supabase is not initialized.');
  }

  if (!Array.isArray(rows) || rows.length === 0) {
    return;
  }

  const payload = rows.map(transformRow).filter(Boolean);
  if (payload.length === 0) {
    return;
  }

  await throwOnError(await supabase.from(table).insert(payload), `Unable to insert ${table}.`);
}

export async function publishAdminData(data, deletedIds) {
  const { shows, slots, covers, tracks, videos, comments } = data;

  await deleteByIds('show_slots', deletedIds.slots);
  await deleteByIds('shows', deletedIds.shows);
  await deleteByIds('featured_covers', deletedIds.covers);
  await deleteByIds('favorite_tracks', deletedIds.tracks);
  await deleteByIds('featured_videos', deletedIds.videos);

  const existingShows = shows.filter((show) => isDbId(show.id));
  const newShows = shows.filter((show) => !isDbId(show.id));

  await upsertRows('shows', existingShows, (show) => {
    const name = String(show.name || '').trim();
    if (name === '') {
      return null;
    }

    return {
      id: show.id,
      name,
      slug: toSlug(show.slug || name),
      description: String(show.description || '').trim(),
      cover_url: String(show.cover_url || '').trim(),
      is_active: show.is_active !== false
    };
  });

  await insertRows('shows', newShows, (show) => {
    const name = String(show.name || '').trim();
    if (name === '') {
      return null;
    }

    return {
      name,
      slug: toSlug(show.slug || name),
      description: String(show.description || '').trim(),
      cover_url: String(show.cover_url || '').trim(),
      is_active: show.is_active !== false
    };
  });

  const existingSlots = slots.filter((slot) => isDbId(slot.id));
  const newSlots = slots.filter((slot) => !isDbId(slot.id));

  await upsertRows('show_slots', existingSlots, (slot) => {
    if (!isDbId(slot.show_id) || Number(slot.show_id) <= 0) {
      return null;
    }

    return {
      id: slot.id,
      show_id: slot.show_id,
      day_of_week: Math.max(1, Math.min(7, Number(slot.day_of_week) || 1)),
      start_time: `${toTimeInput(slot.start_time) || '08:00'}:00`,
      end_time: `${toTimeInput(slot.end_time) || '09:00'}:00`,
      priority: Number(slot.priority) || 0,
      is_active: slot.is_active !== false
    };
  });

  await insertRows('show_slots', newSlots, (slot) => {
    if (!isDbId(slot.show_id) || Number(slot.show_id) <= 0) {
      return null;
    }

    return {
      show_id: slot.show_id,
      day_of_week: Math.max(1, Math.min(7, Number(slot.day_of_week) || 1)),
      start_time: `${toTimeInput(slot.start_time) || '08:00'}:00`,
      end_time: `${toTimeInput(slot.end_time) || '09:00'}:00`,
      priority: Number(slot.priority) || 0,
      is_active: slot.is_active !== false
    };
  });

  const normalizedCovers = covers.map((cover, index) => ({ ...cover, sort_order: index }));
  const existingCovers = normalizedCovers.filter((cover) => isDbId(cover.id));
  const newCovers = normalizedCovers.filter((cover) => !isDbId(cover.id));

  await upsertRows('featured_covers', existingCovers, (cover) => {
    const imageUrl = String(cover.image_url || '').trim();
    if (imageUrl === '') {
      return null;
    }

    return {
      id: cover.id,
      image_url: imageUrl,
      title: String(cover.title || '').trim(),
      artist: String(cover.artist || '').trim(),
      release_year: String(cover.release_year || '').trim(),
      remixed_by: String(cover.remixed_by || '').trim(),
      sort_order: Number(cover.sort_order) || 0,
      is_active: cover.is_active !== false
    };
  });

  await insertRows('featured_covers', newCovers, (cover) => {
    const imageUrl = String(cover.image_url || '').trim();
    if (imageUrl === '') {
      return null;
    }

    return {
      image_url: imageUrl,
      title: String(cover.title || '').trim(),
      artist: String(cover.artist || '').trim(),
      release_year: String(cover.release_year || '').trim(),
      remixed_by: String(cover.remixed_by || '').trim(),
      sort_order: Number(cover.sort_order) || 0,
      is_active: cover.is_active !== false
    };
  });

  const normalizedTracks = tracks.map((track, index) => ({ ...track, sort_order: index }));
  const existingTracks = normalizedTracks.filter((track) => isDbId(track.id));
  const newTracks = normalizedTracks.filter((track) => !isDbId(track.id));

  await upsertRows('favorite_tracks', existingTracks, (track) => {
    const title = String(track.title || '').trim();
    const mp3Url = String(track.mp3_url || '').trim();
    if (title === '') {
      return null;
    }

    return {
      id: track.id,
      title,
      dj_name: String(track.dj_name || '').trim(),
      recommended_by: String(track.recommended_by || track.dj_name || '').trim(),
      cover_url: String(track.cover_url || '').trim(),
      buy_url: String(track.buy_url || '').trim(),
      mp3_url: mp3Url,
      sort_order: Number(track.sort_order) || 0,
      is_active: track.is_active !== false
    };
  });

  await insertRows('favorite_tracks', newTracks, (track) => {
    const title = String(track.title || '').trim();
    const mp3Url = String(track.mp3_url || '').trim();
    if (title === '' || mp3Url === '') {
      return null;
    }

    return {
      title,
      dj_name: String(track.dj_name || '').trim(),
      recommended_by: String(track.recommended_by || track.dj_name || '').trim(),
      cover_url: String(track.cover_url || '').trim(),
      buy_url: String(track.buy_url || '').trim(),
      mp3_url: mp3Url,
      sort_order: Number(track.sort_order) || 0,
      is_active: track.is_active !== false
    };
  });

  const existingVideos = videos.filter((video) => isDbId(video.id));
  const newVideos = videos.filter((video) => !isDbId(video.id));

  await upsertRows('featured_videos', existingVideos, (video) => {
    const url = String(video.youtube_url || '').trim();
    if (url === '') {
      return null;
    }

    return {
      id: video.id,
      slot: Math.max(1, Math.min(3, Number(video.slot) || 1)),
      title: String(video.title || '').trim(),
      youtube_url: url,
      is_active: video.is_active !== false
    };
  });

  await insertRows('featured_videos', newVideos, (video) => {
    const url = String(video.youtube_url || '').trim();
    if (url === '') {
      return null;
    }

    return {
      slot: Math.max(1, Math.min(3, Number(video.slot) || 1)),
      title: String(video.title || '').trim(),
      youtube_url: url,
      is_active: video.is_active !== false
    };
  });

  const commentUpdates = comments
    .filter((comment) => comment.id !== null && comment.id !== undefined)
    .map(async (comment) => {
      const commentId = Number(comment.id);
      if (!Number.isFinite(commentId) || commentId <= 0) {
        return;
      }

      await throwOnError(
        await supabase.rpc('moderate_comment_status', {
          target_comment_id: commentId,
          target_status: comment.status
        }),
        `Unable to update comment ${commentId}.`
      );
    });

  await Promise.all(commentUpdates);
}
