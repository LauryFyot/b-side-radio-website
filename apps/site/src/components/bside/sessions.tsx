import { Pause, Play } from "lucide-react";
import { SectionManager } from "./section-manager";
import { usePlayer } from "@/components/player/player-context";
import { useI18n } from "@/lib/i18n";
import { useSiteContent } from "@/lib/siteContent";

// Sessions section: longer mixes with a dedicated play button.
export function Sessions() {
  const { playTrack, isCurrent, playing } = usePlayer();
  const { t } = useI18n();
  const { mixSessions } = useSiteContent();

  return (
    <SectionManager id="sessions" index="04" title={t("sessions.title")} kicker={t("sessions.kicker")}>
      <div className="grid gap-5 md:grid-cols-3">
        {mixSessions.map((session, index) => {
          const id = `mix-${index}`;
          const active = isCurrent(id) && playing;
          return (
            <article
              key={id}
              className="flex flex-col justify-between rounded-3xl border border-border bg-surface p-6 transition-transform hover:-translate-y-1"
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">{session.style}</p>
                <h3 className="mt-3 text-3xl leading-none">{session.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {session.dj} · {session.length}
                </p>
              </div>
              <button
                type="button"
                onClick={() => playTrack({ id, title: session.name, artist: session.dj, src: session.src })}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-primary-foreground transition-transform active:scale-[0.98]"
              >
                {active ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
                {active ? t("sessions.playing") : t("sessions.play")}
              </button>
            </article>
          );
        })}
      </div>
    </SectionManager>
  );
}
