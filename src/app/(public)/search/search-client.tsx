"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AssetCard, BackgroundCard, PromptCard } from "@/components/cards";
import { BACKGROUNDS, COMPONENTS, PROMPTS } from "@/lib/data";
import { LEARN_ARTICLES } from "@/lib/learn";
import type { Asset, BackgroundAsset, PromptTemplate } from "@/lib/types";

/* =========================================================================
   Search — discovery refinements batch:
   saved searches, scoped tabs, fuzzy typo tolerance, hit highlighting,
   per-asset aliases, result meta chips, keyboard-first results,
   URL-synced filters (q / type / sort / stack).
   ========================================================================= */

const SUGGESTIONS = ["hero", "button", "pricing", "glass", "gradient", "scroll", "loader", "portfolio"];

const SECTION_TONE: Record<string, string> = {
  components: "text-violet-300",
  prompts: "text-cyan-300",
  backgrounds: "text-pink-300",
  guides: "text-emerald-300",
};

export type Scope = "all" | "components" | "prompts" | "backgrounds" | "guides";
const SCOPES: { id: Scope; label: string; tone: string }[] = [
  { id: "all", label: "All", tone: "text-ink" },
  { id: "components", label: "Components", tone: SECTION_TONE.components },
  { id: "prompts", label: "AI prompts", tone: SECTION_TONE.prompts },
  { id: "backgrounds", label: "Backgrounds", tone: SECTION_TONE.backgrounds },
  { id: "guides", label: "Learn guides", tone: SECTION_TONE.guides },
];

const STORAGE_KEY = "motif:recent-searches";

/* ---------------- helpers ---------------- */

function readRecents(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const arr: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string").slice(0, 8) : [];
  } catch {
    return [];
  }
}

function writeRecents(list: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 8)));
  } catch {
    /* private mode */
  }
}

function remember(list: string[], q: string): string[] {
  const next = [q, ...list.filter((x) => x !== q)];
  writeRecents(next);
  return next.slice(0, 8);
}

/** Levenshtein distance — search terms are short, so the full DP is cheap. */
function editDist(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 3) return 4;
  const prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
    }
    prev.splice(0, prev.length, ...cur);
  }
  return prev[b.length];
}

function fuzzyThreshold(len: number): number {
  if (len <= 4) return 1;
  if (len <= 7) return 2;
  return 3;
}

/** Best corpus word near `needle`; returns {word, dist} or null. */
function bestFuzzy(needle: string, corpus: string): { word: string; dist: number } | null {
  const words = new Set(
    corpus
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length >= 3)
  );
  let best: { word: string; dist: number } | null = null;
  for (const w of words) {
    if (w === needle) continue;
    const d = editDist(needle, w);
    if (!best || d < best.dist) best = { word: w, dist: d };
  }
  const t = fuzzyThreshold(needle.length);
  return best && best.dist <= t ? best : null;
}

function escapeRx(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Split text around (case-insensitive) terms and mark them. */
function Highlight({ text, terms }: { text: string; terms: string[] }) {
  const active = terms.map((t) => t.trim()).filter((t) => t.length >= 2);
  if (!active.length || !text) return <>{text}</>;
  const rx = new RegExp(`(${active.map(escapeRx).join("|")})`, "gi");
  const parts = text.split(rx);
  return (
    <>
      {parts.map((part, i) => {
        const low = part.toLowerCase();
        const hit = active.some((t) => t.toLowerCase() === low);
        return hit ? (
          <mark key={i} className="rounded-[3px] bg-amber-300/25 px-0.5 text-amber-100">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
}

function fmtCount(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n);
}

function fresh30(date: string): boolean {
  const cut = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return new Date(date).getTime() >= cut;
}

/* ---------------- results model ---------------- */

type CompHit = { item: Asset; aliasOnly: boolean; fuzzyWord?: string };
type PromptHit = { item: PromptTemplate; fuzzyWord?: string };
type BgHit = { item: BackgroundAsset; fuzzyWord?: string };
type GuideHit = { item: (typeof LEARN_ARTICLES)[number]; fuzzyWord?: string };

interface SearchState {
  comps: CompHit[];
  prompts: PromptHit[];
  bgs: BgHit[];
  guides: GuideHit[];
  total: number;
  usedFuzzy: boolean;
  fuzzyWords: string[];
  aliasCount: number;
}

export default function SearchExplorer({
  initial,
}: {
  initial: { q: string; type: Scope; sort: string; stack: string };
}) {
  const [query, setQuery] = useState(initial.q);
  const [scope, setScope] = useState<Scope>(initial.type as Scope);
  const [sort, setSort] = useState(initial.sort);
  const [stack, setStack] = useState(initial.stack);
  const [active, setActive] = useState(0);
  const [recents, setRecents] = useState<string[]>([]);

  /* load saved searches just after hydration (avoids SSR mismatch) */
  useEffect(() => {
    const id = requestAnimationFrame(() => setRecents(readRecents()));
    return () => cancelAnimationFrame(id);
  }, []);

  const needle = query.trim().toLowerCase();

  const syncUrl = (next: { q?: string; type?: Scope; sort?: string; stack?: string }) => {
    const p = new URLSearchParams();
    const q = next.q ?? query;
    const ty = next.type ?? scope;
    const so = next.sort ?? sort;
    const st = next.stack ?? stack;
    if (q.trim()) p.set("q", q.trim());
    if (ty !== "all") p.set("type", ty);
    if (so !== "best") p.set("sort", so);
    if (st !== "All") p.set("stack", st);
    const qs = p.toString();
    try {
      window.history.replaceState(null, "", qs ? `/search?${qs}` : "/search");
    } catch {
      /* sandboxed */
    }
  };

  const setAll = (patch: { q?: string; type?: Scope; sort?: string; stack?: string }) => {
    if (patch.q !== undefined) setQuery(patch.q);
    if (patch.type !== undefined) setScope(patch.type);
    if (patch.sort !== undefined) setSort(patch.sort);
    if (patch.stack !== undefined) setStack(patch.stack);
    setActive(0);
    syncUrl(patch);
  };

  /* ---------------- searching ---------------- */

  const state = useMemo<SearchState | null>(() => {
    if (!needle) return null;

    const incl = (hay: string) => hay.toLowerCase().includes(needle);

    /* literal pass, aliases included per asset */
    const comps: CompHit[] = [];
    for (const c of COMPONENTS) {
      const direct = incl(c.title) || incl(c.description) || incl(c.slug) || incl(c.kind) || c.tags.some(incl);
      const alias = (c.aliases ?? []).some(incl);
      if (direct || alias) comps.push({ item: c, aliasOnly: !direct });
    }
    const prompts: PromptHit[] = PROMPTS.filter(
      (p) =>
        incl(p.title) ||
        incl(p.vibe) ||
        incl(p.industry) ||
        incl(p.slug) ||
        p.blocks.some(incl) ||
        p.stacks.some(incl)
    ).map((p) => ({ item: p }));
    const bgs: BgHit[] = BACKGROUNDS.filter(
      (b) => incl(b.title) || incl(b.category) || incl(b.slug) || b.tech.some(incl) || incl(b.description)
    ).map((b) => ({ item: b }));
    const guides: GuideHit[] = LEARN_ARTICLES.filter(
      (g) => incl(g.title) || incl(g.deck) || incl(g.kicker) || incl(g.slug) || g.tags.some(incl)
    ).map((g) => ({ item: g }));

    const literalTotal = comps.length + prompts.length + bgs.length + guides.length;

    let compsOut = comps;
    let promptsOut = prompts;
    let bgsOut = bgs;
    let guidesOut = guides;
    let usedFuzzy = false;
    const fuzzyWords = new Set<string>();
    const aliasCount = comps.filter((c) => c.aliasOnly).length;

    /* fuzzy typo pass — only when the literal pass found nothing */
    if (literalTotal === 0 && needle.length >= 4) {
      usedFuzzy = true;
      compsOut = [];
      for (const c of COMPONENTS) {
        const hit = bestFuzzy(needle, `${c.title} ${c.slug} ${c.tags.join(" ")} ${(c.aliases ?? []).join(" ")}`);
        if (hit) {
          fuzzyWords.add(hit.word);
          compsOut.push({ item: c, aliasOnly: false, fuzzyWord: hit.word });
        }
      }
      promptsOut = [];
      for (const p of PROMPTS) {
        const hit = bestFuzzy(needle, `${p.title} ${p.vibe} ${p.industry} ${p.slug} ${p.blocks.join(" ")}`);
        if (hit) {
          fuzzyWords.add(hit.word);
          promptsOut.push({ item: p, fuzzyWord: hit.word });
        }
      }
      bgsOut = [];
      for (const b of BACKGROUNDS) {
        const hit = bestFuzzy(needle, `${b.title} ${b.category} ${b.slug} ${b.tech.join(" ")}`);
        if (hit) {
          fuzzyWords.add(hit.word);
          bgsOut.push({ item: b, fuzzyWord: hit.word });
        }
      }
      guidesOut = [];
      for (const g of LEARN_ARTICLES) {
        const hit = bestFuzzy(needle, `${g.title} ${g.kicker} ${g.slug} ${g.tags.join(" ")}`);
        if (hit) {
          fuzzyWords.add(hit.word);
          guidesOut.push({ item: g, fuzzyWord: hit.word });
        }
      }
    }

    return {
      comps: compsOut,
      prompts: promptsOut,
      bgs: bgsOut,
      guides: guidesOut,
      total: compsOut.length + promptsOut.length + bgsOut.length + guidesOut.length,
      usedFuzzy,
      fuzzyWords: [...fuzzyWords],
      aliasCount,
    };
  }, [needle]);

  /* ---------------- sorting & filtering (components scope) ---------------- */

  const componentCandidates = useMemo(() => {
    if (!state) return [] as CompHit[];
    let list = [...state.comps];
    if (stack !== "All") list = list.filter((c) => c.item.stack.includes(stack as Asset["stack"][number]));
    if (sort === "newest") list.sort((a, b) => b.item.published.localeCompare(a.item.published));
    else if (sort === "lightest") list.sort((a, b) => a.item.bundleKb - b.item.bundleKb);
    else if (sort === "fresh30")
      list.sort((a, b) => {
        const fa = fresh30(a.item.published) ? 0 : 1;
        const fb = fresh30(b.item.published) ? 0 : 1;
        return fa - fb || (a.item.published < b.item.published ? 1 : -1);
      });
    else list.sort((a, b) => b.item.copies - a.item.copies);
    return list;
  }, [state, sort, stack]);

  const stackCounts = useMemo(() => {
    const counts = new Map<string, number>();
    (state?.comps ?? []).forEach((c) => c.item.stack.forEach((s) => counts.set(s, (counts.get(s) ?? 0) + 1)));
    return counts;
  }, [state]);

  const showComps = (scope === "all" || scope === "components") && componentCandidates.length > 0;
  const showPrompts = (scope === "all" || scope === "prompts") && (state?.prompts.length ?? 0) > 0;
  const showBgs = (scope === "all" || scope === "backgrounds") && (state?.bgs.length ?? 0) > 0;
  const showGuides = (scope === "all" || scope === "guides") && (state?.guides.length ?? 0) > 0;
  const navItems = useMemo(() => {
    const list: { href: string; label: string }[] = [];
    const cap = (n: number) => (scope === "all" ? Math.min(n, 6) : n);
    if (showComps) componentCandidates.slice(0, cap(componentCandidates.length)).forEach((c) => list.push({ href: `/components/${c.item.slug}`, label: c.item.title }));
    if (showPrompts) (state?.prompts ?? []).slice(0, scope === "all" ? 6 : undefined).forEach((p) => list.push({ href: `/prompts/${p.item.slug}`, label: p.item.title }));
    if (showGuides) (state?.guides ?? []).slice(0, scope === "all" ? 4 : undefined).forEach((g) => list.push({ href: `/learn/${g.item.slug}`, label: g.item.title }));
    return list;
  }, [state, componentCandidates, showComps, showPrompts, showGuides, scope]);

  const navIndex = navItems.length ? Math.min(active, navItems.length - 1) : 0;

  const rememberThis = (q: string) => setRecents((prev) => remember(prev, q.trim()));

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (navItems.length ? (a + 1) % navItems.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (navItems.length ? (a - 1 + navItems.length) % navItems.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (navItems[navIndex]) {
        rememberThis(needle);
        window.location.assign(navItems[navIndex].href);
      } else if (needle) {
        rememberThis(needle);
      }
    } else if (e.key === "Escape" && query) {
      e.preventDefault();
      setAll({ q: "" });
    }
  };

  const toneOf = (kind: string): string => {
    if (kind === "template" || kind === "section" || kind === "element" || kind === "animated") return SECTION_TONE.components;
    return SECTION_TONE.guides;
  };

  const termFor = (hit: { fuzzyWord?: string }): string[] => (hit.fuzzyWord ? [hit.fuzzyWord] : [needle]);

  /* ---------------- render ---------------- */

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Search</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Search the whole library</h1>
      <p className="mt-3 max-w-2xl text-sm text-ink-dim">
        One box for everything on Motif. Typo-tolerant, alias-aware, keyboard-first — and every filter lives in the
        URL, so a refined search is a shareable link.
      </p>

      {/* scope tabs — choose a type before you type */}
      <div id="scope-tabs" className="mt-7 flex flex-wrap gap-1.5" role="tablist" aria-label="Search scope">
        {SCOPES.map((s) => {
          const count =
            s.id === "all"
              ? state
                ? state.total
                : COMPONENTS.length + PROMPTS.length + BACKGROUNDS.length + LEARN_ARTICLES.length
              : s.id === "components"
                ? (state ? state.comps.length : COMPONENTS.length)
                : s.id === "prompts"
                  ? (state ? state.prompts.length : PROMPTS.length)
                  : s.id === "backgrounds"
                    ? (state ? state.bgs.length : BACKGROUNDS.length)
                    : (state ? state.guides.length : LEARN_ARTICLES.length);
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={scope === s.id}
              onClick={() => setAll({ type: s.id })}
              className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-colors ${
                scope === s.id
                  ? "border-violet-300/40 bg-violet-400/10 text-ink"
                  : "border-white/8 bg-white/[.02] text-ink-dim hover:border-white/20 hover:text-ink"
              }`}
            >
              <span className={s.tone}>{s.label}</span>
              <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[10px] text-ink-faint">{count}</span>
            </button>
          );
        })}
      </div>

      {/* saved searches */}
      <div id="saved-searches" className="mt-3 flex min-h-8 flex-wrap items-center gap-1.5">
        {recents.length > 0 && (
          <>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-faint">Recent</span>
            {recents.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  rememberThis(r);
                  setAll({ q: r });
                }}
                className="chip !cursor-pointer !py-1 !text-[11px] hover:!border-violet-300/40 hover:!text-ink"
              >
                {r}
                <span
                  role="button"
                  aria-label={`Forget ${r}`}
                  className="ml-1.5 text-ink-faint transition-colors hover:text-ink"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRecents((prev) => {
                      const next = prev.filter((x) => x !== r);
                      writeRecents(next);
                      return next;
                    });
                  }}
                >
                  ✕
                </span>
              </button>
            ))}
          </>
        )}
      </div>

      {/* search box */}
      <label className="relative mt-4 block max-w-3xl">
        <svg
          className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-faint"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            syncUrl({ q: e.target.value });
          }}
          onKeyDown={onInputKeyDown}
          placeholder="Try “glass pricing”, “terminal hero”, “glss” (typo-tolerant)…"
          className="input !rounded-2xl !py-4 !pl-13 !pr-14 !text-base shadow-[0_20px_60px_-30px_rgba(124,58,237,.5)]"
          aria-label="Search components, prompts, backgrounds and guides"
        />
        {query && (
          <button
            type="button"
            onClick={() => setAll({ q: "" })}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-2.5 py-1 text-[11px] font-bold text-ink-faint transition-colors hover:bg-white/5 hover:text-ink"
          >
            clear ✕
          </button>
        )}
      </label>

      {/* zero-query state */}
      {!state && (
        <div className="mt-10">
          {scope === "all" ? (
            <>
              <div className="text-xs font-bold uppercase tracking-widest text-ink-faint">Popular right now</div>
              <div className="mt-4 flex max-w-3xl flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setAll({ q: s })}
                    className="chip !cursor-pointer !px-3.5 !py-1.5 !text-xs transition-colors hover:!border-violet-300/40 hover:!text-ink"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {COMPONENTS.slice(0, 3).map((a) => (
                  <AssetCard key={a.slug} asset={a} />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/6 pb-3">
                <h2 className={`text-xs font-bold uppercase tracking-[0.24em] ${SECTION_TONE[scope]}`}>
                  Browse {SCOPES.find((s) => s.id === scope)?.label}
                </h2>
                <span className="text-[11px] text-ink-faint">started — results appear as you type</span>
              </div>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {scope === "components" &&
                  [...COMPONENTS].sort((a, b) => b.copies - a.copies).slice(0, 6).map((a) => <AssetCard key={a.slug} asset={a} />)}
                {scope === "prompts" && PROMPTS.slice(0, 6).map((p) => <PromptCard key={p.slug} prompt={p} />)}
                {scope === "backgrounds" && BACKGROUNDS.slice(0, 6).map((b) => <BackgroundCard key={b.slug} bg={b} />)}
                {scope === "guides" &&
                  LEARN_ARTICLES.slice(0, 6).map((g) => (
                    <Link key={g.slug} href={`/learn/${g.slug}`} className="card-hover group rounded-2xl border border-white/8 bg-panel p-5">
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-faint">{g.kicker} · {g.minutes} min</div>
                      <h3 className="mt-2 text-base font-extrabold tracking-tight group-hover:text-white">{g.title}</h3>
                      <p className="mt-1.5 line-clamp-2 text-xs text-ink-dim">{g.deck}</p>
                    </Link>
                  ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* fuzzy + alias notes */}
      {state && state.total > 0 && (
        <div className="mt-5 space-y-1.5">
          {state.usedFuzzy && (
            <p id="fuzzy-note" className="text-xs text-amber-200/80">
              ≈ No exact match — showing the closest by edit distance {state.fuzzyWords.length ? `(matched “${state.fuzzyWords.join("”, “")}”)` : ""}.{" "}
              <button type="button" className="font-bold underline decoration-dotted underline-offset-2 hover:text-amber-100" onClick={() => setQuery(state.fuzzyWords[0] ?? "")}>
                search the corrected term instead
              </button>
            </p>
          )}
          {state.aliasCount > 0 && !state.usedFuzzy && (
            <p id="alias-note" className="text-xs text-cyan-200/70">
              {state.aliasCount} result{state.aliasCount === 1 ? "" : "s"} came from stored asset aliases — search “dropdown” finds the sheet menu, combo box and friends.
            </p>
          )}
        </div>
      )}

      {state && state.total === 0 && (
        <div className="mt-8 rounded-3xl border border-dashed border-white/12 py-20 text-center">
          <div className="text-3xl">🛰️</div>
          <p className="mt-3 font-semibold">Nothing matched “{query}”</p>
          <p className="mt-1 text-sm text-ink-dim">Check the spelling, or try a vibe like “glass”, “gradient” or “pricing”.</p>
        </div>
      )}

      {state && state.total > 0 && (() => {
        const compSlice = componentCandidates.slice(0, scope === "all" ? 6 : componentCandidates.length);
        const promptSlice = (state?.prompts ?? []).slice(0, scope === "all" ? 6 : (state?.prompts.length ?? 0));
        const compLen = compSlice.length;
        const promptLen = promptSlice.length;
        return (
        <div className="mt-6 space-y-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-ink-faint">
              {state.total} result{state.total === 1 ? "" : "s"} for “{query}”{scope !== "all" ? ` · scoped to ${SCOPES.find((s) => s.id === scope)?.label}` : ""}
              {navItems.length ? " · ↑/↓ to move, Enter to open" : ""}
            </p>
            {showComps && (scope === "components" || scope === "all") && (
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Filters are in the URL</span>
                {(stackCounts.size > 0 ? [...stackCounts.entries()] : []).map(([s, n]) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setAll({ stack: stack === s ? "All" : s })}
                    className={`chip !cursor-pointer !py-1 ${stack === s ? "!border-violet-300/50 !text-ink" : "text-ink-faint hover:!text-ink"}`}
                  >
                    {s} · {n}
                  </button>
                ))}
                <select
                  value={sort}
                  onChange={(e) => setAll({ sort: e.target.value })}
                  aria-label="Sort components"
                  className="input !w-auto !cursor-pointer !py-1 !text-[11px]"
                >
                  <option value="best" className="bg-panel">Best (copies)</option>
                  <option value="newest" className="bg-panel">Newest</option>
                  <option value="lightest" className="bg-panel">Lightest (KB)</option>
                  <option value="fresh30" className="bg-panel">Fresh — new in 30d</option>
                </select>
              </div>
            )}
          </div>

          {/* components rows */}
          {showComps && (
            <section>
              <SectionHead
                tone="components"
                label="Components"
                note={`${componentCandidates.length} match${componentCandidates.length === 1 ? "" : "es"}${stack !== "All" ? ` · stack: ${stack}` : ""}`}
                href="/components"
                more={componentCandidates.length > 6 && scope === "all"}
              />
              <div className="mt-4 space-y-2">
                {compSlice.map((hit, i) => {
                  const a = hit.item;
                  const terms = termFor(hit);
                  const selected = navIndex === i;
                  return (
                    <Link
                      key={a.slug}
                      href={`/components/${a.slug}`}
                      onClick={() => rememberThis(needle)}
                      onMouseEnter={() => setActive(i)}
                      className={`flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border px-4 py-3 transition-colors sm:flex-nowrap ${
                        selected ? "border-violet-300/40 bg-violet-400/[.07]" : "border-white/6 bg-white/[.02] hover:border-white/15"
                      }`}
                    >
                      <span className={`w-5 text-right font-mono text-[10px] ${selected ? "text-violet-300" : "text-ink-faint"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          <h3 className={`truncate text-sm font-extrabold ${selected ? "text-white" : ""}`}>
                            <Highlight text={a.title} terms={terms} />
                          </h3>
                          {hit.aliasOnly && <span className="chip !border-cyan-300/30 !text-[9px] !text-cyan-200/80">via alias</span>}
                          {hit.fuzzyWord && <span className="chip !border-amber-300/30 !text-[9px] !text-amber-200/80">≈ did you mean {hit.fuzzyWord}</span>}
                        </div>
                        <p className="mt-1 line-clamp-1 text-xs text-ink-dim">
                          <Highlight text={a.description} terms={terms} />
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${toneOf(a.kind)}`}>{a.kind}</span>
                        {a.stack.map((s) => (
                          <span key={s} className="chip !text-[9px] !text-ink-faint">{s}</span>
                        ))}
                        <span className="chip !text-[9px] !text-ink-faint">~{a.bundleKb} KB</span>
                        <span className="chip !text-[9px] !text-ink-faint">{fmtCount(a.copies)} copies</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* prompt rows */}
          {showPrompts && (
            <section>
              <SectionHead
                tone="prompts"
                label="AI prompts"
                note={`${state?.prompts.length ?? 0} match${(state?.prompts.length ?? 0) === 1 ? "" : "es"}`}
                href="/prompts"
                more={(state?.prompts.length ?? 0) > 6 && scope === "all"}
              />
              <div className="mt-4 space-y-2">
                {promptSlice.map((hit, i) => {
                  const p = hit.item;
                  const offset = compLen;
                  const selected = navIndex === i + offset;
                  return (
                    <Link
                      key={p.slug}
                      href={`/prompts/${p.slug}`}
                      onClick={() => rememberThis(needle)}
                      onMouseEnter={() => setActive(i + offset)}
                      className={`flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border px-4 py-3 transition-colors sm:flex-nowrap ${
                        selected ? "border-cyan-300/40 bg-cyan-400/[.06]" : "border-white/6 bg-white/[.02] hover:border-white/15"
                      }`}
                    >
                      <span className={`w-5 text-right font-mono text-[10px] ${selected ? "text-cyan-300" : "text-ink-faint"}`}>
                        {String(i + offset + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          <h3 className="truncate text-sm font-extrabold"><Highlight text={p.title} terms={termFor(hit)} /></h3>
                          {hit.fuzzyWord && <span className="chip !border-amber-300/30 !text-[9px] !text-amber-200/80">≈ {hit.fuzzyWord}</span>}
                        </div>
                        <p className="mt-1 line-clamp-1 text-xs text-ink-dim"><Highlight text={p.vibe} terms={termFor(hit)} /></p>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">prompt</span>
                        <span className="chip !text-[9px] !text-ink-faint">{p.industry}</span>
                        {p.stacks.slice(0, 2).map((s) => (
                          <span key={s} className="chip !text-[9px] !text-ink-faint">{s}</span>
                        ))}
                        <span className="chip !text-[9px] !text-ink-faint">{p.avgFidelity}/100 · {p.runs.length} runs</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* background rows */}
          {showBgs && (
            <section>
              <SectionHead
                tone="backgrounds"
                label="Backgrounds"
                note={`${state?.bgs.length ?? 0} match${(state?.bgs.length ?? 0) === 1 ? "" : "es"}`}
                href="/backgrounds"
                more={(state?.bgs.length ?? 0) > 4 && scope === "all"}
              />
              <div className="mt-4 space-y-2">
                {(state?.bgs ?? []).slice(0, scope === "all" ? 4 : undefined).map((hit, i) => {
                  const b = hit.item;
                  const row = (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-white/6 bg-white/[.02] px-4 py-3 sm:flex-nowrap">
                      <span className="w-5 text-right font-mono text-[10px] text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          <h3 className="truncate text-sm font-extrabold"><Highlight text={b.title} terms={termFor(hit)} /></h3>
                          {hit.fuzzyWord && <span className="chip !border-amber-300/30 !text-[9px] !text-amber-200/80">≈ {hit.fuzzyWord}</span>}
                        </div>
                        <p className="mt-1 line-clamp-1 text-xs text-ink-dim"><Highlight text={b.description} terms={termFor(hit)} /></p>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-pink-300">{b.category}</span>
                        {b.tech.map((t) => (
                          <span key={t} className="chip !text-[9px] !text-ink-faint">{t}</span>
                        ))}
                        <span className="chip !text-[9px] !text-ink-faint">~{b.bundleKb} KB</span>
                      </div>
                    </div>
                  );
                  return <div key={b.slug}>{row}</div>;
                })}
              </div>
            </section>
          )}

          {/* guide rows */}
          {showGuides && (
            <section>
              <SectionHead
                tone="guides"
                label="Learn guides"
                note={`${state?.guides.length ?? 0} match${(state?.guides.length ?? 0) === 1 ? "" : "es"}`}
                href="/learn"
                more={(state?.guides.length ?? 0) > 4 && scope === "all"}
              />
              <div className="mt-4 space-y-2">
                {(state?.guides ?? []).slice(0, scope === "all" ? 4 : undefined).map((hit, i) => {
                  const g = hit.item;
                  const selected = navIndex === i + compLen + promptLen;
                  return (
                    <Link
                      key={g.slug}
                      href={`/learn/${g.slug}`}
                      onClick={() => rememberThis(needle)}
                      onMouseEnter={() => setActive(i + compLen + promptLen)}
                      className={`flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border px-4 py-3 transition-colors sm:flex-nowrap ${
                        selected ? "border-emerald-300/40 bg-emerald-400/[.06]" : "border-white/6 bg-white/[.02] hover:border-white/15"
                      }`}
                    >
                      <span className={`w-5 text-right font-mono text-[10px] ${selected ? "text-emerald-300" : "text-ink-faint"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">{g.kicker}</span>
                          <h3 className="truncate text-sm font-extrabold"><Highlight text={g.title} terms={termFor(hit)} /></h3>
                          {hit.fuzzyWord && <span className="chip !border-amber-300/30 !text-[9px] !text-amber-200/80">≈ {hit.fuzzyWord}</span>}
                        </div>
                        <p className="mt-1 line-clamp-1 text-xs text-ink-dim"><Highlight text={g.deck} terms={termFor(hit)} /></p>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="chip !text-[9px] !text-ink-faint">{g.minutes} min</span>
                        {g.tags.slice(0, 2).map((t) => (
                          <span key={t} className="chip !text-[9px] !text-ink-faint">{t}</span>
                        ))}
                        <span className="chip !text-[9px] !text-ink-faint">guide</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
        );
      })()}
    </div>
  );
}

function SectionHead({
  tone, label, note, href, more,
}: { tone: "components" | "prompts" | "backgrounds" | "guides"; label: string; note: string; href: string; more: boolean }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/6 pb-3">
      <div className="flex items-baseline gap-3">
        <h2 className={`text-xs font-bold uppercase tracking-[0.24em] ${SECTION_TONE[tone]}`}>{label}</h2>
        <span className="text-[11px] text-ink-faint">{note}</span>
      </div>
      {more && (
        <Link href={`${href}?q=`} className="text-xs font-semibold text-ink-dim transition-colors hover:text-ink">
          See all in {label.toLowerCase()} →
        </Link>
      )}
    </div>
  );
}

