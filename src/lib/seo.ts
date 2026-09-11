// Section 19 — metadata, structured data and crawl rules in one place.
//
// The site has no server and no database, so "SEO" here means three honest
// things: correct metadata per page, structured data that is true, and a crawl
// surface that keeps thin pages out of the index. Nothing in this file invents
// a rating, a review count or a price.

import type { Metadata } from "next";
import type { ChangeLogEntry } from "./data";
import { SITE } from "./site";
import type { Asset, BackgroundAsset, PromptTemplate } from "./types";

/** Structural subset so this module can describe a Learn article without importing the whole essay file. */
export interface LearnArticleLike {
  slug: string;
  title: string;
  deck: string;
  minutes: number;
  level: string;
  tags: string[];
  updated: string;
}

type ComponentAsset = Asset;
type PromptTemplateLike = PromptTemplate;
type Background = BackgroundAsset;

/**
 * The origin used in canonicals, the sitemap and OG tags.
 *
 * SITE.domain is still a placeholder (see the note on /quality/schema), so the
 * base URL is overridable by environment: a deployment sets NEXT_PUBLIC_SITE_URL
 * and everything here follows. Falling back to the placeholder is deliberate —
 * a wrong canonical is worse than a documented one.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || `https://${SITE.domain}`).replace(/\/$/, "");

export const url = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/**
 * Meta descriptions are clamped to 200 characters — roughly the window a
 * search result or a chat unfurl actually shows. The page keeps the full text;
 * only the snippet is shortened, and it is cut at a word boundary with an
 * ellipsis so it never ends mid-word.
 */
const trim = (text: string, max: number) => {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${cut.slice(0, space > max * 0.6 ? space : cut.length)}…`;
};

/** One asset's metadata: title, description, canonical, OG and a few honest keywords. */
export function assetMetadata(asset: ComponentAsset): Metadata {
  const path = `/components/${asset.slug}`;
  const description = trim(
    `${asset.description} ${asset.bundleKb.toFixed(1)} KB, ${asset.deps.length === 0 ? "zero dependencies" : `${asset.deps.length} dependencies`}, ${asset.stack.join(" / ")} — MIT licensed.`,
    200,
  );
  return {
    title: asset.title,
    description,
    keywords: [asset.title.toLowerCase(), ...asset.tags, `${asset.kind} component`, "react", "tailwind"],
    alternates: { canonical: path },
    openGraph: {
      title: `${asset.title} — ${asset.kind} component`,
      description,
      url: url(path),
      type: "article",
      siteName: SITE.name,
      // #481 — the generated card. Next does not attach a file-based OG image
      // once metadata declares its own openGraph block, so the path is named
      // here; the image itself is rendered from the asset record.
      images: [{ url: `/og/${asset.slug}`, width: 1200, height: 630, alt: `${asset.title} — ${asset.kind} component card` }],
    },
    twitter: {
      card: "summary_large_image",
      title: asset.title,
      description,
      images: [`/og/${asset.slug}`],
    },
  };
}

export function promptMetadata(prompt: PromptTemplateLike): Metadata {
  const path = `/prompts/${prompt.slug}`;
  const description = trim(
    `${prompt.industry} website prompt: ${prompt.vibe}. ${prompt.avgFidelity}% average fidelity across ${prompt.runs.length} recorded runs, best on ${prompt.bestModel}.`,
    200,
  );
  return {
    title: prompt.title,
    description,
    keywords: [prompt.industry.toLowerCase(), "website prompt", "ai prompt", ...prompt.blocks.slice(0, 4)],
    alternates: { canonical: path },
    openGraph: {
      title: prompt.title,
      description,
      url: url(path),
      type: "article",
      siteName: SITE.name,
      images: [{ url: `/og/${prompt.slug}`, width: 1200, height: 630, alt: `${prompt.title} — prompt card` }],
    },
    twitter: { card: "summary_large_image", title: prompt.title, description, images: [`/og/${prompt.slug}`] },
  };
}

export function articleMetadata(article: LearnArticleLike): Metadata {
  const path = `/learn/${article.slug}`;
  const description = trim(`${article.deck} ${article.minutes}-minute ${article.level.toLowerCase()} guide, updated ${article.updated}.`, 200);
  return {
    title: article.title,
    description,
    keywords: [...article.tags, "web design guide", "css guide"],
    alternates: { canonical: path },
    openGraph: {
      title: article.title,
      description,
      url: url(path),
      type: "article",
      publishedTime: article.updated,
      siteName: SITE.name,
      images: [{ url: `/og/${article.slug}`, width: 1200, height: 630, alt: `${article.title} — guide card` }],
    },
    twitter: { card: "summary_large_image", title: article.title, description, images: [`/og/${article.slug}`] },
  };
}

/**
 * 519 — a studio-log entry's metadata.
 *
 * The entry pages shipped in #474 with a raw 280-character slice of the body as
 * their description and an `openGraph` block with no image, which meant a page
 * that exists to be quoted had no card and a snippet twice the length a search
 * result shows. Both now come from the same rules as the rest of the site: the
 * description is clamped by `trim`, and the card is the entry's own /og image.
 */
export function changelogEntryMetadata(entry: ChangeLogEntry, slug: string): Metadata {
  const path = `/changelog/${slug}`;
  const description = trim(`${entry.body} Filed under ${entry.tag}, ${entry.date}.`, 200);
  // 520 — "… — studio log" pushed four of these titles past 75 characters
  // once the layout template adds "· Motif UI". The entry title is the
  // headline; the page itself says where it sits.
  const title = entry.title;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: url(path),
      type: "article",
      publishedTime: entry.date,
      siteName: SITE.name,
      images: [{ url: `/og/${slug}`, width: 1200, height: 630, alt: `${entry.title} — studio log entry` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`/og/${slug}`] },
  };
}

export function backgroundMetadata(bg: Background): Metadata {
  const path = `/backgrounds#${bg.slug}`;
  const description = trim(
    `${bg.description} — a ${bg.category} background (${bg.tech.join(" / ")}, ${bg.perf} performance tier) with ${bg.copies.toLocaleString()} copies.`,
    200,
  );
  return {
    title: bg.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: bg.title,
      description,
      url: url(path),
      siteName: SITE.name,
      images: [{ url: `/og/${bg.slug}`, width: 1200, height: 630, alt: `${bg.title} — background card` }],
    },
    twitter: { card: "summary_large_image", title: bg.title, description, images: [`/og/${bg.slug}`] },
  };
}

/* -------------------------------------------------------------- FAQ data */

export interface QA {
  q: string;
  a: string;
}

/**
 * The FAQ a component page can answer from its own record. Every answer is a
 * fact already printed elsewhere on the page — no "great for modern teams"
 * filler, and no question whose answer would be a marketing claim.
 */
export function assetFaq(asset: ComponentAsset): QA[] {
  const deps = asset.deps.length === 0 ? "no dependencies at all" : `depends on ${asset.deps.join(", ")}`;
  return [
    {
      q: `What is ${asset.title}?`,
      a: `${asset.description} It is a ${asset.kind} built with ${asset.stack.join(" / ")} and ships under the MIT licence.`,
    },
    {
      q: `How big is ${asset.title} and what does it depend on?`,
      a: `${asset.bundleKb.toFixed(1)} KB of component code, ${deps}. The number is the measured source size, not a gzipped estimate.`,
    },
    {
      q: `Is ${asset.title} accessible?`,
      a: `It scores ${asset.a11yScore}/100 on this site's automated audit, which checks keyboard reach, focus visibility, label text and reduced-motion handling. The audit is a check, not a certificate: it cannot see your page.`,
    },
    {
      // #511 — the question a preview raises. Answered with the rule the build
      // actually follows: catalog figures in demo copy are derived from the
      // catalog (a scene used to announce "300 verified prompts" beside a
      // catalog of 74), and everything else inside a preview is the sample
      // product's own copy, not a claim about this site.
      q: "Are the numbers inside the demo real?",
      a: `Any figure in the preview that describes this catalog — assets, prompts, guides, recorded runs, scores, sizes — is read from the catalog data at build time, not typed into the scene. The rest of the copy inside a preview belongs to the sample page the component is demonstrating: a hero demo has to say something, and what it says is sample content rather than a claim about Motif. The record above the preview is the authoritative version of this asset.`,
    },
    {
      q: `How do I use ${asset.title}?`,
      a: `Copy the snippet from the page (React, HTML/CSS or Vue view) or run \`npx motifui add ${asset.slug}\`. The copied code is a single file with no build step beyond your existing ${asset.stack[0]} setup.`,
    },
  ];
}

export function promptFaq(prompt: PromptTemplateLike): QA[] {
  const worst = [...prompt.runs].sort((a, b) => a.fidelity - b.fidelity)[0];
  return [
    {
      q: `What does the ${prompt.title} prompt produce?`,
      a: `A ${prompt.industry.toLowerCase()} website with ${prompt.blocks.join(", ")}. The vibe target is "${prompt.vibe}" and the prompt body is printed in full on the page.`,
    },
    {
      q: `How well does it score?`,
      a: `${prompt.avgFidelity}% average fidelity over ${prompt.runs.length} recorded runs. Best model: ${prompt.bestModel}. Weakest recorded run: ${worst.fidelity}% on ${worst.model}.`,
    },
    {
      q: `Are failures included?`,
      a: prompt.runs.some((r) => r.buildError)
        ? "Yes — at least one run failed to build, and it is still on the run log with its notes."
        : "No build failures are recorded for this prompt, and the log says so rather than implying every model succeeded elsewhere.",
    },
  ];
}

/* ----------------------------------------------------------- JSON-LD ---- */

/**
 * Escapes `<` so a JSON-LD block can never close its own script tag — the one
 * injection vector that matters when you print data into a page.
 */
export const jsonLd = (data: unknown): string => JSON.stringify(data).replace(/</g, "\\u003c");

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: url(t.path),
    })),
  };
}

export function faqLd(items: QA[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function articleLd(article: LearnArticleLike) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.deck,
    dateModified: article.updated,
    inLanguage: "en",
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE_URL },
    mainEntityOfPage: url(`/learn/${article.slug}`),
  };
}
