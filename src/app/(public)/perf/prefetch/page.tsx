import Link from "next/link";
import { MeasuredNote, PerfNav, Stat } from "@/components/perf-ui";
import { COMPONENTS, PROMPTS } from "@/lib/data";
import { prefetchAudit } from "@/lib/perf";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/perf/prefetch" },
  title: "Prefetch strategy — Motif UI",
  description: "Why catalog cards wait for intent before fetching, with the payload of one prefetch measured against this build.",
};

export default function PerfPrefetchPage() {
  const audit = prefetchAudit();
  const { probe } = audit;
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Prefetch strategy</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          Fetch on intent, <span className="text-gradient">not on scroll</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          Next prefetches a link when it enters the viewport. That default is right for a page with a handful of links and
          wrong for a grid of {audit.gridCards} cards, every one of them pointing at a route that is rendered on demand: the
          reader pays for cards they scrolled past. The catalog now opts those cards out and fetches when a pointer or the
          keyboard rests on one.
        </p>
      </div>

      <div className="mt-8">
        <PerfNav current="/perf/prefetch" />
      </div>

      <div className="mt-4">
        <MeasuredNote />
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Cards that opt out" value={audit.gridCards} sub={`${COMPONENTS.length} components + ${PROMPTS.length} prompts`} />
        <Stat label="One prefetch costs" value={`${probe.rscKb} KB`} sub={`RSC payload for ${probe.url}`} />
        <Stat label="A full page costs" value={`${probe.htmlKb} KB`} sub="same URL, rendered without JavaScript" />
        <Stat label="Grid scrolled end to end" value={`${audit.worstCaseKb} KB`} sub="if every card prefetched itself" />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">What changed</p>
          <ol className="mt-3 space-y-2.5 text-[11px] leading-relaxed text-ink-dim">
            <li className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-3">
              <span className="font-mono text-[10px] text-cyan-200">prefetch=&#123;false&#125;</span>
              <span className="mt-1 block">
                The card link no longer fetches when it scrolls into view. Nothing is requested until the reader shows
                interest, which is the whole point: a scroll is not a destination.
              </span>
            </li>
            <li className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-3">
              <span className="font-mono text-[10px] text-cyan-200">pointerenter · focus</span>
              <span className="mt-1 block">
                Either one arms a timer — a cursor sweeping across the grid never fires it, because the timer is cleared on
                pointer-leave and blur. Keyboard users get the same behaviour, which a hover-only version would not.
              </span>
            </li>
            <li className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-3">
              <span className="font-mono text-[10px] text-cyan-200">140 ms dwell → router.prefetch(href)</span>
              <span className="mt-1 block">
                Then the route is fetched exactly as the framework would have fetched it, so the click still lands on a warm
                payload.
              </span>
            </li>
          </ol>
          <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
            The state is written to the DOM as <span className="font-mono">data-intent-prefetch=&quot;idle|dwell|sent&quot;</span>, so
            the behaviour can be checked in a browser without reading the component.
          </p>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl border border-white/8 bg-panel p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">How the probe was taken</p>
            <pre className="mt-3 overflow-x-auto rounded-2xl border border-white/8 bg-[#07090f] p-4 font-mono text-[10px] leading-relaxed text-ink-dim">{`curl -s -H "RSC: 1" \\
  "${probe.url}?_rsc=x" | wc -c   # ${Math.round(probe.rscKb * 1024)} bytes
curl -s "${probe.url}" | wc -c    # ${Math.round(probe.htmlKb * 1024)} bytes`}</pre>
            <p className="mt-3 text-[11px] leading-relaxed text-ink-dim">
              {probe.note} Both were taken against this build&apos;s production server, not a development one, because the
              development payload carries a great deal that never ships.
            </p>
          </div>

          <div className="rounded-3xl border border-dashed border-amber-300/25 bg-amber-300/[.04] p-6">
            <p className="text-sm font-extrabold text-amber-200">What this does not measure</p>
            <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-amber-100/80">
              <li>
                The {audit.worstCaseKb} KB figure is arithmetic, not a trace: it multiplies the one payload we measured by the
                number of cards. Real scroll behaviour depends on viewport size and how far someone scrolls, which is why the
                page states the rule rather than a saving.
              </li>
              <li>
                Intent prefetching still fetches for a reader who hovers and then leaves without clicking. The trade is
                deliberate — one wasted request for an interested reader beats one per card for an uninterested one.
              </li>
              <li>
                The {audit.intentLinks} intent links cover the component and prompt grids. Background cards carry no link at
                all in this build, so they are not part of the count.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link href="/perf/blur" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          ← Blur budget
        </Link>
        <Link href="/lab/layers" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          Animation layer inspector →
        </Link>
      </div>
    </div>
  );
}
