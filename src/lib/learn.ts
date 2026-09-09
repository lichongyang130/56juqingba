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
];

export function learnArticleOf(slug: string): LearnArticle | undefined {
  return LEARN_ARTICLES.find((a) => a.slug === slug);
}
