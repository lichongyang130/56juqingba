// #512 — per-route JavaScript budgets.
//
// The build report has always printed the weight of every route and nothing has
// ever failed because of it. A number that nobody checks is a dashboard; this
// module turns the same numbers into a ratchet.
//
// The unit is "own JS" — the JavaScript a route loads beyond the shared shell —
// because that is the part a change to a page can move. Total JS is reported
// next to it so the shell's own weight stays visible.
//
// Budgets are set from the measured build with roughly 10% headroom, so the
// gate fails on an accident (an import that pulls a demo module onto 80 content
// pages, which has happened on this project) rather than on ordinary work. When
// a route legitimately needs more, the number here changes in the same commit
// as the code, which is the point: the decision is visible in the diff.

export interface RouteBudget {
  /** Route as printed in the build report, e.g. "/components/[slug]". */
  route: string;
  /** Maximum own JS in KB. */
  ownJsKb: number;
  /** Why this route gets this allowance. */
  why: string;
  /** "prefix" matches the route and everything under it. */
  match?: "prefix";
}

export const ROUTE_BUDGETS: RouteBudget[] = [
  {
    route: "/components/[slug]",
    ownJsKb: 730,
    why: "the playground: a demo scene, the theme and property controls, and the read-next rail. The heaviest page on the site by design.",
  },
  { route: "/prompts/[slug]", ownJsKb: 560, why: "prompt viewer with the run log and the copy blocks." },
  { route: "/templates/[slug]", ownJsKb: 560, why: "template page with a composed preview and the file bundle panel." },
  { route: "/admin/*", ownJsKb: 620, why: "the demo consoles are the largest client surfaces; they are also noindex and never a first impression.", match: "prefix" },
  { route: "/lab", ownJsKb: 560, why: "eight interactive tools on one page, each with its own controls." },
  {
    route: "/lab/*",
    ownJsKb: 500,
    match: "prefix",
    why: "the sub-page labs (layers, motion and the rest) each mount one interactive inspector.",
  },
  {
    route: "/pricing",
    ownJsKb: 500,
    why: "the plan comparison renders a live scene, and a live scene is the demo module — see the note on /quality/speed about why one file costs the same as all of them.",
  },
  {
    route: "/shuffle",
    ownJsKb: 500,
    why: "the shuffle view previews scenes, so it pays the same demo-module cost.",
  },
  { route: "/studio", ownJsKb: 120, why: "the token editor mounts its panels lazily, so the route itself stays small." },
  { route: "/search", ownJsKb: 520, why: "client-side search over the whole catalog; the index is the payload." },
  { route: "/components", ownJsKb: 515, why: "catalog index with filters, sort and card previews." },
  { route: "/prompts", ownJsKb: 500, why: "prompt catalog with its own filter set." },
  { route: "/backgrounds", ownJsKb: 500, why: "background catalog with live previews per card." },
  { route: "/templates", ownJsKb: 485, why: "template catalog, previews on demand." },
  { route: "/", ownJsKb: 515, why: "the homepage carries scene previews and the stat band." },
  { route: "/embed/[slug]", ownJsKb: 500, why: "one demo and nothing else — the embed must stay cheap because other sites pay for it." },
  { route: "/admin", ownJsKb: 550, why: "the console index." },
];

/** Routes that are not matched by a rule above must stay under this. */
export const DEFAULT_OWN_JS_KB = 90;

export const DEFAULT_WHY =
  "content pages: markup, prose and links. Anything above this has pulled a client module onto pages that render no interactive surface.";

/** Which budget applies to a route, and whether it matched a rule. */
export function budgetFor(route: string): { limit: number; why: string; rule: string | null } {
  for (const b of ROUTE_BUDGETS) {
    if (b.match === "prefix") {
      const prefix = b.route.replace(/\/\*$/, "");
      if (route === prefix || route.startsWith(`${prefix}/`)) return { limit: b.ownJsKb, why: b.why, rule: b.route };
    } else if (b.route === route) {
      return { limit: b.ownJsKb, why: b.why, rule: b.route };
    }
  }
  return { limit: DEFAULT_OWN_JS_KB, why: DEFAULT_WHY, rule: null };
}

export interface RouteMeasurement {
  url: string;
  ownJsKb?: number;
  totalJsKb?: number;
  htmlKb?: number;
}

export interface BudgetResult {
  checked: number;
  over: { route: string; own: number; limit: number; rule: string | null }[];
  heaviest: { route: string; own: number; limit: number }[];
}

/** Apply every budget to a route table. Used by the export harness and by the
 *  page that publishes the rules, so the two cannot disagree. */
export function applyBudgets(routes: RouteMeasurement[]): BudgetResult {
  const over: BudgetResult["over"] = [];
  for (const r of routes) {
    const own = r.ownJsKb ?? 0;
    const { limit, rule } = budgetFor(r.url);
    if (own > limit) over.push({ route: r.url, own, limit, rule });
  }
  const heaviest = [...routes]
    .sort((a, b) => (b.ownJsKb ?? 0) - (a.ownJsKb ?? 0))
    .slice(0, 8)
    .map((r) => ({ route: r.url, own: r.ownJsKb ?? 0, limit: budgetFor(r.url).limit }));
  return { checked: routes.length, over, heaviest };
}
