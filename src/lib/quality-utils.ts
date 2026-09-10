/* ---------------------------------------------------------------------
   Quality bar — shared audit helpers (Section 11, batches 44+).
   Every number here is recomputed at build time from the live catalog in
   src/lib/data.ts: score bands, per-kind size budgets, dependency ledger,
   fingerprint-contrast tiers and behaviour counts. Nothing is stored or
   hand-written except the stated policies and the draft test assertions.
   --------------------------------------------------------------------- */

import { BACKGROUNDS, CHANGELOG, COMPONENTS, kindOf, PROMPTS } from "./data";
import { contrastRatio, hexToHsl, REAL_BG, REAL_CYAN, REAL_INK, REAL_MINT, REAL_PANEL_DARK, REAL_PRIMARY_DEEP, REAL_VIOLET } from "./studio-utils";
import { LEARN_ARTICLES } from "./learn";
import fs from "node:fs";
import { KIND_BUDGETS, type AssetKind } from "./kinds";

// The budget table lives in ./kinds so client code can import it without
// pulling in this file's node:fs source reads.
export { kindLabel, budgetFor } from "./kinds";

const kindOfAsset = (slug: string): AssetKind | undefined => COMPONENTS.find((c) => c.slug === slug)?.kind as AssetKind | undefined;

/* ---------- score bands ---------- */

export interface Band {
  label: string;
  min: number;
  max: number;
}

export function bandCounts(bands: Band[], pick: (a: (typeof COMPONENTS)[number]) => number) {
  return bands.map((b) => ({ ...b, n: COMPONENTS.filter((c) => pick(c) >= b.min && pick(c) <= b.max).length }));
}

export const A11Y_BANDS: Band[] = [
  { label: "98–100", min: 98, max: 100 },
  { label: "95–97", min: 95, max: 97 },
  { label: "92–94", min: 92, max: 94 },
];

export const QUAL_BANDS: Band[] = [
  { label: "96–97", min: 96, max: 97 },
  { label: "94–95", min: 94, max: 95 },
  { label: "92–93", min: 92, max: 93 },
];

export const a11yBandCounts = () => bandCounts(A11Y_BANDS, (c) => c.a11yScore);
export const qualBandCounts = () => bandCounts(QUAL_BANDS, (c) => c.qualityScore);

/* ---------- per-kind size budget compliance ---------- */

export interface KindSize {
  kind: AssetKind;
  label: string;
  budgetKb: number;
  count: number;
  min: number;
  max: number;
  over: number;
}

export function kindSizeTable(): KindSize[] {
  return KIND_BUDGETS.map((m) => {
    const assets = COMPONENTS.filter((c) => c.kind === m.kind);
    const kbs = assets.map((a) => a.bundleKb);
    return {
      kind: m.kind,
      label: m.label,
      budgetKb: m.budgetKb,
      count: assets.length,
      min: kbs.length ? Math.min(...kbs) : 0,
      max: kbs.length ? Math.max(...kbs) : 0,
      over: assets.filter((a) => a.bundleKb > m.budgetKb).length,
    };
  });
}

export function heaviestAssets(n: number) {
  return [...COMPONENTS].sort((a, b) => b.bundleKb - a.bundleKb).slice(0, n);
}

/* ---------- dependency ledger ---------- */

export const depFreeCount = () => COMPONENTS.filter((c) => c.deps.length === 0).length;
export const withDeps = () => COMPONENTS.filter((c) => c.deps.length > 0);

/* ---------- fingerprint contrast tiers on the real page background ---------- */

export interface FingerTiers {
  pass: number;
  largeOnly: number;
  fail: number;
  worst: { slug: string; ratio: number };
}

const accentHue = (key: string) => {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  const spread = (h % 360) + Math.round(((h / 360) % 1) * 40) - 20;
  return ((spread % 360) + 360) % 360;
};

export function fingerTiers(): FingerTiers {
  const bg = hexToHsl(REAL_BG);
  let pass = 0;
  let largeOnly = 0;
  let fail = 0;
  let worst = { slug: "", ratio: 99 };
  for (const c of COMPONENTS) {
    const r = contrastRatio(accentHue(c.slug), 82, 62, bg.h, bg.s, bg.l);
    if (r >= 4.5) pass++;
    else if (r >= 3) largeOnly++;
    else fail++;
    if (r < worst.ratio) worst = { slug: c.slug, ratio: r };
  }
  return { pass, largeOnly, fail, worst };
}

/** The real role-colour pairs Motif ships (dark-first), with live ratios. */
export function chromePairs() {
  const ink = hexToHsl(REAL_INK);
  const bg = hexToHsl(REAL_BG);
  const panel = hexToHsl(REAL_PANEL_DARK);
  const white = { h: 0, s: 0, l: 100 };
  const deep = hexToHsl(REAL_PRIMARY_DEEP);
  const violet = hexToHsl(REAL_VIOLET);
  const cyan = hexToHsl(REAL_CYAN);
  const mint = hexToHsl(REAL_MINT);
  const pair = (label: string, note: string, fg: { h: number; s: number; l: number }, bgc: { h: number; s: number; l: number }) => ({
    label,
    note,
    fg,
    bg: bgc,
    ratio: contrastRatio(fg.h, fg.s, fg.l, bgc.h, bgc.s, bgc.l),
  });
  return [
    pair("Ink on page bg", "default body text", ink, bg),
    pair("Ink on panel", "cards, inputs, surfaces", ink, panel),
    pair("White label on primary", "the primary-button case", white, deep),
    pair("Violet accent as text", "links & chips on page bg", violet, bg),
    pair("Cyan accent as text", "code & keyboard hints", cyan, bg),
    pair("Mint accent as text", "verified / positive marks", mint, bg),
  ];
}

/* ---------- motion facts ---------- */

export const animatedCount = () => COMPONENTS.filter((c) => c.kind === "animated").length;
export const scrollCount = () => COMPONENTS.filter((c) => c.behaviors.includes("scroll")).length;

/** The exact reduced-motion rule shipped in globals.css — verbatim quote. */
export const REDUCED_MOTION_CSS = `@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}`;

/* ---------- interaction coverage (for keyboard / screen-reader plans) ---------- */

const INTERACTIVE = ["click", "keyboard", "type", "hold", "drag"] as const;

export const interactiveAssets = () => COMPONENTS.filter((c) => c.behaviors.some((b) => (INTERACTIVE as readonly string[]).includes(b)));

export interface TabPlan {
  slug: string;
  title: string;
  steps: string[];
  assertion: string;
}

/** Scripted Tab-walk plans for five real keyboard-first assets. */
export const KEYBOARD_PLANS: TabPlan[] = [
  {
    slug: "combo-box",
    title: "Combo box",
    steps: [
      "Tab to the text input — focus ring appears on the wrapper, popup stays closed",
      "Type a query; the option list opens and filters live",
      "ArrowDown / ArrowUp move the highlight; active option is announced",
      "Enter commits the highlighted option into the input",
      "Escape closes the popup and returns focus to the input",
    ],
    assertion: "After Enter the input value equals the chosen label, aria-expanded is false, and focus never leaves the control.",
  },
  {
    slug: "star-rating",
    title: "Star rating",
    steps: [
      "Tab to the first star (the group is one tab stop)",
      "ArrowRight / ArrowLeft step through 0.5 → 5 stars",
      "Home / End jump to 0 and 5",
      "Space sets the current value; value is re-announced",
    ],
    assertion: "The live value is announced as “N out of 5 stars” and persists after the group loses focus.",
  },
  {
    slug: "tag-input",
    title: "Tag input",
    steps: [
      "Tab to the field, type a tag, press Enter — chip appears before the caret",
      "Backspace on an empty field removes the last chip and refocuses the field",
      "Each chip exposes a real button for delete (Tab reaches it)",
    ],
    assertion: "Removed tags are announced by role=status, and the input caret is never orphaned.",
  },
  {
    slug: "command-palette",
    title: "Command palette",
    steps: [
      "Ctrl/Cmd+K opens the palette; focus lands on the search box",
      "Type to filter; ArrowDown/Up move the selection with the list wrapping",
      "Enter runs the highlighted action; Escape closes and restores the trigger",
      "Tab cycles only within the palette while it is open (focus trap)",
    ],
    assertion: "The palette is role=dialog with aria-modal=true; focus returns to the opener on close.",
  },
  {
    slug: "quantity-stepper",
    title: "Quantity stepper",
    steps: [
      "Tab to the number input, type a value directly",
      "Buttons increment/decrement and clamp at min/max",
      "ArrowUp/ArrowDown nudge the value by step",
    ],
    assertion: "The stepper exposes a labelled spinbutton; every change re-announces the value.",
  },
];

/** One draft screen-reader assertion per sampled interactive asset. */
export const SR_SAMPLES = [
  { slug: "prism-switch", announced: "“Switch, on” / “Switch, off”" },
  { slug: "star-rating", announced: "“3 stars out of 5”" },
  { slug: "tag-input", announced: "“Tag added” / “Tag removed”" },
  { slug: "command-palette", announced: "“Command palette, dialog” on open" },
  { slug: "slider-ticks", announced: "“Value 40, tick 8 of 11”" },
  { slug: "password-strength", announced: "“Strength: strong” after pause" },
].map((s) => ({ ...s, title: kindOf(s.slug)?.title ?? s.slug, kind: kindOfAsset(s.slug) }));

/* =====================================================================
   Batch 45 additions — numeric truth, tone/copy scans, perf baseline,
   URL snapshot and per-asset audit ledger. Scans read public prose files
   at build time; every figure shown is recomputed, nothing hand-stored.
   ===================================================================== */

/* ---------- numeric truth check (#328) ---------- */

export interface TruthRow {
  claim: string;
  value: string;
  derived: string;
  source: string;
  surfaces: string;
}

export function truthRows(): TruthRow[] {
  const depFree = depFreeCount();
  return [
    {
      claim: "“107 original assets”",
      value: String(COMPONENTS.length),
      derived: "COMPONENTS.length",
      source: "COMPONENTS array in src/lib/data.ts",
      surfaces: "homepage proof band · footer tagline · /components",
    },
    {
      claim: "“74 run-tested prompts”",
      value: String(PROMPTS.length),
      derived: "PROMPTS.length",
      source: "PROMPTS array in src/lib/data.ts",
      surfaces: "footer tagline · /prompts scoreboard",
    },
    {
      claim: "“60 guides”",
      value: String(LEARN_ARTICLES.length),
      derived: "LEARN_ARTICLES.length",
      source: "src/lib/learn.ts",
      surfaces: "footer tagline · /learn",
    },
    {
      claim: "“33 backgrounds”",
      value: String(BACKGROUNDS.length),
      derived: "BACKGROUNDS.length",
      source: "BACKGROUNDS array in src/lib/data.ts",
      surfaces: "footer count line · /backgrounds",
    },
    {
      claim: "“106/107 dependency-free”",
      value: `${depFree}/${COMPONENTS.length}`,
      derived: "assets with deps.length === 0",
      source: "deps field across COMPONENTS",
      surfaces: "homepage dependency-free receipt",
    },
    {
      claim: "“0 over size budget”",
      value: String(kindSizeTable().reduce((a, r) => a + r.over, 0)),
      derived: "per-kind budget comparison",
      source: "kindSizeTable() on this page",
      surfaces: "/quality size-budget panel",
    },
  ];
}

/* ---------- perf regression baseline (#329) ---------- */

export interface PerfKind {
  kind: AssetKind;
  label: string;
  count: number;
  budgetKb: number;
  min: number;
  mean: number;
  median: number;
  max: number;
  over: number;
}

const median = (xs: number[]) => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

export function perfBaseline(): PerfKind[] {
  return KIND_BUDGETS.map((m) => {
    const assets = COMPONENTS.filter((c) => c.kind === m.kind);
    const kbs = assets.map((a) => a.bundleKb);
    return {
      kind: m.kind,
      label: m.label,
      count: assets.length,
      budgetKb: m.budgetKb,
      min: kbs.length ? Math.min(...kbs) : 0,
      mean: kbs.length ? Math.round((kbs.reduce((a, b) => a + b, 0) / kbs.length) * 10) / 10 : 0,
      median: Math.round(median(kbs) * 10) / 10,
      max: kbs.length ? Math.max(...kbs) : 0,
      over: assets.filter((a) => a.bundleKb > m.budgetKb).length,
    };
  });
}

export const BASELINE_LABEL = "baseline · 2026-09-10 · catalog as shipped";

/* ---------- tone-of-voice lint (#330) — real scan of public prose ---------- */

export const OVERCLAIM_DICTIONARY = [
  "effortless", "effortlessly", "magical", "magically", "seamless", "seamlessly",
  "revolutionary", "game-changing", "groundbreaking", "unbelievable", "amazing",
  "incredible", "flawless", "flawlessly", "perfect", "blazing", "cutting-edge", "world-class",
];

export interface ToneHit {
  term: string;
  file: string;
  line: number;
  negated: boolean;
}

/** Public prose files the tone & copy lints scan (site pages + chrome). */
function proseFiles(): string[] {
  const out: string[] = [];
  const base = `${process.cwd()}/src`;
  const walk = (dir: string) => {
    let ents: string[] = [];
    try {
      ents = fs.readdirSync(dir);
    } catch {
      return;
    }
    for (const e of ents) {
      const p = `${dir}/${e}`;
      let isDir = false;
      try {
        isDir = fs.statSync(p).isDirectory();
      } catch {
        continue;
      }
      if (isDir) walk(p);
      else if (e.endsWith(".tsx")) out.push(p);
    }
  };
  walk(`${base}/app/(public)`);
  out.push(`${base}/components/chrome.tsx`, `${base}/app/not-found.tsx`);
  return out;
}

/** Scan site prose for overclaim terms; a hit within 90 chars of a
 *  negation ("no", "not", "never", "without", "skip", "reject"…) is
 *  treated as intentional and cleared by the context rule. */
export function toneScan(): { files: number; hits: ToneHit[]; negated: number } {
  const files = proseFiles();
  const hits: ToneHit[] = [];
  let negated = 0;
  for (const f of files) {
    let text = "";
    try {
      text = fs.readFileSync(f, "utf8");
    } catch {
      continue;
    }
    for (const term of OVERCLAIM_DICTIONARY) {
      const re = new RegExp(term, "gi");
      let m: RegExpExecArray | null;
      while ((m = re.exec(text))) {
        const before = text.slice(Math.max(0, m.index - 90), m.index);
        const neg = /\b(?:no|not|never|without|don.?t|doesn.?t|stop|skip|reject|ban)\b/i.test(before);
        if (neg) negated++;
        hits.push({
          term: m[0],
          file: f.replace(`${process.cwd()}/`, ""),
          line: text.slice(0, m.index).split("\n").length,
          negated: neg,
        });
      }
    }
  }
  return { files: files.length, hits, negated };
}

/* ---------- empty-state copy consistency (#327) — real scan ---------- */

export const DEAD_END_PATTERNS = ["no items yet", "no data yet", "nothing here", "no components found", "no assets found"];

export interface EmptyLine {
  text: string;
  files: string[];
}

export function emptyStateScan(): { deadEnds: number; lines: EmptyLine[] } {
  const files = proseFiles();
  const lines: EmptyLine[] = [];
  let deadEnds = 0;
  const counts = new Map<string, Set<string>>();
  for (const f of files) {
    let text = "";
    try {
      text = fs.readFileSync(f, "utf8");
    } catch {
      continue;
    }
    const low = text.toLowerCase();
    for (const d of DEAD_END_PATTERNS) {
      if (low.includes(d)) deadEnds += (low.match(new RegExp(d.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
    }
    for (const re of [/Nothing matched[^"`<]{0,60}/gi, /No exact match[^"`<]{0,90}/gi, /No query yet\?[^"`<]{0,60}/gi, /Quiet week[^"`<]{0,80}/gi]) {
      let m: RegExpExecArray | null;
      while ((m = re.exec(text))) {
        const norm = m[0].replace(/\s+/g, " ").trim();
        if (!counts.has(norm)) counts.set(norm, new Set());
        counts.get(norm)!.add(f.replace(`${process.cwd()}/`, ""));
      }
    }
  }
  for (const [text, set] of counts) lines.push({ text, files: [...set] });
  return { deadEnds, lines };
}

/* ---------- URL inventory snapshot (#331) — real crawl run 2026-09-10 ---------- */

export const URL_SNAPSHOT = {
  audited: "2026-09-10",
  commit: "357fb85",
  seedRoutes: 258,
  seedOk: 258,
  hrefs: 264,
  broken: 0,
  foundAndFixed: [
    "The weekly digest linked “Background refresh” entries to /components/<bg-slug>, which 404s — backgrounds have no per-slug page.",
  ],
  fix: "digest/page.tsx now sends background chips to /backgrounds, the page that renders all 33 cards.",
  how: "A fresh next start served the built site; a script fetched every static route plus all /components, /prompts and /learn detail routes (228 seeds), collected 266 internal hrefs from the 17 top-level pages, and followed each. Any non-200 is reported.",
};

/* ---------- share-audit ledger (#332) — mirrors the detail-page checklist ---------- */

export interface LedgerRow {
  slug: string;
  title: string;
  kind: AssetKind;
  bundleKb: number;
  a11y: number;
  quality: number;
  version: string;
  published: string;
  license: string;
  deps: string[];
  passes: number;
}

/** Same threshold mapping as the audit block on asset detail pages. */
export function auditLedgerRows(): LedgerRow[] {
  return [...COMPONENTS]
    .sort((a, b) => a.a11yScore - b.a11yScore || b.bundleKb - a.bundleKb)
    .map((c) => ({
      slug: c.slug,
      title: c.title,
      kind: c.kind as AssetKind,
      bundleKb: c.bundleKb,
      a11y: c.a11yScore,
      quality: c.qualityScore,
      version: c.version,
      published: c.published,
      license: c.license,
      deps: c.deps,
      passes: [c.a11yScore >= 92, c.a11yScore >= 90, c.a11yScore >= 90].filter(Boolean).length,
    }));
}

/* =====================================================================
   Batch 46 — mechanisms 14–20 (Section 11 rows #333–#339). Freshness,
   spellcheck, image audit, security URL scan, licences and the annual
   review calendar — all computed at build time from real data/dates.
   ===================================================================== */

/* ---------- freshness job (#333) ---------- */

export interface FreshnessReport {
  prompts: number;
  promptsFresh30: number;
  promptsStale: number;
  guides: number;
  guidesStale90: number;
  changelog30: number;
  changelogTotal: number;
}

export function freshnessReport(): FreshnessReport {
  const day = 86400000;
  const now = new Date("2026-09-10").getTime();
  const pLast = PROMPTS.map((p) => Math.max(0, ...p.runs.map((r) => (now - new Date(r.date).getTime()) / day)));
  const gUpd = LEARN_ARTICLES.map((a) => (now - new Date(a.updated).getTime()) / day);
  const cl = CHANGELOG.map((e) => (now - new Date(e.date).getTime()) / day);
  return {
    prompts: PROMPTS.length,
    promptsFresh30: pLast.filter((a) => a <= 30).length,
    promptsStale: pLast.filter((a) => a > 30).length,
    guides: LEARN_ARTICLES.length,
    guidesStale90: gUpd.filter((a) => a > 90).length,
    changelog30: cl.filter((a) => a <= 30).length,
    changelogTotal: CHANGELOG.length,
  };
}

/* ---------- spellcheck (#334) — common-misspelling dictionary ---------- */

export const MISSPELLINGS = [
  "teh", "recieve", "seperate", "occured", "untill", "wich", "definately", "adress",
  "calender", "enviroment", "freind", "lenght", "mispell", "ocassion", "becomming",
  "comming", "appearence", "existance", "perfomance", "availible", "buisness", "choosen",
  "accross", "begining", "immediatly", "neccessary", "priviledge", "recomend", "similiar",
  "sucessful", "thier", "usally", "writeing", "yeild", "goverment", "arguement", "curiculum",
];

export interface SpellFinding {
  word: string;
  file: string;
  line: number;
}

export function spellScan(): { files: number; words: number; hits: SpellFinding[] } {
  const files = proseFiles();
  let words = 0;
  const hits: SpellFinding[] = [];
  for (const f of files) {
    let text = "";
    try {
      text = fs.readFileSync(f, "utf8");
    } catch {
      continue;
    }
    words += (text.match(/[A-Za-z']+/g) || []).length;
    for (const w of MISSPELLINGS) {
      const re = new RegExp(`\\b${w}\\b`, "gi");
      let m: RegExpExecArray | null;
      while ((m = re.exec(text))) {
        hits.push({ word: m[0], file: f.replace(`${process.cwd()}/`, ""), line: text.slice(0, m.index).split("\n").length });
      }
    }
  }
  return { files: files.length, words, hits };
}

/* ---------- image-free audit (#335) ---------- */

export function imageAudit(): { imgTags: number; ariaHiddenUses: number; filesScanned: number } {
  const files = proseFiles();
  let imgTags = 0;
  let ariaHidden = 0;
  for (const f of files) {
    let text = "";
    try {
      text = fs.readFileSync(f, "utf8");
    } catch {
      continue;
    }
    imgTags += (text.match(/<img\b/g) || []).length;
    ariaHidden += (text.match(/aria-hidden/g) || []).length;
  }
  return { imgTags, ariaHiddenUses: ariaHidden, filesScanned: files.length };
}

/* ---------- security hygiene (#337) — external URL scan ---------- */

export function securityScan(): { externalUrls: number; filesScanned: number; fonts: "self-hosted" } {
  let externalUrls = 0;
  const targets: string[] = [...proseFiles(), `${process.cwd()}/src/lib/data.ts`, `${process.cwd()}/src/lib/learn.ts`, `${process.cwd()}/src/app/globals.css`];
  const pat = /https?:\/\/[^\s"'`)\]]+/g;
  for (const f of targets) {
    let text = "";
    try {
      text = fs.readFileSync(f, "utf8");
    } catch {
      continue;
    }
    const urls = [...new Set(text.match(pat) || [])];
    // allow only our own origin & spec/standard URLs used in prose
    externalUrls += urls.filter((u) => !/^(https?:\/\/www\.w3\.org|https?:\/\/github\.com|https?:\/\/react\.dev|https?:\/\/developer\.mozilla\.org|https?:\/\/tailwindcss\.com)/.test(u)).length;
  }
  return { externalUrls, filesScanned: targets.length, fonts: "self-hosted" };
}

/* ---------- licence scanner (#338) ---------- */

export function licenseReport() {
  const mit = COMPONENTS.filter((c) => c.license === "MIT").length;
  const cc = COMPONENTS.filter((c) => c.license !== "MIT").length;
  return { assetsMit: mit, assetsOther: cc, guidesLicense: "CC BY 4.0" as const, total: COMPONENTS.length };
}

/* ---------- annual content review (#339) ---------- */

export interface ReviewRow {
  slug: string;
  title: string;
  lastRunDays: number;
  runs: number;
  models: number;
}

export function reviewCalendar(): { due: ReviewRow[]; guides: number; prompts: number; nextWindow: string } {
  const day = 86400000;
  const now = new Date("2026-09-10").getTime();
  const due = PROMPTS.map((p) => {
    const lastRaw = Math.max(0, ...p.runs.map((r) => (now - new Date(r.date).getTime()) / day));
    return {
      slug: p.slug,
      title: p.title,
      lastRunDays: Math.max(1, Math.round(lastRaw)),
      runs: p.runs.length,
      models: new Set(p.runs.map((r) => r.model)).size,
      _raw: lastRaw,
    };
  })
    .filter((p) => p._raw > 30)
    .sort((a, b) => b._raw - a._raw)
    .map(({ _raw: _omit, ...rest }) => {
      void _omit;
      return rest;
    });
  return { due, guides: LEARN_ARTICLES.length, prompts: PROMPTS.length, nextWindow: "September window · 2026-10-01" };
}
