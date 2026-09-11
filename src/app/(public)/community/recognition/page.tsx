import type { Metadata } from "next";
import Link from "next/link";
import { badgeReport, ROSTER, SPOTLIGHTS, winnerRows } from "@/lib/community";

export const metadata: Metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/community/recognition" },
  title: "Recognition tiers",
  description: "What Motif actually gives contributors at each milestone — badges, maker pages, spotlights and challenge wins that exist today, and the merch we deliberately do not pretend to have.",
};

export default function RecognitionPage() {
  const badges = badgeReport();
  const winners = winnerRows();

  const tiers = [
    {
      n: "01",
      t: "First submission",
      gets: ["A maker page with your handle and what you actually changed", "Your entry in the moderation queue with its gate line", "A review note thread on the asset you forked"],
      not: ["No badge — one submission is a start, not an achievement", "No swag, and no “welcome kit” that requires a postal address"],
      live: true,
    },
    {
      n: "02",
      t: "Three gate-clean submissions",
      gets: [
        "The Clean gates badge, computed from your records — it appears the moment the third one passes",
        "Eligibility for the weekly picks band, which ranks gate results before score",
      ],
      not: ["No fast lane that skips review", "No badge for three submissions that all carried warnings"],
      live: badges.some((b) => b.slug === "clean-gates" && b.holders.length > 0),
    },
    {
      n: "03",
      t: "A challenge win",
      gets: [
        `A permanent place in the winners rail (${winners.length} entry so far, decided by rule)`,
        "The brief becomes the interview: how you read the constraints and what you cut",
      ],
      not: ["No prize money", "No exclusivity — the winning approach stays open for anyone to remix"],
      live: winners.length > 0,
    },
    {
      n: "04",
      t: "A month in the spotlight",
      gets: [`${SPOTLIGHTS.length} spotlights written so far, one maker a month`, "The interview lives in Learn, next to the guides, not in a marketing page"],
      not: ["Interviews are never edited to remove a bad answer about our own catalog"],
      live: true,
    },
    {
      n: "05",
      t: "Catalog-scale contribution",
      gets: ["The badges the catalog itself can earn: original contributor, a11y champion, prompt scientist"],
      not: ["No “partner” tier, no logo slot, no paid placement — nothing on this site is for sale"],
      live: true,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/community" className="hover:text-ink">Community</Link>
        <span>/</span>
        <span className="text-ink-dim">Recognition</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Recognition · milestones, not merch</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">What you get, and what you don&apos;t</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          Lots of projects dangle a sticker pack for your first pull request and never send it. This site has no merch,
          no store and no shipping department, so the recognition tiers below are the ones that exist as pages and
          records you can check right now — with the empty column printed as loudly as the full one.
        </p>
      </div>

      <div className="mt-9 space-y-4">
        {tiers.map((t) => (
          <div key={t.n} className="rounded-3xl border border-white/8 bg-panel p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-mono text-xs font-extrabold text-ink-faint">{t.n}</span>
                <h2 className="mt-1 text-xl font-extrabold tracking-tight">{t.t}</h2>
              </div>
              <span className={`chip !text-[10px] ${t.live ? "!border-mint/25 !text-mint" : ""}`}>
                {t.live ? "live today" : "not yet claimed by anyone"}
              </span>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-mint/20 bg-mint/[.04] px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-mint">Exists today</p>
                <ul className="prose-list mt-2">
                  {t.gets.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-ink-faint">Deliberately not offered</p>
                <ul className="prose-list mt-2">
                  {t.not.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-9 rounded-3xl border border-amber-300/25 bg-amber-300/[.04] p-6">
        <h2 className="text-sm font-extrabold text-amber-300">On swag, specifically</h2>
        <p className="mt-2 text-xs leading-relaxed text-ink-dim">
          Physical rewards are a genuine motivator and a genuinely bad first promise for a project this size: they need
          stock, addresses, postage and someone to run it. Rather than list tiers we cannot ship, the milestone notes
          above are the whole programme. If a merch tier ever exists, it will be added here with the supplier, the cost
          and who pays it stated on the page — and until then, no page on this site will imply a sticker is coming.
        </p>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
          The {ROSTER.length} handles across this site are sample personas from the moderation demo, so nobody has
          actually reached a tier yet. The rules are written; the queue is demo data; that distinction stays printed.
        </p>
      </section>
    </div>
  );
}
