// #471 — the question patterns behind the component FAQ markup, kept next to
// the copy rules so the register on /quality/schema can count them without
// importing a client component. `assetFaq` in lib/seo.ts builds one entry per
// pattern, in this order.
export const ASSET_FAQ_QUESTIONS = 4;

/** Types that must never appear in the rendered markup, checked by the export harness. */
export const FORBIDDEN_SCHEMA_TYPES = ["Product", "Offer", "AggregateRating", "Review"];
