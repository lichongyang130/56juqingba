import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { badgesFor, makerOf, makerStats, queuedFor, ROSTER } from "@/lib/community";
import { accentCss } from "@/lib/data";

export function generateStaticParams() {
  return ROSTER.map((m) => ({ handle: m.handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const m = makerOf(handle);
  return m ? { title: `${m.name} (@${m.handle}) — Motif UI`, description: m.note } : { title: "Maker — Motif UI" };
}

const KIND_LABEL: Record<string, string> = { element: "element", section: "section", animated: "animated", prompt: "prompt" };

export default async function MakerPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const m = makerOf(handle);
  if (!m) notFound();
  const subs = queuedFor(handle);
  const s = makerStats(handle);
  const badges = badgesFor(handle);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/makers" className="hover:text-ink">Makers</Link>
        <span>/</span>
        <span className="text-ink-dim">@{m.handle}</span>
      </nav>

      <div className="mt-8 flex flex-wrap items-start justify-between gap-5">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/12 font-mono text-xl font-extrabold text-ink" style={{ background: accentCss(m.handle, 60, 22) }}>
            {m.handle.slice(0, 2)}
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Maker · sample roster</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-4xl">{m.name}</h1>
            <p className="mt-1 font-mono text-xs text-ink-faint">@{m.handle} · {m.craft} · joined {m.joined}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {[
            { l: "in queue", v: s.submissions },
            { l: "avg score", v: s.avgScore },
            { l: "best", v: s.best },
          ].map((x) => (
            <div key={x.l} className="rounded-2xl border border-white/8 bg-panel px-4 py-2.5 text-center">
              <p className="font-mono text-lg font-extrabold">{x.v}</p>
              <p className="text-[9px] uppercase tracking-widest text-ink-faint">{x.l}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 max-w-3xl rounded-2xl border border-white/8 bg-white/[.02] px-5 py-4 text-[12px] leading-relaxed text-ink-dim">
        {m.note}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-ink-faint">Badges:</span>
        {badges.length === 0 ? (
          <span className="chip !text-[10px]">
            none yet — every badge is awarded by a published rule, never granted by hand
          </span>
        ) : (
          badges.map((b) => (
            <span key={b.slug} className="chip !text-[10px] !border-amber-300/30 !text-amber-200">
              {b.mark} {b.name}
            </span>
          ))
        )}
        <Link href="/community/badges" className="text-[10px] font-semibold text-violet-300 hover:text-violet-200">
          How badges are earned →
        </Link>
      </div>

      <section className="mt-8">
        <h2 className="border-b border-white/6 pb-3 text-xs font-bold uppercase tracking-[0.24em] text-amber-200">Submissions in the queue</h2>
        {subs.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-white/12 px-5 py-8 text-center text-xs text-ink-faint">
            Nothing in the current sample queue from @{m.handle}.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {subs.map((sub) => (
              <div key={sub.id} className="rounded-2xl border border-white/8 bg-panel p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-extrabold">{sub.title}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-ink-faint">{sub.id} · {KIND_LABEL[sub.kind]} · {sub.stack}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`chip !text-[10px] ${sub.score >= 95 ? "!border-mint/30 !text-mint" : sub.score >= 85 ? "!border-amber-300/30 !text-amber-300" : "!border-danger/30 !text-danger"}`}>
                      {sub.kind === "prompt" ? "fidelity" : "a11y"} {sub.score}
                    </span>
                    <span className={`chip !text-[10px] ${sub.lint === "pass" ? "!border-mint/25 !text-mint" : sub.lint === "warn" ? "!border-amber-300/25 !text-amber-300" : "!border-danger/25 !text-danger"}`}>lint {sub.lint}</span>
                    <span className={`chip !text-[10px] ${sub.safety === "pass" ? "!border-mint/25 !text-mint" : sub.safety === "warn" ? "!border-amber-300/25 !text-amber-300" : "!border-danger/25 !text-danger"}`}>safety {sub.safety}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
          Scores are the sample values the moderation demo shipped with. Decisions you make in the admin queue are stored
          in your browser and never change these records — which is the point: a public credit page should not be
          editable by whoever is looking at it.
        </p>
      </section>

      <div className="mt-9 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/8 bg-panel p-6">
        <p className="max-w-xl text-xs leading-relaxed text-ink-dim">
          Save their work to your list, or open the queue and see the gates the team reviews before anything is published.
        </p>
        <div className="flex gap-2">
          <Link href="/saved" className="btn btn-ghost !py-2 text-xs">Your saved list</Link>
          <Link href="/admin/moderation" className="btn btn-primary !py-2 text-xs">Open the queue →</Link>
        </div>
      </div>
    </div>
  );
}
