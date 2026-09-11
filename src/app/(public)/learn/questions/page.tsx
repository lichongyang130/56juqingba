import type { Metadata } from "next";
import Link from "next/link";
import { COMPONENTS } from "@/lib/data";
import { LEARN_ARTICLES } from "@/lib/learn";
import { QUERIES } from "@/lib/queries";
import { faqLd, jsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Questions the guides answer — Motif UI",
  description:
    "Eighteen questions people actually search for, each paired with the guide that answers it and the component that proves it — curated, not generated.",
};

export default function LearnQuestionsPage() {
  // Resolved at build time: a renamed essay or asset removes the row here and
  // fails the export harness, rather than shipping a question that leads
  // nowhere.
  const rows = QUERIES.map((q) => ({
    q,
    essay: LEARN_ARTICLES.find((a) => a.slug === q.essay),
    asset: COMPONENTS.find((c) => c.slug === q.asset),
  })).filter((r) => r.essay && r.asset);

  const answers = new Set(rows.map((r) => r.essay!.slug));

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqLd(rows.map((r) => ({ q: r.q.question, a: `${r.q.because} Read it in “${r.essay!.title}”, or open ${r.asset!.title} for the code.` })))) }} />

      <nav className="flex flex-wrap items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <Link href="/learn" className="hover:text-ink">
          Learn
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Questions</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">Learn · long-tail answers</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Questions the guides answer</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          {rows.length} questions phrased the way people search them, each paired with the essay that answers it and the component that proves
          it. Every pair is checked at build time: if an essay or asset is renamed, the row disappears from this page and the harness fails,
          which is the difference between a question map and a list of dead links.
        </p>
        <p className="mt-2 text-[11px] leading-relaxed text-ink-faint">
          Curated, not generated. Prefixing an essay title with &ldquo;how to&rdquo; produces a sentence, not a question, and the gap shows the
          moment someone reads it. {answers.size} of the {LEARN_ARTICLES.length} guides are the best answer to at least one of these.
        </p>
      </div>

      <ol className="mt-10 space-y-4">
        {rows.map((r, i) => (
          <li key={r.q.question} className="rounded-3xl border border-white/8 bg-panel p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="max-w-2xl text-base font-extrabold tracking-tight">
                <span className="mr-2 font-mono text-[11px] text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                {r.q.question}
              </h2>
              <Link href={`/learn/${r.essay!.slug}`} className="shrink-0 text-[11px] font-semibold text-emerald-300 hover:text-emerald-200">
                Read the guide →
              </Link>
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-ink-dim">{r.q.because}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
              <Link href={`/learn/${r.essay!.slug}`} className="chip hover:text-ink">
                {r.essay!.title} · {r.essay!.minutes} min
              </Link>
              <Link href={`/components/${r.asset!.slug}`} className="chip hover:text-ink">
                {r.asset!.title} · {r.asset!.bundleKb.toFixed(1)} KB
              </Link>
            </div>
          </li>
        ))}
      </ol>

      <section className="mt-10 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">Why an answer page beats a keyword page</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          A page that repeats a phrase answers nothing; a page that answers a question earns the next one. Each row above carries three things
          a search result can be judged on: the question in its own words, a guide that takes a position, and code you can open to check whether
          the position survives contact. The FAQ markup on this page is generated from the same rows, so the structured data cannot drift from
          what a reader sees.
        </p>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-faint">
          The other direction is on every component page: a &ldquo;read next&rdquo; rail of two guides and a prompt, scored by shared tags —
          the crawlable spine behind this page.
        </p>
      </section>
    </div>
  );
}
