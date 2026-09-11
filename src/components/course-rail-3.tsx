"use client";

/* ============================================================
   Motif UI — Course rail, part three.
   Sizing, sandboxing, transcripts, code walks, trade-offs.
   ============================================================ */

import { useMemo, useState } from "react";
import { RailSection } from "@/components/course-rail";
import { Stage } from "@/components/cards";
import { COMPONENTS, KIND_META } from "@/lib/data";
import type { Asset } from "@/lib/types";

const SIZES = [
  { name: "Compact", scale: 0.85, pad: "p-3 text-[12px]", use: "toolbars, table rows, dense admin screens" },
  { name: "Default", scale: 1, pad: "p-5 text-sm", use: "standard page rhythm — most of the web" },
  { name: "Comfortable", scale: 1.15, pad: "p-8 text-base", use: "marketing heroes, reading-first surfaces" },
];

const TIERS = [
  { key: "slim", kb: 2, name: "Slim · HTML/CSS only", what: "layout + palette, no runtime script; paste into any stack" },
  { key: "standard", kb: 6, name: "Standard · CSS + hover states", what: "adds transitions, focus-visible and reduced-motion rules" },
  { key: "pro", kb: 12, name: "Pro · React component", what: "adds props, events and the full Motif behaviour set" },
] as const;

export default function CourseRailThree({ asset, cssCode, reactCode }: { asset: Asset; cssCode: string; reactCode: string }) {
  const [size, setSize] = useState(1);
  const [tier, setTier] = useState(1);
  const [selectedLine, setSelectedLine] = useState(0);
  const active = SIZES[size];
  const tierActive = TIERS[tier];

  const fileHtml = `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8" />\n<title>Sandbox — ${asset.title}</title>\n<style>\n${cssCode}\n</style>\n</head>\n<body style="display:grid;place-items:center;min-height:100vh;background:#0b0d14;color:#e8e6e1;font-family:system-ui">\n  <!-- The asset stylesheet is injected above. Paste the\n       component markup into this stage and edit live. -->\n  <div class="stage" style="width:min(720px,92vw);border:1px dashed rgba(255,255,255,.2);border-radius:16px;padding:24px">\n    ${asset.title} — styles ready. Paste markup here, save, reload.\n  </div>\n</body>\n</html>`;

  const openSandbox = () => {
    try {
      const url = URL.createObjectURL(new Blob([fileHtml], { type: "text/html" }));
      window.open(url, "_blank", "noopener");
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch { /* popup blocked */ }
  };

  const lines = useMemo(
    () =>
      reactCode.split("\n").map((l, i) => ({ i: i + 1, text: l.trim() })).filter((l) => l.text).slice(0, 60),
    [reactCode]
  );

  const interesting = useMemo(() => {
    const rules: { re: RegExp; note: string }[] = [
      { re: /transition|animation|duration|cubic-bezier/i, note: "Motion is declared here — duration and curve, in one line." },
      { re: /hover|focus|active/i, note: "State change — the interactive promise of the component." },
      { re: /hsl\(|#([0-9a-f]{3,6})/i, note: "Colour lives inline; in a tokenised project it becomes a var(--)." },
      { re: /className=|class=/i, note: "Layout and surface styling — the Tailwind / utility vocabulary." },
      { re: /useState|props|on[A-Z]/i, note: "React state or props — what makes this behaviour tunable." },
    ];
    return lines
      .map((l) => ({ ...l, note: rules.find((r) => r.re.test(l.text))?.note ?? "Structural line — reads top-to-bottom with the JSX." }))
      .filter((l) => rules.some((r) => r.re.test(l.text)))
      .slice(0, 6);
  }, [lines]);

  return (
    <div className="mt-6 space-y-6">
      {/* sizing system */}
      <RailSection id="sizing-system" title="Sizing system — three densities" kicker="Scale, not clutter">
        <div className="grid gap-3 sm:grid-cols-3">
          {SIZES.map((s, i) => (
            <button key={s.name} type="button" onClick={() => setSize(i)} className={`rounded-2xl border p-2 text-left transition-colors ${size === i ? "border-white/30 bg-white/[.05]" : "border-white/8 hover:border-white/20"}`}>
              <Stage className="rounded-xl">
                <div className={`flex h-full w-full items-center justify-center ${s.pad}`} style={{ transform: `scale(${s.scale})` }}>
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.05] px-3 py-2">
                    <span className="text-base font-black">A</span>
                    <span className="text-xs text-ink-dim">{s.name}</span>
                  </div>
                </div>
              </Stage>
              <span className="mt-2 block text-xs font-bold">{s.name}</span>
              <span className="block text-[10px] text-ink-faint">{s.use}</span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-[10px] text-ink-faint">Density is a token decision, not a per-page override — pick one density per product surface and hold it. Active: {active.name}.</p>
      </RailSection>

      {/* sandbox */}
      <RailSection id="sandbox-open" title="Open in a sandbox" kicker="Runnable copy">
        <p className="text-xs leading-relaxed text-ink-dim">Opens this asset in a new tab with its stylesheet injected — a real, editable HTML document in your browser. No account, no upload.</p>
        <button type="button" onClick={openSandbox} className="btn btn-primary mt-3 !px-4 !py-2 text-sm">↗ Open sandbox tab</button>
        <p className="mt-2 text-[10px] text-ink-faint">If the tab is blocked, use the single-file export instead — same content, saved locally.</p>
      </RailSection>

      {/* transcript */}
      <RailSection id="tutorial-transcript" title="Tutorial transcript" kicker="Written version first">
        <p className="text-xs leading-relaxed text-ink-dim">
          This asset does not have a video yet — so the written version stands in: the <b className="text-ink">code line walk</b> below narrates the snippet line by line, and the <b className="text-ink">design rationale</b> on this page explains the default decisions. When a video ships, this exact panel hosts its full transcript.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
          <span className="chip">video: not yet</span>
          <span className="chip">transcript: line walk below</span>
          <span className="chip">format: markdown, searchable</span>
        </div>
      </RailSection>

      {/* code line walk */}
      <RailSection id="code-line-walk" title="Code line walk" kicker="Annotated snippet">
        <p className="text-xs leading-relaxed text-ink-dim">The lines that matter, with the reason they matter. Click one:</p>
        <div className="mt-3 space-y-2">
          {interesting.map((l, i) => (
            <button key={l.i} type="button" onClick={() => setSelectedLine(i)} className={`block w-full rounded-xl border px-3 py-2 text-left transition-colors ${selectedLine === i ? "border-violet-300/40 bg-violet-400/10" : "border-white/6 bg-white/[.02] hover:border-white/15"}`}>
              <div className="flex items-baseline gap-3">
                <span className="shrink-0 font-mono text-[10px] text-ink-faint">L{l.i}</span>
                <code className="min-w-0 flex-1 truncate font-mono text-[11px] text-cyan-100/80">{l.text.length > 96 ? `${l.text.slice(0, 96)}…` : l.text}</code>
              </div>
              {selectedLine === i && <p className="mt-1.5 pl-7 text-[11px] leading-relaxed text-ink-dim">{interesting[i].note}</p>}
            </button>
          ))}
        </div>
      </RailSection>

      {/* size vs quality slider */}
      <RailSection id="size-quality-slider" title="Size vs. quality slider" kicker="Trade-off, visible">
        <input type="range" min={0} max={2} step={1} value={tier} onChange={(e) => setTier(Number(e.target.value))} className="w-full accent-violet-400" aria-label="size versus quality tier" />
        <div className="mt-2 grid grid-cols-3 gap-2 text-center text-[10px] font-bold uppercase tracking-wider text-ink-faint">
          <span>~2 KB</span><span>~6 KB</span><span>~12 KB</span>
        </div>
        <div className="mt-3 rounded-2xl border border-white/8 bg-[#07090f] p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold">{tierActive.name}</p>
            <span className="chip !text-[9px]">~{tierActive.kb} KB</span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-dim">{tierActive.what}</p>
        </div>
        <p className="mt-2 text-[10px] text-ink-faint">The slider is honest: the slim tier has no JS, the pro tier pays for behaviour. Start slim, upgrade only the surfaces that need it.</p>
      </RailSection>

      {/* stack-switch cost note */}
      <RailSection id="stack-switch-cost" title="Stack-switch cost note" kicker="HTML → React, priced">
        <p className="text-xs leading-relaxed text-ink-dim">
          Taking the <b className="text-ink">HTML/CSS version</b> into a React component costs real work — and the cost is predictable:
        </p>
        <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
          <div className="rounded-xl border border-white/6 bg-white/[.02] p-3">
            <p className="font-bold text-ink">Event wiring</p>
            <p className="mt-1 text-[11px] leading-relaxed text-ink-dim">Hover, focus and click become handlers — the CSS stays, the state appears.</p>
          </div>
          <div className="rounded-xl border border-white/6 bg-white/[.02] p-3">
            <p className="font-bold text-ink">Props for the knobs</p>
            <p className="mt-1 text-[11px] leading-relaxed text-ink-dim">Every inline value that should vary becomes a prop with a default — the defaults must match the CSS exactly.</p>
          </div>
          <div className="rounded-xl border border-white/6 bg-white/[.02] p-3">
            <p className="font-bold text-ink">The estimate</p>
            <p className="mt-1 text-[11px] leading-relaxed text-ink-dim">A clean port of this asset is 20–45 minutes for a React developer — the {cssCode.length}-character stylesheet is the easy half.</p>
          </div>
        </div>
      </RailSection>
    </div>
  );
}

/* ---------- final rail: synonyms + sibling comparison ---------- */

const SYNONYM_MAP: Record<string, string[]> = {
  dropdown: ["select", "picker", "menu"],
  menu: ["dropdown", "navigation", "sheet"],
  modal: ["dialog", "popover", "overlay"],
  loader: ["spinner", "loading", "progress"],
  button: ["cta", "action", "submit"],
  toggle: ["switch", "checkbox", "state"],
  hero: ["header", "landing", "cover"],
  card: ["panel", "tile", "box"],
  toast: ["notification", "alert", "snackbar"],
  gallery: ["carousel", "grid", "showcase"],
  aurora: ["gradient", "backdrop", "veil"],
  pricing: ["plans", "billing", "tiers"],
  nav: ["navigation", "menu", "dock"],
  form: ["input", "field", "control"],
};

export function CourseRailFinal({ asset }: { asset: Asset }) {
  const siblings = COMPONENTS_FILTERED(asset).slice(0, 2);
  const synSets = asset.tags.map((t) => ({ tag: t, aliases: SYNONYM_MAP[t.toLowerCase()] ?? [] })).filter((x) => x.aliases.length > 0);
  return (
    <div className="mt-6 space-y-6">
      <RailSection id="tag-synonyms" title="Tag synonyms" kicker="Find it the way you say it">
        {synSets.length === 0 ? (
          <p className="text-xs leading-relaxed text-ink-dim">
            Search on this site resolves synonyms globally — &quot;dropdown&quot;, &quot;select&quot; and &quot;picker&quot; land on the same asset, so you never need to know the catalog&apos;s internal vocabulary.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {synSets.map((x) => (
              <span key={x.tag} className="chip !text-[10px]">
                {x.tag} → {x.aliases.join(" · ")}
              </span>
            ))}
            <span className="chip !text-[10px] text-ink-faint">search resolves all of these to this asset</span>
          </div>
        )}
      </RailSection>

      <RailSection id="sibling-comparison" title="Sibling comparison" kicker="When to pick which">
        {siblings.length < 2 ? (
          <p className="text-xs leading-relaxed text-ink-dim">This {KIND_META[asset.kind].label.toLowerCase()} asset is currently the only one in its family — siblings arrive as the catalog grows.</p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-white/8">
              <table className="w-full min-w-[480px] text-left text-xs">
                <thead>
                  <tr className="border-b border-white/8 text-[10px] uppercase tracking-wider text-ink-faint">
                    <th className="px-3 py-2 font-semibold">Compare</th>
                    <th className="px-3 py-2 font-semibold text-violet-200">{asset.title}</th>
                    {siblings.map((s) => <th key={s.slug} className="px-3 py-2 font-semibold text-ink-dim">{s.title}</th>)}
                  </tr>
                </thead>
                <tbody className="text-[11px] text-ink-dim">
                  {[
                    { label: "Kind", get: (a: Asset) => KIND_META[a.kind].label },
                    { label: "Bundle", get: (a: Asset) => `${a.bundleKb} KB gzip` },
                    { label: "a11y", get: (a: Asset) => `${a.a11yScore}/100` },
                    { label: "Dependencies", get: (a: Asset) => (a.deps.length === 0 ? "none" : a.deps.join(", ")) },
                    { label: "Copies / mo", get: (a: Asset) => a.copies.toLocaleString() },
                    { label: "Interactions", get: (a: Asset) => a.behaviors.join(", ") },
                  ].map((row) => (
                    <tr key={row.label} className="border-b border-white/5 last:border-0">
                      <td className="px-3 py-2 font-bold text-ink-faint">{row.label}</td>
                      <td className="px-3 py-2 text-violet-100/80">{row.get(asset)}</td>
                      {siblings.map((s) => <td key={s.slug} className="px-3 py-2">{row.get(s)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 rounded-xl border border-white/6 bg-white/[.02] px-3.5 py-2.5 text-xs leading-relaxed text-ink-dim">
              <b className="text-ink">The honest verdict — </b>
              {asset.bundleKb <= siblings[0].bundleKb
                ? `${asset.title} is the lighter default here; reach for ${siblings[0].title} when its extra weight buys an interaction this one lacks.`
                : `${siblings[0].title} is lighter, but ${asset.title} carries richer behaviour — pick by the interaction your screen actually needs, then swap tokens, not pages.`}
            </p>
          </>
        )}
      </RailSection>
    </div>
  );
}

function COMPONENTS_FILTERED(asset: Asset) {
  return COMPONENTS.filter((c) => c.kind === asset.kind && c.slug !== asset.slug);
}
