import { Play, Pause } from "lucide-react";
import heroImg from "@/assets/hero-dj.jpg";
import { usePlayer } from "@/components/player/player-context";
import { useI18n } from "@/lib/i18n";

export function Hero() {
  const { playing, toggleLive } = usePlayer();
  const { t } = useI18n();

  return (
    <section id="top" className="relative grain overflow-hidden">
      <img
        src={heroImg}
        alt="DJ aux platines dans le studio B Side Radio"
        width={1920}
        height={1080}
        className="absolute inset-0 size-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-linear-to-t from-background via-background/75 to-background/40" />
      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-20 sm:px-6 sm:pt-28">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-primary">
          {t("hero.kicker")}
        </p>
        <h1 className="mt-4 text-[15vw] leading-[0.82] sm:text-[9rem] lg:text-[11rem]">
          ONLY
          <br />
          <span className="text-primary">MASHUPS</span>
          <br />& REMIXES
        </h1>
        <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">{t("hero.desc")}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
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
      <div className="relative mx-2 mb-2 overflow-hidden rounded-2xl border border-border bg-surface py-3 sm:my-8">
        <div className="flex w-max animate-none gap-10" style={{ animation: "marquee 24s linear infinite" }}>
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex shrink-0 gap-10">
              {(["marquee.1", "marquee.2", "marquee.3", "marquee.4"] as const).map((key) => (
                <span key={key} className="font-display text-xl tracking-[0.2em] text-muted-foreground">
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
