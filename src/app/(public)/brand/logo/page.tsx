import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/brand/logo" },
  title: "Logo system",
  description:
    "The Motif mark: geometry, clear space, sizes, wordmark pairing, misuse examples and the SVG source. Original, and printed here so it can be checked rather than trusted.",
};

// The mark itself. The canonical copy is LogoMark in src/components/chrome.tsx
// (the header); this page redraws the same geometry at six sizes plus the
// misuse cases, under its own gradient id so the document has one id per
// gradient. Two files drawing "the same" logo is how a brand drifts, so a
// harness check compares the geometry tokens in both.
//
// chrome.tsx geometry, verbatim: frame 1.5,1.5 29x29 r9; dots 6x6 r2 at
// (7,7) and (19,19) full, (19,7) and (7,19) at 0.55; gradient
// #8b5cf6 → #6366f1 at 0.55 → #22d3ee on the diagonal.

function Mark({ size = 32, tone = "gradient", id = "logo-mark" }: { size?: number; tone?: "gradient" | "ink" | "dim"; id?: string }) {
  // #507 — one gradient id per drawing. This page renders the mark a dozen
  // times; sharing one id made every copy after the first a duplicate.
  const paint = tone === "gradient" ? `url(#${id})` : tone === "ink" ? "#e8e9f2" : "#6b7085";
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#8b5cf6" />
          <stop offset="0.55" stopColor="#6366f1" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="29" height="29" rx="9" stroke={paint} strokeWidth="2" />
      <rect x="7" y="7" width="6" height="6" rx="2" fill={paint} />
      <rect x="19" y="7" width="6" height="6" rx="2" fill={paint} opacity="0.55" />
      <rect x="7" y="19" width="6" height="6" rx="2" fill={paint} opacity="0.55" />
      <rect x="19" y="19" width="6" height="6" rx="2" fill={paint} />
    </svg>
  );
}

const SIZES = [16, 24, 32, 48, 64, 96];

export default function LogoSystemPage() {
  const misuse = [
    { label: "Stretched", why: "A squashed mark reads as a mistake at 16px, which is most of the places it appears.", style: { transform: "scaleX(1.6)" } },
    { label: "Rotated", why: "The rounded square is a container; tilting it turns a frame into a sticker.", style: { transform: "rotate(-14deg)" } },
    { label: "Recoloured", why: "The gradient is the identity. Pick one stop for a single-colour use instead of inventing a new hue.", style: { filter: "hue-rotate(140deg) saturate(2)" } },
    { label: "Shadowed", why: "A drop shadow implies depth the mark does not have; on a dark ground it just looks dirty.", style: { filter: "drop-shadow(4px 6px 6px rgba(0,0,0,.9))" } },
    { label: "Re-typed", why: "The dots are geometry, not punctuation — · · and .. are different marks.", style: {} },
  ];

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Brand</span>
        <span>/</span>
        <span className="text-ink-dim">Logo</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Brand · the mark</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Motif, drawn once</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          A rounded square holding four dots: the diagonal pair at full strength, the off-diagonal pair at 55%, running along a
          violet-indigo-cyan gradient. It is drawn in the header component and redrawn on this page from the same geometry — a harness check compares
          the coordinates in both files, because a logo that exists in two versions is a logo that will drift.
        </p>
      </div>

      <section className="mt-10 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">Sizes</h2>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-dim">
          The dots are 6 units in a 32-unit box, so at 24px they are 4.5px and start to blur. That is the floor for the full mark; under it, use
          the frame alone or the wordmark.
        </p>
        <div className="mt-5 flex flex-wrap items-end gap-6">
          {SIZES.map((s) => (
            <div key={s} className="text-center">
              <Mark size={s} id={`logo-${s}`} />
              <p className="mt-2 font-mono text-[10px] text-ink-faint">{s}px</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-white/8 pt-5">
          <Mark size={32} tone="ink" id="logo-ink" />
          <Mark size={32} tone="dim" id="logo-dim" />
          <span className="text-[11px] leading-relaxed text-ink-dim">
            Single-colour renderings, for print and for anywhere the gradient would fight the background — same geometry, one paint. The dim tone
            is what a disabled or decorative use looks like; neither is a second logo.
          </span>
        </div>
      </section>

      <section className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <h2 className="text-sm font-extrabold tracking-tight">Clear space</h2>
          <p className="mt-1.5 text-[11px] leading-relaxed text-ink-dim">
            Minimum clear space is one dot — 6 units, 18.75% of the mark — on every side. The dashed box below is that boundary at 96px — a
            number a designer can measure rather than eyeball.
          </p>
          <div className="mt-4 flex justify-center">
            <div className="relative rounded-2xl border border-dashed border-violet-300/40 p-[18px]">
              <Mark size={96} id="logo-clearspace" />
            </div>
          </div>
          <p className="mt-3 text-center font-mono text-[10px] text-ink-faint">18px of clear space at 96px</p>
        </div>

        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <h2 className="text-sm font-extrabold tracking-tight">Wordmark pairing</h2>
          <p className="mt-1.5 text-[11px] leading-relaxed text-ink-dim">
            The wordmark is set in the display face, weight 800, tracking slightly tight — the same treatment the header uses for navigation. The
            mark sits 10px from the wordmark at 28px, vertically centred on the x-height rather than the box.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <Mark size={28} id="logo-wordmark" />
            <span className="font-display text-2xl font-extrabold tracking-tight">Motif UI</span>
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
            Sentence case, never all caps. &ldquo;Motif UI&rdquo; is the full name; &ldquo;Motif&rdquo; alone is fine in body copy once the
            first mention has been spelled out.
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">Misuse</h2>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-dim">
          Five things the mark must never do, rendered rather than described — a rule with a picture next to it is a rule people follow.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {misuse.map((m) => (
            <div key={m.label} className="rounded-2xl border border-rose-300/20 bg-rose-400/[.04] p-3">
              <div className="grid h-16 place-items-center overflow-hidden rounded-xl bg-black/25">
                {m.label === "Re-typed" ? (
                  <span className="font-display text-2xl font-extrabold">M..</span>
                ) : (
                  <span style={m.style}>
                    <Mark size={40} id={`logo-misuse-${m.label.toLowerCase()}`} />
                  </span>
                )}
              </div>
              <p className="mt-2 text-[11px] font-bold text-rose-200">{m.label}</p>
              <p className="mt-1 text-[10px] leading-relaxed text-ink-faint">{m.why}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">The source, verbatim</h2>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-dim">
          Copy this rather than redrawing the mark: the geometry is the identity.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/8 bg-black/35 p-4 font-mono text-[10.5px] leading-relaxed text-violet-200/90">
{`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
  <defs>
    <linearGradient id="logo" x1="0" y1="0" x2="32" y2="32">
      <stop stopColor="#8b5cf6" />
      <stop offset="0.55" stopColor="#6366f1" />
      <stop offset="1" stopColor="#22d3ee" />
    </linearGradient>
  </defs>
  <rect x="1.5" y="1.5" width="29" height="29" rx="9" stroke="url(#logo)" strokeWidth="2" />
  <rect x="7" y="7" width="6" height="6" rx="2" fill="url(#logo)" />
  <rect x="19" y="7" width="6" height="6" rx="2" fill="url(#logo)" opacity="0.55" />
  <rect x="7" y="19" width="6" height="6" rx="2" fill="url(#logo)" opacity="0.55" />
  <rect x="19" y="19" width="6" height="6" rx="2" fill="url(#logo)" />
</svg>`}
        </pre>
        <p className="mt-3 font-mono text-[10px] text-ink-faint">one dot = 6&#215;6 units = the clear-space unit; the header&apos;s copy lives in src/components/chrome.tsx</p>
      </section>

      <p className="mt-8 text-[11px] leading-relaxed text-ink-faint">
        Related: the{" "}
        <Link href="/brand/voice" className="font-semibold text-violet-300 hover:text-violet-200">
          voice guide
        </Link>
        ,{" "}
        <Link href="/brand/proof" className="font-semibold text-violet-300 hover:text-violet-200">
          the proof shelf
        </Link>{" "}
        and{" "}
        <Link href="/brand/watermark" className="font-semibold text-violet-300 hover:text-violet-200">
          the optional watermark
        </Link>
        .
      </p>
    </div>
  );
}
