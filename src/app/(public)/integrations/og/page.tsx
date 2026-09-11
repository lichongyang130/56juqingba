import Link from "next/link";
import { ogMarkup } from "@/lib/exports";
import { COMPONENTS } from "@/lib/data";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/integrations/og" },
  title: "Open Graph helper",
  description: "Copy-paste OG markup for any asset — image-free by design — and where this site's own share cards live.",
};

export default function IntegrationsOgPage() {
  // The three most-copied assets in the catalog, chosen from stored copy counts
  // rather than picked by hand.
  const top = [...COMPONENTS].sort((a, b) => b.copies - a.copies).slice(0, 3);
  const blocks = top.map((a) => ogMarkup(a.slug)).filter((b): b is NonNullable<typeof b> => Boolean(b));

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Helper · #422</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          Shareable, <span className="text-gradient">without a picture</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          If you write about an asset — a blog post, a changelog, a launch note — the markup below gives the link a correct title
          and a description built from the asset&apos;s own stored facts. The block itself deliberately contains no image reference,
          for the reason stated below. This site&apos;s own share cards are a different thing: they are generated PNGs served at{" "}
          <Link href="/og/halo-button" className="font-mono text-violet-300 hover:text-violet-200">
            /og/&lt;slug&gt;
          </Link>
          .
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link href="/integrations" className="btn btn-ghost !px-4 !py-2 text-xs">
          ← All exports
        </Link>
        <Link href="/perf/no-images" className="btn btn-ghost !px-4 !py-2 text-xs">
          Why there are no images →
        </Link>
      </div>

      <div className="mt-8 space-y-4">
        {blocks.map((b) => (
          <div key={b.slug} className="grid gap-4 rounded-3xl border border-white/8 bg-panel p-5 lg:grid-cols-[0.9fr_1.3fr]">
            <div>
              <p className="text-sm font-bold">{b.title}</p>
              <p className="mt-1 font-mono text-[10px] text-ink-faint">/components/{b.slug}</p>
              <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
                Title and description come from the catalog record: stack, bundle size, audit score and licence. Change the
                record and this block changes with it.
              </p>
              <p className="mt-2 text-[10px] text-amber-200/80">og:image: none — see below</p>
            </div>
            <pre className="overflow-auto rounded-2xl border border-white/8 bg-[#07090f] p-4 font-mono text-[10px] leading-relaxed text-ink-dim">
              {b.markup}
            </pre>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">How the previews resolve</p>
          <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
            With <span className="font-mono">twitter:card = summary</span> and no image, a shared link shows the title and the
            description as text. The block stays image-free because it is markup you paste onto a page you control, and this helper
            cannot rasterise for it — a real preview image is a server pipeline, not a snippet. The site&apos;s own cards, by
            contrast, are generated at <span className="font-mono">/og/&lt;slug&gt;</span>: every asset has a PNG, and a scene that
            animates says so on the card rather than pretending the still is the motion.
          </p>
        </div>
        <div className="rounded-3xl border border-dashed border-amber-300/25 bg-amber-300/[.04] p-6">
          <p className="text-sm font-extrabold text-amber-200">What this helper is not</p>
          <p className="mt-2 text-[11px] leading-relaxed text-amber-100/80">
            It is not what this site emits about itself. The site&apos;s own pages carry title and description metadata from the
            page, and the helper is for markup you place on a page you control — the copy is explicit about the origin URL so a
            pasted block does not silently claim to be this domain.
          </p>
          <p className="mt-2 text-[10px] leading-relaxed text-amber-100/60">
            {COMPONENTS.length} assets have a generated block available; these three are the most copied in the catalog.
          </p>
        </div>
      </div>
    </div>
  );
}
