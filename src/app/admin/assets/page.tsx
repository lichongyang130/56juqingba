"use client";

import { useMemo, useState } from "react";
import { COMPONENTS, KIND_META } from "@/lib/data";
import type { Asset, AssetStatus } from "@/lib/types";

const STATUSES: AssetStatus[] = ["draft", "review", "live", "archived"];

export default function AdminAssets() {
  const [kind, setKind] = useState<"all" | Asset["kind"]>("all");
  const [status, setStatus] = useState<"all" | AssetStatus>("all");
  const [q, setQ] = useState("");
  const [rows, setRows] = useState(() =>
    COMPONENTS.map((c) => ({ ...c, status: c.status as AssetStatus })),
  );

  const items = useMemo(() => {
    let list = rows;
    if (kind !== "all") list = list.filter((c) => c.kind === kind);
    if (status !== "all") list = list.filter((c) => c.status === status);
    const n = q.trim().toLowerCase();
    if (n) list = list.filter((c) => c.title.toLowerCase().includes(n) || c.slug.includes(n));
    return [...list].sort((a, b) => b.copies - a.copies);
  }, [rows, kind, status, q]);

  const cycle = (slug: string) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.slug !== slug) return r;
        const i = STATUSES.indexOf(r.status);
        return { ...r, status: STATUSES[(i + 1) % STATUSES.length] };
      }),
    );
  };

  const pill = (s: AssetStatus) =>
    ({
      live: "border-mint/30 bg-mint/10 text-mint",
      review: "border-amber-300/30 bg-amber-300/10 text-amber-300",
      draft: "border-white/12 bg-white/5 text-ink-dim",
      archived: "border-white/6 bg-white/2 text-ink-faint",
    })[s];

  const counts = STATUSES.map((s) => ({ s, n: rows.filter((r) => r.status === s).length }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Assets</h1>
          <p className="mt-1 text-sm text-ink-dim">Every element, component, section & template — full lifecycle.</p>
        </div>
        <button type="button" className="btn btn-primary !py-2 text-xs">+ New asset</button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-xl border border-white/8 bg-black/30 p-1">
          {(["all", "element", "animated", "section", "template"] as const).map((k) => (
            <button
              key={k} type="button" onClick={() => setKind(k)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${kind === k ? "bg-white/10 text-ink" : "text-ink-dim hover:text-ink"}`}
            >
              {k === "all" ? "All" : KIND_META[k].label}
            </button>
          ))}
        </div>
        {counts.map(({ s, n }) => (
          <button
            key={s} type="button" onClick={() => setStatus(status === s ? "all" : s)}
            className={`chip !cursor-pointer capitalize ${status === s ? "!border-white/30 !bg-white/10 !text-ink" : ""}`}
          >
            {s} · {n}
          </button>
        ))}
        <input className="input ml-auto !w-56" placeholder="Search title / slug…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search assets" />
      </div>

      <div className="overflow-x-auto rounded-3xl border border-white/8 bg-panel">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-white/6 text-[10px] uppercase tracking-widest text-ink-faint">
            <tr>
              <th className="px-5 py-3.5">Asset</th>
              <th className="px-4 py-3.5">Kind</th>
              <th className="px-4 py-3.5">Scores</th>
              <th className="px-4 py-3.5">KB</th>
              <th className="px-4 py-3.5">Status (click cycles)</th>
              <th className="px-4 py-3.5 text-right">Copies</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/4">
            {items.map((a) => (
              <tr key={a.slug} className="transition-colors hover:bg-white/2">
                <td className="px-5 py-3">
                  <div className="font-semibold">{a.title}</div>
                  <div className="text-[11px] font-mono text-ink-faint">{a.slug} · v{a.version}</div>
                </td>
                <td className="px-4 py-3"><span className="chip capitalize">{KIND_META[a.kind].label}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5 text-[11px] font-bold">
                    <span className="text-cyan-300">a11y {a.a11yScore}</span>
                    <span className="text-ink-faint">/</span>
                    <span className="text-violet-300">Q {a.qualityScore}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-ink-dim">{a.bundleKb}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => cycle(a.slug)}
                    className={`chip !cursor-pointer !text-[10px] uppercase transition-all ${pill(a.status)}`}
                    title="Click to cycle status"
                  >
                    {a.status}
                  </button>
                </td>
                <td className="px-4 py-3 text-right font-mono text-xs text-ink-dim">{a.copies.toLocaleString()}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-ink-dim">No assets match the current filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
