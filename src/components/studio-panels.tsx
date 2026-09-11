"use client";

// Theme Studio — Section 10 batch 42 additions: token export formats,
// contrast guardrail, theme preview gallery, colour-blind simulation,
// saved themes + share links, the original default trio case study and a
// real-component theming recipe. All copy original; all ratios and counts
// are computed live from the editor tokens / catalog data (no fake scores).

import { useEffect, useMemo, useState } from "react";
import { accentHue, COMPONENTS } from "@/lib/data";
import {
  contrastRatio,
  derivedPalette,
  hexToHsl,
  hsl,
  hslToHex,
  REAL_BG,
  REAL_CYAN,
  REAL_INK,
  REAL_MINT,
  REAL_VIOLET,
  REAL_VIOLET_DEEP,
  studioSurfaces,
  type Tokens,
} from "@/lib/studio-utils";

const corner = (t: Tokens, f = 1) => Math.max(4, Math.min(26, Math.round(t.radius * f)));

/* ===================================================================
   #307 — Token export formats
   =================================================================== */

type ExportTab = "css" | "tailwind" | "json" | "dtcg";

function buildCssExport(t: Tokens) {
  const p = derivedPalette(t);
  return `/* ${t.mode} theme · accent ${t.hue}° ${t.sat}% · radius-md ${t.radius}px
   sample contract — rename to match your own var conventions */
:root {
  color-scheme: ${t.mode};

  /* tokens edited in Theme Studio */
  --accent-hue: ${t.hue};
  --accent-sat: ${t.sat}%;
  --radius-md: ${t.radius}px;

  /* derived companions */
  --accent: ${p.accent};
  --accent-strong: ${p.accentStrong};
  --accent-soft: ${p.accentSoft};
  --accent-line: ${p.accentLine};
  --radius-sm: ${Math.max(2, Math.round(t.radius * 0.6))}px;
  --radius-lg: ${Math.round(t.radius * 1.5)}px;
}`;
}

function buildTailwindExport(t: Tokens) {
  const p = derivedPalette(t);
  return `/* Tailwind v4 — CSS-first tokens. Drop next to your @import "tailwindcss";
   utilities like bg-accent / rounded-card appear automatically. */
@theme {
  --color-accent: ${p.accent};
  --color-accent-strong: ${p.accentStrong};
  --color-accent-soft: ${p.accentSoft};
  --color-accent-line: ${p.accentLine};
  --radius-card: ${t.radius}px;
}`;
}

function buildJsonExport(t: Tokens) {
  const p = derivedPalette(t);
  return `{
  "theme": {
    "accentHue": ${t.hue},
    "accentSaturation": ${t.sat},
    "radiusMd": ${t.radius},
    "mode": "${t.mode}"
  },
  "derived": {
    "accent": "${p.accent}",
    "accentStrong": "${p.accentStrong}",
    "accentSoft": "${p.accentSoft}",
    "radiusSm": ${Math.max(2, Math.round(t.radius * 0.6))},
    "radiusLg": ${Math.round(t.radius * 1.5)}
  }
}`;
}

function buildDtcgExport(t: Tokens) {
  const accent = hslToHex(t.hue, t.sat, 62);
  const strong = hslToHex(t.hue, Math.min(100, t.sat + 6), 54);
  return `{
  "accent-hue": { "$type": "number", "$value": ${t.hue} },
  "accent-saturation": { "$type": "number", "$value": ${t.sat} },
  "color-scheme": { "$type": "string", "$value": "${t.mode}" },
  "radius-md": { "$type": "dimension", "$value": "${t.radius}px" },
  "color/accent": { "$type": "color", "$value": "${accent}" },
  "color/accent-strong": { "$type": "color", "$value": "${strong}" }
}`;
}

const EXPORT_TABS: { id: ExportTab; label: string; note: string }[] = [
  { id: "css", label: "CSS vars", note: "paste into :root for a hand-rolled theme" },
  { id: "tailwind", label: "Tailwind v4", note: "@theme block — bg-accent, rounded-card utilities" },
  { id: "json", label: "Plain JSON", note: "portable shape, same object Save & Share stores" },
  { id: "dtcg", label: "Design-token spec", note: "W3C DTCG subset — $type / $value pairs for token-aware tools" },
];

export function ExportPanel({ tokens }: { tokens: Tokens }) {
  const [tab, setTab] = useState<ExportTab>("css");
  const [copied, setCopied] = useState(false);
  const code = useMemo(() => {
    if (tab === "css") return buildCssExport(tokens);
    if (tab === "tailwind") return buildTailwindExport(tokens);
    if (tab === "json") return buildJsonExport(tokens);
    return buildDtcgExport(tokens);
  }, [tab, tokens]);

  return (
    <div className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Token export formats</p>
          <p className="mt-1 text-xs text-ink-dim">Same tokens, four targets — switch tabs to see each output regenerate.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard
              ?.writeText(code)
              .then(() => {
                setCopied(true);
              })
              .catch(() => setCopied(false));
          }}
          className="btn btn-ghost !px-3 !py-1.5 text-xs"
        >
          {copied ? "Copied ✓" : "Copy output"}
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {EXPORT_TABS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => {
              setTab(f.id);
              setCopied(false);
            }}
            className={`chip !cursor-pointer ${tab === f.id ? "!border-violet-300/50 !text-ink" : ""}`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-white/8 bg-[#07090f] p-4">
        <pre className="whitespace-pre font-mono text-[11.5px] leading-relaxed text-ink-dim">{code}</pre>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
        {EXPORT_TABS.find((f) => f.id === tab)?.note}. Variable names here are a sample contract — Motif&apos;s own
        live tokens live in <code className="font-mono">globals.css</code>; copy these into your own project&apos;s theme
        layer.
      </p>
    </div>
  );
}

/* ===================================================================
   #308 — Contrast guardrail (real WCAG ratios)
   =================================================================== */

interface Pair {
  id: string;
  label: string;
  note: string;
  fg: [number, number, number];
  bg: [number, number, number];
}

function guardrailPairs(t: Tokens): Pair[] {
  const surf = studioSurfaces(t.mode);
  const ink = hexToHsl(surf.ink);
  const panel = hexToHsl(surf.panel);
  return [
    {
      id: "button",
      label: "Button label on accent fill",
      note: "the primary-button case (label at 60% lightness)",
      fg: [ink.h, ink.s, ink.l],
      bg: [t.hue, t.sat, 60],
    },
    {
      id: "link",
      label: "Accent swatch on studio panel",
      note: "the soft-chip / link-text case (swatch at 62% lightness)",
      fg: [t.hue, t.sat, 62],
      bg: [panel.h, panel.s, panel.l],
    },
  ];
}

function tierOf(ratio: number) {
  if (ratio >= 7) return { id: "aaa", label: "AAA ✓", note: "normal & large text" };
  if (ratio >= 4.5) return { id: "aa", label: "AA ✓", note: "normal text · 4.5" };
  if (ratio >= 3) return { id: "large", label: "AA ✓ large", note: "large text only · 3.0" };
  return { id: "fail", label: "below AA", note: "fails even large text" };
}

export function GuardrailPanel({ tokens }: { tokens: Tokens }) {
  const pairs = useMemo(() => guardrailPairs(tokens), [tokens]);
  const verdicts = useMemo(
    () =>
      pairs.map((p) => {
        const ratio = contrastRatio(p.fg[0], p.fg[1], p.fg[2], p.bg[0], p.bg[1], p.bg[2]);
        return { pair: p, ratio, tier: tierOf(ratio) };
      }),
    [pairs]
  );
  const worst = verdicts.length ? Math.min(...verdicts.map((v) => v.ratio)) : 0;
  const allNormal = worst >= 4.5;
  const anyFail = worst < 3;

  return (
    <div className={`rounded-3xl border p-6 ${anyFail ? "border-danger/35 bg-danger/[.04]" : allNormal ? "border-white/8 bg-panel" : "border-amber-300/30 bg-amber-300/[.04]"}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Contrast guardrail</p>
          <p className="mt-1 text-xs text-ink-dim">WCAG contrast ratios recomputed live for every pair as you edit.</p>
        </div>
        <span
          className={`chip !text-[10px] ${anyFail ? "!border-danger/40 !text-danger" : allNormal ? "!border-mint/30 !text-mint" : "!border-amber-300/40 !text-amber-300"}`}
        >
          {anyFail ? "AA fail" : allNormal ? "all pairs hold AA" : "AA-large only — use the strong variant for body text"}
        </span>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {verdicts.map(({ pair, ratio, tier }) => {
          const ok = tier.id === "aa" || tier.id === "aaa";
          const bar = Math.min(100, Math.round((ratio / 12) * 100));
          const chipCls =
            tier.id === "fail"
              ? "!border-danger/40 !text-danger"
              : tier.id === "large"
                ? "!border-amber-300/40 !text-amber-300"
                : "!border-mint/30 !text-mint";
          return (
            <div key={pair.id} className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="h-6 w-6 shrink-0 rounded-md border border-white/20" style={{ background: hsl(pair.fg[0], pair.fg[1], pair.fg[2]) }} />
                  <span className="h-6 w-6 shrink-0 rounded-md border border-white/20" style={{ background: hsl(pair.bg[0], pair.bg[1], pair.bg[2]) }} />
                  <div>
                    <p className="text-xs font-bold">{pair.label}</p>
                    <p className="text-[10px] text-ink-faint">{pair.note}</p>
                  </div>
                </div>
                <span className={`font-mono text-lg font-extrabold ${ok ? "text-mint" : tier.id === "fail" ? "text-danger" : "text-amber-300"}`}>{ratio.toFixed(2)}</span>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/8">
                <div className={`h-full rounded-full ${ok ? "bg-mint/80" : tier.id === "fail" ? "bg-danger/80" : "bg-amber-300/80"}`} style={{ width: `${Math.max(4, bar)}%` }} />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className={`chip !text-[9px] ${chipCls}`}>{tier.label}</span>
                <span className="text-[9px] text-ink-faint">{tier.note}</span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
        {anyFail ? (
          <>
            <span className="font-semibold text-danger">Guardrail trip:</span> the worst live pair is{" "}
            <span className="font-mono">{worst.toFixed(2)}:1</span> — below every AA tier. The accent swatch this
            editor paints at 62% lightness cannot pass on this surface; raise saturation or flip mode, then re-check.
          </>
        ) : allNormal ? (
          <>
            Ratios use real WCAG relative luminance on the exact HSL this editor produces. Worst live pair:{" "}
            <span className="font-mono">{worst.toFixed(2)}:1</span>. Thresholds: AA normal 4.5, AA large 3.0, AAA 7.
          </>
        ) : (
          <>
            <span className="font-semibold text-amber-300">AA-large only:</span> worst pair is{" "}
            <span className="font-mono">{worst.toFixed(2)}:1</span> — fine for headings, chips and fills, but body-size
            text on this surface should use the strong accent variant. Thresholds: AA normal 4.5, AA large 3.0.
          </>
        )}
      </p>
    </div>
  );
}

/* ===================================================================
   #309 + #313 — Theme preview gallery & colour-blind simulation
   =================================================================== */

function MockFrames({ tokens }: { tokens: Tokens }) {
  const surf = studioSurfaces(tokens.mode);
  const accent = (l: number, a = 1) => hsl(tokens.hue, tokens.sat, l, a);
  const r = corner(tokens, 1.4);
  const line = (o: number) => ({ background: surf.dim, opacity: o });
  const frame = {
    background: surf.panel,
    borderColor: tokens.mode === "dark" ? "rgba(255,255,255,0.09)" : "rgba(10,12,20,0.12)",
    borderRadius: r,
    color: surf.ink,
  };
  const chipFill = tokens.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(10,12,20,0.05)";
  const chipEdge = tokens.mode === "dark" ? "rgba(255,255,255,0.14)" : "rgba(10,12,20,0.16)";

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {/* home / hero */}
      <div className="flex flex-col rounded-2xl border p-4" style={frame}>
        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ opacity: tokens.mode === "dark" ? 0.5 : 0.55 }}>
          sample · home hero
        </span>
        <div className="mt-3 flex items-center justify-between">
          <span className="h-3 w-3 rounded-full" style={{ background: accent(62) }} />
          <span className="flex gap-1.5">
            <span className="h-1.5 w-8 rounded-full" style={line(0.4)} />
            <span className="h-1.5 w-8 rounded-full" style={line(0.4)} />
            <span className="h-1.5 w-8 rounded-full" style={line(0.4)} />
          </span>
        </div>
        <div className="mt-5 space-y-1.5">
          <div className="h-2.5 w-[78%] rounded-full" style={line(0.9)} />
          <div className="h-2.5 w-[52%] rounded-full" style={line(0.62)} />
          <div className="h-1 w-[90%] rounded-full" style={line(0.34)} />
          <div className="h-1 w-[64%] rounded-full" style={line(0.34)} />
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="inline-flex h-5 w-[74px] items-center justify-center rounded-full" style={{ background: accent(60), color: "#fff", borderRadius: 999 }}>
            <span className="text-[6px] font-bold">CTA</span>
          </span>
          <span className="inline-flex h-5 w-[58px] items-center justify-center rounded-full border" style={{ borderRadius: 999, borderColor: chipEdge }} />
        </div>
        <div className="mt-4 flex gap-1.5">
          {[36, 52, 44].map((w, i) => (
            <span key={i} className="h-3 rounded-full border" style={{ width: w, background: chipFill, borderColor: chipEdge, borderRadius: 999 }} />
          ))}
        </div>
      </div>

      {/* component / asset page */}
      <div className="flex flex-col rounded-2xl border p-4" style={frame}>
        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ opacity: tokens.mode === "dark" ? 0.5 : 0.55 }}>
          sample · asset page
        </span>
        <div className="mt-3 flex items-center gap-2">
          <span className="inline-flex h-4 items-center rounded-full border px-2 text-[6px] font-bold uppercase tracking-wider" style={{ borderColor: chipEdge, opacity: 0.75 }}>
            ‹ back
          </span>
          <span className="h-2 w-[52%] rounded-full" style={line(0.85)} />
        </div>
        <div className="mt-3 flex gap-2">
          <div className="flex-1 rounded-xl border border-white/10 bg-black/25 p-2.5 font-mono" style={{ borderRadius: Math.max(4, r - 4) }}>
            <div className="h-1.5 w-[92%] rounded-sm" style={line(0.8)} />
            <div className="mt-1 h-1.5 w-[68%] rounded-sm" style={line(0.45)} />
            <div className="mt-1 h-1.5 w-[80%] rounded-sm" style={line(0.45)} />
            <div className="mt-1 h-1.5 w-[44%] rounded-sm" style={{ background: accent(62, 0.8) }} />
            <div className="mt-3 inline-flex h-4 items-center rounded-full px-2 text-[6px] font-bold" style={{ background: accent(60), color: "#fff", borderRadius: 999 }}>
              Copy code
            </div>
          </div>
          <div className="w-[34%] space-y-2 rounded-xl border p-2.5" style={{ borderRadius: Math.max(4, r - 4), borderColor: chipEdge }}>
            <span className="block text-[6px] font-bold uppercase tracking-widest" style={{ opacity: 0.6 }}>
              props
            </span>
            {[70, 40].map((v, i) => (
              <input key={i} type="range" min={0} max={100} value={v} readOnly aria-label="props sample" className="!h-1 w-full opacity-70" style={{ accentColor: accent(62) }} />
            ))}
            <div className="flex h-3 w-8 items-center rounded-full p-0.5" style={{ background: accent(60), borderRadius: 999 }}>
              <span className="ml-auto h-2 w-2 rounded-full bg-white" />
            </div>
          </div>
        </div>
      </div>

      {/* pricing */}
      <div className="flex flex-col rounded-2xl border p-4" style={frame}>
        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ opacity: tokens.mode === "dark" ? 0.5 : 0.55 }}>
          sample · pricing
        </span>
        <div className="mx-auto mt-3 h-2 w-[38%] rounded-full" style={line(0.75)} />
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((i) => {
            const featured = i === 1;
            return (
              <div
                key={i}
                className="rounded-xl border p-2"
                style={
                  featured
                    ? { borderColor: accent(62, 0.7), background: "rgba(255,255,255,0.04)", boxShadow: `0 10px 26px -14px ${accent(55, 0.55)}` }
                    : { borderColor: chipEdge, background: chipFill }
                }
              >
                <span className="block h-1.5 w-[70%] rounded-full" style={line(0.65)} />
                <span className="mt-1.5 block h-2 w-[80%] rounded-full" style={line(0.9)} />
                <span className="mt-2 block h-1 w-full rounded-full" style={line(0.35)} />
                <span className="mt-1 block h-1 w-full rounded-full" style={line(0.35)} />
                <span
                  className="mt-2 inline-flex h-3.5 w-full items-center justify-center rounded-full text-[5px] font-bold"
                  style={
                    featured
                      ? { background: accent(60), color: "#fff", borderRadius: 999 }
                      : { background: "transparent", border: `1px solid ${chipEdge}`, borderRadius: 999 }
                  }
                >
                  {featured ? "Start free" : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const CVD = [
  { id: "none", label: "No filter" },
  { id: "protanopia", label: "Protanopia" },
  { id: "deuteranopia", label: "Deuteranopia" },
  { id: "tritanopia", label: "Tritanopia" },
  { id: "mono", label: "Monochromacy" },
];

export function ThemePreviewPanel({ tokens }: { tokens: Tokens }) {
  const [filter, setFilter] = useState("none");
  const applied = filter === "none" ? undefined : `url(#cvd-${filter})`;
  return (
    <div className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Theme preview gallery</p>
          <p className="mt-1 text-xs text-ink-dim">Three representative pages redrawn from the live tokens — hero, an asset page, pricing.</p>
        </div>
        <span className="chip !text-[10px]">mock layouts · no real screenshots</span>
      </div>
      <div className="mt-4" style={{ filter: applied }}>
        <MockFrames tokens={tokens} />
      </div>

      <div className="mt-6 border-t border-white/6 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Colour-blind simulation</p>
            <p className="mt-1 text-xs text-ink-dim">See the active theme under colour-vision filters. CSS-filter approximation, not a clinical diagnosis.</p>
          </div>
          <span className="chip !text-[10px]">{filter === "none" ? "simulation off" : `filter: ${CVD.find((c) => c.id === filter)?.label}`}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {CVD.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setFilter(c.id)}
              className={`chip !cursor-pointer ${filter === c.id ? "!border-violet-300/50 !text-ink" : ""}`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
          The mock pages above re-render through the chosen filter. For real-world checks pair this with the guardrail —
          filters show hue shifts, the WCAG numbers quantify whether text survives them.
        </p>
      </div>

      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <filter id="cvd-protanopia" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0" />
          </filter>
          <filter id="cvd-deuteranopia" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0" />
          </filter>
          <filter id="cvd-tritanopia" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0" />
          </filter>
          <filter id="cvd-mono" colorInterpolationFilters="sRGB">
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

/* ===================================================================
   #310 — Saved themes + share links
   =================================================================== */

interface SavedTheme {
  id: string;
  name: string;
  tokens: Tokens;
}

const STORAGE_KEY = "motif:studio-saved-themes";

function makeShareUrl(t: Tokens) {
  if (typeof window === "undefined") return "";
  const { origin, pathname } = window.location;
  return `${origin}${pathname}?hue=${t.hue}&sat=${t.sat}&radius=${t.radius}&mode=${t.mode}`;
}

export function SavedThemesPanel({ tokens, onApply }: { tokens: Tokens; onApply: (t: Tokens) => void }) {
  const [themes, setThemes] = useState<SavedTheme[]>([]);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) setThemes(JSON.parse(raw) as SavedTheme[]);
      } catch {
        /* private mode or blocked storage — list stays empty */
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const persist = (next: SavedTheme[]) => {
    setThemes(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      setMsg("Storage unavailable here — themes last for this visit only.");
    }
  };

  const saveTheme = () => {
    const entry: SavedTheme = {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim() || `Theme ${themes.length + 1}`,
      tokens: { ...tokens },
    };
    persist([entry, ...themes].slice(0, 8));
    setShareUrl(makeShareUrl(entry.tokens));
    setName("");
    setMsg(`Saved “${entry.name}” to this browser (demo).`);
  };

  const share = (t: Tokens) => {
    const url = makeShareUrl(t);
    setShareUrl(url);
    navigator.clipboard
      ?.writeText(url)
      .then(() => setMsg("Link copied — it encodes the four token values, nothing is uploaded."))
      .catch(() => setMsg("Clipboard blocked here — select the link below and copy it manually."));
  };

  return (
    <div className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Saved themes & share links</p>
          <p className="mt-1 text-xs text-ink-dim">Keep up to eight recipes in this browser; hand a theme to someone as a plain URL.</p>
        </div>
        <span className="chip !text-[10px]">localStorage demo</span>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-2">
        <label className="flex-1 text-[11px] text-ink-faint sm:max-w-[220px]">
          Theme name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveTheme();
            }}
            placeholder={`Theme ${themes.length + 1}`}
            className="input mt-1 !py-2 text-xs"
          />
        </label>
        <button type="button" onClick={saveTheme} className="btn btn-primary !px-4 !py-2 text-xs">
          Save current theme
        </button>
        <button type="button" onClick={() => share(tokens)} className="btn btn-ghost !px-4 !py-2 text-xs">
          Copy share link
        </button>
      </div>

      {shareUrl && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input readOnly value={shareUrl} onFocus={(e) => e.currentTarget.select()} className="input !py-1.5 font-mono text-[11px]" aria-label="Share link" />
        </div>
      )}
      {msg && <p className="mt-2 text-[11px] font-semibold text-emerald-300">{msg}</p>}

      <div className="mt-4">
        {themes.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/12 px-4 py-5 text-center text-[11px] text-ink-faint">
            Nothing saved yet — tune the sliders above and save a recipe.
          </p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {themes.map((s) => (
              <div key={s.id} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[.02] px-3 py-2.5">
                <span className="h-6 w-6 shrink-0 rounded-full border border-white/15" style={{ background: hsl(s.tokens.hue, s.tokens.sat, 62) }} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold">{s.name}</p>
                  <p className="font-mono text-[9px] text-ink-faint">
                    h{s.tokens.hue} · s{s.tokens.sat} · r{s.tokens.radius} · {s.tokens.mode}
                  </p>
                </div>
                <button type="button" onClick={() => share(s.tokens)} className="rounded-lg border border-white/10 px-2 py-1 text-[10px] font-semibold text-ink-dim transition-colors hover:border-white/25 hover:text-ink">
                  share
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onApply(s.tokens);
                    setMsg(`Applied “${s.name}” — keep editing from it.`);
                  }}
                  className="rounded-lg border border-white/10 px-2 py-1 text-[10px] font-semibold text-ink-dim transition-colors hover:border-white/25 hover:text-ink"
                >
                  apply
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${s.name}`}
                  onClick={() => persist(themes.filter((x) => x.id !== s.id))}
                  className="rounded-lg px-1.5 py-1 text-[10px] text-ink-faint transition-colors hover:text-danger"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ===================================================================
   #311 — Original default defence (violet / cyan / mint)
   =================================================================== */

const DEFAULT_TRIO = [
  {
    name: "Violet",
    hex: REAL_VIOLET,
    role: "Primary accent",
    hslText: "hsl(258 90% 66%)",
    reason:
      "At hue 258 it stays unmistakably purple, with enough blue to partner a code-cyan and enough red to feel warm on near-black #06070b. It is the default for buttons, focus rings and selection across the chrome.",
    bar: 70,
  },
  {
    name: "Cyan",
    hex: REAL_CYAN,
    role: "Secondary accent",
    hslText: "hsl(188 86% 53%)",
    reason:
      "Roughly 70° around the wheel from violet, so it reads as a different signal, not a lighter copy. Kept at 53% lightness it stays luminous on dark surfaces — code accents, keyboard hints, gradient tails.",
    bar: 52,
  },
  {
    name: "Mint",
    hex: REAL_MINT,
    role: "Positive semantics",
    hslText: "hsl(158 64% 52%)",
    reason:
      "Pushed down to the green lane at 158°, mint is reserved for 'good' meanings — verified badges, passing scores — so a positive verdict never collides with either interactive accent.",
    bar: 42,
  },
] as const;

function hueDist(a: number, b: number) {
  const d = Math.abs(((a - b) % 360) + 360) % 360;
  return Math.min(d, 360 - d);
}

export function DefaultsCasePanel() {
  const total = COMPONENTS.length;
  const countNear = (anchor: number) => COMPONENTS.filter((c) => hueDist(accentHue(c.slug), anchor) <= 24).length;
  const violet = hexToHsl(REAL_VIOLET);
  const cyan = hexToHsl(REAL_CYAN);
  const mint = hexToHsl(REAL_MINT);
  const bg = hexToHsl(REAL_BG);
  const deep = hexToHsl(REAL_VIOLET_DEEP);
  const ink = hexToHsl(REAL_INK);
  const white = { h: 0, s: 0, l: 100 };
  const contrastRows = [
    { label: "Ink on violet fill", a: [ink.h, ink.s, ink.l], b: [violet.h, violet.s, violet.l] },
    { label: "White label on primary fill", a: [white.h, white.s, white.l], b: [deep.h, deep.s, deep.l] },
    { label: "Cyan text on page bg", a: [cyan.h, cyan.s, cyan.l], b: [bg.h, bg.s, bg.l] },
    { label: "Mint text on page bg", a: [mint.h, mint.s, mint.l], b: [bg.h, bg.s, bg.l] },
  ];

  return (
    <div className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Why violet, cyan, mint — the default trio, defended</p>
          <p className="mt-1 text-xs text-ink-dim">Motif ships dark-first with three original role colours. Here is the reasoning and the numbers behind them.</p>
        </div>
        <span className="chip !text-[10px]">case study · original default</span>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-2.5">
          {DEFAULT_TRIO.map((c) => {
            return (
              <div key={c.name} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[.02] p-4">
                <span className="h-10 w-10 shrink-0 rounded-xl border border-white/15" style={{ background: c.hex, borderRadius: 10 }} />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-extrabold">{c.name}</p>
                    <span className="chip !text-[9px]">{c.role}</span>
                  </div>
                  <p className="mt-0.5 font-mono text-[10px] text-ink-faint">
                    {c.hex} · {c.hslText}
                  </p>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-ink-dim">{c.reason}</p>
                </div>
              </div>
            );
          })}
          <p className="rounded-2xl border border-white/8 bg-white/[.02] p-4 text-[11px] leading-relaxed text-ink-dim">
            The trio is not decorative: it maps to three distinct lanes — <span className="font-bold text-ink">act</span> (violet),
            <span className="font-bold text-ink"> inform</span> (cyan) and <span className="font-bold text-ink">confirm</span> (mint) — so a reader
            can tell what a colour means before reading the label. Amber and rose complete the semantic set for warnings and errors.
          </p>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Live numbers</p>
            <div className="mt-3 space-y-2 text-[11px] text-ink-dim">
              <div className="flex items-center justify-between gap-3">
                <span>Catalog assets checked</span>
                <span className="font-mono font-bold text-ink">{total}</span>
              </div>
              {[
                { name: "Violet fingerprints", anchor: violet.h, hex: REAL_VIOLET },
                { name: "Cyan fingerprints", anchor: cyan.h, hex: REAL_CYAN },
                { name: "Mint fingerprints", anchor: mint.h, hex: REAL_MINT },
              ].map((row) => {
                const n = countNear(row.anchor);
                return (
                  <div key={row.name} className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full border border-white/20" style={{ background: row.hex }} />
                      {row.name}
                      <span className="text-ink-faint">(within 24°)</span>
                    </span>
                    <span className="font-mono font-bold text-ink">{n}</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-2 border-t border-white/6 pt-2 text-[10px] text-ink-faint">
              Fingerprints are the per-asset hues derived from each slug — how many assets already sit near each role colour.
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Contrast check · real WCAG math</p>
            <div className="mt-3 space-y-2">
              {contrastRows.map((row) => {
                const ratio = contrastRatio(row.a[0], row.a[1], row.a[2], row.b[0], row.b[1], row.b[2]);
                const ok = ratio >= 4.5;
                return (
                  <div key={row.label} className="flex items-center justify-between gap-3 text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <span className="h-3.5 w-3.5 rounded border border-white/20" style={{ background: hsl(row.b[0], row.b[1], row.b[2]) }} />
                      <span className="h-3.5 w-3.5 rounded border border-white/20" style={{ background: hsl(row.a[0], row.a[1], row.a[2]) }} />
                      <span className="text-ink-dim">{row.label}</span>
                    </span>
                    <span className={`font-mono text-[11px] font-bold ${ok ? "text-mint" : "text-amber-300"}`}>{ratio.toFixed(2)}:1</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-2 border-t border-white/6 pt-2 text-[10px] text-ink-faint">
              All four default pairs are recomputed from the @theme hex values above — no stored scores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================================================================
   #312 — Theming a real component (Halo Button recipe)
   =================================================================== */

const RECIPE_LAYERS: {
  id: string;
  label: string;
  change: string;
  tokenName: string;
  line: (t: Tokens) => string;
  chip: (t: Tokens) => string;
}[] = [
  {
    id: "surface",
    label: "Surface & corners",
    change: "mode picks the page surface, radius shapes the pill and its wrap",
    tokenName: "mode · radius",
    line: (t) => `color-scheme: ${t.mode};  --radius-md: ${t.radius}px;`,
    chip: (t) => `${t.mode} · r${t.radius}px`,
  },
  {
    id: "halo",
    label: "Halo & primary fill",
    change: "hue and saturation drive the glow colour and gradient fill",
    tokenName: "hue · sat",
    line: (t) => `--accent-h: ${t.hue};  --accent-s: ${t.sat}%;`,
    chip: (t) => `h${t.hue} s${t.sat}`,
  },
  {
    id: "label",
    label: "Label & focus ring",
    change: "label ink is chosen per mode; the 2px ring uses accent at 90% alpha",
    tokenName: "ink · accent ring",
    line: (t) => `color: var(--ink);  outline: 2px solid ${hsl(t.hue, t.sat, 62, 0.9)};`,
    chip: () => "focus · ring",
  },
  {
    id: "depth",
    label: "Press & depth shadow",
    change: "the resting halo shadow softens with a low-alpha accent glow",
    tokenName: "accent alpha",
    line: (t) => `box-shadow: 0 12px 32px -14px ${hsl(t.hue, t.sat, 58, 0.5)};`,
    chip: () => "glow · shadow",
  },
];

export function RecipePanel({ tokens }: { tokens: Tokens }) {
  const [active, setActive] = useState(1);
  const surf = studioSurfaces(tokens.mode);
  const accentL = (l: number, a = 1) => hsl(tokens.hue, tokens.sat, l, a);

  return (
    <div className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Theming a real component · Halo Button</p>
          <p className="mt-1 text-xs text-ink-dim">Four layers of one component, each bound to a token group. Select a layer to highlight its line.</p>
        </div>
        <span className="chip !text-[10px]">recipe walkthrough</span>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-2">
          {RECIPE_LAYERS.map((layer, i) => (
            <button
              key={layer.id}
              type="button"
              onClick={() => setActive(i)}
              className={`block w-full rounded-2xl border p-3.5 text-left transition-colors ${
                active === i ? "border-violet-300/45 bg-white/[.05]" : "border-white/8 bg-white/[.02] hover:border-white/18"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-extrabold">{layer.label}</p>
                <span className={`chip !text-[9px] ${active === i ? "!border-violet-300/40" : ""}`}>{layer.chip(tokens)}</span>
              </div>
              <p className="mt-1 text-[10px] leading-relaxed text-ink-faint">{layer.change}</p>
              {active === i && <pre className="mt-2 overflow-x-auto whitespace-pre rounded-lg bg-[#07090f] px-2.5 py-1.5 font-mono text-[10px] text-emerald-300">{layer.line(tokens)}</pre>}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center rounded-2xl border border-white/8 p-6" style={{ background: surf.panel }}>
          <div className="w-full max-w-[280px] text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: surf.dim }}>
              live sample · {tokens.mode} mode
            </p>
            <div
              className="mt-4 flex items-center justify-center gap-1.5 py-3"
              style={{ borderRadius: Math.max(6, corner(tokens, 1.5)), border: `1px solid ${accentL(62, 0.25)}`, background: accentL(62, 0.06) }}
            >
              <button
                type="button"
                className="relative font-bold"
                style={{
                  padding: "9px 22px",
                  borderRadius: Math.max(4, corner(tokens)),
                  background: `linear-gradient(135deg, ${accentL(52)}, ${accentL(62)} 60%, ${hsl((tokens.hue + 46) % 360, Math.min(100, tokens.sat + 4), 62)})`,
                  color: "#fff",
                  boxShadow: `0 14px 34px -14px ${accentL(54, 0.75)}`,
                }}
              >
                Copy snippet
              </button>
            </div>
            <p className="mt-3 text-[10px] leading-relaxed" style={{ color: surf.dim }}>
              A sample rendered from the recipe lines — the catalog&apos;s live halo-button demo keeps its own prop
              controls and physics on its page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
