import type { Metadata } from "next";
import Link from "next/link";
import { MODERATION_SEED, queueReport, ROSTER } from "@/lib/community";
import { LocalDecisions } from "@/components/community-ui-2";
import { MODERATION_STORAGE_KEY } from "@/lib/community";

export const metadata: Metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/community/outcomes" },
  title: "Moderation outcomes",
  description: "What happens to submissions: the sample queue's gate outcomes aggregated, the rule behind every decision path, and your own reviews read back from this browser.",
};

const KIND_LABEL: Record<string, string> = { element: "element", section: "section", animated: "animated", prompt: "prompt" };

export default function OutcomesPage() {
  const r = queueReport();
  const band = (b: string) => (b === "clean" ? "clean" : b === "blocked" ? "blocked" : "needs review");

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/community" className="hover:text-ink">Community</Link>
        <span>/</span>
        <span className="text-ink-dim">Outcomes</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Moderation outcomes</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">What happens to a submission</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          A queue that only shows pending items tells you nothing about the standard. Below is every gate outcome in the{" "}
          {r.total} sample submissions that ship with this build, aggregated and explained, plus the reviews you have made
          yourself — read back from your own browser.
        </p>
        <p className="mt-3 rounded-2xl border border-amber-300/25 bg-amber-300/[.04] px-4 py-3 text-[11px] leading-relaxed text-amber-200/90">
          Honest limit: this build has no server, so there is no live public ledger of real submissions. The aggregate
          below is computed from the sample queue, which is stable and can be audited against the{" "}
          <Link href="/admin/moderation" className="font-semibold text-amber-200 hover:text-amber-100">
            admin queue
          </Link>{" "}
          in the same build. Your decisions stay on this device and never enter these numbers.
        </p>
      </div>

      <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: "sample submissions", v: r.total, note: `${r.byKind.map((k) => `${k.n} ${KIND_LABEL[k.kind]}`).join(" · ")}` },
          { l: "every gate clean", v: r.clean, note: `${Math.round((r.clean / r.total) * 100)}% of the queue` },
          { l: "blocked by safety", v: r.blocked, note: "rejected by default, no human override" },
          { l: "average score", v: r.avgScore, note: "a11y audit for components, fidelity for prompts" },
        ].map((c) => (
          <div key={c.l} className="rounded-2xl border border-white/8 bg-panel px-4 py-4">
            <p className="font-mono text-2xl font-extrabold text-ink">{c.v}</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-widest text-ink-faint">{c.l}</p>
            <p className="mt-1.5 text-[10px] leading-relaxed text-ink-faint">{c.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {[
          { h: "Lint gate", d: r.lint, w: "Style and structure rules — the failures are fixable, not disqualifying." },
          { h: "Safety gate", d: r.safety, w: "Sandbox behaviour for components, model-run integrity for prompts. A failure blocks the entry." },
        ].map((g) => (
          <div key={g.h} className="rounded-3xl border border-white/8 bg-panel p-6">
            <p className="text-sm font-extrabold">{g.h}</p>
            <div className="mt-3 space-y-2">
              {(["pass", "warn", "fail"] as const).map((k) => {
                const n = g.d[k];
                const tone = k === "pass" ? "bg-mint/70" : k === "warn" ? "bg-amber-300/70" : "bg-danger/70";
                return (
                  <div key={k} className="flex items-center gap-3">
                    <span className="w-10 shrink-0 font-mono text-[10px] text-ink-faint">{k}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/8">
                      <div className={`h-full rounded-full ${tone}`} style={{ width: `${(n / r.total) * 100}%` }} />
                    </div>
                    <span className="w-6 shrink-0 text-right font-mono text-[11px] font-bold text-ink">{n}</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-ink-dim">{g.w}</p>
          </div>
        ))}
      </div>

      <section className="mt-6 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold">The three decision paths</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {[
            { t: "Clean — publishable", b: "Both gates pass. The reviewer confirms the remix note matches what actually changed, then it publishes under the author's name.", n: r.clean, tone: "border-mint/25" },
            { t: "Needs review — a conversation", b: "A warning is not a rejection. The reviewer either asks for a fix or approves with the warning recorded on the page.", n: r.total - r.clean - r.blocked, tone: "border-amber-300/25" },
            { t: "Blocked — rejected by default", b: "A safety failure does not go to a human first. The submitter gets the reason and can resubmit; nothing publishes under their name meanwhile.", n: r.blocked, tone: "border-danger/25" },
          ].map((p) => (
            <div key={p.t} className={`rounded-2xl border ${p.tone} bg-white/[.02] px-4 py-4`}>
              <p className="font-mono text-xl font-extrabold text-ink">{p.n}</p>
              <p className="mt-1 text-[12px] font-bold text-ink">{p.t}</p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-ink-dim">{p.b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="border-b border-white/6 pb-3 text-xs font-bold uppercase tracking-[0.24em] text-amber-200">
          Entry by entry
        </h2>
        <div className="mt-4 space-y-2">
          {MODERATION_SEED.map((s) => (
            <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/8 bg-panel px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink">{s.title}</p>
                <p className="font-mono text-[10px] text-ink-faint">
                  {s.id} · {KIND_LABEL[s.kind]} · @{s.author} · {s.stack}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="chip !text-[10px]">score {s.score}</span>
                <span className={`chip !text-[10px] ${s.lint === "pass" ? "!border-mint/25 !text-mint" : s.lint === "warn" ? "!border-amber-300/25 !text-amber-300" : "!border-danger/25 !text-danger"}`}>lint {s.lint}</span>
                <span className={`chip !text-[10px] ${s.safety === "pass" ? "!border-mint/25 !text-mint" : s.safety === "warn" ? "!border-amber-300/25 !text-amber-300" : "!border-danger/25 !text-danger"}`}>safety {s.safety}</span>
                <span className="chip !text-[10px]">{band(r.bandOf(s))}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
          {ROSTER.length} contributor handles appear across these records — the sample roster used everywhere else on this
          site. With real submissions, this table is exactly what a public decision log would look like, and the counts
          above would be the aggregate.
        </p>
      </section>

      <section className="mt-8">
        <LocalDecisions storageKey={MODERATION_STORAGE_KEY} />
      </section>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-sm font-extrabold">What we will not publish</p>
          <ul className="prose-list mt-3">
            <li>Rejection rates for named people. An outcome belongs to an entry, not to a reputation.</li>
            <li>A “submissions this month” counter that only ever grows — a number nobody can verify is decoration.</li>
            <li>Appeal traffic, reviewer names or turnaround time promises we cannot keep at this size.</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-sm font-extrabold">What would make this page real</p>
          <ul className="prose-list mt-3">
            <li>A submissions table with the gates run server-side, so the aggregate is computed, not transcribed.</li>
            <li>Decisions written as append-only rows — corrections become new rows, never edits.</li>
            <li>The same public view for authors: your own entry history, with the gate output attached.</li>
          </ul>
          <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
            Until then this page shows the sample queue honestly rather than an empty ledger pretending to be one.
          </p>
        </div>
      </div>
    </div>
  );
}
