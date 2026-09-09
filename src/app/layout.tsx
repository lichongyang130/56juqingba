import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
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
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-bg text-ink font-sans">{children}</body>
    </html>
  );
}
