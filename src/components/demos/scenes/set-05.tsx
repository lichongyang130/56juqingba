"use client";

// Scene set 5 of 7 — MARKETING SECTIONS AND CONTENT BLOCKS.
//
// Loaded on demand: a page that renders one demo downloads the set that
// holds it (plus the shared kit), not the other 192 scenes. The registry in
// ../Demo.tsx is the only thing that knows where each key lives.
import { useEffect, useRef, useState } from "react";
import { useSceneMotion } from "../scene-kit";
import { COMPONENTS, PROMPTS } from "@/lib/data";

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


export function ShuffleKenburnsGallery() {
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


export function ParticleTrailHero() {
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


export function InkStampAppear() {
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


export function GradientBorderFlow() {
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


export function RippleReveal() {
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


export function ParallaxLayeredScene() {
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


export function ScrollVignette() {
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
                <div className="text-sm font-black tracking-tight text-white" data-demo-heading="h3">{t}</div>
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


export function WordHighlight() {
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


export function ShakeField() {
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


export function BentoFeatureGrid() {
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


export function LogoWallHoverPop() {
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


export function TestimonialMarquee() {
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


export function PricingTableThree() {
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

// #511 — this scene used to announce "motif by the numbers" over four figures
// that did not exist: 128 assets (the catalog has 133), a 4.2k-star launch week
// nobody recorded, "300+ teams", and a 1.9s demo load that was never measured.
// Every figure below is now read from the catalog, and the notes say what each
// one actually is.

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round(((s[m - 1] + s[m]) / 2) * 10) / 10;
};

const STATS_TARGETS = [
  COMPONENTS.length,
  median(COMPONENTS.map((c) => c.a11yScore)),
  PROMPTS.reduce((n, p) => n + p.runs.length, 0),
  median(COMPONENTS.map((c) => c.bundleKb)),
];

const STATS_ROWS = [
  { label: "original assets", note: "every one with a published audit", suffix: "" },
  { label: "a11y score median", note: "editorial audit, bands on /quality", suffix: "" },
  { label: "recorded prompt runs", note: "run logs kept, failures included", suffix: "" },
  { label: "KB median asset size", note: "read from the catalog", suffix: "" },
];


export function StatsBand() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [vals, setVals] = useState<number[]>([0, 0, 0, 0]);
  // #30 — count-up on view, driven by rAF. Reduced: the final numbers are
  // printed straight away, no roll.
  const { reduced } = useSceneMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) return;
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
  }, [reduced]);
  useEffect(() => {
    if (!started) return;
    if (reduced) return;
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
  }, [started, reduced]);
  const shown = reduced ? STATS_TARGETS : vals;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#0a0c13] px-6">
      <div ref={ref} className="w-full max-w-md rounded-2xl border border-white/8 bg-white/3 px-5 py-6">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.24em] text-ink-faint">motif by the numbers</p>
        <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5">
          {STATS_ROWS.map((r, i) => (
            <div key={r.label}>
              <p className="font-mono text-2xl font-black tracking-tight text-white">
                {shown[i]}
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


export function TeamGridFilter() {
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

