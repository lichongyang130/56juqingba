import type { Metadata } from "next";
import Link from "next/link";
import { assetLeaderboard, promptLeaderboard } from "@/lib/community";
import { kindLabel } from "@/lib/quality-utils";

export const metadata: Metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/community/leaderboard" },
  title: "Copy leaderboard — Motif UI",
  description: "The most-copied Motif components and the highest-fidelity prompts, with author credits and an honest note about what copy counts measure.",
};

export default function LeaderboardPage() {
  const assets = assetLeaderboard(12);
  const prompts = promptLeaderboard(8);
  const max = assets[0]?.metric ?? 1;
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/community" className="hover:text-ink">Community</Link>
        <span>/</span>
        <span className="text-ink-dim">Leaderboard</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Copy leaderboard · credits shown</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">What people actually take</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          Components rank by their recorded copy count, prompts by average fidelity across their published model runs.
          Every credit is the item&apos;s real author: catalog work is Motif Studio&apos;s, and the sample contributor
          handles appear only on their own maker pages, so this board cannot credit someone for work they did not do.
        </p>
      </div>

      <section className="mt-10">
        <h2 className="border-b border-white/6 pb-3 text-xs font-bold uppercase tracking-[0.24em] text-amber-200">Most copied components</h2>
        <div className="mt-4 space-y-2">
          {assets.map((a, i) => (
            <Link key={a.slug} href={a.href} className="card-hover flex items-center gap-4 rounded-2xl border border-white/8 bg-panel px-4 py-3">
              <span className="w-7 shrink-0 font-mono text-lg font-extrabold text-amber-200/90">#{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-ink">{a.title}</p>
                <p className="font-mono text-[10px] text-ink-faint">{a.slug} · {kindLabel(a.kind)} · by {a.credit}</p>
              </div>
              <div className="hidden h-2 w-40 overflow-hidden rounded-full bg-white/8 sm:block">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-300/80 to-violet-400/80" style={{ width: `${Math.max(4, (a.metric / max) * 100)}%` }} />
              </div>
              <span className="w-16 shrink-0 text-right font-mono text-xs font-bold text-ink">{a.metric.toLocaleString()}</span>
            </Link>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
          “Copies” is the same figure every asset card shows as copies this month, recorded with the catalog. It is a
          popularity signal for comparing assets, not a download count, and it is not live analytics — we publish no
          install numbers we cannot see.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="border-b border-white/6 pb-3 text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">Highest-fidelity prompts</h2>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {prompts.map((p, i) => (
            <Link key={p.slug} href={p.href} className="card-hover flex items-center gap-4 rounded-2xl border border-white/8 bg-panel px-4 py-3">
              <span className="w-7 shrink-0 font-mono text-lg font-extrabold text-cyan-200/90">#{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-ink">{p.title}</p>
                <p className="font-mono text-[10px] text-ink-faint">{p.slug} · by {p.credit}</p>
              </div>
              <span className="shrink-0 rounded-full border border-cyan-200/30 px-2.5 py-1 font-mono text-xs font-bold text-cyan-200">
                {p.metric}
                <span className="ml-1 text-[9px] font-semibold uppercase tracking-wider text-cyan-200/70">fidelity</span>
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
          Prompt scores are averages across the model runs published on each prompt page. Ties break on the newest run
          date, so a refreshed brief can move up without its average changing.
        </p>
      </section>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/8 bg-panel p-6">
        <p className="max-w-xl text-xs leading-relaxed text-ink-dim">
          Want to add something to the board? The remix flow puts a submission in front of the audit gates and a human
          reviewer — the queue is where new entries start.
        </p>
        <Link href="/community/submit" className="btn btn-primary !py-2 text-xs">Submit a remix →</Link>
      </div>
    </div>
  );
}
