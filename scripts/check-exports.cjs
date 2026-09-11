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
  ok("/brand/mascot shows three poses", mascot.status === 200 && (mascot.text.match(/mascot-body/g) || []).length >= 3, String(mascot.status));
  const notFound = await get("/definitely-not-a-route");
  ok("the 404 page renders the mascot", notFound.status === 404 && notFound.text.includes("mascot-body"));
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
