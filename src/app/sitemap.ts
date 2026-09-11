// #467 — one sitemap, grouped by content type.
//
// Next emits this as /sitemap.xml. Everything listed here is a page a stranger
// could land on and find something; the thin surfaces (search results, the
// admin, embeds, browser-local habit pages) are excluded in robots.ts and the
// exclusion list is printed on /quality/crawl so the rule is inspectable.
//
// 519 — the audit that followed the 500-item programme found this file listing
// 278 URLs while the build rendered 381 indexable pages: the studio log, the
// brand pages, /perf/*, /pro/*, /integrations/*, /community/* and the lab and
// studio sub-pages were reachable and indexable but invisible here. The
// non-catalog pages now come from SITEMAP_EXTRA_PATHS in lib/crawl.ts (one list
// shared with the robots rules), the studio log is derived from its own data,
// and check:exports fails if a built page with a canonical and no noindex is
// missing from what this function emits.

import type { MetadataRoute } from "next";
import { BACKGROUNDS, CHANGELOG, COMPONENTS, PROMPTS } from "@/lib/data";
import { SITEMAP_EXTRA_PATHS } from "@/lib/crawl";
import { LEARN_ARTICLES } from "@/lib/learn";
import { SITE_URL, url } from "@/lib/seo";
import { changeLogSlug } from "@/lib/spine";

export default function sitemap(): MetadataRoute.Sitemap {
  const latest = (dates: string[]) => dates.reduce((a, b) => (b > a ? b : a), dates[0] ?? new Date().toISOString().slice(0, 10));

  const home: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: url("/components"), changeFrequency: "daily", priority: 0.9, lastModified: latest(COMPONENTS.map((c) => c.published)) },
    { url: url("/prompts"), changeFrequency: "weekly", priority: 0.8, lastModified: latest(PROMPTS.map((p) => p.published)) },
    { url: url("/backgrounds"), changeFrequency: "weekly", priority: 0.7 },
    { url: url("/learn"), changeFrequency: "weekly", priority: 0.8, lastModified: latest(LEARN_ARTICLES.map((a) => a.updated)) },
    { url: url("/lab"), changeFrequency: "monthly", priority: 0.6 },
    { url: url("/templates"), changeFrequency: "weekly", priority: 0.6 },
    { url: url("/community"), changeFrequency: "daily", priority: 0.5 },
    { url: url("/pricing"), changeFrequency: "monthly", priority: 0.5 },
    { url: url("/mission"), changeFrequency: "yearly", priority: 0.3 },
    { url: url("/glossary"), changeFrequency: "monthly", priority: 0.4 },
  ];

  const components: MetadataRoute.Sitemap = COMPONENTS.map((c) => ({
    url: url(`/components/${c.slug}`),
    lastModified: c.published,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const prompts: MetadataRoute.Sitemap = PROMPTS.map((p) => ({
    url: url(`/prompts/${p.slug}`),
    lastModified: p.published,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const essays: MetadataRoute.Sitemap = LEARN_ARTICLES.map((a) => ({
    url: url(`/learn/${a.slug}`),
    lastModified: a.updated,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  // Backgrounds live on one page each as an anchor, so the index carries them;
  // listing every anchor as a separate URL would inflate the sitemap without
  // giving a crawler a new page to read.
  const backgrounds: MetadataRoute.Sitemap = [
    { url: url("/backgrounds"), changeFrequency: "weekly", priority: 0.6, lastModified: latest(BACKGROUNDS.map((b) => (b as { published?: string }).published ?? "2026-09-01")) },
  ];

  // The studio log: one index page and one URL per entry, both derived from
  // CHANGELOG so a new entry is in the sitemap the moment it is published.
  const log: MetadataRoute.Sitemap = CHANGELOG.map((e) => ({
    url: url(`/changelog/${changeLogSlug(e)}`),
    lastModified: e.date,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  // Everything indexable that is not a catalog record — brand, perf, pro,
  // integrations, community, quality, tools. One list, shared with robots.ts.
  const rest: MetadataRoute.Sitemap = SITEMAP_EXTRA_PATHS.map((path) => ({
    url: url(path),
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  // Deduplicated: /backgrounds is both a hub and the family index, and a URL
  // listed twice is a URL a crawler is handed twice. First mention wins, which
  // keeps the higher priority the hub entry carries.
  const all = [...home, ...components, ...prompts, ...essays, ...backgrounds, ...log, ...rest];
  const seen = new Set<string>();
  return all.filter((entry) => (seen.has(entry.url) ? false : (seen.add(entry.url), true)));
}
