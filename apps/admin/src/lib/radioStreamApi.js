// Reusable radio stream API helpers for now-playing data.
// Exposes base endpoints plus normalized parsing for station/song metadata.
// Designed to be shared by admin and public site components.
import { normalizeNowPlayingPayload, parseLegacyNowPlayingResponse } from '../../../../shared/webradio/content.js';

const RADIO_PROXY_BASE = String(import.meta.env?.VITE_RADIO_API_BASE_URL || '/api/radio/legacy').replace(/\/$/, '');

export const RADIO_BASE_URL = RADIO_PROXY_BASE;
export const RADIO_NOW_PLAYING_URL = `${RADIO_PROXY_BASE}/status-json.xsl?mount=/stream`;
export const RADIO_AUDIO_URL = `${RADIO_PROXY_BASE}/stream`;

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

  const responseText = await response.text();
  try {
    return JSON.parse(responseText);
  } catch {
    return parseLegacyNowPlayingResponse(responseText);
  }
}

export function getPrimaryNowPlayingStation(payload) {
  if (Array.isArray(payload)) {
    return payload[0] || null;
  }
  return payload || null;
}

export function parseNowPlayingInfo(payload) {
  const station = getPrimaryNowPlayingStation(payload);
  const normalized = normalizeNowPlayingPayload(payload);

  return {
    title: normalized.title || 'Unknown title',
    artist: normalized.artist || 'Unknown Artist',
    displayText: normalized.text || `${normalized.title} - ${normalized.artist}`,
    isLive: normalized.hasLiveTrack,
    stationName: String(station?.station?.name || '').trim(),
    streamUrl: String(station?.station?.listen_url || RADIO_AUDIO_URL).trim() || RADIO_AUDIO_URL,
    artworkUrl: normalized.imageUrl
  };
}

export async function fetchNowPlayingInfo(fetchImpl = fetch) {
  const payload = await fetchNowPlayingPayload(fetchImpl);
  return parseNowPlayingInfo(payload);
}
