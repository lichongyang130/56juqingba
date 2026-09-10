import type { Metadata } from "next";
import Link from "next/link";
import { CHALLENGES } from "@/lib/community";
import { ForkButton, ForkedList, LocalSubmissionList } from "@/components/community-ui-2";

export const metadata: Metadata = {
  title: "Remix board — Motif UI",
  description: "Community remixes, forked into your own set: your local submissions plus the sample challenge entries, with the original always linked.",
};

export default function RemixesPage() {
  const sample = CHALLENGES.flatMap((c) =>
    c.entries.map((e) => ({ ...e, challenge: c.title, slug: c.slug, deadline: c.deadline })),
  );

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/community" className="hover:text-ink">Community</Link>
        <span>/</span>
        <span className="text-ink-dim">Remix board</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Remix board · fork into your set</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Take a remix, keep the credit</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          Forking copies a remix record into your own set — the same list as your saved items, stored in this browser.
          Forked entries keep a link to the original and to the person who made the remix, because a fork that loses its
          provenance is just a copy.
        </p>
      </div>

      <section className="mt-9">
        <h2 className="border-b border-white/6 pb-3 text-xs font-bold uppercase tracking-[0.24em] text-violet-200">
          Your submissions
        </h2>
        <div className="mt-4">
          <LocalSubmissionList />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="border-b border-white/6 pb-3 text-xs font-bold uppercase tracking-[0.24em] text-amber-200">
          Challenge entries · sample records
        </h2>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
          These {sample.length} entries are the sample challenge records that ship with the demo, listed so the fork
          interaction has something real to act on. They are labelled as sample data on the{" "}
          <Link href="/community/challenges" className="font-semibold text-violet-300 hover:text-violet-200">
            challenge page
          </Link>{" "}
          too.
        </p>
        <div className="mt-4 space-y-3">
          {sample.map((e) => (
            <div key={e.id} className="rounded-2xl border border-white/8 bg-panel p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink">{e.title}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-ink-faint">
                    {e.id} · @{e.handle} · {e.challenge} · closed {e.deadline}
                  </p>
                </div>
                <ForkButton
                  remix={{
                    id: e.id,
                    title: e.title,
                    kind: "challenge entry",
                    note: e.note,
                    origin: `@${e.handle} · sample challenge entry`,
                  }}
                />
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">{e.note}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="chip !text-[10px]">score {e.score}</span>
                <span className={`chip !text-[10px] ${e.lint === "pass" ? "!border-mint/25 !text-mint" : "!border-amber-300/25 !text-amber-300"}`}>lint {e.lint}</span>
                <span className={`chip !text-[10px] ${e.safety === "pass" ? "!border-mint/25 !text-mint" : "!border-danger/25 !text-danger"}`}>safety {e.safety}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="border-b border-white/6 pb-3 text-xs font-bold uppercase tracking-[0.24em] text-mint">
          In your set
        </h2>
        <div className="mt-4">
          <ForkedList />
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
          Your set lives in <span className="font-mono">motif:forks</span> in this browser, alongside your saved items on{" "}
          <Link href="/saved" className="font-semibold text-violet-300 hover:text-violet-200">
            the saved list
          </Link>
          . Nothing is uploaded, and clearing site data clears the set.
        </p>
      </section>

      <div className="mt-9 rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-sm font-extrabold">Why forks need provenance more than they need storage</p>
        <p className="mt-2 max-w-3xl text-xs leading-relaxed text-ink-dim">
          A fork is the easiest place to lose a credit: you copy the thing, you delete the paragraph above it, and the
          author disappears. Every fork here carries two pointers — the published asset it was based on, and the remixer
          who made it. The{" "}
          <Link href="/community/attribution" className="font-semibold text-violet-300 hover:text-violet-200">
            attribution policy
          </Link>{" "}
          is the longer version of the same rule.
        </p>
      </div>
    </div>
  );
}
