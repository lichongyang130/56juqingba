// #469 (crawl rules) — what stays out of the index, and why.
//
// The rule everywhere else on the site is "index pages with content, keep thin
// surfaces out". This file is the enforcement; /quality/crawl prints the same
// list so the decision is visible instead of buried in a config.

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/** Kept in sync with the table on /quality/crawl by the export harness. */
export const CRAWL_EXCLUDES = [
  "/admin",
  "/search",
  "/saved",
  "/saved/stack",
  "/habits",
  "/embed/",
  "/api/exports/",
  "/digest",
];

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
