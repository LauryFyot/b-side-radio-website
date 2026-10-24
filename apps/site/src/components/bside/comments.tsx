import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Heart, MessageSquarePlus, X } from "lucide-react";
import { SectionManager } from "./section-manager";
import { useI18n, type TKey } from "@/lib/i18n";
import { useSiteContent, type SiteCommentReply } from "@/lib/siteContent";
import { trackClarityEvent } from "@/lib/clarity";
import { formatCommentDate, formatCommentTimestamp } from "@/lib/comment-date";
import { likeComment, submitComment, unlikeComment } from "@shared/supabase/content.js";

type Comment = {
  id: string;
  name: string;
  message: string;
  messageEn?: string;
  at: string;
  atEn?: string;
  likes: number;
  isPersisted?: boolean;
  replies?: SiteCommentReply[];
};

type SortKey = "date" | "likes";

const LIKED_COMMENTS_STORAGE_KEY = "bside-liked-comments";

const sortOptions: { value: SortKey; labelKey: TKey }[] = [
  { value: "date", labelKey: "comments.sortRecent" },
  { value: "likes", labelKey: "comments.sortPopular" },
];

function getCommentVinylIndex(comment: Comment, count: number) {
  const key = `${comment.id}-${comment.name}`;
  const hash = [...key].reduce((total, char) => total + char.charCodeAt(0), 0);

  return count > 0 ? hash % count : 0;
}

function readLikedIds(): Set<string> {
  if (typeof window === "undefined") {
    return new Set();
  }

  try {
    const raw = window.localStorage.getItem(LIKED_COMMENTS_STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function persistLikedIds(ids: Set<string>) {
  try {
    window.localStorage.setItem(LIKED_COMMENTS_STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // Storage can be unavailable (private mode, quota); liking still works this session.
  }
}

// seedComments and replays share the same order the site already ships with, newest first.
const seedComments: Comment[] = [
  {
    id: "seed-0",
    name: "Sandrine",
    message: "Le Klub Time d'hier soir etait enorme, merci LeCyr !",
    messageEn: "Last night's Klub Time was massive, thanks LeCyr!",
    at: "il y a 2 h",
    atEn: "2 h ago",
    likes: 6,
  },
  {
    id: "seed-1",
    name: "Marco",
    message: "Vous avez le nom du remix de Blue Monday passe ce matin ?",
    messageEn: "Do you have the name of the Blue Monday remix played this morning?",
    at: "hier",
    atEn: "yesterday",
    likes: 2,
  },
  {
    id: "seed-2",
    name: "Julie",
    message: "Le Wake Up du lundi me sauve la vie chaque semaine.",
    messageEn: "Monday's Wake Up saves my life every week.",
    at: "il y a 2 j",
    atEn: "2 d ago",
    likes: 9,
  },
  {
    id: "seed-3",
    name: "Tom",
    message: "Plus de mashups 90s svp, c'est la meilleure periode !",
    messageEn: "More 90s mashups please, best era ever!",
    at: "il y a 3 j",
    atEn: "3 d ago",
    likes: 4,
  },
  {
    id: "seed-4",
    name: "Nadia",
    message: "Ecoutee depuis Montreal, la qualite du flux est nickel.",
    messageEn: "Listening from Montreal, the stream quality is spot on.",
    at: "il y a 4 j",
    atEn: "4 d ago",
    likes: 1,
  },
  {
    id: "seed-5",
    name: "Pierre-Yves",
    message: "La session de Bart tourne en boucle dans ma voiture.",
    messageEn: "Bart's session is on repeat in my car.",
    at: "il y a 5 j",
    atEn: "5 d ago",
    likes: 3,
  },
  {
    id: "seed-6",
    name: "Lise",
    message: "Possible d'avoir la tracklist des mix sessions ?",
    messageEn: "Could we get the tracklist of the mix sessions?",
    at: "il y a 6 j",
    atEn: "6 d ago",
    likes: 0,
  },
  {
    id: "seed-7",
    name: "Karim",
    message: "Grosse decouverte avec le vinyl de la semaine, merci !",
    messageEn: "Great discovery with the vinyl of the week, thanks!",
    at: "la semaine derniere",
    atEn: "last week",
    likes: 5,
  },
];

// Popup form used to write a new comment; kept local since it only makes sense here.
function CommentFormModal({
  open,
  onClose,
  name,
  email,
  message,
  honeypot,
  isSubmitting,
  submitError,
  onNameChange,
  onEmailChange,
  onMessageChange,
  onHoneypotChange,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  name: string;
  email: string;
  message: string;
  honeypot: string;
  isSubmitting: boolean;
  submitError: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onHoneypotChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
}) {
  const { t } = useI18n();

  if (!open) {
    return null;
  }

  return (

    // Popup
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-3xl bg-surface p-6 text-foreground sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-3xl leading-none">{t("comments.formTitle")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("comments.formKicker")}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("comments.cancel")}
            data-clarity-label="comment-form-close"
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-border/60 hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-3" data-clarity-label="comment-submit">
          {/* Honeypot: hidden from real visitors, bots tend to fill every field. */}
          <input
            type="text"
            value={honeypot}
            onChange={(event) => onHoneypotChange(event.target.value)}
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />
          <input
            id="comment-name"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder={t("comments.name")}
            maxLength={40}
            data-clarity-label="comment-name-focus"
            data-clarity-mask="true"
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <input
            id="comment-email"
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder={t("comments.email")}
            maxLength={120}
            data-clarity-label="comment-email-focus"
            data-clarity-mask="true"
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <textarea
            id="comment-message"
            value={message}
            onChange={(event) => onMessageChange(event.target.value)}
            placeholder={t("comments.message")}
            rows={5}
            maxLength={600}
            data-clarity-label="comment-message-focus"
            data-clarity-mask="true"
            className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
          {submitError && <p className="text-xs text-destructive">{submitError}</p>}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <p className="text-xs text-muted-foreground">{t("comments.moderation")}</p>
            <button
              id="comment-submit-button"
              type="submit"
              disabled={isSubmitting}
              data-clarity-label="comment-submit-button"
              className="rounded-full bg-primary px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-60"
            >
              {isSubmitting ? t("comments.sending") : t("comments.send")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Comments section: published comments from Supabase (or fallback demo data), with a
// popup to post a new one, sort filters, and a like counter per message.
export function Comments() {
  const { comments: liveComments, vinyls } = useSiteContent();
  const isLive = liveComments.length > 0;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submittedComments, setSubmittedComments] = useState<Comment[]>([]);
  const [sort, setSort] = useState<SortKey>("date");
  const [likedIds, setLikedIds] = useState<Set<string>>(() => readLikedIds());
  const [likeOverrides, setLikeOverrides] = useState<Record<string, number>>({});
  const [likingIds, setLikingIds] = useState<Set<string>>(new Set());
  const [now, setNow] = useState(() => Date.now());
  const { t, lang } = useI18n();
  const en = lang === "en";
  const commentProfileVinyls = useMemo(() => vinyls.filter((vinyl) => vinyl.imageUrl), [vinyls]);

  useEffect(() => {
    setLikedIds(readLikedIds());
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  // Both sources are already ordered newest first, so "oldest" is simply the reverse.
  const savedComments: Comment[] = isLive
    ? liveComments.map((comment) => ({
      id: comment.id,
      name: comment.name,
      message: comment.message,
      messageEn: comment.message,
      at: comment.at,
      atEn: comment.atEn,
      likes: comment.likes,
      replies: comment.replies,
      isPersisted: true,
    }))
    : seedComments;
  const baseComments = [...submittedComments, ...savedComments];

  function getLikeCount(comment: Comment) {
    return likeOverrides[comment.id] ?? comment.likes;
  }

  const sortedComments = useMemo(() => {
    if (sort === "likes") {
      return [...baseComments].sort((first, second) => getLikeCount(second) - getLikeCount(first));
    }

    return baseComments;
  }, [baseComments, sort, likeOverrides]);

  async function handleToggleLike(comment: Comment) {
    if (likingIds.has(comment.id)) {
      return;
    }

    const alreadyLiked = likedIds.has(comment.id);
    setLikingIds((current) => new Set(current).add(comment.id));

    try {
      if (comment.isPersisted) {
        const nextCount = alreadyLiked ? await unlikeComment(comment.id) : await likeComment(comment.id);
        setLikeOverrides((current) => ({
          ...current,
          [comment.id]: nextCount ?? Math.max(getLikeCount(comment) + (alreadyLiked ? -1 : 1), 0),
        }));
      } else {
        // Demo data has no backing row; keep the like local to this session only.
        setLikeOverrides((current) => ({
          ...current,
          [comment.id]: Math.max(getLikeCount(comment) + (alreadyLiked ? -1 : 1), 0),
        }));
      }

      setLikedIds((current) => {
        const next = new Set(current);
        if (alreadyLiked) {
          next.delete(comment.id);
        } else {
          next.add(comment.id);
        }
        persistLikedIds(next);
        return next;
      });
    } catch (error) {
      console.warn("Unable to update the like on this comment.", error);
    } finally {
      setLikingIds((current) => {
        const next = new Set(current);
        next.delete(comment.id);
        return next;
      });
    }
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !message.trim() || isSubmitting) return;

    // Bots fill every field, including this one, which stays hidden from real visitors.
    if (honeypot.trim()) {
      setName("");
      setEmail("");
      setMessage("");
      setHoneypot("");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const commentId = await submitComment({ authorName: name.trim(), body: message.trim(), email: email.trim() });
      trackClarityEvent("comment-submit-success");
      const submittedAt = new Date().toISOString();
      setSubmittedComments((current) => [
        {
          id: String(commentId),
          name: name.trim(),
          message: message.trim(),
          at: submittedAt,
          atEn: submittedAt,
          likes: 0,
          isPersisted: true,
        },
        ...current,
      ]);
      setName("");
      setEmail("");
      setMessage("");
      setIsFormOpen(false);
    } catch (error) {
      trackClarityEvent("comment-submit-error");
      setSubmitError(error instanceof Error ? error.message : "Unable to submit comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionManager id="comments" index="06" title={t("comments.title")} kicker={t("comments.kicker")}>
      <div className="mx-auto w-full">
        {/* max-w-[var(--comments-max-width)] */}

        {/* Comments header */}
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-center gap-3 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
            {/* Published comments counter */}
            <span className="col-span-2 inline-flex shrink-0 items-center gap-3 sm:col-span-1">
              <span className="size-2 shrink-0 rounded-full bg-primary shadow-[0_0_0_5px_color-mix(in_oklab,var(--primary)_4%,transparent)]" aria-hidden="true" />
              <span className="relative top-[0.07em] font-display text-3xl leading-none text-foreground">
                {sortedComments.length}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-normal text-muted-foreground">{t("comments.messages")}</span>
            </span>
            {/* Sort filters */}
            <div className="grid h-9 min-w-0 grid-cols-2 rounded-full border border-border bg-surface p-0.5 sm:justify-self-end sm:p-1" role="group" aria-label={t("comments.sortLabel")}>
              {sortOptions.map((option) => {
                const isActive = sort === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSort(option.value)}
                    aria-pressed={isActive}
                    data-clarity-label={`comments-sort-${option.value}`}
                    className={`inline-flex h-full min-w-0 cursor-pointer items-center justify-center rounded-full font-mono text-[9px] uppercase tracking-normal transition-colors sm:px-5 sm:text-[11px] ${isActive ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {t(option.labelKey)}
                  </button>
                );
              })}
            </div>

          {/* Add comment button */}
          <button
            id="comment-open-form"
            type="button"
            onClick={() => setIsFormOpen(true)}
            data-clarity-label="comments-open-form"
            title={t("comments.writeCta")}
            className="inline-flex h-9 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-primary px-2 font-sans text-[11px] uppercase leading-tight tracking-normal text-primary-foreground sm:gap-2 sm:px-5 sm:font-mono sm:tracking-[0.2em]"
          >
            <MessageSquarePlus className="size-4 shrink-0" aria-hidden="true" />
            <span className="min-w-0">{t("comments.writeCta")}</span>
          </button>
        </div>


        {/* Comments scroll */}
        <div className="mt-4 max-h-[540px] overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:var(--primary)_transparent]">

          {/* Published comments list */}
          <ul className="space-y-4">
            {sortedComments.map((comment) => {
              const isLiked = likedIds.has(comment.id);
              const isLiking = likingIds.has(comment.id);
              const profileVinyl = commentProfileVinyls[getCommentVinylIndex(comment, commentProfileVinyls.length)];

              return (
                <li key={comment.id} className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 rounded-3xl border border-border bg-surface px-2 py-2 sm:gap-x-6 sm:px-6 sm:py-4">
                  <div className="relative row-start-1 size-14 self-center sm:size-18" aria-hidden="true">
                    {profileVinyl ? <>
                      <img src={profileVinyl.imageUrl} alt="" className="size-full rounded-full object-cover" />
                      <span className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full bg-primary font-display text-sm leading-none text-primary-foreground ring-[3px] ring-surface sm:size-6 sm:text-base">
                        <span className="relative top-[0.07em]">{[...comment.name.trim()][0]?.toLocaleUpperCase(lang) || "?"}</span>
                      </span>
                    </> : <span className="grid size-full place-items-center rounded-full bg-primary font-display text-2xl leading-none text-primary-foreground">
                      <span className="relative top-[0.07em]">{[...comment.name.trim()][0]?.toLocaleUpperCase(lang) || "?"}</span>
                    </span>}
                  </div>
                  <div className="row-start-1 min-w-0">
                    <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-display text-xl">{comment.name}</span>
                      <time className="font-sans text-[10px] tracking-normal text-primary" dateTime={comment.isPersisted ? comment.at : undefined} title={formatCommentTimestamp(comment.at, lang)}>
                        {formatCommentDate(en ? (comment.atEn ?? comment.at) : comment.at, lang, now)}
                      </time>
                    </p>
                    <p className="mt-1 text-[13px] text-muted-foreground">
                      {en ? (comment.messageEn ?? comment.message) : comment.message}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleLike(comment)}
                      disabled={isLiking}
                      aria-pressed={isLiked}
                      aria-label={t(isLiked ? "comments.unlike" : "comments.like")}
                      data-clarity-label="comment-like"
                      className={`inline-flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors ${isLiked ? "text-primary" : "text-muted-foreground hover:text-primary"
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      <Heart className={`size-3.5 ${isLiked ? "fill-primary" : ""}`} />
                      {getLikeCount(comment)}
                    </button>
                    </div>
                  </div>
                    {Boolean(comment.replies?.length) && <ul className="col-span-2 col-start-1 mt-3 min-w-0 space-y-3 sm:col-span-1 sm:col-start-2" aria-label={en ? "Replies" : "Reponses"}>
                      {comment.replies!.map((reply) => (
                        <li key={reply.id} className="min-w-0 rounded-lg bg-foreground/3 p-4">
                          <div className="flex items-center gap-3">
                            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary font-display text-lg leading-none text-primary-foreground" aria-hidden="true">
                              <span className="relative top-[0.07em]">{[...reply.name.trim()][0]?.toLocaleUpperCase(lang) || "?"}</span>
                            </span>
                            <div className="flex min-w-0 flex-1 flex-col gap-1">
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                <span className="relative top-[0.07em] max-w-full break-words font-display text-lg leading-none">{reply.name}</span>
                                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-primary dark:bg-primary/15 dark:text-red-400">{t("comments.staff")}</span>
                              </div>
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                <time className="font-sans text-[10px] leading-none tracking-normal text-primary" dateTime={reply.createdAt} title={formatCommentTimestamp(reply.createdAt, lang)}>{formatCommentDate(reply.createdAt, lang, now)}</time>
                                {reply.updatedAt !== reply.createdAt && <span className="text-[10px] leading-none text-muted-foreground">{t("comments.edited")}</span>}
                              </div>
                            </div>
                          </div>
                          <p className="mt-2 whitespace-pre-wrap break-words text-[13px] text-muted-foreground">{reply.message}</p>
                        </li>
                      ))}
                    </ul>}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Comment form modal */}
      <CommentFormModal
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        name={name}
        email={email}
        message={message}
        honeypot={honeypot}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onNameChange={setName}
        onEmailChange={setEmail}
        onMessageChange={setMessage}
        onHoneypotChange={setHoneypot}
        onSubmit={submit}
      />
    </SectionManager>
  );
}

