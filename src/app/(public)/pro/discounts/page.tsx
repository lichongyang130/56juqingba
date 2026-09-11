import Link from "next/link";
import { ProDemoBanner, ProSectionNav } from "@/components/pro-ui";
import { DiscountLanePicker } from "@/components/pro-ui-2";
import { DISCOUNT_LANES } from "@/lib/pro";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/pro/discounts" },
  title: "Discount lanes — Motif UI",
  description: "Four discount lanes, including one that asks for nothing, priced live against the shared plan table.",
};

export default function ProDiscountsPage() {
  const noProof = DISCOUNT_LANES.find((l) => l.proof.startsWith("A one-line"));
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">Discount lanes</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          A discount should not cost <span className="text-gradient">more than it gives</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          {DISCOUNT_LANES.length} lanes: students and teachers, independent builders, nonprofits — and one that asks for a{" "}
          single line of text and no documents at all. Each lane states what proof it wants, and the calculator applies the
          rate to the shared price table so the numbers cannot drift from the plan cards.
        </p>
      </div>

      <div className="mt-8">
        <ProSectionNav current="/pro/discounts" />
      </div>

      <div className="mt-8">
        <ProDemoBanner scope="No verification exists — every lane is described, priced and labelled" />
      </div>

      <div className="mt-10">
        <DiscountLanePicker />
      </div>

      <div className="mt-10 rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">The lane that asks for nothing</p>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          {noProof?.label}: {noProof?.proof} It is listed last because it is the cheapest lane to run and the hardest to write
          about without sounding like a marketing gesture. The honest description of its gap is above: someone at this end has
          to read the request, and there is nobody on this end.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link href="/pro/teams" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          ← Team seats
        </Link>
        <Link href="/pro/cancel" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          The cancel path →
        </Link>
      </div>
    </div>
  );
}
