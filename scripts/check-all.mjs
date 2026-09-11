/**
 * #39 — every suite in one run, with the wall times recorded.
 *
 * There are four harnesses and a measurement step, and each one is a separate
 * `npm run` line. Two things were missing: a single command that runs the lot
 * and reports in one place, and any record at all of how long they take — so a
 * suite that quietly went from twenty seconds to two minutes would simply be
 * endured rather than noticed.
 *
 *   npm run check:all                  # against http://127.0.0.1:3139
 *   BASE=https://example.com npm run check:all
 *
 * Times are written to docs/check-report.json next to the previous run, and a
 * suite more than twice its recorded baseline is called out. The baseline is
 * per-machine-ish by nature — this file records what it measured and says so
 * rather than pretending a timing is a constant.
 */

import fs from "node:fs";
import { execFileSync } from "node:child_process";

const REPORT = "docs/check-report.json";

const SUITES = [
  { name: "check:exports", script: "scripts/check-exports.mjs" },
  { name: "check:demos", script: "scripts/check-demos.mjs" },
  { name: "check:a11y", script: "scripts/a11y-scan.mts" },
  { name: "check:a11y:served", script: "scripts/a11y-scan.mts", args: ["--served"] },
];

/** The recorded baseline, if a previous run wrote one. */
function previous() {
  try {
    const raw = JSON.parse(fs.readFileSync(REPORT, "utf8"));
    return raw.suites ?? {};
  } catch {
    return {};
  }
}

const before = previous();
const suites = {};
let failed = 0;

for (const suite of SUITES) {
  const started = Date.now();
  let ok = true;
  let tail = "";
  try {
    tail = execFileSync("node", ["--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", suite.script, ...(suite.args ?? [])], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (err) {
    ok = false;
    tail = `${err.stdout ?? ""}${err.stderr ?? ""}`;
  }
  const ms = Date.now() - started;
  const lines = tail.trim().split("\n").filter(Boolean);
  const summary = lines[lines.length - 1] ?? "";
  const prior = before[suite.name]?.ms;
  const regression = typeof prior === "number" && ms > prior * 2;
  suites[suite.name] = { ms, ok, summary: summary.slice(0, 160), baselineMs: prior ?? null, regression };
  if (!ok) failed++;
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${suite.name.padEnd(20)} ${String(ms).padStart(6)} ms` +
      (prior ? `  (baseline ${prior} ms${regression ? " — MORE THAN 2× SLOWER" : ""})` : "  (first recorded run)"),
  );
}

fs.writeFileSync(
  REPORT,
  `${JSON.stringify(
    {
      measuredAt: new Date().toISOString(),
      note:
        "Wall times for the four suites, so a regression is noticed rather than endured. A timing is a record of the machine that produced it, not a constant: the baseline here is the previous run in this file.",
      suites,
    },
    null,
    2,
  )}\n`,
);

const slow = Object.entries(suites).filter(([, s]) => s.regression);
console.log(`\n${failed === 0 ? "ALL PASS" : "FAILURES"} — ${SUITES.length - failed}/${SUITES.length} suites green`);
if (slow.length) console.log(`slower than 2× baseline: ${slow.map(([n]) => n).join(", ")}`);
console.log(`wall times → ${REPORT}`);
process.exit(failed ? 1 : 0);
