// Central content store for the public site.
// This file keeps all site-facing data flow in one place:
// fallback content, Supabase fetch, radio now playing, then React context.
import { createContext, createElement, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  replays as fallbackReplays,
  nextUp as fallbackNextUp,
  nowPlaying as fallbackNowPlaying,
  schedule as fallbackSchedule,
  vinyls as fallbackVinyls,
  weekSchedule as fallbackWeekSchedule,
  mixSessions as fallbackMixSessions,
  videos as fallbackVideos,
} from '@/lib/bside-data';
import { fetchPublicContent, mapSupabaseContentToSiteModel } from '@shared/supabase/content.js';
import { buildRadioText, fetchRadioNowPlaying, type LiveNowPlaying } from '@/lib/radio';

const NOW_PLAYING_REFRESH_INTERVAL_MS = 20_000;

type SupabaseCommentRow = {
  id?: number | string | null;
  author_name?: string | null;
  body?: string | null;
  created_at?: string | null;
  likes_count?: number | null;
};

export type SiteComment = {
  id: string;
  name: string;
  message: string;
  at: string;
  atEn: string;
  likes: number;
};

export const fallbackContent = {
  schedule: fallbackSchedule,
  weekSchedule: fallbackWeekSchedule,
  vinyls: fallbackVinyls,
  mixSessions: fallbackMixSessions,
  replays: fallbackReplays,
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
      id: String(row.id ?? ''),
      name: String(row.author_name || 'Anonymous'),
      message: String(row.body || ''),
      at: String(row.created_at || ''),
      atEn: String(row.created_at || ''),
      likes: Number(row.likes_count) || 0,
    };
  });
}

function mergeNowPlaying(baseNowPlaying: SiteContent['nowPlaying'], liveNowPlaying: LiveNowPlaying | null) {
  if (!liveNowPlaying) {
    return baseNowPlaying;
  }

  const hasLiveTrack = Boolean(liveNowPlaying.hasLiveTrack);
  const liveText = liveNowPlaying.text || buildRadioText(liveNowPlaying);

  return {
    ...baseNowPlaying,
    title: hasLiveTrack ? liveNowPlaying.title || '' : '',
    artist: hasLiveTrack ? liveNowPlaying.artist || '' : '',
    comment: hasLiveTrack ? liveNowPlaying.comment || '' : '',
    original: hasLiveTrack ? liveText : '',
    buyUrl: baseNowPlaying.buyUrl,
    imageUrl: hasLiveTrack ? liveNowPlaying.imageUrl || '' : '',
    text: hasLiveTrack ? liveText : '',
    hasLiveTrack,
    traxsourceId: liveNowPlaying.traxsourceId ?? undefined,
    stationId: liveNowPlaying.stationId,
  };
}

function hasLiveDatabaseContent(mapped: ReturnType<typeof mapSupabaseContentToSiteModel>, comments: unknown) {
  return [
    mapped.schedule.length,
    mapped.vinyls.length,
    mapped.mixSessions.length,
    mapped.replays.length,
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
    mixSessions: mappedContent.mixSessions.length ? mappedContent.mixSessions : fallbackContent.mixSessions,
    replays: mappedContent.replays.length ? mappedContent.replays : fallbackContent.replays,
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

    async function refreshNowPlaying() {
      try {
        const liveNowPlaying = await fetchRadioNowPlaying();
        if (cancelled) return;
        setContent((current) => ({
          ...current,
          nowPlaying: mergeNowPlaying(current.nowPlaying, liveNowPlaying),
        }));
      } catch {
        if (cancelled) return;
        setContent((current) => ({
          ...current,
          nowPlaying: {
            ...current.nowPlaying,
            title: '',
            artist: '',
            comment: '',
            original: '',
            imageUrl: '',
            text: '',
            hasLiveTrack: false,
          },
        }));
      }
    }

    load();
    const timer = window.setInterval(() => void refreshNowPlaying(), NOW_PLAYING_REFRESH_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  const value = useMemo(() => content, [content]);
  return createElement(SiteContentContext.Provider, { value }, children);
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
