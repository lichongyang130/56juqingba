"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DemoView } from "@/components/demos/Demo";
import type { Asset } from "@/lib/types";

export default function TemplateHub({ templates }: { templates: Asset[] }) {
  const [mood, setMood] = useState("all");
  const [stack, setStack] = useState("All");
  const [open, setOpen] = useState<string | null>(null);

  const [moodCounts, moods] = useMemo(() => {
    const counts = new Map<string, number>();
    templates.forEach((t) => t.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1)));
    return [counts, ["all", ...[...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t)] as const];
  }, [templates]);

  const stacks = useMemo(() => ["All", ...Array.from(new Set(templates.flatMap((t) => t.stack)))], [templates]);

  const list = useMemo(
    () =>
      templates.filter(
        (t) =>
          (mood === "all" || t.tags.includes(mood)) &&
          (stack === "All" || t.stack.includes(stack as Asset["stack"][number]))
      ),
    [templates, mood, stack]
  );

  return (
    <div>
      {/* filter bar */}
      <div id="template-gallery-filters" className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-xl border border-white/8 bg-black/30 p-1">
          {moods.slice(0, 8).map((m) => (
            <button key={m} type="button" onClick={() => setMood(m)} className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition-colors ${mood === m ? "bg-white/10 text-ink" : "text-ink-dim hover:text-ink"}`}>
              {m === "all" ? "All moods" : m}
              <span className="ml-1.5 opacity-50">{m === "all" ? templates.length : moodCounts.get(m) ?? 0}</span>
            </button>
          ))}
        </div>
        <select value={stack} onChange={(e) => setStack(e.target.value)} className="input !w-auto !cursor-pointer !py-1.5 text-xs" aria-label="Filter by stack">
          {stacks.map((s) => <option key={s} value={s} className="bg-panel">{s === "All" ? "All stacks" : s}</option>)}
        </select>
        <span className="text-xs text-ink-faint">{list.length} template build{list.length === 1 ? "" : "s"}</span>
      </div>

      {/* grid — inline previews render in a full-page iframe */}
      <div id="template-preview-iframe" className="mt-8 grid gap-6 lg:grid-cols-2">
        {list.map((t) => (
          <div key={t.slug} className="overflow-hidden rounded-3xl border border-white/8 bg-panel">
            <button type="button" onClick={() => setOpen(open === t.slug ? null : t.slug)} className="block w-full text-left" aria-expanded={open === t.slug}>
              <div className="relative aspect-[16/9]">
                <DemoView demo={t.demo} props={{}} />
                <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                  {open === t.slug ? "preview open — click to close" : "click to preview inline"}
                </span>
              </div>
            </button>
            <div className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold">{t.title}</p>
                  <p className="mt-0.5 text-[11px] text-ink-dim">{t.tags.slice(0, 4).join(" · ")}</p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-ink-faint">
                  <span className="chip !text-[9px]">{t.bundleKb} KB</span>
                  <span className="chip !text-[9px]">{t.stack.join(" / ")}</span>
                </div>
              </div>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink-dim">{t.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <Link href={`/components/${t.slug}`} className="text-xs font-semibold text-violet-300 hover:text-violet-200">Open full page →</Link>
                <span className="text-[10px] text-ink-faint">~{Math.max(3, Math.round(t.bundleKb / 7) + 2)} copy-copies to build</span>
              </div>
            </div>
            {open === t.slug && (
              <div className="border-t border-white/8">
                <iframe
                  src={`/components/${t.slug}`}
                  title={`${t.title} — full-page preview`}
                  loading="lazy"
                  sandbox="allow-same-origin allow-scripts"
                  className="h-[72vh] w-full border-0 bg-white"
                />
                <p className="bg-[#0b0d14] px-4 py-2 text-[10px] text-ink-faint">
                  Live full-page preview inside an iframe — scroll and click around before you open it to copy code.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
