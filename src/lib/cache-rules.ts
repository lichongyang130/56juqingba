// #405 — the cache rules, in one place.
//
// next.config.ts imports this to set the real headers, and /perf/caching prints
// the same objects. Keeping them in one module is the point: a cache policy
// that is documented separately from the one that ships is a policy that drifts.

export interface CacheRule {
  source: string;
  value: string;
  why: string;
}

// 522 — order is load-bearing, and the measurement disagrees with what this
// file used to say. Next applies every matching rule and the *last* one wins
// for the same header. This file used to list the catch-all last, on the
// theory that a later rule wins: the effect was that the catch-all won for
// everything. Measured on the batch-86 build:
//
//   /_next/static/chunks/<file>.js  → public, max-age=0, s-maxage=300, …
//   /embed.js                       → public, max-age=0, s-maxage=300, …   (route sets 3600)
//   /community/rss.xml              → public, max-age=0, s-maxage=300, …   (route sets s-maxage=3600)
//   /api/brand/<slug>               → public, max-age=0, s-maxage=300, …   (route sets 3600)
//
// So none of the 58 fingerprinted chunk files were immutable, and three route
// handlers lost the header they set for themselves. The catch-all is first now
// and every path that carries its own policy has a rule after it. The route
// handlers still set their own headers (they answer correctly on their own
// terms), and the rules below repeat the same values so that one readable list
// describes what the server actually sends.
export const CACHE_RULES: CacheRule[] = [
  {
    source: "/:path*",
    value: "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
    why: "HTML: the browser revalidates every time and the edge holds it for five minutes, serving stale for up to a day while it refreshes. A correction ships within five minutes without stampeding the origin.",
  },
  {
    source: "/_next/static/:path*",
    value: "public, max-age=31536000, immutable",
    why: "Every file under it carries a content hash in its name, so a changed file is a changed URL. Immutable is safe here and only here.",
  },
  {
    source: "/_next/image",
    value: "public, max-age=14400, must-revalidate",
    why: "The optimizer sets this one itself (14400 is its default) and a config rule does not override it; the row is here because the table claims to list what the server sends. No page in this build uses it — there are 0 <img> tags.",
  },
  {
    source: "/embed.js",
    value: "public, max-age=3600",
    why: "The one script tag a third-party site installs. An hour stops it being re-fetched per page view and still lets a fix reach existing embeds the same day.",
  },
  {
    source: "/community/rss.xml",
    value: "public, max-age=0, s-maxage=3600",
    why: "A feed that changes when an entry is written: the browser revalidates every time, the edge holds it for an hour.",
  },
  {
    source: "/community/feed.xml",
    value: "public, max-age=0, s-maxage=3600",
    why: "The same feed under its second name (the route re-exports the one above), so both addresses answer with the same policy rather than the second one falling through to the HTML rule.",
  },
  {
    source: "/learn/feed.xml",
    value: "public, max-age=0, s-maxage=3600",
    why: "The guides feed added with the rest of the text surfaces: same shape as the catalog feed, same reasoning — revalidate in the browser, hold an hour at the edge.",
  },
  {
    source: "/changelog/feed.xml",
    value: "public, max-age=0, s-maxage=3600",
    why: "The studio log feed. It links each item to its own permalink instead of the homepage anchor, which is the one thing the export copy of this feed cannot do.",
  },
  {
    source: "/api/brand/:path*",
    value: "public, max-age=3600",
    why: "Brand JSON and downloadable marks, rebuilt with the site rather than fingerprinted.",
  },
  {
    source: "/og/:path*",
    value: "public, max-age=3600",
    why: "Share cards are generated per slug at build time, so an hour rather than immutability — a card changes when the page behind it does.",
  },
];

/** A concrete URL to reproduce a rule with curl. Dynamic segments stay as
 *  placeholders — a reader substitutes a real slug or chunk name — because the
 *  point is a copy-paste block, not a URL that answers forever. */
export function ruleSampleUrl(source: string): string {
  switch (source) {
    case "/:path*":
      return "/pricing";
    case "/_next/static/:path*":
      return "/_next/static/chunks/<content-hashed-file>.js";
    case "/_next/image":
      return "/_next/image?url=%2Fog%2Fdefault&w=64&q=75";
    case "/embed.js":
      return "/embed.js";
    case "/community/rss.xml":
      return "/community/rss.xml";
    case "/community/feed.xml":
      return "/community/feed.xml";
    case "/learn/feed.xml":
      return "/learn/feed.xml";
    case "/changelog/feed.xml":
      return "/changelog/feed.xml";
    case "/api/brand/:path*":
      return "/api/brand/<slug>";
    case "/og/:path*":
      return "/og/<slug>";
    default:
      return source;
  }
}

export const CACHE_PLAN = {
  shipped: "These rules run in this build, in this order; /perf/caching prints them, next.config.ts imports them, and the harness reads a sample of the served headers so a rule that stops winning fails the batch.",
  notConfigured: [
    "No CDN is attached in this build, so s-maxage only has meaning behind whichever proxy is in front of it.",
    "There is no purge API to call, because there is no cache to purge from inside a static build.",
  ],
  whenCmsLands: [
    "Tag every catalog page with the asset slugs it renders, so one asset edit invalidates its own page and the three index pages that list it — not the whole site.",
    "Keep the five-minute s-maxage. When pages can change per edit, the honest default is short and boring rather than long and incorrect.",
    "Serve JSON from the same tags as the page that renders it, so an API consumer and a browser never disagree about how fresh a record is.",
    "Revalidate on write, not on read: a purge that only happens when someone visits is a cache that stays wrong for whoever arrives second.",
  ],
};

/** Headers that are not about caching. Kept beside the cache rules because
 *  they are set the same way, in one module next.config.ts imports — and the
 *  page that documents the embed prints them from here. */
export const EMBED_HEADERS: { source: string; headers: { key: string; value: string }[]; why: string }[] = [
  {
    source: "/embed/:path*",
    headers: [
      { key: "Content-Security-Policy", value: "frame-ancestors *" },
      { key: "X-Robots-Tag", value: "noindex" },
    ],
    why: "The frame policy says out loud that the route exists to be framed; without it a future default CSP would silently break every embed. Noindex keeps the near-identical demo-only pages out of search results, where they would compete with the asset pages that explain them. A per-site allowlist would need a server reading Origin, which this build does not have.",
  },
];
