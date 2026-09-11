import { ImageResponse } from "next/og";
import { COMPONENTS, accentHue } from "@/lib/data";

// #481 — an OG card per asset, generated from the record at build time.
//
// The design is deliberately data-first: the numbers on the card are the same
// numbers on the page (size, a11y, quality, copies), so a screenshot of a share
// card cannot disagree with the asset it advertises. No logo lockup, no stock
// imagery, no claim the detail page does not make.

export const dynamic = "force-static";

const SIZE = { width: 1200, height: 630 };

export function generateStaticParams() {
  return COMPONENTS.map((c) => ({ slug: c.slug }));
}

/**
 * A plain route handler rather than the opengraph-image file convention.
 *
 * The convention works, but the URL it serves carries a build hash
 * (`/components/halo-button/opengraph-image-18nwr4`), which is fine for Next's
 * own metadata injection and useless for a URL that has to be written into
 * metadata by hand. A route handler with generateStaticParams and force-static
 * prerenders the same PNGs at build time and keeps the address predictable —
 * which is the whole point of a share card.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  return renderCard(params);
}

// Satori fetches a fallback font from the network when it meets a glyph its
// bundled face lacks — and this sandbox has no egress, so the build logged a
// failed fetch for every ⌘ and ✓ in a description. Stripping to printable
// ASCII keeps the card deterministic and the build silent; the detail page
// still shows the original punctuation.
const ascii = (text: string) => text.replace(/[^\x20-\x7e]/g, "").replace(/\s+/g, " ").trim();

async function renderCard(params: Promise<{ slug: string }>) {
  const { slug } = await params;
  const asset = COMPONENTS.find((c) => c.slug === slug) ?? COMPONENTS[0];
  const hue = accentHue(asset.slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: `radial-gradient(900px 500px at 12% 8%, hsla(${hue}, 90%, 60%, 0.28), transparent 62%), #08090f`,
          color: "#e8e9f2",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 24 }}>
          <span style={{ letterSpacing: 6, textTransform: "uppercase", color: `hsl(${hue} 90% 72%)`, fontWeight: 700 }}>
            {asset.kind}
          </span>
          <span style={{ color: "#8b90a6", fontFamily: "monospace" }}>motif · component library</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>{asset.title}</div>
          <div style={{ fontSize: 28, color: "#a7abbe", lineHeight: 1.35, maxWidth: 980 }}>
            {(() => {
              const clean = ascii(asset.description);
              return clean.length > 150 ? `${clean.slice(0, 149)}...` : clean;
            })()}
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, fontSize: 24 }}>
          {[
            `${asset.bundleKb.toFixed(1)} KB`,
            `${asset.deps.length === 0 ? "zero dependencies" : `${asset.deps.length} deps`}`,
            `a11y ${asset.a11yScore}`,
            `quality ${asset.qualityScore}`,
            `${asset.copies.toLocaleString()} copies`,
            asset.license,
          ].map((chip) => (
            <span
              key={chip}
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.05)",
                color: "#c9ccdb",
              }}
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    ),
    SIZE,
  );
}
