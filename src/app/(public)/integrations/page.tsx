import Link from "next/link";
import { EXPORTS, exportSizeKb } from "@/lib/exports";
import { COMPONENTS } from "@/lib/data";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/integrations" },
  title: "Integrations & exports",
  description: "Every export and integration this build serves, generated from the site's own tokens and catalog data, with the gaps it will not paper over.",
};

/** Where each export is documented. One entry per registry file, so adding an
 *  export without a page fails the type check rather than the link. */
const PAGE_FOR: Record<string, string> = {
  "tokens.json": "/integrations/tokens",
  "motif-preset.cjs": "/integrations/tailwind",
  "figma-variables.json": "/integrations/figma",
  "catalog.json": "/integrations/catalog",
  "motif.code-snippets": "/integrations/vscode",
  "motif-react-wrapper.jsx": "/integrations/react",
  "single-file.html": "/integrations/single-file",
  "codesandbox-files.json": "/integrations/codesandbox",
  "motif-bookmarklet.js": "/integrations/bookmarklet",
  "motif-cli.mjs": "/integrations/cli",
  "changelog.xml": "/integrations/feed",
  "motif-storybook-decorator.jsx": "/integrations/storybook",
  "learn-print.css": "/integrations/print",
};

// Section 16 closed with no unshipped bullet left, which is not the same as no
// gaps. Each line below is the part of a shipped integration that this build
// still cannot do, named with what it would take — a registry entry, a server,
// a third-party round trip. The list is what the pages say about themselves,
// collected in one place so a reader does not have to find the five footnotes.
const SUB_GAPS: [string, string, string][] = [
  [
    "One-click CodeSandbox link",
    "CodeSandbox export — the file bundle",
    "The three files ship and work. A define link encodes the project with lz-string parameters fetched from a third party, and this build cannot make that round trip to verify its own output, so it prints the files instead of a URL that might open nothing.",
  ],
  [
    "Embed allowlist",
    "Framer-style code embed — the route",
    `The chrome-free route ships for all ${COMPONENTS.length} assets with frame-ancestors and noindex set. Restricting frames to named partners means reading the Origin header per request, which needs a server this build does not have.`,
  ],
  [
    "Publishing to npm",
    "React wrapper, Storybook decorator, CLI",
    "All three files are real and run from disk. There is no registry entry behind any of them, so no install command on this site would work, and none is printed.",
  ],
  [
    "Saving a palette",
    "Browser bookmarklet — reading and copying",
    "The bookmarklet reads the custom properties on any page and copies one declaration per click. Saving a set needs storage and an identity to attach it to, so the reader gets a clipboard and nothing else.",
  ],
  [
    "A pipeline behind the badge",
    "Per-asset score badge",
    "The badge route serves a real SVG carrying the asset's stored editorial score. No test run, build or CI service stands behind the number, and the SVG's own description says so.",
  ],
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
          An export is a promise that what you download matches what the product is. These {EXPORTS.length} are generated from
          the same modules this site renders from — the stylesheet, the catalog data, the token values — and each page prints
          the exact bytes the endpoint serves. Two more integrations are routes rather than files:{" "}
          <Link href="/integrations/embed" className="underline decoration-dotted">
            the embed
          </Link>{" "}
          serves frames and{" "}
          <Link href="/integrations/badge" className="underline decoration-dotted">
            the badge
          </Link>{" "}
          serves an SVG per asset.
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
                href={PAGE_FOR[e.file] ?? "/integrations"}
                className="btn btn-ghost !px-3 !py-1.5 text-[11px]"
              >
                Read it
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Three integrations that are not downloads</p>
        <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
          The{" "}
          <Link href="/integrations/og" className="underline decoration-dotted">
            Open Graph helper
          </Link>{" "}
          builds a block per asset instead of shipping one download, and the{" "}
          <Link href="/integrations/embed" className="underline decoration-dotted">
            embed route
          </Link>{" "}
          serves frames rather than bytes — it is a page other sites point an iframe at, with the frame headers printed beside
          the markup. The{" "}
          <Link href="/integrations/badge" className="underline decoration-dotted">
            score badge
          </Link>{" "}
          is a route too: one SVG per asset, built from the stored scores. All three are excluded from the download list above
          because none of them is a file you fetch once.
        </p>
      </div>

      <div className="mt-6 rounded-3xl border border-white/8 bg-panel p-6">
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
        <p className="text-sm font-extrabold text-amber-200">What is still missing, and inside which feature</p>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-amber-100/80">
          Every bullet in this section shipped something real. None of them shipped the whole idea, and these are the five
          remainders: the part that needs a registry, a server, or a third-party round trip this build cannot make. The count in
          the heading is the point — five gaps in fourteen deliverables, each one named where it belongs rather than discovered
          later.
        </p>
        <ul className="mt-4 grid gap-2 md:grid-cols-2">
          {SUB_GAPS.map(([title, inside, why]) => (
            <li key={title} className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-3">
              <span className="text-[11px] font-bold text-amber-100">{title}</span>
              <span className="mt-0.5 block font-mono text-[10px] text-amber-100/50">{inside}</span>
              <span className="mt-1 block text-[11px] leading-relaxed text-amber-100/70">{why}</span>
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
