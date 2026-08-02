import { useState } from "react";
import { ThemeToggle } from "@/components/controls/theme-toggle";
import { LangToggle } from "@/components/controls/lang-toggle";
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
