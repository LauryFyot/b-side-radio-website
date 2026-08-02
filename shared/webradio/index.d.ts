export type LiveNowPlaying = {
  stationId?: number;
  stationName?: string;
  artist?: string;
  title?: string;
  text?: string;
  imageUrl?: string;
  traxsourceId?: string | number | null;
  raw?: unknown;
};

export function getWebRadioStreamUrl(): string;
export function getWebRadioNowPlayingUrl(): string;
export function buildTraxsourceText(track: unknown): string;
export function fetchWebRadioNowPlaying(): Promise<LiveNowPlaying>;
export function normalizeNowPlayingPayload(payload: unknown, fallbackStationId?: number): LiveNowPlaying;
export function extractStation(nowPlayingResponse: unknown, fallbackStationId?: number): unknown;
