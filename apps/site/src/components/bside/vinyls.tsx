import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionManager } from "./section-manager";
import { useI18n } from "@/lib/i18n";
import { useSiteContent } from "@/lib/siteContent";

export function Vinyls() {
  const trackRef = useRef<HTMLUListElement>(null);
  const { t } = useI18n();
  const { vinyls } = useSiteContent();

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.8, 240), behavior: "smooth" });
  };

  return (
    <SectionManager id="vinyls" index="01" title={t("vinyls.title")} kicker={t("vinyls.kicker")} tone="surface">
      <div className="relative">
        <div className="mb-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label={t("vinyls.prev")}
            className="grid size-10 place-items-center rounded-full border border-border transition-colors hover:border-primary hover:text-primary"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label={t("vinyls.next")}
            className="grid size-10 place-items-center rounded-full border border-border transition-colors hover:border-primary hover:text-primary"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
        <ul
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {vinyls.map((v) => (
            <li key={v.side} className="group w-[42%] shrink-0 snap-start sm:w-[28%] lg:w-[18%]">
              <div className="relative aspect-square">
                <div className="vinyl-grooves absolute inset-0 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] transition-transform duration-700 group-hover:[animation:spin-slow_6s_linear_infinite]">
                  <div
                    className="absolute left-1/2 top-1/2 grid size-[38%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
                    style={{ backgroundColor: v.labelColor }}
                  >
                    <span
                      className="font-display text-lg leading-none"
                      style={{ color: v.labelColor === "#F2F2F2" ? "#222222" : "#F2F2F2" }}
                    >
                      {v.side}
                    </span>
                    <span className="absolute size-[12%] rounded-full bg-surface" />
                  </div>
                </div>
              </div>
              <p className="mt-3 truncate font-display text-xl leading-tight">{v.title}</p>
              <p className="truncate text-xs text-muted-foreground">
                {v.artist} · {v.year}
              </p>
              <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.15em] text-primary">
                rmx {v.remixedBy}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </SectionManager>
  );
}
