export function fetchPublicContent(): Promise<{
  shows: any[];
  slots: any[];
  shows_slots: any[];
  covers: any[];
  tracks: any[];
  videos: any[];
  comments: any[];
}>;

export function mapSupabaseContentToSiteModel(input: any): {
  shows: any[];
  schedule: any[];
  weekSchedule: any[];
  vinyls: any[];
  weeklyTracks: any[];
  mixSessions: any[];
  videos: any[];
  nowPlaying: any;
};
