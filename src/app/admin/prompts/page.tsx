"use client";

import { useState } from "react";
import { PROMPTS, fidelityColor } from "@/lib/data";

type RowStatus = "beta" | "verified" | "featured" | "archived";

const STATUSES: RowStatus[] = ["beta", "verified", "featured", "archived"];

export default function AdminPrompts() {
  const [rows, setRows] = useState(() => PROMPTS.map((p) => ({ ...p, status: p.status as RowStatus })));
  const [filter, setFilter] = useState<"all" | RowStatus>("all");
  const [testing, setTesting] = useState<string | null>(null);

  const items = rows.filter((p) => filter === "all" || p.status === filter);

  const cycle = (slug: string) =>
    setRows((prev) =>
      prev.map((r) => {
        if (r.slug !== slug) return r;
        const i = STATUSES.indexOf(r.status);
        return { ...r, status: STATUSES[(i + 1) % STATUSES.length] };
      }),
    );

  const reTest = (slug: string) => {
    setTesting(slug);
    setTimeout(() => setTesting(null), 2200);
  };

  const pill = (s: RowStatus) =>
    ({
      featured: "border-amber-300/40 bg-amber-300/10 text-amber-300",
      verified: "border-mint/30 bg-mint/10 text-mint",
      beta: "border-white/12 bg-white/5 text-ink-dim",
      archived: "border-white/6 bg-white/2 text-ink-faint",
    })[s];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">AI Prompts</h1>
          <p className="mt-1 text-sm text-ink-dim">
            Release pipeline with multi-model verification — this is the table competitors don&apos;t have.
          </p>
        </div>
        <button type="button" className="btn btn-primary !py-2 text-xs">+ Draft prompt</button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(["all", "featured", "verified", "beta", "archived"] as const).map((s) => (
          <button
            key={s} type="button" onClick={() => setFilter(s)}
            className={`chip !cursor-pointer capitalize transition-colors ${filter === s ? "!border-white/30 !bg-white/10 !text-ink" : ""}`}
          >
            {s} · {s === "all" ? rows.length : rows.filter((r) => r.status === s).length}
          </button>
        ))}
        <span className="ml-auto text-[11px] text-ink-faint">
          avg fidelity across library: {Math.round(rows.reduce((s, p) => s + p.avgFidelity, 0) / rows.length)}/100
        </span>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {items.map((p) => (
          <div key={p.slug} className="rounded-3xl border border-white/8 bg-panel p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="chip">{p.industry}</span>
                  <span className="text-[10px] font-mono text-ink-faint">{p.published}</span>
                </div>
                <h2 className="mt-2 truncate font-extrabold tracking-tight">{p.title}</h2>
              </div>
              <button
                type="button" onClick={() => cycle(p.slug)}
                className={`chip !cursor-pointer !text-[10px] uppercase transition-all ${pill(p.status)}`}
                title="Click to cycle status"
              >
                {p.status}
              </button>
            </div>

            {/* run chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              {p.runs.map((r) => (
                <div
                  key={r.model}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-[11px] ${
                    r.buildError ? "border-danger/25 bg-danger/5" : "border-white/7 bg-black/20"
                  }`}
                >
                  <span className="font-semibold text-ink-dim">{r.model.split(" ").slice(0, 2).join(" ")}</span>
                  <span className={`font-extrabold ${fidelityColor(r.fidelity)}`}>{r.fidelity}</span>
                  <span title={r.notes}>{r.buildError ? "✕" : "✓"}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-white/7 bg-black/20 px-4 py-3">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-ink-faint">Average fidelity</div>
                <div className={`text-lg font-extrabold ${fidelityColor(p.avgFidelity)}`}>{p.avgFidelity}/100</div>
              </div>
              <div className="text-right text-[11px] text-ink-dim">
                best: <b className="text-ink">{p.bestModel}</b>
                <div className="text-ink-faint">stacks: {p.stacks.join(", ")}</div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => reTest(p.slug)}
                disabled={testing === p.slug}
                className="btn btn-ghost !px-3.5 !py-2 !text-[11px]"
              >
                {testing === p.slug ? "↻ Re-testing on 3 models…" : "↻ Re-run model tests"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
