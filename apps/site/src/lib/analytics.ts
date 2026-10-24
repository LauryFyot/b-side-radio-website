// Identifiant du flux GA4 et domaines autorises a envoyer des statistiques.
const GOOGLE_MEASUREMENT_ID = "G-3SNWYSPZ5Z";
const PUBLIC_HOSTNAMES = ["b-side-radio.com", "www.b-side-radio.com"];

// Les appels Clarity peuvent etre mis en attente dans q avant le chargement du traceur.
type TrackingFunction = {
  (...parameters: unknown[]): void;
  q?: IArguments[];
};

// Declare a TypeScript les fonctions globales ajoutees par les deux traceurs.
const analyticsWindow = window as Window & {
  dataLayer?: IArguments[];
  gtag?: TrackingFunction;
  clarity?: TrackingFunction;
};

let initialized = false;

function loadScript(src: string) {
  // Charge le traceur externe sans bloquer l'affichage du site.
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function initGoogleAnalytics() {
  // Conserve les appels GA4 dans dataLayer jusqu'a ce que le script Google soit pret.
  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.gtag = function (...parameters: unknown[]) {
    analyticsWindow.dataLayer!.push(arguments);
  };
  analyticsWindow.gtag("js", new Date());
  // Configure la mesure de frequentation ; les interactions sont branchees separement.
  analyticsWindow.gtag("config", GOOGLE_MEASUREMENT_ID);
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_MEASUREMENT_ID}`);
}

function sendClarityEvent(label: unknown) {
  // Le libelle devient le nom de l'evenement visible dans Clarity.
  if (typeof label === "string" && label && typeof analyticsWindow.clarity === "function") {
    analyticsWindow.clarity("event", label);
  }
}

function initClarity(projectId: string) {
  // Met les evenements en attente pendant le chargement du script Clarity.
  analyticsWindow.clarity = analyticsWindow.clarity || function (...parameters: unknown[]) {
    const queue = analyticsWindow.clarity!.q ||= [];
    queue.push(arguments);
  };
  loadScript(`https://www.clarity.ms/tag/${projectId}`);
}

function sendGoogleEvent(name: string, parameters: Record<string, string> = {}) {
  analyticsWindow.gtag?.("event", name, parameters);
}

function initInteractionTracking() {
  // Reutilise les signaux des composants pour comparer les memes actions dans les deux outils.
  // Ces evenements restent disponibles dans GA4 meme si Clarity n'est pas configure.
  const googleEvents: Record<string, string> = {
    "radio-play-start": "radio_play",
    "radio-pause": "radio_pause",
    "radio-play-error": "radio_error",
    "mix-play-start": "mix_play",
    "mix-pause": "mix_pause",
    "mix-play-complete": "mix_complete",
    "mix-play-error": "mix_error",
    "comment-submit-success": "comment_submit_success",
    "comment-submit-error": "comment_submit_error",
  };

  window.addEventListener("bside-clarity-event", (event) => {
    const label = (event as CustomEvent<unknown>).detail;
    sendClarityEvent(label);
    if (typeof label !== "string") return;
    const name = googleEvents[label];
    if (name) {
      sendGoogleEvent(name, label.startsWith("radio-") ? { station_name: "B Side Radio" } : {});
    }
  });

  const playerLocations: Record<string, string> = {
    "player-toggle-hero": "hero",
    "player-toggle-bar": "player_bar",
    "mix-play": "mix_sessions",
  };

  // La capture lit l'etat du bouton avant que React ne bascule lecture/pause.
  // closest retrouve aussi le lien ou bouton lors d'un clic sur son image ou son icone.
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const element = target.closest("[data-clarity-label]");
    if (element && !element.matches("input, textarea, select")) {
      const label = element.getAttribute("data-clarity-label");
      sendClarityEvent(label);
      const location = label ? playerLocations[label] : undefined;
      if (location && element.matches("button:not(:disabled)")) {
        sendGoogleEvent("player_click", {
          button_location: location,
          button_id: element.id,
          player_action: element.getAttribute("aria-pressed") === "true" ? "pause" : "play",
        });
      }
    }

    // Verifie le domaine reel : un autre site contenant "traxsource.com" ne compte pas.
    const link = target.closest("a[href]");
    if (!(link instanceof HTMLAnchorElement)) return;
    const url = new URL(link.href);
    if (url.hostname !== "traxsource.com" && !url.hostname.endsWith(".traxsource.com")) return;
    const isPlayer = link.id === "partner-traxsource-player";
    const section = link.closest("section[id]")?.id;
    sendGoogleEvent("traxsource_click", {
      button_location: isPlayer ? "player_bar" : section === "top" ? "hero" : section || "other",
      link_type: isPlayer || link.closest("li") ? "purchase" : "partnership",
    });
  }, { capture: true });

  // Suit l'entree dans les champs marques, sans envoyer leur contenu.
  document.addEventListener("focusin", (event) => {
    const target = event.target;
    if (!(target instanceof Element) || !target.matches("input[data-clarity-label], textarea[data-clarity-label], select[data-clarity-label]")) return;
    sendClarityEvent(target.getAttribute("data-clarity-label"));
  });

  // Mesure la soumission du formulaire, pas le succes de son traitement.
  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (form instanceof HTMLFormElement) {
      sendClarityEvent(form.getAttribute("data-clarity-label"));
    }
  });
}

export function initAnalytics(clarityProjectId?: string) {
  // Exclut localhost, les previews et les chemins /admin et /dev du suivi.
  const isPublicProduction =
    window.location.protocol === "https:" &&
    PUBLIC_HOSTNAMES.includes(window.location.hostname) &&
    !/^\/(?:admin|dev)(?:\/|$)/i.test(window.location.pathname);

  // Evite de charger les scripts et d'enregistrer les ecouteurs plusieurs fois.
  if (initialized || !isPublicProduction) return;
  initialized = true;

  initGoogleAnalytics();
  // Sans VITE_CLARITY_PROJECT_ID_SITE configure au build, les evenements vont seulement a GA4.
  const projectId = clarityProjectId?.trim();
  if (projectId) initClarity(projectId);
  initInteractionTracking();
}