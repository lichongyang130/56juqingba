/* ---------------------------------------------------------------------
   Community layer — Section 12, batches 47+.
   IMPORTANT: there is no backend. The "roster" below is the same sample
   contributor set the admin moderation demo already uses; maker pages are
   built from it and every surface that shows it says so. Collections are
   real filters over the live catalog, so their counts are always true.
   --------------------------------------------------------------------- */

import { COMPONENTS, PROMPTS } from "./data";
import type { Asset, PromptTemplate } from "./types";

export const STAR_KEY = "motif:stars";
export const SUBMISSION_KEY = "motif:community-submissions";
export const REVIEW_KEY = "motif:review-notes";

/* ---------- moderation seed (moved here so the submit flow and the
   queue read one source of truth) ---------- */

export type SubmissionKind = "element" | "section" | "animated" | "prompt";
export type Gate = "pass" | "warn" | "fail";

export interface Submission {
  id: string;
  kind: SubmissionKind;
  title: string;
  author: string;
  score: number; // a11y audit for components · fidelity for prompts
  lint: Gate;
  safety: Gate;
  stack: string;
  /** "community" marks an entry that came from the public submit form; it
   *  keeps the audit tiles reading "pending" until a real gate has run. */
  source?: "community";
  /** set by the community submit flow — which published asset it remixes */
  basedOn?: string;
  note?: string;
  submittedAt?: string;
}

export const MODERATION_SEED: Submission[] = [
  { id: "SUB-1026", kind: "prompt", title: "SaaS pricing — glassmorphism landing", author: "pixelparlor", score: 91, lint: "pass", safety: "pass", stack: "Next.js · 3 models" },
  { id: "SUB-1025", kind: "element", title: "Soft ripple text field", author: "lena.dev", score: 96, lint: "pass", safety: "pass", stack: "React" },
  { id: "SUB-1024", kind: "section", title: "Lava lamp blob hero", author: "noir.studio", score: 91, lint: "warn", safety: "pass", stack: "HTML/CSS" },
  { id: "SUB-1023", kind: "prompt", title: "Indie magazine cover hero prompt", author: "glyph.rgb", score: 89, lint: "pass", safety: "warn", stack: "HTML · 3 models" },
  { id: "SUB-1022", kind: "element", title: "Coin flip loader", author: "karina_ui", score: 88, lint: "warn", safety: "pass", stack: "React" },
  { id: "SUB-1021", kind: "animated", title: "Scroll-linked hue nav", author: "tttyping", score: 82, lint: "pass", safety: "pass", stack: "Vue" },
  { id: "SUB-1020", kind: "section", title: "Glass stat card trio", author: "pixelparlor", score: 97, lint: "fail", safety: "pass", stack: "HTML/CSS" },
  { id: "SUB-1019", kind: "animated", title: "Aurora pricing toggle", author: "unknown_usr", score: 90, lint: "pass", safety: "fail", stack: "React" },
  { id: "SUB-1018", kind: "prompt", title: "Beauty routine-builder prompt", author: "studio.ceres", score: 86, lint: "warn", safety: "pass", stack: "HTML · 3 models" },
  { id: "SUB-1017", kind: "section", title: "Checkout stepper", author: "monoflow", score: 99, lint: "pass", safety: "pass", stack: "React" },
];

/* ---------- sample contributor roster (demo, mirrors the queue above) ---------- */

export interface Maker {
  handle: string;
  name: string;
  craft: string;
  joined: string;
  note: string;
}

export const ROSTER: Maker[] = [
  { handle: "pixelparlor", name: "Pixel Parlor", craft: "Landing sections & pricing", joined: "2026-06-11", note: "Two queue entries live right now — a glass pricing landing and a stat-card trio that failed lint on purpose (good test case)." },
  { handle: "lena.dev", name: "Lena Ortiz", craft: "Form controls", joined: "2026-06-19", note: "Ships inputs that feel right; the ripple text field is her third submission this quarter." },
  { handle: "noir.studio", name: "Noir Studio", craft: "Hero scenes", joined: "2026-07-02", note: "Prefers blob shapes and heavy contrast; one lint warning outstanding." },
  { handle: "glyph.rgb", name: "Glyph RGB", craft: "Prompt engineering", joined: "2026-07-08", note: "Writes prompts as specs — one model needed a retry on the magazine brief." },
  { handle: "karina_ui", name: "Karina Sole", craft: "Micro-interactions", joined: "2026-07-15", note: "Loader specialist; keeps bundles under 2 KB." },
  { handle: "tttyping", name: "T T Typing", craft: "Scroll choreography", joined: "2026-07-21", note: "Vue first — the only Vue submission in the current queue." },
  { handle: "unknown_usr", name: "Anonymous", craft: "Unlisted", joined: "2026-07-30", note: "Submitted without a profile. Sandbox flagged storage usage, so the queue holds it by default — anonymity is allowed, skipping review is not." },
  { handle: "studio.ceres", name: "Studio Ceres", craft: "Commerce prompts", joined: "2026-08-04", note: "Writes the routine-builder prompt family." },
  { handle: "monoflow", name: "Monoflow", craft: "Checkout & flows", joined: "2026-08-12", note: "Holds the highest audit score in the queue right now (99)." },
];

export function makerOf(handle: string): Maker | undefined {
  return ROSTER.find((m) => m.handle === handle);
}

export function queuedFor(handle: string): Submission[] {
  return MODERATION_SEED.filter((s) => s.author === handle);
}

export function makerStats(handle: string) {
  const subs = queuedFor(handle);
  const scores = subs.map((s) => s.score);
  return {
    submissions: subs.length,
    avgScore: scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : 0,
    best: scores.length ? Math.max(...scores) : 0,
  };
}

/* ---------- curated collections (real filters over the live catalog) ----------
   Each collection declares its rule once. The shortlist is that rule plus an
   ordering and a display cap; the count printed beside the title is the raw
   match count, so the two can never drift apart. */

export interface Collection {
  slug: string;
  title: string;
  blurb: string;
  why: string;
  kind: "assets" | "prompts";
  /** Every asset satisfying the rule — the printed count reports this length. */
  match: (list: Asset[]) => Asset[];
  order?: (a: Asset, b: Asset) => number;
  matchPrompts?: (list: PromptTemplate[]) => PromptTemplate[];
  orderPrompts?: (a: PromptTemplate, b: PromptTemplate) => number;
  /** How many of the matches the collection actually displays. */
  shown: number;
}

export const COLLECTIONS: Collection[] = [
  {
    slug: "landing-stack",
    title: "Landing stack",
    blurb: "Sections that carry a homepage on their own — hero through pricing.",
    why: "Every section in the catalog, ordered by editorial quality; each one is a paste-in block, not a template you have to strip.",
    kind: "assets",
    match: (list) => list.filter((a) => a.kind === "section"),
    order: (a, b) => b.qualityScore - a.qualityScore || b.copies - a.copies,
    shown: 6,
  },
  {
    slug: "under-5kb",
    title: "Under 5 KB",
    blurb: "The whole interaction budget of a page, spent in one file.",
    why: "Filtered purely by shipped bundle size — no hand-picking, so the list changes as the catalog does.",
    kind: "assets",
    match: (list) => list.filter((a) => a.bundleKb < 5),
    order: (a, b) => a.bundleKb - b.bundleKb,
    shown: 8,
  },
  {
    slug: "zero-dep-motion",
    title: "Zero-dep motion",
    blurb: "Animated scenes with nothing to install.",
    why: "Animated kind with an empty dependency array — the paste-and-run promise at its strictest.",
    kind: "assets",
    match: (list) => list.filter((a) => a.kind === "animated" && a.deps.length === 0),
    order: (a, b) => b.copies - a.copies,
    shown: 8,
  },
  {
    slug: "a11y-98",
    title: "A11y 98+",
    blurb: "The top of the accessibility band, ready for a strict brief.",
    why: "Filtered at an accessibility audit score of 98 or higher — useful when the client brief says “WCAG, no exceptions”.",
    kind: "assets",
    match: (list) => list.filter((a) => a.a11yScore >= 98),
    order: (a, b) => b.a11yScore - a.a11yScore || b.qualityScore - a.qualityScore,
    shown: 8,
  },
  {
    slug: "prompt-starter",
    title: "Prompt starter",
    blurb: "Verified briefs with the best measured fidelity.",
    why: "Prompts that already passed the verified gate and average 90 or better across their model runs.",
    kind: "prompts",
    match: () => [],
    matchPrompts: (list) => list.filter((p) => p.status === "verified" && p.avgFidelity >= 90),
    orderPrompts: (a, b) => b.avgFidelity - a.avgFidelity,
    shown: 6,
  },
];

export function collectionOf(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

/** The displayed shortlist for an asset collection. */
export function collectionItems(c: Collection): Asset[] {
  if (c.kind !== "assets") return [];
  const matched = c.match(COMPONENTS);
  const ordered = c.order ? [...matched].sort(c.order) : matched;
  return ordered.slice(0, c.shown);
}

/** The displayed shortlist for a prompt collection. */
export function collectionPrompts(c: Collection): PromptTemplate[] {
  if (!c.matchPrompts) return [];
  const matched = c.matchPrompts(PROMPTS);
  const ordered = c.orderPrompts ? [...matched].sort(c.orderPrompts) : matched;
  return ordered.slice(0, c.shown);
}

/** How many items satisfy the rule across the whole catalog. */
export function collectionMatches(c: Collection): number {
  if (c.kind === "prompts") return c.matchPrompts ? c.matchPrompts(PROMPTS).length : 0;
  return c.match(COMPONENTS).length;
}

/* ---------- leaderboard (#344) — top-copied / highest-fidelity, with credits ---------- */

export interface LeaderRow {
  slug: string;
  title: string;
  kind: string;
  /** The ranked figure — copies of an asset, average fidelity of a prompt. */
  metric: number;
  unit: "copies" | "fidelity";
  author: string;
  /** Always the item's real author. Catalog work is Motif Studio; the sample
   *  roster handles only ever appear on their own maker pages, so the board
   *  can never credit someone for work they did not do. */
  credit: string;
  href: string;
}

/** Newest run date for a prompt — the tie-breaker on the fidelity board. */
function latestRun(p: PromptTemplate): string {
  return p.runs.reduce((newest, r) => (r.date > newest ? r.date : newest), "");
}

export function assetLeaderboard(limit = 12): LeaderRow[] {
  return [...COMPONENTS]
    .sort((a, b) => b.copies - a.copies || a.slug.localeCompare(b.slug))
    .slice(0, limit)
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      kind: a.kind,
      metric: a.copies,
      unit: "copies" as const,
      author: a.author,
      credit: a.author,
      href: `/components/${a.slug}`,
    }));
}

export function promptLeaderboard(limit = 8): LeaderRow[] {
  return [...PROMPTS]
    .sort((a, b) => b.avgFidelity - a.avgFidelity || latestRun(b).localeCompare(latestRun(a)) || a.slug.localeCompare(b.slug))
    .slice(0, limit)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      kind: "prompt",
      metric: p.avgFidelity,
      unit: "fidelity" as const,
      author: p.author,
      credit: p.author,
      href: `/prompts/${p.slug}`,
    }));
}

/* ---------- community re-run (#343) ---------- */

export const RERUN_MODELS = ["Claude 4.6 Sonnet", "Codex", "GLM-4.6 (CN)"] as const;

export interface RerunLine {
  t: string;
  text: string;
  tone: "dim" | "ok" | "warn";
}

function hash(slug: string, model: string, seed: number): number {
  return [...`${slug}${model}${seed}`].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
}

/** The score the simulated run reports. Deterministic, so the log and the
 *  comparison panel can never disagree with each other. */
export function rerunFidelity(slug: string, model: string, seed: number): number {
  return 84 + (hash(slug, model, seed) % 14);
}

function stamp(h: number, base: number, span: number): string {
  return `0${(base + (h % span)).toFixed(2)}`.slice(0, 5);
}

/** Deterministic pseudo-log so the demo reads the same on every render —
 *  clearly a simulation, seeded by the prompt slug, model and run index. */
export function rerunScript(slug: string, model: string, seed: number): RerunLine[] {
  const h = hash(slug, model, seed);
  const fidelity = rerunFidelity(slug, model, seed);
  const buildErrors = h % 7 === 0 ? 1 : 0;
  return [
    { t: "00.000", text: `POST /api/rerun { prompt: "${slug}", model: "${model}" } — demo, no model is called`, tone: "dim" },
    { t: "00.140", text: "prompt body validated · 0 placeholder braces unbalanced", tone: "dim" },
    { t: "00.860", text: "rendering sections: hero → features → pricing → footer", tone: "dim" },
    { t: stamp(h, 1, 3), text: `section fidelity sampled: ${fidelity - 3}%`, tone: "warn" },
    { t: stamp(h, 2, 4), text: `visual fidelity: ${fidelity}% vs published average`, tone: fidelity >= 88 ? "ok" : "warn" },
    { t: stamp(h, 3, 5), text: `build errors: ${buildErrors} · a11y audit: ${92 + (h % 8)}`, tone: buildErrors ? "warn" : "ok" },
    { t: stamp(h, 4, 6), text: "done — this log is simulated; the runs published on each prompt page are the real ones", tone: "dim" },
  ];
}
