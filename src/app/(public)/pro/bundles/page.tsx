import Link from "next/link";
import { BundleFloor, ProDemoBanner, ProSectionNav } from "@/components/pro-ui";
import { CostMeter } from "@/components/pro-ui-2";
import { PACKS, planOf } from "@/lib/pro";

export const metadata = {
  title: "Bundle vs ala-carte — Motif UI",
  description: "A cost meter over the real pack prices that will tell you when buying one thing beats the bundle.",
};

export default function ProBundlesPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">Bundle vs ala-carte</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          A meter that argues <span className="text-gradient">against its own bundle</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          {PACKS.length} packs, real unit prices, and a running comparison against the ${planOf("pro").monthly} Pro plan. Pick
          one pack and the meter will tell you the bundle is the wrong buy — which is exactly the sentence a cost meter at a
          checkout usually refuses to print.
        </p>
      </div>

      <div className="mt-8">
        <ProSectionNav current="/pro/bundles" />
      </div>

      <div className="mt-8">
        <ProDemoBanner scope="Unit prices from the plan table; no checkout behind the meter" />
      </div>

      <div className="mt-10">
        <CostMeter />
      </div>

      <div className="mt-10">
        <BundleFloor />
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link href="/pro" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          ← The feature ledger
        </Link>
        <Link href="/pricing" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          The plan cards →
        </Link>
      </div>
    </div>
  );
}
