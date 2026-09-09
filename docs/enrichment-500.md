# 500 ways to make Motif richer

_A living idea bank for Motif UI — every item is original, specific and intended to be
actionable against the current site (as of 2026-09: 39 components · 24 prompts ·
10 Learn essays · 8 backgrounds · 8 lab tools · a /search hub · a persistent admin)._

How to read this: pick any section, take the three ideas that make you say "that
would be fun to build", and ship them as a batch. Ideas are deliberately concrete —
names, behaviours and where they plug into the existing pages.

---

## 1. Component library — 70 new assets to build (currently 39)

### Form & input elements
- **Combo box**: text input with a live-filtered option list, keyboard navigation and a "no matches" row — slots into every filter on the site.
- **Odometer counter**: rolling digit wheels for numbers (price tickers, followers) — complements the existing count-up scenes with mechanical charm.
- **Star rating input**: five-star interactive picker with half-star precision and a clear-selection reset.
- **Tag input**: type a word, press Enter, it becomes a chip; backspace removes the last chip (like the admin quick-add but reusable).
- **Slider with live ticks**: range slider that shows min/max labels and a floating value bubble while dragging.
- **Checkbox card**: an entire option card that is selectable, with checkmark that draws in — for pricing/plan pickers.
- **Quantity stepper**: − / + stepper with long-press repeat, used by cart rows and ticket seats.
- **Radio pills with focus ring**: keyboard-first segmented radios that announce the checked option.
- **Textarea auto-grow**: a textarea that expands as you type with a subtle char budget meter.
- **Date presets picker**: Today / 7d / 30d / custom pill row for dashboards.
- **File drop zone**: drag-and-drop surface with a dash-bordered highlight state and fake progress.
- **Toggle with label stack**: themeable iOS-style switch that ships with a labels-and-description row.
- **Password strength meter**: input that grades a passphrase with animated segments.
- **Button with embedded menu**: a primary button whose right half opens a dropdown of secondary actions.
- **Slug input transform**: writes a URL slug live from a title field (title → kebab-case) — perfect for prompt pages.

### Navigation & layout atoms
- **Command palette**: ⌘K overlay that searches library, prompts, guides and admin routes in one fuzzy list.
- **Breadcrumb trail**: separator-aware breadcrumbs with a collapsing "…" on mobile.
- **Pagination with ellipsis**: page buttons that compress to "… 8 9 10" and keep the active page centred.
- **Table of contents spine**: sticky right rail that highlights the section in view and smooth-scrolls.
- **Tabs with indicator**: animated underline/slide that follows the active tab width.
- **Sticky section nav (sub-nav)**: second-row tabs that pin under the header on long docs.
- **Back-to-top comet**: a floating action that appears after 2 viewports and eases you up.
- **Disclosure list (accordion rows)**: FAQ rows with plus→minus rotation, one-open-at-a-time mode.
- **Fullscreen overlay menu**: a tasteful takeover nav with staggered link entrance.

### Feedback, status & loaders
- **Skeleton profile card**: shimmering placeholders for avatars + lines, then content swaps in.
- **Toast queue**: stacked notifications that enter right, auto-dismiss with timer bars, support undo actions.
- **Inline status banner**: success/error/info/warn banners that announce to screen readers and can be dismissed.
- **Spinner with status text**: loader that swaps label ("Saving… → Saved ✓") without layout shift.
- **Empty-state trio**: the Learn essay pattern as three copyable cards (illustration, verb headline, escape hatch).
- **Offline indicator**: a banner that appears on `online/offline` events with a reconnect pulse.
- **Error boundary card**: friendly fallback with "reload" and "copy error" actions.
- **Confetti burst**: a tasteful celebratory burst (toggled, never autoplay) for "shipped!" moments.
- **Dot leader loading**: terminal-style "installing…" with animated dots for CLI-adjacent pages.
- **Live region demo**: a hidden-but-announced status that shows how to update screen readers politely.

### Animated signature pieces
- **Liquid button hover**: a filled blob that wipes across on hover (already teased in guides — make it an asset).
- **Magnetic icon row**: social icons that lean toward the cursor within a radius.
- **Scroll-linked hue hero**: a section whose background hue shifts as you scroll (port the admin nav idea to a demo).
- **Staggered list entrance**: rows that fade-slide in sequence when scrolled into view (reusable for indexes).
- **Shuffle/ken-burns gallery**: background images that slowly zoom-pan between frames.
- **Particle trail hero**: pointer-following sparkles with a perf tier toggle.
- **Ink-stamp appear**: a title that appears with a quick scale+rotate "stamp" easing.
- **Gradient border flow**: border that slowly rotates hue around a card (used sparingly on promo cards).
- **Ripple reveal**: click-anywhere ripple on cards/buttons.
- **Parallax layered scene**: two-layer mouse parallax with disabled fallback for touch.
- **Scroll vignette**: page edges darken as you scroll long content (reading-mode cue).
- **Word-by-word highlight**: headline words brighten in sequence as a script "reads" them.
- **Shake-on-error field**: the classic inline validation shake, kept subtle and reduced-motion-aware.

### Sections
- **Bento feature grid**: asymmetric feature tiles with an interactive centrepiece.
- **Logo wall with hover pop**: sponsor logos that lift and colourise on hover.
- **Testimonial marquee row**: the classic dual-row counter-scroll, pausable on hover.
- **Pricing table (three plans)**: feature comparison with a "most popular" glow and toggle.
- **Stats band**: headline metrics with odometer counts and per-stat footnotes.
- **Team grid with roles filter**: filterable people grid (port the spotlight cursor in as an option).
- **FAQ two-column**: question list left, answer panel right with animated swap.
- **Comparison slider (before/after)**: draggable divider over two visuals.
- **Timeline (vertical)**: milestone rail with alternating cards and scroll reveal.
- **Newsletter band with tiers**: email capture with frequency choice pills ("weekly digest / launch only").
- **Hero with product mock frame**: a browser-chrome frame containing a mini UI — the classic dev-tool hero.
- **Split feature rows**: image/text alternating rows with scroll-fade and hover zoom on image.
- **Case-study header**: client, role, year, stack as a labelled grid under a big title.
- **Changelog feed**: the home "Ship log" pattern extracted as a reusable section with version chips.
- **Resource/download cards**: card rows with format badges (PDF, ZIP, Figma) and size.
- **Event schedule list**: date-sticky list with session cards — useful as a Motif template.
- **Map-free local band**: "offices/where we work" cards without an embedded map (perf-friendly).
- **App screenshot tour**: sticky phone frame whose screen swaps with captions.

### Templates (whole pages)
- **Docs site template**: sidebar TOC + content + prev/next footer, assembled from library sections.
- **Landing page template (dark SaaS)**: hero + logos + features + pricing + FAQ + CTA.
- **Waitlist template**: hero with countdown and referral-style invite box.
- **Changelog/journal template**: date index pages for release notes and essays.
- **Template gallery page**: filters + preview tiles + "use this" actions.

---

## 2. Backgrounds & textures — 25 additions (currently 8)

- **Topographic contour lines**: SVG contour map motif with quiet animated flow.
- **Blueprint grid**: engineering-paper grid with crosshairs for architecture/atelier vibes.
- **Confetti field**: slow-falling confetti with two perf tiers (DOM vs. gradient trick).
- **Bokeh depth field**: large blurred circles drifting at different speeds/layers.
- **Glass shards**: angled translucent panes that catch light as they float.
- **Lava lamp blobs**: two slow-morphing colour blobs on a dark base (echoes the moderation card).
- **Paper grain close-up**: heavy photographic grain for editorial/print sections.
- **Silk wave**: layered sine waves in brand hues with hue-shift over time.
- **Star field with parallax**: three depth layers of stars responding to scroll.
- **Scanline CRT**: subtle scanlines + vignette for retro/terminal aesthetics.
- **Liquid gradient mesh**: a slow-moving mesh gradient with `background-position` animation.
- **Dot matrix pattern**: themeable halftone dots with size/opacity controls.
- **Brushed metal sheen**: subtle diagonal light streaks for premium product pages.
- **Carbon fibre weave**: quiet repeating weave for dashboards/tech.
- **Water ripple ring**: expanding rings from a point (hero accent, mouse-triggered).
- **Ink on wet paper**: a soft radial ink bloom that pulses gently.
- **Aurora band**: horizontal aurora ribbons instead of the current radial version.
- **Noise storm**: animated TV-static grain at 3–5% opacity with a flicker toggle.
- **Glass distortion**: a real backdrop-blur refraction demo on a moving photo layer.
- **Ember rise**: tiny rising embers for fireplace/retro vibes.
- **Checkerboard fade**: an engineering checker that fades to transparent diagonally.
- **Plaid weave**: warm plaid texture for lifestyle brands.
- **Halftone burst**: radial halftone from a focal point for poster moments.
- **Cloud layer drift**: soft translucent cloud bands drifting horizontally.
- **Sunset horizon strip**: a two-stop gradient with a light-source dot that drifts.

---

## 3. Prompt library — 50 next prompts across industries (currently 24)

### Growth industries
- **SaaS onboarding flow prompt**: signup → plan → invite → success, in one prompt.
- **Dev-tool API reference prompt**: docs site with request/response cards and try-it pane.
- **Crypto/fintech dashboard prompt**: data-dense but calm, candlestick-free chart honesty.
- **Creator newsletter landing prompt**: subscribe wall with archive proof.
- **Web3 marketplace prompt**: collection grid + mint steps, restrained glow.

### Retail & commerce
- **Perfume house prompt**: scent-notes accordion, editorial full-bleed.
- **Watch atelier prompt**: precision macro shots, movement cutaway diagrams.
- **Flower studio prompt**: seasonal bouquets with a same-day delivery band.
- **Furniture maker prompt**: joinery close-ups, finish swatches, lead-time honesty.
- **Streetwear capsule prompt**: drop calendar, size-run honesty, lookbook marquee.
- **Skincare clinic prompt**: treatments menu with practitioner names.
- **Coffee roaster prompt**: origin map, roast-level meter, brew guides.

### Hospitality & local
- **Boutique hotel prompt**: room gallery with real-amenity chips.
- **Craft brewery taproom prompt**: tap list with ABV meter and food-pairing rows.
- **Bike shop prompt**: service tiers with turnaround honesty.
- **Yoga studio prompt**: class schedule with teacher bios and first-class invite.
- **Dog-walking service prompt**: GPS-route visuals, insured badges, sitter faces.
- **Bookshop café prompt**: staff picks shelf and events calendar.

### Professional services
- **Accounting firm prompt**: services explained in plain language with fee cards.
- **Recruiting studio prompt**: open roles, culture evidence, referral promise.
- **Industrial design firm prompt**: process photos, material library, ISO mentions.
- **Coaching practice prompt**: outcome stories, method steps, session formats.
- **Translation agency prompt**: language pairs, quality checks, quote form.
- **Interior design studio prompt**: before/after slider, style quiz teaser.
- **Financial advisor prompt**: fiduciary language, fee schedule, meeting booking.

### Media, arts & events
- **Literary agency prompt**: submissions policy, authors list, representation FAQ.
- **Record label prompt**: release calendar, artist roster cards, press kit section.
- **Community theatre prompt**: season lineup, ticket tiers, volunteer call.
- **Design conference prompt**: speaker grid, schedule by track, travel tips.
- **Food hall prompt**: vendor map, dietary icons, opening hours.
- **Birding club prompt**: sighting log, field-guide resources, trip signups.
- **Photography workshop prompt**: curriculum, dates, portfolio expectations.

### Technology & maker
- **Open-source project prompt**: README-as-website with good-first-issue links.
- **Game jam team prompt**: tools, roles, weekend timeline.
- **AI tool directory prompt**: curated list with "tested" badges like Motif's own.
- **Civic tech project prompt**: transparency metrics, city-partner logos.
- **Robotics lab prompt**: research highlights, video lab notes.

### Health, education & lifestyle
- **Counselling directory prompt**: therapist cards by specialism with availability.
- **Nutrition coaching prompt**: sample week, no-shame copy, cancellation policy.
- **Language school prompt**: level paths, teacher accents map, trial lesson.
- **Kids' coding club prompt**: term calendar, parent FAQ, showcase projects.
- **Ceramics studio prompt**: kiln-schedule, class tiers, gallery of student work.
- **Plant nursery prompt**: care guides per species, delivery windows.
- **Slow-travel agency prompt**: itineraries, local-host notes, carbon honesty.

### Prompt-form experiments (any industry)
- **Dark-mode-first prompt variant**: same brief, delivered for dark surfaces.
- **Whitespace-maximal prompt**: ≤ 3 colours, one typeface, no gradients.
- **Print-inspired web prompt**: editorial layout that works like a magazine spread.
- **A11y-strict prompt**: WCAG AA as a hard requirement list in the brief.
- **Multi-language prompt**: the same page brief in three languages with i18n notes.
- **Motion-spec prompt**: a prompt that *only* ships the animation spec, no layout.


---

## 4. Learn — 50 more essays & formats (currently 10)

### Motion & animation theory
- **Easing cheatsheet deep-dive**: compare the 8 named curves side-by-side with the Lab embeds.
- **Springs are not easings**: when to reach for spring physics instead of cubic-bezier.
- **The choreography question**: is this motion telling the story or decorating it?
- **Micro-interactions that pay rent**: 20 tiny motions with a measurable UX job.
- **Will-change is a promise**: when it helps, when it leaks memory, how to clean up.
- **Why 60fps feels like 24fps**: perceived smoothness, frame pacing and jank perception.
- **Animating on the GPU without asking**: transform/opacity and the compositor explained plainly.
- **Scroll speed is a type choice**: mapping reading rhythm to reveal timing.
- **The 200ms click window**: how click-to-action motion shapes perceived latency.
- **Reduced motion beyond the switch**: designing a second, calmer experience not a stripped one.

### Craft & CSS
- **Glass, part two**: when glass belongs over photography vs. flat colour.
- **Shadow discipline**: layer counts, elevation scales, and when not to glow.
- **Grid systems that don't shout**: layout rhythm without 12-column anxiety.
- **Fluid type without magic numbers**: clamp() math you can explain in a tweet.
- **CSS nesting now**: writing cleaner cascade with native nesting.
- **Container queries cookbook**: component-first responsive that isn't viewport-sized.
- **has() is finally useful**: three parent-selector patterns that survive production.
- **scroll-timeline, honestly**: what scroll-driven animations can and can't do today.
- **In defence of the button**: states, semantics and the one you always forget.
- **Colour contrast you can compute**: relative luminance without the calculator.

### Prompt engineering for websites
- **Writing a brief the model can't ignore**: anatomy of Motif's own prompt format.
- **The retry loop**: what to change between run 1 and run 2 when fidelity is 84.
- **One palette, three moods**: how prompt colour direction phrases change output.
- **When to say "no gradients" in a prompt**: and when it backfires.
- **Model personality drift**: same prompt on three models — what actually differs.
- **Design tokens inside prompts**: making output restyleable after generation.
- **Prompting for reduced motion**: baking a11y constraints into the brief.
- **From prompt to component**: turning a great generated page into library assets.
- **The 5-line prompt myth**: short vs. long briefs, evidence from the run logs.
- **Fidelity is a claim**: how Motif scores runs and why screenshots aren't proof.

### Accessibility & inclusive design
- **The keyboard walk**: audit a page with Tab only and find the traps.
- **Screen-reader poetry**: writing alt text and labels that respect attention.
- **Focus order is layout**: why DOM order beats visual order.
- **Contrast on brand colours**: keeping personality inside AA.
- **Touch targets beyond 44px**: thumbs, gloves and the real minimum.
- **Autoplay is a decision**: motion, sound and the users it excludes.
- **Designing for cognitive load**: chunking, defaults and forgiving forms.
- **Forms that fail kindly**: inline errors, retries and undo.
- **The invisible header**: landmarks, headings and why structure is design.
- **Testing with one hand**: mobile-first accessibility without a device lab.

### Career, process & industry
- **Building a personal UI library**: lessons from Motif for your own site.
- **Copy-paste guilt is a feature**: why stealing good patterns is how craft spreads.
- **Designing in the open**: shipping a changelog people actually read.
- **The first 90 days of a content site**: what Motif would do differently.
- **Performance budgets for solo builders**: the 200ms/60fps contract without a team.
- **Portfolio pieces that get you hired**: motion specs that interview well.
- **Freemium that isn't a lie**: where to draw the free/pro line honestly.
- **Animated storytelling for non-profits**: emotion with ethics.
- **Dark mode is a design system**: not a filter, a second system.
- **Naming is design**: component names that make APIs feel inevitable.

---

## 5. Lab tools — 20 additions (currently 8)

- **Timing-chart composer**: visually author a keyframe timeline (enter/dwell/exit) and export CSS.
- **Stagger calculator**: input N items and read the per-item delay offsets for a wave.
- **Background-position painter**: drag gradient stops on a canvas and export CSS.
- **Text-animation lab**: pick scramble/typewriter/wipe on your copy and compare.
- **Colour-ramp checker**: build an accessible ramp with AA/AAA markers per step.
- **Border-radius playground**: asymmetric radii with live preview and Tailwind output.
- **Shadow stacker**: add shadow layers, tune blur/spread, export a layered value.
- **Filter (blur/brightness) lab**: live single-filter previews on a test image.
- **Hue-shift simulator**: preview brand hue rotation across surfaces.
- **Breakpoint inspector**: resize a component demo through container widths.
- **Motion-preference preview**: toggle reduced-motion and watch scenes adapt.
- **Export clipboard**: one-click "copy Tailwind / CSS / React" from any lab.
- **Perf meter**: each lab shows a paint/transform badge and estimated cost.
- **URL state for labs**: shareable lab configurations via query params.
- **Favourite recipes**: save tuned outputs to localStorage with names.
- **Random inspiration button**: shuffle presets when the blank canvas stares back.
- **Typing-speed meter**: calibrate the typewriter demo to your copy length.
- **Icon line-weight lab**: stroke width/roundness adjustments across the icon set.
- **Logo-drift preview**: preview logo animation ideas with safe-zone guides.
- **Diff viewer**: paste two gradient/easing exports side by side and compare frames.

---

## 6. Detail pages — 30 ways to make every asset a course (currently: preview + code + notes)

- **Variant gallery**: 3–5 rendered variants per component (tone, density, accent) as live mini-stages.
- **Prop explorer**: every prop as a live control (already on list pages — give it to the detail hero).
- **Playground on the detail page**: the asset's Lab controls embedded above the code, not just linked.
- **Copy-format tabs**: React / HTML+CSS / Vue views of the same snippet with dependency badges.
- **Usage recipe**: a 90-second "where this fits" story, not just "why/skip" bullets.
- **Composition map**: which library assets combine well with this one (auto-suggested links).
- **Theming example**: same component re-skinned in two token themes side-by-side.
- **Sizing system**: 3 text/layout densities with code for each.
- **Performance note per asset**: paint cost, bundle estimate, and the cheaper alternative.
- **a11y report card**: what the automated audit checks for this asset, with fixes.
- **Browser support strip**: which modern features it needs (backdrop-filter, view-timeline…).
- **Reduced-motion fallback note**: what the asset does when motion is off.
- **Keyboard walk demo**: pressable step-through of the component's focus flow.
- **Related Learn essays**: the guides that teach the technique behind this asset.
- **Inspiration context**: one original micro-case of the pattern in the wild (written, not screenshotted).
- **Changelog per asset**: every version of this component with what changed and why.
- **Copy history count**: "copied 2.1k times" with a sparkline of the last 30 days.
- **Community remixes**: alternate versions of this asset submitted by users (future queue).
- **Star/favourite control**: bookmark an asset into your saved list.
- **"Pairs well with prompt"**: which AI prompt would build a page containing this asset.
- **Bundled-deps disclosure**: exact dependency tree with sizes.
- **Export as single file**: one `.tsx` or `.html` download button.
- **Open in CodeSandbox-style sandbox**: a real runnable copy with the library's CSS injected.
- **Tutorial transcript**: if the asset ever gets a video, host the written version here.
- **Design rationale panel**: the "why we made the default the default" note.
- **Code line walk**: annotated key lines of the snippet (why this line matters).
- **Size vs. quality trade-off slider**: compare the 4KB version and the 12KB "pro" version.
- **Stack-switch cost note**: what changes if you take the HTML version into React.
- **Tag synonyms**: discoverability terms ("dropdown", "select", "picker" → same asset).
- **Sibling comparison**: two similar assets side-by-side with a "when to pick which" table.

---

## 7. Templates & sample builds — 15 more

- **"Made with Motif" case studies**: expand the three samples into full case pages (challenge → assets used → result).
- **Recipe cards on templates**: each template shows the exact assets it composes with links.
- **Template preview iframe**: render the full template inline before opening it.
- **One-click stack selector**: toggle a template between React and HTML views and see the diff.
- **Template gallery filtering**: filter templates by mood, stack or section count.
- **Community template submissions**: accept and moderate template builds (ties to the queue).
- **Template bundle downloads**: a zip of assets + README for offline use.
- **Time-to-build meter**: "this template assembles in ~6 copies" — honest effort cues.
- **Rebrand playbacks**: swap the demo template into two token themes live.
- **Case-study numbers**: what each sample build's page weights and how many requests.
- **Blank-canvas pack**: start-your-own template with a section checklist.
- **Section swap explorer**: swap the hero/pricing section of a template to compare pairings.
- **Dark/light template twins**: two sample builds of the same template in both modes.
- **Template provenance tags**: original studio, date, and audit badges per template.
- **Copy entire build**: a JSON "build spec" export you could paste into a future CLI.

---

## 8. Discovery, search & browsing — 20 refinements

- **Save searches**: persist recent queries as chips on /search (localStorage).
- **Search scoped by type**: tab the results into Components/Prompts/Guides before typing.
- **Fuzzy typo tolerance**: "glss" still finds glass via edit-distance matching.
- **Highlight matched terms** in result titles and descriptions.
- **Per-asset aliases**: search "dropdown" finds the sheet menu etc.
- **Result meta chips**: show kind, stack and size right in search rows.
- **Keyboard-first search**: ↑/↓ to move, Enter to open the highlighted result.
- **URL-synced filters**: every kind/stack/sort filter lands in the query string for shareable links.
- **Save a component set**: multi-select cards into a "stack" you can share as a build recipe.
- **Browse by collection**: editorial lists ("Landing heroes", "Dark SaaS", "Under 5KB").
- **Counts everywhere**: totals shown per filter chip, updated live (started on /components).
- **Sort by new-within-30d**: freshness sort that weighs recency not raw date.
- **View-density toggle**: switch between rich cards and compact list rows on catalog pages.
- **Colour-first filter**: pick a hue and see assets whose accent matches.
- **Zero-stack filter**: filter to dependency-free assets only.
- **Random asset button**: a curated "surprise me" that teaches breadth.
- **Shareable asset links**: deep link with theme + variant state preserved.
- **Next/prev asset trail**: foot-of-page navigation between catalog siblings on detail pages.
- **Discovery via Learn**: each essay ends with assets that practice its lesson (started — widen it).
- **Weekly digest page**: "this week at Motif" as a real archive route, not only a homepage section.

---

## 9. Homepage & marketing pages — 20 upgrades

- **Sticky CTA rail**: a subtle bottom bar on scroll for first-time visitors.
- **Feature math section**: copy the honesty ("every prompt has test scores") into concrete numbers.
- **Live demo leaderboard**: homepage strip of the most-copied asset playing inline.
- **Week note**: a short "editor's log" block with the changelog's human voice.
- **Real testimonials from sample builds**: link out to three made-with-Motif pages.
- **"Built in an afternoon" timeline**: an animated 90-minute build story (not a fake claim).
- **Press/kit footer**: logo lockup, fact sheet, and brand palette downloads.
- **Mission page**: a short about page explaining "original only, tested or it doesn't ship".
- **/components needs a header CTA**: convert the top strip from explanation to action.
- **Search empty-state on home**: if the hero search has no query yet, offer popular topics.
- **Home stats with truth links**: each hero stat links to the list that proves it.
- **Interactive changelog**: expand/collapse older entries instead of a flat list.
- **Contrast band**: "old way vs. Motif" (already exists) — turn the five rows into clickable case links.
- **Returning-visitor cue**: subtle "back? here's what's new since last visit" via localStorage.
- **Moodboard entry point**: one "get inspired" tile leading to a shuffle view.
- **Pricing page anchor honesty**: compare plans with a "what stays free forever" promise block.
- **Side-by-side pricing demo**: two free/Pro component renders, not just a table.
- **Newsletter promise on every page footer**: one-line capture with cadence honesty.
- **Error pages designed**: a 404 that routes you to search with the broken path pre-filled.
- **Localised landing copy test**: one translated page to prove the i18n path before committing.

---

## 10. Theme Studio & design tokens — 20 upgrades

- **Real token editor**: edit accent/hues/radii in the Lab and see catalog-wide previews.
- **Token diff view**: show what changed in code when you tweak one value.
- **Palette presets**: 10 hand-made token themes ("Monochrome", "Terminal", "Paper").
- **Accent rotation demo**: sweep the whole library's accent through hues live.
- **Radius system explorer**: consistent radii scales and when to use each step.
- **Type scale calculator**: generate a modular scale from a base size and ratio.
- **Density presets**: compact/comfortable/spacious token sets.
- **Token export formats**: Tailwind config, CSS vars, JSON, and design-token spec output.
- **Contrast guardrail**: warn when an edit breaks AA between paired tokens.
- **Theme preview gallery**: render 3 representative pages in the active theme.
- **Saved themes**: persist theme recipes to localStorage and share as URL.
- **Original default defence**: Motif's own violet/cyan/mint explained as a case study.
- **Theming a real component**: step-through showing which tokens change which layers.
- **Colour-blind simulation**: preview a theme under protanopia/deuteranopia filters.
- **Semantic token map**: colour → role (accent, positive, warning) with usage counts.
- **Motion tokens**: durations and easings as named tokens with Lab previews.
- **Spacing scale explorer**: 4/8-based rhythm with visual rulers.
- **Iconography token set**: stroke weight and corner radius controls.
- **Theme API preview**: the future Theme Studio endpoint's JSON shape.
- **Reset-theme escape hatch**: prove every theme is undoable in one click.

---

## 11. Quality bar, a11y & testing — 20 mechanisms

- **Automated axe pass per asset**: run axe in CI and publish the score on detail pages.
- **Contrast CI check**: fail a component if its default palette misses AA.
- **Reduced-motion CI check**: assert every animated asset has a fallback state.
- **Size budget check**: fail an asset over a per-kind KB budget.
- **Dependency ledger**: require an "added deps" note on every asset change.
- **Keyboard-flow tests**: scripted Tab walks per asset (Playwright).
- **Screen-reader smoke test**: one announced-label assertion per interactive asset.
- **Copy consistency lint**: flag "no items yet" style wording across the site.
- **Numeric truth check**: every visible stat traces to a data source (like the ticker fix).
- **Perf regression tracker**: a tiny metric history per asset over versions.
- **Tone-of-voice lint**: reject marketing copy that overclaims ("instantly", "magically").
- **URL inventory test**: all cross-links resolve (curl over every href).
- **Share-audit page**: public per-asset audit log (this is a differentiator — publish it).
- **Freshness job**: weekly "stale content" report for prompts and changelog dates.
- **Spellcheck in CI**: catch typos in prose and prompt bodies before deploy.
- **Image-free audit**: assert decorative-only images are aria-hidden.
- **Focus-visible regression suite**: per-component focus ring screenshots.
- **Security hygiene**: no external fonts/CDNs in snippets without an integrity note.
- **Licence scanner**: confirm snippet code is Motif-original (no copy-paste from libs).
- **Annual content review**: a calendar reminder to re-run every prompt when models ship majors.

---

## 12. Community — 25 features

- **Favourites (public or private)**: star assets and prompts into a saved list.
- **User collections**: "Landing stack", "Under 5KB" shared collections with URLs.
- **Remix submit flow**: community versions feed the moderation queue (extends what exists).
- **Prompt re-run by community**: let users trigger a fresh model run and compare.
- **Copy leaderboard**: top-copied assets with author credits.
- **Profile pages**: minimal maker pages showing their submissions and stars.
- **Comment threads on assets**: anchored to code lines for review-style feedback.
- **Weekly community picks**: editors curate 3 community submissions into a "made it" band.
- **Challenge prompts**: "build the best preloader" — monthly with a winners rail.
- **Badges**: original-contributor, a11y-champion, prompt-scientist — earned, not bought.
- **Thank-you button**: lightweight appreciation that feeds a "community loved" sort.
- **Spotlight interviews**: one maker per month in the Learn section.
- **Discord/forum teaser**: a "join the craft talk" panel without pretending it exists yet.
- **Content requests board**: upvote what asset/prompt to build next.
- **GitHub-style blame for snippets**: which contributor last touched an asset's code.
- **Fork in the sandbox**: copy a community remix into your own saved set.
- **Attribution policy page**: how remixes credit the original author.
- **Moderation outcomes visible**: the queue's decisions aggregate into public stats.
- **Onboarding for contributors**: "how to submit" guide with the audit criteria.
- **New-contributor swag tier**: honest milestone notes, not fake merch.
- **Community RSS**: feed of new community assets.
- **Pair programming page**: how teams use the library together (license clarifications).
- **Translation crowd help**: community translations of Learn guides (CC BY).
- **Event calendar page**: virtual build-alongs and AMAs (future-dated honestly).
- **Merit sorting**: "top contributors this month" on the home footer.

---

## 13. Admin & content workflow — 20 tools

- **Local-first content CMS**: edit components/prompts/essays in the admin and export the data patch.
- **Pipeline overview dashboard**: funnel of submitted → audited → reviewed → live, with times.
- **Scheduled publishing**: set a future date for a prompt or changelog entry.
- **Bulk status transitions**: select multiple submissions → approve/reject (with a confirm).
- **Audit trail log**: every decision with actor, timestamp and note (localStorage now, server later).
- **Search inside admin**: filter assets/prompts/submissions by anything.
- **Quick stats per content type**: 30-day copy trends rendered as mini charts.
- **Content health score**: freshness, audit status and open issues per asset.
- **Copy inspector**: live preview of list/detail rendering before publishing.
- **Prompt re-run button**: trigger the 3-model test cycle and preview a fidelity change.
- **Changelog composer**: create a changelog entry that auto-links the assets it ships.
- **Admin keyboard shortcuts**: ⌘K command palette across admin tools.
- **Notification centre**: "queue passed SLA", "asset flagged by community" inbox.
- **Escalation lane**: submissions stuck over 48h float to the top with a timer.
- **Export reports**: CSV of monthly copies per asset for planning.
- **Theme control room**: flip the whole site theme from admin as a demo.
- **Admin mobile pass**: approve from a phone with big tap targets.
- **Undo/redo for decisions**: restore a rejected submission back to the queue.
- **Duplicate detector**: flag submissions whose title/tags match a live asset.
- **Empty-state for admin**: when the queue is clear, show "here's what shipped this week" instead of blank.


---

## 14. Pro plans & monetization — 15 upgrades

- **Pro feature list page**: one page that shows every Pro asset/lab with a live preview gate.
- **License clarity cards**: free = MIT assets · Pro = team licence + reports + API (visual, not legalese).
- **Usage-based honesty**: what "unlimited copies" means and what it doesn't.
- **Team seats preview**: a demo of inviting teammates (no real billing needed for the show).
- **Pro trial playbook**: 7-day Pro preview with per-feature unlock states.
- **API tokens mock page**: generate a fake API key with scopes to demo the future product.
- **Pro-only lab gate**: let free users play 3 minutes, then show the upgrade card.
- **Bundle vs. ala-carte**: compare "everything" vs. single-pack pricing with a cost meter.
- **Student/independent discount lane**: a real, humble discount for solo builders.
- **Grandfather promise**: "if you join now, this price never changes" — trust framing.
- **Cancel-path demo**: show that cancelling is a real button (no dark patterns).
- **Referral credit mock**: invite a friend, both get a month — demoed with local state.
- **Enterprise contact card**: what to say when teams ask for SSO/SLA, honestly scoped.
- **Receipt/plans page mock**: a fake-but-working billing settings page for admin demos.
- **Pro changelog**: every Pro-only addition listed with its free alternative noted.

---

## 15. Performance & delivery — 15 upgrades

- **Per-page budget report**: publish each route's JS/CSS weight with a "why this size" note.
- **Font-loading audit**: confirm variable fonts subset and preload the display face.
- **Zero-JS showcase pages**: mark which assets need no JS at all and demo them with JS disabled.
- **Lazy scene mounting**: catalog cards render demos only when scrolled near (IntersectionObserver).
- **Image-free policy page**: explain why the site uses no heavy imagery and how that keeps it fast.
- **Edge-cache headers plan**: a future-state note on cache invalidation when the CMS becomes real.
- **Bundle-splitting tour**: what ships on /components vs. /learn and why.
- **Backdrop-blur budget**: quantify where blur is used so the polish doesn't become the lag.
- **Animation layer inspector**: a Lab page showing which layers each demo creates.
- **Prefetch strategy**: Next.js prefetch on viewport hover for the next likely page.
- **Memory hygiene guide**: timers/intervals cleanup rules for every animated asset.
- **Low-end device test notes**: publish the 3-device matrix Motif tests against.
- **Perf regression badge on changelog**: each entry says whether size went up/down.
- **Build-time page**: what the production build compiles in — a transparency stat.
- **Service worker plan**: offline support for the catalog once the API lands.

---

## 16. Integrations & exports — 15 bridges

- **VS Code snippet pack**: install Motif snippets as editor completions.
- **Figma variable sync**: export tokens as Figma variables (documented format).
- **Tailwind preset package**: the design tokens as an installable Tailwind preset.
- **React package scaffold**: each component with an npm-ready wrapper (future).
- **HTML/CSS single-file copies**: copy as a self-contained file with inline styles.
- **Export to CodeSandbox**: deep link that opens the snippet in a sandbox.
- **Open Graph helper**: copy-paste OG markup per asset for promo pages.
- **Storybook decorator**: a starter Storybook theme wired to the tokens.
- **Framer-style code embed**: `<iframe>` embed snippet for component docs.
- **Design-token JSON endpoint**: the Theme Studio output as a stable JSON URL.
- **Browser bookmarklet**: highlight-and-save any page's accent palette.
- **CLI sketch**: `npx motif add tilt-card` — document the intended command UX.
- **CI badge**: a fake-but-designed "tests passing" badge per asset for READMEs.
- **RSS for changelog**: subscribe to release notes in a feed reader.
- **Print stylesheet for Learn**: articles that print cleanly as PDF (publish the CSS).

---

## 17. More interactive scenes & motion — 25 demos

- **Drag-to-reorder list**: rows that glide when you drag, with a11y keyboard reorder.
- **Swipeable cards (deck)**: tinder-style stack with undo and reduced-motion note.
- **Split-pane resizer**: draggable divider between two live panels.
- **Zoom-on-hover image map**: an image that magnifies under the cursor.
- **Range-linked chart scrubber**: a chart that scrubs as you drag the range (chart-card sibling).
- **Scroll-jack by choice**: a section that pins once with explicit "next" affordances.
- **Interactive bezier drawer**: drag the control points of a cubic-bezier (lab meets asset).
- **Springy 3D flip stack**: cards that flip on hover with Z layering.
- **Draw-on-scroll path**: an SVG path that traces itself as it enters view.
- **Morphing icon set**: icons that morph between two glyphs on toggle (play→pause).
- **Infinite logo chase**: logos that stream vertically in a column layout.
- **Shimmer text reveal**: text that sparkles through once on view (tasteful, not unicorn).
- **Progress ring with threshold ticks**: a ring that stops at milestones with labels.
- **Animated counters in a row**: a stats band demo using the odometer (asset-to-asset cross-link).
- **Hover-linked cards**: hovering one card dims its siblings (focus-the-story pattern).
- **Share-sheet overlay**: mobile share sheet with spring entry (pattern echo).
- **Drag-theme chip onto a card**: a playful theme-picker interaction for the catalog.
- **Inline search highlight walk**: typing scrolls and highlights occurrences across a doc demo.
- **Reading-time progress dots**: a sidebar that fills dot-by-dot as you read.
- **Pulse network graph**: a tiny node graph whose edges pulse (data-viz style).
- **Easing icon families**: each easing rendered as a bouncing ball icon (Learn + Lab bridge).
- **Preloader choreography**: 3 loaders that hand off to content on a fake "load".
- **Ripple nav dots**: page-position dots that ripple on change.
- **Tilted hero CTA**: a hero button that subtly orients to the pointer.
- **Success-state celebration**: an account-created screen with a restrained burst.

---

## 18. Engagement & retention — 10 habits

- **"Copy of the week" email mock**: a designed digest page people can preview.
- **Streak for makers**: track days with a copy/contribution (fun, opt-in).
- **Build-a-thon calendar**: monthly challenge with a public countdown.
- **Rate-your-build**: after copying, a 1-tap "did this ship?" check-in.
- **Returning-visitor "new since you left" strip** on the home feed.
- **Learning paths**: "Motion starter → springs → scroll" sequences with progress dots.
- **Saved-stack share prompts**: when you save 5 assets, offer a shareable recipe.
- **Quiet reminders**: an optional "your saved stack hasn't shipped yet" nudge.
- **Weekly self-score**: a playful "your library fitness" meter from copies/reads.
- **Community day**: every Thursday a themed prompt (+ badge for participants).

---

## 19. SEO & growth — 15 levers

- **Per-asset meta**: unique titles/descriptions from the detail data (already templated — enrich).
- **FAQ schema on detail pages**: structured data for "what is a X component".
- **Learn as the SEO engine**: target "how to …" long-tail queries with the essays.
- **Comparable-free positioning pages**: "Motif vs. generic UI kits" written on merit, no competitor copying.
- **Prompt glossary hub**: terms like "fidelity score", "run log", "concept render" explained and linked.
- **Changelog as content**: each entry is a small publishable news item.
- **Site search indexing**: make sure /search results pages are noindex while catalog pages index.
- **Sitemap by content type**: components, prompts, essays, backgrounds in one clean sitemap.
- **OG images per asset**: auto-generated poster cards for social shares (like prompt posters).
- **Original-code bait**: every snippet page shows enough craft to earn links.
- **Internal-link spine**: every asset links 2 essays and 1 prompt, forming a crawlable graph.
- **Speed as SEO**: publish the Lighthouse story and let performance earn ranking.
- **Multilingual titles**: page slugs stay English; add one translated title test later.
- **Evergreen refresh dates**: visible "updated" stamps (learn articles have them — reuse site-wide).
- **Honest schema**: avoid product/aggregate markup until the data truly exists.

---

## 20. Brand, social proof & launch — 10 moves

- **Logo system page**: the mark, wordmark, clear-space and misuse examples (all original).
- **Voice guide**: 10 "we say / we never say" lines that keep copy consistent.
- **Launch checklist page**: the actual pre-launch list Motif used — content and culture.
- **Social proof shelf**: quote three real-feeling builders (fictional-but-labelled demo makers).
- **Build notes on X/threads**: the ticker copy as shareable one-liners.
- **Open metrics page**: page views, copies, model runs as a public dashboard (trust play).
- **Mascot concept**: a tiny original character for 404s and empty states (not a stock meme).
- **Wallpaper/poster downloads**: brand-palette wallpapers for fans (original art).
- **Thank-you page design**: after a mock signup, show the library's best first steps.
- **"Made by Motif" watermarks**: optional badge for builds that used the library.

---

## 21. Beyond the MVP — 10 north-star bets

- **Real accounts & favourites backend**: the first server feature worth building.
- **Prompt re-run service**: queue a real 3-model run and stream the log.
- **Theme Studio as a product**: the token editor becomes the flagship tool.
- **Component API (JSON)**: assets served as data with code, notes and versions.
- **Public audit API**: let anyone verify an asset's scores programmatically.
- **Native share/embed SDK**: third-party sites embed Motif demos with one tag.
- **Community moderation marketplace**: trusted reviewers earn Pro months.
- **Learn certificates**: finish a path, earn a shareable "motion literate" badge.
- **Desktop helper app**: a tray app for quick snippet lookup (electron, later).
- **Open book**: publish the site's own build metrics and content playbook as the ultimate case study.

---

_Total: 500 suggestions across 21 sections. Start with the three ideas in each section
that make you want to build — that's how Motif got from 20 to 39 components._
