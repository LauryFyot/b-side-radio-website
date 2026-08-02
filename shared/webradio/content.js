const RADIO_API_BASE = 'http://51.91.124.240';

export const STREAM_URL = `${RADIO_API_BASE}/listen/bside_radio/radio.mp3`;
export const NOW_PLAYING_URL = `${RADIO_API_BASE}/api/nowplaying`;

export function cleanSongText(value) {
  return String(value || '').replace(/\.[a-z0-9]{2,4}$/i, '').trim();
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
  const station = extractStation(payload, fallbackStationId);
  const nowPlaying = station?.now_playing || station?.nowplaying || station?.live || payload?.now_playing || payload?.nowplaying || payload?.live || null;
  const track = nowPlaying?.song || nowPlaying?.track || nowPlaying || {};
  const rawText = track?.text || track?.subtitle || track?.title || track?.name || station?.text || nowPlaying?.text || '';
  const parts = splitSongText(rawText);
  const artistName = parts[0] || track?.artist || track?.artist_name || track?.artiste || track?.artists?.[0]?.name || '';
  const title = parts[1] || track?.name || track?.title || '';
  const traxsourceId = track?.traxsource_id || track?.traxsourceId || track?.id_traxsource || track?.idTraxsource || findTraxsourceId(parts, rawText);
  const text = traxsourceId ? [artistName, title, traxsourceId].filter(Boolean).join(' - ') : [artistName, title].filter(Boolean).join(' - ') || cleanSongText(rawText);
  const imageUrl = track?.art || track?.image || track?.cover || track?.album_art || nowPlaying?.art || nowPlaying?.image || station?.art || '';

  return {
    stationId: Number(station?.station?.id ?? station?.id ?? fallbackStationId),
    stationName: station?.station?.name || station?.name || '',
    artist: artistName,
    title,
    text,
    imageUrl,
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

  const payload = await response.json();
  return normalizeNowPlayingPayload(payload, 1);
}
