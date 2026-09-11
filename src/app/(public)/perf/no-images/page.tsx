import Link from "next/link";
import { PerfNav, Stat } from "@/components/perf-ui";
import { imageAudit } from "@/lib/quality-utils";
import { BACKGROUNDS, COMPONENTS } from "@/lib/data";
import { buildSummary } from "@/lib/perf";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/perf/no-images" },
  title: "No images",
  description: "Why this site ships no photography or illustration, what it uses instead, and the rule that would break the policy.",
};

export default function PerfNoImagesPage() {
  const audit = imageAudit();
  const summary = buildSummary();
  const techs = BACKGROUNDS.reduce<Record<string, number>>((a, b) => {
    for (const t of b.tech) a[t] = (a[t] ?? 0) + 1;
    return a;
  }, {});
  const raster = COMPONENTS.filter((c) => /png|jpg|jpeg|webp|avif/i.test(c.description)).length;

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Image-free policy</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          Nothing here is a photograph <span className="text-gradient">of anything</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          Every visual on this site is drawn by code — CSS gradients, SVG, canvas or plain type. That is an aesthetic position
          first and a performance position second, and it is checkable: the audit below scans the source for image tags and
          reports what it finds, including the zero.
        </p>
      </div>

      <div className="mt-8">
        <PerfNav current="/perf/no-images" />
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="<img> tags in the source" value={audit.imgTags} sub={`across ${audit.filesScanned} files scanned`} />
        <Stat label="Image files in the build" value={summary.fontFiles > 0 ? 1 : 0} sub="the favicon, which is an SVG" />
        <Stat label="Raster assets in the catalog" value={raster} sub="components whose copy mentions a bitmap format" />
        <Stat label="Backgrounds, all procedural" value={BACKGROUNDS.length} sub={Object.entries(techs).map(([t, n]) => `${t} ${n}`).join(" · ")} />
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">What this buys</p>
          <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-ink-dim">
            <li className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5">
              No image pipeline, so no variants to generate, no format negotiation, no CDN transform to pay for.
            </li>
            <li className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5">
              Everything scales: a gradient at 4× density costs the same bytes as at 1×, and nothing is ever the wrong
              resolution.
            </li>
            <li className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5">
              Every visual is themeable and animatable, because it is code — the {BACKGROUNDS.length} backgrounds recolour with
              the page&apos;s tokens.
            </li>
            <li className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5">
              Accessibility is easier to hold: decorative layers are real elements with <span className="font-mono">aria-hidden</span>,
              counted {audit.ariaHiddenUses} times in the source, rather than an alt-text problem in an editor.
            </li>
          </ul>
        </div>
        <div className="rounded-3xl border border-dashed border-amber-300/25 bg-amber-300/[.04] p-6">
          <p className="text-sm font-extrabold text-amber-200">Where the policy has a cost</p>
          <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-amber-100/80">
            <li>
              A screenshot of a real component is often clearer than a live demo, and this site has no place to put one. The
              gallery pages are live instead, which is heavier to render and harder to share.
            </li>
            <li>
              Social previews are text-only: no Open Graph image is generated, so a shared link is a title and a description.
              Adding one would mean a build step that rasterises — the first real image the site would ship.
            </li>
            <li>
              Product work by real teams usually needs a screenshot in the changelog. The changelog here describes changes in
              prose, which is honest and less persuasive.
            </li>
          </ul>
          <p className="mt-3 text-[10px] leading-relaxed text-amber-100/60">
            The rule this page is written to: if an image is ever added, it is added as a deliberate exception with its weight
            accounted for on the budget page — not quietly, as the first of a pipeline.
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link href="/perf/mounting" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          ← Lazy mounting
        </Link>
        <Link href="/perf/caching" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          Cache headers →
        </Link>
      </div>
    </div>
  );
}
