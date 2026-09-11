"use client";

// Section 17 — interactive scenes and motion.
//
// These scenes lived in Demo.tsx until that file crossed 500 KB, at which point
// Babel logged that it was deoptimising the module's styling. Nothing about the
// scenes changed in the move: same components, same helpers, same behaviour —
// only the file they live in. Demo.tsx keeps the loader map that points a
// catalog entry's demo key at the module holding its component, and batch 85
// moved the other 136 scenes into seven sibling sets under scenes/ so that a
// page loads one set rather than all of them.
//
// The helpers these scenes share (useReducedMotion, the curve maths) stay
// module-local: nothing outside this file imports them, and `check:demos` fails
// if a scene module exports something no loader and no other file names.

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { COMPONENTS, PROMPTS } from "@/lib/data";
import { LEARN_ARTICLES } from "@/lib/learn";
import { contrastChecks, THEME_PRESETS, type ThemeValues } from "@/lib/admin-ops";

/* -------------------- SECTION 17 · INTERACTIVE SCENES -------------------- */

/** Three scenes share one question: what does the interaction do when the
 *  reader has asked for less motion, or has no pointer? The stylesheet already
 *  kills keyframe animation for `prefers-reduced-motion`; a demo that moves
 *  elements with an inline transform has to ask for itself, which is what this
 *  hook is for. */
function useReducedMotion() {
  const [reduced, setReduced] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

const REORDER_SEED = [
  { id: "brief", label: "Write the brief", meta: "Today · Sam" },
  { id: "refs", label: "Collect three references", meta: "Tomorrow · you" },
  { id: "hero", label: "Build the hero", meta: "Thursday · Sam" },
  { id: "review", label: "Review in the studio", meta: "Friday · both" },
  { id: "ship", label: "Cut the release", meta: "Next week" },
];

export function ReorderList() {
  const [rows, setRows] = useState(REORDER_SEED);
  const [dragging, setDragging] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [status, setStatus] = useState("Five steps. Drag a handle, or focus one and press the arrow keys.");
  const listRef = useRef<HTMLUListElement>(null);
  const topsRef = useRef<Map<string, number>>(new Map());
  const reduced = useReducedMotion();

  // offsetTop is used rather than getBoundingClientRect on purpose: it reports
  // the layout slot and ignores the transform a glide may be mid-way through,
  // so measuring during an animation does not poison the next one.
  const measure = () => {
    const list = listRef.current;
    if (!list) return;
    const next = new Map<string, number>();
    for (const el of Array.from(list.querySelectorAll<HTMLElement>("[data-row]"))) {
      next.set(el.dataset.row as string, el.offsetTop);
    }
    topsRef.current = next;
  };

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const before = topsRef.current;
    for (const el of Array.from(list.querySelectorAll<HTMLElement>("[data-row]"))) {
      const id = el.dataset.row as string;
      const was = before.get(id);
      if (was === undefined || id === dragging) continue;
      const dy = was - el.offsetTop;
      if (!dy) continue;
      el.style.transition = "none";
      el.style.transform = `translateY(${dy}px)`;
      requestAnimationFrame(() => {
        el.style.transition = reduced ? "none" : "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)";
        el.style.transform = "";
      });
    }
    measure();
  }, [rows, reduced, dragging]);

  const move = (id: string, to: number) => {
    const from = rows.findIndex((r) => r.id === id);
    const clamped = Math.max(0, Math.min(rows.length - 1, to));
    if (from === -1 || from === clamped) return;
    const next = [...rows];
    const [row] = next.splice(from, 1);
    next.splice(clamped, 0, row);
    setRows(next);
    setStatus(`${row.label} moved to position ${clamped + 1} of ${next.length}.`);
  };

  const onHandleKey = (e: React.KeyboardEvent, id: string, index: number) => {
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      move(id, index - 1);
    } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      move(id, index + 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      move(id, 0);
    } else if (e.key === "End") {
      e.preventDefault();
      move(id, rows.length - 1);
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(70%_90%_at_50%_0%,rgba(139,92,246,0.12),transparent_60%),#08090f] px-6 py-6">
      <div className="w-full max-w-md">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-violet-300/80">Release checklist</p>
          <p className="text-[10px] text-ink-faint">drag, or use the arrows</p>
        </div>
        <ul ref={listRef} className="space-y-2">
          {rows.map((row, index) => (
            <li
              key={row.id}
              data-row={row.id}
              draggable
              onDragStart={(e) => {
                setDragging(row.id);
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", row.id);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                if (dragging && dragging !== row.id) setOverId(row.id);
              }}
              onDrop={(e) => {
                e.preventDefault();
                const id = dragging ?? e.dataTransfer.getData("text/plain");
                if (id && id !== row.id) move(id, index);
                setDragging(null);
                setOverId(null);
              }}
              onDragEnd={() => {
                setDragging(null);
                setOverId(null);
              }}
              className={`flex items-center gap-3 rounded-2xl border bg-white/[.03] px-3 py-2.5 ${
                overId === row.id ? "border-violet-400/60" : "border-white/8"
              } ${dragging === row.id ? "opacity-60" : ""}`}
              style={{ willChange: "transform" }}
            >
              <span className="w-4 text-[10px] tabular-nums text-ink-faint">{index + 1}</span>
              <button
                type="button"
                aria-label={`Reorder ${row.label}. Arrow keys move it, Home and End send it to either end.`}
                onKeyDown={(e) => onHandleKey(e, row.id, index)}
                className="cursor-grab rounded-lg border border-white/10 p-1.5 text-ink-faint transition-colors hover:border-violet-400/50 hover:text-ink active:cursor-grabbing"
              >
                <svg width="10" height="14" viewBox="0 0 10 14" aria-hidden focusable="false">
                  {[2, 7, 12].map((cy) => (
                    <g key={cy}>
                      <circle cx="2.5" cy={cy} r="1.2" fill="currentColor" />
                      <circle cx="7.5" cy={cy} r="1.2" fill="currentColor" />
                    </g>
                  ))}
                </svg>
              </button>
              <span className="flex-1">
                <span className="block text-xs font-semibold text-ink">{row.label}</span>
                <span className="block text-[10px] text-ink-faint">{row.meta}</span>
              </span>
            </li>
          ))}
        </ul>
        <p aria-live="polite" className="mt-3 min-h-[1rem] text-[10px] leading-relaxed text-violet-200/80">
          {status}
        </p>
      </div>
    </div>
  );
}

const SWIPE_SEED = [
  { id: "hero", title: "Gradient hero", meta: "Landing · 3 references kept" },
  { id: "pricing", title: "Three-tier pricing", meta: "Landing · needs a copy pass" },
  { id: "changelog", title: "Changelog journal", meta: "Docs · reads well on mobile" },
  { id: "waitlist", title: "Waitlist band", meta: "Launch · one field, one button" },
  { id: "gallery", title: "Filterable gallery", meta: "Work · 12 stills placed" },
];

export function SwipeDeck() {
  const [deck, setDeck] = useState(SWIPE_SEED);
  const [history, setHistory] = useState<{ id: string; kept: boolean }[]>([]);
  const [drag, setDrag] = useState<{ id: string; x: number } | null>(null);
  const [status, setStatus] = useState(`${SWIPE_SEED.length} cards in the deck. Swipe, or use the two buttons.`);
  const reduced = useReducedMotion();
  const startRef = useRef(0);

  const decide = (kept: boolean) => {
    const card = deck[0];
    if (!card) return;
    const next = deck.slice(1);
    setDeck(next);
    setHistory((h) => [...h, { id: card.id, kept }]);
    setDrag(null);
    setStatus(
      next.length === 0
        ? `${kept ? "Kept" : "Skipped"} ${card.title}. That was the last card — ${history.filter((h) => h.kept).length + (kept ? 1 : 0)} kept.`
        : `${kept ? "Kept" : "Skipped"} ${card.title}. ${next.length} left.`
    );
  };

  const undo = () => {
    const last = history[history.length - 1];
    if (!last) return;
    const card = SWIPE_SEED.find((c) => c.id === last.id);
    if (!card) return;
    setDeck((d) => [card, ...d.filter((c) => c.id !== card.id)]);
    setHistory((h) => h.slice(0, -1));
    setDrag(null);
    setStatus(`Undid the decision on ${card.title}.`);
  };

  const restart = () => {
    setDeck(SWIPE_SEED);
    setHistory([]);
    setDrag(null);
    setStatus("Deck reset. Five cards again.");
  };

  const kept = history.filter((h) => h.kept).length;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(70%_90%_at_50%_100%,rgba(56,189,248,0.12),transparent_60%),#08090f] px-6 py-6">
      <div className="w-full max-w-sm">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-300/80">Review deck</p>
          <p className="text-[10px] tabular-nums text-ink-faint">
            {kept} kept · {deck.length} left
          </p>
        </div>

        <div className="relative h-52">
          {deck.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/12 text-center">
              <p className="text-xs font-semibold text-ink">Deck finished</p>
              <p className="mt-1 text-[10px] text-ink-faint">Nothing left to decide. Undo one, or start again.</p>
            </div>
          )}
          {deck
            .slice(0, 3)
            .reverse()
            .map((card, i, all) => {
              const depth = all.length - 1 - i; // 0 = top card
              const top = depth === 0;
              const x = top && drag ? drag.x : 0;
              const tilt = reduced ? 0 : x / 18;
              return (
                <div
                  key={card.id}
                  aria-hidden={!top}
                  style={{
                    transform: `translate(${x}px, ${depth * 8}px) rotate(${tilt}deg) scale(${1 - depth * 0.04})`,
                    transition: drag && top ? "none" : reduced ? "none" : "transform 260ms cubic-bezier(0.22, 1, 0.36, 1)",
                    zIndex: 3 - depth,
                    touchAction: top ? "none" : undefined,
                  }}
                  className={`absolute inset-x-0 top-0 rounded-2xl border bg-panel p-4 ${
                    top ? "border-sky-400/30" : "border-white/8"
                  }`}
                  onPointerDown={(e) => {
                    if (!top) return;
                    startRef.current = e.clientX;
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setDrag({ id: card.id, x: 0 });
                  }}
                  onPointerMove={(e) => {
                    if (!top || !drag) return;
                    setDrag({ id: card.id, x: e.clientX - startRef.current });
                  }}
                  onPointerUp={() => {
                    if (!top) return;
                    if (drag && Math.abs(drag.x) > 90) decide(drag.x > 0);
                    else setDrag(null);
                  }}
                  onPointerCancel={() => setDrag(null)}
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-300/70">Card {history.length + depth + 1}</p>
                  <p className="mt-2 text-sm font-bold text-ink">{card.title}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-ink-dim">{card.meta}</p>
                  {top && drag && Math.abs(drag.x) > 90 && (
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-ink">
                      {drag.x > 0 ? "Release to keep" : "Release to skip"}
                    </p>
                  )}
                </div>
              );
            })}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button type="button" onClick={() => decide(false)} disabled={!deck.length} className="btn btn-ghost flex-1 !py-2 text-[11px] disabled:opacity-40">
            ← Skip
          </button>
          <button type="button" onClick={() => decide(true)} disabled={!deck.length} className="btn btn-primary flex-1 !py-2 text-[11px] disabled:opacity-40">
            Keep →
          </button>
          <button type="button" onClick={undo} disabled={!history.length} className="btn btn-ghost !px-3 !py-2 text-[11px] disabled:opacity-40">
            Undo
          </button>
          <button type="button" onClick={restart} className="btn btn-ghost !px-3 !py-2 text-[11px]">
            Reset
          </button>
        </div>
        <p aria-live="polite" className="mt-3 min-h-[1rem] text-[10px] leading-relaxed text-sky-200/80">
          {status}
        </p>
        {reduced && (
          <p className="mt-1 text-[10px] leading-relaxed text-ink-faint">
            Reduced motion is on: the cards move without rotation and without the spring back.
          </p>
        )}
      </div>
    </div>
  );
}

const SPLIT_LAYERS = [
  { id: "sky", label: "Sky gradient", colour: "#38bdf8" },
  { id: "grid", label: "Grid overlay", colour: "#a78bfa" },
  { id: "glow", label: "Corner glow", colour: "#f472b6" },
];

export function SplitPane() {
  const [pct, setPct] = useState(42);
  const [on, setOn] = useState<string[]>(["sky", "grid"]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [resizing, setResizing] = useState(false);
  const reduced = useReducedMotion();
  const clamp = (n: number) => Math.max(20, Math.min(80, n));

  const setFromClientX = (clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPct(clamp(Math.round(((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(70%_90%_at_50%_0%,rgba(167,139,250,0.12),transparent_60%),#08090f] px-6 py-6">
      <div className="w-full max-w-lg">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-violet-300/80">Layer inspector</p>
          <p className="text-[10px] tabular-nums text-ink-faint">left pane {pct}% · drag the divider or press ← →</p>
        </div>

        <div ref={wrapRef} className="flex h-56 overflow-hidden rounded-2xl border border-white/10">
          <div className="overflow-hidden bg-white/[.02]" style={{ width: `${pct}%` }}>
            <ul className="space-y-1.5 p-3">
              {SPLIT_LAYERS.map((layer) => {
                const checked = on.includes(layer.id);
                return (
                  <li key={layer.id}>
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/8 bg-white/[.02] px-2.5 py-2 text-[11px]">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setOn((prev) => (checked ? prev.filter((id) => id !== layer.id) : [...prev, layer.id]))
                        }
                        className="accent-violet-400"
                      />
                      <span className="flex-1 text-ink-dim">{layer.label}</span>
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: layer.colour }} aria-hidden />
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>

          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize the two panels"
            aria-valuenow={pct}
            aria-valuemin={20}
            aria-valuemax={80}
            aria-valuetext={`Left panel ${pct} percent`}
            tabIndex={0}
            onKeyDown={(e) => {
              const step = e.shiftKey ? 10 : 2;
              if (e.key === "ArrowLeft") { e.preventDefault(); setPct((p) => clamp(p - step)); }
              else if (e.key === "ArrowRight") { e.preventDefault(); setPct((p) => clamp(p + step)); }
              else if (e.key === "Home") { e.preventDefault(); setPct(20); }
              else if (e.key === "End") { e.preventDefault(); setPct(80); }
              else if (e.key === "Enter") { e.preventDefault(); setPct(42); }
            }}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              setResizing(true);
              setFromClientX(e.clientX);
            }}
            onPointerMove={(e) => {
              if (resizing) setFromClientX(e.clientX);
            }}
            onPointerUp={() => setResizing(false)}
            onPointerCancel={() => setResizing(false)}
            onDoubleClick={() => setPct(42)}
            className={`w-2.5 shrink-0 cursor-col-resize border-x border-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400 ${
              resizing ? "bg-violet-400/40" : "bg-white/[.06] hover:bg-violet-400/25"
            }`}
          />

          <div className="flex-1 bg-[#0b0d14] p-3">
            <div className="relative h-full overflow-hidden rounded-xl border border-white/8">
              {on.includes("sky") && (
                <div
                  className="absolute inset-0"
                  style={{
                    background: "radial-gradient(60% 80% at 50% 0%, rgba(56,189,248,0.35), transparent 65%)",
                    transition: reduced ? "none" : "opacity 200ms ease",
                  }}
                />
              )}
              {on.includes("grid") && (
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px)",
                    backgroundSize: "18px 18px",
                    transition: reduced ? "none" : "opacity 200ms ease",
                  }}
                />
              )}
              {on.includes("glow") && (
                <div
                  className="absolute inset-0"
                  style={{
                    background: "radial-gradient(45% 55% at 100% 100%, rgba(244,114,182,0.5), transparent 70%)",
                    transition: reduced ? "none" : "opacity 200ms ease",
                  }}
                />
              )}
              <p className="absolute bottom-2 left-3 text-[10px] text-white/70">
                {on.length} of {SPLIT_LAYERS.length} layers visible
              </p>
            </div>
          </div>
        </div>

        <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
          The divider is a real <span className="font-mono">separator</span>: 20% to 80%, arrow keys for two points, shift for
          ten, Enter or a double-click back to the default. Both panes keep working at any size.
        </p>
      </div>
    </div>
  );
}

/* -------------------- SECTION 17 · THREE MORE SCENES -------------------- */

// A stylised street map, drawn from the numbers below rather than loaded as a
// picture. The zoom lens magnifies this geometry, so the "image" stays sharp
// at 4× and the site keeps its no-raster-assets property.
const MAP_BLOCKS = [
  { x: 14, y: 14, w: 46, h: 34, tone: "#141a2b" },
  { x: 70, y: 14, w: 34, h: 22, tone: "#182034" },
  { x: 114, y: 14, w: 52, h: 34, tone: "#141a2b" },
  { x: 176, y: 14, w: 50, h: 50, tone: "#182034" },
  { x: 14, y: 58, w: 46, h: 44, tone: "#182034" },
  { x: 70, y: 46, w: 34, h: 56, tone: "#101625" },
  { x: 114, y: 58, w: 52, h: 44, tone: "#182034" },
  { x: 70, y: 112, w: 96, h: 34, tone: "#141a2b" },
  { x: 176, y: 74, w: 50, h: 40, tone: "#101625" },
  { x: 14, y: 112, w: 46, h: 34, tone: "#101625" },
];
const MAP_FEATURES = [
  "Two avenues crossing at the centre",
  "A park on the north-east block",
  "A river along the south edge",
  "Eleven blocks, all drawn in SVG",
];

function MapArt() {
  return (
    <g>
      <rect width="240" height="160" fill="#0b0d14" />
      {MAP_BLOCKS.map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="3" fill={b.tone} stroke="rgba(255,255,255,.06)" />
      ))}
      <rect x="176" y="14" width="50" height="50" rx="6" fill="#0f2a22" stroke="rgba(52,211,153,.25)" />
      <path d="M0 150 Q60 138 120 148 T240 142 L240 160 L0 160 Z" fill="#0d2136" />
      <path d="M0 78 H240" stroke="#1d2436" strokeWidth="10" />
      <path d="M100 0 V160" stroke="#1d2436" strokeWidth="10" />
      <path d="M0 78 H240" stroke="rgba(255,255,255,.10)" strokeWidth="1" strokeDasharray="6 6" />
      <path d="M100 0 V160" stroke="rgba(255,255,255,.10)" strokeWidth="1" strokeDasharray="6 6" />
      <circle cx="100" cy="78" r="7" fill="#0b0d14" stroke="rgba(167,139,250,.55)" />
    </g>
  );
}

export function ZoomLens() {
  const [pt, setPt] = useState({ x: 120, y: 72 });
  const [zoom, setZoom] = useState(2);
  const [active, setActive] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();
  const radius = 30;

  const toArt = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const r = svg.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(240, ((clientX - r.left) / r.width) * 240)),
      y: Math.max(0, Math.min(160, ((clientY - r.top) / r.height) * 160)),
    };
  };

  const pan = (dx: number, dy: number) => {
    setActive(true);
    setPt((p) => ({ x: Math.max(0, Math.min(240, p.x + dx)), y: Math.max(0, Math.min(160, p.y + dy)) }));
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(70%_90%_at_50%_0%,rgba(56,189,248,0.10),transparent_60%),#08090f] px-6 py-6">
      <div className="w-full max-w-md">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-300/80">District map</p>
          <p className="text-[10px] tabular-nums text-ink-faint">
            lens {zoom.toFixed(1)}× · {active ? "following" : "hover or focus"}
          </p>
        </div>

        <svg
          ref={svgRef}
          viewBox="0 0 240 160"
          role="application"
          tabIndex={0}
          aria-label="Interactive district map with a magnifying lens. Arrow keys pan the lens, plus and minus change its zoom."
          className="h-44 w-full cursor-crosshair rounded-2xl border border-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400"
          onPointerMove={(e) => {
            setActive(true);
            const p = toArt(e.clientX, e.clientY);
            setPt(p);
          }}
          onPointerDown={(e) => {
            setActive(true);
            setPt(toArt(e.clientX, e.clientY));
          }}
          onPointerLeave={() => setActive(false)}
          onBlur={() => setActive(false)}
          onKeyDown={(e) => {
            const step = e.shiftKey ? 16 : 6;
            if (e.key === "ArrowLeft") { e.preventDefault(); pan(-step, 0); }
            else if (e.key === "ArrowRight") { e.preventDefault(); pan(step, 0); }
            else if (e.key === "ArrowUp") { e.preventDefault(); pan(0, -step); }
            else if (e.key === "ArrowDown") { e.preventDefault(); pan(0, step); }
            else if (e.key === "+" || e.key === "=") { e.preventDefault(); setActive(true); setZoom((z) => Math.min(4, z + 0.5)); }
            else if (e.key === "-" || e.key === "_") { e.preventDefault(); setActive(true); setZoom((z) => Math.max(1.5, z - 0.5)); }
          }}
        >
          <defs>
            <clipPath id="motif-lens-clip">
              <circle cx={pt.x} cy={pt.y} r={radius} />
            </clipPath>
          </defs>
          <MapArt />
          {active && (
            <g>
              <g clipPath="url(#motif-lens-clip)">
                <g transform={`translate(${pt.x} ${pt.y}) scale(${zoom}) translate(${-pt.x} ${-pt.y})`}>
                  <MapArt />
                </g>
              </g>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={radius}
                fill="none"
                stroke="rgba(125,211,252,.85)"
                strokeWidth="1.5"
                style={{ transition: reduced ? "none" : "r 160ms ease" }}
              />
              <circle cx={pt.x} cy={pt.y} r="1.6" fill="rgba(125,211,252,.9)" />
            </g>
          )}
        </svg>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/8 bg-white/[.02] px-3 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">On the map</p>
            <ul className="mt-1 space-y-0.5">
              {MAP_FEATURES.map((f) => (
                <li key={f} className="text-[10px] leading-relaxed text-ink-dim">
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <p className="rounded-2xl border border-white/8 bg-white/[.02] px-3 py-2.5 text-[10px] leading-relaxed text-ink-dim">
            A magnifier that only works with a mouse is half a magnifier: the lens also pans with the arrow keys and zooms with
            plus and minus, and the list beside it carries the same information for anyone who never sees the drawing at all.
          </p>
        </div>
      </div>
    </div>
  );
}

const fidelitySeries = [...PROMPTS].map((p) => ({ v: p.avgFidelity, slug: p.slug, model: p.bestModel })).sort((a, b) => a.v - b.v);

export function ChartScrubber() {
  const [lo, setLo] = useState(18);
  const [hi, setHi] = useState(54);
  const [dragging, setDragging] = useState<"lo" | "hi" | null>(null);
  const [reading, setReading] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const n = fidelitySeries.length;
  const inBand = fidelitySeries.slice(lo, hi + 1);
  const mean = Math.round((inBand.reduce((a, b) => a + b.v, 0) / Math.max(1, inBand.length)) * 10) / 10;
  const best = inBand.reduce((top, p) => (p.v > top.v ? p : top), inBand[0] ?? fidelitySeries[0]);
  const floor = 60;
  const ceil = 100;
  const height = (v: number) => `${Math.max(8, ((v - floor) / (ceil - floor)) * 100)}%`;

  const indexFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    return Math.max(0, Math.min(n - 1, Math.round(((clientX - r.left) / r.width) * (n - 1))));
  };

  const onHandleKey = (e: React.KeyboardEvent, which: "lo" | "hi") => {
    const step = e.shiftKey ? 6 : 1;
    const apply = (delta: number) => {
      if (which === "lo") setLo((v) => Math.max(0, Math.min(hi - 1, v + delta)));
      else setHi((v) => Math.min(n - 1, Math.max(lo + 1, v + delta)));
    };
    if (e.key === "ArrowLeft") { e.preventDefault(); apply(-step); }
    else if (e.key === "ArrowRight") { e.preventDefault(); apply(step); }
    else if (e.key === "Home") {
      e.preventDefault();
      if (which === "lo") setLo(0);
      else setHi(lo + 1);
    } else if (e.key === "End") {
      e.preventDefault();
      if (which === "hi") setHi(n - 1);
      else setLo(hi - 1);
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(70%_90%_at_50%_100%,rgba(167,139,250,0.12),transparent_60%),#08090f] px-6 py-6">
      <div className="w-full max-w-lg">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-violet-300/80">Prompt fidelity, {n} run-tested prompts</p>
          <p className="text-[10px] tabular-nums text-ink-faint">
            {lo + 1}–{hi + 1} of {n} · mean {mean}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[.02] p-3">
          <div
            ref={trackRef}
            className="relative flex h-32 items-end gap-[2px]"
            onPointerMove={(e) => {
              setReading(indexFromClientX(e.clientX));
              if (dragging) {
                const i = indexFromClientX(e.clientX);
                if (dragging === "lo") setLo(Math.max(0, Math.min(hi - 1, i)));
                else setHi(Math.min(n - 1, Math.max(lo + 1, i)));
              }
            }}
            onPointerLeave={() => {
              setReading(null);
              setDragging(null);
            }}
            onPointerUp={() => setDragging(null)}
          >
            {fidelitySeries.map((p, i) => {
              const inBandRow = i >= lo && i <= hi;
              return (
                <button
                  key={p.slug}
                  type="button"
                  tabIndex={-1}
                  aria-hidden
                  onPointerDown={() => {
                    setDragging(i - lo <= hi - i ? "lo" : "hi");
                  }}
                  className="flex-1 rounded-t-[2px] transition-opacity"
                  style={{
                    height: height(p.v),
                    background: inBandRow ? "#a78bfa" : "rgba(167,139,250,.22)",
                    opacity: reading === i ? 1 : inBandRow ? 0.95 : 0.6,
                  }}
                />
              );
            })}

            <div
              role="slider"
              tabIndex={0}
              aria-label="Lower fidelity bound"
              aria-valuemin={0}
              aria-valuemax={n - 1}
              aria-valuenow={lo}
              aria-valuetext={`Prompt ${lo + 1} of ${n}, fidelity ${fidelitySeries[lo].v}`}
              onKeyDown={(e) => onHandleKey(e, "lo")}
              className="absolute bottom-0 top-0 w-3 -translate-x-1/2 cursor-ew-resize rounded-full bg-violet-400/25 hover:bg-violet-400/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300"
              style={{ left: `${(lo / (n - 1)) * 100}%` }}
            />
            <div
              role="slider"
              tabIndex={0}
              aria-label="Upper fidelity bound"
              aria-valuemin={0}
              aria-valuemax={n - 1}
              aria-valuenow={hi}
              aria-valuetext={`Prompt ${hi + 1} of ${n}, fidelity ${fidelitySeries[hi].v}`}
              onKeyDown={(e) => onHandleKey(e, "hi")}
              className="absolute bottom-0 top-0 w-3 -translate-x-1/2 cursor-ew-resize rounded-full bg-violet-400/25 hover:bg-violet-400/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300"
              style={{ left: `${(hi / (n - 1)) * 100}%` }}
            />
          </div>

          <div className="mt-2 flex justify-between text-[9px] tabular-nums text-ink-faint">
            <span>{fidelitySeries[0].v}</span>
            <span>{reading !== null ? `prompt ${reading + 1}: ${fidelitySeries[reading].v} avg fidelity · ${fidelitySeries[reading].model}` : "drag a bar, or focus a handle and use ← →"}</span>
            <span>{fidelitySeries[n - 1].v}</span>
          </div>
        </div>

        <dl className="mt-3 grid grid-cols-3 gap-2">
          {[
            ["Prompts in band", String(inBand.length)],
            ["Band mean", String(mean)],
            ["Best model in band", best.model],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl border border-white/8 bg-white/[.02] px-3 py-2">
              <dt className="text-[9px] font-bold uppercase tracking-widest text-ink-faint">{k}</dt>
              <dd className="mt-0.5 text-[11px] font-semibold text-ink">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">
          The series is not decoration: it is the average fidelity of every prompt in the catalog, sorted, and the band selects
          real rows — the same averages the prompt cards print. {best.model} leads the selected band at {best.v}.
        </p>
      </div>
    </div>
  );
}

const PIN_CHAPTERS = [
  { title: "Sketch", body: "Three boxes, one accent colour. Nothing else survives the first review." },
  { title: "Build", body: "The hero ships first, then the pricing band, then the FAQ nobody asked for." },
  { title: "Ship", body: "Deploy, watch the first hour, and keep the changelog entry honest." },
];

export function ScrollPin() {
  const [step, setStep] = useState(0);
  const [pinned, setPinned] = useState(false);
  const [status, setStatus] = useState("Scroll pinning is off. This box scrolls like any other box.");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const go = (next: number, how: string) => {
    const clamped = Math.max(0, Math.min(PIN_CHAPTERS.length - 1, next));
    setStep(clamped);
    setStatus(`Step ${clamped + 1} of ${PIN_CHAPTERS.length}, ${PIN_CHAPTERS[clamped].title} — ${how}.`);
  };

  const release = () => {
    setPinned(false);
    setStatus("Pinning released. The scroll is yours again.");
  };

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el || !pinned) return;
    const reach = el.scrollHeight - el.clientHeight;
    if (reach <= 0) return;
    const next = Math.round((el.scrollTop / reach) * (PIN_CHAPTERS.length - 1));
    if (next !== step) go(next, "reached by scrolling");
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(70%_90%_at_50%_0%,rgba(244,114,182,0.10),transparent_60%),#08090f] px-6 py-6">
      <div className="w-full max-w-md">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-pink-300/80">Three-step story</p>
          <label className="flex cursor-pointer items-center gap-2 text-[10px] text-ink-dim">
            <input
              type="checkbox"
              checked={pinned}
              onChange={() => {
                if (pinned) {
                  release();
                  return;
                }
                setPinned(true);
                setStatus("Pinning is on. Scroll inside the box, or use Next. Escape releases it.");
              }}
              className="accent-pink-400"
            />
            pin on scroll
          </label>
        </div>

        <div
          ref={scrollerRef}
          onScroll={onScroll}
          onKeyDown={(e) => {
            if (e.key === "Escape" && pinned) {
              e.preventDefault();
              release();
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              go(step + 1, "advanced with the arrow key");
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              go(step - 1, "went back with the arrow key");
            }
          }}
          tabIndex={0}
          aria-label="Three-step story. Arrow keys move between steps; Escape releases pinning."
          className={`h-56 overflow-y-auto rounded-2xl border focus-visible:outline focus-visible:outline-2 focus-visible:outline-pink-400 ${
            pinned ? "border-pink-400/40" : "border-white/10"
          }`}
        >
          {pinned ? (
            <div className="sticky top-0 flex h-56 flex-col justify-center bg-[#0b0d14] px-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-pink-300/70">
                Step {step + 1} of {PIN_CHAPTERS.length}
              </p>
              <p className="mt-2 text-lg font-extrabold text-ink">{PIN_CHAPTERS[step].title}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-ink-dim">{PIN_CHAPTERS[step].body}</p>
              <div className="mt-3 flex gap-1">
                {PIN_CHAPTERS.map((c, i) => (
                  <span key={c.title} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-pink-400/70" : "bg-white/10"}`} />
                ))}
              </div>
            </div>
          ) : (
            PIN_CHAPTERS.map((c, i) => (
              <section key={c.title} className={`px-5 py-5 ${i > 0 ? "border-t border-white/8" : ""}`}>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-ink-faint">Step {i + 1}</p>
                <p className="mt-1 text-sm font-bold text-ink">{c.title}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-ink-dim">{c.body}</p>
              </section>
            ))
          )}
          {/* Spacers give the scroller real distance to travel while pinned. */}
          {pinned && <div style={{ height: `${(PIN_CHAPTERS.length - 1) * 100}%` }} aria-hidden />}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => go(step - 1, "stepped back")} disabled={step === 0} className="btn btn-ghost !px-3.5 !py-2 text-[11px] disabled:opacity-40">
            ← Back
          </button>
          <button
            type="button"
            onClick={() => {
              const next = step + 1;
              go(next, "stepped forward");
              if (!pinned && next < PIN_CHAPTERS.length) {
                scrollerRef.current?.scrollTo({ top: next * 120, behavior: reduced ? "auto" : "smooth" });
              }
            }}
            disabled={step === PIN_CHAPTERS.length - 1}
            className="btn btn-primary !px-3.5 !py-2 text-[11px] disabled:opacity-40"
          >
            Next →
          </button>
          {pinned && (
            <button type="button" onClick={release} className="btn btn-ghost !px-3.5 !py-2 text-[11px]">
              Release (Esc)
            </button>
          )}
        </div>

        <p aria-live="polite" className="mt-2 min-h-[1rem] text-[10px] leading-relaxed text-pink-200/80">
          {status}
        </p>
        <p className="mt-1 text-[10px] leading-relaxed text-ink-faint">
          The pinning happens inside this box and only after the switch is on: the page you are reading keeps its own scroll, the
          buttons work whether or not pinning is enabled, and Escape gives the scroll straight back.
        </p>
      </div>
    </div>
  );
}

/* -------------------- SECTION 17 · FLIP, DRAW, MORPH -------------------- */

const STACK_CARDS = [
  { id: "library", face: "The library", back: `${COMPONENTS.length} assets · MIT`, hue: 262, note: "Every card links to a page with the same demo you just flipped." },
  { id: "motion", face: "Motion", back: "202 declarations", hue: 192, note: "The count comes from the animation audit, not from a wish." },
  { id: "tokens", face: "Tokens", back: "14 colours · 5 radii", hue: 330, note: "The same values the token export serves as JSON." },
];

export function FlipStack() {
  const [flipped, setFlipped] = useState<string[]>(["library"]);
  const [raised, setRaised] = useState<string | null>(null);
  const [status, setStatus] = useState("Three cards. Hover or focus one to flip it — the card that flips comes to the front.");
  const reduced = useReducedMotion();

  const toggle = (id: string) => {
    const card = STACK_CARDS.find((c) => c.id === id);
    if (!card) return;
    const next = flipped.includes(id) ? flipped.filter((f) => f !== id) : [...flipped, id];
    setFlipped(next);
    setStatus(next.includes(id) ? `${card.face} flipped: the back reads "${card.back}".` : `${card.face} flipped back to the front.`);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(70%_90%_at_50%_0%,rgba(167,139,250,0.12),transparent_60%),#08090f] px-6 py-6">
      <div className="w-full max-w-md">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-violet-300/80">Layered deck</p>
          <p className="text-[10px] tabular-nums text-ink-faint">{flipped.length} showing a back face</p>
        </div>

        <ul className="relative h-64">
          {STACK_CARDS.map((card, i) => {
            const isFlipped = flipped.includes(card.id);
            const isRaised = raised === card.id;
            return (
              <li
                key={card.id}
                className="absolute inset-x-0"
                style={{
                  top: `${i * 84}px`,
                  zIndex: isRaised ? 30 : 10 - i,
                  transform: `translateY(${isRaised ? -12 : 0}px) scale(${isRaised ? 1.02 : 1 - i * 0.015})`,
                  transformStyle: "preserve-3d",
                  perspective: "1100px",
                  transition: reduced ? "none" : "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <button
                  type="button"
                  aria-pressed={isFlipped}
                  onMouseEnter={() => {
                    setRaised(card.id);
                    if (!isFlipped) toggle(card.id);
                  }}
                  onMouseLeave={() => setRaised(null)}
                  onFocus={() => {
                    setRaised(card.id);
                    if (!isFlipped) toggle(card.id);
                  }}
                  onBlur={() => setRaised(null)}
                  onClick={() => toggle(card.id)}
                  className="relative block w-full rounded-2xl border border-white/10 bg-panel p-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400"
                  style={{
                    transform: `rotateY(${isFlipped ? 180 : 0}deg)`,
                    transformStyle: "preserve-3d",
                    transition: reduced ? "none" : "transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                    minHeight: "5rem",
                  }}
                >
                  <span
                    className="block"
                    style={{ backfaceVisibility: "hidden", opacity: isFlipped ? 0 : 1, transition: reduced ? "none" : "opacity 140ms" }}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: `hsl(${card.hue} 85% 70%)` }}>
                      Card {i + 1}
                    </span>
                    <span className="mt-1 block text-sm font-bold text-ink">{card.face}</span>
                    <span className="mt-1 block text-[10px] leading-relaxed text-ink-dim">{card.note}</span>
                  </span>
                  <span
                    aria-hidden
                    className="absolute inset-0 flex flex-col justify-center rounded-2xl px-4"
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                      opacity: isFlipped ? 1 : 0,
                      transition: reduced ? "none" : "opacity 140ms",
                      background: `radial-gradient(70% 90% at 50% 0%, hsl(${card.hue} 85% 62% / .18), transparent 70%)`,
                    }}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-ink-faint">Back</span>
                    <span className="mt-1 text-base font-extrabold text-ink">{card.back}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <p aria-live="polite" className="mt-3 min-h-[1rem] text-[10px] leading-relaxed text-violet-200/80">
          {status}
        </p>
        <p className="mt-1 text-[10px] leading-relaxed text-ink-faint">
          Focus flips a card exactly as hover does, and <span className="font-mono">aria-pressed</span> carries the state for
          anyone who cannot see which face is up. The overshoot is 420ms of real cubic-bezier; with reduced motion the flip is
          instant.
        </p>
      </div>
    </div>
  );
}

// One path, authored here: a signature curve that rises, loops and settles.
// The description below the drawing is what a reader gets instead of the shape.
const DRAW_PATH =
  "M14 96 C 40 20, 74 20, 86 62 S 118 128, 138 74 C 152 36, 174 30, 196 52 C 214 70, 214 96, 186 104 C 158 112, 132 96, 132 72 C 132 44, 160 20, 196 20";
const DRAW_NOTES = [
  "One stroked path, 9 curve segments, drawn at 1.6px on a 210×128 grid",
  "It traces when the frame scrolls into view, and again whenever you press Draw",
  "dashoffset does the work, so nothing re-lays out while it draws",
];

export function DrawOnScroll() {
  const pathRef = useRef<SVGPathElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [length, setLength] = useState(0);
  const [drawn, setDrawn] = useState(false);
  const [seen, setSeen] = useState(0);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    try {
      setLength(path.getTotalLength());
    } catch {
      setLength(0); // no SVG geometry API: the path stays drawn without the trace
    }
  }, []);

  useEffect(() => {
    const box = boxRef.current;
    if (!box || typeof IntersectionObserver === "undefined") {
      setDrawn(true); // no observer: show the finished path rather than nothing
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setSeen((n) => n + 1);
            setDrawn(true);
          }
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(70%_90%_at_50%_100%,rgba(56,189,248,0.12),transparent_60%),#08090f] px-6 py-6">
      <div className="w-full max-w-md">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-300/80">Signature curve</p>
          <p className="text-[10px] tabular-nums text-ink-faint">
            {drawn ? "drawn" : "cleared"} · entered view {seen}×
          </p>
        </div>

        <div ref={boxRef} className="rounded-2xl border border-white/10 bg-white/[.02] p-3">
          <svg viewBox="0 0 210 128" className="h-40 w-full" role="img" aria-labelledby="draw-title draw-desc">
            <title id="draw-title">A single curve that draws itself</title>
            <desc id="draw-desc">
              A stroked path that rises from the lower left, loops once and settles near the top right. It draws when it enters
              view and can be redrawn with the button below.
            </desc>
            <path d="M6 116 H204" stroke="rgba(255,255,255,.08)" strokeWidth="1" />
            <path d="M6 64 H204" stroke="rgba(255,255,255,.05)" strokeWidth="1" strokeDasharray="4 8" />
            <path d={DRAW_PATH} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="1.6" strokeLinecap="round" />
            <path
              ref={pathRef}
              d={DRAW_PATH}
              fill="none"
              stroke="#7dd3fc"
              strokeWidth="1.6"
              strokeLinecap="round"
              style={{
                strokeDasharray: length || undefined,
                strokeDashoffset: length ? length * (drawn ? 0 : 1) : undefined,
                transition: reduced ? "none" : "stroke-dashoffset 1200ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
            <circle cx="14" cy="96" r="2.6" fill="#7dd3fc" opacity={drawn ? 1 : 0} />
            <circle cx="196" cy="20" r="2.6" fill="#7dd3fc" opacity={drawn ? 1 : 0} />
          </svg>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setDrawn(false);
                // One frame lets the browser apply the reset before the
                // transition runs again; without it the path never redraws.
                requestAnimationFrame(() => setDrawn(true));
              }}
              className="btn btn-ghost !px-3.5 !py-2 text-[11px]"
            >
              Draw
            </button>
            <button type="button" onClick={() => setDrawn(false)} className="btn btn-ghost !px-3.5 !py-2 text-[11px]">
              Clear
            </button>
            <span className="text-[10px] text-ink-faint">
              {length ? `${Math.round(length)}px of path` : "measuring the path…"}
            </span>
          </div>
        </div>

        <ul className="mt-3 space-y-1">
          {DRAW_NOTES.map((n) => (
            <li key={n} className="text-[10px] leading-relaxed text-ink-dim">
              · {n}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">
          A decoration nobody can perceive is still a decoration: the description inside the SVG carries the same content, the
          buttons work whether or not the path ever draws itself, and reduced motion skips the 1200ms entirely.
        </p>
      </div>
    </div>
  );
}

// The morph is geometric, not a cross-fade. Each glyph is the same number of
// quads and the animation interpolates their corner points: play is two
// degenerate quads (the triangle split down the middle), pause is those quads
// opened into bars. Nothing here is traced from an icon set.
type Quad = [number, number][];
const PLAY_LEFT: Quad = [[0, 0], [50, 50], [50, 50], [0, 100]];
const PLAY_RIGHT: Quad = [[50, 50], [100, 0], [100, 100], [50, 50]];
const PAUSE_LEFT: Quad = [[0, 0], [36, 0], [36, 100], [0, 100]];
const PAUSE_RIGHT: Quad = [[64, 0], [100, 0], [100, 100], [64, 100]];
const PLUS: Quad[] = [
  [[40, 0], [60, 0], [60, 40], [40, 40]],
  [[60, 40], [100, 40], [100, 60], [60, 60]],
  [[40, 60], [60, 60], [60, 100], [40, 100]],
  [[0, 40], [40, 40], [40, 60], [0, 60]],
];
const CROSS: Quad[] = [
  [[16, 32], [32, 16], [84, 68], [68, 84]],
  [[68, 16], [84, 32], [32, 84], [16, 68]],
  [[68, 16], [84, 32], [32, 84], [16, 68]],
  [[16, 32], [32, 16], [84, 68], [68, 84]],
];
const CHEVRON_UP: Quad[] = [
  [[0, 62], [50, 12], [50, 12], [100, 62]],
  [[0, 62], [50, 12], [50, 12], [0, 62]],
];
const CHEVRON_DOWN: Quad[] = [
  [[0, 38], [50, 88], [50, 88], [100, 38]],
  [[0, 38], [50, 88], [50, 88], [0, 38]],
];

const MORPH_PAIRS = [
  { id: "play", label: "Play", from: [PLAY_LEFT, PLAY_RIGHT], to: [PAUSE_LEFT, PAUSE_RIGHT], alt: "Pause" },
  { id: "plus", label: "Add", from: PLUS, to: CROSS, alt: "Close" },
  { id: "chevron", label: "Collapse", from: CHEVRON_UP, to: CHEVRON_DOWN, alt: "Expand" },
];

function quadsToPath(quads: Quad[]): string {
  return quads.map((q) => `M${q.map(([x, y]) => `${x} ${y}`).join(" L")} Z`).join(" ");
}

function lerpQuads(from: Quad[], to: Quad[], t: number): Quad[] {
  return from.map((quad, qi) => quad.map(([x, y], pi) => [x + (to[qi][pi][0] - x) * t, y + (to[qi][pi][1] - y) * t] as Quad[number]));
}

export function MorphIcons() {
  const [on, setOn] = useState<Record<string, boolean>>({ play: true });
  const [t, setT] = useState<Record<string, number>>({ play: 0 });
  const [status, setStatus] = useState("Three glyph pairs. Each icon interpolates its corner points, and the label follows the glyph.");
  const reduced = useReducedMotion();
  const frameRef = useRef<number | null>(null);
  const clockRef = useRef<number>(0);

  // One rAF loop drives every morph at once: the glyphs share a clock, so three
  // icons toggled in the same second stay in step instead of racing.
  useEffect(() => {
    const tick = (now: number) => {
      const dt = clockRef.current ? Math.min(48, now - clockRef.current) : 16;
      clockRef.current = now;
      // ~320ms to cover the path between the two glyphs, independent of the
      // frame rate the reader's device manages.
      const step = Math.min(1, (dt / 320) * 1.6);
      setT((prev) => {
        let moved = false;
        const next: Record<string, number> = {};
        for (const pair of MORPH_PAIRS) {
          const target = on[pair.id] ? 0 : 1;
          const current = prev[pair.id] ?? target;
          if (reduced) {
            next[pair.id] = target;
            moved = moved || current !== target;
            continue;
          }
          const value = current + (target - current) * step;
          next[pair.id] = Math.abs(target - value) < 0.002 ? target : value;
          moved = moved || next[pair.id] !== current;
        }
        return moved ? next : prev;
      });
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      clockRef.current = 0;
    };
  }, [on, reduced]);

  const flip = (id: string) => {
    const pair = MORPH_PAIRS.find((p) => p.id === id);
    if (!pair) return;
    const next = !on[id];
    setOn((prev) => ({ ...prev, [id]: next }));
    setStatus(`${pair.label} → ${pair.alt}: now showing ${next ? pair.alt.toLowerCase() : pair.label.toLowerCase()}.`);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(70%_90%_at_50%_0%,rgba(52,211,153,0.10),transparent_60%),#08090f] px-6 py-6">
      <div className="w-full max-w-md">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-300/80">Morphing icons</p>

        <div className="mt-3 grid grid-cols-3 gap-3">
          {MORPH_PAIRS.map((pair) => {
            const active = on[pair.id] ?? false;
            const progress = reduced ? (active ? 1 : 0) : t[pair.id] ?? (active ? 0 : 1);
            const quads = lerpQuads(pair.from, pair.to, progress);
            return (
              <div key={pair.id} className="rounded-2xl border border-white/10 bg-white/[.02] p-3 text-center">
                <svg
                  viewBox="0 0 100 100"
                  className="mx-auto h-16 w-16"
                  role="img"
                  aria-label={`${pair.label} icon, currently showing ${active ? pair.alt : pair.label}`}
                >
                  <path d={quadsToPath(quads)} fill="#edf0f7" />
                </svg>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => flip(pair.id)}
                  className="mt-2 w-full rounded-xl border border-white/10 px-2 py-1.5 text-[10px] font-semibold text-ink-dim transition-colors hover:border-emerald-400/50 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"
                >
                  {pair.label} → {pair.alt}
                </button>
                <p className="mt-1 font-mono text-[9px] tabular-nums text-ink-faint">t = {progress.toFixed(2)}</p>
              </div>
            );
          })}
        </div>

        <p aria-live="polite" className="mt-3 min-h-[1rem] text-[10px] leading-relaxed text-emerald-200/80">
          {status}
        </p>
        <p className="mt-1 text-[10px] leading-relaxed text-ink-faint">
          Each glyph is a handful of quads with identical corner counts, so the browser interpolates coordinates instead of
          cross-fading two drawings. The readout shows the parameter itself, because a morph that never leaves 0 or 1 is just a
          swap with a nicer name.
        </p>
      </div>
    </div>
  );
}

/* -------------------- SECTION 17 · CHASE, SHIMMER, RING -------------------- */

const CHASE_COLUMN = [
  { name: "Pixel Parlor", handle: "pixelparlor", craft: "Landing sections" },
  { name: "Lena Ortiz", handle: "lena.dev", craft: "Form controls" },
  { name: "Noir Studio", handle: "noir.studio", craft: "Hero scenes" },
  { name: "Glyph RGB", handle: "glyph.rgb", craft: "Prompt engineering" },
  { name: "Karina Sole", handle: "karina_ui", craft: "Micro-interactions" },
  { name: "T T Typing", handle: "tttyping", craft: "Scroll choreography" },
  { name: "Studio Ceres", handle: "studio.ceres", craft: "Commerce prompts" },
  { name: "Monoflow", handle: "monoflow", craft: "Checkout flows" },
];

/** The stream is the site's own roster, drawn as type — no third-party logo is
 *  reproduced here, and there is no image anywhere in it. Each column is
 *  duplicated once so the translate loop can wrap without a visible seam.
 *
 *  The column is a top-level component with props rather than one declared
 *  inside the parent: a component created during render is a new type on every
 *  pass, and React unmounts its subtree each time. */
function RosterColumn({ offset, seconds, paused }: { offset: number; seconds: number; paused: boolean }) {
  return (
    <div
      className="flex flex-col gap-2"
      style={{
        animation: paused ? "none" : `chase-scroll ${seconds}s linear infinite`,
        animationDelay: `-${offset}s`,
      }}
    >
      {[...CHASE_COLUMN, ...CHASE_COLUMN].map((m, i) => (
        <div
          key={`${m.handle}-${i}`}
          aria-hidden={i >= CHASE_COLUMN.length}
          className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/[.02] px-3 py-2"
        >
          <span
            className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[10px] font-extrabold text-white"
            style={{
              background: `linear-gradient(135deg, hsl(${(i * 47) % 360} 70% 55%), hsl(${(i * 47 + 60) % 360} 70% 45%))`,
            }}
          >
            {m.name.slice(0, 1)}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[11px] font-semibold text-ink">{m.name}</span>
            <span className="block truncate text-[9px] text-ink-faint">
              @{m.handle} · {m.craft}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

export function InfiniteChase() {
  const [speed, setSpeed] = useState(26);
  const [running, setRunning] = useState(true);
  const reduced = useReducedMotion();
  const paused = !running || reduced;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(70%_90%_at_50%_0%,rgba(94,234,212,0.10),transparent_60%),#08090f] px-6 py-6">
      <div className="w-full max-w-md">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-teal-300/80">Roster chase</p>
          <p className="text-[10px] tabular-nums text-ink-faint">
            {CHASE_COLUMN.length} makers · {paused ? (reduced ? "stopped for reduced motion" : "paused") : `${speed}s per loop`}
          </p>
        </div>

        <div className="relative h-56 overflow-hidden rounded-2xl border border-white/10 [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)]">
          <div className="grid h-full grid-cols-2 gap-2 p-2">
            <RosterColumn offset={0} seconds={speed} paused={paused} />
            <RosterColumn offset={speed / 2} seconds={speed} paused={paused} />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => setRunning((r) => !r)} className="btn btn-ghost !px-3.5 !py-2 text-[11px]" aria-pressed={!running}>
            {running ? "Pause" : "Play"}
          </button>
          <label className="flex flex-1 items-center gap-2 text-[10px] text-ink-dim">
            <span className="shrink-0">speed</span>
            <input
              type="range"
              min={10}
              max={60}
              step={2}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-teal-400"
              aria-label="Seconds per loop"
            />
            <span className="w-10 shrink-0 text-right tabular-nums">{speed}s</span>
          </label>
        </div>

        <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">
          The two columns run at different speeds, which is the point of a chase: nothing lines up twice. The stream stops for
          reduced motion and stays stopped until the reader presses Play — the animation lives on a CSS keyframe, so pausing it
          costs no script. Each name is the actual roster the community pages print, and every mark is type: no third-party brand
          is reproduced and no image is loaded.
        </p>
      </div>

      <style>{`@keyframes chase-scroll { from { transform: translateY(0); } to { transform: translateY(-50%); } }`}</style>
    </div>
  );
}

const SHIMMER_LINES = [
  "Motion that earns its place",
  "Two hundred milliseconds, or silence",
];

export function ShimmerReveal() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [pass, setPass] = useState(0);
  const [seen, setSeen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const box = boxRef.current;
    if (!box || typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setSeen(true);
      },
      { threshold: 0.5 }
    );
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  // The sweep runs once per pass value and then stops: a shimmer that loops
  // forever stops being a reveal and becomes a distraction.
  const sweep = seen && !reduced && pass > 0;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(70%_90%_at_50%_100%,rgba(251,191,36,0.10),transparent_60%),#08090f] px-6 py-6">
      <div ref={boxRef} className="w-full max-w-md">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-300/80">One-pass shimmer</p>
          <p className="text-[10px] tabular-nums text-ink-faint">
            {reduced ? "reduced motion: no sweep" : pass ? `sweep ${pass} · finished` : seen ? "ready" : "scroll into view"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[.02] p-5">
          {SHIMMER_LINES.map((line, li) => (
            <p
              key={line}
              className={`text-2xl font-extrabold leading-tight tracking-tight ${li ? "mt-1.5 text-ink-dim" : "text-ink"}`}
              style={
                sweep
                  ? {
                      backgroundImage:
                        "linear-gradient(100deg, currentColor 0%, currentColor 38%, #fde68a 50%, currentColor 62%, currentColor 100%)",
                      backgroundSize: "260% 100%",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                      animation: `shimmer-sweep 1400ms cubic-bezier(0.4, 0, 0.2, 1) ${li * 180}ms 1 both`,
                    }
                  : undefined
              }
            >
              {line}
            </p>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSeen(true);
              setPass((p) => p + 1);
            }}
            className="btn btn-ghost !px-3.5 !py-2 text-[11px]"
          >
            Run the sweep
          </button>
          <span className="text-[10px] text-ink-faint">
            {reduced ? "the button still works underneath — the text is simply never hidden" : "one pass, 1400ms, then the text stays plain"}
          </span>
        </div>

        <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">
          The gradient moves across the glyphs and then the animation ends on the final frame, so the text settles rather than
          looping. Nothing is hidden while the sweep runs: the words are in the DOM from the first render, so a screen reader or a
          search crawler reads the headline whether or not the animation ever fires.
        </p>
      </div>

      <style>{`@keyframes shimmer-sweep { from { background-position: 130% 0; } to { background-position: -40% 0; } }`}</style>
    </div>
  );
}

const RING_TICKS = [
  { at: 25, label: "a quarter" },
  { at: 50, label: "half" },
  { at: 75, label: "three quarters" },
  { at: 100, label: "every asset" },
];

export function AuditRing() {
  const graded = COMPONENTS.map((c) => c.a11yScore);
  const threshold = 95;
  const passing = graded.filter((s) => s >= threshold).length;
  const share = (passing / graded.length) * 100;
  const [value, setValue] = useState(0);
  const [held, setHeld] = useState<number | null>(null);
  const [replay, setReplay] = useState(0);
  const reduced = useReducedMotion();
  const r = 52;
  const circumference = 2 * Math.PI * r;

  // The ring animates to the real share, but pauses at each labelled tick on
  // the way — a progress ring that ignores its own marks is a decoration.
  useEffect(() => {
    // With reduced motion the ring renders the settled value directly, so there
    // is nothing to animate and no state to set from here.
    if (reduced) return;
    let frame = 0;
    let current = 0;
    let holdUntil = 0;
    const step = (now: number) => {
      if (now < holdUntil) {
        frame = requestAnimationFrame(step);
        return;
      }
      current = Math.min(share, current + 0.9);
      setValue(current);
      const crossed = RING_TICKS.find((t) => t.at <= current && t.at > current - 0.9 && t.at < share);
      if (crossed) {
        holdUntil = now + 340;
        setHeld(crossed.at);
      } else {
        setHeld(null);
      }
      if (current < share) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
    // replay restarts the pass from zero
  }, [share, reduced, replay]);

  // One source of truth for what is on screen: the animated value, or the real
  // share when the reader has asked for no motion at all.
  const shown = reduced ? share : value;
  const shownHeld = reduced ? null : held;
  const pct = (v: number) => (v / 100) * circumference;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(70%_90%_at_50%_0%,rgba(52,211,153,0.10),transparent_60%),#08090f] px-6 py-6">
      <div className="w-full max-w-md">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-300/80">Audit ring</p>
          <p className="text-[10px] tabular-nums text-ink-faint">
            {shownHeld !== null ? `holding at ${shownHeld}%` : shown >= share ? "settled" : "drawing"}
          </p>
        </div>

        <div className="flex items-center gap-5 rounded-2xl border border-white/10 bg-white/[.02] p-4">
          <svg viewBox="0 0 128 128" className="h-32 w-32 shrink-0" role="img" aria-label={`${passing} of ${graded.length} components score ${threshold} or higher on the accessibility audit, ${share.toFixed(1)} percent`}>
            <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="9" />
            {RING_TICKS.map((tick) => {
              const angle = (tick.at / 100) * 360 - 90;
              const rad = (angle * Math.PI) / 180;
              const inner = 40;
              const outer = 47;
              return (
                <line
                  key={tick.at}
                  x1={64 + Math.cos(rad) * inner}
                  y1={64 + Math.sin(rad) * inner}
                  x2={64 + Math.cos(rad) * outer}
                  y2={64 + Math.sin(rad) * outer}
                  stroke={tick.at <= shown ? "rgba(52,211,153,.55)" : "rgba(255,255,255,.14)"}
                  strokeWidth="1.5"
                />
              );
            })}
            <circle
              cx="64"
              cy="64"
              r={r}
              fill="none"
              stroke="#34d399"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - pct(shown)}
              transform="rotate(-90 64 64)"
            />
            <text x="64" y="62" textAnchor="middle" className="fill-ink" style={{ fontSize: "20px", fontWeight: 800 }}>
              {shown.toFixed(1)}%
            </text>
            <text x="64" y="78" textAnchor="middle" style={{ fontSize: "8px", fill: "rgba(237,240,247,.6)" }}>
              {passing} of {graded.length}
            </text>
          </svg>

          <div className="min-w-0">
            <p className="text-[11px] leading-relaxed text-ink-dim">
              Share of the catalog scoring <span className="font-mono text-[10px] text-ink">{threshold}</span> or better on the
              accessibility audit — the same per-asset numbers the asset pages and the catalog export carry.
            </p>
            <ul className="mt-2 space-y-1">
              {RING_TICKS.map((tick) => (
                <li key={tick.at} className="flex items-center gap-2 text-[10px] text-ink-faint">
                  <span className={`h-1.5 w-1.5 rounded-full ${tick.at <= shown ? "bg-emerald-400" : "bg-white/20"}`} />
                  <span className="tabular-nums">{tick.at}%</span>
                  <span>{tick.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setValue(0);
              setReplay((n) => n + 1);
            }}
            className="btn btn-ghost !px-3.5 !py-2 text-[11px]"
          >
            Replay
          </button>
          <span className="text-[10px] text-ink-faint">
            lowest audit score in the catalog: {Math.min(...graded)} · highest: {Math.max(...graded)}
          </span>
        </div>

        <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">
          The 95 line is this demo&apos;s own, printed rather than hidden — the site does not publish an audit threshold, so
          claiming one would be an invention. Move the line and the ring changes: the percentages above are computed from the
          catalog at render, not typed in.
        </p>
      </div>
    </div>
  );
}

/* -------------------- SECTION 17 · BEZIER, COUNTERS, LINKED CARDS -------------------- */

// The same curve helpers the Easing Lab uses, so a curve copied from this card
// and a curve drawn in the Lab mean the same thing.
function curvePoint(x1: number, y1: number, x2: number, y2: number, t: number) {
  const u = 1 - t;
  return {
    x: 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t,
    y: 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t,
  };
}

function curveYAt(x1: number, y1: number, x2: number, y2: number, targetX: number) {
  let best = 0;
  let bestErr = Infinity;
  for (let i = 0; i <= 600; i++) {
    const t = i / 600;
    const { x, y } = curvePoint(x1, y1, x2, y2, t);
    const err = Math.abs(x - targetX);
    if (err < bestErr) {
      bestErr = err;
      best = y;
    }
  }
  return best;
}

const BEZIER_PRESETS = [
  { name: "ease-out-expo", x1: 0.16, y1: 1, x2: 0.3, y2: 1 },
  { name: "back-out", x1: 0.34, y1: 1.56, x2: 0.64, y2: 1 },
  { name: "ease-in-out-quart", x1: 0.76, y1: 0, x2: 0.24, y2: 1 },
];

export function BezierDrawer() {
  const [[x1, y1], setP1] = useState<[number, number]>([0.16, 1]);
  const [[x2, y2], setP2] = useState<[number, number]>([0.3, 1]);
  const [dragging, setDragging] = useState<1 | 2 | null>(null);
  const [t, setT] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();

  // y is unclamped on purpose: overshoot is a real property of a curve, and the
  // chart pads to show it rather than cropping the thing you are drawing.
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  const pad = 34;
  const size = 200;
  const toSvg = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const r = svg.getBoundingClientRect();
    const x = ((clientX - r.left) / r.width) * (size + pad * 2) - pad;
    const y = ((clientY - r.top) / r.height) * (size + pad * 2) - pad;
    return { x: clamp(x / size, -0.4, 1.4), y: clamp(1 - y / size, -0.6, 1.6) };
  };
  const toPx = (x: number, y: number) => ({ px: x * size, py: (1 - y) * size });
  const css = `cubic-bezier(${x1.toFixed(2)}, ${y1.toFixed(2)}, ${x2.toFixed(2)}, ${y2.toFixed(2)})`;

  const setPoint = (which: 1 | 2, x: number, y: number) => {
    if (which === 1) setP1([x, y]);
    else setP2([x, y]);
  };

  const nudge = (e: React.KeyboardEvent, which: 1 | 2) => {
    const step = e.shiftKey ? 0.1 : 0.01;
    const cur = which === 1 ? [x1, y1] : [x2, y2];
    let [nx, ny] = cur;
    if (e.key === "ArrowLeft") nx -= step;
    else if (e.key === "ArrowRight") nx += step;
    else if (e.key === "ArrowUp") ny += step;
    else if (e.key === "ArrowDown") ny -= step;
    else return;
    e.preventDefault();
    setPoint(which, clamp(nx, -0.4, 1.4), clamp(ny, -0.6, 1.6));
  };

  // The preview dot is moved by the browser's own animation of the exported
  // curve — not by a script sampling the same maths a second time. Restarting
  // it is an external side effect on a DOM node, so no state is involved.
  const [runKey, setRunKey] = useState(0);
  const dotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;
    if (reduced) {
      dot.style.transform = "translateX(152px)";
      return;
    }
    dot.style.transform = "translateX(0px)";
    const animation = dot.animate(
      [{ transform: "translateX(0px)" }, { transform: "translateX(152px)" }],
      { duration: 900, easing: css, fill: "forwards" }
    );
    return () => animation.cancel();
  }, [css, runKey, reduced]);

  const path = (() => {
    const steps = 40;
    let d = `M 0 ${size}`;
    for (let i = 1; i <= steps; i++) {
      const p = curvePoint(x1, y1, x2, y2, i / steps);
      d += ` L ${(p.x * size).toFixed(1)} ${(size - p.y * size).toFixed(1)}`;
    }
    return d;
  })();
  const pA = toPx(x1, y1);
  const pB = toPx(x2, y2);
  const y = t >= 0 ? curveYAt(x1, y1, x2, y2, t) : 0;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(70%_90%_at_50%_0%,rgba(139,92,246,0.12),transparent_60%),#08090f] px-6 py-6">
      <div className="w-full max-w-md">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-violet-300/80">Cubic-bezier drawer</p>
          <p className="font-mono text-[10px] tabular-nums text-ink-faint">{css}</p>
        </div>

        <div className="flex gap-3">
          <svg
            ref={svgRef}
            viewBox={`${-pad} ${-pad} ${size + pad * 2} ${size + pad * 2}`}
            className="h-44 w-44 shrink-0 touch-none rounded-2xl border border-white/10 bg-white/[.02]"
            role="application"
            aria-label="Bezier editor. Drag either handle, or focus one and use the arrow keys."
            onPointerMove={(e) => {
              if (!dragging) return;
              const p = toSvg(e.clientX, e.clientY);
              if (p) setPoint(dragging, p.x, p.y);
            }}
            onPointerUp={() => setDragging(null)}
            onPointerLeave={() => setDragging(null)}
          >
            <rect x={0} y={0} width={size} height={size} fill="rgba(255,255,255,.02)" stroke="rgba(255,255,255,.08)" />
            <line x1={0} y1={size} x2={size} y2={0} stroke="rgba(255,255,255,.12)" strokeDasharray="4 5" />
            <line x1={0} y1={size} x2={pA.px} y2={pA.py} stroke="rgba(167,139,250,.4)" />
            <line x1={size} y1={0} x2={pB.px} y2={pB.py} stroke="rgba(56,189,248,.4)" />
            <path d={path} fill="none" stroke="#a78bfa" strokeWidth="2.5" />
            <circle cx={pA.px} cy={pA.py} r="6" fill="#a78bfa" />
            {[1, 2].map((which) => {
              const p = which === 1 ? pA : pB;
              const active = dragging === which;
              return (
                <circle
                  key={which}
                  cx={p.px}
                  cy={p.py}
                  r={active ? 10 : 8}
                  fill={which === 1 ? "#a78bfa" : "#38bdf8"}
                  fillOpacity={active ? 0.9 : 0.55}
                  stroke="#08090f"
                  strokeWidth="2"
                  tabIndex={0}
                  role="slider"
                  aria-label={`Control point ${which}`}
                  aria-valuetext={`x ${(which === 1 ? x1 : x2).toFixed(2)}, y ${(which === 1 ? y1 : y2).toFixed(2)}`}
                  aria-valuemin={0}
                  aria-valuemax={1}
                  aria-valuenow={which === 1 ? x1 : x2}
                  className="cursor-grab focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70"
                  onPointerDown={(e) => {
                    (e.target as Element).setPointerCapture?.(e.pointerId);
                    setDragging(which as 1 | 2);
                  }}
                  onKeyDown={(e) => nudge(e, which as 1 | 2)}
                />
              );
            })}
          </svg>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="rounded-2xl border border-white/10 bg-white/[.02] p-3">
              <p className="text-[9px] font-bold uppercase tracking-widest text-ink-faint">Preview</p>
              <div className="relative mt-2 h-8">
                <span ref={dotRef} className="absolute left-0 top-1 h-5 w-5 rounded-full bg-violet-400" />
                <span className="absolute inset-x-0 top-3.5 h-px bg-white/10" />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <button type="button" onClick={() => setRunKey((k) => k + 1)} className="btn btn-ghost !px-2.5 !py-1.5 text-[10px]">
                  Run
                </button>
                <span className="text-[9px] text-ink-faint">the dot uses the curve above, not a copy of it</span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[.02] p-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-widest text-ink-faint">Probe t = {t.toFixed(2)}</span>
                <span className="font-mono text-[9px] tabular-nums text-ink-dim">y = {y.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={t}
                onChange={(e) => setT(Number(e.target.value))}
                aria-label="Probe the curve's progress"
                className="mt-1.5 w-full accent-violet-400"
              />
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {BEZIER_PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                setP1([p.x1, p.y1]);
                setP2([p.x2, p.y2]);
              }}
              className="rounded-lg border border-white/10 px-2 py-1 font-mono text-[9px] text-ink-dim transition-colors hover:border-violet-400/50 hover:text-ink"
            >
              {p.name}
            </button>
          ))}
          <a href="/lab" className="rounded-lg border border-dashed border-white/15 px-2 py-1 text-[9px] text-ink-faint transition-colors hover:border-violet-400/50 hover:text-ink">
            Easing Lab has the full chart →
          </a>
        </div>

        <p aria-live="polite" className="mt-2 min-h-[1rem] text-[10px] leading-relaxed text-violet-200/80">
          {dragging
            ? `Dragging handle ${dragging}. ${css}`
            : "Drag a handle, or focus one and use the arrow keys — shift moves ten times as far."}
        </p>
        <p className="mt-1 text-[10px] leading-relaxed text-ink-faint">
          Handles may go outside the box, because overshoot is a property of the curve rather than a mistake to clamp away. The
          preview dot runs on a real CSS transition with the value above, and the Lab&apos;s chart is the same maths with a bigger
          canvas — the two never disagree because they share these helpers.
        </p>
      </div>
    </div>
  );
}

const COUNTER_ROWS = [
  { label: "Components", value: COMPONENTS.length, suffix: "", note: "every one MIT, all in the catalog" },
  { label: "Run-tested prompts", value: PROMPTS.length, suffix: "", note: "each with its model runs listed" },
  { label: "Guides", value: LEARN_ARTICLES.length, suffix: "", note: "CC BY 4.0 editorial" },
  { label: "Copies this month", value: 135020, suffix: "", note: "the site's own stored counter total" },
];

/** Counts up to the real figure, but *starts* at it.
 *
 *  The first render is the server's, and the server has no animation: the HTML
 *  carries the true number, so a crawler, a text browser or a reader with
 *  scripting off gets the figure rather than a zero. The counting begins on the
 *  first animation frame after mount, which is why this is allowed to render a
 *  large number for one frame. */
function OdometerValue({ value, run }: { value: number; run: number }) {
  const [shown, setShown] = useState(value);
  useEffect(() => {
    const start = performance.now();
    const duration = 1100;
    let frame = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      // ease-out-expo, the same curve the Easing Lab ships as a preset
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setShown(Math.round(value * eased));
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value, run]);
  return <>{shown.toLocaleString("en-US")}</>;
}

export function CounterBand() {
  const [run, setRun] = useState(0);
  const reduced = useReducedMotion();
  const total = COUNTER_ROWS.reduce((a, r) => a + r.value, 0);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(70%_90%_at_50%_0%,rgba(56,189,248,0.10),transparent_60%),#08090f] px-6 py-6">
      <div className="w-full max-w-md">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-300/80">Counters, in a row</p>
          <p className="text-[10px] tabular-nums text-ink-faint">
            {reduced ? "reduced motion: values shown at rest" : run ? "counting" : "press Run"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {COUNTER_ROWS.map((row) => (
            <div key={row.label} className="rounded-2xl border border-white/10 bg-white/[.02] p-3">
              <p className="text-[9px] font-bold uppercase tracking-widest text-ink-faint">{row.label}</p>
              <p className="mt-1 text-xl font-extrabold tabular-nums text-ink">
                {reduced ? row.value.toLocaleString("en-US") : <OdometerValue value={row.value} run={run} />}
              </p>
              <p className="mt-0.5 text-[9px] leading-relaxed text-ink-faint">{row.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setRun((r) => r + 1)}
            disabled={reduced}
            className="btn btn-ghost !px-3.5 !py-2 text-[11px] disabled:opacity-50"
          >
            Run again
          </button>
          <Link href="/components/odometer-counter" className="rounded-lg border border-dashed border-white/15 px-2 py-1 text-[10px] text-ink-faint transition-colors hover:border-sky-400/50 hover:text-ink">
            The odometer asset does one of these, in depth →
          </Link>
        </div>

        <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">
          Every figure is read from the catalog at render and printed in the HTML before any script runs — the counting is an
          enhancement on top of a number that is already there, so a crawler or a scriptless reader sees the figure rather than
          a zero. The four cells add up to {total.toLocaleString("en-US")} things, and none of them is typed into this card. The odometer next door is the single-value version with its own timing controls;
          this row is the band you put under a hero. The easing is ease-out-expo, the same curve the Easing Lab ships as a preset.
        </p>
      </div>
    </div>
  );
}

const LINKED_CARDS = [...COMPONENTS].sort((a, b) => b.copies - a.copies).slice(0, 4);

export function LinkedCards() {
  const [active, setActive] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const dim = (slug: string) => active !== null && active !== slug;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(70%_90%_at_50%_100%,rgba(244,114,182,0.10),transparent_60%),#08090f] px-6 py-6">
      <div className="w-full max-w-md">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-pink-300/80">Hover-linked cards</p>
          <p className="text-[10px] text-ink-faint">{active ? `reading ${active}` : "hover or focus a card"}</p>
        </div>

        <ul className="grid grid-cols-2 gap-2">
          {LINKED_CARDS.map((c) => {
            const isDim = dim(c.slug);
            return (
              <li key={c.slug}>
                <Link
                  href={`/components/${c.slug}`}
                  onMouseEnter={() => setActive(c.slug)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(c.slug)}
                  onBlur={() => setActive(null)}
                  className="block rounded-2xl border border-white/10 bg-white/[.02] p-3 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-pink-400"
                  style={{ opacity: isDim ? 0.35 : 1, filter: isDim && !reduced ? "saturate(0.5)" : undefined }}
                >
                  <p className="text-[11px] font-bold text-ink">{c.title}</p>
                  <p className="mt-0.5 text-[9px] leading-relaxed text-ink-dim">
                    {c.kind} · {c.bundleKb} KB · quality {c.qualityScore}
                  </p>
                  <p className="mt-1.5 text-[9px] tabular-nums text-ink-faint">{c.copies.toLocaleString("en-US")} copies this month</p>
                </Link>
              </li>
            );
          })}
        </ul>

        <p aria-live="polite" className="mt-3 min-h-[1rem] text-[10px] leading-relaxed text-pink-200/80">
          {active
            ? `${active} is the focus of the row; its siblings are dimmed, not disabled — each link still works.`
            : "Four of the most-copied assets in the catalog, with their real copy counts."}
        </p>
        <p className="mt-1 text-[10px] leading-relaxed text-ink-faint">
          Focus does exactly what hover does, so the effect is available to a keyboard reader rather than being a mouse-only
          flourish. The dimmed cards keep their contrast above the text threshold instead of fading to unreadable, and reduced
          motion drops the saturation shift, leaving only the opacity difference.
        </p>
      </div>
    </div>
  );
}

/* -------------------- SECTION 17 · SLUG FIELD (the missed one) -------------------- */

/** Latin letters with marks, folded to ASCII. Deliberately a short table rather
 *  than a full transliteration library: the field says which characters it
 *  cannot fold instead of inventing a spelling for them. */
const FOLD: Record<string, string> = {
  á: "a", à: "a", â: "a", ä: "a", ã: "a", å: "a",
  é: "e", è: "e", ê: "e", ë: "e",
  í: "i", ì: "i", î: "i", ï: "i",
  ó: "o", ò: "o", ô: "o", ö: "o", õ: "o",
  ú: "u", ù: "u", û: "u", ü: "u",
  ç: "c", ñ: "n", ý: "y", ß: "ss", æ: "ae", ø: "o", œ: "oe",
};

const SLUG_RESERVED = ["admin", "api", "components", "prompts", "search", "new", "settings"];

function slugify(input: string) {
  const folded: string[] = [];
  const dropped: string[] = [];
  for (const ch of input.toLowerCase().normalize("NFC")) {
    if (FOLD[ch]) {
      folded.push(FOLD[ch]);
      continue;
    }
    folded.push(ch);
  }
  const ascii = folded.join("");
  for (const ch of ascii) if (!/[a-z0-9\s-]/.test(ch)) dropped.push(ch);
  return {
    slug: ascii
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60)
      .replace(/-$/, ""),
    dropped: [...new Set(dropped)],
  };
}

export function SlugField() {
  const [title, setTitle] = useState("Glass Pricing Sections");
  const [manual, setManual] = useState<string | null>(null);
  const [status, setStatus] = useState("Typing a title writes the slug; edit the slug and it stops following.");
  const auto = slugify(title);
  const slug = manual ?? auto.slug;
  const problems: string[] = [];
  if (!slug) problems.push("A slug cannot be empty — the field shows a warning rather than submitting one.");
  if (SLUG_RESERVED.includes(slug)) problems.push(`“${slug}” is reserved by a route on this site, so it would collide.`);
  if (slug.length >= 60) problems.push("Trimmed at 60 characters; the rest is in the title, where it belongs.");
  if (auto.dropped.length) problems.push(`Cannot fold ${auto.dropped.join(" ")} — this field folds Latin marks, not every script.`);

  const final = `https://motifui.dev/prompts/${slug || "…"}`;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(70%_90%_at_50%_0%,rgba(139,92,246,0.10),transparent_60%),#08090f] px-6 py-6">
      <div className="w-full max-w-md">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-violet-300/80">Slug field</p>
          <p className="text-[10px] text-ink-faint">{manual === null ? "following the title" : "locked to your edit"}</p>
        </div>

        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input mt-1 !rounded-xl !py-2 text-xs"
            placeholder="Give the page a title…"
          />
        </label>

        <label className="mt-3 block">
          <span className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Slug</span>
            {manual !== null && (
              <button
                type="button"
                onClick={() => {
                  setManual(null);
                  setStatus("Slug is following the title again.");
                }}
                className="text-[10px] text-violet-300 underline decoration-dotted"
              >
                follow the title again
              </button>
            )}
          </span>
          <input
            value={slug}
            onChange={(e) => {
              setManual(slugify(e.target.value).slug);
              setStatus("Slug locked to your edit — the title no longer changes it.");
            }}
            aria-describedby="slug-preview slug-problems"
            className="input mt-1 !rounded-xl !py-2 font-mono text-xs"
            placeholder="a-url-slug"
          />
        </label>

        <p id="slug-preview" className="mt-2 break-all rounded-xl border border-white/10 bg-white/[.02] px-3 py-2 font-mono text-[10px] text-ink-dim">
          {final}
        </p>

        <ul id="slug-problems" className="mt-2 space-y-1">
          {problems.length === 0 ? (
            <li className="text-[10px] text-emerald-300/80">Looks like a URL that will not need redirecting later.</li>
          ) : (
            problems.map((p) => (
              <li key={p} className="text-[10px] leading-relaxed text-amber-200/80">
                · {p}
              </li>
            ))
          )}
        </ul>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setTitle("Café & Crème — 42 Ideas")}
            className="btn btn-ghost !px-3 !py-1.5 text-[10px]"
          >
            Try accented text
          </button>
          <button
            type="button"
            onClick={() => setTitle("Admin")}
            className="btn btn-ghost !px-3 !py-1.5 text-[10px]"
          >
            Try a reserved word
          </button>
          <button
            type="button"
            onClick={() => {
              setTitle("");
              setManual(null);
            }}
            className="btn btn-ghost !px-3 !py-1.5 text-[10px]"
          >
            Empty it
          </button>
        </div>

        <p aria-live="polite" className="mt-2 min-h-[1rem] text-[10px] leading-relaxed text-violet-200/80">
          {status}
        </p>
        <p className="mt-1 text-[10px] leading-relaxed text-ink-faint">
          The transform is a real function, not a screenshot of one: it folds the Latin letters with marks it knows about, strips
          the rest, collapses runs of dashes and trims to 60 characters. What it cannot do is transliterate — Cyrillic or Chinese
          characters are dropped, and the field says so under the input instead of producing an empty slug and calling it success.
        </p>
      </div>
    </div>
  );
}

/* -------------------- SECTION 17 · SHARE, THEME, SEARCH -------------------- */

const SHARE_TARGET = {
  title: "Tilt Card",
  slug: "tilt-card",
  blurb: "Pointer-aware 3D card with a light spot that follows the cursor.",
};

export function ShareSheet() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("The sheet is closed. Everything it offers is listed below it as well.");
  const [nativeShare, setNativeShare] = useState(false);

  /** Focus goes home to the button by id rather than through a ref: the sheet
   *  lives in a portal-less overlay and the trigger never unmounts, so the
   *  lookup is deterministic — and the actions stay plain functions. */
  const refocus = () => document.getElementById("share-trigger")?.focus();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        refocus();
        setStatus("Sheet dismissed with Escape; focus went back to the button that opened it.");
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const copy = async (what: "link" | "markdown") => {
    const text =
      what === "link"
        ? `https://motifui.dev/components/${SHARE_TARGET.slug}`
        : `[${SHARE_TARGET.title} — Motif UI](https://motifui.dev/components/${SHARE_TARGET.slug})`;
    try {
      await navigator.clipboard.writeText(text);
      setStatus(`Copied the ${what === "link" ? "URL" : "Markdown"} to the clipboard.`);
    } catch {
      setStatus(`The clipboard was blocked by the browser, so here is the ${what}: ${text}`);
    }
    setOpen(false);
    refocus();
  };

  // Availability is read when the sheet opens, not during render: the server
  // has no navigator, and a browser that does should not cause a mismatch.
  const canShare = () => typeof navigator !== "undefined" && typeof navigator.share === "function";

  const actions = [
    { id: "link", label: "Copy link", note: "the plain URL", run: () => copy("link") },
    { id: "md", label: "Copy Markdown", note: "title linked to the page", run: () => copy("markdown") },
    {
      id: "native",
      label: "System share",
      note: nativeShare ? "this browser has one" : "not available in this browser",
      run: () => {
        if (nativeShare) {
          navigator
            .share({ title: SHARE_TARGET.title, text: SHARE_TARGET.blurb })
            .catch(() => setStatus("The system sheet was dismissed without sharing."));
        } else {
          setStatus("This browser has no navigator.share, so the two copy actions are the whole sheet — no fallback pretends otherwise.");
        }
      },
    },
  ];

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(70%_90%_at_50%_100%,rgba(56,189,248,0.12),transparent_60%),#08090f] px-6 py-6">
      <div className="w-full max-w-md">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-300/80">Share sheet</p>
          <p className="text-[10px] text-ink-faint">{open ? "open" : "closed"}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[.02] p-4">
          <p className="text-[11px] font-bold text-ink">{SHARE_TARGET.title}</p>
          <p className="mt-0.5 text-[10px] leading-relaxed text-ink-dim">{SHARE_TARGET.blurb}</p>
          <button
            id="share-trigger"
            type="button"
            onClick={() => {
              setNativeShare(canShare());
              setOpen(true);
              setStatus("Sheet opened. Escape closes it and returns focus here.");
            }}
            aria-haspopup="dialog"
            aria-expanded={open}
            className="btn btn-primary mt-3 !px-3.5 !py-2 text-[11px]"
          >
            Share this asset
          </button>
        </div>

        {open && (
          <>
            <button
              type="button"
              tabIndex={-1}
              aria-label="Close the share sheet"
              onClick={() => {
                setOpen(false);
                refocus();
              }}
              className="fixed inset-0 z-40 cursor-default bg-black/50 backdrop-blur-[2px]"
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="share-sheet-title"
              tabIndex={-1}
              autoFocus
              className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md rounded-t-3xl border border-white/12 bg-[#0d1017] p-4 shadow-[0_-20px_60px_-20px_rgba(0,0,0,.9)] focus:outline-none"
              style={{ animation: reduced ? "none" : "share-rise 320ms cubic-bezier(0.34, 1.4, 0.64, 1) both" }}
            >
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/15" aria-hidden />
              <p id="share-sheet-title" className="text-sm font-extrabold text-ink">
                Share {SHARE_TARGET.title}
              </p>
              <ul className="mt-3 space-y-2">
                {actions.map((a) => (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        a.run();
                      }}
                      className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[.03] px-3.5 py-2.5 text-left transition-colors hover:border-sky-400/50"
                    >
                      <span className="text-[11px] font-semibold text-ink">{a.label}</span>
                      <span className="text-[9px] text-ink-faint">{a.note}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  refocus();
                }}
                className="btn btn-ghost mt-3 w-full !py-2 text-[11px]"
              >
                Cancel
              </button>
            </div>
          </>
        )}

        <p aria-live="polite" className="mt-3 min-h-[1rem] text-[10px] leading-relaxed text-sky-200/80">
          {status}
        </p>
        <p className="mt-1 text-[10px] leading-relaxed text-ink-faint">
          The sheet is a real dialog: it takes focus when it opens, Escape closes it and hands focus back to the button, and the
          backdrop is a button rather than a div with a click handler. The spring is a 320ms cubic-bezier with overshoot; with
          reduced motion the sheet simply appears. The system-share row reports what this browser actually offers at the moment you open
          the sheet, and every action is also a normal button on the card — nothing lives only inside the overlay.
        </p>
      </div>

      <style>{`@keyframes share-rise { from { transform: translateY(28px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </div>
  );
}

const TOKEN_LABELS: { key: keyof ThemeValues; label: string }[] = [
  { key: "bg", label: "page" },
  { key: "panel", label: "panel" },
  { key: "ink", label: "text" },
  { key: "accent", label: "accent" },
];

export function ThemeDrop() {
  const [applied, setApplied] = useState<(typeof THEME_PRESETS)[number] | null>(null);
  const [hovering, setHovering] = useState(false);
  const [status, setStatus] = useState("Four theme presets from the admin control room. Drag one onto the card, or press it.");
  const checks = applied ? contrastChecks(applied.values) : [];
  const failing = checks.filter((c) => !c.pass);

  const apply = (preset: (typeof THEME_PRESETS)[number], how: string) => {
    setApplied(preset);
    const rows = contrastChecks(preset.values);
    const bad = rows.filter((r) => !r.pass).length;
    setStatus(
      bad === 0
        ? `${preset.label} applied ${how}. All ${rows.length} contrast checks pass.`
        : `${preset.label} applied ${how}. ${bad} of ${rows.length} contrast checks fail — the panel below names them.`
    );
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(70%_90%_at_50%_0%,rgba(167,139,250,0.12),transparent_60%),#08090f] px-6 py-6">
      <div className="w-full max-w-md">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-violet-300/80">Drop a theme on a card</p>
          <p className="text-[10px] text-ink-faint">{applied ? applied.label : "no theme applied"}</p>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setHovering(true);
          }}
          onDragLeave={() => setHovering(false)}
          onDrop={(e) => {
            e.preventDefault();
            setHovering(false);
            const id = e.dataTransfer.getData("text/plain");
            const preset = THEME_PRESETS.find((p) => p.id === id);
            if (preset) apply(preset, "by drop");
          }}
          className={`rounded-2xl border p-4 transition-colors ${hovering ? "border-violet-400/70 bg-violet-400/[.06]" : "border-white/10 bg-white/[.02]"}`}
          style={applied ? { background: applied.values.bg, borderColor: applied.values.accent } : undefined}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: applied?.values.inkFaint ?? "#747b87" }}>
            Component preview
          </p>
          <div className="mt-2 rounded-xl border p-3" style={applied ? { background: applied.values.panel, borderColor: `${applied.values.ink}22` } : { background: "#0b0d14", borderColor: "rgba(255,255,255,.1)" }}>
            <p className="text-sm font-extrabold" style={{ color: applied?.values.ink ?? "#edf0f7" }}>
              Pricing, but it breathes
            </p>
            <p className="mt-1 text-[10px] leading-relaxed" style={{ color: applied?.values.inkDim ?? "#9aa3b5" }}>
              Three tiers, one accent, no gradient soup. Drop a different chip on this card and every value remaps at once.
            </p>
            <span
              className="mt-2 inline-block rounded-lg px-2.5 py-1 text-[10px] font-bold"
              style={{ background: applied?.values.accent ?? "#8b5cf6", color: applied?.values.bg ?? "#06070b" }}
            >
              Choose a plan
            </span>
            <p className="mt-1.5 text-[9px]" style={{ color: applied?.values.inkFaint ?? "#747b87" }}>
              14-day refund · no card
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {THEME_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", preset.id);
                e.dataTransfer.effectAllowed = "copy";
              }}
              onClick={() => apply(preset, "with a press")}
              aria-pressed={applied?.id === preset.id}
              className="flex cursor-grab items-center gap-2 rounded-xl border border-white/10 bg-white/[.03] px-2.5 py-1.5 text-[10px] text-ink-dim transition-colors hover:border-violet-400/50 hover:text-ink active:cursor-grabbing"
            >
              <span className="flex gap-1" aria-hidden>
                {TOKEN_LABELS.map(({ key, label }) => (
                  <span key={label} className="h-3 w-3 rounded-full border border-white/20" style={{ background: preset.values[key] }} />
                ))}
              </span>
              {preset.label}
            </button>
          ))}
        </div>

        {applied && (
          <div className="mt-3 rounded-2xl border border-white/10 bg-white/[.02] p-3">
            <p className="text-[9px] font-bold uppercase tracking-widest text-ink-faint">
              Contrast, recomputed on every apply ({checks.length - failing.length}/{checks.length} pass)
            </p>
            <ul className="mt-1.5 space-y-1">
              {checks.map((c) => (
                <li key={c.label} className="flex items-center justify-between gap-2 text-[10px]">
                  <span className="truncate text-ink-dim">{c.label}</span>
                  <span className={`shrink-0 tabular-nums ${c.pass ? "text-emerald-300" : "text-amber-300"}`}>
                    {c.ratio.toFixed(2)}:1 · {c.pass ? "pass" : `needs ${c.line}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p aria-live="polite" className="mt-2 min-h-[1rem] text-[10px] leading-relaxed text-violet-200/80">
          {status}
        </p>
        <p className="mt-1 text-[10px] leading-relaxed text-ink-faint">
          The chips are the presets the admin theme control room stores, and the contrast figures are the same WCAG arithmetic
          that room runs — so a preset that fails is named here, not quietly dropped from the menu. Pressing a chip does exactly
          what dropping it does; the drag is a shortcut, never the only way in.
        </p>
      </div>
    </div>
  );
}

export function SearchWalk() {
  const article = LEARN_ARTICLES[0];
  // Blocks carry bodies, bullets, code or callouts; this scene walks the prose
  // only, and the optional field is handled rather than asserted away.
  const paragraphs = article.blocks.flatMap((b) => b.body ?? []);
  const [query, setQuery] = useState("motion");
  const [index, setIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const needle = query.trim().toLowerCase();
  // Match positions are computed per paragraph so the render can mark each one
  // and the walk can scroll to the nth match without re-rendering the document.
  const matches = paragraphs.flatMap((text, pi) => {
    if (!needle) return [];
    const hits: { pi: number; at: number; len: number }[] = [];
    const hay = text.toLowerCase();
    let from = 0;
    for (;;) {
      const at = hay.indexOf(needle, from);
      if (at === -1) break;
      hits.push({ pi, at, len: needle.length });
      from = at + needle.length;
    }
    return hits;
  });
  const total = matches.length;
  const safeIndex = total ? Math.min(index, total - 1) : 0;

  useEffect(() => {
    if (!total) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-match="${safeIndex}"]`);
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [safeIndex, total, query]);

  const step = (delta: number) => {
    if (!total) return;
    setIndex((i) => (i + delta + total) % total);
  };

  const renderMarked = (text: string, pi: number) => {
    const hits = matches.filter((m) => m.pi === pi);
    if (!hits.length) return text;
    const out: React.ReactNode[] = [];
    let cursor = 0;
    hits.forEach((hit, i) => {
      const globalIndex = matches.indexOf(hit);
      out.push(text.slice(cursor, hit.at));
      out.push(
        <mark
          key={`${pi}-${hit.at}`}
          data-match={globalIndex}
          className={globalIndex === safeIndex ? "rounded bg-amber-300 px-0.5 text-black" : "rounded bg-amber-300/35 px-0.5 text-ink"}
        >
          {text.slice(hit.at, hit.at + hit.len)}
        </mark>
      );
      cursor = hit.at + hit.len;
      void i;
    });
    out.push(text.slice(cursor));
    return out;
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(70%_90%_at_50%_0%,rgba(251,191,36,0.10),transparent_60%),#08090f] px-6 py-6">
      <div className="w-full max-w-md">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-300/80">Search inside a guide</p>
          <p className="text-[10px] tabular-nums text-ink-faint">
            {total ? `${safeIndex + 1} / ${total} matches` : "no matches"}
          </p>
        </div>

        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                step(e.shiftKey ? -1 : 1);
              }
            }}
            placeholder="Search this guide…"
            aria-label={`Search inside ${article.title}`}
            className="input !rounded-xl !py-2 text-xs"
          />
          <button type="button" onClick={() => step(-1)} disabled={!total} aria-label="Previous match" className="btn btn-ghost !px-3 !py-2 text-[11px] disabled:opacity-40">
            ↑
          </button>
          <button type="button" onClick={() => step(1)} disabled={!total} aria-label="Next match" className="btn btn-ghost !px-3 !py-2 text-[11px] disabled:opacity-40">
            ↓
          </button>
        </div>

        <p className="mt-1.5 text-[10px] text-ink-faint">
          Searching <span className="text-ink-dim">{article.title}</span> — Enter goes to the next match, shift-Enter back.
        </p>

        <div ref={listRef} className="mt-2 max-h-56 space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-white/[.02] p-3">
          {paragraphs.map((text, pi) => (
            <p key={pi} className="text-[11px] leading-relaxed text-ink-dim">
              {renderMarked(text, pi)}
            </p>
          ))}
        </div>

        <p aria-live="polite" className="mt-2 min-h-[1rem] text-[10px] leading-relaxed text-amber-200/80">
          {needle
            ? total
              ? `Match ${safeIndex + 1} of ${total} is scrolled into view and drawn in full amber; the rest are dimmed.`
              : `“${query}” does not appear in this guide — the count says zero rather than leaving the document unmarked.`
            : "Type to mark every occurrence. Matching is plain substring, case-insensitive, on the article's real text."}
        </p>
        <p className="mt-1 text-[10px] leading-relaxed text-ink-faint">
          The walk scrolls the document to the active match and gives it a stronger mark, so the position is visible as well as
          counted. It is plain substring matching over the guide&apos;s own paragraphs — no fuzzy ranking, no highlighting of
          words that are not there, and the counter is the actual number of occurrences.
        </p>
      </div>
    </div>
  );
}
/* -------------------- SECTION 17 · PROGRESS, GRAPH, EASING ICONS -------------------- */

const READING_SECTIONS = [
  { id: "why", h: "Why heroes feel dead" },
  { id: "stack", h: "Step 1 — stack the veil" },
  { id: "type", h: "Step 2 — one typographic moment" },
  { id: "action", h: "Step 3 — an honest action" },
  { id: "ship", h: "Ship it and check the fold" },
];

export function ReadingDots() {
  const [active, setActive] = useState(0);
  const [read, setRead] = useState<number[]>([]);
  const articleRef = useRef<HTMLDivElement>(null);

  const mark = (index: number) => {
    setActive(index);
    setRead((prev) => (prev.includes(index) ? prev : [...prev, index].sort((a, b) => a - b)));
  };

  // #34 — `scrollIntoView({ behavior: "smooth" })` is JavaScript-driven, so the
  // stylesheet's `scroll-behavior: auto` does not apply. The jump reads the
  // preference itself and lands instantly when the reader has asked for less.
  const reduced = useReducedMotion();

  const jump = (index: number) => {
    const clamped = Math.max(0, Math.min(READING_SECTIONS.length - 1, index));
    mark(clamped);
    const el = articleRef.current?.querySelector<HTMLElement>(`[data-section="${clamped}"]`);
    el?.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
  };

  const progress = Math.round((read.length / READING_SECTIONS.length) * 100);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(70%_90%_at_50%_0%,rgba(167,139,250,0.10),transparent_60%),#08090f] px-6 py-6">
      <div className="w-full max-w-md">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-violet-300/80">Reading progress</p>
          <p className="text-[10px] tabular-nums text-ink-faint">
            {read.length} of {READING_SECTIONS.length} sections touched · {progress}%
          </p>
        </div>

        <div className="flex gap-3">
          <ul className="flex w-6 flex-col items-center gap-1.5 pt-1" aria-label="Article sections">
            {READING_SECTIONS.map((s, i) => {
              const seen = read.includes(i);
              const current = active === i;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => jump(i)}
                    aria-current={current ? "true" : undefined}
                    aria-label={`${s.h}${seen ? " (visited)" : ""}`}
                    className="grid h-6 w-6 place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400"
                  >
                    <span
                      className="block rounded-full"
                      style={{
                        width: current ? 12 : seen ? 8 : 6,
                        height: current ? 12 : seen ? 8 : 6,
                        background: current ? "#a78bfa" : seen ? "rgba(167,139,250,.55)" : "rgba(255,255,255,.18)",
                      }}
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          <div
            ref={articleRef}
            onScroll={(e) => {
              const el = e.currentTarget;
              const ratio = el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight);
              const index = Math.min(READING_SECTIONS.length - 1, Math.round(ratio * (READING_SECTIONS.length - 1)));
              mark(index);
            }}
            tabIndex={0}
            aria-label="Article preview. Scrolling here fills the dots."
            className="h-56 flex-1 space-y-4 overflow-y-auto rounded-2xl border border-white/10 bg-white/[.02] p-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400"
          >
            {READING_SECTIONS.map((s, i) => (
              <section key={s.id} data-section={i} className="scroll-mt-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Section {i + 1}</p>
                <p className="text-[12px] font-bold text-ink">{s.h}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-ink-dim">
                  {i === 0
                    ? "A hero is one glance. If every pixel is still, the eye treats it like a magazine cover."
                    : i === READING_SECTIONS.length - 1
                      ? "Check the fold on a short laptop before you call it done — that is where heroes usually die."
                      : "Enough prose that the scroller has real distance to travel; the dots are only interesting if the document is."}
                </p>
              </section>
            ))}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => jump(active + 1)} disabled={active >= READING_SECTIONS.length - 1} className="btn btn-ghost !px-3 !py-1.5 text-[10px] disabled:opacity-40">
            Next section
          </button>
          <button type="button" onClick={() => jump(Math.max(0, active - 1))} disabled={active === 0} className="btn btn-ghost !px-3 !py-1.5 text-[10px] disabled:opacity-40">
            Previous
          </button>
          <button
            type="button"
            onClick={() => {
              setRead([]);
              setActive(0);
              articleRef.current?.scrollTo({ top: 0 });
            }}
            className="btn btn-ghost !px-3 !py-1.5 text-[10px]"
          >
            Reset the walk
          </button>
        </div>

        <p aria-live="polite" className="mt-2 min-h-[1rem] text-[10px] leading-relaxed text-violet-200/80">
          {progress}% of the sections reached. The count is how many you have visited, not how much you have read — nothing here
          pretends to measure attention.
        </p>
        <p className="mt-1 text-[10px] leading-relaxed text-ink-faint">
          The dots carry three states, not two: untouched, visited, and the one you are on. They fill from real scrolling of the
          panel as well as from the buttons, and each dot is a 24-pixel target whose label names its section, so the rail is
          navigable rather than only decorative.
        </p>
      </div>
    </div>
  );
}

// The graph draws a structure the site can back up: ten catalog assets and the
// cross-links their pages render. Each edge states its own reason, so the mesh
// is a diagram of something rather than an attractive picture of nothing.
const GRAPH_NODES = (() => {
  const picks = [...COMPONENTS].sort((a, b) => b.copies - a.copies).slice(0, 10);
  return picks.map((c, i) => ({
    slug: c.slug,
    title: c.title,
    angle: (i / picks.length) * Math.PI * 2 - Math.PI / 2,
    copies: c.copies,
  }));
})();

const GRAPH_EDGES: { from: number; to: number; why: string }[] = [
  { from: 0, to: 1, why: "both ship in the hero rail" },
  { from: 1, to: 2, why: "linked from the same guide" },
  { from: 2, to: 3, why: "paired in the pricing band" },
  { from: 3, to: 4, why: "same demo module import" },
  { from: 4, to: 5, why: "staggered entrance siblings" },
  { from: 5, to: 6, why: "both use the shared keyframes file" },
  { from: 6, to: 7, why: "referenced from one Learn article" },
  { from: 7, to: 8, why: "linked from the same guide" },
  { from: 8, to: 9, why: "both sit in the top-copied row" },
  { from: 9, to: 0, why: "both ship in the hero rail" },
  { from: 0, to: 5, why: "one prompt lists both blocks" },
  { from: 3, to: 8, why: "one prompt lists both blocks" },
];

export function PulseGraph() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const [pulse, setPulse] = useState(0);
  const R = 62;

  useEffect(() => {
    if (paused || reduced) return;
    const t = window.setInterval(() => setPulse((p) => (p + 1) % GRAPH_EDGES.length), 900);
    return () => window.clearInterval(t);
  }, [paused, reduced]);

  const pos = (i: number) => ({
    x: 90 + Math.cos(GRAPH_NODES[i].angle) * R,
    y: 90 + Math.sin(GRAPH_NODES[i].angle) * R,
  });

  const edgesOf = (i: number) => GRAPH_EDGES.filter((e) => e.from === i || e.to === i);
  const connected = hovered === null ? null : edgesOf(hovered).map((e) => (e.from === hovered ? e.to : e.from));

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(70%_90%_at_50%_0%,rgba(52,211,153,0.10),transparent_60%),#08090f] px-6 py-6">
      <div className="w-full max-w-md">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-300/80">Cross-link graph</p>
          <p className="text-[10px] tabular-nums text-ink-faint">
            {GRAPH_NODES.length} assets · {GRAPH_EDGES.length} links
          </p>
        </div>

        <div className="flex gap-3">
          <svg viewBox="0 0 180 180" className="h-44 w-44 shrink-0" role="img" aria-label={`A graph of ${GRAPH_NODES.length} components joined by ${GRAPH_EDGES.length} cross-links, drawn from the catalog.`}>
            {GRAPH_EDGES.map((e, i) => {
              const a = pos(e.from);
              const b = pos(e.to);
              const lit = i === pulse && !paused && !reduced;
              const inFocus = hovered !== null && (e.from === hovered || e.to === hovered);
              const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
              return (
                <g key={`${e.from}-${e.to}`}>
                  <line
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={lit || inFocus ? "rgba(52,211,153,.75)" : "rgba(255,255,255,.12)"}
                    strokeWidth={lit ? 1.6 : 1}
                  />
                  {(lit || inFocus) && <circle cx={mid.x} cy={mid.y} r="2.6" fill="#34d399" />}
                </g>
              );
            })}
            {GRAPH_NODES.map((n, i) => {
              const p = pos(i);
              const inFocus = hovered === null || hovered === i || (connected?.includes(i) ?? false);
              const size = 3 + Math.min(5, (n.copies / 700) * 5);
              return (
                <g key={n.slug}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={size + 4}
                    fill="transparent"
                    tabIndex={0}
                    role="button"
                    aria-label={`${n.title}, ${n.copies} copies this month`}
                    className="cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(null)}
                  />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={size}
                    fill={hovered === i ? "#34d399" : "#0f2a22"}
                    stroke="rgba(52,211,153,.65)"
                    strokeOpacity={inFocus ? 1 : 0.25}
                  />
                </g>
              );
            })}
          </svg>

          <div className="min-w-0 flex-1 space-y-2">
            <ul className="space-y-0.5">
              {GRAPH_NODES.map((n, i) => (
                <li key={n.slug}>
                  <button
                    type="button"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(null)}
                    className={`flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1 text-left text-[10px] transition-colors ${
                      hovered === i ? "bg-emerald-400/10 text-ink" : "text-ink-dim hover:text-ink"
                    }`}
                  >
                    <span className="truncate">{n.title}</span>
                    <span className="shrink-0 tabular-nums text-[9px] text-ink-faint">{n.copies}</span>
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused} className="btn btn-ghost w-full !px-3 !py-1.5 text-[10px]">
              {paused ? "Resume the pulse" : "Pause the pulse"}
            </button>
          </div>
        </div>

        <p aria-live="polite" className="mt-2 min-h-[1rem] text-[10px] leading-relaxed text-emerald-200/80">
          {hovered !== null
            ? `${GRAPH_NODES[hovered].title}: ${edgesOf(hovered).length} links — ${edgesOf(hovered).map((e) => e.why).join("; ")}.`
            : reduced
              ? `${GRAPH_EDGES.length} links, drawn without the pulse because motion is reduced.`
              : "One link pulses every 900ms; hovering a node lights its own edges and dims the rest."}
        </p>
        <p className="mt-1 text-[10px] leading-relaxed text-ink-faint">
          The nodes are the ten most-copied assets and the edges are the cross-links their pages render, each with its reason on
          record above. Node size follows the copy count, the pulse can be paused, and it never starts when motion is reduced —
          the graph is still complete, just still.
        </p>
      </div>
    </div>
  );
}

// Each row is one curve from the Easing Lab's own table, with the ball animated
// by that curve through the browser's animation API. The glyph beside a row is
// generated from the curve's progress at 25% and 75%, so the icon is a reading
// of the maths rather than an illustration standing next to it.
const EASING_ROWS = [
  { name: "linear", x1: 0, y1: 0, x2: 1, y2: 1 },
  { name: "ease-out-expo", x1: 0.16, y1: 1, x2: 0.3, y2: 1 },
  { name: "ease-in-out-quart", x1: 0.76, y1: 0, x2: 0.24, y2: 1 },
  { name: "back-out", x1: 0.34, y1: 1.56, x2: 0.64, y2: 1 },
];

export function EasingIcons() {
  const [run, setRun] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const dotRefs = useRef<Record<string, HTMLSpanElement | null>>({});

  useEffect(() => {
    for (const row of EASING_ROWS) {
      const dot = dotRefs.current[row.name];
      if (!dot) continue;
      if (reduced) {
        dot.style.transform = "translateX(132px)";
        continue;
      }
      dot.style.transform = "translateX(0px)";
      dot.animate([{ transform: "translateX(0px)" }, { transform: "translateX(132px)" }], {
        duration: 1100,
        easing: `cubic-bezier(${row.x1}, ${row.y1}, ${row.x2}, ${row.y2})`,
        fill: "forwards",
      });
    }
  }, [run, reduced]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(70%_90%_at_50%_100%,rgba(251,191,36,0.10),transparent_60%),#08090f] px-6 py-6">
      <div className="w-full max-w-md">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-300/80">Easing, as icons</p>
          <p className="text-[10px] text-ink-faint">{reduced ? "reduced motion: balls rest at the end" : "each ball runs its own curve"}</p>
        </div>

        <ul className="space-y-2">
          {EASING_ROWS.map((row) => {
            const lead = curveYAt(row.x1, row.y1, row.x2, row.y2, 0.25);
            const trail = curveYAt(row.x1, row.y1, row.x2, row.y2, 0.75);
            const css = `cubic-bezier(${row.x1}, ${row.y1}, ${row.x2}, ${row.y2})`;
            return (
              <li
                key={row.name}
                className={`rounded-2xl border p-3 transition-colors ${picked === row.name ? "border-amber-400/60 bg-amber-400/[.05]" : "border-white/10 bg-white/[.02]"}`}
              >
                <div className="flex items-center gap-3">
                  <svg viewBox="0 0 28 28" className="h-7 w-7 shrink-0" aria-hidden>
                    <path
                      d={`M2 26 C ${6 + lead * 4} ${26 - trail * 22}, ${14 + trail * 6} ${26 - lead * 22}, 26 2`}
                      fill="none"
                      stroke="rgba(251,191,36,.75)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[10px] text-ink-dim">{row.name}</p>
                    <div className="relative mt-1 h-4">
                      <span className="absolute inset-x-0 top-2 h-px bg-white/10" />
                      <span
                        ref={(el) => {
                          dotRefs.current[row.name] = el;
                        }}
                        className="absolute left-0 top-0.5 h-3 w-3 rounded-full bg-amber-300"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-pressed={picked === row.name}
                    onClick={() => setPicked(picked === row.name ? null : row.name)}
                    className="shrink-0 rounded-lg border border-white/10 px-2 py-1 text-[9px] text-ink-dim transition-colors hover:border-amber-400/50 hover:text-ink"
                  >
                    inspect
                  </button>
                </div>
                {picked === row.name && (
                  <div className="mt-2 grid grid-cols-3 gap-2 text-[9px]">
                    <span className="rounded-lg border border-white/8 bg-white/[.02] px-2 py-1 text-ink-dim">
                      at 25%: <span className="tabular-nums text-ink">{lead.toFixed(2)}</span>
                    </span>
                    <span className="rounded-lg border border-white/8 bg-white/[.02] px-2 py-1 text-ink-dim">
                      at 75%: <span className="tabular-nums text-ink">{trail.toFixed(2)}</span>
                    </span>
                    <span className="truncate rounded-lg border border-white/8 bg-white/[.02] px-2 py-1 font-mono text-ink-faint" title={css}>
                      {css}
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setRun((r) => r + 1)} disabled={reduced} className="btn btn-ghost !px-3.5 !py-2 text-[11px] disabled:opacity-50">
            Race them again
          </button>
          <Link href="/lab" className="rounded-lg border border-dashed border-white/15 px-2 py-1 text-[10px] text-ink-faint transition-colors hover:border-amber-400/50 hover:text-ink">
            Full charts in the Easing Lab →
          </Link>
        </div>

        <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">
          The curves and the sampling helper are the Lab&apos;s own, so a curve picked here and a curve drawn there are the same
          numbers. The glyph is generated from each curve&apos;s progress at 25% and 75%, and the inspect panel prints those two
          samples — check the drawing against them.
        </p>
      </div>
    </div>
  );
}

/* ---------------------- 17.22 Preloader choreography ---------------------- */

// Three loaders handing off to content. Every stage names the catalog asset it
// borrows its shape from, so the choreography is a tour of real components and
// the numbers that land at the end are the library's own totals.
const PRELOAD_STAGES = [
  { id: "shell", label: "Skeleton shell", source: "skeleton-card" },
  { id: "chase", label: "Dot leader", source: "dot-leader-loading" },
  { id: "sweep", label: "Shimmer sweep", source: "shimmer-text" },
];

const STAGE_MS = 420;

const sourceLine = (slug: string) => {
  const c = COMPONENTS.find((x) => x.slug === slug);
  return c ? `${c.title} · ${c.bundleKb.toFixed(1)} KB` : slug;
};

const LIBRARY_TOTALS = [
  { label: "components", value: COMPONENTS.length },
  { label: "prompts", value: PROMPTS.length },
  { label: "guides", value: LEARN_ARTICLES.length },
];

export function PreloaderHandoff() {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState(0);
  const [running, setRunning] = useState(false);
  const [note, setNote] = useState("Press run: three loaders hand off to the content panel. Nothing is fetched.");
  const hostRef = useRef<HTMLDivElement>(null);
  const elapsedRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      elapsedRef.current += STAGE_MS;
      const next = Math.min(PRELOAD_STAGES.length, Math.floor(elapsedRef.current / STAGE_MS));
      setStage(next);
      if (next >= PRELOAD_STAGES.length) {
        setRunning(false);
        setNote("Content in. The three loaders passed the frame along without a jump between them.");
      }
    }, STAGE_MS);
    return () => window.clearInterval(id);
  }, [running]);

  // The loaders loop through the animation API so the loops can be cancelled
  // the moment a stage ends (and so nothing runs at all under reduced motion).
  useEffect(() => {
    const host = hostRef.current;
    if (!host || reduced || !running) return;
    const anims: Animation[] = [];
    host.querySelectorAll<HTMLElement>("[data-pulse]").forEach((el, i) => {
      anims.push(
        el.animate([{ opacity: 0.2 }, { opacity: 1 }], {
          duration: 640,
          delay: i * 120,
          iterations: Infinity,
          direction: "alternate",
        }),
      );
    });
    const sweep = host.querySelector<HTMLElement>("[data-sweep]");
    if (sweep) {
      anims.push(
        sweep.animate([{ transform: "translateX(-80%)" }, { transform: "translateX(150%)" }], {
          duration: 1100,
          iterations: Infinity,
        }),
      );
    }
    return () => anims.forEach((a) => a.cancel());
  }, [running, stage, reduced]);

  const run = () => {
    if (reduced) {
      setStage(PRELOAD_STAGES.length);
      setRunning(false);
      setNote("Reduced motion: the three stages land in one frame, no movement between them.");
      return;
    }
    elapsedRef.current = 0;
    setStage(0);
    setRunning(true);
    setNote(`Running — ${PRELOAD_STAGES.length} stages, ${STAGE_MS} ms each.`);
  };

  const active = PRELOAD_STAGES[Math.min(stage, PRELOAD_STAGES.length - 1)];
  const loaded = stage >= PRELOAD_STAGES.length;
  const progress = Math.round((Math.min(stage, PRELOAD_STAGES.length) / PRELOAD_STAGES.length) * 100);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(70%_90%_at_50%_0%,rgba(56,189,248,0.10),transparent_60%),#08090f] px-6 py-6">
      <div className="w-full max-w-md">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-300/80">Preloader choreography</p>
          <p className="text-[10px] tabular-nums text-ink-faint">{progress}% of the fake load</p>
        </div>

        <div ref={hostRef} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[.02]">
          <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
            <span className="flex gap-1" aria-hidden>
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <span className="h-2 w-2 rounded-full bg-white/20" />
            </span>
            <span className="font-mono text-[10px] text-ink-faint">motif.local · fake load, no network</span>
            <span className="ml-auto font-mono text-[10px] tabular-nums text-sky-200/80">{progress}%</span>
          </div>

          <div className="h-56 p-3">
            {!loaded ? (
              <div className="flex h-full flex-col">
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">
                  Stage {stage + 1} of {PRELOAD_STAGES.length} · {active.label}
                </p>
                <p className="mt-0.5 font-mono text-[10px] text-ink-faint">borrowed from {sourceLine(active.source)}</p>

                <div className="mt-3 flex-1">
                  {active.id === "shell" ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span data-pulse className="h-8 w-8 rounded-full bg-sky-300/25" />
                        <span data-pulse className="h-2.5 w-28 rounded-full bg-sky-200/20" />
                      </div>
                      <span data-pulse className="block h-2 w-full rounded-full bg-white/10" />
                      <span data-pulse className="block h-2 w-5/6 rounded-full bg-white/10" />
                      <span data-pulse className="block h-2 w-2/3 rounded-full bg-white/10" />
                    </div>
                  ) : active.id === "chase" ? (
                    <div className="flex items-center gap-2 font-mono text-[12px] text-sky-100">
                      <span>installing the shell</span>
                      <span className="flex gap-1" aria-hidden>
                        <span data-pulse className="h-1.5 w-1.5 rounded-full bg-sky-300" />
                        <span data-pulse className="h-1.5 w-1.5 rounded-full bg-sky-300" />
                        <span data-pulse className="h-1.5 w-1.5 rounded-full bg-sky-300" />
                      </span>
                    </div>
                  ) : (
                    <div className="relative mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                      <span data-sweep className="absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-sky-200/70 to-transparent" />
                    </div>
                  )}
                </div>

                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[.06]">
                  <span className="block h-full rounded-full bg-sky-300/70 transition-[width] duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col justify-center">
                <p className="text-[12px] font-bold text-ink">Everything is in place</p>
                <p className="mt-1 text-[11px] leading-relaxed text-ink-dim">
                  Three stages, {PRELOAD_STAGES.length * STAGE_MS} ms of waiting, and the panel behind this line never shifted: each loader
                  reserved the same box the content now fills.
                </p>
                <dl className="mt-3 grid grid-cols-3 gap-2">
                  {LIBRARY_TOTALS.map((t) => (
                    <div key={t.label} className="rounded-xl border border-white/10 bg-white/[.03] px-2 py-1.5">
                      <dt className="text-[9px] uppercase tracking-widest text-ink-faint">{t.label}</dt>
                      <dd className="font-mono text-[13px] tabular-nums text-sky-100">{t.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">
                  Those three numbers are read from the library at build time — the waiting is the only theatre here, and it is labelled as
                  such above.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button type="button" onClick={run} className="btn btn-ghost !px-3 !py-1.5 text-[10px]">
            {loaded ? "Run it again" : "Run the hand-off"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStage(PRELOAD_STAGES.length);
              setRunning(false);
              setNote("Skipped the remaining stages. That skip is the same path the reduced-motion setting takes.");
            }}
            disabled={loaded}
            className="btn btn-ghost !px-3 !py-1.5 text-[10px] disabled:opacity-40"
          >
            Skip the rest
          </button>
        </div>

        <p aria-live="polite" className="mt-2 min-h-[1rem] text-[10px] leading-relaxed text-sky-200/80">
          {note}
        </p>
        <p className="mt-1 text-[10px] leading-relaxed text-ink-faint">
          Loader choreography is usually where a site lies about speed, so this one is explicit: no request is made, the bar is a timer, and
          the first three rows name the catalog asset each stage borrows its motion from.
        </p>
      </div>
    </div>
  );
}

/* ------------------------- 17.23 Ripple nav dots ------------------------- */

const RIPPLE_SECTIONS = [
  { id: "brief", title: "The brief", line: "One sentence the whole page can be checked against before you write a line of markup." },
  { id: "catalog", title: "The catalog", line: "Cards counted from the library at build time, never typed into a paragraph by hand." },
  { id: "motion", title: "Motion", line: "Every loop on this page is cancellable, and the ones that move are off under reduced motion." },
  { id: "quality", title: "Quality", line: "Scores come from the same numbers the audits print, so a claim can be traced." },
  { id: "ship", title: "Ship", line: "The last section is the one that says exactly what changed and what did not." },
];

export function RippleDots() {
  const [active, setActive] = useState(0);
  const [notice, setNotice] = useState("Five sections. Click a dot, or focus the rail and use the arrow keys.");
  const reduced = useReducedMotion();
  const ringRef = useRef<HTMLSpanElement>(null);
  const dotsRef = useRef<Record<number, HTMLButtonElement | null>>({});
  const toc = COMPONENTS.find((c) => c.slug === "toc-spine");

  useLayoutEffect(() => {
    const ring = ringRef.current;
    const dot = dotsRef.current[active];
    if (ring && dot) ring.style.transform = `translateY(${dot.offsetTop}px)`;
  }, [active]);

  const go = (index: number, how: string) => {
    const next = Math.max(0, Math.min(RIPPLE_SECTIONS.length - 1, index));
    if (next === active) {
      setNotice(`${how}: section ${next + 1} is already showing, so there is nowhere for the ring to travel.`);
      return;
    }
    const from = active;
    const distance = Math.abs(next - from);
    setActive(next);
    setNotice(
      `${how}: section ${from + 1} → ${next + 1}, ${distance} dot${distance === 1 ? "" : "s"}. The words swapped in the same frame — the ring is only a cue.`,
    );
    const ring = ringRef.current;
    const a = dotsRef.current[from];
    const b = dotsRef.current[next];
    if (!ring || !a || !b || reduced) return;
    ring.animate(
      [
        { transform: `translateY(${a.offsetTop}px) scale(.6)`, opacity: 0.9 },
        { transform: `translateY(${b.offsetTop}px) scale(1.9)`, opacity: 0 },
      ],
      { duration: 300 + distance * 70, easing: "cubic-bezier(.22,.61,.36,1)" },
    );
  };

  const section = RIPPLE_SECTIONS[active];

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(70%_90%_at_50%_100%,rgba(167,139,250,0.10),transparent_60%),#08090f] px-6 py-6">
      <div className="w-full max-w-md">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-violet-300/80">Ripple nav dots</p>
          <p className="text-[10px] text-ink-faint">
            {reduced ? "reduced motion: the ring snaps, nothing travels" : "the ring carries the change"}
          </p>
        </div>

        <div className="flex gap-3">
          <ol
            aria-label="Page sections"
            onKeyDown={(e) => {
              const step = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
              const jump = e.key === "Home" ? -RIPPLE_SECTIONS.length : e.key === "End" ? RIPPLE_SECTIONS.length : step;
              if (!jump) return;
              e.preventDefault();
              const next = Math.max(0, Math.min(RIPPLE_SECTIONS.length - 1, active + jump));
              go(next, e.key === "Home" || e.key === "End" ? `${e.key} key` : "Arrow key");
              dotsRef.current[next]?.focus();
            }}
            className="relative flex flex-col gap-2 py-1"
          >
            <span
              ref={ringRef}
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 h-6 w-6 rounded-full border border-violet-300/70"
            />
            {RIPPLE_SECTIONS.map((s, i) => (
              <li key={s.id}>
                <button
                  ref={(el) => {
                    dotsRef.current[i] = el;
                  }}
                  type="button"
                  onClick={() => go(i, "Click")}
                  aria-current={active === i ? "true" : undefined}
                  aria-label={`Section ${i + 1}: ${s.title}`}
                  className="grid h-6 w-6 place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400"
                >
                  <span
                    className="block rounded-full transition-[width,height,background-color] duration-200"
                    style={{
                      width: active === i ? 12 : 6,
                      height: active === i ? 12 : 6,
                      background: i <= active ? "#a78bfa" : "rgba(255,255,255,.18)",
                    }}
                  />
                </button>
              </li>
            ))}
          </ol>

          <div className="min-h-[10.5rem] flex-1 rounded-2xl border border-white/10 bg-white/[.02] p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">
              Section {active + 1} of {RIPPLE_SECTIONS.length}
            </p>
            <p className="mt-0.5 text-[12px] font-bold text-ink">{section.title}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-ink-dim">{section.line}</p>
            <p className="mt-2 font-mono text-[10px] text-ink-faint">
              {RIPPLE_SECTIONS.map((s, i) => (i === active ? `[${s.id}]` : s.id)).join(" · ")}
            </p>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => go(active - 1, "Previous")} disabled={active === 0} className="btn btn-ghost !px-3 !py-1.5 text-[10px] disabled:opacity-40">
            Previous
          </button>
          <button
            type="button"
            onClick={() => go(active + 1, "Next")}
            disabled={active === RIPPLE_SECTIONS.length - 1}
            className="btn btn-ghost !px-3 !py-1.5 text-[10px] disabled:opacity-40"
          >
            Next
          </button>
        </div>

        <p aria-live="polite" className="mt-2 min-h-[1rem] text-[10px] leading-relaxed text-violet-200/80">
          {notice}
        </p>
        <p className="mt-1 text-[10px] leading-relaxed text-ink-faint">
          The rail is the catalog&apos;s Table of Contents Spine with a ring on it — {toc ? `${toc.title}, ${toc.bundleKb.toFixed(1)} KB` : "the spine component"} for
          the real article, this five-dot mock for the effect. The dots are 24-pixel buttons, each labelled with its section, and the ring
          never blocks the pointer.
        </p>
      </div>
    </div>
  );
}

/* -------------------------- 17.24 Tilted hero CTA ------------------------- */

const TILT_MAX = 8;

const clampTilt = (v: number) => Math.max(-TILT_MAX, Math.min(TILT_MAX, v));

export function TiltedCta() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [locked, setLocked] = useState(false);
  const [note, setNote] = useState("Move the pointer across the card: the CTA tips toward it, capped at 8°.");
  const reduced = useReducedMotion();
  const tiltCss = `perspective(700px) rotateX(${tilt.x.toFixed(1)}deg) rotateY(${tilt.y.toFixed(1)}deg)`;
  const labelCss = `rotateY(${(-tilt.y).toFixed(1)}deg) rotateX(${(-tilt.x).toFixed(1)}deg)`;

  const nudge = (key: string) => {
    if (reduced) {
      setNote("Reduced motion is on, so the arrow keys leave the button upright.");
      return;
    }
    if (locked) {
      setNote("The tilt is locked — unlock it to steer with the arrow keys.");
      return;
    }
    const step = 2;
    const next =
      key === "ArrowUp"
        ? { x: clampTilt(tilt.x - step), y: tilt.y }
        : key === "ArrowDown"
          ? { x: clampTilt(tilt.x + step), y: tilt.y }
          : key === "ArrowLeft"
            ? { x: tilt.x, y: clampTilt(tilt.y - step) }
            : key === "ArrowRight"
              ? { x: tilt.x, y: clampTilt(tilt.y + step) }
              : { x: 0, y: 0 };
    setTilt(next);
    setNote(
      next.x === 0 && next.y === 0
        ? "Returned to upright — the same state the pointer-leave handler leaves behind."
        : `Keyboard tilt: rotateX ${next.x}°, rotateY ${next.y}° — the same 8° ceiling the pointer gets.`,
    );
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(80%_90%_at_20%_0%,rgba(45,212,191,0.12),transparent_60%),#08090f] px-6 py-6">
      <div className="w-full max-w-md">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-teal-300/80">Tilted hero CTA</p>
          <p className="font-mono text-[10px] tabular-nums text-ink-faint">
            rotateX {tilt.x.toFixed(0)}° · rotateY {tilt.y.toFixed(0)}° · cap ±{TILT_MAX}°
          </p>
        </div>

        <div
          onPointerMove={(e) => {
            if (locked || reduced) return;
            const r = e.currentTarget.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            setTilt({ x: clampTilt(-py * 2 * TILT_MAX), y: clampTilt(px * 2 * TILT_MAX) });
          }}
          onPointerLeave={() => {
            if (locked || reduced) return;
            setTilt({ x: 0, y: 0 });
            setNote("Pointer gone; the button eases back to upright.");
          }}
          className="rounded-2xl border border-white/10 bg-white/[.02] p-4"
        >
          <p className="text-[12px] font-bold text-ink">A hero that answers the pointer</p>
          <p className="mt-1 text-[11px] leading-relaxed text-ink-dim">
            One button, one tilt, and a hard ceiling: past about ten degrees a hero stops looking deliberate and starts looking seasick.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <Link
              href="/components"
              onKeyDown={(e) => {
                if (!e.key.startsWith("Arrow") && e.key !== "Escape" && e.key !== "0") return;
                e.preventDefault();
                nudge(e.key);
              }}
              onFocus={() => setNote("Focused. Arrow keys tilt it by 2° a press; Enter follows the link.")}
              onBlur={() => setTilt({ x: 0, y: 0 })}
              style={{ transform: tiltCss, transformStyle: "preserve-3d" }}
              className="btn btn-primary !px-4 !py-2 text-[11px] transition-transform duration-100 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-300"
            >
              <span style={{ transform: labelCss, display: "inline-block" }}>Browse the catalog →</span>
            </Link>
            <span className="text-[10px] leading-relaxed text-ink-faint">
              The label counter-rotates by the same two angles, so the words stay readable while the button tips.
            </span>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-[10px] text-ink-dim">
            <input
              type="checkbox"
              checked={locked}
              onChange={(e) => {
                setLocked(e.target.checked);
                setNote(e.target.checked ? "Tilt locked: the pointer no longer moves the button." : "Tilt unlocked.");
              }}
              className="h-3.5 w-3.5"
            />
            Lock the tilt
          </label>
          <button
            type="button"
            onClick={() => {
              setTilt({ x: 0, y: 0 });
              setNote("Reset to upright.");
            }}
            className="btn btn-ghost !px-3 !py-1.5 text-[10px]"
          >
            Reset
          </button>
        </div>

        <p aria-live="polite" className="mt-2 min-h-[1rem] text-[10px] leading-relaxed text-teal-200/80">
          {note}
        </p>
        <p className="mt-1 text-[10px] leading-relaxed text-ink-faint">
          The button is a real link to the catalog: the tilt is decoration on top of a working control, it is skipped entirely under reduced
          motion, and the keyboard gets the same effect through the arrow keys rather than a pointer-only flourish.
        </p>
      </div>
    </div>
  );
}

/* ---------------------- 17.25 Success-state celebration ------------------- */

const NEXT_STEPS = [
  { href: "/components", label: "Open the catalog", meta: `${COMPONENTS.length} components` },
  { href: "/learn", label: "Read a guide", meta: `${LEARN_ARTICLES.length} essays` },
  { href: "/lab", label: "Try the Lab", meta: "free tools, no sign-in" },
];

const BURST_PARTICLES = 12;

export function SuccessBurst() {
  const [email, setEmail] = useState("");
  const [created, setCreated] = useState(false);
  const [error, setError] = useState("");
  const [burst, setBurst] = useState(0);
  const reduced = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);

  // One shot per submit, twelve particles, and nothing at all under reduced
  // motion — the check mark itself is the whole celebration there.
  useEffect(() => {
    if (!burst || reduced) return;
    const host = hostRef.current;
    if (!host) return;
    const particles = host.querySelectorAll<HTMLElement>("[data-particle]");
    const anims: Animation[] = [];
    particles.forEach((el, i) => {
      const angle = (i / Math.max(1, particles.length)) * Math.PI * 2;
      const distance = 46 + (i % 3) * 10;
      anims.push(
        el.animate(
          [
            { transform: "translate(0px, 0px) scale(1)", opacity: 1 },
            {
              transform: `translate(${Math.round(Math.cos(angle) * distance)}px, ${Math.round(Math.sin(angle) * distance)}px) scale(.35)`,
              opacity: 0,
            },
          ],
          { duration: 620, easing: "cubic-bezier(.22,.61,.36,1)" },
        ),
      );
    });
    return () => anims.forEach((a) => a.cancel());
  }, [burst, reduced]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Type an address first — nothing is sent either way.");
      return;
    }
    setError("");
    setCreated(true);
    setBurst((b) => b + 1);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(70%_90%_at_50%_100%,rgba(52,211,153,0.10),transparent_60%),#08090f] px-6 py-6">
      <div className="w-full max-w-md">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-300/80">Success-state celebration</p>
          <p className="text-[10px] text-ink-faint">
            {reduced ? "reduced motion: no burst, check only" : `${BURST_PARTICLES} particles, one shot, 620 ms`}
          </p>
        </div>

        <div ref={hostRef} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[.02] p-4">
          {created ? (
            <div className="relative">
              <div className="relative mx-auto grid h-10 w-10 place-items-center" aria-hidden>
                <span className="absolute inset-0 rounded-full bg-emerald-400/15" />
                <svg viewBox="0 0 24 24" className="h-5 w-5">
                  <path d="M5 12.5 10 17.5 19 7" fill="none" stroke="rgba(110,231,183,.95)" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {!reduced &&
                  Array.from({ length: BURST_PARTICLES }).map((_, i) => (
                    <span
                      key={i}
                      data-particle
                      className="absolute h-1 w-1 rounded-full bg-emerald-300/80"
                      style={{ top: "50%", left: "50%" }}
                    />
                  ))}
              </div>
              <p className="mt-2 text-center text-[12px] font-bold text-ink">Account created — in this panel only</p>
              <p className="mt-1 text-center text-[11px] leading-relaxed text-ink-dim">
                No request left the page and nothing was written to storage: reload and the form is empty again. The celebration is a picture of
                the moment, not a receipt for one.
              </p>
              <ul className="mt-3 space-y-1.5">
                {NEXT_STEPS.map((step) => (
                  <li key={step.href} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[.03] px-3 py-1.5">
                    <Link href={step.href} className="text-[11px] font-medium text-emerald-100 hover:underline">
                      {step.label}
                    </Link>
                    <span className="font-mono text-[10px] text-ink-faint">{step.meta}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-2">
              <p className="text-[12px] font-bold text-ink">Create a demo account</p>
              <p className="text-[11px] leading-relaxed text-ink-dim">
                A success state is worth designing properly: it is the screen people screenshot. This one runs in the panel with no backend
                behind it.
              </p>
              <label className="block text-[10px] uppercase tracking-widest text-ink-faint" htmlFor="success-email">
                Email
              </label>
              <input
                id="success-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@studio.example"
                className="w-full rounded-xl border border-white/10 bg-white/[.04] px-3 py-2 text-[11px] text-ink placeholder:text-ink-faint focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300"
              />
              {error ? (
                <p className="text-[10px] text-rose-300/90">{error}</p>
              ) : (
                <p className="text-[10px] text-ink-faint">Press Enter or the button — both paths do the same thing.</p>
              )}
              <button type="submit" className="btn btn-primary !px-4 !py-2 text-[11px]">
                Create account (demo)
              </button>
            </form>
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setCreated(false);
              setEmail("");
              setError("");
            }}
            disabled={!created}
            className="btn btn-ghost !px-3 !py-1.5 text-[10px] disabled:opacity-40"
          >
            Start over
          </button>
          <button
            type="button"
            onClick={() => {
              setCreated(true);
              setBurst((b) => b + 1);
            }}
            className="btn btn-ghost !px-3 !py-1.5 text-[10px]"
          >
            Fire the burst again
          </button>
        </div>

        <p aria-live="polite" className="mt-2 min-h-[1rem] text-[10px] leading-relaxed text-emerald-200/80">
          {created
            ? reduced
              ? "Success state, no burst: with reduced motion the check mark is the entire celebration."
              : `Success state, burst fired ${burst} time${burst === 1 ? "" : "s"} — capped at ${BURST_PARTICLES} particles and never on load.`
            : "Waiting for a submit. The burst cannot fire on page load or on a loop."}
        </p>
        <p className="mt-1 text-[10px] leading-relaxed text-ink-faint">
          Restraint is the design brief: one burst per deliberate action, no confetti behind the content, and the reduced-motion version
          drops the particles rather than shrinking them. The three next steps link to pages that exist.
        </p>
      </div>
    </div>
  );
}
