"use client";

// Original live demos for Motif UI. Every visual below is authored in-house;
// none of the code is taken from third-party component libraries.

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { BACKGROUNDS, COMPONENTS, PROMPTS } from "@/lib/data";
import { LEARN_ARTICLES } from "@/lib/learn";
import { KeyframesStyle } from "@/components/keyframes";

export { KeyframesStyle };

export type DemoProps = Record<string, number | string | boolean>;

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

const TOAST_POOL: { text: string; tone: number; kind: "ok" | "undo" | "info" }[] = [
  { text: "Build passed · 3.2s", tone: 152, kind: "ok" },
  { text: "Wipe Reveal copied to clipboard", tone: 262, kind: "info" },
  { text: "Changed 3 theme tokens — undo?", tone: 32, kind: "undo" },
  { text: "New run log: 3/3 models clean", tone: 152, kind: "ok" },
  { text: "Theme applied to 62 assets", tone: 262, kind: "info" },
];

interface ToastItem {
  id: number;
  text: string;
  tone: number;
  kind: "ok" | "undo" | "info";
  undone?: boolean;
}

function ToastStack({ time = 4 }: DemoProps) {
  const ttl = typeof time === "number" ? Math.max(1, Math.min(10, time)) * 1000 : 4000;
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);
  const push = () => {
    const src = TOAST_POOL[idRef.current % TOAST_POOL.length];
    const id = ++idRef.current;
    const item: ToastItem = { id, text: src.text, tone: src.tone, kind: src.kind };
    setToasts((prev) => [...prev.slice(-2), item]);
    window.setTimeout(() => dismiss(id), ttl);
  };
  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));
  const undo = (id: number) =>
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, text: "✓ Tokens restored", tone: 152, kind: "ok", undone: true } : t)));
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[radial-gradient(60%_80%_at_80%_100%,rgba(34,211,238,0.12),transparent_60%),#0a0c13]">
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300/70">Toast queue · auto-dismiss + undo</span>
        <span className="chip !text-[9px] uppercase">{toasts.length}/3 on screen</span>
      </div>
      <div className="relative flex flex-1 items-center justify-center">
        <button type="button" onClick={push} className="btn btn-primary !px-5 !py-2.5 text-xs">
          Ping a toast
        </button>
      </div>
      <div className="pointer-events-none absolute inset-x-4 bottom-4 flex flex-col items-stretch gap-2 sm:items-end" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto w-full max-w-xs overflow-hidden rounded-xl border border-white/12 bg-[#0d0f17]/95 shadow-2xl backdrop-blur-md"
            style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,.1), 0 12px 30px -10px hsl(${t.tone} 80% 55% / .4)`, animation: "mf-toast-in .3s cubic-bezier(.34,1.56,.64,1) both" }}
          >
            <div className="flex items-center gap-2.5 py-2.5 pl-3 pr-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px]" style={{ background: `hsl(${t.tone} 85% 60% / .2)`, color: `hsl(${t.tone} 90% 72%)` }}>
                {t.kind === "undo" && !t.undone ? "↶" : "✓"}
              </span>
              <span className="min-w-0 flex-1 truncate text-xs font-medium text-white">{t.text}</span>
              {t.kind === "undo" && !t.undone && (
                <button type="button" onClick={() => undo(t.id)} className="rounded-md px-2 py-1 text-[10px] font-bold text-cyan-200 transition-colors hover:bg-white/10">
                  Undo
                </button>
              )}
              <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss notification" className="flex h-5 w-5 items-center justify-center rounded-md text-ink-faint transition-colors hover:bg-white/10 hover:text-ink">
                ✕
              </button>
            </div>
            {/* countdown bar */}
            <span aria-hidden className="block h-0.5 w-full overflow-hidden bg-white/5">
              <span className="block h-full" style={{ background: `hsl(${t.tone} 90% 65%)`, animation: `mf-shrink ${ttl}ms linear forwards` }} />
            </span>
          </div>
        ))}
      </div>
      <style>{`@keyframes mf-toast-in { from { opacity: 0; transform: translateY(14px) scale(.97) } }
@keyframes mf-shrink { from { width: 100% } to { width: 0% } }`}</style>
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


/* ------------------------------ NAVIGATION & SKELETON (batch 3) ------------------------------ */

function ellipsizedPages(page: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set<number>([1, 2, total - 1, total, page - 1, page, page + 1]);
  const sorted = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) out.push("…");
    out.push(n);
  });
  return out;
}

function PaginationEllipsis({ pages = 12 }: DemoProps) {
  const total = typeof pages === "number" ? Math.max(5, Math.min(30, Math.round(pages))) : 12;
  const [page, setPage] = useState(1);
  const items = ellipsizedPages(page, total);
  const go = (p: number) => setPage(Math.max(1, Math.min(total, p)));
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(139,92,246,0.13),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-md">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-violet-300/70">Browse library — page {page} of {total}</span>
          <span className="chip !text-[9px] uppercase">12 per page</span>
        </div>
        <div className="flex items-center justify-between gap-2 rounded-xl border border-white/8 bg-white/4 p-1.5">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => go(page - 1)}
            aria-label="Previous page"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-xs transition-colors hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ←
          </button>
          <div className="flex items-center gap-1" role="navigation" aria-label="Pagination">
            {items.map((it, i) =>
              it === "…" ? (
                <span key={`e${i}`} className="px-1 font-mono text-[11px] text-ink-faint" aria-hidden>…</span>
              ) : (
                <button
                  key={it}
                  type="button"
                  onClick={() => go(it)}
                  aria-current={it === page ? "page" : undefined}
                  className={`h-8 min-w-8 rounded-lg px-1.5 text-xs font-bold transition-all ${
                    it === page
                      ? "bg-gradient-to-b from-violet-500 to-indigo-600 text-white shadow-[0_6px_14px_-6px_rgba(124,58,237,.8)]"
                      : "text-ink-dim hover:bg-white/8 hover:text-ink"
                  }`}
                >
                  {it}
                </button>
              ),
            )}
          </div>
          <button
            type="button"
            disabled={page === total}
            onClick={() => go(page + 1)}
            aria-label="Next page"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-xs transition-colors hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-30"
          >
            →
          </button>
        </div>
        <p className="mt-3 text-[11px] text-ink-faint">edges stay pinned · the active page never jumps — the window slides around it</p>
      </div>
    </div>
  );
}

const TOC_SECTIONS = [
  { id: "s-intro", t: "Introduction", fill: 0 },
  { id: "s-tokens", t: "Tokens & theming", fill: 1 },
  { id: "s-motion", t: "Motion language", fill: 2 },
  { id: "s-a11y", t: "Accessibility", fill: 3 },
  { id: "s-faq", t: "FAQ", fill: 4 },
];
const TOC_PARAS = [
  "Every surface on this page is built from the same ten tokens, so nothing can drift out of the system.",
  "Motion here is a language with a tiny vocabulary: enter, focus, state. Nothing decorates for its own sake.",
  "We treat reduced motion as a second design, not a deletion — the story survives without the theatre.",
  "If a component can't be reached with a keyboard and understood by a screen reader, it doesn't ship.",
  "The library grows weekly and the changelog says exactly what changed and why — no vague release notes.",
];

function TocSpine() {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("s-intro");
  const jump = (id: string) => {
    const el = scroller.current;
    if (!el) return;
    const target = el.querySelector<HTMLElement>(`[data-sec="${id}"]`);
    if (target) el.scrollTo({ top: target.offsetTop - el.offsetTop - 8, behavior: "smooth" });
  };
  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    let cur = TOC_SECTIONS[0].id;
    for (const sec of TOC_SECTIONS) {
      const node = el.querySelector<HTMLElement>(`[data-sec="${sec.id}"]`);
      if (node && node.offsetTop - el.offsetTop - 24 <= el.scrollTop) cur = sec.id;
    }
    setActive(cur);
  };
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0c13]">
      <div className="flex items-center gap-2 border-b border-white/6 bg-[#0d1017]/95 px-4 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet-300/70">Guide · scroll the article</span>
        <span className="ml-auto font-mono text-[10px] text-ink-faint">TOC follows you</span>
      </div>
      <div className="flex min-h-0 flex-1">
        {/* article */}
        <div ref={scroller} onScroll={onScroll} className="min-w-0 flex-1 overflow-y-auto px-5 py-4">
          <div className="mx-auto max-w-sm space-y-3">
            {TOC_SECTIONS.map((sec, i) => (
              <div key={sec.id} data-sec={sec.id} className="rounded-xl border border-white/7 bg-white/3 p-3.5">
                <div className="text-xs font-extrabold tracking-tight">{sec.t}</div>
                <div className="mt-1.5 space-y-2">
                  <div className="h-1.5 w-full rounded-full bg-white/12" />
                  <div className="h-1.5 w-11/12 rounded-full bg-white/8" />
                  <div className="h-1.5 w-4/5 rounded-full bg-white/8" />
                </div>
                <p className="mt-2.5 text-[10px] leading-relaxed text-ink-dim">{TOC_PARAS[i]}</p>
              </div>
            ))}
          </div>
        </div>
        {/* toc spine */}
        <div className="hidden w-32 shrink-0 border-l border-white/6 bg-black/25 p-2.5 sm:block">
          <div className="px-1 pb-2 text-[8px] font-bold uppercase tracking-[0.22em] text-ink-faint">On this page</div>
          <ol className="space-y-0.5">
            {TOC_SECTIONS.map((sec) => (
              <li key={sec.id}>
                <button
                  type="button"
                  onClick={() => jump(sec.id)}
                  className={`flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-[9px] font-semibold transition-colors ${
                    active === sec.id ? "bg-violet-400/15 text-violet-100" : "text-ink-faint hover:text-ink-dim"
                  }`}
                >
                  <span className={`h-1 w-1 shrink-0 rounded-full ${active === sec.id ? "bg-violet-300" : "bg-white/20"}`} aria-hidden />
                  {sec.t}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

const TAB_TITLES = [
  { t: "Overview", body: "A one-screen glance at the library: newest assets, top copies, and what shipped this week." },
  { t: "Components", body: "54 themeable assets across elements, animated pieces, sections and whole templates." },
  { t: "Prompts", body: "24 run-tested prompts with per-model fidelity scores and public run logs." },
  { t: "Learn", body: "10 original guides that teach the motion and craft behind the code you copy." },
];

function TabsIndicator({ count = 3 }: DemoProps) {
  const n = typeof count === "number" ? Math.max(2, Math.min(4, Math.round(count))) : 3;
  const tabs = TAB_TITLES.slice(0, n);
  const [active, setActive] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);
  const [ind, setInd] = useState({ left: 0, width: 0 });
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    const el = btnRefs.current[active];
    const bar = barRef.current;
    if (el && bar) {
      setInd({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [active, n]);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(34,211,238,0.12),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-md">
        <div ref={barRef} role="tablist" aria-label="Sections" className="relative flex gap-1 border-b border-white/8">
          {tabs.map((t, i) => (
            <button
              key={t.t}
              ref={(el) => { btnRefs.current[i] = el; }}
              type="button"
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              className={`relative px-4 py-2.5 text-sm font-bold transition-colors ${active === i ? "text-cyan-100" : "text-ink-faint hover:text-ink-dim"}`}
            >
              {t.t}
            </button>
          ))}
          <span
            aria-hidden
            className="absolute -bottom-px h-0.5 rounded-full bg-gradient-to-r from-cyan-300 to-violet-400 shadow-[0_0_10px_rgba(34,211,238,.6)]"
            style={{ left: ind.left, width: ind.width, transition: "left .28s cubic-bezier(.65,0,.25,1), width .28s cubic-bezier(.65,0,.25,1)" }}
          />
        </div>
        <div key={active} className="mt-4 rounded-xl border border-white/8 bg-white/4 p-4" style={{ animation: "mf-growin .18s ease-out both" }}>
          <div className="text-sm font-extrabold text-cyan-100">{tabs[active].t}</div>
          <p className="mt-1 text-[11px] leading-relaxed text-ink-dim">{tabs[active].body}</p>
        </div>
        <p className="mt-3 text-[11px] text-ink-faint">the underline slides to the active tab&apos;s actual width — not a fixed fraction</p>
      </div>
    </div>
  );
}

const STICKY_SECS = [
  { id: "st-hero", t: "Hero" },
  { id: "st-features", t: "Features" },
  { id: "st-pricing", t: "Pricing" },
  { id: "st-faq", t: "FAQ" },
];

function StickySubNav() {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("st-hero");
  const jump = (id: string) => {
    const el = scroller.current;
    if (!el) return;
    const target = el.querySelector<HTMLElement>(`[data-sec="${id}"]`);
    if (target) el.scrollTo({ top: target.offsetTop - el.offsetTop - 44, behavior: "smooth" });
  };
  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    let cur = STICKY_SECS[0].id;
    for (const sec of STICKY_SECS) {
      const node = el.querySelector<HTMLElement>(`[data-sec="${sec.id}"]`);
      if (node && node.offsetTop - el.offsetTop - 60 <= el.scrollTop) cur = sec.id;
    }
    setActive(cur);
  };
  const heights = [150, 170, 140, 160];
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0c13]">
      <div ref={scroller} onScroll={onScroll} className="relative min-h-0 flex-1 overflow-y-auto">
        {/* the row that pins while content scrolls under it */}
        <div className="sticky top-0 z-20 flex items-center gap-1 border-b border-white/8 bg-[#0d1017]/95 px-3 py-2 backdrop-blur-md">
          <span className="mr-1 text-[9px] font-bold uppercase tracking-[0.2em] text-ink-faint">On-page</span>
          {STICKY_SECS.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => jump(sec.id)}
              aria-current={active === sec.id ? "true" : undefined}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors ${
                active === sec.id ? "bg-cyan-400/15 text-cyan-100" : "text-ink-dim hover:text-ink"
              }`}
            >
              {sec.t}
            </button>
          ))}
          <span className="ml-auto hidden font-mono text-[9px] text-ink-faint sm:block">position: sticky · top: 0</span>
        </div>
        <div className="px-4 py-4">
          <div className="space-y-3">
            {STICKY_SECS.map((sec, i) => (
              <div key={sec.id} data-sec={sec.id} className="rounded-xl border border-white/7 bg-white/3 p-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-cyan-400/12 px-1.5 py-0.5 font-mono text-[9px] font-bold text-cyan-200">{sec.id.replace("st-", "")}</span>
                  <span className="text-xs font-extrabold">{sec.t} section</span>
                </div>
                <div className="mt-2 space-y-1.5" style={{ height: heights[i] }}>
                  <div className="h-1.5 w-full rounded-full bg-white/10" />
                  <div className="h-1.5 w-5/6 rounded-full bg-white/7" />
                  <div className="h-1.5 w-2/3 rounded-full bg-white/7" />
                  <div className="h-1.5 w-11/12 rounded-full bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BackToTop() {
  const scroller = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    setShow(el.scrollTop > 130);
  };
  const toTop = () => scroller.current?.scrollTo({ top: 0, behavior: "smooth" });
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#0a0c13]">
      <div ref={scroller} onScroll={onScroll} className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <div className="mx-auto max-w-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet-300/70">Article · 60s read</span>
            <span className="ml-auto chip !text-[9px] uppercase">keep scrolling ↓</span>
          </div>
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/6 bg-white/3 p-3.5">
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-md bg-gradient-to-br from-violet-400/60 to-cyan-400/40" />
                <span className="text-xs font-bold">Section {i + 1}</span>
              </div>
              <div className="mt-2 space-y-1.5">
                <div className="h-1.5 w-full rounded-full bg-white/10" />
                <div className="h-1.5 w-10/12 rounded-full bg-white/7" />
                <div className="h-1.5 w-8/12 rounded-full bg-white/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* comet */}
      <button
        type="button"
        onClick={toTop}
        aria-label="Back to top"
        className={`absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-violet-300/40 bg-[#141728]/90 text-violet-200 shadow-[0_10px_30px_-8px_rgba(124,58,237,.7)] backdrop-blur transition-all duration-300 hover:scale-105 hover:bg-violet-500/25 ${
          show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
          <path d="M12 19V5m-6 6 6-6 6 6" />
        </svg>
      </button>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#0a0c13] to-transparent" aria-hidden />
      {show && <p className="pointer-events-none absolute bottom-5 right-16 text-[10px] font-semibold text-violet-200/70">comet appears after 2 screens</p>}
    </div>
  );
}

const FAQ_ROWS = [
  { q: "Can I use Motif assets in commercial projects?", a: "Yes — components are MIT and guides are CC BY 4.0. Attribution is appreciated, not required." },
  { q: "Do the prompts really get tested before they ship?", a: "Every prompt runs against three frontier models and the run log is public on its page — scores, screenshots, failure notes." },
  { q: "What does the audit gate actually check?", a: "Accessibility (axe + a human keyboard walk), bundle size, dependency count and original-content checks." },
  { q: "How often does the library grow?", a: "A content push lands most weeks. The changelog on the homepage lists every drop with dates and links." },
];

function DisclosureList() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const toggle = (i: number) => setOpenIdx((cur) => (cur === i ? null : i));
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(60%_90%_at_50%_0%,rgba(52,211,153,0.11),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-md">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-mint">FAQ · one row open at a time</span>
          <span className="chip !text-[9px] uppercase">aria-expanded wired</span>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/4">
          {FAQ_ROWS.map((row, i) => {
            const open = openIdx === i;
            return (
              <div key={row.q} className={i > 0 ? "border-t border-white/6" : ""}>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                >
                  <span className={`text-sm font-bold ${open ? "text-mint" : "text-ink"}`}>{row.q}</span>
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                    aria-hidden
                    className={`shrink-0 ${open ? "rotate-45 text-mint" : "text-ink-faint"}`}
                    style={{ transition: "transform .2s ease" }}
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
                {open && (
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-label={row.q}
                    className="px-4 pb-4 text-[12px] leading-relaxed text-ink-dim"
                    style={{ animation: "mf-growin .16s ease-out both" }}
                  >
                    {row.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const OVERLAY_LINKS = [
  { t: "Components", m: `${COMPONENTS.length} assets · themed` },
  { t: "AI Prompts", m: `${PROMPTS.length} tested briefs` },
  { t: "Backgrounds", m: `${BACKGROUNDS.length} living canvases` },
  { t: "Learn", m: `${LEARN_ARTICLES.length} craft guides` },
  { t: "The Lab", m: "physics you can touch" },
  { t: "Pricing", m: "free core, Pro power" },
];

function FullscreenOverlayMenu() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#0a0c13]">
      {/* fake page behind */}
      <div className="flex w-full flex-col px-6 opacity-60">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] font-black tracking-tight">motif<span className="text-violet-300">/ui</span></span>
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
        <div className="flex h-24 items-center justify-center rounded-2xl border border-white/8 bg-white/4">
          <span className="text-sm font-bold text-ink-dim">the page, dimmed behind the overlay</span>
        </div>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="absolute inset-0 z-30 flex flex-col bg-[#07080d]/97 px-6 py-5 backdrop-blur-md"
          style={{ animation: "mf-fade .18s ease-out both" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-black tracking-tight">motif<span className="text-violet-300">/ui</span></span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/12 bg-white/5 text-ink-dim transition-colors hover:text-ink">
              ✕
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-1" aria-label="Fullscreen">
            {OVERLAY_LINKS.map((l, i) => (
              <button
                key={l.t}
                type="button"
                onClick={() => setOpen(false)}
                className="group flex items-baseline gap-3 rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-white/4"
                style={{ animation: `mf-rise .25s ${0.03 * i}s cubic-bezier(.16,1,.3,1) both` }}
              >
                <span className="text-xl font-black tracking-tight text-white transition-transform group-hover:translate-x-1 md:text-2xl">{l.t}</span>
                <span className="text-[10px] uppercase tracking-widest text-violet-300/70">{l.m}</span>
              </button>
            ))}
          </nav>
          <p className="text-center text-[10px] text-ink-faint">esc closes · links stagger in 30ms apart</p>
        </div>
      )}
    </div>
  );
}

const SKELETON_PROFILE = {
  name: "Lena Voss",
  role: "Frontend engineer · Berlin",
  blurb: "Builds design systems and the teams that ship them. Collects vintage German type specimens.",
  counts: "14 builds · 3 awards",
};

function SkeletonCard({ delay = 1600 }: DemoProps) {
  const dl = typeof delay === "number" ? Math.max(400, Math.min(4000, Math.round(delay))) : 1600;
  const [again, setAgain] = useState(0);
  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(60%_90%_at_50%_100%,rgba(34,211,238,0.11),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-xs">
        <SkeletonCardInner key={again} delay={dl} onReplay={() => setAgain((n) => n + 1)} />
      </div>
    </div>
  );
}

function SkeletonCardInner({ delay, onReplay }: { delay: number; onReplay: () => void }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-white/8 bg-panel">
        {!loaded ? (
          <div className="p-5" aria-hidden>
            <div className="flex items-center gap-4">
              <div className="skeleton h-14 w-14 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3 w-3/4 rounded-full" />
                <div className="skeleton h-2.5 w-1/2 rounded-full" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="skeleton h-2.5 w-full rounded-full" />
              <div className="skeleton h-2.5 w-11/12 rounded-full" />
              <div className="skeleton h-2.5 w-2/3 rounded-full" />
            </div>
            <div className="mt-4 flex gap-2">
              <div className="skeleton h-6 w-20 rounded-full" />
              <div className="skeleton h-6 w-14 rounded-full" />
            </div>
            <style>{`@keyframes mf-sk-float { from { background-position: 100% 0 } to { background-position: -100% 0 } }
.skeleton { background: linear-gradient(90deg, rgba(255,255,255,.05) 25%, rgba(255,255,255,.14) 50%, rgba(255,255,255,.05) 75%); background-size: 200% 100%; animation: mf-sk-float 1.1s linear infinite; }`}</style>
          </div>
        ) : (
          <div className="p-5" style={{ animation: "mf-growin .25s ease-out both" }}>
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300/30 to-violet-400/30 text-lg font-black text-cyan-100">
                LV
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-extrabold tracking-tight">{SKELETON_PROFILE.name}</div>
                <div className="truncate text-[11px] text-cyan-200/70">{SKELETON_PROFILE.role}</div>
              </div>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-ink-dim">{SKELETON_PROFILE.blurb}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="chip !text-[9px] text-mint">{SKELETON_PROFILE.counts}</span>
              <span className="chip !text-[9px]">verified contributor</span>
            </div>
          </div>
        )}
      </div>
      <button type="button" onClick={onReplay} className="btn btn-ghost mt-3 !w-full !py-2 !text-xs">
        ↺ Replay the skeleton
      </button>
    </>
  );
}


const BANNER_TONES = [
  { id: "ok", t: "Success", glyph: "✓", text: "Your component passed the audit gate — quality 96, a11y 98.", cls: "border-mint/30 bg-mint/8 text-mint", iconCls: "bg-mint/15 text-mint" },
  { id: "err", t: "Error", glyph: "✕", text: "The prompt run failed on one model. Re-run or open the log.", cls: "border-danger/30 bg-danger/8 text-danger", iconCls: "bg-danger/15 text-danger" },
  { id: "warn", t: "Warning", glyph: "!", text: "Snippet is 6.8 KB gzipped — under budget, but watch the blur layer.", cls: "border-amber-300/30 bg-amber-400/8 text-amber-300", iconCls: "bg-amber-400/15 text-amber-300" },
  { id: "info", t: "Info", glyph: "i", text: "Learn guides now cover the 60fps handshake — new this week.", cls: "border-cyan-300/30 bg-cyan-400/8 text-cyan-300", iconCls: "bg-cyan-400/15 text-cyan-300" },
];

function StatusBanner() {
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});
  const [flash, setFlash] = useState(false);
  const visible = BANNER_TONES.filter((b) => !dismissed[b.id]);
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(139,92,246,0.12),transparent_60%),#08090f] px-6">
      <div className="mx-auto w-full max-w-md space-y-2.5">
        {visible.map((b) => (
          <div key={b.id} role="status" className={`flex items-start gap-3 rounded-xl border px-3.5 py-3 backdrop-blur-sm ${b.cls}`} style={{ animation: "mf-toast-in .25s ease-out both" }}>
            <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${b.iconCls}`}>{b.glyph}</span>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-extrabold">{b.t}</div>
              <div className="mt-0.5 text-[11px] leading-relaxed opacity-90">{b.text}</div>
            </div>
            <button type="button" aria-label={`Dismiss ${b.t} banner`} onClick={() => setDismissed((p) => ({ ...p, [b.id]: true }))} className="shrink-0 rounded-md px-1.5 py-0.5 text-xs opacity-60 transition-opacity hover:opacity-100">
              ✕
            </button>
          </div>
        ))}
        {visible.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/12 py-8 text-center text-xs text-ink-faint">
            All banners dismissed
            <button type="button" onClick={() => setDismissed({})} className="ml-2 font-bold text-violet-300 underline-offset-2 hover:underline">restore</button>
          </div>
        )}
        <button type="button" onClick={() => { setFlash(true); setDismissed({}); window.setTimeout(() => setFlash(false), 1600); }} className="btn btn-ghost !w-full !py-2 !text-xs">
          {flash ? "✓ A success banner will re-appear above" : "Reset + show a success banner"}
        </button>
      </div>
    </div>
  );
}

function ProgressRing() {
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState<"idle" | "run" | "stalled" | "done">("idle");
  const R = 40;
  const C = 2 * Math.PI * R;
  useEffect(() => {
    if (phase !== "run") return;
    const t = setInterval(() => {
      setPct((p) => {
        if (p >= 99) {
          clearInterval(t);
          window.setTimeout(() => setPhase("done"), 200);
          return 100;
        }
        const next = p + 2 + Math.random() * 5;
        if (next > 68 && next < 74 && Math.random() < 0.22) {
          clearInterval(t);
          setPhase("stalled");
          return Math.round(next);
        }
        return next;
      });
    }, 130);
    return () => clearInterval(t);
  }, [phase]);
  const start = () => { setPct(0); setPhase("run"); };
  const cancel = () => { setPct(0); setPhase("idle"); };
  const retry = () => { setPct(0); setPhase("run"); };
  const pctColor = phase === "stalled" ? "#fbbf24" : "#22d3ee";
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(34,211,238,0.12),transparent_60%),#08090f] px-6">
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden>
          <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="7" />
          <circle
            cx="50" cy="50" r={R} fill="none"
            stroke={pctColor}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C - (C * Math.max(0, Math.min(100, pct))) / 100}
            style={{ transition: "stroke-dashoffset .12s linear, stroke .3s" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {phase === "done" ? (
            <>
              <span className="text-xl text-mint">✓</span>
              <span className="text-[10px] font-bold text-mint">uploaded</span>
            </>
          ) : phase === "stalled" ? (
            <>
              <span className="text-sm font-black text-amber-300">{Math.round(pct)}%</span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-amber-300/80">stalled</span>
            </>
          ) : (
            <>
              <span className="font-mono text-sm font-black tabular-nums">{Math.round(pct)}%</span>
              <span className="text-[8px] uppercase tracking-wider text-ink-faint">{phase === "run" ? "uploading" : "ready"}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {phase === "run" && (
          <button type="button" onClick={cancel} className="btn btn-quiet !px-4 !py-2 !text-xs">
            Cancel upload
          </button>
        )}
        {phase === "stalled" && (
          <>
            <span className="chip !border-amber-300/30 !text-amber-200">connection dropped — retry?</span>
            <button type="button" onClick={retry} className="btn btn-primary !px-4 !py-2 !text-xs">
              ↺ Retry
            </button>
          </>
        )}
        {phase !== "run" && phase !== "stalled" && (
          <button type="button" onClick={start} className="btn btn-primary !px-5 !py-2 !text-xs">
            {phase === "done" ? "Upload another" : "Start upload"}
          </button>
        )}
      </div>
      <p className="max-w-xs text-center text-[11px] text-ink-faint">
        {phase === "stalled"
          ? "simulated stall: the ring freezes in amber so the failure is visible, not silent"
          : phase === "done"
            ? "100% — the ring hands off to a ✓ so there is no guessing"
            : "circular progress keeps the destination visible — you always see how much is left"}
      </p>
    </div>
  );
}

const SAVE_STATES = [
  { t: "idle", l: "Save changes", busy: false },
  { t: "saving", l: "Saving changes…", busy: true },
  { t: "done", l: "Saved ✓", busy: false },
] as const;

function SpinnerStatus() {
  const [st, setSt] = useState<"idle" | "saving" | "done">("idle");
  const save = () => {
    if (st === "saving") return;
    setSt("saving");
    window.setTimeout(() => setSt("done"), 1400);
    window.setTimeout(() => setSt("idle"), 3200);
  };
  const cur = SAVE_STATES.find((x) => x.t === st)!;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[radial-gradient(60%_90%_at_50%_100%,rgba(52,211,153,0.12),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-xs rounded-2xl border border-white/8 bg-white/4 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold">Theme tokens</span>
          <span className="chip !text-[9px]">violet · default</span>
        </div>
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between rounded-lg bg-black/25 px-3 py-2 text-[11px]">
            <span className="text-ink-dim">--color-accent</span>
            <span className="font-mono text-violet-200">#8b5cf6</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-black/25 px-3 py-2 text-[11px]">
            <span className="text-ink-dim">--color-ink-dim</span>
            <span className="font-mono text-ink-dim">#9aa3b5</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-black/25 px-3 py-2 text-[11px]">
            <span className="text-ink-dim">--radius-lg</span>
            <span className="font-mono text-cyan-200">24px</span>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={save}
        disabled={st === "saving"}
        className={`btn w-full max-w-xs !py-2.5 !text-xs disabled:cursor-wait ${
          st === "done" ? "!border-mint/40 !bg-mint/15 !text-mint" : "btn-primary"
        }`}
      >
        <span className="flex h-4 w-4 items-center justify-center" aria-hidden>
          {st === "saving" ? (
            <span className="block h-3 w-3 rounded-full border-2 border-white/30 border-t-white" style={{ animation: "mf-spin .7s linear infinite" }} />
          ) : st === "done" ? (
            <span>✓</span>
          ) : null}
        </span>
        <span>{cur.l}</span>
      </button>
      <p className="text-[11px] text-ink-faint">the label swaps in place — the button never jumps or widens mid-action</p>
    </div>
  );
}

const EMPTY_TRIPLES = [
  { id: "inbox", glyph: "▣", t: "No alerts yet", verb: "Set your first alert", step: "Pick a component and we will watch it for changes.", hatch: "or watch a whole collection", tone: "text-violet-300", ring: "from-violet-400/20" },
  { id: "dash", glyph: "◔", t: "Your dashboard is bare", verb: "Add a first metric", step: "Copies, views or model runs — one tile and it starts counting.", hatch: "or import last month's report", tone: "text-cyan-300", ring: "from-cyan-400/20" },
  { id: "board", glyph: "▤", t: "Nothing saved yet", verb: "Save your first stack", step: "Collect 3 assets and the stack becomes a shareable recipe.", hatch: "or browse the library first", tone: "text-mint", ring: "from-mint/20" },
];

function EmptyStateTrio() {
  const [filled, setFilled] = useState<string | null>(null);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(52,211,153,0.1),transparent_60%),#08090f] px-6">
      <div className="flex flex-wrap items-center justify-center gap-2 text-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-mint">Empty-state trio</span>
        <span className="text-[11px] text-ink-faint">one verb headline · a visible next step · an escape hatch</span>
      </div>
      <div className="grid w-full max-w-lg gap-3 sm:grid-cols-3">
        {EMPTY_TRIPLES.map((e) => {
          const done = filled === e.id;
          return (
            <div key={e.id} className={`rounded-2xl border p-4 text-left transition-all duration-300 ${done ? "border-mint/40 bg-mint/8" : "border-white/8 bg-white/4"}`}>
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${e.ring} to-transparent text-base ${e.tone}`}>{done ? "✓" : e.glyph}</span>
              <div className="mt-3 text-sm font-extrabold tracking-tight">{done ? "It has content now" : e.t}</div>
              {done ? (
                <p className="mt-1 text-[10px] leading-relaxed text-mint">Tap the verb below to undo the demo fill.</p>
              ) : (
                <>
                  <p className="mt-0.5 text-[10px] leading-relaxed text-ink-faint">{e.step}</p>
                  <div className="mt-2.5 flex items-center gap-1.5">
                    <button type="button" onClick={() => setFilled(e.id)} className="rounded-lg bg-white/10 px-2 py-1 text-[10px] font-bold transition-colors hover:bg-white/18">
                      {e.verb}
                    </button>
                    <button type="button" onClick={() => setFilled(e.id)} className="text-[9px] text-ink-faint underline-offset-2 hover:underline">{e.hatch}</button>
                  </div>
                </>
              )}
              {done && (
                <button type="button" onClick={() => setFilled(null)} className="mt-1 text-[9px] text-ink-faint underline-offset-2 hover:underline">
                  reset empty state
                </button>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-center text-[11px] text-ink-faint">the empty state is onboarding — the headline is a verb, the first step takes under a minute</p>
    </div>
  );
}

function OfflineIndicator() {
  const [online, setOnline] = useState(true);
  const [reconnecting, setReconnecting] = useState(false);
  const goOffline = () => {
    setOnline(false);
    setReconnecting(true);
    window.setTimeout(() => setReconnecting(false), 2800);
    window.setTimeout(() => setOnline(true), 3400);
  };
  const show = !online;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(244,114,182,0.1),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-sm rounded-2xl border border-white/8 bg-white/4 p-5">
        <div className="flex items-center gap-2">
          <span className={`relative flex h-2 w-2 ${online ? "" : ""}`}>
            {online ? (
              <span className="inline-flex h-2 w-2 rounded-full bg-mint" />
            ) : (
              <>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-300" />
              </>
            )}
          </span>
          <span className="text-sm font-bold">{online ? "Connected" : reconnecting ? "Reconnecting…" : "Offline"}</span>
          <span className={`ml-auto text-[10px] ${online ? "text-mint" : "text-amber-300"}`}>{online ? "changes sync live" : "queued locally"}</span>
        </div>
        <div className="mt-3 space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-white/8" />
          <div className="h-1.5 w-3/4 rounded-full bg-white/6" />
        </div>
        {show && (
          <div className="mt-3 rounded-lg border border-amber-300/25 bg-amber-400/8 px-3 py-2 text-[11px] text-amber-200" style={{ animation: "mf-toast-in .2s ease-out both" }}>
            Your changes are saved on this device. We will sync the moment the connection returns.
          </div>
        )}
      </div>
      <button type="button" onClick={goOffline} disabled={!online} className="btn btn-quiet !px-4 !py-2 !text-xs disabled:cursor-not-allowed disabled:opacity-40">
        Simulate going offline
      </button>
      <p className="max-w-xs text-center text-[11px] text-ink-faint">wire it to the real <span className="font-mono text-pink-200">online/offline</span> events — the banner pulses while it reconnects, then clears itself</p>
    </div>
  );
}

function ErrorBoundaryCard({ fail = 1 }: DemoProps) {
  const failsLeft = typeof fail === "number" ? Math.max(0, Math.min(3, Math.round(fail))) : 1;
  const [attempt, setAttempt] = useState(0);
  const [showDetail, setShowDetail] = useState(false);
  const [copied, setCopied] = useState(false);
  const broken = attempt <= failsLeft;
  const copyError = async () => {
    try {
      await navigator.clipboard.writeText("TypeError: Cannot read properties of undefined (reading 'layers')" + "\n" + "  at renderSurface (Surface.tsx:84:11)");
    } catch { /* noop */ }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(248,113,113,0.1),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-md">
        {broken ? (
          <div className="rounded-2xl border border-danger/25 bg-panel p-5" role="alert" style={{ animation: "mf-toast-in .25s ease-out both" }}>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/15 text-lg text-danger">!</span>
              <div>
                <div className="text-sm font-extrabold">This section hit a snag</div>
                <div className="text-[11px] text-ink-dim">The rest of the page is fine — only the surface renderer failed.</div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => setAttempt((n) => n + 1)} className="btn btn-primary !px-4 !py-2 !text-xs">
                ↺ Try again
              </button>
              <button type="button" onClick={copyError} className="btn btn-ghost !px-4 !py-2 !text-xs">
                {copied ? "✓ Copied" : "Copy error report"}
              </button>
              <button type="button" onClick={() => setShowDetail((v) => !v)} className="ml-auto text-[11px] font-semibold text-ink-faint hover:text-ink">
                {showDetail ? "hide details" : "show details"}
              </button>
            </div>
            {showDetail && (
              <pre className="mt-3 overflow-x-auto rounded-xl bg-black/40 p-3 font-mono text-[10px] leading-relaxed text-danger/90">
                TypeError: Cannot read properties of undefined (reading &apos;layers&apos;)
                {"\n"}  at renderSurface (Surface.tsx:84:11)
              </pre>
            )}
            <p className="mt-3 text-[10px] text-ink-faint">attempt {attempt} of {failsLeft + 1} · a real boundary reports once and recovers — it never blanks the whole app</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-mint/30 bg-mint/8 p-5 text-center" style={{ animation: "mf-toast-in .25s ease-out both" }}>
            <div className="text-2xl">✓</div>
            <div className="mt-1 text-sm font-extrabold text-mint">Recovered on attempt {attempt}</div>
            <p className="mt-1 text-[11px] text-ink-dim">The boundary caught the error, reported it, and the section re-rendered cleanly.</p>
            <button type="button" onClick={() => setAttempt(0)} className="btn btn-ghost mt-3 !py-2 !text-xs">↺ Break it again</button>
          </div>
        )}
      </div>
    </div>
  );
}

const CONFETTI_COLORS = ["#8b5cf6", "#22d3ee", "#34d399", "#f472b6", "#fbbf24", "#a5b4fc"];

function ConfettiBurst() {
  const [burst, setBurst] = useState(0);
  const pieces = burst ? Array.from({ length: 34 }) : [];
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(244,114,182,0.12),transparent_60%),#08090f] px-6">
      {/* stage */}
      <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-white/8 bg-white/4 p-6 text-center">
        <span className="chip !border-mint/25 !bg-mint/10 !text-mint">Launch complete</span>
        <div className="text-2xl font-black tracking-tight">motif/ui is live 🎉</div>
        <p className="text-[11px] text-ink-dim">your build shipped — celebrate once, then get back to work.</p>
        <button type="button" onClick={() => setBurst((n) => n + 1)} className="btn btn-primary !px-5 !py-2 !text-xs">
          🎉 Fire confetti
        </button>
      </div>
      {/* confetti layer, re-keyed per burst */}
      {burst > 0 && (
        <div key={burst} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {pieces.map((_, i) => {
            const hue = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
            const left = ((i * 37) % 100) + (i % 3 === 0 ? -6 : 4);
            const delay = (i % 11) * 0.045;
            const drift = (i % 5) - 2;
            const rot = (i * 61) % 360;
            return (
              <span
                key={i}
                className="absolute top-[-12px] block"
                style={{
                  left: `${left}%`,
                  width: i % 3 === 0 ? 8 : 6,
                  height: i % 4 === 0 ? 8 : 11,
                  background: hue,
                  borderRadius: i % 4 === 0 ? "99px" : "2px",
                  animation: `mf-confetti-fall ${1.6 + (i % 5) * 0.22}s cubic-bezier(.2,.6,.35,1) ${delay}s both`,
                  ["--cf-drift" as string]: `${drift * 30}px`,
                  ["--cf-rot" as string]: `${rot}deg`,
                }}
              />
            );
          })}
          <style>{`@keyframes mf-confetti-fall {
  0% { transform: translate(0, -10px) rotate(0deg); opacity: 1; }
  100% { transform: translate(var(--cf-drift), 130%) rotate(var(--cf-rot)); opacity: .2; }
}`}</style>
        </div>
      )}
      <p className="mt-4 max-w-xs text-center text-[11px] text-ink-faint">tasteful by default: one burst per milestone, never looping, and it cleans itself off the stage</p>
    </div>
  );
}

function DotLeaderLoading() {
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  useEffect(() => {
    if (phase !== "running") return;
    const t = window.setTimeout(() => setPhase("done"), 2500);
    return () => window.clearTimeout(t);
  }, [phase]);
  return (
    <div className="flex h-full w-full flex-col justify-center gap-4 overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(52,211,153,0.09),transparent_60%),#08090f] px-6">
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-white/8 bg-black/45 font-mono text-[11px] leading-relaxed shadow-[0_24px_60px_rgba(0,0,0,.5)] backdrop-blur-sm">
        <div className="flex items-center gap-1.5 border-b border-white/6 px-3.5 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-[9px] uppercase tracking-[0.22em] text-ink-faint">install.sh</span>
        </div>
        <div className="space-y-2.5 px-4 py-4 text-ink-dim">
          <p>
            <span className="text-mint">$</span> npm run motif:install{" "}
            <span className="text-ink-faint">-- --theme aurora --registry ui</span>
          </p>
          {phase === "idle" && <p className="text-ink-faint">waiting for the first install…</p>}
          {phase === "running" && (
            <p role="status" className="flex items-center gap-2 text-emerald-200/90">
              installing 42 theme tokens
              <span aria-hidden className="flex gap-[3px]">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-[3px] w-[3px] rounded-full bg-emerald-300"
                    style={{ animation: `mf-dot .9s ease-in-out ${i * 0.18}s infinite` }}
                  />
                ))}
              </span>
            </p>
          )}
          {phase === "done" && (
            <>
              <p className="text-emerald-300">✔ 42 tokens installed · 1.4s</p>
              <p className="text-ink-dim">
                next: npm run motif:doctor <span className="text-ink-faint">— checks peer deps</span>
              </p>
            </>
          )}
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-md items-center justify-between gap-3">
        <p className="text-[10px] text-ink-faint">the leader reads as process — three beats, not a guessing spinner</p>
        <button
          type="button"
          onClick={() => setPhase("running")}
          disabled={phase === "running"}
          className="btn btn-primary shrink-0 !px-4 !py-1.5 !text-[11px] disabled:opacity-60"
        >
          {phase === "running" ? "running…" : phase === "done" ? "Run again" : "Run install"}
        </button>
      </div>
      <p role="status" className="sr-only">
        {phase === "running" ? "installing theme tokens" : phase === "done" ? "install finished" : ""}
      </p>
    </div>
  );
}

const LRD_ACTIONS = [
  { label: "✓ Snippet copied", tone: "ok", assertive: false },
  { label: "⏳ Loading 4 of 12 surfaces", tone: "busy", assertive: false },
  { label: "✕ Payment failed — card declined", tone: "err", assertive: true },
  { label: "✦ 3 updates are waiting for you", tone: "info", assertive: false },
] as const;

function LiveRegionDemo() {
  const [log, setLog] = useState<{ id: number; label: string; tone: string; assertive: boolean }[]>([]);
  const [reveal, setReveal] = useState(false);
  const seq = useRef(0);
  const fire = (a: (typeof LRD_ACTIONS)[number]) => {
    seq.current += 1;
    setLog((prev) => [...prev.slice(-5), { id: seq.current, label: a.label, tone: a.tone, assertive: a.assertive }]);
  };
  const last = log.length > 0 ? log[log.length - 1] : null;
  const toneCls = (t: string) => {
    if (t === "ok") return "border-emerald-300/25 bg-emerald-300/10 text-emerald-200";
    if (t === "err") return "border-rose-300/25 bg-rose-300/10 text-rose-200";
    if (t === "busy") return "border-amber-300/25 bg-amber-300/10 text-amber-200";
    return "border-sky-300/25 bg-sky-300/10 text-sky-200";
  };
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(99,102,241,0.11),transparent_60%),#08090f] px-6">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-white/8 bg-white/4 p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">live region lab</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {LRD_ACTIONS.map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={() => fire(a)}
              className={`rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-transform active:scale-95 ${toneCls(a.tone)}`}
            >
              {a.label}
            </button>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">announcer log</span>
            <span className="font-mono text-[9px] text-ink-faint">
              {last ? (last.assertive ? "role=alert · assertive" : "role=status · polite") : "idle"}
            </span>
          </div>
          {log.length === 0 ? (
            <p className="rounded-lg border border-dashed border-white/10 py-3 text-center text-[10px] text-ink-faint">
              nothing announced yet — press a button above
            </p>
          ) : (
            log.map((l, idx) => (
              <p
                key={l.id}
                className={`rounded-lg border px-3 py-2 text-[11px] ${
                  idx === log.length - 1
                    ? "border-indigo-300/30 bg-indigo-300/10 text-indigo-100"
                    : "border-white/6 bg-black/25 text-ink-dim"
                }`}
              >
                {l.assertive ? "⚠ " : "· "}
                {l.label}
              </p>
            ))
          )}
        </div>
        <label className="mt-3 flex cursor-pointer items-center justify-between gap-3 border-t border-white/6 pt-3 text-[10px] text-ink-dim">
          <span>reveal the hidden announcer — the text screen readers hear</span>
          <input type="checkbox" checked={reveal} onChange={(e) => setReveal(e.target.checked)} className="accent-indigo-400" />
        </label>
      </div>
      {reveal && (
        <div className="mx-auto w-full max-w-md rounded-xl border border-dashed border-indigo-300/30 bg-indigo-950/40 px-3.5 py-2 font-mono text-[10px] text-indigo-200/90">
          {last ? last.label : "…"}
        </div>
      )}
      {/* the real regions stay mounted; announcing works even while visually hidden */}
      <div aria-live="polite" role="status" className={reveal ? "hidden" : "sr-only"}>
        {last && !last.assertive ? last.label : ""}
      </div>
      <div aria-live="assertive" role="alert" className={reveal ? "hidden" : "sr-only"}>
        {last && last.assertive ? last.label : ""}
      </div>
    </div>
  );
}

const LIQ_ITEMS = [
  { id: "ship", label: "Ship it", cls: "from-emerald-400 to-teal-500" },
  { id: "pro", label: "Get motif pro", cls: "from-violet-400 to-indigo-500" },
  { id: "draft", label: "Save draft", cls: "from-amber-300 to-orange-400" },
] as const;

function LiquidButtonHover() {
  const [pos, setPos] = useState<Record<string, { x: number; y: number }>>({});
  const [hover, setHover] = useState<Record<string, boolean>>({});
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(167,139,250,0.12),transparent_60%),#08090f] px-6">
      <div className="flex w-full max-w-md flex-wrap items-center justify-center gap-3">
        {LIQ_ITEMS.map((it) => {
          const p = pos[it.id];
          const hot = hover[it.id];
          return (
            <button
              key={it.id}
              type="button"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setPos((prev) => ({ ...prev, [it.id]: { x: e.clientX - r.left, y: e.clientY - r.top } }));
              }}
              onMouseEnter={() => setHover((prev) => ({ ...prev, [it.id]: true }))}
              onMouseLeave={() => setHover((prev) => ({ ...prev, [it.id]: false }))}
              className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${it.cls} px-6 py-3 text-xs font-black text-[#0b0c12] shadow-[0_10px_30px_rgba(0,0,0,.35)] transition-transform duration-150 hover:-translate-y-0.5 active:scale-95`}
            >
              {hot && p && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute block h-28 w-28 rounded-full bg-white/60 mix-blend-overlay"
                  style={{ left: p.x, top: p.y, animation: "mf-liquid .75s cubic-bezier(.22,.68,.32,1) forwards" }}
                />
              )}
              <span className="relative">{it.label}</span>
            </button>
          );
        })}
      </div>
      <p className="max-w-md text-center text-[11px] leading-relaxed text-ink-dim">
        the fill starts where your cursor lands — liquid geometry, not a full-width sweep. Under{" "}
        <code className="rounded bg-white/8 px-1 py-0.5 font-mono text-[10px] text-violet-200">prefers-reduced-motion</code>{" "}
        the blob collapses to a plain opacity fade.
      </p>
    </div>
  );
}

const MAG_ITEMS: { id: string; label: string; cls: string; clip?: string }[] = [
  { id: "blob", label: "Blob", cls: "h-5 w-5 rounded-full bg-violet-300" },
  { id: "gem", label: "Gem", cls: "h-5 w-5 rotate-45 rounded-[4px] bg-cyan-300" },
  { id: "cone", label: "Cone", cls: "h-5 w-5 bg-emerald-300", clip: "polygon(50% 0%, 0% 100%, 100% 100%)" },
  { id: "orbit", label: "Orbit", cls: "h-5 w-5 rounded-full border-2 border-amber-300" },
  { id: "cross", label: "Cross", cls: "h-5 w-5 bg-rose-300", clip: "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)" },
];

function MagneticIconRow() {
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [moves, setMoves] = useState<Record<number, { x: number; y: number; s: number }>>({});
  const [field, setField] = useState<{ x: number; y: number } | null>(null);
  const reset = () => {
    setMoves({});
    setField(null);
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(34,211,238,0.1),transparent_60%),#08090f] px-6">
      <div
        className="relative flex w-full max-w-md items-center justify-center gap-5 rounded-2xl border border-white/6 py-10"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setField({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          const next: Record<number, { x: number; y: number; s: number }> = {};
          iconRefs.current.forEach((el, i) => {
            if (!el) return;
            const r = el.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top + r.height / 2);
            const dist = Math.hypot(dx, dy);
            if (dist < 130 && dist > 0.01) {
              const pull = 1 - dist / 130;
              next[i] = { x: dx * pull * 0.55, y: dy * pull * 0.55, s: 1 + 0.1 * pull };
            } else {
              next[i] = { x: 0, y: 0, s: 1 };
            }
          });
          setMoves(next);
        }}
        onMouseLeave={reset}
      >
        {field && (
          <span
            aria-hidden
            className="pointer-events-none absolute h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/10"
            style={{ left: field.x, top: field.y }}
          />
        )}
        {MAG_ITEMS.map((it, i) => {
          const m = moves[i];
          return (
            <span key={it.id} className="flex flex-col items-center gap-2">
              <span
                ref={(el) => {
                  iconRefs.current[i] = el;
                }}
                className="flex h-12 w-12 items-center justify-center"
                style={{
                  transform: m ? `translate3d(${m.x.toFixed(1)}px, ${m.y.toFixed(1)}px, 0) scale(${m.s.toFixed(3)})` : "none",
                  transition: "transform .22s cubic-bezier(.22,.68,.32,1)",
                  willChange: "transform",
                }}
              >
                <span aria-hidden className={`block ${it.cls}`} style={it.clip ? { clipPath: it.clip } : undefined} />
              </span>
              <span className="text-[9px] uppercase tracking-[0.18em] text-ink-faint">{it.label}</span>
            </span>
          );
        })}
      </div>
      <p className="max-w-md text-center text-[11px] leading-relaxed text-ink-dim">
        each icon leans toward the pointer inside a 130px field and settles back with an ease-out — pure transform math, no library.
        <span className="text-ink-faint"> Icons stay decorative, so the row never competes with real links.</span>
      </p>
    </div>
  );
}

function ScrollLinkedHueHero() {
  const scroller = useRef<HTMLDivElement>(null);
  const [hue, setHue] = useState(224);
  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const max = Math.max(1, el.scrollHeight - el.clientHeight);
    setHue(Math.round(212 + (el.scrollTop / max) * 130));
  };
  const h = hue;
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0c13]">
      <div className="flex items-center justify-between border-b border-white/6 px-4 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">aurora/hero — scroll to repaint</span>
        <span
          className="rounded-full border px-2.5 py-0.5 font-mono text-[10px]"
          style={{ color: `hsl(${h} 90% 72%)`, borderColor: `hsl(${h} 90% 45% / .4)` }}
        >
          hue {h}°
        </span>
      </div>
      <div ref={scroller} onScroll={onScroll} className="relative flex-1 overflow-y-auto">
        <div
          className="px-5 pb-6 pt-8 transition-[background] duration-150"
          style={{
            background: `linear-gradient(160deg, hsl(${h} 85% 12%) 0%, hsl(${(h + 55) % 360} 70% 20%) 58%, hsl(${(h + 110) % 360} 80% 9%) 100%)`,
          }}
        >
          <div className="mx-auto max-w-sm">
            <span className="rounded-full border border-white/15 bg-black/25 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.22em] text-white/70 backdrop-blur">
              scroll-linked
            </span>
            <h3 className="mt-3 text-xl font-black tracking-tight text-white">the skyline repaints as you read</h3>
            <p className="mt-2 text-[11px] leading-relaxed text-white/60">
              Hue is treated as data: one scroll handler converts scrollTop into a colour angle, and the section repaints
              through the whole journey — from indigo dusk to ember orange.
            </p>
            <div className="mt-4 space-y-2">
              {["read the caption", "watch the hue chip", "hit the bottom call-to-action"].map((t, i) => (
                <div key={t} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 backdrop-blur-sm">
                  <span className="font-mono text-[10px]" style={{ color: `hsl(${(h + i * 36) % 360} 90% 72%)` }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[11px] text-white/75">{t}</span>
                </div>
              ))}
            </div>
            <div
              className="mt-5 rounded-2xl border border-white/10 p-4 text-center backdrop-blur-md"
              style={{
                background: `hsl(${(h + 140) % 360} 80% 55% / .14)`,
                boxShadow: `0 0 60px hsl(${(h + 140) % 360} 90% 60% / .25)`,
              }}
            >
              <p className="text-[11px] font-bold text-white">CTA block — its glow is the same hue variable</p>
              <p className="mt-1 text-[9px] text-white/50">one variable drives sky, chip and glow; nothing else changes.</p>
            </div>
            <p className="mt-6 pb-2 text-center text-[9px] text-white/35">end of scroll · hue {h}° — scroll back up to rewind it</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StaggeredListEntrance() {
  const scroller = useRef<HTMLDivElement>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const [run, setRun] = useState(0);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setSeen(true);
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const rows = [
    { name: "surface-aurora.svg", meta: "48KB · vector", dot: "#c4b5fd" },
    { name: "readme-quickstart.mdx", meta: "12KB · docs", dot: "#67e8f9" },
    { name: "theme-aurora.tokens.json", meta: "4KB · tokens", dot: "#6ee7b7" },
    { name: "og-aurora-1200x630.png", meta: "310KB · raster", dot: "#fcd34d" },
    { name: "motion-a11y-checklist.md", meta: "8KB · notes", dot: "#fda4af" },
    { name: "changelog-0.9.2.md", meta: "3KB · release", dot: "#a5b4fc" },
  ];
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0c13]">
      <div className="flex items-center justify-between border-b border-white/6 px-4 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">index rows — scroll to trigger</span>
        <button
          type="button"
          onClick={() => {
            setSeen(false);
            setRun((n) => n + 1);
            window.setTimeout(() => scroller.current?.scrollTo({ top: 9999, behavior: "smooth" }), 60);
            window.setTimeout(() => setSeen(true), 620);
          }}
          className="btn btn-ghost !px-3 !py-1 !text-[10px]"
        >
          ↻ Replay entrance
        </button>
      </div>
      <div ref={scroller} className="relative flex-1 overflow-y-auto px-5 py-4">
        <div className="mx-auto max-w-sm">
          <p className="text-[11px] leading-relaxed text-ink-dim">
            rows wait below the fold. Scroll down and each row rises in sequence — the classic index entrance, driven by
            one IntersectionObserver watching a sentinel.
          </p>
          <div style={{ height: 420 }} aria-hidden />
          <div ref={sentinel} className="h-px" aria-hidden />
          <div className="space-y-2">
            {seen &&
              rows.map((r, i) => (
                <div
                  key={`${run}-${r.name}`}
                  className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/3 px-3.5 py-2.5"
                  style={{ animation: `mf-rise .5s cubic-bezier(.22,.68,.32,1) ${i * 70}ms both` }}
                >
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: r.dot }} />
                  <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-ink">{r.name}</span>
                  <span className="shrink-0 text-[9px] text-ink-faint">{r.meta}</span>
                </div>
              ))}
            {seen && (
              <p className="pt-1 text-center text-[9px] text-ink-faint">
                {rows.length} rows · 70ms cascade · played {run > 0 ? `${run + 1}×` : "once"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const KB_FRAMES = [
  {
    name: "Nebula gate",
    caption: "frame 01 · dust lanes",
    spec: "radial-gradient(120% 90% at 20% 15%, hsl(265 90% 34%) 0%, transparent 55%), radial-gradient(90% 70% at 85% 70%, hsl(190 90% 40%) 0%, transparent 60%), #0b0a18",
    mark: "◈",
    accent: "#c4b5fd",
  },
  {
    name: "Dune sea",
    caption: "frame 02 · quiet hours",
    spec: "radial-gradient(140% 120% at 50% 115%, hsl(28 90% 45%) 0%, transparent 60%), linear-gradient(180deg, hsl(260 60% 12%) 0%, hsl(300 70% 16%) 100%)",
    mark: "〰",
    accent: "#fbbf24",
  },
  {
    name: "Prism stack",
    caption: "frame 03 · refracted",
    spec: "conic-gradient(from 210deg at 50% 40%, hsl(165 90% 40%) 0deg, hsl(220 90% 45%) 90deg, hsl(300 80% 45%) 180deg, hsl(180 90% 38%) 270deg, hsl(165 90% 40%) 360deg)",
    mark: "✦",
    accent: "#67e8f9",
  },
  {
    name: "Last light",
    caption: "frame 04 · long exposure",
    spec: "linear-gradient(180deg, hsl(250 60% 8%) 0%, hsl(230 70% 22%) 45%, hsl(20 95% 55%) 100%)",
    mark: "●",
    accent: "#fb7185",
  },
] as const;

function ShuffleKenburnsGallery() {
  const [order, setOrder] = useState<number[]>(KB_FRAMES.map((_, i) => i));
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [stamp, setStamp] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => {
      setIdx((i) => (i + 1) % order.length);
    }, 6200);
    return () => window.clearTimeout(t);
  }, [playing, idx, order.length]);
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0c13]">
      <div className="flex items-center justify-between border-b border-white/6 px-4 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">ken burns gallery</span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label={playing ? "Pause slideshow" : "Play slideshow"}
            onClick={() => setPlaying((p) => !p)}
            className="btn btn-ghost !px-2.5 !py-1 !text-[10px]"
          >
            {playing ? "❚❚ pause" : "▶ play"}
          </button>
          <button
            type="button"
            onClick={() => {
              setOrder(KB_FRAMES.map((_, i) => i).sort(() => Math.random() - 0.5));
              setIdx(0);
              setStamp((n) => n + 1);
            }}
            className="btn btn-ghost !px-2.5 !py-1 !text-[10px]"
          >
            ⇄ shuffle
          </button>
        </div>
      </div>
      <div className="relative flex-1 overflow-hidden">
        {order.map((fi, slot) => {
          const f = KB_FRAMES[fi];
          const active = slot === idx;
          return (
            <div
              key={`${stamp}-${fi}`}
              aria-hidden={active ? undefined : true}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: active ? 1 : 0, pointerEvents: active ? "auto" : "none" }}
            >
              <div
                className="absolute inset-0"
                style={{ background: f.spec, animation: active ? `mf-kb-${slot % 2 === 0 ? "l" : "r"} 9s ease-out forwards` : "none" }}
              />
              <span
                aria-hidden
                className="absolute left-[8%] top-[10%] select-none font-black leading-none text-white/10"
                style={{ fontSize: 130, transform: "rotate(-8deg)" }}
              >
                {f.mark}
              </span>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/75 to-transparent px-5 pb-4 pt-16">
                <div>
                  <p className="text-lg font-black tracking-tight text-white">{f.name}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/55">{f.caption}</p>
                </div>
                <span className="font-mono text-[10px]" style={{ color: f.accent }}>
                  {String(order[idx] + 1).padStart(2, "0")} / {String(KB_FRAMES.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          );
        })}
        <div className="absolute bottom-3 right-4 flex gap-1.5">
          {order.map((fi, slot) => (
            <button
              key={`dot-${fi}`}
              type="button"
              aria-label={`Go to ${KB_FRAMES[fi].name}`}
              onClick={() => setIdx(slot)}
              className={`h-1.5 rounded-full transition-all duration-300 ${slot === idx ? "w-5 bg-white/80" : "w-1.5 bg-white/30 hover:bg-white/50"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const PT_COLORS = ["#c4b5fd", "#67e8f9", "#6ee7b7", "#fcd34d", "#fda4af"];
const PT_TIERS = [
  { id: "lite", label: "Lite", max: 26, every: 42 },
  { id: "pro", label: "Pro", max: 70, every: 13 },
] as const;

function ParticleTrailHero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const seq = useRef(0);
  const lastSpawn = useRef(0);
  const timeouts = useRef<number[]>([]);
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number; c: string; big: boolean; dx: number }[]>([]);
  const [tier, setTier] = useState<(typeof PT_TIERS)[number]>(PT_TIERS[0]);
  const [helper, setHelper] = useState(true);
  useEffect(() => {
    const all = timeouts.current;
    return () => {
      all.forEach((t) => window.clearTimeout(t));
      all.length = 0;
    };
  }, []);
  const spawnAt = (x: number, y: number, n: number) => {
    const now = performance.now();
    if (n === 1 && now - lastSpawn.current < tier.every) return;
    lastSpawn.current = now;
    const startId = seq.current + 1;
    seq.current += n;
    setSparks((prev) => {
      const drop = Math.max(0, prev.length + n - tier.max);
      const base = drop > 0 ? prev.slice(drop) : prev;
      const fresh = Array.from({ length: n }, (_, k) => ({
        id: startId + k,
        x: x + (Math.random() - 0.5) * 22,
        y: y + (Math.random() - 0.5) * 22,
        c: PT_COLORS[Math.floor(Math.random() * PT_COLORS.length)],
        big: Math.random() < 0.22,
        dx: (Math.random() - 0.5) * 60,
      }));
      return [...base, ...fresh];
    });
    for (let k = 0; k < n; k += 1) {
      const id = startId + k;
      timeouts.current.push(
        window.setTimeout(() => {
          setSparks((prev) => prev.filter((sp) => sp.id !== id));
        }, 850)
      );
    }
  };
  return (
    <div className="flex h-full w-full flex-col gap-3 overflow-hidden bg-[radial-gradient(70%_100%_at_50%_0%,rgba(139,92,246,0.14),transparent_60%),#08090f] px-6 py-4">
      <div className="mx-auto flex w-full max-w-md items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">pointer trail · DOM sparkles</p>
        <div className="flex items-center gap-1 rounded-lg border border-white/8 bg-black/30 p-0.5">
          {PT_TIERS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTier(t)}
              aria-pressed={tier.id === t.id}
              className={`rounded-md px-2.5 py-1 text-[9px] font-bold transition-colors ${
                tier.id === t.id ? "bg-violet-400/20 text-violet-200" : "text-ink-faint hover:text-ink-dim"
              }`}
            >
              {t.label} · {t.max}/s
            </button>
          ))}
        </div>
      </div>
      <div
        ref={stageRef}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          spawnAt(e.clientX - r.left, e.clientY - r.top, 1);
        }}
        onPointerDown={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          spawnAt(e.clientX - r.left, e.clientY - r.top, 10);
        }}
        className="relative mx-auto min-h-0 w-full max-w-md flex-1 overflow-hidden rounded-2xl border border-white/8 bg-black/25"
        style={{ touchAction: "none", cursor: "crosshair" }}
      >
        <div className="pointer-events-none absolute inset-0 flex select-none flex-col items-center justify-center gap-2">
          <p className="text-lg font-black tracking-tight text-white/85">paint the sky</p>
          <p className="max-w-[250px] text-center text-[10px] leading-relaxed text-white/40">
            {helper
              ? "move your cursor or drag across the stage — the trail is capped and self-cleaning"
              : "stage is live; sparks are capped per tier and cleaned after ~0.9s"}
          </p>
        </div>
        {sparks.map((sp) => (
          <span
            key={sp.id}
            aria-hidden
            className="pointer-events-none absolute block"
            style={{
              left: sp.x,
              top: sp.y,
              width: sp.big ? 7 : 4,
              height: sp.big ? 7 : 4,
              background: sp.c,
              borderRadius: sp.big ? 2 : 99,
              animation: "mf-sparkle .8s ease-out forwards",
              ["--sdx" as string]: `${sp.dx.toFixed(1)}px`,
              ["--sdy" as string]: `${(26 + Math.abs(sp.dx) * 0.3).toFixed(1)}px`,
            }}
          />
        ))}
      </div>
      <div className="mx-auto flex w-full max-w-md items-center justify-between">
        <button
          type="button"
          onClick={() => {
            const r = stageRef.current?.getBoundingClientRect();
            spawnAt(r ? r.width / 2 : 120, r ? r.height / 2 : 60, 14);
          }}
          className="btn btn-primary !px-3 !py-1.5 !text-[10px]"
        >
          ✨ Burst (keyboard)
        </button>
        <button
          type="button"
          onClick={() => setHelper((h) => !h)}
          className="btn btn-ghost !px-3 !py-1.5 !text-[10px]"
        >
          {helper ? "hide" : "show"} helper
        </button>
        <span className="font-mono text-[9px] text-ink-faint">{sparks.length} live</span>
      </div>
    </div>
  );
}

const STAMP_SAMPLES = ["approved", "secure", "v.2 shipped", "demo"] as const;

function InkStampAppear() {
  const [run, setRun] = useState(0);
  const [word, setWord] = useState(0);
  const [distress, setDistress] = useState(false);
  const next = STAMP_SAMPLES[(word + 1) % STAMP_SAMPLES.length];
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(244,114,182,0.1),transparent_60%),#08090f] px-6">
      <div className="relative flex w-full max-w-sm flex-col items-center gap-2 rounded-2xl border border-white/8 bg-white/4 px-8 py-10">
        <span className="absolute right-4 top-4 rounded-full border border-white/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-faint">
          sample {word + 1}/{STAMP_SAMPLES.length}
        </span>
        <div
          key={run}
          className="rounded-2xl border-4 border-pink-300/90 px-8 py-4 uppercase tracking-[0.32em] text-pink-200"
          style={{
            animation: "mf-stamp .5s cubic-bezier(.22,.68,.32,1) both",
            boxShadow: "0 0 0 3px rgba(244,114,182,.12), inset 0 0 0 1px rgba(244,114,182,.35)",
            maskImage: distress
              ? "radial-gradient(120% 140% at 30% 20%, #000 55%, transparent 78%)"
              : undefined,
          }}
        >
          <span className="text-xl font-black">{STAMP_SAMPLES[word]}</span>
        </div>
        <p className="mt-1 max-w-[260px] text-center text-[10px] leading-relaxed text-ink-faint">
          a stamp appears in one pressed moment — quick scale + rotate with an overshoot settle, never a slow fade.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setRun((n) => n + 1);
            setWord((w) => (w + 1) % STAMP_SAMPLES.length);
          }}
          className="btn btn-primary !px-4 !py-1.5 !text-[11px]"
        >
          Stamp “{next}”
        </button>
        <button
          type="button"
          onClick={() => setDistress((d) => !d)}
          aria-pressed={distress}
          className={`btn ${distress ? "!border-pink-300/30 !bg-pink-300/10 !text-pink-200" : "btn-ghost"} !px-4 !py-1.5 !text-[11px]`}
        >
          {distress ? "✓ distressed" : "distress"}
        </button>
      </div>
    </div>
  );
}

function GradientBorderFlow() {
  const [paused, setPaused] = useState(false);
  const [card, setCard] = useState(0);
  const cards = [
    { tag: "tokens", title: "aurora palette", meta: "42 colours · 3 surfaces", deg: 3 },
    { tag: "component", title: "bento grid", meta: "live · v1.2", deg: 6 },
    { tag: "prompt", title: "hero copy bundle", meta: "18 prompts · 1.9k words", deg: 9 },
  ];
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(99,102,241,0.12),transparent_60%),#08090f] px-6">
      <style>{`@property --mfb-angle { syntax: '<angle>'; inherits: false; initial-value: 0deg }
.mfb-card { position: relative; border-radius: 16px; }
.mfb-card::before { content: ""; position: absolute; inset: -1px; border-radius: inherit; padding: 1px;
  background: conic-gradient(from var(--mfb-angle), transparent 0%, #a78bfa 12%, transparent 30%,
    #22d3ee 48%, transparent 64%, #f472b6 82%, transparent 100%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  animation: mfb-spin var(--mfb-speed, 4s) linear infinite; pointer-events: none; }
.mfb-paused .mfb-card::before { animation-play-state: paused; }
@keyframes mfb-spin { to { --mfb-angle: 360deg } }`}</style>
      <div className={`flex w-full max-w-md flex-col gap-3 ${paused ? "mfb-paused" : ""}`}>
        {cards.map((c, ci) => (
          <div
            key={c.tag}
            className={`mfb-card ${card === ci ? "opacity-100" : "opacity-90"}`}
            style={{ ["--mfb-speed" as string]: `${6 - c.deg * 0.4}s` }}
          >
            <button
              type="button"
              onClick={() => setCard(ci)}
              className={`flex w-full items-center gap-4 rounded-2xl border border-white/8 px-5 py-4 text-left transition-colors hover:bg-white/4 ${
                card === cards.indexOf(c) ? "bg-white/5" : "bg-black/20"
              }`}
            >
              <span className="rounded-lg border border-white/10 bg-black/30 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-indigo-200/80">
                {c.tag}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-white">{c.title}</span>
                <span className="block text-[10px] text-ink-dim">{c.meta}</span>
              </span>
              <span className="font-mono text-[9px] text-ink-faint">{card === ci ? "focused" : "select"}</span>
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => setPaused((p) => !p)} className="btn btn-primary !px-4 !py-1.5 !text-[11px]">
          {paused ? "▶ resume the flow" : "❚❚ pause the flow"}
        </button>
        <p className="max-w-[220px] text-[10px] leading-relaxed text-ink-faint">
          a conic border whose angle is a real CSS variable — one animation, three speeds, zero JS per frame.
        </p>
      </div>
    </div>
  );
}

function RippleReveal() {
  const seq = useRef(0);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; hue: string; tile: number }[]>([]);
  const [mode, setMode] = useState<"ink" | "halo">("ink");
  const tileHues = ["#c4b5fd", "#67e8f9", "#6ee7b7", "#fcd34d", "#fda4af", "#7dd3fc"];
  const drop = (i: number, x: number, y: number, hue: string) => {
    seq.current += 1;
    const id = seq.current;
    setRipples((prev) => [...prev.slice(-14), { id, x, y, hue, tile: i }]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 800);
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(34,211,238,0.1),transparent_60%),#08090f] px-6">
      <div className="grid w-full max-w-md grid-cols-3 gap-2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            aria-label={`Tile ${i + 1} — click for a ripple`}
            onPointerDown={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              drop(i, e.clientX - r.left, e.clientY - r.top, tileHues[i]);
            }}
            className={`relative flex h-24 items-center justify-center overflow-hidden rounded-xl border font-mono text-[10px] uppercase tracking-[0.2em] transition-transform active:scale-[.97] ${
              mode === "ink"
                ? "border-white/10 bg-[linear-gradient(150deg,rgba(255,255,255,.06),rgba(255,255,255,.02)_45%,rgba(34,211,238,.08))] text-ink-dim hover:border-white/20"
                : i === 4
                  ? "col-span-2 border-cyan-300/30 bg-cyan-400/10 text-cyan-100"
                  : "border-white/10 bg-white/3 text-ink-dim hover:border-white/20"
            }`}
          >
            t{i + 1}
            {ripples
              .filter((r) => r.tile === i)
              .map((r) => (
                <span
                  key={r.id}
                  aria-hidden
                  className="pointer-events-none absolute rounded-full"
                  style={{
                    left: r.x,
                    top: r.y,
                    width: 64,
                    height: 64,
                    border: `1.5px solid ${r.hue}`,
                    boxShadow: mode === "halo" ? `0 0 24px ${r.hue}66` : undefined,
                    background: mode === "halo" ? `${r.hue}1f` : "transparent",
                    animation: "mf-ripple .8s cubic-bezier(.22,.68,.32,1) forwards",
                  }}
                />
              ))}
          </button>
        ))}
      </div>
      <div className="flex w-full max-w-md items-center justify-between">
        <div className="flex items-center gap-1 rounded-lg border border-white/8 bg-black/30 p-0.5">
          {(["ink", "halo"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`rounded-md px-3 py-1 text-[10px] font-bold ${mode === m ? "bg-cyan-400/20 text-cyan-100" : "text-ink-faint hover:text-ink-dim"}`}
            >
              {m === "ink" ? "ink line" : "halo glow"}
            </button>
          ))}
        </div>
        <p className="max-w-[240px] text-right text-[10px] leading-relaxed text-ink-faint">
          a ripple from every press point makes any surface feel causal — tap any tile. The halo tile doubles as the grid’s focus card.
        </p>
      </div>
    </div>
  );
}

function ParallaxLayeredScene() {
  const [pt, setPt] = useState<{ x: number; y: number } | null>(null);
  const [coarse, setCoarse] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.matchMedia("(pointer: coarse)").matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const on = (e: MediaQueryListEvent) => setCoarse(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const layer = (factor: number, base: number) => {
    if (coarse) return undefined;
    if (!pt) return { transform: "translate3d(0px, 0px, 0)" };
    const x = Math.max(-base, Math.min(base, (pt.x - 0.5) * factor));
    const y = Math.max(-base * 0.6, Math.min(base * 0.6, (pt.y - 0.5) * factor));
    return { transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)` };
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden bg-[#08090f] px-6">
      <div
        className="relative h-64 w-full max-w-md overflow-hidden rounded-2xl border border-white/8 bg-[#0d1020]"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setPt({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
        }}
        onMouseLeave={() => setPt(null)}
      >
        <div className="absolute inset-0" aria-hidden style={{ ...layer(0, 0) }}>
          <div className="absolute inset-0" style={{ background: "radial-gradient(70% 90% at 30% 20%, rgba(139,92,246,.35), transparent 60%), radial-gradient(60% 80% at 75% 80%, rgba(34,211,238,.22), transparent 55%)" }} />
        </div>
        <div className="absolute inset-0" aria-hidden style={{ ...layer(46, 16), transition: "transform .3s cubic-bezier(.22,.68,.32,1)", animation: coarse ? "mf-sway-a 8s ease-in-out infinite" : undefined }}>
          <span className="absolute left-[14%] top-[22%] h-2 w-2 rounded-full bg-violet-300/80" />
          <span className="absolute left-[68%] top-[16%] h-1.5 w-1.5 rounded-full bg-cyan-300/70" />
          <span className="absolute left-[42%] top-[64%] h-1.5 w-1.5 rounded-full bg-pink-300/70" />
          <span className="absolute left-[24%] top-[70%] h-1 w-1 rounded-full bg-white/40" />
          <span className="absolute left-[82%] top-[58%] h-1 w-1 rounded-full bg-white/40" />
          <span className="absolute left-[55%] top-[26%] h-1 w-1 rounded-full bg-white/30" />
        </div>
        <div className="absolute inset-0" aria-hidden style={{ ...layer(88, 30), transition: "transform .3s cubic-bezier(.22,.68,.32,1)", animation: coarse ? "mf-sway-b 11s ease-in-out infinite" : undefined }}>
          <div className="absolute inset-x-0 bottom-[-8%] h-1/2" style={{ background: "linear-gradient(180deg, transparent, rgba(34,211,238,.14) 70%)" }} />
          <div className="absolute bottom-[18%] left-1/2 h-24 w-40 -translate-x-1/2 rounded-t-[999px] border border-cyan-200/25 bg-cyan-200/5" />
          <div className="absolute bottom-[6%] left-[16%] h-20 w-24 -translate-x-1/2 rounded-t-[999px] border border-violet-200/20 bg-violet-200/5" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
          <div>
            <p className="text-lg font-black tracking-tight text-white">dune &amp; glass</p>
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/45">two-layer parallax · {coarse ? "touch drift fallback" : "pointer parallax"}</p>
          </div>
          <span className="rounded-full border border-white/12 bg-black/35 px-2 py-0.5 font-mono text-[9px] text-cyan-200/80 backdrop-blur">
            {coarse ? "auto" : `${pt ? "live" : "idle"}`}
          </span>
        </div>
      </div>
      <p className="max-w-md text-center text-[10px] leading-relaxed text-ink-faint">
        far layer drifts a little, near layer a lot. On touch (coarse pointer) the JS parallax steps aside for a slow CSS drift —
        <span className="text-ink-dim"> no dead motion, no heavy rAF loop.</span>
      </p>
    </div>
  );
}

const VIG_COPY = [
  ["Reading mode", "long-form pages deserve the same care as landing pages: the scrim tells you how much story is left."],
  ["Edge vignette", "The top shade mounts as you scroll away from the start; the bottom shade grows as the end approaches."],
  ["Why it works", "Your peripheral vision reads the frame before your eyes read the text — a soft cue that costs nothing to compute."],
  ["Rules", "Keep the darkening under 12% and the band under 60px; anything louder reads as a broken gradient, not a cue."],
  ["Composition", "Darker at the bottom, softer at the top — reading gravity pulls your eye down the page, not up."],
] as const;

function ScrollVignette() {
  const scroller = useRef<HTMLDivElement>(null);
  const [shades, setShades] = useState<{ top: number; bottom: number }>({ top: 0, bottom: 0 });
  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const max = Math.max(1, el.scrollHeight - el.clientHeight);
    const top = Math.min(1, el.scrollTop / 90);
    const bottom = Math.max(0, Math.min(1, (el.scrollTop - (max - 90)) / 90));
    setShades({ top, bottom });
  };
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0c13]">
      <div className="flex items-center justify-between border-b border-white/6 px-4 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">reading mode — scroll slowly</span>
        <span className="rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-[10px] text-amber-200/80">
          top {shades.top.toFixed(2)} · bottom {shades.bottom.toFixed(2)}
        </span>
      </div>
      <div className="relative min-h-0 flex-1">
        <div ref={scroller} onScroll={onScroll} className="h-full overflow-y-auto px-6 py-6">
          <div className="mx-auto max-w-sm space-y-5">
            {VIG_COPY.map(([t, body]) => (
              <section key={t}>
                <h3 className="text-sm font-black tracking-tight text-white">{t}</h3>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-white/60">{body}</p>
              </section>
            ))}
          </div>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-14" style={{ background: "linear-gradient(180deg, #05060a, transparent)", opacity: shades.top }} />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-14" style={{ background: "linear-gradient(0deg, #05060a, transparent)", opacity: shades.bottom }} />
      </div>
    </div>
  );
}

function WordHighlight() {
  const words = ["Motif", "ships", "original", "assets,", "one", "idea", "at", "a", "time."];
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(0);
  const ms = [340, 200, 120][speed];
  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => {
      if (idx >= words.length) {
        setPlaying(false);
        return;
      }
      setIdx((i) => i + 1);
    }, ms);
    return () => window.clearTimeout(t);
  }, [playing, idx, ms, words.length]);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(52,211,153,0.1),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/8 bg-white/4 px-6 py-8">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.24em] text-ink-faint">karaoke headline</p>
        <p className="mt-4 text-center text-2xl font-black leading-snug tracking-tight">
          {words.map((w, i) => {
            const done = i < idx;
            const now = i === idx;
            return (
              <span key={`${w}-${i}`} className="mr-[0.28em] inline-block">
                <span
                  className={done ? "text-mint" : now ? "text-white" : "text-white/22"}
                  style={{ transition: "color .18s ease", textShadow: now || done ? "0 0 18px rgba(52,211,153,.35)" : undefined }}
                >
                  {w}
                </span>
              </span>
            );
          })}
        </p>
        <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/8">
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-teal-400 transition-[width] duration-200" style={{ width: `${(Math.min(idx, words.length) / words.length) * 100}%` }} />
        </div>
        <p className="mt-2 text-right font-mono text-[10px] text-ink-faint">
          {Math.min(idx, words.length)}/{words.length} words
        </p>
      </div>
      <div className="flex w-full max-w-md items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (!playing && idx >= words.length) {
                setIdx(0);
              }
              setPlaying((p) => !p);
            }}
            className="btn btn-primary !px-4 !py-1.5 !text-[11px]"
          >
            {playing ? "❚❚ pause" : idx >= words.length ? "↻ replay" : "▶ read"}
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setIdx(0);
            }}
            className="btn btn-ghost !px-3 !py-1.5 !text-[11px]"
          >
            reset
          </button>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-white/8 bg-black/30 p-0.5">
          {["calm", "reading", "quick"].map((s, si) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(si)}
              aria-pressed={speed === si}
              className={`rounded-md px-2.5 py-1 text-[10px] font-bold ${speed === si ? "bg-emerald-400/20 text-emerald-200" : "text-ink-faint hover:text-ink-dim"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShakeField() {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "ok">("idle");
  const [shakeId, setShakeId] = useState(0);
  const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
  const submit = () => {
    if (!valid) {
      setStatus("error");
      setShakeId((n) => n + 1);
      return;
    }
    setStatus("ok");
  };
  const onChange = (v: string) => {
    setValue(v);
    if (status !== "idle") setStatus("idle");
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(251,113,133,0.08),transparent_60%),#08090f] px-6">
      <style>{`@media (prefers-reduced-motion: reduce) { .shake-host { animation: none !important; } }`}</style>
      <div className="w-full max-w-md rounded-2xl border border-white/8 bg-white/4 p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">sign-up form · email field</p>
        <label htmlFor="shake-email" className="mt-4 block text-[11px] font-semibold text-ink-dim">
          Work email
        </label>
        <div
          key={shakeId}
          className={`shake-host mt-1.5 flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-colors focus-within:ring-2 ${
            status === "error"
              ? "border-rose-300/60 bg-rose-400/8 focus-within:ring-rose-300/20"
              : "border-white/10 bg-black/20 focus-within:border-violet-300/50 focus-within:ring-violet-300/15"
          }`}
          style={{ animation: status === "error" ? "mf-shake .45s ease-in-out" : undefined }}
        >
          <input
            id="shake-email"
            type="email"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder="you@studio.dev"
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-ink-faint"
          />
          <button
            type="button"
            onClick={submit}
            className={`shrink-0 rounded-lg px-3.5 py-1.5 text-[11px] font-black transition-colors ${
              status === "ok"
                ? "bg-emerald-400/15 text-emerald-300"
                : status === "error"
                  ? "bg-rose-400/15 text-rose-200"
                  : "bg-white/10 text-white hover:bg-white/15"
            }`}
          >
            {status === "ok" ? "✓ Joined" : "Join"}
          </button>
        </div>
        <p
          aria-live="polite"
          className={`mt-2 text-[10.5px] transition-opacity ${status === "idle" ? "opacity-0" : "opacity-100"}`}
        >
          {status === "error" && <span className="text-rose-200">That address needs an @ and a domain — try you@studio.dev</span>}
          {status === "ok" && <span className="text-emerald-300">You’re in — the confirmation email is on its way.</span>}
        </p>
        <p className="mt-2 text-[9px] text-ink-faint">
          the shake is 1–3px and dies under prefers-reduced-motion; the error text never depends on it.
        </p>
      </div>
    </div>
  );
}

const BENTO_MODE = ["calm", "festive"] as const;

function BentoFeatureGrid() {
  const [mode, setMode] = useState<(typeof BENTO_MODE)[number]>("calm");
  const [val, setVal] = useState(64);
  const accent = mode === "calm" ? "#22d3ee" : "#f472b6";
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(139,92,246,0.12),transparent_60%),#08090f] px-6 py-5">
      <div className="grid w-full max-w-md flex-1 min-h-0 grid-cols-2 gap-2" style={{ gridTemplateRows: "1fr 1.3fr 1fr" }}>
        <div className="col-span-1 flex flex-col justify-between rounded-xl border border-white/8 bg-white/4 p-3">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink-faint">daily active</span>
          <span className="text-2xl font-black tracking-tight text-white">12,4k</span>
          <span className="text-[9px] text-emerald-300">▲ 8.2% vs last week</span>
        </div>
        <div className="col-span-1 flex flex-col justify-between rounded-xl border border-white/8 bg-white/4 p-3">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink-faint">uptime</span>
          <span className="text-2xl font-black tracking-tight text-white">99.98<span className="text-xs text-ink-dim">%</span></span>
          <span className="text-[9px] text-ink-dim">30-day rolling</span>
        </div>
        <div className="col-span-2 flex min-h-0 flex-col rounded-xl border p-3" style={{ borderColor: `${accent}33`, background: `${accent}0d` }}>
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>
              the centrepiece · revenue pace
            </span>
            <span className="font-mono text-[9px] text-ink-faint">drag the knob</span>
          </div>
          <div className="relative mt-1 flex-1 min-h-0 overflow-hidden rounded-lg bg-black/30">
            <svg viewBox="0 0 320 120" preserveAspectRatio="none" className="h-full w-full">
              <defs>
                <linearGradient id="bento-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={accent} stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3].map((g) => {
                const pts = Array.from({ length: 9 }, (_, i) => {
                  const t = i / 8;
                  const base = g * 26;
                  const wave = Math.sin(t * Math.PI * 2 + g) * (val / 6) + t * (120 - base);
                  return [i * 40, 118 - Math.max(6, Math.min(112, base + wave * 0.4 + 8))] as const;
                });
                const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
                return (
                  <g key={g}>
                    <path d={`${d} L320,120 L0,120 Z`} fill="url(#bento-area)" opacity={0.5} />
                    <path d={d} fill="none" stroke={accent} strokeWidth="1.5" opacity="0.7" />
                  </g>
                );
              })}
            </svg>
            <input
              type="range"
              min={10}
              max={100}
              value={val}
              aria-label="Revenue pace"
              onChange={(e) => setVal(Number(e.target.value))}
              className="absolute inset-x-3 bottom-2"
              style={{ accentColor: accent }}
            />
          </div>
        </div>
        <div className="col-span-1 flex flex-col justify-center rounded-xl border border-white/8 bg-white/4 p-3">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink-faint">export ready</span>
          <p className="mt-1 text-[10px] leading-relaxed text-ink-dim">SVG + PNG at every breakpoint, tokens included.</p>
        </div>
        <div className="col-span-1 flex flex-col justify-center rounded-xl border border-white/8 bg-white/4 p-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink-faint">net new</span>
            <span className="text-lg font-black" style={{ color: accent }}>
              +{val / 4}
            </span>
          </div>
          <p className="mt-1 text-[10px] leading-relaxed text-ink-dim">this month — the knob above drives the forecast.</p>
        </div>
      </div>
      <div className="flex w-full max-w-md items-center justify-between">
        <div className="flex items-center gap-1 rounded-lg border border-white/8 bg-black/30 p-0.5">
          {BENTO_MODE.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`rounded-md px-3 py-1 text-[10px] font-bold ${mode === m ? "bg-white/10 text-white" : "text-ink-faint hover:text-ink-dim"}`}
            >
              {m}
            </button>
          ))}
        </div>
        <p className="max-w-[260px] text-right text-[10px] leading-relaxed text-ink-faint">
          asymmetric tiles, one live centrepiece — the layout reads as a system because every tile shares a border radius, not a size.
        </p>
      </div>
    </div>
  );
}

const LW_LOGO = [
  { mark: "⌘", name: "northwind", tint: "text-indigo-300" },
  { mark: "▲", name: "arclight", tint: "text-amber-300" },
  { mark: "◒", name: "hazel&co", tint: "text-emerald-300" },
  { mark: "✳", name: "plainday", tint: "text-sky-300" },
  { mark: "◮", name: "solidpine", tint: "text-rose-300" },
  { mark: "❖", name: "quilto", tint: "text-violet-300" },
  { mark: "◈", name: "bridgestone", tint: "text-cyan-300" },
  { mark: "▲", name: "fermo labs", tint: "text-pink-300" },
] as const;

function LogoWallHoverPop() {
  const [hot, setHot] = useState<string | null>(null);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(139,92,246,0.1),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-md">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.24em] text-ink-faint">trusted by quiet teams</p>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {LW_LOGO.map((l) => (
            <button
              key={l.name}
              type="button"
              aria-label={l.name}
              onMouseEnter={() => setHot(l.name)}
              onMouseLeave={() => setHot(null)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border px-1 py-3 transition-all duration-200 ${
                hot === l.name
                  ? "-translate-y-1 border-white/20 bg-white/6 shadow-[0_14px_30px_rgba(0,0,0,.4)]"
                  : "border-white/5 bg-white/2 hover:bg-white/4"
              }`}
            >
              <span className={`text-sm leading-none ${l.tint} ${hot === l.name ? "scale-110" : ""}`} style={{ transition: "transform .2s cubic-bezier(.34,1.56,.64,1)" }}>
                {l.mark}
              </span>
              <span className="max-w-full truncate font-mono text-[7.5px] text-ink-dim">{l.name}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="max-w-md text-center text-[10px] leading-relaxed text-ink-faint">
        hover pops a tile up and recolours it — a logo wall that only wakes up where the cursor is.
        <span className="text-ink-dim"> Press points are 44px tall so touch users never fat-finger a neighbour.</span>
      </p>
    </div>
  );
}

const TM_ROW_A = ["surface-first design", "42 theme tokens", "keyboard-complete", "motion on budget", "one source of truth", "ships in a week"];
const TM_ROW_B = ["“the tokens alone paid for it”", "“our QA finally sees colour early”", "“zero docs drift since”", "“the a11y pass wrote itself”", "“lightweight, no runtime tax”", "“we shipped ahead of schedule”"];

function TestimonialMarquee() {
  const [paused, setPaused] = useState(false);
  return (
    <div
      className="flex h-full w-full flex-col justify-center overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(34,211,238,0.09),transparent_60%),#08090f]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-center justify-between px-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-ink-faint">what teams say</p>
        <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[9px] text-ink-faint">{paused ? "paused — hover off to resume" : "hover to pause"}</span>
      </div>
      <div className="mt-3 flex flex-col gap-2.5" aria-hidden>
        <div className="overflow-hidden" style={{ maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)" }}>
          <div className="flex w-max gap-2.5" style={{ animation: "mf-marquee 26s linear infinite", animationPlayState: paused ? "paused" : "running" }}>
            {[...TM_ROW_A, ...TM_ROW_A].map((t, i) => (
              <span key={`a-${i}`} className="shrink-0 rounded-full border border-white/10 bg-white/4 px-4 py-2 text-[11px] text-white/75">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="overflow-hidden" style={{ maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)" }}>
          <div className="flex w-max gap-2.5" style={{ animation: "mf-marquee 32s linear infinite reverse", animationPlayState: paused ? "paused" : "running" }}>
            {[...TM_ROW_B, ...TM_ROW_B].map((t, i) => (
              <span key={`b-${i}`} className="shrink-0 rounded-2xl border border-cyan-300/15 bg-cyan-300/6 px-4 py-2.5 text-[11px] italic text-cyan-100/80">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-3 px-6 text-center text-[10px] leading-relaxed text-ink-faint">
        dual-row counter-scroll — the classic wall. Each row loops 2× content for a seamless 50% translate; hover anywhere pauses both rows.
      </p>
    </div>
  );
}

const PRICE_PLANS = [
  { name: "Studio", priceM: 0, priceY: 0, blurb: "for solo tinkerers", feats: ["120 original assets", "MIT licensed", "community updates"], pop: false },
  { name: "Team", priceM: 24, priceY: 19, blurb: "for shipped products", feats: ["everything in Studio", "design tokens + Figma", "priority support", "team seat: 5"], pop: true },
  { name: "Agency", priceM: 64, priceY: 49, blurb: "for client work", feats: ["everything in Team", "unlimited seats", "white-label license"], pop: false },
] as const;

function PricingTableThree() {
  const [yearly, setYearly] = useState(false);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(52,211,153,0.1),transparent_60%),#08090f] px-6">
      <div className="flex w-full max-w-md items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-ink-faint">pricing · three plans</p>
        <div className="flex items-center gap-2 rounded-lg border border-white/8 bg-black/30 px-2 py-1">
          <span className={`text-[10px] font-bold ${!yearly ? "text-white" : "text-ink-faint"}`}>monthly</span>
          <button
            type="button"
            role="switch"
            aria-checked={yearly}
            aria-label="Toggle yearly billing"
            onClick={() => setYearly((y) => !y)}
            className={`relative h-4 w-8 rounded-full transition-colors ${yearly ? "bg-emerald-400/70" : "bg-white/15"}`}
          >
            <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${yearly ? "left-[18px]" : "left-0.5"}`} />
          </button>
          <span className={`text-[10px] font-bold ${yearly ? "text-white" : "text-ink-faint"}`}>
            yearly <span className="text-emerald-300">−20%</span>
          </span>
        </div>
      </div>
      <div className="grid w-full max-w-md grid-cols-3 gap-1.5">
        {PRICE_PLANS.map((pl) => (
          <div
            key={pl.name}
            className={`relative flex flex-col rounded-xl border p-2.5 ${pl.pop ? "border-emerald-300/40 bg-emerald-300/8 shadow-[0_0_36px_rgba(52,211,153,.18)]" : "border-white/8 bg-white/3"}`}
          >
            {pl.pop && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-emerald-300 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.14em] text-[#06120c]">
                popular
              </span>
            )}
            <span className="text-[10px] font-black tracking-tight text-white">{pl.name}</span>
            <span className="mt-1 text-lg font-black leading-none text-white">
              ${yearly ? pl.priceY : pl.priceM}
              <span className="text-[9px] font-semibold text-ink-dim">/mo</span>
            </span>
            <span className="mt-1 text-[8px] text-ink-faint">{pl.blurb}</span>
            <ul className="mt-2 space-y-1 border-t border-white/6 pt-2">
              {pl.feats.map((f) => (
                <li key={f} className="flex items-start gap-1 text-[8.5px] leading-snug text-ink-dim">
                  <span className="text-emerald-300">✓</span>
                  <span className="min-w-0">{f}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={`mt-2.5 rounded-lg px-2 py-1.5 text-[9px] font-black transition-colors ${pl.pop ? "bg-emerald-300 text-[#06120c] hover:bg-emerald-200" : "bg-white/10 text-white hover:bg-white/15"}`}
            >
              {pl.priceM === 0 ? "Start free" : "Choose " + pl.name}
            </button>
          </div>
        ))}
      </div>
      <p className="max-w-md text-center text-[10px] leading-relaxed text-ink-faint">
        the popular plan glows but never blocks the other two — a billing toggle re-prices all three in place with a single state.
      </p>
    </div>
  );
}

const STATS_TARGETS = [128, 98.6, 4.2, 1.9];
const STATS_ROWS = [
  { label: "assets shipped", note: "and counting — every one original", suffix: "" },
  { label: "a11y score median", note: "tested with real screen readers", suffix: "%" },
  { label: "stars after launch week", note: "from 300+ teams", suffix: "k" },
  { label: "s average demo load", note: "no runtime, no tax", suffix: "s" },
];

function StatsBand() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [vals, setVals] = useState<number[]>([0, 0, 0, 0]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setStarted(true);
        });
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 1400);
      const ease = 1 - Math.pow(1 - p, 3);
      setVals(STATS_TARGETS.map((t) => (t % 1 === 0 ? Math.round(t * ease) : Math.round(t * ease * 10) / 10)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started]);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#0a0c13] px-6">
      <div ref={ref} className="w-full max-w-md rounded-2xl border border-white/8 bg-white/3 px-5 py-6">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.24em] text-ink-faint">motif by the numbers</p>
        <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5">
          {STATS_ROWS.map((r, i) => (
            <div key={r.label}>
              <p className="font-mono text-2xl font-black tracking-tight text-white">
                {vals[i]}
                <span className="text-sm text-emerald-300">{r.suffix}</span>
              </p>
              <p className="mt-0.5 text-[10px] font-bold text-ink-dim">{r.label}</p>
              <p className="text-[8.5px] leading-snug text-ink-faint">{r.note}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 h-0.5 overflow-hidden rounded-full bg-white/8">
          <div className="h-full bg-gradient-to-r from-emerald-300 to-cyan-300 transition-[width] duration-200" style={{ width: started ? "100%" : "0%" }} />
        </div>
        <p className="mt-2 text-center text-[9px] text-ink-faint">counts ease up once (IntersectionObserver), then stay put — metrics shouldn’t re-run on every scroll.</p>
      </div>
    </div>
  );
}

const TEAM_ROLES = ["all", "design", "engine", "ops"] as const;
const TEAM_PEOPLE = [
  { name: "Ada Lin", role: "design", initials: "AL", hue: "#c4b5fd", blurb: "design systems" },
  { name: "Miro Kade", role: "engine", initials: "MK", hue: "#67e8f9", blurb: "runtime & build" },
  { name: "Temi Okafor", role: "engine", initials: "TO", hue: "#6ee7b7", blurb: "a11y tooling" },
  { name: "Jonas Varga", role: "ops", initials: "JV", hue: "#fcd34d", blurb: "releases & docs" },
  { name: "Rin Sato", role: "design", initials: "RS", hue: "#fda4af", blurb: "motion language" },
  { name: "Nadia Haddad", role: "ops", initials: "NH", hue: "#7dd3fc", blurb: "community care" },
] as const;

function TeamGridFilter() {
  const [role, setRole] = useState<(typeof TEAM_ROLES)[number]>("all");
  const shown = TEAM_PEOPLE.filter((p) => role === "all" || p.role === role);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(251,113,133,0.08),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-ink-faint">the people</p>
          <div className="flex items-center gap-1 rounded-lg border border-white/8 bg-black/30 p-0.5">
            {TEAM_ROLES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                aria-pressed={role === r}
                className={`rounded-md px-2 py-1 text-[9px] font-bold capitalize ${role === r ? "bg-rose-400/20 text-rose-100" : "text-ink-faint hover:text-ink-dim"}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {shown.map((p, i) => (
            <div
              key={p.name}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-white/8 bg-white/4 px-2 py-3"
              style={{ animation: `mf-pop .35s cubic-bezier(.34,1.56,.64,1) ${i * 40}ms both` }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full text-[11px] font-black text-[#0b0c12]" style={{ background: p.hue }}>
                {p.initials}
              </span>
              <span className="text-center text-[10px] font-bold leading-tight text-white">{p.name}</span>
              <span className="text-[8px] text-ink-faint">{p.blurb}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-[9px] text-ink-faint">
          {shown.length} of {TEAM_PEOPLE.length} shown — filtering re-stamps cards with a 40ms pop so the change reads as one action.
        </p>
      </div>
    </div>
  );
}

const FAQ_PAIRS = [
  { q: "Are the assets original?", a: "Every demo, token and copy block is authored in-house. Nothing is scraped from third-party libraries — that is the whole point of the library." },
  { q: "Can I use them commercially?", a: "Yes. Every asset ships under MIT, including agency client work. The only thing you cannot do is resell the library itself as a product." },
  { q: "Do demos ship with the code?", a: "Each component page carries the full React + CSS snippet and a design note. Figma tokens are a separate download on the Team plan." },
  { q: "What about screen readers?", a: "The a11y pass is part of definition-of-done: live regions, keyboard paths and reduced-motion are tested, not bolted on." },
] as const;

function FaqTwoColumn() {
  const [open, setOpen] = useState(0);
  const cur = FAQ_PAIRS[open];
  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(99,102,241,0.1),transparent_60%),#08090f] px-6">
      <div className="grid w-full max-w-md grid-cols-[132px_minmax(0,1fr)] gap-3">
        <div className="flex flex-col gap-1.5">
          {FAQ_PAIRS.map((f, i) => (
            <button
              key={f.q}
              type="button"
              onClick={() => setOpen(i)}
              aria-expanded={open === i}
              className={`rounded-xl border px-3 py-2.5 text-left text-[10px] font-bold leading-snug transition-colors ${
                open === i ? "border-indigo-300/40 bg-indigo-300/10 text-indigo-100" : "border-white/6 bg-white/3 text-ink-dim hover:border-white/15"
              }`}
            >
              {f.q}
            </button>
          ))}
        </div>
        <div key={open} className="flex flex-col justify-center rounded-2xl border border-white/8 bg-white/4 px-5 py-6" style={{ animation: "mf-growin .3s ease-out both" }}>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-faint">answer {open + 1}/{FAQ_PAIRS.length}</span>
          <p className="mt-2 text-[11.5px] leading-relaxed text-white/85">{cur.a}</p>
          <div className="mt-4 flex items-center gap-2 text-[9px] text-ink-faint">
            <span className="rounded-full border border-white/10 px-2 py-0.5">{cur.q.length < 22 ? "quick one" : "the long read"}</span>
            <span>swap animates in place — no page jump</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparisonSlider() {
  const track = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const [drag, setDrag] = useState(false);
  const moveTo = (clientX: number) => {
    const el = track.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(250,204,21,0.08),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-ink-faint">before / after</p>
          <span className="font-mono text-[9px] text-ink-faint">{Math.round(pos)}%</span>
        </div>
        <div
          ref={track}
          role="slider"
          aria-label="Comparison slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-orientation="horizontal"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowDown") setPos((p) => Math.max(4, p - 4));
            if (e.key === "ArrowRight" || e.key === "ArrowUp") setPos((p) => Math.min(96, p + 4));
          }}
          onPointerDown={(e) => {
            setDrag(true);
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            moveTo(e.clientX);
          }}
          onPointerMove={(e) => {
            if (drag) moveTo(e.clientX);
          }}
          onPointerUp={() => setDrag(false)}
          className="relative mt-3 h-48 w-full cursor-ew-resize touch-none overflow-hidden rounded-2xl border border-white/10 select-none"
          style={{ touchAction: "none" }}
        >
          {/* after (colour) */}
          <div className="absolute inset-0" aria-hidden style={{ background: "linear-gradient(135deg, hsl(262 80% 30%) 0%, hsl(199 90% 36%) 55%, hsl(172 80% 34%) 100%)" }}>
            <div className="absolute inset-x-5 top-4 flex items-center gap-2">
              <span className="rounded-full bg-black/30 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-100 backdrop-blur">after · aurora tokenised</span>
            </div>
            <p className="absolute inset-x-5 bottom-4 text-[10px] font-black tracking-tight text-white/90">one palette, four surfaces, no drift</p>
          </div>
          {/* before (flat) */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden style={{ width: `${pos}%` }}>
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(220 12% 18%) 0%, hsl(222 10% 26%) 60%, hsl(215 8% 22%) 100%)", filter: "saturate(.25)" }}>
              <div className="absolute inset-x-5 top-4 flex items-center gap-2">
                <span className="rounded-full bg-black/40 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/70 backdrop-blur">before · six hand-picked hexes</span>
              </div>
              <p className="absolute inset-x-5 bottom-4 text-[10px] font-black tracking-tight text-white/40">every screen a slightly different grey</p>
            </div>
          </div>
          {/* divider */}
          <div className="absolute inset-y-0" aria-hidden style={{ left: `${pos}%`, transform: "translateX(-50%)" }}>
            <div className="h-full w-[2px] bg-white/90 shadow-[0_0_14px_rgba(255,255,255,.6)]" />
            <span className="absolute left-1/2 top-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-black/60 text-[11px] text-white backdrop-blur">
              ⇄
            </span>
          </div>
        </div>
        <p className="mt-3 text-center text-[9px] leading-relaxed text-ink-faint">
          drag or arrow-key the divider — pointer-captured so the drag never leaves the handle behind. Both panes stay in the same box, so the diff reads honestly.
        </p>
      </div>
    </div>
  );
}

const TL_MILES = [
  { when: "week 1", what: "Scaffold", text: "palette + type ramp agreed on real screens, not swatches." },
  { when: "week 3", what: "Ship 8 inputs", text: "combo-box through radio-pills land with keyboard paths intact." },
  { when: "week 6", what: "Motion pass", text: "signature scenes — odometer, confetti, liquid buttons — join." },
  { when: "week 8", what: "a11y audit", text: "screen-reader tour finds 3 gaps; all three close same week." },
  { when: "week 10", what: "Public launch", text: "the library opens with 39 originals and zero borrowed code." },
] as const;

function TimelineVertical() {
  const scroller = useRef<HTMLDivElement>(null);
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0c13]">
      <div className="flex items-center justify-between border-b border-white/6 px-4 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">milestone rail — scroll to walk it</span>
        <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[9px] text-amber-200/80">10 weeks</span>
      </div>
      <div ref={scroller} className="relative min-h-0 flex-1 overflow-y-auto px-6 py-5">
        <div className="relative mx-auto max-w-sm">
          <span aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-gradient-to-b from-violet-400/60 via-cyan-300/40 to-transparent" />
          <div className="space-y-4">
            {TL_MILES.map((m, i) => (
              <div key={m.what} className="relative flex gap-3.5">
                <span className="relative z-10 mt-1 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 border-cyan-300 bg-[#0a0c13]">
                  <span className="h-1 w-1 rounded-full bg-cyan-300" />
                </span>
                <div
                  className={`min-w-0 flex-1 rounded-xl border border-white/6 bg-white/3 px-3.5 py-2.5 transition-colors hover:border-white/15 ${i % 2 === 1 ? "sm:ml-6" : ""}`}
                  style={{ animation: "mf-rise .45s ease-out both" }}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[11px] font-black tracking-tight text-white">{m.what}</span>
                    <span className="shrink-0 font-mono text-[8.5px] uppercase tracking-[0.16em] text-ink-faint">{m.when}</span>
                  </div>
                  <p className="mt-1 text-[10px] leading-relaxed text-ink-dim">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const NB_TIERS = ["weekly digest", "launch only", "deep dives"] as const;

function NewsletterBandTiers() {
  const [tier, setTier] = useState<(typeof NB_TIERS)[number]>("weekly digest");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");
  const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const submit = () => {
    if (!valid) {
      setState("error");
      return;
    }
    setState("done");
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(52,211,153,0.12),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/8 bg-white/4 p-6 text-center">
        <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.22em] text-emerald-200">
          the motif post
        </span>
        <h3 className="mt-3 text-xl font-black tracking-tight text-white">one useful letter a week</h3>
        <p className="mx-auto mt-1.5 max-w-[300px] text-[11px] leading-relaxed text-ink-dim">
          design notes, fresh assets and honest a11y lessons — never a sales blast, unsubscribe in one click.
        </p>
        {state === "done" ? (
          <div className="mt-4 rounded-xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 text-sm font-bold text-emerald-200" role="status">
            ✓ You’re subscribed to “{tier}”.
          </div>
        ) : (
          <>
            <div className="mx-auto mt-4 flex max-w-[340px] gap-1 rounded-xl border border-white/10 bg-black/30 p-1">
              {NB_TIERS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTier(t)}
                  aria-pressed={tier === t}
                  className={`flex-1 rounded-lg px-2 py-1.5 text-[10px] font-bold capitalize transition-colors ${
                    tier === t ? "bg-emerald-400/20 text-emerald-100" : "text-ink-faint hover:text-ink-dim"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className={`mx-auto mt-3 flex max-w-[340px] items-center gap-2 rounded-xl border px-3 py-2 ${state === "error" ? "border-rose-300/50" : "border-white/10"}`}>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (state !== "idle") setState("idle");
                }}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="you@studio.dev"
                aria-label="Email address"
                className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-ink-faint"
              />
              <button type="button" onClick={submit} className="shrink-0 rounded-lg bg-emerald-300 px-4 py-1.5 text-[11px] font-black text-[#06120c] transition-colors hover:bg-emerald-200">
                Subscribe
              </button>
            </div>
            <p aria-live="polite" className="mt-2 h-3 text-[10px] text-rose-200">
              {state === "error" ? "Please use a real address — e.g. you@studio.dev" : ""}
            </p>
          </>
        )}
      </div>
      <p className="mt-4 max-w-md text-center text-[10px] leading-relaxed text-ink-faint">
        capture = email + frequency choice; the tier pill is part of the promise, so the welcome email can match it.
      </p>
    </div>
  );
}

function HeroProductMock() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-4 overflow-hidden bg-[radial-gradient(70%_100%_at_70%_0%,rgba(139,92,246,0.18),transparent_55%),#08090f] px-6">
      <div className="mx-auto w-full max-w-md">
        <div className="flex items-end justify-between gap-3">
          <div className="max-w-[220px]">
            <span className="rounded-full border border-violet-300/25 bg-violet-300/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-violet-200">
              dev-tool hero
            </span>
            <h3 className="mt-2 text-2xl font-black leading-[1.05] tracking-tight text-white">
              your UI, shipped <span className="text-violet-300">as systems</span>
            </h3>
            <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
              components, tokens and motion language — assembled, not bolted on.
            </p>
            <div className="mt-3 flex gap-2">
              <button type="button" className="rounded-lg bg-white px-3.5 py-1.5 text-[11px] font-black text-[#0b0c12] transition-transform hover:-translate-y-0.5">
                Browse assets
              </button>
              <button type="button" className="rounded-lg border border-white/15 px-3.5 py-1.5 text-[11px] font-bold text-white/85 transition-colors hover:bg-white/5">
                Read the essay
              </button>
            </div>
          </div>
          <p className="pb-1 font-mono text-[9px] text-ink-faint">v0.9 · {COMPONENTS.length} assets</p>
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-[#0d1017]/95 shadow-[0_30px_80px_rgba(0,0,0,.5)] backdrop-blur">
          <div className="flex items-center gap-2 border-b border-white/6 px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-2 flex-1 rounded-md bg-white/5 px-2 py-0.5 font-mono text-[9px] text-ink-faint">motif.ui/demo/aurora</span>
          </div>
          <div className="grid grid-cols-3 gap-2 p-3">
            <div className="col-span-2 flex flex-col gap-2 rounded-xl border border-white/6 bg-white/3 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink-faint">surfaces shipped</span>
                <span className="font-mono text-[10px] text-violet-300">1,214</span>
              </div>
              <div className="flex h-12 items-end gap-1">
                {[38, 55, 30, 62, 48, 74, 58, 88, 66, 42].map((hgt, i) => (
                  <span key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-violet-500/40 to-violet-300/70" style={{ height: `${hgt}%`, animation: `mf-growin .4s ease-out ${i * 40}ms both` }} />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="rounded-xl border border-white/6 bg-white/3 p-2.5">
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-ink-faint">tokens</span>
                <span className="mt-1 block text-base font-black text-white">42</span>
              </div>
              <div className="rounded-xl border border-white/6 bg-white/3 p-2.5">
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-ink-faint">a11y</span>
                <span className="mt-1 block text-base font-black text-emerald-300">98</span>
              </div>
              <div className="rounded-xl border border-white/6 bg-white/3 p-2.5">
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-ink-faint">runtime</span>
                <span className="mt-1 block text-base font-black text-cyan-300">0kb</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SFR_ROWS = [
  {
    k: "01",
    t: "Tokens before components",
    body: "Colour, type and spacing decided on real screens first — the component palette is a consequence, not a starting point.",
    tags: ["foundations", "palette"],
    art: "linear-gradient(150deg, hsl(262 80% 30%), hsl(199 90% 38%))",
    mark: "◐",
  },
  {
    k: "02",
    t: "Motion with a budget",
    body: "Every animation earns its place: under 200ms for feedback, over 500ms only for story beats, and reduced-motion kills the whole theatre.",
    tags: ["motion", "principles"],
    art: "linear-gradient(150deg, hsl(172 80% 26%), hsl(199 90% 34%))",
    mark: "◒",
  },
] as const;

function SplitFeatureRows() {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setSeen(true);
        });
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0c13]">
      <div className="flex items-center justify-between border-b border-white/6 px-4 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">feature rows — scroll for the fade</span>
        <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[9px] text-ink-faint">{seen ? "revealed" : "waiting…"}</span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <div className="mx-auto max-w-sm space-y-6">
          {SFR_ROWS.map((r, i) => {
            const flip = i % 2 === 1;
            return (
              <article
                key={r.k}
                className={`grid grid-cols-[110px_minmax(0,1fr)] gap-3 ${flip ? "direction-rtl" : ""}`}
                style={{ animation: seen ? `mf-rise .5s ease-out ${i * 140}ms both` : undefined, opacity: seen ? undefined : 0 }}
              >
                <div
                  className="group relative flex h-28 items-center justify-center overflow-hidden rounded-xl border border-white/10"
                  style={{ background: r.art }}
                >
                  <span className="text-4xl text-white/35 transition-transform duration-500 group-hover:scale-125" aria-hidden>
                    {r.mark}
                  </span>
                  <span aria-hidden className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                </div>
                <div className="flex min-w-0 flex-col justify-center">
                  <span className="font-mono text-[9px] text-ink-faint">{r.k}</span>
                  <h3 className="mt-0.5 text-sm font-black leading-tight tracking-tight text-white">{r.t}</h3>
                  <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-dim">{r.body}</p>
                  <div className="mt-2 flex gap-1.5">
                    {r.tags.map((t) => (
                      <span key={t} className="rounded-full border border-white/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.16em] text-ink-faint">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
          <p className="pb-1 text-center text-[9px] text-ink-faint">each row fades up 140ms after the last — and the art panel zooms gently on hover.</p>
        </div>
      </div>
      <style>{`.direction-rtl { direction: rtl } .direction-rtl > * { direction: ltr }`}</style>
    </div>
  );
}

const CSH_FACTS = [
  { k: "client", v: "Northwind Retail" },
  { k: "role", v: "Design system + build" },
  { k: "year", v: "2026" },
  { k: "stack", v: "React · Figma · tokens" },
] as const;

function CaseStudyHeader() {
  return (
    <div className="flex h-full w-full flex-col justify-center overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(34,211,238,0.09),transparent_60%),#08090f] px-6">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-white/8 bg-white/3 p-5">
        <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.22em] text-ink-faint">
          <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-2 py-0.5 text-cyan-200">case study</span>
          <span>design systems</span>
        </div>
        <h3 className="mt-3 text-xl font-black leading-tight tracking-tight text-white">
          Bringing 14 storefronts onto one design system — without a freeze
        </h3>
        <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
          How Northwind’s five squads shipped a token pipeline, a living component set and an a11y bar, all while the roadmap kept moving.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {CSH_FACTS.map((f) => (
            <div key={f.k} className="rounded-xl border border-white/6 bg-black/20 px-3 py-2">
              <span className="block text-[8px] font-bold uppercase tracking-[0.2em] text-ink-faint">{f.k}</span>
              <span className="mt-0.5 block truncate text-[11px] font-bold text-white/90">{f.v}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-white/6 pt-3">
          <span className="font-mono text-[9px] text-ink-faint">read time · 9 min</span>
          <button type="button" className="rounded-lg bg-white/10 px-3 py-1.5 text-[10px] font-black text-white transition-colors hover:bg-white/15">
            Read the study →
          </button>
        </div>
      </div>
      <p className="mx-auto mt-4 w-full max-w-md text-center text-[9px] leading-relaxed text-ink-faint">
        the labelled grid does the heavy lifting — client, role, year and stack answer the four questions every reader asks first.
      </p>
    </div>
  );
}

const CL_ITEMS = [
  { ver: "v1.3.0", day: "today", kind: "asset", tone: "mint", title: "Bento grid joins the library", body: "Eight marketing sections landed, from logo walls to comparison sliders." },
  { ver: "v1.2.1", day: "tue", kind: "fix", tone: "amber", title: "Marquee pause on hover", body: "Hovering a testimonial row now pauses both lanes; reduced-motion wraps instead of drifting." },
  { ver: "v1.2.0", day: "mon", kind: "feat", tone: "violet", title: "Pricing + newsletter sections", body: "Billing toggle, frequency pills — copy and code in one pass." },
  { ver: "v1.1.0", day: "last week", kind: "asset", tone: "mint", title: "Toast queue with undo", body: "Countdown bars, a batch cap of three, and an Undo action for mis-taps." },
  { ver: "v1.0.9", day: "last week", kind: "fix", tone: "amber", title: "Faster a11y audit", body: "The screen-reader pass now runs in CI on every demo change." },
] as const;

function ChangelogFeed() {
  const [openVer, setOpenVer] = useState<string | null>("v1.3.0");
  const toneMap: Record<string, string> = {
    asset: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200",
    feat: "border-violet-300/25 bg-violet-300/10 text-violet-200",
    fix: "border-amber-300/25 bg-amber-300/10 text-amber-200",
  };
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0c13]">
      <div className="flex items-center justify-between border-b border-white/6 px-4 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">ship log</span>
        <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[9px] text-emerald-300">v1.3.0 · live</span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3">
        <div className="mx-auto max-w-sm space-y-2">
          {CL_ITEMS.map((it) => {
            const open = openVer === it.ver;
            return (
              <div key={it.ver} className={`rounded-xl border px-3.5 py-3 transition-colors ${open ? "border-white/15 bg-white/5" : "border-white/6 bg-white/2 hover:bg-white/4"}`}>
                <button
                  type="button"
                  onClick={() => setOpenVer(open ? null : it.ver)}
                  aria-expanded={open}
                  className="flex w-full items-center gap-2.5 text-left"
                >
                  <span className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-[9px] font-bold text-white/85">{it.ver}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.16em] ${toneMap[it.kind]}`}>{it.kind}</span>
                  <span className="min-w-0 flex-1 truncate text-[11px] font-bold text-white/90">{it.title}</span>
                  <span className="shrink-0 text-[8px] uppercase tracking-[0.14em] text-ink-faint">{it.day}</span>
                </button>
                {open && (
                  <p className="mt-2 border-t border-white/6 pt-2 text-[10.5px] leading-relaxed text-ink-dim" style={{ animation: "mf-fade .2s ease-out both" }}>
                    {it.body}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const RD_FILES = [
  { name: "aurora-tokens.zip", fmt: "ZIP", size: "84 KB", note: "design tokens for Figma + code" },
  { name: "signature-motion-guide.pdf", fmt: "PDF", size: "2.1 MB", note: "the motion language in 18 pages" },
  { name: "motif-foundations.sketch", fmt: "FIG", size: "12 MB", note: "full source for the foundations" },
] as const;

function ResourceDownloadCards() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(250,204,21,0.08),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-md">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-ink-faint">downloads · free with the newsletter</p>
        <div className="mt-3 space-y-2">
          {RD_FILES.map((f) => (
            <div
              key={f.name}
              className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/3 px-3.5 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/5 hover:shadow-[0_12px_30px_rgba(0,0,0,.35)]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/8 font-mono text-[8px] font-black text-amber-200" style={{ fontSize: 7 }}>
                {f.fmt}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-[11px] text-white/90">{f.name}</p>
                <p className="text-[9px] text-ink-faint">
                  {f.size} · {f.note}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDone((d) => ({ ...d, [f.name]: true }))}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-[10px] font-black transition-colors ${
                  done[f.name] ? "bg-emerald-300/15 text-emerald-300" : "bg-white/10 text-white hover:bg-white/15"
                }`}
              >
                {done[f.name] ? "✓ grabbed" : "Download"}
              </button>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-[9px] leading-relaxed text-ink-faint">format badge + honest size first, action second — no mystery links, no “subscribe to reveal”.</p>
      </div>
    </div>
  );
}

const EV_SESSIONS = [
  { date: "wed · mar 11", when: "09:30", t: "Tokens as the contract", who: "Ada Lin", tag: "talk", room: "hall a" },
  { date: "wed · mar 11", when: "11:00", t: "Motion without the maths", who: "Rin Sato", tag: "workshop", room: "room 2" },
  { date: "wed · mar 11", when: "14:00", t: "The a11y audit that ran itself", who: "Temi Okafor", tag: "talk", room: "hall b" },
  { date: "thu · mar 12", when: "09:00", t: "Design systems on a deadline", who: "Jonas Varga", tag: "panel", room: "hall a" },
  { date: "thu · mar 12", when: "11:30", t: "Shipping a library in 10 weeks", who: "Nadia Haddad", tag: "talk", room: "room 1" },
] as const;

function EventScheduleList() {
  const [pick, setPick] = useState<string | null>(null);
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0c13]">
      <div className="flex items-center justify-between border-b border-white/6 px-4 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">summit schedule</span>
        <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[9px] text-ink-faint">2 days · 5 sessions</span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3">
        <div className="mx-auto max-w-sm">
          {EV_SESSIONS.map((s, i) => {
            const sticky = i === 0 || EV_SESSIONS[i - 1].date !== s.date;
            const active = pick === `${s.date}-${s.when}`;
            return (
              <div key={`${s.date}-${s.when}`} className="relative pb-1.5">
                {sticky && (
                  <p className="sticky top-0 z-10 border-y border-white/6 bg-[#0a0c13]/95 py-1.5 text-[9px] font-black uppercase tracking-[0.22em] text-ink-dim backdrop-blur">
                    {s.date}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setPick(active ? null : `${s.date}-${s.when}`)}
                  aria-expanded={active}
                  className={`mt-1.5 flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors ${
                    active ? "border-amber-300/35 bg-amber-300/8" : "border-white/6 bg-white/3 hover:border-white/15"
                  }`}
                >
                  <span className="w-11 shrink-0 font-mono text-[10px] font-bold text-amber-200">{s.when}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11px] font-bold text-white/90">{s.t}</span>
                    <span className="block text-[9px] text-ink-faint">
                      {s.who} · {s.room}
                    </span>
                  </span>
                  <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.14em] ${
                    s.tag === "workshop" ? "border-cyan-300/25 text-cyan-200" : s.tag === "panel" ? "border-violet-300/25 text-violet-200" : "border-white/10 text-ink-dim"
                  }`}>
                    {s.tag}
                  </span>
                </button>
                {active && (
                  <p className="rounded-b-xl border border-t-0 border-amber-300/20 bg-amber-300/4 px-3.5 py-2 text-[9.5px] leading-relaxed text-ink-dim" style={{ animation: "mf-fade .2s ease-out both" }}>
                    Seat held for “{EV_SESSIONS.find((x) => x.date === s.date && x.when === s.when)?.t}”. Doors open 15 minutes before — see you there.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const MF_CITIES = [
  { city: "Rotterdam", tz: "Europe/Amsterdam", note: "studio + workshop floor", hours: "mon–fri · 9–18" },
  { city: "Singapore", tz: "Asia/Singapore", note: "APAC hub · by appointment", hours: "tue + thu · 10–16" },
  { city: "Lisbon", tz: "Europe/Lisbon", note: "the remote-friendly attic", hours: "always online" },
] as const;

function MapFreeLocalBand() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(t);
  }, []);
  const time = (tz: string) =>
    new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz }).format(now);
  return (
    <div className="flex h-full w-full flex-col justify-center overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(52,211,153,0.09),transparent_60%),#08090f] px-6">
      <div className="mx-auto w-full max-w-md">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-ink-faint">where we work · no map, no tracker</p>
        <div className="mt-3 space-y-2">
          {MF_CITIES.map((c) => {
            const t = time(c.tz);
            const late = Number(t.split(":")[0]) >= 18 || Number(t.split(":")[0]) < 9;
            return (
              <div key={c.city} className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/3 px-3.5 py-3">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className={`absolute inline-flex h-full w-full rounded-full opacity-60 ${late ? "bg-amber-300" : "bg-emerald-300"}`} style={{ animation: "mf-glow 2s ease-in-out infinite" }} />
                  <span className={`relative inline-flex h-2 w-2 rounded-full ${late ? "bg-amber-300" : "bg-emerald-300"}`} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[11px] font-black tracking-tight text-white">{c.city}</span>
                    <span className="shrink-0 font-mono text-[10px] text-ink-dim">
                      {t}
                      <span className="ml-1 text-[8px] text-ink-faint">{late ? "closed" : "open"}</span>
                    </span>
                  </div>
                  <p className="truncate text-[9px] text-ink-faint">
                    {c.note} · {c.hours}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-center text-[9px] leading-relaxed text-ink-faint">
          local time is computed live from the real timezone — a map-free band that still answers “is anyone awake there?”.
        </p>
      </div>
    </div>
  );
}

const AST_SHOTS = [
  {
    id: "shelf",
    cap: "The asset shelf — filters on the left, live previews on the right.",
    tag: "browse",
    art: "linear-gradient(160deg, hsl(262 70% 22%), hsl(262 80% 34%))",
  },
  {
    id: "detail",
    cap: "Every asset page carries code, tokens and a design note — no tab roulette.",
    tag: "inspect",
    art: "linear-gradient(160deg, hsl(199 80% 20%), hsl(199 90% 36%))",
  },
  {
    id: "admin",
    cap: "The admin updates the same localStorage store the site reads — no fake CRUD.",
    tag: "manage",
    art: "linear-gradient(160deg, hsl(172 70% 18%), hsl(172 80% 32%))",
  },
  {
    id: "learn",
    cap: "Learn essays sit next to the components they teach — theory 20cm from practice.",
    tag: "read",
    art: "linear-gradient(160deg, hsl(30 80% 20%), hsl(30 90% 34%))",
  },
] as const;

function AppScreenshotTour() {
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    const t = window.setTimeout(() => setIdx((i) => (i + 1) % AST_SHOTS.length), 3400);
    return () => window.clearTimeout(t);
  }, [auto, idx]);
  const shot = AST_SHOTS[idx];
  return (
    <div className="flex h-full w-full flex-col justify-center overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(139,92,246,0.12),transparent_60%),#08090f] px-6">
      <div className="mx-auto grid w-full max-w-md grid-cols-[150px_minmax(0,1fr)] items-center gap-4">
        <div className="flex justify-center">
          <div className="w-[122px] rounded-[26px] border border-white/12 bg-black/50 p-2 shadow-[0_24px_60px_rgba(0,0,0,.5)]">
            <div className="rounded-[19px] border border-white/6 p-1.5" style={{ background: shot.art }}>
              <div className="mx-auto mb-1.5 h-1 w-8 rounded-full bg-black/40" />
              <div className="space-y-1 rounded-lg bg-black/25 p-1.5">
                <div className="h-1 w-3/4 rounded-full bg-white/25" />
                <div className="h-1 w-1/2 rounded-full bg-white/15" />
                <div className="mt-1.5 grid grid-cols-2 gap-1">
                  <div className="h-6 rounded-md bg-white/15" />
                  <div className="h-6 rounded-md bg-white/15" />
                </div>
                <div className="mt-1.5 h-1 w-full rounded-full bg-white/15" />
                <div className="h-1 w-2/3 rounded-full bg-white/10" />
              </div>
              <p className="mt-1.5 text-center font-mono text-[7px] uppercase tracking-[0.18em] text-white/70">{shot.tag}</p>
            </div>
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-ink-faint">product tour · {idx + 1}/{AST_SHOTS.length}</p>
          <p className="mt-2 min-h-12 text-[12px] font-bold leading-relaxed text-white" style={{ animation: "mf-fade .3s ease-out both" }} key={shot.id}>
            {shot.cap}
          </p>
          <div className="mt-2 flex gap-1.5">
            {AST_SHOTS.map((sh, i) => (
              <button
                key={sh.id}
                type="button"
                aria-label={`Show ${sh.tag}`}
                onClick={() => {
                  setIdx(i);
                  setAuto(false);
                }}
                className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-violet-300" : "w-1.5 bg-white/20 hover:bg-white/40"}`}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAuto((a) => !a)}
              aria-pressed={auto}
              className={`btn ${auto ? "!border-white/12 !bg-white/6 !text-white" : "btn-ghost"} !px-3 !py-1 !text-[10px]`}
            >
              {auto ? "❚❚ stop auto" : "▶ auto tour"}
            </button>
            <span className="text-[9px] text-ink-faint">caption swaps with the screen; dots pick a stop</span>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-5 w-full max-w-md text-center text-[9px] leading-relaxed text-ink-faint">
        the phone stays put while the story changes — the sticky-frame pattern that lets a tour read like a scroll, not a slideshow.
      </p>
    </div>
  );
}

function TemplateDocsSite() {
  const sections = ["overview", "install", "tokens", "components", "motion"];
  const [active, setActive] = useState("overview");
  const scroller = useRef<HTMLDivElement>(null);
  const jump = (id: string) => {
    setActive(id);
    const el = scroller.current?.querySelector(`[data-sec="${id}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0c13]">
      <div className="flex items-center gap-2 border-b border-white/6 px-4 py-2">
        <span className="rounded-md border border-white/10 px-2 py-0.5 font-mono text-[9px] text-ink-faint">docs</span>
        <span className="truncate text-[10px] font-bold text-white/80">Getting started · motif/ui</span>
        <span className="ml-auto rounded-full border border-white/10 px-2 py-0.5 font-mono text-[9px] text-emerald-300">v1.3</span>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[92px_minmax(0,1fr)]">
        <nav className="flex flex-col gap-0.5 overflow-y-auto border-r border-white/6 px-2 py-3" aria-label="Docs sections">
          {sections.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => jump(s)}
              aria-current={active === s ? "true" : undefined}
              className={`rounded-lg px-2 py-1.5 text-left text-[10px] font-bold capitalize transition-colors ${
                active === s ? "bg-white/10 text-white" : "text-ink-faint hover:bg-white/5 hover:text-ink-dim"
              }`}
            >
              {s}
            </button>
          ))}
        </nav>
        <div ref={scroller} onScroll={(e) => {
          const el = e.currentTarget;
          let cur = sections[0];
          sections.forEach((s) => {
            const node = el.querySelector(`[data-sec="${s}"]`) as HTMLElement | null;
            if (node && node.offsetTop - 70 <= el.scrollTop) cur = s;
          });
          setActive(cur);
        }} className="min-h-0 overflow-y-auto px-4 py-4">
          <div className="space-y-6">
            {[
              ["overview", "A library that reads like a book", "Every asset page ships code, tokens and a design note in one place, so onboarding is one scroll instead of five tabs."],
              ["install", "npm i motif-ui", "One command, no peer-dependency maze. The package is 4 kB gzipped and carries zero runtime."],
              ["tokens", "Tokens before themes", "Colour, type and spacing are data first; dark mode is a token swap, not a stylesheet rewrite."],
              ["components", `${COMPONENTS.length} assets and counting`, "Inputs, sections and signature motion pieces — each with an original demo, copy snippet and a11y score."],
              ["motion", "A motion language, not a toolbox", "Under 200ms for feedback, 500ms+ for story beats, and reduced-motion kills the theatre — by design."],
            ].map(([id, t, b]) => (
              <section key={id} data-sec={id} className="scroll-mt-4">
                <h3 className="text-[13px] font-black tracking-tight text-white">{t}</h3>
                <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-dim">{b}</p>
              </section>
            ))}
            <div className="flex items-center justify-between border-t border-white/6 pt-3">
              <button type="button" className="text-[10px] font-bold text-ink-dim hover:text-white">← Previous</button>
              <button type="button" onClick={() => jump(sections[(sections.indexOf(active) + 1) % sections.length])} className="rounded-lg bg-white/10 px-3 py-1.5 text-[10px] font-black text-white hover:bg-white/15">
                Next: {sections[(sections.indexOf(active) + 1) % sections.length]} →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TemplateLandingSaas() {
  const scroller = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const go = (id: string) => {
    setMenuOpen(false);
    scroller.current?.querySelector(`[data-sec="${id}"]`)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0c13]">
      <div className="flex items-center justify-between border-b border-white/6 px-4 py-2">
        <span className="text-[11px] font-black tracking-tight text-white">
          motif<span className="text-violet-300">/</span>ui
        </span>
        <nav className="hidden items-center gap-3 sm:flex" aria-label="Landing nav">
          {["features", "pricing", "faq"].map((n) => (
            <button key={n} type="button" onClick={() => go(n)} className="text-[10px] font-bold text-ink-dim hover:text-white">
              {n}
            </button>
          ))}
          <button type="button" onClick={() => go("cta")} className="rounded-lg bg-white px-3 py-1 text-[10px] font-black text-[#0b0c12]">
            Start free
          </button>
        </nav>
        <button
          type="button"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((m) => !m)}
          className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] sm:hidden"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
      {menuOpen && (
        <div className="flex flex-col gap-2 border-b border-white/6 bg-black/40 px-4 py-3 sm:hidden" style={{ animation: "mf-fade .15s ease-out both" }}>
          {["features", "pricing", "faq"].map((n) => (
            <button key={n} type="button" onClick={() => go(n)} className="rounded-lg px-2 py-1.5 text-left text-[11px] font-bold text-ink-dim hover:bg-white/5">
              {n}
            </button>
          ))}
        </div>
      )}
      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto">
        <section data-sec="hero" className="px-5 pb-8 pt-8 text-center" style={{ background: "radial-gradient(70% 100% at 50% 0%, rgba(139,92,246,.22), transparent 60%)" }}>
          <div className="mx-auto max-w-sm">
            <span className="rounded-full border border-violet-300/25 bg-violet-300/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-violet-200">
              dark SaaS template
            </span>
            <h2 className="mt-3 text-2xl font-black leading-tight tracking-tight text-white">
              The component library your roadmap <span className="text-violet-300">kept promising</span>
            </h2>
            <p className="mx-auto mt-2 max-w-[300px] text-[11px] leading-relaxed text-ink-dim">
              Original assets, honest a11y and a motion language — assembled from the same sections on this page.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <button type="button" onClick={() => go("features")} className="rounded-lg bg-white px-4 py-2 text-[11px] font-black text-[#0b0c12]">
                See features
              </button>
              <button type="button" onClick={() => go("pricing")} className="rounded-lg border border-white/15 px-4 py-2 text-[11px] font-bold text-white/85">
                View pricing
              </button>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[9px] text-ink-faint">
              {["northwind", "arclight", "hazel&co", "plainday", "solidpine"].map((l) => (
                <span key={l} className="rounded-full border border-white/8 bg-white/3 px-2.5 py-1 font-mono opacity-80 hover:opacity-100">
                  {l}
                </span>
              ))}
            </div>
          </div>
        </section>
        <section data-sec="features" className="border-t border-white/6 px-5 py-6">
          <div className="mx-auto grid max-w-sm grid-cols-3 gap-2">
            {[
              ["tokens", "one source of truth"],
              ["motion", "budgeted animation"],
              ["a11y", "tested, not bolted"],
            ].map(([t, b]) => (
              <div key={t} className="rounded-xl border border-white/6 bg-white/3 p-3">
                <span className="text-lg text-violet-300">◈</span>
                <p className="mt-1 text-[10px] font-black capitalize text-white">{t}</p>
                <p className="mt-0.5 text-[8.5px] leading-snug text-ink-dim">{b}</p>
              </div>
            ))}
          </div>
        </section>
        <section data-sec="pricing" className="border-t border-white/6 px-5 py-6">
          <div className="mx-auto grid max-w-sm grid-cols-3 gap-2">
            {[
              ["Studio", "$0"],
              ["Team", "$24"],
              ["Agency", "$64"],
            ].map(([n, p], i) => (
              <div key={n} className={`rounded-xl border p-3 text-center ${i === 1 ? "border-emerald-300/35 bg-emerald-300/8" : "border-white/8 bg-white/3"}`}>
                <p className="text-[10px] font-black text-white">{n}</p>
                <p className="mt-1 text-base font-black text-white">
                  {p}
                  <span className="text-[8px] text-ink-faint">/mo</span>
                </p>
                <button type="button" className={`mt-2 w-full rounded-lg px-2 py-1 text-[9px] font-black ${i === 1 ? "bg-emerald-300 text-[#06120c]" : "bg-white/10 text-white"}`}>
                  {i === 0 ? "Free" : "Choose"}
                </button>
              </div>
            ))}
          </div>
        </section>
        <section data-sec="faq" className="border-t border-white/6 px-5 py-6">
          <div className="mx-auto max-w-sm space-y-1.5">
            {[
              ["Original?", "Every asset is authored in-house."],
              ["Licence?", "MIT, including client work."],
              ["Fast?", "Zero runtime on your page."],
            ].map(([q, a]) => (
              <div key={q} className="flex items-baseline gap-2 rounded-lg border border-white/6 bg-white/2 px-3 py-2">
                <span className="shrink-0 text-[10px] font-black text-white">{q}</span>
                <span className="text-[9.5px] text-ink-dim">{a}</span>
              </div>
            ))}
          </div>
        </section>
        <section data-sec="cta" className="border-t border-white/6 px-5 py-6 text-center" style={{ background: "linear-gradient(180deg, transparent, rgba(52,211,153,.08))" }}>
          <p className="text-sm font-black text-white">Stop promising the library. Ship it.</p>
          <button type="button" onClick={() => go("hero")} className="mt-3 rounded-lg bg-emerald-300 px-5 py-2 text-[11px] font-black text-[#06120c]">
            Start building free
          </button>
        </section>
        <p className="border-t border-white/6 px-5 py-3 text-center text-[8px] text-ink-faint">
          assembled from shipped sections · hero → logos → features → pricing → faq → cta
        </p>
      </div>
    </div>
  );
}

function TemplateWaitlist() {
  const [target] = useState(() => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + 1);
    d.setHours(9, 0, 0, 0);
    return d;
  });
  const [left, setLeft] = useState(() => target.getTime() - Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setLeft(target.getTime() - Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [target]);
  const seg = (ms: number) => Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(seg(left) / 86400);
  const hrs = Math.floor((seg(left) % 86400) / 3600);
  const mins = Math.floor((seg(left) % 3600) / 60);
  const secs = seg(left) % 60;
  const [code] = useState("MOTIF-EARLY-42");
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch { /* clipboard may be blocked in sandboxed iframes */ }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex h-full w-full flex-col justify-center overflow-hidden bg-[radial-gradient(70%_100%_at_50%_0%,rgba(52,211,153,0.14),transparent_60%),#08090f] px-6">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-white/8 bg-white/4 p-6 text-center">
        <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.22em] text-emerald-200">
          waitlist · batch {pad(hrs + days * 24)}h
        </span>
        <h3 className="mt-3 text-xl font-black tracking-tight text-white">motif desktop is almost here</h3>
        <p className="mx-auto mt-1.5 max-w-[300px] text-[11px] leading-relaxed text-ink-dim">
          invite-only access opens at 09:00 on the first of next month. Your spot is saved the moment you join.
        </p>
        <div className="mt-4 grid grid-cols-4 gap-1.5 font-mono">
          {[
            [pad(days), "days"],
            [pad(hrs), "hrs"],
            [pad(mins), "min"],
            [pad(secs), "sec"],
          ].map(([v, k]) => (
            <div key={k} className="rounded-xl border border-white/8 bg-black/30 py-2.5">
              <span className="block text-lg font-black leading-none text-white tabular-nums">{v}</span>
              <span className="mt-1 block text-[8px] uppercase tracking-[0.18em] text-ink-faint">{k}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-emerald-300/30 bg-emerald-300/5 px-3 py-2.5">
          <span className="min-w-0 flex-1 truncate text-left font-mono text-[11px] font-bold tracking-[0.14em] text-emerald-200">{code}</span>
          <button type="button" onClick={copy} className="shrink-0 rounded-lg bg-white/10 px-3 py-1.5 text-[10px] font-black text-white hover:bg-white/15">
            {copied ? "✓ copied" : "Copy invite"}
          </button>
        </div>
        <p className="mt-3 text-[9px] text-ink-faint">
          referral code: friends who join with it move one spot up the list — honesty, the countdown is real.
        </p>
      </div>
    </div>
  );
}

const TJ_ITEMS = [
  { kind: "essay", title: "Empty states are onboarding", meta: "learn · 6 min", tone: "border-violet-300/25 bg-violet-300/10 text-violet-200" },
  { kind: "release", title: "v1.3 — eight new sections", meta: "changelog · mar 2026", tone: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200" },
  { kind: "essay", title: "Motion on a budget", meta: "learn · 9 min", tone: "border-violet-300/25 bg-violet-300/10 text-violet-200" },
  { kind: "release", title: "v1.2 — pricing & newsletter", meta: "changelog · feb 2026", tone: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200" },
  { kind: "essay", title: "The audit that ran itself", meta: "learn · 7 min", tone: "border-violet-300/25 bg-violet-300/10 text-violet-200" },
] as const;

function TemplateChangelogJournal() {
  const [pick, setPick] = useState<string | null>("Empty states are onboarding");
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0c13]">
      <div className="flex items-center justify-between border-b border-white/6 px-4 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">journal · essays + releases</span>
        <span className="flex gap-1.5">
          <span className="rounded-full border border-violet-300/20 px-2 py-0.5 text-[8px] font-bold uppercase text-violet-200">essays</span>
          <span className="rounded-full border border-emerald-300/20 px-2 py-0.5 text-[8px] font-bold uppercase text-emerald-200">releases</span>
        </span>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)]">
        <div className="space-y-1.5 overflow-y-auto px-4 py-3">
          {TJ_ITEMS.map((it) => {
            const open = pick === it.title;
            return (
              <button
                key={it.title}
                type="button"
                onClick={() => setPick(open ? null : it.title)}
                aria-expanded={open}
                className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors ${open ? "border-white/15 bg-white/5" : "border-white/6 bg-white/2 hover:border-white/12"}`}
              >
                <span className={`rounded-full border px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.16em] ${it.tone}`}>{it.kind}</span>
                <span className="min-w-0 flex-1 truncate text-[11px] font-bold text-white/90">{it.title}</span>
                <span className="shrink-0 text-[8px] uppercase tracking-[0.14em] text-ink-faint">{it.meta.split("·")[1]?.trim()}</span>
              </button>
            );
          })}
          <p className="pt-2 text-center text-[9px] text-ink-faint">one index for both streams — a changelog that reads like a journal, or the reverse.</p>
        </div>
      </div>
    </div>
  );
}

function TemplateGallery() {
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("all");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const hay = q.trim().toLowerCase();
  const list = COMPONENTS.filter((c) => {
    const byKind = kind === "all" || (c.kind || "").toLowerCase().includes(kind);
    const byQ = !hay || c.title.toLowerCase().includes(hay) || (c.tags || []).some((t) => t.includes(hay)) || c.slug.includes(hay);
    return byKind && byQ;
  }).slice(0, 12);
  const copy = async (slug: string) => {
    try {
      await navigator.clipboard.writeText(slug);
    } catch { /* clipboard blocked in sandboxed iframe */ }
    setCopiedSlug(slug);
    window.setTimeout(() => setCopiedSlug(null), 1200);
  };
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0c13]">
      <div className="flex items-center justify-between gap-2 border-b border-white/6 px-4 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">template gallery · real catalog</span>
        <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[9px] text-ink-faint">{list.length} of {COMPONENTS.length}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-b border-white/6 px-4 py-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`filter ${COMPONENTS.length} assets…`}
          aria-label="Filter templates"
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/25 px-3 py-1.5 text-[11px] text-white outline-none placeholder:text-ink-faint focus:border-violet-300/40"
        />
        <div className="flex items-center gap-1">
          {["all", "element", "animated", "section"].map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              aria-pressed={kind === k}
              className={`rounded-md px-2 py-1 text-[9px] font-bold capitalize ${kind === k ? "bg-violet-400/20 text-violet-100" : "text-ink-faint hover:text-ink-dim"}`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-3 gap-2 overflow-y-auto px-4 py-3 sm:grid-cols-4">
        {list.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => copy(c.slug)}
            className={`flex flex-col rounded-xl border px-2 py-2.5 text-left transition-colors ${copiedSlug === c.slug ? "border-emerald-300/40 bg-emerald-300/8" : "border-white/6 bg-white/3 hover:border-white/15 hover:bg-white/5"}`}
            style={{ animation: "mf-pop .3s ease-out both" }}
          >
            <span className="flex h-9 items-end justify-start rounded-lg bg-gradient-to-br from-white/12 to-white/2 px-1.5 pb-1.5">
              <span className="truncate font-mono text-[7px] uppercase tracking-wider text-ink-dim">{(c.slug || "").slice(0, 16)}</span>
            </span>
            <span className="mt-1.5 truncate text-[9px] font-bold leading-tight text-white">{c.title}</span>
            <span className="mt-0.5 truncate text-[7.5px] text-ink-faint">{copiedSlug === c.slug ? "✓ slug copied" : `kind · ${c.kind} · v${c.version ?? "1.0"}`}</span>
          </button>
        ))}
        {list.length === 0 && (
          <p className="col-span-full py-8 text-center text-[10px] text-ink-faint">no assets match “{q}” — the filter is live, the catalog is real.</p>
        )}
      </div>
    </div>
  );
}

/* ---------------- backgrounds: batch #71-78 ---------------- */

function contourRingPath(cx: number, cy: number, r: number, phase: number, k = 3): string {
  const pts: string[] = [];
  const n = 64;
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = r + Math.sin(a * k + phase) * r * 0.16 + Math.sin(a * (k + 2) + phase * 1.7) * r * 0.09;
    pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr * 0.84).toFixed(1)}`);
  }
  return `M${pts.join(" L")} Z`;
}

const TC_HILLS = [
  { cx: 118, cy: 118, rings: [16, 24, 33, 42, 52, 63, 75, 88], phase: 0.6 },
  { cx: 322, cy: 84, rings: [14, 23, 33, 44, 56, 69], phase: 2.4 },
  { cx: 250, cy: 196, rings: [12, 20, 29, 39, 50], phase: 4.1 },
] as const;

function TopographicContours() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#08090f]">
      <svg viewBox="0 0 420 236" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="tc-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        {TC_HILLS.map((h, hi) =>
          h.rings.map((r, ri) => {
            const d = contourRingPath(h.cx, h.cy, r, h.phase + ri * 0.7);
            const near = ri >= h.rings.length - 2;
            return (
              <path
                key={`${hi}-${ri}`}
                d={d}
                fill="none"
                stroke={near ? "url(#tc-a)" : undefined}
                style={{ stroke: near ? undefined : `rgba(167,139,250,${(0.06 + (ri % 3) * 0.045).toFixed(3)})`, strokeWidth: near ? 1.2 : 1 }}
                opacity={near ? 0.75 : 1}
                className="tc-ring"
              />
            );
          }),
        )}
      </svg>
      <style>{`@keyframes mf-tc-bob { from { transform: translateY(0) } to { transform: translateY(-3px) } }
.tc-ring { animation: mf-tc-bob 9s ease-in-out infinite alternate; }
.tc-ring:nth-of-type(2n) { animation-duration: 12s; animation-delay: -4s }
.tc-ring:nth-of-type(3n) { animation-duration: 7s; animation-delay: -2s }
@media (prefers-reduced-motion: reduce) { .tc-ring { animation: none } }`}</style>
    </div>
  );
}

const BP_CROSSHAIRS = [
  { x: 72, y: 68, r: 26 },
  { x: 250, y: 130, r: 34 },
  { x: 336, y: 50, r: 20 },
  { x: 152, y: 172, r: 30 },
] as const;

function BlueprintGrid() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0a1a30]" style={{ backgroundImage: "linear-gradient(rgba(96,165,250,.09) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,.09) 1px, transparent 1px), linear-gradient(rgba(125,211,252,.22) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,.22) 1px, transparent 1px)", backgroundSize: "16px 16px, 16px 16px, 80px 80px, 80px 80px" }}>
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 225">
        {BP_CROSSHAIRS.map((c, i) => (
          <g key={i} stroke="rgba(186,230,253,.5)" strokeWidth="1">
            <circle cx={c.x} cy={c.y} r={c.r} fill="none" strokeDasharray="4 4" opacity="0.8" />
            <circle cx={c.x} cy={c.y} r="2" fill="#bae6fd" stroke="none" />
            <line x1={c.x} y1={c.y - c.r - 8} x2={c.x} y2={c.y + c.r + 8} opacity="0.45" />
            <line x1={c.x - c.r - 8} y1={c.y} x2={c.x + c.r + 8} y2={c.y} opacity="0.45" />
          </g>
        ))}
        <g stroke="#7dd3fc" strokeWidth="1.2" opacity="0.9">
          {[
            [18, 18],
            [382, 18],
            [18, 207],
            [382, 207],
          ].map(([x, y], i) => (
            <g key={i}>
              <line x1={x - 10} y1={y} x2={x + 10} y2={y} />
              <line x1={x} y1={y - 10} x2={x} y2={y + 10} />
            </g>
          ))}
        </g>
        <text x="30" y="200" fill="rgba(186,230,253,.55)" fontSize="7" fontFamily="ui-monospace, monospace" letterSpacing="2">
          MOTIF/ENG — PLATE 07 · GRID 16/80 · N 34°03
        </text>
        <text x="330" y="30" fill="rgba(186,230,253,.4)" fontSize="7" fontFamily="ui-monospace, monospace">
          A-1 · B-2 · C-3
        </text>
      </svg>
      <span aria-hidden className="bp-scan absolute inset-x-0 h-px bg-cyan-200/50" style={{ boxShadow: "0 0 18px rgba(165,243,252,.8)", animation: "mf-bp-scan 5.5s linear infinite" }} />
      <style>{`@keyframes mf-bp-scan { 0% { top: -2% } 100% { top: 102% } }
@media (prefers-reduced-motion: reduce) { .bp-scan { animation: none } }`}</style>
    </div>
  );
}

const CF_HUES = ["#c4b5fd", "#67e8f9", "#6ee7b7", "#fcd34d", "#fda4af", "#7dd3fc"];
const CF_PIECES = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    left: (i * 61 + 7) % 100,
    c: CF_HUES[i % CF_HUES.length],
    w: i % 3 === 0 ? 8 : 5,
    h: i % 4 === 0 ? 12 : 7,
    round: i % 4 === 0,
    dur: 6.4 + (i % 5) * 1.7,
    delay: -((i * 13) % 70) / 10,
    sway: (i % 7) - 3,
  }));

function ConfettiField() {
  const [tier, setTier] = useState<"lite" | "pro">("lite");
  const pieces = CF_PIECES(tier === "lite" ? 26 : 46);
  return (
    <div className="relative h-full w-full overflow-hidden bg-[radial-gradient(80%_90%_at_50%_110%,rgba(139,92,246,.16),transparent_60%),#0a0c13]">
      <div className="absolute inset-0">
        {pieces.map((p, i) => (
          <span key={`${tier}-${i}`} aria-hidden className="absolute" style={{ left: `${p.left}%`, top: "-14px", animation: `mf-cf-fall ${p.dur}s linear ${p.delay}s infinite`, ["--sw" as string]: `${p.sway * 18}px` }}>
            <span
              className="block"
              style={{
                width: p.w,
                height: p.h,
                background: p.c,
                borderRadius: p.round ? "99px" : "1px",
                animation: `mf-cf-spin ${p.dur / 2}s linear ${p.delay}s infinite`,
                boxShadow: `0 0 10px ${p.c}44`,
              }}
            />
          </span>
        ))}
      </div>
      <div className="absolute right-2 top-2 flex overflow-hidden rounded-md border border-white/10 bg-black/40 text-[8px] font-bold backdrop-blur">
        {(["lite", "pro"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTier(t)}
            aria-pressed={tier === t}
            className={`px-2 py-1 uppercase tracking-[0.12em] ${tier === t ? "bg-white/15 text-white" : "text-ink-faint hover:text-ink-dim"}`}
          >
            {t}
          </button>
        ))}
      </div>
      <style>{`@keyframes mf-cf-fall { 0% { top: -14px } 100% { top: 104% } }
@keyframes mf-cf-spin { from { transform: rotate(0) } to { transform: rotate(400deg) } }
@media (prefers-reduced-motion: reduce) { span[style*="mf-cf"] { animation: none !important; } }`}</style>
    </div>
  );
}

const BK_FAR = [
  { l: 12, t: 16, s: 90, c: "rgba(139,92,246,.5)", o: 0.7 },
  { l: 74, t: 8, s: 70, c: "rgba(34,211,238,.45)", o: 0.6 },
  { l: 44, t: 60, s: 120, c: "rgba(236,72,153,.34)", o: 0.5 },
  { l: 88, t: 62, s: 60, c: "rgba(52,211,153,.35)", o: 0.55 },
] as const;
const BK_MID = [
  { l: 30, t: 22, s: 54, c: "rgba(244,114,182,.6)", o: 0.8 },
  { l: 8, t: 64, s: 48, c: "rgba(56,189,248,.55)", o: 0.75 },
  { l: 60, t: 76, s: 64, c: "rgba(167,139,250,.5)", o: 0.7 },
] as const;
const BK_NEAR = [
  { l: 44, t: 40, s: 30, c: "rgba(255,255,255,.5)", o: 0.9 },
  { l: 24, t: 80, s: 26, c: "rgba(165,243,252,.55)", o: 0.85 },
  { l: 78, t: 32, s: 22, c: "rgba(254,215,170,.5)", o: 0.8 },
] as const;

function BokehDepthField() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#06070c]">
      <div className="absolute inset-0" style={{ background: "radial-gradient(60% 80% at 50% 0%, rgba(30,27,75,.9), transparent 70%)" }} />
      <div className="absolute inset-0" aria-hidden>
        {BK_FAR.map((o, i) => (
          <span key={`f${i}`} className="absolute rounded-full" style={{ left: `${o.l}%`, top: `${o.t}%`, width: o.s, height: o.s, background: `radial-gradient(circle at 35% 30%, ${o.c}, transparent 72%)`, filter: "blur(18px)", opacity: o.o, animation: `mf-bk-drift ${26 + i * 5}s ease-in-out ${-i * 4}s infinite alternate` }} />
        ))}
      </div>
      <div className="absolute inset-0" aria-hidden>
        {BK_MID.map((o, i) => (
          <span key={`m${i}`} className="absolute rounded-full" style={{ left: `${o.l}%`, top: `${o.t}%`, width: o.s, height: o.s, background: `radial-gradient(circle at 35% 30%, ${o.c}, transparent 70%)`, filter: "blur(10px)", opacity: o.o, animation: `mf-bk-drift ${16 + i * 4}s ease-in-out ${-i * 3}s infinite alternate` }} />
        ))}
      </div>
      <div className="absolute inset-0" aria-hidden>
        {BK_NEAR.map((o, i) => (
          <span key={`n${i}`} className="absolute rounded-full" style={{ left: `${o.l}%`, top: `${o.t}%`, width: o.s, height: o.s, background: `radial-gradient(circle at 35% 30%, ${o.c}, transparent 70%)`, filter: "blur(4px)", opacity: o.o, animation: `mf-bk-drift ${9 + i * 3}s ease-in-out ${-i * 2}s infinite alternate` }} />
        ))}
      </div>
      <style>{`@keyframes mf-bk-drift { from { transform: translate3d(0,0,0) scale(1) } to { transform: translate3d(26px,-18px,0) scale(1.18) } }
@media (prefers-reduced-motion: reduce) { .bk-only { animation: none } }`}</style>
    </div>
  );
}

function GlassShards() {
  const shards = Array.from({ length: 14 }, (_, i) => {
    const left = (i * 71 + 4) % 92;
    const top = (i * 43 + 6) % 78;
    const w = 46 + ((i * 29) % 62);
    const h = 24 + ((i * 17) % 44);
    const rot = ((i * 47) % 120) - 56;
    const tilt = (i % 2 ? 1 : -1) * (2 + (i % 4));
    return { left, top, w, h, rot, delay: -(i % 6) * 1.3, dur: 11 + (i % 5) * 2.4, tilt };
  });
  return (
    <div className="relative h-full w-full overflow-hidden bg-[radial-gradient(90%_100%_at_50%_-10%,#131a2e,transparent_55%),#0b0e16]">
      {shards.map((s, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.w,
            height: s.h,
            background: "linear-gradient(115deg, rgba(255,255,255,.22), rgba(255,255,255,.04) 42%, rgba(139,92,246,.16) 100%)",
            border: "1px solid rgba(255,255,255,.16)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.35), 0 10px 26px rgba(0,0,0,.35)",
            backdropFilter: "blur(7px)",
            transform: `rotate(${s.rot}deg)`,
            borderRadius: "4px",
            ["--dr" as string]: `${s.tilt * 9}px`,
            ["--dy" as string]: `${s.tilt * 6}px`,
            ["--r0" as string]: `${s.rot}deg`,
            ["--r1" as string]: `${(s.tilt * 0.9).toFixed(1)}deg`,
            animation: `mf-gs-float ${s.dur}s ease-in-out ${s.delay}s infinite alternate`,
          }}
        />
      ))}
      <span aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 40%, transparent 55%, rgba(4,6,10,.55))" }} />
      <style>{`@keyframes mf-gs-float { from { transform: rotate(var(--r0)) translate3d(0,0,0) } to { transform: rotate(var(--r1)) translate3d(var(--dr),var(--dy),0) } }
@media (prefers-reduced-motion: reduce) { .gs-anim { animation: none } }`}</style>
    </div>
  );
}

function LavaLampBlobs() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#07060f]">
      <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(80% 90% at 50% 120%, rgba(49,46,129,.9), transparent 60%)" }} />
      <div aria-hidden className="absolute -left-[8%] top-[6%] h-[55%] w-[55%] mix-blend-screen" style={{ background: "radial-gradient(circle at 42% 40%, #7c3aed 0%, #c026d3 45%, transparent 72%)", filter: "blur(34px)", animation: "mf-ll-a 11s ease-in-out infinite alternate" }} />
      <div aria-hidden className="absolute -right-[6%] bottom-[4%] h-[58%] w-[58%] mix-blend-screen" style={{ background: "radial-gradient(circle at 58% 60%, #f59e0b 0%, #ef4444 40%, transparent 70%)", filter: "blur(36px)", animation: "mf-ll-b 14s ease-in-out -5s infinite alternate" }} />
      <div aria-hidden className="absolute inset-0">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${18 + i * 16}%`,
              bottom: "-8%",
              width: 5 + (i % 2) * 3,
              height: 5 + (i % 2) * 3,
              background: i % 2 ? "rgba(251,191,36,.7)" : "rgba(192,132,252,.7)",
              filter: "blur(1px)",
              animation: `mf-ll-rise ${7 + (i % 3) * 2}s linear ${-i * 1.4}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`@keyframes mf-ll-a { 0% { border-radius: 58% 42% 55% 45% / 45% 60% 40% 55%; transform: translate3d(0,0,0) rotate(0deg) scale(1) }
  50% { border-radius: 45% 55% 38% 62% / 62% 42% 58% 40%; transform: translate3d(9%, -5%, 0) rotate(9deg) scale(1.14) }
  100% { border-radius: 60% 40% 62% 38% / 40% 58% 42% 62%; transform: translate3d(-4%, 6%, 0) rotate(-5deg) scale(.96) } }
@keyframes mf-ll-b { 0% { border-radius: 42% 58% 60% 40% / 55% 45% 62% 38%; transform: translate3d(0,0,0) rotate(0deg) scale(1) }
  50% { border-radius: 60% 40% 45% 55% / 40% 60% 38% 62%; transform: translate3d(-8%, -6%, 0) rotate(-10deg) scale(1.1) }
  100% { border-radius: 44% 56% 38% 62% / 58% 42% 60% 40%; transform: translate3d(5%, 5%, 0) rotate(7deg) scale(.95) } }
@keyframes mf-ll-rise { 0% { transform: translateY(0) scale(1); opacity: 0 } 12% { opacity: .8 } 100% { transform: translateY(-180px) scale(.6); opacity: 0 } }
@media (prefers-reduced-motion: reduce) { .ll-anim { animation: none } }`}</style>
    </div>
  );
}

function PaperGrain() {
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: "linear-gradient(165deg, #f6efe1 0%, #efdfc6 55%, #e8d3ae 100%)" }}>
      <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(90% 70% at 28% 18%, rgba(255,250,235,.9), transparent 60%), radial-gradient(80% 70% at 80% 90%, rgba(146,98,46,.18), transparent 62%)" }} />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='pg'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23pg)'/%3E%3C/svg%3E\")",
          backgroundSize: "220px 220px",
          mixBlendMode: "multiply",
          opacity: 0.4,
          animation: "mf-pg-jitter .5s steps(2) infinite",
        }}
      />
      <div aria-hidden className="absolute inset-0" style={{ boxShadow: "inset 0 0 90px rgba(112,74,32,.35)" }} />
      <style>{`@keyframes mf-pg-jitter { 0% { background-position: 0 0 } 25% { background-position: -2px 3px } 50% { background-position: 3px -1px } 75% { background-position: -1px -3px } 100% { background-position: 2px 2px } }
@media (prefers-reduced-motion: reduce) { .pg-anim { animation: none } }`}</style>
    </div>
  );
}

function silkWavePath(base: number, amp: number, phase: number): string {
  const pts: string[] = [];
  const tile = 800;
  for (let x = 0; x <= 1600; x += 8) {
    const y = base + amp * Math.sin((x * Math.PI * 2) / tile + phase);
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return `M0,${base} L${pts.join(" L")} L1600,300 L0,300 Z`;
}

function SilkWave() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#080a12]" style={{ ["--hue" as string]: "0deg" }}>
      <div aria-hidden className="absolute inset-0 mf-silk-hue">
        <div className="absolute inset-x-0 top-0 h-[38%] opacity-70" style={{ animation: "mf-sw-drift 26s linear infinite" }}>
          <svg viewBox="0 0 1600 120" preserveAspectRatio="none" className="h-full w-full">
            <path d={silkWavePath(58, 24, 0.4)} fill="url(#swg-violet)" />
          </svg>
        </div>
        <div className="absolute inset-x-0 top-[26%] h-[36%] opacity-80" style={{ animation: "mf-sw-drift 34s linear -11s infinite" }}>
          <svg viewBox="0 0 1600 120" preserveAspectRatio="none" className="h-full w-full">
            <path d={silkWavePath(62, 20, 2.1)} fill="url(#swg-cyan)" />
          </svg>
        </div>
        <div className="absolute inset-x-0 top-[52%] h-[44%] opacity-70" style={{ animation: "mf-sw-drift 22s linear -6s infinite" }}>
          <svg viewBox="0 0 1600 120" preserveAspectRatio="none" className="h-full w-full">
            <path d={silkWavePath(66, 18, 4.0)} fill="url(#swg-pink)" />
          </svg>
        </div>
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="swg-violet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(139,92,246,.6)" />
              <stop offset="100%" stopColor="rgba(139,92,246,0)" />
            </linearGradient>
            <linearGradient id="swg-cyan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(34,211,238,.55)" />
              <stop offset="100%" stopColor="rgba(34,211,238,0)" />
            </linearGradient>
            <linearGradient id="swg-pink" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(244,114,182,.45)" />
              <stop offset="100%" stopColor="rgba(244,114,182,0)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <style>{`@keyframes mf-sw-drift { from { transform: translateX(0) } to { transform: translateX(-50%) } }
@media (prefers-reduced-motion: no-preference) {
  .mf-silk-hue { animation: mf-sw-hue 30s ease-in-out infinite alternate; }
}
@keyframes mf-sw-hue { from { filter: hue-rotate(0deg) } to { filter: hue-rotate(48deg) } }
@media (prefers-reduced-motion: reduce) { .mf-silk-hue, .mf-silk-hue > div { animation: none !important; } }`}</style>
    </div>
  );
}

/* ---------------- backgrounds: batch #79-86 ---------------- */

function sfStar(seed: number, salt: number): number {
  const x = Math.sin(seed * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const SF_LAYERS = [
  { depth: 34, n: 60, size: 1, op: 0.34, blur: 0, cls: "bg-white" },
  { depth: 70, n: 40, size: 1.6, op: 0.6, blur: 0.5, cls: "bg-sky-200" },
  { depth: 120, n: 22, size: 2.2, op: 0.9, blur: 1, cls: "bg-cyan-100" },
] as const;

function StarFieldParallax() {
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  return (
    <div
      className="relative h-full w-full overflow-hidden bg-[radial-gradient(90%_110%_at_50%_120%,#101331,transparent_60%),#05060c]"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        layers.current.forEach((el, i) => {
          if (!el) return;
          const d = SF_LAYERS[i].depth;
          el.style.transform = `translate3d(${(x * d).toFixed(1)}px, ${(y * d * 0.7).toFixed(1)}px, 0)`;
        });
      }}
      onMouseLeave={() => {
        layers.current.forEach((el) => {
          if (el) el.style.transform = "translate3d(0,0,0)";
        });
      }}
    >
      {SF_LAYERS.map((l, li) => (
        <div
          key={li}
          ref={(el) => {
            layers.current[li] = el;
          }}
          aria-hidden
          className="absolute inset-0"
          style={{ transition: "transform .45s cubic-bezier(.22,.68,.32,1)", willChange: "transform" }}
        >
          {Array.from({ length: l.n }, (_, i) => {
            const left = sfStar(i, li + 1) * 100;
            const top = sfStar(i + 40, li + 9) * 100;
            return (
              <span
                key={i}
                className={`absolute rounded-full ${l.cls}`}
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: l.size,
                  height: l.size,
                  opacity: l.op * (0.55 + sfStar(i, li + 3) * 0.45),
                  filter: l.blur ? `blur(${l.blur}px)` : undefined,
                  animation: `mf-sf-tw ${2.4 + sfStar(i, li + 5) * 4}s ease-in-out ${sfStar(i, li + 7) * 3}s infinite alternate`,
                }}
              />
            );
          })}
        </div>
      ))}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16" style={{ background: "linear-gradient(0deg, rgba(6,8,16,.85), transparent)" }} aria-hidden />
      <style>{`@keyframes mf-sf-tw { from { opacity: .15 } to { opacity: 1 } }
@media (prefers-reduced-motion: reduce) { .sf-star { animation: none !important; } }`}</style>
    </div>
  );
}

function ScanlineCrt() {
  return (
    <div
      className="crt-scan relative h-full w-full overflow-hidden bg-[#07100d]"
      style={{
        backgroundImage:
          "radial-gradient(120% 90% at 50% 0%, rgba(74,222,128,.12), transparent 60%), radial-gradient(140% 120% at 50% 120%, rgba(16,185,129,.14), transparent 55%)",
      }}
    >
      <div aria-hidden className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,.34) 0 1px, transparent 1px 3px)" }} />
      <div aria-hidden className="absolute inset-0 opacity-[0.16]" style={{ backgroundImage: "linear-gradient(90deg, rgba(244,63,94,.5) 0 2px, transparent 2px 14px, rgba(56,189,248,.4) 14px 16px, transparent 16px 28px)", backgroundSize: "28px 100%", mixBlendMode: "screen" }} />
      <div aria-hidden className="crt-band absolute inset-x-0 h-10" style={{ background: "linear-gradient(180deg, transparent, rgba(134,239,172,.14), transparent)", animation: "mf-crt-band 7s linear infinite", boxShadow: "0 0 30px rgba(134,239,172,.2)" }} />
      <div aria-hidden className="absolute inset-0" style={{ boxShadow: "inset 0 0 70px rgba(0,0,0,.8), inset 0 0 14px rgba(0,0,0,.5)" }} />
      <style>{`@keyframes mf-crt-band { 0% { top: -12% } 100% { top: 112% } }
@keyframes mf-crt-flick { 0%,100% { opacity: 1 } 92% { opacity: 1 } 93% { opacity: .82 } 94% { opacity: 1 } 97% { opacity: .9 } }
.crt-scan { animation: mf-crt-flick 5s steps(1) infinite; }
@media (prefers-reduced-motion: reduce) { .crt-scan, .crt-band { animation: none } }`}</style>
    </div>
  );
}

function LiquidMesh() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#05060c]">
      <div aria-hidden className="absolute -inset-[30%]" style={{ background: "radial-gradient(38% 46% at 26% 30%, rgba(139,92,246,.5), transparent 70%), radial-gradient(32% 40% at 74% 24%, rgba(34,211,238,.42), transparent 70%), radial-gradient(40% 50% at 66% 78%, rgba(236,72,153,.38), transparent 72%), radial-gradient(34% 44% at 24% 82%, rgba(52,211,153,.34), transparent 72%)", backgroundSize: "160% 160%", filter: "blur(26px) saturate(1.2)", animation: "mf-lm-a 24s ease-in-out infinite alternate", mixBlendMode: "screen" }} />
      <div aria-hidden className="absolute -inset-[30%] opacity-70" style={{ background: "radial-gradient(30% 36% at 70% 34%, rgba(99,102,241,.4), transparent 68%), radial-gradient(26% 32% at 30% 66%, rgba(20,184,166,.32), transparent 70%)", backgroundSize: "140% 140%", filter: "blur(34px)", animation: "mf-lm-b 31s ease-in-out -9s infinite alternate", mixBlendMode: "screen" }} />
      <style>{`@keyframes mf-lm-a { from { background-position: 0% 0% } to { background-position: 100% 100% } }
@keyframes mf-lm-b { from { background-position: 100% 0% } to { background-position: 0% 100% } }
@media (prefers-reduced-motion: reduce) { .lm-move { animation: none } }`}</style>
    </div>
  );
}

function DotMatrix() {
  const [size, setSize] = useState(0);
  const [dim, setDim] = useState(false);
  const spacing = 9 + size * 3;
  const radius = 1 + size * 0.8;
  const alpha = dim ? 0.12 : 0.3;
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0b0d13]">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(rgba(226,232,240,${alpha}) ${radius.toFixed(1)}px, transparent ${(radius + 0.8).toFixed(1)}px)`,
          backgroundSize: `${spacing}px ${spacing}px`,
          maskImage: "radial-gradient(ellipse 75% 80% at 50% 42%, black 30%, transparent 92%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 80% at 50% 42%, black 30%, transparent 92%)",
        }}
      />
      <div className="absolute bottom-2 right-2 flex gap-1 overflow-hidden rounded-md border border-white/10 bg-black/40 text-[8px] font-bold backdrop-blur">
        <button type="button" onClick={() => setSize((v) => (v + 1) % 3)} className="px-2 py-1 text-white/80 hover:bg-white/10">
          {size === 0 ? "fine" : size === 1 ? "mid" : "bold"}
        </button>
        <button type="button" onClick={() => setDim((d) => !d)} aria-pressed={dim} className={`px-2 py-1 ${dim ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10"}`}>
          {dim ? "dim" : "bright"}
        </button>
      </div>
      <style>{`@media (prefers-reduced-motion: reduce) { .dm-anim { animation: none } }`}</style>
    </div>
  );
}

function BrushedMetal() {
  return (
    <div
      className="bm-sheen relative h-full w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(105deg, #20242e 0%, #171a21 30%, #262b36 52%, #14171d 74%, #1d212a 100%)",
      }}
    >
      <div aria-hidden className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(115deg, rgba(255,255,255,.028) 0 2px, transparent 2px 9px)", backgroundSize: "9px 100%" }} />
      <div aria-hidden className="bm-sweep absolute -inset-x-1/2 inset-y-0" style={{ background: "linear-gradient(115deg, transparent 34%, rgba(255,255,255,.09) 46%, rgba(255,255,255,.02) 52%, transparent 66%)", animation: "mf-bm-sweep 7.5s ease-in-out infinite alternate" }} />
      <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(60% 120% at 50% 0%, rgba(255,255,255,.1), transparent 55%), radial-gradient(70% 120% at 50% 100%, rgba(0,0,0,.4), transparent 60%)" }} />
      <style>{`@keyframes mf-bm-sweep { from { transform: translateX(-18%) } to { transform: translateX(18%) } }
@media (prefers-reduced-motion: reduce) { .bm-sweep { animation: none } }`}</style>
    </div>
  );
}

function CarbonFibre() {
  return (
    <div className="cf-tex relative h-full w-full overflow-hidden bg-[#0c0e13]">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(45deg, rgba(255,255,255,.05) 25%, transparent 25% 75%, rgba(255,255,255,.05) 75%), linear-gradient(45deg, rgba(255,255,255,.05) 25%, transparent 25% 75%, rgba(255,255,255,.05) 75%)",
          backgroundPosition: "0 0, 5px 5px",
          backgroundSize: "10px 10px",
        }}
      />
      <div aria-hidden className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(115deg, rgba(255,255,255,.018) 0 2px, transparent 2px 40px)", animation: "mf-cf-drift 26s linear infinite" }} />
      <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(90% 100% at 50% -20%, rgba(80,90,140,.16), transparent 55%), radial-gradient(70% 90% at 50% 120%, rgba(0,0,0,.6), transparent 60%)" }} />
      <style>{`@keyframes mf-cf-drift { from { background-position: 0 0 } to { background-position: 320px 0 } }
@media (prefers-reduced-motion: reduce) { .cf-tex > div { animation: none } }`}</style>
    </div>
  );
}

function WaterRipple() {
  const [rings, setRings] = useState<{ id: number; x: number; y: number; big: boolean }[]>([]);
  const seq = useRef(0);
  const timeouts = useRef<number[]>([]);
  useEffect(() => {
    const all = timeouts.current;
    return () => {
      all.forEach((t) => window.clearTimeout(t));
      all.length = 0;
    };
  }, []);
  const drop = (x: number, y: number, big: boolean) => {
    seq.current += 1;
    const id = seq.current;
    setRings((prev) => [...prev.slice(-10), { id, x, y, big }]);
    const t = window.setTimeout(() => {
      setRings((prev) => prev.filter((r) => r.id !== id));
    }, 2200);
    timeouts.current.push(t);
  };
  return (
    <div
      className="relative h-full w-full overflow-hidden bg-[radial-gradient(120%_100%_at_50%_0%,#0c2b33,transparent_60%),#06131a]"
      style={{
        backgroundImage:
          "radial-gradient(80% 60% at 50% 30%, rgba(34,211,238,.1), transparent 60%), linear-gradient(180deg, #071820 0%, #0a2631 52%, #07151c 100%)",
      }}
      onPointerDown={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        drop(e.clientX - r.left, e.clientY - r.top, true);
      }}
    >
      <div aria-hidden className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(180deg, rgba(125,211,252,.05) 0 1px, transparent 1px 9px)" }} />
      {rings.map((r) => (
        <span
          key={r.id}
          aria-hidden
          className="absolute rounded-full"
          style={{
            left: r.x,
            top: r.y,
            width: r.big ? 26 : 16,
            height: r.big ? 26 : 16,
            border: "1.5px solid rgba(125,211,252,.8)",
            boxShadow: "0 0 18px rgba(125,211,252,.35), inset 0 0 10px rgba(125,211,252,.15)",
            animation: r.big ? "mf-wr-ring 2s cubic-bezier(.2,.6,.35,1) forwards" : "mf-wr-ring 1.6s cubic-bezier(.2,.6,.35,1) forwards",
          }}
        />
      ))}
      <div aria-hidden className="absolute inset-x-0 bottom-0 top-1/2 opacity-40" style={{ background: "linear-gradient(180deg, transparent, rgba(2,10,14,.9))" }} />
      <style>{`@keyframes mf-wr-ring { 0% { transform: translate(-50%,-50%) scale(.08); opacity: .9 } 100% { transform: translate(-50%,-50%) scale(16); opacity: 0 } }
@media (prefers-reduced-motion: reduce) { .wr-drop { animation: none } }`}</style>
    </div>
  );
}

function InkBloom() {
  const [pulse, setPulse] = useState(false);
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: "linear-gradient(160deg, #f4ecd9 0%, #ecdfc4 60%, #e3d0ac 100%)" }}>
      <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(50% 40% at 30% 14%, rgba(255,252,240,.9), transparent 65%)" }} />
      <div aria-hidden className="absolute inset-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='ig'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23ig)' opacity='0.5'/%3E%3C/svg%3E\")", backgroundSize: "180px 180px", mixBlendMode: "multiply", opacity: 0.22 }} />
      <div aria-hidden className="absolute inset-0">
        <span className="absolute left-[34%] top-[36%] rounded-full" style={{ width: 190, height: 190, background: "radial-gradient(circle at 38% 32%, rgba(20,14,26,.95), rgba(38,28,48,.75) 38%, transparent 68%)", filter: "blur(2px)", animation: pulse ? "mf-ib-pulse 9s ease-in-out infinite alternate" : undefined }} />
        <span className="absolute left-[52%] top-[52%] rounded-full" style={{ width: 120, height: 120, background: "radial-gradient(circle at 40% 34%, rgba(20,14,26,.8), transparent 66%)", filter: "blur(3px)", opacity: 0.85, animation: pulse ? "mf-ib-pulse2 13s ease-in-out -5s infinite alternate" : undefined }} />
        <span className="absolute left-[16%] top-[66%] rounded-full" style={{ width: 60, height: 60, background: "radial-gradient(circle at 40% 34%, rgba(20,14,26,.55), transparent 70%)", filter: "blur(2px)", opacity: 0.7 }} />
      </div>
      <div aria-hidden className="absolute inset-0" style={{ boxShadow: "inset 0 0 80px rgba(96,60,18,.3)" }} />
      <button
        type="button"
        aria-pressed={pulse}
        onClick={() => setPulse((p) => !p)}
        className="absolute bottom-2 right-2 rounded-md border border-white/15 bg-black/20 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-ink-dim backdrop-blur hover:bg-black/30"
      >
        {pulse ? "✓ pulsing" : "pulse"}
      </button>
      <style>{`@keyframes mf-ib-pulse { 0% { transform: scale(1) translate(0,0); opacity: .9 } 50% { transform: scale(1.18) translate(-4%, -3%); opacity: 1 } 100% { transform: scale(.96) translate(2%, 2%) } }
@keyframes mf-ib-pulse2 { 0% { transform: scale(.9); opacity: .7 } 50% { transform: scale(1.24); opacity: .95 } 100% { transform: scale(1.02) }
@media (prefers-reduced-motion: reduce) { .ib-anim { animation: none } }`}</style>
    </div>
  );
}

/* ---------------- backgrounds: batch #87-95 (section 2 complete) ---------------- */

function auroraBandPath(base: number, amp: number, phase: number, len = 1600): string {
  const pts: string[] = [];
  for (let x = 0; x <= len; x += 10) {
    const y =
      base +
      Math.sin((x * Math.PI * 2) / 500 + phase) * amp * 0.5 +
      Math.sin((x * Math.PI * 2) / 240 + phase * 1.7) * amp * 0.5;
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return `M0,${base} L${pts.join(" L")} L${len},80 L0,80 Z`;
}

const AB_BANDS = [
  { top: "-8%", h: "34%", c1: "rgba(74,222,128,.4)", c2: "rgba(16,185,129,.08)", d: 20, a: 16, p: 0.4, bl: "16px", dur: 22, delay: 0 },
  { top: "6%", h: "30%", c1: "rgba(139,92,246,.42)", c2: "rgba(99,102,241,.1)", d: 26, a: 14, p: 2.1, bl: "14px", dur: 28, delay: -6 },
  { top: "24%", h: "30%", c1: "rgba(34,211,238,.38)", c2: "rgba(56,189,248,.08)", d: 22, a: 12, p: 3.8, bl: "12px", dur: 24, delay: -12 },
  { top: "46%", h: "34%", c1: "rgba(244,114,182,.26)", c2: "rgba(192,132,252,.06)", d: 18, a: 10, p: 5.1, bl: "18px", dur: 30, delay: -18 },
] as const;

function AuroraBand() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(180deg,#030509,#0a1128_55%,#0d1633)]">
      {[3, 11, 19, 27, 35].map((l, i) => (
        <span key={i} aria-hidden className="absolute rounded-full bg-white" style={{ left: `${(l * 17) % 96}%`, top: `${(i * 13) % 46}%`, width: 1.4, height: 1.4, opacity: 0.5, animation: `mf-ab-tw ${2 + i * 0.7}s ease-in-out ${i * 0.9}s infinite alternate` }} />
      ))}
      {AB_BANDS.map((b, i) => (
        <div key={i} aria-hidden className="absolute inset-x-0 overflow-hidden" style={{ top: b.top, height: b.h }}>
          <div style={{ width: "200%", height: "100%", animation: `mf-ab-drift ${b.dur}s linear ${b.delay}s infinite` }}>
            <svg viewBox="0 0 1600 80" preserveAspectRatio="none" style={{ width: "50%", height: "100%" }}>
              <defs>
                <linearGradient id={`abg${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={b.c1} />
                  <stop offset="100%" stopColor={b.c2} />
                </linearGradient>
              </defs>
              <path d={auroraBandPath(b.d, b.a, b.p)} fill={`url(#abg${i})`} />
            </svg>
            <svg viewBox="0 0 1600 80" preserveAspectRatio="none" style={{ width: "50%", height: "100%", marginLeft: "-4px" }}>
              <path d={auroraBandPath(b.d, b.a, b.p)} fill={`url(#abg${i})`} />
            </svg>
          </div>
        </div>
      ))}
      <style>{`@keyframes mf-ab-drift { from { transform: translateX(0) } to { transform: translateX(-50%) } }
@keyframes mf-ab-tw { from { opacity: .12 } to { opacity: .8 } }
@media (prefers-reduced-motion: reduce) { .ab-anim { animation: none } }`}</style>
    </div>
  );
}

function NoiseStorm() {
  const [flick, setFlick] = useState(true);
  return (
    <div className="ns-root relative h-full w-full overflow-hidden bg-[#0b0b0e]">
      <div aria-hidden className="absolute inset-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n1'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n1)' opacity='0.9'/%3E%3C/svg%3E\")", backgroundSize: "140px 140px", opacity: 0.05, animation: "mf-ns-a .16s steps(3) infinite", mixBlendMode: "screen" }} />
      <div aria-hidden className="absolute inset-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='190' height='190'%3E%3Cfilter id='n2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='190' height='190' filter='url(%23n2)' opacity='0.8'/%3E%3C/svg%3E\")", backgroundSize: "190px 190px", opacity: 0.04, animation: "mf-ns-b .3s steps(4) infinite", mixBlendMode: "screen" }} />
      <div aria-hidden className={`absolute inset-0 ${flick ? "ns-flick" : ""}`} style={{ background: "radial-gradient(120% 100% at 50% 40%, rgba(120,130,160,.1), transparent 60%)" }} />
      <button
        type="button"
        aria-pressed={flick}
        onClick={() => setFlick((f) => !f)}
        className="absolute bottom-2 right-2 rounded-md border border-white/10 bg-black/50 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.16em] text-white/70 backdrop-blur hover:bg-black/70"
      >
        {flick ? "flicker ✓" : "flicker"}
      </button>
      <style>{`@keyframes mf-ns-a { 0% { background-position: 0 0 } 50% { background-position: 42px -27px } 100% { background-position: -35px 33px } }
@keyframes mf-ns-b { 0% { background-position: 0 0 } 33% { background-position: -70px 24px } 66% { background-position: 50px -40px } 100% { background-position: 0 0 } }
@keyframes mf-ns-flick { 0%,100% { opacity: 1 } 3% { opacity: .55 } 6% { opacity: 1 } 40% { opacity: .8 } 43% { opacity: 1 } 80% { opacity: .7 } 83% { opacity: 1 } }
.ns-flick { animation: mf-ns-flick 2.4s steps(1) infinite; }
@media (prefers-reduced-motion: reduce) { .ns-root > div { animation: none } }`}</style>
    </div>
  );
}

function GlassDistortion() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#07090f]">
      <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(135deg,#120c24,#06202a 55%,#1a0e20)" }}>
        <span className="absolute rounded-full" style={{ left: "-10%", top: "6%", width: 180, height: 180, background: "radial-gradient(circle at 40% 35%, rgba(34,211,238,.8), transparent 68%)", filter: "blur(26px)", animation: "mf-gd-a 13s ease-in-out infinite alternate" }} />
        <span className="absolute rounded-full" style={{ right: "-8%", top: "34%", width: 150, height: 150, background: "radial-gradient(circle at 45% 40%, rgba(236,72,153,.75), transparent 66%)", filter: "blur(24px)", animation: "mf-gd-b 17s ease-in-out -6s infinite alternate" }} />
        <span className="absolute rounded-full" style={{ left: "28%", bottom: "-12%", width: 200, height: 200, background: "radial-gradient(circle at 40% 35%, rgba(250,204,21,.55), transparent 68%)", filter: "blur(30px)", animation: "mf-gd-a 20s ease-in-out -11s infinite alternate" }} />
      </div>
      <div aria-hidden className="absolute inset-y-0 left-[26%] w-[34%]" style={{ transform: "skewX(-8deg)", backdropFilter: "blur(9px) brightness(1.45) saturate(1.35)", background: "linear-gradient(115deg, rgba(255,255,255,.06), rgba(255,255,255,.01) 45%, rgba(255,255,255,.07))", borderRight: "1px solid rgba(255,255,255,.22)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.25), 18px 0 40px rgba(0,0,0,.25)", animation: "mf-gd-pane 15s ease-in-out infinite alternate" }} />
      <div aria-hidden className="absolute inset-y-0 left-[62%] w-[24%]" style={{ transform: "skewX(10deg)", backdropFilter: "blur(5px) brightness(1.3) saturate(1.2)", background: "linear-gradient(115deg, rgba(255,255,255,.05), transparent 50%, rgba(255,255,255,.04))", borderLeft: "1px solid rgba(255,255,255,.14)", boxShadow: "10px 0 30px rgba(0,0,0,.2)" }} />
      <style>{`@keyframes mf-gd-a { from { transform: translate3d(0,0,0) scale(1) } to { transform: translate3d(70px,34px,0) scale(1.25) } }
@keyframes mf-gd-b { from { transform: translate3d(0,0,0) scale(1.1) } to { transform: translate3d(-60px,-30px,0) scale(.9) } }
@keyframes mf-gd-pane { from { left: 20% } to { left: 36% } }
@media (prefers-reduced-motion: reduce) { .gd-anim { animation: none } }`}</style>
    </div>
  );
}

function EmberRise() {
  const embers = Array.from({ length: 26 }, (_, i) => {
    const h = Math.sin(i * 127.1 + 3) * 0.5 + 0.5;
    const v = Math.sin(i * 269.5 + 11) * 0.5 + 0.5;
    return {
      left: 12 + h * 76,
      dur: 5.4 + v * 4.6,
      delay: -v * 8,
      size: 1.6 + h * 2.4,
      hot: v > 0.82,
      late: h > 0.75,
    };
  });
  return (
    <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(180deg,#080503,#160a05_60%,#0b0604)]">
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-24" style={{ background: "radial-gradient(60% 100% at 50% 110%, rgba(255,120,30,.5), transparent 70%)", filter: "blur(10px)", animation: "mf-er-glow 2.2s ease-in-out infinite alternate" }} />
      {embers.map((e, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute rounded-full"
          style={{
            left: `${e.left}%`,
            top: "104%",
            width: e.size,
            height: e.size,
            background: e.hot ? "#fff7ed" : e.late ? "#fcd34d" : "#fb923c",
            boxShadow: e.hot ? "0 0 8px rgba(254,243,199,.9)" : "0 0 6px rgba(251,146,60,.8)",
            animation: `mf-er-rise ${e.dur}s linear ${e.delay}s infinite`,
          }}
        />
      ))}
      <style>{`@keyframes mf-er-rise { 0% { top: 104%; opacity: 0 } 8% { opacity: .95 } 92% { opacity: .7 } 100% { top: -6%; opacity: 0 } }
@keyframes mf-er-glow { from { opacity: .6; transform: scaleY(1) } to { opacity: 1; transform: scaleY(1.2) } }
@media (prefers-reduced-motion: reduce) { .er-anim { animation: none } }`}</style>
    </div>
  );
}

function CheckerboardFade() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#111318]">
      <div aria-hidden className="absolute inset-0" style={{ backgroundImage: "repeating-conic-gradient(rgba(230,235,245,.09) 0% 25%, transparent 0% 50%)", backgroundSize: "26px 26px", maskImage: "linear-gradient(135deg, #000 8%, transparent 74%)", WebkitMaskImage: "linear-gradient(135deg, #000 8%, transparent 74%)" }} />
      <div aria-hidden className="absolute inset-0" style={{ backgroundImage: "repeating-conic-gradient(rgba(230,235,245,.05) 0% 25%, transparent 0% 50%)", backgroundSize: "26px 26px", maskImage: "linear-gradient(-45deg, #000 4%, transparent 70%)", WebkitMaskImage: "linear-gradient(-45deg, #000 4%, transparent 70%)" }} />
      <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(250,204,21,.12), transparent 40%), radial-gradient(80% 90% at 78% 14%, rgba(34,211,238,.08), transparent 55%)" }} />
      <span aria-hidden className="absolute left-2 top-2 font-mono text-[8px] tracking-[0.2em] text-white/30">CHK 01 — 26px</span>
      <span aria-hidden className="absolute bottom-2 right-2 font-mono text-[8px] tracking-[0.2em] text-white/30">DIAG 135°</span>
      <style>{`@media (prefers-reduced-motion: reduce) { .ck-anim { animation: none } }`}</style>
    </div>
  );
}

function PlaidWeave() {
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: "#e9dcc3" }}>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent 0 38px, rgba(146,56,40,.55) 38px 50px, transparent 50px 142px, rgba(146,56,40,.3) 142px 152px, transparent 152px 236px, rgba(146,56,40,.5) 236px 246px, transparent 246px), linear-gradient(0deg, transparent 0 22px, rgba(44,84,74,.5) 22px 30px, transparent 30px 96px, rgba(44,84,74,.35) 96px 103px, transparent 103px 172px, rgba(146,56,40,.18) 172px 178px, transparent 178px), linear-gradient(90deg, rgba(146,56,40,.12) 0 4px, transparent 4px 8px), linear-gradient(0deg, rgba(44,84,74,.16) 0 3px, transparent 3px 6px)",
          backgroundSize: "256px 200px, 200px 200px, 8px 8px, 6px 6px",
        }}
      />
      <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(120% 100% at 50% 40%, transparent 55%, rgba(60,36,12,.28))" }} />
      <div aria-hidden className="absolute inset-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='pl'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23pl)' opacity='0.5'/%3E%3C/svg%3E\")", backgroundSize: "120px 120px", mixBlendMode: "multiply", opacity: 0.18 }} />
      <style>{`@media (prefers-reduced-motion: reduce) { .pl-anim { animation: none } }`}</style>
    </div>
  );
}

const HB_RINGS = (() => {
  const out: { r: number; dash: number; gap: number; rot: number }[] = [];
  let k = 1;
  while (true) {
    const r = 5 + 1.35 * k * k;
    if (r > 148) break;
    const C = 2 * Math.PI * r;
    const n = Math.max(8, Math.round(C / 16));
    out.push({ r: Math.round(r * 10) / 10, dash: Math.round((C / n) * 10) / 10, gap: Math.round((C / n) * 1.1 * 10) / 10, rot: (k * 37) % 360 });
    k += 1;
  }
  return out;
})();

function HalftoneBurst() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#f3ead6]">
      <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        {HB_RINGS.map((ring, i) => (
          <circle
            key={i}
            cx="160"
            cy="86"
            r={ring.r}
            fill="none"
            stroke="#26201c"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${ring.dash} ${ring.gap}`}
            opacity={0.85}
            transform={`rotate(${ring.rot} 160 86)`}
          />
        ))}
        <circle cx="160" cy="86" r="5" fill="#26201c" opacity="0.9" />
        <circle cx="160" cy="86" r="1.6" fill="#f3ead6" />
      </svg>
      <span aria-hidden className="absolute left-3 top-2 font-mono text-[8px] uppercase tracking-[0.22em] text-[#26201c]/50">poster plate · halftone burst</span>
      <style>{`@keyframes mf-hb-rot { to { transform: rotate(360deg) } }
@media (prefers-reduced-motion: reduce) { .hb-anim { animation: none } }`}</style>
    </div>
  );
}

const CD_BANDS = [
  { top: "14%", speed: 26, opacity: 0.5, scale: 1, blur: 10 },
  { top: "34%", speed: 34, opacity: 0.36, scale: 0.8, blur: 13 },
  { top: "56%", speed: 22, opacity: 0.28, scale: 1.15, blur: 16 },
] as const;

function CloudDrift() {
  const cloud = (i: number, s: number) => (
    <span key={i} aria-hidden className="absolute rounded-full" style={{ left: `${(i * 26 + (i % 3) * 7) % 90}%`, top: `${(i * 17) % 45}%`, width: 130 * s, height: 34 * s, background: "radial-gradient(ellipse 60% 50% at 40% 40%, rgba(235,245,255,.9), rgba(235,245,255,.15) 70%, transparent)" }} />
  );
  return (
    <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(180deg,#0b1222,#16233d_60%,#1d2f4d)]">
      <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(60% 40% at 30% 16%, rgba(148,197,255,.14), transparent 60%)" }} />
      <div className="absolute inset-0 overflow-hidden" style={{ maskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)" }}>
        {CD_BANDS.map((b, bi) => (
          <div key={bi} className="absolute inset-x-0 h-10" style={{ top: b.top, opacity: b.opacity, filter: `blur(${b.blur}px)` }}>
            <div className="relative flex h-full w-[200%]" style={{ animation: `mf-cd-drift ${b.speed}s linear infinite` }}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((c) => cloud(c, b.scale))}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((c) => cloud(c, b.scale))}
            </div>
          </div>
        ))}
      </div>
      <style>{`@keyframes mf-cd-drift { from { transform: translateX(0) } to { transform: translateX(-50%) } }
@media (prefers-reduced-motion: reduce) { .cd-anim { animation: none } }`}</style>
    </div>
  );
}

function SunsetHorizon() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, #151033 0%, #5b2566 42%, #b8405a 66%, #ff9a4a 86%, #ffd27a 100%)" }} />
      <span aria-hidden className="absolute rounded-full" style={{ left: "8%", top: "34%", width: 90, height: 90, background: "radial-gradient(circle, rgba(255,214,150,.7), transparent 70%)", filter: "blur(2px)", animation: "mf-sh-drift 34s ease-in-out infinite alternate" }} />
      <span aria-hidden className="absolute" style={{ left: "8%", top: "58%", width: 90, height: 90, background: "radial-gradient(circle at 50% 100%, rgba(255,120,40,.85), transparent 70%)", filter: "blur(6px)", animation: "mf-sh-drift 34s ease-in-out infinite alternate" }} />
      <div aria-hidden className="absolute inset-x-0 bottom-[14%] h-24 opacity-50" style={{ background: "repeating-linear-gradient(180deg, rgba(120,40,60,.5) 0 2px, transparent 2px 7px)", maskImage: "linear-gradient(180deg, transparent, #000 40%)", WebkitMaskImage: "linear-gradient(180deg, transparent, #000 40%)" }} />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-6 bg-[#1b0e12]" />
      <style>{`@keyframes mf-sh-drift { from { transform: translateX(0) } to { transform: translateX(150px) } }
@media (prefers-reduced-motion: reduce) { .sh-anim { animation: none } }`}</style>
    </div>
  );
}

/* ------------------------------ RENDERER ------------------------------ */





export /* -------------------- SECTION 17 · INTERACTIVE SCENES -------------------- */

/** Three scenes share one question: what does the interaction do when the
 *  reader has asked for less motion, or has no pointer? The stylesheet already
 *  kills keyframe animation for `prefers-reduced-motion`; a demo that moves
 *  elements with an inline transform has to ask for itself, which is what this
 *  hook is for. */
function useReducedMotion() {
  const [reduced, setReduced] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

const REORDER_SEED = [
  { id: "brief", label: "Write the brief", meta: "Today · Sam" },
  { id: "refs", label: "Collect three references", meta: "Tomorrow · you" },
  { id: "hero", label: "Build the hero", meta: "Thursday · Sam" },
  { id: "review", label: "Review in the studio", meta: "Friday · both" },
  { id: "ship", label: "Cut the release", meta: "Next week" },
];

function ReorderList() {
  const [rows, setRows] = useState(REORDER_SEED);
  const [dragging, setDragging] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [status, setStatus] = useState("Five steps. Drag a handle, or focus one and press the arrow keys.");
  const listRef = useRef<HTMLUListElement>(null);
  const topsRef = useRef<Map<string, number>>(new Map());
  const reduced = useReducedMotion();

  // offsetTop is used rather than getBoundingClientRect on purpose: it reports
  // the layout slot and ignores the transform a glide may be mid-way through,
  // so measuring during an animation does not poison the next one.
  const measure = () => {
    const list = listRef.current;
    if (!list) return;
    const next = new Map<string, number>();
    for (const el of Array.from(list.querySelectorAll<HTMLElement>("[data-row]"))) {
      next.set(el.dataset.row as string, el.offsetTop);
    }
    topsRef.current = next;
  };

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const before = topsRef.current;
    for (const el of Array.from(list.querySelectorAll<HTMLElement>("[data-row]"))) {
      const id = el.dataset.row as string;
      const was = before.get(id);
      if (was === undefined || id === dragging) continue;
      const dy = was - el.offsetTop;
      if (!dy) continue;
      el.style.transition = "none";
      el.style.transform = `translateY(${dy}px)`;
      requestAnimationFrame(() => {
        el.style.transition = reduced ? "none" : "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)";
        el.style.transform = "";
      });
    }
    measure();
  }, [rows, reduced, dragging]);

  const move = (id: string, to: number) => {
    const from = rows.findIndex((r) => r.id === id);
    const clamped = Math.max(0, Math.min(rows.length - 1, to));
    if (from === -1 || from === clamped) return;
    const next = [...rows];
    const [row] = next.splice(from, 1);
    next.splice(clamped, 0, row);
    setRows(next);
    setStatus(`${row.label} moved to position ${clamped + 1} of ${next.length}.`);
  };

  const onHandleKey = (e: React.KeyboardEvent, id: string, index: number) => {
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      move(id, index - 1);
    } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      move(id, index + 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      move(id, 0);
    } else if (e.key === "End") {
      e.preventDefault();
      move(id, rows.length - 1);
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(70%_90%_at_50%_0%,rgba(139,92,246,0.12),transparent_60%),#08090f] px-6 py-6">
      <div className="w-full max-w-md">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-violet-300/80">Release checklist</p>
          <p className="text-[10px] text-ink-faint">drag, or use the arrows</p>
        </div>
        <ul ref={listRef} className="space-y-2">
          {rows.map((row, index) => (
            <li
              key={row.id}
              data-row={row.id}
              draggable
              onDragStart={(e) => {
                setDragging(row.id);
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", row.id);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                if (dragging && dragging !== row.id) setOverId(row.id);
              }}
              onDrop={(e) => {
                e.preventDefault();
                const id = dragging ?? e.dataTransfer.getData("text/plain");
                if (id && id !== row.id) move(id, index);
                setDragging(null);
                setOverId(null);
              }}
              onDragEnd={() => {
                setDragging(null);
                setOverId(null);
              }}
              className={`flex items-center gap-3 rounded-2xl border bg-white/[.03] px-3 py-2.5 ${
                overId === row.id ? "border-violet-400/60" : "border-white/8"
              } ${dragging === row.id ? "opacity-60" : ""}`}
              style={{ willChange: "transform" }}
            >
              <span className="w-4 text-[10px] tabular-nums text-ink-faint">{index + 1}</span>
              <button
                type="button"
                aria-label={`Reorder ${row.label}. Arrow keys move it, Home and End send it to either end.`}
                onKeyDown={(e) => onHandleKey(e, row.id, index)}
                className="cursor-grab rounded-lg border border-white/10 p-1.5 text-ink-faint transition-colors hover:border-violet-400/50 hover:text-ink active:cursor-grabbing"
              >
                <svg width="10" height="14" viewBox="0 0 10 14" aria-hidden focusable="false">
                  {[2, 7, 12].map((cy) => (
                    <g key={cy}>
                      <circle cx="2.5" cy={cy} r="1.2" fill="currentColor" />
                      <circle cx="7.5" cy={cy} r="1.2" fill="currentColor" />
                    </g>
                  ))}
                </svg>
              </button>
              <span className="flex-1">
                <span className="block text-xs font-semibold text-ink">{row.label}</span>
                <span className="block text-[10px] text-ink-faint">{row.meta}</span>
              </span>
            </li>
          ))}
        </ul>
        <p aria-live="polite" className="mt-3 min-h-[1rem] text-[10px] leading-relaxed text-violet-200/80">
          {status}
        </p>
      </div>
    </div>
  );
}

const SWIPE_SEED = [
  { id: "hero", title: "Gradient hero", meta: "Landing · 3 references kept" },
  { id: "pricing", title: "Three-tier pricing", meta: "Landing · needs a copy pass" },
  { id: "changelog", title: "Changelog journal", meta: "Docs · reads well on mobile" },
  { id: "waitlist", title: "Waitlist band", meta: "Launch · one field, one button" },
  { id: "gallery", title: "Filterable gallery", meta: "Work · 12 stills placed" },
];

function SwipeDeck() {
  const [deck, setDeck] = useState(SWIPE_SEED);
  const [history, setHistory] = useState<{ id: string; kept: boolean }[]>([]);
  const [drag, setDrag] = useState<{ id: string; x: number } | null>(null);
  const [status, setStatus] = useState(`${SWIPE_SEED.length} cards in the deck. Swipe, or use the two buttons.`);
  const reduced = useReducedMotion();
  const startRef = useRef(0);

  const decide = (kept: boolean) => {
    const card = deck[0];
    if (!card) return;
    const next = deck.slice(1);
    setDeck(next);
    setHistory((h) => [...h, { id: card.id, kept }]);
    setDrag(null);
    setStatus(
      next.length === 0
        ? `${kept ? "Kept" : "Skipped"} ${card.title}. That was the last card — ${history.filter((h) => h.kept).length + (kept ? 1 : 0)} kept.`
        : `${kept ? "Kept" : "Skipped"} ${card.title}. ${next.length} left.`
    );
  };

  const undo = () => {
    const last = history[history.length - 1];
    if (!last) return;
    const card = SWIPE_SEED.find((c) => c.id === last.id);
    if (!card) return;
    setDeck((d) => [card, ...d.filter((c) => c.id !== card.id)]);
    setHistory((h) => h.slice(0, -1));
    setDrag(null);
    setStatus(`Undid the decision on ${card.title}.`);
  };

  const restart = () => {
    setDeck(SWIPE_SEED);
    setHistory([]);
    setDrag(null);
    setStatus("Deck reset. Five cards again.");
  };

  const kept = history.filter((h) => h.kept).length;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(70%_90%_at_50%_100%,rgba(56,189,248,0.12),transparent_60%),#08090f] px-6 py-6">
      <div className="w-full max-w-sm">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-300/80">Review deck</p>
          <p className="text-[10px] tabular-nums text-ink-faint">
            {kept} kept · {deck.length} left
          </p>
        </div>

        <div className="relative h-52">
          {deck.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/12 text-center">
              <p className="text-xs font-semibold text-ink">Deck finished</p>
              <p className="mt-1 text-[10px] text-ink-faint">Nothing left to decide. Undo one, or start again.</p>
            </div>
          )}
          {deck
            .slice(0, 3)
            .reverse()
            .map((card, i, all) => {
              const depth = all.length - 1 - i; // 0 = top card
              const top = depth === 0;
              const x = top && drag ? drag.x : 0;
              const tilt = reduced ? 0 : x / 18;
              return (
                <div
                  key={card.id}
                  aria-hidden={!top}
                  style={{
                    transform: `translate(${x}px, ${depth * 8}px) rotate(${tilt}deg) scale(${1 - depth * 0.04})`,
                    transition: drag && top ? "none" : reduced ? "none" : "transform 260ms cubic-bezier(0.22, 1, 0.36, 1)",
                    zIndex: 3 - depth,
                    touchAction: top ? "none" : undefined,
                  }}
                  className={`absolute inset-x-0 top-0 rounded-2xl border bg-panel p-4 ${
                    top ? "border-sky-400/30" : "border-white/8"
                  }`}
                  onPointerDown={(e) => {
                    if (!top) return;
                    startRef.current = e.clientX;
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setDrag({ id: card.id, x: 0 });
                  }}
                  onPointerMove={(e) => {
                    if (!top || !drag) return;
                    setDrag({ id: card.id, x: e.clientX - startRef.current });
                  }}
                  onPointerUp={() => {
                    if (!top) return;
                    if (drag && Math.abs(drag.x) > 90) decide(drag.x > 0);
                    else setDrag(null);
                  }}
                  onPointerCancel={() => setDrag(null)}
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-300/70">Card {history.length + depth + 1}</p>
                  <p className="mt-2 text-sm font-bold text-ink">{card.title}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-ink-dim">{card.meta}</p>
                  {top && drag && Math.abs(drag.x) > 90 && (
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-ink">
                      {drag.x > 0 ? "Release to keep" : "Release to skip"}
                    </p>
                  )}
                </div>
              );
            })}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button type="button" onClick={() => decide(false)} disabled={!deck.length} className="btn btn-ghost flex-1 !py-2 text-[11px] disabled:opacity-40">
            ← Skip
          </button>
          <button type="button" onClick={() => decide(true)} disabled={!deck.length} className="btn btn-primary flex-1 !py-2 text-[11px] disabled:opacity-40">
            Keep →
          </button>
          <button type="button" onClick={undo} disabled={!history.length} className="btn btn-ghost !px-3 !py-2 text-[11px] disabled:opacity-40">
            Undo
          </button>
          <button type="button" onClick={restart} className="btn btn-ghost !px-3 !py-2 text-[11px]">
            Reset
          </button>
        </div>
        <p aria-live="polite" className="mt-3 min-h-[1rem] text-[10px] leading-relaxed text-sky-200/80">
          {status}
        </p>
        {reduced && (
          <p className="mt-1 text-[10px] leading-relaxed text-ink-faint">
            Reduced motion is on: the cards move without rotation and without the spring back.
          </p>
        )}
      </div>
    </div>
  );
}

const SPLIT_LAYERS = [
  { id: "sky", label: "Sky gradient", colour: "#38bdf8" },
  { id: "grid", label: "Grid overlay", colour: "#a78bfa" },
  { id: "glow", label: "Corner glow", colour: "#f472b6" },
];

function SplitPane() {
  const [pct, setPct] = useState(42);
  const [on, setOn] = useState<string[]>(["sky", "grid"]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [resizing, setResizing] = useState(false);
  const reduced = useReducedMotion();
  const clamp = (n: number) => Math.max(20, Math.min(80, n));

  const setFromClientX = (clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPct(clamp(Math.round(((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(70%_90%_at_50%_0%,rgba(167,139,250,0.12),transparent_60%),#08090f] px-6 py-6">
      <div className="w-full max-w-lg">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-violet-300/80">Layer inspector</p>
          <p className="text-[10px] tabular-nums text-ink-faint">left pane {pct}% · drag the divider or press ← →</p>
        </div>

        <div ref={wrapRef} className="flex h-56 overflow-hidden rounded-2xl border border-white/10">
          <div className="overflow-hidden bg-white/[.02]" style={{ width: `${pct}%` }}>
            <ul className="space-y-1.5 p-3">
              {SPLIT_LAYERS.map((layer) => {
                const checked = on.includes(layer.id);
                return (
                  <li key={layer.id}>
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/8 bg-white/[.02] px-2.5 py-2 text-[11px]">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setOn((prev) => (checked ? prev.filter((id) => id !== layer.id) : [...prev, layer.id]))
                        }
                        className="accent-violet-400"
                      />
                      <span className="flex-1 text-ink-dim">{layer.label}</span>
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: layer.colour }} aria-hidden />
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>

          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize the two panels"
            aria-valuenow={pct}
            aria-valuemin={20}
            aria-valuemax={80}
            aria-valuetext={`Left panel ${pct} percent`}
            tabIndex={0}
            onKeyDown={(e) => {
              const step = e.shiftKey ? 10 : 2;
              if (e.key === "ArrowLeft") { e.preventDefault(); setPct((p) => clamp(p - step)); }
              else if (e.key === "ArrowRight") { e.preventDefault(); setPct((p) => clamp(p + step)); }
              else if (e.key === "Home") { e.preventDefault(); setPct(20); }
              else if (e.key === "End") { e.preventDefault(); setPct(80); }
              else if (e.key === "Enter") { e.preventDefault(); setPct(42); }
            }}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              setResizing(true);
              setFromClientX(e.clientX);
            }}
            onPointerMove={(e) => {
              if (resizing) setFromClientX(e.clientX);
            }}
            onPointerUp={() => setResizing(false)}
            onPointerCancel={() => setResizing(false)}
            onDoubleClick={() => setPct(42)}
            className={`w-2.5 shrink-0 cursor-col-resize border-x border-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400 ${
              resizing ? "bg-violet-400/40" : "bg-white/[.06] hover:bg-violet-400/25"
            }`}
          />

          <div className="flex-1 bg-[#0b0d14] p-3">
            <div className="relative h-full overflow-hidden rounded-xl border border-white/8">
              {on.includes("sky") && (
                <div
                  className="absolute inset-0"
                  style={{
                    background: "radial-gradient(60% 80% at 50% 0%, rgba(56,189,248,0.35), transparent 65%)",
                    transition: reduced ? "none" : "opacity 200ms ease",
                  }}
                />
              )}
              {on.includes("grid") && (
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px)",
                    backgroundSize: "18px 18px",
                    transition: reduced ? "none" : "opacity 200ms ease",
                  }}
                />
              )}
              {on.includes("glow") && (
                <div
                  className="absolute inset-0"
                  style={{
                    background: "radial-gradient(45% 55% at 100% 100%, rgba(244,114,182,0.5), transparent 70%)",
                    transition: reduced ? "none" : "opacity 200ms ease",
                  }}
                />
              )}
              <p className="absolute bottom-2 left-3 text-[10px] text-white/70">
                {on.length} of {SPLIT_LAYERS.length} layers visible
              </p>
            </div>
          </div>
        </div>

        <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
          The divider is a real <span className="font-mono">separator</span>: 20% to 80%, arrow keys for two points, shift for
          ten, Enter or a double-click back to the default. Both panes keep working at any size.
        </p>
      </div>
    </div>
  );
}

// Exported because the keys are the catalog's demo vocabulary, not a private
// detail: the props panel and the harness both want the same list.
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
  "reorder-list", "swipe-deck", "split-pane",
  "pagination-ellipsis", "toc-spine", "tabs-indicator", "sticky-subnav",
  "back-to-top", "disclosure-list", "fullscreen-overlay-menu", "skeleton-card",
  "status-banner", "progress-ring", "spinner-status", "empty-state-trio",
  "offline-indicator", "error-boundary-card", "confetti-burst",
  "dot-leader-loading", "live-region-demo", "liquid-button-hover", "magnetic-icon-row",
  "scroll-linked-hue-hero", "staggered-list-entrance", "shuffle-kenburns-gallery", "particle-trail-hero",
  "ink-stamp-appear", "gradient-border-flow", "ripple-reveal", "parallax-layered-scene",
  "scroll-vignette", "word-by-word-highlight", "shake-on-error-field", "bento-feature-grid",
  "logo-wall-hover-pop", "testimonial-marquee", "pricing-table-three", "stats-band",
  "team-grid-filter", "faq-two-column", "comparison-slider", "timeline-vertical",
  "newsletter-band-tiers", "hero-product-mock", "split-feature-rows", "case-study-header",
  "changelog-feed", "resource-download-cards", "event-schedule-list", "map-free-local-band",
  "app-screenshot-tour", "template-docs-site", "template-landing-saas", "template-waitlist",
  "template-changelog", "template-gallery",
  "topographic-contours", "blueprint-grid", "confetti-field", "bokeh-depth-field",
  "glass-shards", "lava-lamp-blobs", "paper-grain", "silk-wave",
  "star-field-parallax", "scanline-crt", "liquid-mesh", "dot-matrix",
  "brushed-metal", "carbon-fibre", "water-ripple", "ink-bloom",
  "aurora-band", "noise-storm", "glass-distortion", "ember-rise",
  "checkerboard-fade", "plaid-weave", "halftone-burst", "cloud-drift", "sunset-horizon",
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
    case "reorder-list": return <ReorderList />;
    case "swipe-deck": return <SwipeDeck />;
    case "split-pane": return <SplitPane />;
    case "breadcrumb-trail": return <BreadcrumbTrail />;
    case "pagination-ellipsis": return <PaginationEllipsis {...props} />;
    case "toc-spine": return <TocSpine />;
    case "tabs-indicator": return <TabsIndicator {...props} />;
    case "sticky-subnav": return <StickySubNav />;
    case "back-to-top": return <BackToTop />;
    case "disclosure-list": return <DisclosureList />;
    case "fullscreen-overlay-menu": return <FullscreenOverlayMenu />;
    case "skeleton-card": return <SkeletonCard {...props} />;
    case "status-banner": return <StatusBanner />;
    case "progress-ring": return <ProgressRing />;
    case "spinner-status": return <SpinnerStatus />;
    case "empty-state-trio": return <EmptyStateTrio />;
    case "offline-indicator": return <OfflineIndicator />;
    case "error-boundary-card": return <ErrorBoundaryCard {...props} />;
    case "confetti-burst": return <ConfettiBurst />;
    case "dot-leader-loading": return <DotLeaderLoading />;
    case "live-region-demo": return <LiveRegionDemo />;
    case "liquid-button-hover": return <LiquidButtonHover />;
    case "magnetic-icon-row": return <MagneticIconRow />;
    case "scroll-linked-hue-hero": return <ScrollLinkedHueHero />;
    case "staggered-list-entrance": return <StaggeredListEntrance />;
    case "shuffle-kenburns-gallery": return <ShuffleKenburnsGallery />;
    case "particle-trail-hero": return <ParticleTrailHero />;
    case "ink-stamp-appear": return <InkStampAppear />;
    case "gradient-border-flow": return <GradientBorderFlow />;
    case "ripple-reveal": return <RippleReveal />;
    case "parallax-layered-scene": return <ParallaxLayeredScene />;
    case "scroll-vignette": return <ScrollVignette />;
    case "word-by-word-highlight": return <WordHighlight />;
    case "shake-on-error-field": return <ShakeField />;
    case "bento-feature-grid": return <BentoFeatureGrid />;
    case "logo-wall-hover-pop": return <LogoWallHoverPop />;
    case "testimonial-marquee": return <TestimonialMarquee />;
    case "pricing-table-three": return <PricingTableThree />;
    case "stats-band": return <StatsBand />;
    case "team-grid-filter": return <TeamGridFilter />;
    case "faq-two-column": return <FaqTwoColumn />;
    case "comparison-slider": return <ComparisonSlider />;
    case "timeline-vertical": return <TimelineVertical />;
    case "newsletter-band-tiers": return <NewsletterBandTiers />;
    case "hero-product-mock": return <HeroProductMock />;
    case "split-feature-rows": return <SplitFeatureRows />;
    case "case-study-header": return <CaseStudyHeader />;
    case "changelog-feed": return <ChangelogFeed />;
    case "resource-download-cards": return <ResourceDownloadCards />;
    case "event-schedule-list": return <EventScheduleList />;
    case "map-free-local-band": return <MapFreeLocalBand />;
    case "app-screenshot-tour": return <AppScreenshotTour />;
    case "template-docs-site": return <TemplateDocsSite />;
    case "template-landing-saas": return <TemplateLandingSaas />;
    case "template-waitlist": return <TemplateWaitlist />;
    case "template-changelog": return <TemplateChangelogJournal />;
    case "template-gallery": return <TemplateGallery />;
    case "topographic-contours": return <TopographicContours />;
    case "blueprint-grid": return <BlueprintGrid />;
    case "confetti-field": return <ConfettiField />;
    case "bokeh-depth-field": return <BokehDepthField />;
    case "glass-shards": return <GlassShards />;
    case "lava-lamp-blobs": return <LavaLampBlobs />;
    case "paper-grain": return <PaperGrain />;
    case "silk-wave": return <SilkWave />;
    case "star-field-parallax": return <StarFieldParallax />;
    case "scanline-crt": return <ScanlineCrt />;
    case "liquid-mesh": return <LiquidMesh />;
    case "dot-matrix": return <DotMatrix />;
    case "brushed-metal": return <BrushedMetal />;
    case "carbon-fibre": return <CarbonFibre />;
    case "water-ripple": return <WaterRipple />;
    case "ink-bloom": return <InkBloom />;
    case "aurora-band": return <AuroraBand />;
    case "noise-storm": return <NoiseStorm />;
    case "glass-distortion": return <GlassDistortion />;
    case "ember-rise": return <EmberRise />;
    case "checkerboard-fade": return <CheckerboardFade />;
    case "plaid-weave": return <PlaidWeave />;
    case "halftone-burst": return <HalftoneBurst />;
    case "cloud-drift": return <CloudDrift />;
    case "sunset-horizon": return <SunsetHorizon />;
    default: return null;
  }
}

