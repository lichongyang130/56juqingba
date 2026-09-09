// Shared domain types for the Motif UI platform.
// Mirrors the Prisma schema in /prisma/schema.prisma (kept in sync by hand for the MVP).

export type AssetKind =
  | "element" // micro UI element (button, toggle, loader…)
  | "animated" // animation component (cursor, aurora, orbit…)
  | "section" // page section (hero, pricing, bento…)
  | "template"; // whole-page template

export type AssetStatus = "draft" | "review" | "live" | "archived";

export interface Asset {
  slug: string;
  kind: AssetKind;
  title: string;
  description: string;
  aliases?: string[]; // alternate search names ("dropdown" → sheet-menu, combo-box …)
  tags: string[];
  behaviors: string[]; // hover | click | scroll | drag | tilt …
  stack: ("React" | "HTML/CSS" | "Vue")[];
  deps: string[];
  bundleKb: number;
  themeable: boolean; // 100% design-token driven
  a11yScore: number; // 0–100 automated audit
  qualityScore: number; // 0–100 editorial review
  status: AssetStatus;
  license: "MIT" | "CC BY 4.0";
  version: string;
  author: string;
  published: string; // ISO date
  demo: string; // key of the live demo to render
  props: PropSpec[];
  copies: number; // how many times copied this month
  views: number;
}

export interface PropSpec {
  name: string;
  label: string;
  type: "range" | "color" | "toggle" | "select";
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  defaultValue: number | string | boolean;
  options?: string[];
}

export type PromptStatus = "beta" | "verified" | "featured";

export interface PromptRun {
  model: string; // "Claude 4.6 Sonnet" | "Codex" | "GLM-4.6" …
  date: string;
  fidelity: number; // visual fidelity score 0–100
  buildError: boolean;
  notes: string; // short verdict
}

export interface PromptTemplate {
  slug: string;
  title: string;
  industry: string;
  vibe: string; // mood keywords
  stacks: string[]; // framework variants shipped
  blocks: string[]; // sections covered
  status: PromptStatus;
  avgFidelity: number;
  bestModel: string;
  runs: PromptRun[];
  promptBody: string;
  author: string;
  published: string;
}

export interface BackgroundAsset {
  slug: string;
  title: string;
  category: "animated" | "gradient" | "texture" | "particles";
  tech: ("CSS" | "WebGL" | "SVG")[];
  perf: "low" | "mid" | "high"; // performance tier
  themeable: boolean;
  bundleKb: number;
  copies: number;
  demo: string;
  description: string;
}

export interface LabTool {
  slug: string;
  title: string;
  description: string;
  outputs: string[];
  free: boolean;
  accent: string;
  interactive?: boolean; // has a working inline demo in the MVP
}

export interface CommunityStat {
  label: string;
  value: string;
  delta: string;
  up: boolean;
}
