import Link from "next/link";
import { exportFor } from "@/lib/exports";
import { CHANGELOG } from "@/lib/data";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/integrations/feed" },
  title: "Changelog feed — Motif UI",
  description: "RSS for the studio log, with each entry's measured size change carried inside the description.",
};

export default function IntegrationsFeedPage() {
  const entry = exportFor("changelog.xml")!;
  const xml = entry.build();
  const withPerf = CHANGELOG.filter((c) => c.perf).length;
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Export · {entry.item}</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          The log, <span className="text-gradient">in a reader</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          {CHANGELOG.length} entries as RSS 2.0, generated from the same array the changelog page renders. {withPerf} of them
          carry a measured size change, and that sentence travels inside the item&apos;s description rather than being lost outside
          the feed.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <a href="/api/exports/changelog.xml" className="btn btn-primary !px-4 !py-2 text-xs">
          Open the feed
        </a>
        <Link href="/integrations" className="btn btn-ghost !px-4 !py-2 text-xs">
          ← All exports
        </Link>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/8 bg-panel p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Subscribe</p>
            <pre className="mt-3 overflow-x-auto rounded-2xl border border-white/8 bg-[#07090f] p-4 font-mono text-[10px] leading-relaxed text-ink-dim">{`https://<host>/api/exports/changelog.xml`}</pre>
            <p className="mt-3 text-[11px] leading-relaxed text-ink-dim">
              Paste that into any reader. The channel description states the entry count and that dates are the stored
              publication dates rather than feed-generation times, so a reader cannot imply a cadence the studio does not keep.
            </p>
          </div>
          <div className="rounded-3xl border border-dashed border-amber-300/25 bg-amber-300/[.04] p-6">
            <p className="text-sm font-extrabold text-amber-200">What the feed is not</p>
            <p className="mt-2 text-[11px] leading-relaxed text-amber-100/80">
              It is not a release feed: this project has no versioned releases, only a dated studio log. Items point at{" "}
              <span className="font-mono">/#changelog</span> because every entry lives on that one page, so there is no per-entry
              URL to link to — a real limitation of a single-page log, stated here rather than papered over with an anchor that
              does not exist.
            </p>
          </div>
        </div>
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">
            The feed ({(Buffer.byteLength(xml) / 1024).toFixed(1)} KB, first 26 lines)
          </p>
          <pre className="mt-3 max-h-[32rem] overflow-auto rounded-2xl border border-white/8 bg-[#07090f] p-4 font-mono text-[10px] leading-relaxed text-ink-dim">
            {xml.split("\n").slice(0, 26).join("\n")}
          </pre>
        </div>
      </div>
    </div>
  );
}
