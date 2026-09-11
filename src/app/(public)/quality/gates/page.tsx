import type { Metadata } from "next";
import Link from "next/link";
import { HARNESSES, gateCounts, gateEntries, lastRun } from "@/lib/gates";
import { MARKUP_CHECKS, SERVED_EXTRAS } from "@/lib/markup-a11y";
import { MANUAL_CHECKS } from "@/lib/a11y-audit";

// On demand, not prerendered: the index reads the two scripts, the blame index
// and the last recorded run from disk, and a page prerendered mid-build would
// print a partial list as if it were the whole one.
export const dynamic = "force-dynamic";

/**
 * The description counts the checks, so it cannot go stale the way a typed
 * "167 named checks" would the next time a check is added — and the ~200
 * character limit the sitemap sweep enforces is what keeps the sentence honest.
 */
export async function generateMetadata(): Promise<Metadata> {
  const count = gateEntries().length;
  return {
    alternates: { canonical: "/quality/gates" },
    title: "Every check, and what it stands for",
    description: `The complete index of the suites: ${count} named checks read from the scripts, the condition each one asserts, the commit that last wrote it, and the rules no command can run.`,
  };
}

/**
 * #35 — the public index of the checks.
 *
 * The site had ten pages about quality and none that listed the checks
 * themselves, so "gated in CI" was a sentence a reader had to take on faith.
 * This page is generated: the names and conditions come from the `ok(…)` calls
 * in the scripts, the commit column from `git blame` (see
 * `npm run gates:index`), the accessibility rules from the modules the a11y
 * pass reads, and the pass counts from the last recorded run. Nothing on it is
 * typed twice, and the gaps — names composed at run time, checks no command
 * runs — are printed rather than hidden.
 */
export default function GatesPage() {
  const entries = gateEntries();
  const counts = gateCounts(entries);
  const { measuredAt } = lastRun();
  const printed = counts.reduce((n, c) => n + Number(c.printed ?? 0), 0);
  const dynamicNames = entries.filter((e) => e.dynamic).length;
  const batches = new Set(entries.map((e) => e.commit).filter(Boolean));
  const withCommit = entries.filter((e) => e.commit).length;

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <Link href="/quality" className="hover:text-ink">
          Quality bar
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Check index</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">Quality · every gate, in the open</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Every check, and what it stands for</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          {entries.length} named checks across the two suites that assert against the site, plus {MARKUP_CHECKS.length} markup rules and{" "}
          {MANUAL_CHECKS.length} checks a person has to run. Every name and every condition on this page is read out of the source at request time —
          the list is the code, not a description of it — and each one carries the commit that last wrote it, so a check has an author and a date
          rather than a reputation.
        </p>
      </div>

      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Named checks", value: String(entries.length), note: `${HARNESSES.length} scripts · read from their ok(…) calls` },
          { label: "Checks printed", value: String(printed), note: "loops run a named check more than once; the last recorded run's count" },
          { label: "Markup rules", value: String(MARKUP_CHECKS.length), note: `run twice: over the built HTML and over ${SERVED_EXTRAS.length} served routes` },
          { label: "Batches behind them", value: String(batches.size), note: `${withCommit} of ${entries.length} lines carry a blame commit` },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border border-white/8 bg-panel p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">{c.label}</p>
            <p className="mt-1 font-mono text-2xl tabular-nums">{c.value}</p>
            <p className="mt-1 text-[10px] leading-relaxed text-ink-dim">{c.note}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">How this page is kept true</h2>
        <ul className="mt-3 space-y-2 text-[11.5px] leading-relaxed text-ink-dim">
          <li>
            <b className="text-ink">Names and conditions</b> are parsed out of the <span className="font-mono">ok(…)</span> calls in the scripts on
            every request. Rename a check, ship it, and this page shows the new name — there is no second copy to forget.
          </li>
          <li>
            <b className="text-ink">The commit column</b> is a <span className="font-mono">git blame</span> of the line the check is written on,
            regenerated by <span className="font-mono">npm run gates:index</span>. The gate index is a checked-in file, and the export gate re-derives it and
            fails when it is stale, so the column cannot quietly point at the wrong batch.
          </li>
          <li>
            <b className="text-ink">The counts</b> in the cards and in each heading are the last recorded run in{" "}
            <span className="font-mono">docs/check-report.json</span>
            {measuredAt ? ` (${measuredAt.slice(0, 10)})` : ""} — wall times and pass counts together, so a suite that doubles is visible.
          </li>
        </ul>
      </section>

      {HARNESSES.map((h) => {
        const mine = entries.filter((e) => e.suite === h.suite);
        const c = counts.find((x) => x.suite === h.suite);
        return (
          <section key={h.suite} className="mt-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-sm font-extrabold tracking-tight">
                <span className="font-mono text-emerald-200">{h.suite}</span> — {h.what}
              </h2>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                {mine.length} calls{printed && c?.printed ? ` · ${c.printed} printed` : ""}
                {c?.ms ? ` · ${(c.ms / 1000).toFixed(1)}s` : ""}
              </p>
            </div>
            <ul className="mt-3 divide-y divide-white/6 overflow-hidden rounded-2xl border border-white/8 bg-panel">
              {mine.map((e) => (
                <li key={`${e.suite}-${e.name}`} className="px-4 py-2.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <p className="text-[11.5px] font-semibold leading-relaxed">
                      {e.name}
                      {e.dynamic && (
                        <span className="ml-2 font-mono text-[9px] uppercase tracking-widest text-amber-200/80">runs per item</span>
                      )}
                    </p>
                    {e.commit ? (
                      <span className="shrink-0 font-mono text-[9px] text-ink-faint" title={e.subject ?? ""}>
                        {e.commit} · {e.date}
                      </span>
                    ) : (
                      <span className="shrink-0 font-mono text-[9px] text-ink-faint">no blame data</span>
                    )}
                  </div>
                  {e.assertion && (
                    <p className="mt-1 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[10px] leading-relaxed text-ink-dim" title={e.assertion}>
                      asserts: {e.assertion}
                    </p>
                  )}
                  {e.commit && e.subject && (
                    <p className="mt-0.5 truncate text-[10px] leading-relaxed text-ink-faint">{e.subject}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <section className="mt-8 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">
          The {MARKUP_CHECKS.length} markup rules, and the failure each one prevents
        </h2>
        <p className="mt-2 text-[11.5px] leading-relaxed text-ink-dim">
          These are the checks with prose attached, because the failure is a user-visible one: they run over every built page document and again over{" "}
          {SERVED_EXTRAS.length} routes that are rendered on demand, and a finding is a finding in either mode. The current count for each rule is on{" "}
          <Link href="/quality/aria" className="text-emerald-200 underline decoration-dotted">
            the markup audit
          </Link>
          .
        </p>
        <ul className="mt-4 space-y-2">
          {MARKUP_CHECKS.map((rule) => (
            <li key={rule.id} className="border-b border-white/6 pb-2 last:border-0">
              <p className="text-[11.5px] leading-relaxed text-ink-dim">{rule.what}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">The {MANUAL_CHECKS.length} checks no command runs</h2>
        <p className="mt-2 text-[11.5px] leading-relaxed text-ink-dim">
          Everything above is decided by a machine. These are not, and no suite here reports on them: a browser has to open the page, and a person has
          to look. They are named rather than implied, and the accessibility statement says plainly that none of them has been run — listing a check
          is not passing it.
        </p>
        <ul className="mt-3 space-y-1.5">
          {MANUAL_CHECKS.map((m) => (
            <li key={m.title} className="text-[11.5px] leading-relaxed">
              <span className="mr-2 font-mono text-[10px] text-ink-faint">manual</span>
              {m.title}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
          What each one would catch, and how to run it, is on{" "}
          <Link href="/accessibility" className="text-emerald-200 underline decoration-dotted">
            /accessibility
          </Link>
          .
        </p>
      </section>

      <section className="mt-8 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">What this index cannot show</h2>
        <ul className="mt-3 space-y-2 text-[11.5px] leading-relaxed text-ink-dim">
          <li>
            <b className="text-ink">{dynamicNames} names are composed at run time.</b> A check inside a loop prints one name per route or per asset;
            those appear here with the varying part replaced by <span className="font-mono">…</span> and tagged{" "}
            <span className="font-mono text-[9px] text-amber-200/80">runs per item</span>. Printing one entry per iteration would need the live
            server, and the loop is the thing that makes the count larger than the list.
          </li>
          <li>
            <b className="text-ink">The condition column is code.</b> Only the {MARKUP_CHECKS.length} markup rules ship a sentence about the failure
            they prevent; for the rest, the assertion is quoted as written, because that is the strongest true thing this page can say about it.
          </li>
          <li>
            <b className="text-ink">The commit is the last edit, not the first idea.</b> A check that was rewritten three batches later carries the
            later batch. Blame answers &ldquo;who last wrote this line&rdquo; exactly, and the alternative — a hand-kept table of origins — is the
            drift this page exists to avoid.
          </li>
          <li>
            <b className="text-ink">A green suite is not a certificate.</b> These checks assert the things that have been written down; the numbers
            they cannot produce, and the bets that are blocked on infrastructure, are on{" "}
            <Link href="/gaps" className="text-emerald-200 underline decoration-dotted">
              /gaps
            </Link>
            .
          </li>
        </ul>
      </section>

      <section className="mt-8 flex flex-wrap gap-2 text-[11px]">
        {[
          { href: "/quality", label: "Quality bar" },
          { href: "/quality/aria", label: "Markup audit" },
          { href: "/gaps", label: "Gaps and blocked bets" },
          { href: "/accessibility", label: "Accessibility statement" },
        ].map((l) => (
          <Link key={l.href} href={l.href} className="chip hover:!border-white/30 hover:!text-ink">
            {l.label} →
          </Link>
        ))}
      </section>
    </div>
  );
}
