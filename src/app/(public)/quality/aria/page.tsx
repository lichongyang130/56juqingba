import type { Metadata } from "next";
import Link from "next/link";
import path from "node:path";
import { A11Y_FIXES, MANUAL_CHECKS, a11yBands } from "@/lib/a11y-audit";
import { MARKUP_CHECKS, SERVED_EXTRAS, scanBuiltHtml } from "@/lib/markup-a11y";
import { motionAudit, motionByModule } from "@/lib/motion-audit";
import {
  ANNOUNCED,
  behaviorEvidence,
  fixedHeightInventory,
  focusRingSurfaces,
  forcedColorsInCss,
  rtlDryRun,
  targetSizeCandidates,
  visualOrderUsages,
} from "@/lib/a11y-deep";
import { NAME_FIXTURES, fixtureDrift } from "@/lib/name-fixtures";
import sitemap from "@/app/sitemap";
import { COMPONENTS } from "@/lib/data";
import { SITE_URL } from "@/lib/seo";
import { SITE } from "@/lib/site";

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
  const extrasNotListed = SERVED_EXTRAS.filter((e) => !listedPaths.has(e));
  const served = entries.length + extrasNotListed.length;
  // 523 — the same count the checklist item and check:demos read, so the two
  // sentences on this page cannot disagree about how many scenes move.
  const motion = motionAudit();
  // #6 — the same audit grouped by module, so the split above is readable as a
  // table rather than rounded into one number.
  const modules = motionByModule();
  const moduleTotals = modules.reduce((a, m) => ({ scenes: a.scenes + m.scenes, animate: a.animate + m.animate }), { scenes: 0, animate: 0 });
  // Same rules as `npm run check:a11y` and the export harness, from one module.
  // No `.next` directory (a dev server, a fresh clone) means the pass has
  // nothing to read — the page says so instead of printing a fake zero.
  const { documents: pages, fallbacks, issues, byKind } = scanBuiltHtml(ROOT);
  const bands = a11yBands();
  const total = Object.values(bands).reduce((a, b) => a + b, 0);
  // #11–#20 — the parts between the machine and the browser, given a home
  // instead of a shrug. Everything below is recomputed from the same source the
  // gates read, so the page and the check cannot drift apart.
  const ring = focusRingSurfaces();
  const forced = forcedColorsInCss();
  const targets = targetSizeCandidates();
  const evidence = behaviorEvidence(COMPONENTS);
  const keyboardDeclared = evidence.filter((e) => e.behavior === "keyboard");
  const keyboardMissing = keyboardDeclared.filter((e) => !e.found);
  const dragDeclared = evidence.filter((e) => e.behavior === "drag");
  const dragMissing = dragDeclared.filter((e) => !e.found);
  const order = visualOrderUsages();
  const orderUnexplained = order.filter((u) => !u.explained);
  const fixtures = fixtureDrift();
  const fixed = fixedHeightInventory();
  const rtl = rtlDryRun();

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

      <section className="mt-6 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">Motion, counted per module</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          The split above, broken down by the module each scene lives in. <span className="font-mono">animate</span> counts
          every scene that drives motion; <span className="font-mono">guarded</span> counts only the JavaScript-driven ones
          that name the preference — CSS-only motion is stopped by the stylesheet, so it has no branch to count.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-[11px]">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-ink-faint">
                <th className="py-2 pr-4 font-bold">module</th>
                <th className="py-2 pr-4 font-bold">scenes</th>
                <th className="py-2 pr-4 font-bold">animate</th>
                <th className="py-2 pr-4 font-bold">guarded</th>
                <th className="py-2 font-bold">first unguarded</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((m) => (
                <tr key={m.module} className="border-b border-white/6 last:border-0">
                  <td className="py-2 pr-4 font-mono text-ink-dim">{m.module}</td>
                  <td className="py-2 pr-4 font-mono tabular-nums text-ink-dim">{m.scenes}</td>
                  <td className="py-2 pr-4 font-mono tabular-nums text-ink-dim">{m.animate}</td>
                  <td className={`py-2 pr-4 font-mono tabular-nums ${m.guarded === m.jsDriven ? "text-emerald-200" : "text-rose-200"}`}>
                    {m.guarded}
                  </td>
                  <td className="py-2 font-mono text-ink-faint">{m.firstUnguarded ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
          {`${modules.length} modules · ${moduleTotals.scenes} scenes · ${moduleTotals.animate} animate`} — the same
          numbers as the split above, generated from the same audit.
        </p>
      </section>

      <section className="mt-6 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">The motion contract</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          Three rules every demo scene promises, written down so a scene is added the same way it is reviewed. The full
          contract lives in the repository, and the two automated halves are named with it:
        </p>
        <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-ink-dim">
          <li>
            <strong>A scene that loops declares a branch.</strong> A scene that drives motion from JavaScript without
            naming the preference fails check:demos.
          </li>
          <li>
            <strong>Reduced motion never removes content that only animation revealed.</strong> The reduced version is
            the same content, still or instant — never an empty frame.
          </li>
          <li>
            <strong>The branch is named in the scene&apos;s own body.</strong> A shared stylesheet rule is a net, not the
            scene&apos;s answer: the code that moves names the preference next to the loop it guards.
          </li>
        </ul>
        <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
          The stylesheet rule itself is asserted in the built CSS by check:exports. The contract is{" "}
          <a
            href={`${SITE.repo}/blob/main/docs/motion-contract.md`}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-emerald-300 hover:text-emerald-200"
          >
            docs/motion-contract.md
          </a>
          , and the template every scene imports from is{" "}
          <a
            href={`${SITE.repo}/blob/main/src/components/demos/scene-kit.tsx`}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-emerald-300 hover:text-emerald-200"
          >
            scene-kit.tsx
          </a>
          .
        </p>
      </section>

      <section className="mt-6 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">Focus ring against the surfaces it sits on</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          The ring <span className="font-mono">globals.css</span> draws is <span className="font-mono">rgba(139,92,246,.9)</span>.
          Against each flat surface it can sit on, that ring blends to a colour whose contrast against the surface is computed here.
          The 3:1 line is the non-text contrast a focus indicator should clear. Glass panels and gradients are a rendering question, not
          a token, so they stay on the hand-check list rather than pretending a flat average is the glass.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-[11px]">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-ink-faint">
                <th className="py-2 pr-4 font-bold">surface</th>
                <th className="py-2 pr-4 font-bold">ring · surface ratio</th>
                <th className="py-2 font-bold">clears 3:1</th>
              </tr>
            </thead>
            <tbody>
              {ring.map((r) => (
                <tr key={r.label} className="border-b border-white/6 last:border-0">
                  <td className="py-2 pr-4 text-ink-dim">{r.label}</td>
                  <td className={`py-2 pr-4 font-mono tabular-nums ${r.pass ? "text-emerald-200" : "text-rose-200"}`}>{r.ratio}:1</td>
                  <td className="py-2 font-mono">{r.pass ? "yes" : "no"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">Forced-colors mode</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          Windows high contrast replaces the palette, so the theme&apos;s translucent violet can vanish against a forced background.
          <span className="font-mono">globals.css</span> now carries a <span className="font-mono">@media (forced-colors: active)</span>{" "}
          block that hands the focus ring to <span className="font-mono">Highlight</span> and the primary chrome to{" "}
          <span className="font-mono">CanvasText</span>. This page reads the built stylesheet, not the source file, so the sentence below
          is about what actually shipped:{" "}
          {forced.found ? (
            <span className="text-emerald-200">present in {forced.file}</span>
          ) : (
            <span className="text-rose-200">not found in the build — the block did not survive the build</span>
          )}
          .
        </p>
      </section>

      <section className="mt-6 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">Target size — candidates, not measurements</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          A class name is not a measurement. <span className="font-mono">{targets.length}</span> interactive controls in the scene
          source carry no <span className="font-mono">min-height</span>/<span className="font-mono">min-width</span>/
          <span className="font-mono">size</span> utility, so they are <em>candidates for the hand check</em>, not failures. The hand
          check decides whether the control is actually below the touch-target line at 200% zoom; this list is where that check starts.
        </p>
        {targets.length > 0 && (
          <ul className="mt-4 grid gap-1.5 font-mono text-[10px] text-ink-dim md:grid-cols-2">
            {targets.slice(0, 24).map((t, i) => (
              <li key={i} className="truncate">
                {t.file.replace(/^src\/components\/demos\//, "")} · {t.control}
              </li>
            ))}
            {targets.length > 24 && <li className="text-ink-faint">… and {targets.length - 24} more</li>}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">Behaviour declarations, and the code behind them</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          A catalog record that declares a behaviour now has to have the code. <span className="font-mono">keyboard</span> means a key
          or focus handler, or a native control that is keyboard-operable without one; <span className="font-mono">drag</span> means a
          pointer, mouse or touch handler, or a native range thumb.{" "}
          <span className="font-mono">{keyboardDeclared.length}</span> records declare <span className="font-mono">keyboard</span>{" "}
          ({keyboardMissing.length === 0 ? "all with evidence" : `${keyboardMissing.length} without`}) and{" "}
          <span className="font-mono">{dragDeclared.length}</span> declare <span className="font-mono">drag</span>{" "}
          ({dragMissing.length === 0 ? "all with evidence" : `${dragMissing.length} without`}).{" "}
          <span className="font-mono">check:demos</span> fails the moment a declaration loses its handler.
        </p>
        {keyboardMissing.length + dragMissing.length > 0 && (
          <ul className="mt-3 space-y-1 font-mono text-[10.5px] text-rose-200">
            {[...keyboardMissing, ...dragMissing].map((m) => (
              <li key={`${m.slug}-${m.behavior}`}>
                {m.slug} declares {m.behavior} with no evidence in {m.where}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">Accessible-name fixtures</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          A name passes a linter if it exists; these fixtures assert it is the <em>right</em> name.{" "}
          <span className="font-mono">{NAME_FIXTURES.length}</span> of the most interactive scenes store the accessible name their
          primary control should have, and the built embed markup is compared against it —{" "}
          <span className="font-mono">check:demos</span> fails on drift.{" "}
          {fixtures.drift.length === 0 ? (
            <span className="text-emerald-200">All {fixtures.fixtures} match the built markup.</span>
          ) : (
            <span className="text-rose-200">
              {fixtures.drift.length} drifted: {fixtures.drift.map((d) => d.slug).join(", ")}
            </span>
          )}
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-[10.5px]">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-ink-faint">
                <th className="py-2 pr-4 font-bold">scene</th>
                <th className="py-2 font-bold">expected accessible name</th>
              </tr>
            </thead>
            <tbody>
              {NAME_FIXTURES.map((f) => (
                <tr key={f.slug} className="border-b border-white/6 last:border-0">
                  <td className="py-1.5 pr-4 font-mono text-ink-dim">{f.slug}</td>
                  <td className="py-1.5 text-ink-dim">{f.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">DOM order vs visual order</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          Scene source is scanned for the utilities that reorder visually — <span className="font-mono">order-*</span>,{" "}
          <span className="font-mono">flex-row-reverse</span> and the rest — and a scene that uses one must explain its reading order in
          its own body. <span className="font-mono">{order.length}</span> use{order.length === 1 ? "" : "s"} found,{" "}
          <span className="font-mono">{orderUnexplained.length}</span> without an explanation.
        </p>
        {order.length > 0 && (
          <ul className="mt-3 space-y-1 font-mono text-[10.5px] text-ink-dim">
            {order.map((u, i) => (
              <li key={i}>
                {u.file} · {u.cls} · {u.explained ? "reading order explained" : "no explanation"}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">The sentences the live regions announce</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          So the hand check knows what it is listening for. The toast scene announces these in an{" "}
          <span className="font-mono">aria-live=&quot;polite&quot;</span> region, and the live-region lab announces these through{" "}
          <span className="font-mono">role=&quot;status&quot;</span> / <span className="font-mono">role=&quot;alert&quot;</span>.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">toast scene</p>
            <ul className="mt-2 space-y-1 font-mono text-[10px] text-ink-dim">
              {ANNOUNCED.toast.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">live-region lab</p>
            <ul className="mt-2 space-y-1 font-mono text-[10px] text-ink-dim">
              {ANNOUNCED.liveRegion.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">Fixed-height inventory for the 200% zoom check</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          The preview frames reserve fixed pixel heights, so a 200% zoom check starts from a list rather than a blank page:
        </p>
        <ul className="mt-3 space-y-1 font-mono text-[10.5px] text-ink-dim">
          {fixed.map((f, i) => (
            <li key={i}>
              {f.where} · {f.value}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">RTL: a dry run on two scenes</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          No browser exists in this build, so this is a source scan, not a render: two scenes were chosen and their physical-direction
          tokens listed. Those tokens will not mirror under <span className="font-mono">dir=&quot;rtl&quot;</span> — the logical
          equivalents are <span className="font-mono">-start</span>/<span className="font-mono">-end</span>,{" "}
          <span className="font-mono">text-start</span>, <span className="font-mono">rounded-s</span>/<span className="font-mono">e</span>.
          The other {rtl.untested} scenes are untested in RTL.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {rtl.scenes.map((s) => (
            <div key={s.key} className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">
                {s.key} · {s.component}
              </p>
              <p className="mt-2 font-mono text-[10px] leading-relaxed text-ink-dim">
                {s.hazards.length > 0 ? s.hazards.join(" · ") : "no physical-direction tokens found"}
              </p>
            </div>
          ))}
        </div>
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
            running browser. {motion.moving} scenes move at all: {motion.css.length} through CSS, which the stylesheet collapses site-wide, and{" "}
            {motion.js.length} from JavaScript, which no stylesheet can reach — every one of those {motion.js.length} now names the preference and{" "}
            <span className="font-mono">check:demos</span> fails if any stops. What a branch <em>does</em> at runtime is still a hand check like everything
            else on this list.
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
            demo harness compares the behaviour list each scene it knows about declares (drag, click, keyboard, type, scroll) with the list that
            scene&apos;s catalog record publishes — two declarations against each other, which is a weaker thing than an assertion about the code. The
            checklist below is for the rest.
          </li>
        </ul>
        <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
          The rules also run a second time over HTTP. <span className="font-mono">npm run check:a11y:served</span> fetches every page the sitemap
          lists plus the {extrasNotListed.length} server-rendered pages the sitemap cannot list — {served} URLs in this build, including the{" "}
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
        </Link>{" "}
        and{" "}
        <Link href="/quality/gates" className="font-semibold text-emerald-300 hover:text-emerald-200">
          the index of every check
        </Link>
        .
      </p>
    </div>
  );
}
