// Reusable radio stream API helpers for now-playing data.
// Exposes base endpoints plus normalized parsing for station/song metadata.
// Designed to be shared by admin and public site components.
export const RADIO_BASE_URL = 'http://51.91.124.240';
export const RADIO_NOW_PLAYING_URL = `${RADIO_BASE_URL}/api/nowplaying`;
export const RADIO_AUDIO_URL = `${RADIO_BASE_URL}/listen/bside_radio/radio.mp3`;

export function getRadioEndpoints() {
  return {
    baseUrl: RADIO_BASE_URL,
    nowPlayingUrl: RADIO_NOW_PLAYING_URL,
    audioUrl: RADIO_AUDIO_URL
  };
}

export async function fetchNowPlayingPayload(fetchImpl = fetch) {
  const response = await fetchImpl(RADIO_NOW_PLAYING_URL);
  if (!response.ok) {
    throw new Error(`Now playing HTTP ${response.status}`);
  }

  return response.json();
}

export function getPrimaryNowPlayingStation(payload) {
  if (Array.isArray(payload)) {
    return payload[0] || null;
  }
  return payload || null;
}

export function parseNowPlayingInfo(payload) {
  const station = getPrimaryNowPlayingStation(payload);
  const song = station?.now_playing?.song;

  const text = String(song?.text || '').trim() || 'Unknown title';
  const parts = text.split(' - ');
  const artist = parts[0] || 'Unknown Artist';
  const title = parts[1] || 'Unknown Title';
  const id_traxsource = parts[2] || '';
  const cover_path = parts[3] || '';

  return {
    title,
    artist,
    displayText: `${title} - ${artist}`,
    isLive: station?.live?.is_live === true,
    stationName: String(station?.station?.name || '').trim(),
    streamUrl: String(station?.station?.listen_url || RADIO_AUDIO_URL).trim() || RADIO_AUDIO_URL,
    artworkUrl: String(song?.art || '').trim()
  };
}

export async function fetchNowPlayingInfo(fetchImpl = fetch) {
  const payload = await fetchNowPlayingPayload(fetchImpl);
  return parseNowPlayingInfo(payload);
}
