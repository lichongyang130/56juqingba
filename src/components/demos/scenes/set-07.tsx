"use client";

// Scene set 7 of 7 — TEXTURE AND ATMOSPHERE FIELDS.
//
// Loaded on demand: a page that renders one demo downloads the set that
// holds it (plus the shared kit), not the other 181 scenes. The registry in
// ../Demo.tsx is the only thing that knows where each key lives.
import { useEffect, useRef, useState } from "react";
import { COMPONENTS } from "@/lib/data";

export function TemplateGallery() {
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


export function TopographicContours() {
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


export function BlueprintGrid() {
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


export function ConfettiField() {
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


export function BokehDepthField() {
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


export function GlassShards() {
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


export function LavaLampBlobs() {
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


export function PaperGrain() {
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


export function SilkWave() {
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


export function StarFieldParallax() {
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


export function ScanlineCrt() {
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


export function LiquidMesh() {
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


export function DotMatrix() {
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


export function BrushedMetal() {
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


export function CarbonFibre() {
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


export function WaterRipple() {
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


export function InkBloom() {
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


export function AuroraBand() {
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


export function NoiseStorm() {
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


export function GlassDistortion() {
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


export function EmberRise() {
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


export function CheckerboardFade() {
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


export function PlaidWeave() {
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


export function HalftoneBurst() {
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


export function CloudDrift() {
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


export function SunsetHorizon() {
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

