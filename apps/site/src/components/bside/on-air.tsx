import { useEffect, useState } from "react";
import { socials, type Show } from "@/lib/bside-data";
import { useI18n } from "@/lib/i18n";
import { useSiteContent } from "@/lib/siteContent";
import { SectionManager } from "./section-manager";

function parseTimeToMinutes(value: string) {
  const [hours = "0", minutes = "0"] = value.split(":");
  return Number(hours) * 60 + Number(minutes);
}

function getParisTimeParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Paris",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "Mon";
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);
  const weekdays: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };

  return {
    dayOfWeek: weekdays[weekday] ?? 1,
    minutes: hour * 60 + minute,
  };
}

function showMatchesParisTime(show: Show, dayOfWeek: number, minutes: number) {
  const start = parseTimeToMinutes(show.start);
  const end = parseTimeToMinutes(show.end);

  if (start < end) {
    return (show.dayOfWeek === undefined || show.dayOfWeek === dayOfWeek) && minutes >= start && minutes < end;
  }

  return (
    (show.dayOfWeek === undefined || show.dayOfWeek === dayOfWeek) && minutes >= start
  ) || (
    (show.dayOfWeek === undefined || show.dayOfWeek === (dayOfWeek === 1 ? 7 : dayOfWeek - 1)) && minutes < end
  );
}

function findCurrentShow(shows: Show[], date: Date) {
  const { dayOfWeek, minutes } = getParisTimeParts(date);

  return shows.find((show) => showMatchesParisTime(show, dayOfWeek, minutes)) ?? null;
}

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
      sectionClassName="pb-4"
      panelClassName="grid gap-8 px-5 pt-12 py-12 sm:px-10 sm:py-16 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
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
          <p className="mt-2 font-display text-4xl leading-none">{next?.name ?? t("onair.fallbackName")}</p>
          {next && (
            <p className="mt-1 font-mono text-xs tracking-widest opacity-70">
              {next.start} · {next.host}
            </p>
          )}
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
