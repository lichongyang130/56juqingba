import Link from "next/link";
import { MountingPanel, MeasuredNote, PerfNav } from "@/components/perf-ui";
import { COMPONENTS } from "@/lib/data";

export const metadata = {
  title: "Lazy scene mounting — Motif UI",
  description: "Catalog demos mount when they come near the viewport, with the HTML savings and the no-JavaScript trade-off measured.",
};

export default function PerfMountingPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Lazy scene mounting</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          Demos that wait <span className="text-gradient">until you look</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          The catalog grid used to mount every demo on first paint — {COMPONENTS.length} live React subtrees on /components, each with its own
          timers and animations, running in rows nobody had reached yet. Now they mount when a card comes within one screen of
          the viewport, and the numbers below are the two builds measured side by side.
        </p>
      </div>

      <div className="mt-8">
        <PerfNav current="/perf/mounting" />
      </div>

      <div className="mt-4">
        <MeasuredNote />
      </div>

      <div className="mt-10">
        <MountingPanel />
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link href="/perf/no-js" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          ← Zero-JS showcase
        </Link>
        <Link href="/perf/chunks" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          Bundle splitting →
        </Link>
      </div>
    </div>
  );
}
