import Link from "next/link";
import { COMPONENTS, PROMPTS } from "@/lib/data";

const KPI = [
  { label: "Live assets", value: "612", delta: "+31 this week", up: true },
  { label: "Live prompts", value: "318", delta: "+12", up: true },
  { label: "Copies (30d)", value: "148.2k", delta: "+12.4%", up: true },
  { label: "Subscribers (MRR)", value: "$11,842", delta: "+$620", up: true },
  { label: "Pending moderation", value: "7", delta: "SLA 48h", up: false },
  { label: "Community contributors", value: "1,204", delta: "+84", up: true },
];

const CATEGORY_COPIES = [
  { label: "Elements", value: 41, color: "bg-violet-400" },
  { label: "Animated", value: 72, color: "bg-cyan-300" },
  { label: "Sections", value: 58, color: "bg-pink-400" },
  { label: "Templates", value: 26, color: "bg-amber-300" },
  { label: "Backgrounds", value: 64, color: "bg-mint" },
];

const PIPELINE = [
  { stage: "Submitted", n: 14 },
  { stage: "Auto-audit", n: 9 },
  { stage: "Human review", n: 7 },
  { stage: "Approved", n: 6 },
];

export default function AdminDashboard() {
  const recentAssets = [...COMPONENTS].sort((a, b) => (a.published < b.published ? 1 : -1)).slice(0, 5);
  const recentPrompts = [...PROMPTS].sort((a, b) => (a.published < b.published ? 1 : -1)).slice(0, 4);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-dim">Studio overview — Friday, September 4 (demo data).</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {KPI.map((k) => (
          <div key={k.label} className="rounded-2xl border border-white/8 bg-panel p-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">{k.label}</div>
            <div className="mt-2 text-2xl font-extrabold tracking-tight">{k.value}</div>
            <div className={`mt-1 text-[11px] font-semibold ${k.up ? "text-mint" : "text-danger"}`}>{k.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        {/* copies by category */}
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold tracking-tight">Copies by category (30d)</h2>
            <span className="chip !text-[10px] uppercase">share of 148.2k</span>
          </div>
          <div className="mt-6 space-y-4">
            {CATEGORY_COPIES.map((c) => (
              <div key={c.label}>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-ink-dim">{c.label}</span>
                  <span className="font-mono text-ink-faint">{c.value}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/5">
                  <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.value}%` }} />
                </div>
              </div>
            ))}
          </div>

          <h2 className="mt-9 font-extrabold tracking-tight">Contribution pipeline</h2>
          <div className="mt-4 grid grid-cols-4 gap-2 text-center">
            {PIPELINE.map((p, i) => (
              <div key={p.stage} className="relative rounded-2xl border border-white/7 bg-black/20 px-2 py-4">
                <div className="text-xl font-extrabold">{p.n}</div>
                <div className="mt-1 text-[10px] leading-tight text-ink-dim">{p.stage}</div>
                {i < PIPELINE.length - 1 && (
                  <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 text-ink-faint" aria-hidden>›</span>
                )}
              </div>
            ))}
          </div>
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
