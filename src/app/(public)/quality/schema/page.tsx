import type { Metadata } from "next";
import Link from "next/link";
import { COMPONENTS, PROMPTS } from "@/lib/data";
import { LEARN_ARTICLES } from "@/lib/learn";
import { ASSET_FAQ_QUESTIONS } from "@/lib/schema-map";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Structured data — what ships and what does not — Motif UI",
  description:
    "The exact schema.org types this site emits, the ones it deliberately omits and why, plus the origin every canonical resolves against.",
  robots: { index: false },
};

export default function SchemaPage() {
  const shipped = [
    {
      type: "FAQPage",
      where: "every component page and prompt page",
      why: `Built from the asset's own record — size, dependencies, licence, audit score, stack — and from each prompt's run log. ${COMPONENTS.length} component pages and ${PROMPTS.length} prompt pages, ${ASSET_FAQ_QUESTIONS} question patterns in total.`,
      check: "/components/halo-button",
    },
    {
      type: "BreadcrumbList",
      where: "component, prompt and essay pages",
      why: "Two levels, printed as the same trail the page shows at the top. No invented hierarchy.",
      check: "/learn/the-keyboard-walk",
    },
    {
      type: "Article",
      where: "every Learn essay",
      why: `headline, deck, dateModified and publisher — the fields the page actually renders. ${LEARN_ARTICLES.length} essays, dated from the same field as the visible "updated" stamp.`,
      check: "/learn/springs-are-not-easings",
    },
    {
      type: "DefinedTermSet",
      where: "/glossary",
      why: "Ten terms defined by the behaviour they describe, each with a live example.",
      check: "/glossary",
    },
  ];

  const omitted = [
    {
      type: "Product",
      why: "There is no product: no price, no SKU and no store. The Pro plan is a preview page with no checkout behind it, so a Product node would describe something that cannot be bought.",
    },
    {
      type: "AggregateRating / Review",
      why: "Nothing on this site collects ratings. The a11y and quality numbers are automated audit scores from the source, not user reviews, and presenting them as ratings would be the exact overclaim the audits exist to prevent.",
    },
    {
      type: "Offer",
      why: "No checkout, no availability, no currency. The pricing page states what a plan would cost and says plainly that the button is a demo.",
    },
    {
      type: "HowTo",
      where: "+hint",
      why: "The essays read like tutorials, and Google has been explicit that HowTo rich results are no longer shown for most sites. The pages already answer the question; the markup would be a claim with no audience.",
    },
    {
      type: "Event",
      why: "The build-a-thon windows and community days are computed dates for a solo project, not booked events with a venue, an organiser and tickets.",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <Link href="/quality" className="hover:text-ink">
          Quality bar
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Structured data</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">SEO · honest schema</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">What ships in the markup</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          Structured data is where a site is most tempted to overclaim, because a crawler cannot argue with it. This page is the register: every
          schema.org type Motif emits, every type it refuses to emit, and the reason for each. The counts below are read from the catalog, and
          the page itself is <span className="font-mono">noindex</span> — it is documentation, not content.
        </p>
      </div>

      <section className="mt-10">
        <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-200">Shipped</h2>
        <div className="mt-4 space-y-4">
          {shipped.map((row) => (
            <div key={row.type} className="rounded-2xl border border-white/8 bg-panel p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[12px] font-bold text-emerald-100">{row.type}</span>
                <span className="chip !text-[9px] uppercase">{row.where}</span>
                <Link href={row.check} className="ml-auto text-[10px] font-semibold text-violet-300 hover:text-violet-200">
                  Check a live page →
                </Link>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">{row.why}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-amber-200">Deliberately absent</h2>
        <div className="mt-4 space-y-4">
          {omitted.map((row) => (
            <div key={row.type} className="rounded-2xl border border-amber-300/20 bg-amber-400/[.04] p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[12px] font-bold text-amber-100 line-through decoration-amber-300/60">{row.type}</span>
                <span className="chip !border-amber-300/30 !text-[9px] uppercase text-amber-200">not emitted</span>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">{row.why}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">The origin problem</h2>
        <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
          Every canonical, OG URL and sitemap entry resolves against{" "}
          <span className="font-mono">{SITE_URL}</span>, which comes from{" "}
          <span className="font-mono">NEXT_PUBLIC_SITE_URL</span> when the deployment sets it and falls back to the placeholder domain in{" "}
          <span className="font-mono">src/lib/site.ts</span> otherwise. That placeholder is not a live domain, so an absolute canonical built from
          it is wrong until the site is deployed — which is exactly why the base is one constant with one override rather than strings scattered
          across metadata blocks.
        </p>
        <p className="mt-2 text-[11px] leading-relaxed text-ink-faint">
          The harness checks that every page&apos;s canonical uses this base and that no <span className="font-mono">Product</span>,{" "}
          <span className="font-mono">Offer</span> or <span className="font-mono">AggregateRating</span> node appears anywhere in the rendered
          HTML — the &ldquo;absent&rdquo; list above is verified, not just promised.
        </p>
      </section>
    </div>
  );
}
