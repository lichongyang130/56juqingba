import Link from "next/link";
import { DevicePanel, PerfNav } from "@/components/perf-ui";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/perf/devices" },
  title: "Device matrix",
  description: "The three device classes this site is tested against, what each one measures, and the results that have not been run.",
};

export default function PerfDevicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Low-end device test notes</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          The matrix first, <span className="text-gradient">the results when there is hardware</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          Performance notes usually arrive as a claim — &ldquo;fast on low-end devices&rdquo; — with nothing behind it. The part
          that can be published honestly today is the matrix: which classes, what hardware and network they represent, and what
          would be measured on each. Results need devices this build does not have, and the page says so rather than inventing a
          table of green ticks.
        </p>
      </div>

      <div className="mt-8">
        <PerfNav current="/perf/devices" />
      </div>

      <div className="mt-10">
        <DevicePanel />
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link href="/perf/timers" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          ← Timers &amp; listeners
        </Link>
        <Link href="/perf/build" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          Build report →
        </Link>
      </div>
    </div>
  );
}
