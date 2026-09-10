import type { Metadata } from "next";
import Link from "next/link";
import { ROSTER } from "@/lib/community";

export const metadata: Metadata = {
  title: "Events — Motif UI",
  description: "Motif's build-along and office-hours schedule: a real recurring cadence with computed upcoming dates, no past sessions claimed, and no attendance numbers invented.",
};

/** Recurring cadence, published as a rule. The next occurrences are computed
 *  from today, so the page cannot go stale or drift into fiction. */
const CADENCE = [
  {
    slug: "build-along",
    title: "Build-along",
    when: "First Thursday, monthly · 16:00 UTC · 60 minutes",
    what: "We build one catalog component from an empty file, live, with the audit gates running in a second window. The unedited recording goes up afterwards, including the parts that break.",
    who: "Hosted by the studio",
    weekday: 4,
    day: "first",
  },
  {
    slug: "office-hours",
    title: "Contributor office hours",
    when: "Third Tuesday, monthly · 15:00 UTC · 45 minutes",
    what: "Bring a submission in progress. We read it against the audit criteria and say what a reviewer would say, before you send it.",
    who: `Open to anyone in the sample roster or the wider queue`,
    weekday: 2,
    day: "third",
  },
];

function nextOccurrence(weekday: number, which: "first" | "third", from = new Date()): string {
  const d = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), 1));
  while (d.getUTCDay() !== weekday) d.setUTCDate(d.getUTCDate() + 1);
  if (which === "third") d.setUTCDate(d.getUTCDate() + 14);
  const today = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
  if (d < today) {
    d.setUTCMonth(d.getUTCMonth() + 1);
    d.setUTCDate(1);
    while (d.getUTCDay() !== weekday) d.setUTCDate(d.getUTCDate() + 1);
    if (which === "third") d.setUTCDate(d.getUTCDate() + 14);
  }
  return d.toISOString().slice(0, 10);
}

export default function EventsPage() {
  const schedule = CADENCE.map((c) => ({ ...c, next: nextOccurrence(c.weekday, c.day as "first" | "third") }));

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/community" className="hover:text-ink">Community</Link>
        <span>/</span>
        <span className="text-ink-dim">Events</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Events · a cadence, not a calendar of promises</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Two recurring sessions, honestly empty</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          Event pages fill up fast with “50+ builders attended!” and dates that never happened. This page publishes a
          recurring cadence and computes the next real dates from today. No session has run yet, so the past section is
          genuinely empty — the first one will be recorded and posted with the parts where things broke left in.
        </p>
      </div>

      <div className="mt-9 space-y-4">
        {schedule.map((c) => (
          <div key={c.slug} className="rounded-3xl border border-white/8 bg-panel p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">{c.when}</p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight">{c.title}</h2>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-dim">{c.what}</p>
                <p className="mt-2 font-mono text-[10px] text-ink-faint">{c.who}</p>
              </div>
              <div className="rounded-2xl border border-mint/25 bg-mint/[.05] px-5 py-4 text-center">
                <p className="text-[10px] uppercase tracking-widest text-mint">next session</p>
                <p className="mt-1 font-mono text-lg font-extrabold text-ink">{c.next}</p>
                <p className="mt-1 text-[10px] text-ink-faint">computed from today&apos;s date</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-9 rounded-3xl border border-white/8 bg-panel p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-extrabold">Past sessions</h2>
          <span className="chip !text-[10px]">0 recorded</span>
        </div>
        <p className="mt-3 rounded-2xl border border-dashed border-white/12 px-4 py-6 text-center text-[11px] leading-relaxed text-ink-faint">
          Nothing yet. The cadence above is published and the next dates are real, but the first session has not run —
          when it does, its recording and the questions asked go here, and we will not backfill this list with sessions
          that did not happen.
        </p>
      </section>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { h: "Why publish a cadence", b: "A recurring slot is a commitment. Publishing the rule makes it checkable: if three first-Thursdays pass with no session, you can say so with the dates in hand." },
          { h: "What we will not do", b: `No invented attendance numbers, no “65 people registered” counter, no recordings of sessions that were not held. The roster of ${ROSTER.length} personas is sample data and stays on the pages that label it.` },
          { h: "How to attend", b: "There is no booking system in this build, and we would rather say that than collect an email address for a session we cannot yet host. The schedule is the announcement." },
        ].map((c) => (
          <div key={c.h} className="rounded-3xl border border-white/8 bg-panel p-5">
            <p className="text-sm font-extrabold">{c.h}</p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-dim">{c.b}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/8 bg-panel p-6">
        <p className="max-w-xl text-xs leading-relaxed text-ink-dim">
          Between sessions, the requests board and the challenge brief are where the conversation actually happens.
        </p>
        <div className="flex gap-2">
          <Link href="/community/requests" className="btn btn-ghost !py-2 text-xs">Requests board</Link>
          <Link href="/community/challenges" className="btn btn-primary !py-2 text-xs">This month&apos;s challenge →</Link>
        </div>
      </div>
    </div>
  );
}
