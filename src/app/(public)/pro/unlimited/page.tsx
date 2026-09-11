import Link from "next/link";
import { ProDemoBanner, ProSectionNav, UnlimitedPanel } from "@/components/pro-ui";
import { unlimitedRows } from "@/lib/pro";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/pro/unlimited" },
  title: "What unlimited means",
  description: "The word 'unlimited' measured against what this build actually does: unlimited copies, yes; unlimited API calls, no API.",
};

export default function ProUnlimitedPage() {
  const rows = unlimitedRows();
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Usage-based honesty</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          &ldquo;Unlimited&rdquo; is a word, <span className="text-gradient">not a policy</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          Unlimited copies is the easiest promise a component library makes, and the easiest to break quietly. So it is
          written out here as {rows.means.length} things it covers and {rows.doesNotMean.length} things it does not, with the
          one number this site does keep — its own rolling copy count — described for what it is.
        </p>
      </div>

      <div className="mt-8">
        <ProSectionNav current="/pro/unlimited" />
      </div>

      <div className="mt-8">
        <ProDemoBanner scope="Nothing on this page is metered — including the paid tiers" />
      </div>

      <div className="mt-10">
        <UnlimitedPanel />
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link href="/pro/licence" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          ← The licence table
        </Link>
        <Link href="/pro/trial" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          Simulate the 7-day trial →
        </Link>
      </div>
    </div>
  );
}
