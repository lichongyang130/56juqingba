// #478 — the question map.
//
// "Learn as the SEO engine" only works if the essays answer questions people
// actually type. This file pairs each of a curated set of questions with the
// essay that answers it, and with the one asset that proves the answer in code.
//
// Curated rather than generated on purpose: "how do I make a hero that isn't
// boring" is a real query; "how to build a hero that breathes in 20 minutes"
// is a title with "how to" glued on, and search engines see the difference
// even when a template does not.
//
// Every pair is checked at build time by /learn/questions (and by the export
// harness): the essay slug and the asset slug must exist, so a rename cannot
// leave a question pointing at nothing.

export interface Query {
  /** Phrased as a search, not as a headline. */
  question: string;
  essay: string;
  asset: string;
  /** One line on why this essay is the answer. */
  because: string;
}

export const QUERIES: Query[] = [
  {
    question: "How do I stop a hero section from feeling static?",
    essay: "hero-that-breathes-in-20-min",
    asset: "aurora-veil",
    because: "three cheap layers — a backdrop you can ignore, one typographic moment, one honest action — built in one sitting.",
  },
  {
    question: "What is the difference between an easing and a spring?",
    essay: "springs-are-not-easings",
    asset: "halo-button",
    because: "an easing is a curve you choose; a spring is a system you tune, and the button shows the tuning.",
  },
  {
    question: "Which CSS properties can I animate without hurting performance?",
    essay: "gpu-animating-without-asking",
    asset: "magnetic-icon-row",
    because: "only transform and opacity stay on the compositor, and the icons show what that buys you.",
  },
  {
    question: "How do I honour prefers-reduced-motion without gutting the design?",
    essay: "reduced-motion-beyond-the-switch",
    asset: "preloader-handoff",
    because: "the reduced version is designed rather than disabled, which is what the loader handoff does.",
  },
  {
    question: "Why does my animation feel janky on a phone but smooth on my laptop?",
    essay: "the-60fps-handshake",
    asset: "star-motes",
    because: "frame budget, not frame rate, is the number that decides it — and the motes ship a low-end tier.",
  },
  {
    question: "Should I use scroll-linked animation?",
    essay: "scroll-timeline-honestly",
    asset: "draw-path",
    because: "sometimes yes, often no, and the path shows the version that stays on the compositor.",
  },
  {
    question: "How do I write a prompt that produces the same page twice?",
    essay: "prompt-that-reproduces",
    asset: "template-waitlist",
    because: "constraints, order and an explicit checklist; the template is the output the method produces.",
  },
  {
    question: "What does a good prompt for a landing page actually contain?",
    essay: "brief-the-model-cant-ignore",
    asset: "template-landing-saas",
    because: "the brief is the deliverable, and the template is what a well-specified one looks like.",
  },
  {
    question: "How do I check if my colour contrast is good enough?",
    essay: "colour-contrast-you-can-compute",
    asset: "status-banner",
    because: "the maths is four lines, and the banner's four tones all clear 4.5:1 on the page background.",
  },
  {
    question: "How do I make an empty state that doesn't look broken?",
    essay: "empty-states-earn-trust",
    asset: "empty-state-trio",
    because: "an empty state is a first impression with the content missing, which the trio takes seriously.",
  },
  {
    question: "How should a form tell someone they made a mistake?",
    essay: "forms-that-fail-kindly",
    asset: "password-strength",
    because: "errors belong next to the field, phrased as a next step rather than a verdict.",
  },
  {
    question: "How do I make focus visible without ugly outlines?",
    essay: "focus-order-is-layout",
    asset: "radio-pills",
    because: "a focus ring is a design surface, and the pills treat it as one.",
  },
  {
    question: "How do I decide what to put in a sticky header?",
    essay: "the-invisible-header",
    asset: "sticky-subnav",
    because: "the header earns its space or it should scroll away.",
  },
  {
    question: "How do I build a personal UI library that survives contact with real projects?",
    essay: "building-a-personal-ui-library",
    asset: "command-palette",
    because: "the structure matters more than the count — the palette is the search layer that makes a library usable.",
  },
  {
    question: "How do I keep a dark theme from looking like an inverted light theme?",
    essay: "dark-mode-is-a-design-system",
    asset: "aurora-veil",
    because: "dark mode is a token decision, not a colour swap — the veil is designed for a dark ground from the start.",
  },
  {
    question: "How do I size type so it works on a phone without magic numbers?",
    essay: "fluid-type-without-magic-numbers",
    asset: "stats-band",
    because: "a clamp() with a stated reason beats a pile of breakpoints, and the numbers hold at both ends.",
  },
  {
    question: "When is a glass effect worth the paint cost?",
    essay: "glass-is-a-material",
    asset: "nav-dock",
    because: "glass reads as a material only when there is something behind it to blur.",
  },
  {
    question: "How do I test an interface with a keyboard, honestly?",
    essay: "the-keyboard-walk",
    asset: "command-palette",
    because: "unplug the mouse and try to finish a task — the palette is the component that survives that test.",
  },
];

/** The question (if any) that this essay answers — used on the article page. */
export function questionFor(essay: string): Query | undefined {
  return QUERIES.find((q) => q.essay === essay);
}
