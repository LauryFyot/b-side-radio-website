import { Pause, Play } from "lucide-react";
import { SectionManager } from "./section-manager";
import { usePlayer } from "@/components/player/player-context";
import { useI18n } from "@/lib/i18n";
import { useSiteContent } from "@/lib/siteContent";

export function Replays() {
  const { playTrack, isCurrent, playing } = usePlayer();
  const { t } = useI18n();
  const { replays } = useSiteContent();

  return (
    <SectionManager id="replays" index="04" title={t("replays.title")} kicker={t("replays.kicker")}>
      <div className="grid gap-5 md:grid-cols-3">
        {replays.map((replay, index) => {
          const id = `replay-${index}`;
          const active = isCurrent(id) && playing;
          return (
            <article
              key={id}
              className="flex flex-col justify-between rounded-3xl border border-border bg-surface p-6 transition-transform hover:-translate-y-1"
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">{replay.style}</p>
                <h3 className="mt-3 text-3xl leading-none">{replay.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {replay.dj} · {replay.length}
                </p>
              </div>
              <button
                type="button"
                onClick={() => playTrack({ id, title: replay.name, artist: replay.dj, src: replay.src })}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-primary-foreground transition-transform active:scale-[0.98]"
              >
                {active ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
                {active ? t("replays.playing") : t("replays.play")}
              </button>
            </article>
          );
        })}
      </div>
    </SectionManager>
  );
}