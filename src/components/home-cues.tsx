"use client";

// Client cues for the marketing pages:
//  - ChangelogList: expand/collapse the studio log instead of a flat slice.
//  - ReturningCue: "back? here's what's new since your last visit" (localStorage).
// Both stay dependency-free (no data module import) so the homepage bundle stays lean.

import Link from "next/link";
import { useEffect, useState } from "react";

export interface LogEntry {
  date: string;
  tag: string;
  title: string;
  body?: string;
}

const TAG_HUE: Record<string, number> = {
  Components: 262,
  Prompts: 192,
  Backgrounds: 330,
  Lab: 152,
  Platform: 40,
};

function hueOf(tag: string): number {
  const h = TAG_HUE[tag];
  if (h !== undefined) return h;
  let acc = 0;
  for (let i = 0; i < tag.length; i++) acc = (acc * 31 + tag.charCodeAt(i)) >>> 0;
  return acc % 360;
}

const hsl = (h: number, sat: number, light: number, alpha = 1) => `hsl(${h} ${sat}% ${light}% / ${alpha})`;

export function ChangelogList({ entries }: { entries: LogEntry[] }) {
  const [open, setOpen] = useState(false);
  const visible = open ? entries : entries.slice(0, 5);
  return (
    <div>
      <ol className="relative space-y-0 border-l border-white/8 pl-6">
        {visible.map((e) => (
          <li key={e.date + e.title} className="relative pb-6 last:pb-0">
            <span
              className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 border-bg"
              style={{ background: hsl(hueOf(e.tag), 85, 62) }}
              aria-hidden
            />
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold tabular-nums text-ink-dim">{e.date}</span>
              <span
                className="chip !px-2.5 !text-[9px] font-bold uppercase tracking-wider"
                style={{ color: hsl(hueOf(e.tag), 90, 70), borderColor: hsl(hueOf(e.tag), 90, 70, 0.35), background: hsl(hueOf(e.tag), 90, 70, 0.1) }}
              >
                {e.tag}
              </span>
            </div>
            <h3 className="mt-1.5 text-sm font-bold leading-snug text-ink transition-colors hover:text-white">
              {e.title}
            </h3>
            {e.body && <p className="mt-1 text-xs leading-relaxed text-ink-dim">{e.body}</p>}
          </li>
        ))}
      </ol>
      {entries.length > 5 && (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="mt-4 w-full rounded-xl border border-dashed border-white/10 py-2.5 text-xs font-semibold text-ink-faint transition-colors hover:border-white/25 hover:text-ink"
        >
          {open ? "Collapse log ↑" : `Show all ${entries.length} entries ↓`}
        </button>
      )}
    </div>
  );
}

export function ReturningCue({ entries }: { entries: LogEntry[] }) {
  const [info, setInfo] = useState<{ show: boolean; since: string; count: number } | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const KEY = "motif:last-visit";
        const raw = window.localStorage.getItem(KEY);
        const now = Date.now();
        const prev = raw ? Number(raw) : NaN;
        const tooSoon = prev && Number.isFinite(prev) && now - prev < 4 * 60 * 60 * 1000;
        if (Number.isFinite(prev) && prev > 0 && !tooSoon) {
          const fresh = entries.filter((e) => new Date(e.date).getTime() > prev);
          if (fresh.length > 0) {
            const since = new Date(prev).toISOString().slice(0, 10);
            setInfo({ show: true, since, count: fresh.length });
          }
        }
        window.localStorage.setItem(KEY, String(now));
      } catch {
        /* private mode */
      }
    });
    return () => cancelAnimationFrame(id);
  }, [entries]);

  if (!info?.show) return null;
  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-xs rounded-2xl border border-white/12 bg-[#10131c]/95 px-4 py-3 shadow-[0_24px_70px_-20px_rgba(0,0,0,.85)] backdrop-blur-xl">
      <p className="text-sm font-extrabold tracking-tight">Welcome back 👋</p>
      <p className="mt-1 text-[11px] leading-relaxed text-ink-dim">
        {info.count} new studio entr{info.count === 1 ? "y" : "ies"} since your visit on {info.since}.
      </p>
      <div className="mt-2.5 flex items-center gap-2">
        <Link href="/digest" className="btn btn-primary !px-3 !py-1.5 text-[11px]">See what&apos;s new</Link>
        <button
          type="button"
          onClick={() => setInfo({ ...info, show: false })}
          className="text-[10px] font-semibold text-ink-faint transition-colors hover:text-ink"
        >
          dismiss
        </button>
      </div>
    </div>
  );
}
