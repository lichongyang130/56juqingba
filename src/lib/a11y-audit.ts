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
