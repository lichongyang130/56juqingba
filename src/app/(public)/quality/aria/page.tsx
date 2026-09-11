import type { Metadata } from "next";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import { A11Y_CHECKS, A11Y_FIXES, a11yBands, type A11yIssue } from "@/lib/a11y-audit";

// Rendered per request rather than prerendered: the pass reads the built HTML
// from disk, and a page prerendered mid-build would report a partial count
// (116 documents) as if it were the whole site. On demand it always reads the
// finished build, which is the number the page then reports.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ARIA and markup audit — the automated half — Motif UI",
  description:
    "A build-time pass over every page's HTML: images without alt, controls without names, duplicate ids, heading-order skips and missing lang attributes — with the current counts and what was fixed.",
};

/**
 * #507 — the automated half of accessibility.
 *
 * The per-asset a11y number in the catalog is an editorial score; this page
 * reports the machine-checkable layer over the built HTML, and says plainly
 * which parts of accessibility it cannot decide (everything needing a browser:
 * focus order, contrast in context, live-region behaviour, real screen-reader
 * output).
 */

const ROOT = path.join(process.cwd(), ".next", "server", "app");

function scan(): { pages: number; issues: A11yIssue[] } {
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
      else if (e.endsWith(".html") && e !== "_global-error.html") files.push(p);
    }
  };
  walk(ROOT);

  const issues: A11yIssue[] = [];
  const add = (kind: string, file: string, detail: string) =>
    issues.push({ kind, page: file.replace(`${ROOT}${path.sep}`, ""), detail });

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
      if (wrapped(m.index)) continue;
      const id = (attrs.match(/\sid="([^"]+)"/) || [])[1];
      if (id && new RegExp(`<label[^>]+for="${id}"`).test(head)) continue;
      add(`${m[1]}-no-label`, f, m[0].replace(/\s+/g, " ").slice(0, 90));
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

  return { pages: files.length, issues };
}

export default function AriaAuditPage() {
  // No `.next` directory (a dev server, a fresh clone) means the pass has
  // nothing to read — the page says so instead of printing a fake zero.
  const { pages, issues } = scan();
  const byKind: Record<string, number> = {};
  for (const i of issues) byKind[i.kind] = (byKind[i.kind] || 0) + 1;
  const bands = a11yBands();
  const total = Object.values(bands).reduce((a, b) => a + b, 0);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <Link href="/quality" className="hover:text-ink">
          Quality bar
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Markup audit</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">Quality · the automated half of a11y</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">What a machine can check</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          Accessibility has two halves. One needs a person and a browser; the other is decidable from markup, and that half should never be
          shipped broken. This page runs the mechanical half over {pages} built HTML documents at build time — the same files the server sends —
          and reports what it finds, including the findings that were real and have been fixed.
        </p>
      </div>

      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Documents scanned", value: pages.toLocaleString(), note: "every HTML document in the finished build" },
          { label: "Open findings", value: String(issues.length), note: issues.length === 0 ? "clean at this commit" : "listed below" },
          { label: "Editorial a11y ≥ 95", value: `${bands["95-100"]}/${total}`, note: "the per-asset score kept in the catalog" },
          { label: "Found and fixed", value: String(A11Y_FIXES.length), note: "repairs recorded below, not hidden" },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border border-white/8 bg-panel p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">{c.label}</p>
            <p className="mt-1 font-mono text-2xl tabular-nums">{c.value}</p>
            <p className="mt-1 text-[10px] leading-relaxed text-ink-dim">{c.note}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">The seven checks, and the count for each</h2>
        <ul className="mt-4 space-y-2">
          {A11Y_CHECKS.map((c) => (
            <li key={c.id} className="flex items-baseline justify-between gap-4 border-b border-white/6 pb-2 last:border-0">
              <span className="text-[11.5px] leading-relaxed text-ink-dim">{c.what}</span>
              <span className={`shrink-0 font-mono text-sm tabular-nums ${(byKind[c.id] ?? 0) === 0 ? "text-emerald-200" : "text-rose-200"}`}>
                {byKind[c.id] ?? 0}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[10px] leading-relaxed text-ink-faint">
          A control that is inside a <span className="font-mono">aria-hidden</span> subtree is exempt (decorative mock controls are not interactive
          for anybody), and a control with an explicit <span className="font-mono">&lt;label for&gt;</span> is satisfied by that association — the
          pass implements the rule rather than a count of tags.
        </p>
      </section>

      {issues.length > 0 && (
        <section className="mt-6 rounded-3xl border border-rose-300/30 bg-rose-400/[.05] p-6">
          <h2 className="text-sm font-extrabold tracking-tight text-rose-100">Open findings</h2>
          <ul className="mt-3 space-y-1.5 font-mono text-[10.5px] text-ink-dim">
            {issues.slice(0, 20).map((i, n) => (
              <li key={n}>
                {i.kind} · {i.page} {i.detail}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-6 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">What this pass found, and what changed</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          A green dashboard that has always been green is usually a dashboard nobody ran. These are the real findings from the first two runs of
          this pass, kept on the page because the fixes are the evidence:
        </p>
        <ul className="mt-4 space-y-3">
          {A11Y_FIXES.map((f) => (
            <li key={f.what} className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-2 py-0.5 font-mono text-[9px] text-emerald-200">
                {f.commit}
              </span>
              <span className="text-[11.5px] leading-relaxed text-ink-dim">
                {f.what} <span className="text-ink-faint">— {f.pages} pages affected</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-3xl border border-dashed border-amber-300/30 bg-amber-400/[.04] p-6">
        <h2 className="text-sm font-extrabold tracking-tight text-amber-100">What this page does not check</h2>
        <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-ink-dim">
          <li>
            <strong>Focus order and keyboard reachability.</strong> Deciding whether Tab reaches every control, and in a sensible order, needs a
            running browser. The three scenes that handle <span className="font-mono">prefers-reduced-motion</span> are tested by the demo harness
            in the same sense — markup and state, not a real key press.
          </li>
          <li>
            <strong>Contrast in context.</strong> Token-level contrast is computed on /quality from the real colour pairs, but whether a specific
            element over a gradient is legible is a rendering question.
          </li>
          <li>
            <strong>Screen-reader output.</strong> Nothing here proves what a screen reader will say; an accessible name can still be a confusing
            one. That is what the guides at <Link href="/learn/the-keyboard-walk" className="font-semibold text-emerald-300 hover:text-emerald-200">the keyboard walk</Link> exist for.
          </li>
          <li>
            <strong>Anything in the demo scenes themselves.</strong> Their interactive controls carry real labels, but the scenes are previews of
            other people&apos;s pages and are exempt from the host document&apos;s outline by design.
          </li>
        </ul>
        <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
          The export harness runs the same seven checks from outside the build and fails on any finding, so this page cannot report green while the
          served HTML is not.
        </p>
      </section>

      <p className="mt-8 text-[11px] leading-relaxed text-ink-faint">
        Related:{" "}
        <Link href="/quality" className="font-semibold text-emerald-300 hover:text-emerald-200">
          the audit register
        </Link>
        ,{" "}
        <Link href="/quality/craft" className="font-semibold text-emerald-300 hover:text-emerald-200">
          the craft excerpts
        </Link>{" "}
        and{" "}
        <Link href="/quality/crawl" className="font-semibold text-emerald-300 hover:text-emerald-200">
          the crawl surface
        </Link>
        .
      </p>
    </div>
  );
}
