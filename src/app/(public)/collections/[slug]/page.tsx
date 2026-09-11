import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COLLECTIONS, collectionItems, collectionMatches, collectionOf, collectionPrompts } from "@/lib/community";
import { KIND_BUDGETS } from "@/lib/kinds";

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = collectionOf(slug);
  if (!c) return { title: "Collection" };
  return { title: `${c.title} — Motif UI collection`, description: c.blurb };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = collectionOf(slug);
  if (!c) notFound();

  const assets = collectionItems(c);
  const prompts = collectionPrompts(c);
  const matches = collectionMatches(c);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/collections" className="hover:text-ink">Collections</Link>
        <span>/</span>
        <span className="text-ink-dim">{c.title}</span>
      </nav>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Collection · {c.kind === "assets" ? "components" : "prompts"}</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">{c.title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-dim">{c.blurb}</p>
        </div>
        <span className="chip !text-[10px]">{matches} match this filter · showing {assets.length + prompts.length}</span>
      </div>

      <div className="mt-7 rounded-2xl border border-white/8 bg-white/[.02] px-5 py-4">
        <p className="text-[11px] leading-relaxed text-ink-dim">
          <span className="font-bold text-ink">Rule behind this list: </span>
          {c.why}
        </p>
      </div>

      {assets.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {assets.map((a) => (
            <Link key={a.slug} href={`/components/${a.slug}`} className="card-hover group flex flex-col rounded-3xl border border-white/8 bg-panel p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="chip !text-[10px]">{KIND_BUDGETS.find((k) => k.kind === a.kind)?.label ?? a.kind}</span>
                <span className="font-mono text-[10px] text-ink-faint">{a.bundleKb} KB</span>
              </div>
              <h2 className="mt-3 text-[15px] font-extrabold tracking-tight">{a.title}</h2>
              <p className="mt-1.5 line-clamp-3 flex-1 text-[11px] leading-relaxed text-ink-dim">{a.description}</p>
              <div className="mt-3 flex items-center gap-2 text-[10px] text-ink-faint">
                <span className="font-mono">a11y {a.a11yScore}</span>
                <span>·</span>
                <span className="font-mono">Q {a.qualityScore}</span>
                <span>·</span>
                <span className="font-mono">{a.copies.toLocaleString()} copies</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {prompts.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((p) => (
            <Link key={p.slug} href={`/prompts/${p.slug}`} className="card-hover group flex flex-col rounded-3xl border border-white/8 bg-panel p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="chip !text-[10px] !border-cyan-300/30 !text-cyan-200">{p.industry}</span>
                <span className="font-mono text-[10px] text-ink-faint">fidelity {p.avgFidelity}</span>
              </div>
              <h2 className="mt-3 text-[15px] font-extrabold tracking-tight">{p.title}</h2>
              <p className="mt-1.5 line-clamp-3 flex-1 text-[11px] leading-relaxed text-ink-dim">{p.vibe}</p>
              <span className="mt-3 font-mono text-[10px] text-ink-faint">{p.runs.length} runs · best model: {p.bestModel}</span>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/8 bg-panel p-6">
        <p className="max-w-xl text-xs leading-relaxed text-ink-dim">
          Collections are URLs, not saved state — copy the address bar and send it. The rule above explains membership,
          so nobody has to guess why an item is in or out.
        </p>
        <Link href="/collections" className="btn btn-ghost !py-2 text-xs">All collections →</Link>
      </div>
    </div>
  );
}
