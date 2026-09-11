// #11–#20 — the part of accessibility the static markup pass structurally
// cannot see, given a home instead of a shrug. Everything here is decidable
// from source or the built CSS, so the page and the harnesses can read the same
// functions and cannot drift apart. What still needs a browser is said so in
// the page, not padded into a score here.
//
// The module is importable from the .mjs harnesses, so it uses only node
// builtins and no path aliases.

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DEMO_DIR = path.join(ROOT, "src", "components", "demos");

function sceneFiles(): string[] {
  try {
    const sets = fs
      .readdirSync(path.join(DEMO_DIR, "scenes"))
      .filter((f) => f.endsWith(".tsx"))
      .map((f) => path.join(DEMO_DIR, "scenes", f));
    return [path.join(DEMO_DIR, "Demo.tsx"), path.join(DEMO_DIR, "scene-kit.tsx"), path.join(DEMO_DIR, "scenes-17.tsx"), ...sets];
  } catch {
    return [];
  }
}

/* ------------------------------- colour maths ----------------------------- */

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function luminance({ r, g, b }: { r: number; g: number; b: number }): number {
  const f = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

/** WCAG 2.1 contrast ratio between two hex colours. */
export function contrastRatio(a: string, b: string): number {
  const la = luminance(hexToRgb(a));
  const lb = luminance(hexToRgb(b));
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Blend a semi-transparent hex over an opaque hex, returning rgb as hex. */
function blend(fg: string, alpha: number, bg: string): string {
  const a = hexToRgb(fg);
  const b = hexToRgb(bg);
  const m = (x: number, y: number) => Math.round(x * alpha + y * (1 - alpha));
  const to = (v: number) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0");
  return `#${to(m(a.r, b.r))}${to(m(a.g, b.g))}${to(m(a.b, b.b))}`;
}

/* ----------------------------- #11 focus ring ----------------------------- */

// The ring globals.css draws, and the flat surfaces it can be measured against.
// Gradients and glass panels are the surfaces a token cannot compute; the page
// says that rather than pretending a flat average is the glass.
const FOCUS_RING = { hex: "#8b5cf6", alpha: 0.9 };
const RING_SURFACES = [
  { label: "page background", hex: "#06070b" },
  { label: "panel", hex: "#0b0d14" },
  { label: "raised surface", hex: "#10131d" },
];

/** The shared focus ring against each flat surface it is drawn on, with the
 *  3:1 non-text-contrast pass line. */
export function focusRingSurfaces() {
  return RING_SURFACES.map((s) => {
    const effective = blend(FOCUS_RING.hex, FOCUS_RING.alpha, s.hex);
    const ratio = contrastRatio(effective, s.hex);
    return { label: s.label, ratio: Number(ratio.toFixed(2)), pass: ratio >= 3 };
  });
}

/* ------------------------- #12 forced-colors pass ------------------------- */

/** True when the built stylesheet carries the forced-colors block that hands
 *  the ring and chrome to the system palette. */
export function forcedColorsInCss(): { found: boolean; file: string | null } {
  const dirs = [path.join(ROOT, ".next", "static", "chunks"), path.join(ROOT, ".next", "server", "app")];
  for (const dir of dirs) {
    let entries: string[] = [];
    try {
      entries = fs.readdirSync(dir);
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (!entry.endsWith(".css")) continue;
      const file = path.join(dir, entry);
      try {
        const text = fs.readFileSync(file, "utf8");
        // Minified CSS collapses the space after the colon and lowercases the
        // system colour keywords, so match both tolerantly rather than trusting
        // the source formatting to survive the build.
        if (/forced-colors\s*:\s*active/.test(text) && /\bhighlight\b/i.test(text)) {
          return { found: true, file: path.relative(ROOT, file) };
        }
      } catch {
        continue;
      }
    }
  }
  return { found: false, file: null };
}

/* ------------------------- #13 target-size heuristic ---------------------- */

// A class name is not a measurement; this is a candidate list for the hand
// check, not a verdict. The hand check decides whether the control is actually
// below the touch-target line at 200% zoom.
const INTERACTIVE = /\<(button|input|select|textarea|a)\b[^>]*className="([^"]*)"/g;

export interface TargetCandidate {
  file: string;
  control: string;
  cls: string;
}

export function targetSizeCandidates(): TargetCandidate[] {
  const out: TargetCandidate[] = [];
  for (const file of sceneFiles()) {
    let text: string;
    try {
      text = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    for (const m of text.matchAll(INTERACTIVE)) {
      const cls = m[2] ?? "";
      if (!/min-h-|min-w-|size-/.test(cls)) {
        out.push({ file: path.relative(ROOT, file), control: m[1], cls: cls.slice(0, 48) });
      }
    }
  }
  return out;
}

/* --------------------------- #16 visual vs DOM order ---------------------- */

// Real reordering classes only: `order-2`, `flex-row-reverse`, `order-first` —
// not the `border-2` substring that shares the letters. A scene that reorders
// visually must explain the reading order in its own body.
const REORDER = /(^|[^a-z-])(order-[0-9]+|order-first|order-last|order-none|flex-row-reverse|flex-col-reverse)([^a-z-]|$)/g;

export interface ReorderUse {
  file: string;
  cls: string;
  explained: boolean;
}

export function visualOrderUsages(): ReorderUse[] {
  const out: ReorderUse[] = [];
  for (const file of sceneFiles()) {
    let text: string;
    try {
      text = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    for (const m of text.matchAll(REORDER)) {
      out.push({ file: path.relative(ROOT, file), cls: m[2], explained: /reading order|visual order|reversed for|mirrored/.test(text) });
    }
  }
  return out;
}

/* ------------------------- #18 announced sentences ------------------------ */

// The exact strings the two live scenes announce. Kept here (and asserted
// against the scene source by the harness) so the published list cannot drift
// from what the scene actually says.
export const ANNOUNCED = {
  toast: [
    "Build passed · 3.2s",
    "Wipe Reveal copied to clipboard",
    "Changed 3 theme tokens — undo?",
    "New run log: 3/3 models clean",
    "✓ Tokens restored",
  ],
  liveRegion: ["✓ Snippet copied", "⏳ Loading 4 of 12 surfaces", "✕ Payment failed — card declined", "✦ 3 updates are waiting for you"],
};

/* ------------------------- #19 fixed-height inventory --------------------- */

export interface FixedHeight {
  where: string;
  value: string;
}

/** Every fixed pixel height a preview frame reserves, read from the call sites
 *  so the 200% zoom check has a starting list instead of a blank page. */
export function fixedHeightInventory(): FixedHeight[] {
  const out: FixedHeight[] = [];
  const scan = (rel: string, pattern: RegExp, label: (m: RegExpMatchArray) => string) => {
    let text: string;
    try {
      text = fs.readFileSync(path.join(ROOT, rel), "utf8");
    } catch {
      return;
    }
    for (const m of text.matchAll(pattern)) {
      out.push({ where: rel, value: label(m) });
    }
  };
  scan("src/components/cards.tsx", /minHeight=\{(\d+)\}/g, (m) => `minHeight ${m[1]}px`);
  scan("src/components/asset-detail.tsx", /h-\[(\d+)px\]/g, (m) => `h-[${m[1]}px]`);
  // The LazyDemo default every call site inherits when it passes nothing.
  try {
    const lazy = fs.readFileSync(path.join(ROOT, "src", "components", "lazy-demo.tsx"), "utf8");
    const dflt = (lazy.match(/minHeight = (\d+)/) || [])[1];
    if (dflt) out.push({ where: "src/components/lazy-demo.tsx (default)", value: `${dflt}px` });
  } catch {
    /* noop */
  }
  return out;
}

/* ---------------------- loader map + scene body extraction ----------------- */

export interface SceneLink {
  key: string;
  module: string;
  component: string;
}

/** The demo registry read out of Demo.tsx: key → module + component. */
export function sceneLinks(): SceneLink[] {
  let source: string;
  try {
    source = fs.readFileSync(path.join(DEMO_DIR, "Demo.tsx"), "utf8");
  } catch {
    return [];
  }
  const start = source.indexOf("const SCENE_LOADERS");
  if (start === -1) return [];
  const block = source.slice(start, source.indexOf("\n};", start));
  const links: SceneLink[] = [];
  for (const line of block.split("\n")) {
    const key = (line.match(/"([a-z0-9-]+)":/) || [])[1];
    const target = (line.match(/import\("\.\/([^"]+)"\)/) || [])[1];
    const component = (line.match(/default: m\.([A-Za-z0-9_]+)/) || [])[1];
    if (key && target && component) links.push({ key, module: target, component });
  }
  return links;
}

/** The source of one scene function, sliced at the next scene boundary so a
 *  sibling's handler cannot stand in for this scene's. */
function sceneBody(module: string, component: string): string {
  const file = path.join(DEMO_DIR, `${module}.tsx`);
  let text: string;
  try {
    text = fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
  const start = text.search(new RegExp(`\\nexport function ${component}\\b`));
  if (start === -1) return "";
  const next = text.indexOf("\nexport function ", start + 1);
  return next === -1 ? text.slice(start) : text.slice(start, next);
}

/* ----------------------- #14 behaviour code evidence ---------------------- */

// keyboard: an explicit key/focus handler, or a native control that is
// keyboard-operable without one. A div with only onClick fails both.
const KEY_EVIDENCE =
  /\bonKeyDown\b|\bonKeyUp\b|\bonKey\b|\bkeydown\b|\btabIndex\b|\bArrow(Left|Right|Up|Down)\b|\bEscape\b|\bEnter\b|\bonFocus\b|\bonBlur\b/;
const NATIVE_KEYBOARD = /<(button|input|select|textarea|a)\b/;
// drag: a pointer/mouse/touch handler, or a native range thumb the visitor drags.
const DRAG_EVIDENCE =
  /\bonPointerDown\b|\bonPointerMove\b|\bonPointerUp\b|\bsetPointerCapture\b|\bonMouseDown\b|\bonMouseMove\b|\bonMouseUp\b|\bonTouchStart\b|\bonTouchMove\b|\bonDragStart\b|\bdraggable\b|\bonDragOver\b|\bpointermove\b|\bpointerdown\b|\bpointerup\b|\bPointerEvent\b/;
const RANGE_DRAG = /type="range"/;

export interface EvidenceRow {
  slug: string;
  behavior: "keyboard" | "drag";
  found: boolean;
  where: string;
}

/** For every catalog record declaring keyboard or drag, whether its scene has
 *  the code to back the declaration. `check:demos` fails when a declaration
 *  loses its handler — the batch-91 overclaim, caught before it ships. */
export function behaviorEvidence(components: { slug: string; demo: string; behaviors: string[] }[]): EvidenceRow[] {
  const byKey = new Map(sceneLinks().map((l) => [l.key, l]));
  const rows: EvidenceRow[] = [];
  for (const c of components) {
    const link = byKey.get(c.demo);
    if (!link) continue;
    const body = sceneBody(link.module, link.component);
    if (c.behaviors.includes("keyboard")) {
      rows.push({ slug: c.slug, behavior: "keyboard", found: KEY_EVIDENCE.test(body) || NATIVE_KEYBOARD.test(body), where: `${link.module}.tsx` });
    }
    if (c.behaviors.includes("drag")) {
      rows.push({ slug: c.slug, behavior: "drag", found: DRAG_EVIDENCE.test(body) || RANGE_DRAG.test(body), where: `${link.module}.tsx` });
    }
  }
  return rows;
}

/* ------------------------------ #20 RTL dry run --------------------------- */

// Physical-direction tokens that do not mirror under dir="rtl". Logical
// equivalents are -start/-end, ps/pe, ms/me, text-start/end, rounded-s/e.
const PHYSICAL_AXIS = [
  /(?<![a-z])(?:left|right|ml|mr|pl|pr|translate-x)-[-\w.\[\]%\/]+/g,
  /\b(?:text-left|text-right|border-l(?:-\w+)?|border-r(?:-\w+)?|rounded-l(?:-\w+)?|rounded-r(?:-\w+)?|float-left|float-right|clear-left|clear-right)\b/g,
];

function physicalHazards(body: string): string[] {
  const found = new Set<string>();
  for (const re of PHYSICAL_AXIS) for (const m of body.matchAll(re)) found.add(m[0]);
  return [...found];
}

export interface RtlScene {
  key: string;
  label: string;
  component: string;
  hazards: string[];
}

/** A static dry run over two scenes: list the physical-direction tokens that
 *  will not mirror, and name the number of scenes not run. No browser exists
 *  in this build, so this is a source scan — the page says so. */
export function rtlDryRun(): { scenes: RtlScene[]; untested: number } {
  const links = sceneLinks();
  const byKey = new Map(links.map((l) => [l.key, l]));
  const chosen = [
    { key: "split-button-menu", label: "Split button menu" },
    { key: "parallax-layered-scene", label: "Parallax layered scene" },
  ];
  const scenes = chosen.map((s) => {
    const link = byKey.get(s.key);
    const body = link ? sceneBody(link.module, link.component) : "";
    return { key: s.key, label: s.label, component: link?.component ?? "", hazards: physicalHazards(body) };
  });
  return { scenes, untested: links.length - scenes.length };
}
