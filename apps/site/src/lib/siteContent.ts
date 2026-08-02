import { useEffect, useState } from 'react';
import { fetchPublicContent, mapSupabaseContentToSiteModel } from '../../../../shared/supabase/content.js';
import {
  mixSessions as fallbackMixSessions,
  nextUp as fallbackNextUp,
  nowPlaying as fallbackNowPlaying,
  schedule as fallbackSchedule,
  vinyls as fallbackVinyls,
  weekSchedule as fallbackWeekSchedule,
  weeklyTracks as fallbackWeeklyTracks,
  videos as fallbackVideos,
} from '@/lib/bside-data';

export function useSiteContent() {
  const [content, setContent] = useState(() => ({
    schedule: fallbackSchedule,
    weekSchedule: fallbackWeekSchedule,
    vinyls: fallbackVinyls,
    weeklyTracks: fallbackWeeklyTracks,
    mixSessions: fallbackMixSessions,
    videos: fallbackVideos,
    nowPlaying: fallbackNowPlaying,
    nextUp: fallbackNextUp,
  }));

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await fetchPublicContent();
        if (cancelled) return;

        const mapped = mapSupabaseContentToSiteModel(result);
        const hasSupabaseContent = [
          mapped.schedule.length,
          mapped.vinyls.length,
          mapped.weeklyTracks.length,
          mapped.mixSessions.length,
          mapped.videos.length,
        ].some((count) => count > 0);

        if (!hasSupabaseContent) {
          return;
        }

        setContent({
          schedule: mapped.schedule.length ? mapped.schedule : fallbackSchedule,
          weekSchedule: mapped.weekSchedule.length ? mapped.weekSchedule : fallbackWeekSchedule,
          vinyls: mapped.vinyls.length ? mapped.vinyls : fallbackVinyls,
          weeklyTracks: mapped.weeklyTracks.length ? mapped.weeklyTracks : fallbackWeeklyTracks,
          mixSessions: mapped.mixSessions.length ? mapped.mixSessions : fallbackMixSessions,
          videos: mapped.videos.length ? mapped.videos : fallbackVideos,
          nowPlaying: mapped.nowPlaying,
          nextUp: fallbackNextUp,
        });
      } catch (error) {
        console.warn('Unable to load site content from Supabase.', error);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return content;
}
