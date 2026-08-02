import { useState, type FormEvent } from "react";
import { Pause, Play, ShoppingBag } from "lucide-react";
import { Section } from "./section";
import { usePlayer } from "./player-context";
import { useI18n, type Lang } from "@/lib/i18n";
import { socials, team, type Show } from "@/lib/bside-data";
import { useSiteContent } from "@/lib/siteContent";

function ShowList({ shows, lang }: { shows: Show[]; lang: Lang }) {
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
      {shows.map((s) => (
        <li
          key={`${s.name}-${s.start}`}
          className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-4 px-4 py-5 transition-colors hover:bg-muted sm:grid-cols-[8rem_14rem_minmax(0,1fr)] sm:gap-8 sm:px-6"
        >
          <span className="font-mono text-xs tracking-[0.15em] text-primary">
            {s.start}—{s.end}
          </span>
          <span className="min-w-0 font-display text-3xl leading-none">{s.name}</span>
          <span className="col-span-2 min-w-0 text-sm text-muted-foreground sm:col-span-1">
            <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground">
              {s.host}
            </span>
            {lang === "en" ? s.blurbEn : s.blurb}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Programme() {
  const [view, setView] = useState<"day" | "week">("day");
  const todayIndex = (new Date().getDay() + 6) % 7;
  const [day, setDay] = useState(todayIndex);
  const { t, lang } = useI18n();
  const { schedule, weekSchedule } = useSiteContent();

  return (
    <Section
      id="programme"
      index="02"
      title={view === "day" ? t("programme.title.day") : t("programme.title.week")}
      kicker={t("programme.kicker")}
    >
      <div className="mb-6 inline-flex rounded-full border border-border bg-surface p-1">
        {(["day", "week"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={`rounded-full px-5 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
              view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {v === "day" ? t("programme.day") : t("programme.week")}
          </button>
        ))}
      </div>

      {view === "week" && (
        <div className="mb-4 flex flex-wrap gap-2">
          {weekSchedule.map((d, i) => (
            <button
              key={d.day}
              type="button"
              onClick={() => setDay(i)}
              className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
                day === i
                  ? "border-primary text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {lang === "en" ? d.dayEn : d.day}
            </button>
          ))}
        </div>
      )}

      <ShowList shows={view === "day" ? schedule : (weekSchedule[day]?.shows ?? schedule)} lang={lang} />
    </Section>
  );
}

export function Tracks() {
  const { playTrack, isCurrent, playing } = usePlayer();
  const { t } = useI18n();
  const { weeklyTracks } = useSiteContent();

  return (
    <Section id="tracks" index="03" title={t("tracks.title")} kicker={t("tracks.kicker")} tone="surface">
      <ul className="grid gap-3 md:grid-cols-2">
        {weeklyTracks.map((tr, i) => {
          const id = `track-${i}`;
          const active = isCurrent(id) && playing;
          return (
            <li
              key={id}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-border bg-background p-4 transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[0_14px_30px_-20px_rgba(0,0,0,0.45)]"
            >
              <button
                type="button"
                onClick={() => playTrack({ id, title: tr.title, artist: tr.artist, src: tr.src })}
                aria-label={`${active ? t("player.pause") : t("tracks.listen")} ${tr.title}`}
                className="grid size-11 shrink-0 place-items-center rounded-full border border-primary text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {active ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
              </button>
              <div className="min-w-0">
                <p className="truncate font-display text-xl leading-tight">{tr.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {tr.artist} · {tr.duration}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-primary">
                  {t("tracks.reco")} {tr.dj}
                </p>
              </div>
              <a
                href={tr.buyUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${t("tracks.buy")} ${tr.title}`}
                className="grid size-10 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <ShoppingBag className="size-4" />
              </a>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

export function Sessions() {
  const { playTrack, isCurrent, playing } = usePlayer();
  const { t } = useI18n();
  const { mixSessions } = useSiteContent();

  return (
    <Section id="sessions" index="04" title={t("sessions.title")} kicker={t("sessions.kicker")}>
      <div className="grid gap-5 md:grid-cols-3">
        {mixSessions.map((m, i) => {
          const id = `mix-${i}`;
          const active = isCurrent(id) && playing;
          return (
            <article
              key={id}
              className="flex flex-col justify-between rounded-3xl border border-border bg-surface p-6 transition-transform hover:-translate-y-1"
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">{m.style}</p>
                <h3 className="mt-3 text-3xl leading-none">{m.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {m.dj} · {m.length}
                </p>
              </div>
              <button
                type="button"
                onClick={() => playTrack({ id, title: m.name, artist: m.dj, src: m.src })}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-primary-foreground transition-transform active:scale-[0.98]"
              >
                {active ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
                {active ? t("sessions.playing") : t("sessions.play")}
              </button>
            </article>
          );
        })}
      </div>
    </Section>
  );
}

export function Team() {
  const { t, lang } = useI18n();
  return (
    <Section id="equipe" index="05" title={t("team.title")} kicker={t("team.kicker")} tone="paper">
      <div className="grid gap-6 sm:grid-cols-3">
        {team.map((m) => (
          <article key={m.name} className="group">
            <div className="overflow-hidden rounded-[1.75rem]">
              <img
                src={m.image}
                alt={`${t("team.portrait")} ${m.name}`}
                width={800}
                height={1000}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
              />
            </div>
            <h3 className="mt-4 text-3xl leading-none">{m.name}</h3>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              {lang === "en" ? m.roleEn : m.role}
            </p>
            <p className="mt-2 text-sm opacity-70">{lang === "en" ? m.bioEn : m.bio}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function Videos() {
  const { t, lang } = useI18n();
  const { videos } = useSiteContent();
  return (
    <Section id="videos" index="06" title={t("videos.title")} tone="surface">
      <div className="grid gap-6 md:grid-cols-3">
        {videos.map((v) => {
          const title = lang === "en" ? v.titleEn : v.title;
          return (
            <figure key={v.id}>
              <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border">
                <iframe
                  src={`https://www.youtube.com/embed/${v.id}`}
                  title={title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="size-full"
                />
              </div>
              <figcaption className="mt-3 font-display text-xl">{title}</figcaption>
            </figure>
          );
        })}
      </div>
    </Section>
  );
}

type Reply = { name: string; message: string; messageEn: string; at: string; atEn: string; staff?: boolean };
type Comment = {
  name: string;
  message: string;
  messageEn?: string;
  at: string;
  atEn?: string;
  replies?: Reply[];
};

function formatCommentDate(value: string, lang: Lang) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

const seedComments: Comment[] = [
  {
    name: "Sandrine",
    message: "Le Klub Time d'hier soir etait enorme, merci LeCyr !",
    messageEn: "Last night's Klub Time was massive, thanks LeCyr!",
    at: "il y a 2 h",
    atEn: "2 h ago",
    replies: [
      {
        name: "LeCyr",
        message: "Merci Sandrine ! Le mix repasse samedi en rediff.",
        messageEn: "Thanks Sandrine! The mix replays on Saturday.",
        at: "il y a 1 h",
        atEn: "1 h ago",
        staff: true,
      },
    ],
  },
  {
    name: "Marco",
    message: "Vous avez le nom du remix de Blue Monday passe ce matin ?",
    messageEn: "Do you have the name of the Blue Monday remix played this morning?",
    at: "hier",
    atEn: "yesterday",
    replies: [
      {
        name: "Eddy",
        message: "C'est le edit de Vandal, dispo dans les tracks de la semaine.",
        messageEn: "It's the Vandal edit, available in the tracks of the week.",
        at: "hier",
        atEn: "yesterday",
        staff: true,
      },
      {
        name: "Marco",
        message: "Parfait, merci beaucoup !",
        messageEn: "Perfect, thanks a lot!",
        at: "hier",
        atEn: "yesterday",
      },
    ],
  },
  {
    name: "Julie",
    message: "Le Wake Up du lundi me sauve la vie chaque semaine.",
    messageEn: "Monday's Wake Up saves my life every week.",
    at: "il y a 2 j",
    atEn: "2 d ago",
  },
  {
    name: "Tom",
    message: "Plus de mashups 90s svp, c'est la meilleure periode !",
    messageEn: "More 90s mashups please, best era ever!",
    at: "il y a 3 j",
    atEn: "3 d ago",
  },
  {
    name: "Nadia",
    message: "Ecoutee depuis Montreal, la qualite du flux est nickel.",
    messageEn: "Listening from Montreal, the stream quality is spot on.",
    at: "il y a 4 j",
    atEn: "4 d ago",
  },
  {
    name: "Pierre-Yves",
    message: "La session de Bart tourne en boucle dans ma voiture.",
    messageEn: "Bart's session is on repeat in my car.",
    at: "il y a 5 j",
    atEn: "5 d ago",
  },
  {
    name: "Lise",
    message: "Possible d'avoir la tracklist des mix sessions ?",
    messageEn: "Could we get the tracklist of the mix sessions?",
    at: "il y a 6 j",
    atEn: "6 d ago",
  },
  {
    name: "Karim",
    message: "Grosse decouverte avec le vinyl de la semaine, merci !",
    messageEn: "Great discovery with the vinyl of the week, thanks!",
    at: "la semaine derniere",
    atEn: "last week",
  },
];

export function Comments() {
  const { comments: liveComments } = useSiteContent();
  const [seededComments] = useState<Comment[]>(seedComments);
  const [pending, setPending] = useState<Comment[]>([]);
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const { t, lang } = useI18n();
  const en = lang === "en";
  const comments = liveComments.length > 0 ? liveComments.map((comment, index) => ({
    name: comment.name,
    message: comment.message,
    messageEn: comment.message,
    at: formatCommentDate(comment.at, lang),
    atEn: formatCommentDate(comment.at, lang),
    replies: index === 0 ? seededComments[0]?.replies : undefined,
  })) : seededComments;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setPending((c) => [{ name: name.trim(), message: message.trim(), at: "" }, ...c]);
    setName("");
    setMessage("");
    setReplyTo(null);
  };

  return (
    <Section id="comments" index="07" title={t("comments.title")} kicker={t("comments.kicker")}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <form onSubmit={submit} className="space-y-3 lg:sticky lg:top-24 lg:self-start">
          {replyTo !== null && comments[replyTo] && (
            <p className="flex items-center justify-between gap-3 rounded-2xl border border-primary/40 bg-primary/10 px-4 py-2 text-xs">
              <span className="truncate">
                {t("comments.replyTo")} {comments[replyTo]!.name}
              </span>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="font-mono text-[10px] uppercase tracking-[0.15em] text-primary"
              >
                {t("comments.cancel")}
              </button>
            </p>
          )}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("comments.name")}
            maxLength={40}
            className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("comments.message")}
            rows={5}
            maxLength={600}
            className="w-full resize-none rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="rounded-full bg-primary px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-primary-foreground"
          >
            {t("comments.send")}
          </button>
          <p className="text-xs text-muted-foreground">{t("comments.moderation")}</p>
          {pending.length > 0 && (
            <ul className="space-y-2 pt-2">
              {pending.map((c, i) => (
                <li
                  key={`pending-${i}`}
                  className="rounded-2xl border border-dashed border-primary/50 bg-surface/60 p-4"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-primary">
                    {t("comments.pending")}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{c.message}</p>
                </li>
              ))}
            </ul>
          )}
        </form>
        <div className="min-w-0">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {comments.length} {t("comments.published")}
          </p>
          <ul className="max-h-[32rem] space-y-4 overflow-y-auto rounded-2xl pr-2 [scrollbar-color:var(--color-primary)_transparent] [scrollbar-width:thin]">
            {comments.map((c, i) => (
              <li
                key={`${c.name}-${i}`}
                className="rounded-2xl border border-border border-l-4 border-l-primary bg-surface p-4"
              >
                <p className="flex items-baseline gap-3">
                  <span className="font-display text-xl">{c.name}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    {en ? (c.atEn ?? c.at) : c.at}
                  </span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {en ? (c.messageEn ?? c.message) : c.message}
                </p>
                <button
                  type="button"
                  onClick={() => setReplyTo(i)}
                  className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-primary transition-opacity hover:opacity-70"
                >
                  {t("comments.reply")}
                </button>
                {c.replies && c.replies.length > 0 && (
                  <ul className="mt-3 space-y-3 border-l border-border pl-4">
                    {c.replies.map((r, j) => (
                      <li key={`${r.name}-${j}`}>
                        <p className="flex flex-wrap items-baseline gap-2">
                          <span className="font-display text-lg">{r.name}</span>
                          {r.staff && (
                            <span className="rounded-full bg-primary px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-primary-foreground">
                              {t("comments.staff")}
                            </span>
                          )}
                          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                            {en ? r.atEn : r.at}
                          </span>
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {en ? r.messageEn : r.message}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

export function SocialsFooter() {
  const { t } = useI18n();
  return (
    <footer id="socials" className="px-2 pb-4 pt-2 sm:px-4">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-paper px-5 pb-32 pt-14 text-paper-foreground sm:px-10">
        <h2 className="text-4xl leading-none sm:text-6xl">{t("socials.title")}</h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {socials.map((s) => (
            <li key={s.name}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-2xl border border-paper-foreground/15 p-6 transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <p className="font-display text-2xl leading-none">{s.name}</p>
                <p className="mt-1 truncate font-mono text-[11px] tracking-widest opacity-70">{s.handle}</p>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.2em] opacity-60">
          {t("socials.legal")}
        </p>
      </div>
    </footer>
  );
}
