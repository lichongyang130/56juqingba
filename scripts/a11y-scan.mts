#!/usr/bin/env node
// The markup accessibility pass, from the command line.
//
//   npm run check:a11y          # exit 1 on any finding
//
// Same rules as /quality/aria and the export harness, because all three read
// src/lib/markup-a11y.ts. Node runs the TypeScript directly (type stripping),
// so there is no build step between the rule and the report.
//
// Run it after `npm run build`: it reads the built HTML, not the running site.

import path from "node:path";
import { scanBuiltHtml, MARKUP_CHECKS } from "../src/lib/markup-a11y.ts";

const root = path.join(process.cwd(), ".next", "server", "app");
const scan = scanBuiltHtml(root);

console.log(`markup pass over ${root}`);
console.log(`  page documents: ${scan.documents}`);
console.log(`  Next fallback documents skipped: ${scan.fallbacks.length}`);
for (const f of scan.fallbacks) console.log(`    ${f.file} — ${f.why}`);
console.log("  rules and counts:");
for (const c of MARKUP_CHECKS) console.log(`    ${String(scan.byKind[c.id] ?? 0).padStart(4)}  ${c.id}`);

if (scan.issues.length) {
  console.log(`\n${scan.issues.length} findings:`);
  for (const i of scan.issues.slice(0, 40)) console.log(`  ${i.kind}  ${i.page}  ${i.detail}`);
  if (scan.issues.length > 40) console.log(`  … and ${scan.issues.length - 40} more`);
  process.exit(1);
}
console.log("\nno findings");
