"use client";

// Theme Studio — Section 10 batch 43 additions (closing 20/20 bullets):
// semantic token map, motion tokens, spacing scale explorer, iconography
// token set, theme API preview and the reset-theme escape hatch. Every
// count is computed from live catalog data; motion/spacing/icon exports are
// clearly a sample contract (Motif's real tokens live in globals.css).

import { useEffect, useRef, useState } from "react";
import { accentHue, COMPONENTS, PROMPTS } from "@/lib/data";
import {
  DEFAULT_TOKENS,
  hexToHsl,
  hsl,
  REAL_AMBER,
  REAL_CYAN,
  REAL_DANGER,
  REAL_MINT,
  REAL_VIOLET,
  studioSurfaces,
  type Tokens,
} from "@/lib/studio-utils";

const hueLane = (anchor: number) =>
  COMPONENTS.filter((c) => {
    const d = Math.abs((((accentHue(c.slug) - anchor) % 360) + 360) % 360);
    return Math.min(d, 360 - d) <= 24;
  }).length;

/* ===================================================================
   #314 — Semantic token map (colour → role, live usage counts)
   =================================================================== */

export function SemanticMapPanel() {
  const promptMint = PROMPTS.filter((p) => p.avgFidelity >= 90).length;
  const promptAmber = PROMPTS.filter((p) => p.avgFidelity >= 85 && p.avgFidelity < 90).length;
  const promptDanger = PROMPTS.filter((p) => p.avgFidelity < 85).length;

  const rows = [
    {
      token: "--color-accent",
      name: "Action",
      hex: REAL_VIOLET,
      meaning: "buttons, links, focus rings, selection",
      usage: hueLane(258),
      how: "assets whose accent fingerprint lands within 24° of violet (258°)",
    },
    {
      token: "--color-accent-2",
      name: "Inform",
      hex: REAL_CYAN,
      meaning: "code accents, keyboard hints, diff headers",
      usage: hueLane(188),
      how: "assets whose accent fingerprint lands within 24° of cyan (188°)",
    },
    {
      token: "--color-mint",
      name: "Confirm",
      hex: REAL_MINT,
      meaning: "verified badges, passing fidelity scores",
      usage: promptMint,
      how: "prompts with avg fidelity ≥ 90 — the mint score chip",
    },
    {
      token: "--color-amber",
      name: "Caution",
      hex: REAL_AMBER,
      meaning: "featured prompts, mid-band fidelity scores",
      usage: promptAmber,
      how: "prompts with avg fidelity 85–89 — the amber score chip",
    },
    {
      token: "--color-danger",
      name: "Danger",
      hex: REAL_DANGER,
      meaning: "failing builds, sub-85 fidelity",
      usage: promptDanger,
      how: "prompts with avg fidelity below 85 — the rose score chip",
    },
  ];

  return (
    <div className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Semantic token map</p>
          <p className="mt-1 text-xs text-ink-dim">Every role colour in one lane — with live usage counts from the catalog, not stored numbers.</p>
        </div>
        <span className="chip !text-[10px]">colour → role</span>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-y-2 text-left">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-ink-faint">
              <th className="px-2">Token</th>
              <th className="px-2">Role</th>
              <th className="px-2">Means</th>
              <th className="px-2 text-right">Usage</th>
              <th className="px-2 text-right">How counted</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const h = hexToHsl(r.hex);
              return (
                <tr key={r.token} className="rounded-2xl bg-white/[.02]">
                  <td className="rounded-l-2xl px-2 py-3">
                    <span className="flex items-center gap-2 font-mono text-[10px] text-ink-dim">
                      <span className="h-4 w-4 shrink-0 rounded-md border border-white/20" style={{ background: r.hex }} />
                      {r.token}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-xs font-extrabold">{r.name}</td>
                  <td className="px-2 py-3 text-[11px] leading-snug text-ink-dim">{r.meaning}</td>
                  <td className="px-2 py-3 text-right">
                    <span className="font-mono text-sm font-extrabold" style={{ color: hsl(h.h, h.s, Math.min(70, h.l + 8)) }}>
                      {r.usage}
                    </span>
                  </td>
                  <td className="max-w-[240px] rounded-r-2xl px-2 py-3 text-[10px] leading-snug text-ink-faint">{r.how}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-ink-faint">
        Lane counts reuse the per-asset hue fingerprints; score counts reuse the same bands as the prompt cards&apos;
        fidelity chips — so the numbers on this map match numbers you can verify on the catalog pages.
      </p>
    </div>
  );
}

/* ===================================================================
   #315 — Motion tokens (durations + easings with a live preview)
   =================================================================== */

const DURATIONS = [
  { name: "instant", ms: 80 },
  { name: "fast", ms: 150 },
  { name: "base", ms: 250 },
  { name: "calm", ms: 400 },
  { name: "deliberate", ms: 700 },
  { name: "ambient", ms: 1200 },
];

const EASINGS = [
  { id: "linear", label: "Linear", value: "linear" },
  { id: "snap", label: "Snap · fast out", value: "cubic-bezier(0, 0, 0.2, 1)" },
  { id: "pop", label: "Pop · spring-ish", value: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
  { id: "glide", label: "Glide · strong decel", value: "cubic-bezier(0.22, 1, 0.36, 1)" },
];

const LIVE_SCENE_TOKENS = [
  { name: "--animate-marquee", value: "42s linear" },
  { name: "--animate-aurora", value: "16s ease-in-out" },
  { name: "--animate-drift", value: "14s ease-in-out" },
  { name: "--animate-pulse-soft", value: "3.2s ease-in-out" },
  { name: "--animate-float", value: "7s ease-in-out" },
];

export function MotionPanel({ tokens }: { tokens: Tokens }) {
  const [ms, setMs] = useState(250);
  const [ease, setEase] = useState(EASINGS[2]);
  const trackRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<Animation | null>(null);

  useEffect(() => () => animRef.current?.cancel(), []);

  const play = () => {
    const track = trackRef.current;
    const dot = dotRef.current;
    if (!track || !dot) return;
    animRef.current?.cancel();
    const dx = track.clientWidth - dot.clientWidth;
    animRef.current = dot.animate(
      [{ transform: "translateX(0)" }, { transform: `translateX(${dx}px)` }],
      { duration: ms, easing: ease.value, direction: "alternate", iterations: 2, fill: "both" }
    );
  };

  return (
    <div className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Motion tokens</p>
          <p className="mt-1 text-xs text-ink-dim">Name a duration and an easing, feel them on a real dot, read the token line.</p>
        </div>
        <span className="chip !text-[10px]">sample token set</span>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Duration</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {DURATIONS.map((d) => (
              <button
                key={d.name}
                type="button"
                onClick={() => setMs(d.ms)}
                className={`chip !cursor-pointer ${ms === d.ms ? "!border-violet-300/50 !text-ink" : ""}`}
              >
                {d.name} · {d.ms}ms
              </button>
            ))}
          </div>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-ink-faint">Easing</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {EASINGS.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => setEase(e)}
                className={`chip !cursor-pointer font-mono ${ease.id === e.id ? "!border-violet-300/50 !text-ink" : ""}`}
              >
                {e.label}
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-white/8 bg-[#07090f] p-3">
            <p className="font-mono text-[11px] leading-relaxed text-ink-dim">
              --duration-base: <span className="text-emerald-300">{ms}ms</span>;
              <br />
              --ease-{ease.id}: <span className="text-emerald-300">{ease.value}</span>;
            </p>
          </div>
          <button type="button" onClick={play} className="btn btn-primary !px-4 !py-2 text-xs">
            ▶ Play preview
          </button>
          <p className="mt-2 text-[10px] text-ink-faint">Dot travels the track twice (out and back) at the chosen duration and easing.</p>
        </div>

        <div>
          <div className="rounded-2xl border border-white/8 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Preview track</p>
            <div ref={trackRef} className="relative mt-3 h-6 w-full overflow-hidden rounded-full border border-white/10 bg-white/[.03]">
              <div
                ref={dotRef}
                className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full"
                style={{ background: hsl(tokens.hue, tokens.sat, 62), boxShadow: `0 0 16px ${hsl(tokens.hue, tokens.sat, 62, 0.7)}` }}
              />
            </div>
            <p className="mt-2 text-[10px] text-ink-faint">
              Dot uses the active accent — motion tokens stay theme-independent by design.
            </p>
          </div>
          <div className="mt-3 rounded-2xl border border-white/8 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Already live in the catalog scenes</p>
            <div className="mt-2 space-y-1.5">
              {LIVE_SCENE_TOKENS.map((t) => (
                <div key={t.name} className="flex items-center justify-between gap-3 text-[10px]">
                  <span className="font-mono text-ink-dim">{t.name}</span>
                  <span className="font-mono text-emerald-300/90">{t.value}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 border-t border-white/6 pt-2 text-[10px] leading-relaxed text-ink-faint">
              Read straight from <code className="font-mono">globals.css</code>. Under{" "}
              <code className="font-mono">prefers-reduced-motion</code> all of them collapse to their end state —
              these manual previews are the only place they run on demand.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================================================================
   #316 — Spacing scale explorer (4/8 rhythm with rulers)
   =================================================================== */

const SPACES = [
  { name: "space-1", px: 4, rem: "0.25", use: "inline icon gap · table inset" },
  { name: "space-2", px: 8, rem: "0.5", use: "chip padding · control gaps" },
  { name: "space-3", px: 12, rem: "0.75", use: "input inner padding" },
  { name: "space-4", px: 16, rem: "1", use: "card padding · field gaps" },
  { name: "space-5", px: 24, rem: "1.5", use: "section inner padding" },
  { name: "space-6", px: 32, rem: "2", use: "panel gutters" },
  { name: "space-8", px: 48, rem: "3", use: "page section rhythm" },
  { name: "space-10", px: 64, rem: "4", use: "hero · landing gaps" },
];

export function SpacingPanel() {
  const [sel, setSel] = useState(16);
  const s = SPACES.find((x) => x.px === sel) ?? SPACES[3];

  return (
    <div className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Spacing scale explorer</p>
          <p className="mt-1 text-xs text-ink-dim">A 4-px base with every 8-px step reinforced — pick a token, see its ruler and effect.</p>
        </div>
        <span className="chip !text-[10px]">4/8 rhythm</span>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div>
          <div className="space-y-1.5">
            {SPACES.map((x) => (
              <button
                key={x.name}
                type="button"
                onClick={() => setSel(x.px)}
                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors ${
                  sel === x.px ? "border-violet-300/45 bg-white/[.05]" : "border-white/8 bg-white/[.02] hover:border-white/18"
                }`}
              >
                <span className="w-16 shrink-0 font-mono text-[10px] text-ink-dim">{x.name}</span>
                <span className="h-2.5 rounded-full" style={{ width: Math.max(8, (x.px / 64) * 100), background: sel === x.px ? hsl(262, 82, 70) : "rgba(255,255,255,0.22)" }} />
                <span className="ml-auto shrink-0 font-mono text-[10px] text-ink-faint">
                  {x.px}px · {x.rem}rem
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/[.02] p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">
            Live effect · {s.name} = {s.px}px
          </p>
          <div className="mt-3 rounded-xl border border-white/10" style={{ padding: `${s.px}px`, background: "rgba(255,255,255,0.03)" }}>
            <div className="flex" style={{ gap: `${s.px}px` }}>
              {["chip", "chip", "chip"].map((c, i) => (
                <span key={i} className="rounded-full border border-white/12 bg-white/[.04] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-ink-dim">
                  {c} {i + 1}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-2 text-[10px] text-ink-faint">Padding and chip gaps both read {s.px}px above — one token drives rhythm.</p>

          <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-ink-faint">Ruler · tick at every step, 0 → 64px</p>
          <div className="relative mt-3 h-16 w-full rounded-xl border border-white/8 bg-white/[.02]">
            {/* baseline band */}
            <div className="absolute inset-x-0 bottom-7 h-6 border-b border-white/15">
              {SPACES.map((x, i) => {
                const prev = i === 0 ? 0 : SPACES[i - 1].px;
                const delta = x.px - prev;
                return (
                  <span
                    key={x.name}
                    className="absolute bottom-0 border-l border-white/20"
                    style={{ left: `${(prev / 64) * 100}%`, width: `${(delta / 64) * 100}%`, height: delta >= 16 ? "100%" : delta >= 8 ? "64%" : "40%" }}
                  />
                );
              })}
            </div>
            {/* tick labels */}
            {SPACES.map((x) => (
              <span
                key={x.name}
                className="absolute -translate-x-1/2 font-mono text-[8px] text-ink-faint"
                style={{ left: `${(x.px / 64) * 100}%`, bottom: 2 }}
              >
                {x.px}
              </span>
            ))}
            {/* selected marker */}
            <span
              className="absolute bottom-0 top-0 w-0.5 -translate-x-1/2 rounded-full"
              style={{ left: `${(s.px / 64) * 100}%`, background: hsl(262, 82, 62), boxShadow: `0 0 12px ${hsl(262, 82, 62, 0.9)}` }}
            />
            <span
              className="absolute top-0 -translate-x-1/2 rounded-full border px-1.5 font-mono text-[8px] font-bold"
              style={{ left: `${(s.px / 64) * 100}%`, borderColor: hsl(262, 82, 62, 0.6), color: hsl(262, 82, 70) }}
            >
              {s.px}px
            </span>
          </div>
          <p className="mt-2 text-[10px] text-ink-faint">
            Columns show the step from the previous token — 4s grow to 8s to 16s — so the rhythm is visible, not just the
            endpoint values. Selected token pinned at its real position on the 0–64px axis.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ===================================================================
   #317 — Iconography token set (stroke + corner controls)
   =================================================================== */

const ICON_PATHS = [
  { id: "check", label: "Check", d: "M5 12.5l4.5 4.5L19 7.5" },
  { id: "chevron", label: "Chevron", d: "M9.5 6.5l5 5.5-5 5.5" },
  { id: "search", label: "Search", d: "M11 11m-6.5 0a6.5 6.5 0 1 0 13 0a6.5 6.5 0 1 0-13 0M20 20l-4.4-4.4", circle: true },
  { id: "menu", label: "Menu", d: "M4 7h16M4 12h16M4 17h10" },
  { id: "star", label: "Star", d: "M12 4l2.35 4.9 5.3.7-3.9 3.7.95 5.2L12 16l-4.7 2.5.95-5.2-3.9-3.7 5.3-.7z" },
  { id: "close", label: "Close", d: "M6 6l12 12M18 6L6 18" },
  { id: "copy", label: "Copy", d: "M9 9h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2z", sub: "M15 9V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3" },
  { id: "heart", label: "Heart", d: "M12 20s-7-4.4-7-9.6A4.4 4.4 0 0 1 12 6.9 4.4 4.4 0 0 1 19 10.4C19 15.6 12 20 12 20z" },
];

export function IconPanel({ tokens }: { tokens: Tokens }) {
  const [stroke, setStroke] = useState(1.75);
  const [cornerPx, setCornerPx] = useState(8);
  const ink = studioSurfaces(tokens.mode).ink;

  return (
    <div className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Iconography token set</p>
          <p className="mt-1 text-xs text-ink-dim">Two sliders re-cut the whole set — stroke weight and container corner radius.</p>
        </div>
        <span className="chip !text-[10px]">stroke · corner</span>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-white/8 bg-white/[.02] p-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-ink-faint">Stroke weight</label>
                <span className="font-mono">{stroke.toFixed(2)}px</span>
              </div>
              <input type="range" min={1} max={2.5} step={0.25} value={stroke} onChange={(e) => setStroke(Number(e.target.value))} className="mt-2 w-full" aria-label="Stroke weight" style={{ accentColor: hsl(tokens.hue, tokens.sat, 60) }} />
            </div>
            <div>
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-ink-faint">Container corner</label>
                <span className="font-mono">{cornerPx}px</span>
              </div>
              <input type="range" min={0} max={16} value={cornerPx} onChange={(e) => setCornerPx(Number(e.target.value))} className="mt-2 w-full" aria-label="Corner radius" style={{ accentColor: hsl(tokens.hue, tokens.sat, 60) }} />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2.5">
            {ICON_PATHS.map((icon) => (
              <div key={icon.id} className="group flex flex-col items-center gap-1.5">
                <span className="flex h-11 w-11 items-center justify-center border" style={{ borderRadius: cornerPx, borderColor: "rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.03)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ink} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {icon.circle ? <circle cx="11" cy="11" r="6.5" /> : null}
                    {icon.sub ? <path d={icon.sub} /> : null}
                    <path d={icon.d} />
                  </svg>
                </span>
                <span className="text-[8px] uppercase tracking-wider text-ink-faint">{icon.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
            The set re-renders live at both slider values — optical consistency, not per-icon tweaking. Stroke uses round
            caps/joins; the corner token shapes the containers, chips and badges icons sit in.
          </p>
        </div>

        <div className="rounded-2xl border border-white/8 bg-[#07090f] p-5">
          <p className="font-mono text-[11px] leading-relaxed text-ink-dim">
            <span className="text-ink-faint">{"/* iconography tokens (sample contract) */"}</span>
            <br />
            --icon-stroke: <span className="text-emerald-300">{stroke.toFixed(2)}px</span>;
            <br />
            --icon-corner: <span className="text-emerald-300">{cornerPx}px</span>;
            <br />
            --icon-size-sm: 16px; <span className="text-ink-faint">{"/* inline, rows */"}</span>
            <br />
            --icon-size-md: 20px; <span className="text-ink-faint">{"/* default */"}</span>
            <br />
            --icon-size-lg: 28px; <span className="text-ink-faint">{"/* empty states, feature */"}</span>
          </p>
          <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
            Size tokens are the fixed steps this demo renders at; the two live sliders preview how stroke and corner
            propagate across the whole set before you lock them into your CSS.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ===================================================================
   #318 — Theme API preview (proposed JSON shape, not built)
   =================================================================== */

const API_JSON = `POST /api/studio/themes          (proposed — not built yet)

REQUEST
{
  "tokens": { "hue": 262, "sat": 82, "radius": 12, "mode": "dark" }
}

RESPONSE
{
  "theme": {
    "id": "th_violet_dark_v1",
    "tokens": { "hue": 262, "sat": 82, "radius": 12, "mode": "dark" },
    "derived": {
      "accent": "hsl(262 82% 62%)",
      "accentStrong": "hsl(262 88% 54%)",
      "radiusSm": 8,
      "radiusLg": 18
    },
    "preview": {
      "wcag": { "buttonLabel": 4.57, "linkOnPanel": 3.79 },
      "surfaces": ["#12151f", "#ffffff"]
    },
    "exports": ["css", "tailwind", "json", "dtcg"]
  }
}

HOW IT WOULD PLUG IN
1. POST the four tokens above → same object this page computes locally.
2. Keep the response in an editor session; export any format on demand.
3. Pro accounts save themes to /api/studio/themes — the same payload,
   server-side, instead of localStorage.`;

export function ApiPreviewPanel() {
  return (
    <div className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Theme API preview</p>
          <p className="mt-1 text-xs text-ink-dim">The future Theme Studio endpoint&apos;s JSON shape — what saving themes server-side would speak.</p>
        </div>
        <span className="chip !text-[10px] !border-amber-300/40 !text-amber-300">spec preview · not implemented</span>
      </div>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-white/8 bg-[#07090f] p-4">
        <pre className="whitespace-pre font-mono text-[11px] leading-relaxed text-ink-dim">{API_JSON}</pre>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
        Everything in the response already exists on this page as local functions — the API is a thin server wrapper
        around the same token math, with real persistence instead of the demo&apos;s localStorage. The numbers shown are
        examples, not a claim that the endpoint is live.
      </p>
    </div>
  );
}

/* ===================================================================
   #319 — Reset-theme escape hatch
   =================================================================== */

function isDefault(t: Tokens) {
  return t.hue === DEFAULT_TOKENS.hue && t.sat === DEFAULT_TOKENS.sat && t.radius === DEFAULT_TOKENS.radius && t.mode === DEFAULT_TOKENS.mode;
}

export function ResetPanel({
  tokens,
  edits,
  trail,
  onReset,
}: {
  tokens: Tokens;
  edits: number;
  trail: string[];
  onReset: () => void;
}) {
  const [done, setDone] = useState(false);
  const atDefault = isDefault(tokens);

  return (
    <div className={`rounded-3xl border p-6 ${atDefault && !done ? "border-white/8 bg-panel" : "border-emerald-300/25 bg-emerald-300/[.04]"}`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Reset-theme escape hatch</p>
          <p className="mt-1 text-xs text-ink-dim">Every experiment is undoable — one click returns hue, saturation, radius and mode to Motif&apos;s defaults.</p>
        </div>
        <span className={`chip !text-[10px] ${atDefault && !done ? "" : "!border-emerald-300/35 !text-emerald-300"}`}>
          {atDefault && !done ? "at Motif default" : "edited · reset available"}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            onReset();
            setDone(true);
          }}
          className="btn btn-primary !px-4 !py-2 text-xs"
        >
          ↺ Reset theme in one click
        </button>
        <p className="text-[11px] leading-relaxed text-ink-faint">
          {done
            ? "Back to defaults — the diff view cleared and the edit counter reset. Saved themes and share links were left untouched."
            : `${edits} token ${edits === 1 ? "change" : "changes"} this session${trail.length ? " · last applied: " + trail[0] : ""}.`}
        </p>
      </div>

      {trail.length > 0 && !done && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-ink-faint">Preset trail:</span>
          {trail.map((name, i) => (
            <span key={`${name}-${i}`} className="chip !text-[9px]">
              {i === 0 ? "→ " : ""}
              {name}
            </span>
          ))}
        </div>
      )}

      <p className="mt-3 border-t border-white/6 pt-3 text-[11px] leading-relaxed text-ink-faint">
        The hatch stays reachable at every scroll depth because the same four tokens are the only state: reset swaps
        them back, nothing else to unwind — no layers, no saved history to replay. Rotation also stops if it is running.
      </p>
    </div>
  );
}
