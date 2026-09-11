import Link from "next/link";
import { PerfNav, TimerPanel } from "@/components/perf-ui";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/perf/timers" },
  title: "Timers & listeners",
  description: "Every setInterval, animation frame and event listener in the project, with its cleanup, counted from the source.",
};

export default function PerfTimersPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Memory hygiene guide</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          Every timer, <span className="text-gradient">and where it stops</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          An animation library with a leak is worse than a slow one: a page that keeps a timer alive keeps the CPU awake and
          the battery draining long after the tab is hidden. This audit counts registrations against cleanups across the whole
          source tree, which is a code reading rather than a profiler trace — the honest limits of which are stated below the
          table.
        </p>
      </div>

      <div className="mt-8">
        <PerfNav current="/perf/timers" />
      </div>

      <div className="mt-10">
        <TimerPanel />
      </div>

      <div className="mt-10 rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">What this audit does not do</p>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          It counts call sites, not live handles. A file with equal registrations and cleanups can still leak if the cleanup is
          in the wrong place, and a file with a gap of one is usually a single-shot frame that never needs cancelling. The
          measurement that settles it is a heap snapshot after navigating between twenty pages, and that needs a browser
          attached — which is on the device matrix page as a method, not as a result.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link href="/perf/blur" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          ← Blur budget
        </Link>
        <Link href="/perf/devices" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          Device matrix →
        </Link>
      </div>
    </div>
  );
}
