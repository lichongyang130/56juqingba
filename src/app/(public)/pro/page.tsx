import Link from "next/link";
import { FeatureLedger, PlanSummaryRow, ProDemoBanner, ProSectionNav, PricingAudit, PRO_ROUTES } from "@/components/pro-ui";
import { FEATURE_STATES, MONEY_GAP, PRO_FEATURES } from "@/lib/pro";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/pro" },
  title: "Pro, itemised",
  description: "Every Pro promise with its state in this build, the free path beside it, and the plan copy audited line by line.",
};

export default function ProPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Pro · itemised</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          What Pro adds, <span className="text-gradient">stated so precisely it is checkable</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          Most pricing pages are written for the moment of purchase. This one is written for the moment after, when you
          notice what a bullet actually meant. So each of the {PRO_FEATURES.length} promises below carries a state —{" "}
          {FEATURE_STATES["works-now"].label.toLowerCase()}, {FEATURE_STATES["browser-demo"].label.toLowerCase()},{" "}
          {FEATURE_STATES["needs-server"].label.toLowerCase()} — the evidence for that state, and the free path that exists
          today. {MONEY_GAP}
        </p>
      </div>

      <div className="mt-8">
        <ProSectionNav current="/pro" />
      </div>

      <div className="mt-8">
        <ProDemoBanner scope="This is the section index, not a checkout" />
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">The prices, from the one table that holds them</p>
          <div className="mt-4">
            <PlanSummaryRow />
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-ink-dim">
            The pricing page and every page under <span className="font-mono">/pro</span> read these numbers from{" "}
            <span className="font-mono">src/lib/pro.ts</span>, including the yearly saving (computed from the two prices, never
            typed). One edit changes every surface at once, which is the only reliable way to keep a price honest across a
            site.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/pricing" className="btn btn-ghost !px-3.5 !py-2 text-xs">
              The plan cards →
            </Link>
            <Link href="/pro/bundles" className="btn btn-ghost !px-3.5 !py-2 text-xs">
              Compare against ala-carte →
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Everything in this section</p>
          <ul className="mt-3 space-y-2">
            {PRO_ROUTES.map((r) => (
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

      <div className="mt-10">
        <FeatureLedger />
      </div>

      <div className="mt-10">
        <PricingAudit />
      </div>
    </div>
  );
}
