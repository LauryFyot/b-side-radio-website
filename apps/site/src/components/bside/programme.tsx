import { useState } from "react";
import { SectionManager } from "./section-manager";
import { useI18n, type Lang } from "@/lib/i18n";
import { type Show } from "@/lib/bside-data";
import { useSiteContent } from "@/lib/siteContent";

function ShowList({ shows, lang }: { shows: Show[]; lang: Lang }) {
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
      {shows.map((show) => (
        <li
          key={`${show.name}-${show.start}`}
          className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-4 px-4 py-5 transition-colors hover:bg-muted sm:grid-cols-[8rem_14rem_minmax(0,1fr)] sm:gap-8 sm:px-6"
        >
          <span className="font-mono text-xs tracking-[0.15em] text-primary">
            {show.start}—{show.end}
          </span>
          <span className="min-w-0 font-display text-3xl leading-none">{show.name}</span>
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

  return (
    <SectionManager
      id="programme"
      index="02"
      title={view === "day" ? t("programme.title.day") : t("programme.title.week")}
      kicker={t("programme.kicker")}
    >
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

      {view === "week" && (
        <div className="mb-4 flex flex-wrap gap-2">
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
      )}

      <ShowList shows={view === "day" ? schedule : (weekSchedule[day]?.shows ?? schedule)} lang={lang} />
    </SectionManager>
  );
}
