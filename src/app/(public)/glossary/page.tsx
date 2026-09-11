import type { Metadata } from "next";
import Link from "next/link";
import { COMPONENTS, PROMPTS } from "@/lib/data";
import { jsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Glossary — the words this site uses — Motif UI",
  description:
    "Fidelity score, run log, concept render, audit, tier and the rest of Motif's vocabulary, each defined with a live example rather than a marketing gloss.",
};

interface Term {
  term: string;
  short: string;
  body: string;
  example: { label: string; href: string };
  count?: string;
}

export default function GlossaryPage() {
  const bestPrompt = [...PROMPTS].sort((a, b) => b.avgFidelity - a.avgFidelity)[0];
  const runs = PROMPTS.reduce((a, p) => a + p.runs.length, 0);
  const live = COMPONENTS.find((c) => c.slug === "status-banner") ?? COMPONENTS[0];

  const terms: Term[] = [
    {
      term: "Fidelity score",
      short: "How closely a model's output matched the brief it was given.",
      body: `Scored 0–100 per run by comparing the rendered result with the brief's checklist — layout blocks present, type scale honoured, motion described in the block, and no invented sections. It measures agreement with the brief, not beauty: a plain page that follows the brief scores higher than a beautiful one that ignores it.`,
      example: { label: `${bestPrompt.title} — ${bestPrompt.avgFidelity}% average`, href: `/prompts/${bestPrompt.slug}` },
      count: `${runs} runs scored`,
    },
    {
      term: "Run log",
      short: "Every model, date, score and failure kept on the prompt page.",
      body: "A prompt ships with the runs that produced it, including the ones that failed to build. A prompt page with no failed runs says so rather than implying universal success — the log is a record, not a highlight reel.",
      example: { label: "Run logs on the prompts hub", href: "/prompts" },
      count: `${PROMPTS.length} prompts`,
    },
    {
      term: "Concept render",
      short: "The poster drawn from a prompt, not a screenshot of a model's output.",
      body: "Prompt posters are generated from the prompt's own metadata — blocks, palette, industry — and are labelled as concept renders because the site ships no model screenshots. Calling a drawing a screenshot would be the easiest lie to tell here, so the label is part of the component.",
      example: { label: "Poster gallery", href: "/prompts" },
    },
    {
      term: "Audit (a11y / quality)",
      short: "Two 0–100 scores on every asset, with the checks named.",
      body: "The a11y score covers keyboard reach, focus visibility, label text and reduced-motion handling; the quality score covers originality, token coverage and the size budget for its kind. Both are automated checks against the source, not a human certificate, and the audit page prints what they do not cover.",
      example: { label: `Worked example: ${live.title} (${live.a11yScore}/${live.qualityScore})`, href: `/components/${live.slug}` },
      count: `${COMPONENTS.length} assets scored`,
    },
    {
      term: "Tier (performance)",
      short: "Low, mid or high — what a background costs before you use it.",
      body: "Every background is placed in a tier from its paint cost: low is a static gradient or a single CSS animation, mid adds layered blur or many small elements, high leans on WebGL or hundreds of animated nodes. The tier is a promise about the cheap path, not a claim about your device.",
      example: { label: "Backgrounds with tiers", href: "/backgrounds" },
    },
    {
      term: "Size budget",
      short: "A per-kind ceiling in KB, checked at build time.",
      body: "Elements get 8 KB, animated pieces 10 KB, sections 8 KB and templates 28 KB. The number is the measured source size of the component, and an asset that goes over shows the overage rather than hiding it.",
      example: { label: "Budgets and their current standings", href: "/quality" },
      count: `${COMPONENTS.length} assets checked`,
    },
    {
      term: "Run-tested",
      short: "A prompt that has been executed, not merely written.",
      body: "“Run-tested” means at least three recorded runs exist and the prompt body matches the one that was executed. It is not a quality claim about the prompt's subject.",
      example: { label: "See which prompts qualify", href: "/prompts" },
    },
    {
      term: "Browser-local",
      short: "Saved lists, streaks and stickers that never leave the machine.",
      body: "Motif has no accounts, so anything personal is stored under a motif:* key in your browser and is readable only there. Every panel names its key; clearing site data is the delete button.",
      example: { label: "The habits drawer", href: "/habits" },
    },
    {
      term: "Skeleton",
      short: "A placeholder that reserves the space content will occupy.",
      body: "Skeletons are only useful if their box matches the final content — a skeleton that shifts when it resolves is worse than a spinner. The pattern is used in the demo panels and the preloader scene, both of which reserve the exact final height.",
      example: { label: "Skeleton card component", href: "/components/skeleton-card" },
    },
    {
      term: "Reduced motion",
      short: "The visitor's own setting, honoured by every moving scene.",
      body: "Where a scene would loop or travel, prefers-reduced-motion stops it and leaves the end state or a static equivalent. It is treated as a preference, not a fallback: the reduced version is designed, not merely disabled.",
      example: { label: "How the scenes handle it", href: "/quality" },
    },
  ];

  const definedTermSet = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Motif UI glossary",
    hasDefinedTerm: terms.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: `${t.short} ${t.body}`,
    })),
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(definedTermSet) }} />

      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Glossary</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Vocabulary</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">The words this site uses</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          Motif leans on a few words — fidelity, run log, audit, tier — that mean something specific here and something vague elsewhere. Each
          entry below is defined the way the site actually behaves, with a live example to check it against. If a definition and a page
          disagree, the page is right and this list is the bug.
        </p>
      </div>

      <dl className="mt-10 grid gap-4 md:grid-cols-2">
        {terms.map((t) => (
          <div key={t.term} className="flex flex-col rounded-3xl border border-white/8 bg-panel p-5">
            <dt className="flex flex-wrap items-baseline gap-2">
              <span className="text-base font-extrabold tracking-tight">{t.term}</span>
              {t.count && <span className="chip !text-[9px] uppercase">{t.count}</span>}
            </dt>
            <dd className="mt-2 text-[11px] font-semibold leading-relaxed text-ink-dim">{t.short}</dd>
            <dd className="mt-2 flex-1 text-[11px] leading-relaxed text-ink-faint">{t.body}</dd>
            <dd className="mt-3">
              <Link href={t.example.href} className="text-[11px] font-semibold text-cyan-300 hover:text-cyan-200">
                {t.example.label} →
              </Link>
            </dd>
          </div>
        ))}
      </dl>

      <section className="mt-10 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">Why a glossary earns its page</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          Two reasons, one of them selfish. The selfish one: people search for definitions, and a term defined precisely is a page that answers a
          real question instead of chasing a keyword. The honest one: this site asks you to trust numbers — scores, budgets, run counts — and
          numbers are only trustworthy when the words around them are pinned down. “Fidelity” without a definition is decoration.
        </p>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-faint">
          The markup on this page is a <span className="font-mono">DefinedTermSet</span>, which is a real schema.org type for exactly this. There
          is no <span className="font-mono">FAQPage</span> here, because the same content repeated under two types is spam with extra steps — the
          rules for which markup this site ships are on{" "}
          <Link href="/quality/schema" className="font-semibold text-cyan-300 hover:text-cyan-200">
            /quality/schema
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
