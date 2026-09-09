import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LearnArticleView from "@/components/learn-article";
import { learnArticleOf } from "@/lib/learn";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = learnArticleOf(slug);
  if (!article) return { title: "Not found" };
  return { title: article.title, description: article.deck };
}

export default async function LearnArticlePage({ params }: Props) {
  const { slug } = await params;
  if (!learnArticleOf(slug)) notFound();
  return <LearnArticleView slug={slug} />;
}
