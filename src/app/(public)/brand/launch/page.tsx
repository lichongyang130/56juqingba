import type { Metadata } from "next";
import Link from "next/link";
import { LAUNCH_ITEMS } from "@/lib/brand";

export const metadata: Metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/brand/launch" },
  title: "Launch checklist — what shipped, what we left out",
  description:
    "The real pre-launch list behind Motif: twelve items, three of them deliberate omissions, two still open, each pointing at the surface that proves it.",
};

const STATE_STYLE = {
  shipped: { chip: "border-emerald-300/25 bg-emerald-400/10 text-emerald-200", label: "Shipped" },
  deliberate: { chip: "border-amber-300/25 bg-amber-400/10 text-amber-200", label: "Left out on purpose" },
  open: { chip: "border-rose-300/25 bg-rose-400/10 text-rose-200", label: "Still open" },
} as const;

export default function LaunchChecklistPage() {
  const counts = {
    shipped: LAUNCH_ITEMS.filter((i) => i.state === "shipped").length,
    deliberate: LAUNCH_ITEMS.filter((i) => i.state === "deliberate").length,
    open: LAUNCH_ITEMS.filter((i) => i.state === "open").length,
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Brand</span>
        <span>/</span>
        <span className="text-ink-dim">Launch</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Brand · launch</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">The list we actually ran</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          Launch checklists are usually advice. This one is a record: {LAUNCH_ITEMS.length} items, each honestly labelled —{" "}
          {counts.shipped} shipped, {counts.deliberate} left out on purpose, {counts.open} still open. Every shipped item links to the page that
          proves it, so nothing here has to be taken on faith.
        </p>
      </div>

      <section className="mt-10 grid gap-3 sm:grid-cols-3">
        {(
          [
            ["Shipped", counts.shipped, "text-emerald-200"],
            ["Deliberately out", counts.deliberate, "text-amber-200"],
            ["Still open", counts.open, "text-rose-200"],
          ] as const
        ).map(([label, n, tone]) => (
          <div key={label} className="rounded-2xl border border-white/8 bg-panel p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">{label}</p>
            <p className={`mt-1 font-mono text-3xl tabular-nums ${tone}`}>{n}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 space-y-3">
        {LAUNCH_ITEMS.map((item, i) => {
          const s = STATE_STYLE[item.state];
          return (
            <article key={item.item} className="rounded-3xl border border-white/8 bg-panel p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                    {String(i + 1).padStart(2, "0")} · {item.area}
                  </p>
                  <h2 className="mt-1 text-[15px] font-extrabold tracking-tight">{item.item}</h2>
                </div>
                <span className={`chip shrink-0 ${s.chip}`}>{s.label}</span>
              </div>
              <p className="mt-2 max-w-3xl text-[11.5px] leading-relaxed text-ink-dim">{item.detail}</p>
              {item.evidence && (
                <Link href={item.evidence.href} className="mt-2 inline-block text-[11px] font-semibold text-violet-300 hover:text-violet-200">
                  {item.evidence.label} →
                </Link>
              )}
            </article>
          );
        })}
      </section>

      <section className="mt-8 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">Why the &ldquo;left out&rdquo; column is the useful one</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          A checklist that only lists what shipped is a marketing page. The three deliberate omissions are decisions a reader can disagree with:
          no accounts (so no real favourites), no analytics (so no public page-view number), no paid tier (so no revenue). Each of those would have
          been easy to fake with a mock, and each would have made every other number on the site cheaper.
        </p>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-faint">
          The two open items are the honest remainder: a Lighthouse run needs a browser this build never had, and a trend needs a second
          measurement. They stay on the list until they are done, not quietly dropped.
        </p>
      </section>
    </div>
  );
}
