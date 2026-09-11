import Link from "next/link";
import { ProDemoBanner, ProSectionNav } from "@/components/pro-ui";
import { TrialRail } from "@/components/pro-ui-2";
import { TRIAL_DAYS, featuresByState } from "@/lib/pro";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/pro/trial" },
  title: "The 7-day Pro trial",
  description: "A day-by-day trial walkthrough whose order is the honest one: working features first, server-bound promises last.",
};

export default function ProTrialPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Trial playbook</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          Seven days, <span className="text-gradient">ending honestly</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          A trial is usually a countdown over features the product already has. This one walks {TRIAL_DAYS.length} days in the
          order the build can actually deliver: {featuresByState("works-now").length} promises that need no server come early,{" "}
          {featuresByState("browser-demo").length} browser demos sit in the middle, and the{" "}
          {featuresByState("needs-server").length} that cannot exist without one arrive last — so the day the trial ends is the
          day the missing server becomes the story.
        </p>
      </div>

      <div className="mt-8">
        <ProSectionNav current="/pro/trial" />
      </div>

      <div className="mt-8">
        <ProDemoBanner scope="A trial you can walk through, not a trial you can sign up for" />
      </div>

      <div className="mt-10">
        <TrialRail />
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link href="/pro/unlimited" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          ← What unlimited means
        </Link>
        <Link href="/pro/api" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          Mint the day-5 token →
        </Link>
      </div>
    </div>
  );
}
