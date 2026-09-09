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
];

export function learnArticleOf(slug: string): LearnArticle | undefined {
  return LEARN_ARTICLES.find((a) => a.slug === slug);
}
