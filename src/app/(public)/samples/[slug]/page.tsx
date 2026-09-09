import Link from "next/link";
import { notFound } from "next/navigation";
import { COMPONENTS, accentCss } from "@/lib/data";
import { SAMPLE_BUILDS } from "@/lib/samples";

export const dynamicParams = false;

export function generateStaticParams() {
  return SAMPLE_BUILDS.map((b) => ({ slug: b.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const b = SAMPLE_BUILDS.find((x) => x.slug === slug);
  return { title: b ? `${b.title} — Made with Motif` : "Not found" };
}

export default async function SampleCasePage({ params }: Props) {
  const { slug } = await params;
  const b = SAMPLE_BUILDS.find((x) => x.slug === slug);
  if (!b) notFound();
  const estRequests = Math.max(4, Math.round(b.kb / 18) + 2);
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/samples" className="hover:text-ink">Made with Motif</Link>
        <span>/</span>
        <span className="text-ink-dim">{b.title}</span>
      </nav>

      <div className="mt-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">Case study · {b.by}</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">{b.title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-dim">{b.note}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="chip">~{b.kb} KB gzip</span>
          <span className="chip">~{estRequests} requests</span>
          <span className="chip">{b.used.length} library assets</span>
          <span className="chip">original build</span>
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <section className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-faint">01 · Challenge</p>
          <h2 className="mt-2 text-lg font-extrabold tracking-tight">The problem</h2>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-dim">{b.challenge}</p>
        </section>
        <section className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-faint">02 · Assets used</p>
          <h2 className="mt-2 text-lg font-extrabold tracking-tight">The build</h2>
          <div className="mt-3 space-y-2">
            {b.used.map((slug) => {
              const a = COMPONENTS.find((c) => c.slug === slug);
              return a ? (
                <Link key={slug} href={`/components/${slug}`} className="flex items-center gap-2.5 rounded-xl border border-white/6 bg-white/[.02] px-3 py-2 transition-colors hover:border-white/15">
                  <span className="h-2 w-2 rounded-full" style={{ background: accentCss(slug, 90, 65) }} />
                  <span className="min-w-0 flex-1 truncate text-xs font-semibold text-ink-dim">{a.title}</span>
                  <span className="text-[10px] text-ink-faint">open →</span>
                </Link>
              ) : null;
            })}
          </div>
        </section>
        <section className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-faint">03 · Result</p>
          <h2 className="mt-2 text-lg font-extrabold tracking-tight">The outcome</h2>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-dim">{b.result}</p>
        </section>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-emerald-300/15 bg-emerald-400/5 p-6">
        <div>
          <p className="text-sm font-bold text-emerald-100">Build something like it yourself</p>
          <p className="mt-1 text-xs text-ink-dim">Every asset above is original, MIT-licensed and copy-paste ready.</p>
        </div>
        <Link href="/components" className="btn btn-primary">Browse the library →</Link>
      </div>
    </div>
  );
}
