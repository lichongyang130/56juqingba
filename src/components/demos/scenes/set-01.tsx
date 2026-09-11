"use client";

// Scene set 1 of 7 — ELEMENTS, BACKGROUNDS AND THE FIRST WIDGETS.
//
// Loaded on demand: a page that renders one demo downloads the set that
// holds it (plus the shared kit), not the other 188 scenes. The registry in
// ../Demo.tsx is the only thing that knows where each key lives.
import { useEffect, useRef, useState } from "react";
import { useSceneMotion, type DemoProps } from "../scene-kit";
import { PROMPTS } from "@/lib/data";

const VERIFIED_PROMPTS = PROMPTS.filter((p) => p.status === "verified" || p.status === "featured").length;

/* ------------------------------ ELEMENTS ------------------------------ */


export function PrismSwitch({ size = 42, hueSpeed = 1.4 }: DemoProps) {
  const [on, setOn] = useState(true);
  const s = typeof size === "number" ? size : 42;
  const dur = typeof hueSpeed === "number" ? hueSpeed : 1.4;
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => setOn(!on)}
        className="relative shrink-0 cursor-pointer transition-transform active:scale-95"
        style={{ width: s * 2, height: s }}
      >
        <span
          className="absolute inset-0 rounded-full border border-white/15"
          style={{
            background: on
              ? "linear-gradient(90deg,#7c3aed,#6366f1,#0ea5e9,#06b6d4,#34d399,#f472b6,#7c3aed)"
              : "rgba(255,255,255,0.07)",
            backgroundSize: "300% 100%",
            transition: `background 0.4s ease`,
            animation: on ? `mf-glow 4s ease-in-out infinite, prism-sweep ${dur}s linear infinite` : undefined,
          }}
        />
        <style>{`@keyframes prism-sweep { from { background-position: 0% 0 } to { background-position: 300% 0 } }`}</style>
        <span
          className="absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-all duration-300"
          style={{
            width: s * 0.42,
            height: s * 0.42,
            left: on ? `calc(100% - ${s * 0.42 + s * 0.08}px)` : s * 0.08,
            boxShadow: on ? "0 0 18px rgba(139,92,246,0.9)" : "0 2px 8px rgba(0,0,0,.5)",
          }}
        />
      </button>
      <span className="text-sm font-semibold text-ink-dim">Prism is {on ? "on" : "off"}</span>
    </div>
  );
}


export function HaloButton({ magnet = 24, glow = 70 }: DemoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [down, setDown] = useState(false);
  const mag = typeof magnet === "number" ? magnet : 24;
  const gl = typeof glow === "number" ? glow : 70;
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };
  return (
    <div ref={ref} onMouseMove={onMove} className="flex items-center justify-center py-8">
      <button
        type="button"
        onMouseDown={() => setDown(true)}
        onMouseUp={() => setDown(false)}
        onMouseLeave={() => setDown(false)}
        className="btn btn-primary relative overflow-hidden px-9 py-4 text-base"
        style={{
          transform: down
            ? "translate(0,1px) scale(0.98)"
            : `translate(${((pos.x - 50) / 100) * (mag * 0.12)}px, ${((pos.y - 50) / 100) * (mag * 0.12)}px)`,
          transition: "transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .3s ease",
        }}
      >
        <span
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(220px circle at ${pos.x}% ${pos.y}%, rgba(255,255,255,${0.28 * (gl / 100)}), transparent 60%)`,
          }}
        />
        <span className="relative">Start building →</span>
      </button>
    </div>
  );
}


export function PulseLoader({ speed = 1, dots = 3 }: DemoProps) {
  const n = typeof dots === "number" ? Math.max(1, Math.min(8, dots)) : 3;
  const sp = typeof speed === "number" ? speed : 1;
  return (
    <div className="flex items-end gap-2 py-6" aria-label="Loading">
      {Array.from({ length: n }).map((_, i) => (
        <span
          key={i}
          className="rounded-full"
          style={{
            width: 14,
            height: 14,
            background: `linear-gradient(135deg,#8b5cf6,#22d3ee)`,
            animation: `mf-dot ${sp}s ease-in-out ${(i * sp) / n}s infinite`,
          }}
        />
      ))}
    </div>
  );
}


export function NavDock({ magnify = 1.8 }: DemoProps) {
  const items = ["Home", "Work", "Stack", "Blog", "Say hi"];
  const m = typeof magnify === "number" ? magnify : 1.8;
  const [hot, setHot] = useState<number | null>(null);
  return (
    <div className="flex items-end justify-center gap-2 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-md">
      {items.map((it, i) => {
        const d = hot === null ? 1 : hot === i ? m : m * 0.82;
        return (
          <button
            key={it}
            type="button"
            onMouseEnter={() => setHot(i)}
            onMouseLeave={() => setHot(null)}
            className="rounded-xl border border-white/10 bg-gradient-to-b from-white/12 to-white/4 px-3 py-1.5 text-xs font-semibold text-ink transition-[transform,background] duration-200 hover:from-white/20 hover:to-white/8"
            style={{ transform: `scale(${d})`, transitionTimingFunction: "cubic-bezier(.34,1.56,.64,1)" }}
          >
            {it}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------ ANIMATED ------------------------------ */


export function AuroraVeil({ hueA = 262, hueB = 192, speed = 18, grain = true }: DemoProps) {
  const ha = typeof hueA === "number" ? hueA : 262;
  const hb = typeof hueB === "number" ? hueB : 192;
  const sp = typeof speed === "number" ? speed : 18;
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(46% 60% at 20% 15%, hsl(${ha} 85% 62% / .55), transparent 70%),
             radial-gradient(42% 55% at 82% 20%, hsl(${hb} 90% 60% / .5), transparent 70%),
             radial-gradient(60% 70% at 60% 90%, hsl(${(ha + 80) % 360} 80% 55% / .34), transparent 75%)`,
          filter: "blur(14px) saturate(1.3)",
          animation: `mf-glow ${sp}s ease-in-out infinite alternate`,
        }}
      />
      {grain && (
        <div
          className="absolute inset-0 opacity-25 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E")`,
          }}
        />
      )}
      <div className="absolute bottom-6 left-8 text-white/85">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">Aurora Veil</div>
        <div className="mt-1 text-xl font-bold tracking-tight">Pure CSS · 60 fps · 0 JS</div>
      </div>
    </div>
  );
}


export function HaloTrail({ count = 18, size = 140, glow = 0.8 }: DemoProps) {
  const n = typeof count === "number" ? Math.max(4, Math.min(40, count)) : 18;
  const maxSize = typeof size === "number" ? size : 140;
  const gl = typeof glow === "number" ? glow : 0.8;
  const boxRef = useRef<HTMLDivElement>(null);
  // #1 — the trail is written by a pointer listener and a rAF: the stylesheet
  // cannot reach it, so the scene asks for itself and simply never trails.
  const { reduced } = useSceneMotion();
  const [halos, setHalos] = useState<{ id: number; x: number; y: number }[]>([]);
  const idRef = useRef(0);
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      idRef.current += 1;
      const id = idRef.current;
      setHalos((prev) => [...prev.slice(-n + 1), { id, x, y }]);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setHalos((prev) => prev.filter((h) => h.id > id - n));
      });
    };
    if (reduced) return;
    box.addEventListener("pointermove", onMove);
    return () => {
      box.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [n, reduced]);
  return (
    <div
      ref={boxRef}
      className="pointer-events-auto relative flex h-full w-full items-center justify-center overflow-hidden"
    >
      <p className="pointer-events-none select-none text-sm font-medium text-white/45">
        Move your cursor — the trail listens
      </p>
      {halos.map((h, i) => {
        const t = halos.length === 0 ? 0 : i / Math.max(1, halos.length - 1);
        return (
          <span
            key={h.id}
            className="pointer-events-none absolute rounded-full"
            style={{
              left: h.x,
              top: h.y,
              width: maxSize * (0.25 + t * 0.75),
              height: maxSize * (0.25 + t * 0.75),
              transform: "translate(-50%,-50%)",
              background: `radial-gradient(circle, hsla(258,90%,72%,${0.5 * gl}) 0%, hsla(192,95%,60%,${0.25 * gl}) 40%, transparent 70%)`,
              filter: "blur(2px)",
              opacity: 0.15 + t * 0.8,
            }}
          />
        );
      })}
    </div>
  );
}


export function OrbitDeck({ radius = 190, orbit = 14 }: DemoProps) {
  const r = typeof radius === "number" ? radius : 190;
  const o = typeof orbit === "number" ? orbit : 14;
  const items = ["◐", "✦", "◍", "❋", "✺", "◈"].map((g, i) => ({ g, hue: 200 + i * 30 }));
  const [paused, setPaused] = useState(false);
  // The catalog says "tilt with drag" — this is the drag. Pointer handlers
  // (not a rAF loop), so the motion audit still counts the ambient spin as
  // CSS-driven; the tilt only moves while the pointer does.
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    last.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!last.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    setTilt((t) => ({
      x: Math.max(-22, Math.min(22, t.x + dy * 0.1)),
      y: Math.max(-22, Math.min(22, t.y + dx * 0.1)),
    }));
    last.current = { x: e.clientX, y: e.clientY };
  };
  const endDrag = () => {
    last.current = null;
    setDragging(false);
    setTilt({ x: 0, y: 0 });
  };
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{ perspective: 900 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: dragging ? "none" : "transform .35s ease-out",
        }}
      >
        <div
          className="absolute h-20 w-20 rounded-2xl border border-white/20 bg-gradient-to-br from-violet-500/80 to-cyan-400/70 shadow-[0_0_60px_rgba(139,92,246,0.55)] backdrop-blur"
        />
        <div
          className="absolute"
          style={{
            width: 0,
            height: 0,
            animation: `mf-spin ${o}s linear infinite`,
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {items.map((it, i) => {
            const a = (i / items.length) * Math.PI * 2;
            return (
              <span
                key={i}
                className="absolute flex items-center justify-center rounded-xl border border-white/15 bg-white/10 font-semibold text-white/80 backdrop-blur-sm"
                style={{
                  width: 64,
                  height: 64,
                  left: Math.cos(a) * r - 32,
                  top: Math.sin(a) * r - 32,
                  fontSize: 22,
                  color: `hsl(${it.hue} 95% 72%)`,
                  transform: `rotate(${(a * 180) / Math.PI}deg) translateX(${r}px) rotate(${(-a * 180) / Math.PI}deg)`,
                  animation: `mf-bob ${3 + (i % 3)}s ease-in-out infinite`,
                }}
              >
                {it.g}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}


const COUNTER_TARGETS = [12400, 318, 94, 148200];


const MOTES = Array.from({ length: 90 }).map((_, i) => ({
  x: (i * 137.5) % 100,
  y: (i * 61.8) % 100,
  s: 1 + ((i * 7) % 3),
  d: ((i * 13) % 40) / 10,
}));


export function StarMotes({ density = 120 }: DemoProps) {
  const d = typeof density === "number" ? density : 120;
  const stars = MOTES.slice(0, Math.max(10, Math.min(300, Math.round(d * 0.75))));
  return (
    <div className="relative h-full w-full overflow-hidden bg-[radial-gradient(ellipse_at_50%_120%,#111c33,transparent_70%)]">
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.s,
            height: s.s,
            opacity: 0.25 + (i % 5) * 0.15,
            animation: `mf-glow ${1.5 + s.d}s ease-in-out ${s.d}s infinite`,
            boxShadow: "0 0 6px rgba(255,255,255,0.8)",
          }}
        />
      ))}
    </div>
  );
}


const GLYPHS = "!<>-_\\/[]{}—=+*^?#0123456789";


export function ScrambleText({ speed = 55, charset = 2 }: DemoProps) {
  const target = "Motif UI — copy less, ship more";
  const [out, setOut] = useState(target);
  const sp = typeof speed === "number" ? speed : 55;
  const rich = typeof charset === "number" ? charset : 2;
  const [hover, setHover] = useState(false);
  const frame = useRef(0);
  // #2 — the scramble is a rAF loop writing state, which the stylesheet cannot
  // reach. Reduced: the sentence is printed in full and never reshuffles.
  const { reduced } = useSceneMotion();
  useEffect(() => {
    if (reduced) return;
    let raf: number;
    let progress = 0;
    const len = target.length;
    const tick = () => {
      progress += 1;
      const done = Math.floor((progress / 90) * len);
      let s = "";
      for (let i = 0; i < len; i++) {
        if (i < done || target[i] === " ") s += target[i];
        else if (Math.random() < (rich === 1 ? 0.2 : 0.08)) s += target[i];
        else s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOut(s);
      if (done < len) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    frame.current = raf;
    return () => cancelAnimationFrame(raf);
  }, [sp, rich, hover, reduced]);
  return (
    <div
      className="flex h-full w-full items-center justify-center px-6 text-center"
      onMouseEnter={() => setHover((v) => !v)}
    >
      <span className="font-mono text-xl font-bold tracking-wide text-ink md:text-2xl">{reduced ? target : out}</span>
    </div>
  );
}


export function TiltCard({ maxTilt = 16, spot = true }: DemoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0, x: 50, y: 50 });
  const mt = typeof maxTilt === "number" ? maxTilt : 16;
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <div
        ref={ref}
        onMouseMove={(e) => {
          const r = ref.current?.getBoundingClientRect();
          if (!r) return;
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          setT({ rx: (0.5 - py) * mt * 2, ry: (px - 0.5) * mt * 2, x: px * 100, y: py * 100 });
        }}
        onMouseLeave={() => setT({ rx: 0, ry: 0, x: 50, y: 50 })}
        className="relative h-64 w-full max-w-sm overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-[#171a26] to-[#0c0e16] shadow-2xl"
        style={{
          transform: `perspective(900px) rotateX(${t.rx}deg) rotateY(${t.ry}deg)`,
          transition: "transform .15s ease-out",
        }}
      >
        {spot && (
          <span
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(320px circle at ${t.x}% ${t.y}%, rgba(167,139,250,0.25), transparent 65%)`,
            }}
          />
        )}
        <div className="flex h-full flex-col justify-between p-6">
          <div className="flex items-center justify-between">
            <span className="chip">PRO CARD</span>
            <span className="text-xs text-ink-faint">motion: {mt}°</span>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">Perspective tilt</div>
            <div className="mt-1 text-sm text-ink-dim">Cursor-tracked spotlight + spring return.</div>
          </div>
          <div className="flex gap-2">
            <span className="btn btn-ghost !px-4 !py-2 text-xs">Try it</span>
            <span className="btn btn-quiet !px-4 !py-2 text-xs">Docs</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ SECTIONS ------------------------------ */


export function HeroAurora() {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <div className="absolute inset-0 aurora-bg opacity-70" style={{ filter: "blur(40px) saturate(1.2)" }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(6,7,11,0.9)_100%)]" />
      <div className="relative z-10 mx-auto flex h-full max-w-lg flex-col items-center justify-center px-8 text-center">
        <span className="chip mb-4 border-violet-300/30 bg-violet-400/10 text-violet-200">
          ✦ New · {VERIFIED_PROMPTS} verified prompts
        </span>
        {/* #506/#507 — a demo is a preview of somebody else's page: none of its
            mock titles are headings. Every <h1>…<h6> in this file is a <div>
            now, so a component page previewing a scene, or a card previewing a
            template that contains one, cannot ship a second outline. */}
        <div className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
          Ship pages that <span className="text-gradient">feel alive</span>
        </div>
        <p className="mt-3 max-w-sm text-sm text-white/70 md:text-base">
          Copy-ready components and AI prompts, tested before you paste.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <span className="btn btn-primary text-sm">Browse library</span>
          <span className="btn border border-white/25 bg-white/10 text-sm text-white hover:bg-white/20">Try the Lab</span>
        </div>
      </div>
    </div>
  );
}


export function BentoStudio() {
  return (
    <div className="grid h-full w-full grid-cols-3 gap-2 p-5" style={{ gridTemplateRows: "1fr 1fr 1fr" }}>
      <div className="col-span-2 row-span-2 rounded-2xl border border-white/12 bg-gradient-to-br from-violet-500/25 to-indigo-500/10 p-4 transition-transform duration-300 hover:scale-[1.02]">
        <div className="text-[10px] font-bold uppercase tracking-widest text-violet-200/70">Featured</div>
        <div className="mt-8 text-2xl font-extrabold leading-none text-white">Bento<br />Studio</div>
        <div className="mt-2 text-[11px] text-white/60">Organic spans · hover expand</div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-3 transition-transform duration-300 hover:scale-[1.03]">
        <div className="text-lg">⚡</div>
        <div className="mt-4 text-[11px] font-semibold text-ink">Fast</div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-400/20 to-transparent p-3 transition-transform duration-300 hover:scale-[1.03]">
        <div className="text-lg">◉</div>
        <div className="mt-4 text-[11px] font-semibold text-ink">Live</div>
      </div>
      <div className="col-span-2 rounded-2xl border border-white/10 bg-white/5 p-3 transition-transform duration-300 hover:scale-[1.02]">
        <div className="flex items-center justify-between text-[11px] font-semibold">
          <span>Popular today</span>
          <span className="text-mint">▲ 24%</span>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-pink-400/20 to-transparent p-3 transition-transform duration-300 hover:scale-[1.03]">
        <div className="text-lg">✦</div>
      </div>
    </div>
  );
}


export function MarqueeLogos({ speed = 32 }: DemoProps) {
  const names = ["NOVA", "Lumen&Co", "Vektra", "Orbital", "Craftwork", "Polaris", "Aster&", "Monolith"];
  const sp = typeof speed === "number" ? speed : 32;
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 overflow-hidden py-6">
      <div className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-ink-faint">
        Trusted by ambitious teams
      </div>
      <div className="relative overflow-hidden" style={{ maskImage: "linear-gradient(90deg,transparent,black 15%,black 85%,transparent)" }}>
        <div
          className="flex w-max gap-14 pr-14"
          style={{ animation: `mf-belt ${sp}s linear infinite`, animationPlayState: "running" }}
        >
          {[...names, ...names].map((nm, i) => (
            <span key={i} className="whitespace-nowrap text-lg font-extrabold tracking-[0.18em] text-white/35 transition hover:text-white/80">
              {nm}
            </span>
          ))}
        </div>
        <style>{`@keyframes mf-belt { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
      </div>
    </div>
  );
}


export function FaqOrbit() {
  const [open, setOpen] = useState(0);
  const rows = [
    { q: "Is everything really MIT licensed?", a: "All component code ships under MIT. Guides are CC BY 4.0." },
    { q: "Do prompts work with Chinese LLMs?", a: "Every prompt is retested on Claude, Codex and GLM-4.6." },
    { q: "Can I re-theme a component?", a: "All visuals run on CSS variables — Theme Studio remaps them live." },
  ];
  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col justify-center gap-2 px-6">
      {rows.map((r, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-white/10 bg-white/4">
          <button
            type="button"
            onClick={() => setOpen(open === i ? -1 : i)}
            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-ink"
          >
            {r.q}
            <span className={`text-violet-300 transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}>+</span>
          </button>
          <div
            className="grid transition-[grid-template-rows] duration-300 ease-out"
            style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}
          >
            <div className="overflow-hidden">
              <p className="px-4 pb-3 text-xs text-ink-dim">{r.a}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------ BACKGROUNDS ------------------------------ */


export function BgLiquidGlass() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0d1017]">
      <div className="absolute -left-10 top-6 h-40 w-40 rounded-full bg-violet-500/50 blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-4 right-6 h-48 w-48 rounded-full bg-cyan-400/40 blur-3xl animate-pulse-soft" style={{ animationDelay: "1.2s" }} />
      <div className="absolute left-1/2 top-1/2 grid w-4/5 -translate-x-1/2 -translate-y-1/2 grid-cols-2 gap-4">
        {["Glass", "Frost", "Edge"].map((t) => (
          <div
            key={t}
            className="rounded-2xl border border-white/25 bg-white/10 p-5 shadow-2xl backdrop-blur-xl"
            style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,.35), 0 20px 40px -20px rgba(0,0,0,.7)" }}
          >
            <div className="text-sm font-bold text-white">{t}</div>
            <div className="mt-1 text-[10px] text-white/60">backdrop-blur · specular edge</div>
          </div>
        ))}
      </div>
    </div>
  );
}


export function BgNoise() {
  return (
    <div
      className="h-full w-full"
      style={{
        background: `#0a0c12 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.16'/%3E%3C/svg%3E")`,
      }}
    />
  );
}


export function BgGrid() {
  return (
    <div
      className="h-full w-full"
      style={{
        backgroundImage:
          "linear-gradient(rgba(139,92,246,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.16) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        animation: "mf-gridmove 1.6s linear infinite",
        transform: "perspective(300px) rotateX(52deg) scale(1.8)",
        transformOrigin: "50% 110%",
      }}
    />
  );
}


export function BgSorbet() {
  return (
    <div
      className="h-full w-full"
      style={{
        background: "linear-gradient(115deg,#ffd6e0 0%,#ffe8c7 28%,#d3f5e3 55%,#c7e6ff 80%,#e6d3ff 100%)",
        backgroundSize: "300% 300%",
        animation: "mf-sorbet 9s ease-in-out infinite alternate",
      }}
    >
      <style>{`@keyframes mf-sorbet { from { background-position: 0% 0% } to { background-position: 100% 100% } }`}</style>
    </div>
  );
}


export function BgHalftone() {
  return (
    <div className="h-full w-full" style={{ background: "#f5f1e8" }}>
      <div
        className="h-full w-full"
        style={{
          backgroundImage: "radial-gradient(rgba(30,41,59,0.35) 1.4px, transparent 1.6px)",
          backgroundSize: "16px 16px",
          maskImage: "radial-gradient(ellipse 70% 80% at 50% 45%, black 35%, transparent 85%)",
        }}
      />
    </div>
  );
}


export function BgInk() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#05060a]">
      {[
        { l: "10%", t: "8%", s: 300, c: "rgba(124,58,237,0.5)", d: "0s" },
        { l: "68%", t: "30%", s: 240, c: "rgba(34,211,238,0.4)", d: "-3s" },
        { l: "38%", t: "64%", s: 340, c: "rgba(236,72,153,0.3)", d: "-6s" },
      ].map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: b.l,
            top: b.t,
            width: b.s,
            height: b.s,
            background: `radial-gradient(circle at 40% 35%, ${b.c}, transparent 70%)`,
            filter: "blur(50px)",
            animation: `mf-ink ${12 + i * 4}s ease-in-out ${b.d} infinite alternate`,
          }}
        />
      ))}
      <style>{`@keyframes mf-ink { from { transform: translate3d(-6%, -4%, 0) scale(0.9) } to { transform: translate3d(7%, 6%, 0) scale(1.15) } }`}</style>
    </div>
  );
}

/* ------------------------------ RICH PASS (2026-09) ------------------------------ */


export function MorphBlob({ speed = 9, hueA = 258, hueB = 192 }: DemoProps) {
  const sp = typeof speed === "number" ? speed : 9;
  const ha = typeof hueA === "number" ? hueA : 258;
  const hb = typeof hueB === "number" ? hueB : 192;
  const blobs = [
    { hue: ha, d: "0s", x: "-8%", y: "-22%", s: 420 },
    { hue: hb, d: "-4s", x: "52%", y: "-10%", s: 360 },
    { hue: (ha + 60) % 360, d: "-7s", x: "22%", y: "34%", s: 380 },
  ];
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#05060b]">
      {blobs.map((b, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            left: b.x, top: b.y,
            width: b.s, height: b.s,
            background: `radial-gradient(circle at 42% 38%, hsl(${b.hue} 88% 62% / 0.55), hsl(${(b.hue + 40) % 360} 85% 45% / 0.18) 60%, transparent 75%)`,
            filter: "blur(28px) saturate(1.25)",
            borderRadius: "58% 42% 63% 37% / 44% 55% 45% 56%",
            animation: `mf-blobmorph ${sp}s ease-in-out ${b.d} infinite alternate, mf-blobdrift ${sp * 1.6}s ease-in-out ${b.d} infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes mf-blobmorph {
          0%   { border-radius: 58% 42% 63% 37% / 44% 55% 45% 56%; }
          35%  { border-radius: 46% 54% 38% 62% / 60% 38% 62% 40%; }
          70%  { border-radius: 62% 38% 55% 45% / 40% 62% 38% 60%; }
          100% { border-radius: 50% 50% 44% 56% / 55% 45% 60% 40%; }
        }
        @keyframes mf-blobdrift {
          from { transform: translate3d(-3%, -2%, 0) scale(0.92) rotate(-4deg); }
          to   { transform: translate3d(3%, 4%, 0) scale(1.1) rotate(5deg); }
        }
      `}</style>
      <div className="relative z-10 text-center">
        <div className="text-[10px] font-bold uppercase tracking-[0.34em] text-white/45">Ambient brand mark</div>
        <div className="mt-2 bg-gradient-to-b from-white to-white/55 bg-clip-text text-3xl font-black tracking-tight text-transparent md:text-5xl">
          Always liquid.
        </div>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[11px] text-white/65 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-mint" /> CSS border-radius morph · 0 JS
        </div>
      </div>
    </div>
  );
}


export function ConicLoader({ size = 96, speed = 1 }: DemoProps) {
  const s = typeof size === "number" ? size : 96;
  const sp = typeof speed === "number" ? speed : 1;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-[#080a11]">
      <div className="relative flex items-center justify-center">
        <span
          className="block rounded-full"
          style={{
            width: s, height: s,
            background: "conic-gradient(from 0deg, transparent 0 25%, #8b5cf6 50%, #22d3ee 75%, transparent 80% 100%)",
            WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 9px), black calc(100% - 8px))",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 9px), black calc(100% - 8px))",
            animation: `mf-conicspin ${sp}s linear infinite`,
          }}
        />
        <span
          className="absolute rounded-full bg-white"
          style={{
            width: 8, height: 8,
            boxShadow: "0 0 18px rgba(167,139,250,0.9)",
            animation: "mf-glow 1.6s ease-in-out infinite",
          }}
        />
      </div>
      <style>{`@keyframes mf-conicspin { to { transform: rotate(360deg) } }`}</style>
      <div className="text-center">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink-faint">Saving your scene…</div>
        <div className="mt-1 text-[11px] text-ink-faint">conic ring · 0.9 KB · respects reduced motion</div>
      </div>
    </div>
  );
}


export function GlassPricing({ tiers = 3, heroGlow = true }: DemoProps) {
  const n = typeof tiers === "number" ? Math.max(2, Math.min(4, Math.round(tiers))) : 3;
  const glow = heroGlow !== false;
  const plans = [
    { name: "Starter", price: "$0", desc: "For side projects", feats: ["3 projects", "Community support", "MIT assets"] },
    { name: "Pro", price: "$19", desc: "For client work", feats: ["Unlimited projects", "Prompt test reports", "Template packs"], hero: true },
    { name: "Studio", price: "$49", desc: "For teams", feats: ["Shared brand kits", "Team seats", "API access"] },
    { name: "Scale", price: "$120", desc: "For product orgs", feats: ["SSO", "Dedicated SLAs", "Custom audits"] },
  ].slice(0, n);
  return (
    <div className="flex h-full w-full items-center justify-center gap-3 bg-[radial-gradient(70%_90%_at_50%_0%,#111527,transparent_60%),#07080d] px-5">
      {plans.map((p) => (
        <div
          key={p.name}
          className="relative flex w-full max-w-[180px] flex-col rounded-2xl border border-white/14 bg-white/8 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_24px_48px_-24px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1.5"
        >
          {(p as { hero?: boolean }).hero && glow && (
            <>
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-2.5 py-0.5 text-[8px] font-extrabold uppercase tracking-widest text-white">
                Most picked
              </span>
              <span className="pointer-events-none absolute -inset-px rounded-2xl opacity-70" style={{ boxShadow: "0 0 46px -6px rgba(139,92,246,0.55)" }} aria-hidden />
            </>
          )}
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/55">{p.name}</div>
          <div className="mt-1 text-xl font-black tracking-tight text-white">{p.price}<span className="text-[9px] font-medium text-white/45">/mo</span></div>
          <div className="mt-0.5 text-[9px] text-white/50">{p.desc}</div>
          <ul className="mt-2.5 space-y-1 border-t border-white/10 pt-2.5">
            {p.feats.map((f) => (
              <li key={f} className="flex items-center gap-1.5 text-[9px] text-white/70">
                <span className="text-emerald-300">✓</span>{f}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className={`mt-3 w-full rounded-lg py-1.5 text-[10px] font-bold transition-colors ${
              (p as { hero?: boolean }).hero && glow
                ? "bg-gradient-to-r from-violet-500 to-indigo-400 text-white"
                : "border border-white/20 bg-white/6 text-white/85 hover:bg-white/12"
            }`}
          >
            Choose
          </button>
        </div>
      ))}
    </div>
  );
}


export function WipeReveal({ loop = true, speed = 1.1 }: DemoProps) {
  const sp = typeof speed === "number" ? speed : 1.1;
  const repeat = loop !== false ? "infinite" : "1 forwards";
  const line = "Made to feel alive";
  return (
    <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[radial-gradient(60%_80%_at_50%_110%,rgba(139,92,246,0.22),transparent_65%),#07080d] px-6">
      <style>{`
        @keyframes mf-wipe { 0% { background-position: -220% 0; } 100% { background-position: 220% 0; } }
      `}</style>
      <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">Headline system</div>
      <div className="relative mt-3 w-full max-w-lg select-none">
        <div className="text-center text-4xl font-black tracking-tight text-white/14 md:text-6xl" data-demo-heading="h3">{line}</div>
        <div
          aria-hidden
          className="absolute inset-0 text-center text-4xl font-black tracking-tight text-transparent md:text-6xl"
          style={{
            backgroundImage: "linear-gradient(100deg, rgba(255,255,255,0.05) 42%, #c4b5fd 48%, #67e8f9 52%, rgba(255,255,255,0.05) 58%)",
            backgroundSize: "260% 100%",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            animation: `mf-wipe ${sp * 2.2}s cubic-bezier(.6,.05,.25,1) ${repeat}`,
            animationDelay: "0.4s",
          }}
         data-demo-heading="h3">
          {line}
        </div>
      </div>
      <p className="mt-4 text-center text-[11px] text-white/45">A light edge travels the headline once — then it’s just typography.</p>
    </div>
  );
}


export function CounterStats({ duration = 1400 }: DemoProps) {
  const dur = typeof duration === "number" ? duration : 1400;
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [vals, setVals] = useState([0, 0, 0, 0]);
  const { reduced } = useSceneMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || started) return;
    const obs = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    // #3 — the count-up is a rAF loop. Reduced: the numbers are simply there,
    // at their final values, when the block enters view — derived at render,
    // not copied into state.
    if (reduced) return;
    const t0 = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVals(COUNTER_TARGETS.map((t) => Math.round(t * eased)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, dur, reduced]);
  const shown = reduced ? COUNTER_TARGETS : vals;
  const labels = ["Sites shipped", "Verified prompts", "Avg fidelity %", "Copies (30d)"];
  const fmt = (v: number, i: number) => (i === 3 ? `${(v / 1000).toFixed(1)}k` : v.toLocaleString());
  return (
    <div ref={ref} className="flex h-full w-full flex-col justify-center bg-[#0a0c12] px-6">
      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink-faint">By the numbers — counts once, on view</div>
      <div className="mt-5 grid grid-cols-4 divide-x divide-white/8">
        {COUNTER_TARGETS.map((t, i) => (
          <div key={labels[i]} className="px-3 first:pl-0">
            <div className="text-lg font-black tabular-nums tracking-tight text-white md:text-3xl">
              {fmt(shown[i], i)}
              {i === 2 && <span className="text-mint">%</span>}
            </div>
            <div className="mt-1.5 text-[9px] font-semibold uppercase tracking-widest text-ink-faint">{labels[i]}</div>
            <div className="mt-2 h-0.5 w-6 rounded-full" style={{ background: `hsl(${200 + i * 45} 90% 65%)` }} />
          </div>
        ))}
      </div>
      <p className="mt-3 text-[10px] text-ink-faint">hairline ledger · count-up on entry · <span className="text-ink-dim">{dur}ms default</span></p>
    </div>
  );
}


const DOT_PALETTES: Record<string, [number, number]> = {
  violet: [258, 198],
  cyan: [192, 152],
  sunset: [22, 320],
  mono: [0, 0],
};


export function DotDraw({ resolution = 18, palette = "violet" }: DemoProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [fill, setFill] = useState<Record<number, number>>({});
  const timers = useRef<Record<number, number>>({});
  const res = typeof resolution === "number" ? Math.max(6, Math.min(40, resolution)) : 18;
  const pal = DOT_PALETTES[String(palette)] ?? DOT_PALETTES.violet;
  const cols = 26;
  const rows = 12;
  const onMove = (e: React.PointerEvent) => {
    const box = boxRef.current;
    if (!box) return;
    const r = box.getBoundingClientRect();
    const col = Math.max(0, Math.min(cols - 1, Math.floor(((e.clientX - r.left) / r.width) * cols)));
    setFill((prev) => {
      const next = { ...prev };
      next[col] = rows; // full raise
      return next;
    });
    if (timers.current[col]) window.clearTimeout(timers.current[col]);
    timers.current[col] = window.setTimeout(() => {
      setFill((prev) => {
        const next = { ...prev };
        next[col] = 0;
        return next;
      });
      delete timers.current[col];
    }, 900);
  };
  useEffect(() => () => { Object.values(timers.current).forEach((t) => window.clearTimeout(t)); }, []);
  const mono = pal[0] === 0 && pal[1] === 0;
  return (
    <div className="flex h-full w-full items-center gap-6 bg-[#07080c] px-6">
      <div
        ref={boxRef}
        onPointerMove={onMove}
        onPointerLeave={() => setFill({})}
        className="h-full max-h-40 flex-1 cursor-crosshair overflow-hidden rounded-2xl border border-white/8 bg-black/30"
      >
        <div className="grid h-full w-full" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
          {Array.from({ length: cols * rows }).map((_, i) => {
            const c = i % cols;
            const row = Math.floor(i / cols);
            const lit = (fill[c] ?? 0) > row;
            const hue = mono ? 0 : pal[0] + (row * 5 + c * 3) % 120;
            const depth = (fill[c] ?? 0) - row;
            return (
              <span
                key={i}
                className="mx-auto my-auto rounded-full transition-[opacity,transform] duration-200"
                style={{
                  width: Math.max(3, 30 / res + 2),
                  height: Math.max(3, 30 / res + 2),
                  transform: lit ? "scale(1)" : "scale(0.6)",
                  opacity: lit ? Math.min(1, 0.35 + depth * 0.16) : 0.14,
                  background: mono ? "#fff" : `hsl(${hue} 90% ${55 + depth * 5}%)`,
                  boxShadow: lit && !mono ? `0 0 ${6 + depth}px hsl(${hue} 90% 60% / 0.8)` : undefined,
                  transitionDelay: lit ? `${(rows - row) * 16}ms` : "0ms",
                }}
              />
            );
          })}
        </div>
      </div>
      <div className="hidden max-w-[150px] sm:block">
        <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink-faint">Dot Draw</div>
        <div className="mt-2 text-lg font-black leading-tight text-white">Sweep your pointer</div>
        <p className="mt-2 text-[10px] leading-relaxed text-ink-dim">
          Columns raise like a seismograph, then settle. Pointer theatre that costs ~5 KB.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------ CONTEXT PASS 2 (2026-09) ------------------------------ */


export function TextCycle() {
  const words = ["ship faster.", "feel alive.", "convert better.", "stand apart."];
  const [i, setI] = useState(0);
  const total = words.length;
  // #4 — this scene's caption said "reduced-motion safe" while a 2.6s interval
  // rotated the headline for everyone. Reduced: the first line stays put and
  // the caption says which version is on screen.
  const { reduced } = useSceneMotion();
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setI((v) => (v + 1) % total), 2600);
    return () => clearInterval(t);
  }, [total, reduced]);
  return (
    <div className="flex h-full w-full flex-col justify-center bg-[radial-gradient(70%_90%_at_50%_0%,rgba(34,211,238,0.16),transparent_60%),#07080d] px-7">
      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-200/60">Headline rotation</div>
      <div className="mt-2 text-3xl font-black leading-tight tracking-tight text-white md:text-5xl">
        Build pages that
      </div>
      <div className="relative mt-1 h-[1.4em] overflow-hidden" aria-live="polite">
        <span
          className="text-gradient block text-3xl font-black leading-[1.35] tracking-tight md:text-5xl"
          style={{ transform: `translateY(-${(reduced ? 0 : i) * 100}%)`, transition: "transform 0.5s cubic-bezier(.65,0,.25,1)" }}
        >
          {words.map((w) => (
            <span key={w} className="block">{w}</span>
          ))}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        {words.map((_, d) => (
          <span key={d} className="h-1 rounded-full bg-white/20 transition-all" style={{ width: d === (reduced ? 0 : i) ? 22 : 8, background: d === (reduced ? 0 : i) ? "linear-gradient(90deg,#8b5cf6,#22d3ee)" : undefined }} />
        ))}
        <span className="ml-2 text-[10px] text-ink-faint">
          {reduced ? "word swap · paused: reduced motion is on" : "word swap · 2.6s cadence"}
        </span>
      </div>
    </div>
  );
}


export function TabMorph({ count = 4 }: DemoProps) {
  const all = ["Overview", "Design", "Motion", "Code", "Settings", "Team"];
  const n = typeof count === "number" ? Math.max(2, Math.min(6, Math.round(count))) : 4;
  const tabs = all.slice(0, n);
  const [active, setActive] = useState(Math.min(1, n - 1));
  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(60%_80%_at_50%_100%,rgba(139,92,246,0.18),transparent_65%),#08090f] px-6">
      <div className="relative w-full max-w-md">
        <div className="relative grid rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-md" style={{ gridTemplateColumns: `repeat(${n}, minmax(0,1fr))` }}>
          <span
            className="absolute bottom-1.5 top-1.5 rounded-xl border border-white/15 bg-white/12 shadow-[0_0_18px_rgba(139,92,246,0.25)]"
            style={{ width: `calc((100% - 12px) / ${n})`, left: `calc(6px + ${active} * (100% - 12px) / ${n})`, transition: "left .35s cubic-bezier(.65,0,.25,1)" }}
            aria-hidden
          />
          {tabs.map((t, idx) => (
            <button
              key={t} type="button"
              onClick={() => setActive(idx)}
              aria-pressed={active === idx}
              className={`relative z-10 rounded-xl py-3 text-sm font-bold transition-colors ${active === idx ? "text-white" : "text-ink-dim hover:text-ink"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between px-1 text-[11px] text-ink-faint">
          <span>The active thumb slides on a spring-like curve — tab content can crossfade below.</span>
        </div>
      </div>
    </div>
  );
}


export function FlipCard() {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#07080d] px-8">
      <div
        className="relative h-56 w-full max-w-xs cursor-pointer select-none"
        style={{ perspective: "1100px" }}
        onClick={() => setFlipped((f) => !f)}
        role="button"
        tabIndex={0}
        aria-label="Flip card demo — press Enter to flip"
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFlipped((f) => !f); } }}
      >
        <div
          className="relative h-full w-full transition-transform duration-700"
          style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          {/* front */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-white/12 bg-gradient-to-br from-violet-500/30 via-indigo-500/15 to-cyan-400/20 p-6 text-center shadow-2xl backdrop-blur-sm"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="text-5xl">◈</span>
            <div className="mt-3 text-lg font-black tracking-tight text-white">A card with two faces</div>
            <div className="mt-1 text-[11px] text-white/55">hover? no — click or tap</div>
            <div className="mt-3 text-[10px] font-bold uppercase tracking-widest text-white/40">pure 3D CSS · zero deps</div>
          </div>
          {/* back */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-white/12 bg-gradient-to-br from-cyan-400/25 via-sky-500/10 to-violet-500/20 p-6 text-center backdrop-blur-sm"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="text-lg font-black tracking-tight text-white">…and a smarter back</div>
            <p className="mt-2 text-[11px] leading-relaxed text-white/65">
              Use it for flip-to-reveal pricing details, collectibles or study cards.
            </p>
            <span className="mt-3 rounded-full bg-white/12 px-3.5 py-1.5 text-[10px] font-bold text-white">Flip again</span>
          </div>
        </div>
      </div>
    </div>
  );
}

