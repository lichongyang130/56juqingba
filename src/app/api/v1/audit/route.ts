import { COMPONENTS } from "@/lib/data";

export const dynamic = "force-static";

/**
 * #496 — the public audit API.
 *
 * The same numbers /quality prints, as JSON, computed by the same expression
 * (a reduce over the catalog), so the page and the API cannot drift. The shape
 * is flat and boring on purpose: an audit a script has to parse carefully is an
 * audit nobody runs.
 */

const band = (score: number) => (score >= 95 ? "95-100" : score >= 90 ? "90-94" : score >= 80 ? "80-89" : "under-80");

export async function GET() {
  const bands = { "95-100": 0, "90-94": 0, "80-89": 0, "under-80": 0 } as Record<string, number>;
  for (const c of COMPONENTS) bands[band(c.a11yScore)]++;

  const a11y = COMPONENTS.map((c) => c.a11yScore);
  const editorial = COMPONENTS.map((c) => c.qualityScore);
  const zeroDep = COMPONENTS.filter((c) => c.deps.length === 0).length;

  return Response.json(
    {
      apiVersion: "v1",
      generatedFrom: "src/lib/data.ts at build time",
      counts: { assets: COMPONENTS.length, zeroDependency: zeroDep, themeable: COMPONENTS.filter((c) => c.themeable).length },
      bands: { a11y: bands, editorial: bandsFrom(editorial) },
      summaries: {
        a11y: { min: Math.min(...a11y), max: Math.max(...a11y), mean: round(a11y.reduce((s, x) => s + x, 0) / a11y.length) },
        editorial: { min: Math.min(...editorial), max: Math.max(...editorial), mean: round(editorial.reduce((s, x) => s + x, 0) / editorial.length) },
      },
      assets: COMPONENTS.map((c) => ({
        slug: c.slug,
        kind: c.kind,
        a11y: c.a11yScore,
        editorial: c.qualityScore,
        bundleKb: c.bundleKb,
        dependencies: c.deps.length,
        themeable: c.themeable,
        license: c.license,
      })),
      links: { register: "/quality", componentApi: "/api/v1/components/halo-button", docs: "/pro/api" },
    },
    { headers: { "cache-control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400" } },
  );
}

function bandsFrom(scores: number[]) {
  const out: Record<string, number> = { "95-100": 0, "90-94": 0, "80-89": 0, "under-80": 0 };
  for (const s of scores) out[band(s)]++;
  return out;
}

const round = (n: number) => Math.round(n * 10) / 10;
