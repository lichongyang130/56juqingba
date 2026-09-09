import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AssetDetail from "@/components/asset-detail";
import { COMPONENTS } from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const asset = COMPONENTS.find((c) => c.slug === slug);
  if (!asset) return { title: "Not found" };
  return {
    title: asset.title,
    description: asset.description,
  };
}

export default async function ComponentPage({ params }: Props) {
  const { slug } = await params;
  const asset = COMPONENTS.find((c) => c.slug === slug);
  if (!asset) notFound();
  return <AssetDetail asset={asset} />;
}
