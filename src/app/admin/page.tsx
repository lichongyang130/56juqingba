import Link from "next/link";
import { BACKGROUNDS, COMPONENTS, PROMPTS } from "@/lib/data";
import { LEARN_ARTICLES } from "@/lib/learn";
import { newestCatalogDate, pipelineStages } from "@/lib/admin";
import { KIND_BUDGETS } from "@/lib/kinds";
import { MODERATION_SEED } from "@/lib/community";

/** ISO date shifted by whole days — so "the last 30 days" is measured against
 *  the catalog's newest record rather than the machine clock. */
function shifted(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function AdminDashboard() {
  const catalog = COMPONENTS.length;
  const verifiedPrompts = PROMPTS.filter((p) => p.status === "verified" || p.status === "featured").length;
  const copiesTotal = COMPONENTS.reduce((s, c) => s + c.copies, 0);
  const avgFidelity = Math.round(PROMPTS.reduce((s, p) => s + p.avgFidelity, 0) / Math.max(1, PROMPTS.length));
  const newest = newestCatalogDate();
  const last30 = COMPONENTS.filter((c) => c.published >= shifted(newest, -30)).length;
  const flagged = MODERATION_SEED.filter((x) => x.lint !== "pass" || x.safety !== "pass").length;

  const KPI = [
    { label: "Assets in catalog", value: String(catalog), note: `${last30} published in the last 30 days`, tone: "text-ink" },
    { label: "Prompts live", value: String(PROMPTS.length), note: `${verifiedPrompts} verified or featured`, tone: "text-ink" },
    { label: "Copies recorded", value: `${(copiesTotal / 1000).toFixed(1)}k`, note: "catalog figure, not live analytics", tone: "text-ink" },
    { label: "Avg prompt fidelity", value: `${avgFidelity}/100`, note: `mean of ${PROMPTS.length} published averages`, tone: "text-cyan-200" },
    { label: "Sample queue", value: String(MODERATION_SEED.length), note: `${flagged} carry a gate warning`, tone: "text-amber-300" },
    { label: "Also in the library", value: String(LEARN_ARTICLES.length + BACKGROUNDS.length), note: `${LEARN_ARTICLES.length} guides · ${BACKGROUNDS.length} backgrounds`, tone: "text-ink" },
  ];

  const kindShare = KIND_BUDGETS.map((k, i) => {
    const n = COMPONENTS.filter((c) => c.kind === k.kind).length;
    return {
      label: k.label,
      n,
      value: Math.round((n / Math.max(1, COMPONENTS.length)) * 100),
      budget: k.budgetKb,
      color: ["bg-violet-400", "bg-cyan-300", "bg-pink-400", "bg-amber-300"][i % 4],
    };
  });

  // The strip below is the same funnel the pipeline page renders, minus the
  // local-decision stage (this dashboard is a server component and cannot read
  // the browser store), and it says so.
  const strip = pipelineStages([], 0).filter((x) => x.stage !== "Awaiting your review");

  const recentAssets = [...COMPONENTS].sort((a, b) => (a.published < b.published ? 1 : -1)).slice(0, 5);
  const recentPrompts = [...PROMPTS].sort((a, b) => (a.published < b.published ? 1 : -1)).slice(0, 4);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Dashboard</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-dim">
          Studio overview. Catalog figures are computed from the data files at build time — newest record {newest}. Queue rows are
          the {MODERATION_SEED.length} sample submissions that ship with this build.
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {KPI.map((k) => (
          <div key={k.label} className="rounded-2xl border border-white/8 bg-panel p-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">{k.label}</div>
            <div className={`mt-2 text-2xl font-extrabold tracking-tight ${k.tone}`}>{k.value}</div>
            <div className="mt-1 text-[11px] leading-relaxed text-ink-faint">{k.note}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        {/* copies by category */}
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold tracking-tight">Catalog share by kind</h2>
            <span className="chip !text-[10px] uppercase">{COMPONENTS.length} assets</span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-ink-faint">
            Share of the catalog by kind, against each kind&apos;s published bundle budget. Copy counts are not broken out
            per kind: the per-asset figures are on the asset list, where you can sort them.
          </p>
          <div className="mt-5 space-y-4">
            {kindShare.map((c) => (
              <div key={c.label}>
                <div className="flex justify-between gap-3 text-xs">
                  <span className="font-semibold text-ink-dim">{c.label}</span>
                  <span className="font-mono text-ink-faint">
                    {c.n} · {c.value}% · {c.budget} KB budget
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/5">
                  <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.value}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-9 flex items-center justify-between">
            <h2 className="font-extrabold tracking-tight">Contribution pipeline</h2>
            <Link href="/admin/pipeline" className="text-xs font-semibold text-ink-dim hover:text-ink">Full view →</Link>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {strip.map((p) => (
              <div key={p.stage} className="rounded-2xl border border-white/7 bg-black/20 px-2 py-4">
                <div className="text-xl font-extrabold">{p.n}</div>
                <div className="mt-1 text-[10px] leading-tight text-ink-dim">{p.stage}</div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">
            {strip.map((p) => `${p.stage}: ${p.source}`).join(" · ")}. The review stage lives on{" "}
            <Link href="/admin/pipeline" className="font-semibold text-violet-300 hover:text-violet-200">the pipeline page</Link>,
            which can read your local decisions.
          </p>
        </div>

        {/* recent activity lists */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/8 bg-panel p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold tracking-tight">Recently published assets</h2>
              <Link href="/admin/assets" className="text-xs font-semibold text-ink-dim hover:text-ink">All →</Link>
            </div>
            <ul className="mt-4 divide-y divide-white/5">
              {recentAssets.map((a) => (
                <li key={a.slug} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{a.title}</div>
                    <div className="text-[11px] text-ink-faint capitalize">{a.kind} · {a.published}</div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="chip !text-[10px]">Q {a.qualityScore}</span>
                    <span className="chip !text-[10px]">{a.copies.toLocaleString()} cp</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-white/8 bg-panel p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold tracking-tight">Latest prompt runs</h2>
              <Link href="/admin/prompts" className="text-xs font-semibold text-ink-dim hover:text-ink">All →</Link>
            </div>
            <ul className="mt-4 space-y-2.5">
              {recentPrompts.map((p) => (
                <li key={p.slug} className="rounded-xl border border-white/6 bg-black/20 px-3.5 py-2.5">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="truncate font-semibold">{p.title}</span>
                    <span className="font-extrabold text-cyan-300">{p.avgFidelity}</span>
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] text-ink-faint">
                    <span>{p.runs.length} models · {p.bestModel}</span>
                    <span>{p.published}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
