import Link from "next/link";
import { exportFor } from "@/lib/exports";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/integrations/cli" },
  title: "CLI — Motif UI",
  description: "A runnable command that reads this deployment's own export endpoints, and why it is not on npm.",
};

export default function IntegrationsCliPage() {
  const entry = exportFor("motif-cli.mjs")!;
  const code = entry.build();
  const commands = [
    { cmd: "node motif-cli.mjs list", note: "every component with kind, size and both scores" },
    { cmd: "node motif-cli.mjs list --kind animated", note: "the same table filtered by the kind field" },
    { cmd: "node motif-cli.mjs tokens", note: "tokens as CSS custom properties" },
    { cmd: "node motif-cli.mjs tokens --format json", note: "the DTCG file, verbatim" },
    { cmd: "node motif-cli.mjs badge tilt-card", note: "Markdown for that asset's badge" },
    { cmd: "node motif-cli.mjs --help", note: "the usage text below" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Bridge · {entry.item}</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          A command that <span className="text-gradient">actually runs</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          The intended CLI is a small script that reads the same JSON endpoints the integration pages print. Because it is a
          script rather than a package, the honest version is the file: download it, run it with Node, and point{" "}
          <span className="font-mono text-xs">--base</span> at any deployment.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <a href="/api/exports/motif-cli.mjs" className="btn btn-primary !px-4 !py-2 text-xs">
          Download motif-cli.mjs
        </a>
        <Link href="/integrations/catalog" className="btn btn-ghost !px-4 !py-2 text-xs">
          The catalog endpoint it reads →
        </Link>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/8 bg-panel p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Commands</p>
            <ul className="mt-3 space-y-1.5">
              {commands.map((c) => (
                <li key={c.cmd} className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5">
                  <span className="block font-mono text-[10px] text-ink-dim">{c.cmd}</span>
                  <span className="mt-0.5 block text-[11px] leading-relaxed text-ink-faint">{c.note}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-dashed border-amber-300/25 bg-amber-300/[.04] p-6">
            <p className="text-sm font-extrabold text-amber-200">Not on npm — say it plainly</p>
            <ul className="mt-2 space-y-2 text-[11px] leading-relaxed text-amber-100/80">
              <li>
                <span className="font-mono">npx motif add tilt-card</span> installs nothing, because there is no registry entry.
                The page documents what that command would do rather than printing it as if it works.
              </li>
              <li>
                &ldquo;Add&rdquo; itself needs something to add: the catalog stores metadata, not component source, so the most a
                real command could do today is write the token file or print a badge.
              </li>
              <li>
                The script needs network access to the deployment it points at, and it says which URL it read when a request
                fails, rather than exiting silently.
              </li>
            </ul>
          </div>
        </div>
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">
            The script ({(Buffer.byteLength(code) / 1024).toFixed(1)} KB, complete)
          </p>
          <pre className="mt-3 max-h-[34rem] overflow-auto rounded-2xl border border-white/8 bg-[#07090f] p-4 font-mono text-[10px] leading-relaxed text-ink-dim">
            {code}
          </pre>
          <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
            It uses <span className="font-mono">fetch</span> and <span className="font-mono">process.argv</span> only — no
            dependencies, so there is nothing to install before running it.
          </p>
        </div>
      </div>
    </div>
  );
}
