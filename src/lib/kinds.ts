/* ---------------------------------------------------------------------
   Per-kind bundle budgets — pure data, deliberately kept out of
   quality-utils.ts.
   quality-utils reads the source tree with node:fs to run its audits, so any
   client component importing it drags node:fs into the browser bundle (and
   Turbopack refuses to build it). Constants that the console needs belong
   here, where both server and client code can import them safely.
   --------------------------------------------------------------------- */

export type AssetKind = "element" | "animated" | "section" | "template";

export interface KindBudget {
  kind: AssetKind;
  label: string;
  budgetKb: number;
  note: string;
}

export const KIND_BUDGETS: KindBudget[] = [
  { kind: "element", label: "Elements", budgetKb: 8, note: "small interactive controls — a tiny budget is the point" },
  { kind: "animated", label: "Animated", budgetKb: 10, note: "motion scenes get one extra allowance" },
  { kind: "section", label: "Sections", budgetKb: 8, note: "page sections stay lean; grids live in the template" },
  { kind: "template", label: "Templates", budgetKb: 28, note: "whole pages, so whole-page weight is fair" },
];

export const kindLabel = (k: string): string => KIND_BUDGETS.find((m) => m.kind === k)?.label ?? k;

export const budgetFor = (k: string): number => KIND_BUDGETS.find((m) => m.kind === k)?.budgetKb ?? 12;

export const budgetNote = (k: string): string => KIND_BUDGETS.find((m) => m.kind === k)?.note ?? "";
