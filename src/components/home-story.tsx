"use client";

// AfternoonTimeline — an honest, animated "built in an afternoon" story.
// No fake productivity claims: the clock counts the minutes, the steps name
// the exact library assets used (each linked), and the copy is original.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { COMPONENTS, accentCss } from "@/lib/data";
import type { SampleBuild } from "@/lib/samples";

interface Step {
  at: string;
  title: string;
  note: string;
  asset?: string; // component slug used at this step
}

const STEPS: Step[] = [
  { at: "0:00", title: "Empty frame, honest plan", note: "A content map first — one idea per section, the copy written before a single class. No blank-canvas anxiety, no fake urgency." },
  { at: "0:18", title: "Set the scene", note: "Drop in the visual foundation first so every later decision has a canvas to sit on.", asset: "star-motes" },
  { at: "0:31", title: "Write the headline in motion", note: "The first thing a visitor reads should be the thing that moves. Scramble effect, tuned down, meaning preserved.", asset: "scramble-text" },
  { at: "0:47", title: "Show the work", note: "Each project becomes a card; hover states come from the library, not from re-inventing hover.", asset: "orbit-deck" },
  { at: "1:04", title: "Motion pass with restraint", note: "Now the choreography: stagger entrances, cap durations, honour reduced-motion. Motion that earns its bytes." },
  { at: "1:26", title: "Audit, then ship", note: "A11y + size pass on every section, page weight measured, then a real deploy with a real URL." },
];

function stepAsset(slug: string) {
  return COMPONENTS.find((c) => c.slug === slug) ?? null;
}

export default function AfternoonTimeline({ build }: { build: SampleBuild }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative overflow-hidden rounded-3xl border border-white/8 bg-panel p-6 md:p-8">
      {/* honest clock */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">Built in an afternoon</p>
          <h3 className="mt-1 text-xl font-extrabold tracking-tight">
            {build.by}&apos;s 90-minute build story
          </h3>
        </div>
        <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/5 px-4 py-2 text-right">
          <div className="font-mono text-lg font-extrabold tabular-nums text-emerald-200">90 min</div>
          <div className="text-[10px] uppercase tracking-wider text-ink-faint">one sitting · real deploy</div>
        </div>
      </div>

      {/* progress rail */}
      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400/70 via-cyan-400/60 to-violet-400/70 transition-all duration-[1800ms] ease-out"
          style={{ width: shown ? "100%" : "6%" }}
        />
      </div>

      <ol className="relative mt-6 space-y-5 border-l border-white/8 pl-6">
        {STEPS.map((step, i) => {
          const a = step.asset ? stepAsset(step.asset) : null;
          return (
            <li
              key={step.at}
              className={`relative transition-all duration-500 ${shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
              style={{ transitionDelay: shown ? `${i * 120}ms` : "0ms" }}
            >
              <span
                className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-panel"
                style={{ background: a ? accentCss(a.slug, 85, 60) : "#10b981" }}
                aria-hidden
              />
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-[11px] font-bold tabular-nums text-emerald-300">T+{step.at}</span>
                <span className="text-sm font-extrabold tracking-tight">{step.title}</span>
                {a && (
                  <Link
                    href={`/components/${a.slug}`}
                    className="chip !cursor-pointer !py-0.5 !text-[9px] transition-colors hover:!border-white/30 hover:!text-ink"
                  >
                    {a.title} →
                  </Link>
                )}
              </div>
              <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-ink-dim">{step.note}</p>
            </li>
          );
        })}
      </ol>

      <p className="mt-5 rounded-2xl bg-white/[.03] px-4 py-3 text-[11px] leading-relaxed text-ink-faint">
        Honest numbers: this is a sample-build story, not a sales promise. Copy, layout and theme decisions took
        most of the time — the library removed the “boilerplate” third, never the thinking.
      </p>
    </div>
  );
}
