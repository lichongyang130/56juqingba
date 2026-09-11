// #507 — the editorial half of the accessibility record.
//
// The catalog's per-asset "a11y" number is an editorial score kept in the data
// file. The automated half — the pass over the built HTML of every page — now
// lives in markup-a11y.ts, because three callers run it (the /quality/aria page,
// `npm run check:a11y` and the export harness) and separate copies had drifted
// apart in exactly the way duplicated rules do.
//
// What stays here is what a machine cannot produce: the scores, and the record
// of what the pass found and what was changed because of it.

import { COMPONENTS } from "./data";

/** What the first run of this pass found, and what was changed. Kept in the
 *  source because /quality/aria is a record of the fix, not just a green tick. */
export const A11Y_FIXES = [
  {
    commit: "batch 78",
    what: "the demo scene rendered inside component previews was an <h1>",
    pages: 133,
  },
  {
    commit: "batch 79",
    what: 'the logo gradient id "mf-logo" appeared three times per page (header, footer, press kit)',
    pages: 134,
  },
  {
    commit: "batch 79",
    what: "every remaining heading in a demo scene, and the mock hero headline inside card previews",
    pages: 40,
  },
  {
    commit: "batch 79",
    what: "panel titles that rendered directly under a page h1 as h3",
    pages: 6,
  },
  {
    commit: "batch 79",
    what: "controls whose only visible label was a span (lab sliders, selects, the command palette input)",
    pages: 4,
  },
  {
    commit: "batch 83",
    what: "a role=\"switch\" span in the admin settings demos and two demo scenes whose aria-controls pointed at a panel that only existed while open",
    pages: 7,
  },
  {
    commit: "batch 82",
    what: "this pass counted a stale document from an earlier build as a page, and reported a missing lang attribute against a changelog slug that no longer existed",
    pages: 0,
  },
];

/** The editorial a11y scores, published as the bands the register uses. */
export function a11yBands() {
  const bands = { "95-100": 0, "90-94": 0, "80-89": 0, "under-80": 0 } as Record<string, number>;
  for (const c of COMPONENTS) {
    const s = c.a11yScore;
    bands[s >= 95 ? "95-100" : s >= 90 ? "90-94" : s >= 80 ? "80-89" : "under-80"]++;
  }
  return bands;
}

/**
 * #17 — the checklist a person runs.
 *
 * Written because the automatic pass stops somewhere, and where it stops is a
 * specific list rather than a shrug. Each item names the automated half that
 * does exist, so a reviewer can see what the machine already covered and what
 * only they can decide. Nothing here has been executed: this build has no
 * browser in it, and the page says so in the same breath as the list.
 */
export interface ManualCheck {
  title: string;
  how: string;
  fails: string;
  automated?: string;
  where: { href: string }[];
}

export const MANUAL_CHECKS: ManualCheck[] = [
  {
    title: "Tab from the top of a page to the end, with no mouse",
    how:
      "Put the cursor in the address bar, then Tab. Note every stop the way the keyboard-walk guide does: where am I, what is this, what will it do? The scenes with the most to lose are the ones that reimplement dragging, so walk one of those rather than the homepage.",
    fails: "a stop you cannot see, a widget you cannot leave with Tab or Escape, or a stop announced as nothing.",
    automated: "every control's name and role",
    where: [{ href: "/components/reorder-list" }, { href: "/components/split-pane" }, { href: "/components/zoom-lens" }, { href: "/components/chart-scrubber" }],
  },
  {
    title: "Close an overlay while focus is inside it",
    how:
      "Open one of the overlay scenes, Tab to a control inside it, then press Escape. Focus has to be somewhere visible afterwards — normally the trigger — and the overlay must not be left in the document as an aria-hidden wrapper whose controls are still in the tab order. This is the case the static rule cannot see: the markup was correct when it was built, and the failure happens at runtime.",
    fails: "focus falls to the document body (the next Tab restarts at the top), or the closed overlay is still reachable — hidden from the tree and tabbable at once.",
    automated: "focusable controls inside aria-hidden subtrees, in the built state only",
    where: [{ href: "/components/sheet-menu" }, { href: "/components/command-palette" }, { href: "/components/fullscreen-overlay-menu" }, { href: "/components/share-sheet" }],
  },
  {
    title: "Check where focus returns after a dialog closes",
    how:
      "Continue from the step above: press Tab once without looking. The next stop should be the control that opened the overlay.",
    fails: "the reader loses their place and walks the page again to find what they were doing.",
    where: [],
  },
  {
    title: "Look at the focus ring against the surface it sits on",
    how:
      "Walk the same pages on a dark display and check that every stop has a ring you can actually see. The scenes draw their own rings, and several of them sit on gradients or glass panels.",
    fails: "a ring that is drawn but invisible over the surface behind it, which reads as no focus at all.",
    automated: "token-level contrast on /quality — a colour pair, not a ring on a gradient",
    where: [{ href: "/quality" }],
  },
  {
    title: "Listen to what the screen reader says, not just that it can",
    how:
      "Run one scene under a screen reader (or an axe/Playwright aria snapshot), trigger it and listen. The live-region and toast scenes are where the words are the whole point: does the announcement arrive, and is it the sentence a person needs?",
    fails: "a message that never announces because the region mounted with its text already in it, or a name that passes the checker and confuses a listener.",
    automated: "that a name exists — nothing about whether it means anything",
    where: [{ href: "/components/live-region-demo" }, { href: "/components/toast-stack" }],
  },
  {
    title: "Set reduced motion and open the animated scenes",
    how:
      "Turn on the system preference and walk the animated half of the catalog. The part that moves has to stop or become instant; a scene that only slows down has not honoured it.",
    fails: "animation that keeps running, or content that disappears because it only ever appeared through animation.",
    automated: "the demo harness checks that each scene declares a reduced-motion branch",
    where: [{ href: "/quality" }],
  },
  {
    title: "Zoom to 200% and use only touch-sized targets",
    how:
      "Set the browser to 200% zoom and check every control a finger has to hit, then repeat at 375 px wide. Nothing should be clipped, overlap or scroll sideways.",
    fails: "targets smaller than a fingertip, or text that only fits because nobody zoomed it.",
    where: [],
  },
];
