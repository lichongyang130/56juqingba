// #427 — the embed surface.
//
// This route sits outside the (public) group on purpose: no header, no footer,
// no chrome, because it is meant to be framed by somebody else's page. It
// renders exactly one demo and links home, and the page at /integrations/embed
// prints the markup that points here.
//
// What a static build cannot do is enforce an allowlist of embedding sites:
// that needs a server checking the Origin header. The page says so rather than
// implying the embed is restricted.

import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoView } from "@/components/demos/Demo";
import { COMPONENTS } from "@/lib/data";

export const dynamicParams = true;

export function generateStaticParams() {
  return COMPONENTS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const asset = COMPONENTS.find((c) => c.slug === slug);
  if (!asset) return { title: "Not found" };
  return {
    title: `${asset.title} — embedded demo`,
    description: asset.description,
    robots: { index: false },
  };
}

export default async function EmbedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const asset = COMPONENTS.find((c) => c.slug === slug);
  if (!asset) notFound();

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-[#07090f] p-4 text-ink">
      <div className="w-full max-w-3xl">
        <DemoView demo={asset.demo} props={{}} />
      </div>
      <p className="text-[10px] text-ink-faint">
        Preview copy is sample content; catalog figures are read from the catalog. ·{" "}
        {asset.title} ·{" "}
        <Link href={`/components/${asset.slug}`} target="_top" className="underline decoration-dotted">
          Motif UI
        </Link>{" "}
        · MIT
      </p>
    </main>
  );
}
