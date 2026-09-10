// Section 14 — Pro plans & monetization.
//
// The one rule this file exists to enforce: a price, a licence row or a
// feature state is written down exactly once, and every monetization surface
// on the site reads it from here. The console and the public pages then cannot
// drift from each other, and a claim that needs a server can be labelled as
// such in the same place its price is.
//
// Note: this module is imported by client components, so it must not import
// ./quality-utils (that file reads the repo through node:fs).

import { BACKGROUNDS, CHANGELOG, COMPONENTS, LAB_TOOLS, PROMPTS } from "./data";

/* -------------------------------------------------------------------
   The gap that applies to the whole section
   ------------------------------------------------------------------- */

export const MONEY_GAP =
  "No payment processor is wired into this build. Nothing here can charge a card, store a receipt or email an invoice — every paid surface below is a working demo of the flow, and the prices are this site's own plan copy.";

export const DEMO_CHIP = "demo · no billing attached";

/* -------------------------------------------------------------------
   Feature states — what a Pro bullet actually is in this build
   ------------------------------------------------------------------- */

export type FeatureState = "works-now" | "browser-demo" | "needs-server";

export const FEATURE_STATES: Record<FeatureState, { label: string; chip: string; meaning: string }> = {
  "works-now": {
    label: "Works now",
    chip: "!border-emerald-300/40 !text-emerald-300",
    meaning: "Fully implemented in this static build, no server involved.",
  },
  "browser-demo": {
    label: "Browser demo",
    chip: "!border-cyan-300/40 !text-cyan-200",
    meaning: "Interactive, but the state lives in this browser — it is not an account, and clearing site data removes it.",
  },
  "needs-server": {
    label: "Needs a server",
    chip: "!border-amber-300/40 !text-amber-300",
    meaning: "Described, priced and gated, but impossible to deliver from a static build. The gap is named on the page that shows it.",
  },
};

/* -------------------------------------------------------------------
   Plans — the single price table
   ------------------------------------------------------------------- */

export interface Plan {
  id: string;
  name: string;
  monthly: number;
  yearly?: number;
  blurb: string;
  features: string[];
  cta: string;
  featured: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    monthly: 0,
    blurb: "Everything you need to ship a great personal site.",
    features: [
      "Full library browsing & copying",
      "All element / animated assets",
      "Verified AI prompts (non-Pro packs)",
      "Lab tools: Easing, Spring, Gradient",
      "Public collections",
      "Community submission & badges",
    ],
    cta: "Start free",
    featured: false,
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 19,
    yearly: 129,
    blurb: "For people who build sites for a living.",
    features: [
      "Everything in Free",
      "Prompt test reports & Pro prompt packs",
      "Whole template one-click installs",
      "Theme Studio + saved brand kits",
      "Private collections & API access",
      "Priority review (48h → 6h)",
      "No ads, early features",
    ],
    cta: "Go Pro",
    featured: true,
  },
  {
    id: "team",
    name: "Team",
    monthly: 49,
    yearly: 399,
    blurb: "Shared brand kits and usage for small teams.",
    features: [
      "Everything in Pro, per member",
      "Shared theme tokens & component audits",
      "Admin console for content policy",
      "Usage analytics dashboard",
      "Dedicated support",
    ],
    cta: "Contact us",
    featured: false,
  },
];

export function planOf(id: string): Plan {
  const p = PLANS.find((x) => x.id === id);
  if (!p) throw new Error(`unknown plan: ${id}`);
  return p;
}

/** Annual saving in whole percent, or 0 when there is no yearly price.
 *  Computed from the two prices rather than typed into the copy, so the
 *  percentage on the card cannot disagree with the numbers beside it. */
export function yearlySaving(p: Plan): number {
  if (!p.yearly || p.monthly <= 0) return 0;
  return Math.round((1 - p.yearly / (p.monthly * 12)) * 100);
}

/* -------------------------------------------------------------------
   Pro features — what is promised, what ships, free alternative
   ------------------------------------------------------------------- */

export interface ProFeature {
  id: string;
  name: string;
  promise: string;
  state: FeatureState;
  evidence: string;
  freeAlternative: string;
  needs?: string;
  href?: string;
}

const promptRunCount = PROMPTS.reduce((a, p) => a + p.runs.length, 0);
const promptModels = [...new Set(PROMPTS.flatMap((p) => p.runs.map((r) => r.model)))].length;
const templates = COMPONENTS.filter((c) => c.kind === "template");
const paidLabTools = LAB_TOOLS.filter((t) => !t.free);

export const PRO_FEATURES: ProFeature[] = [
  {
    id: "prompt-reports",
    name: "Per-model prompt test reports",
    promise: "The full run log behind every prompt, across models, with fidelity and build failures.",
    state: "works-now",
    evidence: `${PROMPTS.length} prompts carry ${promptRunCount} runs from ${promptModels} models — and every one of them is already printed on the prompt's own page.`,
    freeAlternative: "The whole run log, on the public prompt page. This build gives it away, which the plan copy below is flagged for.",
    href: "/prompts",
  },
  {
    id: "templates",
    name: "Whole-template installs",
    promise: "One-click install of a complete page template into your project.",
    state: "browser-demo",
    evidence: `${templates.length} templates ship (${templates.map((t) => t.title).join(", ")}); their pages show the structure and the block recipes.`,
    freeAlternative: "Read the template breakdown and copy the blocks you need, free.",
    needs: "an installer that writes into someone else's project — an npm-side tool, not a web page.",
    href: "/templates",
  },
  {
    id: "theme-kits",
    name: "Theme Studio + saved brand kits",
    promise: "Design brand tokens once, remap every component, and keep kits around.",
    state: "browser-demo",
    evidence: `The Studio saves a kit list in this browser and encodes a kit into a share URL. ${paidLabTools.length} lab tool is marked non-free: ${paidLabTools.map((t) => t.title).join(", ")}.`,
    freeAlternative: "Token export to CSS and Tailwind, plus share-by-URL, are free and always were.",
    needs: "accounts, so a kit follows you to another device instead of this browser's storage.",
    href: "/studio",
  },
  {
    id: "api",
    name: "API access",
    promise: "Read the library and write theme kits from your own tooling.",
    state: "needs-server",
    evidence: "The Studio prints the intended response shape. No endpoint is running, and this build has no keys, quotas or revocation.",
    freeAlternative: "Copy the token JSON out of the Studio by hand — the same object the endpoint would return.",
    needs: "a server, key issuance, rate limits and a revocation path before a token means anything.",
    href: "/pro/api",
  },
  {
    id: "priority-review",
    name: "Priority review (48h → 6h)",
    promise: "Community submissions reviewed inside six hours instead of two days.",
    state: "needs-server",
    evidence: "The admin queue is 10 local sample rows in your browser. There is no submissions database, so no submission can be late.",
    freeAlternative: "The public review calendar shows the editorial cadence the team actually aims at.",
    needs: "a submissions table and a reviewer rota — a promise about people, which code alone cannot keep.",
    href: "/quality",
  },
  {
    id: "private-collections",
    name: "Private collections",
    promise: "Collections only you can open.",
    state: "needs-server",
    evidence: "Collections are public URLs by construction in this build; there are no accounts and no access checks anywhere in the code.",
    freeAlternative: "Public collections with stable, shareable URLs.",
    needs: "accounts and an authorisation check on every collection read.",
    href: "/collections",
  },
  {
    id: "usage-analytics",
    name: "Usage analytics dashboard",
    promise: "See how your team uses the library.",
    state: "needs-server",
    evidence: "The console's stats page charts the catalog — 293 dated records — not visitors, because a static build collects nothing.",
    freeAlternative: "The library's own measurements are public on the quality bar.",
    needs: "event logging on the server plus a privacy decision about what is kept.",
    href: "/admin/stats",
  },
  {
    id: "team-seats",
    name: "Team seats & shared kits",
    promise: "Invite teammates and share one brand kit across the team.",
    state: "needs-server",
    evidence: "Seat invites are demonstrated with local state; no invite leaves the browser and no mailbox is involved.",
    freeAlternative: "Share a theme URL — the four token values live in the link itself.",
    needs: "accounts, email delivery and a seat ledger before an invite means anything.",
    href: "/pro/trial",
  },
  {
    id: "support",
    name: "Dedicated support",
    promise: "A named human who answers.",
    state: "needs-server",
    evidence: "This build has no inbox and no support tooling; nothing on the site can open or track a ticket.",
    freeAlternative: "The contributor guides, the audit trail and the public changelog.",
    needs: "a real support channel and a person behind it.",
    href: "/quality",
  },
  {
    id: "no-ads",
    name: "No ads",
    promise: "No ad slots, for anyone.",
    state: "works-now",
    evidence: "No third-party script, tracker or ad slot is loaded anywhere in this build — the pages ship with the site's own bundle only.",
    freeAlternative: "This one is free by construction: there are no ads to remove.",
  },
  {
    id: "early-features",
    name: "Early features",
    promise: "New work reaches paying members first.",
    state: "works-now",
    evidence: `The changelog is public and dated — ${CHANGELOG.length} entries, readable by anyone who opens the page.`,
    freeAlternative: "The same changelog, for everyone, the moment it ships.",
    href: "/#changelog",
  },
];

export function featureOf(id: string): ProFeature {
  const f = PRO_FEATURES.find((x) => x.id === id);
  if (!f) throw new Error(`unknown feature: ${id}`);
  return f;
}

export function featuresByState(state: FeatureState): ProFeature[] {
  return PRO_FEATURES.filter((f) => f.state === state);
}

/* -------------------------------------------------------------------
   #386 — licence clarity
   ------------------------------------------------------------------- */

export interface LicenceRow {
  subject: string;
  licence: string;
  stored: boolean;
  allows: string;
  note: string;
}

/** The catalog stores a `license` field on components only. Rows for other
 *  content types say so rather than extending the licence by assertion. */
export function licenceRows(): LicenceRow[] {
  const mit = COMPONENTS.filter((c) => c.license === "MIT").length;
  const cc = COMPONENTS.filter((c) => c.license !== "MIT").length;
  return [
    {
      subject: "Components & templates",
      licence: "MIT",
      stored: true,
      allows: "Copy, modify, ship commercially, no attribution required. Keep the licence text if you redistribute the code itself.",
      note: `${mit} of ${COMPONENTS.length} components carry license: "MIT" in the catalog${cc ? `, ${cc} carry another licence` : ""} — counted from the data, not typed here.`,
    },
    {
      subject: "Guides & essays",
      licence: "CC BY 4.0",
      stored: true,
      allows: "Quote and republish with credit and a link.",
      note: "Stated by the guides module; the catalog holds no per-article licence field.",
    },
    {
      subject: "Backgrounds",
      licence: "MIT by default",
      stored: false,
      allows: "Same terms as the components, as a site-level policy.",
      note: `${BACKGROUNDS.length} backgrounds exist and none carries a license field in the catalog. Treated as MIT by policy — not a stored fact, so it is labelled that way rather than counted with the MIT rows.`,
    },
    {
      subject: "Lab tools",
      licence: "MIT by default",
      stored: false,
      allows: "Use the exported curves, gradients and reports however you like.",
      note: `${LAB_TOOLS.length} lab tools, ${LAB_TOOLS.filter((t) => t.free).length} free and ${paidLabTools.length} marked Pro. No license field is stored for any of them.`,
    },
    {
      subject: "Brand & name",
      licence: "Reserved",
      stored: false,
      allows: "Nothing — the code licence does not extend to the name or logo.",
      note: "Standard carve-out. Named here because the licence cards would otherwise read as blanket permission.",
    },
  ];
}

/* -------------------------------------------------------------------
   #387 — what "unlimited" means
   ------------------------------------------------------------------- */

export function unlimitedRows() {
  const copies = COMPONENTS.reduce((a, c) => a + c.copies, 0);
  return {
    means: [
      `Copy as many of the ${COMPONENTS.length} components as you want, in as many projects as you want, without an account.`,
      "Modify the code until it fits: no attribution clause, no watermark, no per-project licence key.",
      "Use it in paid client work. The MIT row on the licence page is the whole permission.",
      `Ship on any number of sites — the number that varies is your project count, which nothing here measures.`,
    ],
    doesNotMean: [
      "Unlimited access to the paid surfaces (templates installs, API, saved kits). Those are the Pro row, and they are demos in this build.",
      "Unlimited API calls — there is no API to call, so no quota is being quietly throttled.",
      `Unlimited background textures as a *tracked* allowance: ${BACKGROUNDS.length} backgrounds exist and none is metered.`,
      "Permission to repackage the library as your own competing component library. MIT allows the code; it does not make it yours.",
    ],
    copiesNote: `The catalog shows ${copies.toLocaleString()} copies across the library. That is this site's own rolling count per asset, not a measure of your usage — there is no per-account metering anywhere in the build, and none is possible without accounts.`,
  };
}

/* -------------------------------------------------------------------
   #388 — the 7-day trial, per-feature unlock states
   ------------------------------------------------------------------- */

export interface TrialDay {
  day: number;
  unlock: string;
  state: FeatureState;
  note: string;
}

/** Ordered so the trial walks the honest gradient: implemented things first,
 *  browser-only demos next, and the server-bound promises last. */
export const TRIAL_DAYS: TrialDay[] = [
  { day: 1, unlock: "theme-kits", state: "browser-demo", note: "Save a kit and share its URL. The kit lives in this browser." },
  { day: 2, unlock: "prompt-reports", state: "works-now", note: "Nothing to unlock here: the run logs were already public." },
  { day: 3, unlock: "templates", state: "browser-demo", note: "Template breakdowns open up; the install itself stays a described gap." },
  { day: 4, unlock: "early-features", state: "works-now", note: "The changelog is public, so this day is a reading list." },
  { day: 5, unlock: "api", state: "needs-server", note: "Key minting demo unlocks. It mints a string, not a working credential." },
  { day: 6, unlock: "priority-review", state: "needs-server", note: "Queue position is simulated; there is no queue to be early in." },
  { day: 7, unlock: "team-seats", state: "needs-server", note: "Seat invites are local. The trial ends where a server would have to start." },
];

/* -------------------------------------------------------------------
   #389 — API token mock
   ------------------------------------------------------------------- */

export const API_SCOPES = [
  { id: "read:components", label: "Read components", note: "List and fetch the 107 catalog entries." },
  { id: "read:prompts", label: "Read prompts", note: "Prompt bodies plus their run logs." },
  { id: "read:themes", label: "Read themes", note: "Fetch token kits saved by the account." },
  { id: "write:themes", label: "Write themes", note: "Create or replace a kit. The only write scope offered." },
  { id: "read:runs", label: "Read run reports", note: "Per-model fidelity and build-error history." },
] as const;

export const TOKEN_PREFIX = "mto_demo_";

/** Deterministic, offline token minting for the demo. FNV-1a over the payload,
 *  rendered base36 — no crypto import, identical on server and client, and the
 *  `mto_demo_` prefix means a leaked screenshot cannot be mistaken for a live
 *  credential. */
export function mintDemoToken(label: string, scopes: readonly string[]): string {
  const payload = `${label.trim().toLowerCase()}|${[...scopes].sort().join(",")}`;
  let h = 0x811c9dc5;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  let h2 = 0x811c9dc5;
  for (let i = payload.length - 1; i >= 0; i--) {
    h2 ^= payload.charCodeAt(i);
    h2 = Math.imul(h2, 0x01000193) >>> 0;
  }
  const body = h.toString(36).padStart(7, "0") + h2.toString(36).padStart(7, "0");
  return `${TOKEN_PREFIX}${body.slice(0, 14)}`;
}

/* -------------------------------------------------------------------
   #391 — bundle vs ala-carte
   ------------------------------------------------------------------- */

export interface Pack {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
  unit: string;
  note: string;
}

export const PACKS: Pack[] = [
  {
    id: "templates",
    name: "Template installs",
    unitPrice: 12,
    quantity: templates.length,
    unit: "per template",
    note: `${templates.length} templates exist, so this line can only ever be ${templates.length} units.`,
  },
  {
    id: "kits",
    name: "Saved theme kits",
    unitPrice: 6,
    quantity: 3,
    unit: "per kit",
    note: "Priced as a three-kit brand set because that is a realistic brand refresh, not a technical limit.",
  },
  {
    id: "api",
    name: "API access",
    unitPrice: 9,
    quantity: 1,
    unit: "per month",
    note: "Needs a server. Priced here so the meter can compare it to the bundle.",
  },
  {
    id: "priority",
    name: "Priority review",
    unitPrice: 15,
    quantity: 1,
    unit: "per month",
    note: "Also needs a server and a reviewer. Included because leaving a paid feature out of a cost meter would be the dishonest version.",
  },
];

export interface BundleMath {
  lines: { pack: Pack; total: number }[];
  alaCarte: number;
  bundleMonthly: number;
  difference: number;
  verdict: string;
  /** The idea-bank pack this build deliberately does not sell, with the reason. */
  unsold: string;
}

export function bundleMath(selected: string[]): BundleMath {
  const chosen = PACKS.filter((p) => selected.includes(p.id));
  const lines = chosen.map((pack) => ({ pack, total: pack.unitPrice * pack.quantity }));
  const alaCarte = lines.reduce((a, l) => a + l.total, 0);
  const bundleMonthly = planOf("pro").monthly;
  const difference = alaCarte - bundleMonthly;
  const verdict =
    lines.length === 0
      ? "Pick at least one pack to compare."
      : difference > 0
        ? `Ala-carte costs $${difference} more than one month of Pro ($${bundleMonthly}). Pro is the cheaper month if you would buy most of this.`
        : difference === 0
          ? `The two paths cost the same this month ($${bundleMonthly}).`
          : `Ala-carte is $${Math.abs(difference)} cheaper than a month of Pro — buying one thing you actually need beats a bundle you partly ignore.`;
  return {
    lines,
    alaCarte,
    bundleMonthly,
    difference,
    verdict,
    unsold: `${PROMPTS.length} prompts across ${new Set(PROMPTS.map((p) => p.industry)).size} industries: a "prompt pack per sector" would sell about one prompt at a time, so this build does not price them as packs.`,
  };
}

/* -------------------------------------------------------------------
   The pricing-page audit
   ------------------------------------------------------------------- */

export interface PricingClaim {
  claim: string;
  verdict: "already free here" | "works in this build" | "browser demo" | "needs a server";
  evidence: string;
  href: string;
}

/** Every Pro bullet on the pricing page, checked against what the build
 *  actually does. The page prints this table next to the plan cards so a
 *  visitor can see which promises are already free — including the ones the
 *  plan copy inherited from the idea bank. */
export const PRICING_AUDIT: PricingClaim[] = [
  {
    claim: "Prompt test reports",
    verdict: "already free here",
    evidence: `${promptRunCount} runs across ${promptModels} models are printed on all ${PROMPTS.length} prompt pages, no account involved.`,
    href: "/prompts",
  },
  {
    claim: "Pro prompt packs",
    verdict: "already free here",
    evidence: "Every prompt body is published in full, with the industry, the blocks and the run log.",
    href: "/prompts",
  },
  {
    claim: "Whole template one-click installs",
    verdict: "browser demo",
    evidence: `${templates.length} templates ship with their structure exposed; there is no installer that writes into your project.`,
    href: "/templates",
  },
  {
    claim: "Theme Studio + saved brand kits",
    verdict: "browser demo",
    evidence: "The Studio saves up to 8 kits in this browser and shares one by URL; nothing syncs.",
    href: "/studio",
  },
  {
    claim: "Private collections & API access",
    verdict: "needs a server",
    evidence: "Collections are public URLs, there are no accounts, and no API endpoint exists.",
    href: "/collections",
  },
  {
    claim: "Priority review (48h → 6h)",
    verdict: "needs a server",
    evidence: "The review queue is 10 local sample rows; no submission can be late because none is received.",
    href: "/admin/moderation",
  },
  {
    claim: "No ads, early features",
    verdict: "works in this build",
    evidence: `No ad or tracker script is loaded anywhere, and the changelog (${CHANGELOG.length} dated entries) is public to everyone.`,
    href: "/#changelog",
  },
  {
    claim: "Shared theme tokens & component audits (Team)",
    verdict: "browser demo",
    evidence: "Audits are public pages; sharing is a URL. No seat or permission model exists.",
    href: "/quality",
  },
  {
    claim: "Admin console for content policy (Team)",
    verdict: "browser demo",
    evidence: "The console is a real interface over local demo data — 10 sample moderation rows, decisions in this browser.",
    href: "/admin",
  },
  {
    claim: "Usage analytics dashboard (Team)",
    verdict: "needs a server",
    evidence: "The console charts the catalog (293 dated records), not people; a static build records no visits.",
    href: "/admin/stats",
  },
  {
    claim: "Dedicated support (Team)",
    verdict: "needs a server",
    evidence: "No inbox, no ticket tooling, no contact address is wired into the build. The contact card that says so ships with the next batch of this section.",
    href: "/quality",
  },
];

export function auditSummary() {
  const counts = PRICING_AUDIT.reduce<Record<string, number>>((a, c) => {
    a[c.verdict] = (a[c.verdict] ?? 0) + 1;
    return a;
  }, {});
  return { counts, total: PRICING_AUDIT.length };
}
