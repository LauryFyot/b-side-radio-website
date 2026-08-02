// Central content store for the public site.
// This file keeps all site-facing data flow in one place:
// fallback content, Supabase fetch, radio now playing, then React context.
import { createContext, createElement, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
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
import { fetchPublicContent, mapSupabaseContentToSiteModel } from '@shared/supabase/content.js';
import { buildRadioText, fetchRadioNowPlaying, type LiveNowPlaying } from '@/lib/radio';

type SupabaseCommentRow = {
  author_name?: string | null;
  body?: string | null;
  created_at?: string | null;
};

export type SiteComment = {
  name: string;
  message: string;
  at: string;
  atEn: string;
};

export const fallbackContent = {
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

export type SiteContent = typeof fallbackContent;

function mapComments(comments: unknown): SiteComment[] {
  if (!Array.isArray(comments)) {
    return [];
  }

  return comments.map((comment) => {
    const row: SupabaseCommentRow = (comment ?? {}) as SupabaseCommentRow;

    return {
      name: String(row.author_name || 'Anonymous'),
      message: String(row.body || ''),
      at: String(row.created_at || ''),
      atEn: String(row.created_at || ''),
    };
  });
}

function mergeNowPlaying(baseNowPlaying: SiteContent['nowPlaying'], liveNowPlaying: LiveNowPlaying | null) {
  if (!liveNowPlaying) {
    return baseNowPlaying;
  }

  const liveText = liveNowPlaying.text || buildRadioText(liveNowPlaying);

  return {
    ...baseNowPlaying,
    title: liveNowPlaying.title || baseNowPlaying.title,
    artist: liveNowPlaying.artist || baseNowPlaying.artist,
    original: liveText || baseNowPlaying.original,
    buyUrl: baseNowPlaying.buyUrl,
    imageUrl: liveNowPlaying.imageUrl || baseNowPlaying.imageUrl,
    text: liveText,
    traxsourceId: liveNowPlaying.traxsourceId ?? undefined,
    stationId: liveNowPlaying.stationId,
  };
}

function hasLiveDatabaseContent(mapped: ReturnType<typeof mapSupabaseContentToSiteModel>, comments: unknown) {
  return [
    mapped.schedule.length,
    mapped.vinyls.length,
    mapped.weeklyTracks.length,
    mapped.mixSessions.length,
    mapped.videos.length,
    Array.isArray(comments) ? comments.length : 0,
  ].some((count) => count > 0);
}

async function loadSiteContent() {
  const [publicContent, liveNowPlaying] = await Promise.all([
    fetchPublicContent(),
    fetchRadioNowPlaying().catch((error) => {
      console.warn('Unable to load live nowplaying from the radio API.', error);
      return null;
    }),
  ]);

  const mappedContent = mapSupabaseContentToSiteModel(publicContent);

  if (!hasLiveDatabaseContent(mappedContent, publicContent.comments)) {
    return {
      ...fallbackContent,
      nowPlaying: mergeNowPlaying(fallbackContent.nowPlaying, liveNowPlaying),
    };
  }

  return {
    schedule: mappedContent.schedule.length ? mappedContent.schedule : fallbackContent.schedule,
    weekSchedule: mappedContent.weekSchedule.length ? mappedContent.weekSchedule : fallbackContent.weekSchedule,
    vinyls: mappedContent.vinyls.length ? mappedContent.vinyls : fallbackContent.vinyls,
    weeklyTracks: mappedContent.weeklyTracks.length ? mappedContent.weeklyTracks : fallbackContent.weeklyTracks,
    mixSessions: mappedContent.mixSessions.length ? mappedContent.mixSessions : fallbackContent.mixSessions,
    videos: mappedContent.videos.length ? mappedContent.videos : fallbackContent.videos,
    comments: mapComments(publicContent.comments),
    nowPlaying: mergeNowPlaying(mappedContent.nowPlaying, liveNowPlaying),
    nextUp: fallbackContent.nextUp,
  };
}

const SiteContentContext = createContext<SiteContent>(fallbackContent);

// Load site content once, then expose it to all sections through React context.
export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(fallbackContent);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const nextContent = await loadSiteContent();
        if (cancelled) return;
        setContent(nextContent);
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
