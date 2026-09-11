// 519 — the crawl rule in one module.
//
// Before this file the rule lived in three places that had to agree by hand:
// the sitemap listed the catalog families, robots.ts listed what to keep out,
// and /quality/crawl described both in prose. Nothing compared them, and the
// audit that produced this file found the consequence: 104 pages were rendered
// indexable and absent from /sitemap.xml (the whole studio log, /brand/*,
// /perf/*, /pro/*, /integrations/*, /community/* and the lab and studio
// sub-pages), and five surfaces the crawl page called "kept out of the index"
// were only disallowed in robots.txt — which asks a crawler not to fetch a URL,
// never to keep it out of the index.
//
// So: one list here, and everything else derives from it.
//
//   - SITEMAP_EXTRA_PATHS  indexable pages that are not a catalog record.
//                          sitemap.ts appends them, and the build harness
//                          fails if a built page with a canonical and no
//                          noindex is missing from the sitemap.
//   - CRAWL_EXCLUSIONS     surfaces that must not be indexed. robots.ts turns
//                          them into Disallow rules; each route also carries
//                          `robots: { index: false }`, and the harness checks
//                          that the two halves exist together.

export interface CrawlExclusion {
  /** Path or path prefix, as it appears in robots.txt. */
  path: string;
  /** Why this surface is not content. Printed verbatim on /quality/crawl. */
  why: string;
}

export const CRAWL_EXCLUSIONS: CrawlExclusion[] = [
  { path: "/admin", why: "A local demo console. Nothing there is content, and an indexed admin would be an invitation." },
  { path: "/search", why: "Result pages are queries, not pages: thousands of near-identical permutations with no standalone value." },
  { path: "/saved", why: "Your saved list is browser-local — a crawler would index an empty page and call it content." },
  { path: "/saved/stack", why: "A recipe link is meant to be shared between people, not harvested; the route is noindex as well." },
  { path: "/habits", why: "Streaks and check-ins are empty without local storage." },
  { path: "/embed/", why: "Embeds are for other people's iframes, and would compete with the real detail pages." },
  { path: "/api/exports/", why: "Files and JSON are for tools, not for the index." },
  { path: "/digest", why: "The weekly digest is dated and duplicated by the components and prompts it points at." },
];

/** The list robots.txt compiles. Kept as a plain array so the two cannot drift. */
export const CRAWL_EXCLUDES = CRAWL_EXCLUSIONS.map((e) => e.path);

/**
 * Indexable pages that are not one of the four catalog families.
 *
 * This is the hub, marketing, quality, integration, tooling and community
 * surface — pages that stand on their own and answer a stranger's question.
 * The four families (133 components, 74 prompts, 60 essays, 33 backgrounds on
 * one index page) and the changelog are derived from their data instead, so a
 * new record appears in the sitemap without anyone editing a list here.
 */
export const SITEMAP_EXTRA_PATHS: string[] = [
  "/brand/launch",
  "/brand/logo",
  "/brand/mascot",
  "/brand/notes",
  "/brand/proof",
  "/brand/thanks",
  "/brand/voice",
  "/brand/wallpapers",
  "/brand/watermark",
  "/changelog",
  "/collections",
  "/community/attribution",
  "/community/badges",
  "/community/build-a-thon",
  "/community/challenges",
  "/community/craft-talk",
  "/community/day",
  "/community/events",
  "/community/leaderboard",
  "/community/loved",
  "/community/onboarding",
  "/community/outcomes",
  "/community/picks",
  "/community/provenance",
  "/community/re-run",
  "/community/recognition",
  "/community/remixes",
  "/community/requests",
  "/community/spotlight",
  "/community/submit",
  "/community/teams",
  "/community/translations",
  "/compare",
  "/es",
  "/integrations",
  "/integrations/badge",
  "/integrations/bookmarklet",
  "/integrations/catalog",
  "/integrations/cli",
  "/integrations/codesandbox",
  "/integrations/embed",
  "/integrations/feed",
  "/integrations/figma",
  "/integrations/og",
  "/integrations/print",
  "/integrations/react",
  "/integrations/single-file",
  "/integrations/storybook",
  "/integrations/tailwind",
  "/integrations/tokens",
  "/integrations/vscode",
  "/lab/layers",
  "/learn/paths",
  "/learn/questions",
  "/makers",
  "/metrics",
  "/perf",
  "/perf/blur",
  "/perf/build",
  "/perf/caching",
  "/perf/chunks",
  "/perf/devices",
  "/perf/fonts",
  "/perf/mounting",
  "/perf/no-images",
  "/perf/no-js",
  "/perf/prefetch",
  "/perf/service-worker",
  "/perf/timers",
  "/pro",
  "/pro/api",
  "/pro/bundles",
  "/pro/cancel",
  "/pro/changelog",
  "/pro/discounts",
  "/pro/enterprise",
  "/pro/licence",
  "/pro/promise",
  "/pro/referral",
  "/pro/teams",
  "/pro/trial",
  "/pro/unlimited",
  "/quality",
  "/quality/aria",
  "/quality/craft",
  "/quality/gates",
  "/quality/speed",
  "/roadmap",
  "/roadmap/embed",
  "/samples",
  "/shuffle",
  "/studio",
  "/sitemap",
  "/gaps",
  "/accessibility",
];
