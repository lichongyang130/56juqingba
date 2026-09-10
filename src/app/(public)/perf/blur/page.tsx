import Link from "next/link";
import { BlurPanel, PerfNav } from "@/components/perf-ui";
import { blurSites } from "@/lib/perf";

export const metadata = {
  title: "Blur budget — Motif UI",
  description: "Every backdrop-blur in the project classified by the surface it covers, so the polish does not become the lag.",
};

export default function PerfBlurPage() {
  const { counts, sites } = blurSites();
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Backdrop-blur budget</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          {sites.length} blurs, <span className="text-gradient">{counts["full-surface"] ?? 0} of them full-screen</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          Frosted glass is the cheapest way to make an interface look expensive and one of the more expensive things to
          animate: a blurred layer forces the compositor to sample everything behind it, every frame. So the count matters, and
          so does where each one sits — a blur on a chip is a rounding error, a blur over the viewport is a scroll-time bill.
        </p>
      </div>

      <div className="mt-8">
        <PerfNav current="/perf/blur" />
      </div>

      <div className="mt-10">
        <BlurPanel />
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link href="/perf/chunks" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          ← Bundle splitting
        </Link>
        <Link href="/perf/timers" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          Timers &amp; listeners →
        </Link>
      </div>
    </div>
  );
}
