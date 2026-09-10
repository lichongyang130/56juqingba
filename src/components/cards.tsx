"use client";

import Link from "next/link";
import { KeyframesStyle } from "@/components/keyframes";
import { LazyDemo } from "@/components/lazy-demo";
import { IntentLink } from "@/components/intent-link";
import {
  accentCss,
  accentHue,
  INDUSTRY_SAMPLE_FALLBACK,
  INDUSTRY_SAMPLES,
  KIND_META,
  fidelityColor,
  promptStatusMeta,
} from "@/lib/data";
import type { Asset, BackgroundAsset, LabTool, PromptTemplate } from "@/lib/types";

export { KeyframesStyle };

/* ---------------- shared atoms ---------------- */

export function Stage({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/8 bg-[#0a0c13] ${className}`}
      style={{ aspectRatio: "16 / 9" }}
    >
      {children}
    </div>
  );
}

/** Colour-fingerprint backdrop behind a live preview: a per-asset hue wash
 *  plus two drifting glow blobs so every tile reads differently at a glance. */
export function HueStage({
  seed,
  children,
  className = "",
  ambience = 0.16,
}: {
  seed: string;
  children: React.ReactNode;
  className?: string;
  ambience?: number;
}) {
  const hue = accentHue(seed);
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`} style={{ aspectRatio: "16 / 9" }}>
      {/* fingerprint wash */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 130% at 12% -8%, hsl(${hue} 60% 22% / ${ambience + 0.1}), transparent 55%),
             radial-gradient(90% 100% at 90% 108%, hsl(${(hue + 90) % 360} 70% 26% / ${ambience}), transparent 60%)`,
        }}
      />
      {/* drifting glow blobs */}
      <span
        className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full blur-2xl animate-drift"
        style={{ background: accentCss(seed, 85, 58, 0.3) }}
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -bottom-10 right-2 h-36 w-36 rounded-full blur-3xl animate-drift"
        style={{ background: accentCss(seed + "-2", 80, 55, 0.22), animationDelay: "-6s" }}
        aria-hidden
      />
      <div className="relative h-full w-full">{children}</div>
    </div>
  );
}

export function KindPill({ kind }: { kind: Asset["kind"] }) {
  return <span className="chip capitalize">{KIND_META[kind].label}</span>;
}

export function CopyCount({ n, className = "" }: { n: number; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs text-ink-faint ${className}`}
      title={`${n.toLocaleString()} copies this month`}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="9" y="9" width="11" height="11" rx="2.5" />
        <path d="M5 15V6a2 2 0 0 1 2-2h9" />
      </svg>
      {n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n}
    </span>
  );
}

/* ---------------- asset card ---------------- */

export function AssetCard({ asset }: { asset: Asset }) {
  return (
    // 107 of these render in the library grid, and each points at a route that is
    // rendered on demand, so the card opts out of viewport prefetch and fetches
    // on intent instead (#409).
    <IntentLink
      href={`/components/${asset.slug}`}
      className="card-hover group block overflow-hidden rounded-2xl border border-white/8 bg-panel"
    >
      <div className="relative">
        <HueStage seed={asset.slug}>
          <div className="absolute inset-0 flex items-center justify-center p-0">
            <LazyDemo demo={asset.demo} minHeight={160} />
          </div>
        </HueStage>
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <KindPill kind={asset.kind} />
          <span className="chip border-transparent bg-black/40 text-[10px] uppercase tracking-wider">
            {asset.stack.join(" · ")}
          </span>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-center opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black shadow-xl">
            Open & copy →
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-[15px] font-bold tracking-tight group-hover:text-white">{asset.title}</h3>
            <p className="mt-0.5 text-xs text-ink-faint">
              {asset.bundleKb} KB · a11y {asset.a11yScore} · Q {asset.qualityScore}
            </p>
          </div>
          <CopyCount n={asset.copies} />
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {asset.tags.slice(0, 3).map((t) => (
            <span key={t} className="chip !text-[10px]">{t}</span>
          ))}
        </div>
      </div>
    </IntentLink>
  );
}

/* ---------------- prompt concept poster ----------------
   A "concept render" for each AI prompt, built live from the same
   style engine as the rest of the library: the prompt's industry copy,
   its colour fingerprint and one of several ambient scenes. Unlike a
   stock AI screenshot, every colour and layout here is reproducible. */

const POSTER_SCENES = ["aurora-veil", "morph-blob", "star-motes", "grid", "glass"] as const;

function hashSeed(key: string) {
  let h = 7;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h;
}

/** Which Motif scene backs a prompt's concept poster — shared by the poster
 *  renderer and the detail page's cross-links into the library. */
export function posterSceneFor(slug: string): string {
  return POSTER_SCENES[hashSeed(slug) % POSTER_SCENES.length];
}

export const POSTER_SCENE_META: Record<string, { label: string; href: string; kind: string }> = {
  "aurora-veil": { label: "Aurora Veil", href: "/components/aurora-veil", kind: "component" },
  "morph-blob": { label: "Morph Blob", href: "/components/morph-blob", kind: "component" },
  "star-motes": { label: "Star Motes", href: "/components/star-motes", kind: "component" },
  "grid": { label: "Grid Drift", href: "/backgrounds", kind: "background" },
  "glass": { label: "Liquid Glass", href: "/backgrounds", kind: "background" },
};

function FakeBars({ seed, n = 6, hue }: { seed: string; n?: number; hue: number }) {
  return (
    <div className="flex items-end gap-1">
      {Array.from({ length: n }).map((_, i) => {
        const h = 22 + ((hashSeed(seed + i) % 70));
        return (
          <span
            key={i}
            className="flex-1 rounded-sm"
            style={{
              height: h,
              background: `linear-gradient(180deg, hsl(${(hue + i * 30) % 360} 80% 70% / .9), hsl(${(hue + i * 30) % 360} 70% 45% / .6))`,
            }}
          />
        );
      })}
    </div>
  );
}

export function PromptPoster({ prompt, hero = false }: { prompt: PromptTemplate; hero?: boolean }) {
  const hue = accentHue(prompt.slug);
  const h = hashSeed(prompt.slug);
  const scene = posterSceneFor(prompt.slug);
  const layout = h % 3;
  const sample = INDUSTRY_SAMPLES[prompt.industry] ?? INDUSTRY_SAMPLE_FALLBACK;
  const [l1, l2 = ""] = sample.title.split("\n");
  const titleLines = [l1, l2];
  const sub = sample.sub;
  const meta = promptStatusMeta(prompt.status);

  let sceneProps: Record<string, number> = {};
  if (scene === "aurora-veil") sceneProps = { hueA: hue, hueB: (hue + 80) % 360, speed: 18 };
  if (scene === "morph-blob") sceneProps = { hueA: hue, hueB: (hue + 70) % 360, speed: 9 };

  return (
    <div
      className="relative overflow-hidden"
      style={{ aspectRatio: hero ? "21 / 8" : "16 / 10" }}
    >
      {/* ambient scene, cropped-in so self-labels stay out of frame */}
      <div className="absolute -inset-[38%]" aria-hidden>
        <LazyDemo demo={scene} props={sceneProps} minHeight={0} label="Poster scene" />
      </div>
      {/* legibility scrims */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(120deg, rgba(5,6,10,0.72) 0%, rgba(5,6,10,0.32) 55%, rgba(5,6,10,0.6) 100%)` }} aria-hidden />
      <div className="absolute inset-0" style={{ background: `radial-gradient(120% 140% at 12% 0%, hsl(${hue} 60% 30% / 0.32), transparent 55%)` }} aria-hidden />

      {/* status + fidelity badges */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
        <span className={`chip border bg-black/45 ${meta.cls}`}>{meta.label}</span>
        <span className="chip border-transparent bg-black/45 text-[10px]">
          <span
            className="font-bold"
            style={{ color: prompt.avgFidelity >= 90 ? "#34d399" : prompt.avgFidelity >= 85 ? "#fcd34d" : "#f87171" }}
          >
            {prompt.avgFidelity} avg fidelity
          </span>
          · concept render
        </span>
      </div>

      {/* ------- fake page scaffold inside the scene ------- */}
      <div className={`absolute inset-0 ${hero ? "px-12" : "px-5"} py-4 ${hero ? "md:py-7" : ""}`}>
        {/* faux navbar */}
        <div className="flex items-center gap-3" style={{ opacity: hero ? 1 : 0.9 }}>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: `hsl(${hue} 90% 65%)`, boxShadow: `0 0 8px hsl(${hue} 90% 65% / .8)` }} />
            <span className="text-[10px] font-black tracking-[0.18em] text-white/80">MOTIF</span>
          </span>
          <span className="ml-3 hidden items-center gap-2 text-[8px] font-semibold uppercase tracking-wider text-white/45 sm:flex">
            {["Work", "Pricing", "Journal"].map((n) => (
              <span key={n} className="rounded-full px-2 py-0.5 hover:text-white/80">{n}</span>
            ))}
          </span>
          <span className="ml-auto rounded-md px-2.5 py-1 text-[9px] font-black text-black" style={{ background: `hsl(${hue} 90% 68%)` }}>
            {sample.cta}
          </span>
        </div>

        {/* ------- layout variants ------- */}
        {layout === 0 && (
          <div className="mt-3 flex h-[calc(100%-3.4rem)] flex-col items-center justify-center text-center md:mt-4">
            <span className="chip !text-[8px] uppercase tracking-[0.3em]" style={{ color: `hsl(${hue} 90% 70%)`, borderColor: `hsl(${hue} 90% 65% / .35)`, background: `hsl(${hue} 90% 60% / .1)` }}>
              {sample.kicker}
            </span>
            <h4 className="mt-1.5 text-xl font-black leading-[1.05] tracking-tight text-white drop-shadow md:text-3xl">
              {titleLines.map((l) => <span key={l} className="block">{l}</span>)}
            </h4>
            <p className="mt-1 max-w-xs text-[8px] leading-relaxed text-white/60 md:text-[10px]">{sub}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-lg px-3 py-1 text-[9px] font-black text-black" style={{ background: `hsl(${hue} 90% 68%)` }}>{sample.cta}</span>
              <span className="rounded-lg border border-white/25 px-3 py-1 text-[9px] font-bold text-white/85">See it live</span>
            </div>
          </div>
        )}

        {layout === 1 && (
          <div className="mt-3 flex h-[calc(100%-3rem)] items-center gap-4 md:mt-4 md:gap-8">
            <div className="min-w-0 flex-1">
              <span className="chip !text-[8px] uppercase tracking-[0.3em]" style={{ color: `hsl(${hue} 90% 70%)`, borderColor: `hsl(${hue} 90% 65% / .35)`, background: `hsl(${hue} 90% 60% / .1)` }}>
                {sample.kicker}
              </span>
              <h4 className="mt-1.5 text-lg font-black leading-[1.06] tracking-tight text-white drop-shadow md:text-2xl">
                {titleLines.map((l) => <span key={l} className="block">{l}</span>)}
              </h4>
              <p className="mt-1 line-clamp-2 max-w-[24ch] text-[8px] leading-relaxed text-white/60 md:text-[9px]">{sub}</p>
              <div className="mt-2 w-fit rounded-lg px-2.5 py-1 text-[9px] font-black text-black" style={{ background: `hsl(${hue} 90% 68%)` }}>
                {sample.cta} →
              </div>
            </div>
            {/* right column: fake content cards */}
            <div className="hidden w-[38%] shrink-0 gap-2 sm:flex sm:flex-col">
              {[0, 1, 2].map((c) => (
                <div key={c} className="rounded-xl border border-white/12 bg-white/6 p-2.5 backdrop-blur-md" style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,.18)" }}>
                  <div className="flex items-center justify-between">
                    <span className="h-1.5 w-12 rounded-full bg-white/25" />
                    <span className="h-1.5 w-6 rounded-full" style={{ background: `hsl(${(hue + c * 90) % 360} 90% 68% / .8)` }} />
                  </div>
                  <div className="mt-2"><FakeBars seed={prompt.slug + c} n={5} hue={(hue + c * 45) % 360} /></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {layout === 2 && (
          <div className="mt-2 flex h-[calc(100%-3rem)] flex-col justify-center md:mt-3">
            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0">
                <span className="chip !text-[8px] uppercase tracking-[0.3em]" style={{ color: `hsl(${hue} 90% 70%)`, borderColor: `hsl(${hue} 90% 65% / .35)`, background: `hsl(${hue} 90% 60% / .1)` }}>
                  {sample.kicker}
                </span>
                <h4 className="mt-1 text-xl font-black leading-[1.05] tracking-tight text-white drop-shadow md:text-3xl">
                  {titleLines.map((l) => <span key={l} className="block">{l}</span>)}
                </h4>
              </div>
              <span className="hidden shrink-0 rounded-lg px-3 py-1 text-[9px] font-black text-black sm:block" style={{ background: `hsl(${hue} 90% 68%)` }}>
                {sample.cta}
              </span>
            </div>
            <p className="mt-1.5 text-[8px] text-white/55 md:text-[9px]">{sub}</p>
            <div className="mt-3 grid max-w-md grid-cols-3 gap-2">
              {[0, 1, 2].map((c) => (
                <div key={c} className="rounded-lg border border-white/12 bg-white/6 p-2 backdrop-blur-md">
                  <div className="text-sm font-black text-white" style={{ textShadow: `0 0 14px hsl(${(hue + c * 90) % 360} 90% 65% / .6)` }}>
                    {[8400, 21, 97][c]}{c === 0 ? "k" : c === 1 ? "%" : "%"}
                  </div>
                  <div className="mt-0.5 text-[7px] uppercase tracking-wider text-white/50">metric {c + 1}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* bottom corner: blocks used */}
      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-1" style={{ maxWidth: "72%" }}>
          {prompt.blocks.slice(0, hero ? 6 : 4).map((b) => (
            <span key={b} className="rounded-md bg-black/45 px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-wider text-white/55 backdrop-blur-sm">
              {b}
            </span>
          ))}
        </div>
        <span className="shrink-0 text-[7px] font-semibold uppercase tracking-widest text-white/40">
          {prompt.stacks.join(" · ")}
        </span>
      </div>
    </div>
  );
}

/* ---------------- prompt card ---------------- */

export function PromptCard({ prompt }: { prompt: PromptTemplate }) {
  return (
    <IntentLink
      href={`/prompts/${prompt.slug}`}
      className="card-hover group flex h-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-panel"
    >
      <div className="relative border-b border-white/6">
        <PromptPoster prompt={prompt} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-center opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black shadow-xl">Open prompt →</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-[15px] font-bold leading-snug tracking-tight group-hover:text-white">{prompt.title}</h3>
            <p className="mt-1 line-clamp-1 text-xs text-ink-faint">{prompt.vibe}</p>
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3.5">
          <div className="flex gap-1 overflow-hidden">
            {prompt.stacks.map((s) => (
              <span key={s} className="chip !text-[9px]">{s}</span>
            ))}
          </div>
          <span className={`text-xs font-extrabold ${fidelityColor(prompt.avgFidelity)}`} title={`Average fidelity across ${prompt.runs.length} models`}>
            {prompt.avgFidelity}
            <span className="ml-0.5 text-[9px] font-semibold text-ink-faint">/100 · {prompt.runs.length} runs</span>
          </span>
        </div>
      </div>
    </IntentLink>
  );
}

/* ---------------- background card ---------------- */

export function BackgroundCard({ bg }: { bg: BackgroundAsset }) {
  return (
    <div className="card-hover group overflow-hidden rounded-2xl border border-white/8 bg-panel">
      <Stage>
        <LazyDemo demo={bg.demo} minHeight={168} label="Background demo" />
      </Stage>
      <div className="flex items-center justify-between p-3.5">
        <div>
          <div className="text-sm font-bold">{bg.title}</div>
          <div className="mt-0.5 text-[11px] text-ink-faint">{bg.tech.join(" / ")} · {bg.perf} tier</div>
        </div>
        <CopyCount n={bg.copies} />
      </div>
    </div>
  );
}

/* ---------------- lab tool card ---------------- */

export function ToolCard({ tool }: { tool: LabTool }) {
  return (
    <div
      className="card-hover group relative overflow-hidden rounded-2xl border border-white/8 bg-panel p-5"
      style={{ ["--accent" as string]: tool.accent }}
    >
      <span
        className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-25 blur-2xl transition-opacity group-hover:opacity-50"
        style={{ background: tool.accent }}
      />
      <div className="flex items-center justify-between">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-xl text-lg"
          style={{ background: `${tool.accent}1f`, color: tool.accent, border: `1px solid ${tool.accent}33` }}
        >
          {tool.slug === "easing" ? "∿" : tool.slug === "spring" ? "⌁" : tool.slug === "gradient" ? "◐" : tool.slug === "texture" ? "▦" : tool.slug === "themes" ? "◍" : tool.slug === "palette" ? "◉" : "✓"}
        </span>
        <div className="flex items-center gap-1.5">
          {!tool.free && <span className="chip !text-[9px] uppercase text-amber-300">Pro</span>}
          <span className="chip !text-[9px] uppercase">{tool.outputs.join("/")}</span>
        </div>
      </div>
      <h3 className="mt-4 text-[15px] font-bold tracking-tight">{tool.title}</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-ink-dim">{tool.description}</p>
      {/* Only claim a destination that exists: the interactive four run further
          up this page, Theme Studio has its own route, and the rest are ideas
          that have not been built — which the card now says out loud instead of
          printing "Open tool" over dead air. */}
      <div className="mt-4 text-xs font-semibold">
        {tool.interactive ? (
          <Link href="/lab" className="text-ink-faint transition-colors group-hover:text-ink">
            Try it above ↑
          </Link>
        ) : tool.slug === "themes" ? (
          <Link href="/studio" className="text-violet-200 transition-colors group-hover:text-ink">
            Open Theme Studio →
          </Link>
        ) : (
          <span className="chip !text-[9px] !border-amber-300/40 !text-amber-300">planned · not in this build</span>
        )}
      </div>
    </div>
  );
}
