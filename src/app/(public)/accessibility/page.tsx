import type { Metadata } from "next";
import Link from "next/link";
import { MANUAL_CHECKS } from "@/lib/a11y-audit";

export const metadata: Metadata = {
  title: "Accessibility — what is verified and what is not",
  description:
    "The statement behind the audit: what the build checks on every page, what it structurally cannot check, and how to report a problem. Distinct from the engineering record at /quality/aria.",
  alternates: { canonical: "/accessibility" },
};

/**
 * #17 — an accessibility statement, which this site did not have.
 *
 * /quality/aria is the engineer's record: rule names, finding counts, what the
 * pass changed. That is the right page for someone auditing the audit and the
 * wrong page for someone who wants to know whether the site works for them. A
 * statement answers four questions in plain order — what is checked, what is
 * not, what to do about it, and who to tell — and it has to be honest about the
 * second one, which is why the list of unverified things is longer here than
 * the list of verified ones.
 */

const VERIFIED = [
  "Every one of the site's pages is scanned at build time for images without alt text, controls with no accessible name, duplicate ids, heading-order skips and a missing lang attribute.",
  "Every page carries one h1, its own canonical URL and its own share card — checked across the served sitemap, not sampled.",
  "Contrast is computed on the token pairs the site actually uses, and the results are published rather than summarised.",
  "Colour is never the only signal: the components that encode state in colour also state it in text or shape, and the catalog records that per asset.",
  "Keyboard operability is part of every demo's declared behaviour, and the declaration is compared with the scene's own code on every run.",
];
export default function AccessibilityPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Accessibility</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">Statement</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          Accessibility, <span className="text-gradient">stated honestly</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          This is the statement. The engineering record — every rule, every finding it ever caught, and the counts behind both — is on{" "}
          <Link href="/quality/aria" className="font-semibold text-emerald-300 hover:text-emerald-200">
            /quality/aria
          </Link>
          , and the manual checklist this site has not yet run in a browser is published there in full rather than summarised here.
        </p>
      </div>

      <section className="mt-10">
        <h2 className="border-b border-white/6 pb-3 text-xs font-bold uppercase tracking-[0.24em] text-emerald-200">What is verified on every build</h2>
        <ul className="mt-4 space-y-2">
          {VERIFIED.map((line) => (
            <li key={line} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[.02] p-4">
              <span className="mt-0.5 font-mono text-[11px] text-emerald-300">✓</span>
              <span className="text-[11.5px] leading-relaxed text-ink-dim">{line}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="border-b border-white/6 pb-3 text-xs font-bold uppercase tracking-[0.24em] text-amber-200">
          What is not verified, and cannot be by a build step
        </h2>
        <p className="mt-3 max-w-3xl text-[11.5px] leading-relaxed text-ink-dim">
          An automated pass can prove a name exists. It cannot tell you whether the name means anything, whether a focus ring is visible on the surface it
          actually sits on, or where focus goes when a sheet closes. {MANUAL_CHECKS.length} checks are written down for that reason and{" "}
          <strong className="text-amber-100">none of them has been run in a browser by this project</strong> — there is no browser in the build, and the
          site will not imply otherwise.
        </p>
        <ol className="mt-4 space-y-1.5">
          {MANUAL_CHECKS.map((check, i) => (
            <li key={check.title} className="flex items-baseline gap-3 text-[11.5px] leading-relaxed">
              <span className="font-mono text-[10px] text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-ink-dim">{check.title}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
          Each one, with how to run it and what counts as a failure, is on{" "}
          <Link href="/quality/aria" className="font-semibold text-cyan-300 hover:text-cyan-200">
            /quality/aria
          </Link>
          .
        </p>
      </section>

      <section className="mt-12 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">Reporting a problem</h2>
        <p className="mt-2 max-w-2xl text-[11.5px] leading-relaxed text-ink-dim">
          This site has no backend and no issue tracker of its own, so there is no form to submit that would quietly go nowhere. What it has is a public
          repository: an issue there is read by a person, and a fix ships with the measurement that justifies it. If you have hit a barrier — a control
          you cannot reach, a message you cannot hear, a target you cannot hit — that is a defect, not a preference.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="https://github.com/lichongyang130/56juqingba/issues"
            className="btn btn-ghost !px-3.5 !py-2 text-xs"
            rel="noopener noreferrer"
          >
            Open an issue →
          </a>
          <Link href="/quality/aria" className="btn btn-ghost !px-3.5 !py-2 text-xs">
            Read the audit
          </Link>
          <Link href="/gaps" className="btn btn-ghost !px-3.5 !py-2 text-xs">
            What else is missing
          </Link>
        </div>
      </section>
    </div>
  );
}
