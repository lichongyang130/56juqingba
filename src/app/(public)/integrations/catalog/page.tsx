import Link from "next/link";
import { exportFor } from "@/lib/exports";
import { COMPONENTS, PROMPTS } from "@/lib/data";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/integrations/catalog" },
  title: "Catalog metadata export",
  description: "Every component and prompt with its stored scores, as data — and the field the catalog deliberately does not hold.",
};

export default function IntegrationsCatalogPage() {
  const entry = exportFor("catalog.json")!;
  const body = entry.build();
  const parsed = JSON.parse(body) as {
    components: { slug: string; license: string; a11yScore: number; qualityScore: number; bundleKb: number; kind: string }[];
    prompts: { slug: string; runs: number; models: string[] }[];
  };
  const mit = parsed.components.filter((c) => c.license === "MIT").length;
  const models = [...new Set(parsed.prompts.flatMap((p) => p.models))];
  const runs = parsed.prompts.reduce((a, p) => a + p.runs, 0);

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Export · {entry.item}</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          The catalog <span className="text-gradient">as data</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          {parsed.components.length} components and {parsed.prompts.length} prompts with the fields the site stores: kinds,
          stacks, licences ({mit} MIT), bundle sizes, audit and editorial scores, tags, versions — plus {runs} prompt runs
          across {models.length} models. This is the same object the pages render from, serialised.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <a href="/api/exports/catalog.json" className="btn btn-primary !px-4 !py-2 text-xs">
          Download catalog.json
        </a>
        <Link href="/integrations/tokens" className="btn btn-ghost !px-4 !py-2 text-xs">
          Design tokens →
        </Link>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Components", parsed.components.length, "with kind, stack, licence, size and scores"],
          ["Prompts", parsed.prompts.length, `with ${runs} runs and the models that produced them`],
          ["Score fields", 2, "a11y and editorial quality, per component"],
          ["Source code", 0, "not stored, so not exported"],
        ].map(([label, value, sub]) => (
          <div key={String(label)} className="rounded-3xl border border-white/8 bg-panel p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">{label}</p>
            <p className="mt-1 text-3xl font-extrabold tabular-nums">{value}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-ink-dim">{sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">
            First 32 lines of the file ({(Buffer.byteLength(body) / 1024).toFixed(1)} KB total)
          </p>
          <pre className="mt-3 max-h-[26rem] overflow-auto rounded-2xl border border-white/8 bg-[#07090f] p-4 font-mono text-[10px] leading-relaxed text-ink-dim">
            {body.split("\n").slice(0, 32).join("\n")}
          </pre>
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/8 bg-panel p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Why a metadata export at all</p>
            <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
              Because the alternative is scraping. Every score on this site is already published per asset; a JSON endpoint makes
              it checkable in a diff instead of in a screenshot. The prompt side carries the run counts and the model names,
              which is what a claim like &ldquo;tested on three models&rdquo; is worth without the log beside it.
            </p>
          </div>
          <div className="rounded-3xl border border-dashed border-amber-300/25 bg-amber-300/[.04] p-6">
            <p className="text-sm font-extrabold text-amber-200">The field that is not there</p>
            <p className="mt-2 text-[11px] leading-relaxed text-amber-100/80">
              Component source. The catalog holds a demo key for each asset, not its implementation, so this export cannot contain
              code — and the {COMPONENTS.length} components it lists would look complete without that gap being stated. The copy
              button on an asset page is where source lives, one asset at a time.
            </p>
            <p className="mt-3 text-[10px] leading-relaxed text-amber-100/60">
              {PROMPTS.length} prompts, {parsed.prompts.filter((p) => p.runs === 0).length} of them without a single run, are
              listed exactly as the data has them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
