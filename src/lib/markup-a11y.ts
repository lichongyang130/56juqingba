// #507 / #513 — the markup accessibility pass, implemented once.
//
// Three callers need the same answer: the page that publishes the counts
// (/quality/aria), the harness that fails a run when a rule breaks, and the CLI
// used while working on the site. Each used to keep its own copy of the rules,
// and they drifted in exactly the way duplicated rules do — one counted a
// document the others skipped, so the page reported an open finding the harness
// called clean. The rules now live here and the three callers read them.
//
// The pass decides only what markup can decide. Everything that needs a browser
// (focus order, contrast in context, what a screen reader says) is listed as a
// manual check on the page instead of being guessed at.
//
// Two entry points, one rule set:
//   scanBuiltHtml(root)      — every document a build wrote, read from disk
//   scanServedSitemap(base)  — every URL the sitemap lists, read over HTTP
// The second exists because pages rendered on demand (/components/<slug> and
// friends) have no HTML on disk between requests; without it, a third of the
// site would never be checked.

import fs from "node:fs";
import path from "node:path";

export interface MarkupIssue {
  kind: string;
  page: string;
  detail: string;
}

export interface MarkupFallback {
  file: string;
  why: string;
}

export interface MarkupScan {
  /** Page documents: what a visitor can reach. */
  documents: number;
  /** Documents Next writes for its own error paths. They are not pages. */
  fallbacks: MarkupFallback[];
  issues: MarkupIssue[];
  byKind: Record<string, number>;
  /** How the documents were read, so the page can say where the numbers come from. */
  source: string;
}

/** The checks this pass performs, named so the page can list them with counts. */
export const MARKUP_CHECKS: { id: string; what: string }[] = [
  { id: "img-no-alt", what: "an <img> with no alt attribute" },
  { id: "button-no-name", what: "a button with no text, aria-label or title, outside an aria-hidden subtree" },
  { id: "link-no-name", what: "a link with no text and no accessible name" },
  { id: "input-no-label", what: "a form control with no label, aria-label or explicit label association" },
  { id: "duplicate-id", what: "two elements sharing an id in one document" },
  { id: "heading-skip", what: "a heading that jumps down more than one level" },
  { id: "no-lang", what: "a document with no lang attribute on <html>" },
  { id: "hidden-focusable", what: "a focusable control inside an aria-hidden subtree — hidden from the tree but still reachable by Tab" },
  { id: "aria-ref-missing", what: "an aria-labelledby/describedby/controls/… pointing at an id that is not in the document" },
  { id: "role-not-focusable", what: "an operable role (button, switch, slider…) on an element that cannot take focus — no tabindex, not a native control, not inside a closed popup" },
  { id: "aria-state-invalid", what: "an aria-expanded/checked/selected/pressed/current value the spec does not allow" },
  { id: "role-missing-prop", what: "a role that requires a value property (slider, tab, switch…) without one" },
];

/**
 * Roles that are operable on their own, so an element carrying one has to be
 * reachable by keyboard. Deliberately not the whole list of interactive roles:
 * `option`, `tab` and the menu-item variants live inside a listbox, tablist or
 * menu where focus is either roving or held by the container and pointed at with
 * aria-activedescendant. An option that cannot be tabbed to is the pattern
 * working, not a defect — the combobox scene here does exactly that.
 */
const FOCUSABLE_ROLES = ["button", "link", "menuitem", "switch", "checkbox", "radio", "combobox", "textbox", "slider"];

/** Roles whose spec requires a value property to be usable. */
const ROLE_REQUIRED_PROP: Record<string, string> = {
  slider: "aria-valuenow",
  spinbutton: "aria-valuenow",
  progressbar: "aria-valuenow",
  tab: "aria-selected",
  option: "aria-selected",
  checkbox: "aria-checked",
  switch: "aria-checked",
  radio: "aria-checked",
};

const ARIA_REFS = ["aria-labelledby", "aria-describedby", "aria-controls", "aria-owns", "aria-activedescendant", "aria-details", "aria-errormessage"];

const ARIA_STATES: Record<string, string[]> = {
  "aria-expanded": ["true", "false"],
  "aria-selected": ["true", "false"],
  "aria-checked": ["true", "false", "mixed"],
  "aria-pressed": ["true", "false", "mixed"],
  "aria-current": ["page", "step", "location", "date", "time", "true", "false"],
  "aria-hidden": ["true", "false"],
  "aria-disabled": ["true", "false"],
  "aria-invalid": ["true", "false", "grammar", "spelling"],
};

const VOID_ELEMENTS = new Set([
  "img", "input", "br", "hr", "meta", "link", "source", "area", "base", "col", "embed", "param", "track", "wbr",
  "path", "circle", "rect", "line", "polyline", "polygon", "ellipse", "stop", "use", "animate", "animatetransform", "feblend", "fegaussianblur", "feturbulence",
]);

/**
 * Is this file one of Next's own documents rather than a page of the site?
 *
 * Two markers, both from the build output: the global error shell is written as
 * `_global-error.html`, and a path Next refused to prerender is written as an
 * HTML document whose root element carries `id="__next_error__"`. The second one
 * is the subtle case: it lands in the output directory, it is a full HTML
 * document, and counting it inflates "documents scanned" while reporting a
 * missing-lang finding against a slug that is not a route any more.
 */
export function nextFallbackDocument(file: string, html: string): string | null {
  if (file.endsWith("_global-error.html")) return "Next's global error shell";
  if (/<html[^>]*id="__next_error__"/.test(html)) return "a path the build refused to prerender";
  return null;
}

const textOf = (frag: string) =>
  frag
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;|&#\d+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Every rule, applied to one document. */
export function scanDocument(html: string, name: string): MarkupIssue[] {
  const issues: MarkupIssue[] = [];
  const add = (kind: string, detail: string) => issues.push({ kind, page: name, detail });

  // The flight payload repeats the markup; the checks below are about the
  // document, so only the rendered HTML is examined.
  const head = html.split("<script>self.__next_f")[0];
  const wrapped = (index: number) => {
    const before = head.slice(0, index);
    return (before.match(/<label\b/g) || []).length > (before.match(/<\/label>/g) || []).length;
  };

  if (!/<html[^>]+lang="/.test(html)) add("no-lang", "");

  for (const m of head.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt=/.test(m[0])) add("img-no-alt", m[0].slice(0, 90));
  }

  for (const m of head.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)) {
    if (/aria-hidden="true"|aria-label|aria-labelledby|title=/.test(m[1])) continue;
    if (textOf(m[2])) continue;
    add("button-no-name", m[0].replace(/\s+/g, " ").slice(0, 90));
  }

  for (const m of head.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
    if (/aria-hidden="true"|aria-label|aria-labelledby|title=/.test(m[1])) continue;
    if (/<img[^>]+alt="[^"]+"/.test(m[2])) continue;
    if (textOf(m[2])) continue;
    add("link-no-name", m[0].replace(/\s+/g, " ").slice(0, 90));
  }

  for (const m of head.matchAll(/<(input|select|textarea)\b([^>]*)>/g)) {
    const attrs = m[2];
    if (/type="(hidden|submit|button|reset|image)"/.test(attrs)) continue;
    if (/aria-hidden="true"|aria-label|aria-labelledby/.test(attrs)) continue;
    if (wrapped(m.index ?? 0)) continue;
    const id = (attrs.match(/\sid="([^"]+)"/) || [])[1];
    if (id && new RegExp(`<label[^>]+for="${id}"`).test(head)) continue;
    add("input-no-label", m[0].replace(/\s+/g, " ").slice(0, 90));
  }

  const ids = new Set([...head.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const visibleIds = [...ids].filter((id) => !id.startsWith("__"));
  const dupes = visibleIds.filter((id, i) => visibleIds.indexOf(id) !== i);
  if (dupes.length) add("duplicate-id", [...new Set(dupes)].slice(0, 4).join(", "));

  const levels = [...head.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) {
      add("heading-skip", `h${levels[i - 1]} then h${levels[i]}`);
      break;
    }
  }

  // ---- element-level rules -------------------------------------------------
  // One walk of the tags, because two of the rules need to know whether an
  // element sits inside an aria-hidden="true" subtree, and one pass with a
  // stack is the only way to answer that without a DOM.
  const stack: { name: string; hidden: boolean; hiddenAttr: boolean }[] = [];
  for (const m of head.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b([^>]*?)(\/?)>/g)) {
    const [, close, rawName, attrs, selfClose] = m;
    const name_ = rawName.toLowerCase();
    if (close) {
      const at = stack.map((s) => s.name).lastIndexOf(name_);
      if (at >= 0) stack.splice(at);
      continue;
    }

    const tag = m[0];
    const parentHidden = stack.some((s) => s.hidden);
    const hidden = /(?:^|\s)aria-hidden="true"/.test(attrs) || parentHidden;
    // Inside `hidden` the element is not rendered, so "it cannot take focus" is
    // not a finding: the closed state of a popup is full of those.
    const hiddenAttr = /(?:^|\s)hidden(?:[\s>=]|$)/.test(attrs) || stack.some((s) => s.hiddenAttr);

    const nativeFocusable =
      (name_ === "a" && /\shref=/.test(attrs)) ||
      ["button", "select", "textarea", "iframe", "audio", "video", "details", "summary"].includes(name_) ||
      (name_ === "input" && !/type="hidden"/.test(attrs));
    const tabIndex = (attrs.match(/\stabindex="(-?\d+)"/) || [])[1];
    const focusable = nativeFocusable ? tabIndex !== "-1" && !/\sdisabled/.test(attrs) : Number(tabIndex ?? -1) >= 0;

    // a control that is hidden from the accessibility tree but still in the tab
    // order: a screen-reader user is told nothing and lands on it anyway.
    if (hidden && focusable) add("hidden-focusable", tag.replace(/\s+/g, " ").slice(0, 90));

    // references that point at nothing — a labelledby to a removed id is a
    // control with no name as far as the browser is concerned.
    for (const ref of ARIA_REFS) {
      const value = (attrs.match(new RegExp(`${ref}="([^"]*)"`)) || [])[1];
      if (!value) continue;
      for (const id of value.split(/\s+/).filter(Boolean)) {
        if (!ids.has(id)) add("aria-ref-missing", `${ref}="${id}"`);
      }
    }

    // an interactive role on something that cannot be reached by keyboard.
    const role = (attrs.match(/\brole="([^"]+)"/) || [])[1];
    if (role && FOCUSABLE_ROLES.includes(role) && !focusable && !hiddenAttr && !["button", "a", "input", "select", "textarea", "summary"].includes(name_)) {
      add("role-not-focusable", `role="${role}" on <${name_}>`);
    }

    // value properties the spec requires, and values it does not allow.
    if (role && ROLE_REQUIRED_PROP[role] && !attrs.includes(`${ROLE_REQUIRED_PROP[role]}=`)) {
      add("role-missing-prop", `role="${role}" without ${ROLE_REQUIRED_PROP[role]}`);
    }
    for (const [state, allowed] of Object.entries(ARIA_STATES)) {
      const value = (attrs.match(new RegExp(`${state}="([^"]*)"`)) || [])[1];
      if (value !== undefined && value !== "" && !allowed.includes(value)) add("aria-state-invalid", `${state}="${value}"`);
    }

    if (!selfClose && !VOID_ELEMENTS.has(name_)) stack.push({ name: name_, hidden, hiddenAttr });
  }

  return issues;
}

function summarise(issues: MarkupIssue[], source: string, documents: number, fallbacks: MarkupFallback[]): MarkupScan {
  const byKind: Record<string, number> = {};
  for (const c of MARKUP_CHECKS) byKind[c.id] = 0;
  for (const i of issues) byKind[i.kind] = (byKind[i.kind] || 0) + 1;
  return { documents, fallbacks, issues, byKind, source };
}

/** Every HTML document a build wrote, read from disk. */
export function scanBuiltHtml(root: string): MarkupScan {
  const files: string[] = [];
  const walk = (dir: string) => {
    let entries: string[] = [];
    try {
      entries = fs.readdirSync(dir);
    } catch {
      return;
    }
    for (const e of entries) {
      const p = path.join(dir, e);
      let isDir = false;
      try {
        isDir = fs.statSync(p).isDirectory();
      } catch {
        continue;
      }
      if (isDir) walk(p);
      else if (e.endsWith(".html")) files.push(p);
    }
  };
  walk(root);

  const issues: MarkupIssue[] = [];
  const fallbacks: MarkupFallback[] = [];
  let documents = 0;
  for (const f of files) {
    let html = "";
    try {
      html = fs.readFileSync(f, "utf8");
    } catch {
      continue;
    }
    const relative = f.replace(`${root}${path.sep}`, "").split(path.sep).join("/");
    const reason = nextFallbackDocument(f, html);
    if (reason) {
      fallbacks.push({ file: relative, why: reason });
      continue;
    }
    documents++;
    issues.push(...scanDocument(html, relative));
  }
  return summarise(issues, `the built HTML in ${path.relative(process.cwd(), root) || root}`, documents, fallbacks);
}

/**
 * Every URL the sitemap lists, read over HTTP.
 *
 * Why not just the files on disk: routes rendered on demand — every component,
 * prompt and template detail page, and the admin consoles that read
 * localStorage — have no HTML in `.next` between requests. Reading them over
 * HTTP is the only way to apply the rules to what a visitor is actually sent.
 */
/**
 * Server-rendered pages the sitemap deliberately does not list — a query
 * surface, two submission forms and a share link — but which the served pass
 * still has to read. One list, because /quality/aria prints the pass's size and
 * a second copy of these four strings would let that number drift.
 */
export const SERVED_EXTRAS = ["/search", "/community/re-run", "/community/submit", "/saved/stack"];

export async function scanServedSitemap(base: string): Promise<MarkupScan> {
  const origin = base.replace(/\/+$/, "");
  const xml = await (await fetch(`${origin}/sitemap.xml`)).text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, "") || "/");
  // Pages that are server-rendered and deliberately absent from the sitemap:
  // fetching them here is the only way the rules ever see them (they have no
  // HTML on disk between requests either).
  for (const extra of SERVED_EXTRAS) {
    if (!urls.includes(extra)) urls.push(extra);
  }
  const issues: MarkupIssue[] = [];
  const missed: string[] = [];
  let documents = 0;
  for (const url of urls) {
    let res: Response;
    try {
      res = await fetch(origin + url);
    } catch {
      missed.push(url);
      continue;
    }
    if (!res.ok) {
      missed.push(`${url} (${res.status})`);
      continue;
    }
    const html = await res.text();
    documents++;
    issues.push(...scanDocument(html, url));
  }
  // A URL that did not answer is reported, not quietly dropped: a scan that
  // silently skips pages is how "no findings" stops meaning anything.
  const source = `${documents} of ${urls.length} served pages from ${origin}${missed.length ? ` · ${missed.length} did not answer: ${missed.slice(0, 3).join(", ")}` : ""}`;
  return summarise(issues, source, documents, []);
}
