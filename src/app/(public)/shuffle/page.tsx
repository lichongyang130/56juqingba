import Link from "next/link";
import ShuffleView from "@/components/shuffle-view";
import { COMPONENTS } from "@/lib/data";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/shuffle" }, title: "Get inspired — Motif UI shuffle" };

export default function ShufflePage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <span className="text-ink-dim">Shuffle</span>
      </nav>
      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Get inspired</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
            Let the library <span className="text-gradient">pick for you</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-dim">
            A moodboard in one click: shuffle a deck of six original assets and browse until something sparks.
            Every card is a live component, not a screenshot.
          </p>
        </div>
        <Link href="/components" className="text-sm font-semibold text-ink-dim hover:text-ink">
          Browse everything instead →
        </Link>
      </div>
      <div className="mt-8">
        <ShuffleView assets={COMPONENTS} />
      </div>
    </div>
  );
}
