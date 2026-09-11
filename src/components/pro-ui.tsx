// Section 14 — Pro plans & monetization (server panels).
//
// These render statically from src/lib/pro.ts. The interactive demos (trial
// rail, token minting, cost meter, seats, referral) live in pro-ui-2.tsx,
// which is the client half. Nothing here charges anything: see MONEY_GAP.

import Link from "next/link";
import {
  API_SCOPES,
  DEMO_CHIP,
  FEATURE_STATES,
  MONEY_GAP,
  PLANS,
  PRICING_AUDIT,
  PRO_FEATURES,
  auditSummary,
  bundleMath,
  featureOf,
  featuresByState,
  licenceRows,
  planOf,
  unlimitedRows,
  yearlySaving,
  receiptTotals,
  TEAM_EXTRA_SEAT_PRICE,
  TEAM_SEATS_INCLUDED,
  CANCEL_AFTERMATH,
  CANCEL_REFUSES,
  ENTERPRISE_ASKS,
  GRANDFATHER,
  proChangelog,
  type FeatureState,
  type ProFeature,
} from "@/lib/pro";

/* -------------------------------------------------------------------
   The shared banner — every paid surface opens with this
   ------------------------------------------------------------------- */

export function ProDemoBanner({ scope }: { scope: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-amber-300/25 bg-amber-300/[.04] p-5">
      <div className="flex flex-wrap items-start gap-3">
        <span className="chip !text-[10px] !border-amber-300/40 !text-amber-300">{DEMO_CHIP}</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-amber-200">{scope}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-amber-100/80">{MONEY_GAP}</p>
        </div>
        <Link href="/pro/licence" className="btn btn-ghost !px-3 !py-1.5 text-xs">
          What is actually licensed →
        </Link>
      </div>
    </div>
  );
}

function StateChip({ state }: { state: FeatureState }) {
  const meta = FEATURE_STATES[state];
  return (
    <span className={`chip !text-[10px] ${meta.chip}`} title={meta.meaning}>
      {meta.label}
    </span>
  );
}

/* -------------------------------------------------------------------
   #385 — the feature ledger
   ------------------------------------------------------------------- */

export function FeatureLedger() {
  const order: FeatureState[] = ["works-now", "browser-demo", "needs-server"];
  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">The 11 Pro promises, sorted by what they are</p>
        <p className="mt-1.5 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          A pricing page usually groups features by how good they sound. This one groups them by whether the build can keep
          the promise: {featuresByState("works-now").length} already work with no server,{" "}
          {featuresByState("browser-demo").length} are interactive but live in your browser, and{" "}
          {featuresByState("needs-server").length} cannot be delivered without one. Every row names the free path beside the
          paid one — if the free path is identical, it says that too.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {order.map((s) => (
            <span key={s} className="text-[10px] text-ink-faint">
              <span className={`chip !text-[10px] ${FEATURE_STATES[s].chip}`}>{FEATURE_STATES[s].label}</span>{" "}
              {FEATURE_STATES[s].meaning}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {PRO_FEATURES.map((f) => (
          <div key={f.id} className="rounded-3xl border border-white/8 bg-panel p-5">
            <div className="flex flex-wrap items-center gap-3">
              {/* h2: feature panels sit directly under the page h1. */}
              <h2 className="text-sm font-extrabold">{f.name}</h2>
              <StateChip state={f.state} />
              {f.href && (
                <Link href={f.href} className="ml-auto text-[11px] font-semibold text-ink-faint hover:text-ink">
                  Open the free version →
                </Link>
              )}
            </div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-ink-dim">{f.promise}</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">What this build does about it</p>
                <p className="mt-1 text-[11px] leading-relaxed text-ink-dim">{f.evidence}</p>
              </div>
              <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/[.03] px-3.5 py-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300/80">The free path</p>
                <p className="mt-1 text-[11px] leading-relaxed text-ink-dim">{f.freeAlternative}</p>
                {f.needs && <p className="mt-1.5 text-[10px] leading-relaxed text-amber-200/70">Missing piece: {f.needs}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------
   #386 — licence clarity cards
   ------------------------------------------------------------------- */

export function LicenceCards() {
  const rows = licenceRows();
  return (
    <section className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-emerald-300/20 bg-emerald-400/[.04] p-6">
          <span className="chip !text-[10px] !border-emerald-300/40 !text-emerald-300">Free · stored in the catalog</span>
          <h2 className="mt-3 text-lg font-extrabold">The code is MIT, and the catalog says so</h2>
          <p className="mt-2 text-[12px] leading-relaxed text-ink-dim">
            Copy it, fork it, restyle it, sell the site you built with it. No attribution line is required, no watermark is
            added, and no account stands between you and the copy button. The MIT count below is computed from the{" "}
            <span className="font-mono">license</span> field on each component — not typed into this card.
          </p>
        </div>
        <div className="rounded-3xl border border-violet-300/25 bg-violet-500/[.06] p-6">
          <span className="chip !text-[10px] !border-violet-300/40 !text-violet-200">Pro · a service licence</span>
          <h2 className="mt-3 text-lg font-extrabold">Pro never gates the code</h2>
          <p className="mt-2 text-[12px] leading-relaxed text-ink-dim">
            What a Pro licence would cover is the part that needs a server: template installs, saved kits across devices, API
            keys, private collections, faster review. If the build stops being able to deliver one of those, the honest move
            is to strike it from the card — which is what the feature ledger does, in public, with a state chip per row.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/8 bg-panel">
        <table className="w-full min-w-[40rem] text-left text-[11px]">
          <thead className="border-b border-white/8 text-[10px] uppercase tracking-widest text-ink-faint">
            <tr>
              <th className="px-4 py-3 font-bold">Content</th>
              <th className="px-4 py-3 font-bold">Licence</th>
              <th className="px-4 py-3 font-bold">Where it comes from</th>
              <th className="px-4 py-3 font-bold">What it allows</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.subject} className="border-b border-white/5 last:border-0 align-top">
                <td className="px-4 py-3 font-bold">{r.subject}</td>
                <td className="px-4 py-3">
                  <span
                    className={`chip !text-[10px] ${r.stored ? "!border-emerald-300/40 !text-emerald-300" : "!border-amber-300/40 !text-amber-300"}`}
                  >
                    {r.licence}
                  </span>
                  {!r.stored && <p className="mt-1 text-[9px] text-amber-200/70">policy, not a stored field</p>}
                </td>
                <td className="px-4 py-3 text-ink-dim">{r.note}</td>
                <td className="px-4 py-3 text-ink-dim">{r.allows}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] leading-relaxed text-ink-faint">
        Two rows above are labelled <span className="text-amber-300">policy, not a stored field</span>: backgrounds and lab
        tools have no <span className="font-mono">license</span> property in the catalog, so calling them &ldquo;MIT
        licensed&rdquo; as a fact would be a claim the data does not carry. They are MIT by site policy, and the wording now
        says exactly that.
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------
   #387 — usage-based honesty
   ------------------------------------------------------------------- */

export function UnlimitedPanel() {
  const rows = unlimitedRows();
  return (
    <section className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-emerald-300/20 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">What unlimited means</p>
          <ul className="mt-4 space-y-3">
            {rows.means.map((m) => (
              <li key={m} className="flex gap-2.5 text-[12px] leading-relaxed text-ink-dim">
                <span className="text-emerald-300">✓</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-danger/25 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-danger">What it does not</p>
          <ul className="mt-4 space-y-3">
            {rows.doesNotMean.map((m) => (
              <li key={m} className="flex gap-2.5 text-[12px] leading-relaxed text-ink-dim">
                <span className="text-danger">×</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">About the copy counter</p>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">{rows.copiesNote}</p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------
   The pricing audit — the plan copy checked against the build
   ------------------------------------------------------------------- */

export function PricingAudit() {
  const s = auditSummary();
  const tone: Record<string, string> = {
    "already free here": "!border-emerald-300/40 !text-emerald-300",
    "works in this build": "!border-emerald-300/40 !text-emerald-300",
    "browser demo": "!border-cyan-300/40 !text-cyan-200",
    "needs a server": "!border-amber-300/40 !text-amber-300",
  };
  return (
    <section className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Every claim on this page, checked</p>
          <h2 className="mt-1 text-xl font-extrabold tracking-tight">Which of these promises the build can keep today</h2>
        </div>
        <span className="chip !text-[10px]">
          {s.counts["already free here"] ?? 0} already free · {s.counts["works in this build"] ?? 0} working ·{" "}
          {s.counts["browser demo"] ?? 0} demo · {s.counts["needs a server"] ?? 0} server-bound
        </span>
      </div>
      <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
        Two of the Pro bullets describe things this build already publishes for free, and the card above still lists them —
        that is the honest tension, so it is printed instead of hidden. The free-forever promise comes first: when the plan
        copy and the open library disagree, the library wins and the copy gets flagged.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[44rem] text-left text-[11px]">
          <thead className="border-b border-white/8 text-[10px] uppercase tracking-widest text-ink-faint">
            <tr>
              <th className="px-3 py-2.5 font-bold">Plan bullet</th>
              <th className="px-3 py-2.5 font-bold">In this build</th>
              <th className="px-3 py-2.5 font-bold">Evidence</th>
              <th className="px-3 py-2.5 font-bold">See</th>
            </tr>
          </thead>
          <tbody>
            {PRICING_AUDIT.map((c) => (
              <tr key={c.claim} className="border-b border-white/5 align-top last:border-0">
                <td className="px-3 py-2.5 font-semibold">{c.claim}</td>
                <td className="px-3 py-2.5">
                  <span className={`chip !text-[10px] ${tone[c.verdict]}`}>{c.verdict}</span>
                </td>
                <td className="px-3 py-2.5 text-ink-dim">{c.evidence}</td>
                <td className="px-3 py-2.5">
                  <Link href={c.href} className="font-mono text-[10px] text-ink-faint hover:text-ink">
                    {c.href}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------
   #394 — the grandfather promise
   ------------------------------------------------------------------- */

export function GrandfatherPanel() {
  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-violet-300/25 bg-violet-500/[.06] p-7">
        <p className="text-xs font-bold uppercase tracking-widest text-violet-200">The promise</p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight">{GRANDFATHER.headline}</h2>
        <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-ink-dim">{GRANDFATHER.promise}</p>
        <p className="mt-4 font-mono text-[11px] text-violet-200/80">{GRANDFATHER.dated}</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">What it covers</p>
          <ul className="mt-4 space-y-3">
            {GRANDFATHER.covers.map((c) => (
              <li key={c} className="flex gap-2.5 text-[11px] leading-relaxed text-ink-dim">
                <span className="text-emerald-300">✓</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-danger">What it does not cover</p>
          <ul className="mt-4 space-y-3">
            {GRANDFATHER.doesNotCover.map((c) => (
              <li key={c} className="flex gap-2.5 text-[11px] leading-relaxed text-ink-dim">
                <span className="text-danger">×</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-2xl border border-amber-300/25 bg-amber-300/[.04] px-3.5 py-3 text-[10px] leading-relaxed text-amber-100/80">
            {GRANDFATHER.gap}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">The same text, copyable</p>
        <pre className="mt-3 overflow-x-auto rounded-2xl border border-white/8 bg-[#07090f] p-4 font-mono text-[11px] leading-relaxed text-ink-dim">{`Grandfather promise
${GRANDFATHER.promise}

Covers: ${GRANDFATHER.covers.length} cases (renewals, downgrades, announced rises).
Does not cover: ${GRANDFATHER.doesNotCover.length} (re-subscribing later, monthly→yearly, feature-list changes, taxes/fees).`}</pre>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-dim">
          A promise is worth more when it can be quoted without a screenshot, so the plain-text version sits above the styled
          one. If the wording ever changes, the change belongs in the changelog with a date — quietly editing a promise is the
          failure mode this page exists to avoid.
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------
   #395 — what happens after cancelling
   ------------------------------------------------------------------- */

export function CancelAftermath() {
  return (
    <section className="space-y-5">
      <div className="overflow-hidden rounded-3xl border border-white/8 bg-panel">
        <table className="w-full min-w-[36rem] text-left text-[11px]">
          <thead className="border-b border-white/8 text-[10px] uppercase tracking-widest text-ink-faint">
            <tr>
              <th className="px-4 py-3 font-bold">After the cancel click</th>
              <th className="px-4 py-3 font-bold">What actually happens</th>
            </tr>
          </thead>
          <tbody>
            {CANCEL_AFTERMATH.map((r) => (
              <tr key={r.what} className="border-b border-white/5 align-top last:border-0">
                <td className="px-4 py-3 font-bold">{r.what}</td>
                <td className="px-4 py-3 text-ink-dim">{r.happens}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-3xl border border-danger/25 bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-danger">Dark patterns this flow refuses</p>
        <ul className="mt-4 grid gap-2 md:grid-cols-2">
          {CANCEL_REFUSES.map((c) => (
            <li key={c} className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5 text-[11px] text-ink-dim">
              <span className="mr-2 text-danger">×</span>
              {c}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
          Checklists like this are usually marketing. This one is a build constraint: the flow demo above cannot contain any
          of these steps, because there are none of them in the code.
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------
   #397 — enterprise asks
   ------------------------------------------------------------------- */

export function EnterpriseAsks() {
  const tone: Record<string, string> = {
    "not available": "!border-danger/40 !text-danger",
    partial: "!border-amber-300/40 !text-amber-300",
    available: "!border-emerald-300/40 !text-emerald-300",
  };
  const counts = ENTERPRISE_ASKS.reduce<Record<string, number>>((a, x) => {
    a[x.verdict] = (a[x.verdict] ?? 0) + 1;
    return a;
  }, {});
  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">What teams ask for, and what is true today</p>
        <p className="mt-1.5 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          Seven asks, sorted by how a procurement conversation actually goes. {counts.available ?? 0} is available now,{" "}
          {counts.partial ?? 0} are partly answerable, and {counts["not available"] ?? 0} cannot be answered truthfully at all
          — each with the work it would take. Most enterprise pages list features; the useful ones list the gaps first.
        </p>
        <div className="mt-4 space-y-2">
          {ENTERPRISE_ASKS.map((a) => (
            <div key={a.ask} className="rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[12px] font-bold">{a.ask}</span>
                <span className={`chip !text-[10px] ${tone[a.verdict]}`}>{a.verdict}</span>
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-ink-dim">{a.today}</p>
              <p className="mt-1 text-[10px] leading-relaxed text-ink-faint">To answer it properly: {a.needed}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------
   #399 — the Pro changelog
   ------------------------------------------------------------------- */

export function ProChangelog() {
  const rows = proChangelog();
  const freeCount = rows.filter((r) => r.alreadyFree).length;
  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Every Pro claim, with its free alternative</p>
        <p className="mt-1.5 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          {rows.length} rows, one per promise, generated from the feature ledger rather than typed again — so this list cannot
          say something the ledger does not. {freeCount} of the {rows.length} are already free in this build; the rest carry
          the free path that exists today and the gap that keeps the paid version honest.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/8 bg-panel">
        <table className="w-full min-w-[46rem] text-left text-[11px]">
          <thead className="border-b border-white/8 text-[10px] uppercase tracking-widest text-ink-faint">
            <tr>
              <th className="px-4 py-3 font-bold">Shipped in</th>
              <th className="px-4 py-3 font-bold">Addition</th>
              <th className="px-4 py-3 font-bold">Claimed as</th>
              <th className="px-4 py-3 font-bold">Free alternative</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.addition} className="border-b border-white/5 align-top last:border-0">
                <td className="px-4 py-3">
                  <span className="font-mono text-[10px] text-ink-faint">#{r.item}</span>
                  {r.alreadyFree && (
                    <span className="ml-2 chip !text-[9px] !border-emerald-300/40 !text-emerald-300">already free</span>
                  )}
                </td>
                <td className="px-4 py-3 font-bold">{r.addition}</td>
                <td className="px-4 py-3 text-ink-dim">{r.claimed}</td>
                <td className="px-4 py-3 text-ink-dim">{r.freeAlternative}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------
   #398 — receipts & plan state (admin demo surface)
   ------------------------------------------------------------------- */

export function ReceiptsPanel() {
  const t = receiptTotals();
  return (
    <section className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Paid (demo)</p>
          <p className="mt-1 font-mono text-xl font-black">
            ${t.paidTotal}
            <span className="ml-2 text-[10px] font-normal text-ink-faint">{t.paidCount} invoices</span>
          </p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Open (demo)</p>
          <p className="mt-1 font-mono text-xl font-black">${t.openTotal}</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Plan on file</p>
          <p className="mt-1 font-mono text-xl font-black">
            Team<span className="ml-2 text-[10px] font-normal text-ink-faint">5 of {TEAM_SEATS_INCLUDED} included + 2 × ${TEAM_EXTRA_SEAT_PRICE}</span>
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/8 bg-panel">
        <table className="w-full min-w-[44rem] text-left text-[11px]">
          <thead className="border-b border-white/8 text-[10px] uppercase tracking-widest text-ink-faint">
            <tr>
              <th className="px-4 py-3 font-bold">Invoice</th>
              <th className="px-4 py-3 font-bold">Date</th>
              <th className="px-4 py-3 font-bold">Plan</th>
              <th className="px-4 py-3 font-bold">Seats</th>
              <th className="px-4 py-3 font-bold">Method</th>
              <th className="px-4 py-3 font-bold">Amount</th>
              <th className="px-4 py-3 font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {t.lines.map((l) => (
              <tr key={l.invoice} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-3 font-mono text-[10px]">{l.invoice}</td>
                <td className="px-4 py-3 font-mono text-[10px] text-ink-dim">{l.date}</td>
                <td className="px-4 py-3 font-bold">{l.plan}</td>
                <td className="px-4 py-3 font-mono text-ink-dim">{l.seats}</td>
                <td className="px-4 py-3 text-ink-dim">{l.method}</td>
                <td className="px-4 py-3 font-mono">${l.amount}</td>
                <td className="px-4 py-3">
                  <span className={`chip !text-[9px] ${l.status.startsWith("paid") ? "!border-emerald-300/40 !text-emerald-300" : "!border-amber-300/40 !text-amber-300"}`}>
                    {l.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-3xl border border-dashed border-amber-300/25 bg-amber-300/[.04] p-5">
        <p className="text-sm font-extrabold text-amber-200">Six invoices that do not exist</p>
        <p className="mt-1.5 max-w-3xl text-[11px] leading-relaxed text-amber-100/80">
          The rows are derived arithmetically from the plan table — the two Pro months at ${planOf("pro").monthly}, then four
          Team months at the base plus two extra seats — so a price edit moves them. But no invoice was issued, no card was
          charged, and no receipt can be downloaded: there is no billing entity behind this build. The admin surfaces that
          report on the catalog (health, stats, exports) never read this table, and this table never reads them — a demo
          billing mock is not allowed to become site data.
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------
   Shared small pieces
   ------------------------------------------------------------------- */

export function ProPriceLine({ planId }: { planId: string }) {
  const p = planOf(planId);
  const save = yearlySaving(p);
  return (
    <p className="font-mono text-[11px] text-ink-faint">
      ${p.monthly}/mo{p.yearly ? ` · $${p.yearly}/yr${save ? ` (${save}% off)` : ""}` : " · free forever"}
    </p>
  );
}

export function PlanSummaryRow() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {PLANS.map((p) => (
        <div key={p.id} className={`rounded-2xl border p-4 ${p.featured ? "border-violet-300/30 bg-violet-500/[.06]" : "border-white/8 bg-white/[.02]"}`}>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-sm font-extrabold">{p.name}</span>
            <span className="font-mono text-sm font-black">${p.monthly}<span className="text-[10px] font-normal text-ink-faint">/mo</span></span>
          </div>
          <ProPriceLine planId={p.id} />
        </div>
      ))}
    </div>
  );
}

/** The subsection map for the section's pages, so the hub and every leaf page
    can render the same index without a second list to maintain. */
export const PRO_ROUTES: { href: string; label: string; item: string; blurb: string }[] = [
  { href: "/pro", label: "Feature ledger", item: "#385", blurb: "All 11 Pro promises with a state chip and the free path beside each." },
  { href: "/pro/licence", label: "Licence clarity", item: "#386", blurb: "MIT vs Pro in cards and a table, including the rows that are policy rather than stored data." },
  { href: "/pro/unlimited", label: "What unlimited means", item: "#387", blurb: "The word 'unlimited' on trial: what it covers and the four things it does not." },
  { href: "/pro/trial", label: "7-day trial playbook", item: "#388", blurb: "Day-by-day unlocks, ending where a server would have to start." },
  { href: "/pro/api", label: "API token demo", item: "#389", blurb: "Mint a prefixed demo key, pick scopes, see the request it would make." },
  { href: "/pro/bundles", label: "Bundle vs ala-carte", item: "#391", blurb: "A cost meter that will tell you the bundle is the wrong buy." },
  { href: "/lab", label: "Pro lab gate", item: "#390", blurb: "Three free minutes in Theme Studio, then the upgrade card — dismissible." },
  { href: "/pro/teams", label: "Team seats", item: "#392", blurb: "Invite names, pick roles, watch the seat arithmetic — and read what the plan card never said." },
  { href: "/pro/discounts", label: "Discount lanes", item: "#393", blurb: "Four lanes including one with no proof required, priced live against the plan table." },
  { href: "/pro/promise", label: "Grandfather promise", item: "#394", blurb: "The promise in full, with the four cases it does not cover." },
  { href: "/pro/cancel", label: "Cancel path", item: "#395", blurb: "Click through the whole cancellation and read the dark patterns it refuses." },
  { href: "/pro/referral", label: "Referral credit", item: "#396", blurb: "One month each, capped at six a year, with the impossible states clamped." },
  { href: "/pro/enterprise", label: "Enterprise asks", item: "#397", blurb: "SSO, SLA, DPA, purchase orders — what is answerable today and what is not." },
  { href: "/pro/changelog", label: "Pro changelog", item: "#399", blurb: "Every Pro claim with its free alternative, generated from the ledger." },
];

/** The routes that exist in this batch. Section 14's remaining pages (teams,
    referral, enterprise, the admin billing mock) are added to this list in the
    batch that ships them, so the nav never links ahead of a real file. */

export function ProSectionNav({ current }: { current: string }) {
  return (
    <nav aria-label="Pro plan sections" className="flex flex-wrap gap-2">
      {PRO_ROUTES.map((r) => (
        <Link
          key={r.href}
          href={r.href}
          aria-current={r.href === current ? "page" : undefined}
          className={`chip !text-[10px] ${r.href === current ? "!border-violet-300/40 !text-violet-200" : ""}`}
        >
          {r.label}
        </Link>
      ))}
    </nav>
  );
}

/* -------------------------------------------------------------------
   #391 — the honest cost meter, static half (the meter itself is client)
   ------------------------------------------------------------------- */

export function BundleFloor() {
  const math = bundleMath(["templates", "kits", "api", "priority"]);
  return (
    <div className="rounded-3xl border border-white/8 bg-panel p-6">
      <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">The packs this meter can offer, and the one it refuses to</p>
      <ul className="mt-3 grid gap-2 md:grid-cols-2">
        {math.lines.map(({ pack, total }) => (
          <li key={pack.id} className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5 text-[11px]">
            <span className="font-bold">{pack.name}</span>{" "}
            <span className="font-mono text-ink-faint">
              ${pack.unitPrice} {pack.unit} × {pack.quantity} = ${total}
            </span>
            <p className="mt-1 text-[10px] leading-relaxed text-ink-faint">{pack.note}</p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] leading-relaxed text-amber-200/80">{math.unsold}</p>
    </div>
  );
}

export function FeatureStateChip({ id }: { id: string }) {
  const f: ProFeature = featureOf(id);
  return <StateChip state={f.state} />;
}

export const API_SCOPE_LIST = API_SCOPES;
