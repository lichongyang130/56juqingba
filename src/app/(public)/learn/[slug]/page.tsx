import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LearnArticleView from "@/components/learn-article";
import { learnArticleOf } from "@/lib/learn";
import { articleLd, articleMetadata, breadcrumbLd, faqLd, jsonLd } from "@/lib/seo";
import { questionFor } from "@/lib/queries";

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
  // #478 — if this essay answers one of the curated questions, the question
  // travels with it, in the markup and on the page.
  const asks = questionFor(slug);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleLd(article)) }} />
      {asks && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqLd([{ q: asks.question, a: `${asks.because} This guide answers it in ${article.minutes} minutes.` }])) }} />}
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
