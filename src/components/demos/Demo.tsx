"use client";

// Original live demos for Motif UI. Every visual below is authored in-house;
// none of the code is taken from third-party component libraries.

import { useEffect, useRef, useState } from "react";
import { COMPONENTS, PROMPTS } from "@/lib/data";
import { LEARN_ARTICLES } from "@/lib/learn";

export type DemoProps = Record<string, number | string | boolean>;

const KEYFRAMES = `
@keyframes mf-dot { 0%,100% { transform: scale(0.55); opacity:.35 } 40% { transform: scale(1); opacity:1 } }
@keyframes mf-spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
@keyframes mf-scramble { to { filter: blur(0) } }
@keyframes mf-gridmove { from { background-position: 0 0 } to { background-position: 0 -48px } }
@keyframes mf-glow { 0%,100% { opacity:.5; transform: scale(1)} 50% { opacity:.9; transform: scale(1.18)} }
@keyframes mf-rise { from { opacity:0; transform: translateY(14px)} to { opacity:1; transform:none} }
@keyframes mf-bob { 0%,100%{ transform: translateY(0) rotate(-1deg)} 50%{ transform: translateY(-10px) rotate(1.5deg)} }
@keyframes mf-roll { from { transform: translateY(-130%); opacity: 0 } to { transform: none; opacity: 1 } }
@keyframes mf-pop { 0% { transform: scale(.6); opacity: 0 } 65% { transform: scale(1.08); opacity: 1 } 100% { transform: none; opacity: 1 } }
@keyframes mf-draw { to { stroke-dashoffset: 0 } }
@keyframes mf-growin { from { opacity: 0; transform: scale(.96) translateY(4px) } to { opacity: 1; transform: none } }
`;

/* ------------------------------ ELEMENTS ------------------------------ */

function PrismSwitch({ size = 42, hueSpeed = 1.4 }: DemoProps) {
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

function HaloButton({ magnet = 24, glow = 70 }: DemoProps) {
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

function PulseLoader({ speed = 1, dots = 3 }: DemoProps) {
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

function NavDock({ magnify = 1.8 }: DemoProps) {
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

function AuroraVeil({ hueA = 262, hueB = 192, speed = 18, grain = true }: DemoProps) {
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

function HaloTrail({ count = 18, size = 140, glow = 0.8 }: DemoProps) {
  const n = typeof count === "number" ? Math.max(4, Math.min(40, count)) : 18;
  const maxSize = typeof size === "number" ? size : 140;
  const gl = typeof glow === "number" ? glow : 0.8;
  const boxRef = useRef<HTMLDivElement>(null);
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
    box.addEventListener("pointermove", onMove);
    return () => {
      box.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [n]);
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

function OrbitDeck({ radius = 190, orbit = 14 }: DemoProps) {
  const r = typeof radius === "number" ? radius : 190;
  const o = typeof orbit === "number" ? orbit : 14;
  const items = ["◐", "✦", "◍", "❋", "✺", "◈"].map((g, i) => ({ g, hue: 200 + i * 30 }));
  const [paused, setPaused] = useState(false);
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
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
  );
}

const COUNTER_TARGETS = [12400, 318, 94, 148200];

const MOTES = Array.from({ length: 90 }).map((_, i) => ({
  x: (i * 137.5) % 100,
  y: (i * 61.8) % 100,
  s: 1 + ((i * 7) % 3),
  d: ((i * 13) % 40) / 10,
}));

function StarMotes({ density = 120 }: DemoProps) {
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

function ScrambleText({ speed = 55, charset = 2 }: DemoProps) {
  const target = "Motif UI — copy less, ship more";
  const [out, setOut] = useState(target);
  const sp = typeof speed === "number" ? speed : 55;
  const rich = typeof charset === "number" ? charset : 2;
  const [hover, setHover] = useState(false);
  const frame = useRef(0);
  useEffect(() => {
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
  }, [sp, rich, hover]);
  return (
    <div
      className="flex h-full w-full items-center justify-center px-6 text-center"
      onMouseEnter={() => setHover((v) => !v)}
    >
      <span className="font-mono text-xl font-bold tracking-wide text-ink md:text-2xl">{out}</span>
    </div>
  );
}

function TiltCard({ maxTilt = 16, spot = true }: DemoProps) {
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

function HeroAurora() {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <div className="absolute inset-0 aurora-bg opacity-70" style={{ filter: "blur(40px) saturate(1.2)" }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(6,7,11,0.9)_100%)]" />
      <div className="relative z-10 mx-auto flex h-full max-w-lg flex-col items-center justify-center px-8 text-center">
        <span className="chip mb-4 border-violet-300/30 bg-violet-400/10 text-violet-200">
          ✦ New · 300 verified prompts
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
          Ship pages that <span className="text-gradient">feel alive</span>
        </h1>
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

function BentoStudio() {
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

function MarqueeLogos({ speed = 32 }: DemoProps) {
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

function FaqOrbit() {
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

function BgLiquidGlass() {
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

function BgNoise() {
  return (
    <div
      className="h-full w-full"
      style={{
        background: `#0a0c12 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.16'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

function BgGrid() {
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

function BgSorbet() {
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

function BgHalftone() {
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

function BgInk() {
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

function MorphBlob({ speed = 9, hueA = 258, hueB = 192 }: DemoProps) {
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

function ConicLoader({ size = 96, speed = 1 }: DemoProps) {
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

function GlassPricing({ tiers = 3, heroGlow = true }: DemoProps) {
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

function WipeReveal({ loop = true, speed = 1.1 }: DemoProps) {
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
        <h3 className="text-center text-4xl font-black tracking-tight text-white/14 md:text-6xl">{line}</h3>
        <h3
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
        >
          {line}
        </h3>
      </div>
      <p className="mt-4 text-center text-[11px] text-white/45">A light edge travels the headline once — then it’s just typography.</p>
    </div>
  );
}

function CounterStats({ duration = 1400 }: DemoProps) {
  const dur = typeof duration === "number" ? duration : 1400;
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [vals, setVals] = useState([0, 0, 0, 0]);
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
  }, [started, dur]);
  const labels = ["Sites shipped", "Verified prompts", "Avg fidelity %", "Copies (30d)"];
  const fmt = (v: number, i: number) => (i === 3 ? `${(v / 1000).toFixed(1)}k` : v.toLocaleString());
  return (
    <div ref={ref} className="flex h-full w-full flex-col justify-center bg-[#0a0c12] px-6">
      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink-faint">By the numbers — counts once, on view</div>
      <div className="mt-5 grid grid-cols-4 divide-x divide-white/8">
        {COUNTER_TARGETS.map((t, i) => (
          <div key={labels[i]} className="px-3 first:pl-0">
            <div className="text-lg font-black tabular-nums tracking-tight text-white md:text-3xl">
              {fmt(vals[i], i)}
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

function DotDraw({ resolution = 18, palette = "violet" }: DemoProps) {
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

function TextCycle() {
  const words = ["ship faster.", "feel alive.", "convert better.", "stand apart."];
  const [i, setI] = useState(0);
  const total = words.length;
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % total), 2600);
    return () => clearInterval(t);
  }, [total]);
  return (
    <div className="flex h-full w-full flex-col justify-center bg-[radial-gradient(70%_90%_at_50%_0%,rgba(34,211,238,0.16),transparent_60%),#07080d] px-7">
      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-200/60">Headline rotation</div>
      <div className="mt-2 text-3xl font-black leading-tight tracking-tight text-white md:text-5xl">
        Build pages that
      </div>
      <div className="relative mt-1 h-[1.4em] overflow-hidden" aria-live="polite">
        <span
          className="text-gradient block text-3xl font-black leading-[1.35] tracking-tight md:text-5xl"
          style={{ transform: `translateY(-${i * 100}%)`, transition: "transform 0.5s cubic-bezier(.65,0,.25,1)" }}
        >
          {words.map((w) => (
            <span key={w} className="block">{w}</span>
          ))}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        {words.map((_, d) => (
          <span key={d} className="h-1 rounded-full bg-white/20 transition-all" style={{ width: d === i ? 22 : 8, background: d === i ? "linear-gradient(90deg,#8b5cf6,#22d3ee)" : undefined }} />
        ))}
        <span className="ml-2 text-[10px] text-ink-faint">word swap · 2.6s cadence · reduced-motion safe</span>
      </div>
    </div>
  );
}

function TabMorph({ count = 4 }: DemoProps) {
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

function FlipCard() {
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

function SkeletonShimmer({ speed = 1.8 }: DemoProps) {
  const sp = typeof speed === "number" ? speed : 1.8;
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#0a0c13] px-8">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-white/8 bg-white/4 p-5 shadow-2xl">
        <div className="flex items-center gap-4">
          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white/8">
            <Shimmer speed={sp} />
          </span>
          <div className="flex-1 space-y-2">
            <div className="relative h-3 w-3/5 overflow-hidden rounded-full bg-white/8"><Shimmer speed={sp} /></div>
            <div className="relative h-2.5 w-2/5 overflow-hidden rounded-full bg-white/6"><Shimmer speed={sp} /></div>
          </div>
        </div>
        <div className="relative mt-5 h-3 w-full overflow-hidden rounded-full bg-white/6"><Shimmer speed={sp} /></div>
        <div className="relative mt-2.5 h-3 w-11/12 overflow-hidden rounded-full bg-white/6"><Shimmer speed={sp} /></div>
        <div className="relative mt-2.5 h-3 w-2/3 overflow-hidden rounded-full bg-white/6"><Shimmer speed={sp} /></div>
        <div className="relative mt-5 h-9 w-28 overflow-hidden rounded-xl bg-white/8"><Shimmer speed={sp} /></div>
        <style>{`@keyframes mf-shimmer { from { transform: translateX(-100%) } to { transform: translateX(240%) } }`}</style>
        <div className="mt-4 text-center text-[10px] uppercase tracking-[0.25em] text-ink-faint">profile feed · loading…</div>
      </div>
    </div>
  );
}

function Shimmer({ speed = 1.8 }: { speed?: number }) {
  return (
    <span
      className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/14 to-transparent"
      style={{ animation: `mf-shimmer ${speed}s ease-in-out infinite` }}
      aria-hidden
    />
  );
}

function ChartCard({ bars = 12 }: DemoProps) {
  const n = typeof bars === "number" ? Math.max(6, Math.min(16, Math.round(bars))) : 12;
  const heights = [38, 62, 45, 78, 58, 92, 66, 84, 50, 72, 96, 88, 54, 70, 61, 90].slice(0, n);
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setOn(true); obs.disconnect(); }
    }, { threshold: 0.35 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="flex h-full w-full items-center justify-center bg-[radial-gradient(80%_100%_at_50%_0%,rgba(52,211,153,0.13),transparent_60%),#0a0c12] px-8">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/4 p-5 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Weekly activity</div>
            <div className="mt-1 text-xl font-black tracking-tight text-white">Build momentum</div>
          </div>
          <span className="chip !border-mint/30 !bg-mint/10 !text-mint">▲ 18.4%</span>
        </div>
        <div className="mt-5 flex h-24 items-end gap-1.5">
          {heights.map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-t-md"
              style={{
                height: on ? `${h}%` : "4%",
                background: i % 3 === 2 ? "linear-gradient(180deg,#34d399,#0d9488)" : "linear-gradient(180deg,#a78bfa,#5b21b6)",
                transition: `height .9s cubic-bezier(.3,1,.4,1) ${i * 60}ms`,
                opacity: 0.45 + (h / 110),
              }}
            />
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between text-[10px] text-ink-faint">
          <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-violet-400" /> pushes</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-mint" /> deploys</span>
        </div>
      </div>
    </div>
  );
}

const AVATAR_PEOPLE = [
  { n: "Lena K.", hue: 258 },
  { n: "Marco T.", hue: 192 },
  { n: "Aiko S.", hue: 330 },
  { n: "Dev R.", hue: 152 },
  { n: "Noa P.", hue: 28 },
  { n: "Ivy L.", hue: 210 },
];

function AvatarStack({ count = 5, size = 40 }: DemoProps) {
  const n = typeof count === "number" ? Math.max(2, Math.min(8, Math.round(count))) : 5;
  const s = typeof size === "number" ? Math.max(28, Math.min(72, size)) : 40;
  const people = AVATAR_PEOPLE.slice(0, n);
  const [hot, setHot] = useState<number | null>(null);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[#080a11] px-6">
      <div className="flex items-center pl-4" onMouseLeave={() => setHot(null)}>
        {people.map((p, i) => {
          const spread = hot !== null && i >= hot ? 1 : 0;
          return (
            <div
              key={p.n}
              className="group relative -ml-3 flex items-center"
              onMouseEnter={() => setHot(i)}
              style={{
                marginLeft: i === 0 ? 0 : -12,
                transform: `translateX(${spread * (i - hot!) * 8}px)`,
                transition: "transform .3s cubic-bezier(.34,1.56,.64,1)",
                zIndex: hot === i ? 20 : people.length - i,
              }}
            >
              <span
                className="flex items-center justify-center rounded-full border-2 border-[#0a0b10] font-bold text-white shadow-lg"
                style={{
                  width: s, height: s, fontSize: s * 0.36,
                  background: `linear-gradient(135deg, hsl(${p.hue} 85% 60%), hsl(${(p.hue + 45) % 360} 80% 45%))`,
                  boxShadow: hot === i ? `0 0 0 3px rgba(255,255,255,.12), 0 0 22px hsl(${p.hue} 90% 60% / .5)` : undefined,
                }}
              >
                {p.n.split(" ")[1]?.[0] ?? p.n[0]}
              </span>
              <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-white px-2.5 py-1 text-[10px] font-bold text-black opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                {p.n}
              </span>
            </div>
          );
        })}
        <span className="relative -ml-3 flex items-center justify-center rounded-full border-2 border-[#0a0b10] bg-white/10 font-bold text-ink-dim backdrop-blur" style={{ width: s, height: s, fontSize: s * 0.32 }}>
          +{214}
        </span>
      </div>
      <p className="text-center text-[11px] text-ink-faint">
        hover a face — the stack parts like a crowd · then settle back
      </p>
    </div>
  );
}

/* ------------------------------ OVERLAY WIDGETS (2026-09) ------------------------------ */

const PALETTE_SOURCES = [
  ...COMPONENTS.map((c) => ({ grp: "Components", icon: "▦", label: c.title, meta: `${c.kind} · ${c.slug}`, href: `/components/${c.slug}` })),
  ...PROMPTS.map((p) => ({ grp: "Prompts", icon: "◎", label: p.title, meta: `${p.industry} · ${p.avgFidelity}/100`, href: `/prompts/${p.slug}` })),
  ...LEARN_ARTICLES.map((g) => ({ grp: "Guides", icon: "✎", label: g.title, meta: `${g.level} · ${g.minutes} min`, href: `/learn/${g.slug}` })),
  { grp: "Pages", icon: "⌂", label: "Component library", meta: "browse all", href: "/components" },
  { grp: "Pages", icon: "◉", label: "Backgrounds", meta: "living canvases", href: "/backgrounds" },
  { grp: "Admin", icon: "⚙", label: "Moderation queue", meta: "admin", href: "/admin/moderation" },
];

function CommandPalette() {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const [flash, setFlash] = useState<string | null>(null);
  const needle = q.trim().toLowerCase();
  const filtered = PALETTE_SOURCES.filter(
    (it) => !needle || it.label.toLowerCase().includes(needle) || it.meta.toLowerCase().includes(needle),
  );
  const groups = [...new Set(filtered.map((f) => f.grp))];
  const open = (href: string) => {
    setFlash(href);
    setQ("");
    setSel(0);
    setTimeout(() => setFlash(null), 1400);
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(70%_90%_at_50%_0%,rgba(139,92,246,0.16),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/12 bg-[#0d0f17]/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
        <div className="flex items-center gap-2.5 border-b border-white/6 px-4 py-3">
          <span className="text-violet-300">⌘</span>
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setSel(0); }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setSel((v) => Math.min(filtered.length - 1, v + 1)); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setSel((v) => Math.max(0, v - 1)); }
              else if (e.key === "Enter") { e.preventDefault(); const hit = filtered[sel]; if (hit) open(hit.href); }
              else if (e.key === "Escape") { e.preventDefault(); setQ(""); setFlash(null); }
            }}
            placeholder={`Search ${COMPONENTS.length} assets, ${PROMPTS.length} prompts, guides…`}
            className="w-full bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
            aria-label="Search the whole library"
          />
          <span className="chip !text-[9px] !py-0.5 text-white/40">esc</span>
        </div>
        <div className="max-h-48 overflow-y-auto p-2">
          {filtered.length === 0 && <p className="px-3 py-5 text-center text-xs text-ink-faint">Nothing matches “{q}” — try “glass”, “pricing”, “admin”.</p>}
          {groups.map((g) => (
            <div key={g}>
              <div className="px-3 pb-1 pt-2 text-[9px] font-bold uppercase tracking-[0.25em] text-ink-faint">{g}</div>
              {filtered.filter((f) => f.grp === g).map((it) => {
                const idx = filtered.indexOf(it);
                return (
                  <button
                    key={it.href + it.label}
                    type="button"
                    onMouseEnter={() => setSel(idx)}
                    onClick={() => open(it.href)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); open(it.href); } }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-1.5 text-left text-[13px] transition-colors ${
                      sel === idx ? "bg-white/10 text-white" : "text-ink-dim"
                    }`}
                  >
                    <span className="w-4 text-center text-violet-300">{it.icon}</span>
                    <span className="flex-1 truncate font-medium">{it.label}</span>
                    <span className="shrink-0 text-[9px] text-ink-faint">{it.meta}</span>
                    {sel === idx && <span className="text-[9px] text-white/35">↵</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 border-t border-white/6 px-4 py-2 text-[9px] text-ink-faint">
          {flash ? (
            <span className="font-bold text-violet-300">↵ would open {flash}</span>
          ) : (
            <>
              <span><kbd className="rounded bg-white/8 px-1">↑</kbd><kbd className="ml-0.5 rounded bg-white/8 px-1">↓</kbd> navigate</span>
              <span><kbd className="rounded bg-white/8 px-1">↵</kbd> open</span>
              <span className="ml-auto">searches the real catalog</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const TOAST_MESSAGES = [
  "Build passed · 3.2s",
  "Wipe Reveal copied to clipboard",
  "New run log: 3/3 models clean",
  "Theme applied to 47 assets",
  "Changelog drafted — ready to publish",
];

function ToastStack({ time = 3.5 }: DemoProps) {
  const [toasts, setToasts] = useState<{ id: number; text: string; tone: number }[]>([]);
  const idRef = useRef(0);
  const ttl = typeof time === "number" ? Math.max(1, Math.min(8, time)) * 1000 : 3500;
  const push = () => {
    const id = ++idRef.current;
    const tone = (id % 3) * 110;
    setToasts((prev) => [...prev.slice(-2), { id, text: TOAST_MESSAGES[id % TOAST_MESSAGES.length], tone }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), ttl);
  };
  return (
    <div className="relative flex h-full w-full items-end justify-end overflow-hidden bg-[radial-gradient(60%_80%_at_80%_100%,rgba(34,211,238,0.12),transparent_60%),#0a0c13] p-5">
      {/* pretend page corner */}
      <div className="absolute left-4 top-4 space-y-1.5 opacity-60">
        <div className="h-2 w-24 rounded-full bg-white/15" />
        <div className="h-2 w-16 rounded-full bg-white/8" />
      </div>
      <button
        type="button"
        onClick={push}
        className="btn btn-primary absolute left-1/2 top-1/2 !px-5 !py-2.5 text-xs -translate-x-1/2 -translate-y-1/2"
      >
        Ping a toast
      </button>
      <div className="pointer-events-none absolute inset-x-4 bottom-4 flex flex-col items-end gap-2" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-[#0d0f17]/95 py-2.5 pl-3 pr-4 text-xs font-medium text-white shadow-2xl backdrop-blur-md"
            style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,.1), 0 12px 30px -10px hsl(${t.tone} 80% 55% / .45)` }}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full text-[10px]" style={{ background: `hsl(${t.tone} 85% 60% / .2)`, color: `hsl(${t.tone} 90% 72%)` }}>
              ✓
            </span>
            {t.text}
          </div>
        ))}
      </div>
    </div>
  );
}

function SheetMenu() {
  const [open, setOpen] = useState(true);
  const navs = ["Home", "Library", "AI Prompts", "Lab", "Pricing"];
  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(70%_100%_at_50%_0%,rgba(244,114,182,0.14),transparent_60%),#0a0c13] px-6">
      {/* phone frame */}
      <div className="relative h-[280px] w-[190px] overflow-hidden rounded-[26px] border border-white/15 bg-[#0b0d14] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.85)]">
        <div className="flex items-center justify-between px-4 pb-2 pt-4">
          <span className="text-[11px] font-black tracking-tight text-white">Motif</span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex h-7 w-7 flex-col items-center justify-center gap-[5px] rounded-lg border border-white/10 bg-white/5"
          >
            <span className="h-px w-3.5 bg-white/80" />
            <span className="h-px w-3.5 bg-white/80" />
            <span className="h-px w-3.5 bg-white/80" />
          </button>
        </div>
        <div className="px-4">
          <div className="h-2 w-20 rounded-full bg-white/20" />
          <div className="mt-2 h-2 w-14 rounded-full bg-white/8" />
          <div className="mt-4 space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-2 rounded-xl border border-white/6 bg-white/3 p-2">
                <span className="h-6 w-6 rounded-lg" style={{ background: `linear-gradient(135deg, hsl(${200 + i * 90} 80% 60% / .6), hsl(${(200 + i * 90 + 50) % 360} 80% 50% / .3))` }} />
                <span className="h-1.5 w-16 rounded-full bg-white/15" />
              </div>
            ))}
          </div>
        </div>

        {/* backdrop under the sheet */}
        {open && (
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 z-0 cursor-default"
            style={{ background: "rgba(0,0,0,0)" }}
            tabIndex={-1}
          />
        )}
        {/* bottom sheet */}
        <div
          className={`absolute inset-x-0 bottom-0 z-10 rounded-t-2xl border-t border-white/12 bg-[#0d0f17]/98 backdrop-blur-xl transition-transform duration-300 ${
            open ? "translate-y-0" : "translate-y-full"
          }`}
          style={{ transitionTimingFunction: "cubic-bezier(.34,1.4,.4,1)" }}
        >
          <div className="mx-auto mt-2 h-1 w-8 rounded-full bg-white/15" />
          <div className="px-3 pb-3 pt-2">
            {navs.map((nv) => (
              <button
                key={nv}
                type="button"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[12px] font-semibold text-white/85 transition-colors hover:bg-white/6 hover:text-white"
              >
                {nv}
                <span className="text-white/25">›</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="ml-6 hidden max-w-[170px] sm:block">
        <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink-faint">Bottom sheet</div>
        <div className="mt-2 text-base font-black leading-tight text-white">Tap the ☰ to open, tap a row to close</div>
        <p className="mt-2 text-[10px] leading-relaxed text-ink-dim">
          Mobile nav pattern with a springy sheet — draggable handle &amp; backdrop included in the code.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------ WAVE 4 SCENES (2026-09) ------------------------------ */

function SegmentedControl({ count = 3 }: DemoProps) {
  const pool = ["Essential", "Pro", "Scale", "Enterprise"];
  const n = typeof count === "number" ? Math.max(2, Math.min(5, Math.round(count))) : 3;
  const opts = pool.slice(0, n);
  const [sel, setSel] = useState(1);
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(34,211,238,0.13),transparent_60%),#08090f] px-6">
      <div className="relative flex items-center rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-md" style={{ gap: 2 }}>
        {opts.map((o, i) => {
          const active = sel === i;
          return (
            <button
              key={o}
              type="button"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setSel(i)}
              aria-pressed={active}
              className="relative z-10 rounded-xl px-5 py-2.5 text-sm font-bold transition-colors"
              style={{ color: active ? "#fff" : hover === i ? "#d7dae3" : "#8a93a6" }}
            >
              {o}
            </button>
          );
        })}
        {/* sliding thumb */}
        <span
          className="absolute rounded-xl border border-white/20 bg-white/12 shadow-[0_0_20px_rgba(34,211,238,0.25)]"
          aria-hidden
          style={{
            top: 6, bottom: 6, width: `calc((100% - 12px) / ${n})`,
            left: `calc(6px + ${sel} * (100% - 12px) / ${n})`,
            transition: "left .3s cubic-bezier(.65,0,.25,1)",
          }}
        />
      </div>
      <div className="flex items-center gap-2 text-xs text-ink-dim">
        <span className="chip !text-[10px] uppercase tracking-wider text-cyan-200/70">selected</span>
        <span className="font-mono text-cyan-200/90">{opts[sel]}</span>
        <span className="text-ink-faint">— tap to slide · segmented control</span>
      </div>
    </div>
  );
}

const NOTIFICATIONS = [
  { who: "lena.dev", text: "left a like on Aurora Veil", when: "2m", tone: 258 },
  { who: "Prompt runner", text: "GLM-4.6 finished · fidelity 94/100", when: "14m", tone: 192 },
  { who: "studio.noir", text: "published a new template", when: "1h", tone: 330 },
];

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(NOTIFICATIONS.length);
  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(60%_80%_at_50%_110%,rgba(244,114,182,0.13),transparent_60%),#0a0c13] px-6">
      <div className="relative w-full max-w-sm">
        {/* fake app header */}
        <div className="flex items-center justify-between rounded-t-2xl border border-white/10 bg-white/4 px-4 py-3 backdrop-blur-sm">
          <span className="text-sm font-black tracking-tight text-white">Motif Mail</span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={`Notifications, ${unread} unread`}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/6 text-base transition-all hover:bg-white/10"
            >
              🔔
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[9px] font-black text-white">
                  {unread}
                </span>
              )}
            </button>
            {open && (
              <>
                <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="fixed inset-0 cursor-default" tabIndex={-1} />
                <div
                  className="absolute right-0 z-20 mt-2 w-72 origin-top-right overflow-hidden rounded-2xl border border-white/12 bg-[#0d0f17]/98 shadow-2xl backdrop-blur-xl"
                  style={{ animation: "mf-drop .18s ease-out both" }}
                >
                  <style>{`@keyframes mf-drop { from { opacity: 0; transform: translateY(-6px) scale(.98) } }`}</style>
                  <div className="flex items-center justify-between border-b border-white/6 px-4 py-2.5">
                    <span className="text-xs font-bold text-ink">Notifications</span>
                    <button
                      type="button"
                      onClick={() => setUnread(0)}
                      className="text-[10px] font-semibold text-violet-300 hover:text-violet-200"
                    >
                      Mark all read
                    </button>
                  </div>
                  <ul className="divide-y divide-white/5">
                    {NOTIFICATIONS.map((nt, i) => (
                      <li key={nt.text} className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-white/4">
                        <span
                          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white"
                          style={{ background: `linear-gradient(135deg, hsl(${nt.tone} 85% 60%), hsl(${(nt.tone + 50) % 360} 80% 45%))` }}
                        >
                          {nt.who[0].toUpperCase()}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[12px] leading-snug text-ink-dim">
                            <b className="text-ink">{nt.who}</b> {nt.text}
                          </span>
                          <span className="mt-0.5 block text-[10px] text-ink-faint">{nt.when} ago{i < unread ? " · unread" : ""}</span>
                        </span>
                        {i < unread && <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />}
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-white/6 px-4 py-2 text-center text-[10px] font-semibold text-ink-faint">See all activity</div>
                </div>
              </>
            )}
          </div>
        </div>
        {/* pretend inbox rows */}
        <div className="divide-y divide-white/4 rounded-b-2xl border border-t-0 border-white/10 bg-white/2 p-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 px-2 py-2.5">
              <span className="h-8 w-8 rounded-xl" style={{ background: `linear-gradient(135deg, hsl(${200 + i * 70} 75% 60% / .5), hsl(${(200 + i * 70 + 40) % 360} 80% 50% / .2))` }} />
              <div className="flex-1 space-y-1.5">
                <div className="h-1.5 w-4/5 rounded-full bg-white/12" />
                <div className="h-1.5 w-3/5 rounded-full bg-white/6" />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-[10px] text-ink-faint">click the bell — unread badge, mark-all-read, aria-expanded wiring</p>
      </div>
    </div>
  );
}

const LONG_FEED = Array.from({ length: 24 }).map((_, i) => ({
  t: `Post ${String(i + 1).padStart(2, "0")}`,
  h: 12 + ((i * 37) % 40),
  c: 180 + i * 14,
}));

function ScrollProgress({ thickness = 6 }: DemoProps) {
  const th = typeof thickness === "number" ? Math.max(2, Math.min(12, Math.round(thickness))) : 6;
  const scroller = useRef<HTMLDivElement>(null);
  const [prog, setProg] = useState(0);
  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setProg(max > 0 ? el.scrollTop / max : 0);
  };
  return (
    <div className="relative flex h-full w-full flex-col bg-[#0a0c13]">
      {/* progress rail pinned to the stage's fake window */}
      <div className="relative z-10 flex items-center gap-2 border-b border-white/6 bg-[#0d1017]/95 px-4 py-2 backdrop-blur">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">Article · scroll to read</span>
        <span className="ml-auto font-mono text-[10px] text-cyan-200/80">{Math.round(prog * 100)}%</span>
        <span
          className="block rounded-full bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-300"
          aria-hidden
          style={{ height: th, width: "100%", maxWidth: 90, boxShadow: "0 0 12px rgba(139,92,246,.4)" }}
        >
          <span className="block h-full rounded-full bg-white/20" style={{ width: `${prog * 100}%` }} />
        </span>
      </div>
      <div ref={scroller} onScroll={onScroll} className="relative flex-1 overflow-y-auto px-5 py-4">
        <div className="mx-auto max-w-sm space-y-3">
          <div className="h-2.5 w-3/4 rounded-full bg-white/20" />
          <div className="h-2 w-1/2 rounded-full bg-white/8" />
          {LONG_FEED.map((f) => (
            <div key={f.t} className="rounded-xl border border-white/6 bg-white/3 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-ink-dim">{f.t}</span>
                <span className="text-[9px] text-ink-faint">reading time · {f.c}s</span>
              </div>
              <div className="mt-2 space-y-1.5">
                <div className="h-1.5 w-full rounded-full bg-white/10" />
                <div className="h-1.5 w-4/5 rounded-full bg-white/6" style={{ height: f.h > 30 ? 3 : undefined }} />
              </div>
            </div>
          ))}
          <p className="py-3 text-center text-[10px] text-ink-faint">— scroll inside this window —</p>
        </div>
      </div>
      <div className="absolute inset-y-0 right-0 top-0 z-0 flex w-1 flex-col bg-white/4">
        <div className="rounded-full bg-gradient-to-b from-violet-400 to-cyan-300 transition-[height] duration-75" style={{ height: `${prog * 100}%`, boxShadow: "0 0 10px rgba(139,92,246,.5)" }} />
      </div>
    </div>
  );
}

const QUOTES = [
  { q: "The only library where the demo isn't lying. What you see is what you copy.", who: "Lena K.", role: "Founder · linnea.dev", tone: 258 },
  { q: "I stopped screenshotting other people's heroes. Everything I need is here, themed to my brand in seconds.", who: "Marco T.", role: "Design engineer", tone: 192 },
  { q: "The prompt run logs are genius — I pick the model with the highest score and it just works.", who: "Aiko S.", role: "Solo builder", tone: 330 },
];

function TestimonialRotator({ speed = 5 }: DemoProps) {
  const sp = typeof speed === "number" ? Math.max(2, Math.min(14, speed)) * 1000 : 5000;
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % QUOTES.length), sp);
    return () => clearInterval(t);
  }, [sp]);
  const q = QUOTES[i];
  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(70%_90%_at_50%_0%,rgba(167,139,250,0.15),transparent_60%),#080a11] px-6">
      <div className="w-full max-w-md text-center">
        <div className="flex items-center justify-center gap-1 text-violet-300">
          {Array.from({ length: 5 }).map((_, s) => (
            <span key={s} className="text-sm">★</span>
          ))}
        </div>
        <blockquote
          key={i}
          className="mt-4 text-lg font-semibold leading-snug tracking-tight text-white md:text-xl"
          style={{ animation: "mf-rise .4s cubic-bezier(.16,1,.3,1) both" }}
        >
          “{q.q}”
        </blockquote>
        <div key={`${i}-who`} className="mt-4 flex items-center justify-center gap-2.5" style={{ animation: "mf-rise .4s .06s cubic-bezier(.16,1,.3,1) both" }}>
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-black text-white"
            style={{ background: `linear-gradient(135deg, hsl(${q.tone} 85% 60%), hsl(${(q.tone + 50) % 360} 80% 45%))` }}
          >
            {q.who[0]}
          </span>
          <span className="text-left">
            <span className="block text-xs font-bold text-ink">{q.who}</span>
            <span className="block text-[10px] text-ink-faint">{q.role}</span>
          </span>
        </div>
        <div className="mt-5 flex items-center justify-center gap-2">
          <button type="button" aria-label="Previous quote" onClick={() => setI((v) => (v - 1 + QUOTES.length) % QUOTES.length)} className="btn btn-quiet !h-7 !w-7 !rounded-full !p-0 text-xs">←</button>
          <div className="flex gap-1.5">
            {QUOTES.map((_, d) => (
              <button
                key={d} type="button" aria-label={`Quote ${d + 1}`} onClick={() => setI(d)}
                className={`h-1.5 rounded-full transition-all ${d === i ? "w-5 bg-violet-300" : "w-1.5 bg-white/20 hover:bg-white/35"}`}
              />
            ))}
          </div>
          <button type="button" aria-label="Next quote" onClick={() => setI((v) => (v + 1) % QUOTES.length)} className="btn btn-quiet !h-7 !w-7 !rounded-full !p-0 text-xs">→</button>
        </div>
        <p className="mt-3 text-[10px] text-ink-faint">auto-rotates every {Math.round(sp / 1000)}s · pauses nothing, respects readers</p>
      </div>
    </div>
  );
}

const COUNTDOWN_TOTAL_S = 2 * 86400 + 7 * 3600 + 22 * 60 + 19;
const COUNTDOWN_ENDS_AT = Date.now() + COUNTDOWN_TOTAL_S * 1000;

function CountdownDrop() {
  const [left, setLeft] = useState(COUNTDOWN_TOTAL_S);
  useEffect(() => {
    const t = setInterval(() => {
      const rem = Math.max(0, Math.round((COUNTDOWN_ENDS_AT - Date.now()) / 1000));
      setLeft(rem);
      if (rem === 0) clearInterval(t);
    }, 1000);
    return () => clearInterval(t);
  }, []);
  const d = Math.floor(left / 86400);
  const h = Math.floor((left % 86400) / 3600);
  const m = Math.floor((left % 3600) / 60);
  const s = left % 60;
  const cells = [
    { v: d, l: "days" }, { v: h, l: "hrs" }, { v: m, l: "min" }, { v: s, l: "sec" },
  ];
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-[radial-gradient(70%_100%_at_50%_100%,rgba(34,211,238,0.16),transparent_62%),#07080d] px-6">
      <div className="text-center">
        <div className="chip !mb-2 !text-[9px] uppercase tracking-[0.3em] text-cyan-200/70">DROP 004 · limited run</div>
        <div className="text-3xl font-black tracking-tight text-white md:text-4xl">The 004 ships in</div>
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        {cells.map((c, idx) => (
          <div key={c.l} className="flex items-center gap-2 md:gap-3">
            <div className="relative flex h-16 w-16 flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/12 bg-white/5 backdrop-blur-md md:h-20 md:w-20" style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,.15)" }}>
              <span key={c.v} className="text-2xl font-black tabular-nums text-white md:text-4xl" style={{ animation: "mf-flipin .4s cubic-bezier(.16,1,.3,1) both" }}>
                {String(c.v).padStart(2, "0")}
              </span>
              <style>{`@keyframes mf-flipin { from { opacity: 0; transform: translateY(-10px) } }`}</style>
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/40 md:text-[9px]">{c.l}</span>
            </div>
            {idx < cells.length - 1 && <span className="text-lg font-black text-white/30 md:text-2xl">:</span>}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="btn btn-primary !px-6 !py-2.5 text-xs">Notify me</span>
        <span className="text-[10px] text-ink-faint">live countdown · 60fps · no deps</span>
      </div>
    </div>
  );
}

const TERM_LINES = [
  { t: "$ npx create-motif --template saas", c: "text-emerald-300/90" },
  { t: "✓ scaffolded in 2.4s · 14 files", c: "text-white/70" },
  { t: "$ motif add aurora-veil", c: "text-emerald-300/90" },
  { t: "✓ asset installed (MIT · zero deps)", c: "text-white/70" },
  { t: "$ motif test prompt dark-saas-launch", c: "text-emerald-300/90" },
  { t: "claude ······ 95/100 ✓ clean", c: "text-violet-300/90" },
  { t: "codex ········ 91/100 ✓ clean", c: "text-cyan-300/90" },
  { t: "glm-4.6 ······· 90/100 ⚠ 1 fix", c: "text-pink-300/80" },
];

function TerminalHero({ speed = 34 }: DemoProps) {
  const sp = typeof speed === "number" ? Math.max(12, Math.min(140, Math.round(speed))) : 34;
  const joined = TERM_LINES.map((l) => l.t).join("\n");
  const [count, setCount] = useState(0);
  const done = count >= joined.length;
  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => setCount((c) => c + 1), sp);
    return () => clearTimeout(t);
  }, [count, done, sp]);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setCount(0), 4200);
    return () => clearTimeout(t);
  }, [done]);
  // build displayed segments
  const typed = joined.slice(0, count);
  const parts = typed.split("\n");
  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(60%_90%_at_50%_0%,rgba(139,92,246,0.16),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2 border-b border-white/8 bg-[#0d0f17] px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-[10px] font-mono text-ink-faint">motif — zsh</span>
          <span className="ml-auto text-[9px] font-bold uppercase tracking-widest text-violet-300/70">dev workflow</span>
        </div>
        <div className="h-44 overflow-hidden bg-[#07080d] p-4 font-mono text-[11.5px] leading-[1.8]">
          {parts.map((ln, idx) => {
            const base = TERM_LINES[idx];
            if (!base) return null;
            return (
              <div key={idx} className={base.c}>
                {ln}
                {idx === parts.length - 1 && !done && <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse-soft bg-cyan-300 align-middle" />}
              </div>
            );
          })}
          {done && <span className="inline-block h-3 w-1.5 animate-pulse-soft bg-cyan-300" />}
          <span className="sr-only" role="status">{done ? "Command sequence finished" : "Typing command sequence"}</span>
        </div>
        <p className="mt-2 text-center text-[10px] text-ink-faint">a self-typing terminal story — the AI-tool landing motif, without a video file</p>
      </div>
    </div>
  );
}

const POLAROID_SHOTS = [
  { label: "coast / 01", grad: "linear-gradient(135deg,#8b5cf6,#6366f1 55%,#0ea5e9)" },
  { label: "alpine / 02", grad: "linear-gradient(135deg,#34d399,#0ea5e9 60%,#6366f1)" },
  { label: "desert / 03", grad: "linear-gradient(135deg,#fbbf24,#f472b6 60%,#8b5cf6)" },
  { label: "forest / 04", grad: "linear-gradient(135deg,#f472b6,#a78bfa 55%,#34d399)" },
  { label: "night / 05", grad: "linear-gradient(135deg,#6366f1,#0ea5e9 60%,#34d399)" },
  { label: "fields / 06", grad: "linear-gradient(135deg,#f59e0b,#ef4444 55%,#a78bfa)" },
  { label: "tide / 07", grad: "linear-gradient(135deg,#06b6d4,#8b5cf6 60%,#f472b6)" },
];

function PolaroidStack({ count = 4 }: DemoProps) {
  const n = typeof count === "number" ? Math.max(2, Math.min(7, Math.round(count))) : 4;
  const shots = POLAROID_SHOTS.slice(0, n);
  const [order, setOrder] = useState(shots.map((_, i) => i));
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const bring = (id: number) => setOrder((o) => [id, ...o.filter((x) => x !== id)]);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(244,114,182,0.12),transparent_62%),#0a0b10] px-6">
      <div className="relative h-52 w-64">
        {order.map((shotIdx, pos) => {
          const shot = shots[shotIdx];
          const isTop = pos === 0;
          const rot = (shotIdx - (n - 1) / 2) * 9 + (pos % 2 === 0 ? 2 : -2);
          const lifted = hoverIdx === shotIdx;
          return (
            <button
              key={shotIdx}
              type="button"
              aria-label={`Bring ${shot.label} to front`}
              onMouseEnter={() => setHoverIdx(shotIdx)}
              onMouseLeave={() => setHoverIdx(null)}
              onClick={() => bring(shotIdx)}
              className="absolute inset-0 origin-bottom rounded-[6px] bg-white p-2 pb-8 text-left shadow-[0_18px_40px_-16px_rgba(0,0,0,0.8)] transition-transform duration-300"
              style={{
                transform: `rotate(${rot}deg) ${isTop ? "translateY(-6px) scale(1.06)" : ""} ${lifted ? "translateY(-12px)" : ""}`,
                zIndex: isTop ? 30 : pos + 1,
                filter: !isTop && hoverIdx !== null && !lifted ? "brightness(.75)" : undefined,
                transitionTimingFunction: "cubic-bezier(.34,1.4,.4,1)",
              }}
            >
              <span className="block h-full w-full rounded-[3px]" style={{ background: shot.grad }} />
              <span className="absolute bottom-2.5 left-3 text-[10px] font-semibold tracking-wide text-black/70">{shot.label}</span>
            </button>
          );
        })}
      </div>
      <p className="max-w-xs text-center text-[10px] leading-relaxed text-ink-faint">
        hover lifts a photo · <b className="text-ink-dim">click brings it to the front</b> — a gallery that feels like a table
      </p>
    </div>
  );
}

const TEAM_MEMBERS = [
  { n: "Lena K.", r: "Founder / code", hue: 258 },
  { n: "Marco T.", r: "Motion design", hue: 192 },
  { n: "Aiko S.", r: "Systems", hue: 330 },
  { n: "Dev R.", r: "Infra", hue: 152 },
  { n: "Noa P.", r: "Content", hue: 28 },
  { n: "Ivy L.", r: "Research", hue: 210 },
];

function TeamSpotlightGrid() {
  const [spot, setSpot] = useState<Record<number, { x: number; y: number }>>({});
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 bg-[radial-gradient(70%_90%_at_50%_0%,rgba(34,211,238,0.12),transparent_60%),#0a0c13] px-6">
      <div className="text-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink-faint">The people behind the pixels</span>
      </div>
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        {TEAM_MEMBERS.map((m, i) => {
          const s = spot[i];
          return (
            <div
              key={m.n}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => { setHovered((h) => (h === i ? null : h)); setSpot((p) => { const c = { ...p }; delete c[i]; return c; }); }}
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setSpot((p) => ({ ...p, [i]: { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 } }));
              }}
              className="group relative flex cursor-default flex-col items-center overflow-hidden rounded-2xl border border-white/8 bg-white/4 px-3 py-5 text-center transition-transform duration-200 hover:scale-[1.03]"
            >
              {s && (
                <span
                  className="pointer-events-none absolute inset-0"
                  style={{ background: `radial-gradient(120px circle at ${s.x}% ${s.y}%, hsl(${m.hue} 85% 65% / .28), transparent 65%)` }}
                />
              )}
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-black text-white transition-shadow duration-200"
                style={{
                  background: `linear-gradient(135deg, hsl(${m.hue} 85% 60%), hsl(${(m.hue + 50) % 360} 80% 45%))`,
                  boxShadow: hovered === i ? `0 0 0 3px hsl(${m.hue} 85% 65% / .3), 0 6px 18px -4px hsl(${m.hue} 85% 55% / .5)` : "none",
                }}
              >
                {m.n.split(" ")[1]?.[0] ?? m.n[0]}
              </span>
              <div className="mt-2.5 text-xs font-bold text-white">{m.n}</div>
              <div className="mt-0.5 text-[9px] font-medium uppercase tracking-wider text-white/40">{m.r}</div>
            </div>
          );
        })}
      </div>
      <p className="text-center text-[10px] text-ink-faint">per-card cursor spotlight — a team grid that feels lit, not flat</p>
    </div>
  );
}


const COMBO_POOL = [
  { v: "wipe-reveal", l: "Wipe Reveal", m: "section · CSS only" },
  { v: "aurora-veil", l: "Aurora Veil", m: "background · layered" },
  { v: "tilt-card", l: "Tilt Card", m: "element · pointer" },
  { v: "terminal-hero", l: "Terminal Hero", m: "section · typed" },
  { v: "counter-stats", l: "Counter Stats", m: "animated · data" },
  { v: "sheet-menu", l: "Sheet Menu", m: "element · mobile" },
];

function ComboBox() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [act, setAct] = useState(0);
  const [sel, setSel] = useState<string | null>(COMBO_POOL[0].v);
  const needle = q.trim().toLowerCase();
  const list = COMBO_POOL.filter(
    (o) => !needle || o.l.toLowerCase().includes(needle) || o.m.includes(needle) || o.v.includes(needle),
  );
  const pick = (v: string) => { setSel(v); setQ(""); setOpen(false); setAct(0); };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(139,92,246,0.14),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.24em] text-violet-300/70">
          <span>Add to build</span>
          <span className="normal-case tracking-normal text-ink-faint">6 components</span>
        </div>
        <div className="relative">
          <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setOpen(true); setAct(0); }}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onKeyDown={(e) => {
              const len = Math.max(1, list.length);
              if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setAct((a) => (a + 1) % len); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setOpen(true); setAct((a) => (a - 1 + len) % len); }
              else if (e.key === "Enter") { e.preventDefault(); const hit = list[act] ?? list[0]; if (hit) pick(hit.v); }
              else if (e.key === "Escape") setOpen(false);
            }}
            role="combobox"
            aria-expanded={open}
            aria-controls="cb-list"
            aria-activedescendant={open && list[act] ? `cb-${list[act].v}` : undefined}
            className="input !rounded-xl !py-2.5 !pl-10 !pr-9"
            placeholder="Find a component…"
          />
          <svg className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-ink-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {open && (
            <ul
              id="cb-list"
              role="listbox"
              aria-label="Components"
              className="absolute inset-x-0 top-[calc(100%+6px)] z-10 overflow-hidden rounded-xl border border-white/10 bg-[#0d0f17] py-1 shadow-2xl"
              style={{ animation: "mf-growin .14s ease-out both" }}
            >
              {list.length === 0 && <li className="px-3.5 py-3 text-xs text-ink-faint">No matches — try “aurora” or “card”.</li>}
              {list.map((o, i) => (
                <li
                  key={o.v}
                  id={`cb-${o.v}`}
                  role="option"
                  aria-selected={act === i}
                  onMouseEnter={() => setAct(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(o.v)}
                  className={`flex cursor-pointer items-center justify-between gap-3 px-3.5 py-2 text-sm ${act === i ? "bg-violet-400/12 text-ink" : "text-ink-dim"}`}
                >
                  <span>
                    <span className="font-semibold">{o.l}</span>
                    <span className="ml-2 text-[10px] uppercase tracking-wider text-ink-faint">{o.m}</span>
                  </span>
                  {sel === o.v && <span className="text-violet-300">✓</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="mt-2 text-[11px] text-ink-faint">↑↓ move · ↵ choose · esc close · typed filtering with a no-match row</p>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="chip !text-[10px] uppercase tracking-wider text-violet-200/70">selected</span>
        <span className="font-mono text-violet-100/90">{COMBO_POOL.find((o) => o.v === sel)?.l ?? "—"}</span>
      </div>
    </div>
  );
}

function OdometerCounter({ target = 18624 }: DemoProps) {
  const goal = typeof target === "number" ? Math.max(100, Math.min(999999, Math.round(target))) : 18624;
  const [v, setV] = useState(0);
  const done = v >= goal;
  useEffect(() => {
    if (done) return;
    const per = Math.max(1, Math.round(goal / 110));
    const t = setInterval(
      () => setV((p) => { const n = p + per + Math.round(Math.random() * 3); return n >= goal ? goal : n; }),
      42,
    );
    return () => clearInterval(t);
  }, [done, goal]);
  const cells = String(v).padStart(6, "0").split("");
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[radial-gradient(60%_90%_at_50%_100%,rgba(52,211,153,0.13),transparent_62%),#08090f] px-6">
      <div className="chip !border-mint/25 !bg-mint/10 !text-mint">RUN 07 · copies this month</div>
      <div className="flex items-center gap-1.5" role="img" aria-label={`${v.toLocaleString("en-US")} copies`}>
        {cells.map((d, i) => (
          <span
            key={i}
            className="relative flex h-12 w-8 items-center justify-center overflow-hidden rounded-lg border border-white/12 bg-black/40 md:h-14 md:w-9"
            style={{ boxShadow: "inset 0 2px 7px rgba(0,0,0,.75), inset 0 -2px 7px rgba(0,0,0,.55)" }}
          >
            <span key={`${i}-${d}`} className="relative flex h-full w-full items-center justify-center font-mono text-xl font-black tabular-nums text-white md:text-2xl" style={{ animation: "mf-roll .18s cubic-bezier(.2,.7,.3,1) both" }}>
              {d}
            </span>
            <span aria-hidden className="pointer-events-none absolute -top-3.5 inset-x-0 flex justify-center font-mono text-lg font-black tabular-nums text-white/25 blur-[1.5px]">{(Number(d) + 9) % 10}</span>
            <span aria-hidden className="pointer-events-none absolute -bottom-3.5 inset-x-0 flex justify-center font-mono text-lg font-black tabular-nums text-white/25 blur-[1.5px]">{(Number(d) + 1) % 10}</span>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2 text-[11px] text-ink-dim">
        {done ? (
          <span className="font-bold text-mint">✓ counted to {v.toLocaleString("en-US")}</span>
        ) : (
          <span className="text-ink-faint">counting… mechanical wheels, no easing shortcut</span>
        )}
      </div>
    </div>
  );
}

function StarRating() {
  const [rating, setRating] = useState(3.5);
  const [hover, setHover] = useState<number | null>(null);
  const shown = Math.max(0, Math.min(5, hover ?? rating));
  const pct = (shown / 5) * 100;
  const valueFromEvent = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const seg = r.width / 5;
    const i = Math.max(0, Math.min(4, Math.floor((e.clientX - r.left) / seg)));
    const half = e.clientX - r.left - i * seg < seg / 2;
    return i + (half ? 0.5 : 1);
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(251,191,36,0.12),transparent_60%),#08090f] px-6">
      <div className="chip !border-amber-300/25 !bg-amber-400/10 !text-amber-200">rating input · half-star precision</div>
      <div
        role="slider"
        tabIndex={0}
        aria-label="Rate this component"
        aria-valuemin={0}
        aria-valuemax={5}
        aria-valuenow={shown}
        aria-valuetext={`${shown} out of 5 stars`}
        className="relative inline-block cursor-pointer select-none text-[46px] leading-none outline-none"
        onMouseMove={(e) => setHover(valueFromEvent(e))}
        onMouseLeave={() => setHover(null)}
        onClick={(e) => setRating(valueFromEvent(e))}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); setRating((r) => Math.min(5, Math.round((r + 0.5) * 10) / 10)); }
          else if (e.key === "ArrowLeft") { e.preventDefault(); setRating((r) => Math.max(0, Math.round((r - 0.5) * 10) / 10)); }
          else if (e.key === "Home") { e.preventDefault(); setRating(0); }
          else if (e.key === "End") { e.preventDefault(); setRating(5); }
        }}
      >
        <span className="tracking-[0.12em] text-white/12" aria-hidden>★★★★★</span>
        <span className="absolute inset-0 overflow-hidden whitespace-nowrap" style={{ width: `${pct}%` }} aria-hidden>
          <span className="tracking-[0.12em] text-amber-300" style={{ textShadow: "0 0 14px rgba(251,191,36,.45)" }}>★★★★★</span>
        </span>
      </div>
      <div className="flex items-center gap-3 text-xs">
        <span className="font-mono text-amber-100/90">{shown.toFixed(1)} / 5</span>
        <button type="button" onClick={() => setRating(0)} className="rounded-full border border-white/12 px-2.5 py-1 text-[10px] font-semibold text-ink-faint transition-colors hover:border-white/30 hover:text-ink">
          Clear ↺
        </button>
        <span className="text-ink-faint">← hover to preview · click to set · arrows nudge</span>
      </div>
    </div>
  );
}

const TAG_POOL = ["motion", "dark", "glass", "svg", "vue", "3d"];

function TagInput({ limit = 4 }: DemoProps) {
  const lim = typeof limit === "number" ? Math.max(2, Math.min(6, Math.round(limit))) : 4;
  const [tags, setTags] = useState<string[]>(["motion", "glass"]);
  const [val, setVal] = useState("");
  const add = (raw: string) => {
    const t = raw.trim().toLowerCase().replace(/,+$/, "");
    if (!t || tags.includes(t) || tags.length >= lim) return;
    setTags((p) => [...p, t]);
  };
  const remove = (t: string) => setTags((p) => p.filter((x) => x !== t));
  const pool = TAG_POOL.filter((t) => !tags.includes(t));
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(34,211,238,0.12),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-300/70">Filter tags</div>
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-white/10 bg-white/4 p-2 backdrop-blur-md">
          {tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-300/30 bg-cyan-400/10 px-2.5 py-1 text-xs font-semibold text-cyan-100" style={{ animation: "mf-pop .18s cubic-bezier(.34,1.56,.64,1) both" }}>
              {t}
              <button type="button" aria-label={`Remove ${t}`} onClick={() => remove(t)} className="text-cyan-200/60 transition-colors hover:text-white">×</button>
            </span>
          ))}
          <input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(val); setVal(""); }
              else if (e.key === "Backspace" && val === "" && tags.length) remove(tags[tags.length - 1]);
            }}
            placeholder={tags.length >= lim ? "full" : "add…"}
            disabled={tags.length >= lim}
            aria-label="Add a tag"
            className="input min-w-20 flex-1 !rounded-lg !border-transparent !bg-transparent !px-2 !py-1 !text-xs !shadow-none focus:!border-transparent disabled:opacity-40"
          />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-ink-faint">suggested</span>
          {pool.map((t) => (
            <button key={t} type="button" onClick={() => add(t)} className="chip !cursor-pointer !text-[10px] transition-colors hover:!border-cyan-300/40 hover:!text-cyan-100">
              + {t}
            </button>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-ink-faint">
          {tags.length}/{lim} used · Enter or comma adds · backspace removes the last chip
        </p>
      </div>
    </div>
  );
}

function SliderWithTicks({ initial = 62 }: DemoProps) {
  const iv = typeof initial === "number" ? Math.max(0, Math.min(100, Math.round(initial))) : 62;
  const [v, setV] = useState(iv);
  const [drag, setDrag] = useState(false);
  const ticks = [0, 25, 50, 75, 100];
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-[radial-gradient(60%_90%_at_50%_100%,rgba(139,92,246,0.13),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-baseline justify-between">
          <span className="text-xs font-semibold text-ink-dim">Reveal threshold</span>
          <span className="font-mono text-sm font-extrabold text-violet-100">{v}%</span>
        </div>
        <div className="relative pt-9">
          {drag && (
            <span
              className={`pointer-events-none absolute top-0 -translate-x-1/2 rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold ${drag ? "border-violet-300/50 bg-violet-500/90 text-white" : "border-white/15 bg-black/70 text-ink"}`}
              style={{ left: `${v}%` }}
            >
              {v}%
            </span>
          )}
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={v}
            aria-label="Reveal threshold percentage"
            onChange={(e) => setV(Number(e.target.value))}
            onPointerDown={() => setDrag(true)}
            onPointerUp={() => setDrag(false)}
            onPointerLeave={() => setDrag(false)}
            className="relative w-full"
          />
          <div className="relative mx-0.5 mt-1.5 h-1.5">
            {ticks.map((t) => (
              <span key={t} aria-hidden className={`absolute top-0 h-1.5 w-px -translate-x-1/2 ${t <= v ? "bg-violet-300/70" : "bg-white/20"}`} style={{ left: `${t}%` }} />
            ))}
          </div>
          <div className="mt-1 flex justify-between text-[9px] font-semibold text-ink-faint">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
        <p className="mt-4 text-[11px] text-ink-faint">ticks mark quarter steps · the bubble rides the thumb while you drag</p>
      </div>
    </div>
  );
}

const PERK_OPTS = [
  { id: "tokens", glyph: "◍", t: "Token theming", d: "Restyle via CSS variables." },
  { id: "motion", glyph: "∿", t: "Motion presets", d: "Easings + spring packs." },
  { id: "logs", glyph: "☰", t: "Run logs", d: "Tested on 3 models." },
  { id: "export", glyph: "⇣", t: "Export kit", d: "Figma vars + Tailwind preset." },
];

function CheckboxCard() {
  const [on, setOn] = useState<string[]>(["tokens"]);
  const toggle = (id: string) => setOn((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const all = on.length === PERK_OPTS.length;
  const toggleAll = () => setOn(all ? [] : PERK_OPTS.map((o) => o.id));
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(52,211,153,0.12),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-mint">Bundle add-ons</span>
          <button type="button" onClick={toggleAll} className="text-[11px] font-semibold text-ink-dim transition-colors hover:text-ink">
            {all ? "Clear all" : "Select all"}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {PERK_OPTS.map((o) => {
            const active = on.includes(o.id);
            return (
              <button
                key={o.id}
                type="button"
                role="checkbox"
                aria-checked={active}
                onClick={() => toggle(o.id)}
                className={`relative rounded-xl border p-3 text-left transition-all duration-200 ${active ? "border-mint/50 bg-mint/10 shadow-[0_0_24px_-8px_rgba(52,211,153,.4)]" : "border-white/8 bg-white/4 hover:border-white/18"}`}
              >
                <span className="flex items-center gap-2">
                  <span className={`text-base ${active ? "text-mint" : "text-ink-faint"}`}>{o.glyph}</span>
                  <span className="text-xs font-bold">{o.t}</span>
                </span>
                <span className={`mt-1 block text-[10px] leading-snug ${active ? "text-mint/80" : "text-ink-faint"}`}>{o.d}</span>
                <span className={`absolute right-2.5 top-2.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border ${active ? "border-mint/60 bg-mint/20" : "border-white/15"}`} aria-hidden>
                  {active && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 12.5 4.5 4.5L19 7.5" style={{ strokeDasharray: 14, strokeDashoffset: 14, animation: "mf-draw .25s ease-out forwards" }} />
                    </svg>
                  )}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-[11px] text-ink-faint">
          {on.length} of {PERK_OPTS.length} selected · a checkbox, not a radio — any mix is fair
        </p>
      </div>
    </div>
  );
}

function QuantityStepper({ step = "1" }: DemoProps) {
  const st = Math.max(1, Math.min(5, Number(step) || 1));
  const [qty, setQty] = useState(3);
  const [hold, setHold] = useState<1 | -1 | null>(null);
  const clamp = (n: number) => Math.max(1, Math.min(24, n));
  useEffect(() => {
    if (hold === null) return;
    const t = setInterval(() => setQty((p) => clamp(p + hold * st)), 110);
    return () => clearInterval(t);
  }, [hold, st]);
  const stepBtn = (d: 1 | -1) => (
    <button
      type="button"
      aria-label={d === 1 ? "Increase quantity" : "Decrease quantity"}
      disabled={(d === -1 && qty <= 1) || (d === 1 && qty >= 24)}
      onPointerDown={(e) => { e.preventDefault(); setQty((p) => clamp(p + d * st)); setHold(d); }}
      onPointerUp={() => setHold(null)}
      onPointerLeave={() => setHold(null)}
      onPointerCancel={() => setHold(null)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setQty((p) => clamp(p + d * st)); }
      }}
      className="flex h-11 w-11 select-none items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg font-bold text-ink transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
    >
      {d === 1 ? "+" : "−"}
    </button>
  );
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[radial-gradient(60%_90%_at_50%_100%,rgba(244,114,182,0.12),transparent_60%),#08090f] px-6">
      <div className="chip !border-pink-300/25 !bg-pink-400/10 !text-pink-200">quantity stepper · step +{st}</div>
      <div className="flex items-center gap-3">
        {stepBtn(-1)}
        <div className="w-16 text-center">
          <div key={qty} className="text-4xl font-black tabular-nums" style={{ animation: "mf-pop .16s cubic-bezier(.34,1.56,.64,1) both" }}>{qty}</div>
          <div className="text-[9px] uppercase tracking-widest text-ink-faint">tickets</div>
        </div>
        {stepBtn(1)}
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="text-ink-faint">subtotal</span>
        <span className="font-mono text-sm font-extrabold text-pink-100">${qty * 32}</span>
        <span className="chip !text-[9px] uppercase">£32 / ticket</span>
      </div>
      <p className="text-[11px] text-ink-faint">press and hold to repeat · pointer and keyboard both work</p>
    </div>
  );
}

const PLAN_POOL = [
  { n: "Starter", p: 0, d: "Community licence · MIT assets", f: ["39 components", "10 Learn guides", "Community prompts"] },
  { n: "Studio", p: 19, d: "For one solo builder shipping daily", f: ["Everything in Starter", "Prompt run logs + retries", "All Lab exports"] },
  { n: "Team", p: 49, d: "Up to 5 seats, shared library", f: ["Everything in Studio", "Team licence", "Private collections"] },
  { n: "Scale", p: 99, d: "Unlimited seats + component API", f: ["Everything in Team", "Component API", "Token-sync endpoints"] },
];

function RadioPills({ count = 3 }: DemoProps) {
  const n = typeof count === "number" ? Math.max(2, Math.min(4, Math.round(count))) : 3;
  const opts = PLAN_POOL.slice(0, n);
  const [sel, setSel] = useState(1);
  const cur = opts[Math.min(sel, opts.length - 1)];
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(244,114,182,0.11),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-pink-300/70">Choose a plan</div>
        <fieldset className="flex gap-2" aria-label="Choose a plan">
          {opts.map((o, i) => (
            <label
              key={o.n}
              className={`flex-1 cursor-pointer rounded-xl border px-3 py-2.5 text-center transition-all focus-within:ring-2 focus-within:ring-violet-400/80 ${sel === i ? "border-pink-300/50 bg-pink-400/12" : "border-white/10 bg-white/4 hover:border-white/20"}`}
            >
              <input type="radio" name="plan-demo" value={o.n} checked={sel === i} onChange={() => setSel(i)} className="sr-only" />
              <span className={`block text-xs font-bold ${sel === i ? "text-white" : "text-ink-dim"}`}>{o.n}</span>
              <span className={`mt-0.5 block font-mono text-[10px] ${sel === i ? "text-pink-200" : "text-ink-faint"}`}>${o.p}/mo</span>
            </label>
          ))}
        </fieldset>
        <div key={cur.n} className="mt-3 rounded-xl border border-white/8 bg-black/25 p-4" style={{ animation: "mf-growin .18s ease-out both" }}>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-extrabold">{cur.n}</span>
            <span className="font-mono text-lg font-black text-pink-200">${cur.p}</span>
          </div>
          <p className="mt-0.5 text-[11px] text-ink-dim">{cur.d}</p>
          <ul className="mt-2 space-y-1">
            {cur.f.map((f) => (
              <li key={f} className="flex items-center gap-1.5 text-[11px] text-ink-dim">
                <span className="text-mint">✓</span> {f}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-3 text-[11px] text-ink-faint">role=radiogroup — arrow keys move the check · focus ring is visible</p>
      </div>
    </div>
  );
}


function AutoGrowTextarea({ budget = 400 }: DemoProps) {
  const bd = typeof budget === "number" ? Math.max(80, Math.min(1200, Math.round(budget))) : 400;
  const [val, setVal] = useState("A launch page that loads in under a second and explains the product in one sentence — dark, glassy, no stock video.");
  const ref = useRef<HTMLTextAreaElement>(null);
  const [sent, setSent] = useState(false);
  const grow = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 168)}px`;
  };
  useEffect(grow, []);
  const left = bd - val.length;
  const tone = left < 0 ? "text-danger" : left < bd * 0.1 ? "text-amber-300" : "text-ink-faint";
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(60%_90%_at_50%_0%,rgba(139,92,246,0.13),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-md">
        <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.24em] text-violet-300/70">
          <span>Pitch the idea</span>
          <span className="normal-case tracking-normal text-ink-faint">auto-grows as you type</span>
        </div>
        <textarea
          ref={ref}
          value={val}
          onChange={(e) => { setVal(e.target.value); grow(); setSent(false); }}
          rows={3}
          maxLength={bd + 80}
          aria-label="Pitch text"
          placeholder="What are you shipping?"
          className="input w-full resize-none !rounded-2xl !py-3.5 leading-relaxed"
        />
        <div className="mt-1.5 flex items-center justify-between text-[11px]">
          <span className={sent ? "font-bold text-mint" : "text-ink-faint"}>
            {sent ? "✓ Sent to the build queue" : "no scrollbar — the box does the scrolling"}
          </span>
          <span className={`font-mono tabular-nums ${tone}`}>{left >= 0 ? `${left} left` : `${-left} over`}</span>
        </div>
        <div className="mt-3">
          <button
            type="button"
            onClick={() => { setSent(true); }}
            disabled={left < 0}
            className="btn btn-primary !w-full !py-2.5 !text-xs disabled:cursor-not-allowed disabled:opacity-40"
          >
            Send pitch
          </button>
        </div>
      </div>
    </div>
  );
}

const DATE_PRESETS = [
  { id: "today", label: "Today", days: 1 },
  { id: "7d", label: "7d", days: 7 },
  { id: "30d", label: "30d", days: 30 },
  { id: "90d", label: "90d", days: 90 },
] as const;

function DatePresetsPicker() {
  const [preset, setPreset] = useState("30d");
  const [custom, setCustom] = useState({ a: "2026-08-10", b: "2026-09-09" });
  const days = preset === "custom" ? 0 : (DATE_PRESETS.find((p) => p.id === preset)?.days ?? 30);
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const end = new Date();
  const start = preset === "custom" ? new Date(custom.a) : new Date(end.getTime() - days * 864e5);
  const rangeText = `${fmt(start)} — ${fmt(preset === "custom" ? new Date(custom.b) : end)}`;
  const bars = Array.from({ length: 14 }).map((_, i) => 26 + Math.round(Math.sin(i * 1.9 + days / 9) * 16 + Math.cos(i * 0.7) * 10));
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(60%_90%_at_50%_100%,rgba(34,211,238,0.12),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-md">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-300/70">Report window</div>
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-white/8 bg-white/4 p-1.5">
          {DATE_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPreset(p.id)}
              aria-pressed={preset === p.id}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                preset === p.id
                  ? "bg-cyan-400/15 text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,.12)]"
                  : "text-ink-dim hover:text-ink"
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPreset("custom")}
            aria-pressed={preset === "custom"}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              preset === "custom"
                ? "bg-cyan-400/15 text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,.12)]"
                : "text-ink-dim hover:text-ink"
            }`}
          >
            Custom
          </button>
        </div>
        {preset === "custom" && (
          <div className="mt-2 flex items-center gap-2 text-xs" style={{ animation: "mf-growin .15s ease-out both" }}>
            <input type="date" value={custom.a} max={custom.b} aria-label="From date" onChange={(e) => setCustom((p) => ({ ...p, a: e.target.value }))} className="input !py-1.5 !text-xs" />
            <span className="text-ink-faint">→</span>
            <input type="date" value={custom.b} min={custom.a} aria-label="To date" onChange={(e) => setCustom((p) => ({ ...p, b: e.target.value }))} className="input !py-1.5 !text-xs" />
          </div>
        )}
        <div className="mt-3 rounded-xl border border-white/8 bg-black/25 p-4">
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-semibold text-ink">{preset === "custom" ? "Custom range" : `Last ${days} day${days === 1 ? "" : "s"}`}</span>
            <span className="font-mono text-[11px] text-cyan-200/80">{rangeText}</span>
          </div>
          <div className="mt-3 flex h-16 items-end gap-1.5" aria-hidden>
            {bars.map((h, i) => (
              <span key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: `linear-gradient(180deg, hsl(192 90% 65% / .85), hsl(192 70% 40% / .35))` }} />
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-ink-faint">
            <span>{preset === "custom" ? "custom range · compare on export" : "copies per day · daily rollup"}</span>
            <span className="chip !text-[9px] uppercase">updated 4m ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FileDropZone() {
  const [phase, setPhase] = useState<"idle" | "over" | "busy" | "done">("idle");
  const [file, setFile] = useState<{ name: string; size: string } | null>(null);
  const [pct, setPct] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const started = useRef(false);
  useEffect(() => {
    if (phase !== "busy") return;
    started.current = true;
    const t = setInterval(() => {
      setPct((p) => {
        const n = p + 7 + Math.round(Math.random() * 6);
        if (n >= 100) {
          clearInterval(t);
          setTimeout(() => setPhase("done"), 250);
          return 100;
        }
        return n;
      });
    }, 90);
    return () => clearInterval(t);
  }, [phase]);
  const accept = (f?: File | null) => {
    const name = f?.name ?? "motif-build-spec.json";
    const size = f ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : "1.2 MB";
    setFile({ name, size });
    setPct(0);
    setPhase("busy");
  };
  const reset = () => { setPhase("idle"); setFile(null); setPct(0); started.current = false; };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(60%_90%_at_50%_0%,rgba(52,211,153,0.12),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-sm">
        <input ref={inputRef} type="file" className="hidden" aria-hidden tabIndex={-1} onChange={(e) => accept(e.target.files?.[0])} />
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload a build spec"
          onDragOver={(e) => { e.preventDefault(); if (phase === "idle") setPhase("over"); }}
          onDragLeave={() => phase === "over" && setPhase("idle")}
          onDrop={(e) => { e.preventDefault(); accept(e.dataTransfer?.files?.[0]); }}
          onClick={() => phase === "idle" && inputRef.current?.click()}
          onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && phase === "idle") inputRef.current?.click(); }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-9 text-center outline-none transition-all duration-200 ${
            phase === "over"
              ? "border-mint/70 bg-mint/8 scale-[1.01]"
              : phase === "done"
                ? "border-mint/40 bg-mint/5"
                : "border-white/15 bg-white/3 hover:border-mint/40 hover:bg-white/5"
          }`}
        >
          {phase !== "done" ? (
            <>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/6 text-xl text-mint">⇪</span>
              <span className="text-sm font-bold">{phase === "over" ? "Drop it — we have it" : "Drag a build spec here"}</span>
              <span className="text-[11px] text-ink-faint">or <span className="font-semibold text-mint">browse files</span> · anything under 5 MB</span>
            </>
          ) : (
            <>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mint/15 text-xl text-mint">✓</span>
              <span className="text-sm font-bold text-mint">{file?.name}</span>
              <span className="text-[11px] text-ink-faint">{file?.size} · uploaded clean</span>
            </>
          )}
        </div>
        {phase === "busy" && (
          <div className="mt-3 rounded-xl border border-white/8 bg-black/25 p-3" style={{ animation: "mf-growin .15s ease-out both" }}>
            <div className="flex items-center justify-between text-[11px]">
              <span className="truncate font-semibold text-ink-dim">{file?.name}</span>
              <span className="font-mono text-mint">{pct}%</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/8">
              <div className="h-full rounded-full bg-gradient-to-r from-mint to-cyan-300 transition-[width] duration-100" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-1.5 text-[10px] text-ink-faint">auditing a11y + size before it lands in your stack…</p>
          </div>
        )}
        {phase === "done" && (
          <button type="button" onClick={reset} className="btn btn-ghost mt-3 !w-full !py-2 text-xs">
            ↺ Upload another
          </button>
        )}
      </div>
    </div>
  );
}

const SETTING_ROWS = [
  { id: "digest", t: "Weekly digest", d: "A Tuesday email of what shipped in the library.", def: true },
  { id: "deploys", t: "Build alerts", d: "Ping me when a copied asset changes or breaks.", def: true },
  { id: "updates", t: "Product updates", d: "New tools, lab features and Pro launches.", def: false },
];

function ToggleLabelStack() {
  const [on, setOn] = useState<Record<string, boolean>>(() => Object.fromEntries(SETTING_ROWS.map((r) => [r.id, r.def])));
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(60%_90%_at_50%_0%,rgba(139,92,246,0.13),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-md">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-violet-300/70">Email preferences</div>
        <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/4">
          {SETTING_ROWS.map((r, i) => {
            const val = on[r.id];
            return (
              <div key={r.id} className={`flex items-center justify-between gap-4 px-4 py-3.5 ${i > 0 ? "border-t border-white/6" : ""}`}>
                <div className="min-w-0">
                  <div className="text-sm font-bold">{r.t}</div>
                  <div className="mt-0.5 text-[11px] leading-snug text-ink-faint">{r.d}</div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={val}
                  aria-label={r.t}
                  onClick={() => setOn((p) => ({ ...p, [r.id]: !val }))}
                  className={`flex h-6 w-11 shrink-0 items-center rounded-full border px-0.5 transition-colors duration-200 ${
                    val ? "justify-end border-violet-300/50 bg-gradient-to-r from-violet-500 to-indigo-500" : "justify-start border-white/15 bg-white/8"
                  }`}
                >
                  <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-white text-[8px] font-black text-violet-700 shadow" style={{ transition: "transform .15s" }}>
                    {val ? "✓" : ""}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] text-ink-faint">every switch announces its state — a label needs a description to be a real preference</p>
      </div>
    </div>
  );
}

function passwordScore(pw: string): number {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
const PASSWORD_LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"];

function PasswordStrength() {
  const [pw, setPw] = useState("motifui-2026");
  const [show, setShow] = useState(false);
  const score = passwordScore(pw);
  const colors = ["#f87171", "#f87171", "#fbbf24", "#34d399", "#34d399"];
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(60%_90%_at_50%_100%,rgba(244,114,182,0.11),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-pink-300/70">Create a password</div>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            aria-label="Password"
            aria-describedby="pw-meter"
            className="input !rounded-xl !py-2.5 !pr-16 font-mono"
            placeholder="Type something…"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-[11px] font-bold text-ink-faint transition-colors hover:bg-white/6 hover:text-ink"
          >
            {show ? "hide" : "show"}
          </button>
        </div>
        <div id="pw-meter" className="mt-3">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-ink-faint">strength</span>
            <span className="font-bold" style={{ color: colors[score] }}>{PASSWORD_LABELS[score]}</span>
          </div>
          <div className="mt-1.5 flex gap-1.5" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="h-1.5 flex-1 rounded-full transition-colors duration-300"
                style={{ background: i < score ? colors[score] : "rgba(255,255,255,.1)" }}
              />
            ))}
          </div>
          <ul className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] text-ink-faint">
            {[
              ["8+ characters", pw.length >= 8],
              ["upper + lower case", /[a-z]/.test(pw) && /[A-Z]/.test(pw)],
              ["a number", /[0-9]/.test(pw)],
              ["a symbol", /[^A-Za-z0-9]/.test(pw)],
            ].map(([label, ok]) => (
              <li key={String(label)} className={`flex items-center gap-1.5 ${ok ? "text-ink-dim" : ""}`}>
                <span style={{ color: ok ? colors[score] : "rgba(255,255,255,.25)" }}>{ok ? "✓" : "○"}</span> {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const DEPLOY_ACTIONS = [
  { label: "Preview build", note: "shareable URL · 2 min" },
  { label: "Deploy to staging", note: "no DNS change" },
  { label: "Roll back release", note: "last green build" },
];

function SplitButtonMenu() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("Ready — nothing deployed yet.");
  const run = (label: string) => { setStatus(`→ ${label}…`); setOpen(false); setTimeout(() => setStatus("✓ done · build passed in 3.2s"), 700); };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(60%_90%_at_50%_0%,rgba(139,92,246,0.15),transparent_60%),#08090f] px-6">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => run("Deploying live")}
            className="btn btn-primary !h-11 rounded-r-none !px-6 !py-0"
          >
            Deploy live
          </button>
          <div className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={open}
              aria-label="More deploy actions"
              onClick={() => setOpen((v) => !v)}
              className="btn btn-primary !h-11 !w-11 rounded-l-none !border-l !border-white/20 !px-0 !py-0"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .15s" }} aria-hidden>
                <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {open && (
              <div role="menu" className="absolute right-0 top-[calc(100%+6px)] z-10 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#0d0f17] py-1.5 shadow-2xl" style={{ animation: "mf-growin .13s ease-out both" }}>
                {DEPLOY_ACTIONS.map((a) => (
                  <button
                    key={a.label}
                    type="button"
                    role="menuitem"
                    onClick={() => run(a.label)}
                    className="flex w-full items-center justify-between gap-3 px-3.5 py-2 text-left text-xs transition-colors hover:bg-white/8"
                  >
                    <span className="font-semibold text-ink">{a.label}</span>
                    <span className="text-[9px] text-ink-faint">{a.note}</span>
                  </button>
                ))}
                <div className="my-1 border-t border-white/6" />
                <button type="button" role="menuitem" onClick={() => setOpen(false)} className="w-full px-3.5 py-2 text-left text-xs text-ink-faint transition-colors hover:bg-white/8">
                  esc to close
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-ink-dim">{status}</p>
      </div>
    </div>
  );
}

const CRUMBS = [
  { label: "Home", href: "/" },
  { label: "Library", href: "/components" },
  { label: "Components", href: "/components" },
  { label: "Animated", href: "/components?kind=animated" },
  { label: "Prism Switch", href: "/components/prism-switch" },
];

function BreadcrumbTrail() {
  const [full, setFull] = useState(false);
  const shown = full ? CRUMBS : CRUMBS.length > 4 ? [CRUMBS[0], CRUMBS[CRUMBS.length - 2], CRUMBS[CRUMBS.length - 1]] : CRUMBS;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(251,191,36,0.1),transparent_60%),#08090f] px-6">
      <nav aria-label="Breadcrumb" className="w-full max-w-md">
        <div className="chip !mb-3 !border-amber-300/25 !bg-amber-400/10 !text-amber-200">breadcrumb trail · separator-aware</div>
        <ol className="flex flex-wrap items-center gap-y-1 rounded-xl border border-white/8 bg-white/4 px-3.5 py-2.5 text-xs">
          {shown.map((c, i) => {
            const last = i === shown.length - 1;
            return (
              <li key={c.label + i} className="flex items-center">
                {last ? (
                  <span aria-current="page" className="flex items-center gap-1.5 rounded-lg bg-white/8 px-2 py-1 font-bold text-ink">
                    {c.label}
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-300/80" aria-hidden />
                  </span>
                ) : (
                  <>
                    <a href="#" onClick={(e) => e.preventDefault()} className="rounded-md px-2 py-1 font-medium text-ink-dim transition-colors hover:bg-white/6 hover:text-ink">{c.label}</a>
                    <svg className="mx-0.5 h-3 w-3 text-ink-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </li>
            );
          })}
          {!full && CRUMBS.length > 4 && (
            <li>
              <button
                type="button"
                onClick={() => setFull(true)}
                aria-label="Show full breadcrumb trail"
                title="Show full trail"
                className="mx-1 flex h-6 w-8 items-center justify-center rounded-md border border-dashed border-white/15 font-mono text-[11px] font-bold text-ink-faint transition-colors hover:border-amber-300/40 hover:text-amber-200"
              >
                …
              </button>
            </li>
          )}
        </ol>
      </nav>
      <p className="text-[11px] text-ink-faint">{full ? "full trail restored — tap the ellipsis collapses it again" : "collapsed to Home / … / current on small widths — the ellipsis expands it"}</p>
    </div>
  );
}

/* ------------------------------ RENDERER ------------------------------ */



export const DEMO_KEYS = [
  "prism-switch", "halo-button", "pulse-loader", "nav-dock",
  "aurora-veil", "halo-trail", "orbit-deck", "star-motes", "scramble-text", "tilt-card",
  "hero-aurora", "bento-studio", "marquee-logos", "faq-orbit",
  "glass", "noise", "grid", "sorbet", "halftone", "ink",
  "morph-blob", "conic-loader", "glass-pricing", "wipe-reveal", "counter-stats", "dot-draw",
  "text-cycle", "tab-morph", "flip-card", "skeleton-shimmer", "chart-card", "avatar-stack",
  "command-palette", "toast-stack", "sheet-menu",
  "segmented-control", "notification-bell", "scroll-progress", "testimonial-rotator",
  "countdown-drop", "terminal-hero", "polaroid-stack", "team-spotlight",
  "combo-box", "odometer-counter", "star-rating", "tag-input",
  "slider-ticks", "checkbox-card", "quantity-stepper", "radio-pills",
  "auto-grow-textarea", "date-presets", "file-drop-zone", "toggle-label-stack",
  "password-strength", "split-button-menu", "breadcrumb-trail",
] as const;

export type DemoKey = (typeof DEMO_KEYS)[number];

export function DemoView({ demo, props = {} }: { demo: string; props?: DemoProps }) {
  switch (demo as DemoKey) {
    case "prism-switch": return <PrismSwitch {...props} />;
    case "halo-button": return <HaloButton {...props} />;
    case "pulse-loader": return <PulseLoader {...props} />;
    case "nav-dock": return <NavDock {...props} />;
    case "aurora-veil": return <AuroraVeil {...props} />;
    case "halo-trail": return <HaloTrail {...props} />;
    case "orbit-deck": return <OrbitDeck {...props} />;
    case "star-motes": return <StarMotes {...props} />;
    case "scramble-text": return <ScrambleText {...props} />;
    case "tilt-card": return <TiltCard {...props} />;
    case "hero-aurora": return <HeroAurora />;
    case "bento-studio": return <BentoStudio />;
    case "marquee-logos": return <MarqueeLogos {...props} />;
    case "faq-orbit": return <FaqOrbit />;
    case "glass": return <BgLiquidGlass />;
    case "noise": return <BgNoise />;
    case "grid": return <BgGrid />;
    case "sorbet": return <BgSorbet />;
    case "halftone": return <BgHalftone />;
    case "ink": return <BgInk />;
    case "morph-blob": return <MorphBlob {...props} />;
    case "conic-loader": return <ConicLoader {...props} />;
    case "glass-pricing": return <GlassPricing {...props} />;
    case "wipe-reveal": return <WipeReveal {...props} />;
    case "counter-stats": return <CounterStats {...props} />;
    case "dot-draw": return <DotDraw {...props} />;
    case "text-cycle": return <TextCycle />;
    case "tab-morph": return <TabMorph />;
    case "flip-card": return <FlipCard />;
    case "skeleton-shimmer": return <SkeletonShimmer />;
    case "chart-card": return <ChartCard />;
    case "avatar-stack": return <AvatarStack {...props} />;
    case "command-palette": return <CommandPalette {...props} />;
    case "toast-stack": return <ToastStack {...props} />;
    case "sheet-menu": return <SheetMenu />;
    case "segmented-control": return <SegmentedControl {...props} />;
    case "notification-bell": return <NotificationBell />;
    case "scroll-progress": return <ScrollProgress {...props} />;
    case "testimonial-rotator": return <TestimonialRotator {...props} />;
    case "countdown-drop": return <CountdownDrop />;
    case "terminal-hero": return <TerminalHero {...props} />;
    case "polaroid-stack": return <PolaroidStack {...props} />;
    case "team-spotlight": return <TeamSpotlightGrid />;
        case "combo-box": return <ComboBox />;
    case "odometer-counter": return <OdometerCounter {...props} />;
    case "star-rating": return <StarRating />;
    case "tag-input": return <TagInput {...props} />;
    case "slider-ticks": return <SliderWithTicks {...props} />;
    case "checkbox-card": return <CheckboxCard />;
    case "quantity-stepper": return <QuantityStepper {...props} />;
    case "radio-pills": return <RadioPills {...props} />;
    case "auto-grow-textarea": return <AutoGrowTextarea {...props} />;
    case "date-presets": return <DatePresetsPicker />;
    case "file-drop-zone": return <FileDropZone />;
    case "toggle-label-stack": return <ToggleLabelStack />;
    case "password-strength": return <PasswordStrength />;
    case "split-button-menu": return <SplitButtonMenu />;
    case "breadcrumb-trail": return <BreadcrumbTrail />;
    default: return null;
  }
}

export function KeyframesStyle() {
  return <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />;
}
