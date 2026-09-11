import Link from "next/link";
import { exportFor, tokenSet } from "@/lib/exports";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/integrations/single-file" },
  title: "Single-file HTML starter",
  description: "One self-contained page built from the tokens: no requests, no framework, no script.",
};

export default function IntegrationsSingleFilePage() {
  const entry = exportFor("single-file.html")!;
  const html = entry.build();
  const tokens = tokenSet();
  const externalRefs = [...html.matchAll(/\b(?:src|href)="(https?:\/\/[^"]+)"/g)].map((m) => m[1]);
  const scriptTags = (html.match(/<script/g) ?? []).length;

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Export · {entry.item}</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          One file, <span className="text-gradient">nothing to fetch</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          A self-contained starter page: {Object.keys(tokens.colors).length} colour tokens and{" "}
          {Object.keys(tokens.radii).length} radii written inline, {externalRefs.length} external references, {scriptTags}{" "}
          script tags. Save it, open it from disk, and it renders — which is the whole test of a single-file export.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <a href="/api/exports/single-file.html" className="btn btn-primary !px-4 !py-2 text-xs">
          Open the starter
        </a>
        <Link href="/integrations" className="btn btn-ghost !px-4 !py-2 text-xs">
          ← All exports
        </Link>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["File weight", `${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`, "including comments"],
          ["External requests", externalRefs.length, "checked in the output, not by eye"],
          ["Script tags", scriptTags, "the page is HTML and CSS only"],
          ["Tokens inlined", Object.keys(tokens.colors).length + Object.keys(tokens.radii).length, "colours plus radii"],
        ].map(([label, value, sub]) => (
          <div key={String(label)} className="rounded-3xl border border-white/8 bg-panel p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">{label}</p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums">{value}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-ink-dim">{sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">The file (first 58 lines)</p>
          <pre className="mt-3 max-h-[30rem] overflow-auto rounded-2xl border border-white/8 bg-[#07090f] p-4 font-mono text-[10px] leading-relaxed text-ink-dim">
            {html.split("\n").slice(0, 58).join("\n")}
          </pre>
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/8 bg-panel p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Live preview</p>
            <iframe
              title="Single-file starter preview"
              src="/api/exports/single-file.html"
              className="mt-3 h-72 w-full rounded-2xl border border-white/8 bg-[#07090f]"
              sandbox=""
              loading="lazy"
            />
            <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">
              Rendered in a sandboxed frame with script disabled, which is the honest way to preview a file whose promise is
              that it needs neither.
            </p>
          </div>
          <div className="rounded-3xl border border-dashed border-amber-300/25 bg-amber-300/[.04] p-6">
            <p className="text-sm font-extrabold text-amber-200">What it is not</p>
            <p className="mt-2 text-[11px] leading-relaxed text-amber-100/80">
              It is not a copy of any catalog demo. The demo implementations live in this site&apos;s code rather than in the
              catalog data, so a single-file export of one would have to be re-authored — and a re-authored copy that looks close
              is exactly how an export starts lying about what the product contains. This file carries the layout vocabulary the
              tokens support, and says so in its own footer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
