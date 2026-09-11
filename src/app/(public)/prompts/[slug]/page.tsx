import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PromptDetail from "@/components/prompt-detail";
import { PROMPTS } from "@/lib/data";
import { breadcrumbLd, faqLd, jsonLd, promptFaq, promptMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const prompt = PROMPTS.find((p) => p.slug === slug);
  if (!prompt) return { title: "Not found" };
  // #469 — the run count and fidelity in the description come from the record,
  // so a re-run updates the metadata without anyone editing a string.
  return promptMetadata(prompt);
}

export default async function PromptPage({ params }: Props) {
  const { slug } = await params;
  const prompt = PROMPTS.find((p) => p.slug === slug);
  if (!prompt) notFound();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqLd(promptFaq(prompt))) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbLd([
              { name: "AI Prompts", path: "/prompts" },
              { name: prompt.title, path: `/prompts/${prompt.slug}` },
            ]),
          ),
        }}
      />
      <PromptDetail prompt={prompt} />
    </>
  );
}
