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
  ok("ledger row count matches the shipped total", rows === 430, String(rows));
  ok("ledger ends at row 430", /\| 430 \|/.test(doc));
  ok("section 16 is marked complete", /15\/15 shipped ✅/.test(doc) && /Sections 1–16 complete/.test(doc));

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
  ok("catalog carries every component", catalog.components.length === 107, String(catalog.components.length));

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
