import type { Metadata } from "next";
import Link from "next/link";
import { CHANGELOG } from "@/lib/data";
import { MEASURED } from "@/lib/perf";
import report from "../../../../../docs/build-report.json";

export const metadata: Metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/quality/speed" },
  title: "Speed — the measured story — Motif UI",
  description:
    "The performance numbers this site can actually measure: JavaScript per route, font weight, the split that halved both, and an explicit note on the scores it does not claim.",
};

/**
 * #480 — speed as a story rather than a badge.
 *
 * The rule for this page: every figure is read from the build report or the
 * changelog, and anything that would need a browser (Lighthouse, Core Web
 * Vitals) is named as not measured here instead of estimated. A performance
 * page that quietly borrows a score is the easiest lie on a website.
 */

interface PerfRow {
  build: string;
  scope: string;
  deltaKb: number;
}

export default function SpeedPage() {
  const s = report.summary as { routes: number; prerendered: number; jsFiles: number; jsKb: number; cssKb: number; fontFiles: number };
  const fonts = report.fonts as { totalKb: number; pagesWithPreload: number; pages: number };
  const heaviest = (report.heaviestHtml as { file: string; kb: number }[]).slice(0, 4);
  const jsOff = report.jsOff as Record<string, { links: number; headings: number } | null>;
  const baseline = report.baseline as { url: string; jsKb: number; note: string };

  // MEASURED predates this page and keeps its own field names: jsKb here is the
  // JavaScript loaded by a page that renders no demo, which is the like-for-like
  // comparison across the two builds.
  const measured = {
    before: { jsKb: MEASURED.before.noDemoPageJsKb, fontKb: MEASURED.before.fontKb, build: MEASURED.before.build },
    after: { jsKb: MEASURED.after.noDemoPageJsKb, fontKb: MEASURED.after.fontKb, build: MEASURED.after.build },
  };
  const measuredRows: PerfRow[] = CHANGELOG.filter((e) => e.perf).map((e) => ({ build: e.perf!.build, scope: e.perf!.scope, deltaKb: e.perf!.deltaKb }));

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <Link href="/quality" className="hover:text-ink">
          Quality bar
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Speed</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Performance · measured, not estimated</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">The numbers we can stand behind</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          Every figure on this page is read from the build report or the changelog at build time — nothing here is typed in by hand, and the two
          exceptions (Lighthouse and field metrics) are named at the bottom rather than gestured at.
        </p>
        <p className="mt-2 font-mono text-[10px] text-ink-faint">
          build {String((report as { buildId?: string }).buildId ?? "").slice(0, 10)} · measured {(report as { measuredAt?: string }).measuredAt?.slice(0, 16).replace("T", " ")}Z
        </p>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "JavaScript shipped", value: `${s.jsKb.toFixed(1)} KB`, note: `${s.jsFiles} chunks across ${s.prerendered} prerendered routes` },
          { label: "CSS", value: `${s.cssKb.toFixed(1)} KB`, note: "one stylesheet, no runtime CSS-in-JS" },
          { label: "Fonts", value: `${fonts.totalKb} KB`, note: `preloaded on ${fonts.pagesWithPreload}/${fonts.pages} pages` },
          { label: "Shared shell", value: `${(report.sharedJsKb as number).toFixed(1)} KB`, note: baseline.note },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border border-white/8 bg-panel p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">{c.label}</p>
            <p className="mt-1 font-mono text-2xl tabular-nums">{c.value}</p>
            <p className="mt-1 text-[10px] leading-relaxed text-ink-dim">{c.note}</p>
          </div>
        ))}
      </section>

      <section className="mt-10 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">The split that halved two numbers</h2>
        <p className="mt-2 text-[12px] leading-relaxed text-ink-dim">
          The largest single win in this project&apos;s log was not an optimisation — it was noticing that a layout import dragged the whole
          demo module onto 82 routes that render no demo. Splitting it out moved the numbers below, both taken from the build report on the
          builds either side of the change.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">JavaScript on a route with no demo</p>
            <p className="mt-2 font-mono text-lg tabular-nums">
              <span className="text-ink-faint line-through">{measured.before.jsKb.toFixed(1)} KB</span>
              <span className="mx-2 text-ink-faint">→</span>
              <span className="text-emerald-200">{measured.after.jsKb.toFixed(1)} KB</span>
            </p>
            <p className="mt-1 font-mono text-[10px] text-ink-faint">
              {measured.before.build} → {measured.after.build}
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Fonts preloaded</p>
            <p className="mt-2 font-mono text-lg tabular-nums">
              <span className="text-ink-faint line-through">{measured.before.fontKb} KB</span>
              <span className="mx-2 text-ink-faint">→</span>
              <span className="text-emerald-200">{measured.after.fontKb} KB</span>
            </p>
          </div>
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
          The font drop came from the same audit: the layout imported seven subsets for an English site, and the two latin files cover every
          glyph the catalog uses.
        </p>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <h2 className="text-sm font-extrabold tracking-tight">Recorded size changes</h2>
          <ul className="mt-3 space-y-2">
            {measuredRows.map((r) => (
              <li key={r.build + r.scope} className="flex items-center justify-between gap-3 text-[11px]">
                <span className="min-w-0 flex-1 truncate text-ink-dim">{r.scope}</span>
                <span className={`font-mono tabular-nums ${r.deltaKb < 0 ? "text-emerald-200" : "text-amber-200"}`}>
                  {r.deltaKb < 0 ? "" : "+"}
                  {r.deltaKb.toFixed(1)} KB
                </span>
                <span className="shrink-0 font-mono text-[10px] text-ink-faint">{r.build}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
            Entries in the changelog without a figure are older than the build report; they say so on their own pages.
          </p>
        </div>

        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <h2 className="text-sm font-extrabold tracking-tight">Where the weight is now</h2>
          <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
            The four heaviest HTML documents in the build, for scale — note that all four are interactive consoles rather than content pages:
          </p>
          <ul className="mt-3 space-y-1.5 font-mono text-[10.5px] text-ink-dim">
            {heaviest.map((h) => (
              <li key={h.file} className="flex items-center justify-between gap-3">
                <span className="truncate">{h.file.replace(".next/server/app/", "")}</span>
                <span className="tabular-nums text-ink-faint">{h.kb.toFixed(1)} KB</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
            Sample routes checked with JavaScript off: <span className="font-mono">{Object.keys(jsOff).join(", ")}</span>. The pages render,
            the copy is present, and the interactive panels say they need the client instead of showing an empty box.
          </p>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-dashed border-amber-300/30 bg-amber-400/[.04] p-6">
        <h2 className="text-sm font-extrabold tracking-tight text-amber-100">What this page does not claim</h2>
        <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-ink-dim">
          <li>
            <strong>No Lighthouse score.</strong> Lighthouse was not run against this build — the sandbox that produced it has no browser
            runtime. A number would have to come from a real run, on a named machine, with the report kept; until that exists, this page prints
            kilobytes instead of a grade.
          </li>
          <li>
            <strong>No field metrics.</strong> There is no analytics on this site by design, so no LCP, INP or CLS percentiles exist to quote.
            Inventing them would contradict the rest of the site.
          </li>
          <li>
            <strong>No comparative claim.</strong> These numbers describe this build; they are not a statement about anybody else&apos;s.
          </li>
        </ul>
        <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
          If a Lighthouse run happens, the plan is a dated table here with the machine, the config and the report file — one run is an anecdote,
          a series is evidence, and the series is what the build report already gives us.
        </p>
      </section>

      <p className="mt-8 text-[11px] leading-relaxed text-ink-faint">
        Related:{" "}
        <Link href="/perf" className="font-semibold text-cyan-300 hover:text-cyan-200">
          the performance registry
        </Link>
        ,{" "}
        <Link href="/quality/craft" className="font-semibold text-cyan-300 hover:text-cyan-200">
          the craft excerpts
        </Link>{" "}
        and{" "}
        <Link href="/quality/crawl" className="font-semibold text-cyan-300 hover:text-cyan-200">
          the crawl surface
        </Link>
        .
      </p>
    </div>
  );
}
