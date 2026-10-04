import type { Show } from "@/lib/bside-data";

function parseTimeToMinutes(value: string) {
  const [hours = "0", minutes = "0"] = value.split(":");
  return Number(hours) * 60 + Number(minutes);
}

function getParisTimeParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Paris",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "Mon";
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);
  const weekdays: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };

  return { dayOfWeek: weekdays[weekday] ?? 1, minutes: hour * 60 + minute };
}

function showMatchesParisTime(show: Show, dayOfWeek: number, minutes: number) {
  const start = parseTimeToMinutes(show.start);
  const end = parseTimeToMinutes(show.end);

  if (start < end) {
    return (show.dayOfWeek === undefined || show.dayOfWeek === dayOfWeek) && minutes >= start && minutes < end;
  }

  return (
    (show.dayOfWeek === undefined || show.dayOfWeek === dayOfWeek) && minutes >= start
  ) || (
    (show.dayOfWeek === undefined || show.dayOfWeek === (dayOfWeek === 1 ? 7 : dayOfWeek - 1)) && minutes < end
  );
}

export function findCurrentShow(shows: Show[], date: Date) {
  const { dayOfWeek, minutes } = getParisTimeParts(date);
  return shows.find((show) => showMatchesParisTime(show, dayOfWeek, minutes)) ?? null;
}