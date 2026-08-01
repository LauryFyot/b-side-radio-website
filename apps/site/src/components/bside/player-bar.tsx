import { Pause, Play, ShoppingBag, Radio, Volume2 } from "lucide-react";
import { usePlayer } from "./player-context";
import { nextUp, nowPlaying } from "@/lib/bside-data";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

function Equalizer({ active }: { active: boolean }) {
  return (
    <div className="flex h-5 items-end gap-[3px]" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-[3px] origin-bottom bg-primary"
          style={{
            height: "100%",
            animation: active ? `eq-bar ${0.6 + i * 0.15}s ease-in-out infinite` : undefined,
            transform: active ? undefined : "scaleY(0.2)",
          }}
        />
      ))}
    </div>
  );
}

export function PlayerBar() {
  const { audioRef, playing, source, toggleLive, setPlaying } = usePlayer();
  const [volume, setVolume] = useState(0.8);
  const { t } = useI18n();

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume, audioRef]);

  const isLive = source.kind === "live";
  const title = isLive ? nowPlaying.title : source.title;
  const artist = isLive ? nowPlaying.artist : source.artist;

  return (
    <>
      <audio
        ref={audioRef}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <div className="fixed inset-x-0 bottom-0 z-50 px-2 pb-2 sm:px-4 sm:pb-4">
        <div className="mx-auto grid max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-3xl border border-border bg-surface/95 px-3 py-2.5 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.35)] backdrop-blur-md sm:gap-5 sm:px-6 sm:py-3">
          <button
            type="button"
            onClick={toggleLive}
            aria-label={playing ? t("player.pause") : t("player.play")}
            className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-95 sm:size-14"
          >
            {playing ? <Pause className="size-5 fill-current" /> : <Play className="size-5 translate-x-[1px] fill-current" />}
          </button>

          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                <Radio className="size-3" />
                {isLive ? t("player.onair") : t("player.replay")}
              </span>
              <Equalizer active={playing} />
            </div>
            <p className="truncate font-display text-lg leading-tight tracking-wide sm:text-xl">{title}</p>
            <p className="truncate text-xs text-muted-foreground">
              {artist}
              {isLive && <span className="hidden sm:inline"> — {t("player.next")} : {nextUp.title}</span>}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <label className="hidden items-center gap-2 lg:flex">
              <Volume2 className="size-4 text-muted-foreground" />
              <span className="sr-only">{t("player.volume")}</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="h-1 w-24 accent-primary"
              />
            </label>
            <a
              href={nowPlaying.buyUrl}
              target="_blank"
              rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors hover:border-primary hover:text-primary"
            >
              <ShoppingBag className="size-3.5" />
              <span className="hidden sm:inline">{t("player.buy")}</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}