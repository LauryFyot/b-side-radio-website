import { createFileRoute } from "@tanstack/react-router";
import { PlayerProvider } from "@/components/bside/player-context";
import { LanguageProvider } from "@/lib/i18n";
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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "B Side Radio — Web radio mashups & remixes en direct" },
      {
        name: "description",
        content:
          "Ecoutez B Side Radio en direct : mashups, remixes et edits 24/7 sans publicite. Emissions, vinyls de la semaine, mix sessions et selections DJ.",
      },
      { property: "og:title", content: "B Side Radio — Web radio mashups & remixes en direct" },
      {
        property: "og:description",
        content:
          "Mashups, remixes et edits des annees 80 a aujourd'hui, en direct 24/7 depuis Paris.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <LanguageProvider>
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
    </LanguageProvider>
  );
}
