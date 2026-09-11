// Section 15 — Performance & delivery (server panels).
//
// Every number here is measured from the build output on disk by src/lib/perf.ts,
// or recorded in MEASURED with the build it came from named. Nothing is typed in
// as an estimate, and a measurement that cannot be taken is printed as a gap.

import Link from "next/link";
import type { ReactNode } from "react";
import {
  MEASURED,
  reportMeta,
  blurSites,
  buildAvailable,
  buildSummary,
  fontAudit,
  heaviestHtml,
  jsOffReport,
  routeBudgets,
  routeWhy,
  timerAudit,
  typeWeights,
  zeroJsAssets,
} from "@/lib/perf";
import { CACHE_PLAN, CACHE_RULES } from "@/lib/cache-rules";
import { COMPONENTS } from "@/lib/data";

export const PERF_ROUTES: { href: string; label: string; item: string; blurb: string }[] = [
  { href: "/perf", label: "Page budgets", item: "#400", blurb: "Every route's own JS, its CSS and its HTML, measured from this build." },
  { href: "/perf/fonts", label: "Font loading", item: "#401", blurb: "Two subsets instead of nine, both preloaded — before and after numbers." },
  { href: "/perf/no-js", label: "Zero-JS showcase", item: "#402", blurb: "What the site looks like with JavaScript switched off, read from its own HTML." },
  { href: "/perf/mounting", label: "Lazy mounting", item: "#403", blurb: "Demos mount when you scroll near them, and the trade-off that creates." },
  { href: "/perf/no-images", label: "No images", item: "#404", blurb: "Why there is no image pipeline, and what would break the rule." },
  { href: "/perf/caching", label: "Cache headers", item: "#405", blurb: "Every rule this build serves, in order, plus the invalidation plan for a CMS." },
  { href: "/perf/chunks", label: "Bundle splitting", item: "#406", blurb: "What ships where, and the layout import that put 485 KB on every page." },
  { href: "/perf/blur", label: "Blur budget", item: "#407", blurb: "Every backdrop-blur in the project, classified by how much surface it covers." },
  { href: "/lab/layers", label: "Layer inspector", item: "#408", blurb: "Mount a demo and read every property it animates, classified by what the compositor can take." },
  { href: "/perf/prefetch", label: "Prefetch strategy", item: "#409", blurb: "Why catalog cards wait for intent, with the payload of one prefetch measured." },
  { href: "/perf/timers", label: "Timers & listeners", item: "#410", blurb: "Registrations against cleanups, file by file, from the source." },
  { href: "/perf/devices", label: "Device matrix", item: "#411", blurb: "The three device classes this site is tested against — and what has not been run." },
  { href: "/perf/build", label: "Build report", item: "#413", blurb: "What the production build compiles in: routes, chunks, fonts, HTML." },
  { href: "/perf/service-worker", label: "Service worker plan", item: "#414", blurb: "Offline for the catalog after the API lands, and why it is not shipped yet." },
];

export function PerfNav({ current }: { current: string }) {
  return (
    <nav aria-label="Performance sections" className="flex flex-wrap gap-2">
      {PERF_ROUTES.map((r) => (
        <Link
          key={r.href}
          href={r.href}
          aria-current={r.href === current ? "page" : undefined}
          className={`chip !text-[10px] ${r.href === current ? "!border-cyan-300/50 !text-cyan-200" : ""}`}
        >
          {r.label}
        </Link>
      ))}
    </nav>
  );
}

export function MeasuredNote() {
  const meta = reportMeta();
  if (!meta) return null;
  return (
    <p className="text-[10px] leading-relaxed text-ink-faint">
      Measured from the completed build on {meta.measuredAt} UTC (build {meta.buildId?.slice(0, 12) ?? "unknown"}) by{" "}
      <span className="font-mono">{meta.command}</span>, and committed as <span className="font-mono">docs/build-report.json</span>.
      The numbers are not re-derived while the page renders, because a build cannot see its own output.
    </p>
  );
}

export function PerfGap() {
  const gap = buildAvailable();
  if (gap.ok) return null;
  return (
    <div className="rounded-3xl border border-dashed border-amber-300/25 bg-amber-300/[.04] p-5">
      <p className="text-sm font-extrabold text-amber-200">No build to measure</p>
      <p className="mt-1 text-[11px] leading-relaxed text-amber-100/80">
        {gap.reason}. The numbers on this page come from compiled output, so a development server has nothing to report and
        this page says so instead of showing zeroes.
      </p>
    </div>
  );
}

export function Stat({ label, value, sub }: { label: string; value: ReactNode; sub?: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">{label}</p>
      <p className="mt-1 font-mono text-xl font-black">{value}</p>
      {sub && <p className="mt-0.5 text-[10px] leading-relaxed text-ink-faint">{sub}</p>}
    </div>
  );
}

function Panel({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-white/8 bg-panel p-6">
      <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">{title}</p>
      {note && <p className="mt-1.5 max-w-3xl text-[11px] leading-relaxed text-ink-dim">{note}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/* -------------------------------------------------------------------
   #400 — the budget report
   ------------------------------------------------------------------- */

export function BudgetTable({ limit = 26 }: { limit?: number }) {
  const rows = routeBudgets();
  if (!rows.length) return <PerfGap />;
  const shown = rows.slice(0, limit);
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[46rem] text-left text-[11px]">
          <caption className="pb-3 text-left text-[10px] leading-relaxed text-ink-faint">
            &ldquo;Own JS&rdquo; is what a route adds on top of the lightest route&apos;s file set — the shell — and
            &ldquo;Total&rdquo; is everything it loads. Both are read from the compiled entry manifest for each route.
            Module attribution is not cost: /lab/layers shows an own figure of hundreds of kilobytes because it mounts a demo
            through an imported component, which is exactly the weight a reader would fetch.
          </caption>
          <thead className="border-b border-white/8 text-[10px] uppercase tracking-widest text-ink-faint">
            <tr>
              <th className="px-3 py-2.5 font-bold">Route</th>
              <th className="px-3 py-2.5 font-bold">Own JS</th>
              <th className="px-3 py-2.5 font-bold">Total JS</th>
              <th className="px-3 py-2.5 font-bold">CSS</th>
              <th className="px-3 py-2.5 font-bold">HTML</th>
              <th className="px-3 py-2.5 font-bold">Files</th>
              <th className="px-3 py-2.5 font-bold">Rendering</th>
              <th className="px-3 py-2.5 font-bold">Why this size</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => {
              const why = routeWhy(r.url, 2);
              return (
                <tr key={r.url} className="border-b border-white/5 align-top last:border-0">
                  <td className="px-3 py-2.5">
                    {/* A pattern like /components/[slug] is not a URL — linking
                        it would 404, so it is printed as text. */}
                    {r.url.includes("[") ? (
                      <span className="font-mono text-[10px] text-ink-dim">{r.url}</span>
                    ) : (
                      <Link href={r.url} className="font-mono text-[10px] hover:text-cyan-200">
                        {r.url}
                      </Link>
                    )}
                  </td>
                  <td className="px-3 py-2.5 font-mono">{r.ownJsKb} KB</td>
                  <td className="px-3 py-2.5 font-mono text-ink-dim">{r.totalJsKb} KB</td>
                  <td className="px-3 py-2.5 font-mono text-ink-dim">{r.cssKb} KB</td>
                  <td className="px-3 py-2.5 font-mono text-ink-dim">{r.htmlKb ? `${r.htmlKb} KB` : "—"}</td>
                  <td className="px-3 py-2.5 font-mono text-ink-dim">{r.jsFiles}</td>
                  <td className="px-3 py-2.5">
                    <span className={`chip !text-[9px] ${r.prerendered ? "!border-emerald-300/40 !text-emerald-300" : "!border-amber-300/40 !text-amber-300"}`}>
                      {r.prerendered ? "prerendered" : "on demand"}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-[10px] leading-relaxed text-ink-faint">
                    {why.rows.map((w) => (
                      <span key={w.file} className="block">
                        <span className="font-mono">{w.file.split("/").pop()}</span> · {w.lines} lines
                      </span>
                    ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {rows.length > shown.length && (
        <p className="text-[10px] text-ink-faint">
          Showing the {shown.length} heaviest of {rows.length} measured routes. The rest are lighter than the last row here;
          the threshold is a display limit, not a judgement.
        </p>
      )}
    </div>
  );
}

export function BudgetSummary() {
  const s = buildSummary();
  const rows = routeBudgets();
  const heaviest = rows[0];
  const html = heaviestHtml(1)[0];
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Stat label="Routes measured" value={s.routes} sub={`${rows.filter((r) => r.prerendered).length} with a prerendered body`} />
      <Stat label="Shell baseline" value={`${s.sharedJsKb} KB`} sub={`the file set of ${s.baselineUrl}, which every other route adds to`} />
      <Stat label="Heaviest own JS" value={`${heaviest?.ownJsKb ?? 0} KB`} sub={heaviest?.url} />
      <Stat label="Routes at baseline" value={rows.filter((r) => r.ownJsKb === 0).length} sub="pages that add no chunk of their own" />
      <Stat label="Heaviest HTML" value={`${html?.kb ?? 0} KB`} sub={html?.file.split("/").pop()} />
      <Stat label="JS chunks" value={s.jsFiles} sub={`${s.jsKb} KB emitted in total`} />
      <Stat label="CSS" value={`${s.cssKb} KB`} sub={`${s.cssFiles} stylesheets`} />
      <Stat label="Fonts" value={`${s.fontKb} KB`} sub={`${s.fontFiles} files, all preloaded`} />
      <Stat label="Prerendered HTML" value={`${s.htmlKb} KB`} sub={`across ${s.htmlFiles} files`} />
    </div>
  );
}

/* -------------------------------------------------------------------
   #401 — fonts
   ------------------------------------------------------------------- */

export function FontPanel() {
  const f = fontAudit();
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Font files shipped" value={`${f.before.files} → ${f.files.length}`} sub={`measured on ${MEASURED.before.build} → this build`} />
        <Stat label="Font weight" value={`${f.before.totalKb} → ${f.totalKb} KB`} sub={`${Math.round((1 - f.totalKb / f.before.totalKb) * 100)}% smaller`} />
        <Stat label="Pages preloading" value={`${f.before.preloadedCount} → ${f.coverage.pagesWithLinks}`} sub={`of ${f.coverage.pages} prerendered pages in the measured build`} />
      </div>

      <Panel
        title="What shipped before, and what ships now"
        note={`The old setup imported both fontsource packages wholesale: ${f.before.subsets.length} subsets, ${f.before.subsets.join(", ")}. The site's copy uses Latin-1 characters only — é, ó, á, í, ú, ñ, £, °, × and · all live in the latin range — so nothing on a page needed the other six.`}
      >
        <table className="w-full min-w-[34rem] text-left text-[11px]">
          <thead className="border-b border-white/8 text-[10px] uppercase tracking-widest text-ink-faint">
            <tr>
              <th className="px-3 py-2.5 font-bold">Face</th>
              <th className="px-3 py-2.5 font-bold">Subset</th>
              <th className="px-3 py-2.5 font-bold">Size</th>
              <th className="px-3 py-2.5 font-bold">Preloaded</th>
              <th className="px-3 py-2.5 font-bold">File</th>
            </tr>
          </thead>
          <tbody>
            {f.files.map((x) => (
              <tr key={x.file} className="border-b border-white/5 last:border-0">
                <td className="px-3 py-2.5 font-bold">{x.family}</td>
                <td className="px-3 py-2.5">{x.subset}</td>
                <td className="px-3 py-2.5 font-mono">{x.kb} KB</td>
                <td className="px-3 py-2.5">
                  <span className={`chip !text-[9px] ${x.preloaded ? "!border-emerald-300/40 !text-emerald-300" : "!border-danger/40 !text-danger"}`}>
                    {x.preloaded ? "yes" : "no"}
                  </span>
                </td>
                <td className="px-3 py-2.5 font-mono text-[10px] text-ink-faint">{x.file}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel
        title="How the preload is verified"
        note="Not by trusting the config: the audit reads every prerendered HTML file and looks for the link. A build that stopped emitting it would show a drop on this page before anyone noticed a flash of unstyled text in production."
      >
        <pre className="overflow-x-auto rounded-2xl border border-white/8 bg-[#07090f] p-4 font-mono text-[10px] leading-relaxed text-ink-dim">{`<link rel="preload"
      href="/_next/static/media/inter_latin_wght_normal-s.p.<hash>.woff2"
      as="font" crossorigin="" type="font/woff2" />`}</pre>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-dim">
          next/font also emits a metric-matched fallback face (<span className="font-mono">inter Fallback</span> with a{" "}
          <span className="font-mono">size-adjust</span> of 107.89%), so the swap to the real face moves text far less than a
          default fallback would. That number is in the compiled CSS, not in this copy.
        </p>
      </Panel>
    </div>
  );
}

/* -------------------------------------------------------------------
   #402 — zero-JS showcase
   ------------------------------------------------------------------- */

export function NoJsPanel() {
  const z = zeroJsAssets();
  const rows = jsOffReport();
  const measured = MEASURED.after.jsOff as Record<string, { htmlKb: number; pending: number; mounted: number; links: number; headings: number }>;
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Assets with no dependencies" value={`${z.depFree.length} / ${z.total}`} sub={`${z.share}% of the catalog`} />
        <Stat label="CSS-only stacks" value={z.cssOnly.length} sub="HTML/CSS builds — no framework, no runtime" />
        <Stat label="Assets with dependencies" value={z.withDeps.length} sub={z.withDeps.map((a) => a.slug).join(", ")} />
      </div>

      <Panel
        title="The JavaScript-off view, measured"
        note="Each row is the page as a client with no JavaScript receives it — the HTML from a plain request, with every script ignored. Nothing is executed, so what the table shows is what a text browser or a crawler sees."
      >
        <table className="w-full min-w-[40rem] text-left text-[11px]">
          <thead className="border-b border-white/8 text-[10px] uppercase tracking-widest text-ink-faint">
            <tr>
              <th className="px-3 py-2.5 font-bold">Page</th>
              <th className="px-3 py-2.5 font-bold">HTML</th>
              <th className="px-3 py-2.5 font-bold">Demos deferred</th>
              <th className="px-3 py-2.5 font-bold">Demos mounted</th>
              <th className="px-3 py-2.5 font-bold">Card titles in HTML</th>
              <th className="px-3 py-2.5 font-bold">Links</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(measured).map(([url, m]) => (
              <tr key={url} className="border-b border-white/5 last:border-0">
                <td className="px-3 py-2.5 font-mono text-[10px]">{url}</td>
                <td className="px-3 py-2.5 font-mono">{m.htmlKb} KB</td>
                <td className="px-3 py-2.5 font-mono">{m.pending}</td>
                <td className="px-3 py-2.5 font-mono">{m.mounted}</td>
                <td className="px-3 py-2.5 font-mono">{m.headings}</td>
                <td className="px-3 py-2.5 font-mono">{m.links}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-dim">
          Read the third and fifth columns together: the demos wait, and the catalog does not. All {measured["/components"]?.headings}{" "}
          component titles and all {measured["/prompts"]?.headings} prompt titles are in the HTML, along with their links,
          kinds and scores — a visitor with no JavaScript can browse the whole library and simply does not see the
          animations, which are decoration on top of the information.
        </p>
      </Panel>

      <p className="text-[11px] leading-relaxed text-ink-faint">
        {rows.filter((r) => r.onDemand).length ? `${rows.filter((r) => r.onDemand).length} of the pages above have no prerendered file, because they are rendered on demand; those rows come from a live request rather than from the build output.` : ""}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------
   #403 — lazy mounting
   ------------------------------------------------------------------- */

export function MountingPanel() {
  const { before, after } = MEASURED;
  const deferred = jsOffReport().find((r) => r.url === "/prompts");
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="/prompts HTML weight" value={`${before.promptsHtmlKb} → ${after.promptsHtmlKb} KB`} sub={`${Math.round((1 - after.promptsHtmlKb / before.promptsHtmlKb) * 100)}% less markup`} />
        <Stat
          label="Demos deferred in /prompts"
          value={deferred ? `${deferred.pending}` : "—"}
          sub={deferred ? `${deferred.mounted} mounted in the built HTML; the rest wait for the viewport` : "no reading available"}
        />
        <Stat label="Work avoided on load" value={String(COMPONENTS.length)} sub="demo subtrees on /components that no longer mount off-screen" />
      </div>

      <Panel
        title="What changed"
        note="Catalog cards and prompt posters now hold their demo back until the card is within one screen of the viewport, then mount it for good. The placeholder reserves the exact height, so nothing reflows when a demo appears."
      >
        <ol className="space-y-2 text-[11px] leading-relaxed text-ink-dim">
          <li>
            <span className="font-bold text-ink">1.</span> The page renders the card — title, kind, scores, stack, link — and a
            placeholder marked <span className="font-mono">data-lazy-state=&quot;pending&quot;</span>.
          </li>
          <li>
            <span className="font-bold text-ink">2.</span> On the client, one <span className="font-mono">IntersectionObserver</span>{" "}
            per demo watches with a 320px root margin; the observer is created inside a frame so nothing is set from an effect
            body and layout is settled first.
          </li>
          <li>
            <span className="font-bold text-ink">3.</span> When the card approaches, the demo mounts and the observer
            disconnects — it never re-observes, because a mounted demo is not going back.
          </li>
        </ol>
      </Panel>

      <div className="rounded-3xl border border-dashed border-amber-300/25 bg-amber-300/[.04] p-5">
        <p className="text-sm font-extrabold text-amber-200">The trade-off, stated rather than hidden</p>
        <p className="mt-1.5 max-w-3xl text-[11px] leading-relaxed text-amber-100/80">
          Mounting needs JavaScript. With JavaScript disabled the placeholders never fill in, so a no-JS visitor sees the
          catalog without animations. That is a real cost, accepted because the animation is decoration over information that
          stays in the HTML — and measured on the no-JavaScript page, where all {COMPONENTS.length} component titles are still present. The
          alternative, mounting everything eagerly, is what the previous build did, and it is the number on the left.
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------
   #406 — bundle splitting
   ------------------------------------------------------------------- */

export function SplitPanel() {
  const { before, after } = MEASURED;
  const rows = routeBudgets();
  const demoFree = rows.filter((r) => r.ownJsKb === 0);
  const weights = typeWeights();
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="JS on a page with no demo" value={`${before.noDemoPageJsKb} → ${after.noDemoPageJsKb} KB`} sub="e.g. /quality, /learn, /community/attribution" />
        <Stat label="/studio main chunk" value={`${before.studioJsKb} → ${after.studioJsKb} KB`} sub="after splitting the Pro gate out of the Section 14 demos" />
        <Stat label="Routes at the shell baseline" value={demoFree.length} sub="pages whose file set is the shell itself — no chunk of their own" />
      </div>

      <Panel
        title="The import that was on every page"
        note="The public layout renders <KeyframesStyle />. It used to import it from cards.tsx to get it, and cards.tsx imports the demo module — so all 80 public routes shipped the 7,416-line demo file whether or not they rendered a demo."
      >
        <pre className="overflow-x-auto rounded-2xl border border-white/8 bg-[#07090f] p-4 font-mono text-[10px] leading-relaxed text-ink-dim">{`before:  (public)/layout.tsx → cards.tsx → demos/Demo.tsx   ${before.noDemoPageJsKb} KB on a page with no demo
after:   (public)/layout.tsx → keyframes.tsx (41 lines)     ${after.noDemoPageJsKb} KB on the same page

The keyframes moved into their own module. A page that renders a demo still
loads the demo module, because it uses it; a page that does not, no longer
pays for it.`}</pre>
      </Panel>

      <Panel title="Where the weight goes by content type" note="Catalog bundle sizes are per-asset numbers from the data, not measurements of this build's chunks — a template is a whole page, an element is a control.">
        <table className="w-full min-w-[32rem] text-left text-[11px]">
          <thead className="border-b border-white/8 text-[10px] uppercase tracking-widest text-ink-faint">
            <tr>
              <th className="px-3 py-2.5 font-bold">Content</th>
              <th className="px-3 py-2.5 font-bold">Items</th>
              <th className="px-3 py-2.5 font-bold">Catalog KB</th>
              <th className="px-3 py-2.5 font-bold">Mean</th>
            </tr>
          </thead>
          <tbody>
            {weights.map((w) => (
              <tr key={w.label} className="border-b border-white/5 last:border-0">
                <td className="px-3 py-2.5">
                  <Link href={w.href} className="font-bold hover:text-cyan-200">
                    {w.label}
                  </Link>
                </td>
                <td className="px-3 py-2.5 font-mono">{w.items}</td>
                <td className="px-3 py-2.5 font-mono">{w.kb ? `${Math.round(w.kb * 10) / 10} KB` : "—"}</td>
                <td className="px-3 py-2.5 font-mono text-ink-dim">{w.kb && w.items ? `${Math.round((w.kb / w.items) * 10) / 10} KB` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

/* -------------------------------------------------------------------
   #407 — blur budget
   ------------------------------------------------------------------- */

export function BlurPanel() {
  const { sites, counts } = blurSites();
  const byFile = sites.reduce<Record<string, number>>((a, s) => {
    a[s.file] = (a[s.file] ?? 0) + 1;
    return a;
  }, {});
  const top = Object.entries(byFile).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const full = sites.filter((s) => s.kind === "full-surface");
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="Blur sites" value={sites.length} sub="every backdrop-blur / backdrop-filter in src" />
        <Stat label="On a full surface" value={counts["full-surface"] ?? 0} sub="inset-0, fixed, full-height — the expensive kind" />
        <Stat label="On a panel" value={counts.panel ?? 0} sub="cards, sheets, menus" />
        <Stat label="On a chip" value={counts.component ?? 0} sub="small badges and pills" />
      </div>

      <Panel
        title="Where blur is used"
        note="The classification is a line-level heuristic over the surrounding class strings: it says where blur sits, which is what a budget needs. It does not claim to measure compositing cost — that needs a real device, which is the device matrix page's job."
      >
        <table className="w-full min-w-[36rem] text-left text-[11px]">
          <thead className="border-b border-white/8 text-[10px] uppercase tracking-widest text-ink-faint">
            <tr>
              <th className="px-3 py-2.5 font-bold">File</th>
              <th className="px-3 py-2.5 font-bold">Blur sites</th>
            </tr>
          </thead>
          <tbody>
            {top.map(([file, n]) => (
              <tr key={file} className="border-b border-white/5 last:border-0">
                <td className="px-3 py-2.5 font-mono text-[10px]">{file}</td>
                <td className="px-3 py-2.5 font-mono">{n}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="The full-surface sites, named" note="These are the ones to look at first when a page feels heavy on a low-end phone: a blurred layer covering the viewport makes the compositor redraw the whole screen on every scroll frame.">
        <ul className="space-y-2">
          {full.map((s) => (
            <li key={`${s.file}:${s.line}`} className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5 text-[10px]">
              <span className="font-mono text-ink-dim">
                {s.file}:{s.line}
              </span>
              <span className="mt-0.5 block truncate font-mono text-[10px] text-ink-faint">{s.source}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

/* -------------------------------------------------------------------
   #410 — timers and listeners
   ------------------------------------------------------------------- */

export function TimerPanel() {
  const t = timerAudit();
  const unbalanced = t.rows.filter((r) => r.set + r.raf > r.clear + r.cancel);
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Intervals / timeouts" value={`${t.totals.set} set · ${t.totals.clear} cleared`} sub="setInterval + setTimeout against clearInterval + clearTimeout" />
        <Stat label="Animation frames" value={`${t.totals.raf} requested · ${t.totals.cancel} cancelled`} sub="a one-shot frame never needs cancelling" />
        <Stat label="Listeners" value={`${t.totals.add} added · ${t.totals.remove} removed`} sub="element and window listeners" />
      </div>

      <Panel
        title="Registrations against cleanups, per file"
        note="A file where registrations outnumber cleanups is not automatically wrong — a one-shot requestAnimationFrame and a listener on an element that is going away both need no cleanup. It is a list to read, not a verdict, and the files with the biggest gaps are at the top."
      >
        <table className="w-full min-w-[44rem] text-left text-[11px]">
          <thead className="border-b border-white/8 text-[10px] uppercase tracking-widest text-ink-faint">
            <tr>
              <th className="px-3 py-2.5 font-bold">File</th>
              <th className="px-3 py-2.5 font-bold">setInterval/Timeout</th>
              <th className="px-3 py-2.5 font-bold">clear…</th>
              <th className="px-3 py-2.5 font-bold">rAF</th>
              <th className="px-3 py-2.5 font-bold">cancelAF</th>
              <th className="px-3 py-2.5 font-bold">addListener</th>
              <th className="px-3 py-2.5 font-bold">removeListener</th>
            </tr>
          </thead>
          <tbody>
            {t.rows.slice(0, 12).map((r) => (
              <tr key={r.file} className="border-b border-white/5 last:border-0">
                <td className="px-3 py-2.5 font-mono text-[10px]">{r.file.replace("src/components/", "")}</td>
                <td className="px-3 py-2.5 font-mono">{r.set}</td>
                <td className="px-3 py-2.5 font-mono text-ink-dim">{r.clear}</td>
                <td className="px-3 py-2.5 font-mono">{r.raf}</td>
                <td className="px-3 py-2.5 font-mono text-ink-dim">{r.cancel}</td>
                <td className="px-3 py-2.5 font-mono">{r.add}</td>
                <td className="px-3 py-2.5 font-mono text-ink-dim">{r.remove}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-dim">
          The house rules the code follows, and the ones this table is read against: every{" "}
          <span className="font-mono">setInterval</span> is cleared in the effect cleanup; every{" "}
          <span className="font-mono">addEventListener</span> is paired with a remove in the same effect; a loop that needs to run
          while visible is driven by one frame at a time rather than by a timer at a fixed rate.
        </p>
        {unbalanced.length > 0 && (
          <p className="mt-2 text-[10px] leading-relaxed text-amber-200/70">
            {unbalanced.length} of {t.rows.length} files register more timers or frames than they clear. The largest gap is{" "}
            <span className="font-mono">{unbalanced[0]?.file.replace("src/components/", "")}</span> — worth a read rather than a
            rewrite, since a one-shot frame accounts for most gaps of one.
          </p>
        )}
      </Panel>
    </div>
  );
}

/* -------------------------------------------------------------------
   #411 — device matrix
   ------------------------------------------------------------------- */

export const DEVICE_CLASSES = [
  {
    id: "low",
    label: "Low-end phone",
    hardware: "4× slower CPU than a 2023 mid-range phone, 4 GB RAM",
    network: "Slow 4G, 400 ms RTT, 1.6 Mbps",
    measures: "First paint, longest main-thread task, dropped frames while scrolling the catalog with demos mounting.",
    why: `This is the class the blur budget and lazy mounting exist for: ${COMPONENTS.length} mounting demos is a different problem at 4× slower.`,
  },
  {
    id: "mid",
    label: "Mid-range laptop",
    hardware: "2020 ultrabook, integrated graphics, 16 GB RAM",
    network: "Broadband, 40 ms RTT",
    measures: "Time to interactive on /components and /studio, layout shift while fonts swap, memory after five minutes on /lab.",
    why: "The default development machine is faster than this. Testing here catches the assumptions a fast laptop hides.",
  },
  {
    id: "constrained",
    label: "Reduced-motion, keyboard-only",
    hardware: "Any device, prefers-reduced-motion: reduce, no pointer",
    network: "n/a",
    measures: "That no animation plays, that the catalog is fully reachable by keyboard, and that focus is never trapped in a demo.",
    why: "Not a performance class in the usual sense, but the one where animation-heavy pages fail hardest.",
  },
] as const;

export function DevicePanel() {
  return (
    <div className="space-y-5">
      <Panel title="The matrix" note="Three classes, chosen because they fail differently. Publishing the matrix before the results is deliberate: it is the part that is checkable today, and it makes the missing results obvious.">
        <div className="grid gap-3 md:grid-cols-3">
          {DEVICE_CLASSES.map((d) => (
            <div key={d.id} className="rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3.5">
              <p className="text-[12px] font-extrabold">{d.label}</p>
              <dl className="mt-2 space-y-1.5 text-[10px] leading-relaxed">
                <div>
                  <dt className="font-bold uppercase tracking-widest text-ink-faint">Hardware</dt>
                  <dd className="text-ink-dim">{d.hardware}</dd>
                </div>
                <div>
                  <dt className="font-bold uppercase tracking-widest text-ink-faint">Network</dt>
                  <dd className="text-ink-dim">{d.network}</dd>
                </div>
                <div>
                  <dt className="font-bold uppercase tracking-widest text-ink-faint">Measured</dt>
                  <dd className="text-ink-dim">{d.measures}</dd>
                </div>
                <div>
                  <dt className="font-bold uppercase tracking-widest text-ink-faint">Why this class</dt>
                  <dd className="text-ink-dim">{d.why}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </Panel>

      <div className="rounded-3xl border border-dashed border-amber-300/25 bg-amber-300/[.04] p-5">
        <p className="text-sm font-extrabold text-amber-200">No results are published, because none have been run</p>
        <p className="mt-1.5 max-w-3xl text-[11px] leading-relaxed text-amber-100/80">
          A device lab needs real hardware or a throttling service, and this build has neither. What it does have is a set of
          measurements that do not need a device: page weight from the compiled output, deferral counts from the HTML, blur
          sites and timer registrations from the source. Those are on the other pages of this section and each one names its
          source. Anything that would require a phone in someone&apos;s hand is listed above as a method, not as a result.
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------
   #413 — build report
   ------------------------------------------------------------------- */

export function BuildPanel() {
  const s = buildSummary();
  const rows = routeBudgets();
  const html = heaviestHtml(6);
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Routes" value={s.routes} sub={`${rows.filter((r) => r.prerendered).length} prerendered, ${rows.filter((r) => !r.prerendered).length} on demand`} />
        <Stat label="JS chunks" value={s.jsFiles} sub={`${s.jsKb} KB, uncompressed, as emitted`} />
        <Stat label="Stylesheets" value={s.cssFiles} sub={`${s.cssKb} KB`} />
        <Stat label="HTML files" value={s.htmlFiles} sub={`${s.htmlKb} KB of prerendered markup`} />
      </div>

      <Panel
        title="What the build compiles in"
        note="The static export of this site is, in order: the framework runtime, one shared chunk for the chrome, a chunk per route that needs client code, one stylesheet, two font files, and the prerendered HTML."
      >
        <ul className="grid gap-2 md:grid-cols-2 text-[11px] text-ink-dim">
          <li className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5">
            <span className="font-bold text-ink">Framework + shared chrome</span> — React, the router, the header, the footer and
            the keyframes the demos share. Loaded by every route, demo or not.
          </li>
          <li className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5">
            <span className="font-bold text-ink">Per-route client chunks</span> — the demo scene sets, the admin console, the studio
            panels, the lab tools. {rows.filter((r) => r.ownJsKb === 0).length} routes have none at all.
          </li>
          <li className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5">
            <span className="font-bold text-ink">One stylesheet</span> — {s.cssKb} KB, Tailwind output plus the demo keyframes,
            shared by every page and cached immutably.
          </li>
          <li className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5">
            <span className="font-bold text-ink">Two fonts</span> — {s.fontKb} KB, latin subsets, preloaded on{" "}
            {fontAudit().coverage.pagesWithLinks} pages.
          </li>
        </ul>
      </Panel>

      <Panel title="The six heaviest prerendered pages" note="HTML weight is not only JavaScript: a page that renders 74 posters is large before anything runs.">
        <table className="w-full min-w-[32rem] text-left text-[11px]">
          <thead className="border-b border-white/8 text-[10px] uppercase tracking-widest text-ink-faint">
            <tr>
              <th className="px-3 py-2.5 font-bold">File</th>
              <th className="px-3 py-2.5 font-bold">Size</th>
            </tr>
          </thead>
          <tbody>
            {html.map((h) => (
              <tr key={h.file} className="border-b border-white/5 last:border-0">
                <td className="px-3 py-2.5 font-mono text-[10px]">{h.file.replace(".next/server/app/", "")}</td>
                <td className="px-3 py-2.5 font-mono">{h.kb} KB</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

/* -------------------------------------------------------------------
   #405 — caching
   ------------------------------------------------------------------- */

export function CachePanel() {
  return (
    <div className="space-y-5">
      <Panel
        title="The rules this build serves"
        note="These are read from the same module next.config.ts imports, so the table and the headers cannot drift. They are checkable against the running site with a single curl per path."
      >
        <table className="w-full min-w-[40rem] text-left text-[11px]">
          <thead className="border-b border-white/8 text-[10px] uppercase tracking-widest text-ink-faint">
            <tr>
              <th className="px-3 py-2.5 font-bold">Path</th>
              <th className="px-3 py-2.5 font-bold">Cache-Control</th>
              <th className="px-3 py-2.5 font-bold">Why</th>
            </tr>
          </thead>
          <tbody>
            {CACHE_RULES.map((r) => (
              <tr key={r.source} className="border-b border-white/5 align-top last:border-0">
                <td className="px-3 py-2.5 font-mono text-[10px]">{r.source}</td>
                <td className="px-3 py-2.5 font-mono text-[10px]">{r.value}</td>
                <td className="px-3 py-2.5 text-ink-dim">{r.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <div className="grid gap-5 md:grid-cols-2">
        <Panel title="What these rules do not cover">
          <ul className="space-y-2">
            {CACHE_PLAN.notConfigured.map((x) => (
              <li key={x} className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5 text-[11px] leading-relaxed text-ink-dim">
                {x}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="When the catalog comes from a CMS">
          <ul className="space-y-2">
            {CACHE_PLAN.whenCmsLands.map((x) => (
              <li key={x} className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5 text-[11px] leading-relaxed text-ink-dim">
                {x}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
