"use client";

/* ============================================================
   Motif UI — Lab additions (batch 2).
   System-level lab conveniences: previews, exporters, state.
   ============================================================ */

import { useEffect, useMemo, useState } from "react";
import { CopyBox, Frame, Range } from "@/components/lab-additions";

/* ---------- 9 · hue-shift simulator ---------- */

export function HueShiftSimulator() {
  const [hue, setHue] = useState(250);
  const [shift, setShift] = useState(0);
  const used = (hue + shift) % 360;
  const pair = (l: number, s = 82) => `hsl(${used} ${s}% ${l}%)`;
  return (
    <Frame id="hue-shift-simulator" title="Hue-shift simulator" blurb="Preview a brand hue rotated across the surfaces it actually lives on.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Range label="Brand hue" value={hue} min={0} max={360} unit="°" onChange={setHue} />
        <Range label="Shift" value={shift} min={-60} max={60} unit="°" onChange={setShift} />
      </div>
      <div className="mt-4 space-y-2 rounded-2xl border border-white/8 bg-[#07090f] p-5">
        <div className="rounded-xl px-4 py-6 text-center font-extrabold text-white" style={{ background: pair(22) }}>Primary action</div>
        <div className="flex gap-2">
          <div className="flex-1 rounded-xl border border-white/10 px-3 py-4 text-center text-xs font-bold text-ink" style={{ background: pair(96, 18) }}>Surface</div>
          <div className="flex-1 rounded-xl border border-white/10 px-3 py-4 text-center text-xs font-bold" style={{ background: "transparent", color: pair(70) }}>Text accent</div>
        </div>
      </div>
      <p className="mt-2 text-[11px] text-ink-faint">Shifting hue by ±20–40° simulates seasonal or campaign theming without touching structure.</p>
      <CopyBox label="tokens.css" text={`:root {\n  --brand-hue: ${used};\n  --accent: ${pair(22)};\n  --accent-text: ${pair(70)};\n  --surface-tint: ${pair(96, 18)};\n}`} />
    </Frame>
  );
}

/* ---------- 10 · breakpoint inspector ---------- */

export function BreakpointInspector() {
  const [w, setW] = useState(720);
  const state = w < 360 ? "stacked" : w < 560 ? "compact" : w < 860 ? "split" : "wide";
  return (
    <Frame id="breakpoint-inspector" title="Breakpoint inspector" blurb="Drag the container width and watch one demo component reflow through its own breakpoints.">
      <Range label="Container width" value={w} min={280} max={1180} step={10} unit="px" onChange={setW} />
      <div className="mt-3 flex items-center gap-2 text-[11px] text-ink-faint">
        <span className="chip">{state}</span>
        <span>now {w}px — the component asks its container, not the viewport.</span>
      </div>
      <div className="mt-2 overflow-hidden rounded-2xl border border-white/8 bg-[#0b0d14] p-4" style={{ width: `${w}px`, maxWidth: "100%" }}>
        <div className="grid items-center gap-3" style={{ gridTemplateColumns: state === "wide" ? "64px 1fr auto" : state === "split" ? "56px 1fr" : "1fr" }}>
          <div className="h-14 rounded-xl bg-gradient-to-br from-violet-400 to-cyan-400" style={state === "stacked" ? { height: 48 } : {}} />
          <div>
            <p className="text-sm font-extrabold text-white">Field notes card</p>
            <p className="mt-0.5 text-xs text-ink-dim">{state === "stacked" ? "Media stacks above; the card behaves like a phone column." : "Media sits beside the copy until the container gets roomy."}</p>
          </div>
          <button type="button" className="btn btn-primary !px-3 !py-1.5 !text-xs" style={state === "stacked" || state === "compact" ? { display: "none" } : {}}>Open</button>
        </div>
      </div>
      <p className="mt-2 text-[11px] text-ink-faint">Breakpoint: {state === "wide" ? "> 860px" : state === "split" ? "560–860px" : state === "compact" ? "360–560px" : "< 360px"} · same logic as a container query.</p>
    </Frame>
  );
}

/* ---------- 11 · motion-preference preview ---------- */

export function MotionPreferencePreview() {
  const [reduced, setReduced] = useState(false);
  const [scene, setScene] = useState(0);
  const items = ["Save the draft", "Publish quietly", "Share the link"];
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setScene((s) => s + 1), 1500);
    return () => clearInterval(t);
  }, [reduced]);
  return (
    <Frame id="motion-preference-preview" title="Motion-preference preview" blurb="Toggle prefers-reduced-motion and watch the same scene pick a calmer branch.">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setReduced(!reduced)} className={`chip cursor-pointer ${reduced ? "!bg-emerald-400/20 !text-emerald-200" : ""}`}>
          {reduced ? "reduced: on" : "reduced: off"}
        </button>
        <span className="text-[11px] text-ink-faint">Scene: toast-style confirmation queue</span>
      </div>
      <div className="mt-4 space-y-2 overflow-hidden rounded-2xl border border-white/8 bg-[#07090f] p-4">
        {items.map((label, i) => {
          const active = i === scene % items.length;
          const shown = reduced ? i === 0 || active : active || i === 0;
          if (!shown) return null;
          return (
            <div
              key={label}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-3 py-2.5 text-sm"
              style={{
                opacity: active ? 1 : 0.55,
                transform: reduced ? "none" : active ? "translateX(6px)" : "translateX(0)",
                transition: reduced ? "opacity 250ms ease" : "opacity 300ms cubic-bezier(.16,1,.3,1), transform 300ms cubic-bezier(.16,1,.3,1)",
              }}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: active ? "#34d399" : "#52525b" }} />
              {label}
              {active && <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-emerald-300">{reduced ? "fade only" : "nudge + fade"}</span>}
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] text-ink-faint">{reduced ? "The reduced branch keeps state visible via opacity and drops travel — a second design, not a stripped one." : "Full branch: items nudge and cascade. The reduced preview shows what the switch buys."}</p>
    </Frame>
  );
}

/* ---------- 12 · export clipboard ---------- */

const EXPORT_SAMPLES: Record<string, Record<string, string>> = {
  Tailwind: {
    button: `className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 active:scale-[.97]"`,
    card: `className="rounded-2xl border border-white/10 bg-[#14161d] p-5 shadow-lg"`,
  },
  CSS: {
    button: `.btn {\n  border-radius: .75rem;\n  background: #7c3aed;\n  padding: .625rem 1.25rem;\n  font-weight: 600;\n  transition: background .2s ease;\n}\n.btn:hover { background: #8b5cf6; }`,
    card: `.card {\n  border-radius: 1rem;\n  border: 1px solid rgb(255 255 255 / .1);\n  padding: 1.25rem;\n  box-shadow: 0 8px 24px rgb(0 0 0 / .2);\n}`,
  },
  React: {
    button: `export function Button({ children }) {\n  return (\n    <button className="rounded-xl bg-violet-600 px-5 py-2.5\n                   font-semibold text-white transition\n                   hover:bg-violet-500 active:scale-[.97]">\n      {children}\n    </button>\n  );\n}`,
    card: `export function Card({ children }) {\n  return (\n    <div className="rounded-2xl border border-white/10 bg-[#14161d] p-5">\n      {children}\n    </div>\n  );\n}`,
  },
};

export function ExportClipboard() {
  const [format, setFormat] = useState<keyof typeof EXPORT_SAMPLES>("Tailwind");
  const [part, setPart] = useState<"button" | "card">("button");
  return (
    <Frame id="export-clipboard" title="Export clipboard" blurb="One click from any lab to your project — pick the dialect first, then copy.">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(EXPORT_SAMPLES) as (keyof typeof EXPORT_SAMPLES)[]).map((f) => (
          <button key={f} type="button" onClick={() => setFormat(f)} className={`chip cursor-pointer ${format === f ? "!bg-violet-400/20 !text-violet-200" : "opacity-60 hover:opacity-100"}`}>{f}</button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {(["button", "card"] as const).map((p) => (
          <button key={p} type="button" onClick={() => setPart(p)} className={`chip cursor-pointer ${part === p ? "!bg-cyan-400/20 !text-cyan-200" : "opacity-60 hover:opacity-100"}`}>{p}</button>
        ))}
      </div>
      <div className="mt-3 rounded-xl border border-white/6 bg-white/[.02] px-3 py-2 text-[11px] text-ink-faint">
        Copy target: <span className="font-mono text-ink-dim">{EXPORT_SAMPLES[format][part].length} chars</span> · {format} · {part} · no build step needed.
      </div>
      <CopyBox label={`${format.toLowerCase()}-${part}.txt`} text={EXPORT_SAMPLES[format][part]} />
    </Frame>
  );
}

/* ---------- 13 · perf meter ---------- */

const PERF_CASES = [
  { id: "transform", name: "Transform slide", cost: "cheap", detail: "compositor-only", ms: 1 },
  { id: "opacity", name: "Opacity fade", cost: "cheap", detail: "compositor-only", ms: 1 },
  { id: "shadow", name: "Shadow pulse", cost: "paint", detail: "repaints every frame", ms: 6 },
  { id: "width", name: "Width expand", cost: "layout", detail: "reflows neighbours", ms: 14 },
] as const;

export function PerfMeter() {
  const [pick, setPick] = useState<(typeof PERF_CASES)[number]>(PERF_CASES[0]);
  const budget = 16.7;
  const pct = Math.min(100, (pick.ms / budget) * 100);
  const color = pick.cost === "cheap" ? "#34d399" : pick.cost === "paint" ? "#fbbf24" : "#fb7185";
  return (
    <Frame id="perf-meter" title="Perf meter" blurb="Every motion has a price. Pick an animation and read which pipeline stage it taxes.">
      <div className="flex flex-wrap gap-2">
        {PERF_CASES.map((c) => (
          <button key={c.id} type="button" onClick={() => setPick(c)} className={`chip cursor-pointer ${pick.id === c.id ? "!bg-amber-300/20 !text-amber-200" : "opacity-60 hover:opacity-100"}`}>{c.name}</button>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-white/8 bg-[#07090f] p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-ink-dim">{pick.name}</span>
          <span className="font-mono" style={{ color }}>{pick.ms}ms / 16.7ms frame</span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/5">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
        </div>
        <p className="mt-2 text-[11px] text-ink-faint">
          Stage: <span className="font-semibold" style={{ color }}>{pick.cost}</span> — {pick.detail}.
          {pick.cost !== "cheap" && " If this loops, budget leaks fast; prefer transform/opacity."}
        </p>
      </div>
    </Frame>
  );
}

/* ---------- 14 · URL state for labs ---------- */

export function UrlStateLabs() {
  const read = () => {
    if (typeof window === "undefined") return null;
    const p = new URLSearchParams(window.location.search);
    const x1 = Number(p.get("x1"));
    const y1 = Number(p.get("y1"));
    const x2 = Number(p.get("x2"));
    const y2 = Number(p.get("y2"));
    return [x1, y1, x2, y2].every(Number.isFinite) ? { x1, y1, x2, y2 } : null;
  };
  const init = read() ?? { x1: 0.16, y1: 1, x2: 0.3, y2: 1 };
  const [v, setV] = useState(init);
  const [copied, setCopied] = useState(false);
  const url = useMemo(() => {
    if (typeof window === "undefined") return "/lab?x1=.16&y1=1&x2=.3&y2=1";
    const u = new URL(window.location.href);
    u.searchParams.set("x1", String(v.x1));
    u.searchParams.set("y1", String(v.y1));
    u.searchParams.set("x2", String(v.x2));
    u.searchParams.set("y2", String(v.y2));
    return u.pathname + u.search;
  }, [v]);
  useEffect(() => {
    try { history.replaceState(null, "", url); } catch { /* noop */ }
  }, [url]);
  const pad = (n: number) => n.toFixed(2).replace(/^0/, "");
  return (
    <Frame id="url-state-labs" title="URL state for labs" blurb="Tune a curve, then share the exact configuration as a link — state lives in the URL.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Range label="x1" value={Math.round(v.x1 * 100)} min={0} max={100} onChange={(n) => setV({ ...v, x1: n / 100 })} />
        <Range label="y1" value={Math.round(v.y1 * 100)} min={-100} max={200} onChange={(n) => setV({ ...v, y1: n / 100 })} />
        <Range label="x2" value={Math.round(v.x2 * 100)} min={0} max={100} onChange={(n) => setV({ ...v, x2: n / 100 })} />
        <Range label="y2" value={Math.round(v.y2 * 100)} min={-100} max={200} onChange={(n) => setV({ ...v, y2: n / 100 })} />
      </div>
      <div className="mt-4 h-16 rounded-xl border border-white/8 bg-[#07090f] p-2">
        <svg viewBox="0 0 200 60" className="h-full w-full">
          <path d={`M 0 58 C ${(v.x1 * 200).toFixed(1)} ${58 - v.y1 * 28}, ${(v.x2 * 200).toFixed(1)} ${58 - v.y2 * 28}, 200 2`} fill="none" stroke="#8b5cf6" strokeWidth="2.5" />
          <circle cx={v.x1 * 200} cy={58 - v.y1 * 28} r="4" fill="#22d3ee" />
          <circle cx={v.x2 * 200} cy={58 - v.y2 * 28} r="4" fill="#34d399" />
        </svg>
      </div>
      <button
        type="button"
        onClick={async () => {
          try { await navigator.clipboard.writeText(url); } catch { /* noop */ }
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
        className="btn btn-primary mt-3 !py-1.5 text-xs"
      >
        {copied ? "✓ Copied share link" : "Copy shareable URL"}
      </button>
      <p className="mt-2 break-all font-mono text-[10px] text-ink-faint">cubic-bezier({pad(v.x1)}, {pad(v.y1)}, {pad(v.x2)}, {pad(v.y2)}) · {url}</p>
    </Frame>
  );
}

/* ---------- 15 · favourite recipes ---------- */

const PRESET_RECIPES = [
  { name: "Soft hero settle", value: "transition: all .6s cubic-bezier(.16,1,.3,1)" },
  { name: "Snappy card hover", value: "transition: transform .18s ease-out" },
  { name: "Calm modal in", value: "animation: modal-in .35s cubic-bezier(.16,1,.3,1)" },
  { name: "Decisive dismiss", value: "animation: out .25s cubic-bezier(.55,0,1,.45) forwards" },
  { name: "Stagger wave", value: "transition-delay: calc(var(--i) * 60ms)" },
];

export function FavouriteRecipes() {
  const [saved, setSaved] = useState<{ name: string; value: string }[]>([]);
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const raw = localStorage.getItem("motif-recipes");
        if (raw) setSaved(JSON.parse(raw));
      } catch { /* noop */ }
    }, 0);
    return () => clearTimeout(t);
  }, []);
  const persist = (next: { name: string; value: string }[]) => {
    setSaved(next);
    try { localStorage.setItem("motif-recipes", JSON.stringify(next)); } catch { /* noop */ }
  };
  const add = (name: string, value: string) => {
    if (!saved.some((r) => r.name === name)) persist([...saved, { name, value }]);
  };
  return (
    <Frame id="favourite-recipes" title="Favourite recipes" blurb="Pin tuned outputs with a name — they persist in your browser for the next session.">
      <div className="flex flex-wrap gap-2">
        {PRESET_RECIPES.map((r) => (
          <button key={r.name} type="button" onClick={() => add(r.name, r.value)} className="chip cursor-pointer opacity-70 hover:opacity-100">+ {r.name}</button>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {saved.length === 0 && <p className="rounded-xl border border-dashed border-white/10 px-3 py-5 text-center text-xs text-ink-faint">No saved recipes yet — tap one of the presets above.</p>}
        {saved.map((r) => (
          <div key={r.name} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[.02] px-3 py-2">
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-bold text-ink">{r.name}</span>
              <span className="block truncate font-mono text-[10px] text-ink-faint">{r.value}</span>
            </span>
            <button type="button" onClick={() => persist(saved.filter((x) => x.name !== r.name))} className="chip cursor-pointer !text-danger hover:opacity-70">remove</button>
          </div>
        ))}
      </div>
      {saved.length > 0 && <CopyBox label="recipes.css" text={saved.map((r) => `/* ${r.name} */\n${r.value};`).join("\n\n")} />}
    </Frame>
  );
}

/* ---------- 16 · random inspiration button ---------- */

const INSPIRATIONS = [
  { name: "Midnight archive", note: "ink on bone, one amber", tokens: { bg: "#0c0d12", text: "#f5f1e8", accent: "#eab308" } },
  { name: "Salt & sage", note: "calm clinic, soft green", tokens: { bg: "#f4f1ea", text: "#22302a", accent: "#5f7f6a" } },
  { name: "Studio orange", note: "workshop energy, safety pop", tokens: { bg: "#141519", text: "#e8e6e1", accent: "#ff6b35" } },
  { name: "Porcelain", note: "quiet luxury, blue hour", tokens: { bg: "#10131c", text: "#e7ebf2", accent: "#7ba7d9" } },
  { name: "Tomato letter", note: "editorial print, sauce red", tokens: { bg: "#faf7f2", text: "#1c1917", accent: "#c2410c" } },
];

export function RandomInspiration() {
  const [idx, setIdx] = useState(0);
  const p = INSPIRATIONS[idx];
  return (
    <Frame id="random-inspiration" title="Random inspiration button" blurb="Stuck on a blank canvas? Shuffle a considered palette and start from somewhere real.">
      <button type="button" onClick={() => setIdx((i) => (i + 1) % INSPIRATIONS.length)} className="btn btn-primary !py-2 text-sm">🎲 Shuffle a starting point</button>
      <div className="mt-4 rounded-2xl border border-white/8 p-5" style={{ background: p.tokens.bg }}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-extrabold" style={{ color: p.tokens.text }}>{p.name}</p>
            <p className="text-xs opacity-70" style={{ color: p.tokens.text }}>{p.note}</p>
          </div>
          <span className="rounded-xl px-4 py-2 text-xs font-bold" style={{ background: p.tokens.accent, color: p.tokens.bg }}>CTA</span>
        </div>
      </div>
      <p className="mt-2 text-[11px] text-ink-faint">Preset {idx + 1} of {INSPIRATIONS.length} — every preset obeys the three-colour rule, so the start is never a mess.</p>
      <CopyBox label="inspiration.css" text={`:root {\n  --bg: ${p.tokens.bg};\n  --text: ${p.tokens.text};\n  --accent: ${p.tokens.accent};\n}`} />
    </Frame>
  );
}
