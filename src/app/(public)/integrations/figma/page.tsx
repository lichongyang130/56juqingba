import Link from "next/link";
import { figmaVariables } from "@/lib/exports";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/integrations/figma" },
  title: "Figma variable sync — Motif UI",
  description: "The token set as Figma colour and number variables, with the values it cannot hold named rather than coerced.",
};

export default function IntegrationsFigmaPage() {
  const { json, skipped } = figmaVariables();
  const parsed = JSON.parse(json) as { collections: { name: string; modes: { name: string }[]; variables: { name: string; resolvedType: string; valuesByMode: Record<string, unknown> }[] }[] };
  const collection = parsed.collections[0];
  const colors = collection.variables.filter((v) => v.resolvedType === "COLOR");
  const numbers = collection.variables.filter((v) => v.resolvedType === "FLOAT");

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Bridge · #417</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          Tokens as <span className="text-gradient">Figma variables</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          Figma reads variables in a specific shape: one collection, one mode, colours as 0–1 RGBA channels and dimensions as
          numbers. This endpoint builds that shape from the same token parse the other exports use — {colors.length} colour
          variables and {numbers.length} number variables, in a collection called &ldquo;{collection.name}&rdquo; with a single{" "}
          {collection.modes[0].name} mode.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <a href="/api/exports/figma-variables.json" className="btn btn-primary !px-4 !py-2 text-xs">
          Download figma-variables.json
        </a>
        <Link href="/integrations/tokens" className="btn btn-ghost !px-4 !py-2 text-xs">
          The raw tokens →
        </Link>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">The variables in the payload</p>
          <ul className="mt-3 space-y-1.5">
            {collection.variables.map((v) => (
              <li key={v.name} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[.02] px-3 py-2">
                <span className="font-mono text-[10px] text-ink-dim">{v.name}</span>
                <span className="chip !text-[9px]">{v.resolvedType === "COLOR" ? "colour" : "number"}</span>
                <span className="ml-auto truncate font-mono text-[10px] text-ink-faint">
                  {JSON.stringify(v.valuesByMode[collection.modes[0].name])}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/8 bg-panel p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">The file ({(Buffer.byteLength(json) / 1024).toFixed(1)} KB, first 30 lines)</p>
            <pre className="mt-3 max-h-[22rem] overflow-auto rounded-2xl border border-white/8 bg-[#07090f] p-4 font-mono text-[10px] leading-relaxed text-ink-dim">
              {json.split("\n").slice(0, 30).join("\n")}
            </pre>
          </div>
          <div className="rounded-3xl border border-dashed border-amber-300/25 bg-amber-300/[.04] p-6">
            <p className="text-sm font-extrabold text-amber-200">What was left out, and why</p>
            {skipped.length > 0 ? (
              <>
                <p className="mt-2 text-[11px] leading-relaxed text-amber-100/80">
                  {skipped.length} token{skipped.length === 1 ? "" : "s"} could not be represented and{" "}
                  {skipped.length === 1 ? "was" : "were"} skipped rather than coerced:
                </p>
                <p className="mt-1 font-mono text-[10px] text-amber-100/70">{skipped.join(", ")}</p>
              </>
            ) : (
              <p className="mt-2 text-[11px] leading-relaxed text-amber-100/80">
                Nothing was skipped in this build: every colour parsed as a hex or rgba value and every radius parsed as a
                number. When one does not — a token that is a gradient, say — it will be listed here instead of being turned into
                a guessed colour.
              </p>
            )}
            <p className="mt-3 text-[10px] leading-relaxed text-amber-100/60">
              Font stacks are absent by design: Figma&apos;s variable types are colour, number, string and boolean, and a font
              stack is none of those in a form Figma would apply. The tokens file carries them as arrays instead.
            </p>
          </div>
        </div>
      </div>

      <p className="mt-10 text-[10px] leading-relaxed text-ink-faint">
        The import itself is manual — Figma has no public endpoint a static site can push to, and this page will not pretend
        otherwise. What it can do is guarantee that the file is built from the same values the site renders with, and that
        anything unrepresentable is reported in the panel above rather than quietly dropped.
      </p>
    </div>
  );
}
