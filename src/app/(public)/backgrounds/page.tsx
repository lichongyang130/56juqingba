"use client";

import { useMemo, useState } from "react";
import { BackgroundCard } from "@/components/cards";
import { BACKGROUNDS } from "@/lib/data";

const CATS = ["All", "animated", "gradient", "texture", "particles"] as const;
const TECHS = ["All", "CSS", "WebGL", "SVG"];

export default function BackgroundsPage() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [tech, setTech] = useState("All");

  const items = useMemo(
    () =>
      BACKGROUNDS.filter((b) => {
        if (cat !== "All" && b.category !== cat) return false;
        if (tech !== "All" && !b.tech.includes(tech as (typeof b.tech)[number])) return false;
        return true;
      }).sort((a, b) => b.copies - a.copies),
    [cat, tech],
  );

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-pink-300">Backgrounds & textures</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Canvases that move (or don&apos;t)</h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          Animated fields, gradients, grain and glass. Each background ships with a performance
          tier, a fallback strategy and multiple implementation views.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        {CATS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={`chip !cursor-pointer capitalize transition-colors ${cat === c ? "!border-pink-300/40 !bg-pink-400/15 !text-pink-100" : ""}`}
          >
            {c}
          </button>
        ))}
        <span className="mx-1 h-4 w-px bg-white/10" aria-hidden />
        {TECHS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTech(t)}
            className={`chip !cursor-pointer transition-colors ${tech === t ? "!border-white/30 !bg-white/10 !text-ink" : ""}`}
          >
            {t}
          </button>
        ))}
        <span className="ml-auto text-xs text-ink-faint">{items.length} background{items.length === 1 ? "" : "s"}</span>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((b) => (
          <BackgroundCard key={b.slug} bg={b} />
        ))}
      </div>
    </div>
  );
}
