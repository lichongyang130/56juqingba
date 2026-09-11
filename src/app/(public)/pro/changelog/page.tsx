import Link from "next/link";
import { ProChangelog, ProDemoBanner, ProSectionNav } from "@/components/pro-ui";
import { PRO_FEATURES, proChangelog } from "@/lib/pro";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/pro/changelog" },
  title: "Pro changelog",
  description: "Every Pro claim with its free alternative beside it, generated from the feature ledger so it cannot overstate.",
};

export default function ProChangelogPage() {
  const rows = proChangelog();
  const alreadyFree = rows.filter((r) => r.alreadyFree).length;
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">Pro changelog</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          Everything Pro-only, <span className="text-gradient">next to what is already free</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          {rows.length} rows generated from the same ledger every other page in this section reads, so this list cannot
          claim a feature the ledger does not. {alreadyFree} of them are things this build gives away — which is the honest
          version of a Pro changelog, and the reason the free column has equal width.
        </p>
      </div>

      <div className="mt-8">
        <ProSectionNav current="/pro/changelog" />
      </div>

      <div className="mt-8">
        <ProDemoBanner scope="A changelog of claims, not of releases — no release is billed" />
      </div>

      <div className="mt-10">
        <ProChangelog />
      </div>

      <div className="mt-10 rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Where the free column comes from</p>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          Each of the {PRO_FEATURES.length} rows is a <span className="font-mono">freeAlternative</span> field on a{" "}
          <span className="font-mono">ProFeature</span>. Writing it as data rather than prose means a new Pro promise cannot be
          added without answering the question the column asks — what does the free user get instead?
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link href="/pro/promise" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          ← The grandfather promise
        </Link>
        <Link href="/pro" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          The feature ledger →
        </Link>
      </div>
    </div>
  );
}
