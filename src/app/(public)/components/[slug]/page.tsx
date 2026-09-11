import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AssetDetail from "@/components/asset-detail";
import { COMPONENTS } from "@/lib/data";
import { assetFaq, assetMetadata, breadcrumbLd, faqLd, jsonLd } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const asset = COMPONENTS.find((c) => c.slug === slug);
  if (!asset) return { title: "Not found" };
  // #469 — canonical, OG and keywords from the asset's own record rather than
  // a shared blurb. Anything not in the data does not appear in the metadata.
  return assetMetadata(asset);
}

export default async function ComponentPage({ params }: Props) {
  const { slug } = await params;
  const asset = COMPONENTS.find((c) => c.slug === slug);
  if (!asset) notFound();
  const faq = assetFaq(asset);
  const trail = breadcrumbLd([
    { name: "Components", path: "/components" },
    { name: asset.title, path: `/components/${asset.slug}` },
  ]);
  return (
    <>
      {/* #468 / #471 — FAQ + breadcrumb markup, both built only from facts the
          page already prints. No Product, no offers, no ratings: the catalog
          has no prices and no collected reviews, so claiming them would be a
          lie a crawler would happily repeat. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqLd(faq)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(trail) }} />
      <AssetDetail asset={asset} />
    </>
  );
}
