"use client";

import { useState } from "react";

interface Submission {
  id: string;
  title: string;
  author: string;
  kind: string;
  a11y: number;
  lint: "pass" | "warn" | "fail";
  safety: "pass" | "fail";
  stack: string;
}

const SEED: Submission[] = [
  { id: "SUB-1024", title: "Soft ripple text field", author: "lena.dev", kind: "element", a11y: 96, lint: "pass", safety: "pass", stack: "React" },
  { id: "SUB-1023", title: "Lava lamp blob hero", author: "noir.studio", kind: "section", a11y: 91, lint: "warn", safety: "pass", stack: "HTML/CSS" },
  { id: "SUB-1022", title: "Coin flip loader", author: "karina_ui", kind: "element", a11y: 88, lint: "warn", safety: "pass", stack: "React" },
  { id: "SUB-1021", title: "Scroll-linked hue nav", author: "tttyping", kind: "animated", a11y: 82, lint: "pass", safety: "pass", stack: "Vue" },
  { id: "SUB-1020", title: "Glass stat card trio", author: "pixelparlor", kind: "section", a11y: 97, lint: "fail", safety: "pass", stack: "HTML/CSS" },
  { id: "SUB-1019", title: "Aurora pricing toggle", author: "unknown_usr", kind: "animated", a11y: 90, lint: "pass", safety: "fail", stack: "React" },
  { id: "SUB-1018", title: "Checkout stepper", author: "monoflow", kind: "section", a11y: 99, lint: "pass", safety: "pass", stack: "React" },
];

type Decision = "approved" | "rejected" | null;

export default function AdminModeration() {
  const [rows, setRows] = useState(SEED);
  const [decided, setDecided] = useState<Record<string, Decision>>({});

  const decide = (id: string, d: Exclude<Decision, null>) => {
    setDecided((prev) => ({ ...prev, [id]: d }));
    setTimeout(() => {
      setRows((prev) => prev.filter((r) => r.id !== id));
      setDecided((prev) => {
        const rest = { ...prev };
        delete rest[id];
        return rest;
      });
    }, 1400);
  };

  const pending = rows.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Moderation queue</h1>
          <p className="mt-1 text-sm text-ink-dim">
            Community submissions run through the automated audit gate first; humans make the final call.
          </p>
        </div>
        <div className="flex gap-3">
          {[
            { l: "pending", v: pending },
            { l: "SLA target", v: "≤ 48h" },
            { l: "accept rate", v: "61%" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-white/8 bg-panel px-4 py-2.5 text-center">
              <div className="text-lg font-extrabold">{s.v}</div>
              <div className="text-[9px] uppercase tracking-widest text-ink-faint">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {pending === 0 && (
        <div className="rounded-3xl border border-dashed border-mint/25 bg-mint/5 py-16 text-center">
          <div className="text-3xl">🏁</div>
          <p className="mt-3 font-bold text-mint">Queue is clear — all caught up!</p>
          <p className="mt-1 text-sm text-ink-dim">New submissions will appear here after the auto-audit stage.</p>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        {rows.map((s) => (
          <div key={s.id} className="rounded-3xl border border-white/8 bg-panel p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-[11px] text-ink-faint">
                  <span className="font-mono">{s.id}</span>
                  <span>·</span>
                  <span>{s.author}</span>
                </div>
                <h2 className="mt-1 font-extrabold tracking-tight">{s.title}</h2>
              </div>
              <span className="chip capitalize">{s.kind} · {s.stack}</span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl border border-white/7 bg-black/20 px-2 py-2.5">
                <div className={`text-sm font-extrabold ${s.a11y >= 95 ? "text-mint" : s.a11y >= 85 ? "text-amber-300" : "text-danger"}`}>{s.a11y}</div>
                <div className="text-[9px] uppercase tracking-wider text-ink-faint">a11y audit</div>
              </div>
              <div className="rounded-xl border border-white/7 bg-black/20 px-2 py-2.5">
                <div className={`text-sm font-extrabold ${s.lint === "pass" ? "text-mint" : s.lint === "warn" ? "text-amber-300" : "text-danger"}`}>{s.lint}</div>
                <div className="text-[9px] uppercase tracking-wider text-ink-faint">lint</div>
              </div>
              <div className="rounded-xl border border-white/7 bg-black/20 px-2 py-2.5">
                <div className={`text-sm font-extrabold ${s.safety === "pass" ? "text-mint" : "text-danger"}`}>{s.safety}</div>
                <div className="text-[9px] uppercase tracking-wider text-ink-faint">sandbox safety</div>
              </div>
            </div>

            {s.lint === "fail" && (
              <p className="mt-3 rounded-xl border border-amber-300/15 bg-amber-400/5 px-3 py-2 text-[11px] text-amber-200/90">
                ⚠ Lint gate failed — reviewer should request a fix before approve.
              </p>
            )}
            {s.safety === "fail" && (
              <p className="mt-3 rounded-xl border border-danger/20 bg-danger/5 px-3 py-2 text-[11px] text-danger/90">
                ✕ Sandbox flagged suspicious network/storage usage — reject by default.
              </p>
            )}

            <div className="mt-4 flex items-center justify-end gap-2">
              {decided[s.id] && (
                <span className={`mr-auto text-xs font-bold ${decided[s.id] === "approved" ? "text-mint" : "text-danger"}`}>
                  {decided[s.id] === "approved" ? "✓ Approved — publishing…" : "✕ Rejected — notifying author…"}
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
        ))}
      </div>
    </div>
  );
}
