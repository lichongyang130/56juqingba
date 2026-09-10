import Link from "next/link";
import { COMPONENTS } from "@/lib/data";
import { EMBED_HEADERS } from "@/lib/cache-rules";

export const metadata = {
  title: "Framer-style code embed — Motif UI",
  description: "A real embed route that renders one demo, the markup that points at it, and the restriction a static build cannot enforce.",
};

export default function IntegrationsEmbedPage() {
  const example = COMPONENTS[0];
  const sizes = [
    { label: "Inline in a doc", width: "100%", height: 320 },
    { label: "Card in a sidebar", width: 360, height: 240 },
    { label: "Full-width hero", width: "100%", height: 420 },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Bridge · #427</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          A demo, <span className="text-gradient">framed anywhere</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          <span className="font-mono text-xs">/embed/&lt;slug&gt;</span> renders one demo with no chrome around it — no header, no
          footer, no navigation — so it can live inside another page. All {COMPONENTS.length} assets have one,
          prerendered at build time so a framed demo paints without waiting on a render — {COMPONENTS.length} extra pages in
          the build, which is a real cost and is reported on the build page rather than hidden. A new asset still gets its embed
          without a change to the route.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <a href={`/embed/${example.slug}`} className="btn btn-primary !px-4 !py-2 text-xs">
          Open an embed ({example.slug})
        </a>
        <Link href="/integrations" className="btn btn-ghost !px-4 !py-2 text-xs">
          ← All exports
        </Link>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/8 bg-panel p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">The markup</p>
            <pre className="mt-3 overflow-auto rounded-2xl border border-white/8 bg-[#07090f] p-4 font-mono text-[10px] leading-relaxed text-ink-dim">{sizes
              .map(
                (s) =>
                  `<!-- ${s.label} -->\n<iframe\n  src="https://<host>/embed/${example.slug}"\n  title="${example.title} — Motif UI"\n  width="${s.width}" height="${s.height}"\n  loading="lazy"\n  style="border:1px solid rgba(255,255,255,.08);border-radius:16px"\n></iframe>`
              )
              .join("\n\n")}</pre>
            <p className="mt-3 text-[11px] leading-relaxed text-ink-dim">
              The <span className="font-mono">title</span> matters: an untitled frame is announced as just &ldquo;frame&rdquo; by a
              screen reader. The embed page carries the same attribution link as the live demo, with{" "}
              <span className="font-mono">target=&quot;_top&quot;</span> so a click escapes the frame.
            </p>
          </div>
          <div className="rounded-3xl border border-white/8 bg-panel p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Headers the embed route sets</p>
            <ul className="mt-3 space-y-2">
              {EMBED_HEADERS[0].headers.map((h) => (
                <li key={h.key} className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5">
                  <span className="font-mono text-[10px] text-ink-dim">{h.key}</span>
                  <span className="mt-0.5 block font-mono text-[10px] text-ink-faint">{h.value}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">{EMBED_HEADERS[0].why}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/8 bg-panel p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Live frame</p>
            <iframe
              title={`${example.title} — embed example`}
              src={`/embed/${example.slug}`}
              className="mt-3 h-72 w-full rounded-2xl border border-white/8"
              loading="lazy"
            />
            <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">
              This is the real route, framed by this page exactly as a third-party page would frame it.
            </p>
          </div>
          <div className="rounded-3xl border border-dashed border-amber-300/25 bg-amber-300/[.04] p-6">
            <p className="text-sm font-extrabold text-amber-200">What a static build cannot enforce</p>
            <ul className="mt-2 space-y-2 text-[11px] leading-relaxed text-amber-100/80">
              <li>
                An allowlist of embedding sites. Restricting frames to partners means inspecting the Origin header on every
                request, which needs a server. Today anyone can frame any demo, and the page says so instead of implying a
                partner programme.
              </li>
              <li>
                Frame-busting protection. Related, and equally out of reach without a runtime.
              </li>
              <li>
                Per-site analytics. Nothing here counts embeds, so no page on this site claims an embed figure.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
