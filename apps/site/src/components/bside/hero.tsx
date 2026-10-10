import { Play, Pause } from "lucide-react";
import heroImg from "@/assets/mixbannerbw.jpeg";
import traxsourceLogo from "../../../../../assets/images/traxsource-logo-long-blue.png";
import { usePlayer } from "@/components/player/player-context";
import { useI18n } from "@/lib/i18n";

export function Hero() {
  const { playing, toggleLive } = usePlayer();
  const { t } = useI18n();

  return (
    <section id="top" className="hero-section">
      <div className="hero-stage">
        <div className="hero-media" aria-hidden="true">
          <div className="hero-image" style={{ backgroundImage: `url(${heroImg})` }} />
          <div className="hero-image-overlay" />
        </div>
        <div className="hero-heading">
          <p className="hero-kicker">{t("hero.kicker")}</p>
          <h1 className="hero-title">BSIDE<span>RADIO</span></h1>
        </div>
        <div className="hero-signature">
          <p className="hero-slogan">
            ONLY <span>NEWS</span><br />
            REMIXES<br />
            &amp; <span className="hero-outline">MASHUPS</span>
          </p>
          <a className="hero-partner" href="https://www.traxsource.com/" target="_blank" rel="noreferrer" aria-label="Traxsource">
            <span>Powered by</span>
            <img src={traxsourceLogo} alt="Traxsource" />
          </a>
        </div>
        <div className="hero-actions">
          <a className="hero-chat" href="#comments">{t("hero.which")}</a>
          <button type="button" onClick={toggleLive} className="hero-listen" aria-pressed={playing}>
            {playing ? <Pause className="size-4 shrink-0 fill-current" /> : <Play className="size-4 shrink-0 fill-current" />}
            {playing ? t("hero.listening") : t("hero.listen")}
          </button>
        </div>
      </div>

      {/* Scrolling marquee */}
      <div className="hero-marquee grain relative overflow-hidden rounded-2xl border border-border py-3">
        <div className="flex w-max animate-none gap-10" style={{ animation: "marquee 36s linear infinite" }}>
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
