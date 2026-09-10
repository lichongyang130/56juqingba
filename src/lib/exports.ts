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

/* ---------- changelog feed ---------- */

/** RSS 2.0 for the changelog. Dates are the stored ISO dates; the feed says so
 *  rather than inventing publication times. */
export function changelogRss(site = "https://motif.example"): string {
  const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const items = CHANGELOG.map((c) => {
    const perf = c.perf ? ` Measured size change: ${c.perf.deltaKb} KB (${c.perf.scope}, ${c.perf.build}).` : "";
    return `    <item>
      <title>${esc(c.title)}</title>
      <link>${site}/#changelog</link>
      <guid isPermaLink="false">motif-changelog-${c.date}-${esc(c.title).slice(0, 24).replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}</guid>
      <pubDate>${c.date}T00:00:00Z</pubDate>
      <category>${esc(c.tag)}</category>
      <description>${esc(c.body + perf)}</description>
    </item>`;
  }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Motif UI — changelog</title>
    <link>${site}/#changelog</link>
    <description>Studio log for Motif UI. ${CHANGELOG.length} entries; dates are the stored publication dates, not feed times.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;
}

/* ---------- React package scaffold ---------- */

/** A real wrapper a package could ship: it turns token values into custom
 *  properties on a subtree. Markup wrappers that "style" a component they do
 *  not own would be a lie, so this one only does what it can do exactly. */
export function reactWrapper(): string {
  const t = tokenSet();
  const vars = Object.entries(t.colors)
    .map(([k, v]) => `  "--color-${k}": "${v}",`)
    .join("\n");
  return `/* Motif UI — token provider.
 *
 * This is the one component a package could ship honestly today: it puts the
 * design tokens on a subtree as custom properties, which is exactly what this
 * site's stylesheet does at :root. It does not render the catalog components,
 * because their source is not part of the export.
 *
 * Intended package layout (not published — see /integrations/react):
 *   motif-tokens/package.json      name, version, peerDependencies: react>=18
 *   motif-tokens/index.js          this file
 *   motif-tokens/tokens.json       the DTCG file from /api/exports/tokens.json
 *   motif-tokens/README.md         what it does and what it does not
 */
"use client";

import React from "react";

const TOKENS = {
${vars}
};

export function MotifTokens({ mode = "dark", children }) {
  return React.createElement(
    "div",
    {
      "data-motif-mode": mode,
      style: TOKENS,
    },
    children
  );
}

export const motifTokens = TOKENS;

export default MotifTokens;
`;
}

/* ---------- single-file HTML copy ---------- */

/** One self-contained page: inline styles, no requests, no framework. The
 *  markup is the layout vocabulary this site uses, not a catalog demo — the
 *  demos' source is not stored, and a single-file export that quietly
 *  substituted a simplified copy of one would be the wrong kind of help. */
export function singleFileHtml(): string {
  const t = tokenSet();
  const body = t.colors.bg;
  const panel = t.colors.panel;
  const ink = t.colors.ink;
  const dim = t.colors["ink-dim"];
  const faint = t.colors["ink-faint"];
  const accent = t.colors.accent;
  const accent2 = t.colors["accent-2"];
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Motif UI — single-file starter</title>
<meta name="description" content="One file, inline styles, no requests. Generated from the design tokens in /api/exports/tokens.json.">
<style>
  /* Tokens, inlined. Nothing here is fetched. */
  :root {
    --color-bg: ${body};
    --color-panel: ${panel};
    --color-ink: ${ink};
    --color-ink-dim: ${dim};
    --color-ink-faint: ${faint};
    --color-accent: ${accent};
    --color-accent-2: ${accent2};
    --radius-lg: ${t.radii.lg ?? "24px"};
    --radius-md: ${t.radii.md ?? "16px"};
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 3rem 1.25rem;
    background: var(--color-bg);
    color: var(--color-ink);
    font-family: ${t.fonts.sans?.split(",")[0] ?? "system-ui"};
    line-height: 1.6;
  }
  .wrap { max-width: 42rem; margin: 0 auto; }
  .kicker {
    margin: 0;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--color-accent-2);
  }
  h1 { margin: 0.5rem 0 0; font-size: 2.25rem; line-height: 1.1; letter-spacing: -0.02em; }
  .gradient {
    background: linear-gradient(90deg, var(--color-accent), var(--color-accent-2));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .panel {
    margin-top: 2rem;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: var(--radius-lg);
    background: var(--color-panel);
  }
  .panel h2 { margin: 0; font-size: 0.75rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--color-ink-faint); }
  .panel p { margin: 0.6rem 0 0; color: var(--color-ink-dim); }
  .stats { display: grid; gap: 0.75rem; grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr)); margin-top: 2rem; }
  .stat { padding: 0.9rem 1rem; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: var(--radius-md); }
  .stat dt { font-size: 0.7rem; color: var(--color-ink-faint); }
  .stat dd { margin: 0.2rem 0 0; font-size: 1.35rem; font-weight: 800; font-variant-numeric: tabular-nums; }
  .chips { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 1.25rem; }
  .chip {
    padding: 0.3rem 0.7rem;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 999px;
    font-size: 0.7rem;
    color: var(--color-ink-dim);
  }
  footer { margin-top: 3rem; font-size: 0.75rem; color: var(--color-ink-faint); }
  footer a { color: var(--color-accent-2); }
</style>
</head>
<body>
  <main class="wrap">
    <p class="kicker">Single-file starter</p>
    <h1>Copy less. <span class="gradient">Ship more.</span></h1>

    <section class="panel">
      <h2>Where these values came from</h2>
      <p>
        Every colour above is a token from the site's stylesheet, written into this file once.
        There is no stylesheet request, no font file and no script: open it from disk and it renders.
      </p>
    </section>

    <dl class="stats">
      <div class="stat"><dt>Tokens inlined</dt><dd>${Object.keys(t.colors).length + Object.keys(t.radii).length}</dd></div>
      <div class="stat"><dt>Network requests</dt><dd>0</dd></div>
      <div class="stat"><dt>Script bytes</dt><dd>0</dd></div>
      <div class="stat"><dt>File weight</dt><dd>{{WEIGHT}} KB</dd></div>
    </dl>

    <div class="chips">
      <span class="chip">no framework</span>
      <span class="chip">no build step</span>
      <span class="chip">tokens only</span>
      <span class="chip">printable</span>
    </div>

    <footer>
      Generated from <code>/api/exports/tokens.json</code>. The catalog's component source is not stored,
      so this starter carries the layout vocabulary rather than a copy of any demo.
    </footer>
  </main>
</body>
</html>
`;
}

/* ---------- CodeSandbox file set ---------- */

/** The three files a sandbox needs, as one JSON bundle. The page explains why
 *  this is a file set rather than a one-click deep link. */
export function codesandboxFiles(): string {
  const tokens = JSON.parse(tokensJson()) as { color: Record<string, { $value: string }> };
  const cssVars = Object.entries(tokens.color)
    .map(([k, v]) => `  --color-${k}: ${v.$value};`)
    .join("\n");
  const payload = {
    $description:
      "Files for a CodeSandbox project. Paste them into a new sandbox, or upload them as a zip. The one-click define link is a named gap — see /integrations/codesandbox.",
    files: {
      "sandbox.config.json": JSON.stringify({ template: "static" }, null, 2) + "\n",
      "package.json":
        JSON.stringify(
          {
            name: "motif-single-file",
            version: "0.0.0",
            private: true,
            description: "Motif UI tokens as a static page.",
          },
          null,
          2
        ) + "\n",
      "index.html": `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Motif tokens in a sandbox</title>
<style>
  :root {
${cssVars}
    --radius-lg: 24px;
  }
  body { margin: 0; padding: 3rem 1.25rem; background: var(--color-bg); color: var(--color-ink);
         font-family: ui-sans-serif, system-ui, sans-serif; }
  .card { max-width: 38rem; margin: 0 auto; padding: 1.5rem; border: 1px solid rgba(255,255,255,.08);
          border-radius: var(--radius-lg); background: var(--color-panel); }
  p { color: var(--color-ink-dim); }
</style>
</head>
<body>
  <div class="card">
    <h1>Motif tokens, running in a sandbox</h1>
    <p>${Object.keys(tokens.color).length} colour tokens, inlined. Edit any value and the page follows.</p>
  </div>
</body>
</html>
`,
    },
  };
  return JSON.stringify(payload, null, 2) + "\n";
}

/* ---------- the print stylesheet, as text ---------- */

/** The print block, read out of the stylesheet. The page that documents it
 *  prints exactly these rules, so the documentation cannot describe a
 *  print stylesheet that no longer exists. */
export function printCss(): string {
  const css = fs.readFileSync(path.join(ROOT, "src/app/globals.css"), "utf8");
  const marker = "@media print {";
  const start = css.indexOf(marker);
  if (start === -1) return "/* no @media print block in src/app/globals.css */";
  const end = css.indexOf("\n}", css.indexOf("@page", start));
  return css.slice(start, end === -1 ? undefined : end + 2).trim();
}

/* ---------- Storybook decorator ---------- */

export function storybookDecorator(): string {
  const t = tokenSet();
  const vars = Object.entries(t.colors)
    .map(([k, v]) => `        "--color-${k}": "${v}",`)
    .join("\n");
  return `/* Motif UI Storybook decorator — tokens from src/app/globals.css.
 *
 * Wrap a preview so stories inherit this site's palette. The decorator sets
 * custom properties rather than importing a stylesheet: the tokens are the
 * contract, the component classes are not part of this export.
 *
 * Usage:  // .storybook/preview.js
 *         import { withMotif } from "./motif-storybook-decorator";
 *         export const decorators = [withMotif];
 */
import React from "react";

const TOKENS = {
${vars}
};

export const withMotif = (Story) =>
  React.createElement(
    "div",
    {
      style: {
        ...TOKENS,
        background: TOKENS["--color-bg"],
        color: TOKENS["--color-ink"],
        padding: "2rem",
        fontFamily: ${JSON.stringify(t.fonts.sans?.split(",")[0] ?? "system-ui")},
      },
    },
    React.createElement(Story)
  );

export default withMotif;
`;
}

/* ---------- Open Graph markup ---------- */

export interface OgMarkup {
  slug: string;
  title: string;
  markup: string;
  hasImage: false;
}

/** #4xx — the OG block for an asset page. There is no image to point at: this
 *  site ships none, so the markup declares a title and description only and the
 *  page says what adding a card image would cost. */
export function ogMarkup(slug: string, origin = "https://motif.example"): OgMarkup | null {
  const asset = COMPONENTS.find((c) => c.slug === slug);
  if (!asset) return null;
  const title = `${asset.title} — Motif UI`;
  const description = `${asset.description} ${asset.stack.join(" / ")} · ${asset.bundleKb} KB · a11y ${asset.a11yScore} · MIT.`;
  const url = `${origin}/components/${asset.slug}`;
  const markup = `<meta property="og:type" content="article" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description.slice(0, 200)}" />
<meta property="og:url" content="${url}" />
<meta name="twitter:card" content="summary" />
<!-- No og:image: this site ships no raster artwork. A card image would need a
     build step that rasterises, which is a deliberate gap, not an oversight. -->`;
  return { slug: asset.slug, title, markup, hasImage: false };
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

export const EXPORTS: ExportEntry[] = [  {
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
  {
    file: "motif-react-wrapper.jsx",
    label: "React token provider",
    contentType: "text/jsx; charset=utf-8",
    item: "#424",
    blurb: "The one component a package could ship honestly: tokens as custom properties on a subtree.",
    build: reactWrapper,
  },
  {
    file: "single-file.html",
    label: "Single-file starter",
    contentType: "text/html; charset=utf-8",
    item: "#425",
    blurb: "One self-contained page — inline tokens, zero requests, no script — for the layout vocabulary.",
    build: () => singleFileHtml().replace("{{WEIGHT}}", (Buffer.byteLength(singleFileHtml(), "utf8") / 1024).toFixed(1)),
  },
  {
    file: "codesandbox-files.json",
    label: "CodeSandbox file set",
    contentType: "application/json; charset=utf-8",
    item: "#426",
    blurb: "Three files to paste into a sandbox, because the one-click deep link cannot be verified here.",
    build: codesandboxFiles,
  },
  {
    file: "changelog.xml",
    label: "Changelog feed",
    contentType: "application/rss+xml; charset=utf-8",
    item: "#420",
    blurb: "RSS for the studio log, with each entry's measured size change carried in the description.",
    build: () => changelogRss(),
  },
  {
    file: "motif-storybook-decorator.jsx",
    label: "Storybook decorator",
    contentType: "text/jsx; charset=utf-8",
    item: "#421",
    blurb: "A decorator that hands your stories this site's palette as custom properties.",
    build: storybookDecorator,
  },
  {
    file: "learn-print.css",
    label: "Print stylesheet",
    contentType: "text/css; charset=utf-8",
    item: "#423",
    blurb: "The @media print block this site compiles, served as a file so it can be copied into another project.",
    build: printCss,
  },
];

export function exportFor(file: string): ExportEntry | undefined {
  return EXPORTS.find((e) => e.file === file);
}

export function exportSizeKb(body: string): number {
  return Math.round((Buffer.byteLength(body, "utf8") / 1024) * 10) / 10;
}
