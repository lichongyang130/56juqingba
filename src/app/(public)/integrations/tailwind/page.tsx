import Link from "next/link";
import { exportFor, tokenSet } from "@/lib/exports";

export const metadata = {
  title: "Tailwind preset export — Motif UI",
  description: "A CommonJS Tailwind preset built from the tokens this site compiles, with what it deliberately leaves out.",
};

export default function IntegrationsTailwindPage() {
  const entry = exportFor("motif-preset.cjs")!;
  const body = entry.build();
  const t = tokenSet();
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Export · {entry.item}</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          One preset, <span className="text-gradient">the same tokens</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          The colours, radii and font stacks this site uses, as a Tailwind preset you can drop into a project. It is generated
          from the same stylesheet the pages compile, so a token change moves both.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <a href="/api/exports/motif-preset.cjs" className="btn btn-primary !px-4 !py-2 text-xs">
          Download motif-preset.cjs
        </a>
        <Link href="/integrations" className="btn btn-ghost !px-4 !py-2 text-xs">
          ← All exports
        </Link>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/8 bg-panel p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Three steps</p>
            <pre className="mt-3 overflow-x-auto rounded-2xl border border-white/8 bg-[#07090f] p-4 font-mono text-[10px] leading-relaxed text-ink-dim">{`curl -o motif-preset.cjs \\
  https://<host>/api/exports/motif-preset.cjs

// tailwind.config.js
const motif = require("./motif-preset.cjs");
module.exports = { presets: [motif], content: ["./src/**/*.{ts,tsx}"] };`}</pre>
            <p className="mt-3 text-[11px] leading-relaxed text-ink-dim">
              Then <span className="font-mono">bg-panel</span>, <span className="font-mono">text-ink-dim</span> and{" "}
              <span className="font-mono">rounded-lg</span> resolve to {Object.keys(t.colors).length} colours and{" "}
              {Object.keys(t.radii).length} radii that match this site exactly.
            </p>
          </div>
          <div className="rounded-3xl border border-dashed border-amber-300/25 bg-amber-300/[.04] p-6">
            <p className="text-sm font-extrabold text-amber-200">What a token preset cannot carry</p>
            <p className="mt-2 text-[11px] leading-relaxed text-amber-100/80">
              The component classes — <span className="font-mono">.chip</span>, <span className="font-mono">.btn</span>,{" "}
              <span className="font-mono">.card-hover</span> — live in this site&apos;s stylesheet, and the catalog stores component
              metadata rather than source. Shipping them inside a preset would mean shipping a stylesheet and calling it a
              preset. If you want the classes, copy them from the stylesheet; if you want the tokens, this file is exact.
            </p>
          </div>
        </div>
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">
            The file ({(Buffer.byteLength(body) / 1024).toFixed(1)} KB, complete)
          </p>
          <pre className="mt-3 max-h-[36rem] overflow-auto rounded-2xl border border-white/8 bg-[#07090f] p-4 font-mono text-[10px] leading-relaxed text-ink-dim">
            {body}
          </pre>
        </div>
      </div>
    </div>
  );
}
