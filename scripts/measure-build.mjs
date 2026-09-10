#!/usr/bin/env node
// Measures a completed production build and writes docs/build-report.json.
//
// Why this is a script and not a page: the HTML figures cannot be measured
// while the build is running. `next build` writes each page's HTML as it
// prerenders it, so a page rendered early sees only the handful of files that
// exist so far — the first version of the budget page reported "31 of 94 routes
// have a prerendered body" against 106 real pages. Running this after the build
// reads the finished output instead, and committing the result means every page
// quotes the same measurement with the same provenance.
//
// Usage: node scripts/measure-build.mjs   (after `npm run build`)

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const NEXT = path.join(ROOT, ".next");
const SERVER_APP = path.join(NEXT, "server", "app");
const CHUNK_DIR = path.join(NEXT, "static", "chunks");
const MEDIA_DIR = path.join(NEXT, "static", "media");
const OUT = path.join(ROOT, "docs", "build-report.json");

const kb = (bytes) => Math.round((bytes / 1024) * 10) / 10;

function fail(message) {
  console.error(`measure-build: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(SERVER_APP)) fail("no .next/server/app — run `npm run build` first");

const existingHtmlCount = () => {
  const walkHtml = (dir) => {
    let n = 0;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      n += entry.isDirectory() ? walkHtml(full) : entry.name.endsWith(".html") ? 1 : 0;
    }
    return n;
  };
  return walkHtml(SERVER_APP);
};

/* ---------- routes ---------- */

function routeKeyToUrl(key) {
  const cleaned = key
    .split("/")
    .filter((seg) => seg && !(seg.startsWith("(") && seg.endsWith(")")))
    .filter((seg) => seg !== "page")
    .join("/");
  return "/" + cleaned;
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const allFiles = walk(SERVER_APP);

const htmlIndex = new Map();
for (const file of allFiles.filter((f) => f.endsWith(".html"))) {
  const rel = path.relative(SERVER_APP, file).replace(/\.html$/, "").replace(/\/page$/, "");
  const url = rel === "index" || rel === "" ? "/" : "/" + rel;
  const entry = { kb: kb(fs.statSync(file).size), file: path.relative(ROOT, file) };
  const existing = htmlIndex.get(url);
  if (!existing || entry.kb > existing.kb) htmlIndex.set(url, entry);
}

const routeEntries = [];
for (const file of allFiles.filter((f) => f.endsWith("page_client-reference-manifest.js"))) {
  let payload;
  try {
    const text = fs.readFileSync(file, "utf8");
    payload = JSON.parse(text.slice(text.indexOf("= {") + 2, text.lastIndexOf(";")));
  } catch {
    continue; // a manifest we cannot parse is skipped, never guessed at
  }
  const js = new Set();
  const pageChunks = new Set();
  const css = new Set();
  for (const files of Object.values(payload.entryJSFiles ?? {})) {
    for (const f of files) {
      js.add(f);
      pageChunks.add(f);
    }
  }
  for (const files of Object.values(payload.entryCSSFiles ?? {})) for (const f of files) css.add(f.path);
  const rel = path.relative(SERVER_APP, file).replace(/\/page_client-reference-manifest\.js$/, "");
  // Next emits manifests for its own built-in pages too (_global-error,
  // not-found). They are not routes of this site, and one of them would
  // otherwise win the "lightest route" baseline and shrink every other route's
  // own-JS figure to nonsense.
  if (rel.includes("not-found") || rel.includes("_global-error") || rel.startsWith("_")) continue;
  routeEntries.push({
    url: routeKeyToUrl(rel),
    js: [...js],
    css: [...css],
    pageChunks: [...pageChunks],
  });
}

const chunkKb = (rel) => {
  try {
    return kb(fs.statSync(path.join(NEXT, rel)).size);
  } catch {
    return 0;
  }
};

const totals = new Map(routeEntries.map((r) => [r.url, r.js.reduce((a, f) => a + chunkKb(f), 0)]));

// The baseline is the lightest route's file set — in this build a demo-less page
// such as /quality. "Own" is then what a route adds on top of that shell, which
// is the question a budget answers. An earlier version of this script defined
// own as "page-level entry files minus layout entry files", and that attributed
// almost nothing to /lab/layers even though the page pulls the 300 KB demo
// module through an imported component: module attribution is not cost.
const baselineUrl =
  [...totals.entries()].sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]))[0]?.[0] ?? "/";
const baselineSet = new Set(routeEntries.find((r) => r.url === baselineUrl)?.js ?? []);

const routes = routeEntries
  .map((r) => {
    const own = r.js.filter((f) => !baselineSet.has(f));
    const html = htmlIndex.get(r.url);
    return {
      url: r.url,
      ownJsKb: Math.round(own.reduce((a, f) => a + chunkKb(f), 0) * 10) / 10,
      totalJsKb: Math.round(totals.get(r.url) * 10) / 10,
      cssKb: Math.round(r.css.reduce((a, f) => a + chunkKb(f), 0) * 10) / 10,
      htmlKb: html?.kb ?? 0,
      prerendered: Boolean(html),
      jsFiles: r.js.length,
      ownFiles: own,
    };
  })
  .sort((a, b) => b.ownJsKb - a.ownJsKb || a.url.localeCompare(b.url));

/* ---------- emitted assets ---------- */

const chunkFiles = fs.existsSync(CHUNK_DIR) ? fs.readdirSync(CHUNK_DIR) : [];
const jsFiles = chunkFiles.filter((f) => f.endsWith(".js"));
const cssFiles = chunkFiles.filter((f) => f.endsWith(".css"));
const fontFilesOnDisk = fs.existsSync(MEDIA_DIR) ? fs.readdirSync(MEDIA_DIR).filter((f) => f.endsWith(".woff2")) : [];
const htmlFiles = allFiles.filter((f) => f.endsWith(".html"));

/* ---------- fonts + preload coverage ---------- */

const preloadCounts = new Map();
let pagesWithPreload = 0;
for (const file of htmlFiles) {
  const text = fs.readFileSync(file, "utf8");
  const links = [...text.matchAll(/<link rel="preload" href="([^"]+\.woff2)"/g)].map((m) => m[1].split("/").pop());
  if (links.length) pagesWithPreload++;
  for (const l of links) preloadCounts.set(l, (preloadCounts.get(l) ?? 0) + 1);
}

const fonts = fontFilesOnDisk
  .map((f) => {
    const name = f.replace(/-s\.p\.[a-z0-9]+\.woff2$/, "");
    const parts = name.split("_");
    return {
      file: f,
      family: (parts[0] ?? "unknown").replace(/^./, (c) => c.toUpperCase()),
      subset: parts[1] ?? "unknown",
      kb: kb(fs.statSync(path.join(MEDIA_DIR, f)).size),
      preloaded: preloadCounts.has(f),
      pagesPreloading: preloadCounts.get(f) ?? 0,
    };
  })
  .sort((a, b) => b.kb - a.kb);

/* ---------- the JavaScript-off view ---------- */

function jsOffFor(url) {
  const hit = htmlIndex.get(url);
  if (!hit) return null; // rendered on demand: a live request is the only way to see it
  const text = fs.readFileSync(path.join(ROOT, hit.file), "utf8");
  const count = (re) => (text.match(re) ?? []).length;
  return {
    htmlKb: hit.kb,
    pending: count(/data-lazy-state="pending"/g),
    mounted: count(/data-lazy-state="mounted"/g),
    links: count(/href="\//g),
    headings: count(/<h3/g),
  };
}

const jsOff = {};
for (const url of ["/components", "/backgrounds", "/prompts", "/components/combo-box", "/learn"]) {
  jsOff[url] = jsOffFor(url);
}

/* ---------- write ---------- */

const report = {
  measuredAt: new Date().toISOString(),
  buildId: fs.existsSync(path.join(NEXT, "BUILD_ID")) ? fs.readFileSync(path.join(NEXT, "BUILD_ID"), "utf8").trim() : null,
  command: "npm run build && npm run measure",
  summary: {
    routes: routes.length,
    prerendered: routes.filter((r) => r.prerendered).length,
    onDemand: routes.filter((r) => !r.prerendered).length,
    jsFiles: jsFiles.length,
    jsKb: Math.round(jsFiles.reduce((a, f) => a + kb(fs.statSync(path.join(CHUNK_DIR, f)).size), 0) * 10) / 10,
    cssFiles: cssFiles.length,
    cssKb: Math.round(cssFiles.reduce((a, f) => a + kb(fs.statSync(path.join(CHUNK_DIR, f)).size), 0) * 10) / 10,
    fontFiles: fonts.length,
    fontKb: Math.round(fonts.reduce((a, f) => a + f.kb, 0) * 10) / 10,
    htmlFiles: htmlFiles.length,
    htmlKb: Math.round(htmlFiles.reduce((a, f) => a + kb(fs.statSync(f).size), 0) * 10) / 10,
  },
  sharedJsKb: Math.round([...baselineSet].reduce((a, f) => a + chunkKb(f), 0) * 10) / 10,
  baseline: {
    url: baselineUrl,
    jsKb: Math.round(totals.get(baselineUrl) * 10) / 10,
    note: "The lightest route's file set, used as the shell every other route adds to. In this build that is a page which renders no demo.",
  },
  routes,
  fonts: { files: fonts, totalKb: Math.round(fonts.reduce((a, f) => a + f.kb, 0) * 10) / 10, pagesWithPreload, pages: htmlFiles.length },
  heaviestHtml: [...htmlIndex.values()]
    .sort((a, b) => b.kb - a.kb)
    .slice(0, 8)
    .map((h) => ({ file: h.file, kb: h.kb })),
  jsOff,
};

// A failed or interrupted build leaves a partial .next. Writing that over a good
// report would replace measured numbers with zeros, which is worse than stale
// numbers — the pages would print "0 routes" as a measurement.
const sanity = report.summary.htmlFiles;
const expected = existingHtmlCount();
if (sanity < expected * 0.9) {
  fail(`refusing to write ${sanity} HTML files into the report when ${expected} exist on disk — the build looks incomplete, so run\n  next build\nand measure again. docs/build-report.json was left untouched.`);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(report, null, 2) + "\n");
console.log(
  `measure-build: ${report.summary.routes} routes · ${report.summary.prerendered} prerendered · ` +
    `${report.summary.jsFiles} JS chunks (${report.summary.jsKb} KB) · ${report.summary.htmlFiles} HTML files · ` +
    `fonts ${report.summary.fontKb} KB preloaded on ${pagesWithPreload}/${htmlFiles.length} pages → docs/build-report.json`
);
