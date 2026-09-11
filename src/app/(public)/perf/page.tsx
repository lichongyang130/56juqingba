import Link from "next/link";
import { BudgetSummary, BudgetTable, PERF_ROUTES, MeasuredNote, PerfNav } from "@/components/perf-ui";
import { buildAvailable, buildSummary, routeBudgets } from "@/lib/perf";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/perf" },
  title: "Page budgets",
  description: "Every route's own JavaScript, its CSS and its HTML, measured from the compiled build rather than estimated.",
};

export default function PerfPage() {
  const gap = buildAvailable();
  const rows = routeBudgets();
  const shell = buildSummary();
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Performance & delivery</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          The weight of every page, <span className="text-gradient">measured</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          {gap.ok
            ? `${rows.length} routes, each one's own JavaScript separated from the bundle every page shares, read out of the compiled entry files. The "why this size" column is derived from the import graph, not written by hand — it follows the route's own imports and lists the client modules it pulls in, with their line counts.`
            : gap.reason}
        </p>
      </div>

      <div className="mt-8">
        <PerfNav current="/perf" />
      </div>

      <div className="mt-4">
        <MeasuredNote />
      </div>

      <div className="mt-8">
        <BudgetSummary />
      </div>

      <div className="mt-8">
        <BudgetTable />
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">How to read a budget</p>
          <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
            &ldquo;Own JS&rdquo; is what a route adds on top of the lightest route&apos;s file set, which is {shell.sharedJsKb} KB in
            this build, and &ldquo;Total&rdquo; is everything it loads. The two columns answer different questions: own tells you
            what a page brought with it, total tells you what a reader downloads on a cold visit. The bundle-splitting page shows
            the layout import that changed that arithmetic for pages which render no demo at all.
          </p>
          <Link href="/perf/chunks" className="btn btn-ghost mt-3 !px-3.5 !py-2 text-xs">
            What ships where →
          </Link>
        </div>
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Every page in this section</p>
          <p className="mt-2 rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5 text-[11px] leading-relaxed text-ink-dim">
            One item in this section is not a page: <span className="font-mono text-[10px]">#412</span> puts the measured size
            change on every changelog entry from 2026-09-10 onward, including the entry that describes the fix itself —{" "}
            <Link href="/#changelog" className="underline decoration-dotted">
              see the changelog
            </Link>
            .
          </p>
          <ul className="mt-3 space-y-2">
            {PERF_ROUTES.filter((r) => r.href !== "/perf").map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="block rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5 transition-colors hover:border-white/18">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="text-[12px] font-bold">{r.label}</span>
                    <span className="font-mono text-[10px] text-ink-faint">{r.item}</span>
                  </span>
                  <span className="mt-0.5 block text-[10px] leading-relaxed text-ink-dim">{r.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
