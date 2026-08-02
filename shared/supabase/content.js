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

export async function fetchPublicContent() {
  const [shows, slots, covers, tracks, videos] = await Promise.all([
    readTable('shows', 'id,name,slug,description,cover_url,is_active', { column: 'id', ascending: true }),
    readTable('show_slots', 'id,show_id,day_of_week,start_time,end_time,priority,is_active', { column: 'day_of_week', ascending: true }),
    readTable('featured_covers', 'id,image_url,title,sort_order,is_active', { column: 'sort_order', ascending: true }),
    readTable('favorite_tracks', 'id,title,cover_url,mp3_url,sort_order,is_active', { column: 'sort_order', ascending: true }),
    readTable('featured_videos', 'id,slot,title,youtube_url,is_active', { column: 'slot', ascending: true }),
  ]);

  return {
    shows,
    slots,
    covers,
    tracks,
    videos,
  };
}

export function mapSupabaseContentToSiteModel({ shows = [], slots = [], covers = [], tracks = [], videos: videosData = [] }) {
  const activeShows = shows.filter((show) => show.is_active !== false);
  const sortedSlots = [...slots].filter((slot) => slot.is_active !== false).sort((a, b) => {
    const dayDiff = Number(a.day_of_week || 0) - Number(b.day_of_week || 0);
    if (dayDiff !== 0) return dayDiff;
    return String(a.start_time || '').localeCompare(String(b.start_time || ''));
  });

  const schedule = activeShows.map((show) => {
    const matchingSlot = sortedSlots.find((slot) => Number(slot.show_id) === Number(show.id));
    return {
      name: show.name || 'Show',
      host: show.slug || 'B Side Radio',
      start: matchingSlot?.start_time ? String(matchingSlot.start_time).slice(0, 5) : '00:00',
      end: matchingSlot?.end_time ? String(matchingSlot.end_time).slice(0, 5) : '23:59',
      blurb: show.description || 'Programme à venir',
      blurbEn: show.description || 'More details soon',
    };
  });

  const vinyls = covers
    .filter((cover) => cover.is_active !== false)
    .map((cover) => ({
      side: String(cover.id || '').slice(0, 3).toUpperCase(),
      title: cover.title || 'Featured cover',
      artist: 'B Side Radio',
      year: '2026',
      labelColor: '#B65151',
      remixedBy: 'Supabase',
      imageUrl: cover.image_url || '',
    }));

  const weeklyTracks = tracks
    .filter((track) => track.is_active !== false)
    .map((track) => ({
      title: track.title || 'Track',
      artist: 'B Side Radio',
      duration: '—',
      dj: 'Supabase',
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
    weekSchedule: [
      { day: 'Aujourd\'hui', dayEn: 'Today', shows: schedule.slice(0, 4) },
    ],
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
