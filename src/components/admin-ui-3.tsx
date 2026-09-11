"use client";

// Admin client surfaces, part two — Section 13, batch 52.
// #372 copy inspector · #373 prompt re-run console · #374 changelog composer
// #375 command palette · #376 notification centre
//
// The re-run console is a labelled simulation and says so on every log line.
// Everything else is preview or draft: nothing here publishes, and nothing
// leaves the browser.

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AssetCard, PromptCard } from "@/components/cards";
import { COMPONENTS, PROMPTS } from "@/lib/data";
import type { Asset } from "@/lib/types";
import { RERUN_MODELS, rerunFidelity, rerunScript } from "@/lib/community";
import {
  ADMIN_SCHEDULE_KEY,
  CHANGELOG_TAGS,
  adminCommands,
  autoLinkAssets,
  changelogIssues,
  changelogSnippet,
  contentHealth,
  healthSummary,
  HEALTH_THRESHOLDS,
  matchCommands,
  notifications,
  scheduleBoard,
  type AuditEntry,
  type ChangelogDraft,
  type HealthRow,
  type ScheduleItem,
} from "@/lib/admin";
import { MODERATION_SEED, MODERATION_STORAGE_KEY } from "@/lib/community";

const ADMIN_AUDIT_KEY = "motif-admin-audit-trail";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function useStored<T>(key: string, event: string, fallback: T): [T, boolean] {
  const [value, setValue] = useState<T>(fallback);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const sync = () => {
      setValue(readJson<T>(key, fallback));
      setHydrated(true);
    };
    const raf = requestAnimationFrame(sync);
    window.addEventListener(event, sync);
    window.addEventListener("storage", sync);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener(event, sync);
      window.removeEventListener("storage", sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, event]);
  return [value, hydrated];
}

/* ===================================================================
   #372 — copy inspector: the real card, rendered from edited fields
   =================================================================== */

export function CopyInspector() {
  const [slug, setSlug] = useState(COMPONENTS[0].slug);
  const base = COMPONENTS.find((c) => c.slug === slug) ?? COMPONENTS[0];
  const [title, setTitle] = useState(base.title);
  const [description, setDescription] = useState(base.description);
  const [tags, setTags] = useState(base.tags.join(", "));
  const [status, setStatus] = useState(base.status);
  const [view, setView] = useState<"card" | "detail">("card");

  const load = (next: string) => {
    const a = COMPONENTS.find((c) => c.slug === next) ?? COMPONENTS[0];
    setSlug(next);
    setTitle(a.title);
    setDescription(a.description);
    setTags(a.tags.join(", "));
    setStatus(a.status);
  };

  const preview: Asset = {
    ...base,
    title,
    description,
    tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    status,
  };

  const notes: { ok: boolean; text: string }[] = [
    {
      ok: title.trim().length >= 3,
      text: `Title is ${title.trim().length} characters. Neither view clamps it — the card header wraps and pushes the tag row down — but the longest published title is 28, so anything past that is uncharted.`,
    },
    {
      ok: description.trim().length >= 40,
      text:
        view === "card"
          ? `Description is ${description.trim().length} characters, and the library card does not print it at all — switch to Detail header to read it. Every published description is 117–203 characters.`
          : `Description is ${description.trim().length} characters, printed whole at 14px with no clamp, so whatever is here ships. Every published description is 117–203 characters.`,
    },
    {
      ok: preview.tags.length >= 2,
      text: `${preview.tags.length} tag${preview.tags.length === 1 ? "" : "s"} — every published component carries three to six, search matches all of them, and the card prints only the first three.`,
    },
    { ok: true, text: `Status “${status}” is a legal catalog value — the four are draft, review, live and archived. No public listing filters on it, so this is a record of intent rather than a visibility switch.` },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Copy inspector</p>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-dim">
              Edit the words here and see them rendered by the same card components the public library uses — not a
              mockup drawn to match, the actual component with your text in it. Long descriptions are the usual way a card
              breaks; this is where you see that before publishing.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select value={slug} onChange={(e) => load(e.target.value)} className="input max-w-xs !py-2 text-xs" aria-label="Choose the asset to open">
              {COMPONENTS.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.title}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => load(slug)}
              className="btn btn-ghost !px-3 !py-2 text-xs"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="space-y-3">
            <label className="block">
              <span className="field-label">Title</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="input !py-2 text-xs" />
            </label>
            <label className="block">
              <span className="field-label">Description</span>
              <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="input text-xs" />
            </label>
            <label className="block">
              <span className="field-label">Tags</span>
              <input value={tags} onChange={(e) => setTags(e.target.value)} className="input !py-2 text-xs" />
            </label>
            <label className="block">
              <span className="field-label">Status</span>
              <select value={status} onChange={(e) => setStatus(e.target.value as Asset["status"])} className="input !py-2 text-xs">
                {(["draft", "review", "live", "archived"] as const).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <div className="rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Field notes</p>
              <ul className="mt-2 space-y-1">
                {notes.map((n) => (
                  <li key={n.text} className={`text-[10px] leading-relaxed ${n.ok ? "text-ink-faint" : "text-amber-300"}`}>
                    {n.ok ? "·" : "!"} {n.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Live preview</p>
              <div className="flex gap-1">
                {(["card", "detail"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setView(v)}
                    className={`rounded-lg px-3 py-1 text-[10px] font-bold transition-colors ${view === v ? "bg-white/10 text-ink" : "text-ink-dim hover:text-ink"}`}
                  >
                    {v === "card" ? "Library card" : "Detail header"}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3">
              {view === "card" ? (
                <div className="max-w-sm">
                  <AssetCard asset={preview} />
                </div>
              ) : (
                <div className="rounded-3xl border border-white/8 bg-panel p-5">
                  <nav className="flex flex-wrap items-center gap-2 text-xs text-ink-faint">
                    <span>Components</span>
                    <span>/</span>
                    <span className="chip capitalize">{preview.kind}</span>
                    <span>/</span>
                    <span className="text-ink-dim">{preview.title}</span>
                  </nav>
                  {/* h2, not h3: this is a preview of a detail-page title inside a panel, and an h3 straight after the page h1 is a heading-order skip. */}
                  <h2 className="mt-4 text-2xl font-extrabold tracking-tight">{preview.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-dim">{preview.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <span className="chip">{preview.license} license</span>
                    <span className="chip">v{preview.version}</span>
                    <span className="chip">a11y {preview.a11yScore}</span>
                    <span className="chip">{preview.bundleKb} KB</span>
                    <span className="chip capitalize">{preview.status}</span>
                  </div>
                  {preview.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {preview.tags.map((t) => (
                        <span key={t} className="chip !text-[10px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
              The card above is the production component, including its demo animation and hover behaviour — take the
              pointer onto it. The detail header mirrors the real page&apos;s order of information; the promo rails and
              the code block are omitted because they do not depend on the copy being edited.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Same fields, prompt side</p>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          Prompts use a different card: the poster, the industry chip and the fidelity number. Editing prompt copy is
          worth a separate pass because the failure modes differ — the fidelity badge is pinned to the card&apos;s footer,
          so a long title and vibe push it further down the card while the poster gets taller.
        </p>
        <div className="mt-4 max-w-sm">
          <PromptCard prompt={PROMPTS[0]} />
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
          Shown with its published copy as the reference shape. A prompt-copy editor lands with the next batch of console
          tools rather than half-built here.
        </p>
      </div>
    </div>
  );
}

/* ===================================================================
   #373 — prompt re-run console (labelled simulation)
   =================================================================== */

export function PromptRerunConsole() {
  const [slug, setSlug] = useState(PROMPTS[0].slug);
  const prompt = PROMPTS.find((p) => p.slug === slug) ?? PROMPTS[0];
  const [model, setModel] = useState<string>(RERUN_MODELS[0]);
  const seed = 0;
  const script = useMemo(() => rerunScript(prompt.slug, model, seed), [prompt.slug, model]);
  const simulated = rerunFidelity(prompt.slug, model, seed);
  const [step, setStep] = useState(0);
  const [runs, setRuns] = useState<{ model: string; score: number }[]>([]);
  const running = step > 0 && step < script.length;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setStep((s) => s + 1), 380);
    return () => window.clearTimeout(id);
  }, [running, step]);

  const published = prompt.runs.find((r) => r.model === model);
  const delta = published ? simulated - published.fidelity : null;

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-amber-300/30 bg-amber-300/[.05] p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-300">Simulated test cycle · no model is called</p>
            <p className="mt-1.5 text-xs leading-relaxed text-amber-100/90">
              A real re-run spends tokens on three models and writes real scores into the prompt&apos;s run log. This build
              has no API key and no billing, so this console generates a deterministic pseudo-log instead and compares its
              simulated score against the <em>published</em> score for the same model. The comparison is real; the new run
              is not.
            </p>
          </div>
          <span className="chip !text-[10px] !border-amber-300/40 !text-amber-200">demo</span>
        </div>
      </div>

      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <div className="grid gap-4 md:grid-cols-[1.3fr_1fr_auto] md:items-end">
          <label className="block">
            <span className="field-label">Prompt</span>
            <select value={slug} onChange={(e) => { setSlug(e.target.value); setStep(0); setRuns([]); }} className="input !py-2 text-xs">
              {PROMPTS.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="field-label">Model</span>
            <select value={model} onChange={(e) => { setModel(e.target.value); setStep(0); setRuns([]); }} className="input !py-2 text-xs">
              {RERUN_MODELS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={running}
              onClick={() => {
                setStep(1);
                setRuns((r) => [{ model, score: simulated }, ...r].slice(0, 6));
              }}
              className="btn btn-primary !px-4 !py-2 text-xs disabled:opacity-40"
            >
              {running ? "Running…" : "▶ Simulate cycle"}
            </button>
            <button type="button" onClick={() => { setStep(0); setRuns([]); }} className="btn btn-ghost !px-4 !py-2 text-xs">
              Clear
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-white/8 bg-[#07090f] p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Run log</p>
            <pre className="mt-3 min-h-[190px] overflow-x-auto whitespace-pre-wrap font-mono text-[10.5px] leading-relaxed">
              {step === 0 ? (
                <span className="text-ink-faint">{"// press Simulate cycle to stream the log"}</span>
              ) : (
                script.slice(0, step).map((l, i) => (
                  <span key={i} className={l.tone === "ok" ? "text-mint" : l.tone === "warn" ? "text-amber-300" : "text-ink-faint"}>
                    [{l.t}] {l.text}
                    {"\n"}
                  </span>
                ))
              )}
            </pre>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Published runs on this prompt</p>
              <div className="mt-3 space-y-1.5">
                {prompt.runs.map((r) => (
                  <div
                    key={r.model}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2 ${r.model === model ? "border-cyan-300/30 bg-cyan-300/[.05]" : "border-white/6 bg-white/[.03]"}`}
                  >
                    <span className="truncate text-[11px] text-ink-dim">{r.model}</span>
                    <span className="ml-2 shrink-0 font-mono text-[11px] font-extrabold text-ink">{r.fidelity}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">
                Real, dated scores from the catalog. Average {prompt.avgFidelity}; best model {prompt.bestModel}.
              </p>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Comparison</p>
              <div className="mt-3 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between rounded-xl bg-white/[.03] px-3 py-2">
                  <span className="text-ink-dim">simulated this cycle</span>
                  <span className="font-mono font-extrabold text-amber-200">{simulated}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-white/[.03] px-3 py-2">
                  <span className="text-ink-dim">published, {model}</span>
                  <span className="font-mono font-extrabold text-ink">{published ? published.fidelity : "—"}</span>
                </div>
                {delta !== null && (
                  <p className={`rounded-xl px-3 py-2 text-[11px] font-bold ${delta > 0 ? "bg-mint/[.06] text-mint" : delta < 0 ? "bg-amber-300/[.06] text-amber-300" : "bg-white/[.04] text-ink-dim"}`}>
                    {delta > 0 ? `+${delta}` : delta} in the simulation — no model actually regressed or improved
                  </p>
                )}
              </div>
            </div>

            {runs.length > 0 && (
              <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">This session</p>
                <div className="mt-2 space-y-1">
                  {runs.map((r, i) => (
                    <p key={`${r.model}-${i}`} className="font-mono text-[10px] text-ink-dim">
                      {r.model} → {r.score}
                    </p>
                  ))}
                </div>
                <p className="mt-2 text-[10px] text-ink-faint">In memory only; refreshing clears it, and nothing is written to the prompt&apos;s run log.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-sm font-extrabold">What a real re-run button would need</p>
        <ol className="prose-list mt-3">
          <li>A key and a spending cap per run, stated up front — a re-run button that bills silently is a bad button.</li>
          <li>Pinned model versions, so a score change means the brief changed, not the endpoint.</li>
          <li>The prompt body hashed into the run record, so you can tell whether a re-run tested the same text.</li>
          <li>Appending to the run log rather than replacing it — the value of a log is that old numbers stay visible.</li>
          <li>A rate limit, because the expensive failure mode is one person pressing it forty times.</li>
        </ol>
      </div>
    </div>
  );
}

/* ===================================================================
   #374 — changelog composer
   =================================================================== */

export function ChangelogComposer({ existingDates }: { existingDates: string[] }) {
  const [draft, setDraft] = useState<ChangelogDraft>({ date: new Date().toISOString().slice(0, 10), tag: "Components", title: "", body: "" });
  const [copied, setCopied] = useState(false);
  const links = autoLinkAssets(draft);
  const issues = changelogIssues(draft, existingDates);
  const snippet = changelogSnippet(draft, links);

  return (
    <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Compose an entry</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-[0.7fr_1fr]">
          <label className="block">
            <span className="field-label">Date</span>
            <input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} className="input !py-2 font-mono text-xs" />
          </label>
          <label className="block">
            <span className="field-label">Tag</span>
            <select value={draft.tag} onChange={(e) => setDraft({ ...draft, tag: e.target.value })} className="input !py-2 text-xs">
              {CHANGELOG_TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="mt-3 block">
          <span className="field-label">Title</span>
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="Overlay widgets land: Command Palette, Toasts, Sheet Menu"
            className="input !py-2 text-xs"
          />
          <span className="mt-1 block text-[10px] text-ink-faint">{draft.title.trim().length} / 80 characters</span>
        </label>
        <label className="mt-3 block">
          <span className="field-label">Body</span>
          <textarea
            rows={5}
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            placeholder="Say what shipped, then name the catalog items so the composer can link them."
            className="input text-xs"
          />
          <span className="mt-1 block text-[10px] text-ink-faint">{draft.body.trim().length} characters · naming a component title is what triggers the auto-link</span>
        </label>

        {issues.length > 0 && (
          <div className="mt-4 rounded-2xl border border-amber-300/25 bg-amber-300/[.05] px-4 py-3">
            <p className="text-[11px] font-bold text-amber-300">{issues.length} to fix before this is publishable</p>
            <ul className="mt-1.5 space-y-1">
              {issues.map((i) => (
                <li key={i.field + i.message} className="text-[10px] leading-relaxed text-amber-200/80">
                  <span className="font-mono">{i.field}</span> — {i.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 rounded-2xl border border-white/8 bg-[#07090f] p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Entry snippet for src/lib/data.ts</p>
            <button
              type="button"
              disabled={issues.length > 0}
              onClick={() => {
                navigator.clipboard?.writeText(snippet).then(() => setCopied(true), () => setCopied(false));
              }}
              className="btn btn-ghost !px-3 !py-1 text-[10px] disabled:opacity-40"
            >
              {copied ? "✓ Copied" : "Copy snippet"}
            </button>
          </div>
          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-[10px] leading-relaxed text-emerald-100/90">{snippet}</pre>
          <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">
            Paste it above the newest entry in <span className="font-mono">CHANGELOG</span>, then run typecheck and build.
            The composer does not write the file — the entry travels through review like any other content change.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Auto-linked items</p>
            <span className="chip !text-[10px]">{links.length} found</span>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
            The rule: any catalog item whose title appears in your title or body is linked. Titles are matched longest
            first, so “Glass stat card trio” cannot be shadowed by a shorter neighbour. Nothing is inferred — if it is not
            named, it is not linked.
          </p>
          {links.length === 0 ? (
            <p className="mt-3 rounded-2xl border border-dashed border-white/12 px-4 py-5 text-center text-[10px] leading-relaxed text-ink-faint">
              Nothing linked yet. Name a component in the body and it appears here with the page it would point to.
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              {links.map((l) => (
                <div key={l.slug} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[.02] px-3 py-2.5">
                  <span className="chip !text-[9px]">in {l.where}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12px] font-bold text-ink">{l.title}</span>
                    <span className="block font-mono text-[10px] text-ink-faint">{l.href}</span>
                  </span>
                  <span className="text-[10px] text-ink-faint">{l.kind}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Preview in the feed</p>
          <div className="mt-3 rounded-2xl border border-white/8 bg-white/[.02] p-4">
            <div className="flex items-center gap-2">
              <span className="chip !text-[10px]">{draft.tag}</span>
              <span className="font-mono text-[10px] text-ink-faint">{draft.date}</span>
            </div>
            <p className="mt-2 text-[13px] font-bold text-ink">{draft.title.trim() || "Untitled entry"}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-ink-dim">{draft.body.trim() || "No body yet — the feed shows the body verbatim, so write it for a reader who only sees this line."}</p>
            {links.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {links.slice(0, 4).map((l) => (
                  <span key={l.slug} className="chip !text-[9px]">
                    {l.title}
                  </span>
                ))}
              </div>
            )}
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
            {existingDates.length} dates already carry an entry in the shipped changelog.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ===================================================================
   #375 — command palette
   =================================================================== */

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [health, setHealth] = useState<HealthRow[]>(() => contentHealth());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setHealth(contentHealth()));
    return () => cancelAnimationFrame(raf);
  }, []);

  const commands = useMemo(() => adminCommands(health), [health]);
  const results = useMemo(() => matchCommands(q, commands), [q, commands]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        setQ("");
        setActive(0);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active].href);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setQ("");
          setActive(0);
        }}
        className="chip !cursor-pointer !text-[10px] transition-colors hover:!text-ink"
        title="Open the command palette (⌘K or Ctrl-K)"
      >
        ⌘K commands
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/70 p-5 pt-[12vh]" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Admin command palette"
            className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b0d14]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-white/6 p-3">
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKey}
                placeholder="Jump to a tool, review a flagged row, refresh something stale…"
                className="input !border-0 !bg-transparent !py-2.5 text-sm"
              />
            </div>
            <div className="max-h-[52vh] overflow-y-auto p-2">
              {results.length === 0 ? (
                <p className="px-3 py-6 text-center text-[11px] text-ink-faint">
                  No command matches “{q}”. Try a tool name, a submission id, or a component title.
                </p>
              ) : (
                results.map((c, i) => (
                  <button
                    key={c.id}
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(c.href)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors ${i === active ? "bg-white/8" : "hover:bg-white/4"}`}
                  >
                    <span className="chip !text-[9px]">{c.group}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] font-bold text-ink">{c.label}</span>
                      <span className="block truncate text-[10px] text-ink-faint">{c.hint}</span>
                    </span>
                    <span className="text-[10px] text-ink-faint">↵</span>
                  </button>
                ))
              )}
            </div>
            <div className="flex items-center justify-between border-t border-white/6 px-3 py-2 text-[10px] text-ink-faint">
              <span>↑ ↓ to move · ↵ to open · Esc to close</span>
              <span>{commands.length} commands</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ===================================================================
   #376 — notification centre
   =================================================================== */

export function NotificationCentre() {
  const [trail] = useStored<AuditEntry[]>(ADMIN_AUDIT_KEY, "motif:audit-changed", []);
  const [decisions] = useStored<Record<string, "approved" | "rejected">>(MODERATION_STORAGE_KEY, "motif:decisions-changed", {});
  const [schedule] = useStored<ScheduleItem[]>(ADMIN_SCHEDULE_KEY, "motif:schedule-changed", []);
  const health = useMemo(() => contentHealth(), []);
  const items = useMemo(() => notifications(trail, decisions, health), [trail, decisions, health]);
  const summary = healthSummary(health);
  const queued = scheduleBoard(schedule).length;

  const TONE: Record<string, string> = {
    danger: "border-danger/30 bg-danger/[.05]",
    warn: "border-amber-300/25 bg-amber-300/[.04]",
    info: "border-white/8 bg-panel",
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Notification centre</p>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-dim">
              There is no server watching this build, so every notification below is derived from data that already
              exists: the sample queue&apos;s gate results, the audit trail on this device, your stored decisions, the
              freshness window on recorded publish dates, and anything you queued in the scheduler. Each card names its
              source.
            </p>
          </div>
          <span className="chip !text-[10px]">{items.length} open</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { l: "gate failures", v: items.filter((i) => i.kind === "gate" && i.tone === "danger").length, tone: "text-danger" },
            { l: "gate warnings", v: items.filter((i) => i.kind === "gate" && i.tone === "warn").length, tone: "text-amber-300" },
            { l: "stale items", v: summary.stale, tone: "text-ink" },
            { l: "scheduled", v: queued, tone: "text-cyan-200" },
          ].map((x) => (
            <div key={x.l} className="rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3">
              <p className={`font-mono text-lg font-extrabold ${x.tone}`}>{x.v}</p>
              <p className="text-[9px] uppercase tracking-widest text-ink-faint">{x.l}</p>
            </div>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-white/12 px-5 py-10 text-center text-[12px] leading-relaxed text-ink-faint">
          No notifications. That is the honest empty state here: no gate failures are outstanding, nothing is past the
          review window, and you have not decided anything on this device yet.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <div key={n.id} className={`rounded-3xl border p-5 ${TONE[n.tone]}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="chip !text-[9px]">{n.kind}</span>
                  <p className="mt-2 text-[14px] font-extrabold tracking-tight">{n.title}</p>
                  <p className="mt-1.5 max-w-2xl text-[11.5px] leading-relaxed text-ink-dim">{n.body}</p>
                  <p className="mt-2 font-mono text-[9px] text-ink-faint">source: {n.source}</p>
                </div>
                <Link href={n.href} className="btn btn-ghost !px-3 !py-1.5 text-[11px]">
                  Open →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-sm font-extrabold">What a real inbox would add</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3">
            <p className="text-[12px] font-bold text-ink">Events we cannot see from here</p>
            <ul className="prose-list mt-2">
              <li>A submission arriving (no server receives them).</li>
              <li>A community member flagging a published asset — the review threads are per-browser, so a flag cannot reach a reviewer.</li>
              <li>
                An SLA breach measured on a real clock. Everything this build dates is a stored calendar day — component
                and prompt publish dates, guide update dates, changelog dates, per-model run dates — and none of them
                record how long a person waited, which is the only thing an SLA is about. The{" "}
                {HEALTH_THRESHOLDS.freshnessDays}-day window is a line on publish age, nothing more.
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3">
            <p className="text-[12px] font-bold text-ink">What we would send first</p>
            <ul className="prose-list mt-2">
              <li>Gate failures, because a blocked entry is someone waiting for an answer.</li>
              <li>Stale content past the review window, batched weekly rather than per item.</li>
              <li>Nothing else on day one. An inbox that pings for everything gets muted, and a muted inbox is worse than none.</li>
            </ul>
          </div>
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
          The moderation queue ships with {MODERATION_SEED.length} sample rows, so the gate notifications above are stable
          and can be checked against the queue in this same build.
        </p>
      </div>
    </div>
  );
}
