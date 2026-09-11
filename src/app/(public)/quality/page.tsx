import type { Metadata } from "next";
import Link from "next/link";
import { COMPONENTS } from "@/lib/data";
import {
  AuditLedgerPanel,
  ContrastCiPanel,
  CopyLintPanel,
  DependencyLedgerPanel,
  KeyboardFlowPanel,
  NumericTruthPanel,
  PerfTrackerPanel,
  ReducedMotionPanel,
  ScreenReaderPanel,
  ScorePublishPanel,
  SizeBudgetPanel,
  ToneLintPanel,
  UrlInventoryPanel,
} from "@/components/quality-panels";
import {
  AnnualReviewPanel,
  FocusVisiblePanel,
  FreshnessPanel,
  ImageAuditPanel,
  LicencePanel,
  SecurityPanel,
  SpellcheckPanel,
} from "@/components/quality-panels-2";

export const metadata: Metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/quality" },
  title: "Quality bar",
  // 519 — this description ran 288 characters, past the ~200 a result shows.
  description:
    "The quality, accessibility and testing bar in the open: score distributions, contrast pairs, reduced-motion fallback, size budgets and the dependency ledger — recomputed from the catalog.",
};

export default function QualityPage() {
  const total = COMPONENTS.length;
  const mechanisms = [
    "Audit scores, published",
    "Contrast CI on the default palette",
    "Reduced-motion fallback",
    "Per-kind size budgets",
    "Dependency ledger",
    "Keyboard-flow tests",
    "Screen-reader smoke tests",
    "Copy consistency lint",
    "Numeric truth check",
    "Perf regression baseline",
    "Tone-of-voice lint",
    "URL inventory test",
    "Share-audit ledger",
    "Freshness job",
    "Spellcheck in CI",
    "Image-free audit",
    "Focus-visible suite",
    "Security hygiene",
    "Licence scanner",
    "Annual content review",
  ];
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <span className="text-ink-dim">Quality bar</span>
      </nav>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-mint">Quality bar · a11y · testing</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">The quality bar, kept in the open</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-dim">
            Motif gates every asset on accessibility and editorial review, budgets its weight by kind, tracks every
            dependency and writes a test for every keyboard flow. This page shows the mechanisms and the real numbers
            they produce — recomputed from the live catalog at build time, nothing stored by hand.
          </p>
        </div>
        <span className="chip !text-[10px]">{total} assets audited</span>
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        {mechanisms.map((m, i) => (
          <span key={m} className="chip !text-[10px]">
            <span className="font-mono text-ink-faint">{String(i + 1).padStart(2, "0")}</span> {m}
          </span>
        ))}
        <span className="chip !text-[10px] !border-mint/30 !text-mint">20 mechanisms · Section 11 complete</span>
      </div>

      <div className="mt-10 space-y-8">
        <ScorePublishPanel />
        <ContrastCiPanel />
        <ReducedMotionPanel />
        <SizeBudgetPanel />
        <DependencyLedgerPanel />
        <KeyboardFlowPanel />
        <ScreenReaderPanel />
        <CopyLintPanel />
        <NumericTruthPanel />
        <PerfTrackerPanel />
        <ToneLintPanel />
        <UrlInventoryPanel />
        <AuditLedgerPanel />
        <FreshnessPanel />
        <SpellcheckPanel />
        <ImageAuditPanel />
        <FocusVisiblePanel />
        <SecurityPanel />
        <LicencePanel />
        <AnnualReviewPanel />
      </div>

      {/* Community-driven challenge — real surfaces, deliberately not counted
          as a 21st mechanism (Section 12, batch 47). */}
      <div className="mt-8 rounded-3xl border border-violet-300/20 bg-violet-400/[.04] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-widest text-violet-200">
            Community-challenged quality · not counted among the 20 above
          </p>
          <span className="chip !text-[10px]">Section 12 · community</span>
        </div>
        <p className="mt-2 max-w-3xl text-xs leading-relaxed text-ink-dim">
          Every mechanism above is ours. Two of these claims can also be challenged from outside: anybody can ask
          whether a prompt still holds on a given model, and a remix can be pushed through the same audit gates into the
          moderation queue. Both surfaces print their own honesty label — the re-run log is a simulation with no model
          behind it, and submissions stay in your browser until a reviewer opens the queue.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/community/re-run" className="chip !text-[10px] transition-colors hover:!text-ink">▶ Community prompt re-run</Link>
          <Link href="/community/submit" className="chip !text-[10px] transition-colors hover:!text-ink">⤴ Remix submit flow</Link>
          <Link href="/community/leaderboard" className="chip !text-[10px] transition-colors hover:!text-ink">Copy leaderboard</Link>
          <Link href="/community" className="chip !text-[10px] transition-colors hover:!text-ink">All community surfaces</Link>
        </div>
      </div>

      {/* #507 — the mechanical half of accessibility, next to the editorial half. */}
      <div className="mt-8 rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-sm font-extrabold">The automated half</p>
        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-ink-dim">
          The per-asset a11y score above is an editorial review. Separately, every page&apos;s built HTML is walked at build time for the things a
          machine can decide — images without alt text, controls without names, duplicate ids, heading-order skips, missing language attributes —
          and the findings, including the ones that were real, are on the markup audit.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/quality/aria" className="chip !text-[10px] transition-colors hover:!text-ink">
            Markup &amp; ARIA audit
          </Link>
          <Link href="/quality/craft" className="chip !text-[10px] transition-colors hover:!text-ink">
            Craft excerpts
          </Link>
          <Link href="/quality/speed" className="chip !text-[10px] transition-colors hover:!text-ink">
            The measured speed story
          </Link>
          <Link href="/quality/crawl" className="chip !text-[10px] transition-colors hover:!text-ink">
            Crawl surface
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/8 bg-panel p-6">
        <div className="max-w-xl">
          <p className="text-sm font-extrabold">Where the numbers come from</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-dim">
            Every count and ratio on this page is computed from the same catalog data that renders{" "}
            <Link href="/components" className="font-semibold text-violet-300 hover:text-violet-200">the library</Link>,
            the <Link href="/components/combo-box" className="font-semibold text-violet-300 hover:text-violet-200">detail pages</Link>{" "}
            and the <Link href="/lab" className="font-semibold text-violet-300 hover:text-violet-200">Lab</Link>. Audit
            scores print on every card; this page is the summary view. Mechanisms that describe CI automation are marked
            as the roadmap — the policies and data behind them are live today.
          </p>
        </div>
        <Link href="/mission" className="btn btn-ghost !py-2 text-xs">Why Motif exists →</Link>
      </div>
    </div>
  );
}
