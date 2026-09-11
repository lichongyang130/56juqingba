import { WALLPAPERS, WATERMARK_SVG } from "@/lib/brand";

export const dynamic = "force-static";

export function generateStaticParams() {
  return [...WALLPAPERS.map((w) => ({ slug: w.slug })), { slug: "badge" }];
}

/**
 * #490 — the download route.
 *
 * Wallpapers and the badge are served from the same module the brand pages
 * render, so the file you download and the preview you clicked are the same
 * string. SVGs are written with an inline content-disposition filename, which
 * makes the browser save them under a recognisable name.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const wallpaper = WALLPAPERS.find((w) => w.slug === slug);
  const svg = slug === "badge" ? WATERMARK_SVG : wallpaper?.svg;

  if (!svg) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "content-disposition": `inline; filename="motif-${slug}.svg"`,
      "cache-control": "public, max-age=3600",
    },
  });
}
