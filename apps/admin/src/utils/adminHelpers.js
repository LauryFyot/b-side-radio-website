export function toTimeInput(value) {
  if (!value) {
    return '';
  }
  return String(value).slice(0, 5);
}

export function toSlug(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatDuration(seconds) {
  const totalSeconds = Number(seconds);
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
    return '';
  }

  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = Math.round(totalSeconds % 60)
    .toString()
    .padStart(2, '0');

  return `${minutes}:${remainingSeconds}`;
}

export function extractYouTubeId(value) {
  const url = String(value || '').trim();
  if (url === '') {
    return '';
  }

  const patterns = [
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
    /[?&]v=([A-Za-z0-9_-]{11})/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return '';
}

export function getYouTubeEmbedUrl(value) {
  const videoId = extractYouTubeId(value);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
}

export function isDbId(value) {
  return Number.isInteger(value) || (typeof value === 'number' && Number.isFinite(value));
}

export function getMediaItemKey(item) {
  return item.id == null ? `draft-${item.draft_key}` : `saved-${item.id}`;
}

export function reorderMediaItems(items, activeKey, overKey) {
  const from = items.findIndex((item) => getMediaItemKey(item) === activeKey);
  const to = items.findIndex((item) => getMediaItemKey(item) === overKey);
  if (from < 0 || to < 0 || from === to) return items;
  const reordered = [...items];
  const [moved] = reordered.splice(from, 1);
  reordered.splice(to, 0, moved);
  return reordered.map((item, sort_order) => ({ ...item, sort_order }));
}

export function prependMediaItem(items, item) {
  return [item, ...items].map((entry, sort_order) => ({ ...entry, sort_order }));
}
