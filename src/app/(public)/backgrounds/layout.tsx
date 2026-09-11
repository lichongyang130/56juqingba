import type { Metadata } from "next";

// The page in this segment is a client component (filters, live previews), and
// a client page cannot export metadata. The canonical therefore lives here, in
// a one-line layout: it applies to the index and is overridden by the detail
// pages, which declare their own through generateMetadata.
export const metadata: Metadata = {
  alternates: { canonical: "/backgrounds" },
};

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
