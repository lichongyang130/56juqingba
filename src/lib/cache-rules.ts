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

export const CACHE_RULES: CacheRule[] = [
  {
    // The catch-all is listed first on purpose. Next applies matching rules in
    // order and a later rule overrides an earlier one for the same header, so a
    // catch-all placed last silently replaces every specific rule above it —
    // which is how fingerprinted assets ended up with the HTML policy in the
    // first version of this file.
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
    value: "public, max-age=86400, stale-while-revalidate=604800",
    why: "The optimizer is not used by any page in this build (0 <img> tags), so this rule exists for the day it is.",
  },
];

export const CACHE_PLAN = {
  shipped: "These three rules run in this build; /perf/caching prints them and the harness reads the same module the config imports.",
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
