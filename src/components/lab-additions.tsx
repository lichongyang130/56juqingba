"use client";

/* ============================================================
   Motif UI — Lab additions (batch 1).
   Small, hand-built interactive tools that extend the Lab.
   Each is original, dependency-free, and exports real CSS.
   ============================================================ */

import Link from "next/link";
import { useRef, useState } from "react";

/* ---------- shared primitives ---------- */

export function Frame({ id, title, blurb, children }: { id: string; title: string; blurb: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-3xl border border-white/8 bg-panel p-6">
      {/* h2: every Frame is a top-level tool panel under the page h1. */}
      <h2 className="text-lg font-extrabold tracking-tight">{title}</h2>
      <p className="mt-1 text-xs leading-relaxed text-ink-dim">{blurb}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function Range({
  label, value, min, max, step = 1, onChange, unit = "", display,
}: {
  label: string; value: number; min: number; max: number; step?: number;
  onChange: (n: number) => void; unit?: string; display?: string;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between text-[11px] font-semibold text-ink-faint">
        <span>{label}</span>
        <span className="text-ink-dim">{display ?? `${value}${unit}`}</span>
      </span>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-[var(--accent,#8b5cf6)]"
      />
    </label>
  );
}

export function CopyBox({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-white/8 bg-[#07090f]">
      <div className="flex items-center justify-between border-b border-white/6 px-3 py-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">{label}</span>
        <button
          type="button"
          onClick={async () => {
            try { await navigator.clipboard.writeText(text); } catch { /* noop */ }
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }}
          className="btn btn-ghost !rounded-md !px-2.5 !py-0.5 !text-[10px]"
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-[11px] leading-relaxed text-cyan-100/85">
        <code>{text}</code>
      </pre>
    </div>
  );
}

function Phase({
  name, color, dur, onDur, ease, onEase,
}: {
  name: string; color: string; dur: number; onDur: (n: number) => void;
  ease: string; onEase: (s: string) => void;
}) {
  const eases = ["ease", "ease-out", "ease-in-out", "linear", "cubic-bezier(.16,1,.3,1)", "cubic-bezier(.55,0,1,.45)"];
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-white/6 bg-white/[.02] px-3 py-2.5">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} aria-hidden />
      <span className="w-14 text-[11px] font-bold uppercase tracking-wider text-ink-dim">{name}</span>
      <label className="flex items-center gap-2 text-[11px] text-ink-faint">
        <input type="range" min={100} max={1600} step={50} value={dur} onChange={(e) => onDur(Number(e.target.value))} className="w-28 accent-violet-400" />
        <span className="w-14 text-ink-dim">{dur}ms</span>
      </label>
      <select aria-label="Easing curve" value={ease} onChange={(e) => onEase(e.target.value)} className="rounded-lg border border-white/10 bg-[#0b0d14] px-2 py-1 text-[11px] text-ink-dim">
        {eases.map((x) => <option key={x} value={x}>{x}</option>)}
      </select>
    </div>
  );
}

/* ---------- 1 · timing-chart composer ---------- */

export function TimingComposer() {
  const [enter, setEnter] = useState(420);
  const [dwell, setDwell] = useState(900);
  const [exit, setExit] = useState(280);
  const [e1, setE1] = useState("cubic-bezier(.16,1,.3,1)");
  const [e2, setE2] = useState("ease-in-out");
  const [e3, setE3] = useState("cubic-bezier(.55,0,1,.45)");
  const [run, setRun] = useState(0);
  const total = enter + dwell + exit;
  const keyframes = `@keyframes motif-timing {\n  0%   { transform: translateX(0); opacity: 0; }\n  ${(enter / total) * 100}% { transform: translateX(60px); opacity: 1; }\n  ${((enter + dwell) / total) * 100}% { transform: translateX(60px); opacity: 1; }\n  100% { transform: translateX(0); opacity: 0; }\n}`;
  return (
    <Frame id="timing-composer" title="Timing-chart composer" blurb="Author an enter → dwell → exit timeline and read it as CSS keyframes.">
      <div className="space-y-2">
        <Phase name="Enter" color="#8b5cf6" dur={enter} onDur={setEnter} ease={e1} onEase={setE1} />
        <Phase name="Dwell" color="#34d399" dur={dwell} onDur={setDwell} ease={e2} onEase={setE2} />
        <Phase name="Exit" color="#fb7185" dur={exit} onDur={setExit} ease={e3} onEase={setE3} />
      </div>
      <button type="button" onClick={() => setRun((r) => r + 1)} className="btn btn-primary mt-4 !py-1.5 text-xs">
        ▶ Replay · {total}ms loop
      </button>
      <div className="relative mt-3 h-16 overflow-hidden rounded-xl border border-white/8 bg-[#07090f] px-3">
        <div className="absolute left-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-violet-400" aria-hidden />
        <style>{keyframes}</style>
        <div
          key={run}
          className="absolute left-3 top-1/2 h-8 w-8 -translate-y-1/2 rounded-lg bg-gradient-to-br from-violet-400/80 to-fuchsia-500/80 shadow-lg"
          style={{ animation: `motif-timing ${total}ms ${e1} ${run ? "" : "infinite"}` }}
        />
      </div>
      <CopyBox label="keyframes.css" text={`${keyframes}\n\n.timing {\n  animation: motif-timing ${total}ms;\n}`} />
    </Frame>
  );
}

/* ---------- 2 · stagger calculator ---------- */

export function StaggerCalculator() {
  const [n, setN] = useState(6);
  const [base, setBase] = useState(60);
  const [intervalMs, setIntervalMs] = useState(50);
  const items = Array.from({ length: Math.min(n, 24) }, (_, i) => base + i * intervalMs);
  return (
    <Frame id="stagger-calculator" title="Stagger calculator" blurb="Input N items and read the per-item delay offsets for one wave.">
      <div className="grid gap-4 sm:grid-cols-3">
        <Range label="Items (N)" value={n} min={2} max={24} onChange={setN} />
        <Range label="First delay" value={base} min={0} max={400} step={10} unit="ms" onChange={setBase} />
        <Range label="Step" value={intervalMs} min={10} max={200} step={10} unit="ms" onChange={setIntervalMs} />
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {items.map((d, i) => (
          <span key={i} className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-white/8 bg-white/[.03] px-1.5 font-mono text-[10px] text-violet-200/80" title={`item ${i + 1}`}>
            {d}
          </span>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-ink-faint">Wave length {base + (items.length - 1) * intervalMs}ms · per-item offsets in ms.</p>
      <CopyBox label="stagger.ts" text={`const items = [...document.querySelectorAll(".wave > *")];\nitems.forEach((el, i) => {\n  el.style.transitionDelay = \`${base + " + i * " + intervalMs}ms\`;\n});\n// or in CSS: transition-delay: ${items.slice(0, 3).join("ms, ")}ms…`} />
    </Frame>
  );
}

/* ---------- 3 · background-position painter ---------- */

export function BackgroundPainter() {
  const size = 240;
  const [a, setA] = useState("#8b5cf6");
  const [b, setB] = useState("#22d3ee");
  const [p1, setP1] = useState({ x: 0.15, y: 0.2 });
  const [p2, setP2] = useState({ x: 0.85, y: 0.8 });
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<1 | 2 | null>(null);
  const angle = Math.round((Math.atan2((p2.y - p1.y) * size, (p2.x - p1.x) * size) * 180) / Math.PI + 90);
  const css = `background: linear-gradient(${((angle % 360) + 360) % 360}deg, ${a} 0%, ${b} 100%);`;
  const update = (clientX: number, clientY: number) => {
    const r = ref.current!.getBoundingClientRect();
    const nx = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    const ny = Math.min(1, Math.max(0, (clientY - r.top) / r.height));
    if (drag.current === 1) setP1({ x: nx, y: ny });
    if (drag.current === 2) setP2({ x: nx, y: ny });
  };
  return (
    <Frame id="bg-position-painter" title="Background-position painter" blurb="Drag the two stops on the canvas; the gradient direction follows your hand.">
      <div className="flex flex-wrap items-start gap-4">
        <div
          ref={ref}
          className="relative h-44 w-64 cursor-crosshair touch-none overflow-hidden rounded-2xl border border-white/10 select-none"
          style={{ background: `linear-gradient(${((angle % 360) + 360) % 360}deg, ${a} 0%, ${b} 100%)` }}
          onPointerDown={(e) => {
            const r = ref.current!.getBoundingClientRect();
            const nx = (e.clientX - r.left) / r.width;
            const ny = (e.clientY - r.top) / r.height;
            drag.current = Math.hypot(nx - p1.x, ny - p1.y) <= Math.hypot(nx - p2.x, ny - p2.y) ? 1 : 2;
            update(e.clientX, e.clientY);
            (e.target as Element).setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => drag.current && update(e.clientX, e.clientY)}
          onPointerUp={() => (drag.current = null)}
        >
          {[p1, p2].map((p, i) => (
            <span key={i} className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow" style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%`, background: i === 0 ? a : b }} aria-hidden />
          ))}
        </div>
        <div className="grid flex-1 gap-3 text-[11px]">
          <label className="flex items-center justify-between gap-3 rounded-lg border border-white/6 px-3 py-2">
            <span className="font-semibold text-ink-faint">Stop A</span>
            <input type="color" value={a} onChange={(e) => setA(e.target.value)} className="h-6 w-12 cursor-pointer rounded border-0 bg-transparent" />
          </label>
          <label className="flex items-center justify-between gap-3 rounded-lg border border-white/6 px-3 py-2">
            <span className="font-semibold text-ink-faint">Stop B</span>
            <input type="color" value={b} onChange={(e) => setB(e.target.value)} className="h-6 w-12 cursor-pointer rounded border-0 bg-transparent" />
          </label>
          <p className="text-ink-faint">Direction angle ≈ <span className="font-mono text-ink-dim">{((angle % 360) + 360) % 360}°</span> · stops at ({Math.round(p1.x * 100)}%, {Math.round(p1.y * 100)}%) and ({Math.round(p2.x * 100)}%, {Math.round(p2.y * 100)}%).</p>
        </div>
      </div>
      <CopyBox label="background.css" text={css} />
    </Frame>
  );
}

/* ---------- 4 · text-animation lab ---------- */

const TEXT_EFFECTS: Record<string, (t: string) => string> = {
  scramble: (t) => t.split("").map((c, i) => `<span class="sc-char" style="animation-delay:${i * 22}ms">${c}</span>`).join(""),
  typewriter: (t) => `<span class="tw-caret">${t}</span>`,
  wipe: (t) => `<span class="wp-fill">${t}</span>`,
};

export function TextAnimationLab() {
  const [text, setText] = useState("Copy less. Ship more.");
  const [mode, setMode] = useState<keyof typeof TEXT_EFFECTS>("scramble");
  const sample = text || "Type something…";
  return (
    <Frame id="text-animation-lab" title="Text-animation lab" blurb="Compare scramble, typewriter and wipe on your own copy before choosing.">
      <div className="flex flex-wrap gap-2">
        {(["scramble", "typewriter", "wipe"] as const).map((m) => (
          <button key={m} type="button" onClick={() => setMode(m)} className={`chip cursor-pointer ${mode === m ? "!bg-violet-400/20 !text-violet-200" : "opacity-60 hover:opacity-100"}`}>
            {m}
          </button>
        ))}
      </div>
      <input value={text} onChange={(e) => setText(e.target.value)} aria-label="Headline text to animate"
      placeholder="Your headline…" className="mt-3 w-full rounded-xl border border-white/10 bg-[#0b0d14] px-3 py-2 text-sm text-ink" />
      <div className="mt-3 overflow-hidden rounded-xl border border-white/8 bg-[#07090f] p-4">
        <div
          key={mode + sample.slice(0, 4)}
          className={`text-xl font-extrabold ${mode === "typewriter" ? "animate-pulse" : ""}`}
          dangerouslySetInnerHTML={{ __html: TEXT_EFFECTS[mode](sample) }}
        />
      </div>
      <style>{`
        .sc-char { display: inline-block; opacity: 0; animation: sc-in .5s forwards; }
        @keyframes sc-in { 0% { opacity: 0; transform: translateY(4px); } 30% { opacity: 1; } 100% { opacity: 1; transform: none; } }
        .tw-caret { border-right: 2px solid #8b5cf6; padding-right: 2px; animation: tw-blink 1s steps(1) infinite; }
        @keyframes tw-blink { 50% { border-color: transparent; } }
        .wp-fill { background: linear-gradient(90deg, #8b5cf6, #22d3ee); background-clip: text; -webkit-background-clip: text; color: transparent; }
      `}</style>
      <p className="mt-2 text-[11px] text-ink-faint">Tip: scramble suits short claims, typewriter suits code/terminal scenes, wipe suits hero moments. See the library&apos;s <Link className="text-violet-300 underline-offset-2 hover:underline" href="/components/scramble-text">scramble-text</Link> and <Link className="text-violet-300 underline-offset-2 hover:underline" href="/components/wipe-reveal">wipe-reveal</Link>.</p>
    </Frame>
  );
}

/* ---------- 5 · colour-ramp checker ---------- */

function lin(c: number) { const s = c / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); }
function lum(hex: string) {
  const h = hex.replace("#", "");
  if (h.length !== 6) return 1;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
function ratio(hexA: string, hexB: string) {
  const la = lum(hexA), lb = lum(hexB);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export function ColourRampChecker() {
  const [base, setBase] = useState("#6366f1");
  const [steps, setSteps] = useState(7);
  const stops = Array.from({ length: steps }, (_, i) => {
    const t = steps === 1 ? 0.5 : i / (steps - 1);
    const f = (c: number) => Math.round(c + (t - 0.5) * 220);
    const b = base.replace("#", "");
    const r = f(parseInt(b.slice(0, 2), 16));
    const g = f(parseInt(b.slice(2, 4), 16));
    const gg = f(parseInt(b.slice(4, 6), 16));
    const hex = "#" + [r, g, gg].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("");
    const rBg = ratio(hex, "#0b0d14");
    return { hex, rBg, aa: rBg >= 4.5, aaLarge: rBg >= 3 };
  });
  return (
    <Frame id="colour-ramp-checker" title="Colour-ramp checker" blurb="Build an accessible ramp — every step is measured against the dark surface, live.">
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-[11px] text-ink-faint">
          Ramp base
          <input type="color" value={base} onChange={(e) => setBase(e.target.value)} className="h-7 w-12 cursor-pointer rounded border-0 bg-transparent" />
        </label>
        <Range label="Steps" value={steps} min={3} max={11} onChange={setSteps} />
      </div>
      <div className="mt-4 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${steps}, minmax(0,1fr))` }}>
        {stops.map((s, i) => (
          <div key={i} className="rounded-lg text-center" style={{ background: s.hex }}>
            <div className="rounded-lg px-1 py-6" style={{ background: s.hex }}>
              <span className="font-mono text-[9px]" style={{ color: i < steps / 2 ? "#ffffffcc" : "#0b0d14" }}>{s.hex}</span>
            </div>
            <div className="mt-1 text-center text-[9px] font-bold text-ink-dim">
              {s.aa ? "AA ✓" : s.aaLarge ? "large" : "✗"}
              <span className="ml-1 font-mono font-normal opacity-70">{s.rBg.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
      <CopyBox label="ramp.css" text={`:root {\n${stops.map((s, i) => `  --ramp-${i}: ${s.hex}; /* ${s.rBg.toFixed(2)}:1 on dark */`).join("\n")}\n}`} />
    </Frame>
  );
}

/* ---------- 6 · border-radius playground ---------- */

export function RadiusPlayground() {
  const [tl, setTl] = useState(24); const [tr, setTr] = useState(8);
  const [br, setBr] = useState(24); const [bl, setBl] = useState(8);
  return (
    <Frame id="radius-playground" title="Border-radius playground" blurb="Asymmetric radii with a live preview and Tailwind-ready output.">
      <div className="grid gap-4 sm:grid-cols-4">
        <Range label="Top-left" value={tl} min={0} max={80} onChange={setTl} unit="px" />
        <Range label="Top-right" value={tr} min={0} max={80} onChange={setTr} unit="px" />
        <Range label="Bottom-right" value={br} min={0} max={80} onChange={setBr} unit="px" />
        <Range label="Bottom-left" value={bl} min={0} max={80} onChange={setBl} unit="px" />
      </div>
      <div className="mt-4 h-36 rounded-2xl border border-white/8 bg-[#07090f] p-5">
        <div className="h-full w-full bg-gradient-to-br from-violet-400/25 to-cyan-400/20" style={{ borderRadius: `${tl}px ${tr}px ${br}px ${bl}px` }} />
      </div>
      <p className="mt-2 text-[11px] text-ink-faint">Asymmetric corners give cards direction — large top corners make a card read as &quot;opening downward&quot;.</p>
      <CopyBox label="tailwind" text={`className="rounded-[${tl}px_${tr}px_${br}px_${bl}px]"`} />
    </Frame>
  );
}

/* ---------- 7 · shadow stacker ---------- */

export function ShadowStacker() {
  const [layers, setLayers] = useState([
    { y: 1, blur: 2, alpha: 0.06 },
    { y: 4, blur: 12, alpha: 0.1 },
    { y: 16, blur: 32, alpha: 0.12 },
  ]);
  const set = (i: number, patch: Partial<(typeof layers)[number]>) =>
    setLayers(layers.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  const css = `box-shadow: ${layers.map((l) => `0 ${l.y}px ${l.blur}px rgb(0 0 0 / ${l.alpha})`).join(", ")};`;
  return (
    <Frame id="shadow-stacker" title="Shadow stacker" blurb="Stack up to three layers and read the combined elevation as one CSS value.">
      {layers.map((l, i) => (
        <div key={i} className="mb-3 grid gap-3 rounded-xl border border-white/6 bg-white/[.02] p-3 sm:grid-cols-3">
          <Range label={`Layer ${i + 1} · Y`} value={l.y} min={0} max={40} onChange={(n) => set(i, { y: n })} unit="px" />
          <Range label="Blur" value={l.blur} min={0} max={80} onChange={(n) => set(i, { blur: n })} unit="px" />
          <Range label="Alpha" value={Math.round(l.alpha * 100)} min={0} max={50} onChange={(n) => set(i, { alpha: n / 100 })} unit="%" />
        </div>
      ))}
      <div className="flex gap-4 rounded-2xl border border-white/8 bg-[#07090f] p-6">
        <div className="h-24 w-full rounded-2xl bg-[#151720]" style={{ boxShadow: layers.map((l) => `0 ${l.y}px ${l.blur}px rgb(0 0 0 / ${l.alpha})`).join(", ") }} />
      </div>
      <CopyBox label="shadow.css" text={css} />
    </Frame>
  );
}

/* ---------- 8 · filter (blur / brightness) lab ---------- */

export function FilterLab() {
  const [blur, setBlur] = useState(0);
  const [bright, setBright] = useState(100);
  const [sat, setSat] = useState(100);
  const [contrast, setContrast] = useState(100);
  const filter = `blur(${blur}px) brightness(${bright}%) saturate(${sat}%) contrast(${contrast}%)`;
  return (
    <Frame id="filter-lab" title="Filter lab" blurb="Single-filter previews on a synthetic test card — no stock photo required.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Range label="Blur" value={blur} min={0} max={16} onChange={setBlur} unit="px" />
        <Range label="Brightness" value={bright} min={20} max={180} onChange={setBright} unit="%" />
        <Range label="Saturation" value={sat} min={0} max={200} onChange={setSat} unit="%" />
        <Range label="Contrast" value={contrast} min={20} max={200} onChange={setContrast} unit="%" />
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/8 bg-[#07090f] p-6" style={{ filter }}>
        <div className="h-24 rounded-xl bg-gradient-to-r from-amber-300 via-rose-400 to-violet-500" />
        <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] font-bold uppercase tracking-wider text-white">
          <span className="rounded-lg bg-cyan-400/80 px-2 py-3">Sharp text sample</span>
          <span className="rounded-lg bg-emerald-400/80 px-2 py-3">Mid tone block</span>
          <span className="rounded-lg bg-fuchsia-400/80 px-2 py-3">Accent chip</span>
        </div>
      </div>
      <CopyBox label="filter.css" text={filter === "blur(0px) brightness(100%) saturate(100%) contrast(100%)" ? "/* no filters applied — the card is clean */" : `filter: ${filter};`} />
    </Frame>
  );
}
