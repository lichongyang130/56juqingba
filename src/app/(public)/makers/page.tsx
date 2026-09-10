import type { Metadata } from "next";
import Link from "next/link";
import { makerStats, MODERATION_SEED, ROSTER } from "@/lib/community";
import { accentCss } from "@/lib/data";

export const metadata: Metadata = {
  title: "Makers — Motif UI",
  description: "Minimal maker pages for the contributors in Motif's moderation demo: their submissions, audit scores and review notes. Sample roster — labelled as such.",
};

export default function MakersPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/community" className="hover:text-ink">Community</Link>
        <span>/</span>
        <span className="text-ink-dim">Makers</span>
      </nav>
      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Makers · sample roster</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">The people in the queue</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          These are the {ROSTER.length} contributors from the moderation demo — the same sample submissions the admin
          queue reviews. Their pages are real pages built from real records in this repository; the people themselves
          are sample data, and we would rather say that than invent a community.
        </p>
      </div>

      <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ROSTER.map((m) => {
          const s = makerStats(m.handle);
          return (
            <Link key={m.handle} href={`/makers/${m.handle}`} className="card-hover group flex flex-col rounded-3xl border border-white/8 bg-panel p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 font-mono text-sm font-extrabold text-ink" style={{ background: accentCss(m.handle, 60, 22) }}>
                  {m.handle.slice(0, 2)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold">{m.name}</p>
                  <p className="font-mono text-[10px] text-ink-faint">@{m.handle}</p>
                </div>
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-ink-dim">{m.craft}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="chip !text-[10px]">{s.submissions} in queue</span>
                <span className="chip !text-[10px]">avg {s.avgScore}</span>
                <span className="chip !text-[10px]">best {s.best}</span>
              </div>
              <span className="mt-3 text-xs font-semibold text-violet-300 transition-colors group-hover:text-violet-200">Open profile →</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-sm font-extrabold">What a maker page is for</p>
        <p className="mt-2 max-w-3xl text-xs leading-relaxed text-ink-dim">
          Credits only mean something if they are traceable. A maker page shows what someone submitted, how the gates
          scored it and what happened next — the same information the reviewer had. {MODERATION_SEED.length} sample
          submissions currently sit in the queue; approving or rejecting one in the admin console writes your decision
          into this browser only, so no score here can be changed by a visitor.
        </p>
      </div>
    </div>
  );
}
