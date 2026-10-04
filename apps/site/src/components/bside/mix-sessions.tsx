import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { SectionManager } from "./section-manager";
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

export function MixSessions() {
  const { t } = useI18n();
  const { mixSessions } = useSiteContent();
  const [durations, setDurations] = useState<Record<string, number>>({});
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const trackAudioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  useEffect(() => {
    let cancelled = false;

    async function loadDurations() {
      const entries = await Promise.all(
        mixSessions.map(async (mix, index) => [`mix-${index}`, mix.src?.trim() ? await readAudioDuration(mix.src) : null] as const),
      );

      if (!cancelled) {
        const validEntries = entries.filter(
          (entry): entry is readonly [`mix-${number}`, number] => entry[1] !== null,
        );
        setDurations(Object.fromEntries(validEntries));
      }
    }

    loadDurations();

    return () => {
      cancelled = true;
    };
  }, [mixSessions]);

  function playLocalMix(id: string) {
    const currentAudio = trackAudioRefs.current[id];

    if (playingTrackId === id && activeTrackId === id) {
      currentAudio?.pause();
      return;
    }

    Object.entries(trackAudioRefs.current).forEach(([audioId, audio]) => {
      if (audioId !== id) audio?.pause();
    });

    setActiveTrackId(id);
    requestAnimationFrame(() => {
      void trackAudioRefs.current[id]?.play();
    });
  }

  return (
    <SectionManager
      id="mix-sessions"
      index="03"
      title={t("mixSessions.title")}
      kicker={t("mixSessions.kicker")}
      tone="surface"
      panelClassName="!bg-white !text-[#222]"
    >
      <ul className="grid gap-3 md:grid-cols-2">
        {mixSessions.map((mix, index) => {
          if (!mix.src?.trim()) return null;

          const id = `mix-${index}`;
          const active = playingTrackId === id && activeTrackId === id;

          return (
            <li
              key={id}
              className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 rounded-2xl border border-border bg-background p-4 transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[0_14px_30px_-20px_rgba(0,0,0,0.45)]"
            >
              <button
                type="button"
                onClick={() => playLocalMix(id)}
                aria-label={`${active ? t("player.pause") : t("mixSessions.listen")} ${mix.title}`}
                className="grid size-11 shrink-0 place-items-center rounded-full border border-primary text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {active ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
              </button>

              <div className="min-w-0">
                <p className="truncate font-display text-xl leading-tight">{mix.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {mix.artist} · {formatTrackDuration(durations[id]) || mix.duration}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-primary">
                  {t("mixSessions.reco")} {mix.dj}
                </p>
                {activeTrackId === id && (
                  <audio
                    ref={(audio) => {
                      trackAudioRefs.current[id] = audio;
                    }}
                    className="mt-3 h-8 w-full max-w-sm"
                    controls
                    preload="metadata"
                    src={mix.src}
                    onPlay={() => setPlayingTrackId(id)}
                    onPause={() => setPlayingTrackId((current) => (current === id ? null : current))}
                    onEnded={() => setPlayingTrackId(null)}
                    aria-label={`${t("mixSessions.listen")} ${mix.title}`}
                  />
                )}
              </div>

            </li>
          );
        })}
      </ul>
    </SectionManager>
  );
}