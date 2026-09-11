import Link from "next/link";
import { COMPONENTS, accentCss } from "@/lib/data";
import { SAMPLE_BUILDS } from "@/lib/samples";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/samples" }, title: "Made with Motif — case studies",
  description:
    "Three sample builds told the way a case study should be: the challenge, the assets used and the measured result, with the gaps named where a number does not exist.",
};

export default function SamplesIndexPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">Made with Motif · case studies</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          Real pages, <span className="text-gradient">problem → build → result</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          Three sample builds, each told the way a case study should be told: the challenge first, the assets used second,
          the measured result last. Numbers where numbers exist, honesty where they do not.
        </p>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {SAMPLE_BUILDS.map((b, i) => (
          <Link key={b.slug} href={`/samples/${b.slug}`} className="card-hover group flex flex-col rounded-3xl border border-white/8 bg-panel p-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-faint">{b.by} · sample #{i + 1}</span>
            <h2 className="mt-3 text-xl font-extrabold tracking-tight group-hover:text-white">{b.title}</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-dim">{b.note}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {b.used.slice(0, 3).map((slug) => {
                const a = COMPONENTS.find((c) => c.slug === slug);
                return a ? (
                  <span key={slug} className="chip !text-[10px]">
                    <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full" style={{ background: accentCss(slug, 90, 65) }} />
                    {a.title}
                  </span>
                ) : null;
              })}
              <span className="chip !text-[10px]">+{Math.max(0, b.used.length - 3)} more</span>
            </div>
            <div className="mt-auto flex items-center justify-between pt-5 text-xs">
              <span className="text-ink-faint">~{b.kb} KB · read the case</span>
              <span className="font-semibold text-ink-dim transition-transform group-hover:translate-x-1">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
