import type { Metadata } from "next";
import Link from "next/link";
import { COMPONENTS, PROMPTS } from "@/lib/data";
import { LEARN_ARTICLES } from "@/lib/learn";

export const metadata: Metadata = {
  title: "Teams & licensing — Motif UI",
  description: "How teams use Motif together: a shared design baseline, what MIT and CC BY 4.0 let your organisation do, and the licensing questions teams actually ask before shipping.",
};

export default function TeamsPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/community" className="hover:text-ink">Community</Link>
        <span>/</span>
        <span className="text-ink-dim">Teams</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Teams · pair programming with a shared baseline</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Two developers, one audit score</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          The hard part of a team library is not the components, it is the argument about them. Motif gives that argument
          a scoreboard: {COMPONENTS.length} components and {PROMPTS.length} prompts each carry an audit number, a bundle
          size and a dependency list, so a review can be about the numbers instead of taste.
        </p>
      </div>

      <section className="mt-9 space-y-4">
        {[
          {
            n: "01",
            t: "Pick a baseline, not a favourite",
            b: "Start from the a11y 98+ band and the 5 KB budget. Two people who agree on the thresholds disagree less about the components.",
            link: { href: "/collections/a11y-98", label: "Open the a11y 98+ collection" },
          },
          {
            n: "02",
            t: "Review with the clipboard, not the eye",
            b: "Every detail page prints its shipped size, dependency list and audit scores above the code. A reviewer can check the claim in the PR against the page.",
            link: { href: "/components/combo-box", label: "See a detail page" },
          },
          {
            n: "03",
            t: "Fork inside the team the same way forks work here",
            b: "Keep the original slug and the person who changed it in the commit message. When the upstream component improves, the fork's provenance tells you what you owe.",
            link: { href: "/community/attribution", label: "Attribution policy" },
          },
          {
            n: "04",
            t: "Write down the trade, not the taste",
            b: "Each catalog item ships a design note saying why it works. Copying that habit into your own PR descriptions is the single cheapest quality upgrade for a small team.",
            link: { href: "/learn", label: "Guides on the craft" },
          },
        ].map((s) => (
          <div key={s.n} className="rounded-3xl border border-white/8 bg-panel p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="max-w-2xl">
                <span className="font-mono text-xs font-extrabold text-ink-faint">{s.n}</span>
                <h2 className="mt-1 text-lg font-extrabold tracking-tight">{s.t}</h2>
                <p className="mt-2 text-[12px] leading-relaxed text-ink-dim">{s.b}</p>
              </div>
              <Link href={s.link.href} className="btn btn-ghost !px-3 !py-1.5 text-xs">
                {s.link.label} →
              </Link>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-9 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold">Licensing questions teams actually ask</h2>
        <p className="mt-2 text-xs leading-relaxed text-ink-dim">
          Plain-language answers about the two licences on this site — MIT for every component and background, CC BY 4.0
          for the {LEARN_ARTICLES.length} guides. Not legal advice; for a commercial decision read the licences and talk
          to your own counsel.
        </p>
        <div className="mt-4 space-y-3">
          {[
            { q: "Can we use these components in a closed-source product?", a: "Yes. MIT permits commercial and closed-source use. Keep the copyright notice with the code you copied — that is the whole obligation." },
            { q: "Do we have to display a credit in our UI?", a: "No. MIT does not require visible attribution. We ask for a line in a README or a launch note, and nothing is gated on it." },
            { q: "Can we re-publish the components as our own internal library?", a: "For your organisation, yes — modify and redistribute as much as you like. What you cannot do is publish the catalog itself as a competing public library under your own name." },
            { q: "Can we put a guide inside a paid course?", a: "Yes, with attribution: name Motif UI, link the original, and note any changes. CC BY 4.0 allows commercial reuse; it does not allow you to add a restriction of your own." },
            { q: "Do the prompts carry a licence obligation?", a: "The prompt text is published under the same CC BY 4.0 terms as the guides, so attribute it if you republish; what you generate from a prompt is yours, with no claim from us." },
            { q: "One developer subscribes — can the whole team use it?", a: "There is nothing to subscribe to. No component, prompt, guide or lab tool on this site is behind a paywall, so there is no seat to share and no seat to police." },
            { q: "What about the audit scores — are they warranted?", a: "No. They are editorial measurements taken on a stated date, published so you can disagree with them. They are not a warranty that a component meets your compliance obligations." },
            { q: "Can we fork a component and drop its dependencies?", a: "Yes, and we would like to know how it went. That is exactly the remix note the submit flow is built around, and the dependency ledger on the quality page shows every asset that carries one." },
          ].map((f) => (
            <div key={f.q} className="rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3">
              <p className="text-[12px] font-bold text-ink">{f.q}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-ink-dim">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/8 bg-panel p-6">
        <p className="max-w-xl text-xs leading-relaxed text-ink-dim">
          The quality page is the long version of every number quoted here — audit bands, bundle budgets, dependency
          ledger and the licence table, all computed from the catalog.
        </p>
        <Link href="/quality" className="btn btn-primary !py-2 text-xs">Open the quality bar →</Link>
      </div>
    </div>
  );
}
