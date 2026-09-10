import type { Metadata } from "next";
import Link from "next/link";
import { COMPONENTS } from "@/lib/data";
import { LovedBoard } from "@/components/community-ui";

export const metadata: Metadata = {
  title: "Community loved — Motif UI",
  description: "The most-thanked Motif assets: the shared catalog ranking, reordered for you by the thanks you leave in this browser.",
};

export default function LovedPage() {
  const rows = [...COMPONENTS]
    .sort((a, b) => b.copies - a.copies || a.slug.localeCompare(b.slug))
    .slice(0, 15)
    .map((a) => ({ slug: a.slug, title: a.title, kind: a.kind, copies: a.copies, href: `/components/${a.slug}` }));

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/community" className="hover:text-ink">Community</Link>
        <span>/</span>
        <span className="text-ink-dim">Community loved</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Thank-you button · community loved</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Say thanks, then see the board move</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          Every asset page has a thank button. Thanks are stored in this browser and nowhere else, so the honest thing is
          what you see below: the shared catalog ranking, with the assets you thanked pulled to the top for you. We do
          not pretend a local tap is a community statistic.
        </p>
        <p className="mt-3 rounded-2xl border border-amber-300/25 bg-amber-300/[.04] px-4 py-3 text-[11px] leading-relaxed text-amber-200/90">
          The shared signal is the copy count shown on the right, which ships with the catalog and is not live analytics.
          Your thanks reorder this page for you; they do not change anyone else&apos;s view, and they are never uploaded.
        </p>
      </div>

      <div className="mt-8">
        <LovedBoard rows={rows} />
      </div>

      <div className="mt-9 grid gap-4 md:grid-cols-3">
        {[
          { h: "Why not a global count", b: "A global thank counter needs accounts and a database. We would rather ship the honest local version than a number you have to trust us about." },
          { h: "Why thanks at all", b: "Credits are the mechanism; thanks are the manners. The maker pages show the work, and the button gives a reader a way to mark what they actually used." },
          { h: "What would change it", b: "If a backend ever lands, thanks become one row per asset with deduplication by session — and this page starts showing a shared order without changing a single label." },
        ].map((c) => (
          <div key={c.h} className="rounded-3xl border border-white/8 bg-panel p-5">
            <p className="text-sm font-extrabold">{c.h}</p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-dim">{c.b}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
