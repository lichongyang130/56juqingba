// #50 — /changelog/feed.xml. The studio log has its own page and its own entry
// URLs; the exports hub serves a copy of it at /api/exports/changelog.xml, so
// the one address a reader would guess was the one that 404ed.
//
// Items link to the entry's own permalink rather than the homepage anchor,
// which is what the export copy cannot do: it is generated in `lib/exports.ts`
// without knowing the slug helper.

import { CHANGELOG } from "@/lib/data";
import { changeLogSlug } from "@/lib/spine";

export const dynamic = "force-dynamic";

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function originOf(request: Request): string {
  const h = request.headers;
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return new URL(request.url).origin;
  const proto = h.get("x-forwarded-proto") ?? new URL(request.url).protocol.replace(":", "");
  return `${proto}://${host}`;
}

export async function GET(request: Request) {
  const origin = originOf(request);
  const entries = [...CHANGELOG].sort((a, b) => b.date.localeCompare(a.date));
  const newest = entries[0]?.date ?? "1970-01-01";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Motif UI — studio log</title>
    <link>${esc(origin)}/changelog</link>
    <description>What changed at Motif UI, newest first: ${entries.length} entries, each with the measurement that justified it where one exists. Every entry has its own permalink and its own page.</description>
    <language>en</language>
    <lastBuildDate>${new Date(`${newest}T00:00:00Z`).toUTCString()}</lastBuildDate>
    <atom:link href="${esc(origin)}/changelog/feed.xml" rel="self" type="application/rss+xml" />
${entries
  .map(
    (e) => `    <item>
      <title>${esc(e.title)}</title>
      <link>${esc(origin)}/changelog/${esc(changeLogSlug(e))}</link>
      <guid isPermaLink="false">motif:changelog:${esc(changeLogSlug(e))}</guid>
      <pubDate>${new Date(`${e.date}T00:00:00Z`).toUTCString()}</pubDate>
      <category>${esc(e.tag)}</category>
      <description>${esc(e.perf ? `${e.body} (${e.perf.scope}: ${e.perf.deltaKb} KB, ${e.perf.build})` : e.body)}</description>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600",
    },
  });
}
