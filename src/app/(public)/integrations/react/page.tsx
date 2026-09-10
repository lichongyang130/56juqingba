import Link from "next/link";
import { exportFor, tokenSet } from "@/lib/exports";

export const metadata = {
  title: "React package scaffold — Motif UI",
  description: "The one component an npm package could honestly ship today, and the layout it would publish.",
};

export default function IntegrationsReactPage() {
  const entry = exportFor("motif-react-wrapper.jsx")!;
  const code = entry.build();
  const tokens = tokenSet();
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Export · {entry.item}</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          A package that <span className="text-gradient">does not overreach</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          A React package could ship one honest thing today: a provider that puts the {Object.keys(tokens.colors).length} colour
          tokens on a subtree as custom properties. It cannot ship the catalog components, because their source is not stored
          anywhere this export can read — so the provider wraps your markup in the palette and stops there.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <a href="/api/exports/motif-react-wrapper.jsx" className="btn btn-primary !px-4 !py-2 text-xs">
          Download the provider
        </a>
        <Link href="/integrations/tailwind" className="btn btn-ghost !px-4 !py-2 text-xs">
          The Tailwind preset →
        </Link>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">
            The file ({(Buffer.byteLength(code) / 1024).toFixed(1)} KB, complete)
          </p>
          <pre className="mt-3 max-h-[30rem] overflow-auto rounded-2xl border border-white/8 bg-[#07090f] p-4 font-mono text-[10px] leading-relaxed text-ink-dim">
            {code}
          </pre>
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/8 bg-panel p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">The package layout it implies</p>
            <pre className="mt-3 overflow-x-auto rounded-2xl border border-white/8 bg-[#07090f] p-4 font-mono text-[10px] leading-relaxed text-ink-dim">{`motif-tokens/
├─ package.json     name, version, peerDependencies: react >= 18
├─ index.js         the provider above
├─ tokens.json      the DTCG file from /api/exports/tokens.json
└─ README.md        what it does, and the three things it does not`}</pre>
            <p className="mt-3 text-[11px] leading-relaxed text-ink-dim">
              Nothing here is inside a component that pretends to be one of the catalog&apos;s 107. A wrapper that rendered a
              &ldquo;button&rdquo; this site never authored would make the package look bigger than the product.
            </p>
          </div>
          <div className="rounded-3xl border border-dashed border-amber-300/25 bg-amber-300/[.04] p-6">
            <p className="text-sm font-extrabold text-amber-200">Not published, and why that matters</p>
            <ul className="mt-2 space-y-2 text-[11px] leading-relaxed text-amber-100/80">
              <li>
                There is no registry entry, so <span className="font-mono">npm install motif-tokens</span> installs nothing. The
                page will not print a command that fails.
              </li>
              <li>
                No version resolution means no lockfile: a copy you take today is the copy you have. Re-downloading is the update
                mechanism.
              </li>
              <li>
                Peer dependency ranges, licence files and a changelog are the work of publishing, not of exporting — they are
                listed here as the gap rather than approximated.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
