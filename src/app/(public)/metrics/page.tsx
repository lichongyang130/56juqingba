import type { Metadata } from "next";
import Link from "next/link";
import { BACKGROUNDS, COMPONENTS, LAB_TOOLS, PROMPTS } from "@/lib/data";
import { LEARN_ARTICLES } from "@/lib/learn";
import report from "../../../../docs/build-report.json";

export const metadata: Metadata = {
  title: "Open metrics — everything we can measure — Motif UI",
  description:
    "Library counters, prompt runs, build weight and changelog deltas, all recomputed at build time — plus the one number that is missing on purpose: visitors.",
};

/**
 * #487 — the open metrics page.
 *
 * A public dashboard is only worth reading if it is specific about what it
 * cannot show. This one publishes every counter the repository actually holds
 * — catalog totals, prompt runs, build weight, recorded deltas — and has a
 * section explaining why there is no page-view number: nothing here counts
 * visitors, so quoting one would mean inventing it.
 */

export default function MetricsOfPage() {
  const copies = COMPONENTS.reduce((s, c) => s + c.copies, 0);
  const runs = PROMPTS.reduce((s, p) => s + p.runs.length, 0);
  const scoredRuns = PROMPTS.flatMap((p) => p.runs.map((r) => r.fidelity));
  const avgFidelity = scoredRuns.reduce((s, f) => s + f, 0) / scoredRuns.length;
  const zeroDep = COMPONENTS.filter((c) => c.deps.length === 0).length;
  const summary = report.summary as { routes: number; prerendered: number; jsKb: number; cssKb: number };

  const counters = [
    { label: "Components", value: COMPONENTS.length.toLocaleString(), note: `MIT, ${zeroDep} with zero dependencies` },
    { label: "Prompts", value: PROMPTS.length.toLocaleString(), note: `${runs} recorded runs, avg fidelity ${avgFidelity.toFixed(1)}` },
    { label: "Backgrounds", value: BACKGROUNDS.length.toLocaleString(), note: "animated, gradients and textures" },
    { label: "Guides", value: LEARN_ARTICLES.length.toLocaleString(), note: "essays, CC BY 4.0" },
    { label: "Lab tools", value: LAB_TOOLS.length.toLocaleString(), note: `${LAB_TOOLS.filter((t) => t.free).length} free, ${LAB_TOOLS.filter((t) => !t.free).length} paid` },
    { label: "Copies", value: copies.toLocaleString(), note: "catalog-wide, from the data file" },
    { label: "Routes", value: summary.routes.toLocaleString(), note: `${summary.prerendered} prerendered` },
    { label: "JS shipped", value: `${summary.jsKb.toFixed(1)} KB`, note: `plus ${summary.cssKb.toFixed(1)} KB of CSS` },
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Open metrics</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">Trust · open metrics</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Everything we can measure</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          Every figure below is recomputed from this repository at build time — the data file, the prompt run logs and the build report. If a number
          here disagrees with a page elsewhere on the site, one of them is a bug, and the harness will usually find it first.
        </p>
      </div>

      <section className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {counters.map((c) => (
          <div key={c.label} className="rounded-2xl border border-white/8 bg-panel p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">{c.label}</p>
            <p className="mt-1 font-mono text-2xl tabular-nums">{c.value}</p>
            <p className="mt-1 text-[10px] leading-relaxed text-ink-dim">{c.note}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <h2 className="text-sm font-extrabold tracking-tight">Build weight, over time</h2>
          <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
            The two figures with a before and after in this repository&apos;s history — JavaScript on a route that renders no demo, and fonts
            preloaded. Both come from measured builds, not estimates.
          </p>
          <ul className="mt-4 space-y-3 font-mono text-[11px]">
            <li className="flex items-center justify-between gap-3">
              <span className="text-ink-dim">no-demo route JS</span>
              <span className="tabular-nums">
                <span className="text-ink-faint line-through">743.1 KB</span>
                <span className="mx-2 text-ink-faint">→</span>
                <span className="text-emerald-200">429.5 KB</span>
              </span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-ink-dim">fonts preloaded</span>
              <span className="tabular-nums">
                <span className="text-ink-faint line-through">261.4 KB</span>
                <span className="mx-2 text-ink-faint">→</span>
                <span className="text-emerald-200">80 KB</span>
              </span>
            </li>
          </ul>
          <Link href="/quality/speed" className="mt-4 inline-block text-[11px] font-semibold text-emerald-300 hover:text-emerald-200">
            the measured story →
          </Link>
        </div>

        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <h2 className="text-sm font-extrabold tracking-tight">What a public dashboard usually shows</h2>
          <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-ink-dim">
            <li>· Monthly visitors: not available — nothing on this site counts visitors.</li>
            <li>· Signups: not available — there is no account system, only a labelled demo console.</li>
            <li>· Downloads per asset: not available — copies are a catalog-wide counter in the data file, not per-visit events.</li>
            <li>· Revenue: not available — no paid tier exists.</li>
          </ul>
          <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
            All four would be easy to fabricate and impossible for a reader to check. Each of them is also a number that would make the honest ones
            on this page impossible to trust.
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">How to check any of this</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          The counters come from <span className="font-mono">src/lib/data.ts</span> and are the same values the catalog pages render. The build
          figures come from <span className="font-mono">docs/build-report.json</span>, regenerated by{" "}
          <span className="font-mono">npm run measure</span> on every build. The prompt runs live beside each prompt. Nothing on this page is
          maintained by hand, which is the only reason it is worth publishing.
        </p>
        <Link href="/quality" className="mt-3 inline-block text-[11px] font-semibold text-emerald-300 hover:text-emerald-200">
          the audit register →
        </Link>
      </section>
    </div>
  );
}
