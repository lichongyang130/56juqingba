"use client";

import Link from "next/link";
import { DemoView, KeyframesStyle } from "@/components/demos/Demo";
import { KIND_META, fidelityColor, promptStatusMeta } from "@/lib/data";
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
    <Link
      href={`/components/${asset.slug}`}
      className="card-hover group block overflow-hidden rounded-2xl border border-white/8 bg-panel"
    >
      <div className="relative">
        <Stage className="rounded-none border-0">
          <DemoView demo={asset.demo} props={{}} />
        </Stage>
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
    </Link>
  );
}

/* ---------------- prompt card ---------------- */

export function PromptCard({ prompt }: { prompt: PromptTemplate }) {
  const meta = promptStatusMeta(prompt.status);
  return (
    <Link
      href={`/prompts/${prompt.slug}`}
      className="card-hover group flex h-full flex-col rounded-2xl border border-white/8 bg-panel p-5"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="chip">{prompt.industry}</span>
        <span className={`chip border ${meta.cls}`}>{meta.label}</span>
      </div>
      <h3 className="mt-3 text-[15px] font-bold leading-snug tracking-tight">{prompt.title}</h3>
      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-dim">{prompt.vibe}</p>

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-white/6 bg-black/25 p-2.5 text-center">
        <div>
          <div className={`text-sm font-extrabold ${fidelityColor(prompt.avgFidelity)}`}>{prompt.avgFidelity}</div>
          <div className="text-[9px] uppercase tracking-wider text-ink-faint">Avg fidelity</div>
        </div>
        <div className="border-x border-white/6">
          <div className="text-sm font-extrabold text-ink">{prompt.runs.length}</div>
          <div className="text-[9px] uppercase tracking-wider text-ink-faint">Models run</div>
        </div>
        <div>
          <div className="truncate text-sm font-extrabold text-ink" title={prompt.bestModel}>{prompt.bestModel.split(" ")[0]}</div>
          <div className="text-[9px] uppercase tracking-wider text-ink-faint">Best model</div>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between pt-4">
        <div className="flex gap-1">
          {prompt.stacks.map((s) => (
            <span key={s} className="chip !text-[10px]">{s}</span>
          ))}
        </div>
        <span className="text-xs font-semibold text-ink-dim transition-colors group-hover:text-ink">
          View run log →
        </span>
      </div>
    </Link>
  );
}

/* ---------------- background card ---------------- */

export function BackgroundCard({ bg }: { bg: BackgroundAsset }) {
  return (
    <div className="card-hover group overflow-hidden rounded-2xl border border-white/8 bg-panel">
      <Stage>
        <DemoView demo={bg.demo} props={{}} />
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
      <div className="mt-4 text-xs font-semibold text-ink-faint transition-colors group-hover:text-ink">
        Open tool →
      </div>
    </div>
  );
}
