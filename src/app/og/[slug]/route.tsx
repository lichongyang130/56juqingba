import { ImageResponse } from "next/og";
import { BACKGROUNDS, CHANGELOG, COMPONENTS, PROMPTS, accentHue } from "@/lib/data";
import { LEARN_ARTICLES } from "@/lib/learn";
import { changeLogSlug } from "@/lib/spine";
import { movingDemoKeys } from "@/lib/motion-audit";

// #503–#506 — the share-card route, generalised to every family.
//
// /og/<slug> renders one card per component, prompt, guide and background from
// that record's own numbers, and /og/default is the site-level fallback the
// layout hands to any page without a bespoke card. Same rule as before: a card
// may not say anything the page behind it does not say.
//
// A plain route handler rather than the opengraph-image convention, because the
// convention's URL carries a build hash — useless for a URL written into
// metadata by hand.
//
// 519 — the studio log joined as a fifth family: an entry can be linked and
// quoted on its own, so it can be shared on its own, with its date and tag on
// the card instead of the site fallback.
//
// #10 — a share card is a static PNG, so it can never show the motion the live
// scene has. For an asset whose demo scene drives motion, the card says so in a
// chip — "demo animates · this card is a still" — rather than letting a viewer
// infer that the card froze mid-flight. There is no scene rasteriser in this
// build, so there is no t≠0 frame to worry about: every card is a still by
// construction, and the animated ones are labelled as such. `movingDemoKeys`
// is the same audit the reduced-motion gate reads, so the label and the
// `check:exports` assertion cannot drift apart.

export const dynamic = "force-static";

const SIZE = { width: 1200, height: 630 };

/** Demo keys whose live scene moves, read once from the same audit the
 *  reduced-motion gate uses. */
const MOVING_DEMOS = movingDemoKeys();

/** The still-chip every animated asset's card carries, so a card never implies
 *  motion the image cannot show. Kept a literal so the harness can assert the
 *  route applies it by reading this file. */
const STILL_CHIP = "demo animates · this card is a still";

export function generateStaticParams() {
  return [
    { slug: "default" },
    ...COMPONENTS.map((c) => ({ slug: c.slug })),
    ...PROMPTS.map((p) => ({ slug: p.slug })),
    ...LEARN_ARTICLES.map((a) => ({ slug: a.slug })),
    ...BACKGROUNDS.map((b) => ({ slug: b.slug })),
    ...CHANGELOG.map((e) => ({ slug: changeLogSlug(e) })),
  ];
}

// Satori reaches for a network font when it meets a glyph its bundled face
// lacks; this sandbox has no egress, so non-ASCII is stripped from the fields
// that reach the card. The pages keep their punctuation.
const ascii = (text: string) => text.replace(/[^\x20-\x7e]/g, "").replace(/\s+/g, " ").trim();

interface Card {
  kicker: string;
  title: string;
  body: string;
  chips: string[];
  hue: number;
  foot: string;
}

function cardFor(slug: string): Card | null {
  const component = COMPONENTS.find((c) => c.slug === slug);
  if (component) {
    const moving = MOVING_DEMOS.has(component.demo);
    return {
      kicker: `${component.kind} component`,
      title: component.title,
      body: component.description,
      chips: [
        `${component.bundleKb.toFixed(1)} KB`,
        component.deps.length === 0 ? "zero dependencies" : `${component.deps.length} deps`,
        `a11y ${component.a11yScore}`,
        `quality ${component.qualityScore}`,
        `${component.copies.toLocaleString()} copies`,
        component.license,
        ...(moving ? [STILL_CHIP] : []),
      ],
      hue: accentHue(component.slug),
      foot: "motif · component library",
    };
  }

  const prompt = PROMPTS.find((p) => p.slug === slug);
  if (prompt) {
    return {
      kicker: `${prompt.industry} prompt`,
      title: prompt.title,
      body: `${prompt.vibe}. ${prompt.blocks.length} sections specified, ${prompt.runs.length} recorded runs.`,
      chips: [
        `${prompt.avgFidelity}% fidelity`,
        `best: ${prompt.bestModel}`,
        `${prompt.runs.length} runs`,
        ...prompt.stacks.slice(0, 2),
      ],
      hue: accentHue(prompt.industry),
      foot: "motif · prompt library",
    };
  }

  const guide = LEARN_ARTICLES.find((a) => a.slug === slug);
  if (guide) {
    return {
      kicker: `${guide.kicker} guide`,
      title: guide.title,
      body: guide.deck,
      chips: [`${guide.minutes} min read`, guide.level, ...guide.tags.slice(0, 2), `updated ${guide.updated}`],
      hue: accentHue(guide.tags[0] ?? guide.slug),
      foot: "motif · guides",
    };
  }

  const entry = CHANGELOG.find((e) => changeLogSlug(e) === slug);
  if (entry) {
    return {
      kicker: `studio log · ${entry.tag}`,
      title: entry.title,
      body: entry.body,
      chips: [entry.date, entry.perf ? `${entry.perf.deltaKb.toFixed(1)} KB measured` : "no size figure recorded", entry.perf?.build ?? "written entry"],
      hue: accentHue(entry.tag),
      foot: "motif · studio log",
    };
  }

  const bg = BACKGROUNDS.find((b) => b.slug === slug);
  if (bg) {
    const moving = MOVING_DEMOS.has(bg.demo);
    return {
      kicker: `${bg.category} background`,
      title: bg.title,
      body: bg.description,
      chips: [
        bg.tech.join(" / "),
        `${bg.perf} perf tier`,
        `${bg.bundleKb.toFixed(1)} KB`,
        `${bg.copies.toLocaleString()} copies`,
        bg.themeable ? "themeable" : "fixed palette",
        ...(moving ? [STILL_CHIP] : []),
      ],
      hue: accentHue(bg.category),
      foot: "motif · backgrounds",
    };
  }

  return null;
}

function defaultCard(): Card {
  return {
    kicker: "the open web-craft",
    title: "Motif UI — copy less, ship more",
    body: "Original animated components, AI website prompts with recorded test runs, backgrounds and guides. Every number on the site is read from the catalog at build time.",
    chips: [
      `${COMPONENTS.length} components`,
      `${PROMPTS.length} prompts`,
      `${LEARN_ARTICLES.length} guides`,
      `${BACKGROUNDS.length} backgrounds`,
      "MIT licensed",
    ],
    hue: 262,
    foot: "motifui.dev",
  };
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // An unknown slug falls back to the site card rather than emitting nothing:
  // a broken image in a share preview is worse than a generic one.
  const card = slug === "default" ? defaultCard() : (cardFor(slug) ?? defaultCard());
  const hue = card.hue;

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
            {ascii(card.kicker)}
          </span>
          <span style={{ color: "#8b90a6", fontFamily: "monospace" }}>{card.foot}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>{ascii(card.title)}</div>
          <div style={{ fontSize: 27, color: "#a7abbe", lineHeight: 1.35, maxWidth: 990 }}>
            {(() => {
              const clean = ascii(card.body);
              return clean.length > 150 ? `${clean.slice(0, 149)}...` : clean;
            })()}
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, fontSize: 24 }}>
          {card.chips.map((chip) => (
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
