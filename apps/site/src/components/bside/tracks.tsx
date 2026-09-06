import { useEffect, useRef, useState } from "react";
import { Pause, Play, ShoppingBag } from "lucide-react";
import { SectionManager } from "./section-manager";
import { usePlayer } from "@/components/player/player-context";
import { useI18n } from "@/lib/i18n";
import { useSiteContent } from "@/lib/siteContent";

function formatTrackDuration(seconds?: number) {
  if (!seconds || Number.isNaN(seconds)) {
    return "";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function readAudioDuration(src: string) {
  return new Promise<number | null>((resolve) => {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.onloadedmetadata = () => resolve(audio.duration);
    audio.onerror = () => resolve(null);
    audio.src = src;
  });
}

// Tracks section: playable weekly picks with a buy link.
export function Tracks() {
  const { playTrack } = usePlayer();
  const { t } = useI18n();
  const { weeklyTracks } = useSiteContent();
  const [durations, setDurations] = useState<Record<string, number>>({});
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const trackAudioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  useEffect(() => {
    let cancelled = false;

    async function loadDurations() {
      const entries = await Promise.all(
        weeklyTracks.map(async (track, index) => [`track-${index}`, track.src ? await readAudioDuration(track.src) : null] as const),
      );

      if (!cancelled) {
        setDurations(Object.fromEntries(entries.filter(([, duration]) => duration !== null)));
      }
    }

    loadDurations();

    return () => {
      cancelled = true;
    };
  }, [weeklyTracks]);

  function playLocalTrack(id: string, track: (typeof weeklyTracks)[number]) {
    const currentAudio = trackAudioRefs.current[id];

    if (playingTrackId === id) {
      currentAudio?.pause();
      return;
    }

    playTrack({ id, title: track.title, artist: track.artist, src: track.src });
    setActiveTrackId(id);

    Object.entries(trackAudioRefs.current).forEach(([audioId, audio]) => {
      if (audioId !== id) audio?.pause();
    });

    requestAnimationFrame(() => {
      void trackAudioRefs.current[id]?.play();
    });
  }

  return (
    <SectionManager id="tracks" index="03" title={t("tracks.title")} kicker={t("tracks.kicker")} tone="surface">
      {/* Tracks grid */}
      <ul className="grid gap-3 md:grid-cols-2">
        {weeklyTracks.map((track, index) => {
          const id = `track-${index}`;
          const active = playingTrackId === id;
          const hasBuyLink = track.buyUrl.trim() !== "";
          return (
            /* Track card */
            <li
              key={id}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-border bg-background p-4 transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[0_14px_30px_-20px_rgba(0,0,0,0.45)]"
            >
              {/* Play button */}
              <button
                type="button"
                onClick={() => playLocalTrack(id, track)}
                aria-label={`${active ? t("player.pause") : t("tracks.listen")} ${track.title}`}
                className="grid size-11 shrink-0 place-items-center rounded-full border border-primary text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {active ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
              </button>

              {/* Track text */}
              <div className="min-w-0">
                <p className="truncate font-display text-xl leading-tight">{track.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {track.artist} · {formatTrackDuration(durations[id]) || track.duration}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-primary">
                  {t("tracks.reco")} {track.dj}
                </p>
                {activeTrackId === id && track.src && (
                  <audio
                    ref={(audio) => {
                      trackAudioRefs.current[id] = audio;
                    }}
                    className="mt-3 h-8 w-full max-w-sm"
                    controls
                    preload="metadata"
                    src={track.src}
                    onPlay={() => setPlayingTrackId(id)}
                    onPause={() => setPlayingTrackId((current) => (current === id ? null : current))}
                    onEnded={() => setPlayingTrackId(null)}
                    aria-label={`${t("tracks.listen")} ${track.title}`}
                  />
                )}
              </div>

              {/* Buy link */}
              {hasBuyLink ? (
                <a
                  href={track.buyUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${t("tracks.buy")} ${track.title}`}
                  className="grid size-10 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <ShoppingBag className="size-4" />
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  aria-label={`${t("tracks.buy")} ${track.title}`}
                  className="grid size-10 shrink-0 cursor-not-allowed place-items-center rounded-full border border-border/60 text-muted-foreground/35"
                >
                  <ShoppingBag className="size-4" />
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </SectionManager>
  );
}
