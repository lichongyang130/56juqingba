import Link from "next/link";
import { ProDemoBanner, ProSectionNav } from "@/components/pro-ui";
import { ReferralDemo } from "@/components/pro-ui-2";
import { REFERRAL } from "@/lib/pro";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/pro/referral" },
  title: "Referral credit",
  description: "One month each, capped at six a year, with the uncapped maths printed rather than the marketing version.",
};

export default function ProReferralPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Referral credit</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          {REFERRAL.reward} <span className="text-gradient">and a cap that says why</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          Referral programmes are where honest sites quietly become pyramid schemes, so the terms are short and the cap is
          visible: {REFERRAL.cap} months per rolling year, credit applies to the subscription rather than cash, and a
          self-referral is only unenforceable here because there are no accounts to enforce it against.
        </p>
      </div>

      <div className="mt-8">
        <ProSectionNav current="/pro/referral" />
      </div>

      <div className="mt-8">
        <ProDemoBanner scope="No ledger, no accounts — the counter runs in your browser only" />
      </div>

      <div className="mt-10">
        <ReferralDemo />
      </div>

      <div className="mt-10 rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">The terms, in full</p>
        <ul className="mt-3 grid gap-2 md:grid-cols-2">
          {REFERRAL.terms.map((t) => (
            <li key={t} className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5 text-[11px] leading-relaxed text-ink-dim">
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link href="/pro/cancel" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          ← The cancel path
        </Link>
        <Link href="/pro/enterprise" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          Enterprise asks →
        </Link>
      </div>
    </div>
  );
}
