import Link from "next/link";
import { EXPORTS, exportSizeKb } from "@/lib/exports";

export const metadata = {
  title: "Integrations & exports — Motif UI",
  description: "Five live export endpoints built from the site's own tokens and catalog data, with what each one leaves out.",
};

const NOT_SHIPPED = [
  ["CodeSandbox export", "A deep link needs a hosted sandbox service and a place to upload the file; both are outside a static build."],
  ["Storybook decorator", "Publishing it means owning a package on npm, which this project does not."],
  ["iframe embed", "Embedding a demo on someone else's site needs an embed route with its own caching and origin rules."],
  ["Browser bookmarklet", "The palette it would save is already readable from the page's own CSS variables — the bookmarklet would be a wrapper over a value the reader can see."],
  ["CLI", "`npx motif add` needs a published package and a registry lookup. The command's intended behaviour is sketched in the docs, not shipped."],
  ["Per-asset CI badge", "A badge that reports a score needs a badge service. What can be published honestly is the number, which is on every asset page."],
  ["RSS for the changelog", "Requires a generated feed file at a stable URL — scheduled, not shipped in this batch."],
  ["Print stylesheet for Learn", "A print stylesheet is a stylesheet, not a feature: it ships when the guides stop being read on screens. The guides print today with the browser's defaults."],
];

export default function IntegrationsPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Integrations &amp; exports</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          Hand out <span className="text-gradient">what is actually stored</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          An export is a promise that what you download matches what the product is. These five are generated from the same
          modules this site renders from — the stylesheet, the catalog data, the token values — and each page prints the exact
          bytes the endpoint serves.
        </p>
      </div>

      <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {EXPORTS.map((e) => (
          <div key={e.file} className="rounded-3xl border border-white/8 bg-panel p-5">
            <div className="flex items-start justify-between gap-2">
              <span className="font-mono text-[10px] text-ink-faint">{e.item}</span>
              <span className="chip !text-[10px]">{(exportSizeKb(e.build())).toFixed(1)} KB</span>
            </div>
            <p className="mt-2 text-sm font-bold">{e.label}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-ink-dim">{e.blurb}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={`/api/exports/${e.file}`} className="btn btn-primary !px-3 !py-1.5 text-[11px]">
                Download
              </a>
              <Link
                href={
                  e.file === "tokens.json"
                    ? "/integrations/tokens"
                    : e.file === "motif-preset.cjs"
                      ? "/integrations/tailwind"
                      : e.file === "figma-variables.json"
                        ? "/integrations/figma"
                        : e.file === "catalog.json"
                          ? "/integrations/catalog"
                          : "/integrations/vscode"
                }
                className="btn btn-ghost !px-3 !py-1.5 text-[11px]"
              >
                Read it
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">How these are generated</p>
        <pre className="mt-3 overflow-x-auto rounded-2xl border border-white/8 bg-[#07090f] p-4 font-mono text-[10px] leading-relaxed text-ink-dim">{`src/app/globals.css  @theme block  →  src/lib/exports.ts  →  /api/exports/<file>
src/lib/data.ts      catalog       →        "            →   printed on each page`}</pre>
        <p className="mt-3 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          The endpoint and the pages call the same builder, which is the only way to keep a download and its documentation
          honest. A change to a token or a catalog score shows up in the file, on the page and in the exports list in one step —
          and the harness fetches each endpoint and checks that the bytes it returns are the bytes the page printed.
        </p>
      </div>

      <div className="mt-10 rounded-3xl border border-dashed border-amber-300/25 bg-amber-300/[.04] p-6">
        <p className="text-sm font-extrabold text-amber-200">Bridges that are not shipped, and why</p>
        <ul className="mt-3 grid gap-2 md:grid-cols-2">
          {NOT_SHIPPED.map(([title, why]) => (
            <li key={title} className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-3">
              <span className="text-[11px] font-bold text-amber-100">{title}</span>
              <span className="mt-0.5 block text-[11px] leading-relaxed text-amber-100/70">{why}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[10px] leading-relaxed text-amber-100/60">
          These are listed here rather than left out of the page, because &ldquo;integrations&rdquo; is the section where a
          missing bridge is easiest to fake with a screenshot of somebody else&apos;s.
        </p>
      </div>
    </div>
  );
}
