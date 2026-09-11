"use client";

import { useMemo, useState } from "react";
import { PromptCard } from "@/components/cards";
import { PROMPTS } from "@/lib/data";
import type { PromptTemplate } from "@/lib/types";



const INDUSTRIES = ["All", ...Array.from(new Set(PROMPTS.map((p) => p.industry)))];

export default function PromptsPage() {
  const [industry, setIndustry] = useState("All");
  const [status, setStatus] = useState<"all" | PromptTemplate["status"]>("all");
  const [q, setQ] = useState("");

  const items = useMemo(() => {
    let list = PROMPTS;
    if (industry !== "All") list = list.filter((p) => p.industry === industry);
    if (status !== "all") list = list.filter((p) => p.status === status);
    const needle = q.trim().toLowerCase();
    if (needle) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(needle) ||
          p.vibe.toLowerCase().includes(needle) ||
          p.blocks.some((b) => b.toLowerCase().includes(needle)),
      );
    }
    return [...list].sort((a, b) => b.avgFidelity - a.avgFidelity || b.runs.length - a.runs.length);
  }, [industry, status, q]);

  const counts = {
    total: PROMPTS.length,
    verified: PROMPTS.filter((p) => p.status === "verified" || p.status === "featured").length,
    avg: Math.round(PROMPTS.reduce((s, p) => s + p.avgFidelity, 0) / PROMPTS.length),
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">AI prompt library</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
            Prompts that ship with a <span className="text-gradient">report card</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-ink-dim">
            Unlike screenshot galleries, every prompt here is executed against multiple frontier
            models — Claude, Codex and GLM-4.6 — scored for fidelity, and published with the
            screenshots and failure notes attached. Each card opens with a{" "}
            <span className="text-ink">concept render</span> in the prompt&apos;s palette: a live
            style preview you can actually reproduce, not a stock mock.
          </p>
        </div>
        <div className="flex gap-3">
          {[
            { v: counts.total, l: "total prompts" },
            { v: counts.verified, l: "verified" },
            { v: `${counts.avg}%`, l: "avg fidelity" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-white/8 bg-panel px-5 py-3 text-center">
              <div className="text-2xl font-extrabold">{s.v}</div>
              <div className="text-[10px] uppercase tracking-wider text-ink-faint">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        {INDUSTRIES.map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndustry(i)}
            className={`chip !cursor-pointer transition-colors ${industry === i ? "!border-cyan-300/40 !bg-cyan-400/15 !text-cyan-100" : ""}`}
          >
            {i}
          </button>
        ))}
        <span className="mx-1 h-4 w-px bg-white/10" aria-hidden />
        {(["all", "featured", "verified", "beta"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={`chip !cursor-pointer capitalize transition-colors ${status === s ? "!border-white/30 !bg-white/10 !text-ink" : ""}`}
          >
            {s === "all" ? "any status" : s}
          </button>
        ))}
        <input
          className="input ml-auto !w-60"
          placeholder="Search prompts…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search prompts"
        />
      </div>

      <p className="mt-5 text-xs text-ink-faint">
        {items.length} prompt{items.length === 1 ? "" : "s"} · sorted by measured fidelity
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <PromptCard key={p.slug} prompt={p} />
        ))}
      </div>
    </div>
  );
}
