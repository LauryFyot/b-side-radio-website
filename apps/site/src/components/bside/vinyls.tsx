import { useRef } from "react";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
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
        {/* Carousel controls */}
        <div className="flex justify-end gap-2 -mt-18">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label={t("vinyls.prev")}
            className="grid size-10 place-items-center rounded-full border border-border transition-colors hover:border-primary hover:text-primary cursor-pointer"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label={t("vinyls.next")}
            className="grid size-10 place-items-center rounded-full border border-border transition-colors hover:border-primary hover:text-primary cursor-pointer"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        {/* Vinyls carousel */}
        <ul
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-8 overflow-x-auto px-0 pb-0 pt-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {vinyls.map((v) => {
            const hasBuyLink = Boolean(v.buyUrl?.trim());

            return (
              /* Vinyl card */
              <li key={v.side} className="group relative w-[42%] shrink-0 snap-start transition-[margin] duration-500 ease-out sm:w-[28%] lg:w-[18%] hover:z-20 hover:mr-[26.88%] sm:hover:mr-[17.92%] lg:hover:mr-[11.52%]">
                <div className="relative aspect-square w-full cursor-pointer">
                  {/* Black vinyl disc, hidden behind the cover until hover */}
                  <div
                    aria-hidden
                    className="absolute inset-y-0 right-0 z-0 aspect-square overflow-hidden rounded-full bg-[#111] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.85)] transition-transform duration-500 ease-out group-hover:translate-x-[64%] group-hover:[animation:spin-slow_6s_linear_infinite]"
                  >
                    {v.imageUrl && <img src={v.imageUrl} alt="" className="absolute inset-0 size-full rounded-full object-cover opacity-30" />}
                    <span className="absolute inset-0 rounded-full bg-black/45" />
                    <span
                      className="absolute inset-0 rounded-full opacity-70"
                      style={{ background: "repeating-radial-gradient(circle at center, transparent 0 4px, rgba(0,0,0,0.55) 5px 6px)" }}
                    />
                    <span className="absolute left-1/2 top-1/2 size-[16%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-surface" />
                  </div>

                  {/* Square cover art */}
                  <div className="relative z-10 aspect-square w-full overflow-hidden rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]">
                    {v.imageUrl ? (
                      <img src={v.imageUrl} alt={v.title} className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                      <div
                        className="absolute inset-0 grid place-items-center"
                        style={{ backgroundColor: v.labelColor }}
                      >
                        <span
                          className="font-display text-2xl leading-none"
                          style={{ color: v.labelColor === "#F2F2F2" ? "#222222" : "#F2F2F2" }}
                        >
                          {v.side}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vinyl text + buy link */}
                <div className="mt-8 flex items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-xl leading-tight">{v.title}</p>
                    {(v.artist || v.year) && (
                      <p className="truncate text-xs text-muted-foreground">
                        {[v.artist, v.year].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    {v.remixedBy && (
                      <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.15em] text-primary">
                        {v.remixedBy}
                      </p>
                    )}
                  </div>
                  {hasBuyLink ? (
                    <a
                      href={v.buyUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${t("tracks.buy")} ${v.title}`}
                      className="grid size-10 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      <ShoppingBag className="size-4" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      aria-label={`${t("tracks.buy")} ${v.title}`}
                      className="grid size-10 shrink-0 cursor-not-allowed place-items-center rounded-full border border-border/60 text-muted-foreground/35"
                    >
                      <ShoppingBag className="size-4" />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </SectionManager>
  );
}
