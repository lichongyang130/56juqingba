import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  // 519 — the page had no canonical, so the sitemap walk could not tell it
  // apart from a page pointing at the homepage.
  alternates: { canonical: "/roadmap/embed" },
  title: "Embed SDK — one script tag",
  description:
    "A 1 KB script with one job: turn a placeholder div into a live Motif demo. No dependencies, no analytics, no backlink injection — and the page below runs it.",
};

// The live demo on this page uses the real script. It is the SDK's own test:
// the placeholder in the SSR HTML is a link, and the script replaces it with an
// iframe in the browser.

export default function EmbedSdkPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
      <script src="/embed.js" defer />

      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <Link href="/roadmap" className="hover:text-ink">
          Roadmap
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Embed SDK</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Bet 06 · live</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">One tag, one job</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          Two lines of HTML put a working Motif demo on any page. The script is ~1 KB, has no dependencies, and does exactly one thing: replace each
          placeholder with the embed iframe. It does not count visitors, does not add a backlink, and does not expose anything beyond a{" "}
          <span className="font-mono">window.MotifEmbed.scan()</span> for nodes added later.
        </p>
      </div>

      <section className="mt-8 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">The whole integration</h2>
        <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/8 bg-black/35 p-4 font-mono text-[10.5px] leading-relaxed text-emerald-200/90">
{`<script src="https://motifui.dev/embed.js" defer></script>
<div data-motif-embed="halo-button" data-height="280"></div>`}
        </pre>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-dim">
          Optional attributes: <span className="font-mono">data-height</span> (default 320) and{" "}
          <span className="font-mono">data-title</span> for the iframe&apos;s accessible name, which defaults to{" "}
          &ldquo;Motif UI embed: &lt;slug&gt;&rdquo;.
        </p>
      </section>

      <section className="mt-6 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">Live, on this page</h2>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-dim">
          Below is the real placeholder, rendered by the real script. With JavaScript disabled you get a link through to the same demo instead of an
          empty box — the placeholder starts life as a link for exactly that reason.
        </p>
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/8 bg-black/25">
          <div data-motif-embed="halo-button" data-height="280" data-title="Motif UI embed: halo-button">
            <Link href="/embed/halo-button" className="block p-6 text-center text-[11px] text-violet-300 underline">
              The embed script would put a live Halo Button demo here — open it directly →
            </Link>
          </div>
        </div>
        <p className="mt-3 font-mono text-[10px] text-ink-faint">
          src=&quot;/embed.js&quot; · iframe target /embed/halo-button · frame-ancestors * (declared on the embed route)
        </p>
      </section>

      <section className="mt-6 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">For framework users</h2>
        <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
          The placeholder is a normal element, so it works inside React, Vue or plain HTML. Mount it after a route change and call{" "}
          <span className="font-mono">window.MotifEmbed.scan()</span>; already-mounted nodes are skipped via a{" "}
          <span className="font-mono">data-motif-mounted</span> flag, so calling it twice does not create two iframes.
        </p>
        <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">
          The script is served with <span className="font-mono">cache-control: public, max-age=3600</span> and an{" "}
          <span className="font-mono">x-sdk-version: 1</span> header. The attribute name is treated as permanent: new options arrive as new
          attributes rather than as a version change.
        </p>
      </section>
    </div>
  );
}
