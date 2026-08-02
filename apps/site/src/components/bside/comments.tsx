import { useState, type FormEvent } from "react";
import { SectionManager } from "./section-manager";
import { useI18n, type Lang } from "@/lib/i18n";
import { useSiteContent } from "@/lib/siteContent";

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
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(lang === "en" ? "en-US" : "fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
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

// Comments section: local form state plus published comments from Supabase when available.
export function Comments() {
  const { comments: liveComments } = useSiteContent();
  const [seededComments] = useState<Comment[]>(seedComments);
  const [pending, setPending] = useState<Comment[]>([]);
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const { t, lang } = useI18n();
  const en = lang === "en";
  const comments = liveComments.length > 0
    ? liveComments.map((comment, index) => ({
        name: comment.name,
        message: comment.message,
        messageEn: comment.message,
        at: formatCommentDate(comment.at, lang),
        atEn: formatCommentDate(comment.at, lang),
        replies: index === 0 ? seededComments[0]?.replies : undefined,
      }))
    : seededComments;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setPending((current) => [{ name: name.trim(), message: message.trim(), at: "" }, ...current]);
    setName("");
    setMessage("");
    setReplyTo(null);
  };

  return (
    <SectionManager id="comments" index="07" title={t("comments.title")} kicker={t("comments.kicker")}>
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
            onChange={(event) => setName(event.target.value)}
            placeholder={t("comments.name")}
            maxLength={40}
            className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
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
              {pending.map((comment, index) => (
                <li
                  key={`pending-${index}`}
                  className="rounded-2xl border border-dashed border-primary/50 bg-surface/60 p-4"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-primary">
                    {t("comments.pending")}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{comment.message}</p>
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
            {comments.map((comment, index) => (
              <li
                key={`${comment.name}-${index}`}
                className="rounded-2xl border border-border border-l-4 border-l-primary bg-surface p-4"
              >
                <p className="flex items-baseline gap-3">
                  <span className="font-display text-xl">{comment.name}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    {en ? (comment.atEn ?? comment.at) : comment.at}
                  </span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {en ? (comment.messageEn ?? comment.message) : comment.message}
                </p>
                <button
                  type="button"
                  onClick={() => setReplyTo(index)}
                  className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-primary transition-opacity hover:opacity-70"
                >
                  {t("comments.reply")}
                </button>
                {comment.replies && comment.replies.length > 0 && (
                  <ul className="mt-3 space-y-3 border-l border-border pl-4">
                    {comment.replies.map((reply, replyIndex) => (
                      <li key={`${reply.name}-${replyIndex}`}>
                        <p className="flex flex-wrap items-baseline gap-2">
                          <span className="font-display text-lg">{reply.name}</span>
                          {reply.staff && (
                            <span className="rounded-full bg-primary px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-primary-foreground">
                              {t("comments.staff")}
                            </span>
                          )}
                          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                            {en ? reply.atEn : reply.at}
                          </span>
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {en ? reply.messageEn : reply.message}
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
    </SectionManager>
  );
}
