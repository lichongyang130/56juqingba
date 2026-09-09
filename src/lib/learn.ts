// Motif UI — Learn section content. Original editorial material; the "why"
// behind the library so the site teaches a craft, not just hands out files.

export interface LearnBlock {
  h?: string;
  body?: string[];
  bullets?: string[];
  code?: { title?: string; lang: string; text: string };
  callout?: { type: "tip" | "warn" | "pro"; title?: string; text: string };
  links?: { label: string; href: string }[];
}

export interface LearnArticle {
  slug: string;
  kicker: string;
  title: string;
  deck: string;
  minutes: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  updated: string;
  blocks: LearnBlock[];
}

export const LEARN_ARTICLES: LearnArticle[] = [
  {
    slug: "hero-that-breathes-in-20-min",
    kicker: "Build along",
    title: "Build a hero that breathes — in 20 minutes",
    deck: "Most hero sections die on the fold because nothing in them moves with intent. This walkthrough stacks three zero-dependency Motif pieces into a hero that earns the scroll.",
    minutes: 20,
    level: "Beginner",
    tags: ["hero", "animation", "tailwind", "build-along"],
    updated: "2026-09-09",
    blocks: [
      {
        h: "Why heroes feel dead",
        body: [
          "A hero is one glance. If every pixel is still, the eye treats it like a magazine cover — read once, scroll on. You don't need autoplay video or a 3D library; you need three cheap layers of life that reinforce one message.",
          "The recipe we use at Motif: a living backdrop (motion you can ignore), one typographic moment (motion you can't miss), and one honest action (motion under your finger).",
        ],
        links: [
          { label: "Aurora Veil — living backdrop", href: "/components/aurora-veil" },
          { label: "Wipe Reveal — typographic moment", href: "/components/wipe-reveal" },
          { label: "Halo Button — honest action", href: "/components/halo-button" },
        ],
      },
      {
        h: "Step 1 — stack the veil",
        body: [
          "Start with the backdrop so everything after it has something to sit on. Aurora Veil is three radial gradients drifting on a slow clock plus a grain pass — GPU-composited, zero JavaScript.",
          "Resist cranking the speed. A drift that takes 16–20s per cycle reads as 'alive but expensive'. Faster reads as 'screensaver'.",
        ],
        code: {
          title: "veil layer",
          lang: "tsx",
          text: `<section className="relative min-h-[90vh] overflow-hidden bg-[#07080d]">
  {/* layer 1: living backdrop */}
  <AuroraVeil hueA={262} hueB={192} speed={18} grain
              className="absolute inset-0" />
  {/* layer 2+3 arrive below */}
</section>`,
        },
      },
      {
        h: "Step 2 — one typographic moment",
        body: [
          "Now the headline. Wipe Reveal runs a travelling light edge across the type once on load, then sits still as clean typography. The secret to why it works: the sweep is clipped to the letters (background-clip: text), so it can never leak outside the headline and look broken.",
        ],
        code: {
          title: "headline moment",
          lang: "tsx",
          text: `<div className="relative z-10 mx-auto max-w-3xl px-6 pt-28 text-center">
  <WipeReveal as="h1" className="text-5xl md:text-7xl font-black">
    Copy less.<br/>Ship more.
  </WipeReveal>
</div>`,
        },
      },
      {
        h: "Step 3 — the honest action",
        body: [
          "The CTA is the only element allowed to move *with* the cursor. Halo Button tracks a light-spot to wherever you point and nudges toward it — it feels lit from where you look. A magnetic nudge of 12–24px is enough; more feels like it's running from you.",
        ],
        code: {
          title: "cta",
          lang: "tsx",
          text: `<div className="mt-8 flex justify-center gap-3">
  <HaloButton magnet={18} glow={0.7} as="a" href="#start">
    Start building
  </HaloButton>
  <a href="#library"
     className="rounded-xl border border-white/20 px-6 py-3
                text-sm font-semibold text-white/85 hover:bg-white/10">
    Browse the library
  </a>
</div>`,
        },
      },
      {
        h: "Restraint is the design",
        callout: {
          type: "warn",
          title: "When to skip",
          text: "If your product is a calm tool (fintech, health, internal dashboards), drop the veil and keep only the headline moment — or drop all three and use Wipe Reveal on scroll only. Motion is a seasoning, not the dish.",
        },
      },
      {
        h: "Finish & tune",
        body: [
          "You now have three layers, ~8 KB of CSS, zero dependencies, and a hero that reads once but feels alive.",
          "Tune the pacing in the Lab — the difference between a 0.4s and 0.9s wipe is the difference between 'snappy' and 'premium'. Feel it, then export the exact cubic-bezier.",
        ],
        links: [
          { label: "Tune easing in the Easing Lab", href: "/lab" },
        ],
      },
    ],
  },
  {
    slug: "easing-is-a-language",
    kicker: "Field guide",
    title: "Easing is a language — a field guide to curves",
    deck: "The single highest-leverage skill in web animation is choosing the right curve. This guide maps the six curves we use at Motif to the feelings they produce — with the exact CSS.",
    minutes: 12,
    level: "Intermediate",
    tags: ["easing", "motion", "css", "field-guide"],
    updated: "2026-09-08",
    blocks: [
      {
        h: "Start with the feeling, not the curve",
        body: [
          "Every easing curve is a personality. Linear says 'machine'. ease-out says 'expensive'. back-out says 'confident'. elastic says 'celebration'. If you pick curves by copying presets, your page has the personality of a default theme.",
        ],
      },
      {
        h: "The six curves that cover 90% of UI",
        bullets: [
          "linear — progress bars, marquees, anything mechanical. Never for entrance motion.",
          "ease-out-expo (0.16 1 0.3 1) — the workhorse entrance. Fast start, long settle = 'premium'. Use for cards, sections, images entering.",
          "ease-in-out-quart (0.76 0 0.24 1) — symmetric, for things that leave and arrive (modals, sheets). Never ease-in an element that enters the viewport — eyes hate the slow start.",
          "back-out (0.34 1.56 0.64 1) — a single overshoot. One item to spotlight, not a grid of items.",
          "ease-out-elastic — celebration only. A handful of elements on the whole page, ever.",
          "custom snap — use a spring lab or overshoot preset when a UI element 'lands' (drag release, toggle thumb).",
        ],
        code: {
          title: "the workhorse",
          lang: "css",
          text: `/* the 'expensive' entrance: fast to 80%, then glide */
.card-enter {
  animation: rise .7s cubic-bezier(.16, 1, .3, 1) both;
}
@keyframes rise {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: none; }
}

/* overshoot for ONE hero element */
.spotlight {
  transition: transform .5s cubic-bezier(.34, 1.56, .64, 1);
}`,
        },
      },
      {
        h: "Make timing a token",
        body: [
          "The reason motion feels inconsistent across pages is that durations and curves live in ten different files. At Motif every asset exposes duration/easing props so a whole page can be re-tuned from one place — do the same in your project with CSS variables.",
        ],
        code: {
          title: "motion tokens",
          lang: "css",
          text: `:root {
  --ease-enter: cubic-bezier(.16, 1, .3, 1);
  --ease-snap:  cubic-bezier(.34, 1.56, .64, 1);
  --dur-fast: 140ms;   /* hovers, focus */
  --dur-base: 300ms;   /* colour, opacity */
  --dur-enter: 700ms;  /* entrances */
}`,
        },
      },
      {
        h: "Respect the motion budget",
        callout: {
          type: "tip",
          title: "Reduced motion is not a binary",
          text: "prefers-reduced-motion doesn't mean 'no animation' — it means 'no vestibular-triggering animation'. Fades and 2px translate are fine; scale-bursts and parallax are not. Our reduced-motion fallbacks keep opacity/translate only.",
        },
        links: [{ label: "Feel these curves in the Easing Lab", href: "/lab" }],
      },
    ],
  },
  {
    slug: "prompt-that-reproduces",
    kicker: "AI workflows",
    title: "Write AI prompts that reproduce — not ones that 'inspire'",
    deck: "Most AI website prompts get you 60% fidelity because they describe vibes ('make it sleek') instead of constraints. This is the exact structure we use to get 90+ fidelity across Claude, Codex and GLM-4.6.",
    minutes: 15,
    level: "Intermediate",
    tags: ["ai", "prompts", "workflow", "reproducibility"],
    updated: "2026-09-09",
    blocks: [
      {
        h: "Constraints beat adjectives",
        body: [
          "In every run log on this site you'll see the same pattern: prompts with concrete constraints score 10–15 points higher than adjective prompts. 'Sleek' is unmeasurable; '16px radius, near-black #07080B canvas, one violet→cyan accent used only for CTAs' is a spec.",
        ],
        bullets: [
          "Give the palette as hex/HSL, and say where each colour is *allowed* — restraint instructions land harder than colour names.",
          "Give a component inventory (nav, bento features, pricing toggle) so the model doesn't invent sections.",
          "Give a motion budget ('entry reveals + one ambient pulse, nothing else') so it doesn't animate everything.",
          "Say what NOT to do ('no autoplay video, no stock handshakes') — prohibitions are the most reliable instruction class.",
          "Write like you know the subject. A real-estate prompt that names 'sqm, transit minutes, brass accents' beats 'modern apartment' by a mile.",
        ],
      },
      {
        h: "The skeleton that scores 90+",
        code: {
          title: "prompt skeleton",
          lang: "text",
          text: `Build a [page type] in [stack].

Palette
• canvas / ink / accent (hex) — and where each is allowed
• accent reserved for [moments]

Above the fold
• [section]: [2-3 concrete requirements, incl. typography scale]
• [headline copy — write it for me, in this voice: ___]

Sections (in order)
1. [name] — [what it must contain + interaction]
2. [name] — ...
3. [name] — ...

Motion budget
• entrances: [easing/duration hint]
• interactive: [hover/click rules]
• prohibited: [list]

Tone & traps
• write copy like [persona]
• avoid [stock clichés]
• accessibility: [WCAG notes]`,
        },
      },
      {
        h: "Why we test on three models",
        body: [
          "A prompt is a contract with a model — and models differ. In our runs, GLM-4.6 often nails editorial restraint, Codex nails technical demos, Claude balances both but loves decorative gradients unless told not to. That's why every prompt here ships with a run log: you see which model to run it on before you waste a session.",
        ],
        callout: {
          type: "pro",
          title: "Steal our format",
          text: "Copy any prompt from the library and adapt the Palette/Motion-budget sections to your own design system. The structure transfers; the content is yours.",
        },
        links: [{ label: "Browse verified prompts", href: "/prompts" }],
      },
    ],
  },
  {
    slug: "a11y-before-you-copy",
    kicker: "Checklist",
    title: "Before you copy that component: the a11y checklist",
    deck: "Every asset in the library passes these checks before it earns a card. Run the same five on anything you paste from anywhere else — most copy-paste libraries skip all of them.",
    minutes: 8,
    level: "Beginner",
    tags: ["accessibility", "checklist", "motion"],
    updated: "2026-09-06",
    blocks: [
      {
        h: "The five checks",
        bullets: [
          "Keyboard reachable — can I Tab to it and operate it with Enter/Space/Arrows? A hover-only interaction is a bug.",
          "Focus visible — does the browser's focus ring survive your border-radius and colour changes? Never remove outlines without a visible replacement.",
          "Contrast AA — body text 4.5:1, large text 3:1. Watch dim captions: that 'subtle' #9AA text on #0B0D14 fails AA at small sizes.",
          "Reduced motion — prefers-reduced-motion must produce a calmer-but-present state, not a frozen or broken one.",
          "Announced state — switches need role/aria-checked; loaders need role=status/aria-live; count-ups should reveal their final value to screen readers immediately.",
        ],
      },
      {
        h: "Two traps specific to animated UI",
        body: [
          "The first trap: decorative motion that carries meaning. If a number counts up, the visual is decoration — the *meaning* must exist in the DOM from the start (the final value, read out loud immediately).",
          "The second trap: hover-only affordances. Anything revealed on hover must also be discoverable by keyboard — that usually means 'make it a real button or link, or expose the action another way'.",
        ],
        callout: {
          type: "tip",
          title: "Our bar",
          text: "We publish the automated a11y score on every asset card and re-check with a human pass before 'Verified'. If a submitted asset can't reach ~90, it doesn't ship — that's the quality gate that keeps this library from becoming a pile of pretty failures.",
        },
        links: [
          { label: "Check a component's audit report", href: "/components/prism-switch" },
        ],
      },
    ],
  },

  {
    slug: "glass-is-a-material",
    kicker: "Field guide",
    title: "Glass is a material — not a trend",
    deck: "Backdrop-blur is 2026's drop-shadow: everywhere, mostly wrong. This guide explains the four surfaces that make glass read as expensive instead of dirty frosted plastic.",
    minutes: 10,
    level: "Intermediate",
    tags: ["glass", "glassmorphism", "materials", "css"],
    updated: "2026-09-09",
    blocks: [
      {
        h: "Why most glass looks bad",
        body: [
          "Glass fails when it's just one blurred gradient blob behind a rounded card. Real glass is a stack of decisions: a base that's dark enough to blur, a specular top edge, a hairline border, and content that doesn't fight the frosted field behind it.",
          "The other failure is light-theme glass. Frosted white-on-white reads as dirty plastic — glass belongs on photographic or gradient canvases, or on a deliberately dark base.",
        ],
        links: [
          { label: "Liquid Glass background", href: "/backgrounds" },
          { label: "Glass Pricing Trio — glass with real content", href: "/components/glass-pricing" },
        ],
      },
      {
        h: "The four surfaces of believable glass",
        bullets: [
          "Base fill — semi-transparent white/low-single-digit alpha over something with contrast underneath (photo, gradient, motion).",
          "Specular top edge — an inset 0 1px 0 rgba(255,255,255,.3–.45) highlight. This one line is 50% of the illusion.",
          "Border strategy — border rgba(255,255,255,.12–.18). Too high = plastic rim; too low = the card vanishes.",
          "Blur amount — backdrop-blur(12–24px) reads as glass; 4px reads as 'blurry div'. Match blur to the motion behind it: faster motion behind, more blur.",
        ],
      },
      {
        h: "The recipe we ship",
        code: {
          title: "glass-surface.css",
          lang: "css",
          text: `.glass {
  background: linear-gradient(180deg,
              rgba(255,255,255,.14), rgba(255,255,255,.04));
  border: 1px solid rgba(255,255,255,.16);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.35), /* specular top edge */
    0 24px 48px -24px rgba(0,0,0,.8);     /* lift, not glow */
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}
/* the glow is a privilege, not a default: */
.glass--hero {
  box-shadow: inset 0 1px 0 rgba(255,255,255,.4),
              0 0 60px -10px rgba(139,92,246,.55);
}`,
        },
      },
      {
        h: "When to skip glass entirely",
        callout: {
          type: "warn",
          title: "Honesty check",
          text: "If the content behind the card is a flat corporate background, glass has nothing to refract — you're just adding blur for fashion. Use a solid token card with a hairline border and spend the saved GPU on typography.",
        },
      },
    ],
  },
  {
    slug: "css-depth-five-moves",
    kicker: "Field guide",
    title: "3D that costs nothing: CSS depth in five moves",
    deck: "Flip cards, tilting hero cards and orbiting logos — all of it is five CSS properties you already half-know. A cheat sheet with the exact recipes, zero WebGL.",
    minutes: 11,
    level: "Intermediate",
    tags: ["3d", "css", "transform", "flip", "tilt"],
    updated: "2026-09-08",
    blocks: [
      {
        h: "The five properties",
        bullets: [
          "perspective — set on the PARENT (600–1100px feels natural; too small = fisheye).",
          "transform-style: preserve-3d — lets children keep their own depth planes.",
          "backface-visibility: hidden — makes the flip card work by hiding the back face.",
          "rotateX / rotateY / translateZ — the moves themselves; rotate around an axis, translate along Z to layer.",
          "transform-origin — decide where the pivot sits (bottom for a rise, center for a flip).",
        ],
      },
      {
        h: "Move 1 — the flip",
        code: {
          title: "flip.css",
          lang: "css",
          text: `.scene { perspective: 1100px; }
.flipper {
  position: relative; height: 220px;
  transform-style: preserve-3d;
  transition: transform .7s cubic-bezier(.4,.2,.2,1);
}
.flipper.is-flipped { transform: rotateY(180deg); }
.face {
  position: absolute; inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.face--back { transform: rotateY(180deg); }`,
        },
        links: [{ label: "Flip Card demo", href: "/components/flip-card" }],
      },
      {
        h: "Move 2 — the tilt",
        code: {
          title: "tilt.css",
          lang: "css",
          text: `.tilt-card {
  transform:
    perspective(900px)
    rotateX(calc((50 - var(--my, 50)) * 0.32deg))
    rotateY(calc((var(--mx, 50) - 50) * 0.32deg));
  transition: transform 120ms ease-out;
}
/* --mx / --my are set from pointermove as 0–100 percentages */`,
        },
        links: [{ label: "Tilt Card demo", href: "/components/tilt-card" }],
      },
      {
        h: "Move 3 — the orbit ring",
        code: {
          title: "orbit.css",
          lang: "css",
          text: `/* one spinning ring, items counter-rotate so they stay readable */
.ring { animation: spin 14s linear infinite; }
.ring-item {
  position: absolute; top: 50%; left: 50%;
  transform: rotate(var(--a)) translateX(var(--r)) rotate(calc(var(--a) * -1));
  animation: spin 14s linear infinite reverse;
}
@keyframes spin { to { transform: rotate(360deg); } }`,
        },
        links: [{ label: "Orbit Deck demo", href: "/components/orbit-deck" }],
      },
      {
        h: "The discipline of 3D",
        callout: {
          type: "tip",
          title: "Less is tectonic",
          text: "One tilted element per viewport maximum. Two competing 3D moves feel like a funhouse, not a product. And gate tilt/flip to fine pointers: on touch there's no hover, so make the 3D a click or a scroll response.",
        },
      },
    ],
  },
  {
    slug: "scroll-choreography-that-respects",
    kicker: "Patterns",
    title: "Scroll choreography that respects the reader",
    deck: "Scroll-jacking is a sin; scroll choreography is a craft. The difference is intent: does the scroll reveal the story, or does it fight the reader for control?",
    minutes: 12,
    level: "Advanced",
    tags: ["scroll", "animation", "pinning", "patterns"],
    updated: "2026-09-09",
    blocks: [
      {
        h: "The three scroll verbs",
        bullets: [
          "Reveal — content animates in as it crosses the viewport. The default; cheap and safe.",
          "Pin — a section stays put while the next chapter scrolls over it. High drama, needs restraint.",
          "Sync — progress through a scene is tied to scroll position (0–100%). The Scroll Lab pattern: enter → pin → exit.",
        ],
        links: [{ label: "Play with the Scroll Lab", href: "/lab" }],
      },
      {
        h: "Rules we hold ourselves to",
        body: [
          "Never animate layout-affecting properties in a scroll handler. transform and opacity only — width/height/top on scroll is how you get jank nobody can debug.",
          "Reveal once, never re-trigger. Elements that re-animate when you scroll back up feel broken; let them settle.",
          "Respect reduced motion by jumping to the final state, not freezing mid-story.",
          "Keep the story skimmable: someone who scrolls fast should land on complete sections, not 47 half-animated states.",
        ],
      },
      {
        h: "The choreography skeleton",
        code: {
          title: "scroll-recipe.ts",
          lang: "ts",
          text: `// enter at 25% of the viewport, pin until 55%, exit by 80%
const scene = {
  enter: 0.25,  // opacity 0→1, translateY 60→0
  pinAt: 0.55,  // hold, scale to 1.06, add glow
  exitAt: 0.80, // opacity →0, translateY →-40
};

// exported recipe (copy from the Scroll Lab):
//  hero: enter cubic-bezier(.16,1,.3,1)
//        pin: transform scale 1.06
//        exit: fade up -40px
//  prefers-reduced-motion: skip all, show final state`,
        },
      },
      {
        h: "When pinning pays",
        callout: {
          type: "pro",
          title: "Use pinning for one idea",
          text: "Pin earns its keep when a single idea needs time to land: a product transforming, a number climbing, a route tracing. If the story has three competing pinned sections, you've built a slide deck — scroll should feel like reading, not presenting.",
        },
      },
    ],
  },
  {
    slug: "gradients-that-dont-look-cheap",
    kicker: "Colour",
    title: "Gradients that don't look cheap",
    deck: "Gradient is the most abused CSS property on the web. The difference between 'brand system' and 'Windows 98 wallpaper' is discipline: hue count, direction, and knowing when to stop.",
    minutes: 9,
    level: "Beginner",
    tags: ["gradient", "colour", "design", "css"],
    updated: "2026-09-07",
    blocks: [
      {
        h: "The three rules",
        bullets: [
          "Two hues maximum (three only when one is a near-neutral). Every extra hue multiplies the chance of mud.",
          "Keep hue steps tight — roughly 60–140° apart on the wheel. The violet→cyan family is 90° apart and safe; violet→red is 40° and reads as one colour's mood swing.",
          "Never blend through the greys. If two hues sit opposite the wheel, the midpoint goes brown — that's the 'cheap' look, every time.",
        ],
        links: [{ label: "Forge gradients in the Lab", href: "/lab" }],
      },
      {
        h: "Text gradients are a specific art",
        code: {
          title: "gradient-text.css",
          lang: "css",
          text: `.gradient-word {
  background-image: linear-gradient(100deg,
                    #c4b5fd, #a5b4fc 34%, #67e8f9 68%, #f9a8d4);
  -webkit-background-clip: text;
          background-clip: text;
  color: transparent;
}
/* rule: only for display type 40px+. Small text + gradient = shimmer */
/* rule: keep the lightest stop under 70% lightness for AA on dark */`,
        },
        links: [{ label: "Wipe Reveal headline", href: "/components/wipe-reveal" }],
      },
      {
        h: "When solid beats gradient",
        callout: {
          type: "warn",
          title: "The stop rule",
          text: "If you can't say what the gradient means (brand direction, light source, data encoding), use a solid token colour. Gradients are for atmosphere and hierarchy moments — a whole UI in gradients is a rainbow, not a design system.",
        },
        links: [{ label: "Aurora Veil — one atmospheric use", href: "/components/aurora-veil" }],
      },
      {
        h: "Finish with noise",
        body: [
          "The most expensive-looking gradients hide banding. A 2–4% film-grain overlay (SVG turbulence or feTurbulence data-URI) breaks up the bands and gives the surface a photographic finish. It's the same trick print designers have used for a century.",
        ],
        links: [{ label: "Paper Noise texture", href: "/backgrounds" }],
      },
    ],
  },

  {
    slug: "the-60fps-handshake",
    kicker: "Performance",
    title: "The 60fps handshake: what devtools is really telling you",
    deck: "A frame budget is a contract between the compositor and your paint calls. Learn to read the performance trace the way a negotiator reads a room — and stop guessing which property broke it.",
    minutes: 10,
    level: "Advanced",
    tags: ["performance", "60fps", "devtools", "compositor", "css"],
    updated: "2026-09-09",
    blocks: [
      {
        h: "The budget, in human terms",
        bullets: [
          "At 60fps one frame lasts 16.7ms — and the browser keeps ~6ms for itself. Your script, layout and paint get roughly 10ms.",
          "A dropped frame isn't the crime; a dropped frame every third scroll is. DevTools paints each over-budget frame red in the FPS graph — look for rhythm, not single spikes.",
          "Long tasks block input too: a 120ms main-thread task means taps and scrolls queue behind it. Same fix, harsher deadline.",
        ],
        links: [{ label: "Measure your scroll choreography", href: "/lab" }],
      },
      {
        h: "Read the three lanes",
        body: [
          "Open Performance → record a scroll. You'll see a main-thread lane (purple scripting, green layout, pink paint) and a compositor lane below. The handshake: every time you animate a property the main thread owns — width, height, top, left, box-shadow — the main thread must re-run layout or paint before the compositor can show anything.",
          "If your frame is red in the compositor lane alone, the browser is struggling to rasterise and upload tiles — usually too many backdrop-blurs or giant repaint regions, not your JavaScript.",
        ],
      },
      {
        h: "The transform/opacity-only rule, quantified",
        code: {
          title: "trace-reading.js",
          lang: "ts",
          text: `// red flags in a scroll trace, in order of cost:
// 1. 'Layout' blocks > 2ms repeating  → animating width/top/height
// 2. 'Paint' blocks growing each frame → backdrop-blur on a moving layer
// 3. 'Rasterize' every frame          → layer bigger than the viewport
// 4. scripting > 8ms in a scroll      → layout-thrash or React re-render
//
// the fix checklist:
//  - move the animated element to its own layer (will-change: transform)
//  - animate only transform / opacity / filter (perf-tier: yes)
//  - replace box-shadow motion with a pre-blurred pseudo-element
//  - once the layer exists, REMOVE will-change — it costs memory`,
        },
        links: [{ label: "Scroll Lab lets you isolate one variable", href: "/lab" }],
      },
      {
        h: "The 8ms habit",
        callout: {
          type: "pro",
          title: "Budget in your head",
          text: "Before writing any animation, ask: which lane does this property live in? If the answer is layout or paint, you've spent the budget before the frame started. transform and opacity are the only properties that skip both — that's not a style preference, it's the compositor's contract.",
        },
      },
    ],
  },
  {
    slug: "empty-states-earn-trust",
    kicker: "UX writing",
    title: "Design the empty state first",
    deck: "The empty state is the first thing a new user ever sees — and the first thing designers delete from the spec. A field guide to turning 'nothing here' into the most convincing screen in your product.",
    minutes: 9,
    level: "Beginner",
    tags: ["ux", "empty states", "copywriting", "onboarding", "patterns"],
    updated: "2026-09-08",
    blocks: [
      {
        h: "Why empty is a feature",
        body: [
          "A blank inbox, an empty dashboard, a fresh account — these are the only moments a product has the user's full attention with zero distraction. Products that fill that moment with a grey box and 'No items yet' are burning their best onboarding surface.",
          "The empty state has one job: make the next action obvious and make the user feel the product is already working. Two sentences of copy can do both.",
        ],
        links: [{ label: "Copy that sells the next click", href: "/learn/prompt-that-reproduces" }],
      },
      {
        h: "The anatomy of a good one",
        bullets: [
          "One concrete verb in the headline — 'Set your first goal', not 'No goals yet'.",
          "A next step that takes under a minute and has a visible reward ('Add a link — your first board appears here').",
          "A secondary escape hatch ('or import from Notion') for the user who isn't ready.",
          "The illustration (if any) must depict the filled state — show the destination, not the void.",
        ],
      },
      {
        h: "The pattern, in copy",
        code: {
          title: "empty-state-copy.md",
          lang: "text",
          text: `Before                      After
--------                    -----
No projects yet             Your first project
                            takes 40 seconds

Try creating one            Create 'Q3 launch'
                            — your board appears here

                            or import from Jira →
`,
        },
        links: [{ label: "A hero that does the same job for landing pages", href: "/learn/hero-that-breathes-in-20-min" }],
      },
      {
        h: "The audit trick",
        callout: {
          type: "warn",
          title: "Screenshot every empty state",
          text: "Open a fresh account in your own product and screenshot every screen that has no data. If any of them shows the word 'no' or 'empty' instead of a verb, that screen is your onboarding leak. Fix copy before you touch the chart.",
        },
      },
    ],
  },
  {
    slug: "easing-cheatsheet-deep-dive",
    kicker: "Motion theory",
    title: "Easing cheatsheet, deep dive",
    deck: "Eight named curves, one screen. Which ease belongs to an entrance, which to an exit, and which one you should stop using today — with the exact cubic-beziers Motif's own components ship with.",
    minutes: 11,
    level: "Intermediate",
    tags: ["easing", "motion", "curves", "animation"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "The eight curves and their personalities",
        body: [
          "Every named ease is a personality, and personalities have jobs. Linear is a metronome: no accent, no lies, useful only for continuous loops and marquees. ease-in starts slow and lands fast — it reads as something falling or being dismissed. ease-out starts fast and lands slow — it reads as something arriving and settling. ease-in-out splits the difference and is the safest default for anything that both enters and exits.",
          "The problem with the CSS keywords is that they are fixed. ease-in-out's actual curve is gentle, but for UI it is usually too slow in the middle and not decisive enough at the ends. That is why every serious motion system ends up with bespoke beziers named after their job, not their shape.",
        ],
        callout: {
          type: "tip",
          title: "The two curves Motif ships most",
          text: "entrance: cubic-bezier(.16, 1, .3, 1) — fast out of the gate, glides to rest. exit: cubic-bezier(.55, 0, 1, .45) — quick start, then commits to leaving. Copy these two and you have solved 80% of UI motion.",
        },
      },
      {
        h: "Entrances settle, exits commit",
        body: [
          "Read that line twice, because it is the entire cheatsheet in six words. An entrance should feel like a thing arriving and settling into its layout position — so it accelerates early (the eye catches it) and decelerates at the end (the eye can follow it to rest). An exit should feel decided — it commits and leaves, so it accelerates out and never slows down halfway out of the door.",
          "Swap the two and the UI feels wrong in a way users describe as 'laggy' or 'jumpy' without ever naming the curve.",
        ],
        code: {
          title: "the two-workhorse.css",
          lang: "css",
          text: `.ease-entrance { transition: transform .5s cubic-bezier(.16, 1, .3, 1); }
.ease-exit     { transition: opacity .3s cubic-bezier(.55, 0, 1, .45); }
/* entrance: arrives and settles · exit: decides and leaves */`,
        },
      },
      {
        h: "The full table, with jobs",
        bullets: [
          "linear — loops only: spinners, marquees, indeterminate progress. Anywhere motion must never imply arrival.",
          "ease-in (accelerate) — dismissal. Modals leaving, alerts collapsing. Short durations only; long ease-in feels like waiting.",
          "ease-out (decelerate) — arrival. Cards entering, dropdowns opening, toasts arriving. The workhorse keyword when you cannot write a bezier.",
          "ease-in-out — reversible UI: accordions, theme toggles, hover that must feel symmetrical. Never use it for a one-way entrance; you are paying for a middle you do not need.",
          "ease-out-quart / expo-style out — the 'premium' entrance. Big motion, hero reveals, full-bleed panels. Overused it becomes exhausting — reserve for moments that should feel expensive.",
          "springs — see the companion essay: springs are physics, not curves; use them for drag, toss, and anything under a finger.",
        ],
        links: [{ label: "Springs are not easings", href: "/learn/springs-are-not-easings" }],
      },
      {
        h: "Why durations and curves must be tuned together",
        body: [
          "A curve without a duration is half a sentence. The same cubic-bezier(.16, 1, .3, 1) reads as 'snappy' at 240ms, 'confident' at 450ms, and 'slow' at 700ms. Motif's audit rule: entrances for small elements 150–250ms, panels and modals 300–500ms, hero-scale moments 600–900ms. If you must pick one mistake to fix first, it is the 500ms entrance on a 40px tooltip — the duration is telling a bigger story than the element.",
        ],
        code: {
          title: "duration-by-mass.md",
          lang: "text",
          text: `Element mass        Duration        Curve
-----------------  ------------    ----------------------------
tooltip, badge     120-160ms       ease-out
card, dropdown     180-260ms       cubic-bezier(.16, 1, .3, 1)
modal, sheet       300-450ms       cubic-bezier(.16, 1, .3, 1)
hero reveal        600-900ms       cubic-bezier(.16, 1, .3, 1)
dismissal (any)    150-300ms       cubic-bezier(.55, 0, 1, .45)
loop               600-1400ms      linear (opacity pulse)`,
        },
      },
      {
        h: "The audit pass",
        body: [
          "Open any Motif component page and look at its entrance with the Easing Lab open beside it. Feel the curve, then drag the lab's handles to the keyword default and feel the difference. That comparison — bespoke settle vs. CSS keyword — is the entire argument for owning your curves instead of borrowing the browser's.",
          "And when you copy an ease from a library, copy the *intent*: note what job the motion is doing (arrive, dismiss, loop, follow), then pick your own curve for that job. Easing is a language; the cheatsheet just gives you the words.",
        ],
        links: [{ label: "Tune these curves in the Easing Lab", href: "/lab" }],
      },
    ],
  },
  {
    slug: "springs-are-not-easings",
    kicker: "Motion theory",
    title: "Springs are not easings",
    deck: "A spring is physics pretending to be a curve: mass, stiffness and damping describe a system, not a path. Here is when to reach for one, how to read the three knobs, and why your button hover should probably stay a bezier.",
    minutes: 12,
    level: "Intermediate",
    tags: ["springs", "physics", "motion", "gesture"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "The difference is the question it answers",
        body: [
          "An easing answers 'where is it, at time t?'. A spring answers 'what happens when something with mass gets pushed?'. The spring does not compute a path from A to B — it simulates a mass on a damped spring and lets the motion overshoot, wobble or glide depending on how hard you push and how stiff the system is.",
          "That is why a spring is the right tool for anything that feels physical: drag-and-drop, pull-to-refresh, list reordering, a card you fling away. It is the wrong tool for most entrances — an entrance has no physical cause, so a spring's overshoot reads as indecision.",
        ],
        callout: {
          type: "pro",
          title: "Spring physics, in one paragraph",
          text: "Mass makes things heavier (higher mass = lazier start, longer tail). Stiffness makes things snappier (higher stiffness = less travel, faster return). Damping makes things stop (low damping = oscillation, high damping = no overshoot at all). You never tune a spring to a duration; you tune it to a feel, and the duration is whatever it ends up being.",
        },
      },
      {
        h: "Reading the three knobs",
        bullets: [
          "stiffness (or tension): how strongly the spring pulls back. Raise it and motion feels crisp and small; lower it and motion feels loose and floaty. UI springs typically sit high — snappy, not bouncy.",
          "damping (or friction): how quickly energy leaves the system. Low damping gives the overshoot-wobble that makes physics fun; too low and it reads as rubber, which users read as broken.",
          "mass: rarely worth touching in UI — it scales the whole response. If motion feels too slow, raise stiffness first; if it feels jittery, raise damping first.",
        ],
        code: {
          title: "reading-a-spring.md",
          lang: "text",
          text: `Feeling                Fix
--------------------   ----------------------------
too bouncy / rubbery   raise damping
too floaty / slow      raise stiffness
too stiff / dead       lower stiffness slightly
overshoot feels late   raise stiffness AND damping`,
        },
      },
      {
        h: "When springs earn their keep",
        body: [
          "The rule of thumb: if a finger caused the motion, consider a spring. Drag a card and release it — a bezier cannot answer 'how fast was it going when I let go?', but a spring can, because you feed it the release velocity. Reorder a list, dismiss a notification with a swipe, snap a sheet open partway — these are physical events with a velocity at the moment of release.",
          "The other honest case for springs is when a fixed duration would feel wrong at multiple sizes: a spring gives the same *feel* across different distances, where a bezier gives the same *time* and therefore different feels.",
        ],
      },
      {
        h: "When to stay on bezier",
        body: [
          "Entrances and exits are not physical events — nothing pushed the modal, it simply should appear. Give it the settle curve and a duration and be done. Springs there add overshoot to things that should land once, and they make choreographed sequences (hero, then headline, then CTA) nearly impossible to align, because spring timing is a side effect, not a schedule.",
          "Motif's rule: springs for manipulation, beziers for presentation. If a motion does not need to respond to a human hand mid-flight, it does not need physics.",
        ],
        links: [{ label: "Feel a real spring in the Lab", href: "/lab" }],
      },
    ],
  },
  {
    slug: "choreography-question",
    kicker: "Motion theory",
    title: "The choreography question: story or decoration?",
    deck: "Before you animate anything, ask whether the motion tells the story of what changed — or just decorates the fact that something moved. A question that saves more design reviews than any style guide.",
    minutes: 8,
    level: "Beginner",
    tags: ["motion", "choreography", "ux", "principles"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "Every transition is an answer to 'what happened?'",
        body: [
          "When state changes, the user's brain asks a question. Items got reordered: did my item move, and where did it go? A panel opened: where did it come from and where is the close? The list refreshed: what is new? Motion is how the interface answers — and decoration is motion that answers a question nobody asked.",
          "The choreography question is brutally simple: does this motion explain the change it accompanies? If you cannot say what the user now understands that they did not understand before the animation, the animation is decoration — and decoration is the first thing to cut.",
        ],
        callout: {
          type: "warn",
          title: "The delete test",
          text: "For every animation on the page, ask: if I delete it, does the user lose information about what changed? If the answer is no, the motion is not carrying its weight. Keep only the animations that pass — everything else is either decoration or an answer in search of a question.",
        },
      },
      {
        h: "Three questions that make choreography concrete",
        bullets: [
          "Continuity — does the moving thing look like the same object before and after? A card that expands into a detail view must come from the card's position, or the brain treats it as a new object appearing.",
          "Direction — does motion point at the cause? A toast for an error you made should arrive from the element you touched, not drift in from the void.",
          "Priority — does only one thing move like the star? Choreography is casting: one lead, supporting players, everyone else holds still.",
        ],
        code: {
          title: "choreography-checklist.md",
          lang: "text",
          text: `Before shipping a transition, answer:
[ ] What changed?  (one sentence)
[ ] Does the motion show WHAT changed?
[ ] Does it show WHERE it came from / went?
[ ] Is ONE element the star?
[ ] Would deleting it lose information?`,
        },
      },
      {
        h: "The supporting cast rule",
        body: [
          "A layout that animates everything at once reads as chaos; a layout that animates only the changed thing reads as calm. Motif's staggered entrances exist precisely for this: when a grid of cards appears, the *reason* they appear (a filter applied, a tab switched) is the story, and the stagger is the punctuation that keeps the eye from drowning. Sequence is how you make many motions read as one story instead of many decorations.",
        ],
        links: [{ label: "See a stagger done right", href: "/components/staggered-list-entrance" }],
      },
    ],
  },
  {
    slug: "micro-interactions-pay-rent",
    kicker: "Motion theory",
    title: "Micro-interactions that pay rent",
    deck: "Twenty tiny motions, each with a measurable UX job: confirm, guide, correct, or reward. If a micro-interaction cannot name its job, it is just wiggle.",
    minutes: 9,
    level: "Beginner",
    tags: ["micro-interactions", "feedback", "ux", "motion"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "The four jobs every micro-interaction can have",
        body: [
          "A micro-interaction pays rent when it does one of four things. Confirm: the system heard you (button press, checkbox tick). Guide: the system shows what is next (focus ring, suggested chip). Correct: the system catches a mistake before it costs you (field shake, inline error). Reward: the system marks a milestone (counter roll, confetti at a real achievement).",
          "The test is the same as choreography: name the job. 'It feels nice' is not a job — it is a decoration with good posture.",
        ],
        bullets: [
          "Button press: 0.1–0.15s scale to 0.97 with immediate visual response — confirms the tap landed before the action resolves.",
          "Toggle: a thumb that travels with the state change and a background that recolors in the same frame — the state and the motion must never disagree.",
          "Copy button: text swap to '✓ Copied' inside the button, not a toast from across the screen — the confirmation lives where the action happened.",
          "Number change: odometer roll only for the changed digits — rolling every digit on 1,998 → 1,999 makes the eye read three changes that did not happen.",
          "Field error: a 4px horizontal shake on the field plus a message in the live region — motion draws the eye, the message carries the meaning.",
          "Focus: a visible ring with a 120ms fade-in — never an instant pop, never a slow bloom; focus is a promise the keyboard made.",
          "Scroll anchor: the scroll-progress bar fills in step with the actual scroll, not a timer — it must never lie about position.",
          "Drag: the dragged element goes 0.95 scale and shadows up — it is now 'in hand', visually separated from the page.",
          "Drop target: the target outline brightens as the dragged item approaches, not on hover-over-anywhere — proximity is the cue.",
          "List reorder: displaced items glide aside with a spring — the user must see where their item will land before releasing.",
          "Delete: a two-step confirm where the first click visibly arms the button ('Delete?' turns red) — the state change is the feedback.",
          "Loading: skeleton shimmer fills the shape of what is coming — it answers 'where will my content be?' instead of 'wait'.",
          "Pull-to-refresh: a spinner that only starts once the pull passes the threshold, and snaps back if it does not — the threshold is the rule.",
          "Empty drop: the file-drop zone pulses once when a file is rejected with a reason — rejection must never be silent.",
          "Command palette: results re-rank as you type and the active row moves with the arrow keys — selection motion tracks the keys 1:1.",
          "Swipe to dismiss: the card follows the finger and the delete affordance reveals underneath — the finger is the physics.",
          "Notification bell: the badge appears with a one-beat pop and the bell nudges 8° — two cues, same message, neither spammy.",
          "Infinite scroll: the sentinel row shows a 3-dot leader while fetching, then new cards settle in — loading is named, arrival is calm.",
          "Save indicator: 'Saved' fades to 'Saved 2m ago' — the motion confirms, then the text ages honestly.",
          "Theme switch: the background cross-fades while text stays put — the light change is the story, text legibility is never compromised.",
        ],
      },
      {
        h: "Rent is paid in attention, not pixels",
        body: [
          "A micro-interaction that fires every time will be tuned out by the brain inside a week. The ones that keep paying rent are the ones that fire only when they carry news: the odometer rolls on the number that matters, the shake fires on the mistake, the confetti fires on the milestone. Frequency is a design decision — spend motion where the user is deciding, and keep it silent where they are cruising.",
        ],
        links: [{ label: "Micro-feedback pieces in the library", href: "/components/toast-stack" }],
      },
    ],
  },
  {
    slug: "will-change-is-a-promise",
    kicker: "Performance",
    title: "Will-change is a promise — keep it or break it",
    deck: "The will-change property tells the browser to prepare a compositor layer before it is needed. Useful, yes. But every promise has a cost: layer memory, and the jank you create when you break the promise by never using the layer.",
    minutes: 10,
    level: "Advanced",
    tags: ["performance", "css", "compositing", "will-change"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "What the property actually does",
        body: [
          "will-change: transform tells the browser 'this element is about to animate its transform — promote it to its own compositor layer now, so the animation does not have to do the promotion on the first frame.' That first-frame promotion is exactly where stutter comes from, so the promise removes it.",
          "The cost: a compositor layer is a texture in GPU memory. Ten elements with will-change are ten textures. A hundred — a scroll-linked hero, a staggered grid, every card in a bento — and you have traded first-frame stutter for a memory bill and, ironically, slower scrolling as the GPU fights to keep all those layers alive.",
        ],
        callout: {
          type: "warn",
          title: "The broken promise",
          text: "The classic bug is will-change: transform on a hover target that never animates, or left on after the animation ends. The browser keeps the layer alive indefinitely, and the page quietly pays for layers that do nothing. will-change is a promise: when the animation finishes, you must revoke it — or the browser keeps reserving the table for a guest who left.",
        },
      },
      {
        h: "The rules that keep the promise honest",
        bullets: [
          "Apply will-change in JavaScript right before the animation starts, and remove it in the animationend / finished handler. CSS-only: use it on the :hover state or a class that toggles with the animation.",
          "Limit it to transform and opacity — the two properties that animate on the compositor. will-change: all is a panic attack, not a strategy.",
          "Never apply it to more than a handful of elements. If you need dozens of layers, the problem is the layout, not the promotion.",
          "Never put it on a resting state that does not animate — that is the promise with no event.",
          "Prefer the browser's own judgment for one-off entrances: most modern engines promote at animation start fast enough that will-change is only needed for long or heavy animations.",
        ],
        code: {
          title: "honest-will-change.ts",
          lang: "ts",
          text: `el.addEventListener("mouseenter", () => {
  el.style.willChange = "transform";      // promise made
  el.animate([{ transform: "scale(1.06)" }], { duration: 180 });
});
el.addEventListener("animationend", () => {
  el.style.willChange = "auto";           // promise kept & released
});`,
        },
      },
      {
        h: "When it genuinely pays",
        body: [
          "Three cases earn their keep. Long-running animations: a drifting aurora band or a continuous marquee that will animate for seconds, where a missed frame at any point is visible. Scroll-linked effects: an element that must already be a layer when the scroll handler starts writing to it. And many elements transforming simultaneously — a full grid stagger — where the browser would otherwise promote fifty layers in one frame.",
          "Everywhere else, measure first. If the entrance is one card, let the browser do its job. will-change is an optimization you apply to a problem you have measured, not a garnish you sprinkle for luck.",
        ],
        links: [{ label: "A long-running layer done right", href: "/components/aurora-veil" }],
      },
    ],
  },
  {
    slug: "why-60fps-feels-like-24fps",
    kicker: "Performance",
    title: "Why 60fps feels like 24fps",
    deck: "Smoothness is not frame rate — it is frame pacing. A steady 24 feels calm; a stuttery 60 feels broken. What jank actually is, why the eye forgives slow but not uneven, and how to measure the difference.",
    minutes: 11,
    level: "Intermediate",
    tags: ["performance", "fps", "jank", "browser"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "The eye forgives slow. It does not forgive uneven.",
        body: [
          "Film has run at 24 frames per second for a century and nobody calls it janky, because every frame arrives exactly when expected — 41.7ms apart, no exceptions. A web animation at a steady 30fps reads as smooth but slightly dreamy. The same animation averaging 30fps with frames arriving at 8ms, 40ms, 12ms, 55ms reads as broken — because the brain does not perceive frame rate, it perceives *gaps*.",
          "Jank is not 'low fps'. Jank is a frame that arrives late, especially after a run of on-time frames. The eye has a rhythm detector, and a single late frame is a skipped heartbeat.",
        ],
        callout: {
          type: "tip",
          title: "The useful metric: longest frame, not average",
          text: "DevTools performance traces show a bar per frame; the ones over 16.7ms that cluster are your jank. The average can say 55fps while one 90ms frame breaks the animation's spine. Hunt the worst frame, not the mean.",
        },
      },
      {
        h: "Where the gaps come from",
        bullets: [
          "Main-thread work: layout and paint are the usual suspects — animating width or top forces layout every frame, and layout takes whatever time the DOM gives it.",
          "Compositor interruptions: a layer is promoted mid-animation, or a new layer appears (a dropdown opening under the animation) and the GPU re-composites.",
          "Garbage collection: a rAF loop that allocates objects every frame (strings, arrays) makes the GC pause the main thread unpredictably.",
          "Background tabs waking up, extension work, or a font swap that triggers a reflow mid-sequence — the classic invisible jank.",
          "Scroll-handler pileup: a scroll listener that writes layout (reads offsetTop, then writes style) forces synchronous reflow on every scroll event.",
        ],
        code: {
          title: "frame-budget.md",
          lang: "text",
          text: `16.7ms  total budget at 60fps (one frame)
 8ms    style + layout          <- keep tiny
 3ms    paint
 4ms    compositor
 1ms    JavaScript
-----
Keep JS under 4-5ms per frame and the
rest of the budget survives real devices.`,
        },
      },
      {
        h: "Why the fix is usually fewer moving parts",
        body: [
          "The cheapest way to a steady 60 is to animate only transform and opacity (compositor-only, no layout, no paint) and to promote long-running layers explicitly with will-change. But the deeper fix is humility: a page where four things animate at once will fight for the budget forever. Cut the animation to the one that tells the story, and steady frames come back — because the fastest frame is the one you did not ask for.",
        ],
        links: [
          { label: "Will-change is a promise", href: "/learn/will-change-is-a-promise" },
          { label: "GPU animation, explained plainly", href: "/learn/gpu-animating-without-asking" },
        ],
      },
    ],
  },
  {
    slug: "gpu-animating-without-asking",
    kicker: "Performance",
    title: "Animating on the GPU without asking",
    deck: "transform and opacity are the only properties that animate on the compositor without touching layout or paint. Here is the pipeline, plain: what the browser does each frame, why those two properties skip the expensive steps, and the traps that sneak layout back in.",
    minutes: 12,
    level: "Advanced",
    tags: ["performance", "compositor", "transform", "browser"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "The three-stage pipeline, named",
        body: [
          "Every frame the browser runs a pipeline: style, layout, paint, composite. Style resolves your CSS. Layout computes geometry — where every box sits, and it is the expensive one because one change can cascade through the whole document. Paint turns boxes into pixels. Composite stitches the layers together on the GPU.",
          "Animate width and the browser must redo layout (everything around the element moves), then repaint, then composite. Animate transform and the browser skips straight to composite: the element's pixels are already painted on their own layer, and the GPU just moves that texture. Same for opacity, which only blends layers. That is the whole secret — those two properties are cheap because they are the only ones that never invalidate the earlier stages.",
        ],
        code: {
          title: "pipeline.md",
          lang: "text",
          text: `Animating width / height / top / left:
  style -> LAYOUT -> PAINT -> composite   (all three, every frame)

Animating transform / opacity:
  style -> composite                      (layout + paint skipped)`,
        },
      },
      {
        h: "The traps that sneak layout back in",
        bullets: [
          "Animating transform, then reading offsetWidth in the same frame: the read forces a synchronous layout flush — the 'layout thrash' that silently defeats the compositor.",
          "A transform animation on an element whose ancestor resizes in the same frame: the ancestor's layout change re-lays-out the transformed element's layer anyway.",
          "filter, box-shadow, and border-radius animate on the main thread — shadow and radius changes repaint the layer every frame. A moving card with a big blur shadow is a paint-heavy card.",
          "clip-path and mask are compositor-adjacent but vary wildly by browser; test before trusting.",
          "Content inside a transformed element that reflows (text wrapping, image decode) forces the layer to repaint mid-animation.",
        ],
        callout: {
          type: "pro",
          title: "The safe recipe",
          text: "Move with transform. Fade with opacity. Keep shadows and gradients still while things move. If an element must move AND glow, put the glow on a separate still layer beneath the moving one — the GPU composites the pair for the price of one moving texture.",
        },
      },
      {
        h: "How to check you actually got the fast path",
        body: [
          "Open the performance panel, record the animation, and look for green 'Layer tree' activity with no tall yellow layout blocks. Then open the rendering panel and turn on 'Layer borders': composited layers show a border, and a healthy animation shows the moving element on its own layer while the page around it stays still. If the whole page repaints every frame, the animation did not make it to the GPU — it is doing layout and paint, and no amount of easing will make that smooth.",
        ],
        links: [{ label: "Why 60fps can still feel like 24fps", href: "/learn/why-60fps-feels-like-24fps" }],
      },
    ],
  },
  {
    slug: "scroll-speed-is-a-type-choice",
    kicker: "Motion theory",
    title: "Scroll speed is a type choice",
    deck: "Reveal timing is typography in time: the same paragraph reads differently revealed fast or slow, and the right speed changes with the length of the line, the density of the page and the patience of the reader.",
    minutes: 9,
    level: "Intermediate",
    tags: ["scroll", "reveal", "reading", "motion"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "Reading has a rhythm, and motion can break it",
        body: [
          "When someone scrolls a page, they are reading at their own pace — scanning, pausing, backtracking. A reveal animation that is slower than the reader's pace turns every paragraph into a wait. A reveal that is faster than the eye can register is invisible noise. The reveal speed is effectively a typographic decision: it sets the pace at which the reader is allowed to receive the text.",
          "The mismatch is why long-form pages with aggressive reveals feel exhausting: the reader wants to skim, and the page keeps demanding they wait for the next block. Reads like a conversation with someone who pauses after every word.",
        ],
      },
      {
        h: "Tuning reveals to content density",
        bullets: [
          "Dense paragraphs (long-form, docs): reveal whole blocks at 300–450ms or do not reveal at all — the reader needs the text now, and the motion is a tax.",
          "Sparse statements (landing pages, one line per section): slower reveals at 500–700ms build anticipation — each line is an event, so it can take a beat.",
          "Headlines: fast settle (200–300ms) with a slight upward travel — a headline that takes too long to become readable makes the reader wait for the sentence to start.",
          "Lists and grids: stagger at 60–90ms per item — the stagger should read as one wave, not a queue. Over 120ms per item and the eye is waiting at the end of the row.",
          "Images: reveal with a 150–250ms scale from 1.02 rather than a slide — images reward a settle, not a journey.",
        ],
        code: {
          title: "reveal-by-content.md",
          lang: "text",
          text: `Paragraph, long-form    300-450ms   opacity + 8px rise
Landing statement       500-700ms   opacity + 16px rise
Headline                200-300ms   opacity + 4px rise
Grid item stagger        60-90ms    per item, one wave
Image                   150-250ms   scale 1.02 -> 1, no travel`,
        },
      },
      {
        h: "Scroll-linked vs. scroll-triggered",
        body: [
          "Scroll-triggered (element enters viewport, plays once) is the right default for text: it respects the reader's pace because it only plays when the reader arrives. Scroll-linked (progress bar, parallax — motion bound to scroll position) is right for atmosphere: a hero gradient that shifts as you leave, a progress bar that tracks reading. The failure is using scroll-linked motion for content the reader is trying to read — text that moves with the scroll fights the eye's own tracking.",
          "One rule ties it together: if the reader is reading, trigger it once and let it rest. If the reader is moving through atmosphere, link it to the scroll. Reading rhythm and atmosphere are different users of the same scroll.",
        ],
        links: [{ label: "Progress that tracks reading honestly", href: "/components/scroll-progress" }],
      },
    ],
  },
  {
    slug: "the-200ms-click-window",
    kicker: "Perception",
    title: "The 200ms click window",
    deck: "Between the finger landing and the interface answering sits a 200-millisecond window where the user decides whether the product is fast or slow. What fills that window decides how the whole app feels.",
    minutes: 8,
    level: "Beginner",
    tags: ["perception", "latency", "feedback", "ux"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "Perceived latency is a story, not a timer",
        body: [
          "Research on perceived responsiveness keeps landing on the same numbers: under 100ms the response feels instant. Between 100 and 300ms the user notices the wait but credits the interface with intent. Past 300ms the user starts to doubt whether the click registered at all — and that doubt is the expensive one, because doubt produces re-clicks, and re-clicks produce double-submits, and double-submits produce duplicates, and duplicates produce tickets.",
          "The trick of the 200ms window: the user does not need the *result* in 200ms — they need *evidence* in 200ms. A button that compresses the instant it is pressed buys the slow network call that follows. The click window is filled by confirmation, and confirmation is motion's job.",
        ],
        callout: {
          type: "pro",
          title: "The 200ms budget, spent",
          text: "0–60ms: press feedback (scale, fill). 60–200ms: state change (spinner, optimistic update, 'Saving…'). 200ms+: if the real result is late, the UI must already look busy — a calm spinner beats a frozen button.",
        },
      },
      {
        h: "Optimistic updates are the professional move",
        body: [
          "The interface that feels fastest is the one that acts as if the network does not exist and corrects itself if it turns out to be wrong. Toggling a switch flips it instantly and shows 'syncing'; only on failure does it flip back with a reason. That is filling the click window with the product's own confidence.",
          "The rule for optimism: only optimistic-update actions that are reversible or low-cost. A like, a toggle, a reorder — yes. A payment — never. Optimism is a design decision about who apologises when the network disagrees.",
        ],
      },
      {
        h: "What steals the window",
        bullets: [
          "No press state at all: the button sits still for 300ms, then the result arrives — the user cannot tell when the click registered.",
          "Disabled-looking buttons: grey until the handler runs, making the user wonder whether they may click at all.",
          "Double-submit traps: a slow submit that lets a second click through; the second click is the click window's revenge.",
          "Spinner-only feedback on fast actions: a 40ms action that shows a spinner for 300ms feels slower than the same action with no feedback at all.",
          "Navigation without a hint: clicking a card that takes 400ms to navigate with zero feedback in between.",
        ],
      },
      {
        h: "The motion recipe for the window",
        code: {
          title: "press-feedback.css",
          lang: "css",
          text: `button:active { transform: scale(.97); }
/* instant, 60ms, then the state change takes over */

.card[data-pending] .spinner { opacity: 1; }
/* the 200ms window stays honest: pressed -> busy -> done */`,
        },
        links: [{ label: "Press feedback that feels instant", href: "/components/halo-button" }],
      },
    ],
  },
  {
    slug: "reduced-motion-beyond-the-switch",
    kicker: "Accessibility",
    title: "Reduced motion beyond the switch",
    deck: "prefers-reduced-motion is a switch, but accessibility is a second design: a calmer experience with the same information, not a stripped one. Designing the reduced experience deliberately, not by deletion.",
    minutes: 11,
    level: "Intermediate",
    tags: ["a11y", "reduced motion", "motion", "vestibular"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "The switch is a signal, not a sentence",
        body: [
          "prefers-reduced-motion: reduce is one of the few accessibility signals a browser sends unprompted — it means the person at the other end has told their operating system that motion makes them uncomfortable or unwell. Treating it as a binary that blanks all animation is like responding to a wheelchair user by removing the stairs *and* the building. The goal is the same journey, with a different movement system.",
          "The reduced experience should still communicate state, still guide attention, still reward progress — just without vestibular triggers: no large movement, no parallax, no persistent drifting, no simulated motion sickness.",
        ],
        bullets: [
          "Keep opacity fades (200–300ms) — fading does not trigger vestibular responses and still carries state changes.",
          "Replace parallax with stillness plus a subtle shadow or gradient change; the depth cue survives without the motion.",
          "Replace autoplaying carousels with manual controls that are more visible, not less — the reduced experience gives the user control.",
          "Replace long springs and overshoot with short settles — the information lands either way.",
          "Replace scroll-linked reveals with content that is simply visible — a reader with motion sensitivity should not have to scroll-trigger every paragraph into existence.",
        ],
      },
      {
        h: "The second-design principle",
        body: [
          "The professional framing is to design the reduced experience as a *second design*, not a deletion pass. Ask: what is this animation's job? If the job is 'show the user the item was added', then the reduced version needs a different mechanism for that same job — a color change, a checkmark, a position shift. If the job is pure atmosphere, cut it — but say so in the code, so the next designer knows the cut was a decision.",
          "Motif's motion-spec prompt bakes this in: every specified animation ships with its reduced branch in the same spec — what plays (nothing that moves layout), what fades (opacity only), and the exact media query hook. The reduced experience is in the contract, not bolted on after the audit.",
        ],
        code: {
          title: "reduced-branch.css",
          lang: "css",
          text: `@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
  /* then re-enable the deliberate fades: */
  .toast { transition: opacity 250ms ease; }
  .progress-bar { transition: width 200ms ease; }
}`,
        },
        links: [{ label: "The a11y-strict prompt brief", href: "/prompts/accessibility-strict-page" }],
      },
    ],
  },
  {
    slug: "glass-part-two-when-glass-belongs",
    kicker: "Craft & CSS",
    title: "Glass, part two: when glass belongs",
    deck: "Frosted glass is the most overused effect in modern UI. Part two of the glass series: the three situations where blur-and-translucency genuinely earns its place, and the two where it is camouflage for a weak layout.",
    minutes: 10,
    level: "Intermediate",
    tags: ["glass", "backdrop-filter", "css", "craft"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "Where glass physically makes sense",
        body: [
          "Glass in UI works when the metaphor holds: something is *on top of* something else, and the user benefits from seeing the underneath through the top. Three cases earn it. Floating navigation over scrolling content: the nav stays legible while the page moves under it — glass is the excuse for a bar that is not opaque. Modals and sheets over a busy backdrop: the blur keeps the page present enough for context but quiet enough for focus — glass is focus management. And media surfaces over imagery: a caption bar over a photo, a control bar over a video — the image stays visible, the control stays readable.",
        ],
        callout: {
          type: "tip",
          title: "The legibility test",
          text: "Blur the background 8–16px and put the text over it. If the text needs extra shadow, a darker scrim, or a higher blur to pass contrast, the glass is decorative — make the panel opaque or nearly so. Glass must earn its translucency with legibility it does not have to cheat for.",
        },
      },
      {
        h: "Where glass is camouflage",
        bullets: [
          "Over flat colour: blurring a flat background produces nothing but a muddy tint — if there is nothing behind the glass, there is no reason for the glass.",
          "Over text the user needs to read through: glass over a paragraph is a readability tax on whatever is beneath.",
          "As a card style on a page with no layering: glass implies depth; a page of floating panels with nothing beneath them reads as indecision.",
          "Where backdrop-filter costs frames: every blurred layer repaints as content scrolls beneath it — on low-end devices a hero with a blurred scrim can drop the scroll to jank. If you cannot hold 60fps with the blur, the glass is too expensive for its job.",
        ],
      },
      {
        h: "The recipe that behaves",
        code: {
          title: "honest-glass.css",
          lang: "css",
          text: `.glass {
  background: rgb(255 255 255 / .55);   /* tint first */
  backdrop-filter: blur(14px) saturate(1.4); /* blur second */
  border: 1px solid rgb(255 255 255 / .35);   /* edge light */
  box-shadow: 0 8px 32px rgb(0 0 0 / .12);    /* separation */
}
@supports not (backdrop-filter: blur(1px)) {
  .glass { background: rgb(255 255 255 / .92); } /* fallback */
}`,
        },
        links: [{ label: "The original glass essay", href: "/learn/glass-is-a-material" }],
      },
    ],
  },
  {
    slug: "shadow-discipline",
    kicker: "Craft & CSS",
    title: "Shadow discipline",
    deck: "Shadows are an elevation system, not an ornament budget. Layer counts, elevation scales, and the one shadow rule that separates systems that feel physical from pages that look smudged.",
    minutes: 9,
    level: "Intermediate",
    tags: ["shadows", "elevation", "css", "design systems"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "Shadow is a Z-axis language",
        body: [
          "Every shadow on a page says how high the element floats above the surface. When a design system lets each card choose its own shadow, the page silently disagrees about physics: this card floats at 2px, that one at 24px, and the eye registers the inconsistency as messiness it cannot name. Elevation is a scale, like type — usually four rungs are enough.",
          "The discipline: an element's shadow should be a function of its *role* (resting, hovered, overlaying, modal), not of its designer's mood. Same role, same shadow, everywhere.",
        ],
      },
      {
        h: "The four-rung scale that survives",
        bullets: [
          "rung 1 — resting cards on a flat surface: 0 1px 2px rgb(0 0 0 / .06) plus a hairline border. Barely there; the card sits on the page.",
          "rung 2 — hover and interactive elevation: 0 4px 12px rgb(0 0 0 / .10). One rung up, clearly lifted, still calm.",
          "rung 3 — overlays, dropdowns, popovers: 0 12px 32px rgb(0 0 0 / .14). The element now floats above the content it covers.",
          "rung 4 — modals and sheets: 0 24px 64px rgb(0 0 0 / .20) plus a 0.5–1px rim light. The modal is the tallest thing on the page; the scrim beneath does the rest.",
        ],
        code: {
          title: "elevation-tokens.css",
          lang: "css",
          text: `:root {
  --shadow-1: 0 1px 2px rgb(0 0 0 / .06), 0 0 0 1px rgb(0 0 0 / .02);
  --shadow-2: 0 4px 12px rgb(0 0 0 / .10);
  --shadow-3: 0 12px 32px rgb(0 0 0 / .14);
  --shadow-4: 0 24px 64px rgb(0 0 0 / .20), 0 1px 0 rgb(255 255 255 / .06) inset;
}
.card:hover  { box-shadow: var(--shadow-2); }
.dropdown   { box-shadow: var(--shadow-3); }
.modal      { box-shadow: var(--shadow-4); }`,
        },
      },
      {
        h: "When not to glow",
        body: [
          "The glow — a colored, larger-radius shadow — is a spotlight, and spotlights are for one element per scene. A primary CTA may glow; a row of four buttons may not, or the page looks like a casino. The discipline for glows: colored shadows only on the single action you are directing the eye toward, sized tight to the element, and never as a resting state for everything hoverable.",
          "And the silent killer: shadows under text. Text shadows are almost never needed on dark UI — if text needs a shadow to be readable, the background is too busy, and the fix is the background, not the crutch.",
        ],
        links: [{ label: "Elevation with real hover states", href: "/components/tilt-card" }],
      },
    ],
  },
  {
    slug: "grid-systems-that-dont-shout",
    kicker: "Craft & CSS",
    title: "Grid systems that don't shout",
    deck: "Twelve columns is a default, not a law. Layout rhythm without grid anxiety: the three questions that actually decide column count, and how to make a grid disappear into the design instead of announcing itself.",
    minutes: 8,
    level: "Beginner",
    tags: ["grid", "layout", "css", "rhythm"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "A grid is a rhythm instrument, not a cage",
        body: [
          "A grid exists so the eye can relax — content aligned to shared vertical lines reads as organized without the reader ever counting columns. The moment a grid *shouts* is the moment alignment becomes visible as pattern: everything snapped to the same few positions, every card the same width, every gap identical, so the page looks like a spreadsheet wearing a nice font.",
          "Rhythm beats symmetry. A page whose cards share a gutter and an edge but vary in internal structure reads as designed; a page whose every module is the same box reads as templated.",
        ],
        bullets: [
          "Choose columns by content, not fashion: prose wants a 6-column book grid; a pricing page wants 3; a gallery wants 4–6; a dashboard wants 12 because its widgets are genuinely heterogeneous. If every module is the same shape, you needed 3 columns, not 12.",
          "Gutter before column count: pick the gutter (16–32px on desktop) that makes adjacent content feel related-but-distinct, then divide the rest. Changing the gutter changes the reading of every module; changing column count changes only the module widths.",
          "Break the grid on purpose, once: a full-bleed hero or a pulled quote that ignores the columns proves the grid is a decision, not a constraint — one deliberate break per page is punctuation; five is chaos.",
          "Alignment is a promise: if two modules share an edge, their interiors should share its logic — a card aligned to the left edge should start its text on that edge, not 20px in for no reason.",
        ],
      },
      {
        h: "The quiet grid in practice",
        code: {
          title: "quiet-grid.css",
          lang: "css",
          text: `.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: clamp(16px, 2.5vw, 32px);
}
.module--prose  { grid-column: span 6; }  /* book rhythm */
.module--card   { grid-column: span 4; }
.module--wide   { grid-column: span 8; }
.module--full   { grid-column: 1 / -1; }   /* the one break */`,
        },
        links: [{ label: "Grids at work in a bento layout", href: "/components/bento-feature-grid" }],
      },
    ],
  },
  {
    slug: "fluid-type-without-magic-numbers",
    kicker: "Craft & CSS",
    title: "Fluid type without magic numbers",
    deck: "clamp() is everywhere and understood nowhere. The math that makes fluid type explainable — minimum, maximum, and a slope you can defend in a code review instead of a number you found in a tweet.",
    minutes: 9,
    level: "Intermediate",
    tags: ["typography", "clamp", "fluid type", "css"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "What clamp actually computes",
        body: [
          "clamp(min, preferred, max) picks the middle value when it fits between the bounds. The middle is usually a vw-based expression, and that expression is a straight line: at some viewport width it equals the minimum, at another it equals the maximum, and between them type scales linearly. Magic numbers are just slopes chosen by trial; the fix is choosing the slope on purpose.",
          "The defensible recipe: pick your type size at a small viewport (the minimum), pick it at a large viewport (the maximum), and decide at which widths the size stops changing. The vw slope is then arithmetic: (max - min) / (max-width - min-width).",
        ],
        code: {
          title: "fluid-type.ts",
          lang: "text",
          text: `Goal: 16px @ 360px viewport -> 20px @ 1280px viewport.
Slope = (20 - 16) / (1280 - 360) = 4 / 920 = 0.00435

clamp(16px, 0.435vw + ?px, 20px)

Solve the intercept at 360px:
0.00435 * 360 = 1.57 -> need 16 - 1.57 = 14.43px base

clamp(16px, calc(0.435vw + 14.43px), 20px)
-- a line you can explain in one sentence.`,
        },
      },
      {
        h: "The rules that keep it sane",
        bullets: [
          "Anchor every clamp to real breakpoints you already use — the min viewport (small phone), the max viewport (large desktop). If your container maxes at 1200px, scaling type to 2000px viewports is scaling for empty space.",
          "Never clamp a single size in isolation — scale the whole type ramp together so the hierarchy's *ratios* stay constant, or headings will outgrow their paragraphs at some width.",
          "Use rem for the bounds so user font-size settings still scale your type; a clamp in px ignores the browser's minimum font size and accessibility settings.",
          "Container queries change the game: with container query units you can scale type to the *component* width, which matters for sidebars and cards that never reach viewport scale.",
        ],
      },
      {
        h: "When fluid type is the wrong tool",
        body: [
          "Long-form reading: body text that grows with the viewport fights the reader's preferred measure. For articles, fix the measure (60–75ch) and let font size stay steady across a wide range — fluid type belongs to display and headings, not paragraphs. If a line of body copy changes size between two monitors side by side, a reader who notices will not thank you.",
        ],
        links: [{ label: "Type in a real editorial layout", href: "/learn/print-inspired-editorial" }],
      },
    ],
  },
  {
    slug: "css-nesting-now",
    kicker: "Craft & CSS",
    title: "CSS nesting, now",
    deck: "Native CSS nesting shipped in every evergreen browser. Flatter files, real cascade semantics — and a syntax trap that will cost you a debugging afternoon if nobody warns you.",
    minutes: 8,
    level: "Intermediate",
    tags: ["css", "nesting", "modern css"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "What native nesting changes",
        body: [
          "Native nesting lets a selector live inside its parent, exactly like the preprocessors taught us — but with one crucial difference: it is the browser's own cascade, no build step, no indentation rules from a tool that left the room. The payoff is files that group a component's styles where the eye expects them: the card's padding, its title rule, and its hover state in one readable block instead of three scattered locations.",
        ],
        code: {
          title: "nested-card.css",
          lang: "css",
          text: `.card {
  padding: 1.5rem;
  border-radius: 1rem;

  & h2 { font-size: 1.25rem; }        /* descendant */
  & > .title { font-weight: 700; }    /* child */
  &:hover { translate: 0 -2px; }      /* self pseudo */
  &.is-selected { border-color: var(--accent); }

  @media (width < 640px) { padding: 1rem; }  /* nested at-rule */
}`,
        },
      },
      {
        h: "The trap: specificity climbs silently",
        body: [
          "Every nesting level adds specificity. .card & h2 computes as (0,1,1) — one class, one type — while .card { & .title & .meta } keeps stacking. Deeply nested selectors quietly outrank the flat overrides you write later, and the 'why is my override not applying' hunt begins. The discipline: nest for grouping, not for depth. Two levels deep is the comfort zone; three is where you start paying.",
        ],
        callout: {
          type: "warn",
          title: "The bare & pitfall",
          text: "& h2 and & .title and &:hover all behave differently from each other and from preprocessor habits. & concatenates the parent selector as-is: .card & h2 means 'h2 inside .card', but & .title inside .card means '.card .title' — the space matters. Read every & as 'the parent selector, literally here' and the syntax stops surprising you.",
        },
      },
      {
        h: "Mixing nesting with the cascade layers",
        body: [
          "Nesting composes beautifully with @layer: put the component layer inside the nesting and the whole file reads top-to-bottom as one story. Nesting is not a rewrite — it is a reorganization of files you already have, and the safest migration is bottom-up: nest one component a week, keep the specificity shallow, and let the cascade layers do the arbitration that nesting must not.",
        ],
        links: [{ label: "CSS craft in a five-move essay", href: "/learn/css-depth-five-moves" }],
      },
    ],
  },
  {
    slug: "container-queries-cookbook",
    kicker: "Craft & CSS",
    title: "Container queries cookbook",
    deck: "Component-first responsive means the card does not care what page it lives on. Four recipes that replace viewport-width hacks with container queries that actually survive production.",
    minutes: 10,
    level: "Advanced",
    tags: ["container queries", "responsive", "css", "components"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "The shift: from viewport to container",
        body: [
          "Viewport queries answer the wrong question for components: a card in a narrow sidebar and the same card in a wide content column face different viewports but identical containers. Container queries let the component respond to its own width — the sidebar card stacks its media above its text; the content-column card puts them side by side, from the same CSS, no duplication.",
          "The mental model flips from 'how big is the screen?' to 'how much room does this component have?' — which is the question components can actually answer about themselves.",
        ],
        code: {
          title: "setup.css",
          lang: "css",
          text: `.card-grid {
  container-type: inline-size;   /* size queries off this container */
  container-name: card;          /* optional, for specificity */
}

.card { display: grid; gap: 1rem; }
.card__media { aspect-ratio: 4 / 3; }

@container card (width > 480px) {
  .card { grid-template-columns: 240px 1fr; }
  .card__media { aspect-ratio: auto; height: 100%; }
}`,
        },
      },
      {
        h: "Recipe 1 — the media object that knows its width",
        body: [
          "The classic: an avatar-plus-text row. Narrow (in a drawer), stack avatar above text. Wide, avatar left. One component, both layouts, and the breakpoint is the container's own width — it behaves identically in a sidebar at 1400px viewport and a phone at 700px, because the phone is the wide context for that drawer.",
        ],
        bullets: [
          "Recipe 2 — the stats band: five stats in a full-width band become three-plus-two at container 700px, then two-plus-two-plus-one at 480px. The band queries its container, so embedding the band in a page section or a dashboard card both work without a second stylesheet.",
          "Recipe 3 — the pricing card: price tables flip from rows to stacked tiers by container width; the same card component serves the marketing page (wide container) and an embedded comparison widget (narrow container).",
          "Recipe 4 — the hero: hero components with container queries can live on the homepage (full width, split layout) and on a campaign page (contained, stacked) without variants or props-for-layout.",
        ],
        callout: {
          type: "tip",
          title: "The gotcha that bites everyone",
          text: "container-type: inline-size makes the element a size container — but it also makes the element's size depend on its contents only in the block axis, and it changes how percentage heights resolve. The classic breakage: an img with height: 100% inside a container query stops resolving. Query the wrapper, not the element whose height you are sizing.",
        },
      },
      {
        h: "When viewport queries still win",
        body: [
          "Page chrome — navs, sidebars, global layout — is genuinely viewport-sized and should stay on viewport queries. The rule of thumb: container queries for anything reusable, viewport queries for anything architectural. And container query units (cqw, cqh) for sizing type and spacing inside components complete the story — fluid type that responds to the component, not the monitor.",
        ],
        links: [{ label: "Container-size type, applied", href: "/learn/fluid-type-without-magic-numbers" }],
      },
    ],
  },
  {
    slug: "has-is-finally-useful",
    kicker: "Craft & CSS",
    title: ":has() is finally useful",
    deck: "The parent selector that CSS refused us for twenty years shipped, and then the internet used it to write card hacks. Three :has() patterns that survive production, plus the performance reflex that keeps them cheap.",
    minutes: 9,
    level: "Advanced",
    tags: ["css", "has", "selectors", "modern css"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "What :has() actually gives you",
        body: [
          ":has() lets a selector test its own descendants and siblings — the parent selector, the previous-sibling selector, the container-aware selector. .card:has(img) matches a card only if it contains an image. That single capability collapses dozens of JavaScript class-toggling rituals into declarative CSS: form states, card variants, layout adjustments driven by content.",
        ],
        code: {
          title: "the-three-patterns.css",
          lang: "css",
          text: `/* 1 — container adapts to its content */
.stats-grid > .panel:has(.sparkline) { grid-column: span 2; }

/* 2 — state travels to the parent */
.field:has(input:user-invalid) {
  border-color: var(--danger);
}
.field:has(input:focus-visible) {
  box-shadow: 0 0 0 3px var(--focus-ring);
}

/* 3 — sibling reacts to sibling */
.tabs > .tab:has(:checked) {
  color: var(--ink);
  box-shadow: inset 0 -2px 0 var(--accent);
}`,
        },
      },
      {
        h: "The patterns that earn their keep",
        bullets: [
          "Form validation without JS: .field:has(:user-invalid) styles the whole field group when its input fails — the message, the border, the icon, all in one rule, updated live by the browser.",
          "Content-driven layout: a panel that widens when it contains a table, a card that drops its media row when the media is missing — layout responds to what is actually in the box.",
          "Focus-within that means it: :has(:focus-visible) reaches every descendant, not just direct children — the container glows when any control inside it is focused.",
          "The navigation current-state: a nav item that styles itself when it contains the current link — no server-side class to keep in sync.",
        ],
        callout: {
          type: "warn",
          title: "The performance reflex",
          text: ":has() is powerful and the browser has to work for it — a :has() selector in a hot path (a selector applied to thousands of elements, or one that queries deep into a huge DOM) can cost real time. The reflex: scope it tightly (start from a class, not *) and keep the inner selector shallow. If a page has 5,000 rows each running :has(), measure before you celebrate.",
        },
      },
      {
        h: "Where it stays a party trick",
        body: [
          "The famous :has() card hacks — counting stars, styling the third child — are fun and useless. The pattern that matters is state that lives in the DOM (checked, invalid, focused, present) expressing itself on ancestors. If you find yourself toggling a class in JavaScript because 'the parent needs to know', stop and ask whether :has() already knows.",
        ],
        links: [{ label: "Forms that fail kindly", href: "/learn/forms-that-fail-kindly" }],
      },
    ],
  },
  {
    slug: "scroll-timeline-honestly",
    kicker: "Craft & CSS",
    title: "scroll-timeline, honestly",
    deck: "Scroll-driven animations in pure CSS — progress bars that fill with the scroll, sections that animate as they pass. What scroll-timeline can do today, where it still breaks, and the fallback that keeps your content honest.",
    minutes: 10,
    level: "Advanced",
    tags: ["scroll", "scroll-timeline", "animation", "css"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "The two timelines",
        body: [
          "Scroll-driven animation comes in two flavours. The scroll progress timeline: the animation is bound to how far the scroller has travelled (a reading progress bar, a hero that compresses as you leave). The view progress timeline: the animation is bound to how far an element has travelled through the viewport (a section title that reveals as it enters). Both are declarative — no rAF loop, no scroll listener, no layout-thrash opportunity — which is the real gift.",
        ],
        code: {
          title: "scroll-timeline.css",
          lang: "css",
          text: `/* reading progress: bound to the scroller */
@keyframes fill { from { scale: 0 1; } to { scale: 1 1; } }
.progress {
  transform-origin: left;
  animation: fill linear both;
  animation-timeline: scroll(root);
}

/* section title: reveals as it crosses the viewport */
@keyframes rise { from { opacity: 0; translate: 0 24px; } }
.section h2 {
  animation: rise linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 40%;
}`,
        },
      },
      {
        h: "What it cannot do — today",
        bullets: [
          "No scroll-linked easing curves: the animation follows the scroll linearly; you cannot make a section feel 'spring-loaded' against the scroll position without JavaScript sampling scroll velocity.",
          "No scrubbing other properties cheaply: animating anything except transform and opacity still runs layout/paint per scroll frame — the same GPU rule as every other animation applies.",
          "Timeline units and ranges are new and verbose; animation-range syntax (entry, exit, contain) still trips people, and browser prefixes have not fully settled.",
          "Fallbacks matter: in browsers without support the animation never runs — content stays visible only if you write the 'from' state as the resting state, which is exactly the honest pattern: no support means no animation, never no content.",
        ],
        callout: {
          type: "pro",
          title: "The support pattern",
          text: "Write the resting state first (content fully visible, progress at zero). Then layer the scroll-driven animation on top with @supports (animation-timeline: scroll()). No support = clean static page. Support = the enhancement. Scroll-driven motion must never be the only way content appears.",
        },
      },
      {
        h: "Where it genuinely beats JavaScript",
        body: [
          "A reading progress bar, a scroll-vignette that deepens as you leave the hero, an image that settles into place as it enters — these are one-liners in scroll-timeline and hundreds of lines of fragile listener code by hand. The bar is also perfectly synced by the browser: no rAF drift, no scroll-position rounding, no jank from a listener fighting the compositor. For atmosphere that tracks the scroll, the platform finally has the primitive.",
        ],
        links: [{ label: "Progress that tracks reading honestly", href: "/components/scroll-progress" }],
      },
    ],
  },
  {
    slug: "in-defence-of-the-button",
    kicker: "Craft & CSS",
    title: "In defence of the button",
    deck: "Every framework ships a Button component, and every designer has opinions about it. States, semantics, and the disabled attribute everyone gets wrong — a field guide to the most important 24 pixels in your product.",
    minutes: 8,
    level: "Beginner",
    tags: ["buttons", "forms", "a11y", "components"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "The button is a promise with states",
        body: [
          "A button has five states and each is a promise: rest (this will do something), hover (it knows you are here), active/pressed (it has heard you), focus (the keyboard can reach it), and disabled (it cannot — and here is the promise most products break). Users do not read documentation; they read states. A button whose states lie is a button that teaches users to distrust the whole product.",
        ],
        bullets: [
          "Rest: the label is a verb that names the outcome — 'Save changes', never 'Submit'. 'OK' is what a dialog says when it has given up explaining.",
          "Hover: the change must be legible at a glance — background shift, slight lift — and must not be the only affordance on a touchscreen that has no hover.",
          "Pressed: instant visual response (scale to 0.97, fill change) inside 60ms. The press state is the product saying 'I heard you' before the network says anything.",
          "Focus: a visible ring that appears on keyboard focus and does not vanish on mouse click — and never, ever outline: none without a replacement.",
          "Disabled: here is the rule — if the button is disabled because the form is incomplete, say what is missing instead of disabling. Disable only when the action is genuinely impossible right now (already saving, nothing selected), and always explain why, next to the button, in text.",
        ],
      },
      {
        h: "Semantics are the API",
        code: {
          title: "button-semantics.html",
          lang: "html",
          text: `<button type="button">            <!-- click, no form submit -->
<button type="submit">           <!-- the form's action -->
<button disabled>                <!-- genuinely unavailable -->
<a role="button" tabindex="0">   <!-- only if it navigates; else a <button> -->
<!-- A <div onClick> is a button that lost its keyboard,
     its focus ring, its screen-reader role, and its dignity. -->`,
        },
        callout: {
          type: "warn",
          title: "The one you always forget",
          text: "A button with no type attribute inside a form defaults to type='submit'. The 'settings' button that submits the search form and navigates away is a debugging classic — declare type='button' on every button that is not the submitter, and your users will stop losing their work.",
        },
      },
      {
        h: "The craft details",
        body: [
          "A button's padding is its hit area: the tap target needs 44×44px even when the visual is smaller, via padding or an invisible hit-slot. Its corners should match the product's radius scale, not the nearest trend. Its label should never wrap mid-phrase ('Save all' is fine; 'Save all changes to the current draft and' is a sentence wearing a button's clothes). And when the action is destructive, the button says what it will do — 'Delete comment', with the confirm as a second step, never a surprise.",
        ],
        links: [{ label: "Buttons that answer the click window", href: "/learn/the-200ms-click-window" }],
      },
    ],
  },
  {
    slug: "colour-contrast-you-can-compute",
    kicker: "Craft & CSS",
    title: "Colour contrast you can compute",
    deck: "Relative luminance is a formula, not a vibe. The maths that turns 'does this pass AA?' into a number you can compute on a napkin — and the three contrast facts that explain most design-review arguments.",
    minutes: 10,
    level: "Intermediate",
    tags: ["colour", "contrast", "accessibility", "math"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "Contrast ratio is a ratio of luminances",
        body: [
          "The WCAG contrast ratio is (L1 + 0.05) / (L2 + 0.05) where L1 is the lighter colour's relative luminance and L2 the darker's — nothing more. Relative luminance is where the maths lives: each RGB channel is linearized (divide by 255, then the sRGB curve) and weighted 0.2126 red, 0.7152 green, 0.0722 blue. Green dominates because the eye is most sensitive there — which is why two colours that 'look' equally bright on your monitor can fail contrast while a surprising pair passes.",
        ],
        code: {
          title: "luminance.ts",
          lang: "ts",
          text: `function channel(c: number) {           // 0..255 -> linear
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}
function luminance(r: number, g: number, b: number) {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}
function ratio(a: number, b: number) {
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);   // >= 4.5 passes AA text
}`,
        },
      },
      {
        h: "Three facts that settle arguments",
        bullets: [
          "White on near-black is ~15.8:1 — the ceiling you are always aiming under, and the reason pure black text on pure white (21:1) is not 'more accessible' than a well-chosen dark grey; it is just harsher.",
          "Grey text on white fails long before it looks faint: #999 on white is 2.8:1 (fails AA for everything); #767676 is 4.54:1 (passes). The 'muted' text in most products is failing silently — the design review argument is really a luminance argument.",
          "Brand colours almost never pass for text: most logo blues and reds land between 3:1 and 4.4:1 on white — fine for large type and UI components (3:1 AA), failing for body copy. The professional move is a text-ink variant of the brand colour, tuned darker, used for words.",
        ],
      },
      {
        h: "The napkin workflow",
        body: [
          "When a palette arrives, compute three ratios before anything else: body text on background (needs 4.5), large text and UI icons on background (needs 3), and the brand accent as text on background (needs 4.5 or a darker variant). Failures get fixed in the token layer — a --text-muted token, a --brand-ink token — so the design system encodes the maths instead of re-arguing it per screen.",
        ],
        links: [{ label: "AA as a hard requirement", href: "/learn/a11y-before-you-copy" }],
      },
    ],
  },
  {
    slug: "brief-the-model-cant-ignore",
    kicker: "Prompt engineering",
    title: "Writing a brief the model can't ignore",
    deck: "The anatomy of Motif's own prompt format, dissected: why the structure exists, which lines do the actual work, and the three sentences that separate a brief that reproduces from a wish.",
    minutes: 10,
    level: "Intermediate",
    tags: ["prompts", "briefs", "ai", "process"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "The anatomy of a brief that reproduces",
        body: [
          "A brief that reproduces has four layers, and each answers a question the model cannot avoid. Context: what is this page for, and who is it for? Constraints: what is forbidden (no gradients, no stock copy, English only)? Structure: what blocks exist, in what order, with what content obligations? Fidelity markers: what would a great version include that a lazy version would skip?",
          "Motif's format encodes all four in every prompt, and the run logs bear it out: briefs with an explicit block list reproduce structure at 90%+ fidelity; briefs that describe 'a modern, clean landing page' reproduce a genre, not a design.",
        ],
        bullets: [
          "The context line names the industry and the audience in one breath: 'a bike shop page where the service menu reads like a menu a mechanic would stand behind' — the metaphor does the work a paragraph of adjectives cannot.",
          "The block list is a contract: '• Service tiers: three named tiers as cards, each listing what is actually done' — the model now has a checklist it can be scored against, and scoring is what makes the next iteration possible.",
          "The constraint list is negative space: 'never from $X with no date', 'no stock sunset photography' — models fill constraints with surprising creativity; they fill vague praise with clichés.",
          "The palette line is a decision pre-made: 'workshop grey, safety orange accent, honest grease on the cards' — colour direction is where vague briefs collapse into generic gradients.",
        ],
      },
      {
        h: "The three sentences that matter most",
        body: [
          "In every brief there are three sentences the model treats as load-bearing. The first line (what the page is) sets the genre. The first bullet of the first block (the hero's job) sets the hierarchy. And the last line (the palette or the restraint rule) sets the taste ceiling. Rewrite those three and you can keep the other 90% identical while changing the output completely — which is exactly what the retry loop exploits.",
        ],
        callout: {
          type: "pro",
          title: "Write the brief you would hand a human",
          text: "The test for any prompt: would a thoughtful contractor deliver the right page from these instructions alone, without asking a single question? If the answer is 'they would ask about the budget' or 'they would ask what the CTA is', the brief is missing its obligations — add them before you pay the model.",
        },
        links: [{ label: "A brief built this way, end to end", href: "/prompts/bike-shop-service-tiers" }],
      },
    ],
  },
  {
    slug: "the-retry-loop",
    kicker: "Prompt engineering",
    title: "The retry loop: from fidelity 84 to 92",
    deck: "A run at fidelity 84 is not a failure — it is a diagnosis. The discipline of changing one thing at a time between run 1 and run 2, and the five most common fixes in Motif's own iteration log.",
    minutes: 9,
    level: "Intermediate",
    tags: ["prompts", "iteration", "ai", "workflow"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "Fidelity 84 is a specific sentence",
        body: [
          "A low fidelity score is not 'the model failed' — it is a diagnosis with a location. The Motif rubric scores structure (blocks present, in order), content (copy is specific, not generic), and craft (details that make it feel designed). An 84 usually fails one of those three, and the fix is different for each. Structure failure means the brief's block list was ambiguous. Content failure means the copy obligations were too loose — the model filled space with filler. Craft failure means the constraint layer was missing — no palette line, no restraint rule, no 'never' list.",
        ],
        code: {
          title: "retry-log.md",
          lang: "text",
          text: `Run 1  fid 84   blocks present, but hero copy is generic
       ("Elevate your brand" energy)
Fix    tightened the copy obligation: name the product,
       the user, and the one verb of the hero.
Run 2  fid 91   hero specific; now the footer is filler
Fix    added footer obligation + a 'no stock phrases' list.
Run 3  fid 93   shipping.`,
        },
      },
      {
        h: "The five fixes that recur",
        bullets: [
          "Add a 'never' list: models default to the most generic version of a brief; 'never show a stock sunset', 'no fake testimonials', 'no 3-colour-overload' costs three lines and removes an entire failure class.",
          "Name the content: a block that says 'pricing cards' produces lorem prices; 'three tiers with names, real figures, and what each includes' produces a pricing section a designer could defend.",
          "Give the palette a job: 'calm paper, ink, one trustworthy blue' is a taste ceiling; without it the model picks its own default gradient.",
          "Specify the first screen: the hero is where fidelity dies most often — describe what is in it, in order, including what is NOT in it.",
          "Change one thing per retry: change three things between run 1 and run 2 and you will not know which one fixed it — the loop only compounds when each run is a single-variable experiment.",
        ],
      },
      {
        h: "When to stop retrying",
        body: [
          "The loop has a natural end: when the remaining gap is craft judgment (spacing rhythm, type scale, a specific composition), a third retry costs more than ten minutes of hand-tuning the generated page. Motif's own guidance: two prompt retries max, then the generated page becomes a component you refine by hand — the retry loop improves briefs, and hand-tuning improves pages, and confusing the two is how people spend an afternoon on run 7.",
        ],
        links: [{ label: "A run log you can learn from", href: "/prompts/easing-cheatsheet-deep-dive" }],
      },
    ],
  },
  {
    slug: "one-palette-three-moods",
    kicker: "Prompt engineering",
    title: "One palette, three moods",
    deck: "The same layout, the same palette, three different prompts — and three pages that feel like different products. How colour-direction phrasing steers model output, with the exact phrases that work.",
    minutes: 8,
    level: "Intermediate",
    tags: ["prompts", "colour", "direction", "ai"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "Colour words are the fastest steering wheel",
        body: [
          "Models generate from probability, and the probability of a 'premium tech' gradient sky is enormous unless the brief steers. Colour direction is the cheapest steering there is: two lines about palette change the entire output distribution — the layout can stay constant while the mood flips from fintech to editorial to playful.",
        ],
        code: {
          title: "three-moods.md",
          lang: "text",
          text: `Same layout, same product (a focus timer):

MOOD 1 - calm professional
"Palette: deep ink, warm paper, one measured green used
 only for the running state. Nothing louder than a ledger."

MOOD 2 - playful energy
"Palette: paper white, one saturated coral, black type.
 Colour is allowed to be loud, but only one colour at a time."

MOOD 3 - editorial luxury
"Palette: near-black, bone, one metallic accent on the
 primary action only. Generous margins, magazine scale."`,
        },
      },
      {
        h: "The phrases that actually move output",
        bullets: [
          "Job-words over colour-words: 'a green used only for the running state' beats 'mint green' — the model can now place the colour with intent instead of decorating.",
          "Restraint as a directive: 'nothing louder than a ledger', 'one colour at a time', 'accent reserved for the primary action' — models respond to a rule about quantity better than a rule about hue.",
          "Material metaphors: 'workshop grey', 'book cloth', 'newsprint' — concrete materials produce richer palettes than abstract names because they carry texture and context, not just a hex.",
          "Negative colour: 'no gradients, no purple, nothing neon' — the never-list prunes the model's default taste, which is the actual enemy of a directed palette.",
        ],
      },
      {
        h: "The audit",
        body: [
          "After generation, check the page against the brief's own palette line before judging layout. If the palette line said 'one saturated accent' and the page arrived with four, the failure is constraint-enforcement, and the fix is in the never-list, not the hue names. If the page arrived monochrome when the brief promised warmth, the palette line lacked a dominant tone — name the colour that should fill the most area. Colour direction is a loop, like everything else in prompting.",
        ],
        links: [{ label: "When the never-list backfires", href: "/learn/when-to-say-no-gradients-in-a-prompt" }],
      },
    ],
  },
  {
    slug: "when-to-say-no-gradients-in-a-prompt",
    kicker: "Prompt engineering",
    title: "When to say 'no gradients' in a prompt",
    deck: "'No gradients' is the most common constraint in Motif's briefs and the most misunderstood. When the rule produces cleaner work, when it backfires into flatness, and the gradient vocabulary that lets you use the effect without being used by it.",
    minutes: 8,
    level: "Intermediate",
    tags: ["prompts", "gradients", "constraints", "ai"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "Why the rule exists",
        body: [
          "Models love a gradient the way a teenager loves eyeliner: as the default answer to 'make it look designed'. A prompt without a gradient rule reliably produces the purple-blue hero fade, the glassy button sheen, the text gradient on the headline — all at once, all unearned. The rule exists to force the model to design with structure and type instead of reaching for the cheapest form of depth.",
        ],
        bullets: [
          "Say it when the product is information-dense: dashboards, docs, data products — gradients compete with data, and flat colour with strong type reads calmer and faster.",
          "Say it when the brand is already loud: a saturated brand needs flat application, not another layer of drama underneath it.",
          "Say it when you want the model to prove hierarchy: 'no gradients — depth must come from spacing, rules and shadow' forces the layout to do the work.",
          "Skip the rule when the product is atmospheric by nature: hero-grade motion pieces, abstract brand pages, generative backdrops — a disciplined gradient (one, slow, directional) is the right tool and the rule would fight the brief.",
        ],
      },
      {
        h: "When the rule backfires",
        body: [
          "The backfire is flatness-as-punishment: some models respond to 'no gradients' by flattening everything until the page has no depth language at all — no elevation, no scrims, no light. The fix is to replace the negative with a positive depth vocabulary: 'no gradients; use layered panels, subtle shadows and a scrim for the hero' — the model needs a permitted path to depth, or it will take the nearest one, which is none.",
        ],
        code: {
          title: "gradient-vocabulary.md",
          lang: "text",
          text: `Instead of a blanket ban, name the allowed depth:
- "one slow radial glow behind the headline, nothing else"
- "flat panels; elevation via shadow only"
- "a single 2-stop tint on the hero, clipped to the text"
- "no gradients on UI surfaces — imagery may carry colour"

A directed gradient beats a banned gradient:
the first is a decision, the second is a void.`,
        },
      },
      {
        h: "The decision rule",
        body: [
          "Ask what the gradient is for. If the answer is 'to make it feel less plain', ban it — plainness is a layout problem. If the answer is 'to make the light believable' (a glow behind a headline, a sky in a hero image, a sheen on glass that already exists), keep it and constrain it to one. The constraint that works is not 'no gradients'; it is 'one gradient, with a job, and the model must name it in the brief'.",
        ],
        links: [{ label: "One palette, three moods", href: "/learn/one-palette-three-moods" }],
      },
    ],
  },
  {
    slug: "model-personality-drift",
    kicker: "Prompt engineering",
    title: "Model personality drift",
    deck: "The same brief on three models produces three different personalities — one verbose, one literal, one allergic to your constraints. What actually differs between models, and how to write briefs that survive the drift.",
    minutes: 9,
    level: "Intermediate",
    tags: ["prompts", "models", "drift", "ai"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "The same words, three different designers",
        body: [
          "Motif runs every prompt on multiple models, and the run logs show the same pattern every time: identical brief, recognizably different output. One model inflates — longer copy, more sections, bigger claims. One deflates — literal, minimal, takes every 'optional' at its word. One improvises — holds structure but decorates beyond the brief. This is not noise; it is each model's probability distribution showing its favourite moves, and a brief that does not anticipate the drift gets drifted.",
        ],
        bullets: [
          "The inflator wants more: cap it with explicit counts ('exactly three tiers', 'no more than two sentences per card') and with negative space ('no extra sections beyond the block list').",
          "The deflator wants less: feed it obligations, not options — 'the hero must contain: a headline, a subline, and one button' beats 'consider a hero with some copy'.",
          "The improviser wants freedom: pin the palette and the never-list, then let it decorate inside the fence — improvisation inside constraints is where the best output comes from.",
          "Every model has a favourite failure: one loves generic praise copy, one loves gradients, one loves 3-column layouts for everything. Your never-list is a per-model conversation, and it takes two runs to learn.",
        ],
        code: {
          title: "drift-log.md",
          lang: "text",
          text: `Brief: "a calm focus timer landing page, paper + ink + one green"
Model A  -> added a purple gradient hero  (never-list missing)
Model B  -> built it, ultra-minimal, no CTA above the fold
          (obligations missing)
Model C  -> structure perfect, copy full of "unlock your focus"
          (copy obligations missing)
One brief, three diagnoses, three different fixes.`,
        },
      },
      {
        h: "Drift is stable — use it",
        body: [
          "Model behaviour is consistent enough to plan around: once you know which model inflates, you route the copy-heavy briefs elsewhere or pre-load the caps. The professional move is a per-model brief header — one paragraph of 'this model tends to X, so this brief does Y' — and Motif's own prompts carry model-specific run notes for exactly this reason. The brief is not finished when it reads well; it is finished when it survives the model you actually run.",
        ],
        links: [{ label: "The retry loop, in practice", href: "/learn/the-retry-loop" }],
      },
    ],
  },
  {
    slug: "design-tokens-inside-prompts",
    kicker: "Prompt engineering",
    title: "Design tokens inside prompts",
    deck: "A generated page you cannot restyle is a generated page you will rebuild. Putting tokens in the brief — named colours, radii, spacing scale — makes output restyleable after generation. The difference between a one-off and a component.",
    minutes: 10,
    level: "Advanced",
    tags: ["prompts", "design tokens", "theming", "ai"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "Why untokened output is a dead end",
        body: [
          "A generated page with hard-coded hexes and magic spacing is a sculpture: impressive, immovable. The moment the brand shifts a hue or the design system changes a radius, the page must be regenerated or hand-edited in fifty places. Tokens in the prompt are the difference between a sculpture and a system — the model emits var(--color-ink) references and one central definition, so the whole page restyles from a single edit.",
        ],
        code: {
          title: "tokenized-brief.md",
          lang: "text",
          text: `Define tokens in the brief, then require their use:
"Palette as tokens: --ink #1a1d21, --paper #faf8f4,
 --accent #1f7a5c (used only on the primary action),
 --muted derives from --ink at 72% opacity.
 Spacing from an 8px scale (--s1..--s6). Radius: --r-md 14px,
 --r-lg 24px. Every colour and radius in the page must be a var()."`,
        },
      },
      {
        h: "The token set that pays for itself",
        bullets: [
          "Colour as named roles, not hues: --ink, --paper, --accent, --surface, --border, --text-dim — role names survive rebrands; hue names do not.",
          "Spacing from one scale: the model then chooses gaps from the scale instead of inventing 13px, 31px and 47px — which is exactly what makes generated layouts look designed.",
          "Radius and shadow tokens: two radii and a four-rung shadow scale keep cards and modals consistent across every generated section.",
          "Type tokens: --font-display, --font-body, and a size scale — models that choose from a scale build hierarchy instead of guessing sizes.",
        ],
        callout: {
          type: "pro",
          title: "The follow-up prompt that tokenizes",
          text: "If the first run ignored the tokens, do not regenerate — run a tokenization pass: 'Rewrite this page using the token set from the brief. Every hex, radius and spacing value becomes a var(); nothing hard-coded remains.' One pass turns a sculpture into a system.",
        },
      },
      {
        h: "Tokens are the bridge to the library",
        body: [
          "A tokenized page drops into Motif's workflow perfectly: the generated layout becomes a component, the tokens map onto the design-system scale, and the page becomes restyleable — which is the entire point of the from-prompt-to-component pipeline. Tokens are not an implementation detail; they are the contract that lets generated work join the library instead of sitting beside it.",
        ],
        links: [{ label: "From prompt to component", href: "/learn/from-prompt-to-component" }],
      },
    ],
  },
  {
    slug: "prompting-for-reduced-motion",
    kicker: "Prompt engineering",
    title: "Prompting for reduced motion",
    deck: "Accessibility constraints belong in the brief, not the audit. How to bake prefers-reduced-motion into a prompt so the generated page ships with its calmer experience designed, not deleted.",
    minutes: 8,
    level: "Intermediate",
    tags: ["prompts", "a11y", "reduced motion", "ai"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "The brief is where a11y decisions are made",
        body: [
          "Most accessibility work happens after generation — an audit finds the failures and a human fixes them. But motion is different: the reduced experience is a *design*, and designs are made in the brief. A prompt that says 'add a reduced-motion fallback' produces a delete-everything blanket rule. A prompt that specifies the reduced branch produces a second experience — and the run logs show the difference is entirely in how the constraint is phrased.",
        ],
        bullets: [
          "Require the branch, not the switch: 'the spec must include a @media (prefers-reduced-motion: reduce) branch that keeps state changes visible via opacity and colour, and removes travel, scale and parallax' — naming what survives is what makes it a design.",
          "Ban the blanket: 'no universal animation-duration: .01ms reset' — that reset is the delete-everything move, and it also kills the honest 200ms fades that carry state.",
          "Name the motion budget: 'maximum three animated elements per screen; everything else is static by default' — a budget prevents the generated page from animating everything it can.",
          "Ask for the audit note: 'include a short note on which animations were kept in the reduced branch and why' — forcing the explanation produces better decisions than the motion itself.",
        ],
        code: {
          title: "reduced-branch-in-brief.md",
          lang: "text",
          text: `Motion spec (in the brief):
- hero: one slow drift, 18s cycle, transform-only
- cards: stagger entrance, 60ms apart, opacity + 6px rise
- reduced branch (required):
   drift removed entirely
   card entrance = opacity fade 250ms only, no travel
   progress bar keeps its fill transition (200ms)
- note: name every motion kept in the reduced branch.`,
        },
      },
      {
        h: "The payoff",
        body: [
          "A brief with a specified reduced branch produces a page that passes a reduced-motion audit on the first run — no retrofitting, no blanket reset arguing with the design system later. The reduced experience stops being the thing an auditor deletes and becomes the thing a designer specified. That is the difference between prompting for compliance and prompting for craft.",
        ],
        links: [{ label: "Designing the second experience", href: "/learn/reduced-motion-beyond-the-switch" }],
      },
    ],
  },
  {
    slug: "from-prompt-to-component",
    kicker: "Prompt engineering",
    title: "From prompt to component",
    deck: "A great generated page is raw material, not a deliverable. The pipeline that turns a one-off generation into a library asset: extraction, tokenization, theming, and the tests that decide whether it earns a place in the catalog.",
    minutes: 11,
    level: "Advanced",
    tags: ["prompts", "components", "workflow", "library"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "The page is the prototype, not the product",
        body: [
          "When a prompt produces a page at fidelity 92, the temptation is to ship the page. The professional move is to ship the *component* — extract the reusable piece (the pricing table, the stagger, the hero pattern), strip the page-specific copy, tokenize the colours, and parameterize what varies. The generated page was the proof; the component is the asset.",
        ],
        bullets: [
          "Extract by boundary: find where the pattern ends and the page begins — a pricing table component stops at the section padding; the section's headline is page content.",
          "Tokenize before theming: replace every hex with a role token first; a component themed by tokens works in every context, a component with hard-coded colours works in one.",
          "Parameterize the judgement calls: variant (tier count, density), and tone (calm, playful) become props; everything else stays internal.",
          "Document the origin: the component's notes carry its prompt, its run log and its fidelity score — future edits start from the brief's intent, not a guess.",
        ],
      },
      {
        h: "The tests that decide admission",
        code: {
          title: "admission-tests.md",
          lang: "text",
          text: `A generated pattern earns library admission when it passes:
[ ] Reusable - the pattern earns its keep in 2+ contexts
[ ] Tokenized - zero hard-coded hex/radius/spacing
[ ] Themed   - survives a token swap without breaking
[ ] Reduced  - has a working prefers-reduced-motion branch
[ ] Keyboard - operable and visibly focused by Tab
[ ] Scored   - run fidelity recorded with model + date`,
        },
      },
      {
        h: "The loop closes on the library",
        body: [
          "The component then feeds the next prompt: library patterns become reference material in future briefs ('the pricing card from the library, applied to a bike shop'), and the library's own quality bar raises what the prompt asks for. Generation, extraction, admission, reuse — the loop is how Motif's catalog grows and how the prompts get sharper. A prompt library without a component pipeline is a museum; with one, it is a workshop.",
        ],
        links: [{ label: "Design tokens inside prompts", href: "/learn/design-tokens-inside-prompts" }],
      },
    ],
  },
  {
    slug: "the-five-line-prompt-myth",
    kicker: "Prompt engineering",
    title: "The 5-line prompt myth",
    deck: "'Short prompts are better prompts' is the most expensive folk wisdom in AI design. What the run logs actually show about brief length, and where the long brief's value really lives.",
    minutes: 9,
    level: "Intermediate",
    tags: ["prompts", "length", "evidence", "ai"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "Where the myth comes from",
        body: [
          "The myth has a true ancestor: for open-ended generation (a poem, an idea, a tagline), short prompts outperform — the model has room and the task rewards surprise. Somewhere along the way that finding was generalized into 'briefs should be short', and it quietly destroyed a generation of UI prompts, because a website is not a poem: it has twenty decisions that must be made consistently, and an unasked decision gets a default — usually the model's favourite generic one.",
        ],
        bullets: [
          "Length correlates with specificity, and specificity is what UI fidelity scores: the run logs show block-listed briefs at 88–93 fidelity and 3-line briefs at 70–80, consistently, across models.",
          "A long brief full of genre praise ('modern, clean, premium, sleek') fails exactly like a short one — length without obligations is just a longer wish.",
          "The real variable is obligation density: how many decisions the brief settles that the model would otherwise make by probability. Block list, palette, never-list, counts — four dense lines beat forty vague ones.",
          "The 5-line brief's best use is iteration: a short brief to explore directions fast, then the winner gets the full obligation brief for the fidelity pass. Short for breadth, long for build.",
        ],
        code: {
          title: "obligation-density.md",
          lang: "text",
          text: `Vague line:   "a modern landing page with hero and pricing"
               -> model defaults: gradient hero, lorem pricing

Obligation:   "hero: product name, one verb, one button.
              pricing: three named tiers, real figures,
              what each includes. palette: paper, ink,
              one green. no gradients, no fake testimonials."
              -> the defaults are replaced by decisions.`,
        },
      },
      {
        h: "The evidence habit",
        body: [
          "The myth survives because nobody logs. Motif scores every run and the scores are the argument: briefs win on fidelity when they settle decisions, and the scoreboard is public in every prompt's run log. If you believe short prompts are better, run the same brief at two lengths on the same model, score both against the same rubric, and keep the number. The myth does not survive contact with a run log.",
        ],
        links: [{ label: "Fidelity is a claim", href: "/learn/fidelity-is-a-claim" }],
      },
    ],
  },
  {
    slug: "fidelity-is-a-claim",
    kicker: "Prompt engineering",
    title: "Fidelity is a claim",
    deck: "A fidelity score without a rubric is a vibe. How Motif scores runs, why screenshots are not proof, and the scoring discipline that turns 'this looks good' into numbers you can iterate against.",
    minutes: 10,
    level: "Intermediate",
    tags: ["prompts", "fidelity", "scoring", "process"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "What a fidelity score should mean",
        body: [
          "Every Motif prompt ships with per-model fidelity scores and run dates, and the score is only useful because it is defined. The rubric scores three axes: structure (are the brief's blocks present, in order, with nothing extra), content (is the copy specific — named products, real figures, no filler), and craft (palette discipline, spacing rhythm, restraint). A score of 92 means 'structure and content held, craft slightly under the brief's ceiling' — not 'I liked it'.",
        ],
        bullets: [
          "Structure is binary-ish: blocks present? In order? Extras? A brief with a block list makes structure machine-checkable — which is why the block list is the backbone of every Motif prompt.",
          "Content is specificity: 'the copy names real things' scores; 'compelling copy that elevates the brand' is the model talking about itself. Score the nouns, not the adjectives.",
          "Craft is restraint: palette obeyed, one accent, spacing from a scale. The brief's never-list makes craft checkable too — every violated never is a docked point.",
          "Screenshots are not proof: a beautiful screenshot of a page that ignored half the brief is a beautiful failure. Score against the brief, then admire the screenshot.",
        ],
      },
      {
        h: "The scoring discipline",
        code: {
          title: "scorecard.md",
          lang: "text",
          text: `Prompt: bike-shop-service-tiers   Model: Claude 4.6 Sonnet

Structure  10/10  all 4 blocks, in order, no extras
Content     9/10  tiers named + priced; one generic line
Craft       9/10  palette held; spacing 2px off on one card
                     ----------
Fidelity    91    (weighted: structure .4, content .3, craft .3)

Notes: "reads like a menu a mechanic would stand behind"
       -> that is the brief's own line; it held.`,
        },
      },
      {
        h: "Why the claim matters",
        body: [
          "A score you can defend turns iteration into science: run 1 at 84, change one thing, run 2 at 91 — the delta is attributable. It also keeps the library honest: a component or prompt marked 'verified' has a dated score behind it, and the score's breakdown tells the next user where the weaknesses live. Fidelity is a claim — a claim with evidence attached — and evidence is the only thing that survives contact with a new model version.",
        ],
        links: [{ label: "The retry loop", href: "/learn/the-retry-loop" }],
      },
    ],
  },
  {
    slug: "the-keyboard-walk",
    kicker: "Accessibility",
    title: "The keyboard walk",
    deck: "The cheapest full accessibility audit in existence: put the mouse away and walk the page with Tab. A field guide to the traps you will hit, in the order you will hit them, and what each one means.",
    minutes: 9,
    level: "Beginner",
    tags: ["a11y", "keyboard", "audit", "testing"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "The walk, in rules",
        body: [
          "The keyboard walk has three rules and one notebook. Rule one: Tab only — no mouse, no trackpad, no touch. Rule two: narrate every stop — where am I, what is this, what will it do? Rule three: the walk must reach everything a mouse can reach and leave nothing a keyboard cannot. A page fails the walk the moment Tab stops on something invisible, skips something important, or traps you in a widget with no way out.",
        ],
        bullets: [
          "Trap 1 — the invisible stop: focus lands on an off-screen element or a hidden control. Fix: check what has focus styling at every stop; if you cannot see where you are, the user cannot either.",
          "Trap 2 — the skipped hero: the primary CTA is a div with onClick, so Tab walks past the most important action on the page. Fix: real <button> or an anchor with href — interactive things must be focusable things.",
          "Trap 3 — the modal prison: focus enters a dialog and Tab cycles forever inside, or worse, escapes behind the scrim. Fix: focus management — trap within the dialog while open, return to the trigger on close.",
          "Trap 4 — the scroll requirement: content expands on hover, so a keyboard user never sees it. Fix: hover-reveal must also open on focus-within.",
          "Trap 5 — the radio maze: custom dropdowns and tab widgets that swallow arrow keys or announce nothing. Fix: use native controls first; only build custom widgets when you also build their keyboard contract.",
        ],
      },
      {
        h: "The order is the design",
        body: [
          "Tab order is DOM order unless you reorder it with tabindex, and DOM order should follow reading order — which should follow visual order. The walk exposes disagreements: a visually left-to-right layout whose DOM stacks the sidebar first, a skip-link that is missing so every page visit starts with the nav, a focus that jumps to the footer after a filter. These are not keyboard bugs; they are layout bugs seen from the keyboard. The walk finds them in about ninety seconds.",
        ],
        callout: {
          type: "tip",
          title: "The 90-second version",
          text: "Every sprint, one person walks the changed pages: Tab through, note every stop that is invisible, unreachable, or trapping, and file the list as one ticket. Ninety seconds of walking replaces a week of 'we should really test accessibility sometime'.",
        },
        links: [{ label: "Focus order is layout", href: "/learn/focus-order-is-layout" }],
      },
    ],
  },
  {
    slug: "screen-reader-poetry",
    kicker: "Accessibility",
    title: "Screen-reader poetry",
    deck: "Alt text and labels are read aloud to someone who cannot see the page — they are the audio track of your design. Writing alt text that respects attention: what to say, what to skip, and the one question that decides both.",
    minutes: 8,
    level: "Beginner",
    tags: ["a11y", "alt text", "screen readers", "copywriting"],
    updated: "2026-09-10",
    blocks: [
      {
        h: "The one question",
        body: [
          "Every image asks the same question: does this picture carry information the words do not? If yes, the alt text says what the picture shows, in the order it matters. If no — the image is decorative, a logo beside the company name, a gradient behind text — the alt text is empty and the image is aria-hidden, because reading 'image, decorative gradient' aloud is noise, and noise is the enemy of attention.",
          "The poetry is in the economy: alt text is the haiku of your UI. 'Quarterly revenue chart: up 22% from Q2 to Q3' tells the listener everything the chart shows. 'Chart showing revenue growth over time' tells them the chart exists — which they already know — and nothing else.",
        ],
        code: {
          title: "alt-text.md",
          lang: "text",
          text: `Decorative   alt=""               (aria-hidden, not omitted)
Functional  alt="Search"          (the button's job, not its icon)
Informative alt="Map pin: the venue is on Market St,
              two blocks east of the station"
Complex     <figure> + caption + data table + alt pointing
            to both — a chart is never one alt string`,
        },
      },
      {
        h: "The ear test",
        body: [
          "The discipline that fixes most alt text: read it aloud. Alt text that works reads like a good friend describing the screen — 'there is a photo of the workshop, the mechanic is mid-laugh, the dog is asleep on the chair' — not like a museum label ('photograph, mechanic, dog, chair') and not like a legal disclaimer ('image of workshop scene with mechanic and canine companion'). Screen readers are ears; write for ears.",
        ],
        bullets: [
          "Say what is relevant, in context: the same photo of a product gets different alt text on a product page (the product, its state) and a brand page (the scene, the feeling).",
          "Name the numbers: a screenshot of a form error should read the error, not 'screenshot of form'. The words already on the page should never be duplicated in alt text — the listener hears them twice.",
          "Respect the listener's time: alt text is a detour from the flow. Long descriptions belong to the page (a caption, a table), not to a 200-word alt string.",
        ],
      },
      {
        h: "Labels are alt text for controls",
        body: [
          "A button that shows only an icon needs a label the reader can hear; an input's label must be associated (the label element, not a placeholder — placeholders disappear and are not reliable labels); and a group of radio buttons needs a fieldset legend naming the question they answer. The same economy applies: 'Search', not 'Click here to search our website'. Attention is the budget, and every label spends some of it — spend it on the word that names the action.",
        ],
        links: [{ label: "The keyboard walk", href: "/learn/the-keyboard-walk" }],
      },
    ],
  },
];

export function learnArticleOf(slug: string): LearnArticle | undefined {
  return LEARN_ARTICLES.find((a) => a.slug === slug);
}
