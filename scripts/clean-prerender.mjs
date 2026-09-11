#!/usr/bin/env node
// Runs before `next build` (npm's prebuild hook).
//
// Next writes prerendered output into .next/server/app but does not clear the
// directory first, so a page that stops existing keeps its HTML: the changelog
// slug for a title that was rewritten in a later batch was still on disk, still
// counted by the measurement, and still reported as a missing-lang finding by
// the markup pass. Every number derived from "the built site" was therefore
// derived from this build plus parts of older ones.
//
// Deleting the prerender output makes the directory mean one thing: what this
// build wrote. The webpack and font caches live in .next/cache and are kept, so
// the next build is not a cold one.

import fs from "node:fs";
import path from "node:path";

const target = path.join(process.cwd(), ".next", "server", "app");

const countFiles = (dir) => {
  let n = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    n += entry.isDirectory() ? countFiles(full) : 1;
  }
  return n;
};

if (!fs.existsSync(target)) {
  console.log("clean-prerender: nothing to clean (.next/server/app does not exist yet)");
  process.exit(0);
}

const removed = countFiles(target);
fs.rmSync(target, { recursive: true, force: true });
console.log(`clean-prerender: removed .next/server/app (${removed} files from earlier builds)`);
