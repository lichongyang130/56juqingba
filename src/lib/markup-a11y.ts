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
];

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
  const add = (kind: string, file: string, detail: string) =>
    issues.push({ kind, page: file.replace(`${root}${path.sep}`, "").split(path.sep).join("/"), detail });

  const textOf = (frag: string) =>
    frag
      .replace(/<[^>]+>/g, " ")
      .replace(/&[a-z]+;|&#\d+;/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  for (const f of files) {
    let html = "";
    try {
      html = fs.readFileSync(f, "utf8");
    } catch {
      continue;
    }
    const reason = nextFallbackDocument(f, html);
    if (reason) {
      fallbacks.push({ file: f.replace(`${root}${path.sep}`, "").split(path.sep).join("/"), why: reason });
      continue;
    }
    documents++;

    // The flight payload repeats the markup; the checks below are about the
    // document, so only the rendered HTML is examined.
    const head = html.split("<script>self.__next_f")[0];
    const wrapped = (index: number) => {
      const before = head.slice(0, index);
      return (before.match(/<label\b/g) || []).length > (before.match(/<\/label>/g) || []).length;
    };

    if (!/<html[^>]+lang="/.test(html)) add("no-lang", f, "");

    for (const m of head.matchAll(/<img\b[^>]*>/g)) {
      if (!/\balt=/.test(m[0])) add("img-no-alt", f, m[0].slice(0, 90));
    }

    for (const m of head.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)) {
      if (/aria-hidden="true"|aria-label|aria-labelledby|title=/.test(m[1])) continue;
      if (textOf(m[2])) continue;
      add("button-no-name", f, m[0].replace(/\s+/g, " ").slice(0, 90));
    }

    for (const m of head.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
      if (/aria-hidden="true"|aria-label|aria-labelledby|title=/.test(m[1])) continue;
      if (/<img[^>]+alt="[^"]+"/.test(m[2])) continue;
      if (textOf(m[2])) continue;
      add("link-no-name", f, m[0].replace(/\s+/g, " ").slice(0, 90));
    }

    for (const m of head.matchAll(/<(input|select|textarea)\b([^>]*)>/g)) {
      const attrs = m[2];
      if (/type="(hidden|submit|button|reset|image)"/.test(attrs)) continue;
      if (/aria-hidden="true"|aria-label|aria-labelledby/.test(attrs)) continue;
      if (wrapped(m.index ?? 0)) continue;
      const id = (attrs.match(/\sid="([^"]+)"/) || [])[1];
      if (id && new RegExp(`<label[^>]+for="${id}"`).test(head)) continue;
      add("input-no-label", f, m[0].replace(/\s+/g, " ").slice(0, 90));
    }

    const ids = [...head.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]).filter((id) => !id.startsWith("__"));
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (dupes.length) add("duplicate-id", f, [...new Set(dupes)].slice(0, 4).join(", "));

    const levels = [...head.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] > levels[i - 1] + 1) {
        add("heading-skip", f, `h${levels[i - 1]} then h${levels[i]}`);
        break;
      }
    }
  }

  const byKind: Record<string, number> = {};
  for (const c of MARKUP_CHECKS) byKind[c.id] = 0;
  for (const i of issues) byKind[i.kind] = (byKind[i.kind] || 0) + 1;

  return { documents, fallbacks, issues, byKind };
}
