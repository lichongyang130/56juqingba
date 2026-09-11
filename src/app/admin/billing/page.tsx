import { ReceiptsPanel } from "@/components/pro-ui";
import { PLANS, planOf, yearlySaving } from "@/lib/pro";

export const metadata = { title: "Billing — admin" };

export default function AdminBillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Billing & receipts</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-dim">
          The receipt table a real billing page would show, computed from the same price module the public plan cards read.
          Demo invoices over a fixed six-month anchor — nothing here is issued, charged or downloadable.
        </p>
      </div>

      <ReceiptsPanel />

      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">The plan table this page bills from</p>
        <ul className="mt-3 grid gap-2 md:grid-cols-3">
          {PLANS.map((p) => (
            <li key={p.id} className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-3 text-[11px]">
              <span className="flex items-baseline justify-between gap-2">
                <span className="font-bold">{p.name}</span>
                <span className="font-mono">${p.monthly}/mo</span>
              </span>
              <span className="mt-0.5 block text-[10px] text-ink-faint">
                {p.yearly ? `$${p.yearly}/yr · ${yearlySaving(p)}% off` : "no yearly tier"}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-dim">
          Prices come from <span className="font-mono">src/lib/pro.ts</span>, the same module behind /pricing and the eight
          pages under /pro. One table, so a price change here cannot disagree with the price a visitor is shown.
        </p>
      </div>

      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">What a real billing page would need</p>
        <ul className="mt-3 grid gap-2 md:grid-cols-2 text-[11px] text-ink-dim">
          <li className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5">
            A payment processor and webhooks — the source of truth for paid / failed / refunded.
          </li>
          <li className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5">
            A subscriber record so the grandfather price has somewhere to live.
          </li>
          <li className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5">
            Tax handling and a legal entity to invoice from ({planOf("team").name} plan is priced as if both exist).
          </li>
          <li className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5">
            An audit trail for plan changes — the admin console&apos;s own trail covers moderation, not money.
          </li>
        </ul>
      </div>
    </div>
  );
}
