import type { Metadata } from "next";
import localFont from "next/font/local";
import { SITE } from "@/lib/site";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

// #401 — the font audit's two findings, fixed in the layout rather than
// written down as advice:
//
// 1. Subset. The @fontsource CSS imports shipped seven subsets (cyrillic,
//    cyrillic-ext, greek, greek-ext, vietnamese, latin, latin-ext) as nine
//    woff2 files — 261 KB of build output for a site whose copy is English.
//    The accented characters the catalog actually uses (é ó á í ú ñ £ ° × ·)
//    all live in the Latin-1 range, so the latin subsets cover every glyph on
//    the site. Next fingerprints and self-hosts the two files below, and the
//    unused subsets stop being emitted at all.
//
// 2. Preload. Nothing was preloaded before: the fonts were discovered only
//    after the stylesheet parsed, which is the classic invisible-text window.
//    next/font/local emits <link rel="preload" as="font"> for the faces used
//    in this layout, which the audit page then verifies by reading the built
//    HTML rather than trusting this comment.
const inter = localFont({
  src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  weight: "100 900", // Inter's wght axis, read from the package metadata
  style: "normal",
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
});

// The display face is the one that actually shifts layout when it swaps in, so
// it is the one worth preloading first if a build ever has to choose.
const sora = localFont({
  src: "../../node_modules/@fontsource-variable/sora/files/sora-latin-wght-normal.woff2",
  weight: "100 800", // Sora's wght axis
  style: "normal",
  display: "swap",
  variable: "--font-sora",
  preload: true,
  fallback: ["Inter Variable", "ui-sans-serif", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  // Relative canonicals and OG images resolve against this, so a page only has
  // to name its own path.
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "ui components", "animated components", "ai website prompts",
    "css backgrounds", "easing lab", "react tailwind", "web design resources",
  ],
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    type: "website",
    siteName: SITE.name,
    url: SITE_URL,
    // #506 — the site card. Any page without a bespoke card inherits this one,
    // so a link preview is never an empty frame. Asset, prompt, guide and
    // background pages override it with their own generated card.
    images: [{ url: "/og/default", width: 1200, height: 630, alt: `${SITE.name} — ${SITE.tagline}` }],
  },
  twitter: { card: "summary_large_image", images: ["/og/default"] },
  // No `alternates` here on purpose. A canonical declared at the layout level
  // is inherited by every page that forgot to declare its own — which is how a
  // hundred pages end up pointing at "/". Canonicals, and the #475
  // multilingual pair, are declared by the pages they describe.
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="min-h-dvh bg-bg text-ink font-sans">{children}</body>
    </html>
  );
}
