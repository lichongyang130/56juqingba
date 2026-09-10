import type { Metadata } from "next";
import Link from "next/link";
import { COMPONENTS, PROMPTS } from "@/lib/data";
import { LEARN_ARTICLES } from "@/lib/learn";
import { contentRequests } from "@/lib/community";
import { RequestsBoard } from "@/components/community-ui-2";

export const metadata: Metadata = {
  title: "Requests board — Motif UI",
  description: "Ask for the component, template, prompt or guide you are missing. Every request carries a coverage number measured from the live catalog, not a wish.",
};

export default function RequestsPage() {
  const requests = contentRequests();
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/community" className="hover:text-ink">Community</Link>
        <span>/</span>
        <span className="text-ink-dim">Requests</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Content requests · evidence first</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">What should we build next?</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          A wishlist is easy to write and impossible to rank. So every request below comes with a number taken from the
          catalog right now — how thin the coverage actually is — measured across {COMPONENTS.length} components,{" "}
          {PROMPTS.length} prompts and {LEARN_ARTICLES.length} guides. The board is ordered thinnest coverage first, and
          your votes pull the ones you care about to the top.
        </p>
        <p className="mt-3 rounded-2xl border border-amber-300/25 bg-amber-300/[.04] px-4 py-3 text-[11px] leading-relaxed text-amber-200/90">
          Honest limit: votes are stored in your browser, so there is no shared tally and no score to game. What is shared
          is the ordering rule and the measurements, which are recomputed from the catalog on every build — including the
          fact that this board is ranked by gap, not by popularity.
        </p>
      </div>

      <div className="mt-8">
        <RequestsBoard requests={requests} />
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          { h: "Ask with a number", b: "“More drag components” is a feeling. “7 of {COMPONENTS.length} assets declare drag” is a request someone can act on, and it stays true if the catalog changes." },
          { h: "The studio's own picks", b: "The thinnest gaps are not always the most valuable. The ordering here is a map of coverage, not a roadmap — a loud vote on a well-covered area is still a vote." },
          { h: "What gets built", b: "Requests that arrive with a measurement are the ones that survive a planning pass. If a gap closes, its row drops down the board automatically." },
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
