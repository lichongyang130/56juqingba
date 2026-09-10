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
export const THANKS_KEY = "motif:thanks";

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

/* ===================================================================
   #347 — weekly community picks
   Picks are never hand-picked here: the rule is "clean gates first, then the
   highest score", run over the sample queue, with the starting offset
   rotating each ISO week. The one-line "why" is the entry's own gate data
   printed as prose — nothing is claimed about an entry that the record does
   not already say.
   =================================================================== */

export interface WeeklyPick {
  id: string;
  title: string;
  handle: string;
  kind: SubmissionKind;
  score: number;
  why: string;
}

export interface PickWeek {
  /** e.g. "week of 2026-09-07" */
  label: string;
  iso: string;
  picks: WeeklyPick[];
  note: string;
}

const PICK_NOTES = [
  "Clean gates first, then the highest audit score. A submission with a warning can still be picked — it just has to beat something cleaner to get there.",
  "We read the gate line before the title. A 99 that failed lint is not a better submission than a 92 that did not.",
  "Picks are drawn from the sample queue that ships with the demo, so they rotate through the same ten records. With real submissions, the same rule runs on real gate results.",
  "Three a week, no more. A picks band that lists everything is a list, not an editorial.",
];

function gateRank(s: Submission): number {
  const score = (g: Gate) => (g === "pass" ? 2 : g === "warn" ? 1 : 0);
  return score(s.lint) + score(s.safety);
}

function metricWord(s: Submission): string {
  return s.kind === "prompt" ? "fidelity" : "a11y audit";
}

function whyLine(s: Submission): string {
  const gates = (g: Gate) => (g === "pass" ? "cleared" : g === "warn" ? "flagged" : "failed");
  return `lint ${gates(s.lint)} · safety ${gates(s.safety)} · ${metricWord(s)} ${s.score} · ${s.stack}`;
}

function isoWeekStart(d: Date): Date {
  const out = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = (out.getUTCDay() + 6) % 7; // Monday = 0
  out.setUTCDate(out.getUTCDate() - day);
  return out;
}

/** `weeks` most recent ISO weeks, newest first. */
export function weekPicks(weeks = 3): PickWeek[] {
  const start = isoWeekStart(new Date());
  const ranked = [...MODERATION_SEED].sort((a, b) => gateRank(b) - gateRank(a) || b.score - a.score || a.id.localeCompare(b.id));
  return Array.from({ length: weeks }, (_, w) => {
    const weekStart = new Date(start);
    weekStart.setUTCDate(start.getUTCDate() - w * 7);
    const iso = weekStart.toISOString().slice(0, 10);
    const offset = weekStart.getUTCMonth() * 4 + Math.floor(weekStart.getUTCDate() / 7);
    const picks = [0, 1, 2].map((k) => ranked[(offset + k) % ranked.length]);
    return {
      label: `week of ${iso}`,
      iso,
      picks: picks.map((s) => ({
        id: s.id,
        title: s.title,
        handle: s.author,
        kind: s.kind,
        score: s.score,
        why: whyLine(s),
      })),
      note: PICK_NOTES[(offset + w) % PICK_NOTES.length],
    };
  });
}

/* ===================================================================
   #348 — monthly challenges
   =================================================================== */

export interface ChallengeEntry {
  id: string;
  handle: string;
  title: string;
  score: number;
  lint: Gate;
  safety: Gate;
  note: string;
}

export interface Challenge {
  slug: string;
  title: string;
  brief: string;
  opened: string;
  deadline: string;
  status: "open" | "closed";
  constraints: string[];
  entries: ChallengeEntry[];
}

export const CHALLENGES: Challenge[] = [
  {
    slug: "best-preloader",
    title: "Build the best preloader",
    brief:
      "A load screen that makes waiting feel shorter: it has to hold attention for two to four seconds without lying about progress it cannot measure.",
    opened: "2026-08-03",
    deadline: "2026-08-31",
    status: "closed",
    constraints: [
      "Zero dependencies — no animation library, no spinner package.",
      "Under 4 KB shipped, CSS included.",
      "Honest progress only: no fake percentage that is really a timer.",
      "Reduced-motion path that still communicates waiting.",
    ],
    entries: [
      { id: "CH-108", handle: "karina_ui", title: "Coin flip loader", score: 88, lint: "warn", safety: "pass", note: "Genuinely lovely motion; the progress ring reads as measured but is actually a 3.2 s loop." },
      { id: "CH-109", handle: "monoflow", title: "Skeleton handoff loader", score: 94, lint: "pass", safety: "pass", note: "Swaps the spinner for the layout's own skeleton at 400 ms — the strongest honesty argument in the batch." },
      { id: "CH-110", handle: "noir.studio", title: "Ink bleed preloader", score: 91, lint: "pass", safety: "pass", note: "Three lines of CSS for the whole visual. Loses points only on the reduced-motion fallback." },
      { id: "CH-111", handle: "tttyping", title: "Typing prompt loader", score: 86, lint: "pass", safety: "warn", note: "Sandbox flagged a sessionStorage write used to remember the first visit." },
      { id: "CH-112", handle: "lena.dev", title: "Uncertainty bar", score: 92, lint: "pass", safety: "pass", note: "Never shows a percentage at all — a bar that admits it does not know." },
    ],
  },
  {
    slug: "calmest-animated-nav",
    title: "Calmest animated navigation",
    brief:
      "A navigation bar that animates on scroll without becoming the loudest thing on the page. Judged on restraint: we want motion people stop noticing.",
    opened: "2026-09-08",
    deadline: "2026-10-09",
    status: "open",
    constraints: [
      "Scroll-linked motion must respect prefers-reduced-motion.",
      "No layout shift on the first scroll event (CLS must stay flat).",
      "Keyboard focus must stay visible the whole way.",
      "Under 6 KB shipped, dependencies allowed only if you justify them.",
    ],
    entries: [],
  },
];

export function challengeOf(slug: string): Challenge | undefined {
  return CHALLENGES.find((c) => c.slug === slug);
}

/** Winner rule, applied by code: every gate pass, then the highest score. */
export function challengeWinner(c: Challenge): ChallengeEntry | undefined {
  return c.entries
    .filter((e) => e.lint === "pass" && e.safety === "pass")
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))[0];
}

export interface WinnerRow {
  challenge: string;
  slug: string;
  entry: ChallengeEntry;
  why: string;
  when: string;
}

export function winnersRail(): WinnerRow[] {
  return CHALLENGES.filter((c) => c.status === "closed")
    .map((c) => {
      const w = challengeWinner(c);
      return w ? { challenge: c.title, slug: c.slug, entry: w, why: w.note, when: c.deadline } : undefined;
    })
    .filter((r) => r !== undefined);
}

/* ===================================================================
   #349 — badges, earned by rule
   Each badge declares its rule as a function, so a badge can never be
   awarded by hand: the holder list is whatever the rule returns today.
   =================================================================== */

export interface BadgeHolder {
  holder: string;
  /** the qualifying count, and what that count is counting */
  count: number;
  evidence: string;
}

export interface Badge {
  slug: string;
  name: string;
  mark: string;
  rule: string;
  holders: BadgeHolder[];
  /** what a contributor would have to do to appear here */
  threshold: string;
}

export function badgeReport(): Badge[] {
  const authors = [...new Set([...COMPONENTS, ...PROMPTS].map((x) => x.author))];
  const a11yStarTotal = COMPONENTS.filter((a) => a.a11yScore >= 98).length;

  const publishedBy = (author: string) =>
    COMPONENTS.filter((a) => a.author === author).length + PROMPTS.filter((p) => p.author === author).length;

  const countIf = (holders: string[], pick: (author: string) => number, min: number) =>
    holders
      .map((author) => ({ holder: author, count: pick(author) }))
      .filter((h) => h.count >= min);

  const original: BadgeHolder[] = countIf(authors, publishedBy, 25).map((h) => ({
    ...h,
    evidence: `${h.count} published items in the catalog`,
  }));

  const a11y: BadgeHolder[] = countIf(authors, (a) => COMPONENTS.filter((c) => c.author === a && c.a11yScore >= 98).length, 5).map(
    (h) => ({ ...h, evidence: `${h.count} of their assets audited 98+ — ${a11yStarTotal} in the catalog reach that band` }),
  );

  const fidelity: BadgeHolder[] = countIf(
    authors,
    (a) => PROMPTS.filter((p) => p.author === a && p.avgFidelity >= 90).length,
    5,
  ).map((h) => ({ ...h, evidence: `${h.count} verified prompts averaging 90+ fidelity` }));

  const cleanGates: BadgeHolder[] = ROSTER.map((m) => ({ handle: m.handle, subs: queuedFor(m.handle) }))
    .filter((x) => x.subs.length >= 3 && x.subs.every((s) => s.lint === "pass" && s.safety === "pass"))
    .map((x) => ({ holder: x.handle, count: x.subs.length, evidence: `${x.subs.length} submissions, every gate cleared` }));

  return [
    {
      slug: "original-contributor",
      name: "Original contributor",
      mark: "◆",
      rule: "25 or more published catalog items authored by the same person.",
      threshold: "Publish 25 items. The catalog is authored end to end by one studio, so it is the only holder today.",
      holders: original,
    },
    {
      slug: "a11y-champion",
      name: "A11y champion",
      mark: "◎",
      rule: "5 or more published assets audited at an accessibility score of 98 or higher.",
      threshold: "Audit five assets at 98+.",
      holders: a11y,
    },
    {
      slug: "prompt-scientist",
      name: "Prompt scientist",
      mark: "◇",
      rule: "5 or more prompts averaging a fidelity of 90 or higher across their published model runs.",
      threshold: "Land five prompts at 90+ average fidelity.",
      holders: fidelity,
    },
    {
      slug: "clean-gates",
      name: "Clean gates",
      mark: "✓",
      rule: "3 or more submissions with every gate cleared — no lint warning, no safety flag.",
      threshold: "Three gate-clean submissions. The sample queue tops out at two per handle, so nobody holds this yet.",
      holders: cleanGates,
    },
  ];
}

export function badgesFor(handle: string): Badge[] {
  return badgeReport().filter((b) => b.holders.some((h) => h.holder === handle));
}

/* ===================================================================
   #351 — spotlight interviews (one maker per month)
   Written from the roster persona's own submissions; every page that shows
   them carries the "sample roster persona" label.
   =================================================================== */

export interface Spotlight {
  month: string;
  handle: string;
  headline: string;
  questions: { q: string; a: string }[];
}

export const SPOTLIGHTS: Spotlight[] = [
  {
    month: "2026-09",
    handle: "monoflow",
    headline: "The 99 was luck. The checklist was not.",
    questions: [
      { q: "You hold the highest audit score in the queue. What did you actually do?", a: "Focus order first, then colour. The contrast pass takes ten minutes and fixes the score more than any clever markup does." },
      { q: "Your challenge entry swapped a spinner for a skeleton. Why?", a: "A spinner is a promise. The skeleton is the truth — the page is going to look like that in 400 ms, so show it." },
      { q: "What do you cut when a brief asks for more motion?", a: "The second animation. There is almost always one that carries the meaning and one that carries the ego." },
    ],
  },
  {
    month: "2026-08",
    handle: "karina_ui",
    headline: "Under 2 KB, every time.",
    questions: [
      { q: "How do you keep loader bundles that small?", a: "I write the CSS before the component. If the state can live in a data attribute, it never needs a hook." },
      { q: "Your flip loader was picked apart by the judges on honesty. Fair?", a: "Completely fair. I faked measured progress because it looked better. The bar that admits it does not know is the better component." },
      { q: "Advice for a first submission?", a: "Ship the boring version with clean gates. A 78 with no warnings teaches you more than a 95 you cannot explain." },
    ],
  },
  {
    month: "2026-07",
    handle: "glyph.rgb",
    headline: "Prompts are specs, not wishes.",
    questions: [
      { q: "You write prompts like requirement documents. Why?", a: "Because the model reads constraints better than adjectives. ‘Hero, 62 chars, two CTAs, no video’ beats ‘stunning modern hero’." },
      { q: "What do you do when a model fails a section?", a: "I do not rewrite the prompt blindly. I find which constraint it dropped, then say that constraint twice, differently." },
      { q: "One line for someone who thinks prompt writing is not real work?", a: "Then neither is writing a brief for a contractor. Same job: make the constraint unmistakable." },
    ],
  },
];
