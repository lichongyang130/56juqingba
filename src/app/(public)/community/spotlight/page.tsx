import type { Metadata } from "next";
import Link from "next/link";
import { makerOf, SPOTLIGHTS } from "@/lib/community";
import { accentCss } from "@/lib/data";

export const metadata: Metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/community/spotlight" },
  title: "Spotlight interviews",
  description: "One maker a month, interviewed about the work in the queue — sample roster personas, clearly labelled, with the Q&A written from their own submissions.",
};

export default function SpotlightPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/community" className="hover:text-ink">Community</Link>
        <span>/</span>
        <span className="text-ink-dim">Spotlight</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Spotlight · one maker a month</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">The craft behind the queue</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          A monthly interview with the person who submitted the most interesting thing to the queue — about the decisions,
          not the launch. {SPOTLIGHTS.length} months are written so far, drawn from each maker&apos;s own submissions and
          gate results.
        </p>
        <p className="mt-3 rounded-2xl border border-amber-300/25 bg-amber-300/[.04] px-4 py-3 text-[11px] leading-relaxed text-amber-200/90">
          Honesty label: the interviewees are the sample roster personas used across the moderation demo. The answers are
          written from their submitted work to show the format a real interview would take — they are not quotes from real
          people, and we would rather say that than pass off invented voices.
        </p>
      </div>

      <div className="mt-9 space-y-6">
        {SPOTLIGHTS.map((s) => {
          const m = makerOf(s.handle);
          return (
            <article key={s.month} className="rounded-3xl border border-white/8 bg-panel p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/12 font-mono text-lg font-extrabold text-ink"
                    style={{ background: accentCss(s.handle, 60, 22) }}
                  >
                    {s.handle.slice(0, 2)}
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">{s.month} spotlight</p>
                    <h2 className="mt-1 text-xl font-extrabold tracking-tight">{m?.name ?? s.handle}</h2>
                    <p className="font-mono text-[10px] text-ink-faint">
                      @{s.handle} · {m?.craft ?? "contributor"} · joined {m?.joined ?? "—"}
                    </p>
                  </div>
                </div>
                <Link href={`/makers/${s.handle}`} className="btn btn-ghost !px-3 !py-1.5 text-xs">
                  Maker page →
                </Link>
              </div>

              <p className="mt-4 text-lg font-extrabold tracking-tight text-violet-200">“{s.headline}”</p>

              <div className="mt-4 space-y-3">
                {s.questions.map((q) => (
                  <div key={q.q} className="rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3">
                    <p className="text-[12px] font-bold text-ink">{q.q}</p>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-ink-dim">{q.a}</p>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-9 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/8 bg-panel p-6">
        <p className="max-w-xl text-xs leading-relaxed text-ink-dim">
          The interview also lives in the Learn section, alongside the build-alongs and essays — the same craft argument,
          told by the people doing the work.
        </p>
        <Link href="/learn" className="btn btn-primary !py-2 text-xs">Read in Learn →</Link>
      </div>
    </div>
  );
}
