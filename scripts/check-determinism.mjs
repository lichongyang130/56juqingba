#!/usr/bin/env node
// #22 — a determinism gate: build twice, measure twice, diff the numbers.
//
// A measurement is only a measurement if it comes out the same from the same
// inputs. This script runs `npm run build` twice (each run clears the prerender
// output first, per the prebuild hook), measures each build into a temp file,
// strips the two fields that are genuinely per-run (measuredAt, buildId) and
// diffs the rest. If a route's weight, a chunk count or a glyph probe moves
// between two identical builds, the report was measuring noise, not the build.
//
// It is deliberately not part of `check:all`: two clean builds are minutes, and
// a CI step that cannot run on every commit would be a gate in name only. It is
// the opt-in command `npm run check:determinism`, kept here so the measurement's
// own claim is reproducible.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const NODE = process.execPath;
const FLAGS = ["--disable-warning=MODULE_TYPELESS_PACKAGE_JSON"];

function run(cmd, args, env = process.env) {
  execFileSync(cmd, args, { cwd: ROOT, stdio: "inherit", env });
}

function buildAndMeasure(out) {
  run("npm", ["run", "build"]);
  run(NODE, [...FLAGS, "scripts/measure-build.mjs"], { ...process.env, MEASURE_OUT: out });
}

/** The report minus the two fields that are different by design each run. */
function normalize(report) {
  const { measuredAt, buildId, ...rest } = report;
  return JSON.stringify(rest, null, 2);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "motif-determinism-"));
const first = path.join(tmp, "first.json");
const second = path.join(tmp, "second.json");

try {
  console.log("check-determinism: first build + measure …");
  buildAndMeasure(first);
  console.log("check-determinism: second build + measure …");
  buildAndMeasure(second);

  const a = normalize(JSON.parse(fs.readFileSync(first, "utf8")));
  const b = normalize(JSON.parse(fs.readFileSync(second, "utf8")));

  const al = a.split("\n");
  if (a !== b) {
    // Find the first differing line for a useful message.
    const bl = b.split("\n");
    const i = al.findIndex((line, n) => line !== bl[n]);
    console.error(`check-determinism: FAIL — the measured report differs between two identical builds.\n  first diff at line ${i + 1}:\n    build A: ${al[i]}\n    build B: ${bl[i]}`);
    process.exit(1);
  }
  console.log(`check-determinism: PASS — two builds measured identically (${al.length} compared lines after stripping measuredAt/buildId).`);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
