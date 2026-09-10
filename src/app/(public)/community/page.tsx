import type { Metadata } from "next";
import Link from "next/link";
import { BACKGROUNDS, COMPONENTS, LAB_TOOLS, PROMPTS } from "@/lib/data";
import { LEARN_ARTICLES } from "@/lib/learn";
import { CHALLENGES, COLLECTIONS, MODERATION_SEED, ROSTER, SPOTLIGHTS } from "@/lib/community";

export const metadata: Metadata = {
  title: "Community — Motif UI",
  description:
    "Motif's community surfaces: saved lists, curated collections, community prompt re-runs, the copy leaderboard, maker pages and the remix submit flow — each labelled with exactly what is live and what is a browser-local demo.",
};

export default function CommunityHub() {
  const counts = [
    { l: "Components", v: COMPONENTS.length, href: "/components" },
    { l: "Prompts", v: PROMPTS.length, href: "/prompts" },
    { l: "Guides", v: LEARN_ARTICLES.length, href: "/learn" },
    { l: "Backgrounds", v: BACKGROUNDS.length, href: "/backgrounds" },
    { l: "Lab tools", v: LAB_TOOLS.length, href: "/lab" },
    { l: "Collections", v: COLLECTIONS.length, href: "/collections" },
  ];
  const surfaces = [
    { href: "/saved", title: "Your saved list", tag: "browser-local", body: "Star any component or prompt; the list lives in your browser and comes back on every visit.", cta: "Open saved list" },
    { href: "/collections", title: "Curated collections", tag: "live now", body: `${COLLECTIONS.length} collections built as real filters over the catalog — counts change as the library does.`, cta: "Browse collections" },
    { href: "/community/leaderboard", title: "Copy leaderboard", tag: "live now", body: "The most-copied assets and highest-fidelity prompts, with credits shown for each.", cta: "See the leaderboard" },
    { href: "/community/re-run", title: "Community re-run", tag: "simulated demo", body: "Ask whether a prompt still holds on a given model and watch a run log stream against the published average.", cta: "Run a prompt" },
    { href: "/community/submit", title: "Submit a remix", tag: "feeds the queue", body: "Send a remix into the moderation queue with the audit gate marked pending until a human reviews it.", cta: "Submit a remix" },
    { href: "/makers", title: "Maker pages", tag: "sample roster", body: `Minimal pages for the ${ROSTER.length} contributors in the moderation demo — their submissions, scores, badges and notes.`, cta: "Meet the makers" },
    { href: "/community/picks", title: "Weekly picks", tag: "rule, not taste", body: "Three submissions a week in a \u201cmade it\u201d band, ranked by gate results first and audit score second.", cta: "See this week's picks" },
    { href: "/community/challenges", title: "Monthly challenges", tag: `${CHALLENGES.filter((c) => c.status === "open").length} brief open`, body: "A published brief, published constraints, and a winner rule applied by code — entries carry their gate line.", cta: "Open the challenge" },
    { href: "/community/badges", title: "Badges", tag: "awarded by rule", body: "Four contributor badges computed from catalog and gate data. Nothing purchasable, nothing granted by hand.", cta: "See the rules" },
    { href: "/community/loved", title: "Community loved", tag: "browser-local thanks", body: "A thank-you button on every asset, and a board that puts the assets you thanked at the top for you.", cta: "Open the board" },
    { href: "/community/spotlight", title: "Spotlight interviews", tag: `${SPOTLIGHTS.length} months`, body: "One maker a month on the craft behind the queue, linked from the Learn section.", cta: "Read a spotlight" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <span className="text-ink-dim">Community</span>
      </nav>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Community · what is live, what is local</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Built for the people who ship with it</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-dim">
            Motif has no login, so its community features are split honestly in two: things that are real today —
            curated collections, the copy leaderboard, published prompt runs — and things that need a backend, which
            ship here as browser-local demos you can actually use.
          </p>
        </div>
        <span className="chip !text-[10px]">{ROSTER.length} sample contributors · {MODERATION_SEED.length} queued submissions</span>
      </div>

      <div className="mt-8 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {counts.map((c) => (
          <Link key={c.l} href={c.href} className="card-hover rounded-2xl border border-white/8 bg-panel px-4 py-3">
            <p className="font-mono text-xl font-extrabold text-ink">{c.v}</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-widest text-ink-faint">{c.l}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {surfaces.map((c) => (
          <Link key={c.href} href={c.href} className="card-hover group flex flex-col rounded-3xl border border-white/8 bg-panel p-5">
            <span className="chip !text-[10px]">{c.tag}</span>
            <h2 className="mt-3 text-lg font-extrabold tracking-tight">{c.title}</h2>
            <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-ink-dim">{c.body}</p>
            <span className="mt-3 text-xs font-semibold text-violet-300 transition-colors group-hover:text-violet-200">{c.cta} →</span>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">The line we hold</p>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-mint/20 bg-mint/[.04] p-4">
            <p className="text-sm font-extrabold text-mint">Real today</p>
            <ul className="prose-list mt-2">
              <li>Curated collections derived from live catalog filters, each with a shareable URL.</li>
              <li>Copy counts, audit scores, prompt run logs and author credits.</li>
              <li>Maker pages built from the same sample roster the moderation demo already uses.</li>
              <li>Weekly picks, challenge rules and badges all computed from catalog and gate data.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-amber-300/25 bg-amber-300/[.04] p-4">
            <p className="text-sm font-extrabold text-amber-300">Browser-local until there is a backend</p>
            <ul className="prose-list mt-2">
              <li>Saved lists, remix submissions, review threads and thanks live in localStorage on this device.</li>
              <li>Community re-runs are a labelled simulation — no model is called.</li>
              <li>No count here implies users we do not have; the roster is sample data and says so.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
