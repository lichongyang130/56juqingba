import type { Metadata } from "next";
import Link from "next/link";
import { COMPONENTS, PROMPTS } from "@/lib/data";
import { LEARN_ARTICLES } from "@/lib/learn";
import { REVIEW_CYCLE_DAYS, ageInDays, daysUntil, reviewDue } from "@/lib/freshness";

export const metadata: Metadata = {
  title: "Refresh dates — what is stamped and what is scheduled — Motif UI",
  description:
    "The rule behind every date on the site: 'added' and 'updated' are facts from the records, 'review due' is a computed schedule, and the distinction is printed.",
  robots: { index: false },
};

export default function RefreshedPage() {
  const assets = [...COMPONENTS].sort((a, b) => (a.published < b.published ? -1 : 1));
  const oldest = assets[0];
  const prompts = [...PROMPTS].sort((a, b) => (a.published < b.published ? -1 : 1));
  const essays = [...LEARN_ARTICLES].sort((a, b) => (a.updated < b.updated ? -1 : 1));
  const dueSoon = assets.filter((a) => daysUntil(reviewDue(a.published)) <= 30).length;
  const oldestEssay = essays[0];
  const staleEssays = essays.filter((a) => ageInDays(a.updated) > 90).length;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <Link href="/quality" className="hover:text-ink">
          Quality bar
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Refresh dates</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">Freshness · the rule</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Which dates are facts</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          Three kinds of date appear on this site and they are not the same kind of statement. <strong>Added</strong> and{" "}
          <strong>updated</strong> come from the records themselves. <strong>Review due</strong> is a schedule computed by adding{" "}
          {REVIEW_CYCLE_DAYS} days to the added date — a plan, not a record that anybody reviewed anything. Every stamp on an asset page says
          which one it is, and no page claims a review happened.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Components tracked", value: String(assets.length), note: `oldest added ${oldest.published}` },
          { label: "Reviews due in 30 days", value: String(dueSoon), note: `on a ${REVIEW_CYCLE_DAYS}-day cycle` },
          { label: "Essays older than 90 days", value: String(staleEssays), note: `oldest updated ${oldestEssay.updated}` },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/8 bg-panel p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">{s.label}</p>
            <p className="mt-1 font-mono text-2xl tabular-nums">{s.value}</p>
            <p className="mt-1 text-[10px] text-ink-dim">{s.note}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-200">Components — added, and next review</h2>
        <div className="mt-4 max-h-[26rem] overflow-auto rounded-2xl border border-white/8">
          <table className="w-full text-left text-[11px]">
            <thead className="sticky top-0 bg-[#0d1017] text-[10px] uppercase tracking-widest text-ink-faint">
              <tr>
                <th className="px-4 py-2 font-bold">Asset</th>
                <th className="px-4 py-2 font-bold">Added</th>
                <th className="px-4 py-2 font-bold">Review due</th>
                <th className="px-4 py-2 font-bold">In</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((a) => {
                const due = reviewDue(a.published);
                const inDays = daysUntil(due);
                return (
                  <tr key={a.slug} className="border-t border-white/6">
                    <td className="px-4 py-1.5">
                      <Link href={`/components/${a.slug}`} className="font-semibold hover:underline">
                        {a.title}
                      </Link>
                    </td>
                    <td className="px-4 py-1.5 font-mono tabular-nums text-ink-dim">{a.published}</td>
                    <td className="px-4 py-1.5 font-mono tabular-nums text-ink-dim">{due}</td>
                    <td className={`px-4 py-1.5 font-mono tabular-nums ${inDays <= 30 ? "text-amber-200" : "text-ink-faint"}`}>
                      {inDays} day{inDays === 1 ? "" : "s"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <h2 className="text-sm font-extrabold tracking-tight">Prompts — body dates</h2>
          <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
            A prompt&apos;s date is when its body was last written, and it is printed beside the run log. If a prompt body changes, its runs
            describe an older prompt — which is why the date is on the page next to the scores rather than buried in a footer.
          </p>
          <ul className="mt-3 space-y-1.5 text-[11px] text-ink-dim">
            {prompts.slice(0, 5).map((p) => (
              <li key={p.slug} className="flex items-center justify-between gap-3">
                <Link href={`/prompts/${p.slug}`} className="truncate font-semibold hover:underline">
                  {p.title}
                </Link>
                <span className="font-mono text-[10px] text-ink-faint">{p.published}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[10px] text-ink-faint">
            {prompts.length} prompts total; the five oldest are listed here, the rest are on the hub.
          </p>
        </div>

        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <h2 className="text-sm font-extrabold tracking-tight">Essays — updated stamps</h2>
          <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
            Learn articles carry a real <span className="font-mono">updated</span> field, shown in the article header and declared as{" "}
            <span className="font-mono">dateModified</span> in the structured data. {staleEssays === 0
              ? "None has gone 90 days without a touch."
              : `${staleEssays} of ${essays.length} have gone 90 days without a touch, which this page says out loud rather than resetting the date.`}
          </p>
          <ul className="mt-3 space-y-1.5 text-[11px] text-ink-dim">
            {essays.slice(0, 5).map((a) => (
              <li key={a.slug} className="flex items-center justify-between gap-3">
                <Link href={`/learn/${a.slug}`} className="truncate font-semibold hover:underline">
                  {a.title}
                </Link>
                <span className="font-mono text-[10px] text-ink-faint">{a.updated}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">Why not just stamp everything &ldquo;updated today&rdquo;</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          Because a freshness signal you can fake is worth nothing to a reader and very little to a crawler. This page makes the distinction
          checkable: the added dates come from the catalog records, the review dates are arithmetic on those, and the essay dates are the ones
          the articles print. If this site ever does record real reviews, this page is where the new column goes.
        </p>
      </section>
    </div>
  );
}
