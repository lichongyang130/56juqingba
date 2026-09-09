import type {
  Asset,
  BackgroundAsset,
  CommunityStat,
  LabTool,
  PromptTemplate,
} from "./types";

/* =====================================================================
   MOTIF UI MVP demo dataset.
   IMPORTANT: every snippet of code, prompt, copy and demo in this file
   is ORIGINAL content produced for Motif UI (no code/text lifted from
   Motion Sites, React Bits, Uiverse, Anime.js or Aceternity UI).
   ===================================================================== */

export const COMPONENTS: Asset[] = [
  // ------------------------------ ELEMENTS ------------------------------
  {
    slug: "prism-switch", kind: "element", title: "Prism Switch",
    description: "A theme-aware toggle that sweeps a six-stop prism gradient across the track on every flip. Pure CSS states, keyboard reachable, announces state to screen readers.",
    tags: ["switch", "toggle", "gradient", "dark"], behaviors: ["click", "hover"],
    stack: ["React", "HTML/CSS"], deps: [], bundleKb: 1.2, themeable: true,
    a11yScore: 98, qualityScore: 96, status: "live", license: "MIT", version: "1.2.0",
    author: "Motif Studio", published: "2026-06-02", demo: "prism-switch",
    props: [
      { name: "size", label: "Size", type: "range", min: 20, max: 64, step: 2, unit: "px", defaultValue: 42 },
      { name: "hueSpeed", label: "Gradient speed", type: "range", min: 0, max: 4, step: 0.1, unit: "s", defaultValue: 1.4 },
      { name: "theme", label: "Theme", type: "toggle", defaultValue: false },
    ],
    copies: 4820, views: 21400,
  },
  {
    slug: "halo-button", kind: "element", title: "Halo Button",
    description: "Primary button with a mouse-tracking halo, press ripple and a springy scale. Ships as React + Tailwind or dependency-free HTML/CSS.",
    tags: ["button", "magnetic", "hover", "cursor"], behaviors: ["hover", "click", "drag"],
    stack: ["React", "HTML/CSS"], deps: [], bundleKb: 2.1, themeable: true,
    a11yScore: 96, qualityScore: 94, status: "live", license: "MIT", version: "1.1.0",
    author: "Motif Studio", published: "2026-06-18", demo: "halo-button",
    props: [
      { name: "magnet", label: "Magnet strength", type: "range", min: 0, max: 60, step: 1, defaultValue: 24 },
      { name: "glow", label: "Halo glow", type: "range", min: 0, max: 100, step: 1, unit: "%", defaultValue: 70 },
    ],
    copies: 3910, views: 17300,
  },
  {
    slug: "pulse-loader", kind: "element", title: "Pulse Loader",
    description: "Three-note loader with staggered radial pulse and optional progress text. Reduced-motion safe and tiny — 0.8 KB gzipped.",
    tags: ["loader", "loading", "spinner"], behaviors: [],
    stack: ["HTML/CSS", "React"], deps: [], bundleKb: 0.8, themeable: true,
    a11yScore: 99, qualityScore: 93, status: "live", license: "MIT", version: "1.0.3",
    author: "Motif Studio", published: "2026-05-28", demo: "pulse-loader",
    props: [
      { name: "speed", label: "Pulse speed", type: "range", min: 0.2, max: 2.4, step: 0.05, unit: "s", defaultValue: 1 },
      { name: "dots", label: "Dots", type: "range", min: 1, max: 8, step: 1, defaultValue: 3 },
    ],
    copies: 5220, views: 19800,
  },
  {
    slug: "nav-dock", kind: "element", title: "Nav Dock",
    description: "MacOS-style magnification dock rebuilt with spring easing, keyboard support and zero external deps. Resizes neighbours smoothly on hover.",
    tags: ["dock", "navigation", "spring"], behaviors: ["hover"],
    stack: ["React"], deps: [], bundleKb: 4.4, themeable: true,
    a11yScore: 95, qualityScore: 92, status: "live", license: "MIT", version: "1.0.1",
    author: "Motif Studio", published: "2026-07-01", demo: "nav-dock",
    props: [
      { name: "magnify", label: "Magnification", type: "range", min: 1, max: 3, step: 0.1, unit: "×", defaultValue: 1.8 },
    ],
    copies: 2740, views: 11200,
  },

  // ------------------------------ ANIMATED ------------------------------
  {
    slug: "aurora-veil", kind: "animated", title: "Aurora Veil",
    description: "Layered mesh of drifting colour fields behind a fine grain veil. Built on GPU-composited CSS gradients — a 60 fps full-page backdrop at 0 JS.",
    tags: ["background", "aurora", "gradient", "hero"], behaviors: ["scroll"],
    stack: ["HTML/CSS", "React"], deps: [], bundleKb: 2.6, themeable: true,
    a11yScore: 100, qualityScore: 97, status: "live", license: "MIT", version: "2.0.0",
    author: "Motif Studio", published: "2026-06-25", demo: "aurora-veil",
    props: [
      { name: "hueA", label: "Hue A", type: "range", min: 0, max: 360, step: 1, defaultValue: 262 },
      { name: "hueB", label: "Hue B", type: "range", min: 0, max: 360, step: 1, defaultValue: 192 },
      { name: "speed", label: "Drift speed", type: "range", min: 4, max: 60, step: 1, unit: "s", defaultValue: 18 },
      { name: "grain", label: "Grain", type: "toggle", defaultValue: true },
    ],
    copies: 8940, views: 41100,
  },
  {
    slug: "halo-trail", kind: "animated", title: "Halo Trail",
    description: "Cursor trail of fading halos that also reacts to pressed state — an attention magnet for product demos. Pointer-events transparent, fully throttled.",
    tags: ["cursor", "pointer", "trail"], behaviors: ["drag", "hover"],
    stack: ["React"], deps: [], bundleKb: 5.8, themeable: true,
    a11yScore: 93, qualityScore: 95, status: "live", license: "MIT", version: "1.4.2",
    author: "Motif Studio", published: "2026-06-09", demo: "halo-trail",
    props: [
      { name: "count", label: "Halos", type: "range", min: 4, max: 40, step: 1, defaultValue: 18 },
      { name: "size", label: "Max size", type: "range", min: 40, max: 260, step: 5, unit: "px", defaultValue: 140 },
      { name: "glow", label: "Glow", type: "range", min: 0, max: 1, step: 0.05, defaultValue: 0.8 },
    ],
    copies: 6330, views: 26800,
  },
  {
    slug: "orbit-deck", kind: "animated", title: "Orbit Deck",
    description: "A 3D ring of cards/badges orbiting a focal chip with depth-of-field blur. Pause on hover, tilt with drag, auto-rotate for ambient showcase.",
    tags: ["orbit", "3d", "showcase", "gallery"], behaviors: ["drag", "scroll"],
    stack: ["React"], deps: ["motion"], bundleKb: 9.7, themeable: true,
    a11yScore: 92, qualityScore: 96, status: "live", license: "MIT", version: "1.1.0",
    author: "Motif Studio", published: "2026-07-08", demo: "orbit-deck",
    props: [
      { name: "radius", label: "Radius", type: "range", min: 90, max: 300, step: 5, unit: "px", defaultValue: 190 },
      { name: "orbit", label: "Orbit speed", type: "range", min: 2, max: 30, step: 1, unit: "s", defaultValue: 14 },
      { name: "tilt", label: "Drag tilt", type: "toggle", defaultValue: true },
    ],
    copies: 4210, views: 18700,
  },
  {
    slug: "star-motes", kind: "animated", title: "Star Motes",
    description: "Three-layer parallax starfield with twinkle variance and pointer drift. Canvas-free version included for quiet brand sites; WebGL tier for dense scenes.",
    tags: ["stars", "sky", "particles", "background"], behaviors: ["scroll"],
    stack: ["React", "HTML/CSS"], deps: [], bundleKb: 3.4, themeable: true,
    a11yScore: 97, qualityScore: 95, status: "live", license: "MIT", version: "1.3.0",
    author: "Motif Studio", published: "2026-05-30", demo: "star-motes",
    props: [
      { name: "density", label: "Density", type: "range", min: 10, max: 300, step: 5, defaultValue: 120 },
      { name: "parallax", label: "Pointer parallax", type: "toggle", defaultValue: true },
      { name: "twinkle", label: "Twinkle", type: "toggle", defaultValue: true },
    ],
    copies: 7150, views: 30300,
  },
  {
    slug: "scramble-text", kind: "animated", title: "Scramble Text",
    description: "Headline that decodes from noise glyphs to final copy on view and re-scrambles per hover. Great for portfolio keywords; respects reduced motion.",
    tags: ["text", "reveal", "type"], behaviors: ["scroll", "hover"],
    stack: ["React", "HTML/CSS"], deps: [], bundleKb: 3.1, themeable: true,
    a11yScore: 98, qualityScore: 94, status: "live", license: "MIT", version: "1.0.0",
    author: "Motif Studio", published: "2026-07-12", demo: "scramble-text",
    props: [
      { name: "speed", label: "Decode speed", type: "range", min: 10, max: 200, step: 5, unit: "ms", defaultValue: 55 },
      { name: "charset", label: "Glyph richness", type: "range", min: 1, max: 3, step: 1, defaultValue: 2 },
    ],
    copies: 5580, views: 22100,
  },
  {
    slug: "tilt-card", kind: "animated", title: "Tilt Card",
    description: "Perspective card with a light-spot that tracks the cursor and an edge that glows at tilt extremes. The classic 'premium card' — original implementation.",
    tags: ["card", "3d", "spotlight", "cursor"], behaviors: ["hover"],
    stack: ["React", "HTML/CSS"], deps: [], bundleKb: 2.9, themeable: true,
    a11yScore: 94, qualityScore: 97, status: "live", license: "MIT", version: "2.1.0",
    author: "Motif Studio", published: "2026-06-30", demo: "tilt-card",
    props: [
      { name: "maxTilt", label: "Max tilt", type: "range", min: 2, max: 40, step: 1, unit: "deg", defaultValue: 16 },
      { name: "spot", label: "Spotlight", type: "toggle", defaultValue: true },
    ],
    copies: 10240, views: 44700,
  },

  // ------------------------------ SECTIONS ------------------------------
  {
    slug: "hero-aurora", kind: "section", title: "Aurora Hero Section",
    description: "Full-viewport hero: aurora veil backdrop, scramble headline, dual CTAs and a floating product chip — the section most Prompt users ask for first.",
    tags: ["hero", "section", "landing"], behaviors: ["scroll", "hover"],
    stack: ["React", "HTML/CSS"], deps: [], bundleKb: 6.2, themeable: true,
    a11yScore: 97, qualityScore: 96, status: "live", license: "MIT", version: "1.0.0",
    author: "Motif Studio", published: "2026-07-14", demo: "hero-aurora",
    props: [
      { name: "animation", label: "Ambient animation", type: "select", options: ["aurora", "motes", "none"], defaultValue: "aurora" },
    ],
    copies: 4860, views: 19600,
  },
  {
    slug: "bento-studio", kind: "section", title: "Bento Studio Grid",
    description: "Six-cell bento with organic spans, an embedded mini orbit, hover expand and skeleton-safe loading. Cells accept any card content via props.",
    tags: ["bento", "grid", "features"], behaviors: ["hover"],
    stack: ["React"], deps: [], bundleKb: 5.5, themeable: true,
    a11yScore: 96, qualityScore: 95, status: "live", license: "MIT", version: "1.1.1",
    author: "Motif Studio", published: "2026-07-05", demo: "bento-studio",
    props: [
      { name: "cells", label: "Cells", type: "range", min: 3, max: 9, step: 1, defaultValue: 6 },
      { name: "expand", label: "Hover expand", type: "toggle", defaultValue: true },
    ],
    copies: 3960, views: 15400,
  },
  {
    slug: "marquee-logos", kind: "section", title: "Marquee Logo Belt",
    description: "Edgeless infinite logo belt with pause-on-hover and direction props. Ships with a 12-logo placeholder set you can swap via one array.",
    tags: ["marquee", "logos", "social-proof"], behaviors: ["hover"],
    stack: ["React", "HTML/CSS"], deps: [], bundleKb: 1.8, themeable: true,
    a11yScore: 99, qualityScore: 92, status: "live", license: "MIT", version: "1.0.2",
    author: "Motif Studio", published: "2026-06-21", demo: "marquee-logos",
    props: [
      { name: "speed", label: "Speed", type: "range", min: 8, max: 80, step: 1, unit: "s", defaultValue: 32 },
    ],
    copies: 3240, views: 12900,
  },
  {
    slug: "faq-orbit", kind: "section", title: "FAQ Accordion Pro",
    description: "Accessible accordion with smooth height animation, open-state glyph morph and sticky question column on wide screens.",
    tags: ["faq", "accordion", "section"], behaviors: ["click"],
    stack: ["React", "HTML/CSS"], deps: [], bundleKb: 3.7, themeable: true,
    a11yScore: 99, qualityScore: 93, status: "live", license: "MIT", version: "1.0.0",
    author: "Motif Studio", published: "2026-07-20", demo: "faq-orbit",
    props: [],
    copies: 2180, views: 9100,
  },

  // ------------------------------ TEMPLATES ------------------------------
  {
    slug: "saas-launch", kind: "template", title: "SaaS Launch Page",
    description: "Complete 8-section launch page: nav, aurora hero, bento features, live demo strip, pricing toggle, FAQ, CTA and footer. React + Tailwind, one install.",
    tags: ["saas", "template", "landing", "pricing"], behaviors: ["scroll", "click"],
    stack: ["React"], deps: [], bundleKb: 24.0, themeable: true,
    a11yScore: 97, qualityScore: 97, status: "featured" as Asset["status"], license: "MIT", version: "1.0.0",
    author: "Motif Studio", published: "2026-07-26", demo: "hero-aurora",
    props: [
      { name: "sections", label: "Sections included", type: "range", min: 4, max: 9, step: 1, defaultValue: 8 },
    ],
    copies: 1680, views: 12400,
  },
  {
    slug: "agency-showcase", kind: "template", title: "Agency Showcase",
    description: "Editorial-styled agency site: splash grid, case-study cards with tilt, team bento and a marquee of client marks. Original typographic system included.",
    tags: ["agency", "portfolio", "template"], behaviors: ["scroll", "hover"],
    stack: ["React", "HTML/CSS"], deps: [], bundleKb: 21.3, themeable: true,
    a11yScore: 95, qualityScore: 95, status: "live", license: "MIT", version: "0.9.2",
    author: "Motif Studio", published: "2026-07-30", demo: "orbit-deck",
    props: [],
    copies: 1120, views: 8600,
  },

  /* ---- content-richness pass: context-stage demos (2026-09) ---- */
  {
    slug: "morph-blob", kind: "animated", title: "Morph Blob",
    description: "A liquid shape that melts between silhouettes while a hue drifts underneath. Use it as a brand mark backdrop or a section divider that never sits still.",
    tags: ["blob", "organic", "svg", "ambient"], behaviors: [],
    stack: ["HTML/CSS", "React"], deps: [], bundleKb: 2.3, themeable: true,
    a11yScore: 99, qualityScore: 96, status: "live", license: "MIT", version: "1.0.0",
    author: "Motif Studio", published: "2026-09-06", demo: "morph-blob",
    props: [
      { name: "speed", label: "Morph speed", type: "range", min: 4, max: 20, step: 0.5, unit: "s", defaultValue: 9 },
      { name: "hueA", label: "Hue A", type: "range", min: 0, max: 360, step: 1, defaultValue: 258 },
      { name: "hueB", label: "Hue B", type: "range", min: 0, max: 360, step: 1, defaultValue: 192 },
    ],
    copies: 1860, views: 9400,
  },
  {
    slug: "conic-loader", kind: "element", title: "Conic Loader",
    description: "A conic-gradient ring with a breath marker — no images, no JS tick. Use it wherever a spinner should feel like a product decision, not a default.",
    tags: ["loader", "conic", "spinner"], behaviors: [],
    stack: ["HTML/CSS"], deps: [], bundleKb: 0.9, themeable: true,
    a11yScore: 98, qualityScore: 95, status: "live", license: "MIT", version: "1.0.0",
    author: "Motif Studio", published: "2026-09-04", demo: "conic-loader",
    props: [
      { name: "size", label: "Size", type: "range", min: 40, max: 160, step: 2, unit: "px", defaultValue: 96 },
      { name: "speed", label: "Spin speed", type: "range", min: 0.4, max: 3, step: 0.05, unit: "s", defaultValue: 1 },
    ],
    copies: 1430, views: 7600,
  },
  {
    slug: "glass-pricing", kind: "section", title: "Glass Pricing Trio",
    description: "Three pricing columns in frosted glass with a specular top edge and a hero column that glows. The whole row demos how glass survives real content: badges, numbers and buttons.",
    tags: ["pricing", "glass", "section", "bento"], behaviors: ["hover"],
    stack: ["React", "HTML/CSS"], deps: [], bundleKb: 6.8, themeable: true,
    a11yScore: 96, qualityScore: 97, status: "live", license: "MIT", version: "1.0.0",
    author: "Motif Studio", published: "2026-09-08", demo: "glass-pricing",
    props: [
      { name: "tiers", label: "Tiers", type: "range", min: 2, max: 4, step: 1, defaultValue: 3 },
      { name: "heroGlow", label: "Hero column glow", type: "toggle", defaultValue: true },
    ],
    copies: 1170, views: 6900,
  },
  {
    slug: "wipe-reveal", kind: "animated", title: "Wipe Reveal Headline",
    description: "A giant headline that wipes in with a travelling light edge, then sits still as clean typography. Nothing to babysit after the first paint.",
    tags: ["text", "reveal", "headline", "gradient"], behaviors: ["scroll"],
    stack: ["HTML/CSS", "React"], deps: [], bundleKb: 1.6, themeable: true,
    a11yScore: 97, qualityScore: 96, status: "live", license: "MIT", version: "1.1.0",
    author: "Motif Studio", published: "2026-09-08", demo: "wipe-reveal",
    props: [
      { name: "loop", label: "Loop", type: "toggle", defaultValue: true },
      { name: "speed", label: "Wipe speed", type: "range", min: 0.4, max: 3, step: 0.1, unit: "s", defaultValue: 1.1 },
    ],
    copies: 2210, views: 11300,
  },
  {
    slug: "counter-stats", kind: "section", title: "Counter Stats Band",
    description: "Numbers that count up when they enter the viewport, with a hairline ledger behind them. The accounting-style baseline keeps the counting from feeling gimmicky.",
    tags: ["stats", "counter", "metrics", "section"], behaviors: ["scroll"],
    stack: ["React", "HTML/CSS"], deps: [], bundleKb: 3.2, themeable: true,
    a11yScore: 98, qualityScore: 96, status: "live", license: "MIT", version: "1.0.0",
    author: "Motif Studio", published: "2026-09-01", demo: "counter-stats",
    props: [
      { name: "duration", label: "Count duration", type: "range", min: 400, max: 3000, step: 50, unit: "ms", defaultValue: 1400 },
    ],
    copies: 980, views: 5200,
  },
  {
    slug: "dot-draw", kind: "element", title: "Dot Draw Grid",
    description: "A fine dot matrix where each column fills upward as your pointer crosses it — like a tiny seismograph. Delightful on 404 pages and section gaps.",
    tags: ["interactive", "dots", "pointer", "canvas"], behaviors: ["hover", "drag"],
    stack: ["React"], deps: [], bundleKb: 4.9, themeable: true,
    a11yScore: 94, qualityScore: 95, status: "live", license: "MIT", version: "1.0.0",
    author: "Motif Studio", published: "2026-08-31", demo: "dot-draw",
    props: [
      { name: "resolution", label: "Dot resolution", type: "range", min: 6, max: 40, step: 1, defaultValue: 18 },
      { name: "palette", label: "Palette", type: "select", options: ["violet", "cyan", "sunset", "mono"], defaultValue: "violet" },
    ],
    copies: 2050, views: 9900,
  },

  /* ---- context pass 2: 6 more original scenes (2026-09-09) ---- */
  {
    slug: "text-cycle", kind: "animated", title: "Text Cycle Hero Line",
    description: "A headline that swaps its second line between rotating phrases with a smooth vertical roll and progress dots. The pattern that makes SaaS heroes feel alive without autoplay video.",
    tags: ["text", "headline", "rotation", "hero"], behaviors: [],
    stack: ["React", "HTML/CSS"], deps: [], bundleKb: 1.4, themeable: true,
    a11yScore: 99, qualityScore: 96, status: "live", license: "MIT", version: "1.0.0",
    author: "Motif Studio", published: "2026-09-09", demo: "text-cycle",
    props: [],
    copies: 940, views: 6100,
  },
  {
    slug: "tab-morph", kind: "element", title: "Tab Morph Pill",
    description: "Four tabs under a pill header where the active thumb slides on a spring curve — each label can mount a completely different panel without breaking the rhythm.",
    tags: ["tabs", "navigation", "slider"], behaviors: ["click"],
    stack: ["HTML/CSS", "React"], deps: [], bundleKb: 2.0, themeable: true,
    a11yScore: 97, qualityScore: 95, status: "live", license: "MIT", version: "1.0.0",
    author: "Motif Studio", published: "2026-09-09", demo: "tab-morph",
    props: [
      { name: "count", label: "Tabs", type: "range", min: 2, max: 6, step: 1, defaultValue: 4 },
    ],
    copies: 830, views: 5400,
  },
  {
    slug: "flip-card", kind: "animated", title: "Flip Card Duo",
    description: "A 3D card that turns on click or tap (not hover) — the interaction model survives touch. Front for the promise, back for the details.",
    tags: ["3d", "flip", "card", "interactive"], behaviors: ["click"],
    stack: ["HTML/CSS", "React"], deps: [], bundleKb: 1.7, themeable: true,
    a11yScore: 96, qualityScore: 96, status: "live", license: "MIT", version: "1.0.0",
    author: "Motif Studio", published: "2026-09-08", demo: "flip-card",
    props: [],
    copies: 1160, views: 7200,
  },
  {
    slug: "skeleton-shimmer", kind: "element", title: "Skeleton Profile Feed",
    description: "A profile-card skeleton with a directional shimmer sweep and staggered line widths — the loading state people actually see, designed instead of defaulted.",
    tags: ["skeleton", "loading", "shimmer", "context"], behaviors: [],
    stack: ["HTML/CSS", "React"], deps: [], bundleKb: 1.9, themeable: true,
    a11yScore: 99, qualityScore: 94, status: "live", license: "MIT", version: "1.0.0",
    author: "Motif Studio", published: "2026-09-07", demo: "skeleton-shimmer",
    props: [
      { name: "speed", label: "Shimmer speed", type: "range", min: 0.6, max: 4, step: 0.1, unit: "s", defaultValue: 1.8 },
    ],
    copies: 750, views: 4800,
  },
  {
    slug: "chart-card", kind: "section", title: "Momentum Chart Card",
    description: "A live-feeling analytics card: bars rise on entry with per-bar stagger, legend explains the two series, and the whole card stays legible at 300px wide.",
    tags: ["chart", "analytics", "stats", "dashboard"], behaviors: ["scroll"],
    stack: ["React", "HTML/CSS"], deps: [], bundleKb: 3.6, themeable: true,
    a11yScore: 96, qualityScore: 95, status: "live", license: "MIT", version: "1.0.0",
    author: "Motif Studio", published: "2026-09-06", demo: "chart-card",
    props: [
      { name: "bars", label: "Bars", type: "range", min: 6, max: 16, step: 1, defaultValue: 12 },
    ],
    copies: 890, views: 5700,
  },
  {
    slug: "avatar-stack", kind: "element", title: "Avatar Crowd Stack",
    description: "Overlapping avatars that part like a crowd when you hover a face — then settle back. The social-proof classic, minus the static feel.",
    tags: ["avatar", "stack", "social", "hover"], behaviors: ["hover"],
    stack: ["React"], deps: [], bundleKb: 3.0, themeable: true,
    a11yScore: 95, qualityScore: 96, status: "live", license: "MIT", version: "1.0.0",
    author: "Motif Studio", published: "2026-09-05", demo: "avatar-stack",
    props: [
      { name: "count", label: "Avatars", type: "range", min: 2, max: 8, step: 1, defaultValue: 5 },
      { name: "size", label: "Size", type: "range", min: 28, max: 72, step: 2, unit: "px", defaultValue: 40 },
    ],
    copies: 1320, views: 8100,
  },
];

export const KIND_META: Record<Asset["kind"], { label: string; blurb: string }> = {
  element: { label: "Elements", blurb: "Micro UI atoms — buttons, toggles, loaders, docks." },
  animated: { label: "Animated", blurb: "Signature motion components and living backgrounds." },
  section: { label: "Sections", blurb: "Heroes, bentos, pricing, FAQs — drop-in page blocks." },
  template: { label: "Templates", blurb: "Whole pages composed from the library, ready to rebrand." },
};

export const PROMPTS: PromptTemplate[] = [
  {
    slug: "dark-saas-pricing-launch",
    title: "Dark SaaS launch page with aurora hero",
    industry: "SaaS", vibe: "dark, premium, minimal", stacks: ["Next.js", "HTML", "React"],
    blocks: ["Nav", "Hero", "Bento features", "Pricing", "FAQ", "CTA", "Footer"],
    status: "featured", avgFidelity: 92, bestModel: "Claude 4.6 Sonnet",
    runs: [
      { model: "Claude 4.6 Sonnet", date: "2026-08-04", fidelity: 95, buildError: false, notes: "Matches reference spacing almost 1:1; fonts swapped gracefully." },
      { model: "Codex", date: "2026-08-04", fidelity: 91, buildError: false, notes: "Solid. Needed one nudge to enable the toggle pricing." },
      { model: "GLM-4.6 (CN)", date: "2026-08-05", fidelity: 90, buildError: true, notes: "First build threw a Tailwind class typo; fixed on the suggested retry." },
    ],
    promptBody: `Build a one-page dark SaaS landing in Next.js + Tailwind.\n• Palette: near-black #07080B canvas, white ink, violet→cyan aurora accents (hex given in tokens).\n• Hero: full-viewport, animated aurora backdrop, 48px display headline, sub-copy, two CTAs (primary gradient, ghost).\n• Below the fold: 6-cell bento features, one cell holds a mini live terminal mock.\n• Pricing: monthly/annual toggle that animates price numbers; 3 tiers, middle highlighted.\n• FAQ accordion + final CTA band + minimal footer.\n• Respect reduced-motion; all colours via CSS variables so I can re-theme.`,
    author: "Motif Studio", published: "2026-08-04",
  },
  {
    slug: "3d-portfolio-neon",
    title: "3D portfolio with neon orbit showcase",
    industry: "Portfolio", vibe: "bold, 3D, neon", stacks: ["Next.js", "React"],
    blocks: ["Hero", "Orbit gallery", "Work grid", "Contact"],
    status: "verified", avgFidelity: 87, bestModel: "Codex",
    runs: [
      { model: "Codex", date: "2026-07-29", fidelity: 91, buildError: false, notes: "Orbit ring implemented with spring physics — great feel." },
      { model: "Claude 4.6 Sonnet", date: "2026-07-29", fidelity: 85, buildError: false, notes: "Accurate but used heavier 3D lib than asked; suggested lighter swap." },
      { model: "GLM-4.6 (CN)", date: "2026-07-30", fidelity: 86, buildError: true, notes: "Worked after one dependency version fix." },
    ],
    promptBody: `Design a portfolio hero that feels like a neon gallery.\n• Left: name + role in large display type with subtle scramble reveal.\n• Right: a 3D orbit of 6 case-study cards around a glowing focal sphere; drag to tilt, hover pauses.\n• Neon violet/cyan on near-black; add fine grid backdrop fading after 60vh.\n• Below: 2×2 case grid, each card tilt-on-hover with case meta.\n• Keep bundle lean — CSS transforms and a tiny spring lib only.`,
    author: "Motif Studio", published: "2026-07-29",
  },
  {
    slug: "fintech-trust-page",
    title: "Fintech trust page (compliance tone)",
    industry: "Fintech", vibe: "calm, trustworthy, crisp", stacks: ["Next.js", "HTML"],
    blocks: ["Hero", "Security bento", "Metrics", "FAQ"],
    status: "verified", avgFidelity: 89, bestModel: "Claude 4.6 Sonnet",
    runs: [
      { model: "Claude 4.6 Sonnet", date: "2026-08-01", fidelity: 92, buildError: false, notes: "Excellent typographic hierarchy for legal-adjacent copy." },
      { model: "GLM-4.6 (CN)", date: "2026-08-01", fidelity: 88, buildError: false, notes: "Very close; metric band needed re-spacing." },
      { model: "Codex", date: "2026-08-02", fidelity: 87, buildError: false, notes: "Good. Used over-the-top gradients; prompted restraint pass." },
    ],
    promptBody: `A fintech page that earns trust, not hype.\n• Off-white paper background, ink navy text, single restrained accent (deep blue).\n• Hero: headline about security + one stat line; no auto-playing motion.\n• Security section: 4 cards (encryption, audits, uptime, compliance) with small SVG icons.\n• Metrics band with count-up numbers on view.\n• FAQ and a short "how we protect you" timeline.\n• Typography-forward; generous whitespace; WCAG AA everywhere.`,
    author: "Motif Studio", published: "2026-08-01",
  },
  {
    slug: "wellness-soft-flow",
    title: "Wellness brand with soft flowing visuals",
    industry: "Wellness", vibe: "soft, organic, airy", stacks: ["HTML", "Next.js"],
    blocks: ["Hero", "Ritual steps", "Testimonials", "Newsletter"],
    status: "verified", avgFidelity: 90, bestModel: "Claude 4.6 Sonnet",
    runs: [
      { model: "Claude 4.6 Sonnet", date: "2026-07-24", fidelity: 93, buildError: false, notes: "Captured the organic blob language beautifully." },
      { model: "GLM-4.6 (CN)", date: "2026-07-25", fidelity: 89, buildError: false, notes: "Strong; gradient stops slightly off on one section." },
      { model: "Codex", date: "2026-07-25", fidelity: 88, buildError: false, notes: "Solid overall; blobs felt more geometric than organic." },
    ],
    promptBody: `A wellness landing that feels like morning light.\n• Cream/sand base; sage + peach accents; no pure black anywhere.\n• Hero: oversized serif headline, organic blob illustration drifting slowly behind.\n• "A 3-step ritual" section with numbered steps and soft line-drawn connectors.\n• Testimonials as gentle cards, quotes in italic serif.\n• Newsletter band with a rounded pill input.\n• Every animation 2–4s, ease-out, subtle — spa pace, not arcade pace.`,
    author: "Motif Studio", published: "2026-07-24",
  },
  {
    slug: "ecommerce-drop-neon",
    title: "Sneaker drop page with 3D product spin",
    industry: "Ecommerce", vibe: "street, energetic", stacks: ["Next.js"],
    blocks: ["Drop countdown", "Product 3D", "Sizes", "Checkout band"],
    status: "beta", avgFidelity: 82, bestModel: "Codex",
    runs: [
      { model: "Codex", date: "2026-08-08", fidelity: 86, buildError: true, notes: "3D view needed asset rigging docs; retry with CDN model passed." },
      { model: "Claude 4.6 Sonnet", date: "2026-08-08", fidelity: 81, buildError: false, notes: "Layout faithful; 3D spin was CSS-only fallback." },
    ],
    promptBody: `Sneaker drop page with a street-energy feel.\n• Hero: giant drop date countdown in display type over a grainy dark photo zone.\n• Product stage: an auto-spinning 3D sneaker on drag-rotate; placeholder glb with instructions.\n• Size picker as pill grid; sold-out sizes muted.\n• Sticky bottom band with price + "Notify me".\n• Neon accents (lime/violet) on charcoal.`,
    author: "Motif Studio", published: "2026-08-08",
  },
  {
    slug: "agency-case-studies",
    title: "Agency site with editorial case studies",
    industry: "Agency", vibe: "editorial, confident", stacks: ["React", "Next.js"],
    blocks: ["Splash grid", "Case studies", "Team", "Contact"],
    status: "verified", avgFidelity: 91, bestModel: "GLM-4.6 (CN)",
    runs: [
      { model: "GLM-4.6 (CN)", date: "2026-07-18", fidelity: 93, buildError: false, notes: "Superb layout rhythm; big index numerals done right." },
      { model: "Claude 4.6 Sonnet", date: "2026-07-18", fidelity: 91, buildError: false, notes: "Great. Small fidelity gap in hover states." },
      { model: "Codex", date: "2026-07-19", fidelity: 89, buildError: false, notes: "Strong overall; requested one pass to add texture." },
    ],
    promptBody: `An agency site that reads like a printed annual report.\n• Off-white paper; black ink; one saturated accent (international orange).\n• Hero: oversized index of selected works (01–06) instead of a stock banner.\n• Case pages: 12-col editorial grid, big pull quotes, thin rules.\n• Team: portrait list with role + socials, no grid-boxes — open layout.\n• Footer with a huge wordmark that crops at the fold.\n• Only motion: subtle parallax on case images + menu reveal.`,
    author: "Motif Studio", published: "2026-07-18",
  },
  {
    slug: "ai-tool-community",
    title: "AI tool landing with terminal motif",
    industry: "AI", vibe: "technical, confident", stacks: ["Next.js", "HTML"],
    blocks: ["Hero", "Terminal demo", "Pricing", "API docs teaser"],
    status: "featured", avgFidelity: 93, bestModel: "Codex",
    runs: [
      { model: "Codex", date: "2026-08-10", fidelity: 95, buildError: false, notes: "Terminal animation was exact — typed commands, blinking caret." },
      { model: "Claude 4.6 Sonnet", date: "2026-08-10", fidelity: 92, buildError: false, notes: "Excellent; one retheme of the terminal palette." },
      { model: "GLM-4.6 (CN)", date: "2026-08-11", fidelity: 91, buildError: false, notes: "Very close on first pass." },
    ],
    promptBody: `Landing for a developer-first AI tool.\n• Near-black canvas with subtle grid; mono-font code accents.\n• Hero left: headline + install snippet with copy button. Hero right: animated terminal typing a real workflow.\n• "Why us" bento: speed, privacy, cost — each cell has a small live chart or meter.\n• Usage-based pricing table with a slider that recomputes the estimate.\n• Footer linking to API docs; tone: precise, no marketing fluff.`,
    author: "Motif Studio", published: "2026-08-10",
  },
  {
    slug: "travel-guide-lush",
    title: "Travel guide with lush imagery system",
    industry: "Travel", vibe: "warm, immersive", stacks: ["HTML", "React"],
    blocks: ["Hero", "Regions", "Itinerary", "Journal"],
    status: "verified", avgFidelity: 88, bestModel: "Claude 4.6 Sonnet",
    runs: [
      { model: "Claude 4.6 Sonnet", date: "2026-07-11", fidelity: 90, buildError: false, notes: "Image treatment guidance produced gorgeous consistent crops." },
      { model: "Codex", date: "2026-07-11", fidelity: 87, buildError: false, notes: "Clean; requested warmer palette pass." },
      { model: "GLM-4.6 (CN)", date: "2026-07-12", fidelity: 86, buildError: false, notes: "Good. Itinerary line graphic simplified on its own." },
    ],
    promptBody: `A travel guide microsite with a magazine feel.\n• Hero: full-bleed image with gradient scrim, serif place name in display type.\n• Region cards: uniform 4:5 crops, hover reveals quick facts.\n• "7-day itinerary" as a vertical route with dotted spine and day chips.\n• Journal entries in 2-col editorial layout with pull quotes.\n• Palette pulled from photography (warm terracotta + deep green).`,
    author: "Motif Studio", published: "2026-07-11",
  },
  {
    slug: "health-clinic-calm",
    title: "Modern dental clinic (calm clinical)",
    industry: "Healthcare", vibe: "clean, reassuring", stacks: ["HTML", "Next.js"],
    blocks: ["Hero", "Services", "Team", "Booking"],
    status: "verified", avgFidelity: 90, bestModel: "GLM-4.6 (CN)",
    runs: [
      { model: "GLM-4.6 (CN)", date: "2026-07-06", fidelity: 92, buildError: false, notes: "Impressively calm palette discipline." },
      { model: "Claude 4.6 Sonnet", date: "2026-07-06", fidelity: 89, buildError: false, notes: "Very good; rounded system slightly overcooked, fixed on pass 2." },
      { model: "Codex", date: "2026-07-07", fidelity: 88, buildError: false, notes: "Solid; generic stock placeholder icons." },
    ],
    promptBody: `Modern clinic site: clinical precision, zero intimidation.\n• Soft white + ice blue; one warm wood accent for human warmth.\n• Hero: split layout, service list right, calm photo left.\n• Services as an accordion with inline pricing note.\n• Team grid with credentials, rounded-corner photos.\n• Booking band: choose visit type → date strip → time pills.\n• Motion only on micro-interactions (hover lifts, focus rings).`,
    author: "Motif Studio", published: "2026-07-06",
  },
  {
    slug: "food-brand-playful",
    title: "Playful food brand landing",
    industry: "Food", vibe: "playful, bright", stacks: ["HTML", "React"],
    blocks: ["Hero", "Product parade", "Recipe cards", "Locator"],
    status: "beta", avgFidelity: 84, bestModel: "Claude 4.6 Sonnet",
    runs: [
      { model: "Claude 4.6 Sonnet", date: "2026-08-14", fidelity: 87, buildError: false, notes: "Fun and on-brand; sticker physics were a nice surprise." },
      { model: "Codex", date: "2026-08-14", fidelity: 82, buildError: false, notes: "Decent; product parade felt stiff, prompted wiggle pass." },
      { model: "GLM-4.6 (CN)", date: "2026-08-15", fidelity: 82, buildError: true, notes: "Unicode emoji rendering issue in hero; easy fix." },
    ],
    promptBody: `A cereal brand page that bounces.\n• Bright pastel mint + butter yellow + coral; thick rounded type.\n• Hero: mascot sticker character waving (CSS/SVG only), product below with a "pour" animation on scroll.\n• Recipe cards that wiggle slightly on hover.\n• Store locator band with a fake map pin drop.\n• Fun facts marquee between sections. Keep it fast — no heavy libs.`,
    author: "Motif Studio", published: "2026-08-14",
  },
  {
    slug: "course-platform-warm",
    title: "Online course landing with syllabus story",
    industry: "Education", vibe: "warm, focused, credible", stacks: ["HTML", "Next.js"],
    blocks: ["Hero", "Syllabus accordion", "Instructor", "Pricing"],
    status: "verified", avgFidelity: 89, bestModel: "Claude 4.6 Sonnet",
    runs: [
      { model: "Claude 4.6 Sonnet", date: "2026-09-06", fidelity: 92, buildError: false, notes: "Syllabus accordion typography was outstanding." },
      { model: "GLM-4.6 (CN)", date: "2026-09-06", fidelity: 89, buildError: false, notes: "Very close; instructor card needed a warmer photo treatment pass." },
      { model: "Codex", date: "2026-09-07", fidelity: 87, buildError: false, notes: "Solid. Price card contrast flagged by auto-audit, fixed on pass." },
    ],
    promptBody: `An online course landing that earns enrollment.\n• Paper-white + ink; one warm terracotta accent for 'human teacher' energy.\n• Hero: headline = outcome ('ship your first real product'), not a feature list. Instructor photo + one-line credo beside.\n• Syllabus as an accordion: week number, module title, 'you will have built' outcome line. Open state animates height.\n• Two pricing cards (self-paced / cohort) with a money-back microcopy line.\n• No autoplay; motion = accordion + scroll reveals only.\n• Keep quotes real-feeling, not buzzword soup.`,
    author: "Motif Studio", published: "2026-09-06",
  },
  {
    slug: "realestate-listing-moderne",
    title: "Modern real-estate listing page",
    industry: "Real Estate", vibe: "clean, premium, confident", stacks: ["Next.js", "HTML"],
    blocks: ["Hero listing", "Photo gallery", "Details", "Contact"],
    status: "verified", avgFidelity: 90, bestModel: "Codex",
    runs: [
      { model: "Codex", date: "2026-09-04", fidelity: 92, buildError: false, notes: "Gallery lightbox and floor-plan reveal worked first pass." },
      { model: "Claude 4.6 Sonnet", date: "2026-09-04", fidelity: 90, buildError: false, notes: "Excellent spacing; asked for fewer decorative gradients." },
      { model: "GLM-4.6 (CN)", date: "2026-09-05", fidelity: 89, buildError: false, notes: "Near-identical; image ratio handling needed one tweak." },
    ],
    promptBody: `A single-listing page for a modern apartment — premium, not glossy.\n• Off-white + charcoal; brass accent; architectural-grid feel.\n• Hero: full-bleed photo with price + address as oversized type over a scrim.\n• Gallery: 1 large + 3 thumbnails that swap with a crossfade; lightbox optional.\n• Details: floor plan SVG toggled beside a feature list; key specs in a ledger row.\n• Sticky bottom bar: price + 'Book viewing' that appears after 40% scroll.\n• Realistic copy: neighborhoods, sqm, transit minutes — write like you know the city.`,
    author: "Motif Studio", published: "2026-09-04",
  },
  {
    slug: "restaurant-digital-menu",
    title: "Digital menu for a chef-led restaurant",
    industry: "Food", vibe: "minimal, appetising", stacks: ["HTML", "React"],
    blocks: ["Hero", "Menu sections", "Dish cards", "Reservation"],
    status: "beta", avgFidelity: 86, bestModel: "GLM-4.6 (CN)",
    runs: [
      { model: "GLM-4.6 (CN)", date: "2026-09-02", fidelity: 88, buildError: false, notes: "Dish photography treatment guidance was excellent." },
      { model: "Claude 4.6 Sonnet", date: "2026-09-02", fidelity: 86, buildError: false, notes: "Typographically strong; menu items slightly cramped on mobile." },
      { model: "Codex", date: "2026-09-03", fidelity: 84, buildError: true, notes: "Accordion a11y attribute missing; fix shipped as note." },
    ],
    promptBody: `A single-page digital menu that makes you hungry.\n• Warm paper (#faf6ef), ink text, one appetite accent (tomato/olive).\n• Hero: chef's name + 'seasonal menu, changed weekly' in quiet serif.\n• Sections (starters / mains / dessert) as sticky-tab quick nav.\n• Dish cards: name, description in one line, price right-aligned; dietary marks as tiny glyphs.\n• Photographs: top-lit, 4:5, consistent warm grade — describe the look so any image model can match.\n• Reservation band with date/time pills. Fast, zero animation bloat.`,
    author: "Motif Studio", published: "2026-09-02",
  },
];

export const BACKGROUNDS: BackgroundAsset[] = [
  { slug: "aurora-veil", title: "Aurora Veil", category: "animated", tech: ["CSS"], perf: "low", themeable: true, bundleKb: 2.6, copies: 8940, demo: "aurora-veil", description: "Drifting mesh gradients + grain. 60 fps, zero JS." },
  { slug: "star-motes", title: "Star Motes", category: "particles", tech: ["CSS", "WebGL"], perf: "mid", themeable: true, bundleKb: 3.4, copies: 7150, demo: "star-motes", description: "Three-layer parallax starfield with pointer drift." },
  { slug: "liquid-glass", title: "Liquid Glass", category: "texture", tech: ["CSS", "SVG"], perf: "low", themeable: true, bundleKb: 4.1, copies: 5230, demo: "glass", description: "Frosted refraction panels with edge highlights." },
  { slug: "paper-noise", title: "Paper Noise", category: "texture", tech: ["CSS", "SVG"], perf: "low", themeable: false, bundleKb: 1.1, copies: 6610, demo: "noise", description: "Fine analog grain for editorial backdrops." },
  { slug: "grid-drift", title: "Grid Drift", category: "animated", tech: ["CSS"], perf: "low", themeable: true, bundleKb: 1.9, copies: 3980, demo: "grid", description: "Perspective grid that drifts on scroll." },
  { slug: "ink-aurora", title: "Ink Aurora", category: "animated", tech: ["WebGL"], perf: "high", themeable: true, bundleKb: 8.7, copies: 2870, demo: "ink", description: "WebGL ink fields — heavy but hypnotic. Low-tier fallback included." },
  { slug: "sorbet", title: "Sorbet Sweep", category: "gradient", tech: ["CSS"], perf: "low", themeable: true, bundleKb: 0.9, copies: 7740, demo: "sorbet", description: "Six-stop pastel sweep for light brand sections." },
  { slug: "halftone", title: "Halftone Bloom", category: "texture", tech: ["CSS", "SVG"], perf: "mid", themeable: true, bundleKb: 2.2, copies: 2410, demo: "halftone", description: "Retro halftone bloom pattern, modern palette." },
];

export const LAB_TOOLS: LabTool[] = [
  { slug: "easing", title: "Easing Lab", description: "Feel every easing curve on a real spring; drag the handles of a cubic-bezier and watch a dot race between two targets. Export CSS / JS / Tailwind.", outputs: ["CSS", "JS", "Tailwind"], free: true, accent: "#8b5cf6", interactive: true },
  { slug: "spring", title: "Spring Lab", description: "Tune stiffness, damping and mass against real physics — then export the config for your favourite motion lib.", outputs: ["JS config", "CSS"], free: true, accent: "#22d3ee", interactive: true },
  { slug: "scroll", title: "Scroll Lab", description: "Sketch scroll choreography: trigger points, sync progress, staggers. Copy the recipe into your project.", outputs: ["Recipe", "TS"], free: true, accent: "#34d399" },
  { slug: "gradient", title: "Gradient Forge", description: "Bend multi-stop gradients on an editable path with colour-harmony guardrails so you never ship an ugly one.", outputs: ["CSS", "SVG"], free: true, accent: "#f472b6", interactive: true },
  { slug: "texture", title: "Texture Forge", description: "Grain, glass, halftone, paper — procedural textures at any resolution, seeded for reproducibility.", outputs: ["PNG", "SVG", "CSS"], free: true, accent: "#fbbf24" },
  { slug: "themes", title: "Theme Studio", description: "Design your brand tokens once and remap every Motif component to them live.", outputs: ["CSS vars", "Tailwind"], free: false, accent: "#a78bfa" },
  { slug: "palette", title: "Palette Engine", description: "Generate harmonious palettes with an accessibility-first picker (contrast pre-checked live).", outputs: ["HEX/OKLCH"], free: true, accent: "#67e8f9" },
  { slug: "a11y", title: "Contrast Sentinel", description: "Paste any two colours (or a whole token file) and get WCAG AA/AAA verdicts per usage size.", outputs: ["Report"], free: true, accent: "#fb7185" },
];

export const COMMUNITY_STATS: CommunityStat[] = [
  { label: "Assets in library", value: "612", delta: "+31 this week", up: true },
  { label: "Verified AI prompts", value: "318", delta: "+12 this week", up: true },
  { label: "Copies this month", value: "148.2k", delta: "+12.4%", up: true },
  { label: "Avg. copy-to-run success", value: "94%", delta: "+2.1 pt", up: true },
];

export const VERIFIED_BADGE = {
  threshold: 85, // avg fidelity across runs needed for "verified"
};

export function promptStatusMeta(s: PromptTemplate["status"]) {
  if (s === "featured") return { label: "Featured", cls: "text-amber-300 border-amber-300/30 bg-amber-300/10" };
  if (s === "verified") return { label: "Verified", cls: "text-mint border-mint/25 bg-mint/10" };
  return { label: "Beta", cls: "text-ink-dim border-edge-strong bg-white/5" };
}

export function fidelityColor(v: number) {
  if (v >= 90) return "text-mint";
  if (v >= 85) return "text-amber-300";
  return "text-danger";
}

export function kindOf(slug: string): Asset | undefined {
  return COMPONENTS.find((c) => c.slug === slug);
}

export function promptOf(slug: string): PromptTemplate | undefined {
  return PROMPTS.find((p) => p.slug === slug);
}

export function bgOf(slug: string): BackgroundAsset | undefined {
  return BACKGROUNDS.find((b) => b.slug === slug);
}

/* ---------------------------------------------------------------------
   Per-asset "colour fingerprint": a stable, well-spread hue derived from
   the slug so every tile/detail/OG asset is recognisable at a glance.
   --------------------------------------------------------------------- */
export function accentHue(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  // spread + jitter so neighbours never look alike
  const spread = (h % 360) + Math.round(((h / 360) % 1) * 40) - 20;
  return ((spread % 360) + 360) % 360;
}

export function accentCss(key: string, sat = 82, light = 62, alpha = 1): string {
  return `hsl(${accentHue(key)} ${sat}% ${light}% / ${alpha})`;
}

export interface ChangeLogEntry {
  date: string;
  tag: "Components" | "Prompts" | "Backgrounds" | "Lab" | "Platform";
  title: string;
  body: string;
}

export const CHANGELOG: ChangeLogEntry[] = [
  {
    date: "2026-09-09", tag: "Components", title: "Six new context-stage scenes",
    body: "Text Cycle, Tab Morph, Flip Card, Skeleton Profile Feed, Momentum Chart and Avatar Crowd Stack land — each demo now shows a realistic context, not an isolated widget.",
  },
  {
    date: "2026-09-09", tag: "Prompts", title: "Education, Real Estate & Restaurant prompts go live",
    body: "Three new industries join the scoreboard with full run logs — course landing, modern listing page and a chef-led digital menu.",
  },
  {
    date: "2026-09-08", tag: "Components", title: "Glass pricing trio + Wipe Reveal headline",
    body: "Two new context-stage demos: a three-tier glass pricing row and a clip-path headline reveal. Both zero-dependency.",
  },
  {
    date: "2026-09-05", tag: "Prompts", title: "10 fintech prompts re-tested, 3 upgraded to Verified",
    body: "Model versions were pinned and re-run after GLM-4.6 updates — fidelity notes refreshed on every card.",
  },
  {
    date: "2026-09-02", tag: "Lab", title: "Spring Lab ships a settle-time readout",
    body: "The mass–spring–damper tool now reports exact settle ms so you can tune to a feel, not a guess.",
  },
  {
    date: "2026-08-29", tag: "Backgrounds", title: "Ink Aurora gets a low-tier CSS fallback",
    body: "Heavy WebGL scenes now degrade to a composited CSS field on low-power devices. Performance tier stays honest.",
  },
  {
    date: "2026-08-24", tag: "Platform", title: "Colour fingerprints on every asset tile",
    body: "Each component now carries a stable accent hue — thumbnails are recognisable before you read the title.",
  },
  {
    date: "2026-08-19", tag: "Prompts", title: "Community submissions now publish with run logs",
    body: "Any prompt that ships gets the full multi-model test treatment. Beta badge until it earns Verified.",
  },
];
