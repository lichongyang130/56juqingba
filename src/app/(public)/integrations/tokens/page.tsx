import Link from "next/link";
import { EXPORTS, exportFor, tokenSet } from "@/lib/exports";

export const metadata = {
  title: "Design tokens export — Motif UI",
  description: "The site's tokens as a W3C design-token file, parsed from the stylesheet it compiles.",
};

export default function IntegrationsTokensPage() {
  const entry = exportFor("tokens.json")!;
  const body = entry.build();
  const tokens = tokenSet();
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Export · {entry.item}</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          Tokens, <span className="text-gradient">read from the stylesheet</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          {Object.keys(tokens.colors).length} colours, {Object.keys(tokens.radii).length} radii and{" "}
          {Object.keys(tokens.fonts).length} font stacks, parsed out of the <span className="font-mono text-xs">@theme</span>{" "}
          block this site compiles. Values are passed through unmodified — an export that normalises hex to HSL is an export you
          cannot diff against the source.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <a href="/api/exports/tokens.json" className="btn btn-primary !px-4 !py-2 text-xs">
          Download tokens.json
        </a>
        <Link href="/integrations" className="btn btn-ghost !px-4 !py-2 text-xs">
          ← All exports
        </Link>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">The colours, as shipped</p>
          <ul className="mt-3 space-y-1.5">
            {Object.entries(tokens.colors).map(([name, value]) => (
              <li key={name} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[.02] px-3 py-2">
                <span
                  className="h-4 w-4 shrink-0 rounded border border-white/20"
                  style={{ background: value }}
                  aria-hidden
                />
                <span className="font-mono text-[10px] text-ink-dim">--color-{name}</span>
                <span className="ml-auto font-mono text-[10px] text-ink-faint">{value}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">
            The file this endpoint returns ({(Buffer.byteLength(body) / 1024).toFixed(1)} KB, first 60 lines)
          </p>
          <pre className="mt-3 max-h-[28rem] overflow-auto rounded-2xl border border-white/8 bg-[#07090f] p-4 font-mono text-[10px] leading-relaxed text-ink-dim">
            {body.split("\n").slice(0, 60).join("\n")}
          </pre>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">What the format commits to</p>
          <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
            The W3C design-token format uses <span className="font-mono">$type</span> and{" "}
            <span className="font-mono">$value</span> keys, which is what Figma, Style Dictionary and Tokens Studio read. A
            colour is a colour, a radius is a dimension, and a font stack is an array — the shapes the standard defines, not a
            shape of our choosing.
          </p>
        </div>
        <div className="rounded-3xl border border-dashed border-amber-300/25 bg-amber-300/[.04] p-6">
          <p className="text-sm font-extrabold text-amber-200">What it does not include</p>
          <p className="mt-2 text-[11px] leading-relaxed text-amber-100/80">
            Component-level tokens. The catalog stores each component&apos;s metadata and its demo key, not its source, so a
            component&apos;s private variables are not in the file — exporting them would mean inventing them. The five exports
            that do exist are listed on{" "}
            <Link href="/integrations" className="underline decoration-dotted">
              the integrations page
            </Link>
            , alongside the bridges that are deliberately missing.
          </p>
        </div>
      </div>

      <p className="mt-8 text-[10px] leading-relaxed text-ink-faint">
        {EXPORTS.length} exports are live in this build. The endpoint is a plain route handler, so it reports what the code
        computes and carries a five-minute shared cache rather than a build artefact nobody re-checks.
      </p>
    </div>
  );
}
