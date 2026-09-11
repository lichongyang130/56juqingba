// #492–#501 — the north-star bets, with their real status.
//
// This section of the ledger is "beyond the MVP": things that need a backend,
// a store, or a second person. The honest response is not to fake them but to
// write down what exists today, the first slice that would make each real, what
// it would cost, and the one thing each would have to refuse — and to build the
// slices that need no server (those are marked `live` and point at the code).

export type BetStatus = "live" | "partial" | "spec";

export interface Bet {
  n: number;
  slug: string;
  title: string;
  status: BetStatus;
  /** What a reader can use or see right now. */
  today: string;
  /** The smallest real version, stated as work rather than ambition. */
  slice: string;
  /** The bill: what it needs before it could be called done. */
  cost: string;
  /** The line this bet must not cross, given how the rest of the site is built. */
  refuse: string;
  links?: { label: string; href: string }[];
}

export const BETS: Bet[] = [
  {
    n: 1,
    slug: "accounts",
    title: "Real accounts & favourites backend",
    status: "spec",
    today:
      "Favourites, stacks and the admin console run on localStorage and say so on every panel. Nothing is persisted and nothing is sent anywhere.",
    slice:
      "One table, one cookie: `favourites(user_id, asset_slug, created_at)` plus an email-less session. The UI already exists; only the write path changes.",
    cost:
      "A database, a session strategy, a privacy page that mentions storage, and a deletion path. Roughly the first two weeks of a real backend.",
    refuse:
      "Social sign-in buttons that do not work, and 'sign in with Google' as a decoration. If the button exists, the flow must complete.",
    links: [{ label: "what the console is today", href: "/integrations" }],
  },
  {
    n: 2,
    slug: "prompt-reruns",
    title: "Prompt re-run service",
    status: "spec",
    today: "221 recorded runs across 74 prompts, each with a fidelity score and notes — all of it static data, none of it live.",
    slice: "A queue and a worker: submit a prompt id, get a job id, stream the model log back over SSE. The run log UI already exists in the scoreboard.",
    cost: "Model keys and a spend cap per visitor, plus a queue that can be killed. Prompt runs cost money the moment they are real.",
    refuse:
      "A 'run' button that returns canned output. If the service is down the page must say so, not simulate a result.",
    links: [{ label: "the scoreboard", href: "/prompts" }],
  },
  {
    n: 3,
    slug: "theme-studio",
    title: "Theme Studio as a product",
    status: "partial",
    today:
      "The Studio edits every token, previews live and exports CSS, Tailwind config and JSON. It runs entirely in the browser — reload and your theme is gone.",
    slice: "Persist named themes to localStorage with export/import, then to the accounts backend when it exists. The save button is the missing product.",
    cost: "Storage and conflict handling, plus a paid tier if themes become the flagship — which needs billing, which needs accounts.",
    refuse: "Paywalling the token export that already works today.",
    links: [
      { label: "open the Studio", href: "/studio" },
      { label: "what it exports", href: "/integrations" },
    ],
  },
  {
    n: 4,
    slug: "component-api",
    title: "Component API (JSON)",
    status: "live",
    today:
      "GET /api/v1/components/<slug> serves one asset as data: kind, tags, behaviours, stack, dependencies, size, scores, licence, version, published date, props and its changelog version — read from the same record the page renders.",
    slice: "Shipped — this one needed no server. Prerendered for all 133 assets, so it is a file read, not a query.",
    cost: "A versioned schema and a deprecation policy, which starts the day somebody builds against it.",
    refuse:
      "Serving a 'code' field that is not the code the demo runs. Until the source is exposed per asset, the API points at the page rather than inventing a snippet.",
    links: [
      { label: "example: halo-button", href: "/api/v1/components/halo-button" },
      { label: "the full catalog export", href: "/api/exports/catalog.json" },
    ],
  },
  {
    n: 5,
    slug: "audit-api",
    title: "Public audit API",
    status: "live",
    today:
      "GET /api/v1/audit returns every asset's automated a11y score, editorial quality score, size and dependency count, plus the banded distribution — the same numbers /quality prints.",
    slice: "Shipped. One JSON document, generated at build time from the catalog, so a reader can verify a claim without scraping HTML.",
    cost: "A stable field contract and a note pinned to the build id, both of which are cheap once the endpoint exists.",
    refuse: "A score the page and the API could disagree about — both are built from one function.",
    links: [
      { label: "audit register", href: "/quality" },
      { label: "the JSON", href: "/api/v1/audit" },
    ],
  },
  {
    n: 6,
    slug: "embed-sdk",
    title: "Share / embed SDK",
    status: "live",
    today:
      "/embed.js is one file: it finds [data-motif-embed='<slug>'] and replaces the placeholder with the existing /embed/<slug> iframe, at the height the embed reports. No framework, no dependencies, ~1 KB.",
    slice: "Shipped. The iframe route already existed; the SDK is the one-tag wrapper around it, and this page runs it live.",
    cost: "A versioning policy if the attribute name ever changes — handled by never changing it: new options arrive as new attributes.",
    refuse: "Injecting analytics or a backlink into somebody else's page. The script writes an iframe; nothing else.",
    links: [
      { label: "the SDK page", href: "/roadmap/embed" },
      { label: "the script", href: "/embed.js" },
    ],
  },
  {
    n: 7,
    slug: "moderation-marketplace",
    title: "Community moderation marketplace",
    status: "spec",
    today: "An admin moderation console runs on demo data, and every asset carries an editorial quality score with a stated rubric.",
    slice: "External reviewers claim a queue item, submit a rubric-scored review, and earn a Pro month when two reviews agree. Needs accounts and a payout ledger.",
    cost: "Identity, conflict-of-interest rules, and a payment path. The expensive part is not the marketplace, it is the dispute handling.",
    refuse: "Paying per approval. A reward for saying yes is a reward for saying yes.",
    links: [{ label: "the quality rubric", href: "/quality" }],
  },
  {
    n: 8,
    slug: "certificates",
    title: "Learn certificates",
    status: "spec",
    today: "Reading paths exist, and progress through them is tracked locally in the browser. There is no account, so there is nothing to certify against.",
    slice: "An SVG certificate rendered from locally stored progress, printed with 'self-issued, unverifiable' until a real issuer exists, then replaced by a signed credential.",
    cost: "A verification endpoint and an identity — the artwork is the easy half.",
    refuse: "A badge that looks verified when it is self-asserted. The label is part of the design, not a disclaimer bolted on.",
    links: [{ label: "the guides", href: "/learn" }],
  },
  {
    n: 9,
    slug: "desktop-helper",
    title: "Desktop helper app",
    status: "spec",
    today: "The CLI script and the VS Code snippets already work, and the catalog JSON is served as a file.",
    slice: "A tray app that watches the clipboard for a component URL and shows its snippet — a wrapper around the existing CLI, not a new index.",
    cost: "Code signing on three platforms and an update channel. This is the most expensive bet per unit of value on the list.",
    refuse: "Bundling the catalog. The app would fetch, cache and expire — a bundled index is stale the day after release.",
    links: [{ label: "the CLI", href: "/integrations/cli" }],
  },
  {
    n: 10,
    slug: "open-book",
    title: "Open book",
    status: "live",
    today:
      "The playbook is already public: the quality register, the craft excerpts, the speed story, the open metrics page, the voice guide, the launch checklist and the build notes are all on the site, with the numbers they cite.",
    slice: "Shipped as the site itself — and the one addition an open book deserves is a weekly measurement series, which is listed as still open on the launch page.",
    cost: "Discipline: every new claim has to keep pointing at a surface that can be checked.",
    refuse: "Turning the playbook into a lead magnet. The moment it needs an email, it stops being an open book.",
    links: [
      { label: "open metrics", href: "/metrics" },
      { label: "build notes", href: "/brand/notes" },
      { label: "launch checklist", href: "/brand/launch" },
    ],
  },
];

export const BETS_LIVE = BETS.filter((b) => b.status === "live").length;
export const BETS_PARTIAL = BETS.filter((b) => b.status === "partial").length;
export const BETS_SPEC = BETS.filter((b) => b.status === "spec").length;
