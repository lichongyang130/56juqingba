import Link from "next/link";
import { COMPONENTS } from "@/lib/data";
import { badgeSvg } from "@/lib/exports";

export const metadata = {
  title: "Score badge — Motif UI",
  description: "A real SVG badge per asset, built from the same stored scores the asset page shows.",
};

export default function IntegrationsBadgePage() {
  const sample = [...COMPONENTS].sort((a, b) => b.qualityScore - a.qualityScore).slice(0, 3);
  const markdown = (slug: string) => `[![Motif quality](https://<host>/api/badge/${slug})](https://<host>/components/${slug})`;

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Bridge · #430</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          A badge that <span className="text-gradient">means something</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          Every one of the {COMPONENTS.length} components has a badge at <span className="font-mono text-xs">/api/badge/&lt;slug&gt;</span>{" "}
          — a real SVG carrying that asset&apos;s editorial quality score, coloured by band, with the accessibility score and the
          provenance written into the file&apos;s own description. It is not a CI badge: no pipeline runs behind it.
        </p>
      </div>

      <p className="mt-6 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
        The three badges below are inlined SVG built by the same function that serves{" "}
        <span className="font-mono text-[10px]">/api/badge/&lt;slug&gt;</span>, so this page shows the real file without adding an
        image tag to the site — which is what keeps the{" "}
        <Link href="/perf/no-images" className="underline decoration-dotted">
          image-free policy
        </Link>{" "}
        checkable rather than rhetorical.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {sample.map((a) => (
          <div key={a.slug} className="rounded-3xl border border-white/8 bg-panel p-5">
            {/* The badge is inlined as SVG markup rather than loaded through an
                <img>: the route and this page build it from the same function,
                and the site keeps its zero-image-tag property while showing the
                real file. Copy the Markdown below to use it elsewhere. */}
            <span
              className="inline-block"
              role="img"
              aria-label={`Quality badge for ${a.title}: ${a.qualityScore} of 100`}
              dangerouslySetInnerHTML={{ __html: badgeSvg(a.slug) ?? "" }}
            />
            <p className="mt-3 text-sm font-bold">{a.title}</p>
            <p className="mt-0.5 text-[11px] text-ink-dim">
              quality {a.qualityScore} · a11y {a.a11yScore} · {a.bundleKb} KB
            </p>
            <pre className="mt-2 overflow-auto rounded-xl border border-white/8 bg-[#07090f] p-3 font-mono text-[10px] leading-relaxed text-ink-dim">
              {markdown(a.slug)}
            </pre>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">What the badge reports</p>
          <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
            The editorial quality score from the catalog record — the same number printed on the asset page and in{" "}
            <span className="font-mono">catalog.json</span>. Bands are 90+ green, 75–89 amber, below 75 red, and the threshold is
            in the route&apos;s code rather than in a legend nobody reads.
          </p>
          <p className="mt-3 text-[11px] leading-relaxed text-ink-dim">
            The SVG carries a <span className="font-mono">&lt;desc&gt;</span> element naming the asset, both scores and the fact
            that no CI service is involved — so a screen reader, or anyone who opens the file, gets the provenance rather than a
            bare number.
          </p>
        </div>
        <div className="rounded-3xl border border-dashed border-amber-300/25 bg-amber-300/[.04] p-6">
          <p className="text-sm font-extrabold text-amber-200">Why this one is honest, and a CI badge usually is not</p>
          <ul className="mt-2 space-y-2 text-[11px] leading-relaxed text-amber-100/80">
            <li>
              A &ldquo;tests passing&rdquo; badge on a project with no test suite is decoration. This badge reports a number the
              site already publishes per asset, so it cannot claim more than the catalog holds.
            </li>
            <li>
              It updates when the catalog updates — with the caveat that the response is cached for five minutes at the edge,
              which is stated rather than promised as instant.
            </li>
            <li>
              It cannot report compliance. A quality score is an editorial judgement with a published method, not a certification,
              and the badge says &ldquo;motif quality&rdquo; rather than anything resembling approval.
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link href="/integrations/cli" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          ← The CLI prints this Markdown
        </Link>
        <Link href="/quality" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          How the scores are made →
        </Link>
      </div>
    </div>
  );
}
