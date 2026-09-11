import type { Metadata } from "next";
import Link from "next/link";
import { BETS } from "@/lib/roadmap";

export const metadata: Metadata = {
  title: "Gaps — what this site cannot do, and why",
  description:
    "Two registers of what this build does not have: work blocked by infrastructure, and work blocked by a missing browser, domain or person — each naming what would make it real.",
  alternates: { canonical: "/gaps" },
};

/**
 * #91 — the blocked buckets, in one place.
 *
 * /roadmap already carries the ten north-star bets with their real status, and
 * that format — if anything needs explaining it does not ship — is followed
 * here. What was missing is the other half: the work that is not a product
 * decision but a missing capability. Real Lighthouse numbers need a browser;
 * a second measurement series needs a second machine; field vitals need
 * visitors. None of those is blocked by a plan, and none of them can be
 * produced by trying harder in a build step.
 *
 * The list below is derived where it can be: the infrastructure half comes from
 * BETS, so a bet that goes live disappears from here in the same commit, and
 * the environment half is the set of numbers the site already labels as
 * unmeasured on the pages that would show them.
 */

const ENVIRONMENT: { thing: string; needs: string; today: string; href: string; label: string }[] = [
  {
    thing: "A real Lighthouse score",
    needs: "A browser. The build has none: every performance figure on this site is measured from files and responses.",
    today: "Transfer sizes, chunk counts, HTML weights and font preloads, all from the build report — and the pages say which of those is a proxy.",
    href: "/perf",
    label: "/perf",
  },
  {
    thing: "A second measurement series",
    needs: "A second machine, or a runner. One build report cannot tell a regression from the noise of the machine that produced it.",
    today: "A double-build determinism concern is recorded, and every number keeps the build that produced it.",
    href: "/perf/build",
    label: "/perf/build",
  },
  {
    thing: "Field vitals",
    needs: "Visitors. A lab measurement is not a field measurement, and this site has no analytics by design.",
    today: "Nothing, and the pages that would show it do not pretend to: there is no vitals panel to fill.",
    href: "/metrics",
    label: "/metrics",
  },
  {
    thing: "Visitor, signup and revenue numbers",
    needs: "Real traffic and a payment processor. There is no backend and no checkout.",
    today: "Every count on the site is a property of the catalog — copies, runs, components — not of its audience.",
    href: "/metrics",
    label: "/metrics",
  },
  {
    thing: "A one-click CodeSandbox link",
    needs: "A round trip to codesandbox.io. That was attempted while writing the integration and failed from here (no response, HTTP 000).",
    today: "The file bundle is downloadable and the page states which half is missing.",
    href: "/integrations/codesandbox",
    label: "/integrations/codesandbox",
  },
  {
    thing: "A live domain",
    needs: "DNS. Every canonical, card and feed URL is built from a placeholder base that is documented as such.",
    today: "The base is one constant with one environment override rather than strings scattered across metadata.",
    href: "/quality/schema",
    label: "/quality/schema",
  },
  {
    thing: "Absolute-URL round trips from the harness",
    needs: "Network egress. The suites request the local server; a fetch to a public URL fails with ENOTFOUND inside this environment.",
    today: "The checks that need an origin take it from the incoming request, so no origin is hard-coded anywhere in the tree.",
    href: "/quality/aria",
    label: "/quality/aria",
  },
  {
    thing: "A browser-run accessibility session",
    needs: "A person with a browser and a screen reader. Seven checks are listed for exactly this and the page says none has been run.",
    today: "The static half: 292 documents and 385 served pages, no findings, plus the counts that say what the pass cannot see.",
    href: "/quality/aria",
    label: "/quality/aria",
  },
];

export default function GapsPage() {
  const blocked = BETS.filter((b) => b.status !== "live");

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Gaps</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-rose-300">Status · what is missing</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          What this site <span className="text-gradient">cannot do</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          Two registers, and the difference between them is the point. The first is <strong className="text-ink">infrastructure-blocked</strong>: the work
          is understood and would ship, but it needs a database, a payment path or another person. The second is{" "}
          <strong className="text-ink">environment-blocked</strong>: nothing here can produce it — a browser, a domain and a second machine are not build
          steps. {blocked.length} bets and {ENVIRONMENT.length} environment items are open, and every one names what would make it real instead of
          estimating what it would look like.
        </p>
      </div>

      <section className="mt-10">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/6 pb-3">
          <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-rose-200">A · Infrastructure-blocked</h2>
          <span className="text-[11px] text-ink-faint">
            from <Link href="/roadmap" className="underline decoration-dotted">/roadmap</Link>, which carries the full four questions per bet
          </span>
        </div>
        <div className="mt-4 space-y-2">
          {blocked.map((bet) => (
            <div key={bet.slug} className="rounded-2xl border border-white/8 bg-panel p-4">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-mono text-[10px] text-ink-faint">#{String(bet.n).padStart(2, "0")}</span>
                <h3 className="text-[13px] font-bold text-ink">{bet.title}</h3>
                <span
                  className={`rounded-full border px-2 py-0.5 font-mono text-[9px] ${
                    bet.status === "partial"
                      ? "border-amber-300/25 bg-amber-400/10 text-amber-200"
                      : "border-rose-300/25 bg-rose-400/10 text-rose-200"
                  }`}
                >
                  {bet.status === "partial" ? "partly built" : "spec only"}
                </span>
              </div>
              <p className="mt-2 text-[11.5px] leading-relaxed text-ink-dim">{bet.cost}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-ink-faint">
                <span className="font-bold uppercase tracking-wider">Would refuse </span>
                {bet.refuse}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/6 pb-3">
          <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-amber-200">B · Environment-blocked</h2>
          <span className="text-[11px] text-ink-faint">nothing in this repository can produce these</span>
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/8">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-white/[.03] text-[10px] uppercase tracking-widest text-ink-faint">
              <tr>
                <th className="px-4 py-2 font-bold">Missing</th>
                <th className="px-4 py-2 font-bold">What it needs</th>
                <th className="px-4 py-2 font-bold">What exists instead</th>
              </tr>
            </thead>
            <tbody>
              {ENVIRONMENT.map((row) => (
                <tr key={row.thing} className="border-t border-white/6 align-top">
                  <td className="px-4 py-3 font-semibold text-ink">{row.thing}</td>
                  <td className="px-4 py-3 text-ink-dim">{row.needs}</td>
                  <td className="px-4 py-3 text-ink-faint">
                    {row.today}{" "}
                    <Link href={row.href} className="whitespace-nowrap font-mono text-cyan-300 hover:text-cyan-200">
                      {row.label}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-10 max-w-3xl text-[11px] leading-relaxed text-ink-faint">
        The rule behind both registers is the one the roadmap states and the rest of the site follows: if a thing needs explaining, it does not ship.
        A fake dashboard is not a smaller version of a dashboard, it is a smaller version of the site&apos;s credibility — which is why the numbers that
        could not be measured are named here instead of estimated somewhere else.
      </p>
    </div>
  );
}
