"use client";

import Link from "next/link";
import { useState } from "react";
import { COMPONENTS } from "@/lib/data";
import { learnArticleOf } from "@/lib/learn";
import { questionFor } from "@/lib/queries";
import type { Asset } from "@/lib/types";

/* essay → practice-asset matching: overlap article tags, then lesson keywords */
function practiceScore(c: Asset, tags: string[], keywords: string[]): number {
  let score = c.tags.filter((t) => tags.includes(t)).length;
  for (const w of keywords) {
    if (c.title.toLowerCase().includes(w)) score += 2;
    else if (c.description.toLowerCase().includes(w) || c.tags.some((t) => t.includes(w))) score += 1;
  }
  return score;
}

function CodeBlock({ code }: { code: { title?: string; lang: string; text: string } }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="my-4 overflow-hidden rounded-2xl border border-white/8 bg-[#07090f]">
      <div className="flex items-center justify-between border-b border-white/6 px-4 py-2">
        <span className="font-mono text-[11px] text-ink-faint">
          {code.title ?? code.lang}
        </span>
        <button
          type="button"
          onClick={async () => {
            try { await navigator.clipboard.writeText(code.text); } catch { /* noop */ }
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
          }}
          className="btn btn-ghost !rounded-lg !px-3 !py-1 !text-[11px]"
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[12.5px] leading-relaxed text-cyan-100/90">
        <code>{code.text}</code>
      </pre>
    </div>
  );
}

export default function LearnArticleView({ slug }: { slug: string }) {
  const article = learnArticleOf(slug);
  const [levelColor] = useState<string>(() => {
    const a = article!;
    return a.level === "Beginner" ? "text-mint" : a.level === "Intermediate" ? "text-amber-300" : "text-danger";
  });
  if (!article) return null;

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 lg:px-0">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/learn" className="hover:text-ink">Learn</Link>
        <span>/</span>
        <span className="text-ink-dim">{article.slug}</span>
      </nav>

      <div className="mt-6">
        <span className="chip !text-violet-200/80 !border-violet-300/25 !bg-violet-400/10">{article.kicker}</span>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
          {article.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-dim">{article.deck}</p>
        {/* #478 — the essay states the question it answers, so a reader who
            arrived from a search can confirm they are in the right place. */}
        {(() => {
          const asks = questionFor(article.slug);
          if (!asks) return null;
          return (
            <p className="mt-4 rounded-2xl border border-emerald-300/25 bg-emerald-400/[.05] px-4 py-3 text-[12px] leading-relaxed text-emerald-100">
              <span className="font-bold uppercase tracking-widest text-[10px] text-emerald-300">Answers</span>{" "}
              <span className="font-semibold">{asks.question}</span>
              <span className="mt-1 block text-[11px] text-ink-dim">{asks.because}</span>
            </p>
          );
        })()}
        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-ink-faint">
          <span className={`chip ${levelColor}`}>{article.level}</span>
          <span className="chip">{article.minutes} min read</span>
          <span className="chip">updated {article.updated}</span>
          {article.tags.map((t) => (
            <span key={t} className="chip !text-[10px]">{t}</span>
          ))}
        </div>
      </div>

      <article className="mt-10 space-y-7">
        {article.blocks.map((b, i) => (
          <section key={i}>
            {b.h && <h2 className="text-2xl font-extrabold tracking-tight">{b.h}</h2>}
            {b.body?.map((p, j) => (
              <p key={j} className="mt-3 text-[15px] leading-relaxed text-ink-dim">{p}</p>
            ))}
            {b.bullets && (
              <ul className="prose-list mt-3 list-none space-y-2.5">
                {b.bullets.map((bl, j) => (
                  <li key={j} className="!text-[14px] leading-relaxed">{bl}</li>
                ))}
              </ul>
            )}
            {b.code && <CodeBlock code={b.code} />}
            {b.callout && (
              <div
                className={`mt-4 rounded-2xl border p-5 ${
                  b.callout.type === "tip"
                    ? "border-mint/20 bg-mint/5"
                    : b.callout.type === "pro"
                      ? "border-violet-300/20 bg-violet-400/5"
                      : "border-amber-300/20 bg-amber-400/5"
                }`}
              >
                <div
                  className={`text-sm font-extrabold ${
                    b.callout.type === "tip" ? "text-mint" : b.callout.type === "pro" ? "text-violet-200" : "text-amber-200"
                  }`}
                >
                  {b.callout.title ?? (b.callout.type === "tip" ? "Tip" : b.callout.type === "pro" ? "Pro move" : "Heads up")}
                </div>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-dim">{b.callout.text}</p>
              </div>
            )}
            {b.links && (
              <div className="mt-3 flex flex-wrap gap-2">
                {b.links.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="btn btn-ghost !px-4 !py-2 !text-xs"
                  >
                    {l.label} →
                  </Link>
                ))}
              </div>
            )}
          </section>
        ))}
      </article>

      {/* practice assets — every essay ends with library assets that do the lesson */}
      <div className="mt-12 rounded-3xl border border-emerald-300/15 bg-emerald-400/[.04] p-6">
        <div className="text-xs font-bold uppercase tracking-widest text-emerald-300">Practise the lesson</div>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-dim">
          Theory sticks when you ship it. These original Motif assets put this guide&apos;s lesson to work —
          open one and copy it into your own page.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(() => {
            const keywords = (article.title + " " + article.deck + " " + article.tags.join(" "))
              .toLowerCase()
              .split(/[^a-z]+/)
              .filter((w) => w.length >= 5);
            const scored = COMPONENTS.map((c) => ({ c, s: practiceScore(c, article.tags, keywords) }))
              .filter((x) => x.s > 0)
              .sort((a, b) => b.s - a.s || b.c.copies - a.c.copies)
              .slice(0, 3);
            const picks = scored.length
              ? scored
              : [...COMPONENTS].sort((a, b) => b.copies - a.copies).slice(0, 3).map((c) => ({ c, s: 0 }));
            return picks.map(({ c, s }) => (
              <Link
                key={c.slug}
                href={`/components/${c.slug}`}
                className="chip !cursor-pointer !border-emerald-300/25 !text-[11px] !text-emerald-100/90 transition-colors hover:!border-emerald-300/50"
              >
                {c.title}
                {s > 0 && <span className="ml-1.5 rounded-full bg-emerald-300/15 px-1.5 py-px text-[9px] uppercase tracking-wider">practice</span>}
              </Link>
            ));
          })()}
        </div>
      </div>

      <div className="mt-12 rounded-3xl border border-white/8 bg-panel p-6">
        <div className="text-xs font-bold uppercase tracking-widest text-ink-faint">Keep learning</div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Link href="/learn" className="btn btn-ghost !py-2 text-xs">All guides</Link>
          <Link href="/lab" className="btn btn-ghost !py-2 text-xs">Try the interactive Lab</Link>
        </div>
      </div>
    </div>
  );
}
