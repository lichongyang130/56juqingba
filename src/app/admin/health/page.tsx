import Link from "next/link";
import { contentHealth, healthSummary, HEALTH_THRESHOLDS } from "@/lib/admin";

export default function AdminHealth() {
  const rows = contentHealth();
  const s = healthSummary(rows);

  const FACTOR_LABEL: Record<string, string> = {
    freshness: "freshness",
    "a11y band": "a11y",
    editorial: "editorial",
    budget: "budget",
    "zero-dep": "zero-dep",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Content health</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-dim">
            Every catalog item scored against five published factors — freshness, accessibility band, editorial score,
            bundle budget and dependency count. Nothing here is a judgement call: each cell quotes the number it compares
            and the line it compares against.
          </p>
        </div>
        <span className="chip !text-[10px]">{s.total} assets scored</span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { l: "average score", v: `${s.average}%`, tone: "text-ink" },
          { l: "all factors pass", v: String(s.perfect), tone: "text-mint" },
          { l: "below 90%", v: String(s.below90), tone: "text-amber-300" },
          { l: `stale > ${HEALTH_THRESHOLDS.freshnessDays}d`, v: String(s.stale), tone: "text-amber-300" },
          { l: `a11y < ${HEALTH_THRESHOLDS.a11y}`, v: String(s.a11y), tone: "text-ink" },
          { l: "over budget", v: String(s.budget), tone: "text-ink" },
        ].map((c) => (
          <div key={c.l} className="rounded-2xl border border-white/8 bg-panel px-4 py-3">
            <p className={`font-mono text-xl font-extrabold ${c.tone}`}>{c.v}</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-widest text-ink-faint">{c.l}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Weakest first</p>
          <span className="chip !text-[10px]">
            {s.stale} freshness · {s.editorial} editorial · {s.dep} with dependencies
          </span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[11px]">
            <thead className="text-[10px] uppercase tracking-widest text-ink-faint">
              <tr className="border-b border-white/8">
                <th className="py-2 pr-3 font-semibold">Asset</th>
                <th className="py-2 pr-3 font-semibold">Kind</th>
                <th className="py-2 pr-3 font-semibold">Score</th>
                {Object.values(FACTOR_LABEL).map((f) => (
                  <th key={f} className="py-2 pr-3 font-semibold">
                    {f}
                  </th>
                ))}
                <th className="py-2 font-semibold">Open</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.slug} className="border-b border-white/5">
                  <td className="py-2.5 pr-3">
                    <Link href={`/components/${r.slug}`} className="font-semibold text-ink hover:text-violet-200">
                      {r.title}
                    </Link>
                    <span className="ml-2 font-mono text-[9px] text-ink-faint">{r.slug}</span>
                  </td>
                  <td className="py-2.5 pr-3 text-ink-dim">{r.kind}</td>
                  <td className="py-2.5 pr-3">
                    <span
                      className={`font-mono font-extrabold ${r.score === 100 ? "text-mint" : r.score >= 90 ? "text-ink" : "text-amber-300"}`}
                    >
                      {r.score}%
                    </span>
                  </td>
                  {r.factors.map((f) => (
                    <td key={f.label} className="py-2.5 pr-3">
                      <span className={f.ok ? "text-mint" : "text-amber-300"} title={f.detail}>
                        {f.ok ? "✓" : "!"}
                      </span>
                      <span className="ml-1.5 font-mono text-[9px] text-ink-faint">{f.detail}</span>
                    </td>
                  ))}
                  <td className="py-2.5">
                    <Link href={`/components/${r.slug}`} className="text-[10px] font-semibold text-violet-300 hover:text-violet-200">
                      page ↗
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
          Hover a factor to read the exact comparison. Freshness is measured against {HEALTH_THRESHOLDS.freshnessDays}{" "}
          days from each item&apos;s recorded publish date, relative to the newest date in the catalog rather than the
          machine clock, so this table never drifts from the data it describes.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-sm font-extrabold">Where these thresholds come from</p>
          <ul className="prose-list mt-2">
            <li>
              <b>Freshness 30 days</b> — the same 30-day interval the public freshness job uses, but on a different basis:
              that job measures prompt last-run dates against a fixed review date, while this table measures component
              publish dates against the newest date in the catalog. Same window, two different questions.
            </li>
            <li>
              <b>A11y 95</b> — the public bar prints audit scores in bands and its top band starts at 98 (the{" "}
              <span className="font-mono">A11Y_BANDS</span> table on <span className="font-mono">/quality</span>). This
              line sits lower on purpose: a row here exists to start a look, not to declare an item finished.
            </li>
            <li>
              <b>Editorial 90</b> — the editorial review score already printed on every card.
            </li>
            <li>
              <b>Budget</b> — the per-kind limits from <span className="font-mono">src/lib/kinds.ts</span>, the same table
              the CMS validates against.
            </li>
          </ul>
        </div>
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-sm font-extrabold">What this score is not</p>
          <ul className="prose-list mt-2">
            <li>Not a quality verdict on the design — an asset can be excellent and score 87 here because it is 40 days old.</li>
            <li>Not a ranking of importance: a template with a big budget is judged against its own kind&apos;s budget, not against an element.</li>
            <li>Not live: it recomputes at build time from the data files, so editing the CMS draft does not move it until the patch lands.</li>
          </ul>
          <Link href="/quality" className="btn btn-ghost mt-3 !px-3 !py-1.5 text-xs">
            Public quality bar →
          </Link>
        </div>
      </div>
    </div>
  );
}
