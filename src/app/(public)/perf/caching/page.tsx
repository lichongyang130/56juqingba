import Link from "next/link";
import { CachePanel, PerfNav } from "@/components/perf-ui";
import { CACHE_RULES } from "@/lib/cache-rules";

export const metadata = {
  title: "Cache headers — Motif UI",
  description: "The three Cache-Control rules this build serves, why immutable is safe for fingerprinted assets, and the CMS invalidation plan.",
};

export default function PerfCachingPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Edge-cache plan</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          {CACHE_RULES.length} rules, <span className="text-gradient">one of them immutable</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          A static build is the easy case: fingerprinted assets can be cached forever and HTML cannot. What matters is writing
          down which is which, so the day a CMS makes pages editable the short window is already there instead of being
          discovered in a support ticket.
        </p>
      </div>

      <div className="mt-8">
        <PerfNav current="/perf/caching" />
      </div>

      <div className="mt-10">
        <CachePanel />
      </div>

      <div className="mt-10 rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Verify it yourself</p>
        <pre className="mt-3 overflow-x-auto rounded-2xl border border-white/8 bg-[#07090f] p-4 font-mono text-[10px] leading-relaxed text-ink-dim">{`curl -sI https://<host>/pricing | grep -i cache-control
curl -sI https://<host>/_next/static/chunks/<file>.js | grep -i cache-control`}</pre>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-dim">
          The build harness runs the same two checks against the running server for every batch, so a config edit that drops
          a header fails the batch rather than shipping quietly.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link href="/perf/no-images" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          ← No images
        </Link>
        <Link href="/perf/chunks" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          Bundle splitting →
        </Link>
      </div>
    </div>
  );
}
