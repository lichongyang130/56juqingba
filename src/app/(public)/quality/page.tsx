import type { Metadata } from "next";
import Link from "next/link";
import { COMPONENTS } from "@/lib/data";
import {
  ContrastCiPanel,
  DependencyLedgerPanel,
  KeyboardFlowPanel,
  ReducedMotionPanel,
  ScreenReaderPanel,
  ScorePublishPanel,
  SizeBudgetPanel,
} from "@/components/quality-panels";

export const metadata: Metadata = {
  title: "Quality bar — Motif UI",
  description:
    "Motif's quality, accessibility and testing bar in the open: audit score distributions, contrast CI pairs, reduced-motion fallback, size budgets, the dependency ledger, keyboard walks and screen-reader smoke assertions — all recomputed from the live catalog.",
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
        <span className="chip !text-[10px] !border-amber-300/30 !text-amber-300">automation roadmap · 13 more mechanisms below</span>
      </div>

      <div className="mt-10 space-y-8">
        <ScorePublishPanel />
        <ContrastCiPanel />
        <ReducedMotionPanel />
        <SizeBudgetPanel />
        <DependencyLedgerPanel />
        <KeyboardFlowPanel />
        <ScreenReaderPanel />
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
