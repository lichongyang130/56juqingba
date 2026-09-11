import Link from "next/link";
import { BuildPanel, MeasuredNote, OgWeightPanel, PerfNav, SharedJsPanel } from "@/components/perf-ui";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/perf/build" },
  title: "Build report",
  description: "What the production build compiles in: route counts, chunk counts, stylesheets, fonts and prerendered HTML.",
};

export default function PerfBuildPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Build transparency</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          What the build <span className="text-gradient">actually makes</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          A static site is a pile of files, and the pile is countable. This page reads the compiled output and reports it —
          including the part most sites leave out, which is how many routes are served from a prerendered file and how many are
          rendered on demand.
        </p>
      </div>

      <div className="mt-8">
        <PerfNav current="/perf/build" />
      </div>

      <div className="mt-4">
        <MeasuredNote />
      </div>

      <div className="mt-10">
        <BuildPanel />
      </div>

      <div className="mt-10">
        <SharedJsPanel />
      </div>

      <div className="mt-10">
        <OgWeightPanel />
      </div>

      <div className="mt-10 rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">How this is measured</p>
        <pre className="mt-3 overflow-x-auto rounded-2xl border border-white/8 bg-[#07090f] p-4 font-mono text-[10px] leading-relaxed text-ink-dim">{`next build                    → compiles routes, chunks, HTML
perf.ts routeBudgets()        → reads each route's compiled entry files
perf.ts collectHtml()         → walks .next/server/app for *.html
perf.ts fontAudit()           → reads the emitted woff2 files and the preload links`}</pre>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-dim">
          Every figure on this page comes from one of those three reads. A route that has no entry manifest is missing from the
          table rather than estimated, and a route with no prerendered HTML is labelled &ldquo;on demand&rdquo; rather than
          counted as static.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link href="/perf/devices" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          ← Device matrix
        </Link>
        <Link href="/perf/service-worker" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          Service worker plan →
        </Link>
      </div>
    </div>
  );
}
