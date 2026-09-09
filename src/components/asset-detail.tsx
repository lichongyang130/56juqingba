"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DemoView } from "@/components/demos/Demo";
import { AssetCard, CopyCount, Stage } from "@/components/cards";
import { COMPONENTS, KIND_META } from "@/lib/data";
import type { Asset } from "@/lib/types";

/* Original code snippets shown in the detail page (hand-written for the MVP). */
const SNIPPETS: Record<string, { react: string; css: string }> = {
  "aurora-veil": {
    react: `// React + Tailwind
import { AuroraVeil } from "@motifui/aurora-veil";

export function Hero() {
  return (
    <section className="relative h-screen overflow-hidden">
      <AuroraVeil
        hueA={262}        // violet
        hueB={192}        // cyan
        speed={18}        // seconds per drift cycle
        grain
        className="absolute inset-0"
      />
      <h1 className="relative pt-32 text-center text-6xl font-black text-white">
        Ships that feel alive
      </h1>
    </section>
  );
}`,
    css: `/* dependency-free: single .aurora-veil element */
.aurora-veil {
  position: absolute; inset: 0;
  background:
    radial-gradient(46% 60% at 20% 15%, hsl(262 85% 62% / .55), transparent 70%),
    radial-gradient(42% 55% at 82% 20%, hsl(192 90% 60% / .5),  transparent 70%),
    radial-gradient(60% 70% at 60% 90%, hsl(342 80% 55% / .34), transparent 75%);
  filter: blur(14px) saturate(1.3);
  animation: aurora-drift 18s ease-in-out infinite alternate;
}
@keyframes aurora-drift {
  from { transform: scale(1) rotate(-1deg); }
  to   { transform: scale(1.12) rotate(2deg); }
}`,
  },
  "tilt-card": {
    react: `// React + Tailwind
import { TiltCard } from "@motifui/tilt-card";

<TiltCard maxTilt={16} spotlight className="w-full max-w-sm">
  <YourCardContent />
</TiltCard>`,
    css: `/* .tilt-card listens to --mx / --my (0-100) set from JS */
.tilt-card {
  transform:
    perspective(900px)
    rotateX(calc((50 - var(--my, 50)) * 0.32deg))
    rotateY(calc((var(--mx, 50) - 50) * 0.32deg));
  transition: transform 120ms ease-out;
}`,
  },
  "prism-switch": {
    react: `// React + Tailwind
import { PrismSwitch } from "@motifui/prism-switch";

export function Settings() {
  return <PrismSwitch size={42} hueSpeed={1.4} ariaLabel="Dark mode" />;
}`,
    css: `/* HTML structure is a checkbox + track + thumb */
input.prism:checked + .track {
  background: linear-gradient(90deg, #7c3aed, #6366f1, #0ea5e9,
              #06b6d4, #34d399, #f472b6, #7c3aed);
  background-size: 300% 100%;
  animation: prism-sweep 1.4s linear infinite;
}
@keyframes prism-sweep { to { background-position: 300% 0; } }`,
  },
  "scramble-text": {
    react: `// React
import { ScrambleText } from "@motifui/scramble-text";

<ScrambleText text="Copy less. Ship more." speed={55} />`,
    css: `/* .scramble uses a JS character loop over GLYPHS below */
const GLYPHS = "!<>-_\\\\/[]{}—=+*^?#0123456789";`,
  },
  "halo-button": {
    react: `// React + Tailwind
import { HaloButton } from "@motifui/halo-button";

<HaloButton magnet={24} glow={0.7}>Start building</HaloButton>`,
    css: `/* .halo-btn copies pointer position to --hx / --hy */
.halo-btn::after {
  content: ""; position: absolute; inset: 0;
  background: radial-gradient(220px circle at var(--hx) var(--hy),
              rgba(255,255,255,.28), transparent 60%);
}`,
  },
  "orbit-deck": {
    react: `// React
import { OrbitDeck } from "@motifui/orbit-deck";

<OrbitDeck radius={190} orbitSeconds={14} tilt>
  <LogoOne /> <LogoTwo /> <LogoThree />
</OrbitDeck>`,
    css: `/* ring = spin wrapper, items counter-rotate while translating */
.orbit-item {
  animation: mf-spin var(--orbit, 14s) linear infinite reverse;
}`,
  },
};

const FALLBACK = {
  react: `// 1) install
//   npm i @motifui/cli && npx motifui add {slug}
// 2) import where you need it
import { Component } from "@motifui/{slug}";

export function Demo() {
  return <Component theme="inherit" className="w-full" />;
}`,
  css: `/* Grab the fully-written CSS from the "HTML/CSS" view,
   or install with:  npx motifui add {slug}  */`,
};

function CodeBlock({ title, code, onCopy }: { title: string; code: string; onCopy: () => void }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#07090f]">
      <div className="flex items-center justify-between border-b border-white/6 px-4 py-2.5">
        <span className="text-xs font-semibold text-ink-dim">{title}</span>
        <button
          type="button"
          onClick={onCopy}
          className="btn btn-ghost !rounded-lg !px-3 !py-1.5 !text-[11px]"
        >
          Copy
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[12.5px] leading-relaxed text-cyan-100/90">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function AssetDetail({ asset }: { asset: Asset }) {
  const [props, setProps] = useState<Record<string, number | string | boolean>>(() => {
    const init: Record<string, number | string | boolean> = {};
    asset.props.forEach((p) => (init[p.name] = p.defaultValue));
    return init;
  });
  const [themeHue, setThemeHue] = useState(262);
  const [copied, setCopied] = useState<string | null>(null);
  const [tab, setTab] = useState<"react" | "css">("react");

  const snippet = useMemo(() => {
    const s = SNIPPETS[asset.slug] ?? FALLBACK;
    const out = { ...s };
    if (s.react.includes("{slug}")) out.react = s.react.replaceAll("{slug}", asset.slug);
    if (s.css.includes("{slug}")) out.css = s.css.replaceAll("{slug}", asset.slug);
    return out;
  }, [asset]);

  const copy = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      /* clipboard unavailable in sandbox previews */
      setCopied(label);
      setTimeout(() => setCopied(null), 1600);
    }
  };

  const related = COMPONENTS.filter((c) => c.slug !== asset.slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      {/* breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-xs text-ink-faint">
        <Link href="/components" className="hover:text-ink">Components</Link>
        <span>/</span>
        <span className="chip capitalize">{KIND_META[asset.kind].label}</span>
        <span>/</span>
        <span className="text-ink-dim">{asset.title}</span>
      </nav>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{asset.title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-dim">{asset.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="btn btn-primary" onClick={() => copy("install", `npx motifui add ${asset.slug}`)}>
            {copied === "install" ? "✓ Copied" : "Copy component"}
          </button>
          <button type="button" className="btn btn-ghost">♥ Collect</button>
          <CopyCount n={asset.copies} className="!text-sm" />
        </div>
      </div>

      {/* meta chips */}
      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        <span className="chip">MIT license</span>
        <span className="chip">v{asset.version}</span>
        <span className="chip">{asset.bundleKb} KB gzip</span>
        {asset.deps.length > 0 ? (
          <span className="chip">deps: {asset.deps.join(", ")}</span>
        ) : (
          <span className="chip">zero dependencies</span>
        )}
        <span className="chip">by {asset.author}</span>
        <span className="chip">updated {asset.published}</span>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        {/* preview + theme */}
        <div>
          <div className="rounded-3xl border border-white/8 bg-panel p-3">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-ink-faint">
                Live playground — drag, click, hover
              </span>
              <span className="chip !text-[10px]">sandboxed preview</span>
            </div>
            <Stage className="rounded-2xl" >
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ ["--tone" as string]: themeHue }}
              >
                <DemoView demo={asset.demo} props={props} />
              </div>
            </Stage>
            <div className="mt-3 flex items-center justify-between gap-4 px-2 pb-1">
              <div className="flex items-center gap-2 text-xs text-ink-dim">
                <span>Theme tone</span>
                <input
                  type="range" min={0} max={360} value={themeHue}
                  onChange={(e) => setThemeHue(Number(e.target.value))}
                  className="w-40"
                  aria-label="Theme tone"
                />
                <span className="font-mono text-[11px]">hsl({themeHue})</span>
              </div>
              <span className="text-[11px] text-ink-faint">
                All colours remap through design tokens
              </span>
            </div>
          </div>

          {/* code */}
          <div className="mt-6">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex rounded-xl border border-white/8 bg-black/30 p-1">
                {(["react", "css"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-colors ${
                      tab === t ? "bg-white/10 text-ink" : "text-ink-dim hover:text-ink"
                    }`}
                  >
                    {t === "react" ? "React + Tailwind" : "HTML / CSS"}
                  </button>
                ))}
              </div>
              <span className="text-xs text-ink-faint">stack views: React · HTML/CSS · Vue (soon)</span>
            </div>
            <CodeBlock
              title={`${asset.slug}.tsx`}
              code={snippet[tab]}
              onCopy={() => copy(tab, snippet[tab])}
            />
            <div className="mt-3 rounded-2xl border border-violet-300/15 bg-violet-400/5 px-4 py-3 text-xs leading-relaxed text-violet-100/80">
              <b className="text-violet-200">Dependency-aware copy:</b> {asset.deps.length === 0
                ? "zero packages to install — paste and run."
                : `you'll need: ${asset.deps.join(", ")} (versions pinned in the install command).`}{" "}
              All markup is original Motif UI content (MIT).
            </div>
          </div>
        </div>

        {/* props + facts */}
        <aside className="space-y-5">
          <div className="rounded-3xl border border-white/8 bg-panel p-5">
            <div className="text-xs font-bold uppercase tracking-widest text-ink-faint">Playground props</div>
            <div className="mt-4 space-y-4">
              {asset.props.length === 0 && (
                <p className="text-xs text-ink-dim">No exposed knobs — this asset ships as-is. Style it through Theme Studio tokens.</p>
              )}
              {asset.props.map((p) => {
                const val = props[p.name];
                const set = (v: number | string | boolean) => setProps((prev) => ({ ...prev, [p.name]: v }));
                return (
                  <div key={p.name}>
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-ink-dim">{p.label}</label>
                      <span className="font-mono text-[11px] text-cyan-200/80">
                        {typeof val === "number" ? `${val}${p.unit ?? ""}` : String(val)}
                      </span>
                    </div>
                    {p.type === "range" && (
                      <input
                        type="range" min={p.min} max={p.max} step={p.step ?? 1}
                        value={val as number}
                        onChange={(e) => set(Number(e.target.value))}
                        className="mt-2 w-full"
                        aria-label={p.label}
                      />
                    )}
                    {p.type === "toggle" && (
                      <button
                        type="button"
                        role="switch"
                        aria-checked={Boolean(val)}
                        onClick={() => set(!val)}
                        className="mt-2 flex items-center gap-2 text-xs text-ink-dim"
                      >
                        <span
                          className={`flex h-5 w-9 items-center rounded-full border px-0.5 transition-colors ${
                            val ? "justify-end border-violet-300/50 bg-violet-500/60" : "justify-start border-white/15 bg-white/8"
                          }`}
                        >
                          <span className="h-3.5 w-3.5 rounded-full bg-white shadow" />
                        </span>
                        {val ? "On" : "Off"}
                      </button>
                    )}
                    {p.type === "select" && (
                      <select
                        value={String(val)}
                        onChange={(e) => set(e.target.value)}
                        className="input mt-2 !cursor-pointer !py-1.5 text-xs"
                        aria-label={p.label}
                      >
                        {(p.options ?? []).map((o) => (
                          <option key={o} value={o} className="bg-panel">{o}</option>
                        ))}
                      </select>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-white/8 bg-panel p-5">
            <div className="text-xs font-bold uppercase tracking-widest text-ink-faint">Audit report</div>
            <div className="mt-4 space-y-3">
              {[
                { label: "Accessibility (auto + human)", value: asset.a11yScore, tone: asset.a11yScore >= 95 ? "text-mint" : asset.a11yScore >= 90 ? "text-amber-300" : "text-danger" },
                { label: "Editorial quality", value: asset.qualityScore, tone: asset.qualityScore >= 95 ? "text-mint" : "text-amber-300" },
              ].map((r) => (
                <div key={r.label}>
                  <div className="flex justify-between text-xs">
                    <span className="text-ink-dim">{r.label}</span>
                    <span className={`font-bold ${r.tone}`}>{r.value}/100</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/6">
                    <div
                      className={`h-full rounded-full ${r.value >= 95 ? "bg-mint" : "bg-amber-300"}`}
                      style={{ width: `${r.value}%` }}
                    />
                  </div>
                </div>
              ))}
              <ul className="prose-list list-none space-y-1 pt-1">
                <li className="!text-xs">Keyboard reachable & ARIA labelled</li>
                <li className="!text-xs">{asset.themeable ? "100% design-token driven" : "Static palette (token migration planned)"}</li>
                <li className="!text-xs">Reduced-motion fallback included</li>
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-white/8 bg-panel p-5">
            <div className="text-xs font-bold uppercase tracking-widest text-ink-faint">One-command install</div>
            <div className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-black/40 px-3 py-2.5 font-mono text-[12px] text-cyan-100">
              <span className="truncate">npx motifui add {asset.slug}</span>
              <button type="button" className="shrink-0 text-xs text-ink-dim hover:text-ink" onClick={() => copy("cmd", `npx motifui add ${asset.slug}`)}>
                {copied === "cmd" ? "✓" : "copy"}
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* related */}
      <div className="mt-16">
        <h2 className="text-xl font-extrabold tracking-tight">Related assets</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((a) => (
            <AssetCard key={a.slug} asset={a} />
          ))}
        </div>
      </div>
    </div>
  );
}
