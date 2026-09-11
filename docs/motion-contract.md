# The motion contract

_What every demo scene promises about reduced motion, and the one rule that is
never optional._

A scene is a small page that moves. Some move through CSS — a class, an inline
`animation:`, a transition — and some move because their own JavaScript writes
frames (`requestAnimationFrame`, `setInterval`, a scroll or pointer listener).
The difference matters, because a media query can stop the first and cannot stop
the second. This contract is the line every scene stays on, and it is enforced
by the build rather than remembered by its author.

## The three rules

1. **A scene that loops declares a branch.** If a scene drives motion from
   JavaScript, it must name the reader's preference in its own body — through
   `useReducedMotion` / `useSceneMotion` from `scene-kit.tsx`, or through a
   `prefers-reduced-motion` block of its own. There is no silent loop: a scene
   that writes frames and never asks is a failing scene, not a stylistic miss.

2. **Reduced motion never removes content that only animation revealed.** The
   reduced version of a scene is the same content, still or instant — never an
   empty frame. If the only way to see something is to animate it, the scene is
   wrong in both modes.

3. **The branch is named in the scene's own body.** A shared stylesheet rule is
   a safety net, not an excuse: a scene whose motion is JavaScript-driven names
   the preference itself, in the code that does the moving, so a reviewer reads
   the branch next to the loop it guards.

## What CSS motion gets, and why it is covered

A scene that moves only through CSS (`animation:`, `@keyframes`, `transition:`)
needs no per-scene branch: `globals.css` collapses every keyframe and
transition site-wide under `prefers-reduced-motion: reduce`, and `check:exports`
asserts that rule survives into the built stylesheet. Requiring every CSS scene
to also carry a literal would be ceremony, not coverage.

## How the contract is enforced

- `src/lib/motion-audit.ts` splits the catalog's scenes into the CSS half (the
  stylesheet can stop it) and the JavaScript half (the scene must stop itself),
  and lists every JS-driven scene that does not name the preference.
- `scripts/check-demos.mjs` fails when any JS-driven scene stops naming the
  preference, and `/quality/aria` prints the split and the per-module table from
  the same module the gate reads.
- The site template every scene imports from is `src/components/demos/scene-kit.tsx`
  — the shared `useReducedMotion` / `useSceneMotion` hooks — and each scene set
  lives under `src/components/demos/scenes/`.

A scene is added the way the others are: a loader line in
`src/components/demos/Demo.tsx`, an export in one of the scene sets, and — if it
moves from JavaScript — a branch named in its own body. The gate is what refuses
the ones that skip the last step.
