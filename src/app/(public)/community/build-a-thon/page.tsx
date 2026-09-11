import type { Metadata } from "next";
import Link from "next/link";
import { BuildAThonCalendar } from "@/components/retention-ui-2";
import { localDay } from "@/lib/retention";

export const metadata: Metadata = {
  title: "Build-a-thon calendar — Motif UI",
  description:
    "A monthly build challenge with a computed countdown: the window opens on the 1st, closes on the last day, and the theme rotates by month.",
};

export default function BuildAThonPage() {
  const builtOn = localDay();
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <Link href="/community" className="hover:text-ink">
          Community
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Build-a-thon</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Monthly · public countdown</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Build-a-thon</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          One prompt a month, open from the 1st to the last day. This is a calendar, not a competition: no prizes, no scoring, no submission
          form that quietly becomes a mailing list. Build the thing, then post it wherever you already post.
        </p>
      </div>

      <div className="mt-8">
        <BuildAThonCalendar today={builtOn} />
      </div>

      <section className="mt-10 grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <h2 className="text-sm font-extrabold tracking-tight">How the calendar works</h2>
          <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
            The window is arithmetic on the month — open on the 1st, close on the last day — and the theme is
            <span className="font-mono"> themes[monthIndex % themes.length]</span>. Nothing is hand-maintained, so there is no way for this
            page to advertise a challenge that finished last week, which is the usual failure mode of an events page.
          </p>
        </div>
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <h2 className="text-sm font-extrabold tracking-tight">Countdown honesty</h2>
          <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
            The page is prerendered, so the server rendered its own build date ({builtOn}). The countdown you see is recomputed from your
            clock when the page runs, and the panel says which clock it used. A countdown that quietly borrowed the server&apos;s date would be
            wrong for anyone in a different timezone.
          </p>
        </div>
      </section>

      <p className="mt-8 text-[11px] leading-relaxed text-ink-faint">
        Related: the{" "}
        <Link href="/community/day" className="font-semibold text-violet-300 hover:text-violet-200">
          weekly community day
        </Link>{" "}
        runs every Thursday with a smaller brief, and the{" "}
        <Link href="/community/challenges" className="font-semibold text-violet-300 hover:text-violet-200">
          challenge archive
        </Link>{" "}
        keeps the older briefs with their outcomes.
      </p>
    </div>
  );
}
