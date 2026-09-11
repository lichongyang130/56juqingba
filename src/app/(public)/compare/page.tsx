import type { Metadata } from "next";
import Link from "next/link";
import { BACKGROUNDS, COMPONENTS, LAB_TOOLS, PROMPTS } from "@/lib/data";

export const metadata: Metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/compare" },
  title: "Choosing a UI kit, honestly — Motif UI",
  description:
    "When a generic component kit is the right choice, when a template marketplace is, and what Motif does instead — written without naming or copying a competitor.",
};

// #476 — positioning without a punchline.
//
// The rule for this page: no competitor is named, no competitor is characterised,
// and every claim about Motif links to the page where it can be checked. Rows are
// approaches, not brands; if a row would be dishonest about the other approach it
// gets deleted rather than softened.

interface Row {
  approach: string;
  good: string;
  cost: string;
  motif: string;
  proof?: { label: string; href: string };
}

export default function ComparePage() {
  const rows: Row[] = [
    {
      approach: "A generic component kit",
      good: "One install, a hundred primitives, a consistent API, and a team that already knows it. For an app with a long-lived interface, that consistency is worth more than any single effect.",
      cost: "The visual language is shared with everyone else using it, and the motion is usually whatever the library chose — so the product reads as the kit.",
      motif:
        "Motif is not an install: assets are single files you paste or copy from a page, written to be read as much as used. Nothing arrives through a dependency graph, and every asset prints its size and what it depends on.",
      proof: { label: "See a zero-dependency example", href: "/components/halo-button" },
    },
    {
      approach: "A template marketplace",
      good: "Fastest path from brief to a complete page, and a marketplace has breadth no single studio can match — including whole categories Motif does not cover.",
      cost: "You inherit someone else's information architecture, and the same template shows up on other sites the week it ships.",
      motif:
        "Motif ships components and sections, not a finished site, and the templates it does ship are built from the same catalog pieces you can copy individually, with the recipe shown.",
      proof: { label: "Templates and their recipes", href: "/templates" },
    },
    {
      approach: "A motion library",
      good: "Springs, gestures and physics solved properly, with strong accessibility defaults. If motion is the product, this is the right kind of dependency.",
      cost: "The library's opinion arrives with it: you learn its vocabulary and its bundle size, and the easing you ship is the easing it chose.",
      motif:
        "Motif's motion pieces are teaching material as much as code — each one names its curve, its timing and what it does under reduced motion, and the Lab lets you scrub the numbers before copying.",
      proof: { label: "The easing Lab", href: "/lab" },
    },
    {
      approach: "A prompt gallery",
      good: "Cheap breadth: hundreds of prompts, quick inspiration, and useful for exploring what a model can do.",
      cost: "Screenshots are usually unverified — one run, one model, one good day — so the score someone quotes may describe nothing you will get.",
      motif:
        "Every prompt here publishes its run log: which models, which dates, which fidelity score and which runs failed to build. The average is arithmetic on that log.",
      proof: { label: "A prompt with its failures", href: "/prompts" },
    },
    {
      approach: "A CodePen-style playground",
      good: "Unmatched for trying one idea with zero setup, and the shortest path from idea to a shareable two-file experiment.",
      cost: "Nothing carries across into a real project: the snippet, the tokens and the accessibility story all stop at the demo.",
      motif:
        "This site is the static opposite: the demo is on the page, the source is copyable, the tokens are exportable, and every panel says what it cannot do — including that its admin console is a demo.",
      proof: { label: "What the console is", href: "/integrations" },
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Choosing a kit</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Positioning · no competitor names</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">When Motif is the wrong choice</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          Most comparison pages exist to win an argument. This one lists five approaches — a generic kit, a template marketplace, a motion
          library, a prompt gallery, a playground — and says plainly what each is better at, because a person deciding between them deserves the
          reason to pick the other one. No competitor is named, and nothing about anybody else&apos;s product is characterised. Every claim about
          Motif links to the page that proves it.
        </p>
      </div>

      <div className="mt-10 space-y-4">
        {rows.map((row) => (
          <section key={row.approach} className="rounded-3xl border border-white/8 bg-panel p-6">
            <h2 className="text-base font-extrabold tracking-tight">{row.approach}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">Better at</p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-ink-dim">{row.good}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-200">What it costs you</p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-ink-dim">{row.cost}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-violet-200">What Motif does instead</p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-ink-dim">{row.motif}</p>
                {row.proof && (
                  <Link href={row.proof.href} className="mt-2 inline-block text-[11px] font-semibold text-violet-300 hover:text-violet-200">
                    {row.proof.label} →
                  </Link>
                )}
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="mt-10 grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <h2 className="text-sm font-extrabold tracking-tight">What Motif is, in numbers</h2>
          <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-ink-dim">
            <li>
              <span className="font-mono text-ink">{COMPONENTS.length}</span> original components, none copied from another library, each with
              an audit score and a size budget.
            </li>
            <li>
              <span className="font-mono text-ink">{PROMPTS.length}</span> prompts with {PROMPTS.reduce((a, p) => a + p.runs.length, 0)} recorded
              runs between them.
            </li>
            <li>
              <span className="font-mono text-ink">{BACKGROUNDS.length}</span> backgrounds with performance tiers, and{" "}
              <span className="font-mono text-ink">{LAB_TOOLS.length}</span> lab tools that are free to use without an account.
            </li>
            <li>No accounts, no checkout, no telemetry — every interactive surface that stores anything says which browser key it writes.</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <h2 className="text-sm font-extrabold tracking-tight">Pick something else if…</h2>
          <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-ink-dim">
            <li>You need a maintained dependency with a release cadence, not files to read.</li>
            <li>You need a design system with governance, versioning and a migration path.</li>
            <li>You need a finished site this afternoon — a marketplace template is the honest answer.</li>
            <li>You want a physics engine for gesture-driven UI; a motion library does that better than a set of scenes.</li>
            <li>You need real accounts and a backend: this site deliberately has neither, and says so on the pages that would otherwise imply one.</li>
          </ul>
          <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
            The inverse list is the useful one: if your project matches none of those, the library underneath this page is the pitch.
          </p>
        </div>
      </section>
    </div>
  );
}
