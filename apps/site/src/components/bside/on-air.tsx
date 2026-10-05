import { useEffect, useState } from "react";
import { type Show } from "@/lib/bside-data";
import { useI18n } from "@/lib/i18n";
import { useSiteContent } from "@/lib/siteContent";
import { findCurrentShow } from "@/lib/schedule-utils";
import { SectionManager } from "./section-manager";
import { Equalizer } from "@/components/player/player-bar";
import bsideIcon from "@/assets/bside_icon.png";

function findNextShow(shows: Show[], currentShow: Show | null) {
  if (shows.length === 0) {
    return null;
  }

  if (!currentShow) {
    return shows[0] ?? null;
  }

  const index = shows.indexOf(currentShow);
  return shows[(index + 1) % shows.length] ?? null;
}

export function OnAir() {
  const [now, setNow] = useState(() => new Date());
  const { t, lang } = useI18n();
  const { schedule } = useSiteContent();

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const t2 = setInterval(update, 60_000);
    return () => clearInterval(t2);
  }, []);

  const currentShow = findCurrentShow(schedule, now);
  const next = findNextShow(schedule, currentShow);
  const show = currentShow ?? {
    name: t("onair.fallbackName"),
    host: t("onair.fallbackHost"),
    start: "--:--",
    end: "--:--",
    blurb: t("onair.fallbackBlurb"),
    blurbEn: t("onair.fallbackBlurb"),
  };

  return (
    <SectionManager
      id="antenne"
      tone="paper"
      noHeader
      sectionClassName=""
      panelClassName="grid gap-8 px-5 py-8 sm:px-10 sm:py-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
    >
        {/* Current show */}
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-mono text-[14px] uppercase tracking-[0.3em] text-primary">
            <span className="inline-block size-3 mr-3 animate-pulse rounded-full bg-primary" />
            {t("onair.now")}
          </p>
          <div className="mt-3 flex items-center gap-4">
            <Equalizer active className="h-10 shrink-0" />
            <h2 className="text-4xl leading-[0.9] sm:text-6xl">{show.name}</h2>
          </div>
          <div className="mt-6 flex items-center gap-5 sm:gap-7">
            <img
              src={show.coverUrl || bsideIcon}
              alt={show.name}
              className={`size-24 shrink-0 rounded-lg sm:size-28 ${show.coverUrl ? "object-cover" : "bg-background object-contain p-5"}`}
            />
            <div className="min-w-0">
              <p className="font-mono text-sm tracking-widest">{show.start} - {show.end}</p>
              <p className="mt-3 max-w-xl text-base opacity-75">
                {lang === "en" ? show.blurbEn : show.blurb}
              </p>
            </div>
          </div>
        </div>

        {/* Next show */}
        <div className="flex items-center gap-5 border-l-2 border-primary pl-5 sm:gap-7 sm:pl-7">
          <img
            src={next?.coverUrl || bsideIcon}
            alt={next?.name ?? t("onair.fallbackName")}
            className={`size-24 shrink-0 rounded-lg sm:size-28 ${next?.coverUrl ? "object-cover" : "bg-background object-contain p-5"}`}
          />
          <div className="min-w-0 self-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-60">{t("onair.next")}</p>
            <p className="mt-2 font-display text-3xl leading-none sm:text-4xl">{next?.name ?? t("onair.fallbackName")}</p>
            {next && <p className="mt-2 font-mono text-xs tracking-widest opacity-70">{next.start} · {next.end}</p>}
          </div>
        </div>
    </SectionManager>
  );
}
