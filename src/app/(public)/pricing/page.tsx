import Link from "next/link";
import { DemoView } from "@/components/demos/Demo";
import { Stage } from "@/components/cards";
import { PricingAudit, ProSectionNav } from "@/components/pro-ui";
import { MONEY_GAP, PLANS, yearlySaving } from "@/lib/pro";

const FAQ = [
  ["Is the library really free?", "Yes — the core library (elements, animated assets, backgrounds, sections) is MIT-licensed and free forever, no watermark."],
  ["What does Pro actually add?", "Pro sells productivity: multi-model test reports, template packs, theme persistence and API access. Not the basic code."],
  ["Do contributors get paid?", "That is the intent, and it is not implemented: there is no paid-pack revenue, no payouts and no credit ledger in this build. The plan is a 30% net share on paid packs once packs exist."],
  ["Can I cancel anytime?", "Yes. Billing is monthly or yearly, cancel in one click, access lasts to the end of the period."],
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">Pricing</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          The library is free.<br /> <span className="text-gradient">The leverage is Pro.</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          No paywalled copy-paste. We charge for verified test reports, template packs and tools
          that save you hours — never for the code itself.
        </p>
      </div>

      {/* what stays free forever */}
      <div id="free-forever" className="mx-auto mt-12 max-w-5xl rounded-3xl border border-emerald-300/20 bg-emerald-400/[.04] p-6 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">The free-forever promise</p>
            <h2 className="mt-2 text-xl font-extrabold tracking-tight">What stays free, in writing</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-dim">
              Every component in the catalog carries <span className="font-mono">license: &ldquo;MIT&rdquo;</span> and is
              copyable without an account, free forever. Backgrounds and lab tools follow the same MIT policy, though the
              catalog stores no licence field for them — the licence page labels those rows as policy rather than pretending
              they are recorded facts. No watermark, no code paywall, no &ldquo;free for 14 days&rdquo;. Pro sells leverage,
              never the code itself.
            </p>
          </div>
          <Link href="#free" className="btn btn-ghost !px-3.5 !py-2 text-xs">Jump to the Free plan ↓</Link>
        </div>
        <ul className="prose-list mt-5 grid list-none gap-x-8 gap-y-2 text-[13px] sm:grid-cols-2">
          <li className="!text-[13px]">✓ All 100+ component cards, MIT license, forever</li>
          <li className="!text-[13px]">✓ No account needed to copy code</li>
          <li className="!text-[13px]">✓ No watermark on any asset, free or paid</li>
          <li className="!text-[13px]">✓ Dependency-free CSS stays in every free card</li>
          <li className="!text-[13px]">✓ Public collections and community badges</li>
          <li className="!text-[13px]">✓ If the core ever changes, we&apos;ll say so loudly, first</li>
        </ul>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-5 lg:grid-cols-3">
        {PLANS.map((p) => (
          <div
            key={p.name}
            id={p.name.toLowerCase()}
            className={`relative scroll-mt-28 rounded-3xl border p-7 ${
              p.featured
                ? "border-violet-300/40 bg-gradient-to-b from-violet-500/10 to-panel shadow-[0_0_70px_-18px_rgba(139,92,246,0.5)]"
                : "border-white/8 bg-panel"
            }`}
          >
            {p.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-400 px-4 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-lg">
                Most popular
              </span>
            )}
            <h2 className="text-lg font-extrabold">{p.name}</h2>
            <div className="mt-4 flex items-end gap-1.5">
              <span className="text-4xl font-black tracking-tight">${p.monthly}</span>
              <span className="pb-1 text-xs text-ink-dim">/ month</span>
            </div>
            {p.monthly > 0 && p.yearly && (
              <div className="mt-1 text-[11px] text-ink-faint">
                or ${p.yearly}/year — save {yearlySaving(p)}%
              </div>
            )}
            <p className="mt-3 text-xs leading-relaxed text-ink-dim">{p.blurb}</p>
            {p.monthly === 0 ? (
              <Link href="/components" className="btn btn-ghost mt-6 w-full">{p.cta}</Link>
            ) : (
              <button
                type="button"
                className={`btn mt-6 w-full ${p.featured ? "btn-primary" : "btn-ghost"}`}
                title={MONEY_GAP}
                disabled
              >
                {p.cta} <span className="opacity-70">· no processor</span>
              </button>
            )}
            <ul className="prose-list mt-6 list-none space-y-2">
              {p.features.map((f) => (
                <li key={f} className="!text-[13px] !text-ink-dim">{f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* side-by-side: Free vs Pro, live in the browser */}
      <section id="side-by-side" className="mx-auto mt-16 max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">Not just a table</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight">Free vs Pro, rendered side by side</h2>
          </div>
          <Link href="#pro" className="text-xs font-semibold text-ink-faint hover:text-ink">Compare the full lists ↓</Link>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-emerald-300/20 bg-panel">
            <div className="flex items-center justify-between border-b border-white/6 px-5 py-3">
              <span className="text-sm font-extrabold text-emerald-300">Free — the core, live</span>
              <span className="chip !text-[10px]">MIT · no account</span>
            </div>
            <Stage className="rounded-none border-0">
              <DemoView demo="tab-morph" props={{}} />
            </Stage>
            <p className="px-5 py-4 text-xs leading-relaxed text-ink-dim">
              Every element and animated asset you see in the cards is yours: unlimited copy, zero packages for
              the CSS-first cards, restyle it all from your own tokens.
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl border border-violet-300/25 bg-gradient-to-b from-violet-500/[.08] to-panel">
            <div className="flex items-center justify-between border-b border-white/6 px-5 py-3">
              <span className="text-sm font-extrabold text-violet-200">Pro — the leverage, live</span>
              <span className="chip !text-[10px]">$19/mo</span>
            </div>
            <Stage className="rounded-none border-0">
              <DemoView demo="command-palette" props={{}} />
            </Stage>
            <p className="px-5 py-4 text-xs leading-relaxed text-ink-dim">
              Multi-model test reports, whole-template installs and Theme Studio kits — the tools that save
              hours. The demo below is real too; Pro just ships you more of the workflow.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-14 max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Itemised, not summarised</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight">The Pro section, promise by promise</h2>
            <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-ink-dim">
              Each Pro bullet has a page that says what it is in this build, what it would need, and which free path already
              covers it. {MONEY_GAP}
            </p>
          </div>
          <Link href="/pro" className="btn btn-ghost !px-3.5 !py-2 text-xs">Open the ledger →</Link>
        </div>
        <div className="mt-5">
          <ProSectionNav current="/pricing" />
        </div>
        <div className="mt-6">
          <PricingAudit />
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-3xl">
        <h2 className="text-center text-2xl font-extrabold tracking-tight">Questions, answered</h2>
        <div className="mt-6 space-y-3">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group rounded-2xl border border-white/8 bg-panel px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold [&::-webkit-details-marker]:hidden">
                {q}
                <span className="text-violet-300 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-dim">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
