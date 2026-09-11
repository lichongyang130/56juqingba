import type { Metadata } from "next";
import Link from "next/link";
import { Mascot } from "@/components/mascot";
import { WATERMARK_HTML, WATERMARK_SVG } from "@/lib/brand";

export const metadata: Metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/brand/watermark" },
  title: "\"Made with Motif\" badge — optional, honest, removable",
  description:
    "A 190×40 badge for sites built with the library. One rule attached: it may only be shown where it is true, and removing it is never punished.",
};

export default function WatermarkPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Brand</span>
        <span>/</span>
        <span className="text-ink-dim">Badge</span>
      </nav>

      <div className="mt-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Brand · badge</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">&ldquo;Made with Motif&rdquo;</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          One badge, one rule: it may only appear on something actually built with the library. It is never required, never enforced by a licence
          clause, and never made larger than the content it credits.
        </p>
      </div>

      <section className="mt-10 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">The badge, at its real size</h2>
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <div dangerouslySetInnerHTML={{ __html: WATERMARK_SVG }} />
          <div className="rounded-2xl border border-white/8 bg-white p-3" dangerouslySetInnerHTML={{ __html: WATERMARK_SVG }} />
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
          Left: on a dark ground. Right: on white, where the badge keeps its own dark plate rather than trying to invert — a badge that changes
          colour per site stops being a recognisable mark.
        </p>
      </section>

      <section className="mt-6 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">Copy-paste</h2>
        <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
          The image is served from this site, so the badge updates everywhere if the artwork changes. Swap in a local copy on your own host if you
          would rather not hot-link.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/8 bg-black/35 p-4 font-mono text-[10.5px] leading-relaxed text-emerald-200/90">
          {WATERMARK_HTML}
        </pre>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <a href="/api/brand/badge" download="motif-badge.svg" className="btn btn-primary px-5 py-2 text-xs">
            Download the SVG
          </a>
          <span className="font-mono text-[10px] text-ink-faint">190 × 40 · viewBox 0 0 190 40</span>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-white/8 bg-panel p-6">
        <div className="flex items-start gap-4">
          <Mascot pose="idle" size={56} className="shrink-0" id="mascot-badge" />
          <div>
            <h2 className="text-sm font-extrabold tracking-tight">The rules, including the awkward one</h2>
            <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-ink-dim">
              <li>· Show it only on a build that genuinely uses the library. A badge on something that does not is a lie with a logo on it.</li>
              <li>· Remove it any time, for any reason. There is no licence term requiring it, and no feature tier is unlocked by showing it.</li>
              <li>· Keep clear space around it equal to the dot in the mark — 6 units at badge scale is 5px, which is why the badge has a 12px inner margin.</li>
              <li>· Do not restyle it into a different badge. If the design does not fit, leaving it off is the intended option.</li>
              <li>· Never place it on a page suggesting an endorsement — a badge credits the components, not the product built on them.</li>
            </ul>
          </div>
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
          This is the opposite of a viral watermark: nothing here is earned, nothing is gated, and the interesting number is not how many appear in
          the wild but whether the ones that do are telling the truth.
        </p>
      </section>
    </div>
  );
}
