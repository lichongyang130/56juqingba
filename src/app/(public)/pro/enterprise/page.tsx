import Link from "next/link";
import { EnterpriseAsks, ProDemoBanner, ProSectionNav } from "@/components/pro-ui";
import { ENTERPRISE_ASKS } from "@/lib/pro";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/pro/enterprise" },
  title: "Enterprise asks",
  description: "SSO, SLA, DPA, security questionnaires and purchase orders: what is answerable today, what is not, and what each would take.",
};

export default function ProEnterprisePage() {
  const counts = ENTERPRISE_ASKS.reduce<Record<string, number>>((a, x) => {
    a[x.verdict] = (a[x.verdict] ?? 0) + 1;
    return a;
  }, {});
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Enterprise · contact card</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          What to say when a team asks <span className="text-gradient">for the enterprise things</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          {ENTERPRISE_ASKS.length} asks, with {counts["not available"] ?? 0} of them answered &ldquo;not available&rdquo; in
          plain words. A static build has no SSO to federate, no data to protect and no entity to invoice from, and pretending
          otherwise wastes a procurement team&apos;s afternoon.
        </p>
      </div>

      <div className="mt-8">
        <ProSectionNav current="/pro/enterprise" />
      </div>

      <div className="mt-8">
        <ProDemoBanner scope="No sales contact exists in this build" />
      </div>

      <div className="mt-10">
        <EnterpriseAsks />
      </div>

      <div className="mt-10 rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">The contact card itself</p>
        <pre className="mt-3 overflow-x-auto rounded-2xl border border-white/8 bg-[#07090f] p-4 font-mono text-[11px] leading-relaxed text-ink-dim">{`To: Motif UI (team enquiry)
Subject: Team plan — <company> (<seats> seats)

What we can do today:
  · ${ENTERPRISE_ASKS.find((a) => a.ask.startsWith("Volume"))?.today}

What we cannot do yet:
  · SSO/SAML, an SLA with credits, a signed DPA, invoicing against a PO.
    No accounts, no monitoring and no billing entity exist in this build.

What we need from you to answer properly:
  · Which of the above is a blocker, and which is a preference?
  · If seats are the only question, the team page computes the price.`}</pre>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-dim">
          There is no address to send that to. It is printed anyway because the alternative — a &ldquo;contact sales&rdquo;
          button that opens a form which goes nowhere — is the exact pattern this section exists to avoid.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link href="/pro/teams" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          ← Team seats
        </Link>
        <Link href="/pro/changelog" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          The Pro changelog →
        </Link>
      </div>
    </div>
  );
}
