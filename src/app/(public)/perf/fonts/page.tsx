import Link from "next/link";
import { FontPanel, MeasuredNote, PerfNav } from "@/components/perf-ui";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/perf/fonts" },
  title: "Font loading",
  description: "Two latin subsets instead of nine files, both preloaded, with the before and after measured on real builds.",
};

export default function PerfFontsPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Font-loading audit</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          Two files, <span className="text-gradient">both preloaded</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          The audit found nine font files (261 KB) shipped for a site whose copy is English, and no preload link on any page —
          the faces were discovered only after the stylesheet parsed. Both are fixed in the layout, and this page shows the
          before and after with the build each number came from.
        </p>
      </div>

      <div className="mt-8">
        <PerfNav current="/perf/fonts" />
      </div>

      <div className="mt-4">
        <MeasuredNote />
      </div>

      <div className="mt-10">
        <FontPanel />
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link href="/perf" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          ← Page budgets
        </Link>
        <Link href="/perf/no-js" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          The no-JavaScript view →
        </Link>
      </div>
    </div>
  );
}
