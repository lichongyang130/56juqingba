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

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const base = (process.env.BASE || "http://127.0.0.1:3139").replace(/\/+$/, "");
let pass = 0;
let fail = 0;

const ok = (name, condition, extra = "") => {
  if (condition) pass++;
  else fail++;
  console.log(`${condition ? "PASS" : "FAIL"}  ${name}${extra ? " — " + extra : ""}`);
};

/**
 * fetch with one retry on a socket error.
 *
 * The walk fetches hundreds of pages through a keep-alive pool; when the local
 * server closes an idle socket the next request can fail with "other side
 * closed" instead of a status code. That is the transport, not the page, so a
 * second attempt is made on a fresh connection. A second failure is thrown.
 */
const fetchRetry = async (url, init, attempt = 1) => {
  try {
    return await fetch(url, init);
  } catch (err) {
    if (attempt < 2) return fetchRetry(url, init, attempt + 1);
    throw err;
  }
};

const get = async (p, attempt = 1) => {
  try {
    const res = await fetchRetry(base + p);
    return { status: res.status, text: await res.text(), type: res.headers.get("content-type") || "" };
  } catch (err) {
    // A keep-alive socket the server has already closed surfaces here as a
    // socket error rather than as a status code, and a perfectly healthy page
    // then reports as a crash. One retry on a fresh connection; a second
    // failure is real and is thrown.
    if (attempt < 2) return get(p, attempt + 1);
    throw err;
  }
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
  // The slug is read from the page, not written here. This check used to carry
  // a literal slug that named an entry already retitled when the line was
  // written; the assertion ORed in a second slug, so it passed for twenty
  // batches while testing nothing — and the request it made for a slug that did
  // not exist left an error document in the build output, which is the phantom
  // page /quality/aria reported as missing a lang attribute. See batch 82.
  const slug = (log.text.match(/href="\/changelog\/([a-z0-9-]+)"/) || [])[1];
  const entry = slug ? await get(`/changelog/${slug}`) : { status: 0, text: "" };
  ok(
    "/changelog/<slug> renders the entry the list links to",
    Boolean(slug) && entry.status === 200 && entry.text.includes("Studio log"),
    slug ? `/${slug} → ${entry.status}` : "no slug found on /changelog",
  );
  // A slug that no longer exists has to 404, and probing that is not free: on a
  // cold server Next caches the not-found result as an __next_error__ document
  // under .next/server/app. That is the mechanism behind the phantom count, so
  // the probe cleans up what it writes instead of leaving it for the next
  // measurement to find.
  const GONE_SLUG = "2026-01-01-an-entry-that-does-not-exist";
  const gone = await get(`/changelog/${GONE_SLUG}`);
  ok("a changelog slug that no longer exists answers 404", gone.status === 404, String(gone.status));
  if (/^http:\/\/(127\.0\.0\.1|localhost)/.test(base)) {
    const dir = path.join(".next", "server", "app", "changelog");
    for (const f of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
      if (f.startsWith(GONE_SLUG)) fs.rmSync(path.join(dir, f), { recursive: true, force: true });
    }
  }
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

  /* ---------- demo copy vs catalog data ---------- */

  // #511 — demo scenes used to print numbers about this catalog as string
  // literals: "300 verified prompts" beside a catalog of 74, "62 assets" beside
  // 133, "39 components", and a "motif by the numbers" band whose four figures
  // (128 assets, a 4.2k-star launch week, "300+ teams", a 1.9s load) were all
  // invented. The scenes now read the catalog, and the page says which half is
  // sample copy.
  {
    // Every module that holds scene copy. The scenes used to live in one file;
    // after the batch-85 split they live in the registry, the shared kit, seven
    // sets and scenes-17.tsx, so a list that named only two of those would have
    // left most of the copy this gate exists for unchecked.
    const demoFiles = [
      "src/components/demos/Demo.tsx",
      "src/components/demos/scene-kit.tsx",
      "src/components/demos/scenes-17.tsx",
      ...fs
        .readdirSync("src/components/demos/scenes")
        .filter((f) => f.endsWith(".tsx"))
        .map((f) => `src/components/demos/scenes/${f}`),
    ];
    const offenders = [];
    for (const f of demoFiles) {
      const src = fs.readFileSync(f, "utf8");
      src.split("\n").forEach((line, i) => {
        if (line.trim().startsWith("//") || line.trim().startsWith("*")) return;
        // widget metadata is not copy: `aria-valuetext="4 out of 5 stars"` is a
        // rating component describing its own scale.
        if (/aria-(valuetext|label|describedby)/.test(line)) return;
        // a bare number immediately before a catalog noun, e.g. "62 assets"
        if (/\b\d[\d,.]*\+?\s+(verified prompts|components?|assets|guides|prompt runs)\b/i.test(line) && !/\$\{/.test(line)) {
          offenders.push(`${f}:${i + 1}`);
        }
        if (/\b\d[\d,.]*\+?\s+(stars|teams|developers|users)\b/i.test(line)) offenders.push(`${f}:${i + 1} (social proof figure)`);
      });
    }
    ok(
      "no demo scene hard-codes a catalog count",
      offenders.length === 0,
      offenders.length ? offenders.slice(0, 5).join(", ") : `${demoFiles.length} scene files scanned`,
    );

    const halo = await get("/components/halo-button");
    ok(
      "the component page labels preview copy and answers the question",
      halo.text.includes("sample copy") && halo.text.includes("Are the numbers inside the demo real?"),
      String(halo.status),
    );
    const embed = await get("/embed/halo-button");
    ok("the embed states that preview copy is sample content", embed.text.includes("Preview copy is sample content"));
  }

  /* ---------- demo figures the pages print ---------- */

  // /brand/voice uses the size of the demo modules as its example of "a number
  // is checkable". It was a typed-in literal ("13 files and 428 KB") and went
  // stale the moment the scenes were split, so the two pages that print these
  // figures are now compared against the files. Counted the same way
  // src/lib/perf.ts counts them: every module that holds scene code.
  {
    const demoDir = path.join("src", "components", "demos");
    const demoModules = [
      "Demo.tsx",
      "scene-kit.tsx",
      "scenes-17.tsx",
      ...fs
        .readdirSync(path.join(demoDir, "scenes"))
        .filter((f) => f.endsWith(".tsx"))
        .map((f) => `scenes/${f}`),
    ];
    const demoLines = demoModules.reduce((a, f) => a + fs.readFileSync(path.join(demoDir, f), "utf8").split("\n").length, 0);
    const phrase = `${demoLines.toLocaleString("en-US")} lines across ${demoModules.length} modules`;
    // React puts comment markers between an expression and the text around it,
    // so the comparison runs over the document with tags and comments removed.
    const textOf = (html) =>
      html
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ");
    const voice = await get("/brand/voice");
    ok(
      "/brand/voice prints the demo count the files have",
      voice.status === 200 && textOf(voice.text).includes(phrase),
      `${demoLines} lines across ${demoModules.length} modules`,
    );
    const layers = await get("/lab/layers");
    ok(
      "/lab/layers prints the same demo count",
      layers.status === 200 && textOf(layers.text).includes(phrase),
      String(layers.status),
    );
  }

  /* ---------- per-route JavaScript budgets ---------- */

  // #512 — the build report has always printed every route's weight and nothing
  // ever failed because of it. The budgets live in src/lib/budgets.ts, the same
  // module /quality/speed renders, so the published rules and the gate cannot
  // disagree.
  {
    const reportPath = path.join("docs", "build-report.json");
    let report = null;
    try {
      report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    } catch {
      report = null;
    }
    if (!report || !Array.isArray(report.routes)) {
      ok("per-route budgets are checked against a build report", false, "docs/build-report.json is missing or has no routes");
    } else {
      const budgetsSrc = fs.readFileSync(path.join("src", "lib", "budgets.ts"), "utf8");
      // Entries are written both one-per-line and compactly, so the parse is
      // whitespace-tolerant: route then ownJsKb, with `match: "prefix"` anywhere
      // after them in the same entry.
      const entries = [...budgetsSrc.matchAll(/route: "([^"]+)",\s*ownJsKb: (\d+)([\s\S]{0,200}?)\{/g)];
      const rules = entries
        .filter((m) => /match: "prefix"/.test(m[3]))
        .map((m) => ({ route: m[1].replace(/\/\*$/, ""), limit: Number(m[2]), prefix: true }));
      const exact = entries
        .filter((m) => !/match: "prefix"/.test(m[3]) && !m[1].endsWith("/*"))
        .map((m) => ({ route: m[1], limit: Number(m[2]), prefix: false }));
      const defaultLimit = Number((budgetsSrc.match(/DEFAULT_OWN_JS_KB = (\d+)/) || [])[1] || 90);
      const limitFor = (url) => {
        for (const r of [...exact, ...rules]) {
          if (r.prefix ? url === r.route || url.startsWith(`${r.route}/`) : url === r.route) return { limit: r.limit, rule: r.route };
        }
        return { limit: defaultLimit, rule: null };
      };
      const over = report.routes
        .map((r) => ({ url: r.url, own: r.ownJsKb || 0, ...limitFor(r.url) }))
        .filter((r) => r.own > r.limit);
      ok(
        "every route is within its JavaScript budget",
        over.length === 0 && report.routes.length > 100,
        `${report.routes.length} routes${over.length ? ` · over: ${over.slice(0, 4).map((o) => `${o.url} ${o.own}KB > ${o.limit}`).join(", ")}` : ` · default limit ${defaultLimit} KB`}`,
      );
      const speed = await get("/quality/speed");
      ok(
        "/quality/speed publishes the budgets it is held to",
        speed.status === 200 && speed.text.includes("JavaScript budget") && speed.text.includes(`${defaultLimit} KB`),
        String(speed.status),
      );
    }
  }

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

  // One implementation, three callers: the /quality/aria page, `npm run
  // check:a11y`, and this harness. An earlier version of this block kept its own
  // copy of the rules, and the copies drifted — the page counted a stale
  // prerender artifact as a document and reported a missing-lang finding the
  // harness called clean. The rules now live in src/lib/markup-a11y.ts and this
  // block runs them the way a reader would.
  {
    let scanOut = "";
    let scanOk = true;
    try {
      scanOut = execFileSync("node", ["scripts/a11y-scan.mts"], { encoding: "utf8" });
    } catch (err) {
      scanOk = false;
      scanOut = `${err.stdout ?? ""}${err.stderr ?? ""}`;
    }
    const documents = Number((scanOut.match(/page documents: (\d+)/) || [])[1] ?? NaN);
    const fallbacks = Number((scanOut.match(/fallback documents skipped: (\d+)/) || [])[1] ?? NaN);
    ok(
      "the markup accessibility pass finds nothing in the built HTML",
      scanOk && scanOut.includes("no findings") && documents > 250,
      `${documents} page documents · ${fallbacks} fallback documents skipped`,
    );

    // The discrepancy that took three batches to pin down was a counting one:
    // the report walked the output directory, the pass skipped a document, and
    // the page in between reported a finding. Both numbers now come from the
    // same rule, and this asserts it rather than trusting it.
    const report = JSON.parse(fs.readFileSync("docs/build-report.json", "utf8"));
    ok(
      "the build report and the markup pass count the same documents",
      report.summary.htmlFiles === documents,
      `report ${report.summary.htmlFiles} vs pass ${documents} · fallbacks measured ${report.summary.fallbackDocuments}, present now ${fallbacks}`,
    );

    // The disk pass covers everything the build prerendered. Pages rendered on
    // demand have no HTML on disk between requests, so the same rules run again
    // over the sitemap (plus the four server-rendered pages the sitemap cannot
    // list) against the running server.
    let servedOut = "";
    let servedOk = true;
    try {
      servedOut = execFileSync("node", ["--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", "scripts/a11y-scan.mts", "--served", `--base=${base}`], { encoding: "utf8" });
    } catch (err) {
      servedOk = false;
      servedOut = `${err.stdout ?? ""}${err.stderr ?? ""}`;
    }
    const servedDocs = Number((servedOut.match(/page documents: (\d+)/) || [])[1] ?? NaN);
    ok(
      "the same pass over the served pages finds nothing either",
      servedOk && servedOut.includes("no findings") && servedDocs > 250,
      `${servedDocs} served documents`,
    );

    const ariaPage = await get("/quality/aria");
    ok(
      "/quality/aria documents the pass and its findings",
      ariaPage.status === 200 && ariaPage.text.includes("What this page does not check") && ariaPage.text.includes("Documents scanned"),
      String(ariaPage.status),
    );
    // The manual half is content, and content drifts. Two things have to stay
    // true: the checklist exists and says it has not been run, and the old
    // claim that the demo scenes were exempt from the pass stays deleted.
    ok(
      "/quality/aria carries the manual checklist, with the runs it has not done",
      ariaPage.text.includes("What a machine cannot decide here") &&
        ariaPage.text.includes("None of these has been run in a browser by this project") &&
        (ariaPage.text.match(/automated half:/g) || []).length >= 4,
      `${(ariaPage.text.match(/automated half:/g) || []).length} items name their automated half`,
    );
    ok(
      "/quality/aria no longer calls the demo scenes exempt from the pass",
      !ariaPage.text.includes("exempt from the host document"),
      ariaPage.text.includes("exempt from the host document") ? "old sentence still present" : "clean",
    );

    ok(
      "/quality/aria prints the same document count as the pass it describes",
      ariaPage.text.includes(`Documents scanned`) && ariaPage.text.includes(`>${documents}<`),
      `expected ${documents}`,
    );
    // The served half of that page printed a typed-in "283 URLs" until the
    // sitemap grew past it. It is derived now, and this compares it with the
    // walk the pass above actually made — the run that just happened, not a
    // second copy of its arithmetic.
    const walked = Number((servedOut.match(/markup pass over \d+ of (\d+) served pages/) || [])[1] ?? NaN);
    const ariaServed = ariaPage.text
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ");
    ok(
      "/quality/aria prints the served URL count the pass walks",
      walked > 250 && ariaServed.includes(`${walked} URLs in this build`),
      `the pass walked ${walked}`,
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
  const sitemapXml = await (await fetchRetry(`${base}/sitemap.xml`)).text();
  const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const ORIGIN = "https://motifui.dev";

  const chunks = [];
  for (let i = 0; i < sitemapUrls.length; i += 8) chunks.push(sitemapUrls.slice(i, i + 8));
  const pageIssues = [];
  const linkSet = new Set();
  // 520 — a page's own title and description. The walk below used to check that
  // a description existed at all; 93 pages shipped the brand twice in the title
  // ("… — Motif UI · Motif UI" — the page wrote the suffix the layout template
  // already appends) and twelve shared one description inherited from the
  // layout, which no per-page rule can see.
  const pageTitles = [];
  const pageDescs = [];
  for (const chunk of chunks) {
    const pages = await Promise.all(chunk.map(async (absUrl) => {
      const route = absUrl.replace(ORIGIN, "") || "/";
      const res = await fetchRetry(base + route);
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
      const title = decodeEntities((html.match(/<title>([^<]*)<\/title>/) || [])[1] || "");
      const h1s = (head.match(/<h1[\s>]/g) || []).length;
      pageTitles.push({ route: page.route, title });
      pageDescs.push({ route: page.route, desc });
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

  // 519 — the sitemap was written by hand in src/app/sitemap.ts while pages were
  // created elsewhere, and nothing compared the two: the audit found 103
  // indexable pages missing from it (the whole studio log, /brand/*, /perf/*,
  // /pro/*, /integrations/*, /community/*, /lab/layers, /studio), and five
  // surfaces /quality/crawl called "kept out of the index" that were only
  // disallowed in robots.txt — which asks a crawler not to fetch, not to
  // forget. Two rules now, both read from the one list in src/lib/crawl.ts.
  {
    const crawlSrc = fs.readFileSync("src/lib/crawl.ts", "utf8");
    const block = crawlSrc.slice(crawlSrc.indexOf("CRAWL_EXCLUSIONS: CrawlExclusion[] = ["), crawlSrc.indexOf("export const CRAWL_EXCLUDES"));
    const excludes = [...block.matchAll(/path:\s*"([^"]+)"/g)].map((m) => m[1]);
    const isExcluded = (route) => excludes.some((p) => (p.endsWith("/") ? route.startsWith(p) : route === p || route.startsWith(`${p}/`)));

    const listed = new Set(sitemapUrls);
    const missingFromSitemap = [];
    const excludedWithoutNoindex = [];
    const builtFiles = [];
    const walkBuilt = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walkBuilt(full);
        else if (entry.name.endsWith(".html")) builtFiles.push(full);
      }
    };
    if (fs.existsSync(".next/server/app")) walkBuilt(".next/server/app");
    for (const file of builtFiles) {
      const html = fs.readFileSync(file, "utf8");
      const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || "";
      // A page with no canonical is still a page: fall back to its path on disk
      // so the excluded admin console cannot slip past by omitting the tag.
      const fromDisk = `/${file.replace(".next/server/app/", "").replace(/\.html$/, "").replace(/^\(public\)\//, "").replace(/\/index$/, "").replace(/^index$/, "")}`;
      const route = canonical ? canonical.replace(ORIGIN, "") || "/" : fromDisk;
      const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);
      if (isExcluded(route)) {
        if (!noindex) excludedWithoutNoindex.push(route);
      } else if (canonical && !listed.has(canonical)) {
        missingFromSitemap.push(route);
      }
    }
    ok("the crawl exclusions are readable", excludes.length >= 8 && builtFiles.length > 250, `${excludes.length} rules · ${builtFiles.length} built documents`);
    ok(
      "every indexable built page is in the sitemap",
      missingFromSitemap.length === 0,
      `${missingFromSitemap.length} missing${missingFromSitemap.length ? `: ${missingFromSitemap.slice(0, 5).join(", ")}` : ""}`,
    );
    ok(
      "every excluded surface carries a noindex, not only a robots rule",
      excludedWithoutNoindex.length === 0,
      `${excludedWithoutNoindex.length} without${excludedWithoutNoindex.length ? `: ${excludedWithoutNoindex.slice(0, 5).join(", ")}` : ""}`,
    );

    // The disk walk above cannot see a page rendered on demand — /quality/aria,
    // /roadmap and the two /community form pages have no HTML in .next between
    // requests, and five of them were indexable and unlisted. So the second half
    // reads the build's own route manifest and asks every static route the same
    // question, over HTTP: indexable pages must be listed, noindex pages must
    // not be.
    const routeManifest = JSON.parse(fs.readFileSync(".next/routes-manifest.json", "utf8"));
    const staticRoutes = routeManifest.staticRoutes
      .map((r) => r.page)
      .filter((r) => !r.includes("[") && !r.startsWith("/_") && !/\.[a-z0-9]+$/.test(r) && !r.startsWith("/api/"));
    const twoWayIssues = [];
    for (const route of staticRoutes) {
      const res = await fetchRetry(base + route);
      const html = res.status === 200 ? await res.text() : "";
      const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);
      const listedRoute = listed.has(`${ORIGIN}${route === "/" ? "" : route}`);
      if (noindex && listedRoute) twoWayIssues.push(`listed but noindex ${route}`);
      if (!noindex && !listedRoute) twoWayIssues.push(`${res.status} indexable but unlisted ${route}`);
    }
    ok(
      "every static route is either listed or noindex — both ways",
      staticRoutes.length > 120 && twoWayIssues.length === 0,
      `${staticRoutes.length} routes${twoWayIssues.length ? ` · ${twoWayIssues.slice(0, 5).join(", ")}` : ""}`,
    );

    // The page's own sentence is compared with the file a crawler gets, the way
    // /brand/voice's demo figure is: the count is derived, but a derived count
    // printed on a page still has to match what is served.
    const crawlPage = await get("/quality/crawl");
    const crawlText = crawlPage.text.replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    ok(
      "/quality/crawl prints the sitemap count it is describing",
      crawlPage.status === 200 &&
        crawlText.includes(`${sitemapUrls.length} URLs in this build`) &&
        crawlText.includes(`${excludes.length} surfaces are kept out`),
      `sitemap ${sitemapUrls.length} · exclusions ${excludes.length}`,
    );
  }

  const dupes = (rows, field) => {
    const by = new Map();
    for (const r of rows) if (r[field]) by.set(r[field], [...(by.get(r[field]) || []), r.route]);
    return [...by].filter(([, routes]) => routes.length > 1).map(([value, routes]) => `${routes.slice(0, 3).join(" = ")} → ${value.slice(0, 40)}`);
  };
  const doubleBrand = pageTitles.filter((t) => (t.title.match(/Motif UI/g) || []).length > 1).map((t) => t.route);
  const longTitles = pageTitles.filter((t) => t.title.length > 75).map((t) => `${t.title.length} ${t.route}`);
  ok(
    "no page title carries the brand twice",
    doubleBrand.length === 0,
    `${pageTitles.length} titles${doubleBrand.length ? ` · ${doubleBrand.slice(0, 5).join(", ")}` : ""}`,
  );
  ok("no title is longer than 75 characters", longTitles.length === 0, longTitles.slice(0, 5).join(" | ") || "all within the window");
  ok("no two pages share a title", dupes(pageTitles, "title").length === 0, dupes(pageTitles, "title").slice(0, 4).join(" | ") || "all distinct");
  ok("no two pages share a description", dupes(pageDescs, "desc").length === 0, dupes(pageDescs, "desc").slice(0, 4).join(" | ") || "all distinct");

  const linkList = [...linkSet];
  const linkChunks = [];
  for (let i = 0; i < linkList.length; i += 10) linkChunks.push(linkList.slice(i, i + 10));
  // One deliberate exception, named by the page that documents it: /brand/mascot
  // links to a URL that does not exist, because a live 404 is how it shows the
  // mascot on the not-found route. It is asserted 404 below, so the exception
  // cannot quietly hide a link that stopped working — and the walk only sees it
  // at all now that /brand/* is in the sitemap.
  const DELIBERATE_DEAD_LINKS = new Set(["/this-page-does-not-exist"]);
  const brokenLinks = [];
  const deadLinkStatus = new Map();
  for (const chunk of linkChunks) {
    const results = await Promise.all(chunk.map(async (link) => ({ link, status: (await fetchRetry(base + link, { redirect: "manual" })).status })));
    for (const r of results) {
      if (DELIBERATE_DEAD_LINKS.has(r.link)) deadLinkStatus.set(r.link, r.status);
      else if (r.status !== 200) brokenLinks.push(`${r.status} ${r.link}`);
    }
  }
  ok(
    "no internal link on any page is broken",
    brokenLinks.length === 0,
    `${linkSet.size} distinct links${brokenLinks.length ? ` · ${brokenLinks.slice(0, 6).join(" | ")}` : ""}`,
  );
  ok(
    "the one deliberate dead link still 404s",
    deadLinkStatus.size === 1 && deadLinkStatus.get("/this-page-does-not-exist") === 404,
    [...deadLinkStatus].map(([l, s]) => `${s} ${l}`).join(", ") || "not linked anywhere",
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
  // The feed is generated from the same list the page renders, so the count is
  // compared against the page rather than against a number here: a literal 12
  // was correct until a thirteenth entry shipped, and then failed for the wrong
  // reason.
  const listed = new Set([...log.text.matchAll(/href="\/changelog\/([a-z0-9-]+)"/g)].map((m) => m[1])).size;
  const fed = (rss.text.match(/<item>/g) || []).length;
  ok("the feed carries every changelog entry", fed > 0 && fed === listed, `feed ${fed}, /changelog lists ${listed}`);

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
