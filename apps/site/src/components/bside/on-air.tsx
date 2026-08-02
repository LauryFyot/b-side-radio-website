import { useEffect, useState } from "react";
import { schedule, socials } from "@/lib/bside-data";
import { useI18n } from "@/lib/i18n";
import { SectionManager } from "./section-manager";

function currentShowIndex(hour: number) {
  const idx = schedule.findIndex((s) => {
    const start = Number(s.start.slice(0, 2));
    const end = Number(s.end.slice(0, 2));
    return start < end ? hour >= start && hour < end : hour >= start || hour < end;
  });
  return idx < 0 ? 0 : idx;
}

export function OnAir() {
  const [idx, setIdx] = useState(1);
  const { t, lang } = useI18n();
  useEffect(() => {
    const update = () => setIdx(currentShowIndex(new Date().getHours()));
    update();
    const t2 = setInterval(update, 60_000);
    return () => clearInterval(t2);
  }, []);

  const show = schedule[idx]!;
  const next = schedule[(idx + 1) % schedule.length]!;

  return (
    <SectionManager
      id="antenne"
      tone="paper"
      noHeader
      sectionClassName="pb-4"
      panelClassName="grid gap-8 px-5 py-12 sm:px-10 sm:py-16 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
    >
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
            <span className="inline-block size-2 animate-pulse rounded-full bg-primary" />
            {t("onair.now")}
          </p>
          <h2 className="mt-3 text-6xl leading-[0.9] sm:text-8xl">{show.name}</h2>
          <p className="mt-3 font-mono text-sm tracking-widest">
            {show.start} - {show.end} · {t("onair.with")} {show.host}
          </p>
          <p className="mt-4 max-w-xl text-base opacity-75">
            {lang === "en" ? show.blurbEn : show.blurb}
          </p>
        </div>
        <div className="self-end border-l-2 border-primary pl-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-60">
            {t("onair.next")}
          </p>
          <p className="mt-2 font-display text-4xl leading-none">{next.name}</p>
          <p className="mt-1 font-mono text-xs tracking-widest opacity-70">
            {next.start} · {next.host}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {socials.slice(0, 3).map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-paper-foreground/25 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors hover:border-primary hover:text-primary"
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>
    </SectionManager>
  );
}
