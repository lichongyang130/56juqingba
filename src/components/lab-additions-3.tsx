"use client";

/* ============================================================
   Motif UI — Lab additions (batch 3).
   The remaining four system tools: typing calibration,
   icon strokes, logo drift with safe zones, and a diff viewer.
   ============================================================ */

import { useState } from "react";
import { CopyBox, Frame, Range } from "@/components/lab-additions";

/* ---------- 17 · typing-speed meter ---------- */

export function TypingSpeedMeter() {
  const [chars, setChars] = useState(42);
  const [wpm, setWpm] = useState(35);
  const [rerun, setRerun] = useState(0);
  const cpm = wpm * 5;
  const interval = Math.round(60000 / cpm);
  const duration = Math.max(300, Math.round((chars / cpm) * 60000));
  const css = `width: 0;\noverflow: hidden;\nwhite-space: nowrap;\nanimation: typing ${duration}ms steps(${chars}) forwards;\n\n@keyframes typing { to { width: 100%; } }`;
  return (
    <Frame id="typing-speed-meter" title="Typing-speed meter" blurb="Calibrate a typewriter demo: your copy length against a believable words-per-minute pace.">
      <div className="grid gap-4 sm:grid-cols-3">
        <Range label="Copy length" value={chars} min={8} max={240} onChange={setChars} unit=" chars" />
        <Range label="Pace" value={wpm} min={15} max={90} onChange={setWpm} unit=" wpm" />
        <label className="flex items-center justify-between text-[11px] font-semibold text-ink-faint">
          <span>Duration</span>
          <span className="font-mono text-ink-dim">{(duration / 1000).toFixed(1)}s</span>
        </label>
      </div>
      <button type="button" onClick={() => setRerun((r) => r + 1)} className="btn btn-primary mt-4 !py-1.5 text-xs">▶ Preview · {interval}ms per char</button>
      <div className="mt-3 overflow-hidden rounded-xl border border-white/8 bg-[#07090f] p-4 font-mono text-sm text-emerald-200">
        <div key={rerun} className="whitespace-nowrap" style={{ width: 0, overflow: "hidden", animation: `typing-${rerun} ${duration}ms steps(${chars}) forwards` }}>
          {("A".repeat(Math.max(1, Math.min(chars, 90)))).slice(0, chars)}{"▍"}
        </div>
        <style>{`@keyframes typing-${rerun} { to { width: 100%; } }`}</style>
      </div>
      <p className="mt-2 text-[11px] text-ink-faint">At {wpm} wpm a real typist lands ≈ {Math.max(1, Math.round((chars / 5 / (wpm / 60)) * 10) / 10)}s on {chars} characters — anything faster than that reads as telepathy, not typing.</p>
      <CopyBox label="typewriter.css" text={css} />
    </Frame>
  );
}

/* ---------- 18 · icon line-weight lab ---------- */

const ICONS: Record<string, string> = {
  search: "M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z",
  heart: "M12 21s-7.5-4.9-9.7-9.1C.6 8.6 2.4 5 6 5c2.2 0 3.6 1.2 4.4 2.5h3.2C14.4 6.2 15.8 5 18 5c3.6 0 5.4 3.6 3.7 6.9C19.5 16.1 12 21 12 21z",
  bolt: "M13 2L4 14h6l-1 8 9-12h-6l1-8z",
  send: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  star: "M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.4 5.8 20.9l1.6-7L2 9.2l7.1-.6L12 2z",
};

export function IconLineWeightLab() {
  const [width, setWidth] = useState(2);
  const [round, setRound] = useState(1);
  return (
    <Frame id="icon-line-weight-lab" title="Icon line-weight lab" blurb="Stroke width and cap roundness across the icon set, tuned as one family.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Range label="Stroke width" value={width} min={0.75} max={4} step={0.25} onChange={setWidth} unit="px" />
        <Range label="Corner roundness" value={round} min={0} max={1} step={0.25} onChange={setRound} display={round === 0 ? "butt / sharp" : round === 1 ? "round / soft" : `${Math.round(round * 100)}%`} />
      </div>
      <div className="mt-4 grid grid-cols-5 gap-2 rounded-2xl border border-white/8 bg-[#07090f] p-4">
        {Object.entries(ICONS).map(([name, d]) => (
          <div key={name} className="flex flex-col items-center gap-1 rounded-xl p-2 hover:bg-white/[.03]">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap={round ? "round" : "butt"} strokeLinejoin={round ? "round" : "miter"}>
              <path d={d} />
            </svg>
            <span className="text-[9px] uppercase tracking-wider text-ink-faint">{name}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-ink-faint">A family should share one stroke weight and one cap style — mixing 1.5px and 3px icons in one UI is the fastest way to look unfinished.</p>
      <CopyBox label="icon-attrs" text={`<svg fill="none" stroke="currentColor"\n     strokeWidth="${width}"\n     strokeLinecap="${round ? "round" : "butt"}"\n     strokeLinejoin="${round ? "round" : "miter"}">`} />
    </Frame>
  );
}

/* ---------- 19 · logo-drift preview ---------- */

export function LogoDriftPreview() {
  const [drift, setDrift] = useState(10);
  const [dur, setDur] = useState(6);
  const [axis, setAxis] = useState<"x" | "y">("x");
  const [run, setRun] = useState(0);
  const css = `@keyframes drift {\n  0%, 100% { transform: translate${axis.toUpperCase()}(${axis === "x" ? `-${drift}` : drift}px); }\n  50% { transform: translate${axis.toUpperCase()}(${axis === "x" ? drift : `-${drift}`}px); }\n}`;
  return (
    <Frame id="logo-drift-preview" title="Logo-drift preview" blurb="Preview a drifting logo inside its safe zone — the guides keep the drift honest.">
      <div className="grid gap-4 sm:grid-cols-3">
        <Range label="Drift" value={drift} min={0} max={40} onChange={setDrift} unit="px" />
        <Range label="Cycle" value={dur} min={2} max={20} onChange={setDur} unit="s" />
        <div className="flex items-center gap-2">
          {(["x", "y"] as const).map((a) => (
            <button key={a} type="button" onClick={() => setAxis(a)} className={`chip cursor-pointer ${axis === a ? "!bg-violet-400/20 !text-violet-200" : "opacity-60 hover:opacity-100"}`}>axis {a}</button>
          ))}
        </div>
      </div>
      <button type="button" onClick={() => setRun((r) => r + 1)} className="btn btn-primary mt-4 !py-1.5 text-xs">▶ Play drift</button>
      <div className="relative mt-3 h-28 overflow-hidden rounded-2xl border border-dashed border-white/15 bg-[#07090f]">
        {Array.from({ length: axis === "x" ? 5 : 3 }, (_, i) => (
          <span key={i} className="pointer-events-none absolute border-l border-white/5" style={{ left: `${(i + 1) * (100 / (axis === "x" ? 6 : 4))}%`, top: 0, bottom: 0 }} aria-hidden />
        ))}
        <div className="flex h-full items-center justify-center">
          <style>{css}</style>
          <div key={`${run}-${drift}-${axis}`} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[.04] px-6 py-3" style={{ animation: `drift ${dur}s ease-in-out infinite` }}>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-400 to-fuchsia-500 text-xs font-black text-white">M</span>
            <span className="text-lg font-extrabold tracking-tight text-white">motif</span>
          </div>
        </div>
        <span className="absolute bottom-1.5 left-2 text-[9px] uppercase tracking-widest text-ink-faint">safe zone · keep the mark inside the dashes</span>
      </div>
      <CopyBox label="logo-drift.css" text={css} />
    </Frame>
  );
}

/* ---------- 20 · diff viewer ---------- */

export function DiffViewer() {
  const [mode, setMode] = useState<"gradient" | "easing">("gradient");
  const [ga, setGa] = useState("linear-gradient(135deg, #8b5cf6, #22d3ee)");
  const [gb, setGb] = useState("linear-gradient(135deg, #0ea5e9, #34d399)");
  const [ea, setEa] = useState("cubic-bezier(.16, 1, .3, 1)");
  const [eb, setEb] = useState("cubic-bezier(.55, 0, 1, .45)");
  const a = mode === "gradient" ? ga : ea;
  const b = mode === "gradient" ? gb : eb;
  const setA = (v: string) => (mode === "gradient" ? setGa(v) : setEa(v));
  const setB = (v: string) => (mode === "gradient" ? setGb(v) : setEb(v));
  return (
    <Frame id="diff-viewer" title="Diff viewer" blurb="Paste two exports side by side; the loop scrubs a mid-frame so the difference is visible, not theoretical.">
      <div className="flex flex-wrap gap-2">
        {(["gradient", "easing"] as const).map((m) => (
          <button key={m} type="button" onClick={() => setMode(m)} className={`chip cursor-pointer ${mode === m ? "!bg-cyan-400/20 !text-cyan-200" : "opacity-60 hover:opacity-100"}`}>{m} compare</button>
        ))}
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Export A</span>
          <textarea value={a} onChange={(e) => setA(e.target.value)} rows={mode === "gradient" ? 2 : 4} className="mt-1 w-full rounded-xl border border-white/10 bg-[#0b0d14] px-3 py-2 font-mono text-[10px] text-ink-dim" />
        </label>
        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Export B</span>
          <textarea value={b} onChange={(e) => setB(e.target.value)} rows={mode === "gradient" ? 2 : 4} className="mt-1 w-full rounded-xl border border-white/10 bg-[#0b0d14] px-3 py-2 font-mono text-[10px] text-ink-dim" />
        </label>
      </div>
      {mode === "gradient" ? (
        <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="h-20 rounded-xl border border-white/10" style={{ background: a }} />
          <div className="relative h-20 w-24 overflow-hidden rounded-xl border border-white/10">
            <div className="absolute inset-0" style={{ background: a }} />
            <div className="absolute inset-0" style={{ background: b, animation: "diff-a 2.4s ease-in-out infinite" }} />
            <style>{`@keyframes diff-a { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }`}</style>
            <span className="absolute bottom-1 left-1 text-[9px] font-bold uppercase text-white mix-blend-difference">mid</span>
          </div>
          <div className="h-20 rounded-xl border border-white/10" style={{ background: b }} />
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-3 items-center gap-3 rounded-xl border border-white/8 bg-[#0b0d14] p-3">
          {[a, b].map((v, i) => {
            const m = v.match(/[\d.]+/g)?.slice(0, 4).map(Number) ?? [0.25, 0.8, 0.3, 1];
            return (
              <div key={i} className="col-span-1">
                <svg viewBox="0 0 100 60" className="h-20 w-full">
                  <path d={`M 0 55 C ${m[0] * 100} ${55 - m[1] * 50}, ${m[2] * 100} ${55 - m[3] * 50}, 100 5`} fill="none" stroke={i === 0 ? "#8b5cf6" : "#22d3ee"} strokeWidth="2" />
                </svg>
              </div>
            );
          })}
          <div className="col-span-1 flex h-20 items-center justify-center gap-1 text-[10px] font-bold text-ink-faint">
            <span className="text-violet-300">A</span>
            <span className="mx-1 text-ink-faint">vs</span>
            <span className="text-cyan-300">B</span>
          </div>
        </div>
      )}
      <p className="mt-2 text-[11px] text-ink-faint">{mode === "gradient" ? "The middle pane cross-fades between the two exports so you can see the frame where they are indistinguishable." : "Curves overlaid on the same axes: A starts faster and settles; B holds mid-speed longer."}</p>
    </Frame>
  );
}
