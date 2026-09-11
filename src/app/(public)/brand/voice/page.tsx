import type { Metadata } from "next";
import Link from "next/link";
import { OVERCLAIM_DICTIONARY, toneScan } from "@/lib/quality-utils";
import { motionAudit } from "@/lib/perf";

export const metadata: Metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/brand/voice" },
  title: "Voice guide — 10 lines we say and 10 we never do — Motif UI",
  description:
    "The tone rules behind the copy: ten things Motif says, ten it never says, and the scanner that enforces them over the site's own prose.",
};

/**
 * #483 — the voice guide.
 *
 * The interesting part is not the table; it is that the table has teeth. The
 * "never say" column is the same OVERCLAIM_DICTIONARY the tone scan runs over
 * this repository's prose, so the page and the lint cannot disagree. That is
 * why the page prints the scan's current numbers: files scanned, hits, and how
 * many hits were negations (a sentence explaining why a word is banned may
 * contain the word).
 */

/** The demo-scene figure in the table below is read from the source tree at
 *  build time rather than typed in. It used to be a literal ("13 files and
 *  428 KB"), which a later refactor turned into a false statement on a page
 *  whose whole argument is that a count is checkable — so this page reads the
 *  count the way /lab/layers does, and the export harness compares the served
 *  page against the files. */
const DEMO = motionAudit();

interface VoiceLine {
  we: string;
  never: string;
  why: string;
}

const LINES: VoiceLine[] = [
  {
    we: "2.1 KB, zero dependencies.",
    never: "Seamless, effortless integration.",
    why: "A number is checkable in the file; an adjective is a promise about the reader's experience, which we have not met.",
  },
  {
    we: "Reduced motion is designed, not disabled.",
    never: "Accessible by default.",
    why: "The second is a badge; the first is a decision somebody can inspect in the stylesheet.",
  },
  {
    we: "This one is 41 KB heavier; here is why we kept it.",
    never: "Optimised for performance.",
    why: "Every component is somebody's trade-off. Name the trade, especially when it went the expensive way.",
  },
  {
    we: "Not measured on this build.",
    never: "Best-in-class performance.",
    why: "The honest gap is more useful than a grade, and it survives being checked.",
  },
  {
    we: "Three of the 74 prompts were dropped for reproducing poorly.",
    never: "A hand-curated collection.",
    why: "Selection with a rejection rate is curation; selection with no numbers is a synonym for 'we chose some'.",
  },
  {
    we: `The demo scenes are ${DEMO.demoLines.toLocaleString("en-US")} lines across ${DEMO.demoModules} modules.`,
    never: "Lightweight.",
    why: "Lightweight compared to what? A count is comparable; a word is a mood.",
  },
  {
    we: "Try the keyboard walk: unplug the mouse and finish a task.",
    never: "Fully accessible.",
    why: "Hand over the test instead of the verdict — the reader can run it in a minute.",
  },
  {
    we: "This page does not claim a Lighthouse score, and says why.",
    never: "Blazing fast.",
    why: "Also on the banned list below, because 'blazing' is the adverb a dashboard uses when it did not measure anything.",
  },
  {
    we: "Copied 3,910 times, and 128 people kept it in a stack.",
    never: "Trusted by thousands of developers.",
    why: "Real counters we can actually read, versus a population we cannot.",
  },
  {
    we: "We did not build accounts; a demo would have meant fake data.",
    never: "Coming soon.",
    why: "Naming the boundary is a decision; 'coming soon' is a decision deferred onto the reader.",
  },
];

export default function VoiceGuidePage() {
  const banned = OVERCLAIM_DICTIONARY;
  const scan = toneScan();
  const toneSummary = { files: scan.files, hits: scan.hits.length, negated: scan.negated };

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Brand</span>
        <span>/</span>
        <span className="text-ink-dim">Voice</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Brand · voice</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Ten lines we say, ten we never do</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          A voice guide is only as good as its enforcement. This one is a two-column table with a check: the right-hand column is filled with the
          same phrases the tone scan searches this repository&apos;s prose for, and the scan&apos;s live numbers are printed underneath.
        </p>
      </div>

      <section className="mt-10 overflow-hidden rounded-3xl border border-white/8">
        <div className="grid grid-cols-[1fr,1fr] divide-x divide-white/8 bg-white/[.02] text-[10px] font-bold uppercase tracking-widest">
          <p className="px-5 py-3 text-emerald-300">We say</p>
          <p className="px-5 py-3 text-rose-300">We never say</p>
        </div>
        <ul className="divide-y divide-white/8">
          {LINES.map((l, i) => (
            <li key={i} className="grid grid-cols-[1fr,1fr] divide-x divide-white/8">
              <div className="px-5 py-4">
                <p className="text-[12px] leading-relaxed text-ink">{l.we}</p>
              </div>
              <div className="px-5 py-4">
                <p className="text-[12px] leading-relaxed text-rose-200/80 line-through decoration-rose-300/40">{l.never}</p>
                <p className="mt-2 text-[10.5px] leading-relaxed text-ink-faint">{l.why}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">The banned list, in full</h2>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-dim">
          {banned.length} terms, imported on this page from the same module the scanner reads — so this list cannot drift into a shorter, friendlier
          version:
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {banned.map((t) => (
            <span key={t} className="rounded-full border border-rose-300/25 bg-rose-400/[.06] px-3 py-1 font-mono text-[11px] text-rose-200/90">
              {t}
            </span>
          ))}
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-ink-dim">
          Two things keep the list from being theatre. A hit within 90 characters of a negation is treated as intentional and cleared — which is
          how this page explains why we ban &ldquo;magical&rdquo; without flagging itself. And the scan runs over the site&apos;s own source at build time, so
          the numbers below are facts about this repository rather than a policy statement:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/8 bg-black/35 p-4 font-mono text-[10.5px] leading-relaxed text-emerald-200/90">
{`tone scan, run against this source tree at build time:
  files scanned:       ${toneSummary.files}
  banned-term hits:    ${toneSummary.hits}
  cleared as negations: ${toneSummary.negated}
  live hits:            ${toneSummary.hits - toneSummary.negated}`}
        </pre>
        <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
          The numbers are read from the scan at build time, and the export harness asserts the live-hit count is zero — so a page that adds a banned
          word fails in the same commit that adds it, including this one.
        </p>
      </section>

      <p className="mt-8 text-[11px] leading-relaxed text-ink-faint">
        Related: the{" "}
        <Link href="/brand/logo" className="font-semibold text-violet-300 hover:text-violet-200">
          logo system
        </Link>{" "}
        and the{" "}
        <Link href="/quality" className="font-semibold text-violet-300 hover:text-violet-200">
          audit register
        </Link>
        .
      </p>
    </div>
  );
}
