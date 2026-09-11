import type { Metadata } from "next";
import Link from "next/link";
import { BETS, BETS_LIVE, BETS_PARTIAL, BETS_SPEC } from "@/lib/roadmap";

export const metadata: Metadata = {
  // 519 — the page had no canonical, so the sitemap walk could not tell it
  // apart from a page pointing at the homepage.
  alternates: { canonical: "/roadmap" },
  title: "Roadmap — ten bets with their real status",
  description:
    "The ten north-star bets from the idea bank, each with what exists today, the first real slice, what it would cost and the line it must not cross. Four are live in this build.",
};

const STATUS = {
  live: { label: "Live in this build", chip: "border-emerald-300/25 bg-emerald-400/10 text-emerald-200" },
  partial: { label: "Partly built", chip: "border-amber-300/25 bg-amber-400/10 text-amber-200" },
  spec: { label: "Spec only — no code yet", chip: "border-rose-300/25 bg-rose-400/10 text-rose-200" },
} as const;

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Roadmap</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Beyond the MVP</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Ten bets, labelled honestly</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          Every product page has a roadmap. Most are wish lists ordered by optimism. This one is a status report: {BETS_LIVE} of these bets run in
          this build, {BETS_PARTIAL} is partly built, and {BETS_SPEC} are specifications with no code — because they need a database, a payment
          path or a second person, and inventing a mock would have made every other number on this site cheaper.
        </p>
        <p className="mt-2 text-[11px] leading-relaxed text-ink-faint">
          The format for each bet is the same four questions: what exists today, the smallest real slice, what it costs, and the line it must not
          cross. A bet that cannot answer the last one is not ready.
        </p>
      </div>

      <section className="mt-8 grid gap-3 sm:grid-cols-3">
        {(
          [
            ["Live", BETS_LIVE, "text-emerald-200"],
            ["Partly built", BETS_PARTIAL, "text-amber-200"],
            ["Spec only", BETS_SPEC, "text-rose-200"],
          ] as const
        ).map(([label, n, tone]) => (
          <div key={label} className="rounded-2xl border border-white/8 bg-panel p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">{label}</p>
            <p className={`mt-1 font-mono text-3xl tabular-nums ${tone}`}>{n}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 space-y-4">
        {BETS.map((b) => {
          const s = STATUS[b.status];
          return (
            <article key={b.slug} id={b.slug} className="scroll-mt-24 rounded-3xl border border-white/8 bg-panel p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 className="text-base font-extrabold tracking-tight">
                  <span className="mr-2 font-mono text-[11px] text-ink-faint">{String(b.n).padStart(2, "0")}</span>
                  {b.title}
                </h2>
                <span className={`chip shrink-0 ${s.chip}`}>{s.label}</span>
              </div>
              <dl className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Today</dt>
                  <dd className="mt-1 text-[11.5px] leading-relaxed text-ink-dim">{b.today}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">First real slice</dt>
                  <dd className="mt-1 text-[11.5px] leading-relaxed text-ink-dim">{b.slice}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">What it costs</dt>
                  <dd className="mt-1 text-[11.5px] leading-relaxed text-ink-dim">{b.cost}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-widest text-rose-300/80">What it must refuse</dt>
                  <dd className="mt-1 text-[11.5px] leading-relaxed text-ink-dim">{b.refuse}</dd>
                </div>
              </dl>
              {b.links && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {b.links.map((l) => (
                    <Link key={l.href} href={l.href} className="chip !text-[10px] hover:text-ink">
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </section>

      <section className="mt-8 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">Why four are marked live</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          The three APIs and the open book needed no server, so they are real: a per-component JSON document, an audit document, a one-file embed
          SDK, and the site&apos;s own playbook published with its numbers. Marking them &ldquo;planned&rdquo; when they were an afternoon&apos;s
          work would have been the easier and less honest option — and it would have hidden the fact that the other six genuinely need
          infrastructure this repository does not have.
        </p>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-faint">
          When a spec becomes real, this page changes its chip and the ledger gets a row. Until then the chip is the deliverable.
        </p>
      </section>
    </div>
  );
}
