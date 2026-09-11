import type { Metadata } from "next";
import Link from "next/link";
import { LEARN_ARTICLES } from "@/lib/learn";

export const metadata: Metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/community/translations" },
  title: "Translations",
  description: "Crowd translations of the Motif guides: what CC BY 4.0 allows, the workflow, a do-not-translate glossary, and an honest status table that currently reads zero community translations.",
};

const GLOSSARY = [
  { term: "Motif UI", keep: "Never translated — it is the name.", why: "Translated brands read as a different product." },
  { term: "audit score / a11y score", keep: "Keep the English term in Latin scripts; gloss it once on first use.", why: "It is a link target and a label on every card." },
  { term: "fidelity", keep: "Translate, but keep the English in brackets on first use.", why: "Every prompt page is scored with this exact word." },
  { term: "component slugs (combo-box, halo-button…)", keep: "Never translated or re-cased.", why: "They are URLs." },
  { term: "reduced motion", keep: "Use the platform term of your locale, not a literal translation.", why: "It is an OS setting name users already see." },
  { term: "bundle budget", keep: "Translate the phrase, keep the KB numbers exactly as published.", why: "The numbers are the claim." },
];

export default function TranslationsPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/community" className="hover:text-ink">Community</Link>
        <span>/</span>
        <span className="text-ink-dim">Translations</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-mint">Translations · CC BY 4.0</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Translate a guide, keep the credit</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          All {LEARN_ARTICLES.length} guides are published under CC BY 4.0, which means translation is explicitly allowed —
          you do not need to ask. What you do need is the attribution line, which is why the workflow below is short and
          the glossary is long.
        </p>
        <p className="mt-3 rounded-2xl border border-amber-300/25 bg-amber-300/[.04] px-4 py-3 text-[11px] leading-relaxed text-amber-200/90">
          Honest status: there are zero community translations today. The Spanish landing page at{" "}
          <Link href="/es" className="font-semibold text-amber-200 hover:text-amber-100">/es</Link> is ours, written to
          test the localisation route — it is not a community contribution and is not counted as one below.
        </p>
      </div>

      <section className="mt-9 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold">The workspace</h2>
        <p className="mt-2 text-xs leading-relaxed text-ink-dim">
          Translation is a form of remixing, and remixing is a form of review: the best translation note is the one that
          tells us where the original was unclear. Translate the file faithfully, then list the sentences you had to
          invent a term for.
        </p>
        <ol className="prose-list mt-3">
          <li>Pick a guide, and say which locale you are taking — a comment is enough, one translator per locale per guide avoids collisions.</li>
          <li>Translate the prose, the headings and the alt-equivalents. Do not translate slugs, component names, model names or the audit numbers.</li>
          <li>Keep the attribution block and the CC BY 4.0 note in the translated file, plus a line saying it is a translation of the English original.</li>
          <li>Include the glossary decisions you made, so the next translator of that locale does not re-litigate them.</li>
          <li>Send it through the submit flow with the guide slug in the “based on” field.</li>
        </ol>
      </section>

      <section className="mt-8 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold">Status by guide · all locales</h2>
        <div className="mt-3 overflow-hidden rounded-2xl border border-white/8">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-white/[.03] text-[10px] uppercase tracking-widest text-ink-faint">
              <tr>
                <th className="px-3 py-2 font-semibold">Guide</th>
                <th className="px-3 py-2 font-semibold">Minutes</th>
                <th className="px-3 py-2 font-semibold">Community translations</th>
                <th className="px-3 py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {LEARN_ARTICLES.map((a) => (
                <tr key={a.slug} className="border-t border-white/6">
                  <td className="px-3 py-2">
                    <Link href={`/learn/${a.slug}`} className="font-semibold text-ink hover:text-violet-200">
                      {a.title}
                    </Link>
                  </td>
                  <td className="px-3 py-2 font-mono text-ink-dim">{a.minutes}</td>
                  <td className="px-3 py-2 font-mono text-ink-dim">0</td>
                  <td className="px-3 py-2 text-ink-faint">needs a translator</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
          The zero column is the honest one. We would rather show {LEARN_ARTICLES.length} rows reading zero than seed the
          table with shadow translations to look international.
        </p>
      </section>

      <section className="mt-8 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold">Do-not-translate glossary</h2>
        <div className="mt-3 space-y-2">
          {GLOSSARY.map((g) => (
            <div key={g.term} className="rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3">
              <p className="font-mono text-[11px] font-bold text-ink">{g.term}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-ink-dim">{g.keep}</p>
              <p className="mt-0.5 text-[10px] leading-relaxed text-ink-faint">{g.why}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/8 bg-panel p-6">
        <p className="max-w-xl text-xs leading-relaxed text-ink-dim">
          Translation credits work exactly like remix credits: the English original keeps its author, the translation adds
          a translator name, and both stay on the page.
        </p>
        <div className="flex gap-2">
          <Link href="/community/attribution" className="btn btn-ghost !py-2 text-xs">Attribution policy</Link>
          <Link href="/community/submit?basedOn=" className="btn btn-primary !py-2 text-xs">Send a translation →</Link>
        </div>
      </div>
    </div>
  );
}
