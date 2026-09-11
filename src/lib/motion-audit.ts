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

function scenesIn(source: string): { name: string; body: string }[] {
  return source
    .split("\nexport function ")
    .slice(1)
    .map((part) => ({ name: part.split("(")[0].trim(), body: `export function ${part}` }));
}

export function motionAudit(): MotionAudit {
  const empty: MotionAudit = { scenes: 0, moving: 0, css: [], js: [], jsGuarded: 0, unguarded: [] };
  let files: string[];
  try {
    files = [
      ...fs
        .readdirSync(path.join(DEMO_DIR, "scenes"))
        .filter((f) => f.endsWith(".tsx"))
        .map((f) => path.join("scenes", f)),
      "scenes-17.tsx",
    ];
  } catch {
    return empty;
  }

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
