import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CHANGELOG, COMPONENTS, PROMPTS } from "@/lib/data";
import { changeLogSlug } from "@/lib/spine";
import { changelogEntryMetadata, jsonLd, url } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return CHANGELOG.map((e) => ({ slug: changeLogSlug(e) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = CHANGELOG.find((e) => changeLogSlug(e) === slug);
  if (!entry) return { title: "Not found" };
  // 519 — description and card come from lib/seo.ts like every catalog page.
  return changelogEntryMetadata(entry, slug);
}

/**
 * #474 — every changelog entry as its own small news item.
 *
 * A changelog that only exists on the homepage is a date-stamped list; giving
 * each entry a URL lets a line be linked, quoted and dated on its own. The
 * entry's own perf figure (when one was measured) travels with it instead of
 * being dropped in the move.
 */
export default async function ChangelogEntryPage({ params }: Props) {
  const { slug } = await params;
  const entry = CHANGELOG.find((e) => changeLogSlug(e) === slug);
  if (!entry) notFound();

  const index = CHANGELOG.findIndex((e) => changeLogSlug(e) === slug);
  const newer = CHANGELOG[index - 1];
  const older = CHANGELOG[index + 1];
  // Which catalog records the entry can point at: the tag tells us the group,
  // and the newest records in that group are the ones a reader would want.
  const asset =
    entry.tag === "Components"
      ? [...COMPONENTS].sort((a, b) => (a.published < b.published ? 1 : -1))[0]
      : entry.tag === "Prompts"
        ? null
        : null;
  const prompt = entry.tag === "Prompts" ? [...PROMPTS].sort((a, b) => (a.published < b.published ? 1 : -1))[0] : null;

  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title,
    articleSection: entry.tag,
    datePublished: entry.date,
    dateModified: entry.date,
    inLanguage: "en",
    publisher: { "@type": "Organization", name: "Motif UI", url: url("/") },
    mainEntityOfPage: url(`/changelog/${slug}`),
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />

      <nav className="flex flex-wrap items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <Link href="/changelog" className="hover:text-ink">
          Studio log
        </Link>
        <span>/</span>
        <span className="text-ink-dim">{entry.date}</span>
      </nav>

      <article className="mt-8">
        <p className="flex flex-wrap items-center gap-2">
          <span className="chip !text-[9px] uppercase">{entry.tag}</span>
          <span className="font-mono text-[11px] text-ink-faint">{entry.date}</span>
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{entry.title}</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-dim">{entry.body}</p>

        {entry.perf ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[.02] p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Measured change</p>
            <p className="mt-1 font-mono text-lg tabular-nums">
              {entry.perf.deltaKb < 0 ? "" : "+"}
              {entry.perf.deltaKb.toFixed(1)} KB
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-ink-dim">
              {entry.perf.scope} — measured on {entry.perf.build} and recorded in the build report, not estimated for the log.
            </p>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-white/[.02] p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">No measurement recorded</p>
            <p className="mt-1 text-[11px] leading-relaxed text-ink-dim">
              This entry predates the build report, so it carries no size figure. Saying so is the point: a changelog that quietly omits its
              numbers reads as if every change were free.
            </p>
          </div>
        )}

        {(asset || prompt) && (
          <p className="mt-6 text-[11px] leading-relaxed text-ink-dim">
            Newest {entry.tag === "Prompts" ? "prompt" : "component"} in the catalog right now:{" "}
            <Link
              href={entry.tag === "Prompts" ? `/prompts/${prompt!.slug}` : `/components/${asset!.slug}`}
              className="font-semibold text-violet-300 hover:text-violet-200"
            >
              {entry.tag === "Prompts" ? prompt!.title : asset!.title}
            </Link>
            .
          </p>
        )}
      </article>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-5 text-[11px]">
        {newer ? (
          <Link href={`/changelog/${changeLogSlug(newer)}`} className="font-semibold text-ink-dim hover:text-ink">
            ← Newer: {newer.title.slice(0, 46)}
          </Link>
        ) : (
          <span />
        )}
        {older ? (
          <Link href={`/changelog/${changeLogSlug(older)}`} className="text-right font-semibold text-ink-dim hover:text-ink">
            Older: {older.title.slice(0, 46)} →
          </Link>
        ) : (
          <span />
        )}
      </div>

      <p className="mt-6 text-[10px] leading-relaxed text-ink-faint">
        Entry {index + 1} of {CHANGELOG.length}. The homepage shows the same text in a list; this page exists so a single line can be linked,
        quoted and dated without dragging the whole log along.
      </p>
    </div>
  );
}
