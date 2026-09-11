import type { Metadata } from "next";
import Link from "next/link";
import { PROMPTS } from "@/lib/data";
import { RerunStudio } from "@/components/community-ui";
import { promptLeaderboard } from "@/lib/community";

export const metadata: Metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/community/re-run" },
  title: "Community re-run",
  description: "Ask whether a Motif prompt still holds on a model: pick a verified prompt, stream a simulated run log and compare against the published fidelity average.",
};

export default async function RerunPage({ searchParams }: { searchParams: Promise<{ prompt?: string }> }) {
  const { prompt: wanted } = await searchParams;
  // Same ranking the copy leaderboard uses (fidelity, then newest run), so the
  // two community surfaces never disagree about which prompt leads.
  const bySlug = new Map(PROMPTS.map((p) => [p.slug, p]));
  const ranked = promptLeaderboard(PROMPTS.length)
    .map((r) => bySlug.get(r.slug))
    .filter((p) => p !== undefined);
  const base = ranked.slice(0, 4);
  const pinned = wanted ? bySlug.get(wanted) : undefined;
  const list = pinned ? [pinned, ...base.filter((p) => p.slug !== pinned.slug)].slice(0, 5) : base;

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/community" className="hover:text-ink">Community</Link>
        <span>/</span>
        <span className="text-ink-dim">Community re-run</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">Community re-run · simulated</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">&ldquo;Does this prompt still hold?&rdquo;</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          Models move. A published fidelity average is a snapshot from the day it ran, so the interesting question is
          always whether a brief still reproduces. Pick a prompt and a model below: the studio streams a run log and
          compares its simulated score with the published average.
        </p>
        <p className="mt-3 rounded-2xl border border-amber-300/25 bg-amber-300/[.04] px-4 py-3 text-[11px] leading-relaxed text-amber-200/90">
          This page runs a simulation — no model is called and no tokens are spent. Its purpose is to show the shape of
          the feature: the run-log format, the comparison against published numbers, and the honesty about which log is
          real. Real runs are the ones recorded on each prompt page.
        </p>
      </div>

      {pinned && (
        <p className="mt-7 rounded-2xl border border-violet-300/25 bg-violet-400/[.06] px-4 py-3 text-[11px] text-violet-100/90">
          You came here from <span className="font-mono">{pinned.slug}</span>, so that prompt leads the list below.
        </p>
      )}

      <div className="mt-8 space-y-6">
        {list.map((p) => (
          <RerunStudio key={p.slug} slug={p.slug} title={p.title} published={p.avgFidelity} />
        ))}
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          { h: "Why let anyone re-run", b: "Prompt quality claims should be cheap to challenge. If a model update breaks a brief, the fastest way to find out is to let the people using it say so." },
          { h: "What the queue would do", b: "A real implementation would rate-limit runs, pin model versions, and append the result to the prompt's run log with a community tag." },
          { h: "What happens today", b: "Nothing is persisted. Your runs live in this tab's memory; refreshing clears them, and the published logs stay untouched." },
        ].map((c) => (
          <div key={c.h} className="rounded-3xl border border-white/8 bg-panel p-5">
            <p className="text-sm font-extrabold">{c.h}</p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-dim">{c.b}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
