import { useState } from "react";
import { ThemeToggle } from "@/components/controls/theme-toggle";
import { LangToggle } from "@/components/controls/lang-toggle";
import { useI18n, type TKey } from "@/lib/i18n";
import bsideIcon from "@/assets/bside_icon.png";

const nav: { href: string; key: TKey }[] = [
  { href: "#vinyls", key: "nav.vinyls" },
  { href: "#programme", key: "nav.programme" },
  { href: "#tracks", key: "nav.tracks" },
  { href: "#sessions", key: "nav.sessions" },
  { href: "#equipe", key: "nav.equipe" },
  { href: "#videos", key: "nav.videos" },
  { href: "#comments", key: "nav.comments" },
  { href: "#socials", key: "nav.contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur relative">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
        <a href="#top" className="flex min-w-0 items-center gap-2 font-display text-2xl tracking-[0.15em]">
          <img src={bsideIcon} alt="" width={28} height={28} className="size-8 shrink-0 mr-2" />
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
        <>
          {/* Backdrop starts below the nav bar, so its blur doesn't show through the header itself */}
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-x-0 top-full z-30 h-[100dvh] animate-in fade-in duration-200 bg-background/60 backdrop-blur-sm lg:hidden"
          />
          <nav className="absolute inset-x-0 top-full z-40 grid origin-top animate-in fade-in slide-in-from-top-4 gap-1 border-t border-border/60 bg-background/95 px-4 pb-4 pt-3 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.45)] backdrop-blur duration-300 ease-out lg:hidden">
            {nav.map((n, index) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                style={{ animationDelay: `${index * 35}ms` }}
                className="animate-in fade-in slide-in-from-top-2 fill-mode-backwards py-2 font-display text-xl tracking-wide transition-colors hover:text-primary"
              >
                {t(n.key)}
              </a>
            ))}
          </nav>
        </>
      )}
    </header>
  );
}
