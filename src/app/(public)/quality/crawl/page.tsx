import type { Metadata } from "next";
import Link from "next/link";
import sitemap from "@/app/sitemap";
import { CRAWL_EXCLUSIONS } from "@/lib/crawl";
import { SITEMAP_EXTRA_PATHS } from "@/lib/crawl";
import { BACKGROUNDS, CHANGELOG, COMPONENTS, PROMPTS } from "@/lib/data";
import { LEARN_ARTICLES } from "@/lib/learn";
import { changeLogSlug } from "@/lib/spine";

export const metadata: Metadata = {
  title: "Crawl inventory — what is indexed and what is not — Motif UI",
  description:
    "The sitemap by content type, the surfaces kept out of the index with a reason for each, and the counts behind both lists.",
  robots: { index: false },
};

// 519 — the numbers here used to be prose: “{4 families} indexable assets across
// four groups, plus the hub and marketing pages”, while the sitemap only had the
// four groups and the build had 103 more indexable pages. The total below is now
// the length of the sitemap function itself, and check:exports compares it with
// the served /sitemap.xml, so the sentence cannot describe a different site than
// the file.
export default function CrawlPage() {
  const groups = [
    { label: "Components", count: COMPONENTS.length, sample: `/components/${COMPONENTS[0].slug}`, note: "one URL per asset, dated from its published field" },
    { label: "Prompts", count: PROMPTS.length, sample: `/prompts/${PROMPTS[0].slug}`, note: "one URL per asset, dated from its published field" },
    { label: "Essays", count: LEARN_ARTICLES.length, sample: `/learn/${LEARN_ARTICLES[0].slug}`, note: "one URL per guide, dated from updated" },
    { label: "Backgrounds", count: 1, sample: "/backgrounds", note: `one page, one anchor each — ${BACKGROUNDS.length} backgrounds` },
    { label: "Studio log", count: CHANGELOG.length, sample: `/changelog/${changeLogSlug(CHANGELOG[0])}`, note: "one URL per entry, dated from the entry" },
    { label: "Everything else", count: SITEMAP_EXTRA_PATHS.length, sample: SITEMAP_EXTRA_PATHS[0], note: "hub, brand, perf, pro, integrations, community and tool pages" },
  ];

  const total = sitemap().length;

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
        <span className="text-ink-dim">Crawl inventory</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">SEO · what gets indexed</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">The crawl surface</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          One sitemap, grouped by content type, generated from the same data the pages render — {total} URLs in this build, one per catalog record,
          one per studio-log entry, and the hub pages that are neither. {CRAWL_EXCLUSIONS.length} surfaces are kept out, and this page lists them
          with a reason instead of hiding the rule in a config file.
        </p>
      </div>

      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-200">In the sitemap</h2>
          <a href="/sitemap.xml" className="text-[11px] font-semibold text-cyan-300 hover:text-cyan-200">
            Open /sitemap.xml →
          </a>
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/8">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-white/[.03] text-[10px] uppercase tracking-widest text-ink-faint">
              <tr>
                <th className="px-4 py-2 font-bold">Group</th>
                <th className="px-4 py-2 font-bold">Pages</th>
                <th className="px-4 py-2 font-bold">Example</th>
                <th className="px-4 py-2 font-bold">Note</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <tr key={g.label} className="border-t border-white/6">
                  <td className="px-4 py-2 font-semibold">{g.label}</td>
                  <td className="px-4 py-2 font-mono tabular-nums">{g.count}</td>
                  <td className="px-4 py-2">
                    <Link href={g.sample} className="font-mono text-cyan-200 hover:underline">
                      {g.sample}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-ink-faint">{g.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">
          The catalog groups and the studio log are derived from the records themselves, so publishing an asset adds its URL without anyone editing
          a file here. The last row is the list in <span className="font-mono">src/lib/crawl.ts</span> — the pages a stranger can land on that are not
          a catalog record.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-amber-200">Kept out of the index</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-faint">
          Each row is excluded twice, and the two halves do different jobs: a{" "}
          <span className="font-mono">Disallow</span> rule in <span className="font-mono">robots.txt</span> asks a crawler not to fetch the URL, and a{" "}
          <span className="font-mono">robots: index: false</span> tag on the page itself is what keeps it out of the index. Until this batch the second
          half was missing on five of these surfaces, which is the trap the table exists to expose.
        </p>
        <div className="mt-4 space-y-3">
          {CRAWL_EXCLUSIONS.map((row) => (
            <div key={row.path} className="flex flex-wrap items-start gap-3 rounded-2xl border border-white/8 bg-panel p-4">
              <span className="font-mono text-[11px] text-amber-100">{row.path}</span>
              <span className="chip !text-[9px] uppercase">robots.txt</span>
              <span className="chip !text-[9px] uppercase">{row.path.endsWith("/") ? "prefix rule" : "noindex"}</span>
              <p className="w-full text-[11px] leading-relaxed text-ink-dim">{row.why}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">Why publish the exclusion list</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          A noindex rule is invisible by design, which makes it easy to apply too broadly and never notice. Printing the list next to the reason turns
          it into a decision someone can disagree with — and the counts above make it obvious when a group is missing entirely, which is the failure
          mode that actually costs traffic. That is not hypothetical here: the audit that produced this batch found the studio log, the brand pages,
          /perf/*, /pro/*, /integrations/*, /community/* and two tool pages rendered indexable and absent from the sitemap, because the sitemap was
          written by hand and nothing compared it with the build. The harness now walks every built page and fails if an indexable one is unlisted, or
          if an excluded one has no noindex tag.
        </p>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-faint">
          Structured data has its own register on{" "}
          <Link href="/quality/schema" className="font-semibold text-cyan-300 hover:text-cyan-200">
            /quality/schema
          </Link>
          , including the types this site refuses to emit.
        </p>
      </section>
    </div>
  );
}
