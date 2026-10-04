declare module '@shared/supabase/content.js' {
  export function submitComment(input: { authorName: string; body: string; email?: string }): Promise<void>;
  export function likeComment(commentId: number | string): Promise<number | null>;
  export function unlikeComment(commentId: number | string): Promise<number | null>;

  export function fetchPublicContent(): Promise<{
    shows: any[];
    slots: any[];
    shows_slots: any[];
    covers: any[];
    mixSessions: any[];
    videos: any[];
    comments: any[];
  }>;

  export function mapSupabaseContentToSiteModel(input: any): {
    shows: any[];
    schedule: any[];
    weekSchedule: any[];
    vinyls: any[];
    mixSessions: any[];
    replays: any[];
    videos: any[];
    nowPlaying: any;
  };
}

declare module '@shared/webradio/index.js' {
  export function getWebRadioStreamUrl(): string;
  export function getWebRadioNowPlayingUrl(): string;
  export function getWebRadioProvider(): "legacy" | "azuracast";
  export function buildTraxsourceText(track: any): string;
  export function fetchWebRadioNowPlaying(): Promise<{
    stationId?: number;
    stationName?: string;
    artist?: string;
    title?: string;
    comment?: string;
    text?: string;
    imageUrl?: string;
    hasLiveTrack?: boolean;
    traxsourceId?: string | number | null;
    raw?: unknown;
  }>;
}
