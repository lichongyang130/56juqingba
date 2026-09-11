// #34 — the claim map. Every sentence on this site that says the harness does
// something must name the check that does it.
//
// Batch 91 found four sentences describing automation that did not exist — a
// checklist item claiming the demo harness checked reduced-motion branches,
// /integrations claiming a byte-for-byte comparison, and so on — and fixed them
// one at a time. That is a rescue, not a rule. The rule is here: prose that
// makes a claim about automation is listed below with the check that backs it,
// and `check:exports` fails on three things.
//
//   1. A mapped fragment that no longer appears in its file. The claim was
//      edited or deleted and the map is stale; the entry has to change with it.
//   2. A mapped check name that no harness announces. The mapping is fiction if
//      the check it names does not run.
//   3. A source file that claims the harness does something and has no entry at
//      all. This is the one that would have caught batch 91: the sentence and
//      the map have to arrive together.
//
// The map is deliberately about *claims*, not comments: a comment describing
// the code is not a promise to a reader. What is scanned is the prose a reader
// can see — page copy, data detail strings, exported constants — plus the
// module headers that tell a contributor what guards their edit.

export interface Claim {
  /** The file the claim is written in. */
  file: string;
  /** A distinctive fragment of the claim as written. The gate fails if this
   *  string is no longer in the file, so editing the claim means editing the
   *  map in the same commit. */
  says: string;
  /** The check that backs it, named exactly as the harness prints it. */
  checkedBy: string;
  /** Which harness announces `checkedBy`. */
  in: "check:exports" | "check:demos" | "check:a11y" | "check:a11y:served";
}

export const CLAIMS: Claim[] = [
  {
    file: "src/lib/brand.ts",
    says: "The voice guide's banned list is the same dictionary the harness scans the public prose with.",
    checkedBy: "no banned overclaim term survives the context rule",
    in: "check:exports",
  },
  {
    file: "src/lib/cache-rules.ts",
    says: "the harness reads a sample of the served headers so a rule that stops winning fails the batch",
    checkedBy: "every documented Cache-Control rule is the one the server sends",
    in: "check:exports",
  },
  {
    file: "src/lib/crawl.ts",
    says: "the harness checks",
    checkedBy: "every excluded surface carries a noindex, not only a robots rule",
    in: "check:exports",
  },
  {
    file: "src/app/robots.ts",
    says: "the harness checks",
    checkedBy: "every excluded surface carries a noindex, not only a robots rule",
    in: "check:exports",
  },
  {
    file: "src/app/(public)/learn/questions/page.tsx",
    says: "Every pair is checked at build time: if an essay or asset is renamed, the row disappears from this page and the harness fails",
    checkedBy: "/learn/questions pairs every question with an essay and an asset",
    in: "check:exports",
  },
  {
    file: "src/app/(public)/integrations/page.tsx",
    says: "the harness holds the two sides together",
    checkedBy: "tokens page prints the colours the endpoint serves",
    in: "check:exports",
  },
  {
    file: "src/app/(public)/quality/aria/page.tsx",
    says: "{motion.js.length} from JavaScript",
    checkedBy: "/quality/aria prints the split the audit measured",
    in: "check:demos",
  },
  {
    file: "src/app/(public)/quality/aria/page.tsx",
    says: "npm run check:a11y:served",
    checkedBy: "the served pass walks the sitemap and the extras",
    in: "check:a11y:served",
  },
  {
    file: "src/app/(public)/quality/schema/page.tsx",
    says: "The harness checks that every page&apos;s canonical uses this base",
    checkedBy: "canonical for ${p} is its own URL",
    in: "check:exports",
  },
  {
    file: "src/app/(public)/quality/crawl/page.tsx",
    says: "The harness now walks every built page and fails if an indexable one is unlisted, or",
    checkedBy: "every indexable built page is in the sitemap",
    in: "check:exports",
  },
  {
    file: "src/app/(public)/sitemap/page.tsx",
    says: "the harness fails if the two counts differ",
    checkedBy: "the human sitemap prints the URL count the XML carries",
    in: "check:exports",
  },
  {
    file: "src/app/(public)/perf/caching/page.tsx",
    says: "The build harness fetches these headers from the running server every batch and compares each one with the rules documented",
    checkedBy: "every documented Cache-Control rule is the one the server sends",
    in: "check:exports",
  },
  {
    file: "src/app/(public)/gaps/page.tsx",
    says: "Absolute-URL round trips from the harness",
    checkedBy: "every route the ledger registers still answers",
    in: "check:exports",
  },
  {
    file: "src/app/(public)/metrics/page.tsx",
    says: "the catalog total against the figure",
    checkedBy: "catalog carries every component, and /quality agrees",
    in: "check:exports",
  },
  {
    file: "src/components/demos/Demo.tsx",
    says: "the props panel and the harness both want the same list",
    checkedBy: "every scene that drives motion from JavaScript names the preference",
    in: "check:demos",
  },
];

/** Files whose prose is scanned for unmapped claims: the public pages, the
 *  shared components that render prose, and the data modules whose strings a
 *  reader sees. Comments are stripped before the scan, so a developer note is
 *  not treated as a promise. */
export const CLAIM_SCOPE = [
  "src/app/(public)",
  "src/app/robots.ts",
  "src/components",
  "src/lib/brand.ts",
  "src/lib/cache-rules.ts",
  "src/lib/crawl.ts",
];

/** What marks a sentence as a claim about automation.
 *
 *  The first version of this pattern listed verbs — `checks|fails|reads|scans|
 *  holds|walks|compares|runs` — and a bite test with "the harness verifies that
 *  every claim is true" sailed straight through it, which is the same mistake
 *  the map exists to prevent: a list of the failure modes someone thought of.
 *  Any mention of the harness in reader-facing prose *is* a claim about
 *  automation, so the pattern is the noun, not a verb list. */
export const CLAIM_PATTERN = /the (?:build )?harness\b|the gate fails|check:(?:exports|demos|a11y)\b/g;
