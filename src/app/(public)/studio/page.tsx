"use client";

// Theme Studio (demo) — Section 10, batches. Real token editor, diff view,
// palette presets, accent rotation, radius explorer, type-scale calculator,
// density presets (batches 41) plus export formats, contrast guardrail,
// preview gallery + colour-blind simulation, saved themes & share links,
// default-trio case study and a real-component recipe (batch 42).
// All original copy; every ratio and count is computed live — no fake scores.

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { accentHue, COMPONENTS } from "@/lib/data";
import { DEFAULT_TOKENS, hsl, type Tokens } from "@/lib/studio-utils";
import {
  DefaultsCasePanel,
  ExportPanel,
  GuardrailPanel,
  RecipePanel,
  SavedThemesPanel,
  ThemePreviewPanel,
} from "@/components/studio-panels";
import { ProLabGate } from "@/components/pro-lab-gate";

import {
  ApiPreviewPanel,
  IconPanel,
  MotionPanel,
  ResetPanel,
  SemanticMapPanel,
  SpacingPanel,
} from "@/components/studio-panels-2";


const PRESETS: (Tokens & { id: string; label: string; note: string })[] = [
  { id: "violet", label: "Motif Violet", hue: 262, sat: 82, radius: 12, mode: "dark", note: "the house default — calm, generative" },
  { id: "mono", label: "Monochrome", hue: 224, sat: 14, radius: 10, mode: "dark", note: "graphite + one quiet accent" },
  { id: "terminal", label: "Terminal", hue: 142, sat: 62, radius: 4, mode: "dark", note: "green phosphor, sharp corners" },
  { id: "paper", label: "Paper", hue: 28, sat: 30, radius: 18, mode: "light", note: "warm off-white, friendly radii" },
  { id: "candy", label: "Candy", hue: 330, sat: 74, radius: 20, mode: "dark", note: "playful rose, generous corners" },
  { id: "ocean", label: "Ocean", hue: 198, sat: 72, radius: 14, mode: "dark", note: "deep-water cyan" },
  { id: "sunset", label: "Sunset", hue: 22, sat: 84, radius: 16, mode: "dark", note: "warm ember gradient energy" },
  { id: "forest", label: "Forest", hue: 152, sat: 55, radius: 12, mode: "light", note: "leafy green on ivory" },
  { id: "berry", label: "Berry", hue: 300, sat: 66, radius: 22, mode: "light", note: "plum softness" },
  { id: "slate", label: "Slate", hue: 210, sat: 24, radius: 8, mode: "dark", note: "understated, professional" },
];

const RADII = [
  { px: 4, label: "sharp", when: "dense tools, code chips, inline controls" },
  { px: 8, label: "soft", when: "inputs, menu surfaces, small buttons" },
  { px: 12, label: "card", when: "cards, popovers, dropdown panels" },
  { px: 18, label: "round", when: "feature blocks, hero callouts" },
  { px: 24, label: "friendly", when: "marketing containers, big surfaces" },
];

const TYPE_STEPS = [-2, -1, 0, 1, 2, 3, 4, 5];

function toBase26(n: number) {
  let s = "";
  let v = n;
  do {
    s = String.fromCharCode(97 + (v % 26)) + s;
    v = Math.floor(v / 26) - 1;
  } while (v >= 0);
  return s;
}

const DENSITY = {
  compact: { pad: 1, gap: 1, label: "Compact", note: "dense dashboards & admin surfaces" },
  comfortable: { pad: 1.55, gap: 1.4, label: "Comfortable", note: "the Motif default rhythm" },
  spacious: { pad: 2.2, gap: 1.9, label: "Spacious", note: "marketing pages, first-time users" },
} as const;

function TokenStudio() {
  const [tokens, setTokens] = useState<Tokens>(DEFAULT_TOKENS);
  const [prev, setPrev] = useState<Tokens>(DEFAULT_TOKENS);
  const [rotating, setRotating] = useState(false);
  const [density, setDensity] = useState<keyof typeof DENSITY>("comfortable");
  const [typeBase, setTypeBase] = useState(16);
  const [typeRatio, setTypeRatio] = useState(1.25);
  const [saved, setSaved] = useState<string | null>(null);
  const [fromLink, setFromLink] = useState(false);
  const [edits, setEdits] = useState(0);
  const [trail, setTrail] = useState<string[]>([]);

  const apply = (patch: Partial<Tokens>) => {
    setPrev(tokens);
    setTokens((t) => ({ ...t, ...patch }));
    setEdits((e) => e + 1);
  };

  const applyTokens = (t: Tokens, label = "saved theme") => {
    setPrev(tokens);
    setTokens(t);
    setEdits((e) => e + 1);
    setTrail((tr) => [label, ...tr].slice(0, 5));
  };

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setPrev(tokens);
    setTokens({ hue: p.hue, sat: p.sat, radius: p.radius, mode: p.mode });
    setEdits((e) => e + 1);
    setTrail((tr) => [p.label, ...tr].slice(0, 5));
  };

  const resetTheme = () => {
    setPrev(tokens);
    setTokens({ ...DEFAULT_TOKENS });
    setRotating(false);
    setEdits(0);
    setTrail([]);
    setSaved(null);
  };

  /* share-link load: ?hue=&sat=&radius=&mode= — applied once at mount */
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const p = new URLSearchParams(window.location.search);
      const hue = Number(p.get("hue"));
      const sat = Number(p.get("sat"));
      const radius = Number(p.get("radius"));
      const mode = p.get("mode");
      if (
        Number.isFinite(hue) &&
        Number.isFinite(sat) &&
        Number.isFinite(radius) &&
        (mode === "dark" || mode === "light") &&
        hue >= 0 &&
        hue < 360 &&
        sat >= 0 &&
        sat <= 100 &&
        radius >= 0 &&
        radius <= 24
      ) {
        setTokens({ hue, sat, radius, mode });
        setFromLink(true);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  /* accent rotation sweep — interval-driven, stops on user edit */
  useEffect(() => {
    if (!rotating) return;
    const id = setInterval(() => {
      setTokens((t) => ({ ...t, hue: (t.hue + 2) % 360 }));
    }, 60);
    return () => clearInterval(id);
  }, [rotating]);

  const d = DENSITY[density];
  const panel = tokens.mode === "light" ? "#ffffff" : "#12151f";
  const ink = tokens.mode === "light" ? "#141414" : "#eef0f6";
  const dim = tokens.mode === "light" ? "#57534e" : "#98a0b3";

  const catalogRow = useMemo(
    () =>
      COMPONENTS.slice(0, 8).map((c) => {
        const base = accentHue(c.slug);
        const shifted = ((base + (tokens.hue - 262)) % 360 + 360) % 360;
        return { slug: c.slug, title: c.title, base, shifted };
      }),
    [tokens.hue]
  );

  const typeScale = useMemo(
    () =>
      TYPE_STEPS.map((step) => {
        const px = typeBase * Math.pow(typeRatio, step);
        return { step, px: Math.round(px * 100) / 100, rem: px / 16 };
      }),
    [typeBase, typeRatio]
  );

  const diffLines = useMemo(() => {
    const before = prev;
    const lines: { kind: "keep" | "add" | "remove"; text: string }[] = [];
    if (before.hue !== tokens.hue) {
      lines.push({ kind: "remove", text: `--accent-hue: ${before.hue};` });
      lines.push({ kind: "add", text: `--accent-hue: ${tokens.hue};` });
    }
    if (before.sat !== tokens.sat) {
      lines.push({ kind: "remove", text: `--accent-sat: ${before.sat}%;` });
      lines.push({ kind: "add", text: `--accent-sat: ${tokens.sat}%;` });
    }
    if (before.radius !== tokens.radius) {
      lines.push({ kind: "remove", text: `--radius-md: ${before.radius}px;` });
      lines.push({ kind: "add", text: `--radius-md: ${tokens.radius}px;` });
    }
    if (before.mode !== tokens.mode) {
      lines.push({ kind: "remove", text: `color-scheme: ${before.mode};` });
      lines.push({ kind: "add", text: `color-scheme: ${tokens.mode};` });
    }
    if (!lines.length) lines.push({ kind: "keep", text: "// no token changes yet — tweak something above" });
    return lines;
  }, [prev, tokens]);

  const save = () => {
    try {
      window.localStorage.setItem("motif:studio-theme", JSON.stringify(tokens));
      setSaved("saved to this browser (demo)");
    } catch {
      setSaved("storage unavailable here");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/lab" className="hover:text-ink">Lab</Link>
        <span>/</span>
        <span className="text-ink-dim">Theme Studio</span>
      </nav>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Theme Studio · design tokens</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Edit one token, see the whole catalog</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-dim">
            The live token editor behind the scenes of Motif: accent, saturation, radius and mode —
            with a code diff for every tweak, ten hand-made presets and honest tooling notes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setRotating(!rotating)} className={`btn ${rotating ? "btn-primary" : "btn-ghost"} !px-4 !py-2 text-xs`}>
            {rotating ? "■ Stop rotation" : "▶ Rotate accents live"}
          </button>
          <button type="button" onClick={save} className="btn btn-ghost !px-4 !py-2 text-xs">Save theme (demo)</button>
        </div>
      </div>
      {saved && <p className="mt-2 text-xs font-semibold text-emerald-300">{saved}</p>}
      {fromLink && (
        <p className="mt-2 text-xs font-semibold text-emerald-300">
          Shared theme loaded from the link — hue {tokens.hue}°, sat {tokens.sat}%, radius {tokens.radius}px, {tokens.mode}. Keep editing from here.
        </p>
      )}

      {/* #390 — Theme Studio is the one lab tool marked non-free, so the free
          preview gate lives here: three minutes of the real editor, then an
          upgrade card that is one press away from being dismissed. */}
      <div className="mt-6">
        <ProLabGate variant="bare" tool="Theme Studio — the one lab tool marked Pro">
      {/* live token editor */}
      <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-white/8 p-6" style={{ background: panel, color: ink }}>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: dim }}>Token editor</p>
            <span className="chip !text-[10px]" style={{ color: hsl(tokens.hue, tokens.sat, 70), borderColor: hsl(tokens.hue, tokens.sat, 70, 0.35), background: hsl(tokens.hue, tokens.sat, 70, 0.1) }}>
              {tokens.mode} · hsl({tokens.hue} {tokens.sat}%)
            </span>
          </div>
          <div className="mt-5 space-y-5">
            <div>
              <div className="flex justify-between text-xs">
                <label className="font-semibold" style={{ color: dim }}>Accent hue</label>
                <span className="font-mono">{tokens.hue}°</span>
              </div>
              <input type="range" min={0} max={360} value={tokens.hue} onChange={(e) => apply({ hue: Number(e.target.value) })} className="mt-2 w-full" aria-label="Accent hue" style={{ accentColor: hsl(tokens.hue, tokens.sat, 60) }} />
            </div>
            <div>
              <div className="flex justify-between text-xs">
                <label className="font-semibold" style={{ color: dim }}>Saturation</label>
                <span className="font-mono">{tokens.sat}%</span>
              </div>
              <input type="range" min={0} max={100} value={tokens.sat} onChange={(e) => apply({ sat: Number(e.target.value) })} className="mt-2 w-full" aria-label="Saturation" style={{ accentColor: hsl(tokens.hue, tokens.sat, 60) }} />
            </div>
            <div>
              <div className="flex justify-between text-xs">
                <label className="font-semibold" style={{ color: dim }}>Corner radius</label>
                <span className="font-mono">{tokens.radius}px</span>
              </div>
              <input type="range" min={0} max={24} value={tokens.radius} onChange={(e) => apply({ radius: Number(e.target.value) })} className="mt-2 w-full" aria-label="Corner radius" style={{ accentColor: hsl(tokens.hue, tokens.sat, 60) }} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold" style={{ color: dim }}>Mode</label>
              <div className="flex rounded-xl border border-white/10 p-1">
                {(["dark", "light"] as const).map((m) => (
                  <button key={m} type="button" onClick={() => apply({ mode: m })} className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition-colors ${tokens.mode === m ? "text-white" : "opacity-60"}`} style={tokens.mode === m ? { background: hsl(tokens.hue, tokens.sat, 55) } : undefined}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* token diff view */}
        <div className="rounded-3xl border border-white/8 bg-[#07090f] p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-200/80">Token diff · what changed</p>
            <span className="chip !text-[10px]">code view</span>
          </div>
          <pre className="mt-4 overflow-x-auto font-mono text-[12px] leading-relaxed">
            {diffLines.map((l, i) => (
              <div key={i} className={l.kind === "add" ? "text-emerald-300" : l.kind === "remove" ? "text-rose-300/80" : "text-ink-faint"}>
                {l.kind === "add" ? "+ " : l.kind === "remove" ? "- " : "  "}{l.text}
              </div>
            ))}
          </pre>
          <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
            Every slider movement renders the exact token lines that would change in your CSS — no black-box theme
            engine. Copy them straight into <code className="font-mono">:root</code>.
          </p>
        </div>
      </div>

      {/* catalog-wide preview */}
      <div className="mt-8 rounded-3xl border border-white/8 bg-panel p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Catalog-wide preview</p>
            <p className="mt-1 text-xs text-ink-dim">Eight library assets, re-accented live as you move the hue. Base hash → rotated by your offset.</p>
          </div>
          <span className="text-[10px] text-ink-faint">shift = {tokens.hue - 262}°</span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {catalogRow.map((c) => (
            <div key={c.slug} className="flex items-center gap-2.5 rounded-xl border border-white/6 bg-white/[.02] px-3 py-2.5">
              <span className="h-5 w-5 shrink-0 border border-white/15" style={{ background: hsl(c.shifted, tokens.sat, 62), borderRadius: Math.max(1, Math.min(10, tokens.radius / 2)) }} />
              <span className="min-w-0">
                <span className="block truncate text-[11px] font-bold">{c.title}</span>
                <span className="block font-mono text-[9px] opacity-60">{c.base}° → {c.shifted}°</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* palette presets */}
      <div className="mt-8">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Palette presets · ten hand-made token themes</p>
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {PRESETS.map((p) => (
            <button key={p.id} type="button" onClick={() => applyPreset(p)} className="card-hover rounded-2xl border border-white/8 bg-panel p-4 text-left transition-colors hover:border-white/20">
              <div className="flex gap-1.5">
                <span className="h-6 w-6 rounded-full border border-white/15" style={{ background: hsl(p.hue, p.sat, 62) }} />
                <span className="h-6 w-6 rounded-full border border-white/10" style={{ background: hsl((p.hue + 70) % 360, p.sat, 55) }} />
              </div>
              <p className="mt-2.5 text-xs font-extrabold">{p.label}</p>
              <p className="mt-0.5 text-[10px] leading-snug text-ink-faint">{p.note}</p>
              <p className="mt-1.5 font-mono text-[9px] text-ink-faint">hue {p.hue} · r {p.radius} · {p.mode}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {/* radius explorer */}
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Radius system</p>
          <p className="mt-1 text-xs text-ink-dim">One scale, five uses. The active token is {tokens.radius}px.</p>
          <div className="mt-5 space-y-3">
            {RADII.map((r) => (
              <div key={r.px} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${r.px === tokens.radius ? "bg-white/[.06]" : "bg-white/[.02]"}`}>
                <span className="h-9 w-14 shrink-0 border" style={{ background: hsl(tokens.hue, tokens.sat, 62, 0.35), borderRadius: r.px }} />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold">{r.label} · {r.px}px</div>
                  <div className="text-[10px] text-ink-faint">{r.when}</div>
                </div>
                <button type="button" onClick={() => apply({ radius: r.px })} className="rounded-lg border border-white/10 px-2 py-1 text-[10px] font-semibold text-ink-dim transition-colors hover:border-white/25 hover:text-ink">use</button>
              </div>
            ))}
          </div>
        </div>

        {/* type scale calculator */}
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Type scale calculator</p>
          <p className="mt-1 text-xs text-ink-dim">Modular scale from a base and ratio — rendered live.</p>
          <div className="mt-4 flex gap-3">
            <label className="flex-1 text-[11px] text-ink-faint">Base (px)
              <input type="number" min={10} max={24} value={typeBase} onChange={(e) => setTypeBase(Number(e.target.value) || 16)} className="input mt-1 !py-1.5 text-xs" />
            </label>
            <label className="flex-1 text-[11px] text-ink-faint">Ratio
              <input type="number" step={0.05} min={1.1} max={1.5} value={typeRatio} onChange={(e) => setTypeRatio(Number(e.target.value) || 1.25)} className="input mt-1 !py-1.5 text-xs" />
            </label>
          </div>
          <div className="mt-4 space-y-1.5">
            {typeScale.map((s) => (
              <div key={s.step} className="flex items-baseline justify-between gap-3 border-b border-white/5 pb-1.5">
                <span className="truncate font-extrabold" style={{ fontSize: Math.max(10, Math.min(26, s.rem * 10)) }}>
                  Aa {toBase26(s.step + 3)}
                </span>
                <span className="shrink-0 font-mono text-[10px] text-ink-faint">{s.rem.toFixed(3)}rem · {s.px}px</span>
              </div>
            ))}
          </div>
        </div>

        {/* density presets */}
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Density presets</p>
          <p className="mt-1 text-xs text-ink-dim">One component, three token sets. Try each below.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(Object.keys(DENSITY) as (keyof typeof DENSITY)[]).map((k) => (
              <button key={k} type="button" onClick={() => setDensity(k)} className={`chip !cursor-pointer ${density === k ? "!border-violet-300/50 !text-ink" : ""}`}>
                {DENSITY[k].label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-ink-faint">{DENSITY[density].note}</p>
          <div className="mt-4 space-y-1.5" style={{ gap: `${d.gap * 6}px` }}>
            {["Profile card", "Pricing cell", "Changelog row", "Toast queue"].map((name) => (
              <div key={name} className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[.02]" style={{ padding: `${d.pad * 5}px ${d.pad * 7}px` }}>
                <span className="text-xs font-bold">{name}</span>
                <span className="h-2 w-10 rounded-full" style={{ background: hsl(tokens.hue, tokens.sat, 62, 0.6), borderRadius: tokens.radius }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* batch 42–43 — export, guardrail, gallery + colour-blind sim, saved themes, default trio, component recipe, semantic map, motion, spacing, iconography, API preview, reset */}
      <div className="mt-8 space-y-8">
        <ExportPanel tokens={tokens} />
        <GuardrailPanel tokens={tokens} />
        <ThemePreviewPanel tokens={tokens} />
        <SavedThemesPanel tokens={tokens} onApply={applyTokens} />
        <DefaultsCasePanel />
        <RecipePanel tokens={tokens} />
        <SemanticMapPanel />
        <MotionPanel tokens={tokens} />
        <SpacingPanel />
        <IconPanel tokens={tokens} />
        <ApiPreviewPanel />
        <ResetPanel tokens={tokens} edits={edits} trail={trail} onReset={resetTheme} />
      </div>

      {/* token export line */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/8 bg-panel p-6">
        <div className="max-w-xl">
          <p className="text-sm font-extrabold">Where these tokens go</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-dim">
            Every asset in the library already reads <code className="font-mono">accentCss(slug)</code> from the same
            hue space — so the shift above is the same math a real theme build would apply catalog-wide. The panels
            above turn those same tokens into export files, WCAG-check them, preview them across pages and under
            colour-blind filters, and save or share them as URLs.
          </p>
        </div>
        <Link href="/lab" className="btn btn-ghost !py-2 text-xs">Back to the Lab</Link>
      </div>
        </ProLabGate>
      </div>
    </div>
  );
}

export default TokenStudio;
