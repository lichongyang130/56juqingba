import Link from "next/link";
import { PerfNav, Stat, MeasuredNote } from "@/components/perf-ui";
import { SW_PLAN, buildSummary } from "@/lib/perf";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/perf/service-worker" },
  title: "Service worker plan",
  description: "What an offline catalog would cache, how it would be versioned, and why it ships after the API rather than before.",
};

export default function PerfServiceWorkerPage() {
  const s = buildSummary();
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Service worker plan</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          Offline later, <span className="text-gradient">deliberately</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">{SW_PLAN.status}</p>
      </div>

      <div className="mt-8">
        <PerfNav current="/perf/service-worker" />
      </div>

      <div className="mt-4">
        <MeasuredNote />
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        <Stat label="HTML to precache" value={`${s.htmlKb} KB`} sub={`${s.htmlFiles} prerendered files`} />
        <Stat label="Assets to precache" value={`${s.cssKb + s.fontKb} KB`} sub={`${s.cssFiles} stylesheet + ${s.fontFiles} fonts`} />
        <Stat label="Chunks on demand" value={`${s.jsFiles}`} sub={`${s.jsKb} KB — hashed, so cache-first is safe`} />
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">What would be cached</p>
          <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-ink-dim">
            {SW_PLAN.wouldCache.map((x) => (
              <li key={x} className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5">
                {x}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Strategy</p>
          <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-ink-dim">
            {SW_PLAN.strategy.map((x) => (
              <li key={x} className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5">
                {x}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-dashed border-amber-300/25 bg-amber-300/[.04] p-6">
          <p className="text-sm font-extrabold text-amber-200">What it needs from the API</p>
          <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-amber-100/80">
            {SW_PLAN.needsApi.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <p className="mt-3 text-[10px] leading-relaxed text-amber-100/60">{SW_PLAN.measured}</p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link href="/perf/build" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          ← Build report
        </Link>
        <Link href="/perf" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          Page budgets →
        </Link>
      </div>
    </div>
  );
}
