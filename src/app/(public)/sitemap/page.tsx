import type { Metadata } from "next";
import Link from "next/link";
import sitemap from "@/app/sitemap";
import { CRAWL_EXCLUSIONS } from "@/lib/crawl";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sitemap — every page, grouped",
  description:
    "The whole site as one page: every route grouped by family with counts, plus the surfaces deliberately kept out of the index and the reason for each.",
  alternates: { canonical: "/sitemap" },
};

/**
 * #63 — the crawler sitemap has existed since #467 and is machine-readable only.
 * This is the same list for a person: `sitemap()` is imported rather than
 * re-listed, so a URL the XML carries appears here, and the harness fails if
 * the two counts disagree.
 *
 * The grouping is by first path segment, because that is the site's own
 * structure — /components/*, /prompts/*, /learn/* and the rest — not a
 * hand-written taxonomy that would drift from it.
 */

const HUBS = ["/", "/components", "/prompts", "/learn", "/backgrounds", "/changelog"];

const FAMILIES: { prefix: string; label: string; note: string }[] = [
  { prefix: "", label: "Home and family hubs", note: "the front page and the top of each family" },
  { prefix: "/components/", label: "Component pages", note: "one page per asset, dated from its published field" },
  { prefix: "/prompts/", label: "Prompt pages", note: "one page per template, with its recorded runs" },
  { prefix: "/learn/", label: "Learn essays", note: "one page per guide, dated from its last edit" },
  { prefix: "/changelog/", label: "Studio log", note: "one page per entry, derived from the changelog data" },
];

export default function HumanSitemapPage() {
  const entries = sitemap().map((e) => e.url.replace(SITE_URL, "") || "/");
  const sorted = [...entries].sort();
  const seen = new Set<string>();

  const grouped = FAMILIES.map((family) => {
    const urls = sorted.filter((u) => {
      if (family.prefix === "") return HUBS.includes(u);
      return u.startsWith(family.prefix) && u.slice(family.prefix.length).length > 0;
    });
    urls.forEach((u) => seen.add(u));
    return { ...family, urls };
  });

  const rest = sorted.filter((u) => !seen.has(u));
  const families = [
    ...grouped.slice(1),
    { prefix: "—", label: "Everything else", note: "brand, perf, pro, integrations, community and the tool pages", urls: rest },
    ...grouped.slice(0, 1),
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Sitemap</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Structure · every page</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          {entries.length} pages, <span className="text-gradient">grouped</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          The same list the crawler gets, from the same function: this page imports <span className="font-mono">sitemap()</span>, so anything that
          reaches{" "}
          <Link href="/sitemap.xml" className="font-semibold text-cyan-300 hover:text-cyan-200">
            /sitemap.xml
          </Link>{" "}
          appears below, and the harness fails if the two counts differ. {CRAWL_EXCLUSIONS.length} surfaces are deliberately kept out of the index;
          they are listed at the end with the reason for each.
        </p>
      </div>

      {families.map((family) => (
        <section key={family.label} className="mt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/6 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-200">{family.label}</h2>
            <span className="text-[11px] text-ink-faint">
              {family.urls.length} {family.urls.length === 1 ? "page" : "pages"} · {family.note}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {family.urls.map((u) => (
              <Link
                key={u}
                href={u}
                className="rounded-lg border border-white/8 bg-white/[.02] px-2.5 py-1 font-mono text-[11px] text-ink-dim transition-colors hover:border-emerald-300/30 hover:text-emerald-200"
              >
                {u}
              </Link>
            ))}
          </div>
        </section>
      ))}

      <section className="mt-12 rounded-3xl border border-amber-300/20 bg-amber-300/[.03] p-6">
        <h2 className="text-sm font-extrabold tracking-tight text-amber-100">Not in the index</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-amber-100/70">
          Each of these carries a <span className="font-mono">robots: index: false</span> tag and a{" "}
          <span className="font-mono">Disallow</span> line. The rule and the reasons live in{" "}
          <span className="font-mono">src/lib/crawl.ts</span> and are printed in full on{" "}
          <Link href="/quality/crawl" className="underline decoration-dotted">
            the crawl inventory
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {CRAWL_EXCLUSIONS.map((row) => (
            <span key={row.path} className="rounded-lg border border-white/8 bg-white/[.02] px-2.5 py-1 font-mono text-[11px] text-ink-faint">
              {row.path}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
