import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowDown, ArrowUp, Heart, MessageSquarePlus, X } from "lucide-react";
import { SectionManager } from "./section-manager";
import { useI18n, type Lang } from "@/lib/i18n";
import { useSiteContent } from "@/lib/siteContent";
import { likeComment, submitComment, unlikeComment } from "@shared/supabase/content.js";

type Comment = {
  id: string;
  name: string;
  message: string;
  messageEn?: string;
  at: string;
  atEn?: string;
  likes: number;
};

type SortKey = "date" | "likes";
type SortDirection = "asc" | "desc";

type CommentSort = {
  key: SortKey;
  direction: SortDirection;
};

const LIKED_COMMENTS_STORAGE_KEY = "bside-liked-comments";

const sortOptions: { value: SortKey; labelKey: string }[] = [
  { value: "date", labelKey: "comments.sortDate" },
  { value: "likes", labelKey: "comments.sortLikes" },
];

function getCommentVinylIndex(comment: Comment, count: number) {
  const key = `${comment.id}-${comment.name}`;
  const hash = [...key].reduce((total, char) => total + char.charCodeAt(0), 0);

  return count > 0 ? hash % count : 0;
}

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

// seedComments and mixSessions share the same order the site already ships with, newest first.
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
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-border/60 hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-3">
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
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder={t("comments.name")}
            maxLength={40}
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <input
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder={t("comments.email")}
            maxLength={120}
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <textarea
            value={message}
            onChange={(event) => onMessageChange(event.target.value)}
            placeholder={t("comments.message")}
            rows={5}
            maxLength={600}
            className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
          {submitError && <p className="text-xs text-destructive">{submitError}</p>}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <p className="text-xs text-muted-foreground">{t("comments.moderation")}</p>
            <button
              type="submit"
              disabled={isSubmitting}
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
  const [pending, setPending] = useState<Comment[]>([]);
  const [sort, setSort] = useState<CommentSort>({ key: "date", direction: "desc" });
  const [likedIds, setLikedIds] = useState<Set<string>>(() => readLikedIds());
  const [likeOverrides, setLikeOverrides] = useState<Record<string, number>>({});
  const [likingIds, setLikingIds] = useState<Set<string>>(new Set());
  const { t, lang } = useI18n();
  const en = lang === "en";
  const commentProfileVinyls = useMemo(() => vinyls.filter((vinyl) => vinyl.imageUrl), [vinyls]);

  useEffect(() => {
    setLikedIds(readLikedIds());
  }, []);

  // Both sources are already ordered newest first, so "oldest" is simply the reverse.
  const baseComments: Comment[] = isLive
    ? liveComments.map((comment) => ({
      id: comment.id,
      name: comment.name,
      message: comment.message,
      messageEn: comment.message,
      at: formatCommentDate(comment.at, lang),
      atEn: formatCommentDate(comment.at, lang),
      likes: comment.likes,
    }))
    : seedComments;

  function getLikeCount(comment: Comment) {
    return likeOverrides[comment.id] ?? comment.likes;
  }

  function toggleSort(nextKey: SortKey) {
    setSort((current) => ({
      key: nextKey,
      direction: current.key === nextKey && current.direction === "desc" ? "asc" : "desc",
    }));
  }

  const sortedComments = useMemo(() => {
    if (sort.key === "date" && sort.direction === "asc") {
      return [...baseComments].reverse();
    }

    if (sort.key === "likes") {
      return [...baseComments].sort((a, b) => {
        const diff = getLikeCount(b) - getLikeCount(a);
        return sort.direction === "desc" ? diff : -diff;
      });
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
      if (isLive) {
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
      await submitComment({ authorName: name.trim(), body: message.trim(), email: email.trim() });
      setPending((current) => [
        { id: `pending-${Date.now()}`, name: name.trim(), message: message.trim(), at: "", likes: 0 },
        ...current,
      ]);
      setName("");
      setEmail("");
      setMessage("");
      setIsFormOpen(false);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to submit comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionManager id="comments" index="07" title={t("comments.title")} kicker={t("comments.kicker")}>
      <div className="mx-auto w-full max-w-[var(--comments-max-width)]">

        {/* Comments header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4">

            {/* Published comments counter */}
            <span className="inline-flex h-9 items-center gap-2 rounded-full bg-primary/10 px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              <span className="grid size-5 place-items-center rounded-full bg-primary/20 text-[11px] font-bold leading-none tracking-normal">
                {sortedComments.length}
              </span>
              {t("comments.published")}
            </span>
          </div>

          {/* Add comment button */}
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="cursor-pointer inline-flex h-9 items-center gap-2 rounded-full bg-primary px-5 font-mono text-[11px] uppercase tracking-[0.2em] text-primary-foreground"
          >
            <MessageSquarePlus className="size-4" />
            {t("comments.writeCta")}
          </button>
        </div>

        {/* Sort filters */}
        <div className="mt-4 flex justify-start">
          <div className="cursor-pointer flex items-center gap-4 border-b border-border/70">
          {sortOptions.map((option) => {
            const isActive = sort.key === option.value;
            const SortIcon = isActive && sort.direction === "asc" ? ArrowUp : ArrowDown;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleSort(option.value)}
                className={`cursor-pointer relative inline-flex items-center gap-1.5 pb-2 text-sm font-semibold transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {t(option.labelKey)}
                <SortIcon className="size-3.5" strokeWidth={2.4} />
                <span
                  className={`cursor-pointer absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary transition-opacity ${isActive ? "opacity-100" : "opacity-0"
                    }`}
                />
              </button>
            );
          })}
          </div>
        </div>


        {/* Comments scroll */}
        <div className="mt-4 max-h-[540px] overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:var(--primary)_transparent]">

          {/* Pending comments */}
          {pending.length > 0 && (
            <ul className="mt-4 space-y-2">
              {pending.map((comment) => (
                <li key={comment.id} className="flex items-center gap-4 rounded-2xl border border-dashed border-primary/50 bg-surface/60 p-4">
                  {(() => {
                    const vinyl = commentProfileVinyls[getCommentVinylIndex(comment, commentProfileVinyls.length)];

                    return vinyl ? (
                      <img
                        src={vinyl.imageUrl}
                        alt=""
                        className="size-18 shrink-0 rounded-full object-cover ring-0 ring-primary/20"
                      />
                    ) : null;
                  })()}
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-primary">{t("comments.pending")}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{comment.message}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Published comments list */}
          <ul className="space-y-4">
            {sortedComments.map((comment) => {
              const isLiked = likedIds.has(comment.id);
              const isLiking = likingIds.has(comment.id);
              const profileVinyl = commentProfileVinyls[getCommentVinylIndex(comment, commentProfileVinyls.length)];

              return (
                <li key={comment.id} className="flex items-center gap-4 rounded-2xl border border-border border-l-4 border-l-primary bg-surface p-4">
                  {profileVinyl && (
                    <img
                      src={profileVinyl.imageUrl}
                      alt=""
                      className="size-18 shrink-0 rounded-full object-cover ring-0 ring-border"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-display text-xl">{comment.name}</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground text-primary">
                        {en ? (comment.atEn ?? comment.at) : comment.at}
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {en ? (comment.messageEn ?? comment.message) : comment.message}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleToggleLike(comment)}
                      disabled={isLiking}
                      aria-pressed={isLiked}
                      aria-label={t(isLiked ? "comments.unlike" : "comments.like")}
                      className={`mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors ${isLiked ? "text-primary" : "text-muted-foreground hover:text-primary"
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      <Heart className={`size-3.5 ${isLiked ? "fill-primary" : ""}`} />
                      {getLikeCount(comment)}
                    </button>
                  </div>
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

