import Link from "next/link";

const PLANS = [
  {
    name: "Free",
    monthly: 0,
    blurb: "Everything you need to ship a great personal site.",
    features: [
      "Full library browsing & copying",
      "All element / animated assets",
      "Verified AI prompts (non-Pro packs)",
      "Lab tools: Easing, Spring, Gradient",
      "Public collections",
      "Community submission & badges",
    ],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Pro",
    monthly: 19,
    yearly: 129,
    blurb: "For people who build sites for a living.",
    features: [
      "Everything in Free",
      "Prompt test reports & Pro prompt packs",
      "Whole template one-click installs",
      "Theme Studio + saved brand kits",
      "Private collections & API access",
      "Priority review (48h → 6h)",
      "No ads, early features",
    ],
    cta: "Go Pro",
    featured: true,
  },
  {
    name: "Team",
    monthly: 49,
    yearly: 399,
    blurb: "Shared brand kits and usage for small teams.",
    features: [
      "Everything in Pro, per member",
      "Shared theme tokens & component audits",
      "Admin console for content policy",
      "Usage analytics dashboard",
      "Dedicated support",
    ],
    cta: "Contact us",
    featured: false,
  },
];

const FAQ = [
  ["Is the library really free?", "Yes — the core library (elements, animated assets, backgrounds, sections) is MIT-licensed and free forever, no watermark."],
  ["What does Pro actually add?", "Pro sells productivity: multi-model test reports, template packs, theme persistence and API access. Not the basic code."],
  ["Do contributors get paid?", "Featured community submissions earn a 30% net share when their asset is part of paid packs, or redeemable credits."],
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

      <div className="mx-auto mt-12 grid max-w-5xl gap-5 lg:grid-cols-3">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={`relative rounded-3xl border p-7 ${
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
                or ${p.yearly}/year — save ~{Math.round((1 - p.yearly / (p.monthly * 12)) * 100)}%
              </div>
            )}
            <p className="mt-3 text-xs leading-relaxed text-ink-dim">{p.blurb}</p>
            {p.monthly === 0 ? (
              <Link href="/components" className="btn btn-ghost mt-6 w-full">{p.cta}</Link>
            ) : (
              <button
                type="button"
                className={`btn mt-6 w-full ${p.featured ? "btn-primary" : "btn-ghost"}`}
                title="Checkout is wired up in the production build — this MVP demo shows the plans."
              >
                {p.cta} <span className="opacity-70">(launch)</span>
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
