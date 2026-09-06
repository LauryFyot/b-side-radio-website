import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "fr" | "en";

const dict = {
  fr: {
    "nav.antenne": "Antenne",
    "nav.vinyls": "Vinyls",
    "nav.programme": "Programme",
    "nav.tracks": "Tracks",
    "nav.sessions": "Sessions",
    "nav.equipe": "Equipe",
    "nav.videos": "Videos",
    "nav.comments": "Commentaires",
    "nav.menu": "Menu",
    "nav.close": "Fermer",

    "hero.kicker": "Paris — 24/7 — Sans publicite",
    "hero.desc":
      "B Side Radio, c'est la face B des tubes que vous connaissez par coeur : edits, remixes et mashups des annees 80 a aujourd'hui, selectionnes par trois DJs.",
    "hero.listen": "Ecouter le direct",
    "hero.listening": "En ecoute",
    "hero.which": "Quelle emission ?",
    "marquee.1": "Only mashups & remixes",
    "marquee.2": "B Side Radio is LIVE",
    "marquee.3": "Mixes lives vendredi & samedi",
    "marquee.4": "Sans publicite",

    "onair.now": "A l'antenne maintenant",
    "onair.with": "avec",
    "onair.next": "Ensuite",
    "onair.fallbackName": "B Side Radio",
    "onair.fallbackHost": "Auto DJ",
    "onair.fallbackBlurb": "Aucune emission n'est declaree pour ce creneau. La radio continue en rotation automatique.",

    "about.kicker": "La webradio",
    "about.title.1": "La face B",
    "about.title.2": "des morceaux",
    "about.title.3": "que vous aimez",
    "about.p1":
      "Vous ecoutez B Side Radio tous les jours et sans publicite, toute la journee. Notre programmation est faite uniquement de mashups, d'edits et de remixes : les meilleurs titres des annees 80 a aujourd'hui, mais jamais dans leur version d'origine.",
    "about.p2":
      "Chaque semaine, l'equipe met en avant dix vinyls remixes, six selections MP3 et trois mix sessions enregistrees. Les mixes lives passent tous les vendredis et samedis soirs en mode Funky House & House.",
    "about.stat1": "En direct",
    "about.stat2": "Publicite",
    "about.stat3": "DJs residents",

    "player.onair": "On Air",
    "player.replay": "Replay",
    "player.next": "a suivre",
    "player.buy": "Acheter",
    "player.pause": "Pause",
    "player.play": "Ecouter le direct",
    "player.volume": "Volume",

    "vinyls.title": "Vinyls de la semaine",
    "vinyls.kicker":
      "Dix faces B remixees, choisies par l'equipe. Le titre d'origine, et qui s'est charge du remix.",
    "vinyls.prev": "Vinyls precedents",
    "vinyls.next": "Vinyls suivants",

    "programme.day": "Jour",
    "programme.week": "Semaine",
    "programme.title.day": "Programme du jour",
    "programme.title.week": "Programme de la semaine",
    "programme.kicker":
      "La grille quotidienne. Les mixes lives arrivent le vendredi et le samedi soir.",

    "tracks.title": "6 titres de la semaine",
    "tracks.kicker":
      "La selection MP3 des residents. Un clic pour ecouter, un lien pour acheter le titre.",
    "tracks.reco": "recommandé par:",
    "tracks.buy": "Acheter",
    "tracks.listen": "Ecouter",

    "sessions.title": "Mix sessions",
    "sessions.kicker": "Trois sessions enregistrees cette semaine, a ecouter en entier.",
    "sessions.play": "Lancer la session",
    "sessions.playing": "En ecoute",

    "team.title": "L'equipe",
    "team.kicker": "Trois DJs, une seule regle : jamais la version originale.",
    "team.portrait": "Portrait de",

    "videos.title": "Videos de la semaine",

    "comments.title": "Espace commentaires",
    "comments.kicker":
      "Dites-nous ce que vous ecoutez, demandez un titre, reagissez aux sessions.",
    "comments.replyTo": "Reponse a",
    "comments.cancel": "Annuler",
    "comments.name": "Votre prenom",
    "comments.email": "Votre email (optionnel)",
    "comments.message": "Votre message",
    "comments.send": "Envoyer",
    "comments.sending": "Envoi...",
    "comments.moderation": "Votre message est publie immediatement. Nous pouvons le retirer si besoin.",
    "comments.pending": "Message envoye",
    "comments.published": "messages publies",
    "comments.reply": "Repondre",
    "comments.staff": "Equipe",
    "comments.writeCta": "Ecrire un commentaire",
    "comments.formTitle": "Votre message",
    "comments.formKicker": "Un mot sur une emission, une demande de titre, un coup de coeur.",
    "comments.sortDate": "Date",
    "comments.sortLikes": "Likes",
    "comments.like": "Aimer",
    "comments.unlike": "Retirer le like",

    "socials.title": "Restons connectes",
    "socials.legal": "B Side Radio — Paris — Only mashups & remixes",

    "toggle.light": "Passer en mode clair",
    "toggle.dark": "Passer en mode sombre",
    "toggle.lang": "Switch to English",
  },
  en: {
    "nav.antenne": "On Air",
    "nav.vinyls": "Vinyls",
    "nav.programme": "Schedule",
    "nav.tracks": "Tracks",
    "nav.sessions": "Sessions",
    "nav.equipe": "Team",
    "nav.videos": "Videos",
    "nav.comments": "Comments",
    "nav.menu": "Menu",
    "nav.close": "Close",

    "hero.kicker": "Paris — 24/7 — Ad free",
    "hero.desc":
      "B Side Radio is the flip side of the hits you know by heart: edits, remixes and mashups from the 80s to today, hand-picked by three DJs.",
    "hero.listen": "Listen live",
    "hero.listening": "Now playing",
    "hero.which": "What's on?",
    "marquee.1": "Only mashups & remixes",
    "marquee.2": "B Side Radio is LIVE",
    "marquee.3": "Live mixes Friday & Saturday",
    "marquee.4": "No ads, ever",

    "onair.now": "On air right now",
    "onair.with": "with",
    "onair.next": "Up next",
    "onair.fallbackName": "B Side Radio",
    "onair.fallbackHost": "Auto DJ",
    "onair.fallbackBlurb": "No show is scheduled for this slot. The radio keeps running on automatic rotation.",

    "about.kicker": "The web radio",
    "about.title.1": "The B side",
    "about.title.2": "of the tracks",
    "about.title.3": "you love",
    "about.p1":
      "B Side Radio plays every day, all day, with no advertising. Our programming is made only of mashups, edits and remixes: the best tracks from the 80s to today, but never in their original version.",
    "about.p2":
      "Every week the crew highlights ten remixed vinyls, six MP3 picks and three recorded mix sessions. Live mixes air every Friday and Saturday night in Funky House & House mode.",
    "about.stat1": "Live",
    "about.stat2": "Adverts",
    "about.stat3": "Resident DJs",

    "player.onair": "On Air",
    "player.replay": "Replay",
    "player.next": "up next",
    "player.buy": "Buy",
    "player.pause": "Pause",
    "player.play": "Listen live",
    "player.volume": "Volume",

    "vinyls.title": "Vinyls of the week",
    "vinyls.kicker":
      "Ten remixed B sides picked by the crew. The original track, and who handled the remix.",
    "vinyls.prev": "Previous vinyls",
    "vinyls.next": "Next vinyls",

    "programme.day": "Day",
    "programme.week": "Week",
    "programme.title.day": "Today's schedule",
    "programme.title.week": "Weekly schedule",
    "programme.kicker": "The daily grid. Live mixes land on Friday and Saturday night.",

    "tracks.title": "6 tracks of the week",
    "tracks.kicker": "The residents' MP3 picks. One click to listen, one link to buy the track.",
    "tracks.reco": "picked by",
    "tracks.buy": "Buy",
    "tracks.listen": "Play",

    "sessions.title": "Mix sessions",
    "sessions.kicker": "Three sessions recorded this week, to play from start to finish.",
    "sessions.play": "Start the session",
    "sessions.playing": "Now playing",

    "team.title": "The crew",
    "team.kicker": "Three DJs, one rule: never the original version.",
    "team.portrait": "Portrait of",

    "videos.title": "Videos of the week",

    "comments.title": "Comments",
    "comments.kicker": "Tell us what you're listening to, request a track, react to the sessions.",
    "comments.replyTo": "Replying to",
    "comments.cancel": "Cancel",
    "comments.name": "Your first name",
    "comments.email": "Your email (optional)",
    "comments.message": "Your message",
    "comments.send": "Send",
    "comments.sending": "Sending...",
    "comments.moderation": "Your message is published right away. We can remove it if needed.",
    "comments.pending": "Message sent",
    "comments.published": "published messages",
    "comments.reply": "Reply",
    "comments.staff": "Crew",
    "comments.writeCta": "Write a comment",
    "comments.formTitle": "Your message",
    "comments.formKicker": "A word about a show, a track request, a shout-out.",
    "comments.sortDate": "Date",
    "comments.sortLikes": "Likes",
    "comments.like": "Like",
    "comments.unlike": "Unlike",

    "socials.title": "Stay connected",
    "socials.legal": "B Side Radio — Paris — Only mashups & remixes",

    "toggle.light": "Switch to light mode",
    "toggle.dark": "Switch to dark mode",
    "toggle.lang": "Passer en francais",
  },
} as const;

export type TKey = keyof (typeof dict)["fr"];

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: TKey) => string };

const LangContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const stored = window.localStorage.getItem("bside-lang") as Lang | null;
    const initial: Lang = stored ?? (navigator.language.toLowerCase().startsWith("fr") ? "fr" : "en");
    setLangState(initial);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("bside-lang", l);
  }, []);

  const t = useCallback((k: TKey) => dict[lang][k] ?? dict.fr[k], [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}

/** Picks the right localized value from a { fr, en } pair. */
export function pick(lang: Lang, fr: string, en: string) {
  return lang === "en" ? en : fr;
}
