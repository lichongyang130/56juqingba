import Link from "next/link";
import { printCss, tokenSet } from "@/lib/exports";
import { LEARN_ARTICLES } from "@/lib/learn";

export const metadata = {
  title: "Print stylesheet — Motif UI",
  description: "The @media print rules this site compiles, printed as text, with what they change and what they cannot fix.",
};

export default function IntegrationsPrintPage() {
  const css = printCss();
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Stylesheet · #423</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          Guides that survive <span className="text-gradient">a printer</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          The {LEARN_ARTICLES.length} guides are the part of this site people actually print, and the dark theme prints as a page of
          black rectangles. The block below is read out of the stylesheet this site compiles — not a copy of it, the same bytes —
          and it applies to every route, so the copy on this page and the CSS in the build cannot disagree.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <a href="/api/exports/learn-print.css" className="btn btn-primary !px-4 !py-2 text-xs">
          Download learn-print.css
        </a>
        <Link href="/learn" className="btn btn-ghost !px-4 !py-2 text-xs">
          The guides →
        </Link>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">
            The @media print block ({(Buffer.byteLength(css) / 1024).toFixed(1)} KB, complete)
          </p>
          <pre className="mt-3 max-h-[34rem] overflow-auto rounded-2xl border border-white/8 bg-[#07090f] p-4 font-mono text-[10px] leading-relaxed text-ink-dim">
            {css}
          </pre>
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/8 bg-panel p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">What each rule is for</p>
            <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-ink-dim">
              <li className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5">
                Navigation and the footer disappear: on paper they are furniture, and printed links to routes the reader cannot
                click are worse than nothing.
              </li>
              <li className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5">
                Panels and cards become rules on white instead of filled boxes, because a dark UI prints as toner.
              </li>
              <li className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5">
                Animations, transitions and backdrop blurs are switched off — they cost ink and change nothing on a page that is
                not going to move.
              </li>
              <li className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5">
                External links print their URL after the text, which is the one place a print stylesheet can add information
                rather than remove it.
              </li>
              <li className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5">
                Code blocks avoid page breaks, and headings refuse to be the last line on a page.
              </li>
            </ul>
          </div>
          <div className="rounded-3xl border border-dashed border-amber-300/25 bg-amber-300/[.04] p-6">
            <p className="text-sm font-extrabold text-amber-200">What a stylesheet cannot fix</p>
            <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-amber-100/80">
              <li>
                Interactive demos. A printed page shows the placeholder or the first frame — the animation is gone, and no rule
                brings it back.
              </li>
              <li>
                Page numbering and running headers. Those need a PDF pipeline, and this is a browser stylesheet.
              </li>
              <li>
                The palette. Text prints black on white by rule, so the{" "}
                {Object.keys(tokenSet().colors).length} colour tokens in the design system are simply not part of a printed page.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
