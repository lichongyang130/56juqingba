// #15 — accessible-name fixtures for the most interactive scenes.
//
// A name passes a linter if it exists; these fixtures assert it is the *right*
// name. Each stores the accessible name of the scene's primary control as the
// built embed markup currently ships it, and the drift check compares that
// string against the finished build. Change the name and either the fixture or
// the check fails — the drift is surfaced, not silently absorbed.
//
// Importable from the .mjs harnesses: node builtins only, no path aliases.

import fs from "node:fs";
import path from "node:path";

export interface NameFixture {
  slug: string;
  name: string;
}

/** The 30 most interactive scenes by declared behaviour, and the name their
 *  primary control should have. Ordered by interactivity. */
export const NAME_FIXTURES: NameFixture[] = [
  { slug: "file-drop-zone", name: "Upload a build spec" },
  { slug: "combo-box", name: "Search the component library" },
  { slug: "star-rating", name: "Rate this component" },
  { slug: "tag-input", name: "Remove motion" },
  { slug: "slider-ticks", name: "Reveal threshold percentage" },
  { slug: "quantity-stepper", name: "Decrease quantity" },
  { slug: "reading-dots", name: "Next section" },
  { slug: "pulse-graph", name: "Pause the pulse" },
  { slug: "bezier-drawer", name: "Control point 1" },
  { slug: "chart-scrubber", name: "Lower fidelity bound" },
  { slug: "scroll-pin", name: "Three-step story. Arrow keys move between steps; Escape releases pinning." },
  { slug: "reorder-list", name: "Reorder Write the brief. Arrow keys move it, Home and End send it to either end." },
  { slug: "split-pane", name: "Resize the two panels" },
  { slug: "command-palette", name: "Search the whole library" },
  { slug: "radio-pills", name: "Choose a plan" },
  { slug: "toggle-label-stack", name: "Weekly digest" },
  { slug: "ripple-dots", name: "Page sections" },
  { slug: "success-burst", name: "Create account (demo)" },
  { slug: "share-sheet", name: "Share this asset" },
  { slug: "search-walk", name: "Previous match" },
  { slug: "morph-icons", name: "Play icon, currently showing Pause" },
  { slug: "split-button-menu", name: "More deploy actions" },
  { slug: "pagination-ellipsis", name: "Pagination" },
  { slug: "tabs-indicator", name: "Sections" },
  { slug: "disclosure-list", name: "Can I use Motif assets in commercial projects?" },
  { slug: "fullscreen-overlay-menu", name: "Open menu" },
  { slug: "comparison-slider", name: "Comparison slider" },
  { slug: "newsletter-band-tiers", name: "Email address" },
  { slug: "template-gallery", name: "Filter templates" },
  { slug: "preloader-handoff", name: "Run the hand-off" },
];

/** The accessible names present in one page of built markup: explicit
 *  aria-labels, plus the visible text of a button (its name when unlabelled). */
export function accessibleNamesIn(html: string): { labels: string[]; buttons: string[] } {
  const labels = [...html.matchAll(/aria-label="([^"]{1,120})"/g)].map((m) => m[1]);
  const buttons = [...html.matchAll(/<button[^>]*>\s*([^<]{1,60}?)\s*<\/button>/g)].map((m) => m[1].trim());
  return { labels, buttons };
}

/** Compare every fixture against the built embed page for its slug. */
export function fixtureDrift(): { fixtures: number; drift: { slug: string; name: string }[] } {
  const dir = path.join(process.cwd(), ".next", "server", "app", "embed");
  const drift: { slug: string; name: string }[] = [];
  for (const f of NAME_FIXTURES) {
    const file = path.join(dir, `${f.slug}.html`);
    if (!fs.existsSync(file)) {
      drift.push({ slug: f.slug, name: "(no built embed page)" });
      continue;
    }
    const html = fs.readFileSync(file, "utf8");
    const { labels, buttons } = accessibleNamesIn(html);
    if (!labels.includes(f.name) && !buttons.includes(f.name)) drift.push({ slug: f.slug, name: f.name });
  }
  return { fixtures: NAME_FIXTURES.length, drift };
}
