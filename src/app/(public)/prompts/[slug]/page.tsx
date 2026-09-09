import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PromptDetail from "@/components/prompt-detail";
import { PROMPTS } from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const prompt = PROMPTS.find((p) => p.slug === slug);
  if (!prompt) return { title: "Not found" };
  return {
    title: prompt.title,
    description: `Tested on ${prompt.runs.length} models · average fidelity ${prompt.avgFidelity}/100`,
  };
}

export default async function PromptPage({ params }: Props) {
  const { slug } = await params;
  const prompt = PROMPTS.find((p) => p.slug === slug);
  if (!prompt) notFound();
  return <PromptDetail prompt={prompt} />;
}
