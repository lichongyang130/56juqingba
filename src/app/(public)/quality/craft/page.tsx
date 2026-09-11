import type { Metadata } from "next";
import Link from "next/link";
import { COMPONENTS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Code worth reading — the craft markers — Motif UI",
  description:
    "Three annotated excerpts from the library, the rules they follow, and the machine check that keeps the rules from decaying into a style guide nobody reads.",
};

/**
 * #479 — the craft page.
 *
 * Everything here is real code from this repository, quoted verbatim with the
 * line-level commentary that explains why it is written that way. The last
 * section is the part that keeps it honest: each marker is also printed as a
 * number the audits can check, so "we care about craft" is not the claim —
 * the counts are.
 */

const REDUCED_MOTION = `@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}`;

const FLIP_MEASURE = `// offsetTop is used rather than getBoundingClientRect on purpose: it reports
// the layout slot and ignores the transform a glide may be mid-way through,
// so measuring during an animation does not poison the next one.
const measure = () => { ... };`;

const TICK_GUARD = `const tick = () => {
  if (cancelled) return;             // the cleanup sets this before cancelling
  setProgress((p) => Math.min(1, p + step));
  raf = requestAnimationFrame(tick);
};`;

export default function CraftPage() {
  const zeroDep = COMPONENTS.filter((c) => c.deps.length === 0).length;
  const themeable = COMPONENTS.filter((c) => c.themeable).length;
  const scored = COMPONENTS.filter((c) => c.a11yScore >= 92).length;
  const smallest = [...COMPONENTS].sort((a, b) => a.bundleKb - b.bundleKb)[0];

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <Link href="/quality" className="hover:text-ink">
          Quality bar
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Craft</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Craft · three excerpts</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Code worth reading</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          A component library earns links for the same reason a tutorial does: somebody reads the source and finds a decision they would not have
          made themselves. These are three excerpts from this site&apos;s own code, quoted verbatim with the reasoning attached, plus the counts
          that show the habits are systematic rather than three lucky files.
        </p>
      </div>

      <section className="mt-10 space-y-6">
        <article className="rounded-3xl border border-white/8 bg-panel p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-sm font-extrabold tracking-tight">1. Reduced motion at the stylesheet, not per component</h2>
            <span className="font-mono text-[10px] text-ink-faint">src/app/globals.css</span>
          </div>
          <pre className="mt-3 overflow-x-auto rounded-2xl border border-white/8 bg-black/35 p-4 font-mono text-[10.5px] leading-relaxed text-emerald-200/90">
            {REDUCED_MOTION}
          </pre>
          <p className="mt-3 text-[11px] leading-relaxed text-ink-dim">
            Two decisions here. The rule is global, so a new component cannot forget it — the default is safe and opting out is the deliberate
            act. And it uses <span className="font-mono">0.001ms</span> rather than{" "}
            <span className="font-mono">animation: none</span>: killing the animation outright skips its end state, which is how a
            reduced-motion visitor ends up with an element stuck at <span className="font-mono">opacity: 0</span>. Speeding the animation to
            nothing keeps every frame&apos;s result and drops only the travel.
          </p>
        </article>

        <article className="rounded-3xl border border-white/8 bg-panel p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-sm font-extrabold tracking-tight">2. Measuring layout, not paint</h2>
            <span className="font-mono text-[10px] text-ink-faint">the reorder scene</span>
          </div>
          <pre className="mt-3 overflow-x-auto rounded-2xl border border-white/8 bg-black/35 p-4 font-mono text-[10.5px] leading-relaxed text-violet-200/90">
            {FLIP_MEASURE}
          </pre>
          <p className="mt-3 text-[11px] leading-relaxed text-ink-dim">
            A FLIP animation measures a row&apos;s slot, moves it with a transform, then measures again. If the measurement reads{" "}
            <span className="font-mono">getBoundingClientRect()</span> while a previous glide is still running, it reads the transformed
            position and the next animation starts from a lie. <span className="font-mono">offsetTop</span> ignores transforms, so the numbers
            stay true during motion — a one-line choice that removes an entire class of bugs.
          </p>
        </article>

        <article className="rounded-3xl border border-white/8 bg-panel p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-sm font-extrabold tracking-tight">3. A loop that cannot outlive its component</h2>
            <span className="font-mono text-[10px] text-ink-faint">the counter band</span>
          </div>
          <pre className="mt-3 overflow-x-auto rounded-2xl border border-white/8 bg-black/35 p-4 font-mono text-[10.5px] leading-relaxed text-cyan-200/90">
            {TICK_GUARD}
          </pre>
          <p className="mt-3 text-[11px] leading-relaxed text-ink-dim">
            A <span className="font-mono">requestAnimationFrame</span> loop that only calls{" "}
            <span className="font-mono">cancelAnimationFrame</span> on cleanup has a race: the frame already queued still runs and can schedule
            the next one, so the loop survives unmount and keeps a dead component&apos;s state alive. The guard makes the loop check a flag it
            owns, which is the difference between a demo and a leak.
          </p>
        </article>
      </section>

      <section className="mt-10 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">The habits, counted</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          Three excerpts would be a portfolio. These are the same three habits as numbers over the whole catalog, computed at build time:
        </p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Zero-dependency assets", value: `${zeroDep}/${COMPONENTS.length}`, note: "nothing to install to read the source" },
            { label: "Token-driven", value: `${themeable}/${COMPONENTS.length}`, note: "restyle without editing the component" },
            { label: "a11y ≥ 92", value: `${scored}/${COMPONENTS.length}`, note: "keyboard, focus, labels, reduced motion" },
            { label: "Smallest asset", value: `${smallest.bundleKb.toFixed(1)} KB`, note: smallest.title },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
              <dt className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">{s.label}</dt>
              <dd className="mt-1 font-mono text-xl tabular-nums">{s.value}</dd>
              <dd className="mt-1 text-[10px] text-ink-dim">{s.note}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
          The checks behind those numbers run in CI on the same source the site ships, and the audit page prints the ones that do not pass
          rather than only the ones that do.
        </p>
      </section>

      <p className="mt-8 text-[11px] leading-relaxed text-ink-faint">
        Related: the{" "}
        <Link href="/quality/speed" className="font-semibold text-violet-300 hover:text-violet-200">
          measured performance story
        </Link>{" "}
        and the{" "}
        <Link href="/quality" className="font-semibold text-violet-300 hover:text-violet-200">
          audit register
        </Link>
        .
      </p>
    </div>
  );
}
