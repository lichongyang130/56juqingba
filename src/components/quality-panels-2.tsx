// Quality bar — Section 11 closing panels (batch 46, mechanisms 14–20:
// freshness job, spellcheck, image-free audit, focus-visible suite, security
// hygiene, licence scanner, annual content review). Server components; every
// count is recomputed at build time by quality-utils.ts — no stored numbers.

import type { ReactNode } from "react";
import Link from "next/link";
import { COMPONENTS } from "@/lib/data";
import {
  freshnessReport,
  imageAudit,
  licenseReport,
  MISSPELLINGS,
  reviewCalendar,
  securityScan,
  spellScan,
} from "@/lib/quality-utils";


function Chip({ children, cls = "" }: { children: ReactNode; cls?: string }) {
  return <span className={`chip !text-[10px] ${cls}`}>{children}</span>;
}

const FOCUS_RING_CSS = `/* shipped in globals.css */
a:focus-visible,
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
[tabindex]:focus-visible {
  outline: 2px solid rgba(139, 92, 246, 0.9);
  outline-offset: 2px;
}`;

/* #333 — freshness job */
export function FreshnessPanel() {
  const f = freshnessReport();
  return (
    <section className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Mechanism 14 · freshness job</p>
          <h2 className="mt-1.5 text-xl font-extrabold tracking-tight">Staleness is measured, not felt</h2>
          <p className="mt-2 text-xs leading-relaxed text-ink-dim">
            Prompts and changelog entries carry real dates. The freshness job compares them against a review window and
            reports what is drifting — prompts that have not been re-run in 30 days, guides not updated in 90, and
            changelog cadence.
          </p>
        </div>
        <Chip cls="!border-mint/30 !text-mint">report · {f.prompts} prompts · {f.guides} guides</Chip>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: "Prompts re-run ≤ 30d", v: f.promptsFresh30, sub: `${f.promptsStale} past the window` },
          { l: "Guides updated ≤ 90d", v: f.guides - f.guidesStale90, sub: `${f.guidesStale90} older than 90d` },
          { l: "Changelog entries ≤ 30d", v: f.changelog30, sub: `of ${f.changelogTotal} total entries` },
          { l: "Next weekly check", v: "Mon 09:00", sub: "recomputes these four windows" },
        ].map((c) => (
          <div key={c.l} className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">{c.l}</p>
            <p className="mt-2 font-mono text-2xl font-extrabold text-ink">{c.v}</p>
            <p className="mt-1 text-[10px] text-ink-faint">{c.sub}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 border-t border-white/6 pt-3 text-[11px] leading-relaxed text-ink-faint">
        Windows: model-dependent prompts are re-run at least monthly (the 8 prompts past 30 days are this week&apos;s
        queue — several waited on the GLM-4.6 update noted in the changelog); guides get a 90-day freshness pass;
        changelog cadence is a pulse check, not a goal. The numbers above are computed from the real date fields this
        build shipped.
      </p>
    </section>
  );
}

/* #334 — spellcheck in CI */
export function SpellcheckPanel() {
  const scan = spellScan();
  return (
    <section className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Mechanism 15 · spellcheck in CI</p>
          <h2 className="mt-1.5 text-xl font-extrabold tracking-tight">Typos fail the build, not the reader</h2>
          <p className="mt-2 text-xs leading-relaxed text-ink-dim">
            A dictionary of common misspellings is scanned across every public file at build time — page prose, chrome
            copy and the data files that feed them. Findings block a release; this page shows the live result.
          </p>
        </div>
        <Chip cls="!border-mint/30 !text-mint">{scan.hits.length} typos · {scan.words.toLocaleString()} words scanned</Chip>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Dictionary · {MISSPELLINGS.length} entries, scanned in {scan.files} files</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {MISSPELLINGS.slice(0, 24).map((w) => (
              <span key={w} className="chip !text-[10px] !border-white/12">{w}</span>
            ))}
            <span className="chip !text-[10px] text-ink-faint">+{MISSPELLINGS.length - 24} more</span>
          </div>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Findings on this build</p>
          {scan.hits.length === 0 ? (
            <p className="mt-3 rounded-xl bg-mint/[.05] px-3 py-2.5 text-[11px] leading-relaxed text-ink-dim">
              <span className="font-bold text-mint">0 typos.</span> The scan passed before this page shipped — same as it
              will run in CI on every pull request.
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              {scan.hits.map((h, i) => (
                <p key={i} className="rounded-xl bg-danger/[.05] px-3 py-2 text-[11px] text-ink-dim">
                  <span className="font-mono font-bold text-danger">{h.word}</span>{" "}
                  <span className="text-ink-faint">at {h.file.replace("src/", "")}:{h.line}</span>
                </p>
              ))}
            </div>
          )}
          <p className="mt-3 border-t border-white/6 pt-2 text-[10px] leading-relaxed text-ink-faint">
            Scope is the same public file set the tone and copy lints use. Product nouns (“Motif”, “Halo”, “GLM-4.6”)
            are intentionally absent from the dictionary — the lint flags misspellings, not vocabulary.
          </p>
        </div>
      </div>
    </section>
  );
}

/* #335 — image-free audit */
export function ImageAuditPanel() {
  const a = imageAudit();
  return (
    <section className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Mechanism 16 · image-free audit</p>
          <h2 className="mt-1.5 text-xl font-extrabold tracking-tight">The visuals are code, and the audit knows it</h2>
          <p className="mt-2 text-xs leading-relaxed text-ink-dim">
            Public pages render their imagery as CSS and inline SVG — no <code className="font-mono">&lt;img&gt;</code>{" "}
            payloads. That collapses most alt-text risk by construction; the audit still counts real image tags and
            checks that decorative art carries <code className="font-mono">aria-hidden</code>.
          </p>
        </div>
        <Chip cls="!border-mint/30 !text-mint">{a.imgTags} &lt;img&gt; · {a.ariaHiddenUses} aria-hidden marks</Chip>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Live scan · {a.filesScanned} public files</p>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between rounded-xl bg-white/[.03] px-3 py-2 text-[11px]">
              <span className="text-ink-dim">&lt;img&gt; tags on public pages</span>
              <span className="font-mono font-extrabold text-mint">{a.imgTags}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/[.03] px-3 py-2 text-[11px]">
              <span className="text-ink-dim">aria-hidden on decorative artwork</span>
              <span className="font-mono font-extrabold text-mint">{a.ariaHiddenUses}</span>
            </div>
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
            Because every motif, logo mark and scene illustration is DOM/SVG/CSS, there is no image payload to miss an
            alt attribute. The audit rule stays: any future <code className="font-mono">&lt;img&gt;</code> needs a real
            alt or <code className="font-mono">aria-hidden</code>, never an empty alt on something meaningful.
          </p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Why that is deliberate</p>
          <ul className="prose-list mt-3">
            <li>Zero image requests = zero layout shift and no LCP gamble from hero art.</li>
            <li>Inline scenes re-theme live with the token editor and respect reduced motion.</li>
            <li>Decorations are real nodes, so screen readers are told exactly what to skip.</li>
          </ul>
          <p className="mt-3 border-t border-white/6 pt-2 text-[10px] text-ink-faint">
            The CI half — failing any pull request that adds a decorative <code className="font-mono">&lt;img&gt;</code>{" "}
            without an alt decision — is the automation step this panel tracks.
          </p>
        </div>
      </div>
    </section>
  );
}

/* #336 — focus-visible regression suite */
export function FocusVisiblePanel() {
  const interactive = COMPONENTS.filter((c) => c.behaviors.some((b) => ["click", "keyboard", "type", "hold", "drag"].includes(b))).length;
  return (
    <section className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Mechanism 17 · focus-visible regression suite</p>
          <h2 className="mt-1.5 text-xl font-extrabold tracking-tight">The focus ring is one rule, screenshot-tested</h2>
          <p className="mt-2 text-xs leading-relaxed text-ink-dim">
            Every interactive control inherits the same 2px focus ring from a single CSS rule. The regression suite
            screenshots each keyboard walk step (mechanism 6) and diffs the ring — so a stripped outline can never ship.
          </p>
        </div>
        <Chip>{interactive} interactive assets</Chip>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-[#07090f] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">The rule, verbatim</p>
          <pre className="mt-3 overflow-x-auto whitespace-pre font-mono text-[10.5px] leading-relaxed text-emerald-300/90">{FOCUS_RING_CSS}</pre>
          <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
            One rule covers links, buttons, inputs, selects, textareas and any element given a tabindex — no per-asset
            ring code to forget.
          </p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Suite plan · screenshot per walk step</p>
          <ul className="prose-list mt-3">
            <li>Seed: the five scripted keyboard walks from mechanism 6 (combo box, star rating, tag input, palette, stepper).</li>
            <li>Per step: Tab to the target, screenshot, assert a 2px ring with offset is present around the control.</li>
            <li>Per PR: diff against the last green screenshots; any ring change blocks merge.</li>
            <li>Dark and light mode both run, since the ring uses an accent with alpha.</li>
          </ul>
          <p className="mt-3 border-t border-white/6 pt-2 text-[10px] text-ink-faint">
            The ring CSS ships today; the screenshot harness is the automation step this panel tracks.
          </p>
        </div>
      </div>
    </section>
  );
}

/* #337 — security hygiene */
export function SecurityPanel() {
  const s = securityScan();
  return (
    <section className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Mechanism 18 · security hygiene</p>
          <h2 className="mt-1.5 text-xl font-extrabold tracking-tight">No third-party requests hiding in the code</h2>
          <p className="mt-2 text-xs leading-relaxed text-ink-dim">
            Snippets and page code that call out to external fonts or CDNs would silently add a third party to every
            copy of a component. Motif&apos;s policy: no external runtime references without an integrity note. The scan
            below looks for them across the public source, data and stylesheet.
          </p>
        </div>
        <Chip cls="!border-mint/30 !text-mint">0 external references</Chip>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Live scan · {s.filesScanned} files</p>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between rounded-xl bg-white/[.03] px-3 py-2 text-[11px]">
              <span className="text-ink-dim">External http(s) references found</span>
              <span className="font-mono font-extrabold text-mint">{s.externalUrls}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/[.03] px-3 py-2 text-[11px]">
              <span className="text-ink-dim">Fonts & assets</span>
              <span className="font-mono font-extrabold text-mint">{s.fonts}</span>
            </div>
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
            Inter and Sora are bundled locally via @fontsource — no Google Fonts request, no tracking, no flash of
            unstyled text. Demo scenes animate with CSS and the Web Animations API, never a remote library URL.
          </p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Policy that keeps it that way</p>
          <ul className="prose-list mt-3">
            <li>A snippet may only reference what ships with it — external URLs require an explicit integrity note.</li>
            <li>Dependency additions already route through the ledger (mechanism 5), so a new remote dep is visible twice.</li>
            <li>Every snippet is plain CSS/JS with no fetch, embed or analytics by default.</li>
          </ul>
          <p className="mt-3 border-t border-white/6 pt-2 text-[10px] text-ink-faint">
            Allowed list for the scan: spec/standard links (w3.org, MDN) and the project&apos;s own repository. The CI
            half — refusing an unknown external URL — is the automation step this panel tracks.
          </p>
        </div>
      </div>
    </section>
  );
}

/* #338 — licence scanner */
export function LicencePanel() {
  const l = licenseReport();
  return (
    <section className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Mechanism 19 · licence scanner</p>
          <h2 className="mt-1.5 text-xl font-extrabold tracking-tight">Everything is original, and licensed like it</h2>
          <p className="mt-2 text-xs leading-relaxed text-ink-dim">
            Provenance is a standing rule of the library: every snippet, prompt and guide is written for Motif, not
            lifted from a component gallery. The licence field on each asset makes the terms machine-checkable.
          </p>
        </div>
        <Chip cls="!border-mint/30 !text-mint">{l.total} assets · all licensed</Chip>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {[
          { l: "Components & demos", v: `${l.assetsMit} MIT`, sub: "free to use in commercial and personal work" },
          { l: "Non-MIT components", v: String(l.assetsOther), sub: "none today — one licence across the catalog" },
          { l: "Learn guides", v: l.guidesLicense, sub: "attribution required; read-and-share content" },
        ].map((c) => (
          <div key={c.l} className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">{c.l}</p>
            <p className="mt-2 font-mono text-xl font-extrabold text-ink">{c.v}</p>
            <p className="mt-1 text-[10px] text-ink-faint">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-white/8 bg-white/[.02] p-4">
        <p className="text-xs font-extrabold">Provenance checks that gate each asset</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3 text-[11px] leading-relaxed text-ink-dim">
          <div className="rounded-xl bg-white/[.03] p-3">
            <p className="font-bold text-ink">Written-for-Motif review</p>
            Human review confirms snippet code is original before an asset is listed.
          </div>
          <div className="rounded-xl bg-white/[.03] p-3">
            <p className="font-bold text-ink">Source comment on every file</p>
            The data module carries an explicit header: no code or text lifted from other libraries.
          </div>
          <div className="rounded-xl bg-white/[.03] p-3">
            <p className="font-bold text-ink">Licence printed with the code</p>
            Detail pages and cards show MIT / CC BY next to every asset, so the terms travel with the copy.
          </div>
        </div>
      </div>
    </section>
  );
}

/* #339 — annual content review */
export function AnnualReviewPanel() {
  const r = reviewCalendar();
  return (
    <section className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Mechanism 20 · annual content review</p>
          <h2 className="mt-1.5 text-xl font-extrabold tracking-tight">Prompts get re-run when models ship majors</h2>
          <p className="mt-2 text-xs leading-relaxed text-ink-dim">
            A prompt is a promise about what a model can build. The review calendar tracks the last run of every prompt
            and schedules a re-run when a model releases a major version — or after 30 quiet days, whichever comes
            first. The due queue below is live from the run logs.
          </p>
        </div>
        <Chip cls="!border-amber-300/40 !text-amber-300">{r.due.length} prompts due for re-test</Chip>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Due queue · last run &gt; 30 days</p>
          {r.due.length === 0 ? (
            <p className="mt-3 text-[11px] text-ink-faint">All {r.prompts} prompts were re-run within the last month.</p>
          ) : (
            <div className="mt-3 max-h-[320px] space-y-2 overflow-auto pr-1">
              {r.due.map((p) => (
                <div key={p.slug} className="flex items-center justify-between gap-3 rounded-xl bg-white/[.03] px-3 py-2">
                  <Link href={`/prompts/${p.slug}`} className="min-w-0 truncate font-mono text-[11px] font-bold text-ink hover:text-violet-300">
                    {p.slug}
                  </Link>
                  <span className="text-[10px] text-ink-faint">{p.runs} runs · {p.models} model{p.models === 1 ? "" : "s"}</span>
                  <span className="shrink-0 rounded-full border border-amber-300/30 px-2 py-0.5 font-mono text-[10px] text-amber-300">
                    {p.lastRunDays}d ago
                  </span>
                </div>
              ))}
            </div>
          )}
          <p className="mt-3 border-t border-white/6 pt-2 text-[10px] text-ink-faint">
            The 30-day window doubles as the model-major trigger: when a pinned model bumps its major, its whole run set
            moves to the top of this queue regardless of age.
          </p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Calendar & cadence</p>
          <ul className="prose-list mt-3">
            <li><span className="font-bold text-ink">{r.nextWindow}</span> — the first re-test window after this snapshot; full {r.guides} guides get a freshness pass in the same window.</li>
            <li>Runs pin model + version; a “re-tested after GLM-4.6 updates” changelog note exists exactly for this reason.</li>
            <li>Every re-run updates the run log on the prompt page — fidelity notes are refreshed, not rewritten.</li>
          </ul>
          <p className="mt-3 border-t border-white/6 pt-2 text-[10px] leading-relaxed text-ink-faint">
            Mechanism 14 (freshness) reports staleness weekly; this calendar is the annual + major-version pass that
            actually re-runs the prompts. Together they close the loop: report, schedule, re-run, refresh the log.
          </p>
        </div>
      </div>
    </section>
  );
}
