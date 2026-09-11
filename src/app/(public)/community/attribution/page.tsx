import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/community/attribution" },
  title: "Attribution policy — Motif UI",
  description: "How remixes credit the original author: what the MIT and CC BY 4.0 licences require, what we ask for on top, and what happens when a credit goes missing.",
};

export default function AttributionPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/community" className="hover:text-ink">Community</Link>
        <span>/</span>
        <span className="text-ink-dim">Attribution</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Attribution policy</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Credit is not a favour. It is the licence.</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          Two licences run through this catalog, and they ask for different things. This page is the one place that spells
          out both, what we ask for on top of the legal minimum, and exactly what we do when a credit goes missing.
        </p>
        <p className="mt-2 text-[11px] text-ink-faint">
          Plain-language summary written by the people who ship the catalog. It is not legal advice — for a commercial
          decision, read the licences themselves and talk to your own lawyer.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-sm font-extrabold">Assets — MIT</p>
          <ul className="prose-list mt-3">
            <li>You may use, modify, ship and sell work built from an asset, including in closed-source products.</li>
            <li>The licence text must travel with the code — keep the copyright notice in the file you receive.</li>
            <li>You are not required to display a credit in your interface. We would like one, but it is not a condition.</li>
            <li>You may not re-licence the catalog itself or publish it as your own library.</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-sm font-extrabold">Guides — CC BY 4.0</p>
          <ul className="prose-list mt-3">
            <li>You may quote, translate, remix and republish guides, including commercially.</li>
            <li>Attribution is required: name Motif UI, link to the original guide, and note if you changed it.</li>
            <li>Translations are a remix — credit the original and say that it is a translation.</li>
            <li>You may not add a licence restriction of your own to a republished guide.</li>
          </ul>
        </div>
      </div>

      <section className="mt-8 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold">How we credit a remix</h2>
        <ol className="prose-list mt-3">
          <li>
            <b>The original keeps its name and its page.</b> A remix links back to the asset or prompt it came from, and
            that link is not removable by us or by the remixer.
          </li>
          <li>
            <b>The remixer is named for what they changed.</b> Credits read “original by Motif Studio, remix by @handle” —
            one line, both names, no ranking of who did more.
          </li>
          <li>
            <b>The change log is public.</b> A published remix lists what changed in plain language, which is the part a
            reader actually needs to decide whether to use it.
          </li>
          <li>
            <b>No credit on a submission that has not passed the gates.</b> An entry that failed lint or safety is not
            published under anyone&apos;s name, because a public credit is also a public endorsement.
          </li>
        </ol>
      </section>

      <section className="mt-8 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold">When a credit is missing</h2>
        <div className="mt-3 space-y-3">
          {[
            { t: "1. Tell us", b: "The fastest route is a review note on the asset with the specific claim, or a request on the board. A link and a sentence is enough — no form, no account." },
            { t: "2. We check the record", b: "Every catalog item stores its author, version and first publication date, so “who wrote this” is a lookup, not an argument." },
            { t: "3. We fix it in public", b: "Corrections appear in the changelog with the entry that was wrong. Quiet edits to attribution are worse than the error, because they hide that an error happened." },
            { t: "4. If it is our mistake, we say so by name", b: "“We credited the wrong author on this component and have corrected it” — not “attribution was updated”." },
          ].map((s) => (
            <div key={s.t} className="rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3">
              <p className="text-[12px] font-bold text-ink">{s.t}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-ink-dim">{s.b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-amber-300/25 bg-amber-300/[.04] p-6">
        <h2 className="text-sm font-extrabold text-amber-300">What we ask for beyond the licence</h2>
        <p className="mt-2 text-xs leading-relaxed text-ink-dim">
          MIT does not require a visible credit, and we still ask for one where it is cheap: a line in a README, a mention
          in a launch post, a link from the footer of the thing you built. Attribution is not just compliance — it is how a
          reader finds the original and sees the audit scores before they copy it. Asking is not demanding, and nothing in
          this catalog is gated on it.
        </p>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
          Conversely, we will not strip a remixer&apos;s name to simplify a page, and we will not aggregate contributions
          into an anonymous “community” credit. If a person did the work, their handle is on it.
        </p>
      </section>
    </div>
  );
}
