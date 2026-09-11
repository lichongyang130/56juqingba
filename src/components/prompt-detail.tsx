"use client";

import Link from "next/link";
import { useState } from "react";
import { POSTER_SCENE_META, PromptCard, PromptPoster, posterSceneFor } from "@/components/cards";
import { PROMPTS, accentHue, fidelityColor, promptStatusMeta } from "@/lib/data";
import { PromptStar } from "@/components/community-ui";
import type { PromptTemplate } from "@/lib/types";
import { logCopy } from "@/lib/copy-log";

export default function PromptDetail({ prompt }: { prompt: PromptTemplate }) {
  const [copied, setCopied] = useState(false);
  const meta = promptStatusMeta(prompt.status);
  const scene = posterSceneFor(prompt.slug);
  const accentColor = `hsl(${accentHue(prompt.slug)} 90% 65%)`;
  const related = PROMPTS.filter((p) => p.slug !== prompt.slug && p.industry === prompt.industry)
    .concat(PROMPTS.filter((p) => p.slug !== prompt.slug && p.industry !== prompt.industry))
    .slice(0, 3);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt.promptBody);
    } catch { /* noop */ }
    logCopy({ slug: prompt.slug, title: prompt.title });
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const best = [...prompt.runs].sort((a, b) => b.fidelity - a.fidelity)[0];
  const worst = [...prompt.runs].sort((a, b) => a.fidelity - b.fidelity)[0];

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-ink-faint">
        <Link href="/prompts" className="hover:text-ink">AI Prompts</Link>
        <span>/</span>
        <span className="text-ink-dim">{prompt.title}</span>
      </nav>

      <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
        <PromptPoster prompt={prompt} hero />
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] text-ink-faint">
          Concept render — composed live from this prompt&apos;s palette &amp; layout. Reproducible with the library, not a stock screenshot.
        </p>
        {POSTER_SCENE_META[scene] && (
          <Link
            href={POSTER_SCENE_META[scene].href}
            className="chip !cursor-pointer !text-[10px] transition-colors hover:!border-white/30 hover:!text-ink"
          >
            <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full" style={{ background: accentColor }} />
            Concept scene: {POSTER_SCENE_META[scene].label} — open in library →
          </Link>
        )}
      </div>

      <div className="mt-6 grid gap-8 [&>*]:min-w-0 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip">{prompt.industry}</span>
            <span className={`chip border ${meta.cls}`}>{meta.label}</span>
            <span className="chip">by {prompt.author}</span>
            <span className="chip">published {prompt.published}</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">{prompt.title}</h1>
          <p className="mt-2 text-sm text-ink-dim">vibe: {prompt.vibe}</p>

          {/* the prompt itself */}
          <div className="mt-7 overflow-hidden rounded-3xl border border-white/8 bg-[#07090f]">
            <div className="flex items-center justify-between border-b border-white/6 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="ml-2 text-xs font-semibold text-ink-dim">prompt.txt — copy-paste ready</span>
              </div>
              <div className="flex items-center gap-2">
                <PromptStar slug={prompt.slug} title={prompt.title} />
                <button type="button" className="btn btn-primary !px-4 !py-2 !text-xs" onClick={copyPrompt}>
                  {copied ? "✓ Copied to clipboard" : "Copy prompt"}
                </button>
              </div>
            </div>
            <pre className="max-h-[26rem] overflow-y-auto whitespace-pre-wrap p-5 font-mono text-[13px] leading-relaxed text-emerald-100/90">
              {prompt.promptBody}
            </pre>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="text-xs font-semibold text-ink-faint">Stacks shipped:</span>
            {prompt.stacks.map((s) => (
              <span key={s} className="chip">{s}</span>
            ))}
            <span className="text-xs font-semibold text-ink-faint">Blocks:</span>
            {prompt.blocks.map((b) => (
              <span key={b} className="chip">{b}</span>
            ))}
          </div>

          {/* community — re-run this brief on a model, or remix it */}
          <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3">
            <span className="text-xs font-semibold text-ink-dim">Community:</span>
            <Link href={`/community/re-run?prompt=${prompt.slug}`} className="chip !text-[10px] transition-colors hover:!text-ink">
              ▶ Re-run this prompt
            </Link>
            <Link href={`/community/submit?basedOn=${prompt.slug}`} className="chip !text-[10px] transition-colors hover:!text-ink">
              ⤴ Submit a remix of it
            </Link>
            <Link href="/saved" className="chip !text-[10px] transition-colors hover:!text-ink">
              ★ Your saved list
            </Link>
            <span className="text-[10px] leading-relaxed text-ink-faint">
              Re-runs are a labelled simulation; the run log on this page is the real record.
            </span>
          </div>

          {/* failure notes — the differentiator */}
          <div className="mt-7 rounded-3xl border border-amber-300/15 bg-amber-400/5 p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-200">
              <span>⚠</span> Before you run it, know this
            </div>
            <ul className="prose-list mt-3 list-none space-y-1.5">
              {prompt.runs.filter((r) => r.buildError).map((r) => (
                <li key={r.model} className="!text-xs">
                  On <b>{r.model}</b> the first build failed — {r.notes}
                </li>
              ))}
              {worst && !prompt.runs.some((r) => r.buildError) && (
                <li className="!text-xs">
                  Lowest score was <b>{worst.model}</b> at {worst.fidelity}/100 — {worst.notes}
                </li>
              )}
              {!prompt.runs.some((r) => r.buildError) && !worst && null}
              {prompt.runs.length > 0 && !prompt.runs.some((r) => r.buildError) && (
                <li className="!text-xs">All models built cleanly on the first pass.</li>
              )}
            </ul>
          </div>
        </div>

        {/* run log */}
        <aside className="space-y-5">
          <div className="rounded-3xl border border-white/8 bg-panel p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-widest text-ink-faint">Test run log</div>
              <span className="chip !text-[9px] uppercase">re-testable</span>
            </div>
            <div className="mt-4 space-y-3">
              {prompt.runs.map((r) => (
                <div key={r.model} className="rounded-2xl border border-white/7 bg-black/25 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold">{r.model}</span>
                    <span className={`text-sm font-extrabold ${fidelityColor(r.fidelity)}`}>{r.fidelity}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/6">
                    <div
                      className={`h-full rounded-full ${r.fidelity >= 90 ? "bg-mint" : r.fidelity >= 85 ? "bg-amber-300" : "bg-danger"}`}
                      style={{ width: `${r.fidelity}%` }}
                    />
                  </div>
                  <div className="mt-2 text-[11px] leading-relaxed text-ink-dim">{r.notes}</div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-ink-faint">
                    <span>{r.date}</span>
                    <span className={r.buildError ? "font-bold text-danger" : "text-mint"}>
                      {r.buildError ? "✕ build error (recovered)" : "✓ clean build"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/8 px-4 py-3">
              <span className="text-xs text-ink-dim">Average fidelity</span>
              <span className={`text-lg font-extrabold ${fidelityColor(prompt.avgFidelity)}`}>{prompt.avgFidelity}/100</span>
            </div>
            {best && (
              <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
                Best match today: <span className="text-ink-dim">{best.model}</span>. Model versions are
                pinned per run so results stay reproducible.
              </p>
            )}
          </div>

          <div className="rounded-3xl border border-white/8 bg-panel p-5">
            <div className="text-xs font-bold uppercase tracking-widest text-ink-faint">Scoreboard legend</div>
            <ul className="mt-3 space-y-2 text-[11px] text-ink-dim">
              <li><span className="font-bold text-mint">90+</span> — near-1:1 match, minor tweaks</li>
              <li><span className="font-bold text-amber-300">85–89</span> — strong match, expect 1–2 nudges</li>
              <li><span className="font-bold text-danger">&lt;85</span> — marked Beta until improved</li>
            </ul>
          </div>
        </aside>
      </div>

      <div className="mt-16">
        <h2 className="text-xl font-extrabold tracking-tight">More prompts in this mood</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => (
            <PromptCard key={p.slug} prompt={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
