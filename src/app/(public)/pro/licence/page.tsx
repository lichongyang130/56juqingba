import Link from "next/link";
import { LicenceCards, ProDemoBanner, ProSectionNav } from "@/components/pro-ui";
import { licenceRows } from "@/lib/pro";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/pro/licence" },
  title: "Licence clarity — Motif UI",
  description: "Free is MIT for the components, Pro is a service licence, and the two rows that are policy rather than stored data are labelled.",
};

export default function ProLicencePage() {
  const policyRows = licenceRows().filter((r) => !r.stored).length;
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">Licence clarity</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          Two licences, <span className="text-gradient">no legalese</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          The short version: the code is MIT and free forever; Pro is a licence for services that need a server. The longer
          version below is five rows, and {policyRows} of them are marked as site policy rather than as a stored field —
          because calling an asset &ldquo;MIT licensed&rdquo; when the catalog has no licence on it would be a claim the data
          does not support.
        </p>
      </div>

      <div className="mt-8">
        <ProSectionNav current="/pro/licence" />
      </div>

      <div className="mt-8">
        <ProDemoBanner scope="The free-forever promise is not a demo — the Pro column is" />
      </div>

      <div className="mt-10">
        <LicenceCards />
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link href="/pricing" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          Back to the plans →
        </Link>
        <Link href="/pro/unlimited" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          What unlimited means →
        </Link>
      </div>
    </div>
  );
}
