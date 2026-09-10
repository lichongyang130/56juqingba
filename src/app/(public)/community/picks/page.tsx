import type { Metadata } from "next";
import Link from "next/link";
import { weekPicks } from "@/lib/community";

export const metadata: Metadata = {
  title: "Weekly picks — Motif UI",
  description: "Three community submissions a week, chosen by a published rule: clean gates first, then the highest audit score. Rotates weekly with no hand-picking.",
};

const KIND_LABEL: Record<string, string> = { element: "element", section: "section", animated: "animated", prompt: "prompt" };

export default function PicksPage() {
  const weeks = weekPicks(3);
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/community" className="hover:text-ink">Community</Link>
        <span>/</span>
        <span className="text-ink-dim">Weekly picks</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Weekly picks · rule, not taste</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Three a week, and here is exactly why</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          Curation gets a bad name when nobody publishes the rule. Ours is one line: sort by gate results first, then by
          audit score, and take a window that rotates every ISO week. The “why” under each pick is the entry&apos;s own
          gate line printed as prose — if the record changes, the caption changes with it.
        </p>
        <p className="mt-3 rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3 text-[11px] leading-relaxed text-ink-faint">
          Picks are drawn from the sample queue that ships with the demo ({weeks[0].picks.length} of 10 records per week), so
          the band rotates through the same ten entries. The rule is real; the queue is sample data, and every card here
          is labelled with the handle it came from so nothing looks like a person who does not exist.
        </p>
      </div>

      <div className="mt-9 space-y-8">
        {weeks.map((w, wi) => (
          <section key={w.iso}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/6 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-amber-200">{w.label}</h2>
              {wi === 0 && <span className="chip !text-[10px]">this week&apos;s rotation</span>}
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {w.picks.map((p, i) => (
                <div key={`${w.iso}-${p.id}`} className="rounded-3xl border border-white/8 bg-panel p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-ink-faint">#{i + 1} · {p.id}</span>
                    <span className="chip !text-[10px]">{KIND_LABEL[p.kind]}</span>
                  </div>
                  <h3 className="mt-3 text-[15px] font-extrabold tracking-tight">{p.title}</h3>
                  <p className="mt-1 font-mono text-[10px] text-ink-faint">@{p.handle}</p>
                  <p className="mt-3 rounded-xl border border-white/6 bg-black/20 px-3 py-2 font-mono text-[10px] leading-relaxed text-ink-dim">
                    {p.why}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-ink-dim">
              <span className="font-bold text-ink">Editor&apos;s note: </span>
              {w.note}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/8 bg-panel p-6">
        <p className="max-w-xl text-xs leading-relaxed text-ink-dim">
          Want to appear here? A submission has to clear the same three gates every pick is ranked on. The queue is open
          and the rule above is the whole selection process.
        </p>
        <div className="flex gap-2">
          <Link href="/community/submit" className="btn btn-primary !py-2 text-xs">Submit something →</Link>
          <Link href="/admin/moderation" className="btn btn-ghost !py-2 text-xs">See the queue</Link>
        </div>
      </div>
    </div>
  );
}
