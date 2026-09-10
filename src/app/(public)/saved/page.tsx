import type { Metadata } from "next";
import Link from "next/link";
import { SavedBoard } from "@/components/community-ui";

export const metadata: Metadata = {
  title: "Your saved list — Motif UI",
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
    </div>
  );
}
