import { useEffect, useState } from "react";
import { Play, Pause } from "lucide-react";
import heroImg from "@/assets/hero-dj.jpg";
import { schedule, socials } from "@/lib/bside-data";
import { usePlayer } from "./player-context";
import { ThemeToggle } from "./theme-toggle";
import { LangToggle } from "./lang-toggle";
import { useI18n, type TKey } from "@/lib/i18n";
import { getAdminUrl } from "@/lib/admin-url";

const nav: { href: string; key: TKey }[] = [
  { href: "#antenne", key: "nav.antenne" },
  { href: "#vinyls", key: "nav.vinyls" },
  { href: "#programme", key: "nav.programme" },
  { href: "#tracks", key: "nav.tracks" },
  { href: "#sessions", key: "nav.sessions" },
  { href: "#equipe", key: "nav.equipe" },
  { href: "#videos", key: "nav.videos" },
  { href: "#comments", key: "nav.comments" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  const adminUrl = getAdminUrl();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
        <a href="#top" className="min-w-0 font-display text-2xl tracking-[0.15em]">
          BSIDE<span className="text-primary">RADIO</span>
        </a>
        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-6 lg:flex">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary"
              >
                {t(n.key)}
              </a>
            ))}
            <a
              href={adminUrl}
              className="rounded-full border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Admin
            </a>
          </nav>
          <LangToggle />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="font-mono text-[11px] uppercase tracking-[0.2em] lg:hidden"
            aria-expanded={open}
          >
            {open ? t("nav.close") : t("nav.menu")}
          </button>
        </div>
      </div>
      {open && (
        <nav className="grid gap-1 border-t border-border/60 px-4 pb-4 pt-3 lg:hidden">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="py-2 font-display text-xl tracking-wide"
            >
              {t(n.key)}
            </a>
          ))}
          <a
            href={adminUrl}
            onClick={() => setOpen(false)}
            className="py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
          >
            Admin
          </a>
        </nav>
      )}
    </header>
  );
}

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
      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-28">
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
      <div className="relative mx-2 mb-2 overflow-hidden rounded-2xl border border-border bg-surface py-3 sm:mx-4">
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

function currentShowIndex(hour: number) {
  const idx = schedule.findIndex((s) => {
    const start = Number(s.start.slice(0, 2));
    const end = Number(s.end.slice(0, 2));
    return start < end ? hour >= start && hour < end : hour >= start || hour < end;
  });
  return idx < 0 ? 0 : idx;
}

export function OnAir() {
  const [idx, setIdx] = useState(1);
  const { t, lang } = useI18n();
  useEffect(() => {
    const update = () => setIdx(currentShowIndex(new Date().getHours()));
    update();
    const t2 = setInterval(update, 60_000);
    return () => clearInterval(t2);
  }, []);

  const show = schedule[idx]!;
  const next = schedule[(idx + 1) % schedule.length]!;

  return (
    <section id="antenne" className="px-2 pb-4 sm:px-4">
      <div className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] bg-paper px-5 py-12 text-paper-foreground sm:px-10 sm:py-16 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
            <span className="inline-block size-2 animate-pulse rounded-full bg-primary" />
            {t("onair.now")}
          </p>
          <h2 className="mt-3 text-6xl leading-[0.9] sm:text-8xl">{show.name}</h2>
          <p className="mt-3 font-mono text-sm tracking-widest">
            {show.start} — {show.end} · {t("onair.with")} {show.host}
          </p>
          <p className="mt-4 max-w-xl text-base opacity-75">
            {lang === "en" ? show.blurbEn : show.blurb}
          </p>
        </div>
        <div className="self-end border-l-2 border-primary pl-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-60">
            {t("onair.next")}
          </p>
          <p className="mt-2 font-display text-4xl leading-none">{next.name}</p>
          <p className="mt-1 font-mono text-xs tracking-widest opacity-70">
            {next.start} · {next.host}
          </p>
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
      </div>
    </section>
  );
}

export function About() {
  const { t } = useI18n();
  return (
    <section id="about" className="border-b border-border/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
            {t("about.kicker")}
          </p>
          <h2 className="mt-4 text-5xl leading-[0.9] sm:text-7xl">
            {t("about.title.1")}
            <br />
            {t("about.title.2")}
            <br />
            {t("about.title.3")}
          </h2>
        </div>
        <div className="space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
          <p>{t("about.p1")}</p>
          <p>{t("about.p2")}</p>
          <div className="grid grid-cols-3 gap-4 border-t border-border pt-6">
            {([
              ["24/7", "about.stat1"],
              ["0", "about.stat2"],
              ["3", "about.stat3"],
            ] as const).map(([n, key]) => (
              <div key={key}>
                <p className="font-display text-5xl leading-none text-primary">{n}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em]">{t(key)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
