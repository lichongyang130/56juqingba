import Link from "next/link";
import { CancelAftermath, ProDemoBanner, ProSectionNav } from "@/components/pro-ui";
import { CancelDemo } from "@/components/pro-ui-2";
import { CANCEL_STEPS } from "@/lib/pro";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/pro/cancel" },
  title: "The cancel path",
  description: "A three-step cancellation you can click through, and the dark patterns the flow refuses to contain.",
};

export default function ProCancelPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-rose-300">Cancel-path demo</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          Cancelling is a button, <span className="text-gradient">not a maze</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          {CANCEL_STEPS.length} steps, one of them optional, and a list of the five retention tricks this flow cannot contain
          because they are not in the code. Walk it below: the cancel button sits on the billing page, the reason is skippable,
          and undo is called <span className="font-mono">Resume</span> rather than hidden behind a support request.
        </p>
      </div>

      <div className="mt-8">
        <ProSectionNav current="/pro/cancel" />
      </div>

      <div className="mt-8">
        <ProDemoBanner scope="Local demo state — there is no subscription to cancel" />
      </div>

      <div className="mt-10">
        <CancelDemo />
      </div>

      <div className="mt-10">
        <CancelAftermath />
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link href="/pro/discounts" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          ← Discount lanes
        </Link>
        <Link href="/pro/referral" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          Referral credit →
        </Link>
      </div>
    </div>
  );
}
