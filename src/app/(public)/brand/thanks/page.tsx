import type { Metadata } from "next";
import Link from "next/link";
import { Mascot } from "@/components/mascot";

export const metadata: Metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/brand/thanks" },
  title: "Thank-you page — what happens after a demo signup",
  description:
    "The design for the page after a mock signup: no confetti, no upsell — three concrete first steps through the library, in order, with reasons.",
};

export default function ThanksPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Brand</span>
        <span>/</span>
        <span className="text-ink-dim">Thank you</span>
      </nav>

      <div className="mt-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Brand · the page after signup</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Thank-you pages are onboarding</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          This is the design that ships the day a real signup exists. It is on the site now, deliberately without a form in front of it, because a
          page that promises nothing is still a page worth designing — and this one has to survive the day it becomes real.
        </p>
      </div>

      <section className="mt-10 rounded-3xl border border-emerald-300/25 bg-emerald-400/[.05] p-6">
        <div className="flex items-start gap-4">
          <Mascot pose="found" size={64} className="shrink-0" id="mascot-thanks" />
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">You&apos;re on the list — here is what to do with the next ten minutes</h2>
            <p className="mt-2 text-[12px] leading-relaxed text-ink-dim">
              No confetti, no upsell, no &ldquo;check your inbox for the link&rdquo;. Three steps, in order, each with the reason it comes first.
            </p>
          </div>
        </div>

        <ol className="mt-6 space-y-4">
          {[
            {
              n: 1,
              title: "Copy one component you already need",
              why: "Start from a real problem, not from the library tour. The hover state you have been meaning to fix is a better first build than any demo.",
              href: "/components",
              cta: "Browse the catalog",
            },
            {
              n: 2,
              title: "Run the keyboard walk on your own page",
              why: "It takes two minutes, needs no tooling, and finds something. If it finds nothing, you now have a real baseline to protect.",
              href: "/quality/craft",
              cta: "Read the method",
            },
            {
              n: 3,
              title: "Pick a prompt with its failures attached",
              why: "Prompts fail in specific ways. Choosing from the ones with measured runs beats choosing from a list sorted by vibes.",
              href: "/prompts",
              cta: "See the scoreboard",
            },
          ].map((s) => (
            <li key={s.n} className="rounded-2xl border border-white/8 bg-panel p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Step {s.n}</p>
              <h3 className="mt-1 text-sm font-extrabold tracking-tight">{s.title}</h3>
              <p className="mt-1 text-[11.5px] leading-relaxed text-ink-dim">{s.why}</p>
              <Link href={s.href} className="mt-2 inline-block text-[11px] font-semibold text-emerald-300 hover:text-emerald-200">
                {s.cta} →
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-6 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">What the page must not do</h2>
        <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-ink-dim">
          <li>· Ask for a second thing. The signup already happened; a survey, a newsletter cross-sell or a discount code here taxes the one moment attention is highest.</li>
          <li>· Promise a follow-up it cannot keep. If there is no digest, the page must not say one is coming.</li>
          <li>· Use a countdown. Urgency on a page with no deadline is the cheapest lie in marketing.</li>
          <li>· Show the mascot celebrating forever — &ldquo;found&rdquo; renders once, still, and stays still.</li>
        </ul>
        <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
          When the backend exists, the only change to this page is that a real address arrives above the fold; the three steps stay as they are.
        </p>
      </section>
    </div>
  );
}
