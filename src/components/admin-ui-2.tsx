"use client";

// Admin client surfaces — Section 13, batch 51.
// #368 bulk transitions · #369 audit trail · #365 local-first CMS
// #367 scheduled publishing · #370 search inside the console
//
// All five read and write this browser's localStorage. Nothing here touches a
// server, and each panel states what the console would need before the action
// could be real.

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ADMIN_AUDIT_KEY,
  ADMIN_CMS_KEY,
  ADMIN_SCHEDULE_KEY,
  appendAudit,
  auditEntry,
  buildPatch,
  bulkEligibility,
  cmsFieldsFor,
  earliestScheduleDate,
  scheduleBoard,
  scheduleError,
  searchDocs,
  searchIndex,
  validateDraft,
  type AuditAction,
  type AuditEntry,
  type CmsDraft,
  type ScheduleItem,
  type SearchDoc,
  type SearchKind,
} from "@/lib/admin";
import { MODERATION_SEED, MODERATION_STORAGE_KEY, type Submission } from "@/lib/community";
import { normalizeDecisionPayload, recordDecisions, type DecisionPayload } from "@/lib/admin-ops";
import { COMPONENTS } from "@/lib/data";

/* ---------- shared stores ---------- */

const AUDIT_EVENT = "motif:audit-changed";
const CMS_EVENT = "motif:cms-changed";
const SCHEDULE_EVENT = "motif:schedule-changed";
const DECISION_EVENT = "motif:decisions-changed";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* blocked storage — the session still works in memory */
  }
}

export function useAuditTrail() {
  const [trail, setTrail] = useState<AuditEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const sync = () => {
      const list = readJson<AuditEntry[]>(ADMIN_AUDIT_KEY, []);
      setTrail(Array.isArray(list) ? list : []);
      setHydrated(true);
    };
    const raf = requestAnimationFrame(sync);
    window.addEventListener(AUDIT_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener(AUDIT_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const record = (action: AuditAction, subject: string, note: string) => {
    const next = appendAudit(readJson<AuditEntry[]>(ADMIN_AUDIT_KEY, []), auditEntry(action, subject, note));
    writeJson(ADMIN_AUDIT_KEY, next);
    setTrail(next);
    window.dispatchEvent(new Event(AUDIT_EVENT));
    return next;
  };
  const clear = () => {
    writeJson(ADMIN_AUDIT_KEY, []);
    setTrail([]);
    window.dispatchEvent(new Event(AUDIT_EVENT));
  };
  return { trail, record, clear, hydrated };
}

function useDecisions() {
  const [decisions, setDecisions] = useState<Record<string, "approved" | "rejected">>({});
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const sync = () => {
      const p = normalizeDecisionPayload(readJson<unknown>(MODERATION_STORAGE_KEY, null));
      setDecisions(p.decisions);
      setHydrated(true);
    };
    const raf = requestAnimationFrame(sync);
    window.addEventListener(DECISION_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener(DECISION_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const decide = (ids: string[], decision: "approved" | "rejected") => {
    // Record through the shared payload so a bulk action is one undoable step
    // rather than a write that erases whatever history was there.
    const cur: DecisionPayload = normalizeDecisionPayload(readJson<unknown>(MODERATION_STORAGE_KEY, null));
    const next = recordDecisions(cur, ids, decision, Date.now());
    writeJson(MODERATION_STORAGE_KEY, next);
    setDecisions(next.decisions);
    window.dispatchEvent(new Event(DECISION_EVENT));
    // the queue page listens to storage events in other tabs; same-tab readers
    // pick the new state up through the event above
    window.dispatchEvent(new StorageEvent("storage", { key: MODERATION_STORAGE_KEY }));
  };
  return { decisions, decide, hydrated };
}

/* ===================================================================
   #368 — bulk status transitions, with the confirm the row data earns
   =================================================================== */

export function BulkQueue() {
  const { decisions, decide } = useDecisions();
  const [selected, setSelected] = useState<string[]>([]);
  const [pending, setPending] = useState<"approved" | "rejected" | null>(null);
  const [done, setDone] = useState<string>("");
  const { record } = useAuditTrail();

  const undecided = MODERATION_SEED.filter((s) => !decisions[s.id]);
  const chosen = MODERATION_SEED.filter((s) => selected.includes(s.id));
  const verdict = pending ? bulkEligibility(chosen, pending) : { allowed: [], blocked: [] };

  const apply = () => {
    if (!pending || verdict.allowed.length === 0) return;
    const ids = verdict.allowed.map((r) => r.id);
    decide(ids, pending);
    for (const r of verdict.allowed) {
      record(pending, r.id, `${pending === "approved" ? "Approved" : "Rejected"} in a bulk action of ${ids.length} — ${r.title}`);
    }
    setDone(
      `${ids.length} ${ids.length === 1 ? "row" : "rows"} marked ${pending}${verdict.blocked.length ? `; ${verdict.blocked.length} skipped by the gate rule` : ""}.`,
    );
    setSelected([]);
    setPending(null);
  };

  return (
    <div className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Bulk transitions</p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-dim">
            Select rows, pick a verdict, confirm. A bulk approval only carries rows whose gates all passed — the same
            definition of clean used by the outcomes page, the badges and the weekly picks. A warning of any kind has to
            be read one row at a time, because that is exactly what a bulk action skips. Rejection has no such limit.
          </p>
        </div>
        <span className="chip !text-[10px]">{undecided.length} still open</span>
      </div>

      {done && <p className="mt-4 rounded-2xl border border-mint/25 bg-mint/[.05] px-4 py-2.5 text-[11px] font-semibold text-mint">{done}</p>}

      {undecided.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-white/12 px-4 py-6 text-center text-[11px] text-ink-faint">
          Every sample row has a decision on this device.{" "}
          <Link href="/admin/audit" className="font-semibold text-violet-300 hover:text-violet-200">
            The audit trail
          </Link>{" "}
          has the record, and the queue page can restore the demo rows.
        </p>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setSelected(undecided.map((s) => s.id))} className="btn btn-ghost !px-3 !py-1.5 text-xs">
              Select all {undecided.length}
            </button>
            <button type="button" onClick={() => setSelected([])} className="btn btn-ghost !px-3 !py-1.5 text-xs">
              Clear
            </button>
            <button
              type="button"
              disabled={selected.length === 0}
              onClick={() => setPending("approved")}
              className="btn btn-primary !px-4 !py-2 text-xs disabled:opacity-40"
            >
              Approve {selected.length || ""}
            </button>
            <button
              type="button"
              disabled={selected.length === 0}
              onClick={() => setPending("rejected")}
              className="btn btn-ghost !px-4 !py-2 text-xs disabled:opacity-40 hover:!border-danger/40 hover:!text-danger"
            >
              Reject {selected.length || ""}
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {undecided.map((s) => {
              const on = selected.includes(s.id);
              return (
                <label
                  key={s.id}
                  className={`flex cursor-pointer flex-wrap items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                    on ? "border-violet-300/30 bg-violet-400/[.05]" : "border-white/8 bg-white/[.02]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => setSelected((prev) => (prev.includes(s.id) ? prev.filter((x) => x !== s.id) : [...prev, s.id]))}
                    className="h-4 w-4 accent-violet-400"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-bold text-ink">{s.title}</span>
                    <span className="mt-0.5 block font-mono text-[10px] text-ink-faint">
                      {s.id} · {s.kind} · @{s.author} · {s.stack}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="chip !text-[10px]">score {s.score}</span>
                    <span className={`chip !text-[10px] ${s.lint === "pass" ? "!border-mint/25 !text-mint" : s.lint === "warn" ? "!border-amber-300/25 !text-amber-300" : "!border-danger/25 !text-danger"}`}>
                      lint {s.lint}
                    </span>
                    <span className={`chip !text-[10px] ${s.safety === "pass" ? "!border-mint/25 !text-mint" : "!border-danger/25 !text-danger"}`}>
                      safety {s.safety}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </>
      )}

      {pending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0b0d14] p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Confirm bulk action</p>
            <h3 className="mt-1.5 text-lg font-extrabold tracking-tight">
              Mark {verdict.allowed.length} {verdict.allowed.length === 1 ? "row" : "rows"} {pending}?
            </h3>
            <p className="mt-2 text-[12px] leading-relaxed text-ink-dim">
              Decisions are written to this browser&apos;s moderation store and to the audit trail with your role and a
              timestamp. Nothing is published — there is no server to publish to.
            </p>
            {verdict.blocked.length > 0 && (
              <div className="mt-3 rounded-2xl border border-amber-300/25 bg-amber-300/[.05] px-4 py-3">
                <p className="text-[11px] font-bold text-amber-300">
                  {verdict.blocked.length} {verdict.blocked.length === 1 ? "row is" : "rows are"} excluded by the rule
                </p>
                <ul className="mt-1.5 space-y-1">
                  {verdict.blocked.map((b) => (
                    <li key={b.row.id} className="text-[10px] leading-relaxed text-amber-200/80">
                      {b.row.id} — {b.reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setPending(null)} className="btn btn-ghost !px-4 !py-2 text-xs">
                Cancel
              </button>
              <button
                type="button"
                onClick={apply}
                disabled={verdict.allowed.length === 0}
                className="btn btn-primary !px-4 !py-2 text-xs disabled:opacity-40"
              >
                Confirm {pending}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================================================================
   #369 — audit trail
   =================================================================== */

const ACTION_TONE: Record<AuditAction, string> = {
  approved: "!border-mint/25 !text-mint",
  rejected: "!border-danger/25 !text-danger",
  rescheduled: "!border-cyan-300/25 !text-cyan-200",
  edited: "!border-violet-300/25 !text-violet-200",
  exported: "!border-amber-300/25 !text-amber-300",
};

export function AuditTrail() {
  const { trail, clear, hydrated } = useAuditTrail();
  const [filter, setFilter] = useState<"all" | AuditAction>("all");
  const shown = filter === "all" ? trail : trail.filter((e) => e.action === filter);

  return (
    <div className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Audit trail</p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-dim">
            Append-only: the console only ever adds entries, and every entry names the actor, the action, the subject and
            a note. There is no edit or delete button, because a decision log you can rewrite is not a decision log.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="chip !text-[10px]">{trail.length} entries</span>
          {trail.length > 0 && (
            <button type="button" onClick={clear} className="btn btn-ghost !px-3 !py-1.5 text-[10px] hover:!border-danger/40 hover:!text-danger">
              Clear this browser&apos;s trail
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {(["all", "approved", "rejected", "edited", "rescheduled", "exported"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`chip !cursor-pointer !text-[10px] ${filter === f ? "!border-violet-300/50 !text-ink" : ""}`}
          >
            {f}
          </button>
        ))}
      </div>

      {!hydrated ? (
        <p className="mt-4 text-xs text-ink-faint">Reading the trail…</p>
      ) : shown.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-white/12 px-4 py-6 text-center text-[11px] leading-relaxed text-ink-faint">
          Nothing recorded{filter === "all" ? " yet" : ` as “${filter}”`}. Actions you take in the{" "}
          <Link href="/admin/moderation" className="font-semibold text-violet-300 hover:text-violet-200">
            moderation queue
          </Link>
          , the{" "}
          <Link href="/admin/content" className="font-semibold text-violet-300 hover:text-violet-200">
            content editor
          </Link>{" "}
          or the{" "}
          <Link href="/admin/schedule" className="font-semibold text-violet-300 hover:text-violet-200">
            scheduler
          </Link>{" "}
          appear here with a timestamp.
        </p>
      ) : (
        <div className="mt-4 space-y-2">
          {shown.map((e) => (
            <div key={e.id} className="rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`chip !text-[10px] ${ACTION_TONE[e.action]}`}>{e.action}</span>
                <span className="font-mono text-[10px] text-ink-faint">{e.subject}</span>
                <span className="ml-auto font-mono text-[10px] text-ink-faint">{e.at.slice(0, 19).replace("T", " ")}</span>
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-ink-dim">{e.note}</p>
              <p className="mt-0.5 font-mono text-[9px] text-ink-faint">actor {e.actor}</p>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 border-t border-white/6 pt-3 text-[10px] leading-relaxed text-ink-faint">
        The trail lives in <span className="font-mono">motif-admin-audit-trail</span> on this device. A real audit log
        would be append-only server-side with the actor taken from the session — and would refuse the delete this browser
        offers, which is why the button says whose trail it clears.
      </p>
    </div>
  );
}

/* ===================================================================
   #365 — local-first content CMS
   =================================================================== */

export function CmsEditor() {
  const first = COMPONENTS[0];
  const [slug, setSlug] = useState(first.slug);
  const asset = COMPONENTS.find((c) => c.slug === slug) ?? first;
  const fields = useMemo(() => cmsFieldsFor(asset), [asset]);
  const [draft, setDraft] = useState<Record<string, string>>(() => Object.fromEntries(cmsFieldsFor(first).map((f) => [f.name, f.value])));
  const [drafts, setDrafts] = useState<CmsDraft[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [copied, setCopied] = useState(false);
  const { record } = useAuditTrail();

  useEffect(() => {
    const sync = () => {
      const stored = readJson<CmsDraft[]>(ADMIN_CMS_KEY, []);
      setDrafts(Array.isArray(stored) ? stored : []);
      setHydrated(true);
    };
    const raf = requestAnimationFrame(sync);
    window.addEventListener(CMS_EVENT, sync);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener(CMS_EVENT, sync);
    };
  }, []);

  const loadAsset = (next: string) => {
    setSlug(next);
    const a = COMPONENTS.find((c) => c.slug === next) ?? first;
    const stored = drafts.find((d) => d.slug === next);
    setDraft(
      Object.fromEntries(cmsFieldsFor(a).map((f) => [f.name, stored?.fields[f.name] ?? f.value])),
    );
    setCopied(false);
  };

  const current: CmsDraft = { slug, fields: draft, updatedAt: new Date().toISOString() };
  const issues = validateDraft(asset, current);
  const patch = buildPatch(asset, current);
  const changed = patch.changes.length;

  const saveDraft = () => {
    const next = [current, ...drafts.filter((d) => d.slug !== slug)];
    writeJson(ADMIN_CMS_KEY, next);
    setDrafts(next);
    window.dispatchEvent(new Event(CMS_EVENT));
    record("edited", slug, `${changed} field${changed === 1 ? "" : "s"} staged in a local draft (not applied to the repository)`);
  };

  const exportPatch = () => {
    const text = JSON.stringify({ path: patch.path, anchor: patch.anchor, changes: patch.changes, instruction: patch.instruction }, null, 2);
    navigator.clipboard?.writeText(text).then(
      () => setCopied(true),
      () => setCopied(false),
    );
    record("exported", slug, `Patch exported: ${patch.note}`);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Local-first content editor</p>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-dim">
              Edit a catalog item here, see the catalog&apos;s own validation rules fire, and export a patch for the
              repository. The console has no write access to files: a content change should travel through the same review
              as a code change.
            </p>
          </div>
          <select value={slug} onChange={(e) => loadAsset(e.target.value)} className="input max-w-xs !py-2 text-xs" aria-label="Choose the asset to inspect">
            {COMPONENTS.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {fields.map((f) => (
            <label key={f.name} className="block">
              <span className="field-label">
                {f.label}
                <span className="ml-2 font-mono text-[9px] text-ink-faint">{f.name}</span>
              </span>
              {f.type === "select" ? (
                <select value={draft[f.name] ?? f.value} onChange={(e) => setDraft({ ...draft, [f.name]: e.target.value })} className="input !py-2 text-xs">
                  {(f.options ?? []).map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : f.type === "text" && f.name === "description" ? (
                <textarea
                  rows={3}
                  value={draft[f.name] ?? f.value}
                  onChange={(e) => setDraft({ ...draft, [f.name]: e.target.value })}
                  className="input text-xs"
                />
              ) : (
                <input
                  value={draft[f.name] ?? f.value}
                  onChange={(e) => setDraft({ ...draft, [f.name]: e.target.value })}
                  className={`input !py-2 text-xs ${f.type === "number" ? "font-mono" : ""}`}
                />
              )}
              <span className="mt-1 block text-[10px] leading-relaxed text-ink-faint">{f.hint}</span>
            </label>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button type="button" onClick={saveDraft} disabled={changed === 0 || issues.length > 0} className="btn btn-primary !px-4 !py-2 text-xs disabled:opacity-40">
            Stage draft
          </button>
          <button type="button" onClick={exportPatch} disabled={issues.length > 0} className="btn btn-ghost !px-4 !py-2 text-xs disabled:opacity-40">
            {copied ? "✓ Patch copied" : "Export patch"}
          </button>
          <button type="button" onClick={() => loadAsset(slug)} className="btn btn-ghost !px-4 !py-2 text-xs">
            Reset fields
          </button>
          <span className="text-[11px] text-ink-faint">
            {changed === 0 ? "No changes yet." : `${changed} changed field${changed === 1 ? "" : "s"}.`}
          </span>
        </div>

        {issues.length > 0 && (
          <div className="mt-4 rounded-2xl border border-amber-300/25 bg-amber-300/[.05] px-4 py-3">
            <p className="text-[11px] font-bold text-amber-300">
              {issues.length} validation {issues.length === 1 ? "issue" : "issues"} — the catalog would reject this edit
            </p>
            <ul className="mt-1.5 space-y-1">
              {issues.map((i) => (
                <li key={i.field} className="text-[10px] leading-relaxed text-amber-200/80">
                  <span className="font-mono">{i.field}</span> — {i.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {patch.changes.length > 0 && issues.length === 0 && (
          <div className="mt-4 rounded-2xl border border-white/8 bg-[#07090f] p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Patch preview</p>
            <p className="mt-1.5 font-mono text-[10px] text-ink-dim">
              {patch.path} · anchor <span className="text-amber-200">{patch.anchor}</span>
            </p>
            <div className="mt-2 space-y-1">
              {patch.changes.map((c) => (
                <p key={c.field} className="font-mono text-[10px] leading-relaxed">
                  <span className="text-ink-faint">{c.field}</span>{" "}
                  <span className="text-danger">− {c.from.slice(0, 70)}</span>{" "}
                  <span className="text-mint">+ {c.to.slice(0, 70)}</span>
                </p>
              ))}
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">{patch.instruction}</p>
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Staged drafts on this device</p>
          <span className="chip !text-[10px]">{drafts.length} stored</span>
        </div>
        {!hydrated ? (
          <p className="mt-3 text-xs text-ink-faint">Reading drafts…</p>
        ) : drafts.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-dashed border-white/12 px-4 py-5 text-center text-[11px] text-ink-faint">
            No drafts. Staged edits live in this browser only and never reach the repository.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {drafts.map((d) => {
              const target = COMPONENTS.find((c) => c.slug === d.slug);
              if (!target) return null;
              const p = buildPatch(target, d);
              return (
                <div key={d.slug} className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-bold text-ink">{target.title}</span>
                    <span className="mt-0.5 block font-mono text-[10px] text-ink-faint">
                      {d.slug} · staged {d.updatedAt.slice(0, 19).replace("T", " ")} · {p.changes.length} change{p.changes.length === 1 ? "" : "s"}
                    </span>
                  </span>
                  <button type="button" onClick={() => loadAsset(d.slug)} className="btn btn-ghost !px-3 !py-1.5 text-[10px]">
                    Reopen
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ===================================================================
   #367 — scheduled publishing
   =================================================================== */

export function Scheduler() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [slug, setSlug] = useState(COMPONENTS[0].slug);
  const [date, setDate] = useState(() => earliestScheduleDate());
  const [note, setNote] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const { record } = useAuditTrail();

  useEffect(() => {
    const sync = () => {
      const stored = readJson<ScheduleItem[]>(ADMIN_SCHEDULE_KEY, []);
      setItems(Array.isArray(stored) ? stored : []);
      setHydrated(true);
    };
    const raf = requestAnimationFrame(sync);
    window.addEventListener(SCHEDULE_EVENT, sync);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener(SCHEDULE_EVENT, sync);
    };
  }, []);

  const error = scheduleError(date);
  const board = scheduleBoard(items);
  const next = board[0];

  const schedule = () => {
    if (error) return;
    const asset = COMPONENTS.find((c) => c.slug === slug);
    if (!asset) return;
    const entry: ScheduleItem = {
      id: `${slug}-${date}`,
      slug,
      kind: asset.kind,
      title: asset.title,
      publishOn: date,
      note: note.trim() || "no note — a scheduled change without a reason is a surprise for whoever reads the changelog",
      createdAt: new Date().toISOString(),
    };
    const list = [entry, ...items.filter((i) => i.id !== entry.id)];
    writeJson(ADMIN_SCHEDULE_KEY, list);
    setItems(list);
    window.dispatchEvent(new Event(SCHEDULE_EVENT));
    record("rescheduled", slug, `Queued ${asset.title} for ${date}${note.trim() ? ` — ${note.trim()}` : ""}`);
    setNote("");
  };

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Scheduled publishing</p>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-dim">
              Queue a change for a future date. This console holds the schedule in this browser and validates the date —
              it does not publish, because the build has no scheduler to publish with. The panel below says what would
              need to exist first.
            </p>
          </div>
          <span className="chip !text-[10px]">nothing publishes from here</span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-[1.2fr_0.6fr_1.2fr_auto] md:items-end">
          <label className="block">
            <span className="field-label">Content</span>
            <select value={slug} onChange={(e) => setSlug(e.target.value)} className="input !py-2 text-xs">
              {COMPONENTS.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="field-label">Publish on</span>
            <input type="date" value={date} min={earliestScheduleDate()} onChange={(e) => setDate(e.target.value)} className="input !py-2 font-mono text-xs" />
          </label>
          <label className="block">
            <span className="field-label">Note</span>
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="why this date — e.g. lands with the pricing guide" className="input !py-2 text-xs" />
          </label>
          <button type="button" onClick={schedule} disabled={!!error} className="btn btn-primary !px-4 !py-2 text-xs disabled:opacity-40">
            Queue it
          </button>
        </div>
        {error && <p className="mt-2 text-[11px] font-semibold text-amber-300">{error}</p>}
        <p className="mt-2 text-[10px] text-ink-faint">
          Earliest accepted date is tomorrow ({earliestScheduleDate()}) — a date in the past is not a schedule, it is a
          typo.
        </p>
      </div>

      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Queued on this device</p>
          <span className="chip !text-[10px]">
            {items.length} item{items.length === 1 ? "" : "s"}
            {next ? ` · next in ${next.days} day${next.days === 1 ? "" : "s"}` : ""}
          </span>
        </div>
        {!hydrated ? (
          <p className="mt-3 text-xs text-ink-faint">Reading the schedule…</p>
        ) : board.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-dashed border-white/12 px-4 py-5 text-center text-[11px] text-ink-faint">
            Nothing scheduled. Queue something above and it appears here with a countdown.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {board.map((i) => (
              <div key={i.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-ink">{i.title}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-ink-faint">
                    {i.slug} · {i.kind} · queued {i.createdAt.slice(0, 10)}
                  </p>
                  <p className="mt-1 text-[10px] leading-relaxed text-ink-dim">{i.note}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-extrabold text-cyan-200">{i.publishOn}</p>
                  <p className="text-[10px] text-ink-faint">in {i.days} day{i.days === 1 ? "" : "s"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const list = items.filter((x) => x.id !== i.id);
                    writeJson(ADMIN_SCHEDULE_KEY, list);
                    setItems(list);
                    window.dispatchEvent(new Event(SCHEDULE_EVENT));
                  }}
                  className="rounded-lg border border-white/10 px-2.5 py-1 text-[10px] font-semibold text-ink-dim transition-colors hover:border-danger/40 hover:text-danger"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-amber-300/25 bg-amber-300/[.04] p-6">
        <p className="text-sm font-extrabold text-amber-300">What scheduling would need to be real</p>
        <ol className="prose-list mt-3">
          <li>A build hook that runs on a timer and reads the schedule from a database rather than a browser.</li>
          <li>A status machine per item: queued → building → published → failed, with the failure visible to whoever set the date.</li>
          <li>Timezone and cut-off rules stated up front, because “tomorrow” means different things to a reviewer in two cities.</li>
          <li>An undo that works after publication, not just before — the point of scheduling is that someone is asleep when it fires.</li>
        </ol>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
          Until those exist, this tool is honest about being a checklist: it records intent, validates the date and puts
          the decision in the audit trail.
        </p>
      </div>
    </div>
  );
}

/* ===================================================================
   #370 — search inside the console
   =================================================================== */

const KIND_TONE: Record<SearchKind, string> = {
  component: "!border-violet-300/30 !text-violet-200",
  prompt: "!border-cyan-300/30 !text-cyan-200",
  guide: "!border-mint/30 !text-mint",
  background: "!border-amber-300/30 !text-amber-200",
  lab: "!border-white/20 !text-ink-dim",
  changelog: "!border-white/20 !text-ink-dim",
  submission: "!border-danger/25 !text-danger",
};

export function AdminSearch() {
  const docs = useMemo(() => searchIndex(), []);
  const [q, setQ] = useState("");
  const [kinds, setKinds] = useState<SearchKind[]>([]);
  const results = useMemo(() => {
    const found = searchDocs(q, docs, 60);
    return kinds.length === 0 ? found : found.filter((r) => kinds.includes(r.kind));
  }, [q, kinds, docs]);

  const counts = useMemo(() => {
    const out: Partial<Record<SearchKind, number>> = {};
    for (const d of docs) out[d.kind] = (out[d.kind] ?? 0) + 1;
    return out;
  }, [docs]);

  const suggestions = ["a11y", "drag", "pricing", "preloader", "prompt", "safety fail"];

  return (
    <div className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Search the console</p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-dim">
            One index over every content type the console is responsible for — {docs.length} records: catalog items,
            prompts, guides, backgrounds, lab tools, changelog entries and the moderation queue.
          </p>
        </div>
        <span className="chip !text-[10px]">{results.length} match{results.length === 1 ? "" : "es"}</span>
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Search records by title, slug, tag, behaviour, industry or gate result"
        placeholder="Search titles, slugs, tags, behaviours, industries, gate results…"
        className="input mt-4 !py-2.5 text-sm"
      />

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {Object.entries(counts).map(([k, n]) => {
          const kind = k as SearchKind;
          const on = kinds.includes(kind);
          return (
            <button
              key={kind}
              type="button"
              onClick={() => setKinds((prev) => (prev.includes(kind) ? prev.filter((x) => x !== kind) : [...prev, kind]))}
              className={`chip !cursor-pointer !text-[10px] ${on ? "!border-violet-300/50 !text-ink" : ""}`}
            >
              {kind} {n}
            </button>
          );
        })}
        {kinds.length > 0 && (
          <button type="button" onClick={() => setKinds([])} className="text-[10px] font-semibold text-violet-300 hover:text-violet-200">
            clear filters
          </button>
        )}
      </div>

      {q.trim() === "" ? (
        <div className="mt-5">
          <p className="text-[11px] text-ink-faint">Try one of these:</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button key={s} type="button" onClick={() => setQ(s)} className="chip !cursor-pointer !text-[10px] transition-colors hover:!text-ink">
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : results.length === 0 ? (
        <p className="mt-5 rounded-2xl border border-dashed border-white/12 px-4 py-6 text-center text-[11px] leading-relaxed text-ink-faint">
          Nothing matches “{q}”. The index covers content and the sample queue — a search for a page that does not exist
          yet is the clearest signal the{" "}
          <Link href="/community/requests" className="font-semibold text-violet-300 hover:text-violet-200">
            requests board
          </Link>{" "}
          is for.
        </p>
      ) : (
        <div className="mt-5 space-y-2">
          {results.map((r: SearchDoc) => (
            <Link
              key={`${r.kind}:${r.slug}`}
              href={r.href}
              className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3 transition-colors hover:border-white/15"
            >
              <span className={`chip !text-[10px] ${KIND_TONE[r.kind]}`}>{r.kind}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-bold text-ink">{r.title}</span>
                <span className="mt-0.5 block font-mono text-[10px] text-ink-faint">
                  {r.slug} · {r.meta}
                </span>
              </span>
              <span className="text-[10px] text-ink-faint">open ↗</span>
            </Link>
          ))}
        </div>
      )}

      <p className="mt-4 border-t border-white/6 pt-3 text-[10px] leading-relaxed text-ink-faint">
        Matching is a literal term search over titles, slugs, tags and descriptions — no stemming, no fuzzy matching, no
        ranking model. It is fast and predictable, and when it misses, it misses visibly.
      </p>
    </div>
  );
}

/** Total records the console index covers — used by the pipeline page so the
 *  two tools cannot disagree about how much content exists. */
export const INDEXED_RECORDS = searchIndex().length;

/** Re-exported for pages that need the queue without importing community. */
export { MODERATION_SEED };
export type { Submission };
