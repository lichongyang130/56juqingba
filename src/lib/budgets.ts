// #512 — per-route JavaScript budgets.
//
// The build report has always printed the weight of every route and nothing has
// ever failed because of it. A number that nobody checks is a dashboard; this
// module turns the same numbers into a ratchet.
//
// The unit is "own JS" — the JavaScript a route loads on top of the file set
// the most other routes share — because that is the part a change to a page can
// move. Total JS is reported next to it so the shell's own weight stays visible.
//
// Budgets are set from the measured build with roughly a third of headroom, so
// the gate fails on an accident (an import that pulls a demo module onto 80
// content pages, which has happened on this project) rather than on ordinary
// work. When a route legitimately needs more, the number here changes in the
// same commit as the code, which is the point: the decision is visible in the
// diff.
//
// These limits were re-cut after the demo scenes moved into on-demand modules.
// Until then a page that rendered one scene paid for all 162 of them, and the
// limits had been set around that cost — a component page was allowed 730 KB
// because it measured 666. It now measures 250 KB of own JS, so 730 would have
// been a limit in name only. Every number below is the measured build of batch
// 85 plus headroom.

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
    ownJsKb: 330,
    why: "the playground: a demo scene, the theme and property controls, the read-next rail and the scenes that rail previews. Still the heaviest page on the site by design.",
  },
  {
    route: "/admin/*",
    ownJsKb: 260,
    why: "the demo consoles are the largest client surfaces; they are also noindex and never a first impression.",
    match: "prefix",
  },
  { route: "/lab", ownJsKb: 140, why: "eight interactive tools on one page, each with its own controls." },
  { route: "/studio", ownJsKb: 120, why: "the token editor mounts its panels lazily, so the route itself stays small." },
  { route: "/prompts/[slug]", ownJsKb: 110, why: "prompt viewer with the run log, the copy blocks and one preview scene." },
  { route: "/search", ownJsKb: 95, why: "client-side search over the whole catalog; the index is the payload." },
  { route: "/", ownJsKb: 95, why: "the homepage carries scene previews and the stat band." },
  { route: "/components", ownJsKb: 95, why: "catalog index with filters, sort and lazy card previews." },
  { route: "/prompts", ownJsKb: 80, why: "prompt catalog with its own filter set." },
  { route: "/backgrounds", ownJsKb: 80, why: "background catalog with live previews per card." },
  { route: "/shuffle", ownJsKb: 80, why: "the shuffle view previews scenes, so it pays for the scenes it shows and not for the rest." },
  { route: "/pricing", ownJsKb: 80, why: "the plan comparison renders a live scene; that scene is now the only scene code it loads." },
  { route: "/embed/[slug]", ownJsKb: 70, why: "one demo and nothing else — the embed must stay cheap because other sites pay for it." },
];

/** Routes that are not matched by a rule above must stay under this. */
export const DEFAULT_OWN_JS_KB = 70;

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
