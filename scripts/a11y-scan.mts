#!/usr/bin/env node
// The markup accessibility pass, from the command line.
//
//   npm run check:a11y             # the built HTML on disk, no server needed
//   npm run check:a11y -- --served # every URL in the sitemap, over HTTP
//
// Same rules as /quality/aria and the export harness, because all three read
// src/lib/markup-a11y.ts. Node runs the TypeScript directly (type stripping),
// so there is no build step between the rule and the report.
//
// The two modes answer different questions. The disk scan covers every
// prerendered document and needs a build; the served scan covers the pages that
// are rendered on demand (component, prompt and template detail pages, the admin
// consoles) and needs a running server. Neither alone sees the whole site.

import path from "node:path";
import { scanBuiltHtml, scanServedSitemap, MARKUP_CHECKS, type MarkupScan } from "../src/lib/markup-a11y.ts";

const args = process.argv.slice(2);
const served = args.includes("--served");
const baseArg = args.find((a) => a.startsWith("--base="));
const base = baseArg ? baseArg.slice("--base=".length) : process.env.BASE || "http://127.0.0.1:3139";

const scan: MarkupScan = served
  ? await scanServedSitemap(base)
  : scanBuiltHtml(path.join(process.cwd(), ".next", "server", "app"));

console.log(`markup pass over ${scan.source}`);
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
