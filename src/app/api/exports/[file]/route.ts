// Section 16 — the export endpoint.
//
// The response is built from the same functions the /integrations pages print,
// so the file you download and the file shown on the page cannot drift. Every
// export is derived from data the site already holds: the stylesheet, the
// catalog, the changelog. Nothing here is transcribed.

import { exportFor } from "@/lib/exports";

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const entry = exportFor(file);
  if (!entry) {
    return new Response("No such export. See /integrations for the list.", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
  }
  return new Response(entry.build(), {
    headers: {
      "content-type": entry.contentType,
      "content-disposition": `inline; filename="${entry.file}"`,
      "cache-control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
      "x-generated-from": "the site's own stylesheet and catalog data",
    },
  });
}
