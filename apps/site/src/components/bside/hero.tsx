import { Play, Pause } from "lucide-react";
import heroImg from "@/assets/hero-dj.jpg";
import { usePlayer } from "@/components/player/player-context";
import { useI18n } from "@/lib/i18n";

export function Hero() {
  const { playing, toggleLive } = usePlayer();
  const { t } = useI18n();

  return (
    <section id="top" className="relative grain overflow-hidden">
      {/* Hero background image */}
      <img
        src={heroImg}
        alt="DJ aux platines dans le studio B Side Radio"
        width={1920}
        height={1080}
        className="absolute inset-0 size-full object-cover opacity-20"
      />

      {/* Hero readability overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-background via-background/75 to-background/40" />

      {/* Hero main content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-8 py-6 2xl:py-12">
        {/* Hero content container */}
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">

          {/* Left */}
          <div className="w-full sm:flex-1">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-primary">
              {t("hero.kicker")}
            </p>
            <h1 className="mt-4 text-[15vw] leading-[0.82] sm:text-[8rem] lg:text-[10rem] 2xl:text-[16rem]">
              ONLY
              <br />
              <span className="text-primary">MASHUPS</span>
              <br />& REMIXES
            </h1>
            <p className="mt-2 max-w-xl text-base text-muted-foreground sm:text-lg">{t("hero.desc")}</p>
          </div>

          {/* Right */}
          <div className="w-full sm:w-auto sm:max-w-[275px]">
            {/* Hero actions */}
            <div className="flex flex-wrap items-center gap-8 sm:justify-end">
              <button
                type="button"
                onClick={toggleLive}
                className="inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 font-display text-2xl tracking-widest text-primary-foreground shadow-[0_14px_34px_-18px_var(--primary)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {playing ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current" />}
                {playing ? t("hero.listening") : t("hero.listen")}
              </button>
              <a
                href="#antenne"
                className="inline-flex items-center rounded-full border border-border px-6 py-4 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors hover:border-primary hover:text-primary"
              >
                {t("hero.which")}
              </a>
            </div>
          </div>
        </div>


      </div>

      {/* Scrolling marquee */}
      <div className="relative mx-2 mb-4 overflow-hidden rounded-2xl border border-border bg-surface py-3">
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
