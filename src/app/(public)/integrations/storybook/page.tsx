import Link from "next/link";
import { exportFor } from "@/lib/exports";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/integrations/storybook" },
  title: "Storybook decorator",
  description: "A decorator that gives your stories this site's palette as custom properties, without shipping a stylesheet.",
};

export default function IntegrationsStorybookPage() {
  const entry = exportFor("motif-storybook-decorator.jsx")!;
  const code = entry.build();
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Export · {entry.item}</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          Your stories, <span className="text-gradient">this palette</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          A Storybook decorator that sets the site&apos;s tokens as custom properties around every story. Values are the same
          ones the tokens export carries — both read the stylesheet — so a token change moves the decorator too.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <a href="/api/exports/motif-storybook-decorator.jsx" className="btn btn-primary !px-4 !py-2 text-xs">
          Download the decorator
        </a>
        <Link href="/integrations/tokens" className="btn btn-ghost !px-4 !py-2 text-xs">
          The token file →
        </Link>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
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
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Why properties, not a stylesheet</p>
            <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
              A decorator can only promise what it can enforce. Setting custom properties gives a story the exact colours; it
              cannot give it this site&apos;s utility classes, because those live in a stylesheet that is not part of the export. So
              the decorator does the part it can do completely and the page says what is missing.
            </p>
          </div>
          <div className="rounded-3xl border border-dashed border-amber-300/25 bg-amber-300/[.04] p-6">
            <p className="text-sm font-extrabold text-amber-200">Not published to npm</p>
            <p className="mt-2 text-[11px] leading-relaxed text-amber-100/80">
              The file is served from this site, not from a registry. That means no version resolution, no lockfile entry and no
              way to know a copy you took six months ago still matches — so nothing here claims a package version. Downloading it
              again is the update mechanism, which is a real limitation of shipping a file instead of a package.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
