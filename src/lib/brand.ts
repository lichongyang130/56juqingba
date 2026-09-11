// #484–#491 — brand & launch material.
//
// Everything in this module is original, drawn here in markup rather than
// imported, so the wallpapers and the badge are inspectable source instead of
// binary blobs nobody can audit. The SVG strings are also served as real files
// by /api/brand/[slug], which means the page and the download cannot drift.

export interface Wallpaper {
  slug: string;
  title: string;
  note: string;
  ratio: string;
  svg: string;
}

const grad = (id: string, from = "#8b5cf6", mid = "#6366f1", to = "#22d3ee") => `
    <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="${from}" />
      <stop offset="0.55" stop-color="${mid}" />
      <stop offset="1" stop-color="${to}" />
    </linearGradient>`;

const dots = (() => {
  const out: string[] = [];
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 16; x++) {
      const big = (x + y) % 4 === 0;
      out.push(
        `<circle cx="${90 + x * 72}" cy="${80 + y * 72}" r="${big ? 13 : 6}" fill="url(#g)" opacity="${big ? 0.9 : 0.22}" />`,
      );
    }
  }
  return out.join("\n      ");
})();

export const WALLPAPERS: Wallpaper[] = [
  {
    slug: "dots-4k",
    title: "Dot field",
    ratio: "2560 × 1440",
    note: "The logo's dot, repeated on an 8×16 field, every fourth one lit at full strength. Built from the same 6-unit geometry as the mark.",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700" width="2560" height="1440">
  <defs>${grad("g")}</defs>
  <rect width="1200" height="700" fill="#08090f" />
  <g>
      ${dots}
  </g>
</svg>`,
  },
  {
    slug: "ribbon-light",
    title: "Gradient ribbon",
    ratio: "2560 × 1440",
    note: "The accent gradient as a single diagonal band with a soft edge — the header glow, frozen.",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700" width="2560" height="1440">
  <defs>
    ${grad("band")}
    <filter id="soft"><feGaussianBlur stdDeviation="38" /></filter>
  </defs>
  <rect width="1200" height="700" fill="#08090f" />
  <rect x="-200" y="180" width="1600" height="220" fill="url(#band)" opacity="0.55" filter="url(#soft)" transform="rotate(-14 600 350)" />
  <rect x="-200" y="300" width="1600" height="90" fill="url(#band)" opacity="0.85" transform="rotate(-14 600 350)" />
</svg>`,
  },
  {
    slug: "type-quiet",
    title: "Quiet type",
    ratio: "2560 × 1440",
    note: "The tagline set once, large, on the dark ground — for a screen you look at all day rather than a poster you glance at.",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700" width="2560" height="1440">
  <defs>${grad("t")}</defs>
  <rect width="1200" height="700" fill="#08090f" />
  <text x="90" y="330" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="96" font-weight="800" fill="#e8e9f2" letter-spacing="-3">Copy less.</text>
  <text x="90" y="440" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="96" font-weight="800" fill="url(#t)" letter-spacing="-3">Ship more.</text>
  <rect x="92" y="500" width="120" height="6" rx="3" fill="url(#t)" />
  <text x="92" y="560" font-family="ui-monospace, monospace" font-size="20" fill="#6b7085">motifui.dev · original assets, MIT</text>
</svg>`,
  },
];

/** The optional badge. Deliberately plain: one frame, one dot, a line of text. */
export const WATERMARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 40" width="190" height="40">
  <rect x="0.5" y="0.5" width="189" height="39" rx="19.5" fill="#08090f" stroke="#2a2c3c" />
  <g transform="translate(12 6)">
    <rect x="0.5" y="0.5" width="27" height="27" rx="8" fill="none" stroke="#8b5cf6" stroke-width="2" />
    <rect x="6" y="6" width="6" height="6" rx="2" fill="#8b5cf6" />
    <rect x="16" y="16" width="6" height="6" rx="2" fill="#22d3ee" opacity="0.7" />
  </g>
  <text x="50" y="26" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="13" font-weight="600" fill="#e8e9f2">Made with Motif</text>
</svg>`;

export const WATERMARK_HTML = `<a href="https://motifui.dev" rel="noopener">
  <img src="https://motifui.dev/api/brand/badge" alt="Made with Motif UI" width="190" height="40" />
</a>`;

export interface LaunchItem {
  area: string;
  item: string;
  state: "shipped" | "deliberate" | "open";
  detail: string;
  evidence?: { label: string; href: string };
}

/** The real pre-launch list: what shipped, what was deliberately left out, and
 *  the two things still open. Anything marked shipped points at the surface
 *  that proves it. */
export const LAUNCH_ITEMS: LaunchItem[] = [
  {
    area: "Content",
    item: "Every asset has a page, an original description and a runnable demo",
    state: "shipped",
    detail: "133 components, 74 prompts, 33 backgrounds — each with a detail page and a demo that mounts in place.",
    evidence: { label: "the catalog", href: "/components" },
  },
  {
    area: "Content",
    item: "Copy passes the tone lint with no live overclaim hits",
    state: "shipped",
    detail: "The voice guide's banned list is the same dictionary the harness scans the public prose with.",
    evidence: { label: "voice guide", href: "/brand/voice" },
  },
  {
    area: "Trust",
    item: "No number on the site is invented",
    state: "shipped",
    detail: "Counters come from the data file, sizes from the build report, and gaps say 'not measured' instead of borrowing a score.",
    evidence: { label: "open metrics", href: "/metrics" },
  },
  {
    area: "Trust",
    item: "The admin console is labelled a demo",
    state: "shipped",
    detail: "It runs on localStorage, feeds nothing, and says so on every panel that could be mistaken for live data.",
  },
  {
    area: "Access",
    item: "Keyboard walk: every interactive surface reachable, focus always visible",
    state: "shipped",
    detail: "Audited per asset; the catalog's banded scores are published rather than summarised.",
    evidence: { label: "audit register", href: "/quality" },
  },
  {
    area: "Access",
    item: "Reduced-motion handling is global and cannot be forgotten",
    state: "shipped",
    detail: "A stylesheet-level rule with 0.001ms rather than animation:none, so end states are preserved.",
    evidence: { label: "craft notes", href: "/quality/craft" },
  },
  {
    area: "Crawl",
    item: "Sitemap, robots and canonicals agree with the catalog",
    state: "shipped",
    detail: "The export harness compares the sitemap's component count against the catalog at build time.",
    evidence: { label: "crawl surface", href: "/quality/crawl" },
  },
  {
    area: "Deliberately out",
    item: "No accounts, no newsletter, no waitlist",
    state: "deliberate",
    detail: "A demo signup would need fake data behind it. Until there is a reason and a backend, the button is the honest thing to omit.",
  },
  {
    area: "Deliberately out",
    item: "No analytics, no cookies, no third-party tags",
    state: "deliberate",
    detail: "Nothing here counts visitors, which is also why no page-view number appears on the metrics page.",
    evidence: { label: "why", href: "/metrics" },
  },
  {
    area: "Deliberately out",
    item: "No paid tier pretending to exist",
    state: "deliberate",
    detail: "The Pro pages describe what is built and mark the rest as not built; nothing takes a card.",
  },
  {
    area: "Open",
    item: "A Lighthouse run on a real machine, published with its config",
    state: "open",
    detail: "No browser runtime was available to produce one; the speed page prints kilobytes and names the gap.",
    evidence: { label: "speed story", href: "/quality/speed" },
  },
  {
    area: "Open",
    item: "A second measurement series to make the deltas a trend",
    state: "open",
    detail: "The changelog records size deltas per build; a weekly series would turn those into evidence rather than snapshots.",
  },
];
