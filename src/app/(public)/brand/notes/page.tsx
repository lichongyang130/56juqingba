import type { Metadata } from "next";
import Link from "next/link";
import { CHANGELOG } from "@/lib/data";
import { changeLogSlug } from "@/lib/spine";

export const metadata: Metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/brand/notes" },
  title: "Build notes — twelve one-liners with numbers in them — Motif UI",
  description:
    "Each changelog entry reduced to a post-sized line carrying its own figure — assembled from the changelog data, not written for a thread.",
};

export default function BuildNotesPage() {
  const notes = CHANGELOG.map((e) => {
    const figure = e.perf ? `${Math.abs(e.perf.deltaKb).toFixed(1)} KB ${e.perf.deltaKb < 0 ? "lighter" : "heavier"} — ${e.perf.scope}` : null;
    // The line is assembled, not authored: title + the entry's own measurement
    // or its first sentence. Nothing is invented for the sake of a hook.
    const firstSentence = e.body.split(". ")[0];
    return { date: e.date, tag: e.tag, title: e.title, line: `${e.title}. ${figure ?? firstSentence}`, slug: changeLogSlug(e) };
  });

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Brand</span>
        <span>/</span>
        <span className="text-ink-dim">Build notes</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Brand · build notes</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Twelve lines worth posting</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          Social copy fails when it is written for the algorithm instead of the reader. These lines are not written at all: each is assembled from
          a changelog entry and carries that entry&apos;s own measurement, so a post cannot be more exciting than the build it describes.
        </p>
        <p className="mt-2 text-[11px] leading-relaxed text-ink-faint">
          Rule of thumb used here: a line without a number, a decision, or a mistake is not worth a post. Of the {CHANGELOG.length} entries,{" "}
          {CHANGELOG.filter((e) => e.perf).length} carry a size delta and the rest carry a decision.
        </p>
      </div>

      <ol className="mt-10 space-y-4">
        {notes.map((n, i) => (
          <li key={n.slug} className="rounded-3xl border border-white/8 bg-panel p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                {String(i + 1).padStart(2, "0")} · {n.date} · {n.tag}
              </p>
              <Link href={`/changelog/${n.slug}`} className="shrink-0 text-[11px] font-semibold text-violet-300 hover:text-violet-200">
                the full entry →
              </Link>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-ink">{n.line}</p>
            <p className="mt-2 font-mono text-[10px] leading-relaxed text-ink-faint">
              {n.line.length} characters · {n.line.length <= 240 ? "fits one post" : "needs an edit before posting"}
            </p>
          </li>
        ))}
      </ol>

      <section className="mt-8 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">Why assemble instead of write</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          A hand-written thread drifts from the changelog within two releases — the post says 12 KB, the entry says 9.4. Assembling the line from
          the same record the page reads makes that drift impossible, and it keeps the honest failures: an entry with no measurement produces a
          line with no measurement instead of a number borrowed from somewhere else.
        </p>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-faint">
          The length counter is not a style rule, it is a fact about where the line can go — over 240 characters and it needs an edit before it fits
          a post, which the page states rather than hiding.
        </p>
      </section>
    </div>
  );
}
