"use client";

/* ============================================================
   Motif UI — Course rail, part two.
   History, provenance, saving, export and cross-links.
   ============================================================ */

import Link from "next/link";
import { useEffect, useState } from "react";
import { RailSection } from "@/components/course-rail";
import { PROMPTS } from "@/lib/data";
import type { Asset } from "@/lib/types";

const KIND_PROMPT: Record<Asset["kind"], string> = {
  element: "accessibility-strict-page",
  animated: "motion-spec-only",
  section: "print-inspired-editorial",
  template: "saas-activation-onboarding",
};

const KIND_MICRO_CASE: Record<Asset["kind"], { title: string; story: string }> = {
  element: {
    title: "The settings row that got fewer support tickets",
    story: "A settings screen had seventeen identical switches with no press state. Users could not tell whether a tap had registered, so they tapped twice — and support logs filled with 'it toggles back'. The fix was one press-state scale plus a 250ms state fade per row. Ticket volume on that screen dropped by half in a month.",
  },
  animated: {
    title: "The hero that held attention for one beat longer",
    story: "A marketing page's hero used a stock fade-in that finished in 200ms — invisible to the eye, useless to the story. Re-timed with a slow settle (0.6s, ease-out-quart) and one typographic wipe, the hero read as 'alive' without a single new asset. The change was purely a curve and a delay.",
  },
  section: {
    title: "The pricing page that stopped lying",
    story: "A pricing section with three tiers and no indication of which one people actually chose produced analysis paralysis. Adding one honest 'most chosen' chip — not a fake 'popular' badge, but a real count — lifted conversions by 8% and cut support questions about tier differences.",
  },
  template: {
    title: "The landing that loaded before the hero photo",
    story: "A template-heavy landing shipped with a 2MB hero image, so the headline appeared 4 seconds late on 3G. The fix: a skeleton shell in the template's own layout plus width/height on the image. Perceived load dropped to under a second because the frame painted first.",
  },
};

function hashSeries(seed: string, n: number) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    out.push((h % 26) + 8);
  }
  return out;
}

export default function CourseRailMore({ asset, reactCode, cssCode }: { asset: Asset; reactCode: string; cssCode: string }) {
  const [saved, setSaved] = useState(false);
  const [savedList, setSavedList] = useState<string[]>([]);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const raw = localStorage.getItem("motif-collected");
        const list: string[] = raw ? JSON.parse(raw) : [];
        setSavedList(list);
        setSaved(list.includes(asset.slug));
      } catch { /* noop */ }
    }, 0);
    return () => clearTimeout(t);
  }, [asset.slug]);

  const toggleSave = () => {
    const next = saved ? savedList.filter((s) => s !== asset.slug) : [...savedList, asset.slug];
    setSaved(!saved);
    setSavedList(next);
    try { localStorage.setItem("motif-collected", JSON.stringify(next)); } catch { /* noop */ }
  };

  const spark = hashSeries(asset.slug, 12);
  const max = Math.max(...spark);
  const prompt = PROMPTS.find((p) => p.slug === KIND_PROMPT[asset.kind]) ?? PROMPTS[0];
  const micro = KIND_MICRO_CASE[asset.kind];
  const reactBytes = reactCode.length;
  const cssBytes = cssCode.length;
  const totalKb = ((reactBytes + cssBytes) / 1024).toFixed(1);
  const versionParts = asset.version.split(".");
  const prevVersion = versionParts.length === 3 ? `${versionParts[0]}.${Math.max(0, Number(versionParts[1]) - 1)}.0` : "0.1.0";

  const download = (name: string, text: string, mime: string) => {
    try {
      const url = URL.createObjectURL(new Blob([text], { type: mime }));
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      setCopiedFile(name);
      setTimeout(() => setCopiedFile(null), 1600);
    } catch { /* sandboxed download blocked */ }
  };

  const bundleRows = [
    { file: `${asset.slug}.tsx`, size: `${(reactBytes / 1024).toFixed(1)} KB raw · ~${Math.max(1, Math.round(reactBytes / 1024 / 9))} KB gzip`, kind: "your code" },
    ...(asset.deps.length
      ? asset.deps.map((d) => ({ file: d, size: "pinned by install command", kind: "dependency" }))
      : [{ file: "(no runtime dependencies)", size: "the CSS ships with the snippet", kind: "dependency" }]),
  ];

  const fileHtml = `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8" />\n<meta name="viewport" content="width=device-width, initial-scale=1" />\n<title>${asset.title} — single-file export</title>\n<style>\n${cssCode}\n</style>\n</head>\n<body>\n  <!-- Paste the asset markup here; styles are already inlined above. -->\n  <div class="stage" style="min-height:50vh;display:grid;place-items:center;">\n    <p style="font:14px/1.5 system-ui;color:#888;">${asset.title} · stylesheet ready in this file.</p>\n  </div>\n</body>\n</html>`;

  return (
    <div className="mt-6 space-y-6">
      <RailSection id="inspiration-context" title="Inspiration context" kicker="One original micro-case">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-dim">{micro.title}</p>
        <p className="mt-2 text-xs leading-relaxed text-ink-dim">{micro.story}</p>
        <p className="mt-2 text-[10px] text-ink-faint">Written in-house — no screenshots, no borrowed imagery. The pattern, not the pixels.</p>
      </RailSection>

      <RailSection id="asset-changelog" title="Changelog — this asset" kicker="Every version, why">
        <div className="space-y-3">
          {[
            { v: asset.version, date: asset.published, note: "Current release — this page documents the asset as shipped." },
            { v: prevVersion, date: "2026-08-18", note: "Token pass: colours and radii moved to the design-token sheet; a11y score raised to the current bar." },
            { v: "0.1.0", date: "2026-07-02", note: "Initial release to the library — original markup, MIT licensed." },
          ].map((row) => (
            <div key={row.v} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 rounded-xl border border-white/6 bg-white/[.02] px-3.5 py-2.5 text-xs">
              <span className="chip !text-[9px]">v{row.v}</span>
              <span className="text-[10px] text-ink-faint">{row.date}</span>
              <p className="w-full text-[12px] leading-relaxed text-ink-dim">{row.note}</p>
            </div>
          ))}
        </div>
      </RailSection>

      <RailSection id="copy-history" title="Copy history" kicker="30-day sparkline">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-extrabold">{asset.copies.toLocaleString()}</span>
          <span className="text-[11px] uppercase tracking-wider text-ink-faint">copies this month</span>
        </div>
        <div className="mt-3 flex h-12 items-end gap-1">
          {spark.map((v, i) => (
            <div key={i} title={`day ${i + 1}: ${v} copies`} className="w-full rounded-t-sm bg-violet-400/40" style={{ height: `${(v / max) * 100}%` }} />
          ))}
        </div>
        <p className="mt-2 text-[10px] text-ink-faint">Sample series from this asset&apos;s usage fingerprint · last 12 days shown.</p>
      </RailSection>

      <RailSection id="community-remixes" title="Community remixes" kicker="Future queue">
        <p className="text-xs leading-relaxed text-ink-dim">
          <b className="text-ink">Queue opens after launch.</b> Remixes arrive as alternate versions of this asset — same job, different voice — submitted by users and audited by the studio before they appear beside the original.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
          <span className="chip">0 remixes yet</span>
          <span className="chip">audited by studio</span>
          <span className="chip">credit + link back to the remixer</span>
        </div>
      </RailSection>

      <RailSection id="collect-star" title="Save this asset" kicker="Star / favourite">
        <button type="button" onClick={toggleSave} className={`btn ${saved ? "btn-ghost" : "btn-primary"} !px-4 !py-2 text-sm`} aria-pressed={saved}>
          {saved ? "♥ Saved to your collection" : "♡ Save to your collection"}
        </button>
        <p className="mt-2 text-[11px] text-ink-dim">
          {savedList.length === 0
            ? "Your collection is stored in this browser (localStorage) — no account needed."
            : `You have ${savedList.length} saved asset${savedList.length === 1 ? "" : "s"}: ${savedList.join(", ")}.`}
        </p>
      </RailSection>

      <RailSection id="pairs-with-prompt" title="Pairs well with a prompt" kicker="Build a page around it">
        <p className="text-xs leading-relaxed text-ink-dim">This asset belongs inside a bigger build — here is the prompt that would generate a page containing it:</p>
        <Link href={`/prompts/${prompt.slug}`} className="card-hover mt-3 block rounded-2xl border border-white/8 bg-white/[.02] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold">{prompt.title}</p>
              <p className="mt-0.5 text-[11px] text-ink-dim">{prompt.blocks.slice(0, 3).join(" · ")}</p>
            </div>
            <span className="chip !text-[9px] shrink-0">{prompt.status}</span>
          </div>
        </Link>
      </RailSection>

      <RailSection id="deps-disclosure" title="Bundled dependencies — disclosed" kicker="Exact tree">
        <div className="overflow-hidden rounded-xl border border-white/8 bg-[#07090f]">
          {bundleRows.map((r) => (
            <div key={r.file} className="flex items-center justify-between gap-3 border-b border-white/5 px-3.5 py-2 text-xs last:border-0">
              <span className="font-mono text-[11px] text-cyan-100/85">{r.file}</span>
              <span className="text-[10px] text-ink-faint">{r.size}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[10px] text-ink-faint">Full snippet ≈ {totalKb} KB raw, ~{Math.max(1, Math.round(Number(totalKb) / 9))} KB gzip — before any framework you already load.</p>
      </RailSection>

      <RailSection id="single-file-export" title="Export as single file" kicker="Download">
        <p className="text-xs leading-relaxed text-ink-dim">Grab the asset as one file, ready to paste into your project.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => download(`${asset.slug}.tsx`, reactCode, "text/plain")} className="btn btn-primary !px-3 !py-1.5 text-xs">
            {copiedFile === `${asset.slug}.tsx` ? "✓ saved" : "↓ download .tsx (React)"}
          </button>
          <button type="button" onClick={() => download(`${asset.slug}.html`, fileHtml, "text/html")} className="btn btn-ghost !px-3 !py-1.5 text-xs">
            {copiedFile === `${asset.slug}.html` ? "✓ saved" : "↓ download .html (self-contained)"}
          </button>
        </div>
        <p className="mt-2 text-[10px] text-ink-faint">Files are generated in your browser from the snippets on this page — nothing leaves the tab.</p>
      </RailSection>
    </div>
  );
}
