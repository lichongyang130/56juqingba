"use client";

// Shared by every scene set: the props type, and the handful of values more
// than one scene needs. Split out of Demo.tsx when the scenes moved to their own
// modules (batch 85) — a helper used by two sets lives here rather than being
// duplicated into both.

import { useEffect, useState } from "react";

export type DemoProps = Record<string, number | string | boolean>;

/** #511 — "verified" means the same thing here as on the front page: a prompt
 *  whose status passed its recorded runs. Demo copy that mentions the catalog
 *  reads these constants instead of its own numbers. */

/* ---------------------------------------------------------------------------
   #1–#4 — the shared reduced-motion branch.
   ------------------------------------------------------------------------- */

/** The site's stylesheet collapses CSS keyframes and transitions for
 *  `prefers-reduced-motion: reduce` (globals.css, and `check:exports` asserts
 *  the rule is in the built CSS). That covers every scene whose motion is a
 *  class or an inline `animation`. It cannot cover a scene that drives a value
 *  itself — `requestAnimationFrame`, `setInterval`, a scroll listener, a
 *  pointer trail — because those write frames from JavaScript, where a media
 *  query has no say. Those scenes ask this hook and choose a still version.
 *
 *  Scene 1 of the audit that produced this counted 16 scenes in that second
 *  group with no branch at all. One hook rather than sixteen copies: the
 *  behaviour is identical and a reviewer only has to read it once. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

export interface SceneMotion {
  /** True when the reader asked the system for less motion. */
  reduced: boolean;
  /** A duration in milliseconds, collapsed to 0 when reduced. */
  ms: (value: number) => number;
  /** A repeat count, collapsed to 1 when reduced — an entrance plays once. */
  times: (value: number) => number;
}

/** The same preference as a small decision record, for scenes that need more
 *  than a boolean: a duration of 0 is not always enough, but it is always the
 *  right default when the answer is "no movement". */
export function useSceneMotion(): SceneMotion {
  const reduced = useReducedMotion();
  return {
    reduced,
    ms: (value: number) => (reduced ? 0 : value),
    times: (value: number) => (reduced ? 1 : value),
  };
}
