"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AssetCard } from "@/components/cards";
import { COMPONENTS, KIND_META } from "@/lib/data";
import type { Asset } from "@/lib/types";

const KINDS: ("all" | Asset["kind"])[] = ["all", "element", "animated", "section", "template"];
const STACKS = ["All", "React", "HTML/CSS", "Vue"];
const SORTS = [
  { id: "popular", label: "Most copied" },
  { id: "quality", label: "Highest quality" },
  { id: "a11y", label: "Best a11y" },
  { id: "new", label: "Newest" },
] as const;

function LibraryInner() {
  const params = useSearchParams();
  const [kind, setKind] = useState<(typeof KINDS)[number]>("all");
  const [stack, setStack] = useState("All");
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("popular");
  const [q, setQ] = useState(params.get("q") ?? "");
  const [query, setQuery] = useState(params.get("q") ?? "");

  const items = useMemo(() => {
    let list = [...COMPONENTS];
    if (kind !== "all") list = list.filter((c) => c.kind === kind);
    if (stack !== "All") list = list.filter((c) => c.stack.includes(stack as Asset["stack"][number]));
    const needle = query.trim().toLowerCase();
    if (needle) {
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(needle) ||
          c.description.toLowerCase().includes(needle) ||
          c.tags.some((t) => t.toLowerCase().includes(needle)) ||
          c.slug.includes(needle),
      );
    }
    const order = {
      popular: (a: Asset, b: Asset) => b.copies - a.copies,
      quality: (a: Asset, b: Asset) => b.qualityScore - a.qualityScore,
      a11y: (a: Asset, b: Asset) => b.a11yScore - a.a11yScore,
      new: (a: Asset, b: Asset) => (a.published < b.published ? 1 : -1),
    }[sort];
    return list.sort(order);
  }, [kind, stack, sort, query]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      {/* heading */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Component library</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Browse the library</h1>
          <p className="mt-3 max-w-2xl text-sm text-ink-dim">
            Original elements, animated components, sections and templates — audited for quality,
            accessibility and size. Every asset is themeable and ships in multiple stacks.
          </p>
        </div>
      </div>

      {/* filter bar */}
      <div className="sticky top-16 z-30 -mx-1 mt-8 rounded-2xl border border-white/8 bg-bg/85 px-3 py-3 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border border-white/8 bg-black/30 p-1">
            {KINDS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  kind === k ? "bg-white/10 text-ink shadow-sm" : "text-ink-dim hover:text-ink"
                }`}
              >
                {k === "all" ? "All" : KIND_META[k].label}
                <span className="ml-1 text-[10px] opacity-60">
                  {k === "all" ? COMPONENTS.length : COMPONENTS.filter((c) => c.kind === k).length}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            {STACKS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStack(s)}
                className={`chip !cursor-pointer transition-colors ${stack === s ? "!border-violet-300/40 !bg-violet-400/15 !text-violet-100" : ""}`}
              >
                {s}
              </button>
            ))}
          </div>
          <input
            className="input ml-auto !w-56"
            placeholder="Filter… (e.g. aurora)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setQuery(q)}
            aria-label="Filter components"
          />
          <select
            className="input !w-auto !cursor-pointer !py-2 text-xs"
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            aria-label="Sort components"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id} className="bg-panel">{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* results */}
      <p className="mt-6 text-xs text-ink-faint">
        {items.length} asset{items.length === 1 ? "" : "s"} · showing original Motif UI content only
      </p>
      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-white/12 py-20 text-center">
          <div className="text-3xl">🛰️</div>
          <p className="mt-3 font-semibold">Nothing matched “{query}”</p>
          <p className="mt-1 text-sm text-ink-dim">Try “aurora”, “button” or clear the filters.</p>
        </div>
      ) : (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
            <AssetCard key={a.slug} asset={a} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function LibraryPage() {
  return (
    <Suspense fallback={<div className="py-40 text-center text-sm text-ink-dim">Loading library…</div>}>
      <LibraryInner />
    </Suspense>
  );
}
