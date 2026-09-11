"use client";

// Section 18 (second half) — the opt-in habits.
//
// The rule for this file: nothing is recorded until a switch is on, every
// panel names the key it writes, and no panel pretends to be a notification.
// A static site cannot email you, cannot push, and cannot know what you did
// elsewhere — so the copy says that instead of implying a service.

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { COMPONENTS } from "@/lib/data";
import {
  COMMUNITY_DAY_KEY,
  COPY_EVENT,
  COPY_LOG_KEY,
  REMINDER_KEY,
  REMINDER_SNOOZE_KEY,
  SHIPPED_EVENT,
  SHIPPED_KEY,
  STREAK_OPTIN_KEY,
  daysBetween,
  isoWeek,
  lastDays,
  localDay,
  nextThursday,
  shortDay,
  streakFrom,
  weekdayOf,
  windowsFrom,
  type CopyEntry,
} from "@/lib/retention";

type Rating = "shipped" | "waiting";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage blocked — the panel still works for this visit */
  }
}

/* ===================================================================
   #462 — streak for makers
   =================================================================== */

export function StreakBoard() {
  const [optIn, setOptIn] = useState<boolean | null>(null);
  const [log, setLog] = useState<CopyEntry[]>([]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setOptIn(read<boolean>(STREAK_OPTIN_KEY, false));
      setLog(read<CopyEntry[]>(COPY_LOG_KEY, []));
    });
    const sync = () => setLog(read<CopyEntry[]>(COPY_LOG_KEY, []));
    window.addEventListener(COPY_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener(COPY_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = () => {
    const next = !(optIn ?? false);
    setOptIn(next);
    write(STREAK_OPTIN_KEY, next);
    if (!next) {
      write(COPY_LOG_KEY, []);
      setLog([]);
    }
  };

  const today = localDay();
  const streak = useMemo(() => streakFrom(log.map((l) => l.day), today), [log, today]);
  const strip = useMemo(() => lastDays(28, today), [today]);
  const copiedToday = log.some((l) => l.day === today);
  const logged = new Set(streak.days);

  return (
    <div className="rounded-3xl border border-white/8 bg-panel p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-200">Maker streak</p>
          <p className="mt-1 text-2xl font-black tabular-nums tracking-tight">
            {optIn === null ? "–" : streak.current}
            <span className="text-sm font-bold text-ink-faint"> day{streak.current === 1 ? "" : "s"}</span>
          </p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-[11px] text-ink-dim">
          <input
            type="checkbox"
            checked={optIn ?? false}
            onChange={toggle}
            disabled={optIn === null}
            className="h-3.5 w-3.5"
          />
          {optIn ? "Recording days locally" : "Off — nothing is recorded"}
        </label>
      </div>

      <div className="mt-4 flex gap-[3px]">
        {strip.map((d) => {
          const on = logged.has(d);
          const isToday = d === today;
          return (
            <span key={d} className="flex-1">
              <span
                title={`${weekdayOf(d)} ${d}${on ? " · copied something" : " · nothing logged"}`}
                className={`block h-6 rounded-sm ${on ? "bg-amber-300/70" : "bg-white/6"} ${isToday ? "ring-1 ring-amber-200/70" : ""}`}
              />
            </span>
          );
        })}
      </div>
      <div className="mt-1 flex justify-between text-[9px] uppercase tracking-widest text-ink-faint">
        <span>28 days ago</span>
        <span>today</span>
      </div>

      <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
        {optIn === null ? (
          <>Reading this browser&apos;s copy log…</>
        ) : optIn ? (
          <>
            A day counts when you copy an asset or a prompt on any Motif page. {streak.last ? `Last logged day: ${streak.last}` : "Nothing logged yet."}{" "}
            Longest run so far: {streak.longest} day{streak.longest === 1 ? "" : "s"}. {copiedToday ? "Today is already on the board." : "Today is still open."}{" "}
            Turning the switch off clears <span className="font-mono">motif:copy-log</span>.
          </>
        ) : (
          <>
            Off by default, and off means off: with the switch in this position the copy handler does not write anything, so there is no log for us to
            read and none for you to clear. Streaks are how retention features get pushy — this one stays a drawer you open.
          </>
        )}
      </p>
    </div>
  );
}

/* ===================================================================
   #464 — rate your build
   =================================================================== */

export function RateYourBuild() {
  const [log, setLog] = useState<CopyEntry[] | null>(null);
  const [ratings, setRatings] = useState<Record<string, Rating>>({});

  useEffect(() => {
    const sync = () => {
      setLog(read<CopyEntry[]>(COPY_LOG_KEY, []));
      setRatings(read<Record<string, Rating>>(SHIPPED_KEY, {}));
    };
    sync();
    window.addEventListener(COPY_EVENT, sync);
    window.addEventListener(SHIPPED_EVENT, sync);
    return () => {
      window.removeEventListener(COPY_EVENT, sync);
      window.removeEventListener(SHIPPED_EVENT, sync);
    };
  }, []);

  const recent = useMemo(() => {
    const seen = new Set<string>();
    return (log ?? [])
      .filter((e) => (seen.has(e.slug) ? false : (seen.add(e.slug), true)))
      .slice(0, 4);
  }, [log]);

  const rate = (slug: string, value: Rating) => {
    const next = { ...ratings, [slug]: value };
    setRatings(next);
    write(SHIPPED_KEY, next);
    window.dispatchEvent(new Event(SHIPPED_EVENT));
  };

  const yes = Object.values(ratings).filter((v) => v === "shipped").length;
  const no = Object.values(ratings).filter((v) => v === "waiting").length;

  return (
    <div className="rounded-3xl border border-white/8 bg-panel p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-200">Did this ship?</p>
          <p className="mt-1 text-sm font-extrabold tracking-tight">A one-tap check-in after a copy</p>
        </div>
        <p className="text-[11px] tabular-nums text-ink-dim">
          {yes} shipped · {no} waiting
        </p>
      </div>

      {log === null ? (
        <p className="mt-3 text-[10px] text-ink-faint">Reading this browser&apos;s copy log…</p>
      ) : recent.length === 0 ? (
        <p className="mt-3 text-[11px] leading-relaxed text-ink-dim">
          Nothing to ask about yet. Turn on the maker streak, copy something from the library, and the things you copied show up here to be
          marked shipped or waiting — the browser tells the page, not us.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {recent.map((entry) => {
            const asset = COMPONENTS.find((c) => c.slug === entry.slug);
            const rating = ratings[entry.slug];
            return (
              <li key={entry.slug} className="flex flex-wrap items-center gap-2 rounded-xl border border-white/8 bg-white/[.02] px-3 py-2">
                <Link href={asset ? `/components/${entry.slug}` : "/components"} className="min-w-0 flex-1 truncate text-[11px] font-semibold hover:underline">
                  {entry.title}
                </Link>
                <span className="font-mono text-[10px] text-ink-faint">{entry.day}</span>
                {(["shipped", "waiting"] as Rating[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => rate(entry.slug, value)}
                    aria-pressed={rating === value}
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold transition-colors ${
                      rating === value
                        ? value === "shipped"
                          ? "border-emerald-300/60 bg-emerald-400/15 text-emerald-100"
                          : "border-amber-300/60 bg-amber-400/15 text-amber-100"
                        : "border-white/12 text-ink-faint hover:text-ink"
                    }`}
                  >
                    {value === "shipped" ? "Shipped" : "Still waiting"}
                  </button>
                ))}
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
        Answers live in <span className="font-mono">motif:shipped</span> and go nowhere. There is no star rating, no review box and no follow-up:
        the point of the question is the pause it creates between copying and shipping, not a dataset for us.
      </p>
    </div>
  );
}

/* ===================================================================
   #465 — quiet reminders
   =================================================================== */

export function QuietReminder() {
  const [saved, setSaved] = useState<{ slug: string; title: string }[] | null>(null);
  const [ratings, setRatings] = useState<Record<string, Rating>>({});
  const [on, setOn] = useState<boolean | null>(null);
  const [snoozed, setSnoozed] = useState(false);

  useEffect(() => {
    const sync = () => {
      const stars = read<{ slug: string; title: string; kind: string }[]>("motif:stars", []);
      setSaved(Array.isArray(stars) ? stars.filter((s) => s && typeof s.slug === "string") : []);
      setRatings(read<Record<string, Rating>>(SHIPPED_KEY, {}));
      setOn(read<boolean>(REMINDER_KEY, false));
      const until = read<string>(REMINDER_SNOOZE_KEY, "");
      setSnoozed(Boolean(until) && daysBetween(localDay(), until) > 0);
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(SHIPPED_EVENT, sync);
    window.addEventListener("motif:stars-changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(SHIPPED_EVENT, sync);
      window.removeEventListener("motif:stars-changed", sync);
    };
  }, []);

  const unshipped = useMemo(
    () => (saved ?? []).filter((s) => ratings[s.slug] !== "shipped"),
    [saved, ratings],
  );

  const toggle = () => {
    const next = !(on ?? false);
    setOn(next);
    write(REMINDER_KEY, next);
    if (!next) write(REMINDER_SNOOZE_KEY, "");
  };

  const showNudge = on === true && !snoozed && unshipped.length >= 2;

  return (
    <div className={`rounded-3xl border p-5 ${showNudge ? "border-amber-300/30 bg-amber-400/[.05]" : "border-white/8 bg-panel"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-200">Quiet reminder</p>
          <p className="mt-1 text-sm font-extrabold tracking-tight">
            {on === null
              ? "An optional nudge, one line, when you come back."
              : on
                ? "On — at most one line, on a visit, and never anywhere else."
                : "Off — you will not be nudged."}
          </p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-[11px] text-ink-dim">
          <input type="checkbox" checked={on ?? false} onChange={toggle} disabled={on === null} className="h-3.5 w-3.5" />
          {on ? "Nudge me on a return visit" : "No nudges"}
        </label>
      </div>

      {showNudge ? (
        <div className="mt-3 rounded-2xl border border-amber-300/30 bg-black/25 px-4 py-3">
          <p className="text-[12px] font-bold tracking-tight">
            {unshipped.length} saved pieces are still marked waiting
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-ink-dim">
            That is the entire reminder: no badge count, no email, no push. Snooze it for a week and this box disappears on every page.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Link href="/saved" className="btn btn-ghost !px-3 !py-1.5 text-[10px]">
              Open the saved list
            </Link>
            <button
              type="button"
              onClick={() => {
                const until = new Date(Date.now() + 7 * 86400000);
                write(REMINDER_SNOOZE_KEY, `${until.getFullYear()}-${String(until.getMonth() + 1).padStart(2, "0")}-${String(until.getDate()).padStart(2, "0")}`);
                setSnoozed(true);
              }}
              className="btn btn-ghost !px-3 !py-1.5 text-[10px]"
            >
              Snooze a week
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
          {on === null
            ? "Reading this browser's reminder setting…"
            : !on
              ? "This site has no email list and no notifications permission, so a reminder can only exist while a page is open — which makes 'quiet' the honest default rather than a setting we hide."
              : snoozed
                ? "Snoozed. The nudge returns once the snooze date has passed, and only if two or more saved pieces are still waiting."
                : `Waiting on ${unshipped.length} item${unshipped.length === 1 ? "" : "s"} — the nudge appears once two are still marked waiting.`}
        </p>
      )}
      <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">
        Setting: <span className="font-mono">motif:reminder</span> · snooze date: <span className="font-mono">motif:reminder-snooze</span>. Both are
        browser keys you can delete, and neither is read by anything except this panel.
      </p>
    </div>
  );
}

/* ===================================================================
   #463 — build-a-thon calendar
   =================================================================== */

const THEMES = [
  "One-screen hero",
  "A form that apologises",
  "Motion under 200 ms",
  "A dark-mode-first page",
  "Numbers without a chart library",
  "One asset, three densities",
  "Keyboard-only flow",
  "A print-friendly build",
  "Reduced-motion first",
  "A page under 60 KB",
];

export function BuildAThonCalendar({ today }: { today: string }) {
  // The schedule is computed from today's date, so the window that is open is
  // the window that is actually open — no hand-maintained list to go stale.
  const [now, setNow] = useState(today);
  const windows = useMemo(() => windowsFrom(new Date(`${now}T12:00:00`), 3, THEMES), [now]);
  const open = windows.find((w) => now >= w.openIso && now <= w.closeIso) ?? windows[0];
  const daysLeft = daysBetween(now, open.closeIso);

  useEffect(() => {
    // Client clock, named as such: the server rendered the date it was built.
    const raf = requestAnimationFrame(() => setNow(localDay()));
    return () => cancelAnimationFrame(raf);
  }, []);

  const progress = Math.max(
    0,
    Math.min(100, Math.round(((daysBetween(open.openIso, now) + 1) / (daysBetween(open.openIso, open.closeIso) + 1)) * 100)),
  );

  return (
    <div>
      <div className="rounded-3xl border border-violet-300/25 bg-violet-400/[.05] p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-violet-200">Open now</p>
            <p className="mt-1 text-lg font-extrabold tracking-tight">{open.theme}</p>
            <p className="mt-0.5 font-mono text-[11px] text-ink-dim">
              {open.openIso} → {open.closeIso} · {open.label}
            </p>
          </div>
          <p className="text-right">
            <span className="block font-mono text-3xl font-black tabular-nums">{daysLeft}</span>
            <span className="text-[10px] uppercase tracking-widest text-ink-faint">day{daysLeft === 1 ? "" : "s"} left</span>
          </p>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/8">
          <span className="block h-full rounded-full bg-violet-400/80" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">
          {progress}% through the window. The countdown is computed from your own clock; the server rendered {today} when this page was built, and
          the dates above are arithmetic on the month, not a list someone forgot to update.
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {windows.map((w, i) => {
          const isOpen = now >= w.openIso && now <= w.closeIso;
          return (
            <div key={w.openIso} className="rounded-2xl border border-white/8 bg-panel p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip !text-[9px] uppercase">{isOpen ? "open now" : i === 1 ? "next month" : "after that"}</span>
                <span className="text-[12px] font-bold tracking-tight">{w.theme}</span>
                <span className="ml-auto font-mono text-[10px] text-ink-faint">
                  {w.openIso} → {w.closeIso}
                </span>
              </div>
              <p className="mt-1.5 text-[10px] leading-relaxed text-ink-dim">
                {isOpen
                  ? `Closes on ${w.closeIso}. There is no submission form and no leaderboard: build it, then link it wherever you normally post.`
                  : `Opens on ${w.openIso}. The theme rotates by month, so a challenge cannot be announced after it has already closed.`}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ===================================================================
   #466 — community day
   =================================================================== */

const COMMUNITY_THEMES = [
  "Bring one keyboard flow you can complete without a mouse",
  "Show a component with prefers-reduced-motion honoured",
  "Post a before/after of a real size reduction",
  "Publish the empty state, not the demo state",
  "Share a failure: what broke and what you changed",
];

export function CommunityDay({ today }: { today: string }) {
  const [now, setNow] = useState(today);
  const [awarded, setAwarded] = useState<string | null | undefined>(undefined);

  const thursday = useMemo(() => {
    const d = nextThursday(new Date(`${now}T12:00:00`));
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, [now]);

  const weekKey = useMemo(() => `${new Date(`${thursday}T12:00:00`).getFullYear()}-W${isoWeek(new Date(`${thursday}T12:00:00`))}`, [thursday]);
  const theme = COMMUNITY_THEMES[isoWeek(new Date(`${thursday}T12:00:00`)) % COMMUNITY_THEMES.length];
  const isToday = thursday === now;

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setNow(localDay());
      setAwarded(read<string | null>(COMMUNITY_DAY_KEY, null));
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const days = daysBetween(now, thursday);

  return (
    <div className="rounded-3xl border border-cyan-300/25 bg-cyan-400/[.05] p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-200">Community day · every Thursday</p>
          <p className="mt-1 text-lg font-extrabold tracking-tight">{theme}</p>
          <p className="mt-0.5 font-mono text-[11px] text-ink-dim">
            {thursday} · {weekKey} · {isToday ? "today" : `in ${days} day${days === 1 ? "" : "s"}`}
          </p>
        </div>
        {awarded === weekKey ? (
          <span className="chip !border-cyan-300/50 !bg-cyan-400/15 !text-cyan-100">sticker claimed</span>
        ) : (
          <button
            type="button"
            onClick={() => {
              const v = awarded === weekKey ? null : weekKey;
              setAwarded(v);
              write(COMMUNITY_DAY_KEY, v);
            }}
            disabled={awarded === undefined}
            className="btn btn-ghost !px-3 !py-1.5 text-[10px]"
          >
            I took part
          </button>
        )}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-ink-dim">
        The theme and the date are computed from the calendar — Thursday, then the ISO week number picks the prompt — so there is no moderator
        deciding on the day. Posting happens wherever you already post; this page has no feed and cannot see your work, which is why the button
        above says &ldquo;took part&rdquo; rather than &ldquo;submitted&rdquo;.
      </p>
      <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">
        {awarded === undefined
          ? "Reading this browser's sticker…"
          : awarded === weekKey
            ? `Sticker stored in ` 
            : "No sticker for this week yet. "}
        {awarded !== undefined && <span className="font-mono">motif:community-day</span>}
        {awarded !== undefined &&
          ` — one local badge per week, awarded by your own click. We cannot verify participation and the panel does not pretend to: a sticker here is a note to yourself, not a certificate.`}
      </p>
      <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">
        Twenty-eight days from today, read the local streak drawer on the habits page — the two dates come from the same clock.
      </p>
    </div>
  );
}

/* ===================================================================
   shared: a small day header used by both habit pages
   =================================================================== */

export function TodayLine({ today }: { today: string }) {
  return (
    <p className="font-mono text-[10px] text-ink-faint">
      {weekdayOf(today)} {shortDay(today)} · server rendered {today}
    </p>
  );
}
