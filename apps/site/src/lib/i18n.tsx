import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "fr" | "en";

const dict = {
  fr: {
    "nav.antenne": "Antenne",
    "nav.vinyls": "Vinyls",
    "nav.programme": "Programme",
    "nav.mixSessions": "Mix Sessions",
    "nav.replays": "Replays",
    "nav.equipe": "Team",
    "nav.videos": "Videos",
    "nav.comments": "Coms",
    "nav.contact": "Contact",
    "nav.menu": "Menu",
    "nav.close": "Fermer",

    "hero.kicker": "Paris — 24/7  UTC+2 — Sans publicite",
    "hero.desc":
      "B Side Radio, des nouveautés tous les jours \n La haute couture sonore",
    "hero.listen": "Ecouter le direct",
    "hero.listening": "En ecoute",
    "hero.which": "Tchat",
    "marquee.1": "Only mashups & remixes",
    "marquee.2": "B Side Radio is LIVE",
    "marquee.3": "Mixes lives vendredi & samedi",
    "marquee.4": "Sans publicite",

    "onair.now": "A l'antenne maintenant",
    "onair.with": "avec",
    "onair.next": "A suivre",
    "onair.fallbackName": "B Side Radio",
    "onair.fallbackHost": "Auto DJ",
    "onair.fallbackBlurb": "Aucune emission n'est declaree pour ce creneau. La radio continue en rotation automatique.",

    "about.kicker": "B.SIDE.RADIO.COM",
    "about.title.1": "Le son",
    "about.title.2": "de demain",
    "about.title.3": "remixé aujourd'hui !",
    "about.p1": "Vous écoutez 7j/7 BSide Radio dans le monde entier.\n Chaque jour, les nouveautés Funky House, Nu-Disco, Soulful mais aussi Jackin' & Techhouse.\n BSide Radio c'est aussi les 80's / 90's & 00's en versions RemiXes & MasHups exclusivement.",
    "about.p2":
      "B.SIDE.RADIO vous offre des MiXes Lives de 4 djs tous les vendredis et samedis soirs ainsi que le Replay des mixes de samedi, tous les dimanches après midi. \n \n La nouveauté Klub, c'est ici !\nTURN UP THE NEW SOUND",
    "about.stat1": "En direct",
    "about.stat2": "Publicite",
    "about.stat3": "DJs residents",

    "player.onair": "On Air",
    "player.liveFrom": "Live from BSide Radio",
    "player.replay": "Replay",
    "player.next": "",
    "player.buy": "Acheter",
    "player.pause": "Pause",
    "player.play": "Ecouter le direct",
    "player.volume": "Volume",

    "vinyls.title": "Tops de la semaine",
    "vinyls.kicker":
      "Faites le plein de nouveautés et prenez une longueur d'avance. En lien avec notre partenaire {{traxsource}}",
    "vinyls.prev": "Vinyls precedents",
    "vinyls.next": "Vinyls suivants",

    "programme.day": "Jour",
    "programme.week": "Semaine",
    "programme.title.day": "Programme du jour",
    "programme.title.week": "Programme de la semaine",
    "programme.kicker":
      "La grille quotidienne. Les mixes lives arrivent le vendredi et le samedi soir.",
    "programme.timeline.prev": "Defiler la grille vers la gauche",
    "programme.timeline.next": "Defiler la grille vers la droite",

    "mixSessions.title": "Mix Sessions",
    "mixSessions.kicker":
      "Les mixes des DJs BSide, à écouter en intégralité et à votre rythme",
    "mixSessions.reco": "",
    "mixSessions.listen": "Ecouter",
    "common.buy": "Acheter",

    "replays.title": "Replays",
    "replays.kicker": "Retrouvez les mixes et emissions a ecouter en replay.",
    "replays.play": "Ecouter le replay",
    "replays.playing": "En ecoute",

    "team.title": "L'equipe",
    "team.kicker": "Quatre DJs, une seule regle : jamais la version originale.",
    "team.portrait": "Portrait de",

    "videos.title": "Videos de la semaine",

    "comments.title": "Commentaires",
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
    "nav.mixSessions": "Mix Sessions",
    "nav.replays": "Replays",
    "nav.equipe": "Team",
    "nav.videos": "Videos",
    "nav.comments": "Comments",
    "nav.contact": "Contact",
    "nav.menu": "Menu",
    "nav.close": "Close",

    "hero.kicker": "Paris — 24/7  UTC+2 — Ad free",
    "hero.desc":
      "B Side Radio, new music every day \n The sound but haute couture",
    "hero.listen": "Listen live",
    "hero.listening": "Now playing",
    "hero.which": "Let's chat !",
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

    "about.kicker": "B.SIDE.RADIO.COM",
    "about.title.1": "The sound",
    "about.title.2": "of tomorrows",
    "about.title.3": "remixed today!",
    "about.p1":
      "You can listen to BSide Radio 7 days a week, anywhere in the world.\n Every day, we feature the latest in Funky House, Nu-Disco, and Soulful, as well as Jackin' and Tech House.\n BSide Radio also plays exclusively remixes and mashups from the '80s, '90s, and '00s.",
    "about.p2":
      "B.SIDE.RADIO brings you live mixes from four DJs every Friday and Saturday night, as well as a replay of Saturday’s mixes every Sunday afternoon. \n \n The latest in club music is right here!\nTURN UP THE NEW SOUND",
    "about.stat1": "Live",
    "about.stat2": "Adverts",
    "about.stat3": "Resident DJs",

    "player.onair": "On Air",
    "player.liveFrom": "Live from BSide Radio",
    "player.replay": "Replay",
    "player.next": "",
    "player.buy": "Buy",
    "player.pause": "Pause",
    "player.play": "Listen live",
    "player.volume": "Volume",

    "vinyls.title": "Tops of the week",
    "vinyls.kicker":
      "Check out the latest products and stay one step ahead. In collaboration with our partner {{traxsource}}.",
    "vinyls.prev": "Previous vinyls",
    "vinyls.next": "Next vinyls",

    "programme.day": "Day",
    "programme.week": "Week",
    "programme.title.day": "Today's schedule",
    "programme.title.week": "Weekly schedule",
    "programme.kicker": "The daily grid. Live mixes land on Friday and Saturday night.",
    "programme.timeline.prev": "Scroll schedule left",
    "programme.timeline.next": "Scroll schedule right",

    "mixSessions.title": "Mix Sessions",
    "mixSessions.kicker": "Full-length mixes from BSide’s DJs, ready to play whenever you are",
    "mixSessions.reco": "",
    "mixSessions.listen": "Play",
    "common.buy": "Buy",

    "replays.title": "Replays",
    "replays.kicker": "Listen back to recent mixes and shows in full.",
    "replays.play": "Play replay",
    "replays.playing": "Now playing",

    "team.title": "The crew",
    "team.kicker": "Four DJs, one rule: never the original version.",
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
