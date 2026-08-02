// Small typed bridge to the shared radio helpers used by the public site.
// Keep this file tiny: it only adapts the shared JS module for TypeScript.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - shared JS module has no TypeScript declarations
import * as webRadioModule from '@shared/webradio/index.js';

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

export const getRadioStreamUrl = webRadioModule.getWebRadioStreamUrl as () => string;
export const buildRadioText = webRadioModule.buildTraxsourceText as (track: unknown) => string;
export const fetchRadioNowPlaying = webRadioModule.fetchWebRadioNowPlaying as () => Promise<LiveNowPlaying>;