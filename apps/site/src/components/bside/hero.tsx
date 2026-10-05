import { Play, Pause } from "lucide-react";
import heroImg from "@/assets/mixbannerbw.jpeg";
import bsideIcon from "@/assets/bside_icon.png";
import { usePlayer } from "@/components/player/player-context";
import { useI18n } from "@/lib/i18n";

export function Hero() {
  const { playing, toggleLive } = usePlayer();
  const { t } = useI18n();

  return (
    <section id="top" className="relative grain overflow-hidden">
      {/* Hero background image, fixed so the page scrolls over it */}
      <div
        aria-hidden
        className="absolute inset-0 size-full bg-fixed bg-cover bg-center opacity-70"
        style={{ backgroundImage: `url(${heroImg})` }}
      />

      {/* Hero readability overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-background via-background/75 to-background/40" />

      {/* Hero main content */}
      <div className="relative mx-auto flex min-h-[50vh] max-w-7xl flex-col justify-end px-4 pt-8 py-6 sm:px-6 2xl:py-12">
        {/* Hero content container */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div className="min-w-0 sm:col-start-1 sm:row-start-1">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-primary">
              {t("hero.kicker")}
            </p>
            <h1 className="mt-4 text-[20vw] leading-[0.82] sm:text-[7rem] lg:text-[10rem] 2xl:text-[14rem]">
              ONLY
              <br/>
              <span className="text-primary">NEWS <span className="text-white">REMIXES</span></span>
              <br/>
              & MASHUPS
            </h1>
          </div>

          <div className="sm:col-start-1 sm:row-start-2">
            <span className="my-5 block h-px w-3/5 bg-white/70" />
            <div className="flex max-w-xl items-center gap-2 sm:gap-3">
              <img src={bsideIcon} alt="" width={50} height={50} className="size-9 shrink-0 sm:size-14" />
              <p className="ml-2 whitespace-pre-line font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{t("hero.desc")}</p>
            </div>
          </div>

          <div className="mt-6 w-full sm:col-start-2 sm:row-start-1 sm:mt-0 sm:w-auto sm:self-end">
            <div className="flex flex-col items-end gap-4 sm:gap-6 lg:gap-8">
              <button
                type="button"
                onClick={toggleLive}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-primary px-5 py-3 font-display text-lg tracking-widest text-primary-foreground shadow-[0_14px_34px_-18px_var(--primary)] transition-transform hover:scale-[1.02] active:scale-[0.98] lg:gap-3 lg:px-7 lg:py-4 lg:text-2xl cursor-pointer"
              >
                {playing ? <Pause className="size-4 fill-current lg:size-5" /> : <Play className="size-4 fill-current lg:size-5" />}
                {playing ? t("hero.listening") : t("hero.listen")}
              </button>
              <a
                href="#comments"
                className="inline-flex items-center whitespace-nowrap rounded-full border border-border px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors hover:border-primary hover:text-primary sm:px-6 sm:py-4 sm:text-[11px] cursor-pointer"
              >
                {t("hero.which")}
              </a>
            </div>
          </div>
        </div>


      </div>

      {/* Scrolling marquee */}
      <div className="relative mx-2 mb-6 overflow-hidden rounded-2xl border border-border bg-surface py-3">
        <div className="flex w-max animate-none gap-10" style={{ animation: "marquee 24s linear infinite" }}>
          {Array.from({ length: 4 }).map((_, k) => (
            <div key={k} className="flex min-w-max shrink-0 gap-10">
              {(["marquee.1", "marquee.2", "marquee.3", "marquee.4"] as const).map((key) => (
                <span key={key} className="shrink-0 font-display text-xl tracking-[0.2em] text-muted-foreground">
                  {t(key)} <span className="text-primary">/</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
