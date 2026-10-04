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
