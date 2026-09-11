import Link from "next/link";
import { exportFor } from "@/lib/exports";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/integrations/codesandbox" },
  title: "CodeSandbox export — Motif UI",
  description: "Three files that make a sandbox project, and the one-click deep link this build cannot honestly promise.",
};

export default function IntegrationsCodesandboxPage() {
  const entry = exportFor("codesandbox-files.json")!;
  const body = entry.build();
  const files = (JSON.parse(body) as { files: Record<string, string> }).files;
  const names = Object.keys(files);

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Export · {entry.item}</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          Sandbox files, <span className="text-gradient">not a magic link</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          The export is {names.length} real files — {names.join(", ")} — that make a working static sandbox. Paste them into a
          new sandbox and the tokens run. The usual one-click version is a link with compressed parameters, and the note below
          explains why this build ships files instead.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <a href="/api/exports/codesandbox-files.json" className="btn btn-primary !px-4 !py-2 text-xs">
          Download codesandbox-files.json
        </a>
        <Link href="/integrations/single-file" className="btn btn-ghost !px-4 !py-2 text-xs">
          Single-file starter →
        </Link>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.15fr]">
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/8 bg-panel p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Opening it</p>
            <ol className="mt-3 space-y-2 text-[11px] leading-relaxed text-ink-dim">
              <li className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5">
                <span className="font-bold text-ink">1.</span> Create a new static sandbox.
              </li>
              <li className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5">
                <span className="font-bold text-ink">2.</span> Replace the files with the {names.length} below, keeping their
                names.
              </li>
              <li className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5">
                <span className="font-bold text-ink">3.</span> The preview renders from <span className="font-mono">index.html</span>;
                edit a token and it follows.
              </li>
            </ol>
          </div>
          <div className="rounded-3xl border border-dashed border-amber-300/25 bg-amber-300/[.04] p-6">
            <p className="text-sm font-extrabold text-amber-200">Why there is no one-click link</p>
            <ul className="mt-2 space-y-2 text-[11px] leading-relaxed text-amber-100/80">
              <li>
                A define link encodes the whole project into the URL with the <span className="font-mono">lz-string</span>{" "}
                compression a third party maintains. This build cannot fetch that service to check its own output, so it will not
                print a link that might open nothing.
              </li>
              <li>
                An unverified link is worse than no link here: it looks like the feature works until the moment a reader clicks
                it. The file set works the moment it is pasted.
              </li>
              <li>
                If the compressor were vendored in, the page would need the same scrutiny as the cache rules — one module, one
                output, printed where it is documented.
              </li>
            </ul>
          </div>
        </div>
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">
            The bundle ({(Buffer.byteLength(body) / 1024).toFixed(1)} KB)
          </p>
          <div className="mt-3 space-y-3">
            {names.map((n) => (
              <details key={n} className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5">
                <summary className="cursor-pointer font-mono text-[10px] text-ink-dim">
                  {n} · {(Buffer.byteLength(files[n]) / 1024).toFixed(1)} KB
                </summary>
                <pre className="mt-2 max-h-64 overflow-auto rounded-xl border border-white/8 bg-[#07090f] p-3 font-mono text-[10px] leading-relaxed text-ink-dim">
                  {files[n]}
                </pre>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
