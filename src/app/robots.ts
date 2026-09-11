// #469 (crawl rules) — what stays out of the index, and why.
//
// The rule everywhere else on the site is "index pages with content, keep thin
// surfaces out". This file is the enforcement; /quality/crawl prints the same
// list so the decision is visible instead of buried in a config.

import type { MetadataRoute } from "next";
import { CRAWL_EXCLUDES } from "@/lib/crawl";
import { SITE_URL } from "@/lib/seo";

// 519 — the list moved to lib/crawl.ts so the rule the sitemap follows, the
// rule this file enforces and the table on /quality/crawl are one list. Each
// excluded route also carries `robots: { index: false }`, because a Disallow
// rule is a request not to fetch, not a request to forget: the harness checks
// both halves.
export { CRAWL_EXCLUDES };

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: CRAWL_EXCLUDES,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
