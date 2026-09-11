"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { COMPONENTS, KIND_META } from "@/lib/data";
import type { Asset, AssetStatus } from "@/lib/types";

const STATUSES: AssetStatus[] = ["draft", "review", "live", "archived"];
const STORAGE_KEY = "motif-admin-assets-v1";

type Row = Asset & { status: AssetStatus };

export default function AdminAssets() {
  const [kind, setKind] = useState<"all" | Asset["kind"]>("all");
  const [status, setStatus] = useState<"all" | AssetStatus>("all");
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<Row[]>(() => COMPONENTS.map((c) => ({ ...c, status: c.status as AssetStatus })));
  const [hydrated, setHydrated] = useState(false);

  // quick-add form
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [newKind, setNewKind] = useState<Asset["kind"]>("element");
  const [notice, setNotice] = useState<string | null>(null);
  const noticeT = useRef<ReturnType<typeof setTimeout> | null>(null);

  // hydrate from localStorage once (deferred so first paint = seed, then swap)
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as Row[];
          if (Array.isArray(saved) && saved.length) setRows(saved);
        }
      } catch { /* corrupted storage — fall back to seed */ }
      setHydrated(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // persist on every change after hydration
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    } catch { /* storage full / private mode — ignore */ }
  }, [rows, hydrated]);

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

  const flash = (msg: string) => {
    setNotice(msg);
    if (noticeT.current) clearTimeout(noticeT.current);
    noticeT.current = setTimeout(() => setNotice(null), 2200);
  };

  const quickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    const slug = `${t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "asset"}-${Date.now().toString(36)}`;
    const base: Row = {
      slug, kind: newKind, title: t,
      description: "Fresh submission awaiting the studio audit — description drafted by the author.",
      tags: [newKind], behaviors: [], stack: ["React"], deps: [],
      bundleKb: 1, themeable: true, a11yScore: 0, qualityScore: 0,
      status: "draft", license: "MIT", version: "0.1.0", author: "community",
      published: "2026-09-09", demo: newKind === "animated" ? "morph-blob" : "prism-switch",
      props: [], copies: 0, views: 0,
    };
    setRows((prev) => [base, ...prev]);
    setTitle("");
    setShowForm(false);
    flash("✓ Draft created — move it through the pipeline by clicking its status.");
  };

  const reset = () => {
    setRows(COMPONENTS.map((c) => ({ ...c, status: c.status as AssetStatus })));
    flash("↺ Demo data restored (all local changes cleared).");
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
          <p className="mt-1 text-sm text-ink-dim">
            Every element, component, section &amp; template — full lifecycle. Changes persist in
            this browser so you can play with a full pipeline (a production DB replaces this layer).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="btn btn-quiet !py-2 text-xs" onClick={reset} title="Restore demo seed data">↺ Reset</button>
          <button type="button" className="btn btn-primary !py-2 text-xs" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "− Close form" : "+ New asset"}
          </button>
        </div>
      </div>

      {notice && (
        <div className="rounded-2xl border border-mint/25 bg-mint/8 px-4 py-3 text-sm font-semibold text-mint">
          {notice}
        </div>
      )}

      {showForm && (
        <form onSubmit={quickAdd} className="rounded-3xl border border-violet-300/20 bg-violet-400/5 p-5">
          <div className="flex flex-wrap items-end gap-3">
            <label className="min-w-52 flex-1">
              <span className="field-label">Asset title</span>
              <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Soft ripple text field" required />
            </label>
            <label className="w-40">
              <span className="field-label">Kind</span>
              <select className="input !cursor-pointer" value={newKind} onChange={(e) => setNewKind(e.target.value as Asset["kind"])}>
                {(Object.keys(KIND_META) as Asset["kind"][]).map((k) => (
                  <option key={k} value={k} className="bg-panel">{KIND_META[k].label}</option>
                ))}
              </select>
            </label>
            <button type="submit" className="btn btn-primary !py-2.5 text-xs">Create draft</button>
          </div>
          <p className="mt-3 text-[11px] text-ink-faint">
            Drafts start as <b>draft</b> with an empty audit — click a status chip to push them through
            review → live → archived.
          </p>
        </form>
      )}

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
