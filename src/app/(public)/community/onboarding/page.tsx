import type { Metadata } from "next";
import Link from "next/link";
import { COMPONENTS } from "@/lib/data";
import { MODERATION_SEED, queueReport } from "@/lib/community";

export const metadata: Metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/community/onboarding" },
  title: "How to submit — Motif UI",
  description: "The contributor onboarding guide: the audit criteria each submission is measured against, the gates, the thresholds, the reasons entries get sent back, and a checklist you can run before you submit.",
};

export default function OnboardingPage() {
  const r = queueReport();
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/community" className="hover:text-ink">Community</Link>
        <span>/</span>
        <span className="text-ink-dim">How to submit</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-mint">Contributor onboarding</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">What we check, before you submit</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          Most rejected submissions are not bad work — they are work that never found out what the standard was. Here is
          the whole bar, in the order the gates apply it, with the same numbers the{" "}
          <Link href="/community/outcomes" className="font-semibold text-violet-300 hover:text-violet-200">outcomes page</Link>{" "}
          reports.
        </p>
      </div>

      <section className="mt-9 space-y-4">
        {[
          {
            n: "Gate 1",
            t: "Automated audit — runs before a human sees anything",
            rows: [
              ["Accessibility", "Components are audited on semantics, focus order, contrast and keyboard reachability. The catalog's own standard is an audit score of 98+ for anything we would call accessible-ready; " + COMPONENTS.filter((c) => c.a11yScore >= 98).length + ` of ${COMPONENTS.length} published assets hold that band.`],
              ["Bundle budget", "Under 5 KB for an element, under 12 KB for a section, dependencies excluded but declared. Over budget is not an automatic rejection — an unexplained over-budget is."],
              ["Style lint", "Naming, token use, no hard-coded palette values, no commented-out experiments. Warnings are fixable; failures mean the fix is not obvious from the submission."],
              ["Sandbox safety", "Components run in isolation with network and storage access observed. A flagged write to storage or an outbound request blocks the entry by default."],
              ["Fidelity", "Prompts are run and scored. You must submit the model list and the raw scores, including the runs that failed."],
            ],
          },
          {
            n: "Gate 2",
            t: "Human review — the part a gate cannot do",
            rows: [
              ["Is it original?", "Written by you, or a documented remix. Copied third-party code without a licence is an instant rejection, however good it looks."],
              ["Does the change note match?", "We open the diff. “Smaller bundle” has to be smaller than the thing it forked."],
              ["Would a reader learn something?", "A submission that only re-orders existing code needs a reason to exist. A rename is not a remix."],
              ["Is the credit right?", "Original author, your handle, and the licence of what you forked — see the attribution policy."],
            ],
          },
        ].map((g) => (
          <div key={g.n} className="rounded-3xl border border-white/8 bg-panel p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">{g.n}</p>
            <h2 className="mt-1 text-lg font-extrabold tracking-tight">{g.t}</h2>
            <div className="mt-4 space-y-3">
              {g.rows.map(([k, v]) => (
                <div key={k} className="rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3">
                  <p className="text-[12px] font-bold text-ink">{k}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-ink-dim">{v}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold">Why entries come back</h2>
        <p className="mt-2 text-xs leading-relaxed text-ink-dim">
          The sample queue that ships with this build holds {MODERATION_SEED.length} entries: {r.clean} with every gate
          clean, {r.total - r.clean - r.blocked} carrying a warning, and {r.blocked} blocked by a safety failure. Reading
          the warn column is the fastest way to learn the bar — those are the submissions that were nearly right.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {[
            { t: "The five commonest fixes", b: "Add the missing focus style. Replace hard-coded hex with a token. Declare the dependency you used. Write the change note as a sentence, not a title. Keep the original's credit line." },
            { t: "What never gets through", b: "Failing sandbox checks, unattributed copied code, and submissions that disable reduced-motion handling to look better in a demo." },
            { t: "What gets fast-tracked", b: "Sibling variants of popular patterns, a11y-strict versions, and fixes to a documented bug with the reproduction attached." },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl border border-white/8 bg-white/[.02] px-4 py-4">
              <p className="text-[12px] font-bold text-ink">{c.t}</p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-ink-dim">{c.b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-mint/25 bg-mint/[.04] p-6">
        <h2 className="text-sm font-extrabold text-mint">Pre-flight checklist</h2>
        <ul className="prose-list mt-3">
          <li>Run an accessibility pass yourself and write the score and the tool into the submission note.</li>
          <li>State the shipped size and the dependency list, or state that there are none.</li>
          <li>Test the reduced-motion path and say what changes when it is on.</li>
          <li>Say which published asset you started from, with its slug.</li>
          <li>Write one paragraph explaining the change — what you tried first, and why this version won.</li>
          <li>Name the original author in the credit line, even when you rewrote every line.</li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/community/submit" className="btn btn-primary !py-2 text-xs">Submit a remix →</Link>
          <Link href="/community/submit?basedOn=combo-box" className="btn btn-ghost !py-2 text-xs">Try the form prefilled</Link>
          <Link href="/community/attribution" className="btn btn-ghost !py-2 text-xs">Attribution policy</Link>
        </div>
      </section>
    </div>
  );
}
