// #462 — the browser-side copy log behind the maker streak.
//
// This is the only place a copy is recorded, and it records nothing unless the
// maker streak is switched on: the opt-in key is checked first, so "off" means
// the handler returns before it reads or writes anything.
//
// One entry per asset per day keeps the log from turning into a keystroke
// history, and it is capped at 120 entries so a year of heavy use cannot quietly
// grow a megabyte of someone's storage.

import { COPY_EVENT, COPY_LOG_KEY, STREAK_OPTIN_KEY, localDay, type CopyEntry } from "@/lib/retention";

const CAP = 120;

export function logCopy(asset: { slug: string; title: string }) {
  try {
    if (window.localStorage.getItem(STREAK_OPTIN_KEY) !== "true") return;
    const raw = window.localStorage.getItem(COPY_LOG_KEY);
    const log = raw ? (JSON.parse(raw) as CopyEntry[]) : [];
    const list = Array.isArray(log) ? log.filter((e) => e && typeof e.day === "string") : [];
    const day = localDay();
    const next = list.some((e) => e.day === day && e.slug === asset.slug)
      ? list
      : [...list, { slug: asset.slug, title: asset.title, day }].slice(-CAP);
    window.localStorage.setItem(COPY_LOG_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(COPY_EVENT));
  } catch {
    /* storage blocked or the log is malformed — a copy still works */
  }
}
