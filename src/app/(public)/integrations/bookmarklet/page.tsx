import Link from "next/link";
import { BookmarkletInstall } from "@/components/bookmarklet-install";
import { exportFor } from "@/lib/exports";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/integrations/bookmarklet" },
  title: "Palette bookmarklet",
  description: "Drag one link to your bookmarks bar to read any page's colour custom properties, without sending anything anywhere.",
};

export default function IntegrationsBookmarkletPage() {
  const entry = exportFor("motif-bookmarklet.js")!;
  const code = entry.build();

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Bridge · {entry.item}</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          Any page&apos;s palette, <span className="text-gradient">in one click</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          Drag the button below to your bookmarks bar. On any page you then visit, it reads the colour custom properties that
          page defines — from stylesheets and inline styles — and draws a panel where every swatch copies its own declaration.
          Nothing about the page you are on leaves your browser: the script makes no request after loading its own file.
        </p>
      </div>

      <div className="mt-8">
        <BookmarkletInstall scriptUrl="/api/exports/motif-bookmarklet.js" />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/8 bg-panel p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">How it works</p>
            <ol className="mt-3 space-y-2 text-[11px] leading-relaxed text-ink-dim">
              <li className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5">
                The bookmark is a <span className="font-mono">javascript:</span> URL that appends one{" "}
                <span className="font-mono">&lt;script&gt;</span> tag pointing at this site, and nothing else.
              </li>
              <li className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5">
                The script walks the page&apos;s stylesheets for <span className="font-mono">--*</span> names whose values look
                like colours, plus inline styles, and de-duplicates them by name.
              </li>
              <li className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5">
                Clicking a swatch copies <span className="font-mono">--name: value;</span> in the same form the stylesheet uses.
              </li>
            </ol>
          </div>
          <div className="rounded-3xl border border-dashed border-amber-300/25 bg-amber-300/[.04] p-6">
            <p className="text-sm font-extrabold text-amber-200">What it cannot do</p>
            <ul className="mt-2 space-y-2 text-[11px] leading-relaxed text-amber-100/80">
              <li>
                Read cross-origin stylesheets. A page loading a CDN stylesheet exposes no rules to it, so tokens defined there
                are invisible — the panel says &ldquo;no colour custom properties found&rdquo; rather than pretending the page
                has none.
              </li>
              <li>
                Copy on pages with a strict clipboard policy. The button then reports that the clipboard was blocked, which is
                the honest failure.
              </li>
              <li>
                Save anything. There is no account, no storage and no server-side record of what pages you ran it on.
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
            Served from <span className="font-mono">/api/exports/motif-bookmarklet.js</span>, so the bookmark always runs the
            version this site currently serves. There is no version pinning, which is the same trade the other exports make.
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link href="/integrations" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          ← All exports
        </Link>
        <Link href="/integrations/cli" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          The CLI →
        </Link>
      </div>
    </div>
  );
}
