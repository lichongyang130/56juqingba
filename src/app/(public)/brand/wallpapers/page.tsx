import type { Metadata } from "next";
import Link from "next/link";
import { WALLPAPERS } from "@/lib/brand";

export const metadata: Metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/brand/wallpapers" },
  title: "Wallpapers — three original posters — Motif UI",
  description:
    "Three wallpapers drawn in this repository's own geometry, downloadable as SVG at 2560×1440. Free to use, no attribution required, no stock art.",
};

export default function WallpapersPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Brand</span>
        <span>/</span>
        <span className="text-ink-dim">Wallpapers</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Brand · downloads</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Three posters, drawn in code</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          Each wallpaper below is an SVG written by hand in <span className="font-mono">src/lib/brand.ts</span> — the same 8×16 dot grid, the same
          violet-indigo-cyan gradient and the same type as the site. They exist as source, not as exported bitmaps, so you can open one, move a dot
          and save your own version. No stock art, no AI-generated filler, no attribution required.
        </p>
      </div>

      <section className="mt-10 space-y-6">
        {WALLPAPERS.map((w) => (
          <article key={w.slug} className="overflow-hidden rounded-3xl border border-white/8 bg-panel">
            <div className="border-b border-white/8 bg-black/30 p-4">
              {/* Rendered at preview size; the download is the same viewBox at 2560×1440. */}
              <div className="overflow-hidden rounded-xl" dangerouslySetInnerHTML={{ __html: w.svg.replace('width="2560" height="1440"', 'width="100%" height="auto"') }} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div className="min-w-0">
                <h2 className="text-sm font-extrabold tracking-tight">{w.title}</h2>
                <p className="mt-1 max-w-xl text-[11px] leading-relaxed text-ink-dim">{w.note}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="font-mono text-[10px] text-ink-faint">{w.ratio}</span>
                <a href={`/api/brand/${w.slug}`} download={`motif-${w.slug}.svg`} className="btn btn-primary px-4 py-2 text-xs">
                  Download SVG
                </a>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">Licence, in one line</h2>
        <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
          Free for personal and commercial use, modification allowed, attribution appreciated but not required. The one thing asked for: do not
          redistribute them as part of a competing asset pack. The file&apos;s provenance is this repository, and a pack would break that.
        </p>
        <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">
          SVG scaled to any screen without blurring; a 4K raster export is left to your own wallpaper tool rather than generated here, because a
          second binary copy would be a file nobody can diff.
        </p>
      </section>
    </div>
  );
}
