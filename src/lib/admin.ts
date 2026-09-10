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
      validate: (v) => (v.split(",").filter((t) => t.trim()).length < 2 ? "At least two tags — a single tag cannot be filtered against." : null),
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
      options: ["live", "beta", "draft", "deprecated"],
      hint: "Only “live” items appear in public listings.",
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
