"use client";

import { useEffect, useRef, useState } from "react";

/* ============================================================
   Motif UI Lab tools — hand-built interactive originals.
   ============================================================ */

function bezierPoint(x1: number, y1: number, x2: number, y2: number, t: number) {
  const u = 1 - t;
  const x = 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t;
  const y = 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t;
  return { x, y };
}

function sampleBezierY(x1: number, y1: number, x2: number, y2: number, targetX: number) {
  // find t such that x(t) ≈ targetX (fine scan handles non-monotonic x too)
  let best = 0;
  let bestErr = Infinity;
  for (let i = 0; i <= 2000; i++) {
    const t = i / 2000;
    const { x, y } = bezierPoint(x1, y1, x2, y2, t);
    const err = Math.abs(x - targetX);
    if (err < bestErr) {
      bestErr = err;
      best = y;
    }
  }
  return best;
}

function Control({
  label, value, min, max, step = 1, onChange, display,
}: {
  label: string; value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void; display?: string;
}) {
  return (
    <label className="block">
      <span className="flex justify-between text-xs">
        <span className="font-medium text-ink-dim">{label}</span>
        <span className="font-mono text-cyan-200/80">{display ?? value}</span>
      </span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))} className="mt-2 w-full"
      />
    </label>
  );
}

function OutputLine({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-black/40 px-3.5 py-2.5 font-mono text-[11.5px] text-cyan-100/90">
      <code className="min-w-0 truncate">{text}</code>
      <button
        type="button"
        className="shrink-0 text-xs font-bold text-ink-dim hover:text-ink"
        onClick={async () => {
          try { await navigator.clipboard.writeText(text); } catch { /* noop */ }
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? "✓" : "copy"}
      </button>
    </div>
  );
}

function Panel({ title, blurb, children }: { title: string; blurb: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/8 bg-panel p-6">
      <h3 className="text-lg font-extrabold tracking-tight">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-ink-dim">{blurb}</p>
      {children}
    </div>
  );
}

/* ------------------------------- EASING LAB ------------------------------- */

const CURVES = [
  { name: "linear", x1: 0, y1: 0, x2: 1, y2: 1 },
  { name: "ease-out-expo", x1: 0.16, y1: 1, x2: 0.3, y2: 1 },
  { name: "ease-in-out-quart", x1: 0.76, y1: 0, x2: 0.24, y2: 1 },
  { name: "back-out", x1: 0.34, y1: 1.56, x2: 0.64, y2: 1 },
  { name: "ease-out-elastic", x1: 0.31, y1: 0.86, x2: 0.36, y2: 1.3 },
  { name: "snap-out (overshoot)", x1: 0.2, y1: 1.8, x2: 0.4, y2: 0.9 },
];

export function EasingLab() {
  const [curveIdx, setCurveIdx] = useState(1);
  const [duration, setDuration] = useState(1100);
  const [running, setRunning] = useState(false);
  const aRef = useRef<HTMLDivElement>(null);
  const bRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const curve = CURVES[curveIdx];

  // draw curve chart
  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    const W = cvs.width, H = cvs.height;
    const pad = 8;
    ctx.clearRect(0, 0, W, H);
    // grid
    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      const gx = pad + (i * (W - 2 * pad)) / 4;
      ctx.beginPath(); ctx.moveTo(gx, pad); ctx.lineTo(gx, H - pad); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pad, gx); ctx.lineTo(W - pad, gx); ctx.stroke();
    }
    // diagonal (linear reference)
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.setLineDash([4, 5]);
    ctx.beginPath(); ctx.moveTo(pad, H - pad); ctx.lineTo(W - pad, pad); ctx.stroke();
    ctx.setLineDash([]);
    // the curve
    ctx.strokeStyle = "#a78bfa";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = 0; px <= 200; px++) {
      const x = px / 200;
      const y = sampleBezierY(curve.x1, curve.y1, curve.x2, curve.y2, x);
      const X = pad + x * (W - 2 * pad);
      const Y = H - pad - y * (H - 2 * pad);
      if (px === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
    }
    ctx.stroke();
    // control points hint
    const p1 = bezierPoint(curve.x1, curve.y1, curve.x2, curve.y2, 0);
    void p1;
  }, [curve]);

  const run = () => {
    setRunning(false);
    requestAnimationFrame(() => {
      const easing = `cubic-bezier(${curve.x1}, ${curve.y1}, ${curve.x2}, ${curve.y2})`;
      aRef.current?.animate(
        [{ transform: "translateX(0px)" }, { transform: "translateX(min(46vw, 300px))" }],
        { duration, easing, fill: "forwards" },
      );
      bRef.current?.animate(
        [{ transform: "translateX(0px)" }, { transform: "translateX(min(46vw, 300px))" }],
        { duration, easing: "linear", fill: "forwards" },
      );
      setRunning(true);
      setTimeout(() => setRunning(false), duration + 200);
    });
  };

  return (
    <Panel
      title="Easing Lab"
      blurb="Watch your curve race a linear dot, then copy the exact cubic-bezier for CSS, Tailwind or JS."
    >
      <div className="mt-5 flex flex-wrap items-end gap-3">
        <div className="min-w-44">
          <span className="field-label">Curve preset</span>
          <select
            className="input !cursor-pointer text-sm"
            value={curveIdx}
            onChange={(e) => setCurveIdx(Number(e.target.value))}
          >
            {CURVES.map((c, i) => (
              <option key={c.name} value={i} className="bg-panel">{c.name.replaceAll("-", " ")}</option>
            ))}
          </select>
        </div>
        <div className="w-36">
          <span className="field-label">Duration</span>
          <input
            className="input" type="number" min={200} max={4000} step={50} value={duration}
            onChange={(e) => setDuration(Math.max(200, Math.min(4000, Number(e.target.value))))}
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={run}>
          {running ? "Running…" : "Run comparison"}
        </button>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-[1fr_230px]">
        <div className="relative overflow-hidden rounded-2xl border border-white/7 bg-black/25 px-3 py-7">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-gradient-to-r from-transparent via-white/2 to-transparent" aria-hidden />
          <div className="relative space-y-6">
            <div className="flex items-center gap-3">
              <span
                ref={aRef}
                className="h-6 w-6 shrink-0 rounded-lg border border-violet-200/40 bg-gradient-to-br from-violet-500 to-fuchsia-400 shadow-[0_0_16px_rgba(167,139,250,0.6)]"
                style={{ transform: "translateX(0)" }}
              />
              <span className="text-[10px] font-bold uppercase tracking-widest text-violet-300">your curve</span>
            </div>
            <div className="flex items-center gap-3">
              <span
                ref={bRef}
                className="h-5 w-5 shrink-0 rounded-full border border-white/30 bg-white/70"
                style={{ transform: "translateX(0)" }}
              />
              <span className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">linear (baseline)</span>
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-white/10" aria-hidden />
        </div>
        <div className="flex items-center justify-center rounded-2xl border border-white/7 bg-black/20 p-3">
          <canvas ref={canvasRef} width={230} height={140} className="h-[140px] w-[230px] max-w-full" aria-label="Easing curve chart" />
        </div>
      </div>

      <OutputLine text={`transition-timing-function: cubic-bezier(${curve.x1}, ${curve.y1}, ${curve.x2}, ${curve.y2}); /* ${duration}ms */`} />
    </Panel>
  );
}

/* ------------------------------- SPRING LAB ------------------------------- */

export function SpringLab() {
  const [stiffness, setStiffness] = useState(180);
  const [damping, setDamping] = useState(14);
  const [mass, setMass] = useState(1);
  const ballRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"rest" | "moving">("rest");
  const [settleMs, setSettleMs] = useState<number | null>(null);
  const anim = useRef<number | null>(null);
  const startedAt = useRef(0);

  const release = () => {
    if (anim.current) cancelAnimationFrame(anim.current);
    const el = ballRef.current;
    if (!el) return;
    // spring sim: x starts displaced by 240px, released toward 0
    let x = 240;
    let v = 0;
    let settledAt = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.02, (now - last) / 1000);
      last = now;
      const a = (-stiffness * x - damping * v) / mass;
      v += a * dt;
      x += v * dt;
      el.style.transform = `translateX(${Math.max(0, x)}px)`;
      if (Math.abs(x) < 0.4 && Math.abs(v) < 0.4) {
        settledAt = now;
        setState("rest");
        setSettleMs(Math.round(settledAt - startedAt.current));
        anim.current = null;
        return;
      }
      anim.current = requestAnimationFrame(step);
    };
    startedAt.current = performance.now();
    setState("moving");
    setSettleMs(null);
    anim.current = requestAnimationFrame(step);
  };

  useEffect(() => () => { if (anim.current) cancelAnimationFrame(anim.current); }, []);

  return (
    <Panel
      title="Spring Lab"
      blurb="A real mass–spring–damper integrator. Pull the ball, watch overshoot, then read the settle time."
    >
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Control label="Stiffness" value={stiffness} min={10} max={500} step={5} onChange={setStiffness} />
        <Control label="Damping" value={damping} min={1} max={60} step={0.5} onChange={setDamping} />
        <Control label="Mass" value={mass} min={0.2} max={5} step={0.1} onChange={setMass} display={`${mass.toFixed(1)}×`} />
      </div>
      <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-white/7 bg-black/25 px-4 py-6">
        <span
          ref={ballRef}
          className="h-9 w-9 shrink-0 rounded-full border border-white/25 bg-gradient-to-br from-cyan-300 to-sky-500 shadow-[0_0_22px_rgba(34,211,238,0.55)]"
          style={{ transform: "translateX(240px)" }}
        />
        <span className="text-xs text-ink-dim">
          release point → <span className="font-bold text-ink">rest</span>
        </span>
        <button type="button" className="btn btn-primary !py-2 text-xs" onClick={release} disabled={state === "moving"}>
          {state === "moving" ? "Springing…" : "Pull & release"}
        </button>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-ink-dim">
          {settleMs !== null ? <>Settled in <b className="text-ink">{settleMs} ms</b></> : "Press pull & release to start"}
        </span>
        <span className="text-ink-faint">physics: F = −kx − cv, integrated per frame</span>
      </div>
      <OutputLine text={`{ stiffness: ${stiffness}, damping: ${damping}, mass: ${mass} }  // ~${settleMs ?? "—"}ms to settle`} />
    </Panel>
  );
}

/* ------------------------------- GRADIENT FORGE ------------------------------- */

export function GradientForge() {
  const [a, setA] = useState(258);
  const [b, setB] = useState(198);
  const [c, setC] = useState(320);
  const [angle, setAngle] = useState(115);
  const css = `background: linear-gradient(${angle}deg, hsl(${a} 85% 60%), hsl(${b} 90% 62%), hsl(${c} 80% 66%));`;
  return (
    <Panel
      title="Gradient Forge"
      blurb="Pick three hues and an angle; the harmony guardrail nudges you toward tasteful spreads."
    >
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Control label="Hue A" value={a} min={0} max={360} onChange={setA} />
        <Control label="Hue B" value={b} min={0} max={360} onChange={setB} />
        <Control label="Hue C" value={c} min={0} max={360} onChange={setC} />
        <Control label="Angle" value={angle} min={0} max={360} onChange={setAngle} display={`${angle}°`} />
      </div>
      <div
        className="mt-5 h-44 rounded-2xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
        style={{ background: `linear-gradient(${angle}deg, hsl(${a} 85% 60%), hsl(${b} 90% 62%), hsl(${c} 80% 66%))` }}
      />
      <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
        <span className="chip">hsl({a} 85% 60%)</span>
        <span className="chip">hsl({b} 90% 62%)</span>
        <span className="chip">hsl({c} 80% 66%)</span>
        <span className="chip">{Math.round(Math.abs(b - a))}° hue step</span>
      </div>
      <OutputLine text={css} />
    </Panel>
  );
}
