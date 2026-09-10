/**
 * Section 17's drift guard.
 *
 *   npm run check:demos                    # against http://127.0.0.1:3139
 *   BASE=https://example.com npm run check:demos
 *
 * A catalog entry and a demo implementation live in different files, and the
 * failure mode is quiet: the card renders the title, the frame mounts nothing,
 * and nobody notices until a reader does. This script keeps the two lists
 * equal in both directions — every entry has a case in the demo switch, and
 * every case has an entry that claims it — and checks that each new scene is
 * reachable from the library, the embed route and the catalog endpoint.
 */

const fs = require("node:fs");

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
  return { status: res.status, text: await res.text() };
};

/** The scenes these batches added, kept explicit: a silently empty grid entry
 *  is exactly what the rest of this file is trying to catch. `section` says
 *  which section counts the entry in its own header — slug-field belongs to
 *  Section 1 (it was the bullet that section had never shipped), so it is
 *  verified here without being counted against Section 17. */
const NEW_SCENES = [
  { slug: "reorder-list", marker: "Release checklist", behaviors: ["drag", "keyboard"] },
  { slug: "swipe-deck", marker: "Review deck", behaviors: ["drag", "click", "keyboard"] },
  { slug: "split-pane", marker: "Layer inspector", behaviors: ["drag", "keyboard"] },
  { slug: "zoom-lens", marker: "District map", behaviors: ["hover", "keyboard"] },
  { slug: "chart-scrubber", marker: "Prompt fidelity", behaviors: ["drag", "keyboard"] },
  { slug: "scroll-pin", marker: "Three-step story", behaviors: ["scroll", "click", "keyboard"] },
  { slug: "flip-stack", marker: "Layered deck", behaviors: ["hover", "click", "keyboard"] },
  { slug: "draw-path", marker: "Signature curve", behaviors: ["scroll", "click"] },
  { slug: "morph-icons", marker: "Morphing icons", behaviors: ["click", "keyboard"] },
  { slug: "logo-chase", marker: "Roster chase", behaviors: ["hover", "click"] },
  { slug: "shimmer-text", marker: "One-pass shimmer", behaviors: ["scroll"] },
  { slug: "ring-ticks", marker: "Audit ring", behaviors: ["click"] },
  { slug: "bezier-drawer", marker: "Cubic-bezier drawer", behaviors: ["drag", "keyboard"] },
  { slug: "counter-band", marker: "Counters, in a row", behaviors: ["click", "scroll"] },
  { slug: "linked-cards", marker: "Hover-linked cards", behaviors: ["hover", "keyboard"] },
  { slug: "slug-field", marker: "Slug field", behaviors: ["type", "click", "keyboard"], section: 1 },
  { slug: "share-sheet", marker: "Share sheet", behaviors: ["click", "keyboard"] },
  { slug: "theme-drop", marker: "Drop a theme on a card", behaviors: ["drag", "click", "keyboard"] },
  { slug: "search-walk", marker: "Search inside a guide", behaviors: ["type", "keyboard"] },
];

(async () => {
  console.log(`check-demos against ${base}\n`);

  const demo = fs.readFileSync("src/components/demos/Demo.tsx", "utf8");
  const keyBlock = demo.slice(demo.indexOf("export const DEMO_KEYS = ["), demo.indexOf("] as const;", demo.indexOf("export const DEMO_KEYS = [")));
  const keys = [...keyBlock.matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]);
  const cases = [...demo.matchAll(/case "([a-z0-9-]+)": return/g)].map((m) => m[1]);

  ok("the demo switch has a case for every key", keys.every((k) => cases.includes(k)), `${keys.length} keys, ${cases.length} cases`);
  ok("no case is missing from the key list", cases.every((c) => keys.includes(c)), cases.filter((c) => !keys.includes(c)).join(", "));

  const catalog = JSON.parse((await get("/api/exports/catalog.json")).text);
  // Components and backgrounds both ship scenes, so the guard has to look at
  // the whole catalog before calling a switch case an orphan.
  const assets = [...catalog.components, ...catalog.backgrounds];
  const scenes = assets.filter((c) => keys.includes(c.demo)).map((c) => c.demo);

  ok("every catalog entry names a demo that exists", assets.every((c) => keys.includes(c.demo)), assets.filter((c) => !keys.includes(c.demo)).map((c) => c.slug).join(", "));
  const orphans = keys.filter((k) => !scenes.includes(k));
  ok("every demo in the switch is claimed by an entry", orphans.length === 0, orphans.join(", "));

  const ledger = fs.readFileSync("docs/enrichment-500.md", "utf8");

  // A section header that says "complete" while one of its bullets is still
  // unticked is the quietest kind of false claim in this file, and it happened
  // once: §1 read 70/70 while the slug field had never been built. This checks
  // every hand-ticked section against its own header.
  const sections = ledger.split(/\n## (\d+)\. /).slice(1);
  for (let i = 0; i < sections.length; i += 2) {
    const [num, body] = [sections[i], sections[i + 1].split("\n## ")[0]];
    const bullets = (body.match(/^- \*\*/gm) || []).length;
    const ticked = (body.match(/^- \*\*.*✅/gm) || []).length;
    if (!bullets || !ticked) continue; // sections that record shipped rows instead
    ok(`§${num} claims complete and has every bullet ticked`, bullets === ticked, `${ticked}/${bullets} ticked`);
  }
  const headline = Number((ledger.match(/## Progress — (\d+) \/ 500 shipped/) || [])[1]);
  const rows = (ledger.match(/^\| \d+ \|/gm) || []).length;
  ok("the ledger table matches its headline", rows === headline && rows > 0, `table ${rows}, headline ${headline}`);
  const shipped = Number((ledger.match(/Section 17 in progress \((\d+)\/25\)/) || [])[1] || 0);
  const inSection17 = NEW_SCENES.filter((s) => s.section !== 1).length;
  ok(
    "the ledger's Section 17 count matches the scenes verified here",
    shipped === inSection17,
    `ledger ${shipped}, checked ${inSection17} of ${NEW_SCENES.length} (slug-field counts against Section 1)`,
  );

  for (const scene of NEW_SCENES) {
    const page = await get(`/components/${scene.slug}`);
    ok(`/components/${scene.slug} renders the scene`, page.status === 200 && page.text.includes(scene.marker), String(page.status));
    const embed = await get(`/embed/${scene.slug}`);
    ok(`/embed/${scene.slug} renders it without chrome`, embed.status === 200 && !embed.text.includes("Skip to content"));
  }

  // The counter band is the one scene whose content is a number, so it has to
  // survive having no script: the HTML must carry the real total, not a zero.
  const band = await get("/components/counter-band");
  const catalogTotal = catalog.components.length;
  ok("counter band prints the real totals without JavaScript", band.text.includes(catalogTotal.toLocaleString("en-US")) && band.text.includes("135,020"), `expected ${catalogTotal}`);

  const hub = await get("/components");
  ok("the library lists every scene this guard knows about", hub.status === 200 && NEW_SCENES.every((s) => hub.text.includes(s.slug)));
  ok("the catalog endpoint carries them too", NEW_SCENES.every((s) => catalog.components.some((c) => c.slug === s.slug)));
  ok("the catalog carries the backgrounds as well", catalog.backgrounds.length > 0 && catalog.$generated.backgrounds === catalog.backgrounds.length, String(catalog.backgrounds.length));
  for (const scene of NEW_SCENES) {
    const entry = catalog.components.find((c) => c.slug === scene.slug);
    ok(
      `${scene.slug} declares the behaviour it ships`,
      Boolean(entry) && scene.behaviors.every((b) => entry.behaviors.includes(b)),
      entry ? entry.behaviors.join("+") : "missing",
    );
  }

  console.log(`\n${fail === 0 ? "ALL PASS" : "FAILURES"} — ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
