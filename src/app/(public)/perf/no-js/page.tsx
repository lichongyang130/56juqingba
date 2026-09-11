import Link from "next/link";
import { NoJsPanel, MeasuredNote, PerfNav } from "@/components/perf-ui";
import { zeroJsAssets } from "@/lib/perf";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/perf/no-js" },
  title: "Zero-JS showcase",
  description: "Which assets need no JavaScript, and what the catalog actually looks like to a client with scripts switched off.",
};

export default function PerfNoJsPage() {
  const z = zeroJsAssets();
  const sample = z.cssOnly.slice(0, 6);
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">Zero-JS showcase</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          {z.share}% of the catalog <span className="text-gradient">needs no JavaScript</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          {z.depFree.length} of {z.total} assets declare no dependencies — pure CSS, or markup plus a stylesheet.
          The demos on their pages are React components like everything else, so this page answers the harder question: what
          does the site look like to a client that never runs a script?
        </p>
      </div>

      <div className="mt-8">
        <PerfNav current="/perf/no-js" />
      </div>

      <div className="mt-4">
        <MeasuredNote />
      </div>

      <div className="mt-10">
        <NoJsPanel />
      </div>

      <div className="mt-10 rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Four dependency-free examples from the catalog</p>
        <ul className="mt-3 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {sample.map((a) => (
            <li key={a.slug}>
              <Link href={`/components/${a.slug}`} className="block rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-3 transition-colors hover:border-white/18">
                <span className="text-[12px] font-bold">{a.title}</span>
                <span className="mt-0.5 block font-mono text-[10px] text-ink-faint">
                  {a.stack.join(" / ")} · {a.bundleKb} KB
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-dim">
          Each one is rendered on its own page by the same demo registry, which is a client component. That is the honest limit of
          this claim: the <em>asset</em> needs no JavaScript — the site that previews it currently does, because the preview is a
          React island. Making the previews themselves server-rendered is a real piece of work, and it is not claimed here.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link href="/perf/fonts" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          ← Font loading
        </Link>
        <Link href="/perf/mounting" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          Lazy mounting →
        </Link>
      </div>
    </div>
  );
}
