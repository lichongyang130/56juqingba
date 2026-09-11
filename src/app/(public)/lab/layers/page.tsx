import Link from "next/link";
import { LayerInspector } from "@/components/layer-inspector";
import { MeasuredNote, PerfNav, Stat } from "@/components/perf-ui";
import { COMPONENTS } from "@/lib/data";
import { motionAudit } from "@/lib/perf";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/lab/layers" },
  title: "Animation layer inspector",
  description: "Mount a catalog demo, read every property it animates, and see which of them the compositor can take over.",
};

export default function LabLayersPage() {
  const audit = motionAudit();
  // A crude but honest ranking of the heaviest scenes: line count of each demo
  // block is not available per component, so this ranks by the asset's own
  // bundle figure, which is stored data.
  const heaviest = [...COMPONENTS]
    .sort((a, b) => b.bundleKb - a.bundleKb)
    .slice(0, 6)
    .map((c) => ({ slug: c.slug, title: c.title, lines: c.bundleKb }));

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">The Lab · instrumentation</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          Which properties <span className="text-gradient">leave the main thread</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          A scene that animates <span className="font-mono text-xs">transform</span> is handled by the compositor; one that
          animates width or box-shadow makes the browser paint the frame. Pick any demo from the catalog, mount it here, and the
          inspector reads every node it creates and says which side of that line it falls on.
        </p>
      </div>

      <div className="mt-8">
        <PerfNav current="/lab/layers" />
      </div>

      <div className="mt-4">
        <MeasuredNote />
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="@keyframes in the project" value={audit.keyframes} sub={`across ${audit.keyframeFiles} files`} />
        <Stat label="Animation declarations" value={audit.animationHits} sub={`${audit.infiniteHits} of them run forever`} />
        <Stat
          label="Transitions classified"
          value={audit.transitions.total}
          sub={`${audit.transitions.compositor} compositor · ${audit.transitions.paint} paint · ${audit.transitions.layout} layout`}
        />
        <Stat
          label="will-change hints"
          value={audit.willChangeHits}
          sub="explicit requests for a layer"
        />
      </div>

      <div className="mt-8">
        <LayerInspector heaviest={heaviest} />
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">How the source scan reads</p>
          <pre className="mt-3 overflow-x-auto rounded-2xl border border-white/8 bg-[#07090f] p-4 font-mono text-[10px] leading-relaxed text-ink-dim">{`transition: transform .3s   → compositor
transition: box-shadow .3s → paint
transition: width .3s      → layout
animation: spin 4s infinite → name recorded, properties unknown`}</pre>
          <p className="mt-3 text-[11px] leading-relaxed text-ink-dim">
            The {audit.transitions.total} transition declarations above are classified by the property they name, which is the
            only part a stylesheet states. A transition on <span className="font-mono">all</span> is counted as compositor-safe
            because that is what the shorthand usually targets — and that is a judgement, so it is written here rather than
            buried in the number.
          </p>
        </div>
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Why this matters for this library</p>
          <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
            The demo scenes are {audit.demoLines.toLocaleString("en-US")} lines across {audit.demoModules} modules — they were one file until
            batch 85 split them so a page loads only the set it renders — and {audit.infiniteHits} of the
            project&apos;s animations run forever by design — ambient loops, drifting gradients, marquees. Ambient motion that
            stays on the compositor costs almost nothing; ambient motion that repaints does it every frame, on every page it
            appears on, for as long as the tab is open. That is the entire reason the audit exists, and it is measurable in the
            panel above rather than argued about.
          </p>
          <Link href="/perf/blur" className="btn btn-ghost mt-3 !px-3.5 !py-2 text-xs">
            The blur budget →
          </Link>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link href="/perf/prefetch" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          ← Prefetch strategy
        </Link>
        <Link href="/lab" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          Back to the Lab →
        </Link>
      </div>

      <div className="mt-6">
        <p className="text-[10px] leading-relaxed text-ink-faint">
          The inspector component is <span className="font-mono">src/components/layer-inspector.tsx</span> and the source scan is{" "}
          <span className="font-mono">motionAudit()</span> in <span className="font-mono">src/lib/perf.ts</span>. Because the
          inspector mounts a real demo, this page is the route in the section that pulls a scene set rather than rendering none — and since
          batch 85 that means the set it mounts, not all ten of them. The budget page reports that cost rather than hiding it.
        </p>
      </div>
    </div>
  );
}
