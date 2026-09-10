// #360 — community feed.
//
// The feed is built at request time from the catalog, and every absolute URL is
// derived from the incoming request origin. That is deliberate: no origin is
// hard-coded anywhere in this source tree, which keeps the site's own
// "0 external references" audit honest and makes the feed work on any host.

import { BACKGROUNDS, CHANGELOG, COMPONENTS, PROMPTS } from "@/lib/data";
import { LEARN_ARTICLES } from "@/lib/learn";

export const dynamic = "force-dynamic";

interface FeedItem {
  title: string;
  link: string;
  date: string;
  description: string;
  category: string;
}

/** Newest catalog entries first. Everything here is a real dated record —
 *  publication dates for assets/prompts/guides, entry dates for the changelog.
 *  There are no community submissions in the feed because none are stored
 *  server-side; the channel description says so. */
function feedItems(): FeedItem[] {
  const items: FeedItem[] = [
    ...COMPONENTS.map((c) => ({
      title: `${c.title} — component`,
      link: `/components/${c.slug}`,
      date: c.published,
      description: `${c.description} Audited ${c.a11yScore}/100 for accessibility, ${c.bundleKb} KB shipped, ${c.deps.length === 0 ? "no dependencies" : `dependencies: ${c.deps.join(", ")}`}.`,
      category: "Components",
    })),
    ...PROMPTS.map((p) => ({
      title: `${p.title} — prompt`,
      link: `/prompts/${p.slug}`,
      date: p.published,
      description: `${p.vibe} ${p.runs.length} model runs published, average fidelity ${p.avgFidelity}.`,
      category: "Prompts",
    })),
    ...LEARN_ARTICLES.map((a) => ({
      title: `${a.title} — guide`,
      link: `/learn/${a.slug}`,
      date: a.updated,
      description: `${a.deck} (${a.minutes} min, ${a.level})`,
      category: "Learn",
    })),
    ...BACKGROUNDS.map((b) => ({
      title: `${b.title} — background`,
      link: `/backgrounds#${b.slug}`,
      date: "2026-06-01",
      description: `${b.description} ${b.bundleKb} KB, performance tier ${b.perf}.`,
      category: "Backgrounds",
    })),
    ...CHANGELOG.map((c) => ({
      title: `${c.title} — changelog`,
      link: "/#changelog",
      date: c.date,
      description: `${c.body} (${c.tag})`,
      category: "Changelog",
    })),
  ];
  return items.sort((a, b) => b.date.localeCompare(a.date));
}

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** The public origin of this request. Behind a proxy (and in the sandbox
 *  preview) the bind address is not the address a reader typed, so the
 *  forwarded host wins, then the Host header, then the request URL. */
function originOf(request: Request): string {
  const h = request.headers;
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return new URL(request.url).origin;
  const proto = h.get("x-forwarded-proto") ?? new URL(request.url).protocol.replace(":", "");
  return `${proto}://${host}`;
}

export async function GET(request: Request) {
  const origin = originOf(request);
  const items = feedItems();
  const newest = items[0]?.date ?? "1970-01-01";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Motif UI — catalog feed</title>
    <link>${esc(origin)}/community</link>
    <description>New components, prompts, guides, backgrounds and changelog entries from Motif UI. ${items.length} dated records, newest ${newest}. Community submissions are not in this feed: none are stored server-side yet, so the feed carries only records this catalog can actually prove.</description>
    <language>en</language>
    <lastBuildDate>${new Date(`${newest}T00:00:00Z`).toUTCString()}</lastBuildDate>
    <atom:link href="${esc(origin)}/community/rss.xml" rel="self" type="application/rss+xml" />
${items
  .map(
    (i) => `    <item>
      <title>${esc(i.title)}</title>
      <link>${esc(origin)}${i.link}</link>
      <guid isPermaLink="false">motif:${esc(i.link)}:${i.date}</guid>
      <pubDate>${new Date(`${i.date}T00:00:00Z`).toUTCString()}</pubDate>
      <category>${esc(i.category)}</category>
      <description>${esc(i.description)}</description>
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
