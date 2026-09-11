import type { Metadata } from "next";
import Link from "next/link";
import { BACKGROUNDS, COMPONENTS, PROMPTS } from "@/lib/data";
import { LEARN_ARTICLES } from "@/lib/learn";
import { CRAWL_EXCLUDES } from "@/app/robots";

export const metadata: Metadata = {
  title: "Crawl inventory — what is indexed and what is not — Motif UI",
  description:
    "The sitemap by content type, the surfaces kept out of the index with a reason for each, and the counts behind both lists.",
  robots: { index: false },
};

export default function CrawlPage() {
  const groups = [
    { label: "Components", count: COMPONENTS.length, sample: `/components/${COMPONENTS[0].slug}`, index: true },
    { label: "Prompts", count: PROMPTS.length, sample: `/prompts/${PROMPTS[0].slug}`, index: true },
    { label: "Essays", count: LEARN_ARTICLES.length, sample: `/learn/${LEARN_ARTICLES[0].slug}`, index: true },
    { label: "Backgrounds", count: BACKGROUNDS.length, sample: "/backgrounds", index: true, note: "one page, one anchor per background" },
  ];

  const total = groups.reduce((a, g) => a + g.count, 0);

  const excluded = [
    { path: "/admin", why: "A local demo console. Nothing there is content, and an indexed admin would be an invitation." },
    { path: "/search", why: "Result pages are queries, not pages: thousands of near-identical permutations with no standalone value." },
    { path: "/saved", why: "Your saved list is browser-local — a crawler would index an empty page and call it content." },
    { path: "/saved/stack", why: "A recipe link is meant to be shared between people, not harvested; the route is noindex as well." },
    { path: "/habits", why: "Streaks and check-ins are empty without local storage." },
    { path: "/embed/", why: "Embeds are for other people's iframes, and would compete with the real detail pages." },
    { path: "/api/exports/", why: "Files and JSON are for tools, not for the index." },
    { path: "/digest", why: "The weekly digest is dated and duplicated by the components and prompts it points at." },
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
        <span className="text-ink-dim">Crawl inventory</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">SEO · what gets indexed</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">The crawl surface</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          One sitemap, grouped by content type, generated from the same data the pages render. {total} indexable assets across four groups, plus
          the hub and marketing pages. Eight surfaces are kept out, and this page lists them with a reason instead of hiding the rule in a config
          file.
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
                  <td className="px-4 py-2 text-ink-faint">{g.note ?? "one URL per asset, dated from its published field"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-amber-200">Kept out of the index</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-faint">
          The same list is compiled into <span className="font-mono">robots.txt</span> from{" "}
          <span className="font-mono">src/app/robots.ts</span>; the harness checks the two agree, so this table cannot drift from the rule.
        </p>
        <div className="mt-4 space-y-3">
          {excluded.map((row, i) => (
            <div key={row.path} className="flex flex-wrap items-start gap-3 rounded-2xl border border-white/8 bg-panel p-4">
              <span className="font-mono text-[11px] text-amber-100">{row.path}</span>
              <span className="chip !text-[9px] uppercase">noindex</span>
              <span className="text-[10px] text-ink-faint">
                {CRAWL_EXCLUDES[i] === row.path.replace(/\/$/, "") || CRAWL_EXCLUDES.includes(row.path) ? "in robots.txt" : ""}
              </span>
              <p className="w-full text-[11px] leading-relaxed text-ink-dim">{row.why}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">Why publish the exclusion list</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          A noindex rule is invisible by design, which makes it easy to apply too broadly and never notice. Printing the list next to the reason
          turns it into a decision someone can disagree with — and the counts above make it obvious when a group is missing entirely, which is the
          failure mode that actually costs traffic.
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
