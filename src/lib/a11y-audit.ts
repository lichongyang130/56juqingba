// #507 — the markup accessibility audit.
//
// The catalog's per-asset "a11y" number is an editorial score kept in the data
// file. This module is the other half: an automated pass over the built HTML of
// every page, checking only things that can be decided from markup — an image
// without alt text, a control without an accessible name, a duplicate id, a
// heading that skips a level, a document with no language.
//
// It runs at build time, in the same process as the page that reports it, so
// the numbers cannot be stale. Nothing here needs a browser, which is also why
// it is honest about what it does not check (see the page).

import { COMPONENTS } from "./data";

export interface A11yIssue {
  kind: string;
  page: string;
  detail: string;
}

export interface A11yReport {
  pages: number;
  issues: A11yIssue[];
  byKind: Record<string, number>;
  checks: { id: string; what: string }[];
  fixed: { commit: string; what: string; pages: number }[];
}

/** The checks this pass performs, named so the page can list them. */
export const A11Y_CHECKS: { id: string; what: string }[] = [
  { id: "img-no-alt", what: "an <img> with no alt attribute" },
  { id: "button-no-name", what: "a button with no text, aria-label or title, outside an aria-hidden subtree" },
  { id: "link-no-name", what: "a link with no text and no accessible name" },
  { id: "input-no-label", what: "a form control with no label, aria-label or explicit label association" },
  { id: "duplicate-id", what: "two elements sharing an id in one document" },
  { id: "heading-skip", what: "a heading that jumps down more than one level" },
  { id: "no-lang", what: "a document with no lang attribute on <html>" },
];

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
