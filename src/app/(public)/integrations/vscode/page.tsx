import Link from "next/link";
import { exportFor } from "@/lib/exports";
import { COMPONENTS } from "@/lib/data";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/integrations/vscode" },
  title: "VS Code snippet pack — Motif UI",
  description: "Five editor snippets for the layout patterns this site repeats, using its real utility classes.",
};

export default function IntegrationsVscodePage() {
  const entry = exportFor("motif.code-snippets")!;
  const body = entry.build();
  const snippets = JSON.parse(body) as Record<string, { prefix: string; body: string[]; description: string }>;
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Export · {entry.item}</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          The layout, <span className="text-gradient">in your editor</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          {Object.keys(snippets).length} snippets for the patterns this site repeats — a panel, a chip row, the two button
          weights, a gradient headline and a stat row. Each uses the real utility classes the stylesheet defines, so a snippet
          pasted into a project that loads the preset renders as it does here.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <a href="/api/exports/motif.code-snippets" className="btn btn-primary !px-4 !py-2 text-xs">
          Download motif.code-snippets
        </a>
        <Link href="/integrations/tailwind" className="btn btn-ghost !px-4 !py-2 text-xs">
          The preset they assume →
        </Link>
      </div>

      <div className="mt-8 grid gap-3">
        {Object.entries(snippets).map(([name, s]) => (
          <div key={name} className="grid gap-4 rounded-3xl border border-white/8 bg-panel p-5 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-bold">{name}</p>
                <span className="chip !text-[10px] font-mono">{s.prefix}</span>
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-ink-dim">{s.description}</p>
              <p className="mt-2 font-mono text-[10px] text-ink-faint">
                {s.body.length} lines · {s.body.join("").length} chars
              </p>
            </div>
            <pre className="overflow-auto rounded-2xl border border-white/8 bg-[#07090f] p-4 font-mono text-[10px] leading-relaxed text-ink-dim">
              {s.body.join("\n")}
            </pre>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Install</p>
          <pre className="mt-3 overflow-x-auto rounded-2xl border border-white/8 bg-[#07090f] p-4 font-mono text-[10px] leading-relaxed text-ink-dim">{`# macOS / Linux
curl -o ~/Library/Application\\ Support/Code/User/snippets/motif.code-snippets \\
  https://<host>/api/exports/motif.code-snippets

# then type mf-panel, mf-chips, mf-buttons, mf-headline or mf-stats`}</pre>
        </div>
        <div className="rounded-3xl border border-dashed border-amber-300/25 bg-amber-300/[.04] p-6">
          <p className="text-sm font-extrabold text-amber-200">What is not in the pack</p>
          <p className="mt-2 text-[11px] leading-relaxed text-amber-100/80">
            Snippets for the {COMPONENTS.length} catalog components. Each asset&apos;s implementation lives in this site&apos;s demo module rather
            than in the catalog data, so an editor snippet could only reproduce a simplified version of it — which is exactly the
            kind of export that makes a library feel bigger than it is. The pack covers the layout vocabulary; the components
            themselves are on the{" "}
            <Link href="/components" className="underline decoration-dotted">
              library pages
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
