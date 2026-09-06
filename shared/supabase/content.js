import { supabase } from './client.js';

function normalizeRows(rows) {
  return Array.isArray(rows) ? rows : [];
}

async function readTable(table, select, orderBy) {
  if (!supabase) {
    return [];
  }

  let query = supabase.from(table).select(select);
  if (orderBy) {
    query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
  }

  const { data, error } = await query;
  if (error) {
    console.warn(`[supabase:${table}]`, error.message || error);
    return [];
  }

  return normalizeRows(data);
}

// Insert a visitor comment; the DB trigger auto-approves it (see comment_insert_guard).
export async function submitComment({ authorName, body, email } = {}) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const trimmedName = String(authorName || '').trim();
  const trimmedBody = String(body || '').trim();
  const trimmedEmail = String(email || '').trim();
  if (!trimmedName || !trimmedBody) {
    throw new Error('Name and message are required.');
  }

  const { error } = await supabase.from('comments').insert({
    author_name: trimmedName,
    author_email: trimmedEmail || null,
    body: trimmedBody,
  });

  if (error) {
    throw new Error(error.message || 'Unable to submit comment.');
  }
}

// Increment a comment's like counter through the security-definer RPC.
export async function likeComment(commentId) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase.rpc('increment_comment_likes', { target_comment_id: commentId });
  if (error) {
    throw new Error(error.message || 'Unable to like this comment.');
  }

  return typeof data === 'number' ? data : null;
}

// Undo a previous like through the matching decrement RPC.
export async function unlikeComment(commentId) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase.rpc('decrement_comment_likes', { target_comment_id: commentId });
  if (error) {
    throw new Error(error.message || 'Unable to unlike this comment.');
  }

  return typeof data === 'number' ? data : null;
}

export async function fetchPublicContent() {
  const [shows, slots, covers, tracks, videos, comments] = await Promise.all([
    readTable('shows', 'id,name,slug,description,cover_url,is_active', { column: 'id', ascending: true }),
    readTable('show_slots', 'id,show_id,day_of_week,start_time,end_time,priority,is_active', { column: 'day_of_week', ascending: true }),
    readTable('featured_covers', 'id,image_url,title,artist,release_year,remixed_by,sort_order,is_active', { column: 'sort_order', ascending: true }),
    readTable('favorite_tracks', 'id,title,dj_name,cover_url,mp3_url,sort_order,is_active', { column: 'sort_order', ascending: true }),
    readTable('featured_videos', 'id,slot,title,youtube_url,is_active', { column: 'slot', ascending: true }),
    readTable('comments', 'id,author_name,body,created_at,likes_count', { column: 'created_at', ascending: false }),
  ]);

  const activeShowsById = new Map(
    shows
      .filter((show) => show.is_active !== false)
      .map((show) => [Number(show.id), show])
  );

  const shows_slots = slots
    .filter((slot) => slot.is_active !== false)
    .map((slot) => ({
      ...slot,
      show: activeShowsById.get(Number(slot.show_id)) || null,
    }))
    .filter((item) => item.show)
    .sort((a, b) => {
      const dayDiff = Number(a.day_of_week || 0) - Number(b.day_of_week || 0);
      if (dayDiff !== 0) return dayDiff;
      return String(a.start_time || '').localeCompare(String(b.start_time || ''));
    });

  return {
    shows,
    slots,
    shows_slots,
    covers,
    tracks,
    videos,
    comments,
  };
}

export function mapSupabaseContentToSiteModel({ shows = [], slots = [], shows_slots = [], covers = [], tracks = [], videos: videosData = [] }) {
  const activeShows = shows.filter((show) => show.is_active !== false);
  const sortedSlots = [...slots].filter((slot) => slot.is_active !== false).sort((a, b) => {
    const dayDiff = Number(a.day_of_week || 0) - Number(b.day_of_week || 0);
    if (dayDiff !== 0) return dayDiff;
    return String(a.start_time || '').localeCompare(String(b.start_time || ''));
  });

  const normalizedShowsSlots = Array.isArray(shows_slots) && shows_slots.length
    ? shows_slots.filter((item) => item?.show)
    : sortedSlots
        .map((slot) => ({
          ...slot,
          show: activeShows.find((show) => Number(show.id) === Number(slot.show_id)) || null,
        }))
        .filter((item) => item.show);

  const toScheduleItem = (item) => {
    const show = item?.show || {};
    return {
      name: show.name || 'Show',
      host: show.slug || 'B Side Radio',
      start: item?.start_time ? String(item.start_time).slice(0, 5) : '00:00',
      end: item?.end_time ? String(item.end_time).slice(0, 5) : '23:59',
      blurb: show.description || 'Programme à venir',
      blurbEn: show.description || 'More details soon',
      dayOfWeek: Number(item?.day_of_week || 0) || undefined,
    };
  };

  const schedule = normalizedShowsSlots.map(toScheduleItem);

  const dayLabels = [
    { day: 'Lundi', dayEn: 'Monday' },
    { day: 'Mardi', dayEn: 'Tuesday' },
    { day: 'Mercredi', dayEn: 'Wednesday' },
    { day: 'Jeudi', dayEn: 'Thursday' },
    { day: 'Vendredi', dayEn: 'Friday' },
    { day: 'Samedi', dayEn: 'Saturday' },
    { day: 'Dimanche', dayEn: 'Sunday' },
  ];

  const weekSchedule = dayLabels.map((labels, index) => {
    const dayOfWeek = index + 1;
    const dayShows = normalizedShowsSlots
      .filter((item) => Number(item.day_of_week || 0) === dayOfWeek)
      .map(toScheduleItem);

    return {
      day: labels.day,
      dayEn: labels.dayEn,
      shows: dayShows,
    };
  });

  const vinyls = covers
    .filter((cover) => cover.is_active !== false)
    .map((cover) => ({
      side: String(cover.id || '').slice(0, 3).toUpperCase(),
      title: cover.title || 'Featured cover',
      artist: cover.artist || '',
      year: cover.release_year || '',
      labelColor: '#B65151',
      remixedBy: cover.remixed_by || '',
      imageUrl: cover.image_url || '',
    }));

  const weeklyTracks = tracks
    .filter((track) => track.is_active !== false)
    .map((track) => ({
      title: track.title || 'Track',
      artist: 'B Side Radio',
      duration: '—',
      dj: track.dj_name || 'B Side Radio',
      src: track.mp3_url || '',
      buyUrl: track.cover_url || '#',
    }));

  const mappedVideos = (videosData || [])
    .filter((video) => video.is_active !== false)
    .map((video) => ({
      id: video.youtube_url?.split('v=')?.[1]?.split('&')[0] || video.youtube_url || 'dQw4w9WgXcQ',
      title: video.title || 'Featured video',
      titleEn: video.title || 'Featured video',
    }));

  return {
    shows: activeShows,
    schedule,
    weekSchedule,
    vinyls,
    weeklyTracks,
    mixSessions: weeklyTracks.slice(0, 3).map((track, index) => ({
      name: track.title,
      dj: track.dj,
      length: '—',
      style: 'Supabase',
      src: track.src,
    })),
    videos: mappedVideos,
    nowPlaying: {
      title: activeShows[0]?.name || 'B Side Radio',
      artist: 'Live from Supabase',
      original: '',
      buyUrl: '#',
    },
  };
}
