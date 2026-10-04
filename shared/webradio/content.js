const RADIO_PROVIDER = import.meta.env?.VITE_RADIO_PROVIDER === 'azuracast' ? 'azuracast' : 'legacy';
const RADIO_ENDPOINTS = {
  legacy: {
    stream: '/api/radio/legacy/stream',
    nowPlaying: '/api/radio/legacy/status-json.xsl?mount=/stream',
  },
  azuracast: {
    stream: '/api/radio/azuracast/listen/bside_radio/radio.mp3',
    nowPlaying: '/api/radio/azuracast/api/nowplaying',
  },
};

export const STREAM_URL = RADIO_ENDPOINTS[RADIO_PROVIDER].stream;
export const NOW_PLAYING_URL = RADIO_ENDPOINTS[RADIO_PROVIDER].nowPlaying;

export function cleanSongText(value) {
  return String(value || '').replace(/\.[a-z0-9]{2,4}$/i, '').trim();
}

export function cleanTrackMetadata(value) {
  return cleanSongText(value).replace(/^(?:BSL|BSK|FZ|HT|ML|SKB|SKE|TOP|TT|WU)/, '').trimStart();
}

export function splitSongText(value) {
  return cleanSongText(value)
    .split(' - ')
    .map((part) => part.trim())
    .filter(Boolean);
}

export function findTraxsourceId(parts, fallbackText) {
  for (const part of parts) {
    const match = String(part || '').match(/\b(\d{5,})\b/);
    if (match) {
      return match[1];
    }
  }

  const fallbackMatch = String(fallbackText || '').match(/\b(\d{5,})\b/);
  return fallbackMatch ? fallbackMatch[1] : null;
}

export function getWebRadioStreamUrl() {
  return STREAM_URL;
}

export function getWebRadioNowPlayingUrl() {
  return NOW_PLAYING_URL;
}

export function getWebRadioProvider() {
  return RADIO_PROVIDER;
}

export function extractStation(nowPlayingResponse, fallbackStationId = 1) {
  if (!nowPlayingResponse) {
    return null;
  }

  if (Array.isArray(nowPlayingResponse) && nowPlayingResponse.length > 0) {
    return nowPlayingResponse.find((station) => Number(station?.station?.id ?? station?.id) === Number(fallbackStationId)) || nowPlayingResponse[0] || null;
  }

  if (Array.isArray(nowPlayingResponse.stations)) {
    return (
      nowPlayingResponse.stations.find((station) => Number(station?.station?.id ?? station?.id) === Number(fallbackStationId)) ||
      nowPlayingResponse.stations[0] ||
      null
    );
  }

  if (nowPlayingResponse.station) {
    const station = nowPlayingResponse.station;
    if (Number(station?.id ?? station?.station?.id) === Number(fallbackStationId)) {
      return nowPlayingResponse;
    }
  }

  return nowPlayingResponse;
}

export function normalizeNowPlayingPayload(payload, fallbackStationId = 1) {
  const icecastSource = payload?.icestats?.source;
  if (icecastSource) {
    const source = Array.isArray(icecastSource)
      ? icecastSource.find((item) => String(item?.listenurl || '').endsWith('/stream')) || icecastSource[0]
      : icecastSource;
    const metadata = String(source?.title || '').split(' - ').map((part) => part.trim());
    const [artist = '', title = '', comment = '', image = ''] = metadata;
    const trackTitle = cleanTrackMetadata(title);
    const trackArtist = cleanTrackMetadata(artist);
    const trackComment = cleanSongText(comment);
    const imageUrl = /^https?:\/\//i.test(image) ? image : '';
    const text = trackComment;

    return {
      stationId: fallbackStationId,
      stationName: source?.server_name || 'B Side Radio',
      artist: trackArtist,
      title: trackTitle,
      comment: trackComment,
      text,
      imageUrl,
      hasLiveTrack: Boolean(trackTitle && trackArtist),
      traxsourceId: findTraxsourceId([trackArtist, trackTitle, trackComment], source?.title),
      raw: payload,
    };
  }

  const station = extractStation(payload, fallbackStationId);
  const nowPlaying = station?.now_playing || station?.nowplaying || station?.live || payload?.now_playing || payload?.nowplaying || payload?.live || null;
  const track = nowPlaying?.song || nowPlaying?.track || nowPlaying || {};
  const rawText = track?.text || track?.subtitle || track?.title || track?.name || station?.text || nowPlaying?.text || '';
  const parts = splitSongText(rawText);
  const artistName = cleanTrackMetadata(track?.artist || track?.artist_name || track?.artiste || track?.artists?.[0]?.name || parts[0] || '');
  const title = cleanTrackMetadata(track?.title || track?.name || parts[1] || '');
  const traxsourceId = track?.traxsource_id || track?.traxsourceId || track?.id_traxsource || track?.idTraxsource || findTraxsourceId(parts, rawText);
  const text = traxsourceId ? [artistName, title, traxsourceId].filter(Boolean).join(' - ') : [artistName, title].filter(Boolean).join(' - ') || cleanSongText(rawText);
  const imageUrl = track?.art || track?.image || track?.cover || track?.album_art || nowPlaying?.art || nowPlaying?.image || station?.art || '';

  return {
    stationId: Number(station?.station?.id ?? station?.id ?? fallbackStationId),
    stationName: station?.station?.name || station?.name || '',
    artist: artistName,
    title,
    comment: track?.comment || nowPlaying?.comment || '',
    text,
    imageUrl,
    hasLiveTrack: Boolean(title && artistName),
    traxsourceId,
    raw: payload,
  };
}

export function buildTraxsourceText(track) {
  if (!track) {
    return '';
  }

  const parts = [track.artist, track.title, track.text].filter(Boolean);
  const baseText = parts.join(' - ');
  return track.traxsourceId ? `${baseText} [traxsource:${track.traxsourceId}]` : baseText;
}

function parseLegacyNowPlaying(responseText) {
  const normalized = responseText.replace(/,\s*([}\]])/g, '$1');

  try {
    return JSON.parse(normalized);
  } catch {
    const openingBraces = (normalized.match(/\{/g) || []).length;
    const closingBraces = (normalized.match(/\}/g) || []).length;
    const missingBraces = openingBraces - closingBraces;

    if (missingBraces < 1 || missingBraces > 2) {
      throw new Error('Legacy nowplaying response is malformed.');
    }

    return JSON.parse(`${normalized}${'}'.repeat(missingBraces)}`);
  }
}

export async function fetchWebRadioNowPlaying(fetchImpl = globalThis.fetch) {
  if (typeof fetchImpl !== 'function') {
    throw new Error('fetch is not available.');
  }

  const response = await fetchImpl(getWebRadioNowPlayingUrl(), {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Unable to load nowplaying (${response.status}).`);
  }

  const responseText = await response.text();
  let payload;

  try {
    payload = JSON.parse(responseText);
  } catch (error) {
    if (RADIO_PROVIDER !== 'legacy') {
      throw error;
    }
    payload = parseLegacyNowPlaying(responseText);
  }

  return normalizeNowPlayingPayload(payload, 1);
}
