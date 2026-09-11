"use client";

// ShuffleView — a moodboard-style randomizer. The first deck is a curated
// starter set (SSR-stable); every shuffle afterwards is random per click.

import { useMemo, useState } from "react";
import { AssetCard } from "@/components/cards";
import { accentCss } from "@/lib/data";
import type { Asset } from "@/lib/types";

const STARTER = [
  "aurora-veil",
  "glass-pricing",
  "scramble-text",
  "command-palette",
  "testimonial-marquee",
  "hero-product-mock",
];

export default function ShuffleView({ assets }: { assets: Asset[] }) {
  const bySlug = useMemo(() => new Map(assets.map((a) => [a.slug, a])), [assets]);
  const [deck, setDeck] = useState<Asset[]>(
    () => STARTER.map((s) => bySlug.get(s)).filter((a): a is Asset => Boolean(a)).slice(0, 6)
  );
  const [seeded, setSeeded] = useState(false);

  const shuffle = () => {
    const pool = [...assets];
    const picks: Asset[] = [];
    while (picks.length < 6 && pool.length) {
      const i = Math.floor(Math.random() * pool.length);
      picks.push(pool[i]);
      pool.splice(i, 1);
    }
    setDeck(picks);
    setSeeded(true);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/8 bg-panel px-5 py-4">
        <div>
          <p className="text-sm font-extrabold">
            {seeded ? "A freshly shuffled deck" : "A curated starter deck"}
          </p>
          <p className="mt-0.5 text-xs text-ink-dim">
            {assets.length} assets to discover — each card opens straight into the asset.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={shuffle} className="btn btn-primary !px-4 !py-2 text-xs">
            🎲 Shuffle again
          </button>
        </div>
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {deck.map((a, i) => (
          <div key={a.slug} className="relative">
            {!seeded && (
              <span
                className="absolute -left-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-bg text-[10px] font-black shadow"
                style={{ background: accentCss(a.slug, 85, 62) }}
                aria-hidden
              >
                {i + 1}
              </span>
            )}
            <AssetCard asset={a} />
          </div>
        ))}
      </div>
    </div>
  );
}
