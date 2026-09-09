"use client";

// Original live demos for Motif UI. Every visual below is authored in-house;
// none of the code is taken from third-party component libraries.

import { useEffect, useRef, useState } from "react";

export type DemoProps = Record<string, number | string | boolean>;

const KEYFRAMES = `
@keyframes mf-dot { 0%,100% { transform: scale(0.55); opacity:.35 } 40% { transform: scale(1); opacity:1 } }
@keyframes mf-spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
@keyframes mf-scramble { to { filter: blur(0) } }
@keyframes mf-gridmove { from { background-position: 0 0 } to { background-position: 0 -48px } }
@keyframes mf-glow { 0%,100% { opacity:.5; transform: scale(1)} 50% { opacity:.9; transform: scale(1.18)} }
@keyframes mf-rise { from { opacity:0; transform: translateY(14px)} to { opacity:1; transform:none} }
@keyframes mf-bob { 0%,100%{ transform: translateY(0) rotate(-1deg)} 50%{ transform: translateY(-10px) rotate(1.5deg)} }
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

/* ------------------------------ RENDERER ------------------------------ */

export const DEMO_KEYS = [
  "prism-switch", "halo-button", "pulse-loader", "nav-dock",
  "aurora-veil", "halo-trail", "orbit-deck", "star-motes", "scramble-text", "tilt-card",
  "hero-aurora", "bento-studio", "marquee-logos", "faq-orbit",
  "glass", "noise", "grid", "sorbet", "halftone", "ink",
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
    default: return null;
  }
}

export function KeyframesStyle() {
  return <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />;
}
