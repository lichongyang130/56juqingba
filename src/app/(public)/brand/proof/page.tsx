import type { Metadata } from "next";
import Link from "next/link";
import { Mascot } from "@/components/mascot";
import { SAMPLE_BUILDS } from "@/lib/samples";

export const metadata: Metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/brand/proof" },
  title: "Proof shelf — labelled examples, not testimonials",
  description:
    "Three build stories, each clearly labelled as an authored demo persona rather than a real customer. The format is the deliverable; the quotes are not real people.",
};

export default function ProofShelfPage() {
  const shelf = SAMPLE_BUILDS.slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Brand</span>
        <span>/</span>
        <span className="text-ink-dim">Proof</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Brand · proof</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">The proof shelf</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          Every product site wants a wall of customer quotes. This site cannot honestly have one yet — there are no customers to quote — so it does
          the next honest thing: it writes the three stories it wants to be able to tell, with the names and numbers{" "}
          <strong className="text-ink">labelled as invented examples</strong> until a real builder says something themselves.
        </p>
      </div>

      <div className="mt-8 rounded-3xl border border-amber-300/30 bg-amber-400/[.05] p-5">
        <div className="flex items-start gap-4">
          <Mascot pose="idle" size={56} className="shrink-0" id="mascot-proof" />
          <div>
            <h2 className="text-sm font-extrabold tracking-tight text-amber-100">Read this label first</h2>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-dim">
              The handles below (<span className="font-mono">linnea.dev</span>, <span className="font-mono">mikef.builds</span>,{" "}
              <span className="font-mono">studio.noir</span>) are demo personas authored for this library. The builds are described in the sample
              data that also powers /samples, and their sizes are estimated page weights from those files — not third-party measurements. Nothing
              here is a real person&apos;s endorsement, and the page says so before any quote appears.
            </p>
          </div>
        </div>
      </div>

      <section className="mt-6 space-y-4">
        {shelf.map((b) => (
          <article key={b.slug} className="rounded-3xl border border-white/8 bg-panel p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-base font-extrabold tracking-tight">{b.title}</h2>
              <span className="font-mono text-[10px] text-ink-faint">
                {b.by} · invented handle · {b.kb} KB estimated
              </span>
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-ink-dim">{b.challenge}</p>
            <blockquote className="mt-3 border-l-2 border-violet-300/40 pl-3 text-[12px] italic leading-relaxed text-ink">{b.result}</blockquote>
            <div className="mt-3 flex flex-wrap gap-2">
              {b.used.map((slug) => (
                <Link key={slug} href={`/components/${slug}`} className="chip !text-[10px] hover:text-ink">
                  {slug}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">The rule for replacing these</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          A quote earns its place here when three things exist: a named builder who said it, a build that can be opened, and a number that came
          from outside this repository. Until all three are true, a story stays in this section with its label attached. The alternative — an
          unattributed &ldquo;loved by developers&rdquo; badge — is the kind of line this whole site is built to avoid.
        </p>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-faint">
          The sample builds themselves are real code paths: each one is assembled from components that exist in the catalog, and each is one click
          from the /samples pages where the stack is listed.
        </p>
      </section>
    </div>
  );
}
