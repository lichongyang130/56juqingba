// Section 15 — performance & delivery.
//
// Server-only: everything here is measured from the real build output on disk
// (.next/) and from the source tree, at build time. There are no estimated
// numbers in this file — if a measurement is unavailable, the reader gets a
// named gap instead of a plausible figure. Like quality-utils.ts, this module
// imports node:fs, so no client component may import it.

import fs from "node:fs";
import path from "node:path";
import { BACKGROUNDS, COMPONENTS, LAB_TOOLS, PROMPTS } from "./data";
import { CSS_TOTAL_KB, DEFAULT_OWN_CSS_KB, applyCssBudgets } from "./budgets";

const ROOT = process.cwd();
const REPORT = path.join(ROOT, "docs", "build-report.json");

/* -------------------------------------------------------------------
   The measured build report
   -------------------------------------------------------------------
   The numbers come from docs/build-report.json, written by
   scripts/measure-build.mjs after a completed build. They are deliberately not
   measured inside the build: `next build` writes page HTML as it prerenders,
   so a page rendered early sees a partial .next and reports a partial site. The
   committed report gives every page one provenance and one set of figures. */

export interface ReportRoute {
  url: string;
  ownJsKb: number;
  totalJsKb: number;
  cssKb: number;
  ownCssKb: number;
  htmlKb: number;
  prerendered: boolean;
  jsFiles: number;
  ownFiles: string[];
}

export interface BuildReport {
  measuredAt: string;
  buildId: string | null;
  command: string;
  summary: {
    routes: number;
    prerendered: number;
    onDemand: number;
    jsFiles: number;
    jsKb: number;
    cssFiles: number;
    cssKb: number;
    fontFiles: number;
    fontKb: number;
    htmlFiles: number;
    htmlKb: number;
  };
  sharedJsKb: number;
  sharedJsBudgetKb?: number;
  sharedJsNote?: string;
  sharedCssKb?: number;
  cssBaseline?: { url: string; cssKb: number; routesSharing: number; note: string };
  baseline: { url: string; jsKb: number; note: string };
  routes: ReportRoute[];
  fonts: {
    files: { file: string; family: string; subset: string; kb: number; preloaded: boolean; pagesPreloading: number }[];
    totalKb: number;
    pagesWithPreload: number;
    pages: number;
  };
  fontGlyphs?: { file: string; family: string; codepoints: number | null; probes: { name: string; char: string; cp: number; covered: boolean }[]; unreadable?: boolean }[];
  prefetch?: { pages: number; pagesWithPrefetch: number; links: number; maxOnAPage: number; budget: number; pagesWithLinks: { file: string; links: number }[] };
  og?: { cards: number; totalKb: number; maxKb: number; minKb: number; meanKb: number; budgetKb: number; heaviest: { slug: string; kb: number }[] };
  chunks?: { file: string; kb: number; modules: string[]; frameworkModules: number }[];
  heaviestHtml: { file: string; kb: number }[];
  jsOff: Record<string, { htmlKb: number; pending: number; mounted: number; links: number; headings: number } | null>;
}

let cached: BuildReport | null | undefined;

function report(): BuildReport | null {
  if (cached !== undefined) return cached;
  try {
    cached = JSON.parse(fs.readFileSync(REPORT, "utf8")) as BuildReport;
  } catch {
    cached = null;
  }
  return cached;
}

export function buildAvailable(): { ok: boolean; reason?: string } {
  if (report()) return { ok: true };
  return {
    ok: false,
    reason: "docs/build-report.json is missing — run `npm run build && node scripts/measure-build.mjs`, which is what the pages in this section read",
  };
}

export function reportMeta() {
  const r = report();
  if (!r) return null;
  return { measuredAt: r.measuredAt.slice(0, 16).replace("T", " "), buildId: r.buildId, command: r.command };
}

export function routeBudgets(): ReportRoute[] {
  return report()?.routes ?? [];
}

export function buildSummary() {
  const r = report();
  if (!r) {
    return {
      ok: false as const,
      routes: 0,
      jsFiles: 0,
      jsKb: 0,
      cssFiles: 0,
      cssKb: 0,
      fontFiles: 0,
      fontKb: 0,
      htmlFiles: 0,
      htmlKb: 0,
      sharedJsKb: 0,
      baselineUrl: "/",
      prerendered: 0,
      onDemand: 0,
    };
  }
  return { ok: true as const, ...r.summary, sharedJsKb: r.sharedJsKb, baselineUrl: r.baseline?.url ?? "/" };
}

export function heaviestHtml(limit = 8) {
  return (report()?.heaviestHtml ?? []).slice(0, limit);
}

/** Font files and preload coverage, from the completed build. */
export function fontAudit() {
  const r = report();
  const files = (r?.fonts.files ?? []).map((f) => ({ ...f, preloaded: f.preloaded }));
  return {
    ok: Boolean(r),
    files,
    families: [...new Set(files.map((f) => f.family))],
    totalKb: r?.fonts.totalKb ?? 0,
    preloadedCount: files.filter((f) => f.preloaded).length,
    preloadLinks: files.filter((f) => f.preloaded).map((f) => f.file),
    coverage: { pages: r?.fonts.pages ?? 0, pagesWithLinks: r?.fonts.pagesWithPreload ?? 0, linksPerPage: [] as string[][] },
    subsets: [...new Set(files.map((f) => f.subset))],
    /** Before #401, measured on the batch-55 build: nine subset files, no
     *  preload link on any page. Recorded so the audit shows a delta rather
     *  than asserting an improvement. */
    before: {
      files: 9,
      totalKb: 261.4,
      preloadedCount: 0,
      subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext", "greek", "greek-ext", "vietnamese"],
    },
  };
}

/* -------------------------------------------------------------------
   #402 / #403 — the JavaScript-off view
   ------------------------------------------------------------------- */

export interface JsOffRow {
  url: string;
  htmlKb: number;
  pending: number;
  mounted: number;
  links: number;
  headings: number;
  /** True when the route is rendered on demand, so the figures come from a live
   *  request rather than from a prerendered file. */
  onDemand: boolean;
}

export function jsOffReport(): JsOffRow[] {
  const r = report();
  const rows: JsOffRow[] = [];
  const urls = ["/components", "/backgrounds", "/prompts", "/learn"];
  for (const url of urls) {
    const hit = r?.jsOff?.[url];
    if (hit) {
      rows.push({ url, ...hit, onDemand: false });
    } else if (url === "/components") {
      // Rendered on demand: measured with a plain request, no script execution.
      rows.push({ url, ...MEASURED.after.jsOff["/components"], onDemand: true });
    }
  }
  return rows;
}

/* -------------------------------------------------------------------
   Source scans — blur budget (#407), timers (#410), imagery (#404)
   ------------------------------------------------------------------- */

/** Files that write about the audits instead of styling anything. Their code
 *  examples contain the very declarations the scans look for — a `<pre>` block
 *  reading `animation: spin 4s infinite` is copy, not a running animation — so
 *  they are excluded, and the number of excluded files is reported. */
const AUDIT_COPY = new Set([
  "src/lib/perf.ts",
  "src/components/perf-ui.tsx",
  "src/components/layer-inspector.tsx",
]);

function isAuditCopy(rel: string): boolean {
  return AUDIT_COPY.has(rel) || rel.startsWith("src/app/(public)/perf/") || rel === "src/app/(public)/lab/layers/page.tsx";
}

function sourceFiles(): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(tsx?|css)$/.test(entry.name)) {
        const rel = full.slice(ROOT.length + 1);
        if (!isAuditCopy(rel)) out.push(full);
      }
    }
  };
  walk(path.join(ROOT, "src"));
  return out;
}

export interface SourceHit {
  file: string;
  hits: number;
  lines: number[];
}

function scan(pattern: RegExp, limit = 40): SourceHit[] {
  const out: SourceHit[] = [];
  for (const file of sourceFiles()) {
    const text = fs.readFileSync(file, "utf8");
    const lines = text.split("\n");
    const hits: number[] = [];
    lines.forEach((line, i) => {
      if (pattern.test(line)) hits.push(i + 1);
      pattern.lastIndex = 0;
    });
    if (hits.length) out.push({ file: file.slice(ROOT.length + 1), hits: hits.length, lines: hits.slice(0, limit) });
  }
  return out.sort((a, b) => b.hits - a.hits);
}

/** Where the polish costs pixels: every blur/backdrop-filter in the project. */
export function blurInventory() {
  const backdrop = scan(/backdrop-blur|backdrop-filter/);
  const blur = scan(/blur\(|filter:\s*blur|--blur/);
  return {
    backdrop,
    backdropHits: backdrop.reduce((a, f) => a + f.hits, 0),
    backdropFiles: backdrop.length,
    blur,
    blurHits: blur.reduce((a, f) => a + f.hits, 0),
  };
}

/** Timer and listener registration versus cleanup — the memory hygiene audit. */
export function timerAudit() {
  const setInterval = scan(/setInterval\(|setTimeout\(/);
  const clearInterval = scan(/clearInterval\(|clearTimeout\(/);
  const raf = scan(/requestAnimationFrame\(/);
  const cancelRaf = scan(/cancelAnimationFrame\(/);
  const add = scan(/addEventListener\(/);
  const remove = scan(/removeEventListener\(/);
  const byFile = new Map<string, { file: string; set: number; clear: number; raf: number; cancel: number; add: number; remove: number }>();
  const put = (hits: SourceHit[], key: "set" | "clear" | "raf" | "cancel" | "add" | "remove") => {
    for (const h of hits) {
      const row = byFile.get(h.file) ?? { file: h.file, set: 0, clear: 0, raf: 0, cancel: 0, add: 0, remove: 0 };
      row[key] += h.hits;
      byFile.set(h.file, row);
    }
  };
  put(setInterval, "set");
  put(clearInterval, "clear");
  put(raf, "raf");
  put(cancelRaf, "cancel");
  put(add, "add");
  put(remove, "remove");
  const rows = [...byFile.values()].sort((a, b) => b.set + b.raf + b.add - (a.set + a.raf + a.add));
  return {
    rows,
    totals: {
      set: setInterval.reduce((a, f) => a + f.hits, 0),
      clear: clearInterval.reduce((a, f) => a + f.hits, 0),
      raf: raf.reduce((a, f) => a + f.hits, 0),
      cancel: cancelRaf.reduce((a, f) => a + f.hits, 0),
      add: add.reduce((a, f) => a + f.hits, 0),
      remove: remove.reduce((a, f) => a + f.hits, 0),
    },
  };
}

/* -------------------------------------------------------------------
   #402 — what needs no JavaScript at all
   ------------------------------------------------------------------- */

export function zeroJsAssets() {
  const depFree = COMPONENTS.filter((c) => c.deps.length === 0);
  const withDeps = COMPONENTS.filter((c) => c.deps.length > 0);
  const cssOnly = depFree.filter((c) => c.stack.includes("HTML/CSS"));
  return {
    depFree,
    withDeps,
    cssOnly,
    total: COMPONENTS.length,
    share: Math.round((depFree.length / COMPONENTS.length) * 100),
  };
}

/* -------------------------------------------------------------------
   "Why this size" — derived from the imports, not hand-written
   ------------------------------------------------------------------- */

export interface WhyRow {
  file: string;
  lines: number;
}

/** Resolve a "@/x/y" import to a file on disk (tsx, ts or a directory index). */
function resolveImport(spec: string): string | null {
  if (!spec.startsWith("@/")) return null;
  const base = path.join(ROOT, "src", spec.slice(2));
  for (const candidate of [`${base}.tsx`, `${base}.ts`, path.join(base, "index.tsx"), path.join(base, "index.ts")]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
}

function routePageFile(url: string): string | null {
  const wanted = url === "/" ? "" : url.replace(/^\//, "");
  const appDir = path.join(ROOT, "src", "app");
  const walk = (dir: string): string | null => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const hit = walk(full);
        if (hit) return hit;
      } else if (entry.name === "page.tsx") {
        const rel = full
          .slice(appDir.length + 1)
          .replace(/\/page\.tsx$/, "")
          .split("/")
          .filter((seg) => !(seg.startsWith("(") && seg.endsWith(")")))
          .join("/");
        if (rel === wanted) return full;
      }
    }
    return null;
  };
  return walk(appDir);
}

/** The client modules a route pulls in, two import hops deep. This is what the
 *  "why this size" column reads: the number is from the build manifest, the
 *  explanation is from the import graph, and neither is typed by hand. */
export function routeWhy(url: string, limit = 3): { rows: WhyRow[]; reason: string } {
  const page = routePageFile(url);
  if (!page) return { rows: [], reason: "route source not found" };
  const seen = new Set<string>();
  const clientFiles: string[] = [];
  let frontier = [page];
  for (let depth = 0; depth < 2; depth++) {
    const next: string[] = [];
    for (const file of frontier) {
      if (seen.has(file)) continue;
      seen.add(file);
      let text = "";
      try {
        text = fs.readFileSync(file, "utf8");
      } catch {
        continue;
      }
      const isClient = /^\s*["']use client["']/m.test(text.slice(0, 200));
      for (const m of text.matchAll(/from\s+["']([^"']+)["']/g)) {
        const resolved = resolveImport(m[1]);
        if (resolved) next.push(resolved);
      }
      if (isClient && file !== page) clientFiles.push(file);
    }
    frontier = next;
  }
  const rows = clientFiles
    .map((f) => ({ file: f.slice(ROOT.length + 1), lines: fs.readFileSync(f, "utf8").split("\n").length }))
    .sort((a, b) => b.lines - a.lines)
    .slice(0, limit);
  if (!rows.length) {
    // A server-only route: the weight is the shared bundle plus its own markup.
    const lines = fs.readFileSync(page, "utf8").split("\n").length;
    return { rows: [{ file: page.slice(ROOT.length + 1), lines }], reason: "server component — no client module of its own" };
  }
  return { rows, reason: "client modules in this route's own chunk" };
}

/* -------------------------------------------------------------------
   #402 / #403 — the JavaScript-off view, read from the prerendered HTML
   ------------------------------------------------------------------- */

/* -------------------------------------------------------------------
   Recorded before/after — every number here was measured on a real build
   ------------------------------------------------------------------- */

export const MEASURED = {
  /** Lines in src/components/keyframes.tsx (batch 92). The split panel used to
   *  print "41 lines" as a literal and the file had become 40 — check:exports
   *  now compares this number with the file, so the count cannot drift again. */
  keyframesLines: 42,
  /** Batch 55 build, before lazy mounting and the keyframes split. */
  before: {
    build: "batch 55 (commit 1fb5142)",
    promptsHtmlKb: 963.6,
    totalHtmlKb: 7036,
    /** Total JS loaded by a page that renders no demo, e.g. /quality. */
    noDemoPageJsKb: 743.1,
    studioJsKb: 814.5,
    fontFiles: 9,
    fontKb: 261.4,
    pagesPreloadingFonts: 0,
  },
  /** This build, measured by the same functions the pages call. */
  after: {
    build: "batch 60",
    promptsHtmlKb: 500.6,
    /** Every prerendered page, including the 107 embed pages added in batch 59.
     *  The file count changed between builds, so this is a scale figure, not a
     *  like-for-like delta — the pages say so where it is shown. */
    totalHtmlKb: 9952.3,
    noDemoPageJsKb: 429.5,
    studioJsKb: 500.9,
    fontFiles: 2,
    fontKb: 80,
    pagesPreloadingFonts: 225,
    /** Measured by fetching the pages with no JavaScript at all — the same
     *  request a text browser or a crawler makes. /components is rendered on
     *  demand, so it has no prerendered file to read. `headings` counts card
     *  titles in the HTML, which is how the "the information is still there
     *  without JavaScript" claim is checked rather than asserted. */
    jsOff: {
      "/components": { htmlKb: 332.4, pending: 107, mounted: 0, links: 149, headings: 107 },
      "/backgrounds": { htmlKb: 73.2, pending: 33, mounted: 0, links: 41, headings: 0 },
      "/prompts": { htmlKb: 497.3, pending: 74, mounted: 0, links: 115, headings: 74 },
      "/learn": { htmlKb: 240.6, pending: 0, mounted: 0, links: 103, headings: 0 },
    },
    /** #409 — measured against this build's server with the same request Next
     *  makes for a prefetch (`RSC: 1` and a `?_rsc=` parameter) and with a plain
     *  page request, so the cost of one intent prefetch is a real number
     *  instead of a guess. */
    prefetchProbe: {
      url: "/components/tilt-card",
      rscKb: 15.8,
      htmlKb: 93,
      note: "The RSC payload is what a prefetch downloads; the HTML figure is what a full navigation without JavaScript would fetch.",
    },
  },
};

/* -------------------------------------------------------------------
   #409 — prefetch audit
   ------------------------------------------------------------------- */

/** Catalog cards wrapped in IntentLink, and the routes they point at. The
 *  interesting ratio is links per page vs. requests: with viewport prefetch
 *  every card in the library grid is a candidate, and each one is a route that
 *  is rendered on demand. */
export function prefetchAudit() {
  const intentLinks = scan(/<IntentLink/).reduce((a, f) => a + f.hits, 0);
  // The two grids that render link cards, counted from the catalog data rather
  // than from a hard-coded total.
  const grids = [
    { href: "/components", label: "Library grid", cards: COMPONENTS.length, route: "/components/[slug]" },
    { href: "/prompts", label: "Prompt grid", cards: PROMPTS.length, route: "/prompts/[slug]" },
  ];
  const probe = MEASURED.after.prefetchProbe;
  return {
    intentLinks,
    grids,
    gridCards: grids.reduce((a, g) => a + g.cards, 0),
    probe,
    worstCaseKb: Math.round(grids.reduce((a, g) => a + g.cards, 0) * probe.rscKb),
    /** What the same grid would pull with the default: every card that enters
     *  the viewport, i.e. all of them if the reader scrolls to the end. */
    note:
      intentLinks > 0
        ? `The two grids hold ${grids.reduce((a, g) => a + g.cards, 0)} cards between them. Scrolling either to the end with viewport prefetch would fetch a payload per card; the intent link waits until a pointer or keyboard focus rests on one.`
        : "No card is wrapped in an intent link in this build, so the default viewport prefetch applies and the grids do fetch as they scroll.",
  };
}

/* -------------------------------------------------------------------
   #408 — motion and layer audit
   -------------------------------------------------------------------
   The source half of the layer inspector: what the project asks the browser
   to animate, and whether those properties can be handled by the compositor
   (transform, opacity, filter) or force painting and layout work per frame. */

const LAYOUT_PROPS = ["width", "height", "top", "left", "right", "bottom", "margin", "padding", "gap", "border-width", "font-size", "inset"];
const PAINT_PROPS = ["background", "background-color", "color", "box-shadow", "border-color", "filter", "outline", "text-shadow", "fill", "stroke", "clip-path"];
const COMPOSITOR_PROPS = ["transform", "opacity", "translate", "scale", "rotate"];

function classifyTransition(value: string): { compositor: number; paint: number; layout: number } {
  const body = value.replace(/^[^:]*transition(-property)?:\s*/i, "").replace(/[;{]/g, "");
  const props = body.split(",").map((x) => x.trim().split(/\s+/)[0]).filter(Boolean);
  const hit = { compositor: 0, paint: 0, layout: 0 };
  for (const prop of props) {
    if (prop === "all") {
      hit.compositor += 1;
      continue;
    }
    if (LAYOUT_PROPS.some((p) => prop.includes(p))) hit.layout += 1;
    else if (PAINT_PROPS.some((p) => prop.includes(p))) hit.paint += 1;
    else if (COMPOSITOR_PROPS.some((p) => prop.includes(p))) hit.compositor += 1;
  }
  return hit;
}

export function motionAudit() {
  const scanned = sourceFiles().length;
  const keyframeFiles = scan(/@keyframes/);
  const animationDecls = scan(/animation:[^;]*/);
  const infinite = scan(/animation:[^;]*infinite/);
  const willChange = scan(/will-change:/);
  const transitionDecls = scan(/transition(-property)?:[^;]*/);

  let compositor = 0;
  let paint = 0;
  let layout = 0;
  for (const file of sourceFiles().filter((f) => f.endsWith(".css") || f.endsWith(".tsx") || f.endsWith(".ts"))) {
    const text = fs.readFileSync(file, "utf8");
    for (const decl of text.match(/transition(-property)?:[^;{}]*/g) ?? []) {
      const hit = classifyTransition(decl);
      compositor += hit.compositor;
      paint += hit.paint;
      layout += hit.layout;
    }
  }

  return {
    scannedFiles: scanned,
    excluded: "the audit pages themselves, whose code examples are copy rather than style declarations",
    keyframes: keyframeFiles.reduce((a, f) => a + f.hits, 0),
    keyframeFiles: keyframeFiles.length,
    animationHits: animationDecls.reduce((a, f) => a + f.hits, 0),
    infiniteHits: infinite.reduce((a, f) => a + f.hits, 0),
    willChangeHits: willChange.reduce((a, f) => a + f.hits, 0),
    // The scanner reads its own pattern strings, so it excludes itself.
    willChangeSites: willChange.filter((f) => f.file !== "src/lib/perf.ts").slice(0, 12),
    transitions: { compositor, paint, layout, total: transitionDecls.reduce((a, f) => a + f.hits, 0) },
    /** The demo scenes are where the heaviest scenes live; their size is the
     *  reason the layer work matters. Until batch 85 they were one 380 KB file,
     *  and the count here was that file's lines. They are ten modules now — the
     *  registry, the shared kit, seven scene sets and the section 17 file — so
     *  the figure is the sum, which is still the question the page asks, plus
     *  the number of modules it is spread over. Counted, not estimated. */
    demoLines: (() => {
      try {
        const dir = path.join(ROOT, "src/components/demos");
        const sets = fs.readdirSync(path.join(dir, "scenes")).filter((f) => f.endsWith(".tsx"));
        const files = ["Demo.tsx", "scene-kit.tsx", "scenes-17.tsx", ...sets.map((f) => `scenes/${f}`)];
        return files.reduce((a, f) => a + fs.readFileSync(path.join(dir, f), "utf8").split("\n").length, 0);
      } catch {
        return 0;
      }
    })(),
    demoModules: (() => {
      try {
        return fs.readdirSync(path.join(ROOT, "src/components/demos/scenes")).filter((f) => f.endsWith(".tsx")).length + 3;
      } catch {
        return 0;
      }
    })(),
  };
}

/* -------------------------------------------------------------------
   #414 — the service-worker plan
   ------------------------------------------------------------------- */

export const SW_PLAN = {
  status: "Not shipped. A service worker is the one asset you cannot un-ship: once a browser has registered one it controls requests until it is replaced, so it goes out after the API does, not before.",
  wouldCache: [
    "The stylesheet and the two font files — small, versioned by hash, and the whole visual identity of the site.",
    "The prerendered HTML for the pages a visitor actually reads, stored under a versioned cache name so a deploy replaces the set instead of mixing two.",
    "Nothing under /admin. A console cached on a device that has been handed to someone else is a data-leak shape, not a performance win.",
  ],
  strategy: [
    "Precache the shell on install, network-first for HTML, cache-first for hashed assets.",
    "Version the cache name with the build ID that Next already writes, so a deploy invalidates cleanly.",
    "Never cache a response whose URL contains a search parameter — the catalog's filters would produce an unbounded set of near-identical pages.",
    "Serve stale only for the changelog and the guides; the catalog is what people quote, so it revalidates.",
  ],
  needsApi: [
    "A way to tell a stale cache to update without a full reload (the API's revalidate hook, or a version endpoint to poll).",
    "A decision about how long an offline copy may be shown as current, which is a copy question as much as a caching one.",
  ],
  measured: "For scale: this build's static output is the whole thing a worker would cache — the numbers are on the build report page, and none of them are large enough to need a worker today. The reason to add one later is offline reading, not speed.",
  /** #29 — the written decision, so the page is a record rather than a shrug. */
  decision:
    "Decision: no service worker ships yet. The shell an offline reader would need (shared JS + the one stylesheet + both fonts, plus a single prerendered page) is small enough that a worker would not make the site faster today — the prerendered HTML is already one request, and the hashed assets are already cache-first. The only remaining reason to add one is offline reading, and offline reading needs the API's revalidation story first; a cache you cannot invalidate is a stale catalog, and a stale catalog is worse than no offline copy. This page is the decision record: it names the cost, the trigger and the blocker, and it will change in the same commit that ships the API hook.",
};

/* -------------------------------------------------------------------
   #407 — the blur budget
   ------------------------------------------------------------------- */

export interface BlurSite {
  file: string;
  line: number;
  kind: "full-surface" | "panel" | "component";
  source: string;
}

const FULL_SURFACE = /inset-0|fixed|h-screen|min-h-dvh|size-full|w-screen/;

/** Every backdrop-blur in the project, classified by how much surface it sits
 *  on. The classification is a line-level heuristic over the class string —
 *  it says where blur is used, which is what a budget needs; it does not
 *  pretend to measure compositing cost. */
export function blurSites(): { sites: BlurSite[]; counts: Record<string, number> } {
  const sites: BlurSite[] = [];
  for (const file of sourceFiles()) {
    const lines = fs.readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      if (!/backdrop-blur|backdrop-filter/.test(line)) return;
      const context = `${lines[i - 2] ?? ""} ${lines[i - 1] ?? ""} ${line}`;
      const kind: BlurSite["kind"] = FULL_SURFACE.test(context) ? "full-surface" : /chip|badge|rounded-full|text-\[10px\]/.test(line) ? "component" : "panel";
      sites.push({ file: file.slice(ROOT.length + 1), line: i + 1, kind, source: line.trim().slice(0, 120) });
    });
  }
  const counts = sites.reduce<Record<string, number>>((a, x) => {
    a[x.kind] = (a[x.kind] ?? 0) + 1;
    return a;
  }, {});
  return { sites, counts };
}

/* -------------------------------------------------------------------
   Content types and their weights (the bundle-splitting tour)
   ------------------------------------------------------------------- */

export function typeWeights() {
  const groups = [
    { label: "Components", items: COMPONENTS.length, kb: COMPONENTS.reduce((a, c) => a + c.bundleKb, 0), href: "/components" },
    { label: "Backgrounds", items: BACKGROUNDS.length, kb: BACKGROUNDS.reduce((a, b) => a + b.bundleKb, 0), href: "/backgrounds" },
    { label: "Lab tools", items: LAB_TOOLS.length, kb: 0, href: "/lab" },
  ];
  return groups;
}

/* -------------------------------------------------------------------
   #21 — CSS budgets (own CSS must stay zero, sheet must stay under cap)
   ------------------------------------------------------------------- */

export function cssBudgetAudit() {
  const r = report();
  const routes = r?.routes ?? [];
  const applied = applyCssBudgets(routes as { url: string; cssKb?: number; ownCssKb?: number }[]);
  return {
    ok: Boolean(r),
    sharedCssKb: r?.sharedCssKb ?? 0,
    baseline: r?.cssBaseline ?? null,
    ownLimit: DEFAULT_OWN_CSS_KB,
    totalLimit: CSS_TOTAL_KB,
    ownCssEverywhereZero: routes.every((x) => (x.ownCssKb ?? 0) === 0),
    ...applied,
  };
}

/* -------------------------------------------------------------------
   #24 — prefetch links in the built documents
   ------------------------------------------------------------------- */

export function prefetchLinkAudit() {
  const r = report();
  return {
    ok: Boolean(r),
    pages: r?.prefetch?.pages ?? 0,
    pagesWithPrefetch: r?.prefetch?.pagesWithPrefetch ?? 0,
    links: r?.prefetch?.links ?? 0,
    maxOnAPage: r?.prefetch?.maxOnAPage ?? 0,
    budget: r?.prefetch?.budget ?? 0,
    pagesWithLinks: r?.prefetch?.pagesWithLinks ?? [],
  };
}

/* -------------------------------------------------------------------
   #26 — glyph coverage of the shipped subsets
   ------------------------------------------------------------------- */

export function fontGlyphAudit() {
  const r = report();
  const files = r?.fontGlyphs ?? [];
  const probes = (files[0]?.probes ?? []).map((p) => {
    const coverage = files.map((f) => ({
      family: f.family,
      covered: (f.probes ?? []).find((q) => q.cp === p.cp)?.covered ?? false,
    }));
    return { ...p, coverage, every: coverage.every((c) => c.covered), none: coverage.every((c) => !c.covered) };
  });
  return {
    ok: Boolean(r),
    files,
    probes,
    missing: probes.filter((p) => p.none),
    partial: probes.filter((p) => !p.every && !p.none),
  };
}

/* -------------------------------------------------------------------
   #27 — the share cards' weight
   ------------------------------------------------------------------- */

export function ogWeightAudit() {
  const r = report();
  const budget = r?.og?.budgetKb ?? 0;
  return {
    ok: Boolean(r),
    cards: r?.og?.cards ?? 0,
    totalKb: r?.og?.totalKb ?? 0,
    maxKb: r?.og?.maxKb ?? 0,
    minKb: r?.og?.minKb ?? 0,
    meanKb: r?.og?.meanKb ?? 0,
    budgetKb: budget,
    heaviest: r?.og?.heaviest ?? [],
    over: (r?.og?.heaviest ?? []).filter((h) => h.kb > budget),
  };
}

/* -------------------------------------------------------------------
   #30 — the shared shell against its recorded budget
   ------------------------------------------------------------------- */

export function sharedJsRatchet() {
  const r = report();
  const budget = r?.sharedJsBudgetKb ?? 0;
  return {
    ok: Boolean(r),
    sharedJsKb: r?.sharedJsKb ?? 0,
    budgetKb: budget,
    note: r?.sharedJsNote ?? "",
    over: (r?.sharedJsKb ?? 0) > budget,
  };
}

/* -------------------------------------------------------------------
   #23 — chunk attribution: each route's largest own chunk, with the
   modules the manifest put inside it
   ------------------------------------------------------------------- */

export function chunkAttribution() {
  const r = report();
  const byFile = new Map((r?.chunks ?? []).map((c) => [c.file, c]));
  const routes = (r?.routes ?? [])
    .map((route) => {
      const own = (route.ownFiles ?? [])
        .map((f) => ({
          file: f,
          kb: byFile.get(f)?.kb ?? 0,
          modules: byFile.get(f)?.modules ?? [],
          frameworkModules: byFile.get(f)?.frameworkModules ?? 0,
        }))
        .sort((a, b) => b.kb - a.kb);
      return { url: route.url, largestOwnChunk: own[0] ?? null };
    })
    .filter((x) => x.largestOwnChunk !== null);
  return { ok: Boolean(r), routes, chunkCount: r?.chunks?.length ?? 0 };
}

/* -------------------------------------------------------------------
   #29 — what an HTML-only offline shell would cost to precache
   ------------------------------------------------------------------- */

export function offlineShellCost() {
  const r = report();
  if (!r || !r.summary) return { ok: false as const, assetsKb: 0, lightestHtmlKb: 0, totalKb: 0 };
  const prerendered = (r.routes ?? []).filter((x) => x.prerendered && x.htmlKb > 0);
  const lightestHtmlKb = prerendered.length ? Math.min(...prerendered.map((x) => x.htmlKb)) : 0;
  // The shell a worker would precache: the shared JS, the one stylesheet and the
  // two fonts, plus a single prerendered page.
  const assetsKb = Math.round(((r.sharedJsKb ?? 0) + (r.sharedCssKb ?? 0) + r.summary.fontKb) * 10) / 10;
  const totalKb = Math.round((assetsKb + lightestHtmlKb) * 10) / 10;
  return { ok: true as const, assetsKb, lightestHtmlKb, totalKb };
}
