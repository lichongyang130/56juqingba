import type { Metadata } from "next";
import Link from "next/link";
import path from "node:path";
import { A11Y_FIXES, MANUAL_CHECKS, a11yBands } from "@/lib/a11y-audit";
import { MARKUP_CHECKS, SERVED_EXTRAS, scanBuiltHtml } from "@/lib/markup-a11y";
import sitemap from "@/app/sitemap";
import { COMPONENTS } from "@/lib/data";
import { SITE_URL } from "@/lib/seo";

// Rendered per request rather than prerendered: the pass reads the built HTML
// from disk, and a page prerendered mid-build would report a partial count
// (116 documents) as if it were the whole site. On demand it always reads the
// finished build, which is the number the page then reports.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  // 519 — the page had no canonical, so the sitemap walk could not tell it
  // apart from a page pointing at the homepage.
  alternates: { canonical: "/quality/aria" },
  title: "ARIA and markup audit — the automated half",
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

export default function AriaAuditPage() {
  // 519 — this sentence used to print a typed-in "283 URLs" and was wrong the
  // moment the sitemap grew. It is derived now, with the same
  // de-duplication the pass does: a page that is both listed and an extra is
  // walked once.
  const entries = sitemap();
  const listedPaths = new Set(entries.map((e) => e.url.replace(SITE_URL, "") || "/"));
  const served = entries.length + SERVED_EXTRAS.filter((e) => !listedPaths.has(e)).length;
  // Same rules as `npm run check:a11y` and the export harness, from one module.
  // No `.next` directory (a dev server, a fresh clone) means the pass has
  // nothing to read — the page says so instead of printing a fake zero.
  const { documents: pages, fallbacks, issues, byKind } = scanBuiltHtml(ROOT);
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
          shipped broken. This page runs the mechanical half over {pages} page documents in the finished build — the same files the server sends
          — and reports what it finds, including the findings that were real and have been fixed.
        </p>
      </div>

      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Documents scanned", value: pages.toLocaleString(), note: "every page document in the finished build" },
          { label: "Open findings", value: String(issues.length), note: issues.length === 0 ? "clean at this commit" : "listed below" },
          { label: "Editorial a11y ≥ 95", value: `${bands["95-100"]}/${total}`, note: "the per-asset score kept in the catalog" },
          { label: "Found and fixed", value: String(A11Y_FIXES.length), note: "repairs recorded below, not hidden" },
          {
            label: "Next fallbacks skipped",
            value: String(fallbacks.length),
            note: "error shells, not pages: they carry no lang and no content",
          },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border border-white/8 bg-panel p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">{c.label}</p>
            <p className="mt-1 font-mono text-2xl tabular-nums">{c.value}</p>
            <p className="mt-1 text-[10px] leading-relaxed text-ink-dim">{c.note}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">The {MARKUP_CHECKS.length} checks, and the count for each</h2>
        <ul className="mt-4 space-y-2">
          {MARKUP_CHECKS.map((c) => (
            <li key={c.id} className="flex items-baseline justify-between gap-4 border-b border-white/6 pb-2 last:border-0">
              <span className="text-[11.5px] leading-relaxed text-ink-dim">{c.what}</span>
              <span className={`shrink-0 font-mono text-sm tabular-nums ${(byKind[c.id] ?? 0) === 0 ? "text-emerald-200" : "text-rose-200"}`}>
                {byKind[c.id] ?? 0}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[10px] leading-relaxed text-ink-faint">
          A control that is inside a <span className="font-mono">aria-hidden</span> subtree is exempt from the name rules (decorative mock controls are
          not interactive for anybody) — but being <em>focusable</em> inside one is a finding of its own: hidden from the accessibility tree and still in
          the tab order fails both ways. A control with an explicit <span className="font-mono">&lt;label for&gt;</span> is satisfied by that
          association, and a control inside a closed popup is exempt from “cannot take focus”, because a <span className="font-mono">hidden</span>{" "}
          subtree is not rendered at all. The pass implements the rules, not a count of tags. This page reads the directory live, so the{" "}
          {fallbacks.length} document{fallbacks.length === 1 ? "" : "s"} it skipped here
          {fallbacks.length === 1 ? "is" : "are"} whatever Next had cached by the time you asked: {fallbacks.map((f) => f.file).join(", ") || "none right now"}.
          The measurement applies the same rule at build time and publishes the count it skipped, and probing a URL that does not exist is enough to add
          one — which is how a removed changelog slug ended up counted as a page, and this page ended up reporting it as missing a language attribute.
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
          A green dashboard that has always been green is usually a dashboard nobody ran. These are the real findings from the runs of this pass,
          kept on the page because the fixes are the evidence:
        </p>
        <ul className="mt-4 space-y-3">
          {A11Y_FIXES.map((f) => (
            <li key={f.what} className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-2 py-0.5 font-mono text-[9px] text-emerald-200">
                {f.commit}
              </span>
              <span className="text-[11.5px] leading-relaxed text-ink-dim">
                {f.what}
                {f.pages > 0 ? <span className="text-ink-faint"> — {f.pages} pages affected</span> : null}
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
            <strong>What the demo scenes do at runtime.</strong> Their markup is no longer exempt — the rules above run over the scenes like any
            other markup, which is how the closed listbox behind an <span className="font-mono">aria-controls</span> was caught. What no static pass
            can see is behaviour: where focus goes when a sheet closes, what a live region announces, whether a drag has a keyboard equivalent. The
            demo harness asserts the behaviours a scene declares (drag, click, keyboard, type, scroll); the checklist below is for the rest.
          </li>
        </ul>
        <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
          The rules also run a second time over HTTP. <span className="font-mono">npm run check:a11y:served</span> fetches every page the sitemap
          lists plus the {SERVED_EXTRAS.length} server-rendered pages the sitemap cannot list — {served} URLs in this build, including the{" "}
          {COMPONENTS.length} component pages rendered on demand, which have no HTML on disk to scan — reports any URL that did not answer instead of
          skipping it, and fails on the same findings. The counts above come from the disk pass.
        </p>
        <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
          The export harness and <span className="font-mono">npm run check:a11y</span> run the same rules from a separate process over the same
          files, and fail on any finding — so this page cannot report green while the served HTML is not. The three counted different documents
          once; the rule for what is a page now has one home, in the same module the three read.
        </p>
      </section>

      <section className="mt-6 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">What a machine cannot decide here: the manual checklist</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          Seven checks, in the order a reviewer should run them. Each one names the automated half that does exist, so the list is what is left rather
          than a pile of work someone already did. <strong className="text-amber-100">None of these has been run in a browser by this project.</strong>{" "}
          The build has no browser in it, no session has been recorded, and this page will not imply otherwise.
        </p>
        <ol className="mt-4 space-y-3">
          {MANUAL_CHECKS.map((c, i) => (
            <li key={c.title} className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-mono text-[10px] text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[12.5px] font-bold text-ink">{c.title}</span>
                {c.automated ? (
                  <span className="rounded-full border border-emerald-300/25 bg-emerald-400/10 px-2 py-0.5 font-mono text-[9px] text-emerald-200">
                    automated half: {c.automated}
                  </span>
                ) : (
                  <span className="rounded-full border border-white/12 bg-white/5 px-2 py-0.5 font-mono text-[9px] text-ink-faint">
                    nothing automated
                  </span>
                )}
              </div>
              <p className="mt-2 text-[11.5px] leading-relaxed text-ink-dim">{c.how}</p>
              <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">
                <span className="font-bold uppercase tracking-wider">Fails when</span> {c.fails}
              </p>
              {c.where.length > 0 && (
                <p className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] text-ink-faint">
                  <span className="font-bold uppercase tracking-wider">Where</span>
                  {c.where.map((w) => (
                    <Link key={w.href} href={w.href} className="font-mono text-emerald-300 hover:text-emerald-200">
                      {w.href}
                    </Link>
                  ))}
                </p>
              )}
            </li>
          ))}
        </ol>
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
