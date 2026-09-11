import Link from "next/link";
import { GrandfatherPanel, ProDemoBanner, ProSectionNav } from "@/components/pro-ui";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/pro/promise" },
  title: "The grandfather promise",
  description: "The price you join at is the price you keep, with the four cases it does not cover and the gap named.",
};

export default function ProPromisePage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Grandfather promise</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          A promise worth writing down <span className="text-gradient">and worth bounding</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          &ldquo;Your price never changes&rdquo; is the kind of line that reads well until the first renewal after a price rise
          — or until you cancel and come back. So the promise is here in full, with the four cases it does not cover listed
          beside it and a plain-text copy you can quote without a screenshot.
        </p>
      </div>

      <div className="mt-8">
        <ProSectionNav current="/pro/promise" />
      </div>

      <div className="mt-8">
        <ProDemoBanner scope="A policy, not an enforced price — there is no subscriber table to hold it" />
      </div>

      <div className="mt-10">
        <GrandfatherPanel />
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link href="/pro/discounts" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          ← Discount lanes
        </Link>
        <Link href="/pro/changelog" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          Every Pro claim, itemised →
        </Link>
      </div>
    </div>
  );
}
