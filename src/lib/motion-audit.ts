// 523 — what the demo scenes do about reduced motion, counted rather than
// claimed.
//
// /quality/aria's manual checklist said "the demo harness checks that each
// scene declares a reduced-motion branch". Nothing checked anything, and 63 of
// the scenes that animate referenced no branch at all — a claim about
// automation on the one page whose argument is that its automated half is
// real.
//
// What is checkable without a browser is exactly this: which scenes animate,
// and which of them mention the preference in their own body. That is what this
// module measures, and both the page and the harness read it, so the sentence
// and the number cannot drift apart. A scene is counted as animating when its
// body touches a clock, a loop or an input that drives one — rAF, setInterval,
// a CSS animation, an infinite repeat, a keyframe block, or a scroll / pointer
// / wheel handler. A scene is counted as branching when its own body names
// `useReducedMotion` or `prefers-reduced-motion`; a guard imported and never
// called does not count.

import fs from "node:fs";
import path from "node:path";

const MOTION =
  /\brequestAnimationFrame\b|\bsetInterval\b|animation:\s|\banimationName\b|repeat:\s*Infinity|\b@keyframes\b|\banimate\(|scrollY|\bIntersectionObserver\b|\bpointermove\b|\bmousemove\b|\bwheel\b/;

const GUARD = /useReducedMotion|prefers-reduced-motion/;

const DEMO_DIR = path.join(process.cwd(), "src", "components", "demos");

export interface MotionAudit {
  /** Every scene the registry loads, counted where the scenes live. */
  scenes: number;
  /** Scenes whose body drives motion. */
  moving: number;
  /** Of those, the ones that name the preference in their own body. */
  guarded: number;
  /** `module:Scene` for each moving scene with no branch, for the report. */
  unguarded: string[];
}

export function motionAudit(): MotionAudit {
  const empty: MotionAudit = { scenes: 0, moving: 0, guarded: 0, unguarded: [] };
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
  let moving = 0;
  let guarded = 0;
  const unguarded: string[] = [];
  for (const rel of files) {
    let source: string;
    try {
      source = fs.readFileSync(path.join(DEMO_DIR, rel), "utf8");
    } catch {
      continue;
    }
    // Scenes are exported one per `export function`; the file header and the
    // module-local helpers sit before the first one.
    for (const part of source.split("\nexport function ").slice(1)) {
      const body = `export function ${part}`;
      scenes++;
      if (!MOTION.test(body)) continue;
      moving++;
      if (GUARD.test(body)) guarded++;
      else unguarded.push(`${rel}:${part.split("(")[0].trim()}`);
    }
  }
  return { scenes, moving, guarded, unguarded };
}
