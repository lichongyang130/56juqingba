"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AssetCard } from "@/components/cards";
import { accentHue, COMPONENTS, KIND_META } from "@/lib/data";
import type { Asset } from "@/lib/types";

const KINDS: ("all" | Asset["kind"])[] = ["all", "element", "animated", "section", "template"];
const STACKS = ["All", "React", "HTML/CSS", "Vue"] as const;
const SORTS = [
  { id: "popular", label: "Most copied" },
  { id: "quality", label: "Highest quality" },
  { id: "a11y", label: "Best a11y" },
  { id: "fresh30", label: "Fresh — new in 30d" },
  { id: "new", label: "Newest" },
] as const;

const HUES = [
  { label: "Violet", h: 262 },
  { label: "Cyan", h: 192 },
  { label: "Rose", h: 330 },
  { label: "Lime", h: 152 },
  { label: "Amber", h: 40 },
  { label: "Blue", h: 218 },
  { label: "Teal", h: 170 },
  { label: "Magenta", h: 300 },
] as const;

const HUE_BAND = 24;

function hueClose(a: number, b: number): boolean {
  const d = Math.abs(((a - b + 540) % 360) - 180);
  return d <= HUE_BAND;
}

function fresh30(date: string): boolean {
  const cut = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return new Date(date).getTime() >= cut;
}

/* Editorial collections for #269 — original curated sets, hand-picked slugs. */
const COLLECTIONS: { id: string; label: string; desc: string; test: (a: Asset) => boolean }[] = [
  { id: "landing-heroes", label: "Landing heroes", desc: "First screens that earn the fold.", test: (a) => ["hero-aurora", "hero-product-mock", "terminal-hero", "particle-trail-hero", "wipe-reveal", "scramble-text"].includes(a.slug) },
  { id: "dark-saas", label: "Dark SaaS", desc: "The classic dark product page kit.", test: (a) => ["saas-launch", "template-landing-saas", "glass-pricing", "bento-feature-grid", "command-palette", "halo-button", "counter-stats"].includes(a.slug) },
  { id: "under-5kb", label: "Under 5 KB", desc: "Featherweight, dependency-free picks.", test: (a) => a.deps.length === 0 && a.bundleKb < 5 },
  { id: "forms-inputs", label: "Forms & inputs", desc: "Every field type, done once.", test: (a) => ["combo-box", "tag-input", "slider-ticks", "checkbox-card", "quantity-stepper", "radio-pills", "auto-grow-textarea", "date-presets", "file-drop-zone", "toggle-label-stack", "password-strength", "star-rating"].includes(a.slug) },
  { id: "motion", label: "Motion set-pieces", desc: "The animated showstoppers.", test: (a) => a.kind === "animated" },
  { id: "page-sections", label: "Page sections", desc: "Build a whole page out of sections.", test: (a) => a.kind === "section" },
];

export default function LibraryExplorer({ initialQ, initialStack }: { initialQ: string; initialStack: string[] }) {
  const router = useRouter();
  const [kind, setKind] = useState<(typeof KINDS)[number]>("all");
  const [stack, setStack] = useState<string>("All");
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("popular");
  const [q, setQ] = useState(initialQ);
  const [query, setQuery] = useState(initialQ);
  const [hue, setHue] = useState<number | null>(null);
  const [depsOnly, setDepsOnly] = useState(false);
  const [view, setView] = useState<"cards" | "rows">("cards");
  const [collection, setCollection] = useState<string | null>(null);
  const [saveMode, setSaveMode] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const pinned = initialStack.filter((slug) => COMPONENTS.some((c) => c.slug === slug));

  const items = useMemo(() => {
    let list = [...COMPONENTS];
    if (pinned.length) list = list.filter((c) => pinned.includes(c.slug));
    const activeCollection = collection ? COLLECTIONS.find((c) => c.id === collection) ?? null : null;
    if (activeCollection) list = list.filter(activeCollection.test);
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
    if (hue !== null) list = list.filter((c) => hueClose(accentHue(c.slug), hue));
    if (depsOnly) list = list.filter((c) => c.deps.length === 0);
    const order: Record<(typeof SORTS)[number]["id"], (a: Asset, b: Asset) => number> = {
      popular: (a, b) => b.copies - a.copies,
      quality: (a, b) => b.qualityScore - a.qualityScore,
      a11y: (a, b) => b.a11yScore - a.a11yScore,
      new: (a, b) => (a.published < b.published ? 1 : -1),
      fresh30: (a, b) => {
        const fa = fresh30(a.published) ? 0 : 1;
        const fb = fresh30(b.published) ? 0 : 1;
        return fa - fb || (a.published < b.published ? 1 : -1);
      },
    };
    return list.sort(order[sort]);
  }, [kind, stack, sort, query, hue, depsOnly, collection, pinned]);

  /* live counts per chip, reflecting the filters that are NOT the chip itself */
  const counts = useMemo(() => {
    const stackCounts = new Map<string, number>();
    const kindCounts = new Map<"all" | Asset["kind"], number>();
    const hueCounts = new Map<number, number>();
    let zeroDeps = 0;
    for (const c of COMPONENTS) {
      kindCounts.set(c.kind, (kindCounts.get(c.kind) ?? 0) + 1);
      for (const s of c.stack) stackCounts.set(s, (stackCounts.get(s) ?? 0) + 1);
      if (c.deps.length === 0) zeroDeps++;
      for (const chip of HUES) if (hueClose(accentHue(c.slug), chip.h)) hueCounts.set(chip.h, (hueCounts.get(chip.h) ?? 0) + 1);
    }
    kindCounts.set("all", COMPONENTS.length);
    return { stackCounts, kindCounts, hueCounts, zeroDeps };
  }, []);

  const toggleFav = (slug: string) => {
    setSaved((prev) => (prev.includes(slug) ? prev.filter((x) => x !== slug) : [...prev, slug]));
  };
  const copyStackLink = async () => {
    const url = `${window.location.origin}/components?stack=${saved.join(",")}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked in sandbox */
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  const randomPick = () => {
    const pool = items.length ? items : COMPONENTS;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick) router.push(`/components/${pick.slug}`);
  };

  const clearAll = () => {
    setKind("all");
    setStack("All");
    setSort("popular");
    setQuery("");
    setQ("");
    setHue(null);
    setDepsOnly(false);
    setCollection(null);
    setSaveMode(false);
  };

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
        <div className="flex items-center gap-2">
          <button type="button" onClick={randomPick} className="btn btn-ghost !px-3.5 !py-2 text-xs" title="Surprise me — open a random asset">
            <span aria-hidden>🎲</span> Surprise me
          </button>
          <button
            type="button"
            onClick={() => setView(view === "cards" ? "rows" : "cards")}
            className={`chip !cursor-pointer !py-2 !text-xs ${view === "rows" ? "!border-violet-300/50 !text-ink" : ""}`}
            title="Toggle view density"
            aria-label="Toggle between rich cards and compact rows"
          >
            {view === "cards" ? "☰ Compact rows" : "▦ Rich cards"}
          </button>
        </div>
      </div>

      {/* filter bar */}
      <div className="sticky top-[104px] z-30 -mx-1 mt-8 rounded-2xl border border-white/8 bg-bg/85 px-3 py-3 shadow-[0_18px_50px_-24px_rgba(0,0,0,.9)] backdrop-blur-xl md:top-16">
        <div className="flex flex-wrap items-center gap-2">
          <div className="no-scrollbar flex max-w-full items-center gap-0.5 overflow-x-auto rounded-xl border border-white/8 bg-black/30 p-1" role="tablist" aria-label="Filter by kind">
            {KINDS.map((k) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={kind === k}
                onClick={() => setKind(k)}
                className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  kind === k
                    ? "bg-gradient-to-b from-white/14 to-white/6 text-ink shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_4px_10px_-4px_rgba(0,0,0,.6)]"
                    : "text-ink-dim hover:text-ink"
                }`}
              >
                {k === "all" ? "All" : KIND_META[k].label}
                <span className={`ml-1.5 ${kind === k ? "text-violet-300" : "opacity-50"}`}>
                  {counts.kindCounts.get(k) ?? 0}
                </span>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {STACKS.filter((s) => s === "All" || (counts.stackCounts.get(s) ?? 0) > 0).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStack(stack === s ? "All" : s)}
                className={`chip !cursor-pointer transition-colors ${stack === s ? "!border-violet-300/40 !bg-violet-400/15 !text-violet-100" : ""}`}
              >
                {s === "All" ? "All stacks" : s}
                {s !== "All" && (
                  <span className="ml-1.5 opacity-60">{counts.stackCounts.get(s)}</span>
                )}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setDepsOnly(!depsOnly)}
              aria-pressed={depsOnly}
              className={`chip !cursor-pointer transition-colors ${depsOnly ? "!border-emerald-300/50 !bg-emerald-400/10 !text-emerald-100" : ""}`}
              title="Only assets with zero runtime dependencies"
            >
              ⚡ zero-dep
              <span className="ml-1.5 opacity-60">{counts.zeroDeps}</span>
            </button>
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
        {/* colour-first filter */}
        <div className="mt-2.5 flex flex-wrap items-center gap-2 border-t border-white/5 pt-2.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-faint">Colour</span>
          <button
            type="button"
            onClick={() => setHue(null)}
            aria-pressed={hue === null}
            className={`chip !cursor-pointer !py-1 !text-[10px] ${hue === null ? "!border-white/40 !text-ink" : "opacity-60 hover:opacity-100"}`}
          >
            any hue
          </button>
          {HUES.map((chip) => {
            const active = hue === chip.h;
            const n = counts.hueCounts.get(chip.h) ?? 0;
            return (
              <button
                key={chip.h}
                type="button"
                onClick={() => setHue(active ? null : chip.h)}
                aria-pressed={active}
                title={`${chip.label} accents · ${n} assets`}
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-all ${
                  active ? "border-white/60 bg-white/10 text-ink" : "border-white/10 text-ink-dim hover:border-white/25"
                }`}
              >
                <span className="h-3 w-3 rounded-full border border-white/20" style={{ background: `hsl(${chip.h} 82% 60%)` }} />
                {chip.label}
                <span className="opacity-55">{n}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* collections — editorial lists */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-faint">Collections</span>
        {COLLECTIONS.map((c) => {
          const active = collection === c.id;
          const n = COMPONENTS.filter(c.test).length;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCollection(active ? null : c.id)}
              aria-pressed={active}
              title={c.desc}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all ${
                active ? "border-emerald-300/50 bg-emerald-400/10 text-emerald-100" : "border-white/10 bg-white/[.02] text-ink-dim hover:border-white/25 hover:text-ink"
              }`}
            >
              {c.label}
              <span className="opacity-55">{n}</span>
            </button>
          );
        })}
        {collection && (
          <button type="button" onClick={() => setCollection(null)} className="text-[10px] font-bold uppercase tracking-wider text-ink-faint hover:text-ink">
            clear ✕
          </button>
        )}
      </div>
      {(() => {
        const col = collection ? COLLECTIONS.find((c) => c.id === collection) ?? null : null;
        return col ? <p className="mt-2 text-[11px] text-ink-faint">{col.desc}</p> : null;
      })()}

      {/* results header */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-faint">
        <p>
          {items.length} asset{items.length === 1 ? "" : "s"}
          {kind !== "all" ? ` · ${KIND_META[kind as Exclude<typeof kind, "all">].label.toLowerCase()}` : ""}
          {stack !== "All" ? ` · ${stack}` : ""}
          {hue !== null ? ` · ${HUES.find((c) => c.h === hue)?.label.toLowerCase() ?? hue} hue` : ""}
          {depsOnly ? " · zero-dependency" : ""}
          {view === "rows" ? " · compact view" : ""}
          {sort === "fresh30" ? " · sorted: new in 30d" : ""}
          {collection ? ` · collection: ${COLLECTIONS.find((c) => c.id === collection)?.label.toLowerCase()}` : ""}
        </p>
        {(query || kind !== "all" || stack !== "All" || hue !== null || depsOnly || sort !== "popular" || collection) && (
          <button type="button" onClick={clearAll} className="font-semibold text-violet-300 hover:text-violet-200">
            clear all filters ✕
          </button>
        )}
      </div>

      {/* pinned recipe stack from a shared link */}
      {pinned.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-violet-300/25 bg-violet-400/[.07] px-4 py-3">
          <div>
            <p className="text-xs font-extrabold text-ink">Recipe stack from a shared link</p>
            <p className="mt-0.5 text-[11px] text-ink-dim">
              {pinned.length} asset{pinned.length === 1 ? "" : "s"} pinned · {items.length} match{pinned.length === 1 ? "es" : ""} the current filters.
              Open each asset to copy its code.
            </p>
          </div>
          <button type="button" onClick={() => router.push("/components")} className="btn btn-ghost !px-3 !py-1.5 text-xs">
            Remove pin
          </button>
        </div>
      )}

      {/* save a component set */}
      {pinned.length === 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/6 bg-white/[.02] px-4 py-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSaveMode(!saveMode)}
              aria-pressed={saveMode}
              className={`chip !cursor-pointer !py-1.5 ${saveMode ? "!border-violet-300/50 !bg-violet-400/15 !text-violet-100" : ""}`}
            >
              {saveMode ? "✓ selecting — click assets to add" : "+ Build a stack"}
            </button>
            {saveMode && saved.length === 0 && (
              <span className="text-[11px] text-ink-faint">Click any card below to add it — then share the whole set as a recipe link.</span>
            )}
            {saved.length > 0 && (
              <span className="text-[11px] font-semibold text-ink-dim">{saved.length} saved</span>
            )}
          </div>
          {saved.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={copyStackLink} className="btn btn-primary !px-3 !py-1.5 text-xs">
                {copied ? "link copied ✓" : "Copy recipe link"}
              </button>
              <button
                type="button"
                onClick={() => setSaved([])}
                className="rounded-lg px-2.5 py-1 text-[11px] font-semibold text-ink-faint transition-colors hover:text-ink"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}

      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-white/12 py-20 text-center">
          <div className="text-3xl">🛰️</div>
          <p className="mt-3 font-semibold">Nothing matched those filters</p>
          <p className="mt-1 text-sm text-ink-dim">Try another hue, drop the zero-dep filter or clear everything.</p>
          <button type="button" onClick={clearAll} className="btn btn-ghost mx-auto mt-5 !w-auto !px-4 !py-2 text-xs">
            Reset filters
          </button>
        </div>
      ) : view === "cards" ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => {
            const on = saved.includes(a.slug);
            return (
              <div
                key={a.slug}
                onClickCapture={(e) => {
                  if (saveMode && !pinned.length) {
                    e.preventDefault();
                    toggleFav(a.slug);
                  }
                }}
                className={`relative transition-all ${saveMode ? "cursor-pointer" : ""} ${on && saveMode ? "rounded-2xl ring-2 ring-violet-300/60" : ""}`}
              >
                <AssetCard asset={a} />
                {saveMode && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFav(a.slug);
                    }}
                    aria-pressed={on}
                    title={on ? "Remove from stack" : "Add to stack"}
                    className={`absolute bottom-12 right-3 z-20 flex h-7 w-7 items-center justify-center rounded-full border text-xs font-black shadow-lg backdrop-blur transition-all ${
                      on ? "border-violet-300 bg-violet-500 text-white" : "border-white/25 bg-black/50 text-white hover:border-white/60"
                    }`}
                  >
                    {on ? "✓" : "+"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 space-y-1.5">
          {items.map((a) => {
            const on = saved.includes(a.slug) && saveMode;
            return (
              <div
                key={a.slug}
                onClickCapture={(e) => {
                  if (saveMode && !pinned.length) {
                    e.preventDefault();
                    toggleFav(a.slug);
                  }
                }}
                className={saveMode ? "cursor-pointer" : ""}
              >
                <Link
                  href={`/components/${a.slug}`}
                  className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-xl border px-3.5 py-2.5 transition-colors sm:flex-nowrap ${
                    on ? "border-violet-300/50 bg-violet-400/[.08]" : "border-white/5 bg-white/[.02] hover:border-white/15 hover:bg-white/[.04]"
                  }`}
                >
                  {saveMode ? (
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-black ${
                        on ? "border-violet-300 bg-violet-500 text-white" : "border-white/25 text-ink-dim"
                      }`}
                    >
                      {on ? "✓" : "+"}
                    </span>
                  ) : (
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: `hsl(${accentHue(a.slug)} 82% 62%)` }} />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-[13px] font-bold">{a.title}</h3>
                      {fresh30(a.published) && (
                        <span className="shrink-0 rounded-full bg-emerald-400/10 px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-emerald-300">new · 30d</span>
                      )}
                    </div>
                    <p className="truncate text-[11px] text-ink-faint">{a.tags.slice(0, 5).join(" · ")}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-ink-faint">
                    <span className={`font-bold uppercase tracking-wider ${a.kind === "template" ? "text-violet-300" : ""}`}>{a.kind}</span>
                    {a.stack.slice(0, 2).map((st) => (
                      <span key={st} className="rounded-full border border-white/8 px-1.5 py-px">{st}</span>
                    ))}
                    <span className="rounded-full border border-white/8 px-1.5 py-px">~{a.bundleKb} KB</span>
                    {a.deps.length === 0 && <span className="rounded-full border border-emerald-300/20 px-1.5 py-px text-emerald-300/80">zero-dep</span>}
                    <span className="rounded-full border border-white/8 px-1.5 py-px">{a.copies.toLocaleString()} copies</span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
