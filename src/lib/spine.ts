// #472 — the internal-link spine.
//
// Every component page offers two essays and one prompt, chosen by shared tags
// so the graph is a consequence of the catalog rather than a hand-written list
// that rots. The score is deliberately dumb and printed on the page: overlap on
// tags first, then the asset's own tags against the essay's tags, then recency.
//
// Deterministic by design — the same asset always links to the same three
// places, which is what makes it a spine instead of a shuffle.

import { PROMPTS } from "./data";
import type { Asset } from "./types";
import type { PromptTemplate } from "./types";
import { LEARN_ARTICLES, type LearnArticle } from "./learn";

const kebab = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

/** A stable id for a changelog entry, because several share a date. */
export const changeLogSlug = (entry: { date: string; title: string }) => `${entry.date}-${kebab(entry.title)}`;

const overlap = (a: string[], b: string[]) => {
  const set = new Set(b.map((t) => t.toLowerCase()));
  return a.reduce((n, t) => n + (set.has(t.toLowerCase()) ? 1 : 0), 0);
};

export interface SpineLinks {
  essays: LearnArticle[];
  prompt: PromptTemplate;
  /** Printed so the choice can be checked rather than trusted. */
  reasons: string[];
}

/** Two essays + one prompt for an asset, scored by tag overlap and stated. */
export function spineFor(asset: Asset): SpineLinks {
  const essays = [...LEARN_ARTICLES]
    .map((a) => ({ a, score: overlap([...asset.tags, asset.kind], a.tags) }))
    .sort((x, y) => y.score - x.score || (x.a.slug < y.a.slug ? -1 : 1))
    .slice(0, 2)
    .map((r) => r.a);

  const prompt = [...PROMPTS]
    .map((p) => ({ p, score: overlap([...asset.tags, asset.kind], [...p.blocks, p.industry, p.vibe]) }))
    .sort((x, y) => y.score - x.score || (x.p.slug < y.p.slug ? -1 : 1))[0].p;

  const reasons = [
    `essays scored on shared tags (${overlap([...asset.tags, asset.kind], essays[0]?.tags ?? [])} and ${overlap([...asset.tags, asset.kind], essays[1]?.tags ?? [])} matches)`,
    `prompt scored on block/vibe overlap (${overlap([...asset.tags, asset.kind], [...prompt.blocks, prompt.industry, prompt.vibe])} matches)`,
  ];

  return { essays, prompt, reasons };
}

export interface SpineCoverage {
  assets: number;
  essaysLinked: number;
  promptsLinked: number;
  assetsWithoutEssays: number;
  assetsWithoutPrompt: number;
}

/**
 * Coverage across the whole catalog — the number the harness and the register
 * page quote. Counting from the same function the pages use is the point: a
 * coverage claim that came from somewhere else would be a second implementation
 * waiting to disagree.
 */
export function spineCoverage(assets: Asset[]): SpineCoverage {
  let essaysLinked = 0;
  let promptsLinked = 0;
  let assetsWithoutEssays = 0;
  let assetsWithoutPrompt = 0;

  for (const asset of assets) {
    const links = spineFor(asset);
    if (links.essays.length === 2) essaysLinked += 1;
    else assetsWithoutEssays += 1;
    if (links.prompt) promptsLinked += 1;
    else assetsWithoutPrompt += 1;
  }

  return { assets: assets.length, essaysLinked, promptsLinked, assetsWithoutEssays, assetsWithoutPrompt };
}
