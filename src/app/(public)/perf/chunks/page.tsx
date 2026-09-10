import Link from "next/link";
import { PerfNav, SplitPanel, MeasuredNote } from "@/components/perf-ui";

export const metadata = {
  title: "Bundle splitting — Motif UI",
  description: "What ships on /components versus /learn, and the single layout import that put 485 KB of demo code on every page.",
};

export default function PerfChunksPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Bundle-splitting tour</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          One import, <span className="text-gradient">every page</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          The budget report is what found it: pages that render no demo were loading the whole demo module. The cause was three
          hops of imports — the public layout needed one component, that component lived in a file that imports the demo module,
          and every route in the group inherited the result. This page shows the before, the after, and where the weight
          legitimately goes.
        </p>
      </div>

      <div className="mt-8">
        <PerfNav current="/perf/chunks" />
      </div>

      <div className="mt-4">
        <MeasuredNote />
      </div>

      <div className="mt-10">
        <SplitPanel />
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link href="/perf/mounting" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          ← Lazy mounting
        </Link>
        <Link href="/perf/blur" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          Blur budget →
        </Link>
      </div>
    </div>
  );
}
