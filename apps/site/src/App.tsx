import { useEffect } from "react";
import { PlayerProvider } from "@/components/bside/player-context";
import { LanguageProvider } from "@/lib/i18n";
import { SiteContentProvider } from "@/lib/siteContent";
import { PlayerBar } from "@/components/bside/player-bar";
import { About, Hero, Nav, OnAir } from "@/components/bside/top";
import { Vinyls } from "@/components/bside/vinyls";
import {
  Comments,
  Programme,
  Sessions,
  SocialsFooter,
  Team,
  Tracks,
  Videos,
} from "@/components/bside/bottom";
import { getAdminUrl } from "@/lib/admin-url";

// The public site only has two states:
// - the homepage
// - a lightweight redirect screen for /admin
function isAdminPath(pathname: string) {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  return normalized.endsWith("/admin");
}

function AdminRedirectPage() {
  const adminUrl = getAdminUrl();

  useEffect(() => {
    const target = new URL(adminUrl, window.location.href).href;
    if (window.location.href !== target) {
      window.location.replace(target);
    }
  }, [adminUrl]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 text-center">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Redirection</p>
        <h1 className="mt-2 text-3xl">Ouverture de l admin...</h1>
        <a href={adminUrl} className="mt-6 inline-block text-primary underline underline-offset-4">
          Continuer vers admin
        </a>
      </div>
    </main>
  );
}

function SiteHomePage() {
  return (
    <LanguageProvider>
      <SiteContentProvider>
        <PlayerProvider>
          <Nav />
          <main>
            <Hero />
            <OnAir />
            <About />
            <Vinyls />
            <Programme />
            <Tracks />
            <Sessions />
            <Team />
            <Videos />
            <Comments />
          </main>
          <SocialsFooter />
          <PlayerBar />
        </PlayerProvider>
      </SiteContentProvider>
    </LanguageProvider>
  );
}

export default function App() {
  const pathname = typeof window === "undefined" ? "/" : window.location.pathname;

  if (isAdminPath(pathname)) {
    return <AdminRedirectPage />;
  }

  return <SiteHomePage />;
}