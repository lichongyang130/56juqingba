import type { Metadata } from "next";

// The page in this segment is a client component (filters, live previews), and
// a client page cannot export metadata. The canonical therefore lives here, in
// a one-line layout: it applies to the index and is overridden by the detail
// pages, which declare their own through generateMetadata.
export const metadata: Metadata = {
  alternates: { canonical: "/prompts" },
  // 520 — the index was inheriting the layout's default title and description,
  // and so shared a search result with six other pages.
  title: "Prompt library",
  description:
    "Prompts run against Claude, Codex and GLM, scored for fidelity and published with screenshots, run logs and failure notes attached — re-run on 3.0-class models.",
};

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
