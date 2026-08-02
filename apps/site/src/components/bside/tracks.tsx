import { Pause, Play, ShoppingBag } from "lucide-react";
import { SectionManager } from "./section-manager";
import { usePlayer } from "@/components/player/player-context";
import { useI18n } from "@/lib/i18n";
import { useSiteContent } from "@/lib/siteContent";

// Tracks section: playable weekly picks with a buy link.
export function Tracks() {
  const { playTrack, isCurrent, playing } = usePlayer();
  const { t } = useI18n();
  const { weeklyTracks } = useSiteContent();

  return (
    <SectionManager id="tracks" index="03" title={t("tracks.title")} kicker={t("tracks.kicker")} tone="surface">
      <ul className="grid gap-3 md:grid-cols-2">
        {weeklyTracks.map((track, index) => {
          const id = `track-${index}`;
          const active = isCurrent(id) && playing;
          return (
            <li
              key={id}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-border bg-background p-4 transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[0_14px_30px_-20px_rgba(0,0,0,0.45)]"
            >
              <button
                type="button"
                onClick={() => playTrack({ id, title: track.title, artist: track.artist, src: track.src })}
                aria-label={`${active ? t("player.pause") : t("tracks.listen")} ${track.title}`}
                className="grid size-11 shrink-0 place-items-center rounded-full border border-primary text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {active ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
              </button>
              <div className="min-w-0">
                <p className="truncate font-display text-xl leading-tight">{track.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {track.artist} · {track.duration}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-primary">
                  {t("tracks.reco")} {track.dj}
                </p>
              </div>
              <a
                href={track.buyUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${t("tracks.buy")} ${track.title}`}
                className="grid size-10 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <ShoppingBag className="size-4" />
              </a>
            </li>
          );
        })}
      </ul>
    </SectionManager>
  );
}
