import type { Metadata } from "next";
import Link from "next/link";
import { SavedBoard } from "@/components/community-ui";
import { ForkedList } from "@/components/community-ui-2";
import { LibraryFitness, StackRecipe } from "@/components/retention-ui";

export const metadata: Metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  // 519 — robots.txt only asks a crawler not to fetch this page; the noindex
  // is what keeps an empty browser-local surface out of the index itself.
  robots: { index: false },
  alternates: { canonical: "/saved" },
  title: "Your saved list",
  description: "Star Motif components and prompts into a saved list that lives in your browser — no account, no upload, and an honest note about what that means.",
};

export default function SavedPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/community" className="hover:text-ink">Community</Link>
        <span>/</span>
        <span className="text-ink-dim">Saved list</span>
      </nav>
      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Favourites · browser-local</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Your saved list</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          One button on every component and prompt page puts an item here. It is stored in this browser, survives
          refreshes, and never leaves your machine.
        </p>
      </div>
      <SavedBoard />

      <section className="mt-10 grid gap-4 lg:grid-cols-2">
        <StackRecipe />
        <LibraryFitness />
      </section>

      <section className="mt-12">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/6 pb-3">
          <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-violet-200">Remixes you forked</h2>
          <Link href="/community/remixes" className="text-[11px] font-semibold text-violet-300 hover:text-violet-200">
            Open the remix board →
          </Link>
        </div>
        <p className="mt-3 max-w-3xl text-[11px] leading-relaxed text-ink-faint">
          Forked remixes live in the same browser store as your stars, in{" "}
          <span className="font-mono">motif:forks</span>. Each fork keeps a link back to the original asset and to the
          person who made the remix — a copy without provenance is worth less than the credit it drops.
        </p>
        <div className="mt-4">
          <ForkedList />
        </div>
      </section>
    </div>
  );
}
