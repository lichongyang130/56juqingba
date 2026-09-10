/* ---------------------------------------------------------------------
   Admin operations — Section 13, batch 53 (#377–#383).
   The console's rule holds here too: a number is computed from something
   the build actually holds, or the gap is named in the UI. Queue arrival
   times are stamped locally the first time this browser opens the lane,
   exports carry only catalog fields, the theme presets are contrast-checked
   with the WCAG formula, and duplicate detection prints the words that
   matched rather than a similarity score with nothing behind it.
   --------------------------------------------------------------------- */

import { BACKGROUNDS, CHANGELOG, COMPONENTS, LAB_TOOLS, PROMPTS } from "./data";
import { LEARN_ARTICLES } from "./learn";
import { MODERATION_SEED, type Submission } from "./community";
import { daysSince, newestCatalogDate } from "./admin";

/* ===================================================================
   #377 — escalation lane: what has been waiting longest
   =================================================================== */

export const QUEUE_ARRIVALS_KEY = "motif-admin-queue-arrivals";
/** The line the lane draws. Nothing in this build can send a reminder. */
export const SLA_HOURS = 48;

/** submission id → ISO time this browser first saw it in the queue. */
export type Arrivals = Record<string, string>;

/** Stamp any id we have not seen before. Existing stamps are never moved, so
 *  the waiting time keeps counting up instead of resetting on every visit. */
export function stampArrivals(arrivals: Arrivals, ids: string[], now: number): Arrivals {
  const next: Arrivals = { ...arrivals };
  let changed = false;
  for (const id of ids) {
    if (!next[id]) {
      next[id] = new Date(now).toISOString();
      changed = true;
    }
  }
  return changed ? next : arrivals;
}

export function formatWait(ms: number): string {
  const minutes = Math.floor(Math.max(0, ms) / 60000);
  if (minutes < 1) return "under a minute";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes % 60}m`;
  return `${Math.floor(hours / 24)}d ${hours % 24}h`;
}

export interface LaneRow {
  id: string;
  title: string;
  author: string;
  kind: string;
  arrivedAt: string;
  waitingMs: number;
  escalated: boolean;
}

export function escalationLane(
  arrivals: Arrivals,
  decided: Record<string, "approved" | "rejected">,
  now: number,
  submissions: Submission[] = MODERATION_SEED,
  slaHours: number = SLA_HOURS,
): LaneRow[] {
  const slaMs = slaHours * 3600000;
  return submissions
    .filter((s) => !decided[s.id])
    .map((s) => {
      const arrivedAt = arrivals[s.id] ?? "";
      const waitingMs = arrivedAt ? Math.max(0, now - Date.parse(arrivedAt)) : 0;
      return {
        id: s.id,
        title: s.title,
        author: s.author,
        kind: s.kind,
        arrivedAt,
        waitingMs,
        escalated: waitingMs >= slaMs,
      };
    })
    .sort((a, b) => b.waitingMs - a.waitingMs || a.id.localeCompare(b.id));
}

export function laneSummary(rows: LaneRow[], slaHours: number = SLA_HOURS) {
  const waits = rows.map((r) => r.waitingMs);
  const sorted = [...waits].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return {
    open: rows.length,
    escalated: rows.filter((r) => r.escalated).length,
    oldestMs: sorted.length ? sorted[sorted.length - 1] : 0,
    medianMs: sorted.length ? (sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2)) : 0,
    /** every open row is timed, so the median is over all of them */
    timed: rows.filter((r) => r.arrivedAt).length,
    slaHours,
    /** how many rows have no stamp yet — they cannot be timed honestly */
    untimed: rows.filter((r) => !r.arrivedAt).length,
  };
}

/* ===================================================================
   #378 — export reports (CSV built in the browser, no server call)
   =================================================================== */

export interface ReportRow {
  kind: string;
  slug: string;
  title: string;
  published: string;
  bundleKb: number;
  a11y: number;
  quality: number;
  copies: number;
  views: number;
  tags: string;
}

export function reportRows(): ReportRow[] {
  return COMPONENTS.map((c) => ({
    kind: c.kind,
    slug: c.slug,
    title: c.title,
    published: c.published,
    bundleKb: c.bundleKb,
    a11y: c.a11yScore,
    quality: c.qualityScore,
    copies: c.copies,
    views: c.views,
    tags: c.tags.join(" "),
  })).sort((a, b) => b.copies - a.copies || a.title.localeCompare(b.title));
}

/** RFC-4180-ish: quote anything with a comma, quote or newline. */
export function csvCell(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(headers: string[], rows: (string | number)[][]): string {
  return [headers.map(csvCell).join(","), ...rows.map((r) => r.map(csvCell).join(","))].join("\n") + "\n";
}

export const REPORT_HEADERS = [
  "slug",
  "title",
  "kind",
  "published",
  "bundle_kb",
  "a11y_score",
  "quality_score",
  "copies_this_month",
  "views",
  "tags",
];

export function reportCsv(rows: ReportRow[] = reportRows()): string {
  return toCsv(
    REPORT_HEADERS,
    rows.map((r) => [r.slug, r.title, r.kind, r.published, r.bundleKb, r.a11y, r.quality, r.copies, r.views, r.tags]),
  );
}

export interface MonthRow {
  month: string;
  items: number;
  copies: number;
  averageQuality: number;
}

/** Grouped by the month an item was published. This is not a trend: the
 *  catalog keeps one rolling copies number per asset and no history, so a
 *  month-over-month comparison would be invented. */
export function publishMonthRows(): MonthRow[] {
  const byMonth = new Map<string, { items: number; copies: number; quality: number }>();
  for (const c of COMPONENTS) {
    const month = c.published.slice(0, 7);
    const cur = byMonth.get(month) ?? { items: 0, copies: 0, quality: 0 };
    byMonth.set(month, { items: cur.items + 1, copies: cur.copies + c.copies, quality: cur.quality + c.qualityScore });
  }
  return [...byMonth.entries()]
    .map(([month, v]) => ({
      month,
      items: v.items,
      copies: v.copies,
      averageQuality: Math.round(v.quality / v.items),
    }))
    .sort((a, b) => b.month.localeCompare(a.month));
}

export function monthCsv(rows: MonthRow[] = publishMonthRows()): string {
  return toCsv(
    ["publish_month", "items", "copies_this_month", "average_quality"],
    rows.map((r) => [r.month, r.items, r.copies, r.averageQuality]),
  );
}

export function reportTotals(rows: ReportRow[] = reportRows()) {
  const months = publishMonthRows();
  return {
    items: rows.length,
    copies: rows.reduce((a, r) => a + r.copies, 0),
    views: rows.reduce((a, r) => a + r.views, 0),
    months: months.length,
    first: months.length ? months[months.length - 1].month : "",
    last: months.length ? months[0].month : "",
    newest: newestCatalogDate(),
  };
}

/* ===================================================================
   #379 — theme control room
   The tokens below are the site's own @theme variables. Overriding them on
   :root repaints this tab for real — and the contrast column is computed,
   not asserted.
   =================================================================== */

export interface ThemeToken {
  key: "bg" | "panel" | "raised" | "ink" | "inkDim" | "inkFaint" | "accent" | "accent2" | "mint";
  label: string;
  cssVar: string;
}

export const THEME_TOKENS: ThemeToken[] = [
  { key: "bg", label: "Page", cssVar: "--color-bg" },
  { key: "panel", label: "Panel", cssVar: "--color-panel" },
  { key: "raised", label: "Raised", cssVar: "--color-raised" },
  { key: "ink", label: "Body text", cssVar: "--color-ink" },
  { key: "inkDim", label: "Dim text", cssVar: "--color-ink-dim" },
  { key: "inkFaint", label: "Faint text", cssVar: "--color-ink-faint" },
  { key: "accent", label: "Accent", cssVar: "--color-accent" },
  { key: "accent2", label: "Accent 2", cssVar: "--color-accent-2" },
  { key: "mint", label: "Success", cssVar: "--color-mint" },
];

export type ThemeValues = Record<ThemeToken["key"], string>;

export interface ThemePreset {
  id: string;
  label: string;
  note: string;
  values: ThemeValues;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "shipped",
    label: "Shipped dark",
    note: "The palette the site ships with, read out of globals.css. Faint text sits at #747b87 because the check below caught the original #5b6472 at 3.24:1 on the panel colour.",
    values: {
      bg: "#06070b",
      panel: "#0b0d14",
      raised: "#10131d",
      ink: "#edf0f7",
      inkDim: "#9aa3b5",
      inkFaint: "#747b87",
      accent: "#8b5cf6",
      accent2: "#22d3ee",
      mint: "#34d399",
    },
  },
  {
    id: "paper",
    label: "Paper",
    note: "A light surface for print-style review. Dim text is darkened until it clears AA on the page colour.",
    values: {
      bg: "#f6f5f2",
      panel: "#ffffff",
      raised: "#efece6",
      ink: "#14161c",
      inkDim: "#4a505d",
      inkFaint: "#6d7381",
      accent: "#6d28d9",
      accent2: "#0e7490",
      mint: "#047857",
    },
  },
  {
    id: "contrast",
    label: "High contrast",
    note: "Near-black page, pure-white text, saturated accents — for judging hairline borders and focus rings.",
    values: {
      bg: "#000000",
      panel: "#0a0a0a",
      raised: "#151515",
      ink: "#ffffff",
      inkDim: "#d4d4d4",
      inkFaint: "#a3a3a3",
      accent: "#a78bfa",
      accent2: "#22d3ee",
      mint: "#6ee7b7",
    },
  },
  {
    id: "cyan",
    label: "Cyan-forward",
    note: "Swaps the accent roles to test whether any surface has a hard-coded violet.",
    values: {
      bg: "#04070b",
      panel: "#081019",
      raised: "#0d1a26",
      ink: "#eef6fb",
      inkDim: "#9fb3c2",
      inkFaint: "#677e8f",
      accent: "#22d3ee",
      accent2: "#8b5cf6",
      mint: "#34d399",
    },
  },
];

const hex = (c: string): [number, number, number] => {
  const s = c.trim().replace("#", "");
  const full = s.length === 3 ? s.split("").map((x) => x + x).join("") : s;
  return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
};

/** WCAG 2.1 relative luminance. */
export function relativeLuminance(color: string): number {
  const [r, g, b] = hex(color).map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
}

/** Walk a colour toward white or black until it clears the line, and return
 *  the first value that passes. Used to turn a failed check into a concrete
 *  suggestion instead of a complaint. */
export function nearestPassing(foreground: string, background: string, line: number): { color: string; ratio: number } | null {
  const towardWhite = relativeLuminance(background) < 0.5;
  const target = towardWhite ? [255, 255, 255] : [0, 0, 0];
  const start = hex(foreground);
  const toHex = (rgb: number[]) => `#${rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
  for (let step = 0; step <= 100; step++) {
    const mixed = start.map((v, i) => v + ((target[i] - v) * step) / 100);
    const color = toHex(mixed);
    const ratio = contrastRatio(color, background);
    if (ratio >= line) return { color, ratio };
  }
  return null;
}

export interface ContrastCheck {
  label: string;
  foreground: string;
  background: string;
  ratio: number;
  /** 4.5 for body text, 3 for large text and UI edges (WCAG AA) */
  line: number;
  pass: boolean;
}

export function contrastChecks(values: ThemeValues): ContrastCheck[] {
  const pairs: { label: string; fg: ThemeToken["key"]; bg: ThemeToken["key"]; line: number }[] = [
    { label: "Body text on page", fg: "ink", bg: "bg", line: 4.5 },
    { label: "Body text on panel", fg: "ink", bg: "panel", line: 4.5 },
    { label: "Dim text on panel", fg: "inkDim", bg: "panel", line: 4.5 },
    { label: "Faint text on panel", fg: "inkFaint", bg: "panel", line: 4.5 },
    { label: "Accent on page", fg: "accent", bg: "bg", line: 4.5 },
    { label: "Accent as a large label", fg: "accent", bg: "bg", line: 3 },
    { label: "Success chip on raised", fg: "mint", bg: "raised", line: 3 },
  ];
  return pairs.map((p) => {
    const ratio = contrastRatio(values[p.fg], values[p.bg]);
    return { label: p.label, foreground: values[p.fg], background: values[p.bg], ratio, line: p.line, pass: ratio >= p.line };
  });
}

/** Themes this build can actually apply: an override is only painted while
 *  the control room is open, because nothing here writes to a server. */
export function themeOverrideStyle(values: ThemeValues): Record<string, string> {
  const out: Record<string, string> = {};
  for (const t of THEME_TOKENS) out[t.cssVar] = values[t.key];
  return out;
}

/* ===================================================================
   #381 — undo / redo for decisions
   The stack is stored next to the decisions themselves, so undo survives a
   reload and every step is one entry with its own timestamp.
   =================================================================== */

export const DECISION_HISTORY_CAP = 40;
export const DECISION_EVENT = "motif:decisions-changed";

export interface DecisionOp {
  at: string;
  decision: "approved" | "rejected";
  ids: string[];
  /** what each id was before the op — null means undecided */
  prev: Record<string, "approved" | "rejected" | null>;
}

export function makeOp(
  ids: string[],
  decision: "approved" | "rejected",
  decisions: Record<string, "approved" | "rejected">,
  now: number,
): DecisionOp {
  return {
    at: new Date(now).toISOString(),
    decision,
    ids: [...ids],
    prev: Object.fromEntries(ids.map((id) => [id, decisions[id] ?? null])),
  };
}

export function applyOp(
  decisions: Record<string, "approved" | "rejected">,
  op: DecisionOp,
): Record<string, "approved" | "rejected"> {
  return { ...decisions, ...Object.fromEntries(op.ids.map((id) => [id, op.decision])) };
}

export function revertOp(
  decisions: Record<string, "approved" | "rejected">,
  op: DecisionOp,
): Record<string, "approved" | "rejected"> {
  const next = { ...decisions };
  for (const id of op.ids) {
    const before = op.prev[id] ?? null;
    if (before === null) delete next[id];
    else next[id] = before;
  }
  return next;
}

/** Push a new op, dropping any redo branch and trimming the oldest entries. */
export function pushHistory(history: DecisionOp[], cursor: number, op: DecisionOp) {
  const kept = history.slice(0, cursor);
  const next = [...kept, op];
  const trimmed = next.length > DECISION_HISTORY_CAP ? next.slice(next.length - DECISION_HISTORY_CAP) : next;
  return { history: trimmed, cursor: trimmed.length };
}

export function historyState(history: DecisionOp[], cursor: number) {
  const undoable = cursor > 0 ? history[cursor - 1] : null;
  const redoable = cursor < history.length ? history[cursor] : null;
  return {
    canUndo: undoable !== null,
    canRedo: redoable !== null,
    depth: history.length,
    position: cursor,
    undoLabel: undoable ? `${undoable.decision === "approved" ? "Approved" : "Rejected"} ${undoable.ids.join(", ")}` : "",
    redoLabel: redoable ? `${redoable.decision === "approved" ? "Approved" : "Rejected"} ${redoable.ids.join(", ")}` : "",
  };
}

export function stepBack(decisions: Record<string, "approved" | "rejected">, history: DecisionOp[], cursor: number) {
  if (cursor <= 0) return null;
  const op = history[cursor - 1];
  return { decisions: revertOp(decisions, op), cursor: cursor - 1, op };
}

export function stepForward(decisions: Record<string, "approved" | "rejected">, history: DecisionOp[], cursor: number) {
  if (cursor >= history.length) return null;
  const op = history[cursor];
  return { decisions: applyOp(decisions, op), cursor: cursor + 1, op };
}

/* -------------------------------------------------------------------
   The stored payload in one place.
   The moderation queue, the bulk bar and the undo bar all write the same
   record; before this, the queue page rewrote { decisions, at } on every
   keystroke of state and quietly dropped any history that existed.
   ------------------------------------------------------------------- */

export interface DecisionPayload {
  decisions: Record<string, "approved" | "rejected">;
  history: DecisionOp[];
  cursor: number;
  at: string;
}

export const emptyDecisionPayload = (): DecisionPayload => ({ decisions: {}, history: [], cursor: 0, at: "" });

/** Tolerant reader: the original key only ever held `{ decisions, at }`. */
export function normalizeDecisionPayload(raw: unknown): DecisionPayload {
  const empty = emptyDecisionPayload();
  if (!raw || typeof raw !== "object") return empty;
  const p = raw as Partial<DecisionPayload>;
  const history = Array.isArray(p.history) ? p.history.filter((h) => h && Array.isArray(h.ids)) : [];
  const cursor = typeof p.cursor === "number" && p.cursor >= 0 && p.cursor <= history.length ? p.cursor : history.length;
  return { decisions: p.decisions && typeof p.decisions === "object" ? p.decisions : {}, history, cursor, at: typeof p.at === "string" ? p.at : "" };
}

export function recordDecisions(
  payload: DecisionPayload,
  ids: string[],
  decision: "approved" | "rejected",
  now: number,
): DecisionPayload {
  if (ids.length === 0) return payload;
  const op = makeOp(ids, decision, payload.decisions, now);
  const { history, cursor } = pushHistory(payload.history, payload.cursor, op);
  return { decisions: applyOp(payload.decisions, op), history, cursor, at: new Date(now).toISOString() };
}

export function undoPayload(payload: DecisionPayload, now: number): DecisionPayload | null {
  const step = stepBack(payload.decisions, payload.history, payload.cursor);
  if (!step) return null;
  return { ...payload, decisions: step.decisions, cursor: step.cursor, at: new Date(now).toISOString() };
}

export function redoPayload(payload: DecisionPayload, now: number): DecisionPayload | null {
  const step = stepForward(payload.decisions, payload.history, payload.cursor);
  if (!step) return null;
  return { ...payload, decisions: step.decisions, cursor: step.cursor, at: new Date(now).toISOString() };
}

/* ===================================================================
   #382 — duplicate detector
   Title words are compared against catalog titles and tags. The UI prints
   the words that matched, because "similar" on its own is not checkable.
   =================================================================== */

const STOP_WORDS = new Set([
  "a", "an", "and", "the", "with", "for", "of", "to", "in", "on", "page", "prompt", "hero", "section", "component",
]);

export function words(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

export interface DuplicateMatch {
  slug: string;
  title: string;
  kind: string;
  href: string;
  shared: string[];
  /** share of the submission's title words that already exist somewhere on the item */
  coverage: number;
  why: string;
}

export const DUPLICATE_LINE = 0.6;

export function duplicatesFor(
  submission: Submission,
  minWords = 3,
  line: number = DUPLICATE_LINE,
): DuplicateMatch[] {
  const subWords = [...new Set(words(submission.title))];
  if (subWords.length < minWords) return [];
  const pool = [
    ...COMPONENTS.map((c) => ({
      slug: c.slug,
      title: c.title,
      kind: c.kind,
      href: `/components/${c.slug}`,
      extra: [...c.tags, ...(c.aliases ?? [])],
    })),
    ...PROMPTS.map((p) => ({
      slug: p.slug,
      title: p.title,
      kind: "prompt",
      href: `/prompts/${p.slug}`,
      extra: [p.industry, p.vibe],
    })),
  ];
  const matches: DuplicateMatch[] = [];
  for (const item of pool) {
    const itemWords = new Set(words(`${item.title} ${item.extra.join(" ")}`));
    const shared = subWords.filter((w) => itemWords.has(w));
    const coverage = shared.length / subWords.length;
    if (coverage >= line) {
      matches.push({
        slug: item.slug,
        title: item.title,
        kind: item.kind,
        href: item.href,
        shared,
        coverage: Math.round(coverage * 100) / 100,
        why: `${shared.length} of ${subWords.length} title words already appear on ${item.title} (${shared.join(", ")})`,
      });
    }
  }
  return matches.sort((a, b) => b.coverage - a.coverage || a.title.localeCompare(b.title)).slice(0, 4);
}

export function duplicateReport(submissions: Submission[] = MODERATION_SEED) {
  const rows = submissions.map((s) => ({ submission: s, matches: duplicatesFor(s) }));
  return {
    rows,
    checked: submissions.length,
    flagged: rows.filter((r) => r.matches.length > 0).length,
    line: DUPLICATE_LINE,
  };
}

/* ===================================================================
   #384 — quick stats per content type
   Two real charts and one named gap: the catalog dates every item, so
   publish volume can be charted; it stores one rolling copies number per
   asset and no history, so no copy trend can be.
   =================================================================== */

/** Shared one-liner: the console's honest limit, stated in the same words
 *  wherever a report or chart runs into it. */
export const EXPORTABLE_NOTE =
  "cannot be drawn, because the catalog keeps one rolling copies number per asset and no history. Everything on this page is a catalog field.";

export interface KindStat {
  kind: string;
  items: number;
  copies: number;
  meanA11y: number;
  meanQuality: number;
  meanKb: number;
}

export function kindStats(): KindStat[] {
  const byKind = new Map<string, { items: number; copies: number; a11y: number; quality: number; kb: number }>();
  for (const c of COMPONENTS) {
    const cur = byKind.get(c.kind) ?? { items: 0, copies: 0, a11y: 0, quality: 0, kb: 0 };
    byKind.set(c.kind, {
      items: cur.items + 1,
      copies: cur.copies + c.copies,
      a11y: cur.a11y + c.a11yScore,
      quality: cur.quality + c.qualityScore,
      kb: cur.kb + c.bundleKb,
    });
  }
  return [...byKind.entries()]
    .map(([kind, v]) => ({
      kind,
      items: v.items,
      copies: v.copies,
      meanA11y: Math.round(v.a11y / v.items),
      meanQuality: Math.round(v.quality / v.items),
      meanKb: Math.round((v.kb / v.items) * 10) / 10,
    }))
    .sort((a, b) => b.items - a.items || a.kind.localeCompare(b.kind));
}

export interface HistogramBucket {
  label: string;
  items: number;
  copies: number;
  share: number;
}

/** Publish volume per month, with `share` already normalised to a bar width
 *  so the chart cannot disagree with the numbers printed beside it. */
export function publishHistogram(): HistogramBucket[] {
  const rows = publishMonthRows().slice().reverse();
  const peak = Math.max(1, ...rows.map((r) => r.items));
  return rows.map((r) => ({ label: r.month, items: r.items, copies: r.copies, share: Math.round((r.items / peak) * 100) }));
}

export interface TypeCount {
  label: string;
  items: number;
  href: string;
  note: string;
}

export function contentTypeCounts(): TypeCount[] {
  const newest = newestCatalogDate();
  const within30 = (dates: string[]) => dates.filter((d) => daysSince(d) <= 30).length;
  return [
    {
      label: "Components",
      items: COMPONENTS.length,
      href: "/components",
      note: `${within30(COMPONENTS.map((c) => c.published))} published in the last 30 days`,
    },
    {
      label: "Prompts",
      items: PROMPTS.length,
      href: "/prompts",
      note: `${within30(PROMPTS.map((p) => p.published))} published in the last 30 days`,
    },
    {
      label: "Guides",
      items: LEARN_ARTICLES.length,
      href: "/learn",
      note: `${within30(LEARN_ARTICLES.map((a) => a.updated))} updated in the last 30 days`,
    },
    {
      label: "Backgrounds",
      items: BACKGROUNDS.length,
      href: "/backgrounds",
      note: "no per-item dates in the catalog, so no window to count",
    },
    {
      label: "Changelog entries",
      items: CHANGELOG.length,
      href: "/#changelog",
      note: `${within30(CHANGELOG.map((c) => c.date))} dated in the last 30 days`,
    },
    {
      label: "Lab tools",
      items: LAB_TOOLS.length,
      href: "/lab",
      note: "tools, not dated records — excluded from every freshness figure",
    },
  ].map((t) => ({ ...t, note: t.note.replace(/\b30 days\b/, `30 days before ${newest}`) }));
}

export function statsSummary() {
  const kinds = kindStats();
  const hist = publishHistogram();
  const types = contentTypeCounts();
  return {
    kinds,
    hist,
    types,
    totalItems: types.reduce((a, t) => a + t.items, 0),
    busiestMonth: hist.reduce((a, b) => (b.items > a.items ? b : a), hist[0] ?? { label: "", items: 0, copies: 0, share: 0 }),
    copiesTotal: kinds.reduce((a, k) => a + k.copies, 0),
  };
}

/* ===================================================================
   #383 — the empty state
   When the queue is clear, show what actually shipped rather than a blank
   page. The window is anchored on the newest catalog date, the same anchor
   the freshness rule uses, so "this week" cannot drift with the clock.
   =================================================================== */

export interface ShippedItem {
  title: string;
  href: string;
  kind: string;
  date: string;
  age: number;
}

export function shippedWithin(days = 7, limit = 6): { items: ShippedItem[]; total: number; window: number; anchor: string; omitted: number } {
  const items: ShippedItem[] = [
    ...COMPONENTS.map((c) => ({ title: c.title, href: `/components/${c.slug}`, kind: c.kind, date: c.published })),
    ...PROMPTS.map((p) => ({ title: p.title, href: `/prompts/${p.slug}`, kind: "prompt", date: p.published })),
    ...CHANGELOG.map((c) => ({ title: c.title, href: "/#changelog", kind: "changelog", date: c.date })),
  ]
    .map((i) => ({ ...i, age: daysSince(i.date) }))
    .filter((i) => i.age <= days)
    .sort((a, b) => a.age - b.age || a.title.localeCompare(b.title));
  return {
    items: items.slice(0, limit),
    total: items.length,
    omitted: Math.max(0, items.length - limit),
    window: days,
    anchor: newestCatalogDate(),
  };
}

export function emptyStateLine(openCount: number, total: number, days = 7): string {
  const shipped = `${total} record${total === 1 ? "" : "s"} published in the ${days} days before ${newestCatalogDate()}`;
  return openCount === 0
    ? `Nothing is waiting for a decision. ${shipped}; the newest are below.`
    : `${openCount} submission${openCount === 1 ? "" : "s"} still need a decision — meanwhile, ${shipped}.`;
}
