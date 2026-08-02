import { createContext, createElement, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { fetchPublicContent, mapSupabaseContentToSiteModel } from '../../../../shared/supabase/content.js';
import { buildTraxsourceText, fetchWebRadioNowPlaying } from '../../../../shared/webradio/index.js';
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

type SiteComment = {
  name: string;
  message: string;
  at: string;
  atEn: string;
};

const fallbackContent = {
  schedule: fallbackSchedule,
  weekSchedule: fallbackWeekSchedule,
  vinyls: fallbackVinyls,
  weeklyTracks: fallbackWeeklyTracks,
  mixSessions: fallbackMixSessions,
  videos: fallbackVideos,
  comments: [] as SiteComment[],
  nowPlaying: fallbackNowPlaying,
  nextUp: fallbackNextUp,
};

type SiteContent = typeof fallbackContent;

const SiteContentContext = createContext<SiteContent>(fallbackContent);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(fallbackContent);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [result, liveNowPlaying] = await Promise.all([
          fetchPublicContent(),
          fetchWebRadioNowPlaying().catch((error) => {
            console.warn('Unable to load live nowplaying from the web radio API.', error);
            return null;
          }),
        ]);
        if (cancelled) return;

        const mapped = mapSupabaseContentToSiteModel(result);
        const hasSupabaseContent = [
          mapped.schedule.length,
          mapped.vinyls.length,
          mapped.weeklyTracks.length,
          mapped.mixSessions.length,
          mapped.videos.length,
          result.comments?.length ?? 0,
        ].some((count) => count > 0);

        if (!hasSupabaseContent) {
          setContent((current) => ({
            ...current,
            nowPlaying: liveNowPlaying
              ? {
                  ...fallbackNowPlaying,
                  title: liveNowPlaying.title || fallbackNowPlaying.title,
                  artist: liveNowPlaying.artist || fallbackNowPlaying.artist,
                  original: liveNowPlaying.text || buildTraxsourceText(liveNowPlaying) || fallbackNowPlaying.original,
                  buyUrl: fallbackNowPlaying.buyUrl,
                  imageUrl: liveNowPlaying.imageUrl || fallbackNowPlaying.imageUrl,
                  text: liveNowPlaying.text || buildTraxsourceText(liveNowPlaying),
                  traxsourceId: liveNowPlaying.traxsourceId,
                  stationId: liveNowPlaying.stationId,
                }
              : current.nowPlaying,
          }));
          return;
        }

        setContent({
          schedule: mapped.schedule.length ? mapped.schedule : fallbackSchedule,
          weekSchedule: mapped.weekSchedule.length ? mapped.weekSchedule : fallbackWeekSchedule,
          vinyls: mapped.vinyls.length ? mapped.vinyls : fallbackVinyls,
          weeklyTracks: mapped.weeklyTracks.length ? mapped.weeklyTracks : fallbackWeeklyTracks,
          mixSessions: mapped.mixSessions.length ? mapped.mixSessions : fallbackMixSessions,
          videos: mapped.videos.length ? mapped.videos : fallbackVideos,
          comments: Array.isArray(result.comments)
            ? result.comments.map((comment) => ({
                name: String(comment.author_name || 'Anonymous'),
                message: String(comment.body || ''),
                at: String(comment.created_at || ''),
                atEn: String(comment.created_at || ''),
              }))
            : [],
          nowPlaying: liveNowPlaying
            ? {
                ...mapped.nowPlaying,
                title: liveNowPlaying.title || mapped.nowPlaying.title,
                artist: liveNowPlaying.artist || mapped.nowPlaying.artist,
                original: liveNowPlaying.text || buildTraxsourceText(liveNowPlaying) || mapped.nowPlaying.original,
                buyUrl: mapped.nowPlaying.buyUrl,
                imageUrl: liveNowPlaying.imageUrl || mapped.nowPlaying.imageUrl,
                text: liveNowPlaying.text || buildTraxsourceText(liveNowPlaying),
                traxsourceId: liveNowPlaying.traxsourceId,
                stationId: liveNowPlaying.stationId,
              }
            : mapped.nowPlaying,
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

  const value = useMemo(() => content, [content]);
  return createElement(SiteContentContext.Provider, { value }, children);
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
