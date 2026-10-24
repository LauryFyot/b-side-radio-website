import { Play, Pause, MessageCircle } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import heroImg from "@/assets/mixbannerbw.jpeg";
import traxsourceLogo from "../../../../../assets/images/traxsource-logo-long-blue.png";
import { usePlayer } from "@/components/player/player-context";
import { useI18n } from "@/lib/i18n";
import { useSiteContent } from "@/lib/siteContent";

function ScrollingMessages({ messages }: { messages: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cycleRef = useRef<HTMLDivElement>(null);
  const [repetitions, setRepetitions] = useState(1);
  const contentKey = JSON.stringify(messages);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const cycle = cycleRef.current;
    if (!container || !cycle) return;
    const measure = () => {
      const width = cycle.getBoundingClientRect().width;
      if (width > 0) {
        setRepetitions(Math.max(1, Math.ceil(container.clientWidth / width)));
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(cycle);
    return () => observer.disconnect();
  }, [contentKey]);

  return (
    <div ref={containerRef} className="hero-marquee grain relative overflow-hidden rounded-2xl border border-border py-3">
      <div className="flex w-max motion-reduce:!animate-none" style={{ animation: "marquee 36s linear infinite" }}>
        {[0, 1].map((group) => (
          <div key={group} className="flex shrink-0" aria-hidden={group === 1 ? true : undefined}>
            {Array.from({ length: repetitions }, (_, cycle) => (
              <div key={cycle} ref={group === 0 && cycle === 0 ? cycleRef : undefined} className="flex w-max shrink-0 gap-10 pr-10" aria-hidden={cycle > 0 ? true : undefined}>
                {messages.map((message, index) => (
                  <span key={index} className="shrink-0 whitespace-nowrap font-display text-xl tracking-[0.2em] text-muted-foreground">
                    {message} <span className="text-primary">/</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  const { playing, toggleLive } = usePlayer();
  const { t, lang } = useI18n();
  const { bannerMessages } = useSiteContent();
  const messages = bannerMessages === null
    ? (["marquee.1", "marquee.2", "marquee.3", "marquee.4"] as const).map((key) => t(key))
    : bannerMessages.map((message) => message[lang]).filter((message) => message.trim());

  return (
    <section id="top" className="hero-section">
      {/* Hero background image, fixed so the page scrolls over it */}
      <div className="hero-stage">
        <div className="hero-image" style={{ backgroundImage: `url(${heroImg})` }} aria-hidden="true" />
        <div className="hero-image-overlay" aria-hidden="true" />
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
          <a id="partner-traxsource-hero" data-clarity-label="partner-traxsource" className="hero-partner" href="https://www.traxsource.com/" target="_blank" rel="noreferrer" aria-label="Traxsource">
            <span>Partnership</span>
            <img src={traxsourceLogo} alt="Traxsource" />
          </a>
        </div>
        <div className="hero-actions">
          <a className="hero-chat" href="#comments" data-clarity-label="navigation-comments">
            <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
            <span>{t("hero.which")}</span>
          </a>
          <button id="player-toggle-hero" type="button" onClick={toggleLive} className="hero-listen" aria-pressed={playing} data-clarity-label="player-toggle-hero">
            {playing ? <Pause className="size-4 shrink-0 fill-current" /> : <Play className="size-4 shrink-0 fill-current" />}
            {playing ? t("hero.listening") : t("hero.listen")}
          </button>
        </div>
      </div>

      {/* Scrolling marquee */}
      {messages.length > 0 && <ScrollingMessages messages={messages} />}
    </section>
  );
}
