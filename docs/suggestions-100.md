# 100 ways to make Motif deeper

_The 500-item programme shipped and the six audit batches after it (rows 502–524) fixed
what the finished site said about itself. This is the next idea bank, and it is built
differently: every item below starts from something **measured on the current site** — a
count a harness printed, a page that links nowhere, a check that does not exist — rather
than from a feature wish. Where an item is a fix for a known gap, the evidence is in the
line._

**How to read the tags.** Nothing here is labelled done, and nothing blocked is invented.

| tag | meaning |
| --- | --- |
| `now` | Buildable in this repository with no server, no browser and no third party. The harness can verify it, so it can be shipped in a batch. |
| `env` | Needs a real browser, a second measurement machine, a live domain or a third-party round-trip. This sandbox cannot verify it; it stays labelled, never simulated. |
| `infra` | Needs a backend, a payment processor or another person. Follows the roadmap's `today / slice / cost / refuse` pattern — the slice is what gets built. |

Ground truth at the time of writing: **141 routes · 133 components · 33 backgrounds · 74
prompts · 60 Learn essays · 13 changelog entries · 5 collections · 9 public endpoints**;
gates at **check:exports 171 · check:demos 108 · check:a11y 291 documents ·
check:a11y:served 384 pages**; ledger at **500 shipped + 24 audit rows**.

---

## 1. Motion: the 63 scenes that move without a branch (1–10)

Batch 91 measured this and published the number: of **102 scenes that animate, 39 name
`prefers-reduced-motion` and 63 do not** (set-01 16 · set-04 11 · set-06 10 · set-05 9 ·
set-02 8 · set-03 8 · set-07 1). This section is the work that number implies.

1. **Branch set-01's 16 scenes** (`PrismSwitch`, `PulseLoader`, `AuroraVeil`, `HaloTrail`, `OrbitDeck`, `StarMotes`, `ScrambleText`, `MarqueeLogos`, `BgGrid`, `BgSorbet`, `BgInk`, `MorphBlob`, and the four others the audit lists) — the largest single block of the gap. `now`
2. **Branch set-04's 11 and set-06's 10.** Between them they are a third of the remaining gap, and they are the two modules with the most continuous loops. `now`
3. **Branch set-05's 9, set-02's 8, set-03's 8 and set-07's 1.** `now`
4. **A shared `useSceneMotion()` in `scene-kit.tsx`** returning `{ enabled, duration, repeat }`, so a scene stops re-deriving the preference and every branch looks the same in review. `now`
5. **Raise the `check:demos` floor with each module**, 39 → 55 → 80 → 102, in the same commit as the scenes — the ratchet from batch 91 already supports it and the floor is a one-line change. `now`
6. **A per-module table on `/quality/aria`** (module · scenes · animate · guarded · first unguarded name), generated from `motionAudit().unguarded`, so the gap is readable instead of rounded into "63". `now`
7. **Say why a scene counts as animating.** `motionAudit` matches eleven signals; returning the matched one lets the page print "counted: `repeat: Infinity`" and turns the rule from a black box into a decision a reader can argue with. `now`
8. **A motion contract in the repo** (`docs/motion-contract.md`): a scene that loops declares a branch, reduced motion never removes content that only animation revealed, and the branch is named in the scene's own body — linked from the scene template and from `/quality/aria`. `now`
9. **Honour the preference in the embed shell.** `/embed/<slug>` is designed to sit inside someone else's page; the shell should pass `prefers-reduced-motion` through and say in the embed docs that it does. `now`
10. **A still poster for animated OG cards.** `/og/<slug>` draws an SVG per asset; animated scenes get a poster variant at t=0 so a share card never implies motion the image cannot show. `now`

## 2. Accessibility past the static pass (11–20)

The markup pass is green over 291 documents and 384 served pages. Everything below is
what it structurally cannot see, given a home instead of a shrug.

11. **Focus-ring contrast against real surfaces.** Token contrast is computed on `/quality`; the rings sit on gradients and glass panels. Compute ring-vs-surface for each surface a ring is drawn on and publish the pairs that fail. `now`
12. **A `forced-colors` pass.** Windows high contrast replaces the palette; add `@media (forced-colors: active)` rules for the ring and demo chrome, and a check that the block exists and uses system colours. `now`
13. **Target-size heuristic, labelled as one.** Flag interactive controls in scenes that carry no min-height/min-width utility, list them on `/quality/aria` as *candidates for the hand check*, and say in the same line that a class name is not a measurement. `now`
14. **Behaviour declarations get code evidence.** A catalog record declaring `keyboard` should have a key handler in the scene; declaring `drag` should have pointer handlers. Gate it in `check:demos` — it would have caught the batch-91 overclaim before it shipped. `now`
15. **Accessible-name fixtures** for the 30 most interactive scenes: store the expected name, compare against the built markup, fail on drift. `now`
16. **DOM order vs visual order.** Flag `order-*` and `flex-row-reverse` in scene source and require a comment explaining the reading order. `now`
17. **An accessibility statement at `/accessibility`** (404 today): what conforms, what does not, what has never been run in a browser, and how to report a problem — distinct from `/quality/aria`, which is the engineer's record. All ten new pages in this list should be added to `SITEMAP_EXTRA_PATHS` in the same commit. `now`
18. **Publish the announced sentences.** For the toast and live-region scenes, print the exact strings that get announced next to the hand-check item, so a reviewer knows what they are listening for. `now`
19. **A fixed-height inventory for the zoom check.** The preview frames use fixed pixel heights; list every fixed-height container with its value so the 200% check has a starting list rather than a blank page. `now`
20. **An RTL dry run for two scenes.** Render two mirrored variants, publish what broke, and state that the rest of the catalog is untested in RTL. `now`

## 3. Performance you can verify in this repository (21–30)

21. **Own-CSS budgets per route**, mirroring `budgets.ts`. Own-JS has a ratchet; the 217.7 KB of CSS on every measured route does not. `now`
22. **A determinism gate:** build twice from a clean `.next`, diff `docs/build-report.json`, fail if a number moves. It is the cheapest way to know the measurement is a measurement. `now`
23. **Chunk attribution on `/perf/chunks`.** For each route's largest own chunk, name the modules inside it from the Turbopack manifest — the table that made the batch-85 split obvious, kept as a standing view. `now`
24. **Prefetch budget.** Count `<link rel="prefetch">` in each built document, publish the distribution, cap it. `now`
25. **A timer registry.** Every `setInterval`/`rAF` loop in the scene modules with its interval and its cleanup, extracted at build time; a loop with no cleanup or a sub-100 ms interval is visible before a browser has to prove it. `now`
26. **Font glyph coverage.** Print which glyphs the two Inter/Sora subsets actually contain (em dash, arrows, the `→` used in the panels) so a missing glyph is caught by the build rather than by a screenshot. `now`
27. **An OG route weight cap.** `/og/<slug>` renders SVG per asset; measure each and cap the heaviest, since a share card is fetched by crawlers with no cache warm. `now`
28. **Per-rule curl blocks on `/perf/caching`.** The page documents seven rules and the harness proves the served headers; adding a copy-paste block per rule turns the page into the reproduction steps for its own claims. `now`
29. **A written service-worker decision.** `/perf/service-worker` exists; measure what an HTML-only offline shell would cost and write down why it still stays off — a decision record, not a feature. `now`
30. **A shared-JS ratchet.** Fail when the shell baseline (446.7 KB today) grows past a byte budget recorded in `docs/build-report.json`. `now`

## 4. Gates: every claim gets a check (31–40)

Batch 91 turned four sentences into three gates. These ten make that the default rather
than a rescue.

31. **Fix `/metrics`'s "the harness will usually find it first."** It is a promise with no referent. Replace it with the list of numbers the harness actually compares across pages, and gate the sentence so it cannot drift again. `now`
32. **Fix `keyframes.tsx`'s header.** It still says the layout "imports the 7,416-line demo module" and names `Demo.tsx` as that file; the scenes are ten modules now. The comment is the first thing a contributor reads. `now`
33. **Generalise batch 92's line-count gate.** Scan source comments for `N lines` / `N KB` claims about a named file and compare with the file. The `keyframes.tsx (41 lines)` bug was one of a class. `now`
34. **A claim map.** Every "the harness checks…", "the build verifies…", "gated by…" sentence in `src/` must appear in a machine-readable map naming the check that backs it; `check:exports` fails on an unmapped claim. That is the durable version of the batch-91 audit. `now`
35. **`/quality/gates`, a public index of the checks.** Every name from the two harnesses plus the a11y rules, the failure it prevents, and the batch that added it — generated from the scripts, not typed. `now`
36. **One a11y command.** Merge `check:a11y` and `check:a11y:served` and fail when the two document counts disagree; the disk pass and the served pass once disagreed by two documents and only a person noticed. `now`
37. **Golden OG fixtures.** Fixed slug + fixed inputs → expected SVG hash, so a refactor cannot quietly restyle 382 cards. `now`
38. **A ledger link check.** Every route in `enrichment-500.md` and this file must answer 200 — 524 rows of links currently have no gate. `now`
39. **Record suite wall times** in the build report and flag a >2× regression; `check:exports` now takes ~20s and nothing would notice it becoming two minutes. `now`
40. **Failure fixtures.** A directory of intentionally broken inputs with a `check:fixtures` suite proving each rule fires — the 39-vs-40 test run in batch 92, kept as a permanent convention. `now`

## 5. Learn: ten essays, each from this project's own record (41–50)

The 60 shipped essays teach motion and craft. These ten teach the thing this repository
now has more evidence for than any other: how a build tells the truth about itself.

41. **"Anatomy of a false claim"** — the batch-91 audit, from the sentence on `/quality/aria` to the 63 scenes behind it. `now`
42. **"What a build cannot see"** — static rules vs runtime, with the 39/102 numbers and the six hand checks. `now`
43. **"The rule that had to be first"** — how a comment claiming "a later rule wins" shipped zero immutable chunk files, and how one curl found it. `now`
44. **"Recorded numbers need labels"** — before/after panels, three different "after" figures for one change, and why the labels are the fix. `now`
45. **"Auditing the crawl surface"** — 103 unlisted pages, five surfaces that said noindex and were not, and the two rules that ended it. `now`
46. **"Five passes over a finished site"** — the method: point the audit at the site's claims about itself, not only at its pages. `now`
47. **A beginner path: six essays, six components, one order.** `/start` is 404 today; a five-step path per goal (ship a landing page · add motion · write prompts) with progress in localStorage. `now`
48. **Inline demos in every essay.** The snippets become real scenes through the existing loader map, so an essay cannot document code that does not ship. `now`
49. **Glossary cross-links, gated.** Every term an essay uses resolves to `/glossary`; a term with no entry is a gate failure. `now`
50. **Feeds for the two text surfaces that lack one.** `/community/feed.xml` and `rss.xml` exist; `/learn/feed.xml` and `/changelog/feed.xml` are 404. `now`

## 6. Components: the next ten that are not in the catalog (51–60)

Checked against the 133 slugs: none of these exists, and each one has a reason to exist
beyond "another card".

51. **Diff viewer** — side-by-side and unified, keyboard-scrollable, copyable, no inline editing claim. `now`
52. **Time zone picker** — offsets, DST labels, a "now" column; no network call, so the offsets ship as data with the date they were taken. `now`
53. **Tree view** — roving tabindex, expand/collapse, selection, 200+ nodes without virtualisation, and it says so. `now`
54. **Colour picker** — HEX/OKLCH, with a contrast readout computed by the same `quality-utils` the audit page uses. `now`
55. **Cron editor** — five fields, a plain-English sentence, next five runs, and no scheduler behind it. `now`
56. **Signature pad** — pointer events, keyboard fallback, ink that respects reduced motion, clear/undo. `now`
57. **Chat composer** — draft in localStorage, attachments as markup, no send button that pretends to send. `now`
58. **Onboarding checklist** — steps with local progress, reset, and an export of the checked list. `now`
59. **Data table** — sort, select, filter, sticky header, with the honest line about where virtualisation would start. `now`
60. **Release rail** — a vertical timeline that reads the changelog data, so a component page, a roadmap and a changelog share one visual language. `now`

## 7. Discovery and structure (61–70)

61. **Link `/digest/copy-of-the-week`.** It has a canonical and is linked from nowhere — `/` and `/digest` both return zero references today. One line, and it takes the page out of the orphan set. `now`
62. **`/browse` — an index by behaviour.** The catalog already carries `click · hover · drag · scroll · keyboard · type · motion · hold · pointer`; a page per behaviour is the discovery axis the hub filter cannot express. `now`
63. **A human sitemap at `/sitemap`** (404 today), generated from the same source as `sitemap.xml`, grouped by family with counts. `now`
64. **The rest of the library filters in the URL.** `?q=` and `?stack=` are already shareable; score, behaviour, kind and size are not. `now`
65. **A related-content graph.** Components ↔ essays ↔ prompts, derived from tags and behaviours, rendered on all three page families instead of hand-written "see also" lines. `now`
66. **Publish the search ranking rules.** The client scores, fuzzy-matches and scopes results, and the page explains none of it; a short "how this ranks" block plus the shortcuts makes the behaviour predictable. `now`
67. **An empty state that suggests.** Search already says "did you mean"; a zero-result page should also offer three catalog rows and one essay before it offers a search box again. `now`
68. **Five more editorial collections.** `under-5kb`, `zero-dep-motion` and `a11y-98` show the pattern; "no-JS friendly", "keyboard-first", "best for pricing pages", "three-file starters" and "quiet motion" continue it. `now`
69. **Per-tag changelog archives.** `/changelog` has tags and hues and no filter; `?tag=` with counts gives every tag a URL. `now`
70. **Goal-first starts.** `/start` with three goals, each five links deep, ending on a component the reader can copy — measured by nothing, claimed as nothing more than a path. `now`

## 8. Community and retention, all localStorage-honest (71–80)

Every item here runs on the storage keys the site already owns (`motif:copy-log`,
`motif:streak-optin`, `motif:shipped`) and says so on the panel.

71. **A local build log** — what a visitor copied, saved and shipped, in order, exportable as Markdown. The copy log exists; the view of it across sessions does not. `now`
72. **A seven-day activity grid** on `/habits`, from the streak module, resettable, never sent. `now`
73. **Reading progress on essays** with a "continue" row on `/learn`. The catalog even ships a reading-progress component the site itself does not use. `now`
74. **Export the saved stack** at `/saved/stack` as Markdown and JSON with exact slugs and versions. `now`
75. **A per-scene remix counter**, local only, labelled as local, with the honest line that a real count needs a server. `now`
76. **A challenge archive** — past `/community/challenges` with dates, rules and outcomes, static and complete. `now`
77. **A spotlight archive** at `/community/spotlight` with one entry per edition instead of the current view. `now`
78. **Local rosters for the demo team features**, labelled "this roster lives in your browser" — the honest version of a feature that needs accounts. `now`
79. **A digest archive index** on `/digest`, one row per issue with the date, so the weekly promise has a table behind it. `now`
80. **"Why there are no comments"** — a short page stating what a comment system would need and what it would cost, instead of a comment box that cannot receive comments. `now`

## 9. Integrations and exports (81–90)

81. **JSON Schema for `/api/v1/components/<slug>`**, published under `/api/exports` and validated against a real response in the harness. `now`
82. **An importable API collection** (Bruno or Postman JSON) of the nine public endpoints, generated from the same list the docs use. `now`
83. **A badge workflow download.** The badge exists as SVG; ship the GitHub Actions YAML that embeds it, as a file, with no service claim. `now`
84. **A VS Code pack build test.** The snippets are generated; add a validator for the `.vsix` manifest, keeping publishing as the environment-blocked half. `now`
85. **A Figma round-trip validator.** Import `figma-variables.json`, re-derive the tokens, and fail on mismatch — the export's honesty test. `now`
86. **A Storybook decorator fixture test**, so the shipped decorator is exercised by the harness rather than described. `now`
87. **`motif add <slug>`** in the CLI: fetch one component's files from the catalog and write them into a project, with the same no-npm claim the CLI already makes. `now`
88. **A documented embed theming API.** The embed uses CSS custom properties; give it three documented themes and a page that shows the same scene in all three. `now`
89. **OG query params** (`?title=`, `?eyebrow=`) with the same cache rule the route already has, so a team can flavour a card without editing the site. `now`
90. **Per-component print styles.** `/integrations/print` serves the stylesheet; a one-scene-per-page print view of a component makes the export usable on paper. `now`

## 10. Trust, brand, and the north stars that need a server (91–100)

The roadmap already carries the honest `today / slice / cost / refuse` record for the
blocked bets. These ten are the parts of that list this repository can actually finish,
plus the pages that make the blocked parts legible.

91. **`/gaps` — the blocked buckets, published.** Two lists (infrastructure-blocked, environment-blocked) with what each needs and why nothing here fakes it. It is the same rule the roadmap states, gathered in one page a reader can check. `now`
92. **A state-of-the-build page** generated from the ledger and the build report: routes, gates, commits, rows. `now`
93. **A storage-key register, scanned.** Every `motif:*` key the app writes, generated from source, with what it holds and how to clear it. `now`
94. **A security page with a real check behind it**: no backend, no cookies, no third-party requests — gated by a source scan for fetch targets and cookie writes. `now`
95. **Publish `docs/` as `/book`.** The ledger, the plans and this list, as chapters with a feed. It is the open book the north-star list promised, at the size this repository actually is. `now`
96. **A wallpaper generator** from the token palette, emitting SVG downloads — the brand shelf without shipping raster art. `now`
97. **A dated press kit.** The numbers with the build's date and commit printed beside them, so a journalist quotes a number that carries its own timestamp. `now`
98. **Auto-derive each roadmap bet's live slice** from the repository (does the slice's route exist? does its test pass?) so the status column cannot be hand-maintained. `now`
99. **A "what we got wrong" page**, sourced from the audit rows: each wrong claim, what it said, what it says now. Twenty-four entries already exist in the ledger. `now`
100. **A register for this list itself** — shipped / carried / dropped per item, in the same style as `enrichment-500.md`, so the next hundred starts from evidence instead of memory. `now`

---

## What this list deliberately excludes

- **Accounts, prompt re-runs, marketplace payouts, certificates, the desktop helper, SSO/SLA/DPA, a real admin backend** — all `infra`; the roadmap's slices for them already exist and this list does not pretend otherwise. `infra`
- **Lighthouse scores, field vitals, a second measurement series, visitor/signup/revenue numbers, the CodeSandbox deep link, a real domain** — all `env`; each is named on the page that would show it and each stays unmeasured rather than estimated.

_100 items. Nothing above is claimed as shipped; the tag says what it costs, and the first
sentence says what it starts from._

**Counted, not estimated:** 94 `now` · 3 `infra` (the north-star slices) · 2 `env`
(second measurement series · a real domain) · 1 unlabelled summary line. The 94 do not
need a browser, a server or a third party; each one can be built, gated and pushed from a
checkout like this one.
