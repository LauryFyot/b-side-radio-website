import { useState } from "react";
import { SectionManager } from "./section-manager";
import { useI18n, type Lang } from "@/lib/i18n";
import { type Show } from "@/lib/bside-data";
import { useSiteContent } from "@/lib/siteContent";

type TimelineBounds = {
  start: number;
  end: number;
};

// Time helpers
function parseTimeToMinutes(value: string) {
  const [hours = "0", minutes = "0"] = value.split(":");
  return Number(hours) * 60 + Number(minutes);
}

function formatHour(minutes: number) {
  if (minutes === 1440) {
    return "00h";
  }

  return `${String(Math.floor((minutes % 1440) / 60)).padStart(2, "0")}h`;
}

function getShowEndMinutes(show: Show) {
  const start = parseTimeToMinutes(show.start);
  const end = parseTimeToMinutes(show.end);
  return end <= start ? end + 1440 : end;
}

function getTimelineBounds(weekSchedule: { shows: Show[] }[]): TimelineBounds {
  return { start: 0, end: 24 * 60 };
}

// Desktop week timeline
function WeekTimeline({ weekSchedule, lang }: { weekSchedule: { day: string; dayEn: string; shows: Show[] }[]; lang: Lang }) {
  const bounds = getTimelineBounds(weekSchedule);
  const total = Math.max(bounds.end - bounds.start, 60);
  const hourMarks = Array.from({ length: Math.floor(total / 240) + 1 }, (_, index) => bounds.start + index * 240);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="overflow-x-auto [scrollbar-width:thin]">
        <div className="min-w-[980px]">
          {/* Timeline hours */}
          <div className="grid grid-cols-[7rem_minmax(0,1fr)] border-b border-border px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:grid-cols-[9rem_minmax(0,1fr)] sm:px-6">
            <span>Jour</span>
            <div className="relative h-5">
              {hourMarks.map((minutes) => (
                <span
                  key={minutes}
                  className="absolute top-0 -translate-x-1/2 font-mono"
                  style={{ left: `${((minutes - bounds.start) / total) * 100}%` }}
                >
                  {formatHour(minutes)}
                </span>
              ))}
            </div>
          </div>

          {/* Timeline rows */}
          {weekSchedule.map((day) => (
            <div key={day.day} className="grid grid-cols-[7rem_minmax(0,1fr)] border-b border-border px-4 py-2 last:border-b-0 sm:grid-cols-[9rem_minmax(0,1fr)] sm:px-6">
              {/* Day label */}
              <div className="pr-4 font-display text-2xl leading-none">
                {lang === "en" ? day.dayEn : day.day}
              </div>

              {/* Day slots */}
              <div className="relative min-h-14 rounded-xl bg-muted/40">
                {hourMarks.map((minutes) => (
                  <span
                    key={`${day.day}-${minutes}`}
                    className="absolute top-0 h-full w-px bg-border/70"
                    style={{ left: `${((minutes - bounds.start) / total) * 100}%` }}
                  />
                ))}
                {day.shows.map((show) => {
                  const start = parseTimeToMinutes(show.start);
                  const rawEnd = getShowEndMinutes(show);
                  const end = Math.min(rawEnd, bounds.end);
                  const left = ((start - bounds.start) / total) * 100;
                  const width = Math.min(((end - start) / total) * 100, 100 - left);
                  const boundedWidth = Math.min(Math.max(width, 5), 100 - left);
                  const displayEnd = rawEnd > bounds.end ? "00:00" : show.end;

                  return (
                    /* Show block */
                    <article
                      key={`${day.day}-${show.name}-${show.start}`}
                      className="absolute overflow-hidden rounded-sm border border-primary/25 bg-background px-3 py-2 shadow-[0_10px_24px_-20px_var(--foreground)]"
                      style={{ left: `${left}%`, width: `${boundedWidth}%` }}
                    >
                      <p className="truncate font-display text-xl leading-none">{show.name}</p>
                      <p className="truncate font-mono text-[10px] tracking-[0.12em] text-primary">
                        {show.start}-{displayEnd}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Day list
function ShowList({ shows, lang }: { shows: Show[]; lang: Lang }) {
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
      {shows.map((show) => (
        <li
          key={`${show.name}-${show.start}`}
          className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-2 px-4 py-5 transition-colors hover:bg-muted sm:grid-cols-[8rem_10rem_minmax(0,1fr)] sm:gap-8 sm:px-6"
        >
          <span className="font-mono text-xs tracking-[0.15em] text-primary">
            {show.start}—{show.end}
          </span>
          <span className="min-w-0 font-display text-lg sm:text-3xl leading-none">{show.name}</span>
          <span className="col-span-2 min-w-0 text-sm text-muted-foreground sm:col-span-1">
            <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground">
              {show.host}
            </span>
            {lang === "en" ? show.blurbEn : show.blurb}
          </span>
        </li>
      ))}
    </ul>
  );
}

// Programme section: day/week switch and the current schedule list.
export function Programme() {
  const [view, setView] = useState<"day" | "week">("day");
  const todayIndex = (new Date().getDay() + 6) % 7;
  const [day, setDay] = useState(todayIndex);
  const { t, lang } = useI18n();
  const { schedule, weekSchedule } = useSiteContent();
  const todayShows = weekSchedule[todayIndex]?.shows ?? [];
  const visibleShows = todayShows.length > 0 ? todayShows : schedule;
  const selectedWeekShows = weekSchedule[day]?.shows ?? schedule;

  return (
    <SectionManager
      id="programme"
      index="02"
      title={view === "day" ? t("programme.title.day") : t("programme.title.week")}
      kicker={t("programme.kicker")}
    >
      {/* View switch */}
      <div className="mb-6 inline-flex rounded-full border border-border bg-surface p-1">
        {(["day", "week"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setView(value)}
            className={`rounded-full px-5 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
              view === value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {value === "day" ? t("programme.day") : t("programme.week")}
          </button>
        ))}
      </div>

      {view === "day" ? (
        <ShowList shows={visibleShows} lang={lang} />
      ) : (
        <>
          {/* Mobile week day filters */}
          <div className="mb-4 flex flex-wrap gap-2 lg:hidden">
            {weekSchedule.map((item, index) => (
              <button
                key={item.day}
                type="button"
                onClick={() => setDay(index)}
                className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
                  day === index
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {lang === "en" ? item.dayEn : item.day}
              </button>
            ))}
          </div>

          {/* Mobile week list */}
          <div className="lg:hidden">
            <ShowList shows={selectedWeekShows} lang={lang} />
          </div>

          {/* Desktop week timeline */}
          <div className="hidden lg:block">
            <WeekTimeline weekSchedule={weekSchedule} lang={lang} />
          </div>
        </>
      )}
    </SectionManager>
  );
}
