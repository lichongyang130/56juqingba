// #430 — the score badge.
//
// The SVG is built in src/lib/exports.ts so this route and the page that
// documents it render the same markup. Nothing runs behind it: the badge
// reports the asset's stored editorial score, and the SVG's own <desc> says so
// rather than implying a pipeline ran.

import { badgeSvg } from "@/lib/exports";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const svg = badgeSvg(slug);
  if (!svg) {
    return new Response("No such component badge.", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
  }
  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
      "x-badge-source": "stored catalog scores, not a CI run",
    },
  });
}
