/**
 * Section 17's drift guard.
 *
 *   npm run check:demos                    # against http://127.0.0.1:3139
 *   BASE=https://example.com npm run check:demos
 *
 * A catalog entry and a demo implementation live in different files, and the
 * failure mode is quiet: the card renders the title, the frame mounts nothing,
 * and nobody notices until a reader does. This script keeps the two lists equal
 * in both directions — every catalog entry names a demo key that the registry
 * loads, and every key a scene module exports is claimed by an entry — and
 * checks that each new scene is reachable from the library, the embed route and
 * the catalog endpoint.
 *
 * The scenes used to be one file with a switch over the demo key. They are now
 * nine modules behind a loader map, so this reads the map instead of the cases
 * and, on top of the key list, verifies that each loader names a component its
 * target module actually exports. That is the failure the split could have
 * introduced silently: a key pointing at the right file but the wrong name.
 */

import fs from "node:fs";
import path from "node:path";

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
  { slug: "reading-dots", marker: "Reading progress", behaviors: ["scroll", "click", "keyboard"] },
  { slug: "pulse-graph", marker: "Cross-link graph", behaviors: ["hover", "click", "keyboard"] },
  { slug: "easing-icons", marker: "Easing, as icons", behaviors: ["click", "keyboard"] },
  { slug: "preloader-handoff", marker: "Preloader choreography", behaviors: ["click", "keyboard"] },
  { slug: "ripple-dots", marker: "Ripple nav dots", behaviors: ["click", "keyboard"] },
  { slug: "tilted-cta", marker: "Tilted hero CTA", behaviors: ["hover", "click", "keyboard"] },
  { slug: "success-burst", marker: "Success-state celebration", behaviors: ["click", "keyboard"] },
];

(async () => {
  console.log(`check-demos against ${base}\n`);

  const demo = fs.readFileSync("src/components/demos/Demo.tsx", "utf8");
  const keyBlock = demo.slice(demo.indexOf("export const DEMO_KEYS = ["), demo.indexOf("] as const;", demo.indexOf("export const DEMO_KEYS = [")));
  const keys = [...keyBlock.matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]);

  // The registry: `"<key>": () => import("./scenes/set-0N").then((m) => ({ default: m.Scene }))`
  // — or the same shape against "./scenes-17", which holds the section 17
  // scenes. Read line by line rather than with one wide regex: the escapes in
  // the latter are error-prone and its failure mode is silence.
  const loaderBlock = demo.slice(demo.indexOf("const SCENE_LOADERS"), demo.indexOf("\n};", demo.indexOf("const SCENE_LOADERS")));
  const loaders = new Map();
  for (const line of loaderBlock.split("\n")) {
    const key = (line.match(/"([a-z0-9-]+)":/) || [])[1];
    const target = (line.match(/import\("\.\/([^"]+)"\)/) || [])[1];
    const component = (line.match(/default: m\.([A-Za-z0-9_]+)/) || [])[1];
    if (key && target && component) loaders.set(key, { module: `src/components/demos/${target}.tsx`, component });
  }

  ok(
    "every demo key has a loader in the registry",
    keys.every((k) => loaders.has(k)),
    `${keys.length} keys, ${loaders.size} loaders`,
  );
  const staleKeys = [...loaders.keys()].filter((k) => !keys.includes(k));
  ok("no loader is missing from the key list", staleKeys.length === 0, staleKeys.join(", "));

  // A loader that names the wrong component in the right file throws at render
  // time and nowhere else, so the export is read out of the module here.
  const missingExports = [];
  const shippedScenes = new Map();
  for (const [key, { module: mod, component }] of loaders) {
    if (!fs.existsSync(mod)) {
      missingExports.push(`${key} → ${mod} does not exist`);
      continue;
    }
    const text = fs.readFileSync(mod, "utf8");
    if (!new RegExp(`export (?:function|const) ${component}\\b`).test(text)) missingExports.push(`${key} → ${component} not exported by ${mod}`);
    shippedScenes.set(key, component);
  }
  ok(
    "every loader names a component its module exports",
    missingExports.length === 0,
    missingExports.length ? missingExports.slice(0, 4).join(" | ") : `${loaders.size} loaders resolved`,
  );

  // The other direction: a scene component nothing loads is dead code, and a
  // component two keys both load is usually a copy-paste slip.
  const sceneModules = ["src/components/demos/scenes-17.tsx", ...fs.readdirSync("src/components/demos/scenes").filter((f) => f.endsWith(".tsx")).map((f) => `src/components/demos/scenes/${f}`)];
  const exported = new Map();
  for (const mod of sceneModules) {
    for (const m of fs.readFileSync(mod, "utf8").matchAll(/export (?:function|const) ([A-Za-z0-9_]+)/g)) {
      const owners = exported.get(m[1]) ?? [];
      owners.push(mod);
      exported.set(m[1], owners);
    }
  }
  const wanted = new Set(shippedScenes.values());
  // Components are PascalCase; the modules also export a few lowercase helpers
  // (useReducedMotion, the curve maths) for the pages that need the same
  // numbers, and those are not loader targets. So the scene assertion runs over
  // the component exports, and the helpers get their own check below: an export
  // nothing imports is dead code, which is the other thing this list can catch.
  const names = [...exported.keys()];
  const components = names.filter((n) => /^[A-Z]/.test(n));
  const helpers = names.filter((n) => !/^[A-Z]/.test(n));
  const unclaimed = components.filter((name) => !wanted.has(name));
  const duplicated = components.filter((name) => (exported.get(name) || []).length > 1);
  ok(
    "every scene component a module exports is named by a loader",
    unclaimed.length === 0 && duplicated.length === 0,
    `${components.length} scene components across ${sceneModules.length} modules, ${helpers.length} shared helpers${unclaimed.length ? ` · unclaimed: ${unclaimed.slice(0, 4).join(", ")}` : ""}${duplicated.length ? ` · in two modules: ${duplicated.join(", ")}` : ""}`,
  );

  const srcFiles = [];
  const walkSrc = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walkSrc(full);
      else if (/\.tsx?$/.test(entry.name)) srcFiles.push(full);
    }
  };
  walkSrc("src");
  const unusedHelpers = helpers.filter((name) => {
    const owners = new Set(exported.get(name) ?? []);
    return !srcFiles.some((file) => !owners.has(file) && new RegExp(`\\b${name}\\b`).test(fs.readFileSync(file, "utf8")));
  });
  ok(
    "every helper a scene module exports is imported somewhere",
    unusedHelpers.length === 0,
    `${helpers.length} helpers${unusedHelpers.length ? ` · unused: ${unusedHelpers.join(", ")}` : ` (${helpers.join(", ")})`}`,
  );

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
    if (!bullets) continue;
    // §12–§16 log shipped rows in the table instead of ticking bullets, so a
    // zero-tick section is skipped rather than flagged; everything that ticks
    // at least one bullet is checked against its own heading.
    if (!ticked) continue;
    const heading = sections[i + 1].split("\n")[0] || "";
    const frac = heading.match(/\((\d+)\/(\d+) shipped/);
    if (/complete/.test(heading)) {
      ok(`§${num} claims complete and has every bullet ticked`, bullets === ticked, `${ticked}/${bullets} ticked`);
    } else if (frac) {
      // An in-progress section states its own count; that count has to match the
      // bullets actually ticked, or the heading is the false claim this guard exists for.
      ok(
        `§${num}'s shipped count matches its ticked bullets`,
        Number(frac[1]) === ticked && Number(frac[2]) === bullets,
        `heading ${frac[1]}/${frac[2]}, ticked ${ticked}/${bullets}`,
      );
    }
  }
  const headline = Number((ledger.match(/## Progress — (\d+) \/ 500 shipped/) || [])[1]);
  const rows = (ledger.match(/^\| \d+ \|/gm) || []).length;
  // One early row (the upload progress ring) shipped outside the idea bank, so the
  // table is allowed to run ahead of the headline by the documented extras.
  const extras = Number((ledger.match(/ledger-extra-rows: (\d+)/) || [])[1] || 0);
  ok(
    "the ledger table matches its headline",
    rows === headline + extras && rows > 0,
    `table ${rows}, headline ${headline} + ${extras} extra`,
  );
  // Section 17 reads "in progress (n/25)" while it is open and "complete
  // (25/25 shipped)" once it closes, so both shapes have to count.
  const s17Head = (ledger.match(/^## 17\.[^\n]*$/m) || [])[0] || "";
  const shipped = /complete \(25\/25 shipped ✅\)/.test(s17Head)
    ? 25
    : Number((s17Head.match(/(\d+)\/25/) || [])[1] || 0);
  const s18Head = (ledger.match(/^## 18\.[^\n]*$/m) || [])[0] || "";
  ok(
    "Section 18 is closed before Section 19 opens",
    /complete \(10\/10 shipped ✅\)/.test(s18Head),
    s18Head.slice(0, 60),
  );
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
    // The chrome marker is the header/footer logo, not the words "Skip to
    // content": a demo is free to use that phrase in its own copy.
    ok(`/embed/${scene.slug} renders it without chrome`, embed.status === 200 && !embed.text.includes('id="mf-logo"'));
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
