import { COMPONENTS, CHANGELOG } from "@/lib/data";
import { changeLogSlug } from "@/lib/spine";
import pkg from "../../../../../../package.json";

export const dynamic = "force-static";

export function generateStaticParams() {
  return COMPONENTS.map((c) => ({ slug: c.slug }));
}

/**
 * #495 — the component API, v1.
 *
 * One asset as data. Every field is read from the record the detail page
 * renders, so the API and the page cannot disagree. What is deliberately not
 * here is a `code` field: the docs promise only what the site actually holds,
 * and the source exposure story is a separate decision.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const asset = COMPONENTS.find((c) => c.slug === slug);
  if (!asset) {
    return Response.json({ error: "no such component", slug, index: "/api/v1/components" }, { status: 404 });
  }

  const entries = CHANGELOG.filter((e) => e.body.toLowerCase().includes(asset.slug) || e.title.toLowerCase().includes(asset.slug));

  return Response.json(
    {
      apiVersion: "v1",
      siteVersion: pkg.version,
      slug: asset.slug,
      title: asset.title,
      kind: asset.kind,
      description: asset.description,
      tags: asset.tags,
      behaviors: asset.behaviors,
      stack: asset.stack,
      dependencies: asset.deps,
      bundleKb: asset.bundleKb,
      themeable: asset.themeable,
      status: asset.status,
      license: asset.license,
      version: asset.version,
      author: asset.author,
      published: asset.published,
      scores: { a11y: asset.a11yScore, editorial: asset.qualityScore },
      props: asset.props.map((p) => ({ name: p.name, label: p.label, type: p.type })),
      changelog: entries.map((e) => ({ slug: changeLogSlug(e), date: e.date, title: e.title })),
      links: {
        page: `/components/${asset.slug}`,
        demo: `/embed/${asset.slug}`,
        audit: "/api/v1/audit",
        catalog: "/api/exports/catalog.json",
        docs: "/pro/api",
      },
    },
    { headers: { "cache-control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400" } },
  );
}
