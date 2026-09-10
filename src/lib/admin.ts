/* ---------------------------------------------------------------------
   Admin layer — Section 13, batches 51+.
   Everything here is computed from the catalog or from records the console
   itself writes. The admin demo may be *demonstrative*, but it must not
   invent numbers: where a figure would need a server (real queue traffic,
   real contributor counts, real review latency) the code either derives it
   from dates we hold or returns nothing and lets the UI say so.
   --------------------------------------------------------------------- */

import { BACKGROUNDS, CHANGELOG, COMPONENTS, LAB_TOOLS, PROMPTS } from "./data";
import { LEARN_ARTICLES } from "./learn";
import { budgetFor, kindLabel } from "./kinds";
import { MODERATION_SEED, type Gate, type Submission } from "./community";
import type { Asset } from "./types";

/** The role shown in the admin topbar — one named actor for the audit trail. */
export const ADMIN_ACTOR = "admin@motifui.dev";

export const ADMIN_AUDIT_KEY = "motif-admin-audit-trail";
export const ADMIN_CMS_KEY = "motif-admin-cms-drafts";
export const ADMIN_SCHEDULE_KEY = "motif-admin-schedule";

/* ===================================================================
   #369 — audit trail
   Append-only by construction: the store only ever grows, and every entry
   carries the actor, the action, the subject and a note.
   =================================================================== */

export type AuditAction = "approved" | "rejected" | "rescheduled" | "edited" | "exported";

export interface AuditEntry {
  id: string;
  at: string;
  actor: string;
  action: AuditAction;
  subject: string;
  note: string;
}

export function auditEntry(action: AuditAction, subject: string, note: string, at = new Date().toISOString()): AuditEntry {
  return {
    id: `${at}-${action}-${subject}`.replace(/[^A-Za-z0-9:-]/g, "_"),
    at,
    actor: ADMIN_ACTOR,
    action,
    subject,
    note,
  };
}

/** Newest first, capped so the store cannot grow without bound. */
export function appendAudit(trail: AuditEntry[], entry: AuditEntry, cap = 200): AuditEntry[] {
  return [entry, ...trail.filter((e) => e.id !== entry.id)].slice(0, cap);
}

export function auditSummary(trail: AuditEntry[]) {
  const byAction = trail.reduce<Record<string, number>>((acc, e) => {
    acc[e.action] = (acc[e.action] ?? 0) + 1;
    return acc;
  }, {});
  return {
    total: trail.length,
    byAction,
    actors: [...new Set(trail.map((e) => e.actor))],
    first: trail.length ? trail[trail.length - 1].at : "",
    last: trail.length ? trail[0].at : "",
  };
}

/** Median gap between consecutive trail entries, in minutes, from real stamps.
 *  Returns null when there are fewer than two entries — no invented latency. */
export function medianGapMinutes(trail: AuditEntry[]): number | null {
  if (trail.length < 2) return null;
  const times = trail.map((e) => new Date(e.at).getTime()).sort((a, b) => a - b);
  const gaps: number[] = [];
  for (let i = 1; i < times.length; i++) gaps.push((times[i] - times[i - 1]) / 60000);
  gaps.sort((a, b) => a - b);
  const mid = Math.floor(gaps.length / 2);
  const median = gaps.length % 2 ? gaps[mid] : (gaps[mid - 1] + gaps[mid]) / 2;
  return Math.round(median * 10) / 10;
}

/* ===================================================================
   #366 — pipeline overview
   The funnel is built from the sample queue plus whatever the console has
   actually recorded locally; every count states where it came from.
   =================================================================== */

export interface PipelineStage {
  stage: string;
  n: number;
  source: string;
  detail: string;
}

export function pipelineStages(trail: AuditEntry[], decidedCount: number): PipelineStage[] {
  const decidedIds = new Set(trail.filter((e) => e.action === "approved" || e.action === "rejected").map((e) => e.subject));
  const pending = MODERATION_SEED.filter((s) => !decidedIds.has(s.id)).length;
  const warn = MODERATION_SEED.filter((s) => s.lint !== "pass" || s.safety !== "pass").length;

  return [
    {
      stage: "Submitted",
      n: MODERATION_SEED.length,
      source: "sample queue shipped with this build",
      detail: `${MODERATION_SEED.filter((s) => s.kind === "prompt").length} prompt · ${MODERATION_SEED.filter((s) => s.kind !== "prompt").length} component submissions`,
    },
    {
      stage: "Gates ran",
      n: MODERATION_SEED.length,
      source: "every sample row carries a gate result",
      detail: `${MODERATION_SEED.length - warn} clean, ${warn} flagged`,
    },
    {
      stage: "Awaiting your review",
      n: pending,
      source: `${decidedCount} row${decidedCount === 1 ? "" : "s"} you have decided`,
      detail: pending === 0 ? "your local queue is empty" : `${warn > 0 ? "includes" : ""} the flagged rows first, by rule`,
    },
    {
      stage: "Published",
      n: COMPONENTS.filter((c) => daysSince(c.published) <= 30).length + PROMPTS.filter((p) => daysSince(p.published) <= 30).length,
      source: "catalog items published in the last 30 days",
      detail: "counted from publication dates in the catalog, not from queue decisions",
    },
  ];
}

/** Days since an ISO date, measured against the newest catalog date so the
 *  page cannot drift out of step with the data it describes. */
export function daysSince(iso: string): number {
  const newest = [...COMPONENTS.map((c) => c.published), ...PROMPTS.map((p) => p.published)].sort().at(-1) ?? iso;
  const a = Date.parse(`${iso}T00:00:00Z`);
  const b = Date.parse(`${newest}T00:00:00Z`);
  return Math.round((b - a) / 86400000);
}

export function newestCatalogDate(): string {
  return [...COMPONENTS.map((c) => c.published), ...PROMPTS.map((p) => p.published)].sort().at(-1) ?? "";
}

/* ===================================================================
   #367 — scheduled publishing
   A scheduled item is a record the console holds: entity, date, note. Nothing
   publishes, because no build hook exists to publish it — the page says so.
   =================================================================== */

export interface ScheduleItem {
  id: string;
  slug: string;
  kind: string;
  title: string;
  publishOn: string;
  note: string;
  createdAt: string;
}

/** Validation with the reason attached, so the form can explain itself. */
export function scheduleError(publishOn: string, now = new Date()): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(publishOn)) return "Use an ISO date (YYYY-MM-DD).";
  const t = Date.parse(`${publishOn}T00:00:00Z`);
  if (Number.isNaN(t)) return "That date does not exist.";
  const today = Date.parse(`${now.toISOString().slice(0, 10)}T00:00:00Z`);
  if (t <= today) return "A scheduled date has to be in the future — the catalog's own dates are already live.";
  if (t - today > 365 * 86400000) return "More than a year ahead: pick something you can actually be held to.";
  return null;
}

/** The soonest date the tool will accept, computed from today. */
export function earliestScheduleDate(now = new Date()): string {
  const d = new Date(now.getTime() + 86400000);
  return d.toISOString().slice(0, 10);
}

export function scheduleBoard(items: ScheduleItem[], now = new Date()) {
  const today = Date.parse(`${now.toISOString().slice(0, 10)}T00:00:00Z`);
  return [...items]
    .map((i) => ({
      ...i,
      days: Math.round((Date.parse(`${i.publishOn}T00:00:00Z`) - today) / 86400000),
    }))
    .sort((a, b) => a.publishOn.localeCompare(b.publishOn));
}

/* ===================================================================
   #365 — local-first content CMS
   Fields are declared per entity kind, validated against the catalog's own
   rules, and exported as a patch. The editor never writes a file.
   =================================================================== */

export type FieldType = "text" | "number" | "list" | "select";

export interface CmsField {
  name: string;
  label: string;
  type: FieldType;
  value: string;
  hint: string;
  options?: string[];
  validate?: (v: string) => string | null;
}

export interface CmsDraft {
  slug: string;
  fields: Record<string, string>;
  updatedAt: string;
}

const num = (v: string) => (v.trim() === "" || Number.isNaN(Number(v)) ? null : Number(v));

export function cmsFieldsFor(asset: Asset): CmsField[] {
  const budget = budgetFor(asset.kind);
  return [
    {
      name: "title",
      label: "Title",
      type: "text",
      value: asset.title,
      hint: "Shown on every card, detail page and search result.",
      validate: (v) => (v.trim().length < 3 ? "A title shorter than 3 characters will look broken on a card." : null),
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      value: asset.description,
      hint: "One or two sentences: what it does and what it costs the page.",
      validate: (v) => (v.trim().length < 40 ? "Descriptions under 40 characters leave the card looking unfinished." : null),
    },
    {
      name: "tags",
      label: "Tags",
      type: "list",
      value: asset.tags.join(", "),
      hint: "Comma separated. These drive search and the collection filters.",
      validate: (v) => (v.split(",").filter((t) => t.trim()).length < 2 ? "At least two tags — every published component carries three to six, so one would be the only single-tag row in the catalog." : null),
    },
    {
      name: "bundleKb",
      label: "Bundle size (KB)",
      type: "number",
      value: String(asset.bundleKb),
      hint: `The published budget for a ${kindLabel(asset.kind).toLowerCase()} is ${budget} KB.`,
      validate: (v) => {
        const n = num(v);
        if (n === null || n <= 0) return "Bundle size must be a number above zero.";
        if (n > budget * 2.5) return `${n} KB is more than double the ${budget} KB budget — this needs a written reason, not a bigger number.`;
        return null;
      },
    },
    {
      name: "a11yScore",
      label: "Accessibility audit",
      type: "number",
      value: String(asset.a11yScore),
      hint: "0–100. The catalog's accessible-ready band starts at 98.",
      validate: (v) => {
        const n = num(v);
        if (n === null || n < 0 || n > 100) return "Audit score has to be between 0 and 100.";
        return null;
      },
    },
    {
      name: "deps",
      label: "Dependencies",
      type: "list",
      value: asset.deps.join(", "),
      hint: "Comma separated, empty means zero-dependency.",
      validate: () => null,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      value: asset.status,
      options: ["draft", "review", "live", "archived"],
      hint: "Lifecycle state, and the only legal values the catalog type accepts. Nothing public filters on it today — every published component is listed regardless — so a change here is intent, not a switch.",
      validate: () => null,
    },
  ];
}

export function validateDraft(asset: Asset, draft: CmsDraft): { field: string; message: string }[] {
  const out: { field: string; message: string }[] = [];
  for (const f of cmsFieldsFor(asset)) {
    const v = draft.fields[f.name];
    if (v === undefined || v === "") continue;
    const msg = f.validate?.(v);
    if (msg) out.push({ field: f.name, message: msg });
  }
  return out;
}

export interface ContentPatch {
  path: string;
  anchor: string;
  note: string;
  changes: { field: string; from: string; to: string }[];
  instruction: string;
}

/** A patch preview: the exact anchor line in the source and the field changes.
 *  It is text for a human to apply — the console has no write access to files. */
export function buildPatch(asset: Asset, draft: CmsDraft): ContentPatch {
  const fields = cmsFieldsFor(asset);
  const changes = fields
    .filter((f) => draft.fields[f.name] !== undefined && draft.fields[f.name] !== f.value)
    .map((f) => ({ field: f.name, from: f.value, to: draft.fields[f.name] }));
  return {
    path: "src/lib/data.ts",
    anchor: `slug: "${asset.slug}"`,
    note: `${changes.length} field change${changes.length === 1 ? "" : "s"} on ${asset.title}`,
    changes,
    instruction:
      "Find the object whose slug matches the anchor above, apply the changes field by field, then run `npm run typecheck && npm run build`. The editor deliberately cannot write to the repository — a content change should travel through the same review as a code change.",
  };
}

/* ===================================================================
   #368 — bulk transitions and #370 — search inside the console
   =================================================================== */

/** Bulk approval requires *every* gate to have passed — the same definition of
 *  "clean" the outcomes page, the badges and the weekly picks use. A single-row
 *  review can approve a warning, because the reviewer can read the warning; a
 *  bulk action cannot, because nobody is reading anything. Rejection carries no
 *  such restriction: refusing something needs no extra authority. */
export function bulkEligibility(rows: Submission[], action: "approved" | "rejected") {
  const allowed: Submission[] = [];
  const blocked: { row: Submission; reason: string }[] = [];
  for (const r of rows) {
    if (action !== "approved") {
      allowed.push(r);
      continue;
    }
    if (r.safety === "fail") {
      blocked.push({ row: r, reason: "safety gate failed — approved-by-default is how bad code ships" });
    } else if (r.safety === "warn") {
      blocked.push({ row: r, reason: "safety warning — needs the retry note read before it can be approved" });
    } else if (r.lint === "fail") {
      blocked.push({ row: r, reason: "lint failed — the fix is not obvious from the record" });
    } else if (r.lint === "warn") {
      blocked.push({ row: r, reason: "lint warning — a conversation, not a rubber stamp" });
    } else {
      allowed.push(r);
    }
  }
  return { allowed, blocked };
}

export type SearchKind = "component" | "prompt" | "guide" | "background" | "lab" | "changelog" | "submission";

export interface SearchDoc {
  kind: SearchKind;
  slug: string;
  title: string;
  href: string;
  meta: string;
  haystack: string;
}

export function searchIndex(): SearchDoc[] {
  const docs: SearchDoc[] = [
    ...COMPONENTS.map((c) => ({
      kind: "component" as const,
      slug: c.slug,
      title: c.title,
      href: `/components/${c.slug}`,
      meta: `${kindLabel(c.kind)} · a11y ${c.a11yScore} · Q ${c.qualityScore} · ${c.bundleKb} KB`,
      haystack: [c.title, c.slug, c.description, c.tags.join(" "), c.behaviors.join(" "), c.aliases?.join(" ") ?? "", c.status].join(" ").toLowerCase(),
    })),
    ...PROMPTS.map((p) => ({
      kind: "prompt" as const,
      slug: p.slug,
      title: p.title,
      href: `/prompts/${p.slug}`,
      meta: `${p.industry} · fidelity ${p.avgFidelity} · ${p.runs.length} runs · ${p.status}`,
      haystack: [p.title, p.slug, p.vibe, p.industry, p.blocks.join(" "), p.stacks.join(" "), p.status].join(" ").toLowerCase(),
    })),
    ...LEARN_ARTICLES.map((a) => ({
      kind: "guide" as const,
      slug: a.slug,
      title: a.title,
      href: `/learn/${a.slug}`,
      meta: `${a.level} · ${a.minutes} min · updated ${a.updated}`,
      haystack: [a.title, a.slug, a.deck, a.kicker, a.tags.join(" ")].join(" ").toLowerCase(),
    })),
    ...BACKGROUNDS.map((b) => ({
      kind: "background" as const,
      slug: b.slug,
      title: b.title,
      href: "/backgrounds",
      meta: `${b.category} · ${b.perf} perf · ${b.bundleKb} KB`,
      haystack: [b.title, b.slug, b.description, b.category, b.tech.join(" ")].join(" ").toLowerCase(),
    })),
    ...LAB_TOOLS.map((t) => ({
      kind: "lab" as const,
      slug: t.slug,
      title: t.title,
      href: `/lab`,
      meta: "interactive tool",
      haystack: [t.title, t.slug, t.description ?? ""].join(" ").toLowerCase(),
    })),
    ...CHANGELOG.map((c) => ({
      kind: "changelog" as const,
      slug: `${c.date}-${c.title}`.slice(0, 60),
      title: c.title,
      href: "/#changelog",
      meta: `${c.tag} · ${c.date}`,
      haystack: [c.title, c.body, c.tag, c.date].join(" ").toLowerCase(),
    })),
    ...MODERATION_SEED.map((s) => ({
      kind: "submission" as const,
      slug: s.id,
      title: s.title,
      href: "/admin/moderation",
      meta: `${s.kind} · @${s.author} · score ${s.score} · lint ${s.lint} · safety ${s.safety}`,
      haystack: [s.title, s.id, s.author, s.kind, s.stack, s.lint, s.safety].join(" ").toLowerCase(),
    })),
  ];
  return docs;
}

export function searchDocs(query: string, docs = searchIndex(), limit = 40): SearchDoc[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return docs
    .map((d) => {
      const inTitle = terms.every((t) => d.title.toLowerCase().includes(t));
      const hits = terms.filter((t) => d.haystack.includes(t)).length;
      return { d, score: (inTitle ? 100 : 0) + hits * 10 + (d.haystack.includes(q) ? 5 : 0) };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.d.title.localeCompare(b.d.title))
    .slice(0, limit)
    .map((x) => x.d);
}

/* -- gate helpers reused by the bulk tools -------------------------- */

export const gateTone = (g: Gate) => (g === "pass" ? "text-mint" : g === "warn" ? "text-amber-300" : "text-danger");

/* ===================================================================
   #371 — content health: freshness, audit status and open issues per asset
   Every factor is one published field compared against one published
   threshold, so a red cell always has a number behind it.
   =================================================================== */

export interface HealthFactor {
  label: string;
  ok: boolean;
  detail: string;
  weight: number;
}

export interface HealthRow {
  slug: string;
  title: string;
  kind: string;
  score: number;
  age: number;
  factors: HealthFactor[];
}

export const HEALTH_THRESHOLDS = {
  freshnessDays: 30,
  a11y: 95,
  quality: 90,
  /** budget comes from the per-kind table in ./kinds */
} as const;

export function contentHealth(assets: Asset[] = COMPONENTS): HealthRow[] {
  return assets
    .map((a) => {
      const budget = budgetFor(a.kind);
      const age = daysSince(a.published);
      const factors: HealthFactor[] = [
        {
          label: "freshness",
          ok: age <= HEALTH_THRESHOLDS.freshnessDays,
          detail: `${age}d since the recorded publish date (window ${HEALTH_THRESHOLDS.freshnessDays}d)`,
          weight: 2,
        },
        {
          label: "a11y band",
          ok: a.a11yScore >= HEALTH_THRESHOLDS.a11y,
          detail: `audit ${a.a11yScore} (line ${HEALTH_THRESHOLDS.a11y})`,
          weight: 2,
        },
        {
          label: "editorial",
          ok: a.qualityScore >= HEALTH_THRESHOLDS.quality,
          detail: `quality ${a.qualityScore} (line ${HEALTH_THRESHOLDS.quality})`,
          weight: 2,
        },
        { label: "budget", ok: a.bundleKb <= budget, detail: `${a.bundleKb} KB of ${budget} KB`, weight: 2 },
        {
          label: "zero-dep",
          ok: a.deps.length === 0,
          detail:
            a.deps.length === 0
              ? "0 runtime dependencies"
              : `${a.deps.length} runtime dependenc${a.deps.length === 1 ? "y" : "ies"}: ${a.deps.join(", ")}`,
          weight: 1,
        },
      ];
      const total = factors.reduce((s, f) => s + f.weight, 0);
      const earned = factors.reduce((s, f) => s + (f.ok ? f.weight : 0), 0);
      return { slug: a.slug, title: a.title, kind: kindLabel(a.kind), score: Math.round((earned / total) * 100), age, factors };
    })
    .sort((a, b) => a.score - b.score || b.age - a.age || a.title.localeCompare(b.title));
}

export function healthSummary(rows: HealthRow[]) {
  const failing = (label: string) => rows.filter((r) => r.factors.some((f) => f.label === label && !f.ok)).length;
  const scores = rows.map((r) => r.score);
  return {
    total: rows.length,
    average: Math.round(scores.reduce((a, b) => a + b, 0) / Math.max(1, rows.length)),
    perfect: rows.filter((r) => r.score === 100).length,
    below90: rows.filter((r) => r.score < 90).length,
    stale: failing("freshness"),
    a11y: failing("a11y band"),
    editorial: failing("editorial"),
    budget: failing("budget"),
    dep: failing("zero-dep"),
  };
}

/* ===================================================================
   #374 — changelog composer
   Write the entry, and the composer finds the catalog items it names. The
   matching rule is printed, because "auto-linked" is only useful if you can
   see what it linked and why.
   =================================================================== */

export interface ChangelogDraft {
  date: string;
  tag: string;
  title: string;
  body: string;
}

/** The tag vocabulary the feed already uses, read out of the catalog rather
 *  than typed here: a hardcoded list drifts into offering tags no entry
 *  carries and rejecting ones that exist. */
export const CHANGELOG_TAGS: readonly string[] = [...new Set(CHANGELOG.map((c) => c.tag))].sort();

export interface LinkedItem {
  slug: string;
  title: string;
  kind: string;
  href: string;
  where: "title" | "body";
}

/** Items whose title appears in the draft, longest title first so a short
 *  title cannot claim a mention that belongs to a longer one. */
export function autoLinkAssets(draft: ChangelogDraft): LinkedItem[] {
  const candidates = COMPONENTS.map((c) => ({ slug: c.slug, title: c.title, kind: kindLabel(c.kind), href: `/components/${c.slug}` })).sort(
    (a, b) => b.title.length - a.title.length,
  );
  const out: LinkedItem[] = [];
  for (const c of candidates) {
    const t = c.title.toLowerCase();
    if (t.length < 4) continue;
    const inTitle = draft.title.toLowerCase().includes(t);
    const inBody = draft.body.toLowerCase().includes(t);
    if (inTitle || inBody) out.push({ ...c, where: inTitle ? "title" : "body" });
  }
  return out;
}

export function changelogIssues(draft: ChangelogDraft, existingDates: string[]): { field: string; message: string }[] {
  const out: { field: string; message: string }[] = [];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date) || Number.isNaN(Date.parse(`${draft.date}T00:00:00Z`))) {
    out.push({ field: "date", message: "Use an ISO date (YYYY-MM-DD)." });
  } else if (draft.date < newestCatalogDate()) {
    out.push({
      field: "date",
      message: `Backdating an entry older than the newest published record (${newestCatalogDate()}) puts the feed out of order. Add it as a numbered section with the real date instead.`,
    });
  }
  if (draft.title.trim().length < 12) out.push({ field: "title", message: "Titles under 12 characters read like a tag, not a headline." });
  if (draft.title.trim().length > 80) out.push({ field: "title", message: "Longer than 80 characters wraps badly in the feed." });
  if (draft.body.trim().length < 60) out.push({ field: "body", message: "Say what changed and why in at least a sentence — 60 characters is the floor." });
  if (!(CHANGELOG_TAGS as readonly string[]).includes(draft.tag)) out.push({ field: "tag", message: `Tag has to be one the feed already uses: ${CHANGELOG_TAGS.join(", ")}. A brand-new tag is a change to src/lib/data.ts, not to this draft.` });
  if (existingDates.includes(draft.date)) {
    out.push({ field: "date", message: "Another entry already carries this date. Several entries per date are fine, but say so here so the reviewer knows it was deliberate." });
  }
  return out;
}

/** The TypeScript object to paste into CHANGELOG in src/lib/data.ts. The
 *  composer never writes the file — it hands a human the exact text. */
export function changelogSnippet(draft: ChangelogDraft, links: LinkedItem[]): string {
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const linkNote = links.length
    ? `  // Links to ${links.map((l) => l.title).join(", ")} — already in the catalog, so reuse the wording the detail pages use.\n`
    : "";
  return `${linkNote}  {
    date: "${draft.date}", tag: "${draft.tag}", title: "${esc(draft.title)}",
    body: "${esc(draft.body)}",
  },`;
}

/* ===================================================================
   #376 — notification centre
   There is no server watching anything, so every notification is derived from
   data this build already holds: the sample queue's gate results, your own
   stored decisions, the audit trail, and the freshness window. Each card names
   its source, and the empty states say what would have to exist for a real
   inbox to be useful.
   =================================================================== */

export interface Notification {
  id: string;
  kind: "gate" | "sla" | "stale" | "local";
  tone: "danger" | "warn" | "info";
  title: string;
  body: string;
  source: string;
  href: string;
  /** newest date this notification is derived from, for ordering */
  ref: string;
}

export function notifications(
  trail: AuditEntry[],
  decisions: Record<string, "approved" | "rejected">,
  health: HealthRow[] = contentHealth(),
): Notification[] {
  const out: Notification[] = [];

  for (const s of MODERATION_SEED) {
    if (decisions[s.id]) continue;
    // A fail is a fail whichever gate it lands on. The wording follows the same
    // rule the bulk tools use: hard failure ⇒ default reject, warning ⇒ read it.
    const failed = [s.safety === "fail" ? "safety" : null, s.lint === "fail" ? "lint" : null].filter(Boolean) as string[];
    if (failed.length > 0) {
      out.push({
        id: `gate-${s.id}`,
        kind: "gate",
        tone: "danger",
        title: `${s.id} failed the ${failed.join(" and ")} gate${failed.length > 1 ? "s" : ""}`,
        body: `${s.title} — ${s.kind} by @${s.author}. lint ${s.lint}, safety ${s.safety}. ${failed.includes("safety") ? "A safety failure" : "A lint failure"} is a default reject and bulk approve will not take it; send the reason back to the submitter.`,
        source: "sample queue gate result",
        href: "/admin/moderation",
        ref: "9999-99-99",
      });
    } else if (s.lint !== "pass" || s.safety !== "pass") {
      out.push({
        id: `warn-${s.id}`,
        kind: "gate",
        tone: "warn",
        title: `${s.id} carries a gate warning`,
        body: `${s.title} — lint ${s.lint}, safety ${s.safety}. Warnings are readable one at a time; that is why bulk approve will not take them.`,
        source: "sample queue gate result",
        href: "/admin/moderation",
        ref: "9998-99-99",
      });
    }
  }

  // Health arrives weakest-first; this card claims "oldest first", so sort by age
  // rather than inheriting a different order.
  const stale = health
    .filter((h) => h.age > HEALTH_THRESHOLDS.freshnessDays)
    .sort((a, b) => b.age - a.age || a.title.localeCompare(b.title));
  if (stale.length > 0) {
    out.push({
      id: "stale-batch",
      kind: "stale",
      tone: "info",
      title: `${stale.length} catalog item${stale.length === 1 ? "" : "s"} past the ${HEALTH_THRESHOLDS.freshnessDays}-day review window`,
      body: `Oldest first: ${stale
        .slice(0, 4)
        .map((h) => `${h.title} (${h.age}d)`)
        .join(", ")}${stale.length > 4 ? `, and ${stale.length - 4} more` : ""}. Each one has a publish date behind the number.`,
      source: "freshness rule on recorded publish dates",
      href: "/admin/health",
      ref: newestCatalogDate(),
    });
  }

  const reviewed = Object.keys(decisions).length;
  if (reviewed > 0) {
    const approvals = Object.values(decisions).filter((d) => d === "approved").length;
    out.push({
      id: "local-decisions",
      kind: "local",
      tone: "info",
      title: `You have decided ${reviewed} of ${MODERATION_SEED.length} sample rows`,
      body: `${approvals} approved, ${reviewed - approvals} rejected, recorded in this browser only. Your accept rate is yours; it never enters a public statistic.`,
      source: "your localStorage decisions",
      href: "/community/outcomes",
      ref: new Date().toISOString().slice(0, 10),
    });
  }

  if (trail.length === 0) {
    out.push({
      id: "no-trail",
      kind: "sla",
      tone: "info",
      title: "No audit entries yet",
      body: "Nothing has been decided, edited, scheduled or exported on this device, so there is no queue-age figure to report. We would rather show you this than a fake SLA breach.",
      source: "empty audit trail",
      href: "/admin/audit",
      ref: newestCatalogDate(),
    });
  }

  return out.sort((a, b) => b.ref.localeCompare(a.ref) || a.id.localeCompare(b.id));
}

/* ===================================================================
   #375 — command palette
   The palette runs two kinds of thing: navigation (always available) and
   actions that are only honest where the data exists (a jump to a gate-failed
   row, a reschedule for something stale). Commands carry a description of what
   they do, because a palette that hides its semantics is a trap.
   =================================================================== */

export interface AdminCommand {
  id: string;
  label: string;
  group: "Go to" | "Review" | "Create" | "Content";
  hint: string;
  href: string;
  keywords: string;
}

export function adminCommands(health: HealthRow[] = contentHealth()): AdminCommand[] {
  const failing = MODERATION_SEED.filter((s) => s.safety === "fail" || s.lint === "fail");
  const stale = health.filter((h) => h.age > HEALTH_THRESHOLDS.freshnessDays).slice(0, 3);
  return [
    { id: "go-dash", label: "Dashboard", group: "Go to", hint: "KPIs derived from the catalog", href: "/admin", keywords: "home overview kpi" },
    { id: "go-mod", label: "Moderation queue", group: "Go to", hint: `${MODERATION_SEED.length} sample rows`, href: "/admin/moderation", keywords: "queue review approve reject" },
    { id: "go-pipeline", label: "Pipeline", group: "Go to", hint: "funnel with sources", href: "/admin/pipeline", keywords: "funnel submitted audited live" },
    { id: "go-health", label: "Content health", group: "Go to", hint: "freshness, audit, budget per asset", href: "/admin/health", keywords: "health freshness stale" },
    { id: "go-content", label: "Content editor", group: "Create", hint: "stage a field change, export a patch", href: "/admin/content", keywords: "edit cms fields patch" },
    { id: "go-inspector", label: "Copy inspector", group: "Create", hint: "preview a card or detail header before publishing", href: "/admin/inspector", keywords: "preview card list detail" },
    { id: "go-changelog", label: "Changelog composer", group: "Create", hint: "draft an entry and auto-link the assets it names", href: "/admin/changelog", keywords: "changelog entry ship notes" },
    { id: "go-prompts", label: "Prompt re-run console", group: "Review", hint: "labelled simulation — no model is called", href: "/admin/rerun", keywords: "rerun fidelity models simulation" },
    { id: "go-schedule", label: "Scheduling", group: "Create", hint: "queue a change for a future date", href: "/admin/schedule", keywords: "schedule publish future date" },
    { id: "go-notify", label: "Notifications", group: "Review", hint: "derived from the queue, your decisions and the audit trail", href: "/admin/notifications", keywords: "inbox alerts sla" },
    { id: "go-audit", label: "Audit trail", group: "Review", hint: "append-only decision log", href: "/admin/audit", keywords: "log history decisions actor" },
    { id: "go-search", label: "Search everything", group: "Content", hint: "303 indexed records", href: "/admin/search", keywords: "find lookup index" },
    { id: "go-assets", label: "Asset table", group: "Content", hint: `${COMPONENTS.length} components`, href: "/admin/assets", keywords: "components table sort" },
    { id: "go-settings", label: "Settings", group: "Go to", hint: "brand and feature flags", href: "/admin/settings", keywords: "brand flags config" },
    ...failing.map((s) => ({
      id: `review-${s.id}`,
      label: `Review ${s.id} — ${s.title}`,
      group: "Review" as const,
      hint: `lint ${s.lint} · safety ${s.safety} · score ${s.score}`,
      href: "/admin/moderation",
      keywords: `gate fail ${s.author} ${s.kind} ${s.id}`,
    })),
    ...stale.map((h) => ({
      id: `stale-${h.slug}`,
      label: `Refresh ${h.title}`,
      group: "Content" as const,
      hint: `${h.age}d since its recorded publish date — past the review window`,
      href: "/admin/content",
      keywords: `stale freshness ${h.slug} review`,
    })),
  ];
}

/** Fuzzy-lite matcher for the palette: every typed term must appear somewhere
 *  in the label, hint, group or keywords. Term order does not matter. */
export function matchCommands(query: string, commands: AdminCommand[], limit = 8): AdminCommand[] {
  const q = query.trim().toLowerCase();
  if (!q) return commands.slice(0, limit);
  const terms = q.split(/\s+/);
  return commands
    .map((c) => {
      const hay = `${c.label} ${c.hint} ${c.group} ${c.keywords}`.toLowerCase();
      const label = c.label.toLowerCase();
      const hits = terms.filter((t) => hay.includes(t)).length;
      return { c, score: hits * 10 + (label.startsWith(q) ? 25 : 0) + (label.includes(q) ? 10 : 0) };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.c.label.localeCompare(b.c.label))
    .slice(0, limit)
    .map((x) => x.c);
}
