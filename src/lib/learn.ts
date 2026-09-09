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
];

export function learnArticleOf(slug: string): LearnArticle | undefined {
  return LEARN_ARTICLES.find((a) => a.slug === slug);
}
