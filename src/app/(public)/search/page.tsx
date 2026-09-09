"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AssetCard, BackgroundCard, PromptCard } from "@/components/cards";
import { BACKGROUNDS, COMPONENTS, PROMPTS } from "@/lib/data";
import { LEARN_ARTICLES } from "@/lib/learn";

const SUGGESTIONS = ["hero", "button", "pricing", "glass", "gradient", "scroll", "loader", "portfolio"];

const SECTION_TONE: Record<string, string> = {
  components: "text-violet-300",
  prompts: "text-cyan-300",
  backgrounds: "text-pink-300",
  guides: "text-emerald-300",
};

interface Results {
  components: typeof COMPONENTS;
  prompts: typeof PROMPTS;
  backgrounds: typeof BACKGROUNDS;
  guides: typeof LEARN_ARTICLES;
  total: number;
}

function SearchInner() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const needle = query.trim().toLowerCase();

  const results = useMemo<Results | null>(() => {
    if (!needle) return null;
    const hit = (...vals: (string | undefined)[]) => vals.some((v) => (v ?? "").toLowerCase().includes(needle));
    const components = COMPONENTS.filter(
      (c) => hit(c.title, c.description, c.slug, c.kind) || c.tags.some((t) => hit(t)),
    )
      .sort((a, b) => (a.title.toLowerCase().includes(needle) === b.title.toLowerCase().includes(needle) ? b.copies - a.copies : a.title.toLowerCase().includes(needle) ? -1 : 1));
    const prompts = PROMPTS.filter(
      (p) => hit(p.title, p.vibe, p.industry, p.author) || p.blocks.some((b) => hit(b)),
    );
    const backgrounds = BACKGROUNDS.filter(
      (b) => hit(b.title, b.category, b.tech.join(" ")),
    );
    const guides = LEARN_ARTICLES.filter(
      (g) => hit(g.title, g.deck, g.kicker) || g.tags.some((t) => hit(t)),
    );
    return {
      components,
      prompts,
      backgrounds,
      guides,
      total: components.length + prompts.length + backgrounds.length + guides.length,
    };
  }, [needle]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      {/* heading + live query box */}
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Search</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Search the whole library</h1>
      <p className="mt-3 max-w-2xl text-sm text-ink-dim">
        One box for everything on Motif — components, run-tested prompts, living backgrounds and the
        Learn guides that explain the craft. Results update as you type.
      </p>

      <label className="relative mt-8 block max-w-3xl">
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
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try “glass pricing”, “terminal hero”, “scroll”…"
          className="input !rounded-2xl !py-4 !pl-13 !pr-14 !text-base shadow-[0_20px_60px_-30px_rgba(124,58,237,.5)]"
          aria-label="Search components, prompts, backgrounds and guides"
        />
        {needle && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-2.5 py-1 text-[11px] font-bold text-ink-faint transition-colors hover:bg-white/5 hover:text-ink"
          >
            clear ✕
          </button>
        )}
      </label>

      {!results && (
        <div className="mt-12">
          <div className="text-xs font-bold uppercase tracking-widest text-ink-faint">Popular right now</div>
          <div className="mt-4 flex max-w-3xl flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQuery(s)}
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
        </div>
      )}

      {results && results.total === 0 && (
        <div className="mt-12 rounded-3xl border border-dashed border-white/12 py-20 text-center">
          <div className="text-3xl">🛰️</div>
          <p className="mt-3 font-semibold">Nothing matched “{query}”</p>
          <p className="mt-1 text-sm text-ink-dim">Check the spelling, or try a vibe like “glass”, “gradient” or “pricing”.</p>
        </div>
      )}

      {results && results.total > 0 && (
        <div className="mt-10 space-y-12">
          <p className="text-xs text-ink-faint">
            {results.total} result{results.total === 1 ? "" : "s"} for “{query}” across the whole library
          </p>

          {results.components.length > 0 && (
            <section>
              <SectionHead tone="components" label="Components" note={`${results.components.length} match${results.components.length === 1 ? "" : "es"}`} href="/components" more={results.components.length > 6} />
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {results.components.slice(0, 6).map((a) => (
                  <AssetCard key={a.slug} asset={a} />
                ))}
              </div>
            </section>
          )}

          {results.prompts.length > 0 && (
            <section>
              <SectionHead tone="prompts" label="AI prompts" note={`${results.prompts.length} match${results.prompts.length === 1 ? "" : "es"}`} href="/prompts" more={results.prompts.length > 6} />
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {results.prompts.slice(0, 6).map((p) => (
                  <PromptCard key={p.slug} prompt={p} />
                ))}
              </div>
            </section>
          )}

          {results.backgrounds.length > 0 && (
            <section>
              <SectionHead tone="backgrounds" label="Backgrounds" note={`${results.backgrounds.length} match${results.backgrounds.length === 1 ? "" : "es"}`} href="/backgrounds" more={results.backgrounds.length > 4} />
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {results.backgrounds.slice(0, 4).map((b) => (
                  <BackgroundCard key={b.slug} bg={b} />
                ))}
              </div>
            </section>
          )}

          {results.guides.length > 0 && (
            <section>
              <SectionHead tone="guides" label="Learn guides" note={`${results.guides.length} match${results.guides.length === 1 ? "" : "es"}`} href="/learn" more={results.guides.length > 4} />
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {results.guides.slice(0, 4).map((g) => (
                  <Link
                    key={g.slug}
                    href={`/learn/${g.slug}`}
                    className="card-hover group rounded-2xl border border-white/8 bg-panel p-5"
                  >
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-ink-faint">
                      <span className={SECTION_TONE.guides}>{g.kicker}</span>
                      <span>·</span>
                      <span>{g.minutes} min read</span>
                    </div>
                    <h3 className="mt-2 text-lg font-extrabold tracking-tight group-hover:text-white">{g.title}</h3>
                    <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-ink-dim">{g.deck}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-40 text-center text-sm text-ink-dim">Loading search…</div>}>
      <SearchInner />
    </Suspense>
  );
}
