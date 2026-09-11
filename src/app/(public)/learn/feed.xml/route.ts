// #50 — /learn/feed.xml, the one text surface on the site that had no feed.
//
// Every other family of dated records here publishes one: the catalog has
// /community/rss.xml (and /community/feed.xml as its second name), the exports
// hub serves /api/exports/changelog.xml. The 60 guides are dated on `updated`
// and were the exception, which is exactly the kind of gap that stays invisible
// until someone counts.
//
// Built like the community feed and for the same reason: absolute URLs come
// from the incoming request origin, so no origin is hard-coded anywhere in this
// source tree and the feed works on any host.

import { LEARN_ARTICLES } from "@/lib/learn";

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
  const items = [...LEARN_ARTICLES].sort((a, b) => b.updated.localeCompare(a.updated));
  const newest = items[0]?.updated ?? "1970-01-01";
  const minutes = items.reduce((n, a) => n + a.minutes, 0);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Motif UI — Learn</title>
    <link>${esc(origin)}/learn</link>
    <description>The ${items.length} written guides on Motif UI, newest first — ${minutes} minutes of reading in total. Each entry dates from the last time the guide was edited, which is the date the page itself shows.</description>
    <language>en</language>
    <lastBuildDate>${new Date(`${newest}T00:00:00Z`).toUTCString()}</lastBuildDate>
    <atom:link href="${esc(origin)}/learn/feed.xml" rel="self" type="application/rss+xml" />
${items
  .map(
    (a) => `    <item>
      <title>${esc(a.title)}</title>
      <link>${esc(origin)}/learn/${esc(a.slug)}</link>
      <guid isPermaLink="false">motif:learn:${esc(a.slug)}:${a.updated}</guid>
      <pubDate>${new Date(`${a.updated}T00:00:00Z`).toUTCString()}</pubDate>
      <category>${esc(a.level)}</category>
      <description>${esc(`${a.deck} (${a.minutes} min, ${a.level})`)}</description>
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
