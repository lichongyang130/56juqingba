/**
 * Section 16's own harness.
 *
 *   npm run check:exports                 # against http://127.0.0.1:3139
 *   BASE=https://example.com npm run check:exports
 *
 * A documentation page and the file it documents are two places for the same
 * claim to drift apart. This script fetches every endpoint the Hub links,
 * reads the bytes back against the page that prints them, parses both served
 * scripts with `node --check`, and keeps the ledger's row count honest. It
 * exits non-zero on the first category of failure it finds, so it can be a CI
 * step later even though nothing runs it today.
 */

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const base = (process.env.BASE || "http://127.0.0.1:3139").replace(/\/+$/, "");
let pass = 0;
let fail = 0;

const ok = (name, condition, extra = "") => {
  if (condition) pass++;
  else fail++;
  console.log(`${condition ? "PASS" : "FAIL"}  ${name}${extra ? " — " + extra : ""}`);
};

const get = async (p) => {
  const res = await fetch(base + p);
  return { status: res.status, text: await res.text(), type: res.headers.get("content-type") || "" };
};

const EXPORT_FILES = [
  "tokens.json",
  "motif-preset.cjs",
  "figma-variables.json",
  "catalog.json",
  "motif.code-snippets",
  "changelog.xml",
  "motif-storybook-decorator.jsx",
  "learn-print.css",
  "motif-react-wrapper.jsx",
  "single-file.html",
  "codesandbox-files.json",
  "motif-bookmarklet.js",
  "motif-cli.mjs",
];

const DOC_PAGES = [
  "/integrations",
  "/integrations/tokens",
  "/integrations/tailwind",
  "/integrations/figma",
  "/integrations/catalog",
  "/integrations/vscode",
  "/integrations/feed",
  "/integrations/storybook",
  "/integrations/og",
  "/integrations/print",
  "/integrations/react",
  "/integrations/single-file",
  "/integrations/codesandbox",
  "/integrations/embed",
  "/integrations/bookmarklet",
  "/integrations/cli",
  "/integrations/badge",
];

function parseCheck(label, source) {
  const file = path.join(os.tmpdir(), `motif-check-${label}.mjs`);
  fs.writeFileSync(file, source);
  try {
    execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
    ok(`served ${label} parses as JavaScript`, true);
  } catch (err) {
    ok(`served ${label} parses as JavaScript`, false, String(err.stderr || err.message).slice(0, 120));
  } finally {
    fs.unlinkSync(file);
  }
}

(async () => {
  console.log(`check-exports against ${base}\n`);

  /* ---------- the ledger ---------- */

  const doc = fs.readFileSync("docs/enrichment-500.md", "utf8");
  const rows = (doc.match(/^\| \d+ \|/gm) || []).length;
  const headline = Number((doc.match(/## Progress — (\d+) \/ 500 shipped/) || [])[1]);
  const extras = Number((doc.match(/ledger-extra-rows: (\d+)/) || [])[1] || 0);
  ok(
    "ledger table matches its own headline",
    rows === headline + extras && rows > 0,
    `table ${rows}, headline ${headline} + ${extras} extra`,
  );
  const nums = [...doc.matchAll(/^\| (\d+) \|/gm)].map((m) => Number(m[1]));
  ok(
    "ledger rows are numbered 1..N without gaps",
    nums.length > 0 && nums.every((n, i) => n === i + 1),
    `${nums.length} rows, max ${Math.max(...nums)}`,
  );
  const secHeads = [...doc.matchAll(/^## (\d+)\. ([^\n]*)$/gm)].filter((m) => Number(m[1]) <= 16);
  ok(
    "sections 1–16 are marked complete",
    secHeads.length === 16 && secHeads.every((m) => /complete|✅/.test(m[2])),
    `${secHeads.length} headings, ${secHeads.filter((m) => /complete|✅/.test(m[2])).length} complete`,
  );

  /* ---------- section 19 crawl surface and schema ---------- */

  const sm = await get("/sitemap.xml");
  ok("sitemap.xml is served", sm.status === 200 && sm.text.includes("<urlset"), String(sm.status));
  // Counted against the catalog, which is fetched later for its own checks —
  // so the sitemap comparison happens there, where the number exists.
  const comps = (sm.text.match(/\/components\/[a-z0-9-]+/g) || []).length;
  ok("sitemap carries essays and prompts", sm.text.includes("/learn/") && sm.text.includes("/prompts/"));
  const rb = await get("/robots.txt");
  ok("robots.txt disallows the thin surfaces", rb.status === 200 && rb.text.includes("Disallow: /search") && rb.text.includes("Disallow: /admin"));
  ok("robots.txt points at the sitemap", /Sitemap: https?:\/\/\S+\/sitemap\.xml/.test(rb.text));

  const crawl = await get("/quality/crawl");
  ok(
    "/quality/crawl prints the exclusion list",
    crawl.status === 200 && crawl.text.includes("/saved/stack") && crawl.text.includes("noindex"),
    String(crawl.status),
  );
  const schemaPage = await get("/quality/schema");
  ok("/quality/schema names the absent types", schemaPage.status === 200 && schemaPage.text.includes("AggregateRating"));
  const glossary = await get("/glossary");
  ok("/glossary defines the fidelity score", glossary.status === 200 && glossary.text.includes("Fidelity score") && glossary.text.includes("Run log"));

  const spine = await get("/components/halo-button");
  const spineEssays = new Set((spine.text.match(/\/learn\/[a-z0-9-]+/g) || []));
  const spinePrompts = new Set((spine.text.match(/\/prompts\/[a-z0-9-]+/g) || []));
  ok(
    "the spine rail links two essays and a prompt",
    spine.text.includes("Read next") && spineEssays.size >= 2 && spinePrompts.size >= 1,
    `${spineEssays.size} essays, ${spinePrompts.size} prompts`,
  );
  const refreshed = await get("/quality/refreshed");
  ok(
    "/quality/refreshed prints the review schedule",
    refreshed.status === 200 && refreshed.text.includes("Review due") && refreshed.text.includes("added"),
    String(refreshed.status),
  );
  const log = await get("/changelog");
  ok("/changelog lists every entry", log.status === 200 && (log.text.match(/\/changelog\//g) || []).length >= 12);
  const entry = await get("/changelog/2026-08-19-ui-kit-launches-with-20-verified-elements");
  ok("/changelog/<slug> renders an entry", entry.status === 200 || (await get("/changelog/2026-09-10-the-demo-module-leaves-every-page-that-does-not-render-one")).status === 200);
  const esPage = await get("/es");
  const enHome = await get("/");
  ok(
    "the multilingual title test declares both directions",
    /hreflang="en"/i.test(esPage.text) && /hreflang="es"/i.test(esPage.text) && /hreflang="es"/i.test(enHome.text),
    `es ${(esPage.text.match(/hreflang="[a-z-]+"/gi) || []).length} tags, home ${(enHome.text.match(/hreflang="[a-z-]+"/gi) || []).length}`,
  );
  const questions = await get("/learn/questions");
  ok(
    "/learn/questions pairs every question with an essay and an asset",
    questions.status === 200 && (questions.text.match(/Read the guide/g) || []).length >= 18 && questions.text.includes("How do I stop a hero section from feeling static?"),
    `${(questions.text.match(/Read the guide/g) || []).length} mentions of the guide link`,
  );
  const craft = await get("/quality/craft");
  ok("/quality/craft quotes the code it praises", craft.status === 200 && craft.text.includes("prefers-reduced-motion") && craft.text.includes("Zero-dependency assets"));
  const speed = await get("/quality/speed");
  ok(
    "/quality/speed reads its numbers and names what it does not claim",
    speed.status === 200 && speed.text.includes("No Lighthouse score") && /\d+(\d)?(\.\d)? KB/.test(speed.text),
    String(speed.status),
  );
  const og = await get("/og/halo-button");
  ok("/og/<slug> serves a generated PNG", og.status === 200 && og.type.includes("image/png"), `${og.status} ${og.type}`);

  const compare = await get("/compare");
  ok(
    "/compare appraises five approaches",
    compare.status === 200 && (compare.text.match(/What Motif does instead/g) || []).length >= 5,
    `${(compare.text.match(/What Motif does instead/g) || []).length} mentions`,
  );

  const detail = await get("/components/halo-button");
  ok("a component page carries FAQPage markup", detail.text.includes('"@type":"FAQPage"'));
  ok("a component page carries a breadcrumb trail", detail.text.includes('"@type":"BreadcrumbList"'));
  ok("a component page declares a canonical", /rel="canonical" href="https?:\/\/[^"]+\/components\/halo-button"/.test(detail.text));
  const essay = await get("/learn/the-keyboard-walk");
  ok("an essay carries Article markup", essay.text.includes('"@type":"Article"') && essay.text.includes("dateModified"));

  // The absent list is a promise: check no forbidden type is written anywhere in src/.
  const srcFiles = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(ts|tsx)$/.test(entry.name)) srcFiles.push(full);
    }
  };
  walk("src");
  // The list itself is read out of the .ts source: a CJS script cannot require
  // TypeScript, and duplicating the list here would defeat the check.
  const schemaMap = fs.readFileSync("src/lib/schema-map.ts", "utf8");
  const FORBIDDEN_SCHEMA_TYPES = [...schemaMap.matchAll(/"(Product|Offer|AggregateRating|Review)"/g)].map((m) => m[1]);
  ok("the forbidden-type list is readable", FORBIDDEN_SCHEMA_TYPES.length >= 4, FORBIDDEN_SCHEMA_TYPES.join(", "));
  const offenders = [];
  for (const file of srcFiles) {
    const text = fs.readFileSync(file, "utf8");
    for (const type of FORBIDDEN_SCHEMA_TYPES) {
      if (new RegExp(`"@type"\\s*:\\s*"${type}"`).test(text)) offenders.push(`${file}:${type}`);
    }
  }
  ok("no forbidden schema type is emitted anywhere", offenders.length === 0, offenders.join(", "));

  /* ---------- no invented movement ---------- */

  // Nothing in this repository records a change over time for the catalog, so a
  // "+12.4%" or an arrow next to a count can only be invention. The homepage
  // shipped four such figures plus a percentage manufactured from the copy
  // count; they were removed in #510 and this keeps them out.
  {
    const publicSrc = [];
    const walkSrc = (dir) => {
      for (const e of fs.readdirSync(dir)) {
        const p = path.join(dir, e);
        if (fs.statSync(p).isDirectory()) {
          if (!p.includes("demos") && !p.includes("admin")) walkSrc(p);
        } else if (e.endsWith(".tsx")) publicSrc.push(p);
      }
    };
    walkSrc(path.join("src", "app", "(public)"));
    const hardcodedDeltas = publicSrc.filter((f) => /delta: "/.test(fs.readFileSync(f, "utf8")));
    ok(
      "no public page hard-codes a growth figure",
      hardcodedDeltas.length === 0,
      `${publicSrc.length} files scanned${hardcodedDeltas.length ? ` · ${hardcodedDeltas.join(", ")}` : ""}`,
    );

    const homeHtml = (await get("/")).text;
    const markers = ["this drop", "+8 this", "+2 this", "+0.6 pt", "+12.4%", "Trending this week"].filter((m) => homeHtml.includes(m));
    ok(
      "the homepage prints no movement it cannot measure",
      markers.length === 0,
      markers.length ? `found: ${markers.join(", ")}` : "clean",
    );
  }

  /* ---------- markup accessibility pass ---------- */

  // The seven checks /quality/aria documents, run from outside the build so the
  // page cannot report green while the served HTML is not.
  {
    const walkHtml = (dir) => {
      const out = [];
      for (const e of fs.readdirSync(dir)) {
        const p = path.join(dir, e);
        if (fs.statSync(p).isDirectory()) out.push(...walkHtml(p));
        else if (e.endsWith(".html") && e !== "_global-error.html") out.push(p);
      }
      return out;
    };
    const docs = walkHtml(path.join(".next", "server", "app"));
    const textOf = (frag) =>
      frag.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;|&#\d+;/g, " ").replace(/\s+/g, " ").trim();
    const findings = [];
    for (const f of docs) {
      const html = fs.readFileSync(f, "utf8");
      // Next leaves an error document behind for paths its static export
      // refuses; it carries id="__next_error__" and is not a page we ship.
      if (/<html[^>]*id="__next_error__"/.test(html)) continue;
      const head = html.split("<script>self.__next_f")[0];
      const wrapped = (i) => (head.slice(0, i).match(/<label\b/g) || []).length > (head.slice(0, i).match(/<\/label>/g) || []).length;
      if (!/<html[^>]+lang="/.test(html)) findings.push(`no-lang ${f}`);
      for (const m of head.matchAll(/<img\b[^>]*>/g)) if (!/\balt=/.test(m[0])) findings.push(`img-no-alt ${f}`);
      for (const m of head.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g))
        if (!/aria-hidden="true"|aria-label|aria-labelledby|title=/.test(m[1]) && !textOf(m[2])) findings.push(`button-no-name ${f}`);
      for (const m of head.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g))
        if (!/aria-hidden="true"|aria-label|aria-labelledby|title=/.test(m[1]) && !/<img[^>]+alt="[^"]+"/.test(m[2]) && !textOf(m[2])) findings.push(`link-no-name ${f}`);
      for (const m of head.matchAll(/<(input|select|textarea)\b([^>]*)>/g)) {
        const attrs = m[2];
        if (/type="(hidden|submit|button|reset|image)"/.test(attrs)) continue;
        if (/aria-hidden="true"|aria-label|aria-labelledby/.test(attrs)) continue;
        if (wrapped(m.index)) continue;
        const id = (attrs.match(/\sid="([^"]+)"/) || [])[1];
        if (id && new RegExp(`<label[^>]+for="${id}"`).test(head)) continue;
        findings.push(`control-no-label ${f}`);
      }
      const ids = [...head.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]).filter((id) => !id.startsWith("__"));
      const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
      if (dupes.length) findings.push(`duplicate-id ${f} ${[...new Set(dupes)].join(",")}`);
      const levels = [...head.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
      for (let i = 1; i < levels.length; i++)
        if (levels[i] > levels[i - 1] + 1) {
          findings.push(`heading-skip ${f} h${levels[i - 1]}->h${levels[i]}`);
          break;
        }
    }
    ok(
      "the markup accessibility pass finds nothing in the built HTML",
      docs.length > 250 && findings.length === 0,
      `${docs.length} documents${findings.length ? ` · ${findings.length} findings: ${[...new Set(findings)].slice(0, 4).join(" | ")}` : ""}`,
    );
    const ariaPage = await get("/quality/aria");
    ok(
      "/quality/aria documents the pass and its findings",
      ariaPage.status === 200 && ariaPage.text.includes("What this page does not check") && ariaPage.text.includes("Documents scanned"),
      String(ariaPage.status),
    );
  }

  /* ---------- site-wide page audit (added after the 500-item programme) ---------- */

  // Walks the sitemap: every page must answer 200 with one h1, its own
  // canonical, an og:image and a description that fits a search result. Then it
  // fetches every distinct internal link found on those pages. The audit that
  // produced these rules found 3 dead links, 61 pages without a card and 130
  // pages claiming the homepage as canonical; the checks exist so that cannot
  // come back.
  const decodeEntities = (s) =>
    s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'");
  const sitemapXml = await (await fetch(`${base}/sitemap.xml`)).text();
  const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const ORIGIN = "https://motifui.dev";

  const chunks = [];
  for (let i = 0; i < sitemapUrls.length; i += 8) chunks.push(sitemapUrls.slice(i, i + 8));
  const pageIssues = [];
  const linkSet = new Set();
  for (const chunk of chunks) {
    const pages = await Promise.all(chunk.map(async (absUrl) => {
      const route = absUrl.replace(ORIGIN, "") || "/";
      const res = await fetch(base + route);
      return { route, absUrl, status: res.status, html: res.status === 200 ? await res.text() : "" };
    }));
    for (const page of pages) {
      if (page.status !== 200) {
        pageIssues.push(`${page.status} ${page.route}`);
        continue;
      }
      const html = page.html;
      const head = html.split('<script>self.__next_f')[0];
      const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || "";
      const desc = decodeEntities((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "");
      const h1s = (head.match(/<h1[\s>]/g) || []).length;
      if (canonical !== page.absUrl) pageIssues.push(`canonical ${page.route} -> ${canonical || "none"}`);
      if ((head.match(/<h1[\s>]/g) || []).length !== 1) pageIssues.push(`h1 x${h1s} ${page.route}`);
      if (!/<meta property="og:image"/.test(html)) pageIssues.push(`no og:image ${page.route}`);
      if (!desc) pageIssues.push(`no description ${page.route}`);
      else if (desc.length > 200) pageIssues.push(`description ${desc.length} chars ${page.route}`);
      for (const m of html.matchAll(/href="(\/[^"#?]*)(?:[#?][^"]*)?"/g)) {
        const link = m[1].replace(/\/$/, "") || "/";
        if (!link.startsWith("/api/") && !link.startsWith("/_next")) linkSet.add(link);
      }
    }
  }
  ok(
    `every sitemap page has one h1, its own canonical, a card and a fitting description`,
    sitemapUrls.length > 250 && pageIssues.length === 0,
    `${sitemapUrls.length} pages${pageIssues.length ? ` · ${pageIssues.length} issues: ${pageIssues.slice(0, 5).join(" | ")}` : ""}`,
  );

  const linkList = [...linkSet];
  const linkChunks = [];
  for (let i = 0; i < linkList.length; i += 10) linkChunks.push(linkList.slice(i, i + 10));
  const brokenLinks = [];
  for (const chunk of linkChunks) {
    const results = await Promise.all(chunk.map(async (link) => ({ link, status: (await fetch(base + link, { redirect: "manual" })).status })));
    for (const r of results) if (r.status !== 200) brokenLinks.push(`${r.status} ${r.link}`);
  }
  ok(
    "no internal link on any page is broken",
    brokenLinks.length === 0,
    `${linkSet.size} distinct links${brokenLinks.length ? ` · ${brokenLinks.slice(0, 6).join(" | ")}` : ""}`,
  );

  for (const [label, slug] of [
    ["site default", "default"],
    ["component", "halo-button"],
    ["guide", "easing-cheatsheet-deep-dive"],
    ["prompt", "translation-agency-pairs"],
    ["background", "ink-aurora"],
  ]) {
    const card = await fetch(`${base}/og/${slug}`);
    ok(`/og/<slug> renders the ${label} card`, card.status === 200 && (card.headers.get("content-type") || "").includes("image/png"), String(card.status));
  }

  /* ---------- section 21 north-star bets ---------- */

  const roadmap = await get("/roadmap");
  ok(
    "/roadmap labels every bet's status",
    roadmap.status === 200 &&
      (roadmap.text.match(/Live in this build/g) || []).length >= 4 &&
      (roadmap.text.match(/Spec only — no code yet/g) || []).length >= 5,
    `${(roadmap.text.match(/Live in this build/g) || []).length} live · ${(roadmap.text.match(/Spec only — no code yet/g) || []).length} spec`,
  );
  const compApi = await get("/api/v1/components/halo-button");
  ok(
    "/api/v1/components/<slug> serves the asset as data",
    compApi.status === 200 && compApi.text.includes('"apiVersion":"v1"') && compApi.text.includes('"a11y"'),
    `${compApi.status} ${compApi.type}`,
  );
  const missingApi = await get("/api/v1/components/no-such-asset");
  ok("/api/v1/components/<slug> 404s an unknown asset", missingApi.status === 404);
  const auditApi = await get("/api/v1/audit");
  ok(
    "/api/v1/audit serves every asset's scores",
    auditApi.status === 200 && (auditApi.text.match(/"slug":/g) || []).length === 133 && auditApi.text.includes('"bands"'),
    `${(auditApi.text.match(/"slug":/g) || []).length} assets`,
  );
  const sdk = await get("/embed.js");
  ok(
    "/embed.js ships the one-tag SDK",
    sdk.status === 200 && sdk.text.includes("data-motif-embed") && sdk.text.includes("window.MotifEmbed") && sdk.type.includes("javascript"),
    `${sdk.status} ${sdk.type}`,
  );
  const sdkDoc = await get("/roadmap/embed");
  ok(
    "the SDK page runs the script it documents",
    sdkDoc.status === 200 && sdkDoc.text.includes('src="/embed.js"') && sdkDoc.text.includes('data-motif-embed="halo-button"'),
  );

  /* ---------- canonicals ---------- */

  // The layout sets no canonical on purpose: a page-level canonical inherited
  // from a layout points every page at "/". This samples one page per family,
  // including the two client-component segments whose canonical lives in a
  // one-line layout.
  for (const p of ["/", "/metrics", "/brand/logo", "/glossary", "/lab", "/prompts", "/backgrounds", "/studio", "/es", "/changelog", "/components/halo-button", "/learn/the-keyboard-walk"]) {
    const res = await get(p);
    const canonical = (res.text.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || "";
    const expected = p === "/" ? "https://motifui.dev" : `https://motifui.dev${p}`;
    ok(`canonical for ${p} is its own URL`, canonical === expected, canonical || "none");
  }

  /* ---------- section 20 brand & launch ---------- */

  const brandLogo = await get("/brand/logo");
  ok(
    "/brand/logo redraws the header's mark",
    brandLogo.status === 200 && brandLogo.text.includes('x="19" y="19"') && brandLogo.text.includes("#6366f1"),
    String(brandLogo.status),
  );
  const chromeSrc = fs.readFileSync(path.join("src", "components", "chrome.tsx"), "utf8");
  ok(
    "the logo geometry agrees between page and header",
    chromeSrc.includes('x="19" y="19"') && chromeSrc.includes("#6366f1") && chromeSrc.includes('x="19" y="7"'),
  );

  const brandVoice = await get("/brand/voice");
  ok(
    "/brand/voice prints the live tone scan",
    brandVoice.status === 200 && brandVoice.text.includes("live hits"),
    String(brandVoice.status),
  );
  // The tone rule itself, enforced: read the dictionary and the negation
  // pattern out of the module the site uses, then apply them to the same files
  // the page scans. A live hit (a banned word not near a negation) fails.
  const qualitySrc = fs.readFileSync(path.join("src", "lib", "quality-utils.ts"), "utf8");
  const dictBlock = (qualitySrc.match(/OVERCLAIM_DICTIONARY = \[([\s\S]*?)\]/) || [])[1] || "";
  const dictionary = [...dictBlock.matchAll(/"([a-z-]+)"/g)].map((m) => m[1]);
  const negSource = (qualitySrc.match(/const neg = (\/.*?\/i)\.test/) || [])[1];
  const negation = negSource ? new RegExp(negSource.slice(1, -2), "i") : null;
  const proseFiles = [];
  const walkProse = (dir) => {
    for (const e of fs.readdirSync(dir)) {
      const p = path.join(dir, e);
      if (fs.statSync(p).isDirectory()) walkProse(p);
      else if (e.endsWith(".tsx")) proseFiles.push(p);
    }
  };
  walkProse(path.join("src", "app", "(public)"));
  proseFiles.push(path.join("src", "components", "chrome.tsx"), path.join("src", "app", "not-found.tsx"));
  let toneHits = 0;
  let toneCleared = 0;
  const liveHits = [];
  if (dictionary.length >= 15 && negation) {
    for (const f of proseFiles) {
      const text = fs.readFileSync(f, "utf8");
      for (const term of dictionary) {
        const re = new RegExp(term, "gi");
        let m;
        while ((m = re.exec(text))) {
          const before = text.slice(Math.max(0, m.index - 90), m.index);
          toneHits++;
          if (negation.test(before)) toneCleared++;
          else liveHits.push(`${f}:${text.slice(0, m.index).split("\n").length} ${m[0]}`);
        }
      }
    }
  }
  ok(
    "no banned overclaim term survives the context rule",
    dictionary.length >= 15 && negation !== null && liveHits.length === 0,
    `${dictionary.length} terms · ${proseFiles.length} files · ${toneHits} hits · ${toneCleared} cleared${liveHits.length ? ` · live: ${liveHits.join(", ")}` : ""}`,
  );

  const launch = await get("/brand/launch");
  ok(
    "/brand/launch separates shipped from left-out",
    launch.status === 200 && launch.text.includes("Left out on purpose") && launch.text.includes("Still open"),
    String(launch.status),
  );
  const proof = await get("/brand/proof");
  ok(
    "/brand/proof labels the quotes as invented",
    proof.status === 200 && proof.text.includes("invented handle"),
    String(proof.status),
  );
  const notes = await get("/brand/notes");
  ok(
    "/brand/notes derives its lines from the changelog",
    notes.status === 200 && (notes.text.match(/the full entry/g) || []).length >= 12,
    `${(notes.text.match(/the full entry/g) || []).length} entry links`,
  );
  const metrics = await get("/metrics");
  ok(
    "/metrics names the numbers it does not have",
    metrics.status === 200 && metrics.text.includes("counts visitors"),
    String(metrics.status),
  );
  const mascot = await get("/brand/mascot");
  ok(
    "/brand/mascot shows three poses",
    mascot.status === 200 && ["mascot-lost", "mascot-found", "mascot-idle"].every((id) => mascot.text.includes(id)),
    String(mascot.status),
  );
  const notFound = await get("/definitely-not-a-route");
  ok("the 404 page renders the mascot", notFound.status === 404 && notFound.text.includes("mascot-404"));
  const walls = await get("/brand/wallpapers");
  ok("/brand/wallpapers links three downloads", walls.status === 200 && (walls.text.match(/\/api\/brand\//g) || []).length >= 3, String(walls.status));
  for (const slug of ["dots-4k", "ribbon-light", "type-quiet", "badge"]) {
    const art = await fetch(base + `/api/brand/${slug}`);
    const body = await art.text();
    ok(`/api/brand/${slug} serves SVG`, art.status === 200 && (art.headers.get("content-type") || "").includes("svg") && body.startsWith("<svg"), `${art.status}`);
  }
  const watermark = await get("/brand/watermark");
  ok("/brand/watermark prints the snippet", watermark.status === 200 && watermark.text.includes("Made with Motif"));
  const thanks = await get("/brand/thanks");
  // The step number is an interpolated text node, so it never appears as one
  // string in the HTML — assert the three step titles instead.
  ok(
    "/brand/thanks lists the three first steps",
    thanks.status === 200 &&
      ["Copy one component you already need", "Run the keyboard walk on your own page", "Pick a prompt with its failures attached"].every((s) =>
        thanks.text.includes(s),
      ),
    String(thanks.status),
  );

  /* ---------- section 18 retention surfaces ---------- */

  const paths = await get("/learn/paths");
  const pathTitles = ["Motion starter", "Springs, understood", "Scroll, honestly"];
  ok(
    "/learn/paths lists three paths",
    paths.status === 200 && pathTitles.every((t) => paths.text.includes(t)),
    `${pathTitles.filter((t) => paths.text.includes(t)).length}/3 paths present`,
  );
  const savedPage = await get("/saved");
  ok(
    "/saved carries the share prompt and the fitness meter",
    savedPage.status === 200 && savedPage.text.includes("Share the stack") && savedPage.text.includes("Your library fitness"),
  );
  const stack = await get("/saved/stack?items=a~halo-button,a~aurora-veil,nope~ghost");
  ok(
    "/saved/stack resolves catalog slugs from the URL",
    stack.status === 200 && stack.text.includes("Halo Button") && stack.text.includes("Aurora Veil"),
    String(stack.status),
  );
  ok("/saved/stack names the slugs it cannot resolve", stack.text.includes("nope~ghost"));
  const habits = await get("/habits");
  ok(
    "/habits carries the three opt-in panels",
    habits.status === 200 && habits.text.includes("Maker streak") && habits.text.includes("Quiet reminder") && habits.text.includes("Did this ship?"),
    String(habits.status),
  );
  const buildAThon = await get("/community/build-a-thon");
  ok(
    "/community/build-a-thon renders the computed windows",
    buildAThon.status === 200 &&
      buildAThon.text.includes("left") &&
      (buildAThon.text.match(/\d{4}-\d{2}-\d{2}/g) || []).length >= 6,
    `${(buildAThon.text.match(/\d{4}-\d{2}-\d{2}/g) || []).length} dates`,
  );
  const communityDay = await get("/community/day");
  ok(
    "/community/day names its Thursday",
    communityDay.status === 200 && /\d{4}-W\d+/.test(communityDay.text) && communityDay.text.includes("Community day"),
  );
  const cotw = await get("/digest/copy-of-the-week");
  ok("/digest/copy-of-the-week previews the issue", cotw.status === 200 && cotw.text.includes("Copy of the week") && cotw.text.includes("Motif Weekly"));

  const homeFeed = await get("/");
  ok("the home feed opens with the newest batch", homeFeed.status === 200 && /\d+ new · \d{4}-\d{2}-\d{2}/.test(homeFeed.text));

  /* ---------- the library and the hub ---------- */

  const lib = fs.readFileSync("src/lib/exports.ts", "utf8");
  ok("the token export parses the stylesheet rather than hardcoding tokens", /globals\.css/.test(lib) && /@theme/.test(lib));
  ok("every export is registered in one list", /EXPORTS: ExportEntry\[\]/.test(lib));

  const hub = await get("/integrations");
  ok("hub 200", hub.status === 200);
  ok(
    "hub links every export file by name",
    EXPORT_FILES.every((f) => hub.text.includes(f)),
  );
  ok("hub names the remainders instead of hiding them", hub.text.includes("What is still missing, and inside which feature"));
  // Each title appears more than once in the streamed payload, so this checks
  // for presence rather than counting occurrences.
  ok(
    "hub lists all five remainders",
    ["One-click CodeSandbox link", "Embed allowlist", "Publishing to npm", "Saving a palette", "A pipeline behind the badge"].every((t) =>
      hub.text.includes(t),
    ),
  );

  /* ---------- the endpoints ---------- */

  for (const file of EXPORT_FILES) {
    const res = await get(`/api/exports/${file}`);
    ok(`endpoint ${file} 200 with a content type`, res.status === 200 && res.type.length > 0, res.type.split(";")[0]);
  }
  const missing = await fetch(base + "/api/exports/nope.json");
  ok("an unknown export returns 404", missing.status === 404);

  const tokens = JSON.parse((await get("/api/exports/tokens.json")).text);
  ok("tokens have colours and radii", Object.keys(tokens.color).length >= 10 && Object.keys(tokens.radius).length >= 3);

  const catalog = JSON.parse((await get("/api/exports/catalog.json")).text);
  // The expected count is not typed in here: the chrome derives it from the
  // same data module, so comparing the JSON endpoint with the rendered footer
  // checks both paths at once and keeps this file from going stale.
  // /quality prints the counted claim ("N original assets") from truthRows(),
  // which reads the same data module the JSON endpoint serialises — two
  // independent paths to one number.
  const qualityHtml = (await get("/quality")).text.replace(/<!-- -->/g, "");
  const printed = Number((qualityHtml.match(/(\d+) original assets/) || [])[1]);
  ok(
    "catalog carries every component, and /quality agrees",
    catalog.components.length > 100 && catalog.components.length === printed,
    `catalog ${catalog.components.length}, /quality ${printed}`,
  );
  ok(
    "sitemap lists every component page",
    comps === catalog.components.length,
    `sitemap ${comps} component URLs, catalog ${catalog.components.length}`,
  );

  const rss = await get("/api/exports/changelog.xml");
  ok("the feed carries every changelog entry", (rss.text.match(/<item>/g) || []).length === 12);

  /* ---------- the two served scripts ---------- */

  const bookmarklet = await get("/api/exports/motif-bookmarklet.js");
  parseCheck("bookmarklet", bookmarklet.text);
  ok("bookmarklet reads custom properties and sends nothing", bookmarklet.text.includes("--") && !/fetch\(|XMLHttpRequest|sendBeacon/.test(bookmarklet.text));

  const cli = await get("/api/exports/motif-cli.mjs");
  parseCheck("cli", cli.text);
  ok("cli has list, tokens and badge commands", ["list", "tokens", "badge"].every((c) => cli.text.includes(`${c}(`)));
  ok("cli names the URL when a request fails", cli.text.includes("could not reach"));
  ok("cli does not claim to be published", /not published to npm/i.test(cli.text));

  /* ---------- the badge ---------- */

  const badge = await get("/api/badge/tilt-card");
  const tilt = catalog.components.find((c) => c.slug === "tilt-card");
  ok("badge serves SVG", badge.status === 200 && badge.type.startsWith("image/svg+xml"));
  ok("badge carries the stored score", badge.text.includes(`>${tilt.qualityScore}</text>`), `quality ${tilt.qualityScore}`);
  ok("badge says no pipeline stands behind it", /No CI service/.test(badge.text));
  const badgeMissing = await fetch(base + "/api/badge/not-a-component");
  ok("unknown badge returns 404", badgeMissing.status === 404);

  // The badge route and the catalog are the same numbers or the badge is
  // decoration. Sample eight slugs deterministically rather than trusting one.
  const sample = [...catalog.components].sort((a, b) => a.slug.localeCompare(b.slug)).slice(0, 8);
  let agree = 0;
  for (const c of sample) {
    const svg = await get(`/api/badge/${c.slug}`);
    if (svg.status === 200 && svg.text.includes(`>${c.qualityScore}</text>`)) agree++;
  }
  ok("every sampled badge agrees with the catalog score", agree === sample.length, `${agree}/${sample.length}`);

  /* ---------- the embed route ---------- */

  const embed = await get("/embed/tilt-card");
  ok("embed route renders a demo with attribution", embed.status === 200 && embed.text.includes("Motif UI"));
  const embedHeaders = await fetch(base + "/embed/tilt-card");
  ok("embed route sends frame-ancestors and noindex", embedHeaders.headers.get("content-security-policy") === "frame-ancestors *" && embedHeaders.headers.get("x-robots-tag") === "noindex");

  /* ---------- the pages ---------- */

  for (const p of DOC_PAGES) {
    const res = await get(p);
    ok(`page ${p} 200`, res.status === 200, String(res.status));
  }

  const printPage = await get("/integrations/print");
  ok("print page prints the block it serves", printPage.text.includes("@media print") && printPage.text.includes("break-inside"));

  const tokensPage = (await get("/integrations/tokens")).text.replace(/<!-- -->/g, "");
  ok(
    "tokens page prints the colours the endpoint serves",
    Object.keys(tokens.color).every((k) => tokensPage.includes(`--color-${k}`)),
  );

  const badgePage = await get("/integrations/badge");
  ok("badge page says it is not a CI badge", /not a CI badge/.test(badgePage.text.replace(/<!-- -->/g, "")));

  const home = await get("/");
  ok("footer links to /integrations", home.text.includes('href="/integrations"'));

  console.log(`\n${fail === 0 ? "ALL PASS" : "FAILURES"} — ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
