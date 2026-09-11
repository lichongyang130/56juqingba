import type { Metadata } from "next";
import Link from "next/link";
import { CHANGELOG, COMPONENTS, PROMPTS, accentCss } from "@/lib/data";
import { LEARN_ARTICLES } from "@/lib/learn";
import { localDay } from "@/lib/retention";

export const metadata: Metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/digest/copy-of-the-week" },
  title: "Copy of the week — a previewable digest email",
  description:
    "The weekly digest as a designed email mock: the most-copied component, the best-fidelity prompt and one essay, all read from the catalog.",
};

/**
 * An email mock that is honest about being one: the layout is the email, the
 * numbers come from the catalog, and the page says which parts of a real send
 * are missing (a list, a sender, a tracking pixel).
 */
export default function CopyOfTheWeekPage() {
  const builtOn = localDay();
  const mostCopied = [...COMPONENTS].sort((a, b) => b.copies - a.copies)[0];
  const bestPrompt = [...PROMPTS].sort((a, b) => b.avgFidelity - a.avgFidelity)[0];
  const runnerUp = [...COMPONENTS].sort((a, b) => b.copies - a.copies)[1];
  const essay = [...LEARN_ARTICLES].sort((a, b) => (a.updated < b.updated ? 1 : -1))[0];
  const note = CHANGELOG[0];
  const copies = mostCopied.copies.toLocaleString();

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <Link href="/digest" className="hover:text-ink">
          Weekly digest
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Copy of the week</span>
      </nav>

      <div className="mt-8 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Digest · previewable email</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">Copy of the week</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          People ask what the digest email looks like before they hand over an address. This is it, rendered as a page: same layout, same
          numbers, no subscription. The figures below are read from the catalog when the page is built on {builtOn}.
        </p>
      </div>

      <article className="mt-8 overflow-hidden rounded-3xl border border-white/12 bg-[#0c0e15]">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-6 py-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-violet-200">Motif Weekly</span>
          <span className="font-mono text-[10px] text-ink-faint">issue preview · {builtOn}</span>
        </header>

        <div className="px-6 py-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-200">Copy of the week</p>
          <h2 className="mt-1.5 text-2xl font-black tracking-tight">{mostCopied.title}</h2>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-dim">{mostCopied.description}</p>
          <p className="mt-3 font-mono text-[11px] text-ink-faint">
            {copies} copies · {mostCopied.bundleKb.toFixed(1)} KB · {mostCopied.kind} · {mostCopied.a11yScore} a11y / {mostCopied.qualityScore}{" "}
            quality
          </p>
          <Link href={`/components/${mostCopied.slug}`} className="btn btn-primary mt-4 !px-4 !py-2 text-[11px]">
            Open the asset
          </Link>

          <hr className="my-6 border-white/10" />

          <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-200">Prompt at the front of the queue</p>
          <h3 className="mt-1.5 text-lg font-extrabold tracking-tight">{bestPrompt.title}</h3>
          <p className="mt-1.5 text-[12px] leading-relaxed text-ink-dim">
            {bestPrompt.industry} · {bestPrompt.vibe}. Averaging {bestPrompt.avgFidelity}% fidelity across {bestPrompt.runs.length} runs, best
            on {bestPrompt.bestModel}.
          </p>
          <Link href={`/prompts/${bestPrompt.slug}`} className="mt-3 inline-block text-[11px] font-semibold text-cyan-200 hover:text-cyan-100">
            Read the run log →
          </Link>

          <hr className="my-6 border-white/10" />

          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">One essay, one idea</p>
          <h3 className="mt-1.5 text-lg font-extrabold tracking-tight">{essay.title}</h3>
          <p className="mt-1.5 text-[12px] leading-relaxed text-ink-dim">
            {essay.deck} — {essay.minutes} minutes, {essay.level.toLowerCase()}.
          </p>
          <Link href={`/learn/${essay.slug}`} className="mt-3 inline-block text-[11px] font-semibold text-emerald-200 hover:text-emerald-100">
            Read it →
          </Link>

          <hr className="my-6 border-white/10" />

          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Also this week</p>
          <ul className="mt-2 space-y-1.5 text-[12px] leading-relaxed text-ink-dim">
            <li>
              Runner-up by copies:{" "}
              <Link href={`/components/${runnerUp.slug}`} className="font-semibold text-violet-200 hover:text-violet-100">
                {runnerUp.title}
              </Link>{" "}
              with {runnerUp.copies.toLocaleString()}.
            </li>
            <li>
              Studio log: <span className="font-semibold text-ink">{note.title}</span> ({note.date}).
            </li>
            <li>
              Thursday brief: the{" "}
              <Link href="/community/day" className="font-semibold text-violet-200 hover:text-violet-100">
                community day
              </Link>{" "}
              theme for this week.
            </li>
          </ul>
        </div>

        <footer className="border-t border-white/10 px-6 py-4">
          <p className="text-[10px] leading-relaxed text-ink-faint">
            You are reading a preview, not a message. Motif has no mailing list, this page sets no tracking pixel, and the footer below would
            normally carry an unsubscribe link — the honest version of that promise is that there is nothing to unsubscribe from.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/digest" className="text-[10px] font-semibold text-ink-dim hover:text-ink">
              Full weekly digest
            </Link>
            <Link href="/community/feed.xml" className="text-[10px] font-semibold text-ink-dim hover:text-ink">
              Atom feed instead
            </Link>
          </div>
        </footer>
      </article>

      <section className="mt-8 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">Why show the email at all</h2>
        <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
          A signup form is a promise made with no evidence. Rendering the actual issue first lets you decide whether the contents are worth an
          address — and if you would rather not subscribe anywhere, the same numbers are on the{" "}
          <Link href="/digest" className="font-semibold text-violet-300 hover:text-violet-200">
            digest page
          </Link>{" "}
          and in the{" "}
          <Link href="/community/feed.xml" className="font-semibold text-violet-300 hover:text-violet-200">
            feed
          </Link>
          .
        </p>
        <p className="mt-2 text-[11px] leading-relaxed text-ink-faint">
          The &ldquo;most copied&rdquo; and &ldquo;best fidelity&rdquo; picks are sorted from the live catalog with no editor in the loop, which is
          why the runner-up is listed right underneath: a weekly pick that never explained itself would be a curation claim without a rule.
        </p>
      </section>

      <p className="mt-6 text-[10px] text-ink-faint">
        Accent colour used for the hero card: <span className="font-mono">{accentCss(mostCopied.slug, 85, 62)}</span> — the same hue rule the
        catalog cards use.
      </p>
    </div>
  );
}
