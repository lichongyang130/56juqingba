"use client";

// Admin client surfaces, part three — Section 13, batch 53.
// #377 escalation lane · #378 export reports · #379 theme control room
// #381 undo/redo · #382 duplicate detector · #383 empty state
//
// Nothing here talks to a server: arrivals are stamped in this browser, CSVs
// are assembled in the page, the theme override is applied to this tab and
// removed when you leave. Each panel says where its numbers come from.

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MODERATION_SEED, MODERATION_STORAGE_KEY } from "@/lib/community";
import {
  DECISION_EVENT,
  DECISION_HISTORY_CAP,
  DUPLICATE_LINE,
  QUEUE_ARRIVALS_KEY,
  SLA_HOURS,
  THEME_PRESETS,
  THEME_TOKENS,
  contrastChecks,
  duplicateReport,
  emptyDecisionPayload,
  emptyStateLine,
  escalationLane,
  formatWait,
  historyState,
  laneSummary,
  monthCsv,
  nearestPassing,
  normalizeDecisionPayload,
  publishMonthRows,
  reportCsv,
  reportRows,
  reportTotals,
  redoPayload,
  statsSummary,
  shippedWithin,
  stampArrivals,
  undoPayload,
  type Arrivals,
  type DecisionPayload,
  type ThemeValues,
} from "@/lib/admin-ops";

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

function readPayload(): DecisionPayload {
  return normalizeDecisionPayload(readJson<unknown>(MODERATION_STORAGE_KEY, null));
}

function commitDecisions(next: DecisionPayload) {
  writeJson(MODERATION_STORAGE_KEY, next);
  window.dispatchEvent(new Event(DECISION_EVENT));
  window.dispatchEvent(new StorageEvent("storage", { key: MODERATION_STORAGE_KEY }));
}

function useDecisionsWithHistory() {
  const [state, setState] = useState<DecisionPayload>(emptyDecisionPayload);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const sync = () => {
      setState(readPayload());
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
  return { ...state, hydrated };
}

/* ===================================================================
   #377 — escalation lane
   =================================================================== */

export function EscalationLane() {
  const { decisions, hydrated } = useDecisionsWithHistory();
  const [arrivals, setArrivals] = useState<Arrivals>({});
  const [now, setNow] = useState(0);

  // Stamp on first open, then keep one clock for every row so the timer is
  // the same everywhere on the page.
  useEffect(() => {
    const ids = MODERATION_SEED.map((s) => s.id);
    const tick = () => {
      const stamp = Date.now();
      const stored = readJson<Arrivals>(QUEUE_ARRIVALS_KEY, {});
      const merged = stampArrivals(stored, ids, stamp);
      if (merged !== stored) writeJson(QUEUE_ARRIVALS_KEY, merged);
      setArrivals(merged);
      setNow(stamp);
    };
    const raf = requestAnimationFrame(tick);
    const timer = window.setInterval(tick, 30000);
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(timer);
    };
  }, []);

  const rows = useMemo(() => escalationLane(arrivals, decisions, now || 0), [arrivals, decisions, now]);
  const summary = useMemo(() => laneSummary(rows), [rows]);
  const oldest = rows[0];

  const reset = () => {
    writeJson(QUEUE_ARRIVALS_KEY, {});
    setArrivals({});
    setNow(Date.now());
  };

  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Escalation lane</p>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-dim">
              Undecided rows, longest wait first, with a live timer. A row crosses the {SLA_HOURS}-hour line and gets
              flagged here — nothing sends a reminder, because there is no server to send it from.
            </p>
            <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">
              Waiting time is measured from the moment this browser first saw the row, which is the only arrival
              timestamp the console can honestly hold. Open the page again and the stamps stay put — they are never
              backdated, and a fresh browser shows every row at under a minute rather than inventing history.
            </p>
          </div>
          <button type="button" onClick={reset} className="btn btn-ghost !px-3 !py-1.5 text-xs">
            Clear stamps
          </button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { l: "open rows", v: String(summary.open), tone: "text-ink" },
            { l: `over ${SLA_HOURS}h`, v: String(summary.escalated), tone: summary.escalated ? "text-danger" : "text-mint" },
            { l: "oldest wait", v: oldest ? formatWait(summary.oldestMs) : "—", tone: "text-ink" },
            { l: "median wait", v: summary.open ? formatWait(summary.medianMs) : "—", tone: "text-ink" },
            { l: "timed rows", v: `${summary.timed}/${summary.open}`, tone: "text-ink" },
          ].map((c) => (
            <div key={c.l} className="rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3">
              <p className={`font-mono text-lg font-extrabold ${c.tone}`}>{c.v}</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-widest text-ink-faint">{c.l}</p>
            </div>
          ))}
        </div>
      </div>

      {!hydrated ? (
        <p className="rounded-3xl border border-dashed border-white/12 px-5 py-10 text-center text-[12px] text-ink-faint">
          Reading this browser&apos;s queue…
        </p>
      ) : rows.length === 0 ? (
        <AdminEmptyState openCount={0} />
      ) : (
        <div className="space-y-2">
          {rows.map((r) => (
            <div
              key={r.id}
              className={`flex flex-wrap items-center gap-3 rounded-2xl border px-5 py-4 ${
                r.escalated ? "border-danger/30 bg-danger/[.05]" : "border-white/8 bg-panel"
              }`}
            >
              <span className={`font-mono text-[11px] font-bold ${r.escalated ? "text-danger" : "text-ink-dim"}`}>{r.id}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold">{r.title}</p>
                <p className="text-[10px] text-ink-faint">
                  {r.kind} · @{r.author} · waiting {formatWait(r.waitingMs)}
                  {r.escalated ? ` — past the ${SLA_HOURS}h line` : ""}
                  {r.arrivedAt ? ` · stamped ${r.arrivedAt.slice(0, 16).replace("T", " ")}Z` : ""}
                </p>
              </div>
              <Link href="/admin/moderation" className="btn btn-ghost !px-3 !py-1.5 text-[11px]">
                Decide →
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ===================================================================
   #378 — export reports
   =================================================================== */

function download(name: string, text: string) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function ExportReports() {
  const rows = useMemo(() => reportRows(), []);
  const months = useMemo(() => publishMonthRows(), []);
  const totals = useMemo(() => reportTotals(rows), [rows]);
  const csv = useMemo(() => reportCsv(rows), [rows]);
  const mcsv = useMemo(() => monthCsv(months), [months]);
  const [copied, setCopied] = useState("");

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
    } catch {
      setCopied("Clipboard blocked by the browser — use the download button.");
    }
  };

  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Report builder</p>
        <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-ink-dim">
          Two CSVs, both assembled in this page from the catalog file — no request leaves the browser.{" "}
          <code className="font-mono text-[11px] text-ink">copies_this_month</code> is the single rolling number the
          catalog stores per asset, which is why the second report groups by <em>publish</em> month: there is no monthly
          history to trend.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => download("motif-assets.csv", csv)} className="btn btn-primary !px-4 !py-2 text-xs">
            Download asset CSV
          </button>
          <button type="button" onClick={() => download("motif-publish-months.csv", mcsv)} className="btn btn-ghost !px-4 !py-2 text-xs">
            Download month CSV
          </button>
          <button type="button" onClick={() => copy(csv, "Asset CSV copied.")} className="btn btn-ghost !px-4 !py-2 text-xs">
            Copy asset CSV
          </button>
          <span className="chip !text-[10px]">{csv.length.toLocaleString()} bytes · {rows.length} rows</span>
          {copied && <span className="chip !text-[10px] !text-mint">{copied}</span>}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { l: "assets", v: String(totals.items) },
            { l: "copies this month", v: totals.copies.toLocaleString() },
            { l: "views", v: totals.views.toLocaleString() },
            { l: "publish months", v: `${totals.months} (${totals.first} → ${totals.last})` },
          ].map((c) => (
            <div key={c.l} className="rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3">
              <p className="font-mono text-lg font-extrabold">{c.v}</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-widest text-ink-faint">{c.l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">First rows of the asset CSV</p>
          <span className="chip !text-[10px]">sorted by copies, highest first</span>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-[11px]">
            <thead className="text-[10px] uppercase tracking-widest text-ink-faint">
              <tr className="border-b border-white/8">
                <th className="py-2 pr-3 font-semibold">slug</th>
                <th className="py-2 pr-3 font-semibold">kind</th>
                <th className="py-2 pr-3 font-semibold">published</th>
                <th className="py-2 pr-3 font-semibold">KB</th>
                <th className="py-2 pr-3 font-semibold">a11y</th>
                <th className="py-2 pr-3 font-semibold">Q</th>
                <th className="py-2 pr-3 font-semibold">copies</th>
                <th className="py-2 font-semibold">views</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 8).map((r) => (
                <tr key={r.slug} className="border-b border-white/5">
                  <td className="py-2 pr-3 font-mono text-[10px] text-ink-dim">{r.slug}</td>
                  <td className="py-2 pr-3 text-ink-dim">{r.kind}</td>
                  <td className="py-2 pr-3 font-mono text-[10px] text-ink-faint">{r.published}</td>
                  <td className="py-2 pr-3 font-mono">{r.bundleKb}</td>
                  <td className="py-2 pr-3 font-mono">{r.a11y}</td>
                  <td className="py-2 pr-3 font-mono">{r.quality}</td>
                  <td className="py-2 pr-3 font-mono font-bold">{r.copies.toLocaleString()}</td>
                  <td className="py-2 font-mono text-ink-dim">{r.views.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
          {rows.length - 8} further rows are in the file. Both reports carry only fields the catalog stores — no
          estimated reach, no projected revenue, no month-over-month deltas.
        </p>
      </div>

      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Publish-month totals</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {months.map((m) => (
            <div key={m.month} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3">
              <div>
                <p className="font-mono text-[12px] font-bold">{m.month}</p>
                <p className="text-[10px] text-ink-faint">
                  {m.items} item{m.items === 1 ? "" : "s"} · mean quality {m.averageQuality}
                </p>
              </div>
              <p className="font-mono text-[11px] text-ink-dim">{m.copies.toLocaleString()}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
          Grouped by the month each item was published. Read it as a description of when the catalog grew, not as a
          growth curve: the copies column sums today&apos;s rolling number, so older months are not &ldquo;then&rdquo;.
        </p>
      </div>
    </section>
  );
}

/* ===================================================================
   #379 — theme control room
   =================================================================== */

export function ThemeControlRoom() {
  const [presetId, setPresetId] = useState(THEME_PRESETS[0].id);
  const [custom, setCustom] = useState<ThemeValues>(THEME_PRESETS[0].values);
  const preset = THEME_PRESETS.find((p) => p.id === presetId) ?? THEME_PRESETS[0];
  const checks = useMemo(() => contrastChecks(custom), [custom]);
  const failing = checks.filter((c) => !c.pass).length;

  // Paint the override for real, and take it back off when the room closes.
  useEffect(() => {
    const root = document.documentElement;
    for (const t of THEME_TOKENS) root.style.setProperty(t.cssVar, custom[t.key]);
    return () => {
      for (const t of THEME_TOKENS) root.style.removeProperty(t.cssVar);
    };
  }, [custom]);

  const applyPreset = (id: string) => {
    const next = THEME_PRESETS.find((p) => p.id === id);
    if (!next) return;
    setPresetId(id);
    setCustom(next.values);
  };

  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Theme control room</p>
        <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-ink-dim">
          These nine tokens are the site&apos;s own <code className="font-mono text-[11px] text-ink">@theme</code>{" "}
          variables, overwritten live on <code className="font-mono text-[11px] text-ink">:root</code>. Pick a preset and
          every surface in this tab repaints, including the sidebar you are reading. The override is removed when you
          leave the page: this is a demo of the palette, not a setting other visitors can see.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {THEME_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => applyPreset(p.id)}
              className={`rounded-xl border px-3 py-2 text-[11px] font-bold transition-colors ${
                p.id === presetId ? "border-violet-300/40 bg-violet-300/10 text-ink" : "border-white/10 text-ink-dim hover:text-ink"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <p className="mt-3 max-w-3xl text-[11px] leading-relaxed text-ink-dim">{preset.note}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Tokens</p>
          <div className="mt-3 space-y-2">
            {THEME_TOKENS.map((t) => (
              <label key={t.key} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[.02] px-3 py-2">
                <input
                  type="color"
                  value={custom[t.key]}
                  onChange={(e) => setCustom({ ...custom, [t.key]: e.target.value })}
                  className="h-8 w-10 shrink-0 cursor-pointer rounded border border-white/10 bg-transparent"
                  aria-label={`${t.label} colour`}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[12px] font-semibold">{t.label}</span>
                  <span className="block font-mono text-[10px] text-ink-faint">
                    {t.cssVar} · {custom[t.key]}
                  </span>
                </span>
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={() => applyPreset(THEME_PRESETS[0].id)}
            className="btn btn-ghost mt-3 !px-3 !py-1.5 text-xs"
          >
            Back to the shipped palette
          </button>
        </div>

        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Contrast, computed</p>
            <span className={`chip !text-[10px] ${failing ? "!text-amber-300" : "!text-mint"}`}>
              {failing ? `${failing} below the line` : "every pair clears its line"}
            </span>
          </div>
          <div className="mt-3 space-y-1.5">
            {checks.map((c) => {
              const fix = c.pass ? null : nearestPassing(c.foreground, c.background, c.line);
              return (
                <div key={c.label} className="rounded-2xl border border-white/8 bg-white/[.02] px-3 py-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-semibold">{c.label}</span>
                    <span className={`font-mono text-[11px] font-bold ${c.pass ? "text-mint" : "text-amber-300"}`}>
                      {c.ratio.toFixed(2)} : 1
                    </span>
                  </div>
                  <p className="mt-0.5 font-mono text-[9px] text-ink-faint">
                    {c.foreground} on {c.background} · WCAG AA line {c.line} for {c.line === 3 ? "large text and UI" : "body text"}
                  </p>
                  {fix && (
                    <p className="mt-1 text-[10px] text-amber-200">
                      Smallest step that clears it: <span className="font-mono">{fix.color}</span> at {fix.ratio.toFixed(2)}:1
                      {fix.color === c.foreground ? "" : " — apply it from the token list on the left"}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
            Ratios come from the WCAG 2.1 relative-luminance formula in{" "}
            <code className="font-mono">src/lib/admin-ops.ts</code>, recomputed on every keystroke. This is the check
            that caught the site&apos;s own faint-text token at 3.24:1 — it now ships at #747b87, 4.55:1.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ===================================================================
   #381 — undo / redo
   =================================================================== */

export function UndoRedoBar({ className = "" }: { className?: string }) {
  const { decisions, history, cursor, hydrated } = useDecisionsWithHistory();
  const state = historyState(history, cursor);

  const back = useCallback(() => {
    const next = undoPayload({ decisions, history, cursor, at: "" }, Date.now());
    if (next) commitDecisions(next);
  }, [decisions, history, cursor]);

  const forward = useCallback(() => {
    const next = redoPayload({ decisions, history, cursor, at: "" }, Date.now());
    if (next) commitDecisions(next);
  }, [decisions, history, cursor]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "z") return;
      e.preventDefault();
      if (e.shiftKey) forward();
      else back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [back, forward]);

  return (
    <div className={`flex flex-wrap items-center gap-2 rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3 ${className}`}>
      <span className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Decision history</span>
      <button type="button" onClick={back} disabled={!state.canUndo} className="btn btn-ghost !px-3 !py-1.5 text-xs disabled:opacity-40">
        ↶ Undo
      </button>
      <button type="button" onClick={forward} disabled={!state.canRedo} className="btn btn-ghost !px-3 !py-1.5 text-xs disabled:opacity-40">
        ↷ Redo
      </button>
      <span className="font-mono text-[10px] text-ink-faint">
        {hydrated ? `${state.position} of ${state.depth}` : "reading…"} · cap {DECISION_HISTORY_CAP} · ⌘Z / ⇧⌘Z
      </span>
      <span className="text-[10px] text-ink-dim">
        {state.canUndo ? `next undo: ${state.undoLabel}` : "nothing to undo yet"}
        {state.canRedo ? ` · next redo: ${state.redoLabel}` : ""}
      </span>
      <Link href="/admin/audit" className="ml-auto text-[10px] font-semibold text-violet-300 hover:text-violet-200">
        Audit trail →
      </Link>
    </div>
  );
}

/* ===================================================================
   #382 — duplicate detector
   =================================================================== */

export function DuplicateDetector() {
  const report = useMemo(() => duplicateReport(), []);
  const [open, setOpen] = useState<string>(report.rows.find((r) => r.matches.length)?.submission.id ?? "");

  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Duplicate detector</p>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-dim">
              Each queued title is split into words and compared against every catalog title and tag list. A row is
              flagged when at least {Math.round(DUPLICATE_LINE * 100)}% of its title words already appear on one
              published item — a flag to look twice, never an automatic rejection.
            </p>
          </div>
          <span className="chip !text-[10px]">
            {report.flagged} of {report.checked} flagged
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {report.rows.map(({ submission, matches }) => {
          const flagged = matches.length > 0;
          const expanded = open === submission.id;
          return (
            <div key={submission.id} className={`rounded-2xl border px-5 py-4 ${flagged ? "border-amber-300/25 bg-amber-300/[.04]" : "border-white/8 bg-panel"}`}>
              <button
                type="button"
                onClick={() => setOpen(expanded ? "" : submission.id)}
                className="flex w-full flex-wrap items-center gap-3 text-left"
              >
                <span className="font-mono text-[11px] font-bold text-ink-dim">{submission.id}</span>
                <span className="min-w-0 flex-1 truncate text-[13px] font-semibold">{submission.title}</span>
                <span className={`chip !text-[10px] ${flagged ? "!text-amber-300" : "!text-mint"}`}>
                  {flagged ? `${matches.length} match${matches.length === 1 ? "" : "es"}` : "no overlap"}
                </span>
                <span className="text-[10px] text-ink-faint">{expanded ? "hide" : "evidence"}</span>
              </button>
              {expanded && (
                <div className="mt-3 space-y-2 border-t border-white/8 pt-3">
                  {flagged ? (
                    matches.map((m) => (
                      <div key={m.slug} className="rounded-xl border border-white/8 bg-white/[.02] px-3 py-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[11px] font-semibold">
                            {m.title} <span className="text-ink-faint">· {m.kind}</span>
                          </span>
                          <span className="font-mono text-[10px] text-ink-dim">
                            {Math.round(m.coverage * 100)}% of the title
                          </span>
                        </div>
                        <p className="mt-1 text-[10px] leading-relaxed text-ink-dim">{m.why}</p>
                        <Link href={m.href} className="mt-1 inline-block text-[10px] font-semibold text-violet-300 hover:text-violet-200">
                          Compare on the public page →
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-ink-faint">
                      No published item shares enough of this title to be worth a second look. Titles under three
                      significant words are skipped rather than force-matched.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="rounded-3xl border border-white/8 bg-panel p-5 text-[10px] leading-relaxed text-ink-faint">
        The rule reads words, not meaning: two items about the same idea with different vocabulary will not be flagged,
        and a remake that deliberately keeps the original&apos;s name will be. That is why the panel prints the shared
        words instead of a similarity score — you can check the claim in two seconds.
      </p>
    </section>
  );
}

/* ===================================================================
   #384 — quick stats per content type
   =================================================================== */

export function QuickStats() {
  const stats = useMemo(() => statsSummary(), []);
  const peak = Math.max(...stats.kinds.map((k) => k.items), 1);

  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Content type inventory</p>
        <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-ink-dim">
          {stats.totalItems} dated records across six types, read from the catalog files at build time. Each card says
          what its window counts and what it cannot: backgrounds carry no per-item dates and lab tools are not dated
          records at all, so neither has a freshness figure rather than a made-up one.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {stats.types.map((t) => (
            <Link
              key={t.label}
              href={t.href}
              className="rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3 transition-colors hover:border-white/16"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[12px] font-bold">{t.label}</span>
                <span className="font-mono text-lg font-extrabold">{t.items}</span>
              </div>
              <p className="mt-0.5 text-[10px] leading-relaxed text-ink-faint">{t.note}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Published per month</p>
            <span className="chip !text-[10px]">peaks at {stats.busiestMonth.label} · {stats.busiestMonth.items} items</span>
          </div>
          <div className="mt-4 space-y-2">
            {stats.hist.map((h) => (
              <div key={h.label} className="flex items-center gap-3">
                <span className="w-16 shrink-0 font-mono text-[10px] text-ink-faint">{h.label}</span>
                <span className="h-3 min-w-0 flex-1 overflow-hidden rounded-full bg-white/5">
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-violet-400/70 to-cyan-300/70"
                    style={{ width: `${h.share}%` }}
                  />
                </span>
                <span className="w-24 shrink-0 text-right font-mono text-[10px] text-ink-dim">
                  {h.items} · {h.copies.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
            Bar length is the month&apos;s item count against the busiest month ({stats.busiestMonth.share}% ={" "}
            {stats.busiestMonth.items} items), so the chart and the numbers cannot disagree. The second figure is the sum
            of today&apos;s rolling copies number for that month&apos;s items.
          </p>
        </div>

        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">By component kind</p>
          <div className="mt-4 space-y-3">
            {stats.kinds.map((k) => (
              <div key={k.kind} className="rounded-2xl border border-white/8 bg-white/[.02] px-3 py-2.5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[12px] font-bold capitalize">{k.kind}</span>
                  <span className="font-mono text-[11px] text-ink-dim">{k.copies.toLocaleString()} copies</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-white/5">
                    <span className="block h-full rounded-full bg-violet-400/60" style={{ width: `${Math.round((k.items / peak) * 100)}%` }} />
                  </span>
                  <span className="font-mono text-[10px] text-ink-faint">{k.items}</span>
                </div>
                <p className="mt-1 font-mono text-[9px] text-ink-faint">
                  mean a11y {k.meanA11y} · mean Q {k.meanQuality} · mean {k.meanKb} KB
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
            Averages are over each kind&apos;s published components. Template budgets are six times an element&apos;s,
            which is why the KB average is worth reading per kind rather than across the library.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-dashed border-amber-300/25 bg-amber-300/[.04] p-6">
        <p className="text-sm font-extrabold text-amber-200">The chart this page does not draw</p>
        <p className="mt-1.5 max-w-3xl text-[11px] leading-relaxed text-amber-100/80">
          The original idea was a 30-day copy trend. The catalog stores one rolling <span className="font-mono">copies</span>{" "}
          number per asset and no daily history, so a trend line would be drawn from nothing. What is above is publish
          volume (dates exist) plus current totals (a single number each) — a description of the library, not a growth
          curve. A real trend needs the copy events logged server-side, which is a Section 16 integration, not a chart
          this build can fake. Current total: {stats.copiesTotal.toLocaleString()} copies across{" "}
          {stats.kinds.reduce((a, k) => a + k.items, 0)} components.
        </p>
      </div>
    </section>
  );
}

/* ===================================================================
   #383 — the empty state
   =================================================================== */

export function AdminEmptyState({ openCount }: { openCount?: number }) {
  const shipped = useMemo(() => shippedWithin(7, 6), []);
  const open = openCount ?? MODERATION_SEED.length;
  return (
    <div className="rounded-3xl border border-dashed border-white/12 bg-panel px-6 py-8">
      <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Queue empty</p>
      <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-ink-dim">{emptyStateLine(open, shipped.total)}</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {shipped.items.map((i) => (
          <Link
            key={`${i.kind}-${i.href}-${i.title}`}
            href={i.href}
            className="rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3 transition-colors hover:border-white/16"
          >
            <p className="truncate text-[12px] font-semibold">{i.title}</p>
            <p className="mt-0.5 text-[10px] text-ink-faint">
              {i.kind} · {i.date} · {i.age === 0 ? "newest date in the catalog" : `${i.age}d before it`}
            </p>
          </Link>
        ))}
      </div>
      <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
        {shipped.omitted > 0
          ? `${shipped.omitted} more of the ${shipped.total} records in that window are on the assets table. `
          : ""}
        The window ends at {shipped.anchor}, the newest date in the catalog, so this panel describes the data rather
        than the machine clock.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/admin/assets" className="btn btn-ghost !px-3 !py-1.5 text-xs">
          Asset table →
        </Link>
        <Link href="/admin/moderation" className="btn btn-ghost !px-3 !py-1.5 text-xs">
          Queue →
        </Link>
      </div>
    </div>
  );
}
