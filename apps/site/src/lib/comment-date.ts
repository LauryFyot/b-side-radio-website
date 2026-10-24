import type { Lang } from "./i18n";

export function formatCommentTimestamp(value: string, lang: Lang) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "fr-FR", {
    timeZone: "Europe/Paris",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

export function formatCommentDate(value: string, lang: Lang, now = Date.now()) {
  if (!value) return "";
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return value;
  const elapsed = now - timestamp;
  if (elapsed < -60_000) return formatCommentTimestamp(value, lang);
  const minutes = Math.floor(Math.max(0, elapsed) / 60_000);
  const locale = lang === "en" ? "en-GB" : "fr-FR";
  if (minutes === 0) return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(0, "second");
  const relative = new Intl.RelativeTimeFormat(locale, { numeric: "always" });
  if (minutes < 60) return relative.format(-minutes, "minute");
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return relative.format(-hours, "hour");
  const days = Math.floor(hours / 24);
  if (days === 1) return lang === "en" ? "yesterday" : "hier";
  if (days <= 7) return relative.format(-days, "day");
  if (days < 30) return relative.format(-Math.floor(days / 7), "week");
  if (days < 60) return relative.format(-1, "month");
  return formatCommentTimestamp(value, lang);
}