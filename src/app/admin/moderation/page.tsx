"use client";

import { useEffect, useState } from "react";
import { MODERATION_SEED, SUBMISSION_KEY, type Submission, type SubmissionKind } from "@/lib/community";

type Decision = "approved" | "rejected";

interface Persisted {
  decisions: Record<string, Decision>;
  at: string;
}

/** Submissions sent from the public remix form live in localStorage; the
 *  queue reads them so the submit flow genuinely reaches a reviewer. */
function loadLocalSubmissions(): Submission[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SUBMISSION_KEY);
    const list = raw ? (JSON.parse(raw) as Submission[]) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

const STORAGE_KEY = "motif-admin-moderation-v1";

function loadDecisions(): Persisted {
  if (typeof window === "undefined") return { decisions: {}, at: "" };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Persisted;
      if (p && p.decisions) return p;
    }
  } catch { /* corrupted — start fresh */ }
  return { decisions: {}, at: "" };
}

const METRICS: Record<SubmissionKind, [string, string, string]> = {
  element: ["a11y audit", "lint", "sandbox safety"],
  section: ["a11y audit", "lint", "sandbox safety"],
  animated: ["a11y audit", "lint", "sandbox safety"],
  prompt: ["fidelity", "style lint", "model run"],
};

export default function AdminModeration() {
  const [persisted] = useState<Persisted>(loadDecisions);
  const [local] = useState<Submission[]>(loadLocalSubmissions);
  const [rows, setRows] = useState(() => [...local, ...MODERATION_SEED].filter((r) => !persisted.decisions[r.id]));
  const [decided, setDecided] = useState<Record<string, Decision>>(persisted.decisions);

  // Persist every decision so a refresh keeps the queue honest.
  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ decisions: decided, at: new Date().toISOString() } satisfies Persisted),
      );
    } catch { /* storage full/blocked — demo still works in memory */ }
  }, [decided]);

  const decide = (id: string, d: Decision) => {
    setDecided((prev) => ({ ...prev, [id]: d }));
    setTimeout(() => {
      setRows((prev) => prev.filter((r) => r.id !== id));
    }, 900);
  };

  const resetDemo = () => {
    try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
    setRows([...local, ...MODERATION_SEED]);
    setDecided({});
  };

  const pending = rows.length;
  const decidedCount = Object.keys(decided).length;
  const approvals = Object.values(decided).filter((d) => d === "approved").length;
  const acceptRate = decidedCount ? Math.round((approvals / decidedCount) * 100) : 61;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Moderation queue</h1>
          <p className="mt-1 max-w-xl text-sm text-ink-dim">
            Component <em>and</em> prompt submissions run the automated audit gate first; humans make
            the final call. Decisions persist locally so the queue survives a refresh. {MODERATION_SEED.length} sample
            rows ship with the demo{local.length ? `, alongside ${local.length} sent from the public remix form on this device — those read pending because no gate has run on them yet` : ""}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {[
            { l: "pending", v: String(pending) },
            { l: "decided today", v: String(decidedCount) },
            { l: "accept rate", v: `${acceptRate}%` },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-white/8 bg-panel px-4 py-2.5 text-center">
              <div className="text-lg font-extrabold">{s.v}</div>
              <div className="text-[9px] uppercase tracking-widest text-ink-faint">{s.l}</div>
            </div>
          ))}
          <button type="button" onClick={resetDemo} className="btn btn-quiet !px-3 !py-2 text-xs" title="Restore the demo queue">
            ↺ Reset demo
          </button>
        </div>
      </div>

      {pending === 0 && (
        <div className="rounded-3xl border border-dashed border-mint/25 bg-mint/5 py-16 text-center">
          <div className="text-3xl">🏁</div>
          <p className="mt-3 font-bold text-mint">Queue is clear — all caught up!</p>
          <p className="mt-1 text-sm text-ink-dim">
            Decisions are saved locally. New submissions appear after the auto-audit stage.
          </p>
          <button type="button" onClick={resetDemo} className="btn btn-ghost mt-5 !py-2 text-xs">
            Restore the demo queue
          </button>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        {rows.map((s) => {
          const [mScore, mLint, mSafety] = METRICS[s.kind];
          const score = s.score;
          const awaiting = s.source === "community";
          return (
            <div key={s.id} className="rounded-3xl border border-white/8 bg-panel p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-ink-faint">
                    <span className="font-mono">{s.id}</span>
                    <span>·</span>
                    <span>{s.author}</span>
                    {awaiting && <span className="chip !text-[9px]">from your browser</span>}
                  </div>
                  <h2 className="mt-1 font-extrabold tracking-tight">{s.title}</h2>
                </div>
                <span className={`chip capitalize ${s.kind === "prompt" ? "!border-cyan-300/30 !text-cyan-200" : ""}`}>
                  {s.kind === "prompt" ? "◎ prompt" : s.kind} · {s.stack}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-white/7 bg-black/20 px-2 py-2.5">
                  <div className={`text-sm font-extrabold ${awaiting ? "text-ink-faint" : score >= 95 ? "text-mint" : score >= 85 ? "text-amber-300" : "text-danger"}`}>{awaiting ? "pending" : score}</div>
                  <div className="text-[9px] uppercase tracking-wider text-ink-faint">{mScore}</div>
                </div>
                <div className="rounded-xl border border-white/7 bg-black/20 px-2 py-2.5">
                  <div className={`text-sm font-extrabold ${awaiting ? "text-ink-faint" : s.lint === "pass" ? "text-mint" : s.lint === "warn" ? "text-amber-300" : "text-danger"}`}>{awaiting ? "pending" : s.lint}</div>
                  <div className="text-[9px] uppercase tracking-wider text-ink-faint">{mLint}</div>
                </div>
                <div className="rounded-xl border border-white/7 bg-black/20 px-2 py-2.5">
                  <div className={`text-sm font-extrabold ${awaiting ? "text-ink-faint" : s.safety === "pass" ? "text-mint" : "text-danger"}`}>{awaiting ? "pending" : s.safety}</div>
                  <div className="text-[9px] uppercase tracking-wider text-ink-faint">{mSafety}</div>
                </div>
              </div>

              {awaiting && (
                <p className="mt-3 rounded-xl border border-violet-300/20 bg-violet-400/5 px-3 py-2 text-[11px] text-violet-100/90">
                  ◌ Sent from the public remix form{s.basedOn ? ` as a remix of ${s.basedOn}` : ""} — the audit gates have
                  not run on it yet, so the three tiles above read pending on purpose. Approving records the decision in
                  this browser only; nothing is published.
                </p>
              )}
              {s.lint === "fail" && (
                <p className="mt-3 rounded-xl border border-amber-300/15 bg-amber-400/5 px-3 py-2 text-[11px] text-amber-200/90">
                  ⚠ {s.kind === "prompt" ? "Style lint" : "Lint"} gate failed — request a fix before approving.
                </p>
              )}
              {s.safety === "fail" && (
                <p className="mt-3 rounded-xl border border-danger/20 bg-danger/5 px-3 py-2 text-[11px] text-danger/90">
                  {s.kind === "prompt" ? "✕ Model run errored on two of three models — reject or re-run." : "✕ Sandbox flagged suspicious network/storage usage — reject by default."}
                </p>
              )}
              {s.safety === "warn" && s.kind === "prompt" && (
                <p className="mt-3 rounded-xl border border-cyan-300/15 bg-cyan-400/5 px-3 py-2 text-[11px] text-cyan-200/90">
                  ◌ One model needed a retry — verify the retry note before approving.
                </p>
              )}

              <div className="mt-4 flex items-center justify-end gap-2">
                {decided[s.id] && (
                  <span className={`mr-auto text-xs font-bold ${decided[s.id] === "approved" ? "text-mint" : "text-danger"}`}>
                    {decided[s.id] === "approved"
                      ? `✓ Approved — ${s.kind === "prompt" ? "publishing to prompt library" : "publishing to library"}…`
                      : "✕ Rejected — notifying author…"}
                  </span>
                )}
                <button
                  type="button"
                  disabled={!!decided[s.id]}
                  onClick={() => decide(s.id, "rejected")}
                  className="btn btn-ghost !px-4 !py-2 !text-xs hover:!border-danger/40 hover:!text-danger"
                >
                  Reject
                </button>
                <button
                  type="button"
                  disabled={!!decided[s.id] || s.safety === "fail"}
                  onClick={() => decide(s.id, "approved")}
                  className="btn btn-primary !px-4 !py-2 !text-xs"
                >
                  Approve
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
