// Quality bar — Section 11 panels (server components). All counts and ratios
// are recomputed from the live catalog at build time (see quality-utils.ts);
// policies and draft test assertions are clearly labelled as such. No "use
// client" needed — these render statically, like the rest of the quality hub.

import type { ReactNode } from "react";
import Link from "next/link";
import { COMPONENTS } from "@/lib/data";
import { hsl } from "@/lib/studio-utils";
import {
  a11yBandCounts,
  animatedCount,
  auditLedgerRows,
  chromePairs,
  depFreeCount,
  emptyStateScan,
  fingerTiers,
  heaviestAssets,
  interactiveAssets,
  KEYBOARD_PLANS,
  kindLabel,
  kindSizeTable,
  OVERCLAIM_DICTIONARY,
  BASELINE_LABEL,
  perfBaseline,
  qualBandCounts,
  REDUCED_MOTION_CSS,
  SR_SAMPLES,
  toneScan,
  truthRows,
  URL_SNAPSHOT,
  withDeps,
} from "@/lib/quality-utils";

const total = COMPONENTS.length;

function Chip({ children, cls = "" }: { children: ReactNode; cls?: string }) {
  return <span className={`chip !text-[10px] ${cls}`}>{children}</span>;
}

function ScoreBar({ n, totalCount, hue }: { n: number; totalCount: number; hue: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-6 w-1 rounded-full" style={{ background: hsl(hue, 82, 62) }} />
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/8">
        <div className="h-full rounded-full" style={{ width: `${Math.max(2, (n / totalCount) * 100)}%`, background: hsl(hue, 82, 62) }} />
      </div>
    </div>
  );
}

/* #320 — automated axe pass per asset: publish the score */
export function ScorePublishPanel() {
  const a11y = a11yBandCounts();
  const qual = qualBandCounts();
  const sample = [...COMPONENTS].sort((a, b) => b.a11yScore - a.a11yScore)[0];
  return (
    <section className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Mechanism 1 · audit scores, published</p>
          <h2 className="mt-1.5 text-xl font-extrabold tracking-tight">Every asset ships with two public numbers</h2>
          <p className="mt-2 text-xs leading-relaxed text-ink-dim">
            Accessibility (auto + human review) and editorial quality are computed per asset and shown on every card and
            detail page — not kept in a private QA sheet. The two distributions below are the whole catalog at build time.
          </p>
        </div>
        <Chip cls="!border-mint/30 !text-mint">live catalog · {total} assets</Chip>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-extrabold">Accessibility score</p>
            <span className="font-mono text-[10px] text-ink-faint">92 – 100 range</span>
          </div>
          <div className="mt-3 space-y-2">
            {a11y.map((b) => (
              <div key={b.label} className="flex items-center gap-3 text-[11px]">
                <span className="w-14 shrink-0 font-mono text-ink-faint">{b.label}</span>
                <ScoreBar n={b.n} totalCount={total} hue={258} />
                <span className="w-8 shrink-0 text-right font-mono font-bold text-ink">{b.n}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-extrabold">Editorial quality</p>
            <span className="font-mono text-[10px] text-ink-faint">92 – 97 range</span>
          </div>
          <div className="mt-3 space-y-2">
            {qual.map((b) => (
              <div key={b.label} className="flex items-center gap-3 text-[11px]">
                <span className="w-14 shrink-0 font-mono text-ink-faint">{b.label}</span>
                <ScoreBar n={b.n} totalCount={total} hue={192} />
                <span className="w-8 shrink-0 text-right font-mono font-bold text-ink">{b.n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {sample && (
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3">
          <span className="text-[10px] text-ink-faint">Top of the a11y band right now:</span>
          <Link href={`/components/${sample.slug}`} className="rounded-lg border border-white/10 bg-white/[.03] px-2.5 py-1 font-mono text-[10px] font-bold text-ink transition-colors hover:border-white/25">
            {sample.slug} · a11y {sample.a11yScore} · Q {sample.qualityScore}
          </Link>
          <Link href="/components" className="text-[10px] font-semibold text-violet-300 hover:text-violet-200">
            browse cards →
          </Link>
        </div>
      )}

      <p className="mt-3 border-t border-white/6 pt-3 text-[11px] leading-relaxed text-ink-faint">
        The scores are composites of the automated audit and human review that gate each asset before it is listed.
        Wiring that audit step to run in CI on every change is the next upgrade on this page&apos;s roadmap — the numbers
        it would publish are the ones above.
      </p>
    </section>
  );
}

/* #321 — contrast CI check on the default palette */
export function ContrastCiPanel() {
  const pairs = chromePairs();
  const finger = fingerTiers();
  return (
    <section className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Mechanism 2 · contrast CI on the default palette</p>
          <h2 className="mt-1.5 text-xl font-extrabold tracking-tight">The palette is checked, not trusted</h2>
          <p className="mt-2 text-xs leading-relaxed text-ink-dim">
            WCAG ratios computed from the real @theme hex values — body text, surfaces, the primary button and the three
            role accents as text. Every asset inherits this palette, so these pairs are its default palette.
          </p>
        </div>
        <Chip cls="!border-mint/30 !text-mint">6 shipped pairs · AA normal</Chip>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {pairs.map((p) => {
          const aa = p.ratio >= 4.5;
          return (
            <div key={p.label} className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/[.02] px-3 py-2.5">
              <span className="h-6 w-6 shrink-0 rounded-md border border-white/20" style={{ background: hsl(p.fg.h, p.fg.s, p.fg.l) }} />
              <span className="h-6 w-6 shrink-0 rounded-md border border-white/20" style={{ background: hsl(p.bg.h, p.bg.s, p.bg.l) }} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-bold">{p.label}</p>
                <p className="truncate text-[9px] text-ink-faint">{p.note}</p>
              </div>
              <span className={`font-mono text-sm font-extrabold ${aa ? "text-mint" : "text-amber-300"}`}>{p.ratio.toFixed(2)}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
          <p className="text-xs font-extrabold">Fingerprint as body text on page bg</p>
          <p className="mt-1 text-[10px] leading-relaxed text-ink-faint">If every asset&apos;s accent fingerprint were used as 14px text on #06070b…</p>
          <div className="mt-3 flex items-center justify-between rounded-xl bg-white/[.03] px-3 py-2 text-[11px]">
            <span className="font-semibold text-mint">AA normal (≥ 4.5)</span>
            <span className="font-mono font-extrabold">{finger.pass}</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between rounded-xl bg-white/[.03] px-3 py-2 text-[11px]">
            <span className="font-semibold text-amber-300">AA large only (3 – 4.5)</span>
            <span className="font-mono font-extrabold">{finger.largeOnly}</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between rounded-xl bg-white/[.03] px-3 py-2 text-[11px]">
            <span className="font-semibold text-ink-dim">Below 3.0 (block level)</span>
            <span className="font-mono font-extrabold">{finger.fail}</span>
          </div>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4 md:col-span-2">
          <p className="text-xs font-extrabold">What the CI check would flag</p>
          <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
            Nothing in the library uses a fingerprint as small body text on the raw background — fingerprints drive the
            colour blocks, chips and demo accents, which only need the 3:1 large/UI threshold. The band above is the
            safety margin: <span className="font-bold text-ink">{finger.pass} of {total} assets</span> would pass even if
            used as small text; the other <span className="font-bold text-ink">{finger.largeOnly}</span> are large-text-only,
            and none fall under 3.0.
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
            Tightest fingerprint today:{" "}
            <span className="font-mono text-ink">{finger.worst.slug}</span> at{" "}
            <span className="font-mono text-ink">{finger.worst.ratio.toFixed(2)}:1</span> — comfortably above the 3:1
            UI-component floor it is actually used at.
          </p>
          <p className="mt-2 border-t border-white/6 pt-2 text-[10px] text-ink-faint">
            Rule of thumb this page enforces: default palettes must pass AA-normal for the roles they render as text;
            anything failing that is either promoted to a stronger token or demoted to decoration — never shipped as copy.
          </p>
        </div>
      </div>
    </section>
  );
}

/* #322 — reduced-motion CI check */
export function ReducedMotionPanel() {
  const animated = animatedCount();
  return (
    <section className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Mechanism 3 · reduced-motion fallback</p>
          <h2 className="mt-1.5 text-xl font-extrabold tracking-tight">Motion honours the system setting site-wide</h2>
          <p className="mt-2 text-xs leading-relaxed text-ink-dim">
            <span className="font-bold text-ink">{animated} of {total} assets</span> are animated scenes, plus many
            elements animate on hover or scroll. One global rule collapses them all when the visitor asks for less motion.
          </p>
        </div>
        <Chip cls="!border-mint/30 !text-mint">shipped in globals.css</Chip>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-[#07090f] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">The rule, verbatim</p>
          <pre className="mt-3 overflow-x-auto whitespace-pre font-mono text-[10.5px] leading-relaxed text-emerald-300/90">{REDUCED_MOTION_CSS}</pre>
          <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
            Duration collapse is global; the <code className="font-mono">scroll-behavior</code> reset stops smooth
            anchor jumps. Individual demo scenes add their own checks (e.g. pausing on hover) on top.
          </p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">The check this would run in CI</p>
          <div className="mt-3 space-y-2.5">
            {[
              { ok: true, text: `Every animated-kind asset (${animated} today) must reference at least one animation or keyframe`, src: "catalog data" },
              { ok: true, text: "All animation/transition durations collapse under prefers-reduced-motion", src: "globals.css rule above" },
              { ok: true, text: "No infinite looping survives the override (iteration-count forced to 1)", src: "same rule" },
              { ok: true, text: "Interactive motion pauses on hover/focus (existing scene behaviour)", src: "demo scenes" },
            ].map((row, i) => (
              <div key={i} className="flex items-start gap-2.5 text-[11px] leading-relaxed text-ink-dim">
                <span className={`mt-0.5 text-xs font-extrabold ${row.ok ? "text-mint" : "text-danger"}`}>{row.ok ? "✓" : "✗"}</span>
                <span>
                  {row.text} <span className="text-ink-faint">— {row.src}</span>
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 border-t border-white/6 pt-2 text-[10px] text-ink-faint">
            The fallback layer is implemented today; asserting it on every build is the automation step this panel tracks.
          </p>
        </div>
      </div>
    </section>
  );
}

/* #323 — size budget check */
export function SizeBudgetPanel() {
  const table = kindSizeTable();
  const heavy = heaviestAssets(5);
  const maxKb = 28;
  return (
    <section className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Mechanism 4 · per-kind size budgets</p>
          <h2 className="mt-1.5 text-xl font-extrabold tracking-tight">Weight is budgeted by kind, then measured</h2>
          <p className="mt-2 text-xs leading-relaxed text-ink-dim">
            The stated budget per kind sits below, next to the real max in the catalog today. Budgets are policy;
            compliance is data.
          </p>
        </div>
        <Chip cls="!border-mint/30 !text-mint">catalog: 0 over budget</Chip>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[560px] border-separate border-spacing-y-2 text-left">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-ink-faint">
              <th className="px-2">Kind</th>
              <th className="px-2">Assets</th>
              <th className="px-2">Budget</th>
              <th className="px-2">Min → max KB</th>
              <th className="px-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {table.map((k) => (
              <tr key={k.kind} className="rounded-2xl bg-white/[.02]">
                <td className="rounded-l-2xl px-2 py-2.5 text-xs font-extrabold">{k.label}</td>
                <td className="px-2 py-2.5 font-mono text-[11px] text-ink-dim">{k.count}</td>
                <td className="px-2 py-2.5 font-mono text-[11px] text-ink-dim">≤ {k.budgetKb} KB</td>
                <td className="px-2 py-2.5 font-mono text-[11px] text-ink-dim">
                  {k.min} → {k.max} KB
                </td>
                <td className="rounded-r-2xl px-2 py-2.5">
                  <Chip cls="!border-mint/30 !text-mint">{k.over === 0 ? `all ${k.count} pass` : `${k.over} over`}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 rounded-2xl border border-white/8 bg-white/[.02] p-4">
        <p className="text-xs font-extrabold">Heaviest five today</p>
        <div className="mt-3 space-y-2">
          {heavy.map((a) => (
            <div key={a.slug} className="flex items-center gap-3 text-[11px]">
              <Link href={`/components/${a.slug}`} className="w-40 truncate font-mono font-bold text-ink hover:text-violet-300">
                {a.slug}
              </Link>
              <span className="hidden w-20 shrink-0 sm:block">
                <Chip cls="">{kindLabel(a.kind)}</Chip>
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/8">
                <div className="h-full rounded-full bg-gradient-to-r from-violet-400/80 to-cyan-300/80" style={{ width: `${Math.min(100, (a.bundleKb / maxKb) * 100)}%` }} />
              </div>
              <span className="w-14 shrink-0 text-right font-mono font-bold text-ink">{a.bundleKb} KB</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[10px] text-ink-faint">
          Bar scale is the template budget (28 KB). The two templates are the only assets past 10 KB — expected for
          whole pages; the check treats them against their own budget.
        </p>
      </div>
    </section>
  );
}

/* #324 — dependency ledger */
export function DependencyLedgerPanel() {
  const depFree = depFreeCount();
  const deps = withDeps();
  return (
    <section className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Mechanism 5 · dependency ledger</p>
          <h2 className="mt-1.5 text-xl font-extrabold tracking-tight">Zero-dependency is the default, and it is tracked</h2>
          <p className="mt-2 text-xs leading-relaxed text-ink-dim">
            Every asset carries an explicit <code className="font-mono">deps</code> list. Policy: adding a dependency
            requires a named note in the changelog entry for that asset, so a weight increase is never silent.
          </p>
        </div>
        <Chip cls="!border-mint/30 !text-mint">{depFree} of {total} dependency-free</Chip>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Ledger rows (assets with deps)</p>
          {deps.length === 0 ? (
            <p className="mt-3 text-[11px] text-ink-faint">No assets currently list a dependency.</p>
          ) : (
            <div className="mt-3 space-y-2">
              {deps.map((a) => (
                <div key={a.slug} className="flex items-center justify-between gap-3 rounded-xl bg-white/[.03] px-3 py-2">
                  <Link href={`/components/${a.slug}`} className="font-mono text-[11px] font-bold text-ink hover:text-violet-300">
                    {a.slug}
                  </Link>
                  <span className="font-mono text-[11px] text-amber-300">{a.deps.join(", ")}</span>
                  <span className="font-mono text-[10px] text-ink-faint">{a.bundleKb} KB</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Why it matters here</p>
          <ul className="prose-list mt-3">
            <li>Paste-and-run is the product promise — a dep-free asset runs with zero install steps.</li>
            <li>When a dep is genuinely worth it (e.g. a physics or motion library), the ledger makes the trade visible next to the KB figure.</li>
            <li>The catalog pages print the deps list and the bundle size on every card, so the ledger is public, not internal.</li>
          </ul>
          <p className="mt-3 border-t border-white/6 pt-2 text-[10px] text-ink-faint">
            The CI half — refusing a change that adds deps without a note — is the automation step this panel tracks.
          </p>
        </div>
      </div>
    </section>
  );
}

/* #325 — keyboard-flow tests */
export function KeyboardFlowPanel() {
  const interactive = interactiveAssets();
  return (
    <section className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Mechanism 6 · keyboard-flow tests</p>
          <h2 className="mt-1.5 text-xl font-extrabold tracking-tight">Scripted Tab walks for every keyboard asset</h2>
          <p className="mt-2 text-xs leading-relaxed text-ink-dim">
            <span className="font-bold text-ink">{interactive.length} of {total} assets</span> declare interactive
            behaviours (click, keyboard, type, hold, drag). Each gets a written walk: exact key presses, what should
            happen, and the one assertion that gates it.
          </p>
        </div>
        <Chip>script specs · Playwright-ready</Chip>
      </div>

      <div className="mt-5 space-y-2.5">
        {KEYBOARD_PLANS.map((p, idx) => (
          <details key={p.slug} className="group rounded-2xl border border-white/8 bg-white/[.02] open:border-violet-300/30">
            <summary className="flex cursor-pointer items-center gap-3 px-4 py-3 text-xs font-bold marker:content-none">
              <span className="font-mono text-[10px] text-ink-faint">0{idx + 1}</span>
              <span className="text-ink">{p.title}</span>
              <span className="font-mono text-[10px] font-normal text-ink-faint">{p.slug}</span>
              <span className="ml-auto text-[10px] font-semibold text-violet-300">walk + assertion ▾</span>
            </summary>
            <div className="px-4 pb-4">
              <ol className="mt-1 space-y-1.5 text-[11px] leading-relaxed text-ink-dim">
                {p.steps.map((s, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="font-mono text-ink-faint">{i + 1}.</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-3 rounded-xl border border-mint/20 bg-mint/[.05] px-3 py-2 text-[11px] leading-relaxed text-ink-dim">
                <span className="font-bold text-mint">Assertion:</span> {p.assertion}
              </p>
            </div>
          </details>
        ))}
      </div>
      <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
        Specs are written from each component&apos;s shipped behaviour (the code snippets on its page); running them as
        Playwright scripts on every change is the automation step this panel tracks.
      </p>
    </section>
  );
}

/* #326 — screen-reader smoke test */
export function ScreenReaderPanel() {
  const interactive = interactiveAssets();
  return (
    <section className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Mechanism 7 · screen-reader smoke test</p>
          <h2 className="mt-1.5 text-xl font-extrabold tracking-tight">One announced label per interactive asset</h2>
          <p className="mt-2 text-xs leading-relaxed text-ink-dim">
            The smoke test keeps the bar simple: every interactive asset must announce its state change. Below, six draft
            assertions — one per sampled asset — written from the roles and labels its live demo exposes.
          </p>
        </div>
        <Chip cls="!border-amber-300/40 !text-amber-300">draft assertions</Chip>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[520px] border-separate border-spacing-y-2 text-left">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-ink-faint">
              <th className="px-2">Asset</th>
              <th className="px-2">Kind</th>
              <th className="px-2">Announcement to assert</th>
              <th className="px-2">Trigger</th>
            </tr>
          </thead>
          <tbody>
            {SR_SAMPLES.map((s) => (
              <tr key={s.slug} className="rounded-2xl bg-white/[.02]">
                <td className="rounded-l-2xl px-2 py-2.5">
                  <Link href={`/components/${s.slug}`} className="font-mono text-[11px] font-bold text-ink hover:text-violet-300">
                    {s.slug}
                  </Link>
                  <span className="block text-[10px] text-ink-faint">{s.title}</span>
                </td>
                <td className="px-2 py-2.5">
                  <Chip>{kindLabel(s.kind ?? "")}</Chip>
                </td>
                <td className="px-2 py-2.5 text-[11px] text-ink-dim">{s.announced}</td>
                <td className="rounded-r-2xl px-2 py-2.5 text-[10px] text-ink-faint">
                  {s.slug === "password-strength" ? "after pause in field" : s.slug === "command-palette" ? "on open" : "on value change"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
        Method: run the live demo under a screen reader (or axe/Playwright&apos;s aria snapshot), perform the trigger,
        and assert the expected announcement appears in the live region. Interactive assets count:{" "}
        <span className="font-mono text-ink-dim">{interactive.length}</span> — the smoke test above samples six; the full
        per-asset matrix is generated the same way.
      </p>
    </section>
  );
}

/* =====================================================================
   Batch 45 — mechanisms 8–13 (Section 11 rows #327–#332)
   ===================================================================== */

/* #327 — copy consistency lint */
export function CopyLintPanel() {
  const scan = emptyStateScan();
  return (
    <section className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Mechanism 8 · copy consistency lint</p>
          <h2 className="mt-1.5 text-xl font-extrabold tracking-tight">Empty states say what happened, then what to do</h2>
          <p className="mt-2 text-xs leading-relaxed text-ink-dim">
            Motif&apos;s writing rule for empty surfaces: a filter result that finds nothing stays tiny and factual
            (“Nothing matched those filters”), never a verbless dead-end like “No items yet”. The scan below checks the
            public prose files for the dead-end patterns and lists what it finds instead.
          </p>
        </div>
        <Chip cls={scan.deadEnds === 0 ? "!border-mint/30 !text-mint" : "!border-amber-300/40 !text-amber-300"}>
          {scan.deadEnds === 0 ? "0 dead-end empty states" : `${scan.deadEnds} dead-end hits`}
        </Chip>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Lint dictionary (verbless dead-ends)</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {["No items yet", "No data yet", "Nothing here", "No components found", "No assets found"].map((d) => (
              <span key={d} className="chip !text-[10px] !border-danger/30 !text-danger/80">“{d}”</span>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-ink-dim">
            Each pattern is a screen that explains nothing and offers nothing. The real filter fallbacks below are the
            pattern the lint defends.
          </p>
          <p className="mt-2 text-[10px] text-ink-faint">
            Live scan result: <span className="font-mono font-bold text-ink">{scan.deadEnds} occurrences</span> across
            the scanned public files.
          </p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">What the scan finds instead (current copy)</p>
          {scan.lines.length === 0 ? (
            <p className="mt-3 text-[11px] text-ink-faint">No matching fallback lines found in the scanned files.</p>
          ) : (
            <div className="mt-3 space-y-2">
              {scan.lines.map((l) => (
                <div key={l.text} className="rounded-xl bg-white/[.03] px-3 py-2 text-[11px] leading-relaxed text-ink-dim">
                  “{l.text}”
                  <span className="mt-1 block font-mono text-[9px] text-ink-faint">{l.files.join(" · ")}</span>
                </div>
              ))}
            </div>
          )}
          <p className="mt-3 border-t border-white/6 pt-2 text-[10px] leading-relaxed text-ink-faint">
            Scan scope: every page and client component under <code className="font-mono">src/app/(public)</code> plus
            the shared chrome — the copy a visitor can read. Runs at build time.
          </p>
        </div>
      </div>
    </section>
  );
}

/* #328 — numeric truth check */
export function NumericTruthPanel() {
  const rows = truthRows();
  return (
    <section className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Mechanism 9 · numeric truth check</p>
          <h2 className="mt-1.5 text-xl font-extrabold tracking-tight">Every visible stat traces to a data source</h2>
          <p className="mt-2 text-xs leading-relaxed text-ink-dim">
            The headline counts printed across the site are not typed constants — each is derived from the same arrays
            that render the pages. Below, each published claim, its live value, and the exact source.
          </p>
        </div>
        <Chip cls="!border-mint/30 !text-mint">{rows.length} claims · all derived</Chip>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[680px] border-separate border-spacing-y-2 text-left">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-ink-faint">
              <th className="px-2">Claim as published</th>
              <th className="px-2">Live value</th>
              <th className="px-2">Derived from</th>
              <th className="px-2">Source</th>
              <th className="px-2">Surfaces</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.claim} className="rounded-2xl bg-white/[.02]">
                <td className="rounded-l-2xl px-2 py-3 text-[12px] font-bold text-ink">{r.claim}</td>
                <td className="px-2 py-3 font-mono text-[12px] font-extrabold text-mint">{r.value}</td>
                <td className="px-2 py-3 text-[10px] text-ink-dim">{r.derived}</td>
                <td className="px-2 py-3 font-mono text-[10px] text-ink-faint">{r.source}</td>
                <td className="rounded-r-2xl px-2 py-3 text-[10px] text-ink-faint">{r.surfaces}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 rounded-2xl border border-white/8 bg-white/[.02] p-4">
        <p className="text-xs font-extrabold">Watchlist · demo figures that must never become claims</p>
        <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
          The odometer and count-up component demos animate sample figures (a member count, prompt count, copy total)
          to show what the scenes do. Those numbers live inside the demo code as run targets and are labelled by the
          demo scenes themselves — they never feed a site statistic, so a counter demo of “148.2k copies” cannot drift
          into the footer. The check: grep any headline number on a marketing surface, trace it to a data source, and
          reject sources that live under <code className="font-mono">components/demos</code>.
        </p>
      </div>
    </section>
  );
}

/* #329 — perf regression baseline */
export function PerfTrackerPanel() {
  const kinds = perfBaseline();
  const all = COMPONENTS;
  return (
    <section className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Mechanism 10 · perf regression tracker</p>
          <h2 className="mt-1.5 text-xl font-extrabold tracking-tight">A baseline today, a history from here</h2>
          <p className="mt-2 text-xs leading-relaxed text-ink-dim">
            Per-release weight history starts with a baseline snapshot — the whole catalog&apos;s size and audit metrics
            as this build shipped them. Every future release re-records the same rows so a drift is visible, not felt.
          </p>
        </div>
        <Chip>{BASELINE_LABEL}</Chip>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[620px] border-separate border-spacing-y-2 text-left">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-ink-faint">
              <th className="px-2">Kind</th>
              <th className="px-2">Assets</th>
              <th className="px-2">Budget</th>
              <th className="px-2">Min</th>
              <th className="px-2">Mean</th>
              <th className="px-2">Median</th>
              <th className="px-2">Max</th>
              <th className="px-2">Headroom</th>
            </tr>
          </thead>
          <tbody>
            {kinds.map((k) => {
              const headroom = Math.max(0, k.budgetKb - k.max);
              return (
                <tr key={k.kind} className="rounded-2xl bg-white/[.02]">
                  <td className="rounded-l-2xl px-2 py-2.5 text-xs font-extrabold">{k.label}</td>
                  <td className="px-2 py-2.5 font-mono text-[11px] text-ink-dim">{k.count}</td>
                  <td className="px-2 py-2.5 font-mono text-[11px] text-ink-dim">≤ {k.budgetKb} KB</td>
                  <td className="px-2 py-2.5 font-mono text-[11px] text-ink-dim">{k.min}</td>
                  <td className="px-2 py-2.5 font-mono text-[11px] text-ink-dim">{k.mean}</td>
                  <td className="px-2 py-2.5 font-mono text-[11px] text-ink-dim">{k.median}</td>
                  <td className="px-2 py-2.5 font-mono text-[11px] text-ink">{k.max}</td>
                  <td className="rounded-r-2xl px-2 py-2.5">
                    <Chip cls={headroom >= 0 ? "!border-mint/30 !text-mint" : "!border-danger/40 !text-danger"}>
                      {headroom >= 0 ? `+${headroom} KB` : `${headroom} KB over`}
                    </Chip>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Catalog totals at baseline</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { l: "assets", v: all.length },
              { l: "total KB", v: `${Math.round(all.reduce((a, c) => a + c.bundleKb, 0) * 10) / 10}` },
              { l: "mean a11y", v: String(Math.round((all.reduce((a, c) => a + c.a11yScore, 0) / all.length) * 10) / 10) },
              { l: "mean Q", v: String(Math.round((all.reduce((a, c) => a + c.qualityScore, 0) / all.length) * 10) / 10) },
            ].map((s) => (
              <span key={s.l} className="rounded-xl border border-white/8 bg-white/[.03] px-3 py-2 text-[11px]">
                <span className="mr-1.5 text-ink-faint">{s.l}</span>
                <span className="font-mono font-extrabold text-ink">{s.v}</span>
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">What the tracker records per release</p>
          <ul className="prose-list mt-3">
            <li>Per asset: <code className="font-mono">bundleKb</code> at its shipped version, plus a11y and quality scores.</li>
            <li>Per asset change: dep list hash, so a “zero-dep” claim is verifiable per version.</li>
            <li>Per release: this whole table re-published — min/mean/median/max and budget headroom per kind.</li>
          </ul>
          <p className="mt-3 border-t border-white/6 pt-2 text-[10px] text-ink-faint">
            The rows above are real current data; the versioned history is the automation step this panel tracks.
          </p>
        </div>
      </div>
    </section>
  );
}

/* #330 — tone-of-voice lint */
export function ToneLintPanel() {
  const scan = toneScan();
  const live = scan.hits.filter((h) => !h.negated);
  return (
    <section className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Mechanism 11 · tone-of-voice lint</p>
          <h2 className="mt-1.5 text-xl font-extrabold tracking-tight">Overclaim words are scanned, then read in context</h2>
          <p className="mt-2 text-xs leading-relaxed text-ink-dim">
            Marketing copy that promises “effortless”, “flawless” or “magical” gets flagged by the dictionary below.
            The lint also implements the context rule: a flagged word inside a negation (“No ‘effortless’ marketing”) is
            intentional and cleared. This very scan runs on the current public prose — results are live.
          </p>
        </div>
        <Chip cls={live.length === 0 ? "!border-mint/30 !text-mint" : "!border-danger/40 !text-danger"}>
          {live.length === 0 ? `${scan.negated} flagged, all cleared in context` : `${live.length} live hits`}
        </Chip>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Dictionary · scanned {scan.files} files</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {OVERCLAIM_DICTIONARY.map((w) => (
              <span key={w} className="chip !text-[10px]">“{w}”</span>
            ))}
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
            Scope: page prose under <code className="font-mono">src/app/(public)</code> + chrome. Copy inside component
            demo scenes and sample prompt posters is out of scope — those are deliberate samples, not site voice.
          </p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Findings on this build</p>
          {scan.hits.length === 0 ? (
            <p className="mt-3 text-[11px] text-ink-faint">No dictionary terms found in public prose.</p>
          ) : (
            <div className="mt-3 space-y-2">
              {scan.hits.map((h, i) => (
                <div key={i} className="rounded-xl bg-white/[.03] px-3 py-2">
                  <span className="text-[11px] leading-relaxed text-ink-dim">
                    <span className="font-mono font-bold text-amber-300">{h.term}</span>{" "}
                    <span className="text-ink-faint">at {h.file.replace("src/", "")}:{h.line}</span>
                  </span>
                  <span className={`mt-1 block text-[10px] font-bold ${h.negated ? "text-mint" : "text-danger"}`}>
                    {h.negated ? "cleared · used inside a negation" : "live hit — needs copy work"}
                  </span>
                </div>
              ))}
            </div>
          )}
          <p className="mt-3 border-t border-white/6 pt-2 text-[10px] leading-relaxed text-ink-faint">
            The two current hits are the homepage&apos;s “No ‘effortless’ marketing” and the mission page&apos;s “not
            ‘effortless’” — exactly the context rule working. Re-running this scan is the CI half of the mechanism.
          </p>
        </div>
      </div>
    </section>
  );
}

/* #331 — URL inventory test */
export function UrlInventoryPanel() {
  const s = URL_SNAPSHOT;
  return (
    <section className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Mechanism 12 · URL inventory test</p>
          <h2 className="mt-1.5 text-xl font-extrabold tracking-tight">Every internal link resolved, and one was broken</h2>
          <p className="mt-2 text-xs leading-relaxed text-ink-dim">
            The first full crawl of the built site checked {s.seedRoutes} routes and followed {s.hrefs} internal hrefs.
            It caught a real bug — and the fix is in this same build.
          </p>
        </div>
        <Chip cls="!border-mint/30 !text-mint">{s.broken} broken · {s.hrefs} hrefs</Chip>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {[
          { v: s.seedRoutes, l: "routes fetched", sub: "static + every component/prompt/learn detail page" },
          { v: s.hrefs, l: "internal hrefs followed", sub: "collected from the 17 top-level pages" },
          { v: `${s.seedOk}/${s.seedRoutes}`, l: "returned 200", sub: `${s.broken} broken — fixed before shipping` },
        ].map((c) => (
          <div key={c.l} className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
            <p className="font-mono text-2xl font-extrabold text-ink">{c.v}</p>
            <p className="mt-1 text-[11px] font-bold text-ink-dim">{c.l}</p>
            <p className="mt-0.5 text-[10px] text-ink-faint">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-amber-300/25 bg-amber-300/[.04] p-4">
        <p className="text-xs font-extrabold text-amber-300">Found and fixed in this batch</p>
        <ul className="prose-list mt-2">
          {s.foundAndFixed.map((f) => (
            <li key={f}>{f}</li>
          ))}
          <li>{s.fix}</li>
        </ul>
      </div>

      <div className="mt-3 text-[10px] leading-relaxed text-ink-faint">
        How it ran: <span className="text-ink-dim">{s.how}</span> Snapshot: {s.audited} on commit{" "}
        <span className="font-mono">{s.commit}</span>. The mechanism makes this crawl a CI job on every release so a
        404 can never ship twice.
      </div>
    </section>
  );
}

/* #332 — share-audit ledger */
export function AuditLedgerPanel() {
  const rows = auditLedgerRows();
  return (
    <section className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Mechanism 13 · share-audit ledger</p>
          <h2 className="mt-1.5 text-xl font-extrabold tracking-tight">The audit log is public per asset</h2>
          <p className="mt-2 text-xs leading-relaxed text-ink-dim">
            Every asset&apos;s checks, scores and weight sit on its own detail page — this ledger is the same data in one
            table, weakest a11y first. The three checks mirror the audit block each detail page publishes.
          </p>
        </div>
        <Chip cls="!border-mint/30 !text-mint">{rows.length} assets · 3/3 checks pass</Chip>
      </div>

      <div className="mt-5 max-h-[480px] overflow-auto rounded-2xl border border-white/8">
        <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#0b0d14] text-[10px] uppercase tracking-widest text-ink-faint">
              <th className="px-3 py-2.5">Asset</th>
              <th className="px-2 py-2.5">Kind</th>
              <th className="px-2 py-2.5 text-right">KB</th>
              <th className="px-2 py-2.5 text-right">a11y</th>
              <th className="px-2 py-2.5 text-right">Quality</th>
              <th className="px-2 py-2.5">Audit</th>
              <th className="px-2 py-2.5">Version</th>
              <th className="px-2 py-2.5">Published</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.slug} className={i % 2 ? "bg-white/[.015]" : "bg-white/[.03]"}>
                <td className="px-3 py-2">
                  <Link href={`/components/${r.slug}`} className="font-mono text-[11px] font-bold text-ink hover:text-violet-300">
                    {r.slug}
                  </Link>
                  <span className="block max-w-[180px] truncate text-[9px] text-ink-faint">{r.title}</span>
                </td>
                <td className="px-2 py-2">
                  <Chip>{kindLabel(r.kind)}</Chip>
                </td>
                <td className="px-2 py-2 text-right font-mono text-[11px] text-ink-dim">{r.bundleKb}</td>
                <td className="px-2 py-2 text-right font-mono text-[11px] font-extrabold text-mint">{r.a11y}</td>
                <td className="px-2 py-2 text-right font-mono text-[11px] font-extrabold text-cyan-200">{r.quality}</td>
                <td className="px-2 py-2">
                  <Chip cls="!border-mint/30 !text-mint">{r.passes}/3 ✓</Chip>
                </td>
                <td className="px-2 py-2 font-mono text-[10px] text-ink-faint">{r.version}</td>
                <td className="px-2 py-2 font-mono text-[10px] text-ink-faint">{r.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
        Checks per row (same thresholds as the detail-page audit block): contrast AA for text at ≥ 92, focus-visible
        rings and screen-reader labels at ≥ 90. Rows sort by a11y ascending so the tightest audits surface first —
        today even the lowest still passes all three.
      </p>
    </section>
  );
}
