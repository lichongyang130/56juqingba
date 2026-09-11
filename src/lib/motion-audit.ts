// #1–#10 — what the demo scenes do about reduced motion, counted rather than
// claimed.
//
// History, because the rule changed once and the reason matters. Batch 91 found
// /quality/aria claiming "the demo harness checks that each scene declares a
// reduced-motion branch" when nothing read the scenes at all, and counted 102
// animating scenes against 39 with a branch. That count was true and the rule
// behind it was wrong: the site's stylesheet already collapses every CSS
// keyframe and transition under `prefers-reduced-motion: reduce`, so a scene
// whose motion is a class or an inline `animation:` is covered without naming
// anything. Requiring all 102 to carry a literal would have been ceremony, and
// the honest fix was to measure the thing that actually matters.
//
// So the question this module answers is the one a user experiences:
//
//   * `css`  — the scene moves through CSS. globals.css collapses it for
//              reduced motion, and `check:exports` asserts that rule survives
//              into the built stylesheet. Covered, without a per-scene branch.
//   * `js`   — the scene writes frames itself (rAF, setInterval, an observer, a
//              scroll or pointer listener). A media query has no say over a
//              value JavaScript sets, so these must ask. Each one names the
//              preference through `useReducedMotion` / `useSceneMotion` from
//              scene-kit, or through a `prefers-reduced-motion` block of its
//              own, and the gate below fails when one stops doing so.
//
// Both the page and both harnesses read this file, so the sentence and the
// count cannot drift apart. `signals` carries the token that made a scene count
// as moving, so the page can say why rather than asserting it.

import fs from "node:fs";
import path from "node:path";

/** Motion a stylesheet can stop. */
const CSS_MOTION = /animation:\s|\banimationName\b|repeat:\s*Infinity|\b@keyframes\b|\btransition:/;

/** Motion JavaScript has to stop, because it writes the value. */
const JS_MOTION =
  /\brequestAnimationFrame\b|\bsetInterval\b|\bIntersectionObserver\b|\banimate\(|\bscrollY\b|\bscrollTo\b|\bpointermove\b|\bmousemove\b|\bwheel\b|\bdragstart\b/;

/** How a scene declares its branch. `useSceneMotion` is the shared hook in
 *  scene-kit.tsx; the literal covers the scenes that write their own block. */
const GUARD = /useReducedMotion|useSceneMotion|prefers-reduced-motion/;

const DEMO_DIR = path.join(process.cwd(), "src", "components", "demos");

export interface MotionScene {
  /** `module:Scene`, e.g. `scenes/set-01.tsx:PrismSwitch`. */
  id: string;
  /** Which kinds of motion this scene's own body drives. */
  kind: "css" | "js";
  /** The tokens that made it count, so the page can print the reason. */
  signals: string[];
  /** For a JS-driven scene: does its own body name the preference? */
  guarded: boolean;
}

export interface MotionAudit {
  /** Every scene the registry loads, counted where the scenes live. */
  scenes: number;
  /** Scenes whose own body drives motion. */
  moving: number;
  /** Motion the stylesheet covers: CSS only, no JavaScript. */
  css: MotionScene[];
  /** Motion the scene must handle itself. */
  js: MotionScene[];
  /** Of `js`, the ones that name the preference. */
  jsGuarded: number;
  /** Of `js`, the ones that do not — each one a real gap. */
  unguarded: MotionScene[];
}

/** The scene modules, in a stable order so a per-module table does not jump
 *  around between runs. */
function sceneFiles(): string[] {
  try {
    const sets = fs
      .readdirSync(path.join(DEMO_DIR, "scenes"))
      .filter((f) => f.endsWith(".tsx"))
      .map((f) => path.join("scenes", f));
    return [...sets, "scenes-17.tsx"].sort();
  } catch {
    return [];
  }
}

function scenesIn(source: string): { name: string; body: string }[] {
  return source
    .split("\nexport function ")
    .slice(1)
    .map((part) => ({ name: part.split("(")[0].trim(), body: `export function ${part}` }));
}

export function motionAudit(): MotionAudit {
  const empty: MotionAudit = { scenes: 0, moving: 0, css: [], js: [], jsGuarded: 0, unguarded: [] };
  const files = sceneFiles();
  if (files.length === 0) return empty;

  let scenes = 0;
  const css: MotionScene[] = [];
  const js: MotionScene[] = [];
  for (const rel of files) {
    let source: string;
    try {
      source = fs.readFileSync(path.join(DEMO_DIR, rel), "utf8");
    } catch {
      continue;
    }
    for (const { name, body } of scenesIn(source)) {
      scenes++;
      const id = `${rel}:${name}`;
      // A token only counts once: the regexes are shared between scenes.
      const jsSignals = [...new Set([...body.matchAll(new RegExp(JS_MOTION, "g"))].map((m) => m[0].trim()))];
      const cssSignals = [...new Set([...body.matchAll(new RegExp(CSS_MOTION, "g"))].map((m) => m[0].trim()))];
      if (jsSignals.length) {
        js.push({ id, kind: "js", signals: jsSignals, guarded: GUARD.test(body) });
      } else if (cssSignals.length) {
        css.push({ id, kind: "css", signals: cssSignals, guarded: false });
      }
    }
  }
  const unguarded = js.filter((s) => !s.guarded);
  return { scenes, moving: css.length + js.length, css, js, jsGuarded: js.length - unguarded.length, unguarded };
}

/** #6 — the same audit, grouped by module, so /quality/aria can print a
 *  per-module table instead of rounding the gap into one number. */
export interface MotionModuleRow {
  /** `scenes/set-01.tsx` or `scenes-17.tsx`. */
  module: string;
  /** Total scenes the module exports. */
  scenes: number;
  /** Of them, the ones that drive motion (CSS or JavaScript). */
  animate: number;
  /** Scenes whose motion is JavaScript-driven. */
  jsDriven: number;
  /** Of the JS-driven scenes, the ones that name the preference. */
  guarded: number;
  /** The first unguarded scene's id, or null when the module is clean. */
  firstUnguarded: string | null;
}

export function motionByModule(): MotionModuleRow[] {
  const audit = motionAudit();
  const rows: MotionModuleRow[] = [];
  for (const rel of sceneFiles()) {
    let source: string;
    try {
      source = fs.readFileSync(path.join(DEMO_DIR, rel), "utf8");
    } catch {
      continue;
    }
    const prefix = `${rel}:`;
    const modCss = audit.css.filter((s) => s.id.startsWith(prefix));
    const modJs = audit.js.filter((s) => s.id.startsWith(prefix));
    const unguarded = modJs.filter((s) => !s.guarded);
    rows.push({
      module: rel,
      scenes: scenesIn(source).length,
      animate: modCss.length + modJs.length,
      jsDriven: modJs.length,
      guarded: modJs.length - unguarded.length,
      firstUnguarded: unguarded[0]?.id ?? null,
    });
  }
  return rows.sort((a, b) => a.module.localeCompare(b.module));
}

/** #10 — a demo key (the catalog's `demo` field) joined to the scene that
 *  renders it, by reading Demo.tsx's loader map. The share-card route uses this
 *  to know which assets' live scenes animate, so a card can say it is a still. */
export interface DemoSceneLink {
  key: string;
  module: string;
  component: string;
}

export function demoSceneLinks(): DemoSceneLink[] {
  let source: string;
  try {
    source = fs.readFileSync(path.join(DEMO_DIR, "Demo.tsx"), "utf8");
  } catch {
    return [];
  }
  const start = source.indexOf("const SCENE_LOADERS");
  if (start === -1) return [];
  const block = source.slice(start, source.indexOf("\n};", start));
  const links: DemoSceneLink[] = [];
  for (const line of block.split("\n")) {
    const key = (line.match(/"([a-z0-9-]+)":/) || [])[1];
    const target = (line.match(/import\("\.\/([^"]+)"\)/) || [])[1];
    const component = (line.match(/default: m\.([A-Za-z0-9_]+)/) || [])[1];
    if (key && target && component) links.push({ key, module: target, component });
  }
  return links;
}

/** Every demo key whose scene drives motion (CSS or JavaScript), by joining the
 *  loader map with the audit. These are the assets whose share card must say it
 *  is a still rather than imply the image can show the motion. */
export function movingDemoKeys(): Set<string> {
  const audit = motionAudit();
  const moving = new Set([...audit.css, ...audit.js].map((s) => s.id));
  const out = new Set<string>();
  for (const link of demoSceneLinks()) {
    const rel = `${link.module}.tsx`;
    if (moving.has(`${rel}:${link.component}`)) out.add(link.key);
  }
  return out;
}

/** True when the built stylesheet carries the site-wide reduced-motion policy.
 *  `check:exports` and `/quality/aria` both read this rather than trusting that
 *  the rule is still in globals.css. */
export function reducedMotionPolicyInCss(): { found: boolean; file: string | null } {
  const root = path.join(process.cwd(), ".next");
  const dirs = [path.join(root, "static", "chunks"), path.join(root, "server", "app")];
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
        if (text.includes("prefers-reduced-motion") && /animation-duration:\s*\.?0*\.?0?1ms|animation-duration:0\.01ms/.test(text)) {
          return { found: true, file: path.relative(process.cwd(), file) };
        }
      } catch {
        continue;
      }
    }
  }
  return { found: false, file: null };
}
