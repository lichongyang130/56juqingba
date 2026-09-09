"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DemoView } from "@/components/demos/Demo";
import { AssetCard, CopyCount, Stage } from "@/components/cards";
import { accentCss, COMPONENTS, KIND_META } from "@/lib/data";
import type { Asset } from "@/lib/types";

/* Original code snippets shown in the detail page (hand-written for the MVP). */
const SNIPPETS: Record<string, { react: string; css: string }> = {
  "aurora-veil": {
    react: `// React + Tailwind
import { AuroraVeil } from "@motifui/aurora-veil";

export function Hero() {
  return (
    <section className="relative h-screen overflow-hidden">
      <AuroraVeil
        hueA={262}        // violet
        hueB={192}        // cyan
        speed={18}        // seconds per drift cycle
        grain
        className="absolute inset-0"
      />
      <h1 className="relative pt-32 text-center text-6xl font-black text-white">
        Ships that feel alive
      </h1>
    </section>
  );
}`,
    css: `/* dependency-free: single .aurora-veil element */
.aurora-veil {
  position: absolute; inset: 0;
  background:
    radial-gradient(46% 60% at 20% 15%, hsl(262 85% 62% / .55), transparent 70%),
    radial-gradient(42% 55% at 82% 20%, hsl(192 90% 60% / .5),  transparent 70%),
    radial-gradient(60% 70% at 60% 90%, hsl(342 80% 55% / .34), transparent 75%);
  filter: blur(14px) saturate(1.3);
  animation: aurora-drift 18s ease-in-out infinite alternate;
}
@keyframes aurora-drift {
  from { transform: scale(1) rotate(-1deg); }
  to   { transform: scale(1.12) rotate(2deg); }
}`,
  },
  "tilt-card": {
    react: `// React + Tailwind
import { TiltCard } from "@motifui/tilt-card";

<TiltCard maxTilt={16} spotlight className="w-full max-w-sm">
  <YourCardContent />
</TiltCard>`,
    css: `/* .tilt-card listens to --mx / --my (0-100) set from JS */
.tilt-card {
  transform:
    perspective(900px)
    rotateX(calc((50 - var(--my, 50)) * 0.32deg))
    rotateY(calc((var(--mx, 50) - 50) * 0.32deg));
  transition: transform 120ms ease-out;
}`,
  },
  "prism-switch": {
    react: `// React + Tailwind
import { PrismSwitch } from "@motifui/prism-switch";

export function Settings() {
  return <PrismSwitch size={42} hueSpeed={1.4} ariaLabel="Dark mode" />;
}`,
    css: `/* HTML structure is a checkbox + track + thumb */
input.prism:checked + .track {
  background: linear-gradient(90deg, #7c3aed, #6366f1, #0ea5e9,
              #06b6d4, #34d399, #f472b6, #7c3aed);
  background-size: 300% 100%;
  animation: prism-sweep 1.4s linear infinite;
}
@keyframes prism-sweep { to { background-position: 300% 0; } }`,
  },
  "scramble-text": {
    react: `// React
import { ScrambleText } from "@motifui/scramble-text";

<ScrambleText text="Copy less. Ship more." speed={55} />`,
    css: `/* .scramble uses a JS character loop over GLYPHS below */
const GLYPHS = "!<>-_\\\\/[]{}—=+*^?#0123456789";`,
  },
  "halo-button": {
    react: `// React + Tailwind
import { HaloButton } from "@motifui/halo-button";

<HaloButton magnet={24} glow={0.7}>Start building</HaloButton>`,
    css: `/* .halo-btn copies pointer position to --hx / --hy */
.halo-btn::after {
  content: ""; position: absolute; inset: 0;
  background: radial-gradient(220px circle at var(--hx) var(--hy),
              rgba(255,255,255,.28), transparent 60%);
}`,
  },
  "orbit-deck": {
    react: `// React
import { OrbitDeck } from "@motifui/orbit-deck";

<OrbitDeck radius={190} orbitSeconds={14} tilt>
  <LogoOne /> <LogoTwo /> <LogoThree />
</OrbitDeck>`,
    css: `/* ring = spin wrapper, items counter-rotate while translating */
.orbit-item {
  animation: mf-spin var(--orbit, 14s) linear infinite reverse;
}`,
  },
  "morph-blob": {
    react: `// React
import { MorphBlob } from "@motifui/morph-blob";

<section className="relative h-[420px] overflow-hidden">
  <MorphBlob hueA={258} hueB={192} speed={9} />
  <h1 className="relative z-10">Always liquid.</h1>
</section>`,
    css: `/* one div, two animations — radius morphs, position drifts */
.blob {
  width: 420px; height: 420px;
  background: radial-gradient(circle at 42% 38%,
              hsl(258 88% 62% / .55), hsl(298 85% 45% / .18) 60%, transparent 75%);
  filter: blur(28px) saturate(1.25);
  border-radius: 58% 42% 63% 37% / 44% 55% 45% 56%;
  animation: blob-morph 9s ease-in-out infinite alternate,
             blob-drift 14s ease-in-out infinite alternate;
}
@keyframes blob-morph {
  0%   { border-radius: 58% 42% 63% 37% / 44% 55% 45% 56%; }
  50%  { border-radius: 46% 54% 38% 62% / 60% 38% 62% 40%; }
  100% { border-radius: 62% 38% 55% 45% / 40% 62% 38% 60%; }
}`,
  },
  "conic-loader": {
    react: `// React
export function Saving() {
  return (
    <div role="status" aria-live="polite" className="h-24 w-24 rounded-full"
         style={{
           background: "conic-gradient(from 0deg, transparent 0 25%, #8b5cf6 50%, #22d3ee 75%, transparent 80%)",
           WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 9px), #000 calc(100% - 8px))",
           animation: "conic-spin 1s linear infinite",
         }} />
  );
}`,
    css: `/* pure CSS: conic-gradient + radial mask = zero-image spinner */
.loader {
  width: 96px; aspect-ratio: 1;
  background: conic-gradient(from 0deg, transparent 0 25%, #8b5cf6 50%,
              #22d3ee 75%, transparent 80% 100%);
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 9px), #000 calc(100% - 8px));
          mask: radial-gradient(farthest-side, transparent calc(100% - 9px), #000 calc(100% - 8px));
  animation: conic-spin 1s linear infinite;
}
@keyframes conic-spin { to { transform: rotate(1turn) } }
@media (prefers-reduced-motion: reduce) { .loader { animation-duration: 2.4s; } }`,
  },
  "glass-pricing": {
    react: `// React + Tailwind — one column of the trio
export function PlanCard({ name, price, hero }: Plan) {
  return (
    <div className={
      "relative w-full rounded-2xl border border-white/15 bg-white/10 p-5 " +
      "shadow-[inset_0_1px_0_rgba(255,255,255,.28)] backdrop-blur-xl " +
      (hero ? "shadow-[0_0_46px_-6px_rgba(139,92,246,.55)]" : "")
    }>
      <h3 className="text-xs font-bold uppercase tracking-widest text-white/60">{name}</h3>
      <p className="mt-1 text-3xl font-black text-white">{price}<span className="text-xs text-white/40">/mo</span></p>
      {/* feature list + CTA */}
    </div>
  );
}`,
    css: `/* the trick is three surfaces: border, inner specular, blur */
.glass-col {
  background: linear-gradient(180deg, rgba(255,255,255,.14), rgba(255,255,255,.04));
  border: 1px solid rgba(255,255,255,.16);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.35), 0 24px 48px -24px rgba(0,0,0,.8);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}
/* glow only on the hero column — restraint is the design */
.glass-col--hero { box-shadow: inset 0 1px 0 rgba(255,255,255,.4), 0 0 60px -10px rgba(139,92,246,.55); }`,
  },
  "wipe-reveal": {
    react: `// React — the travelling light edge is one background-paint pass
export function WipeHeadline({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="relative inline-block">
      <span aria-hidden className="opacity-15">{children}</span>
      <span aria-hidden
        className="absolute inset-0 bg-clip-text text-transparent"
        style={{
          backgroundImage: "linear-gradient(100deg, transparent 42%, #c4b5fd 48%, #67e8f9 52%, transparent 58%)",
          backgroundSize: "260% 100%",
          animation: "wipe-sweep 2.2s cubic-bezier(.6,.05,.25,1) 0.4s both",
        }}>
        {children}
      </span>
      <span className="sr-only">{children}</span>
    </h1>
  );
}`,
    css: `@keyframes wipe-sweep {
  from { background-position: -220% 0; }
  to   { background-position: 220% 0; }
}`,
  },
  "counter-stats": {
    react: `// React — count once, when 40% of the band is visible
const TARGETS = [12400, 318, 94, 148200];
useEffect(() => {
  const obs = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    obs.disconnect();
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 1400);
      setVals(TARGETS.map((v) => Math.round(v * (1 - Math.pow(1 - p, 3)))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, { threshold: 0.4 });
  obs.observe(ref.current!);
  return () => obs.disconnect();
}, []);`,
    css: `/* no CSS needed for the count — the ledger look is just hairlines */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); }
.stats-grid > * + * { border-left: 1px solid rgba(255,255,255,.08); }
.stats-num { font-variant-numeric: tabular-nums; }`,
  },
  "dot-draw": {
    react: `// React — one pointermove, one state map of column fills
const onMove = (e: React.PointerEvent) => {
  const r = box.getBoundingClientRect();
  const col = Math.floor(((e.clientX - r.left) / r.width) * COLS);
  setFill(f => ({ ...f, [col]: ROWS }));     // raise the column
  clearTimeout(timers[col]);
  timers[col] = setTimeout(() =>
    setFill(f => ({ ...f, [col]: 0 })), 900); // let it settle
};`,
    css: `/* every dot is a span; lit dots scale up and glow */
.dot { border-radius: 50%; transition: opacity .2s, transform .2s; }
.dot--lit { transform: scale(1); }
.dot--lit[data-mono="false"] { box-shadow: 0 0 10px hsl(var(--dot-hue) 90% 60% / .8); }`,
  },
  "text-cycle": {
    react: `// React — index state + interval; the roll is pure transform
const WORDS = ["ship faster.", "feel alive.", "convert better."];
const [i, setI] = useState(0);
useEffect(() => {
  const t = setInterval(() => setI(v => (v + 1) % WORDS.length), 2600);
  return () => clearInterval(t);
}, []);

<div className="relative h-[1.4em] overflow-hidden" aria-live="polite">
  <span style={{ transform: \`translateY(-\${i * 100}%)\`,
                 transition: "transform .5s cubic-bezier(.65,0,.25,1)" }}>
    {WORDS.map(w => <span key={w} className="block">{w}</span>)}
  </span>
</div>`,
    css: `/* .cycle-line animates a column of lines; the window is overflow-hidden */
.cycle-line { display: block; transition: transform .5s cubic-bezier(.65,0,.25,1); }
@media (prefers-reduced-motion: reduce) {
  .cycle-line { transition: none; }
}`,
  },
  "tab-morph": {
    react: `// React — one absolutely-positioned thumb, measured in %s
const [active, setActive] = useState(1);
<div className="relative grid rounded-2xl p-1.5" style={{ gridTemplateColumns: \`repeat(\${tabs.length}, 1fr)\` }}>
  <span className="absolute" style={{
    width: \`calc((100% - 12px) / \${tabs.length})\`,
    left: \`calc(6px + \${active} * (100% - 12px) / \${tabs.length})\`,
    transition: "left .35s cubic-bezier(.65,0,.25,1)",
  }} />
  {tabs.map((t, i) => <button key={t} onClick={() => setActive(i)}>{t}</button>)}
</div>`,
    css: `/* thumb: absolute, width = one cell, left = animated */
.tab-thumb { position: absolute; top: 6px; bottom: 6px;
  width: calc((100% - 12px) / var(--n, 4));
  left: calc(6px + var(--active, 0) * (100% - 12px) / var(--n, 4));
  transition: left .35s cubic-bezier(.65,0,.25,1); }`,
  },
  "flip-card": {
    react: `// React — click/tap to flip, not hover (touch-friendly)
<div style={{ perspective: "1100px" }} onClick={() => setFlip(f => !f)}
     role="button" tabIndex={0} aria-label="Flip card">
  <div style={{ transformStyle: "preserve-3d",
                transform: flip ? "rotateY(180deg)" : "none",
                transition: "transform .7s" }}>
    <div style={{ backfaceVisibility: "hidden" }}> {/* front */} </div>
    <div style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}> {/* back */} </div>
  </div>
</div>`,
    css: `/* both faces need backface-visibility: hidden */
.scene { perspective: 1100px; }
.card3d { transform-style: preserve-3d; transition: transform .7s cubic-bezier(.4,.2,.2,1); }
.card3d.is-flipped { transform: rotateY(180deg); }
.face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
.face--back { transform: rotateY(180deg); }`,
  },
  "skeleton-shimmer": {
    react: `// React — one shared shimmer span per bone
function Bone({ className }) {
  return (
    <div className={className + " relative overflow-hidden"}>
      <span aria-hidden
        className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent"
        style={{ animation: "shimmer 1.8s ease-in-out infinite" }} />
    </div>
  );
}`,
    css: `/* direction comes from the gradient, not the element — cheap */
@keyframes shimmer {
  from { transform: translateX(-100%); }
  to   { transform: translateX(240%); }
}
@media (prefers-reduced-motion: reduce) {
  .skeleton [aria-hidden] { animation: none; opacity: .4; }
}`,
  },
  "chart-card": {
    react: `// React — bars animate on entry; stagger = delay * index
<IntersectionObserver once threshold={0.35}>
  {heights.map((h, i) => (
    <span key={i} style={{
      height: on ? h + "%" : "4%",
      transition: "height .9s cubic-bezier(.3,1,.4,1) " + (i * 60) + "ms",
    }} />
  ))}
</IntersectionObserver>`,
    css: `/* .bar rises because height transitions from 4% to target */
.bar { transform-origin: bottom; }
.chart[data-live="false"] .bar { height: 4%; }
@media (prefers-reduced-motion: reduce) {
  .bar { transition: none !important; height: var(--h) !important; }
}`,
  },
  "avatar-stack": {
    react: `// React — the crowd parts by translating everyone right of the hovered face
<div className="flex">
  {people.map((p, i) => (
    <span key={p.name}
      onMouseEnter={() => setHot(i)}
      style={{
        marginLeft: i === 0 ? 0 : -12,
        transform: hot !== null && i > hot ? "translateX(" + (i - hot) * 8 + "px)" : "none",
        transition: "transform .3s cubic-bezier(.34,1.56,.64,1)",
        zIndex: hot === i ? 20 : people.length - i,
      }}>
      {initials(p.name)}
    </span>
  ))}
</div>`,
    css: `/* .face sits in a row with negative margins; .stack[data-hot] nudges the tail */
.face { transition: transform .3s cubic-bezier(.34,1.56,.64,1); }
.stack:hover .face { transform: translateX(var(--nudge, 0)); }`,
  },
  "command-palette": {
    react: `// React — filter + selection state; the overlay itself is a dialog
const filtered = COMMANDS.filter(c =>
  c.label.toLowerCase().includes(q.trim().toLowerCase()));

<div role="dialog" aria-modal="true" aria-label="Quick actions"
     className="fixed inset-0 z-50 flex items-start justify-center pt-24">
  <div className="w-full max-w-md overflow-hidden rounded-2xl border
              border-white/10 bg-[#0d0f17] shadow-2xl">
    <input value={q} onChange={e => { setQ(e.target.value); setSel(0); }}
           placeholder="Type a command…"
           className="w-full border-b border-white/8 bg-transparent px-4 py-3
                      text-sm text-white placeholder:text-white/30" />
    {filtered.map((c, i) => (
      <button key={c.label}
        onMouseEnter={() => setSel(i)}
        className={"flex w-full items-center gap-3 px-4 py-2 text-left text-sm " +
          (i === sel ? "bg-white/10 text-white" : "text-white/60")}>
        {c.label}
      </button>
    ))}
  </div>
</div>`,
    css: `/* a11y notes baked in: role=dialog + aria-modal, focus first result */
.kbd { font: inherit; padding: 0 5px; border-radius: 5px;
       background: rgba(255,255,255,.08); }`,
  },
  "toast-stack": {
    react: `// React — toasts are just state; the container does the announcing
const [toasts, setToasts] = useState([]);
const push = () => {
  const id = ++ref.current;
  setToasts(t => [...t.slice(-2), { id, text: "Build passed · 3.2s" }]);
  setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
};

<div aria-live="polite" className="fixed right-4 bottom-4 flex flex-col gap-2">
  {toasts.map(t => (
    <div key={t.id} className="toast rounded-xl border px-4 py-3 text-sm shadow-2xl">
      {t.text}
    </div>
  ))}
</div>`,
    css: `/* the entrance: rise + ease; exits handled by state removal */
.toast { animation: toast-in .3s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes toast-in { from { opacity: 0; transform: translateY(14px); } }
@media (prefers-reduced-motion: reduce) { .toast { animation: none; } }`,
  },
  "sheet-menu": {
    react: `// React — sheet is translate-y, backdrop is a sibling button
<div className="fixed inset-0 z-40">
  {open && <button aria-label="Close" onClick={() => setOpen(false)}
                   className="absolute inset-0" />}
  <div className={"absolute inset-x-0 bottom-0 z-10 rounded-t-2xl " +
    (open ? "translate-y-0" : "translate-y-full")}
    style={{ transition: "transform .32s cubic-bezier(.34,1.4,.4,1)" }}>
    {/* handle + nav rows */}
  </div>
</div>`,
    css: `/* springy sheet — overshoot at the end sells 'physical' */
.sheet { transition: transform .32s cubic-bezier(.34, 1.4, .4, 1); }
.sheet[data-open="false"] { transform: translateY(100%); }
@media (min-width: 768px) {
  .sheet { display: none; } /* desktop gets real nav */ }`,
  },
};

const FALLBACK = {
  react: `// 1) install
//   npm i @motifui/cli && npx motifui add {slug}
// 2) import where you need it
import { Component } from "@motifui/{slug}";

export function Demo() {
  return <Component theme="inherit" className="w-full" />;
}`,
  css: `/* Grab the fully-written CSS from the "HTML/CSS" view,
   or install with:  npx motifui add {slug}  */`,
};

/** Editorial voice — what it's for → the idea → when to skip it.
 *  Keeps the library from reading like a pile of tags. */
const DESIGN_NOTES: Record<string, { why: string; skip: string; idea?: string }> = {
  "wipe-reveal": {
    why: "Hero headlines that sit dead on the fold read as templates. One travelling light edge gives the whole brand a 'just rendered' energy for the cost of a single background-paint pass.",
    idea: "The wipe layer is clipped to the text itself (background-clip: text), so the effect can never spill outside the type.",
    skip: "Skip it for paragraph-length copy or anything under 28px — the sweep needs size to read as a sweep, not a shimmer bug.",
  },
  "glass-pricing": {
    why: "Glass pricing pages fail when every column shouts. The hero column is the only one allowed a glow; everyone else earns contrast from the specular top edge.",
    skip: "On light themes glass reads as dirty frosted plastic — pair it with a dark canvas or switch to the solid-token variant.",
  },
  "morph-blob": {
    why: "A brand-mark backdrop that sits still feels like a logo. Three blobs that melt on offset clocks keep a whole hero alive with zero JS.",
    skip: "Don't stack it behind dense copy — blur fields eat text contrast. Give it its own band or keep copy on a scrim.",
  },
  "dot-draw": {
    why: "404 pages and section gaps are the only places where pure pointer theatre is still a delight. The column-raises-like-a-seismograph motion reads instantly.",
    skip: "Not for anything with a real task nearby — it's ambient. Respect reduced-motion by dropping the glow pass.",
  },
  "counter-stats": {
    why: "Stats bands count because they're honest: numbers arrive once, eased, on a hairline ledger that mirrors accounting rather than arcade.",
    skip: "If your numbers are marketing fluff, the count-up makes them *more* suspicious. Keep it for hard, verifiable metrics.",
  },
  "conic-loader": {
    why: "A spinner is a product decision. The conic ring with a breathing marker says 'saving' without the default spinny-circle tax.",
    skip: "For any operation under ~300ms show nothing — a spinner that appears instantly is worse than none.",
  },
  "tilt-card": {
    why: "The light-spot tracks the cursor so the card feels lit from where you look, not from a fixed lamp. That's the whole trick.",
    skip: "On touch devices there is no hover — make sure the tilt is also the drag affordance, or gate it to fine pointers only.",
  },
  "aurora-veil": {
    why: "Three radial gradients drifting on a 16–20s clock with a grain pass on top. GPU-composited, zero JS, and the drift speed is slow enough to feel expensive.",
    skip: "Don't run full-page aurora behind content on every section — reserve it for one hero and fade it out by 60vh.",
  },
  "text-cycle": {
    why: "Autoplay video in heroes is a bandwidth tax. A rotating second line gives the same 'alive' signal in ~1.4 KB and never steals the scroll.",
    idea: "The window is overflow-hidden and the whole column translates — one style change per swap, no per-word recalc.",
    skip: "Keep every phrase short and parallel in rhythm ('ship faster.', 'feel alive.'). Mismatched lengths make the roll look broken.",
  },
  "tab-morph": {
    why: "A sliding thumb tells users 'the panel moved' without a full re-layout. The spring curve is what keeps it from feeling mechanical.",
    skip: "For 6+ tabs the thumb loses meaning — switch to underline-only tabs or a menu.",
  },
  "flip-card": {
    why: "Flip on click, not hover: hover can't exist on touch, so flip-on-hover cards are secretly broken on phones. Click is the honest interaction.",
    skip: "Don't flip important pricing or legal content — anything below the fold must stay readable at all times.",
  },
  "skeleton-shimmer": {
    why: "Loading states are the most-seen UI on slow networks, yet they're always an afterthought. A designed skeleton sets the tone before the real card arrives.",
    idea: "Shimmer is one gradient sweeping on a clipped parent — the same trick for every bone, so it costs almost nothing.",
    skip: "Under ~300ms of load, show nothing. Skeletons that pop in and vanish in a blink feel more broken than a blank space.",
  },
  "chart-card": {
    why: "Numbers alone are inert; a card that 'draws itself' on entry turns a static dashboard into a story about momentum.",
    skip: "Don't animate real-time data you don't own — if values change every second, the bar chart should feel live, not theatrical.",
  },
  "avatar-stack": {
    why: "The classic social-proof stack is static; parting like a crowd on hover adds a beat of personality and gives each face room to be a person.",
    skip: "On touch there's no hover to part the crowd — make the last avatar a tappable '+N' or the whole stack a link to the team page.",
  },
  "command-palette": {
    why: "Power users don't read your nav — they search it. A command palette turns a docs site or dashboard into something you can operate without looking.",
    idea: "The filter is a single toLowerCase().includes() pass; the feel comes from arrow-key selection state and grouping, not fuzzy-search libraries.",
    skip: "Skip it under ~30 commands. A palette with three results is ceremony; a plain search input is honest.",
  },
  "toast-stack": {
    why: "Toasts fail two ways: they're decorative (no aria-live, so screen readers never hear them) or they scream. This stack announces politely and auto-dismisses.",
    idea: "The accent tone derives from the message type — success/motion/prompt runs all read differently at a glance.",
    skip: "Every toast is an interruption budget. Batch updates into one toast ('3 assets saved') and never toast errors the user can't act on.",
  },
  "sheet-menu": {
    why: "Hamburger menus that fly in from the left fight the thumb; a bottom sheet sits where the thumb already is. That's the entire argument.",
    idea: "The springy overshoot on the sheet's transform is what makes it feel like a physical drawer — a plain ease feels like a slide deck.",
    skip: "On desktop, show the real nav and hide the sheet entirely (the code includes the breakpoint). Don't ship a mobile-only pattern to laptop users.",
  },
};

function CodeBlock({ title, code, onCopy }: { title: string; code: string; onCopy: () => void }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#07090f]">
      <div className="flex items-center justify-between border-b border-white/6 px-4 py-2.5">
        <span className="text-xs font-semibold text-ink-dim">{title}</span>
        <button
          type="button"
          onClick={onCopy}
          className="btn btn-ghost !rounded-lg !px-3 !py-1.5 !text-[11px]"
        >
          Copy
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[12.5px] leading-relaxed text-cyan-100/90">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function AssetDetail({ asset }: { asset: Asset }) {
  const [props, setProps] = useState<Record<string, number | string | boolean>>(() => {
    const init: Record<string, number | string | boolean> = {};
    asset.props.forEach((p) => (init[p.name] = p.defaultValue));
    return init;
  });
  const [themeHue, setThemeHue] = useState(262);
  const [copied, setCopied] = useState<string | null>(null);
  const [tab, setTab] = useState<"react" | "css">("react");

  const snippet = useMemo(() => {
    const s = SNIPPETS[asset.slug] ?? FALLBACK;
    const out = { ...s };
    if (s.react.includes("{slug}")) out.react = s.react.replaceAll("{slug}", asset.slug);
    if (s.css.includes("{slug}")) out.css = s.css.replaceAll("{slug}", asset.slug);
    return out;
  }, [asset]);
  const accentColor = accentCss(asset.slug, 85, 68);

  const copy = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      /* clipboard unavailable in sandbox previews */
      setCopied(label);
      setTimeout(() => setCopied(null), 1600);
    }
  };

  const related = COMPONENTS.filter((c) => c.slug !== asset.slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      {/* breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-xs text-ink-faint">
        <Link href="/components" className="hover:text-ink">Components</Link>
        <span>/</span>
        <span className="chip capitalize">{KIND_META[asset.kind].label}</span>
        <span>/</span>
        <span className="text-ink-dim">{asset.title}</span>
      </nav>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{asset.title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-dim">{asset.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="btn btn-primary" onClick={() => copy("install", `npx motifui add ${asset.slug}`)}>
            {copied === "install" ? "✓ Copied" : "Copy component"}
          </button>
          <button type="button" className="btn btn-ghost">♥ Collect</button>
          <CopyCount n={asset.copies} className="!text-sm" />
        </div>
      </div>

      {/* meta chips */}
      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        <span className="chip">MIT license</span>
        <span className="chip">v{asset.version}</span>
        <span className="chip">{asset.bundleKb} KB gzip</span>
        {asset.deps.length > 0 ? (
          <span className="chip">deps: {asset.deps.join(", ")}</span>
        ) : (
          <span className="chip">zero dependencies</span>
        )}
        <span className="chip">by {asset.author}</span>
        <span className="chip">updated {asset.published}</span>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        {/* preview + theme */}
        <div>
          <div className="rounded-3xl border border-white/8 bg-panel p-3">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-ink-faint">
                Live playground — drag, click, hover
              </span>
              <span className="chip !text-[10px]">sandboxed preview</span>
            </div>
            <Stage className="rounded-2xl">
              <DemoView demo={asset.demo} props={props} />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 mix-blend-soft-light"
                style={{
                  background: `radial-gradient(85% 95% at 18% 8%, hsl(${themeHue} 90% 62% / 1), transparent 65%)`,
                  opacity: 0.5,
                }}
              />
            </Stage>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-2 pb-1">
              <div className="flex min-w-0 items-center gap-2 text-xs text-ink-dim">
                <span className="shrink-0">Ambience</span>
                <input
                  type="range" min={0} max={360} value={themeHue}
                  onChange={(e) => setThemeHue(Number(e.target.value))}
                  className="w-36 md:w-44"
                  aria-label="Ambience hue"
                />
                <span className="hidden font-mono text-[11px] sm:inline">hsl({themeHue})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="mr-1 text-[10px] uppercase tracking-wider text-ink-faint">vibes</span>
                {[
                  { label: "Violet", h: 262 },
                  { label: "Cyan", h: 192 },
                  { label: "Rose", h: 330 },
                  { label: "Lime", h: 152 },
                  { label: "Amber", h: 40 },
                ].map((v) => (
                  <button
                    key={v.label}
                    type="button"
                    onClick={() => setThemeHue(v.h)}
                    aria-label={`${v.label} ambience`}
                    title={v.label}
                    className={`h-5 w-5 rounded-full border transition-transform hover:scale-110 ${
                      themeHue === v.h ? "border-white ring-2 ring-white/30" : "border-white/20"
                    }`}
                    style={{ background: `linear-gradient(135deg, hsl(${v.h} 85% 60%), hsl(${(v.h + 60) % 360} 85% 55%))` }}
                  />
                ))}
              </div>
            </div>
            <p className="px-2 pb-1 text-[10px] text-ink-faint">
              Ambience is a live light wash over the preview. Full palette re-theming of every demo arrives with Theme Studio (Pro).
            </p>
          </div>

          {/* code */}
          <div className="mt-6">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex rounded-xl border border-white/8 bg-black/30 p-1">
                {(["react", "css"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-colors ${
                      tab === t ? "bg-white/10 text-ink" : "text-ink-dim hover:text-ink"
                    }`}
                  >
                    {t === "react" ? "React + Tailwind" : "HTML / CSS"}
                  </button>
                ))}
              </div>
              <span className="text-xs text-ink-faint">stack views: React · HTML/CSS · Vue (soon)</span>
            </div>
            <CodeBlock
              title={`${asset.slug}.tsx`}
              code={snippet[tab]}
              onCopy={() => copy(tab, snippet[tab])}
            />
            {DESIGN_NOTES[asset.slug] && (
              <div className="mt-3 rounded-2xl border border-white/8 bg-panel p-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink-faint">
                  <span className="text-base leading-none" style={{ color: accentColor }}>✎</span>
                  Design notes from the studio
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-ink-dim">
                  <b className="text-ink">Why it works — </b>{DESIGN_NOTES[asset.slug].why}
                </p>
                {DESIGN_NOTES[asset.slug].idea && (
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-dim">
                    <b className="text-ink">The idea — </b>{DESIGN_NOTES[asset.slug].idea}
                  </p>
                )}
                <p className="mt-2 rounded-xl border border-amber-300/15 bg-amber-400/5 px-3.5 py-2.5 text-[13px] leading-relaxed text-amber-100/85">
                  <b>When to skip it — </b>{DESIGN_NOTES[asset.slug].skip}
                </p>
              </div>
            )}
            <div className="mt-3 rounded-2xl border border-violet-300/15 bg-violet-400/5 px-4 py-3 text-xs leading-relaxed text-violet-100/80">
              <b className="text-violet-200">Dependency-aware copy:</b> {asset.deps.length === 0
                ? "zero packages to install — paste and run."
                : `you'll need: ${asset.deps.join(", ")} (versions pinned in the install command).`}{" "}
              All markup is original Motif UI content (MIT).
            </div>
          </div>
        </div>

        {/* props + facts */}
        <aside className="space-y-5">
          <div className="rounded-3xl border border-white/8 bg-panel p-5">
            <div className="text-xs font-bold uppercase tracking-widest text-ink-faint">Playground props</div>
            <div className="mt-4 space-y-4">
              {asset.props.length === 0 && (
                <p className="text-xs text-ink-dim">No exposed knobs — this asset ships as-is. Style it through Theme Studio tokens.</p>
              )}
              {asset.props.map((p) => {
                const val = props[p.name];
                const set = (v: number | string | boolean) => setProps((prev) => ({ ...prev, [p.name]: v }));
                return (
                  <div key={p.name}>
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-ink-dim">{p.label}</label>
                      <span className="font-mono text-[11px] text-cyan-200/80">
                        {typeof val === "number" ? `${val}${p.unit ?? ""}` : String(val)}
                      </span>
                    </div>
                    {p.type === "range" && (
                      <input
                        type="range" min={p.min} max={p.max} step={p.step ?? 1}
                        value={val as number}
                        onChange={(e) => set(Number(e.target.value))}
                        className="mt-2 w-full"
                        aria-label={p.label}
                      />
                    )}
                    {p.type === "toggle" && (
                      <button
                        type="button"
                        role="switch"
                        aria-checked={Boolean(val)}
                        onClick={() => set(!val)}
                        className="mt-2 flex items-center gap-2 text-xs text-ink-dim"
                      >
                        <span
                          className={`flex h-5 w-9 items-center rounded-full border px-0.5 transition-colors ${
                            val ? "justify-end border-violet-300/50 bg-violet-500/60" : "justify-start border-white/15 bg-white/8"
                          }`}
                        >
                          <span className="h-3.5 w-3.5 rounded-full bg-white shadow" />
                        </span>
                        {val ? "On" : "Off"}
                      </button>
                    )}
                    {p.type === "select" && (
                      <select
                        value={String(val)}
                        onChange={(e) => set(e.target.value)}
                        className="input mt-2 !cursor-pointer !py-1.5 text-xs"
                        aria-label={p.label}
                      >
                        {(p.options ?? []).map((o) => (
                          <option key={o} value={o} className="bg-panel">{o}</option>
                        ))}
                      </select>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-white/8 bg-panel p-5">
            <div className="text-xs font-bold uppercase tracking-widest text-ink-faint">Audit report</div>
            <div className="mt-4 space-y-3">
              {[
                { label: "Accessibility (auto + human)", value: asset.a11yScore, tone: asset.a11yScore >= 95 ? "text-mint" : asset.a11yScore >= 90 ? "text-amber-300" : "text-danger" },
                { label: "Editorial quality", value: asset.qualityScore, tone: asset.qualityScore >= 95 ? "text-mint" : "text-amber-300" },
              ].map((r) => (
                <div key={r.label}>
                  <div className="flex justify-between text-xs">
                    <span className="text-ink-dim">{r.label}</span>
                    <span className={`font-bold ${r.tone}`}>{r.value}/100</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/6">
                    <div
                      className={`h-full rounded-full ${r.value >= 95 ? "bg-mint" : "bg-amber-300"}`}
                      style={{ width: `${r.value}%` }}
                    />
                  </div>
                </div>
              ))}
              <ul className="prose-list list-none space-y-1 pt-1">
                <li className="!text-xs">Keyboard reachable & ARIA labelled</li>
                <li className="!text-xs">{asset.themeable ? "100% design-token driven" : "Static palette (token migration planned)"}</li>
                <li className="!text-xs">Reduced-motion fallback included</li>
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-white/8 bg-panel p-5">
            <div className="text-xs font-bold uppercase tracking-widest text-ink-faint">One-command install</div>
            <div className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-black/40 px-3 py-2.5 font-mono text-[12px] text-cyan-100">
              <span className="truncate">npx motifui add {asset.slug}</span>
              <button type="button" className="shrink-0 text-xs text-ink-dim hover:text-ink" onClick={() => copy("cmd", `npx motifui add ${asset.slug}`)}>
                {copied === "cmd" ? "✓" : "copy"}
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* related */}
      <div className="mt-16">
        <h2 className="text-xl font-extrabold tracking-tight">Related assets</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((a) => (
            <AssetCard key={a.slug} asset={a} />
          ))}
        </div>
      </div>
    </div>
  );
}
