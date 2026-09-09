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
  "segmented-control": {
    react: `// React — the thumb is one absolutely-positioned span, width measured in %
const OPTIONS = ["Essential", "Pro", "Scale", "Enterprise"];
<div className="relative flex rounded-2xl border p-1.5">
  <span aria-hidden className="absolute top-1.5 bottom-1.5"
    style={{
      width: \`calc((100% - 12px) / \${OPTIONS.length})\`,
      left: \`calc(6px + \${sel} * (100% - 12px) / \${OPTIONS.length})\`,
      transition: "left .3s cubic-bezier(.65,0,.25,1)",
    }} />
  {OPTIONS.map((o, i) => (
    <button key={o} type="button" onClick={() => setSel(i)}
      aria-pressed={sel === i}
      className={"relative z-10 rounded-xl px-5 py-2.5 text-sm font-bold " +
        (sel === i ? "text-white" : "text-white/50")}>
      {o}
    </button>
  ))}
</div>`,
    css: `/* thumb layer */
.segment-thumb { transition: left .3s cubic-bezier(.65, 0, .25, 1); }
button[aria-pressed="true"] { color: #fff; }`,
  },
  "notification-bell": {
    react: `// React — dropdown + badge; aria-expanded is the part people skip
<button type="button"
  onClick={() => setOpen(v => !v)}
  aria-expanded={open}
  aria-label={\`Notifications, \${unread} unread\`}>
  {unread > 0 && <span className="badge">{unread}</span>}
</button>
{open && (
  <>
    <button aria-label="Dismiss" onClick={() => setOpen(false)}
            className="fixed inset-0" tabIndex={-1} />
    <ul role="menu" className="absolute right-0 mt-2 w-72 …">
      {/* rows */}
    </ul>
  </>
)}`,
    css: `/* a dismiss backdrop as a real button keeps ESC/focus sane */
.notif-badge { min-width: 16px; height: 16px; border-radius: 999px; }`,
  },
  "scroll-progress": {
    react: `// React — progress = scrolled / scrollable, driven by one onScroll
const el = scroller.current;
const max = el.scrollHeight - el.clientHeight;
setProgress(max > 0 ? el.scrollTop / max : 0);

<div ref={scroller} onScroll={handle} className="overflow-y-auto …">
  {content}
</div>
<div style={{ transform: \`scaleX(\${progress})\`, transformOrigin: "left" }}
     className="fixed top-0 left-0 right-0 h-1 origin-left bg-gradient-to-r …" />`,
    css: `/* scaleX is compositor-friendly; avoid width% on every scroll event */
.progress-rail { transform-origin: left; will-change: transform; }`,
  },
  "testimonial-rotator": {
    react: `// React — key the quote block so each change replays its entrance
const [i, setI] = useState(0);
useEffect(() => {
  const t = setInterval(() => setI(v => (v + 1) % QUOTES.length), 5000);
  return () => clearInterval(t);
}, []);

<blockquote key={i} style={{ animation: "rise .4s cubic-bezier(.16,1,.3,1) both" }}>
  “{QUOTES[i].q}”
</blockquote>`,
    css: `/* the reveal key: same animation replays when React swaps the key */
@keyframes rise { from { opacity: 0; transform: translateY(8px); } }
@media (prefers-reduced-motion: reduce) {
  blockquote { animation: none !important; } }`,
  },
  "countdown-drop": {
    react: `// React — store an end timestamp, tick seconds, format once
const end = useRef(Date.now() + 2*86400e3 + 7*3600e3);
useEffect(() => {
  const t = setInterval(() => {
    setLeft(Math.max(0, Math.round((end.current - Date.now()) / 1000)));
  }, 1000);
  return () => clearInterval(t);
}, []);
const d = Math.floor(left/86400), h = Math.floor(left%86400/3600); …`,
    css: `/* flip-in on each digit change — keep it subtle */
.cell span { animation: flipin .4s cubic-bezier(.16,1,.3,1) both; }
@keyframes flipin { from { opacity: 0; transform: translateY(-10px); } }`,
  },
  "terminal-hero": {
    react: `// React — one cursor index advancing on a timer = a typing terminal
const joined = LINES.map(l => l.text).join("\\n");
useEffect(() => {
  if (done) return;
  const t = setTimeout(() => setCount(c => c + 1), 34);
  return () => clearTimeout(t);
}, [count, done]);

<pre aria-label="Terminal demo">
  {joined.slice(0, count)}
  {!done && <span className="caret" />}
</pre>`,
    css: `/* the caret blinks; the screen is a plain <pre> */
.caret { display: inline-block; width: 7px; height: 14px;
        background: #67e8f9; animation: blink 1s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }`,
  },
  "polaroid-stack": {
    react: `// React — order is state; clicking re-inserts at the front
const [order, setOrder] = useState(shots.map((_, i) => i));
const bring = id => setOrder(o => [id, ...o.filter(x => x !== id)]);

{order.map((id, pos) => (
  <button key={id} onClick={() => bring(id)}
    className="absolute inset-0"
    style={{
      transform: \`rotate(\${rot(id)}deg) translateY(\${pos === 0 ? -6 : 0}px)\`,
      zIndex: pos === 0 ? 30 : pos + 1,
      transition: "transform .3s cubic-bezier(.34,1.4,.4,1), filter .2s",
    }}>
    <Photo id={id} />
  </button>
))}`,
    css: `/* fan = per-item rotation from order; lift = hover translate */
.polaroid { position: absolute; inset: 0; transition:
  transform .3s cubic-bezier(.34,1.4,.4,1), filter .2s; }
.polaroid--top { transform: translateY(-6px) scale(1.06); }`,
  },
  "team-spotlight": {
    react: `// React — store one {x,y} per card; render a radial where the cursor is
const [spot, setSpot] = useState({});
<div onMouseMove={e => {
  const r = e.currentTarget.getBoundingClientRect();
  setSpot({ x: (e.clientX - r.left) / r.width * 100,
            y: (e.clientY - r.top) / r.height * 100 });
}} className="relative overflow-hidden">
  <span className="pointer-events-none absolute inset-0" style={{
    background: \`radial-gradient(120px circle at \${spot.x}% \${spot.y}%,
                hsl(258 85% 65% / .28), transparent 65%)\` }} />
  {/* avatar + name + role */}
</div>`,
    css: `/* the light follows the cursor via CSS vars set on the card */
.team-card { --lx: 50%; --ly: 50%; }
.team-card::after { background: radial-gradient(
  120px circle at var(--lx) var(--ly), hsl(258 85% 65% / .25), transparent 65%); }`,
  },
  "combo-box": {
    react: `// React — the filter + keyboard loop, trimmed to the essentials
const [q, setQ] = useState("");
const [act, setAct] = useState(0);
const list = OPTIONS.filter(o =>
  o.label.toLowerCase().includes(q.trim().toLowerCase()));

// on the input:
//   onChange   → setQ(v); setOpen(true)
//   onKeyDown  → ArrowDown: setAct(a => (a + 1) % list.length)
//                Enter: pick(list[act] ?? list[0])
//                Escape: setOpen(false)
// list rows render role="option" + aria-selected; the pick
// commits on click (with onMouseDown preventDefault so blur
// doesn't close the panel first).`,
    css: `/* panel + no-match row stay cheap */
.cb-panel { position: absolute; inset-inline: 0; top: calc(100% + 6px);
  border-radius: 12px; border: 1px solid var(--color-edge);
  background: #0d0f17; box-shadow: 0 24px 60px -20px #000;
  animation: cb-in .14s ease-out both; }
.cb-empty { padding: 12px 14px; font-size: 12px; opacity: .6; }
@keyframes cb-in { from { opacity: 0; transform: translateY(4px) scale(.98) } }`,
  },
  "odometer-counter": {
    react: `// React — each digit cell re-keys on change, so the CSS runs per roll
const str = String(v).padStart(6, "0").split("");
<div className="odometer" role="img" aria-label={\`\${v} copies\`}>
  {str.map((d, i) => (
    <span key={i} className="od-cell">
      <span key={d} className="od-digit">{d}</span>
    </span>
  ))}
</div>
// counting loop: setInterval bumps by target/110 until done`,
    css: `.od-cell { position: relative; overflow: hidden;
  width: 2rem; height: 3rem; border-radius: 8px; background: #0006;
  box-shadow: inset 0 2px 7px #000c, inset 0 -2px 7px #0009; }
.od-digit { display: grid; place-items: center; height: 100%;
  font: 900 1.4rem/1 ui-monospace, monospace;
  animation: od-roll .18s cubic-bezier(.2,.7,.3,1) both; }
@keyframes od-roll { from { transform: translateY(-130%); opacity: 0 } }`,
  },
  "star-rating": {
    react: `// React — one slider element, two star layers, clip by value
<div role="slider" tabIndex={0} aria-valuemin={0} aria-valuemax={5}
     aria-valuenow={v} aria-label="Rating"
     onMouseMove={e => { /* map clientX to 0.5 steps */ }}
     onClick={commit}
     onKeyDown={arrows → v ± 0.5, Home → 0, End → 5}>
  <span className="sr-base">★★★★★</span>
  <span style={{ width: \`\${v / 5 * 100}%\` }} className="sr-fill">★★★★★</span>
</div>`,
    css: `.sr-base { color: rgba(255,255,255,.12); letter-spacing: .12em; }
.sr-fill { position: absolute; inset: 0; overflow: hidden;
  white-space: nowrap; color: #fbbf24; letter-spacing: .12em;
  text-shadow: 0 0 14px rgba(251,191,36,.45); }`,
  },
  "tag-input": {
    react: `// React — chips + one input; Enter commits, backspace pops
const add = (raw) => {
  const t = raw.trim().toLowerCase();
  if (!t || tags.includes(t) || tags.length >= limit) return;
  setTags(p => [...p, t]);
};
// onKeyDown of the input:
//   Enter | "," → preventDefault; add(value); setValue("")
//   Backspace && value === "" → remove last chip
// chips render a × button per tag; animate with a pop keyframe`,
    css: `.tag-chip { display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: 600;
  border: 1px solid color-mix(in srgb, currentColor 30%, transparent);
  animation: tag-pop .18s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes tag-pop { from { transform: scale(.6); opacity: 0 } }`,
  },
  "slider-ticks": {
    react: `// React — native range keeps a11y free; bubble rides the thumb
<input type="range" min={0} max={100} value={v} aria-label="Threshold"
  onChange={e => setV(Number(e.target.value))}
  onPointerDown={() => setDrag(true)}
  onPointerUp={() => setDrag(false)} />
<span className="slider-bubble" style={{ left: \`\${v}%\` }}>
  {v}%
</span>
// ticks are absolute 1px marks at 0/25/50/75/100% under the rail`,
    css: `.slider-bubble { position: absolute; top: 0; transform: translateX(-50%);
  font: 700 10px ui-monospace, monospace; padding: 2px 8px;
  border-radius: 6px; background: var(--color-accent); color: #fff; }
.slider-tick { position: absolute; top: 0; width: 1px; height: 6px;
  background: rgba(255,255,255,.25); transform: translateX(-50%); }`,
  },
  "checkbox-card": {
    react: `// React — cards as checkbox buttons with a drawn check
<button type="button" role="checkbox" aria-checked={on}
  onClick={() => toggle(id)}
  className={on ? "opt-card opt-card--on" : "opt-card"}>
  {/* the drawn check remounts on select so the dash animates */}
  {on && (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12.5 4.5 4.5L19 7.5"
        style={{ strokeDasharray: 14, strokeDashoffset: 14,
                 animation: "check-draw .25s ease-out forwards" }} />
    </svg>
  )}
</button>`,
    css: `.opt-card { border: 1px solid rgba(255,255,255,.08);
  transition: border-color .2s, background .2s, box-shadow .2s; }
.opt-card--on { border-color: color-mix(in srgb, var(--color-mint) 50%, transparent);
  background: color-mix(in srgb, var(--color-mint) 10%, transparent);
  box-shadow: 0 0 24px -8px color-mix(in srgb, var(--color-mint) 40%, transparent); }
@keyframes check-draw { to { stroke-dashoffset: 0 } }`,
  },
  "quantity-stepper": {
    react: `// React — press-and-hold repeat without abusing click
const [hold, setHold] = useState(null);
useEffect(() => {
  if (hold === null) return;
  const t = setInterval(() => setQty(p => clamp(p + hold * step)), 110);
  return () => clearInterval(t);
}, [hold, step]);

// on the − / + buttons:
//   onPointerDown → bump once; setHold(dir)   (start repeat)
//   onPointerUp / onPointerLeave → setHold(null)
//   onKeyDown(Enter|Space) → bump once        (keyboard path)`,
    css: `/* the digit pops on change — key the span by the value */
.stepper-value { animation: mf-pop .16s cubic-bezier(.34,1.56,.64,1) both; }
.step-btn:disabled { opacity: .3; cursor: not-allowed; }`,
  },
  "radio-pills": {
    react: `// React — real radios, visually hidden, styled via peer-checked
<fieldset aria-label="Choose a plan">
  {plans.map((p, i) => (
    <label key={p.name} className="radio-pill">
      <input type="radio" name="plan" value={p.name}
        checked={sel === i} onChange={() => setSel(i)} className="sr-only" />
      <span className="radio-pill-hit">{p.name}</span>
    </label>
  ))}
</fieldset>
// arrow keys work for free (native radios); focus shows via
// focus-within ring on the label — never guess the focus state`,
    css: `.radio-pill:focus-within { outline: 2px solid color-mix(
  in srgb, var(--color-accent) 80%, transparent); outline-offset: 2px; }
.radio-pill-hit:has(~ input:checked) { /* or peer-checked:… */ }`,
  },
  "auto-grow-textarea": {
    react: `// React — grow by re-measuring, then cap the ceiling
const ref = useRef<HTMLTextAreaElement>(null);
const grow = () => {
  const el = ref.current;
  if (!el) return;
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 168) + "px";
};
<textarea ref={ref} onChange={e => { setVal(e.target.value); grow(); }}
  rows={3} className="resize-none" />`,
    css: `/* the counter owns the emotion: amber at 90%, red past zero */
.count--warn { color: var(--color-amber); }
.count--over { color: var(--color-danger); font-weight: 700; }
textarea { overflow: hidden; } /* box grows, no internal scrollbar */`,
  },
  "date-presets": {
    react: `// React — presets are just day counts; custom is a real range
const PRESETS = [
  { id: "7d", label: "7d", days: 7 },
  { id: "30d", label: "30d", days: 30 },
];
// pill row sets the window; the chart and the range caption both
// derive from the same [start, end] — one source of truth, always.`,
    css: `/* pills read as one control: shared rail + accent for the active */
.date-rail { display: flex; gap: 6px; padding: 6px;
  border-radius: 12px; border: 1px solid var(--color-edge); }
.date-pill--on { background: color-mix(in srgb, var(--color-accent-2) 15%, transparent);
  color: #fff; box-shadow: inset 0 1px 0 rgba(255,255,255,.12); }`,
  },
  "file-drop-zone": {
    react: `// React — three states: idle, drag-over, and upload-in-progress
<div role="button" tabIndex={0} aria-label="Upload a file"
  onDragOver={e => { e.preventDefault(); setPhase("over"); }}
  onDragLeave={() => setPhase("idle")}
  onDrop={e => { e.preventDefault(); accept(e.dataTransfer?.files?.[0]); }}
  onClick={() => fileInput.current?.click()}>
  {/* dashed border; drag-over turns it accent + lifts it 1% */}
</div>
// progress: interval of ~90ms; clean up on unmount + phase change`,
    css: `.dropzone { border: 2px dashed rgba(255,255,255,.15); border-radius: 16px;
  transition: border-color .2s, background .2s, transform .2s; }
.dropzone--over { border-color: var(--color-mint);
  background: color-mix(in srgb, var(--color-mint) 8%, transparent);
  transform: scale(1.01); }`,
  },
  "toggle-label-stack": {
    react: `// React — a real switch with a real <label> and description
<button type="button" role="switch" aria-checked={on}
  aria-label={title} onClick={() => toggle(id)}
  className={on ? "switch switch--on" : "switch"}>
  <span className="switch-thumb" />
</button>
// title + description live next to it, in normal text flow —
// a preference nobody can misread`,
    css: `.switch { display: flex; align-items: center; width: 44px; height: 24px;
  border-radius: 99px; padding: 2px; background: rgba(255,255,255,.08);
  border: 1px solid var(--color-edge); transition: background .2s; }
.switch--on { justify-content: flex-end;
  background: linear-gradient(90deg, #8b5cf6, #6366f1);
  border-color: rgba(196,181,253,.5); }
.switch-thumb { width: 18px; height: 18px; border-radius: 50%;
  background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,.4); }`,
  },
  "password-strength": {
    react: `// React — four boolean checks, never a magic heuristic
const score = [pw.length >= 8,
  /[a-z]/.test(pw) && /[A-Z]/.test(pw),
  /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)]
  .filter(Boolean).length;
// segment i is lit when i < score; label maps 0-4 → Too short…Strong
<input type={show ? "text" : "password"} aria-describedby="pw-meter" />`,
    css: `/* segments animate width/colour; the checklist shows the receipt */
.pw-seg { height: 6px; flex: 1; border-radius: 99px;
  background: rgba(255,255,255,.1);
  transition: background .3s; }
.pw-seg--lit { background: var(--pw-color, var(--color-amber)); }`,
  },
  "split-button-menu": {
    react: `// React — the split: one action + a caret that owns the menu
<div className="split">
  <button className="btn btn-primary split-main" onClick={run}>
    Deploy live
  </button>
  <button aria-haspopup="menu" aria-expanded={open}
    onClick={() => setOpen(v => !v)} className="split-caret">
    <svg>{/* chevron, rotates 180° while open */}</svg>
  </button>
  {open && (
    <div role="menu"> {/* absolute below the caret; Escape closes */} </div>
  )}
</div>`,
    css: `.split-main { border-radius: 12px 0 0 12px; }
.split-caret { border-radius: 0 12px 12px 0;
  border-left: 1px solid rgba(255,255,255,.2); }
[role="menu"] { animation: mf-growin .13s ease-out both;
  box-shadow: 0 24px 60px -20px rgba(0,0,0,.9); }`,
  },
  "breadcrumb-trail": {
    react: `// React — collapse to Home / … / current when the trail is long
const shown = full ? crumbs : crumbs.length > 4
  ? [crumbs[0], crumbs[crumbs.length - 2], crumbs[crumbs.length - 1]]
  : crumbs;
// the ellipsis is a real button that flips \`full\` —
// never an inert "…" screen readers can't reach`,
    css: `/* separators come from the list, not the markup:
   each non-last crumb renders its own chevron — no stray edges */
.crumb-arrow { color: var(--color-ink-faint); }
.crumb-current { background: rgba(255,255,255,.08); border-radius: 8px;
  font-weight: 700; }`,
  },
  "pagination-ellipsis": {
    react: `// React — build the visible page set, edges always included
function pages(page, total) {
  const set = new Set([1, 2, total - 1, total, page - 1, page, page + 1]);
  const list = [...set].filter(n => n >= 1 && n <= total).sort((a, b) => a - b);
  const out = [];
  list.forEach((n, i) => {
    if (i > 0 && n - list[i - 1] > 1) out.push("…");
    out.push(n);
  });
  return out;
}
// aria-current="page" on the active button; prev/next disabled at ends`,
    css: `/* the active page holds an accent chip; neighbours stay quiet */
.pg-btn { min-width: 32px; height: 32px; border-radius: 8px;
  font-weight: 700; font-size: 12px; color: var(--color-ink-dim); }
.pg-btn--on { background: linear-gradient(180deg, #8b5cf6, #6366f1);
  color: #fff; box-shadow: 0 6px 14px -6px rgba(124,58,237,.8); }
.pg-gap { color: var(--color-ink-faint); padding-inline: 4px; }`,
  },
  "toc-spine": {
    react: `// React — one scroller, scroll-spy by offset, click glides
const onScroll = () => {
  let cur = sections[0].id;
  for (const s of sections) {
    const n = scroller.current?.querySelector(\`[data-sec="\${s.id}"]\`);
    if (n && n.offsetTop - 24 <= scroller.current.scrollTop) cur = s.id;
  }
  setActive(cur);
};
const jump = (id) => scroller.current?.querySelector(\`[data-sec="\${id}"]\`)
  ?.scrollIntoView({ behavior: "smooth", block: "start" });`,
    css: `/* the rail is a sibling of the article, not an overlay — it
   never covers content, and it's hidden below sm */
.toc-rail { position: sticky; top: 1rem; }
.toc-item--on { background: color-mix(in srgb, var(--color-accent) 15%, transparent);
  color: #fff; }`,
  },
  "tabs-indicator": {
    react: `// React — measure the button, not the container
const btn = btnRefs.current[active];
useEffect(() => {
  if (btn) setInd({ left: btn.offsetLeft, width: btn.offsetWidth });
}, [active]);
// the indicator is a span absolutely positioned on the tablist:
//   style={{ left: ind.left, width: ind.width,
//           transition: "left .28s cubic-bezier(.65,0,.25,1), width .28s" }}
// panels swap on a key so the entrance animation runs per change`,
    css: `/* indicator sits at the border-bottom of the tablist */
.tab-ind { position: absolute; bottom: -1px; height: 2px;
  border-radius: 99px;
  background: linear-gradient(90deg, #22d3ee, #8b5cf6);
  box-shadow: 0 0 10px rgba(34,211,238,.6); }
[role="tab"] { color: var(--color-ink-faint); font-weight: 700; }
[role="tab"][aria-selected="true"] { color: #fff; }`,
  },
  "sticky-subnav": {
    react: `// React — sticky inside the scrolling container, scroll-spy on scroll
<div className="sticky top-0 z-20">
  {sections.map(s => <button aria-current={active === s.id}>…</button>)}
</div>
// jump(): scrollTo({ top: target.offsetTop - 44 }) — 44 ≈ the
// subnav's own height, so the section lands below it`,
    css: `/* the trick is the container: the subnav sticks within it, not
   to the viewport — perfect for an embedded docs pane */
.doc-scroller { overflow-y: auto; position: relative; }
.doc-subnav { position: sticky; top: 0; z-index: 20;
  background: rgba(13,16,23,.95); backdrop-filter: blur(8px); }`,
  },
  "back-to-top": {
    react: `// React — show after a threshold, then smooth-scroll home
const onScroll = () => setShow(el.scrollTop > 130);
const toTop = () => el.scrollTo({ top: 0, behavior: "smooth" });
// opacity + translate on a pointer-events-none wrapper when hidden,
// so the invisible button never eats clicks`,
    css: `.comet { position: fixed; right: 1rem; bottom: 1rem;
  transition: transform .3s, opacity .3s; }
.comet--off { pointer-events: none; transform: translateY(12px);
  opacity: 0; }
html { scroll-behavior: smooth; } /* or scrollTo with behavior */`,
  },
  "disclosure-list": {
    react: `// React — one open at a time is state, not CSS
const toggle = (i) => setOpen(cur => cur === i ? null : i);
<button aria-expanded={open} aria-controls={\`panel-\${i}\`}
  onClick={() => toggle(i)}>
  <svg className={open ? "rotate-45" : ""}>{/* plus icon */}</svg>
</button>
{open && <div id={\`panel-\${i}\`} role="region">…</div>}`,
    css: `/* the plus rotates 45° into a close; panel fades+rises */
.disclosure-icon { transition: transform .2s ease; }
.disclosure-icon--open { transform: rotate(45deg); }
.disclosure-panel { animation: mf-growin .16s ease-out both; }`,
  },
  "fullscreen-overlay-menu": {
    react: `// React — an overlay is a layer, not a page: lock nothing, close freely
{open && (
  <div role="dialog" aria-modal="true" aria-label="Site menu"
    className="fixed inset-0 z-50">
    {/* links stagger in: style={{ animationDelay: i * 30 + 'ms' }} */}
  </div>
)}
// Escape closes via a keydown listener added while open only;
// the hamburger carries aria-expanded so the toggle is unambiguous`,
    css: `.overlay { animation: mf-fade .18s ease-out both;
  background: rgba(6,7,11,.97); backdrop-filter: blur(10px); }
.overlay-link { animation: mf-rise .25s cubic-bezier(.16,1,.3,1) both;
  animation-delay: calc(var(--i, 0) * 30ms); }`,
  },
  "skeleton-card": {
    react: `// React — skeleton until a timeout flips \`loaded\`
useEffect(() => {
  setLoaded(false);
  const t = setTimeout(() => setLoaded(true), delay);
  return () => clearTimeout(t);
}, [delay, replayKey]);
// render skeleton OR content — never both — and hide the bars
// from AT while they are placeholders (aria-hidden)`,
    css: `@keyframes sk-float { from { background-position: 100% 0 }
  to { background-position: -100% 0 } }
.skeleton { background: linear-gradient(90deg,
    rgba(255,255,255,.05) 25%, rgba(255,255,255,.14) 50%,
    rgba(255,255,255,.05) 75%);
  background-size: 200% 100%;
  animation: sk-float 1.1s linear infinite; }`,
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
  "segmented-control": {
    why: "Billing toggles are where users decide; a sliding thumb carries the state change visually without a page jump.",
    skip: "More than 5 options and the segmented idiom breaks — switch to tabs or a select.",
  },
  "notification-bell": {
    why: "The badge count is a promise; mark-all-read and aria-expanded are the parts users (and screen readers) actually feel.",
    idea: "The dropdown is anchored, dismissible via a real backdrop button and announces nothing until opened — politely.",
    skip: "Don't auto-pop the dropdown on page load. Badge, wait for the click.",
  },
  "scroll-progress": {
    why: "Reading progress is the cheapest 'this page respects your time' signal a docs site can ship.",
    idea: "Use scaleX instead of width% on every scroll event — compositor-only, zero layout thrash.",
    skip: "Skip it on marketing pages where the page is shorter than two screens; a near-instant bar reads as broken.",
  },
  "testimonial-rotator": {
    why: "Static quote walls get skipped; a rotator with a stagger reveal makes the third quote discoverable.",
    skip: "Never auto-rotate testimonials carrying hard claims (pricing, legal) — users need time to read without a countdown feeling.",
  },
  "countdown-drop": {
    why: "Real deadlines deserve a real clock. Flip-in digit changes make every passing second visible, which is the entire point of urgency.",
    skip: "Fake urgency is the fastest trust killer in ecommerce. Only count down to a date you will actually honour.",
  },
  "terminal-hero": {
    why: "The AI-tool landing motif usually ships as a 2MB video. A typed DOM terminal tells the same story at ~5 KB and never buffers.",
    idea: "One cursor index advancing on a timer — no per-key DOM, just slice a joined string and let the pre re-render.",
    skip: "If your audience isn't developer-adjacent, a terminal says 'not for me'. Save it for dev tools and APIs.",
  },
  "polaroid-stack": {
    why: "Galleries fail when they feel like grids of thumbnails. A fanned stack with lift-and-front click has the tactility of a real table.",
    idea: "Click-to-front is reordering state, not animation — the CSS transition sells the motion for free.",
    skip: "For portfolios where every image matters equally, an equal grid is more honest. The stack is for a curated few.",
  },
  "team-spotlight": {
    why: "People pages are where the flat, template look is most visible. A cursor light per card makes six boring cards feel like a designed surface.",
    idea: "Each card tracks its own cursor coordinate — one shared handler per card, rendered as a radial gradient.",
    skip: "On touch there's no cursor; keep a gentle static gradient or rely on the hover scale only.",
  },
  "combo-box": {
    why: "Every filter that hides behind a scrollable <select> of forty items is a decision you made for the user. A typed combo box turns that into a two-key interaction.",
    idea: "Keep the option list filtered and the active row visible; Enter picks what the arrows point at, never 'whatever is first'.",
    skip: "For two or three fixed options a select or pills is lighter — don't build a search where there's nothing to search.",
  },
  "odometer-counter": {
    why: "Count-up numbers are everywhere; the odometer's mechanical roll is the version that says 'this number is real and still moving'.",
    idea: "Neighbours sell the illusion: a blurred ghost digit above and below each wheel makes a flat number read as a physical counter.",
    skip: "Reserve wheels for the one hero number. Five odometers on a page read as a slot machine, not a dashboard.",
  },
  "star-rating": {
    why: "Ratings are the one input everyone knows how to use — a slider in disguise that needs zero instruction.",
    idea: "Two stacked star layers with a clipped top layer is simpler and smoother than per-star sprites, and halves the DOM.",
    skip: "If a decision is consequential (a payment review, a content-moderation flag), stars undersell the stakes — use an explicit scale.",
  },
  "tag-input": {
    why: "Free-form metadata entry fails when users must learn a syntax. Chips + Enter teach the pattern in one interaction.",
    idea: "Backspace-on-empty pops the last chip — the one affordance that makes tag lists feel reversible and safe.",
    skip: "If tags come from a fixed taxonomy, a combo box of existing tags beats free typing; you get consistency, not duplicates.",
  },
  "slider-ticks": {
    why: "A bare slider with no marks is a guess; ticks turn it into a measurement.",
    idea: "Let the value bubble ride the thumb only while dragging — a permanently visible bubble becomes noise the user stops reading.",
    skip: "More than six ticks and you're building a ruler; discrete choices deserve segmented controls instead.",
  },
  "checkbox-card": {
    why: "When an option deserves a sentence of explanation, a checkbox row can't carry it — the whole card must be the target.",
    idea: "The drawn checkmark is the feedback that says 'your tap registered' — animate it, don't just change a border.",
    skip: "If the options are mutually exclusive (one plan), that's a radio, not checkboxes — mislabelling the semantics breaks screen readers.",
  },
  "quantity-stepper": {
    why: "Quantity is the rare field where typing is slower than pressing; the stepper turns cart math into two taps.",
    idea: "Long-press repeat is the power feature, but only if releasing stops instantly — pointerup/cancel/leave must all clear the timer.",
    skip: "For quantities over ~30 (inventory, seats, tokens) a stepper is the wrong tool — show a number field with a max hint.",
  },
  "radio-pills": {
    why: "Pills compress a 3–5 option decision into one visual row and still behave like real radios, which is what assistive tech expects.",
    idea: "Hide the native input visually (sr-only) and style the pill from the checked state — you keep native arrow-key behaviour for free.",
    skip: "More than five options and pills become a wall of chips; a vertical radio list reads better and is easier to scan.",
  },
  "auto-grow-textarea": {
    why: "A textarea that scrolls internally the moment you type past two lines is a wall the reader never asked for — growing the field keeps the answer visible as it's being written.",
    idea: "Set height to auto, then to scrollHeight, then cap it — the cap is what stops an essay from pushing the submit button off screen.",
    skip: "For code input or logs, a fixed-height scrolling field is correct — auto-grow there fights muscle memory.",
  },
  "date-presets": {
    why: "Date pickers fail when the common case (last 7/30 days) is hidden behind a calendar widget. Presets put the decision the user actually makes on the surface.",
    idea: "One source of truth for the window: the pills set [start, end], and the caption + chart both derive from it — they can never disagree.",
    skip: "If the range is part of a saved report (“run every month”), presets alone won't do — persist the window as a named schedule.",
  },
  "file-drop-zone": {
    why: "A bare file input is the ugliest control on the web; a drop zone turns upload into a spatial action and previews the consequence.",
    idea: "The drag-over state must be unmistakable — border colour, tint and a 1% scale lift — because drop targets only work when users trust they're aimed right.",
    skip: "Keep the browse fallback always visible: drag-and-drop is a discovery, not a requirement — some people are on touch or in files-first workflows.",
  },
  "toggle-label-stack": {
    why: "A toggle without context is a gamble — the label stack (title + one-line description) turns every switch into an informed decision.",
    idea: "Make the whole row the click target and let the switch announce itself (role=switch + aria-checked). Description text should say what happens when it's on.",
    skip: "Never use a toggle for a destructive or hard-to-reverse action — that's what explicit buttons are for, with a confirm step.",
  },
  "password-strength": {
    why: "Users guess at requirements and get rejected at submit; a live meter moves the feedback to the moment of typing, where it's cheap to fix.",
    idea: "Four binary checks (length, case, digit, symbol) are more honest than a scoring algorithm users can't reverse-engineer — and they double as the checklist.",
    skip: "Show, don't tell, policy: if the site enforces rules, the meter must reflect exactly those rules — a meter that disagrees with the validator is a lie.",
  },
  "split-button-menu": {
    why: "One primary action plus a few rare-but-real alternates is the exact moment a split button earns its complexity — two buttons would fight for the user's eye.",
    idea: "The caret half owns aria-haspopup and aria-expanded; Escape and outside-click close the menu, and every action writes a status line so clicks always land somewhere.",
    skip: "If the menu would hold more than five items, that's not a split button — that's a toolbar with a misplaced dropdown.",
  },
  "breadcrumb-trail": {
    why: "Deep pages without a trail strand users three levels down; breadcrumbs answer “how did I get here and how do I get back” without a back-button gamble.",
    idea: "The ellipsis must be a real control that expands the full trail — collapsed crumbs are only useful if the missing middle is one tap away.",
    skip: "Breadcrumbs are for hierarchies, not history — on a flat site (home → article) they're noise; keep them only where the structure actually nests.",
  },
  "pagination-ellipsis": {
    why: "A 30-page list rendered as 30 buttons is a wall; compression keeps the edges reachable and the middle predictable.",
    idea: "Never let the active page move the window by more than one — build the set around it (page ±1) and let the ellipsis absorb the rest.",
    skip: "If your list has a strong ordering story (newest first, load-more), infinite scroll beats pagination — pages are for findability, not feed.",
  },
  "toc-spine": {
    why: "Long-form pages fail when readers can't see the shape of the argument; a TOC spine restores the map without leaving the page.",
    idea: "Scroll-spy should highlight by offset comparison, not IntersectionObserver callbacks per section — one scroll handler, one loop, no observer churn.",
    skip: "Under ~5 headings a TOC is furniture; only ship the rail when the page genuinely has chapters.",
  },
  "tabs-indicator": {
    why: "Tabs are where 'which am I looking at' matters most; a sliding underline carries the state change instead of a blunt colour swap.",
    idea: "Measure the active button for the indicator position — fixed fractions drift as labels change length and look broken mid-slide.",
    skip: "Never use tabs when every panel must be scannable at once (comparisons) — that's a stacked list, and tabs would hide the difference.",
  },
  "sticky-subnav": {
    why: "Docs and landing pages get long; a subnav that pins keeps the four most important anchors one tap away at all times.",
    idea: "Compensate for the subnav's own height in the jump target — a section that lands hidden under the pinned row is a broken promise.",
    skip: "On pages shorter than two viewports a sticky subnav is dead weight — pinning only pays when there's genuinely more to scroll.",
  },
  "back-to-top": {
    why: "Long scrolls need an exit hatch that isn't 'scroll all the way back up' — especially on mobile where the thumb does the work.",
    idea: "Fade and slide the button in only after a real threshold (a couple of screens); a button visible at the top is noise from second zero.",
    skip: "For feeds and continuous reading (news, social), back-to-top fights the pattern — users expect infinite downward, not a reset.",
  },
  "disclosure-list": {
    why: "Full Q&A lists bury answers under walls of text; a disclosure keeps every question visible and one tap from its answer.",
    idea: "One-open-at-a-time is a state decision, not a CSS trick — it keeps the page height stable and the reader oriented.",
    skip: "If answers are longer than a paragraph, disclosure hides too much — render them as full sections with a TOC instead.",
  },
  "fullscreen-overlay-menu": {
    why: "Some brand moments deserve more than a 320px drawer; a fullscreen takeover turns navigation into the page's first impression.",
    idea: "Staggered link entrances (30ms apart) give the overlay a deliberate rhythm — but keep the total under ~300ms so it never feels slow.",
    skip: "For utility-heavy sites (dashboards, tools) a fullscreen menu hides function behind theatre — save the takeover for marketing surfaces.",
  },
  "skeleton-card": {
    why: "A blank white flash while data loads reads as broken; a skeleton that mirrors the final layout says 'something is coming' and shapes it.",
    idea: "The handoff matters more than the shimmer: swap skeleton → content in one frame with a soft rise, and replay the skeleton when the request re-runs.",
    skip: "If content loads in under ~300ms, a skeleton is slower than nothing — show the real content the moment it's ready and skip the theatre.",
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

      <div className="mt-8 grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.7fr_1fr]">
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
