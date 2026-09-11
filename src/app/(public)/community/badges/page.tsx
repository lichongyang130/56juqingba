import type { Metadata } from "next";
import Link from "next/link";
import { badgeReport } from "@/lib/community";
import { ROSTER } from "@/lib/community";

export const metadata: Metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/community/badges" },
  title: "Badges",
  description: "Four contributor badges, each awarded by a published rule that runs against live catalog and gate data — earned, never granted by hand.",
};

export default function BadgesPage() {
  const badges = badgeReport();
  const holders = new Set(badges.flatMap((b) => b.holders.map((h) => h.holder)));

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/community" className="hover:text-ink">Community</Link>
        <span>/</span>
        <span className="text-ink-dim">Badges</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Badges · awarded by rule</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Earned, not granted</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          Every badge is a function over data we already publish — catalog items per author, accessibility audits, prompt
          fidelity, gate outcomes in the queue. Nothing here is assigned by a person, which is the only way a badge
          survives contact with the people who did not get one.
        </p>
      </div>

      <div className="mt-9 space-y-5">
        {badges.map((b) => (
          <div key={b.slug} className="rounded-3xl border border-white/8 bg-panel p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-lg font-extrabold tracking-tight">
                  <span className="mr-2 text-amber-200">{b.mark}</span>
                  {b.name}
                </p>
                <p className="mt-1 max-w-2xl font-mono text-[11px] leading-relaxed text-ink-dim">{b.rule}</p>
              </div>
              <span className={`chip !text-[10px] ${b.holders.length ? "!border-mint/25 !text-mint" : ""}`}>
                {b.holders.length ? `${b.holders.length} holder${b.holders.length === 1 ? "" : "s"}` : "no holders yet"}
              </span>
            </div>

            {b.holders.length === 0 ? (
              <p className="mt-4 rounded-2xl border border-dashed border-white/12 px-4 py-5 text-[11px] leading-relaxed text-ink-faint">
                {b.threshold}
              </p>
            ) : (
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {b.holders.map((h) => (
                  <div key={h.holder} className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-ink">{h.holder}</p>
                      <p className="truncate font-mono text-[10px] text-ink-faint">{h.evidence}</p>
                    </div>
                    <span className="shrink-0 font-mono text-lg font-extrabold text-amber-200">{h.count}</span>
                  </div>
                ))}
              </div>
            )}
            {b.holders.length > 0 && b.holders.length < 3 && (
              <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">{b.threshold}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-9 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-sm font-extrabold">Who is eligible right now</p>
          <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
            {holders.size} names currently hold at least one badge. The catalog is authored end to end by one studio, so
            it takes the three catalog-side badges; the gate-side badges are computed over the {ROSTER.length}-handle
            sample queue, where nobody has reached three clean submissions yet.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[...holders].map((h) => (
              <span key={h} className="chip !text-[10px]">{h}</span>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-amber-300/25 bg-amber-300/[.04] p-6">
          <p className="text-sm font-extrabold text-amber-300">What we will not do</p>
          <ul className="prose-list mt-2">
            <li>No badge for buying, subscribing or referring — nothing here is purchasable.</li>
            <li>No “founding member” badge for existing without contributing.</li>
            <li>No badge that would require a backend to verify; every rule reads data already on this site.</li>
            <li>No retroactive lowering of a threshold to make the leaderboard look fuller.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
