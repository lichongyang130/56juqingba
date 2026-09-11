// Section 18 — retention maths and dates, kept out of components so both the
// client panels and the copy handler agree on one definition.
//
// Everything here is pure: it takes dates and arrays, returns numbers and
// strings. The storage keys live here too, so a page can name the key it
// writes without importing a client bundle.

export const COPY_LOG_KEY = "motif:copy-log";
export const STREAK_OPTIN_KEY = "motif:streak-optin";
export const SHIPPED_KEY = "motif:shipped";
export const REMINDER_KEY = "motif:reminder";
export const REMINDER_SNOOZE_KEY = "motif:reminder-snooze";
export const COMMUNITY_DAY_KEY = "motif:community-day";
export const COPY_EVENT = "motif:copy";
export const SHIPPED_EVENT = "motif:shipped-changed";

export interface CopyEntry {
  slug: string;
  title: string;
  /** Local calendar day, YYYY-MM-DD — not UTC, because "did I build today" is a local question. */
  day: string;
}

/** The viewer's local calendar day. `toISOString()` would answer in UTC and tell half the world the wrong date after 09:00 JST. */
export const localDay = (ms: number = Date.now()): string => {
  const d = new Date(ms);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

export const dayBefore = (iso: string): string => {
  const [y, m, d] = iso.split("-").map(Number);
  const t = Date.UTC(y, m - 1, d) - 24 * 60 * 60 * 1000;
  return new Date(t).toISOString().slice(0, 10);
};

export interface Streak {
  current: number;
  longest: number;
  /** Distinct days with at least one copy, newest first. */
  days: string[];
  last: string | null;
}

/**
 * Current streak counts back from today, or from yesterday when today is still
 * empty — a streak that dies at midnight would be a worse habit tracker than
 * none. The moment two days are missed it resets, and the longest streak is
 * kept separately so the number can never look better than the log.
 */
export function streakFrom(days: string[], today: string = localDay()): Streak {
  const unique = [...new Set(days)].sort((a, b) => (a < b ? 1 : -1));
  if (!unique.length) return { current: 0, longest: 0, days: unique, last: null };

  let current = 0;
  let cursor = unique[0] === today ? today : dayBefore(today);
  if (unique.includes(cursor)) {
    while (unique.includes(cursor)) {
      current += 1;
      cursor = dayBefore(cursor);
    }
  }

  let longest = 1;
  let run = 1;
  for (let i = 1; i < unique.length; i += 1) {
    run = unique[i] === dayBefore(unique[i - 1]) ? run + 1 : 1;
    if (run > longest) longest = run;
  }

  return { current, longest: Math.max(longest, current), days: unique, last: unique[0] };
}

/** The last `n` local days, oldest first — the calendar strip, computed rather than stored. */
export function lastDays(n: number, today: string = localDay()): string[] {
  const out: string[] = [];
  let cursor = today;
  for (let i = 0; i < n; i += 1) {
    out.push(cursor);
    cursor = dayBefore(cursor);
  }
  return out.reverse();
}

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const weekdayOf = (iso: string): string => {
  const [y, m, d] = iso.split("-").map(Number);
  return WEEKDAY[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
};

export const shortDay = (iso: string): string => iso.slice(8);

/* ---------------------------------------------------------------- dates */

/** ISO week number, used to rotate weekly themes without a table of dates. */
export function isoWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/** The next Thursday on or after `from` — community day, computed rather than listed. */
export function nextThursday(from: Date = new Date()): Date {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const delta = (4 - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + delta);
  return d;
}

export interface Window {
  label: string;
  openIso: string;
  closeIso: string;
  theme: string;
}

const DAYS_MS = 24 * 60 * 60 * 1000;

const isoOf = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/**
 * The build-a-thon windows: one per month, open on the 1st and closing on the
 * last day, with a theme that rotates by month index. No hand-maintained
 * calendar, so a window can never be advertised after it has closed.
 */
export function windowsFrom(from: Date, count: number, themes: string[]): Window[] {
  const out: Window[] = [];
  for (let i = 0; i < count; i += 1) {
    const start = new Date(from.getFullYear(), from.getMonth() + i, 1);
    const end = new Date(from.getFullYear(), from.getMonth() + i + 1, 0);
    const monthIndex = start.getFullYear() * 12 + start.getMonth();
    out.push({
      label: start.toLocaleString("en", { month: "long", year: "numeric" }),
      openIso: isoOf(start),
      closeIso: isoOf(end),
      theme: themes[monthIndex % themes.length],
    });
  }
  return out;
}

/** Days between two local days; negative when the target is in the past. */
export function daysBetween(fromIso: string, toIso: string): number {
  const [fy, fm, fd] = fromIso.split("-").map(Number);
  const [ty, tm, td] = toIso.split("-").map(Number);
  return Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / DAYS_MS);
}
