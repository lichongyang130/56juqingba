/* ---------------------------------------------------------------------
   Section 16 — exports.

   Everything here is derived from something the site already ships: the
   design tokens are parsed out of `src/app/globals.css`, the catalog
   export is read from the data module, and nothing is transcribed by
   hand. That is the point of the section: an export that disagrees with
   the product is worse than no export, so there is exactly one source
   and the endpoint and the page both read it.
   --------------------------------------------------------------------- */

import fs from "node:fs";
import path from "node:path";
import { CHANGELOG, COMPONENTS, PROMPTS } from "./data";

const ROOT = process.cwd();

export interface TokenSet {
  colors: Record<string, string>;
  radii: Record<string, string>;
  fonts: Record<string, string>;
}

/** Parse the @theme block of globals.css. Colours are kept as authored hex or
 *  rgba() strings; nothing is normalised, because a preset that silently
 *  reshapes a value is a preset you cannot diff against the stylesheet. */
export function tokenSet(): TokenSet {
  const css = fs.readFileSync(path.join(ROOT, "src/app/globals.css"), "utf8");
  const block = css.slice(css.indexOf("@theme {"), css.indexOf("}", css.indexOf("@theme {")));
  const colors: Record<string, string> = {};
  const radii: Record<string, string> = {};
  const fonts: Record<string, string> = {};
  for (const raw of block.split("\n")) {
    const line = raw.trim();
    const m = /^--(color|radius|font)-([a-z0-9-]+):\s*(.+?);$/.exec(line);
    if (!m) continue;
    const [, group, name, value] = m;
    if (group === "color") colors[name] = value;
    else if (group === "radius") radii[name] = value;
    else fonts[name] = value.replace(/\s+/g, " ");
  }
  return { colors, radii, fonts };
}

function hexToRgba(value: string): { r: number; g: number; b: number; a: number } | null {
  const hex = /^#([0-9a-f]{6})$/i.exec(value.trim());
  if (!hex) {
    const rgba = /rgba\(\s*(\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\s*\)/.exec(value);
    if (!rgba) return null;
    return { r: +rgba[1] / 255, g: +rgba[2] / 255, b: +rgba[3] / 255, a: +rgba[4] };
  }
  const n = parseInt(hex[1], 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255, a: 1 };
}

/* ---------- W3C design tokens (DTCG) ---------- */

export function tokensJson(): string {
  const t = tokenSet();
  const out: Record<string, unknown> = {
    $description: "Motif UI design tokens, generated from the stylesheet this site compiles.",
    $extensions: { "com.motif.source": "src/app/globals.css @theme block" },
    color: Object.fromEntries(Object.entries(t.colors).map(([k, v]) => [k, { $type: "color", $value: v }])),
    radius: Object.fromEntries(Object.entries(t.radii).map(([k, v]) => [k, { $type: "dimension", $value: v }])),
    font: Object.fromEntries(Object.entries(t.fonts).map(([k, v]) => [k, { $type: "fontFamily", $value: v.split(",").map((s) => s.trim()) }])),
  };
  return JSON.stringify(out, null, 2) + "\n";
}

/* ---------- Tailwind preset ---------- */

export function tailwindPreset(): string {
  const t = tokenSet();
  const colors = Object.entries(t.colors)
    .map(([k, v]) => `      "${k}": "${v}",`)
    .join("\n");
  const radii = Object.entries(t.radii)
    .map(([k, v]) => `        "${k}": "${v}",`)
    .join("\n");
  return `/* Motif UI Tailwind preset — generated from src/app/globals.css.
 *
 * Covers the design tokens only. Component markup is not included, because
 * the catalog stores component metadata rather than component source; a
 * preset that shipped invented markup would be a different product.
 *
 * Usage:  // tailwind.config.js
 *         const motif = require("./motif-preset.cjs");
 *         module.exports = { presets: [motif], content: ["./src/** /*.{ts,tsx}"] };
 */
module.exports = {
  theme: {
    extend: {
      colors: {
${colors}
      },
      borderRadius: {
${radii}
      },
      fontFamily: {
        sans: ${JSON.stringify(t.fonts.sans?.split(",")[0] ?? "system-ui")},
        display: ${JSON.stringify(t.fonts.display?.split(",")[0] ?? "system-ui")},
      },
    },
  },
};
`;
}

/* ---------- Figma variables ---------- */

export interface FigmaVariables {
  collections: {
    name: string;
    modes: { name: string }[];
    variables: {
      name: string;
      resolvedType: "COLOR" | "FLOAT";
      description: string;
      valuesByMode: Record<string, { r: number; g: number; b: number; a: number } | number>;
    }[];
  }[];
}

/** The shape Figma's Variables importer accepts. Colours become 0–1 RGBA
 *  channels, dimensions become numbers in the unit Figma uses internally
 *  (pixels), and anything that cannot be represented is left out with a note
 *  rather than coerced into a wrong value. */
export function figmaVariables(): { json: string; skipped: string[] } {
  const t = tokenSet();
  const skipped: string[] = [];
  const variables: FigmaVariables["collections"][number]["variables"] = [];

  for (const [k, v] of Object.entries(t.colors)) {
    const rgba = hexToRgba(v);
    if (!rgba) {
      skipped.push(k);
      continue;
    }
    variables.push({
      name: `color/${k}`,
      resolvedType: "COLOR",
      description: `Motif ${k}`,
      valuesByMode: { Dark: rgba },
    });
  }
  for (const [k, v] of Object.entries(t.radii)) {
    const px = parseFloat(v);
    if (Number.isNaN(px)) {
      skipped.push(`radius/${k}`);
      continue;
    }
    variables.push({
      name: `radius/${k}`,
      resolvedType: "FLOAT",
      description: `Motif radius ${k}`,
      valuesByMode: { Dark: px },
    });
  }

  const payload: FigmaVariables = {
    collections: [{ name: "Motif UI", modes: [{ name: "Dark" }], variables }],
  };
  return { json: JSON.stringify(payload, null, 2) + "\n", skipped };
}

/* ---------- VS Code snippets ---------- */

export function vscodeSnippets(): string {
  const snippets: Record<string, unknown> = {
    "Motif panel": {
      prefix: "mf-panel",
      body: [
        '<div className="rounded-3xl border border-white/8 bg-panel p-6">',
        "  <p className=\"text-xs font-bold uppercase tracking-widest text-ink-faint\">${1:Label}</p>",
        "  <p className=\"mt-2 text-sm leading-relaxed text-ink-dim\">${2:Copy}</p>",
        "</div>",
        "$0",
      ],
      description: "Muted panel with a kicker — the container used across this site.",
    },
    "Motif chip row": {
      prefix: "mf-chips",
      body: [
        '<div className="flex flex-wrap gap-1.5">',
        "  ${1:items.map((item) => (",
        '    <span key={item} className="chip !text-[10px]">{item}</span>',
        "  ))}",
        "</div>",
        "$0",
      ],
      description: "Wrapping chip row for tags and filters.",
    },
    "Motif buttons": {
      prefix: "mf-buttons",
      body: [
        '<div className="flex flex-wrap gap-2">',
        '  <button className="btn btn-primary !px-3.5 !py-2 text-xs">${1:Primary}</button>',
        '  <button className="btn btn-ghost !px-3.5 !py-2 text-xs">${2:Secondary}</button>',
        "</div>",
        "$0",
      ],
      description: "The two button weights this site uses, at the small size.",
    },
    "Motif gradient headline": {
      prefix: "mf-headline",
      body: ['<h2 className="text-3xl font-extrabold tracking-tight">', '  Before <span className="text-gradient">${1:emphasis}</span>', "</h2>", "$0"],
      description: "Display headline with the site's gradient emphasis.",
    },
    "Motif stat row": {
      prefix: "mf-stats",
      body: [
        '<dl className="grid gap-3 sm:grid-cols-3">',
        "  ${1:rows.map((row) => (",
        '    <div key={row.label} className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-3">',
        '      <dt className="text-[10px] text-ink-faint">{row.label}</dt>',
        '      <dd className="text-sm font-extrabold tabular-nums text-ink">{row.value}</dd>',
        "    </div>",
        "  ))}",
        "</dl>",
        "$0",
      ],
      description: "Three-up readout row for measured numbers.",
    },
  };
  return JSON.stringify(snippets, null, 2) + "\n";
}

/* ---------- the catalog, as data ---------- */

export function catalogJson(): string {
  const payload = {
    $description: "Motif UI catalog metadata — what the site stores about each asset.",
    $generated: {
      components: COMPONENTS.length,
      prompts: PROMPTS.length,
      changelogEntries: CHANGELOG.length,
      note: "Scores, bundle sizes and licences are the stored values. Component source code is not part of this export, because the catalog does not store it.",
    },
    components: COMPONENTS.map((c) => ({
      slug: c.slug,
      title: c.title,
      kind: c.kind,
      stack: c.stack,
      license: c.license,
      version: c.version,
      bundleKb: c.bundleKb,
      a11yScore: c.a11yScore,
      qualityScore: c.qualityScore,
      themeable: c.themeable,
      tags: c.tags,
      published: c.published,
    })),
    prompts: PROMPTS.map((p) => ({
      slug: p.slug,
      title: p.title,
      industry: p.industry,
      avgFidelity: p.avgFidelity,
      bestModel: p.bestModel,
      status: p.status,
      runs: p.runs.length,
      models: [...new Set(p.runs.map((r) => r.model))],
    })),
  };
  return JSON.stringify(payload, null, 2) + "\n";
}

/* ---------- registry ---------- */

export interface ExportEntry {
  file: string;
  label: string;
  contentType: string;
  item: string;
  blurb: string;
  build: () => string;
}

export const EXPORTS: ExportEntry[] = [
  {
    file: "tokens.json",
    label: "Design tokens (DTCG)",
    contentType: "application/json; charset=utf-8",
    item: "#415",
    blurb: "Colours, radii and font stacks in the W3C design-token format, parsed out of the stylesheet.",
    build: tokensJson,
  },
  {
    file: "motif-preset.cjs",
    label: "Tailwind preset",
    contentType: "text/javascript; charset=utf-8",
    item: "#416",
    blurb: "A CommonJS preset with the site's tokens, ready for tailwind.config.js.",
    build: tailwindPreset,
  },
  {
    file: "figma-variables.json",
    label: "Figma variables",
    contentType: "application/json; charset=utf-8",
    item: "#417",
    blurb: "The same tokens as Figma colour and number variables, with the values it cannot hold left out.",
    build: () => figmaVariables().json,
  },
  {
    file: "catalog.json",
    label: "Catalog metadata",
    contentType: "application/json; charset=utf-8",
    item: "#418",
    blurb: "Every component and prompt with its stored scores — the data the site itself renders from.",
    build: catalogJson,
  },
  {
    file: "motif.code-snippets",
    label: "VS Code snippets",
    contentType: "application/json; charset=utf-8",
    item: "#419",
    blurb: "Five snippets for the layout patterns this site repeats, using its real utility classes.",
    build: vscodeSnippets,
  },
];

export function exportFor(file: string): ExportEntry | undefined {
  return EXPORTS.find((e) => e.file === file);
}

export function exportSizeKb(body: string): number {
  return Math.round((Buffer.byteLength(body, "utf8") / 1024) * 10) / 10;
}
