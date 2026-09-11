import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LearnArticleView from "@/components/learn-article";
import { learnArticleOf } from "@/lib/learn";
import { articleLd, articleMetadata, breadcrumbLd, jsonLd } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = learnArticleOf(slug);
  if (!article) return { title: "Not found" };
  // #473-in-progress: the visible "updated" stamp on every essay comes from the
  // same field used for dateModified here, so the page and the markup agree.
  return articleMetadata(article);
}

export default async function LearnArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = learnArticleOf(slug);
  if (!article) notFound();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleLd(article)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbLd([
              { name: "Learn", path: "/learn" },
              { name: article.title, path: `/learn/${article.slug}` },
            ]),
          ),
        }}
      />
      <LearnArticleView slug={slug} />
    </>
  );
}
