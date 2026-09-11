"use client";

// Scene set 4 of 7 — MOTION, SCROLL AND REVEAL SCENES.
//
// Loaded on demand: a page that renders one demo downloads the set that
// holds it (plus the shared kit), not the other 195 scenes. The registry in
// ../Demo.tsx is the only thing that knows where each key lives.
import { useEffect, useRef, useState } from "react";
import type { DemoProps } from "../scene-kit";
import { BACKGROUNDS, COMPONENTS, PROMPTS } from "@/lib/data";
import { LEARN_ARTICLES } from "@/lib/learn";

const FAQ_ROWS = [
  { q: "Can I use Motif assets in commercial projects?", a: "Yes — components are MIT and guides are CC BY 4.0. Attribution is appreciated, not required." },
  { q: "Do the prompts really get tested before they ship?", a: "Every prompt runs against three frontier models and the run log is public on its page — scores, screenshots, failure notes." },
  { q: "What does the audit gate actually check?", a: "Accessibility (axe + a human keyboard walk), bundle size, dependency count and original-content checks." },
  { q: "How often does the library grow?", a: "A content push lands most weeks. The changelog on the homepage lists every drop with dates and links." },
];


export function DisclosureList() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const toggle = (i: number) => setOpenIdx((cur) => (cur === i ? null : i));
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(60%_90%_at_50%_0%,rgba(52,211,153,0.11),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-md">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-mint">FAQ · one row open at a time</span>
          <span className="chip !text-[9px] uppercase">aria-expanded wired</span>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/4">
          {FAQ_ROWS.map((row, i) => {
            const open = openIdx === i;
            return (
              <div key={row.q} className={i > 0 ? "border-t border-white/6" : ""}>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                >
                  <span className={`text-sm font-bold ${open ? "text-mint" : "text-ink"}`}>{row.q}</span>
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                    aria-hidden
                    className={`shrink-0 ${open ? "rotate-45 text-mint" : "text-ink-faint"}`}
                    style={{ transition: "transform .2s ease" }}
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
                {/* Mounted and hidden rather than unmounted: the button's
                    aria-controls has to point at an element that exists in
                    both states, which is what a screen reader reads first. */}
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-label={row.q}
                  hidden={!open}
                  className="px-4 pb-4 text-[12px] leading-relaxed text-ink-dim"
                  style={{ animation: "mf-growin .16s ease-out both" }}
                >
                  {row.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


const OVERLAY_LINKS = [
  { t: "Components", m: `${COMPONENTS.length} assets · themed` },
  { t: "AI Prompts", m: `${PROMPTS.length} tested briefs` },
  { t: "Backgrounds", m: `${BACKGROUNDS.length} living canvases` },
  { t: "Learn", m: `${LEARN_ARTICLES.length} craft guides` },
  { t: "The Lab", m: "physics you can touch" },
  { t: "Pricing", m: "free core, Pro power" },
];


export function FullscreenOverlayMenu() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#0a0c13]">
      {/* fake page behind */}
      <div className="flex w-full flex-col px-6 opacity-60">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] font-black tracking-tight">motif<span className="text-violet-300">/ui</span></span>
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
        <div className="flex h-24 items-center justify-center rounded-2xl border border-white/8 bg-white/4">
          <span className="text-sm font-bold text-ink-dim">the page, dimmed behind the overlay</span>
        </div>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="absolute inset-0 z-30 flex flex-col bg-[#07080d]/97 px-6 py-5 backdrop-blur-md"
          style={{ animation: "mf-fade .18s ease-out both" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-black tracking-tight">motif<span className="text-violet-300">/ui</span></span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/12 bg-white/5 text-ink-dim transition-colors hover:text-ink">
              ✕
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-1" aria-label="Fullscreen">
            {OVERLAY_LINKS.map((l, i) => (
              <button
                key={l.t}
                type="button"
                onClick={() => setOpen(false)}
                className="group flex items-baseline gap-3 rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-white/4"
                style={{ animation: `mf-rise .25s ${0.03 * i}s cubic-bezier(.16,1,.3,1) both` }}
              >
                <span className="text-xl font-black tracking-tight text-white transition-transform group-hover:translate-x-1 md:text-2xl">{l.t}</span>
                <span className="text-[10px] uppercase tracking-widest text-violet-300/70">{l.m}</span>
              </button>
            ))}
          </nav>
          <p className="text-center text-[10px] text-ink-faint">esc closes · links stagger in 30ms apart</p>
        </div>
      )}
    </div>
  );
}


const SKELETON_PROFILE = {
  name: "Lena Voss",
  role: "Frontend engineer · Berlin",
  blurb: "Builds design systems and the teams that ship them. Collects vintage German type specimens.",
  counts: "14 builds · 3 awards",
};


export function SkeletonCard({ delay = 1600 }: DemoProps) {
  const dl = typeof delay === "number" ? Math.max(400, Math.min(4000, Math.round(delay))) : 1600;
  const [again, setAgain] = useState(0);
  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(60%_90%_at_50%_100%,rgba(34,211,238,0.11),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-xs">
        <SkeletonCardInner key={again} delay={dl} onReplay={() => setAgain((n) => n + 1)} />
      </div>
    </div>
  );
}


function SkeletonCardInner({ delay, onReplay }: { delay: number; onReplay: () => void }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-white/8 bg-panel">
        {!loaded ? (
          <div className="p-5" aria-hidden>
            <div className="flex items-center gap-4">
              <div className="skeleton h-14 w-14 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3 w-3/4 rounded-full" />
                <div className="skeleton h-2.5 w-1/2 rounded-full" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="skeleton h-2.5 w-full rounded-full" />
              <div className="skeleton h-2.5 w-11/12 rounded-full" />
              <div className="skeleton h-2.5 w-2/3 rounded-full" />
            </div>
            <div className="mt-4 flex gap-2">
              <div className="skeleton h-6 w-20 rounded-full" />
              <div className="skeleton h-6 w-14 rounded-full" />
            </div>
            <style>{`@keyframes mf-sk-float { from { background-position: 100% 0 } to { background-position: -100% 0 } }
.skeleton { background: linear-gradient(90deg, rgba(255,255,255,.05) 25%, rgba(255,255,255,.14) 50%, rgba(255,255,255,.05) 75%); background-size: 200% 100%; animation: mf-sk-float 1.1s linear infinite; }`}</style>
          </div>
        ) : (
          <div className="p-5" style={{ animation: "mf-growin .25s ease-out both" }}>
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300/30 to-violet-400/30 text-lg font-black text-cyan-100">
                LV
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-extrabold tracking-tight">{SKELETON_PROFILE.name}</div>
                <div className="truncate text-[11px] text-cyan-200/70">{SKELETON_PROFILE.role}</div>
              </div>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-ink-dim">{SKELETON_PROFILE.blurb}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="chip !text-[9px] text-mint">{SKELETON_PROFILE.counts}</span>
              <span className="chip !text-[9px]">verified contributor</span>
            </div>
          </div>
        )}
      </div>
      <button type="button" onClick={onReplay} className="btn btn-ghost mt-3 !w-full !py-2 !text-xs">
        ↺ Replay the skeleton
      </button>
    </>
  );
}



const BANNER_TONES = [
  { id: "ok", t: "Success", glyph: "✓", text: "Your component passed the audit gate — quality 96, a11y 98.", cls: "border-mint/30 bg-mint/8 text-mint", iconCls: "bg-mint/15 text-mint" },
  { id: "err", t: "Error", glyph: "✕", text: "The prompt run failed on one model. Re-run or open the log.", cls: "border-danger/30 bg-danger/8 text-danger", iconCls: "bg-danger/15 text-danger" },
  { id: "warn", t: "Warning", glyph: "!", text: "Snippet is 6.8 KB gzipped — under budget, but watch the blur layer.", cls: "border-amber-300/30 bg-amber-400/8 text-amber-300", iconCls: "bg-amber-400/15 text-amber-300" },
  { id: "info", t: "Info", glyph: "i", text: "Learn guides now cover the 60fps handshake — new this week.", cls: "border-cyan-300/30 bg-cyan-400/8 text-cyan-300", iconCls: "bg-cyan-400/15 text-cyan-300" },
];


export function StatusBanner() {
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});
  const [flash, setFlash] = useState(false);
  const visible = BANNER_TONES.filter((b) => !dismissed[b.id]);
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(139,92,246,0.12),transparent_60%),#08090f] px-6">
      <div className="mx-auto w-full max-w-md space-y-2.5">
        {visible.map((b) => (
          <div key={b.id} role="status" className={`flex items-start gap-3 rounded-xl border px-3.5 py-3 backdrop-blur-sm ${b.cls}`} style={{ animation: "mf-toast-in .25s ease-out both" }}>
            <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${b.iconCls}`}>{b.glyph}</span>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-extrabold">{b.t}</div>
              <div className="mt-0.5 text-[11px] leading-relaxed opacity-90">{b.text}</div>
            </div>
            <button type="button" aria-label={`Dismiss ${b.t} banner`} onClick={() => setDismissed((p) => ({ ...p, [b.id]: true }))} className="shrink-0 rounded-md px-1.5 py-0.5 text-xs opacity-60 transition-opacity hover:opacity-100">
              ✕
            </button>
          </div>
        ))}
        {visible.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/12 py-8 text-center text-xs text-ink-faint">
            All banners dismissed
            <button type="button" onClick={() => setDismissed({})} className="ml-2 font-bold text-violet-300 underline-offset-2 hover:underline">restore</button>
          </div>
        )}
        <button type="button" onClick={() => { setFlash(true); setDismissed({}); window.setTimeout(() => setFlash(false), 1600); }} className="btn btn-ghost !w-full !py-2 !text-xs">
          {flash ? "✓ A success banner will re-appear above" : "Reset + show a success banner"}
        </button>
      </div>
    </div>
  );
}


export function ProgressRing() {
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState<"idle" | "run" | "stalled" | "done">("idle");
  const R = 40;
  const C = 2 * Math.PI * R;
  useEffect(() => {
    if (phase !== "run") return;
    const t = setInterval(() => {
      setPct((p) => {
        if (p >= 99) {
          clearInterval(t);
          window.setTimeout(() => setPhase("done"), 200);
          return 100;
        }
        const next = p + 2 + Math.random() * 5;
        if (next > 68 && next < 74 && Math.random() < 0.22) {
          clearInterval(t);
          setPhase("stalled");
          return Math.round(next);
        }
        return next;
      });
    }, 130);
    return () => clearInterval(t);
  }, [phase]);
  const start = () => { setPct(0); setPhase("run"); };
  const cancel = () => { setPct(0); setPhase("idle"); };
  const retry = () => { setPct(0); setPhase("run"); };
  const pctColor = phase === "stalled" ? "#fbbf24" : "#22d3ee";
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(34,211,238,0.12),transparent_60%),#08090f] px-6">
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden>
          <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="7" />
          <circle
            cx="50" cy="50" r={R} fill="none"
            stroke={pctColor}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C - (C * Math.max(0, Math.min(100, pct))) / 100}
            style={{ transition: "stroke-dashoffset .12s linear, stroke .3s" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {phase === "done" ? (
            <>
              <span className="text-xl text-mint">✓</span>
              <span className="text-[10px] font-bold text-mint">uploaded</span>
            </>
          ) : phase === "stalled" ? (
            <>
              <span className="text-sm font-black text-amber-300">{Math.round(pct)}%</span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-amber-300/80">stalled</span>
            </>
          ) : (
            <>
              <span className="font-mono text-sm font-black tabular-nums">{Math.round(pct)}%</span>
              <span className="text-[8px] uppercase tracking-wider text-ink-faint">{phase === "run" ? "uploading" : "ready"}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {phase === "run" && (
          <button type="button" onClick={cancel} className="btn btn-quiet !px-4 !py-2 !text-xs">
            Cancel upload
          </button>
        )}
        {phase === "stalled" && (
          <>
            <span className="chip !border-amber-300/30 !text-amber-200">connection dropped — retry?</span>
            <button type="button" onClick={retry} className="btn btn-primary !px-4 !py-2 !text-xs">
              ↺ Retry
            </button>
          </>
        )}
        {phase !== "run" && phase !== "stalled" && (
          <button type="button" onClick={start} className="btn btn-primary !px-5 !py-2 !text-xs">
            {phase === "done" ? "Upload another" : "Start upload"}
          </button>
        )}
      </div>
      <p className="max-w-xs text-center text-[11px] text-ink-faint">
        {phase === "stalled"
          ? "simulated stall: the ring freezes in amber so the failure is visible, not silent"
          : phase === "done"
            ? "100% — the ring hands off to a ✓ so there is no guessing"
            : "circular progress keeps the destination visible — you always see how much is left"}
      </p>
    </div>
  );
}


const SAVE_STATES = [
  { t: "idle", l: "Save changes", busy: false },
  { t: "saving", l: "Saving changes…", busy: true },
  { t: "done", l: "Saved ✓", busy: false },
] as const;


export function SpinnerStatus() {
  const [st, setSt] = useState<"idle" | "saving" | "done">("idle");
  const save = () => {
    if (st === "saving") return;
    setSt("saving");
    window.setTimeout(() => setSt("done"), 1400);
    window.setTimeout(() => setSt("idle"), 3200);
  };
  const cur = SAVE_STATES.find((x) => x.t === st)!;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[radial-gradient(60%_90%_at_50%_100%,rgba(52,211,153,0.12),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-xs rounded-2xl border border-white/8 bg-white/4 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold">Theme tokens</span>
          <span className="chip !text-[9px]">violet · default</span>
        </div>
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between rounded-lg bg-black/25 px-3 py-2 text-[11px]">
            <span className="text-ink-dim">--color-accent</span>
            <span className="font-mono text-violet-200">#8b5cf6</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-black/25 px-3 py-2 text-[11px]">
            <span className="text-ink-dim">--color-ink-dim</span>
            <span className="font-mono text-ink-dim">#9aa3b5</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-black/25 px-3 py-2 text-[11px]">
            <span className="text-ink-dim">--radius-lg</span>
            <span className="font-mono text-cyan-200">24px</span>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={save}
        disabled={st === "saving"}
        className={`btn w-full max-w-xs !py-2.5 !text-xs disabled:cursor-wait ${
          st === "done" ? "!border-mint/40 !bg-mint/15 !text-mint" : "btn-primary"
        }`}
      >
        <span className="flex h-4 w-4 items-center justify-center" aria-hidden>
          {st === "saving" ? (
            <span className="block h-3 w-3 rounded-full border-2 border-white/30 border-t-white" style={{ animation: "mf-spin .7s linear infinite" }} />
          ) : st === "done" ? (
            <span>✓</span>
          ) : null}
        </span>
        <span>{cur.l}</span>
      </button>
      <p className="text-[11px] text-ink-faint">the label swaps in place — the button never jumps or widens mid-action</p>
    </div>
  );
}


const EMPTY_TRIPLES = [
  { id: "inbox", glyph: "▣", t: "No alerts yet", verb: "Set your first alert", step: "Pick a component and we will watch it for changes.", hatch: "or watch a whole collection", tone: "text-violet-300", ring: "from-violet-400/20" },
  { id: "dash", glyph: "◔", t: "Your dashboard is bare", verb: "Add a first metric", step: "Copies, views or model runs — one tile and it starts counting.", hatch: "or import last month's report", tone: "text-cyan-300", ring: "from-cyan-400/20" },
  { id: "board", glyph: "▤", t: "Nothing saved yet", verb: "Save your first stack", step: "Collect a few assets and the stack becomes a shareable recipe.", hatch: "or browse the library first", tone: "text-mint", ring: "from-mint/20" },
];


export function EmptyStateTrio() {
  const [filled, setFilled] = useState<string | null>(null);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(52,211,153,0.1),transparent_60%),#08090f] px-6">
      <div className="flex flex-wrap items-center justify-center gap-2 text-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-mint">Empty-state trio</span>
        <span className="text-[11px] text-ink-faint">one verb headline · a visible next step · an escape hatch</span>
      </div>
      <div className="grid w-full max-w-lg gap-3 sm:grid-cols-3">
        {EMPTY_TRIPLES.map((e) => {
          const done = filled === e.id;
          return (
            <div key={e.id} className={`rounded-2xl border p-4 text-left transition-all duration-300 ${done ? "border-mint/40 bg-mint/8" : "border-white/8 bg-white/4"}`}>
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${e.ring} to-transparent text-base ${e.tone}`}>{done ? "✓" : e.glyph}</span>
              <div className="mt-3 text-sm font-extrabold tracking-tight">{done ? "It has content now" : e.t}</div>
              {done ? (
                <p className="mt-1 text-[10px] leading-relaxed text-mint">Tap the verb below to undo the demo fill.</p>
              ) : (
                <>
                  <p className="mt-0.5 text-[10px] leading-relaxed text-ink-faint">{e.step}</p>
                  <div className="mt-2.5 flex items-center gap-1.5">
                    <button type="button" onClick={() => setFilled(e.id)} className="rounded-lg bg-white/10 px-2 py-1 text-[10px] font-bold transition-colors hover:bg-white/18">
                      {e.verb}
                    </button>
                    <button type="button" onClick={() => setFilled(e.id)} className="text-[9px] text-ink-faint underline-offset-2 hover:underline">{e.hatch}</button>
                  </div>
                </>
              )}
              {done && (
                <button type="button" onClick={() => setFilled(null)} className="mt-1 text-[9px] text-ink-faint underline-offset-2 hover:underline">
                  reset empty state
                </button>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-center text-[11px] text-ink-faint">the empty state is onboarding — the headline is a verb, the first step takes under a minute</p>
    </div>
  );
}


export function OfflineIndicator() {
  const [online, setOnline] = useState(true);
  const [reconnecting, setReconnecting] = useState(false);
  const goOffline = () => {
    setOnline(false);
    setReconnecting(true);
    window.setTimeout(() => setReconnecting(false), 2800);
    window.setTimeout(() => setOnline(true), 3400);
  };
  const show = !online;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(244,114,182,0.1),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-sm rounded-2xl border border-white/8 bg-white/4 p-5">
        <div className="flex items-center gap-2">
          <span className={`relative flex h-2 w-2 ${online ? "" : ""}`}>
            {online ? (
              <span className="inline-flex h-2 w-2 rounded-full bg-mint" />
            ) : (
              <>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-300" />
              </>
            )}
          </span>
          <span className="text-sm font-bold">{online ? "Connected" : reconnecting ? "Reconnecting…" : "Offline"}</span>
          <span className={`ml-auto text-[10px] ${online ? "text-mint" : "text-amber-300"}`}>{online ? "changes sync live" : "queued locally"}</span>
        </div>
        <div className="mt-3 space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-white/8" />
          <div className="h-1.5 w-3/4 rounded-full bg-white/6" />
        </div>
        {show && (
          <div className="mt-3 rounded-lg border border-amber-300/25 bg-amber-400/8 px-3 py-2 text-[11px] text-amber-200" style={{ animation: "mf-toast-in .2s ease-out both" }}>
            Your changes are saved on this device. We will sync the moment the connection returns.
          </div>
        )}
      </div>
      <button type="button" onClick={goOffline} disabled={!online} className="btn btn-quiet !px-4 !py-2 !text-xs disabled:cursor-not-allowed disabled:opacity-40">
        Simulate going offline
      </button>
      <p className="max-w-xs text-center text-[11px] text-ink-faint">wire it to the real <span className="font-mono text-pink-200">online/offline</span> events — the banner pulses while it reconnects, then clears itself</p>
    </div>
  );
}


export function ErrorBoundaryCard({ fail = 1 }: DemoProps) {
  const failsLeft = typeof fail === "number" ? Math.max(0, Math.min(3, Math.round(fail))) : 1;
  const [attempt, setAttempt] = useState(0);
  const [showDetail, setShowDetail] = useState(false);
  const [copied, setCopied] = useState(false);
  const broken = attempt <= failsLeft;
  const copyError = async () => {
    try {
      await navigator.clipboard.writeText("TypeError: Cannot read properties of undefined (reading 'layers')" + "\n" + "  at renderSurface (Surface.tsx:84:11)");
    } catch { /* noop */ }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(248,113,113,0.1),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-md">
        {broken ? (
          <div className="rounded-2xl border border-danger/25 bg-panel p-5" role="alert" style={{ animation: "mf-toast-in .25s ease-out both" }}>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/15 text-lg text-danger">!</span>
              <div>
                <div className="text-sm font-extrabold">This section hit a snag</div>
                <div className="text-[11px] text-ink-dim">The rest of the page is fine — only the surface renderer failed.</div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => setAttempt((n) => n + 1)} className="btn btn-primary !px-4 !py-2 !text-xs">
                ↺ Try again
              </button>
              <button type="button" onClick={copyError} className="btn btn-ghost !px-4 !py-2 !text-xs">
                {copied ? "✓ Copied" : "Copy error report"}
              </button>
              <button type="button" onClick={() => setShowDetail((v) => !v)} className="ml-auto text-[11px] font-semibold text-ink-faint hover:text-ink">
                {showDetail ? "hide details" : "show details"}
              </button>
            </div>
            {showDetail && (
              <pre className="mt-3 overflow-x-auto rounded-xl bg-black/40 p-3 font-mono text-[10px] leading-relaxed text-danger/90">
                TypeError: Cannot read properties of undefined (reading &apos;layers&apos;)
                {"\n"}  at renderSurface (Surface.tsx:84:11)
              </pre>
            )}
            <p className="mt-3 text-[10px] text-ink-faint">attempt {attempt} of {failsLeft + 1} · a real boundary reports once and recovers — it never blanks the whole app</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-mint/30 bg-mint/8 p-5 text-center" style={{ animation: "mf-toast-in .25s ease-out both" }}>
            <div className="text-2xl">✓</div>
            <div className="mt-1 text-sm font-extrabold text-mint">Recovered on attempt {attempt}</div>
            <p className="mt-1 text-[11px] text-ink-dim">The boundary caught the error, reported it, and the section re-rendered cleanly.</p>
            <button type="button" onClick={() => setAttempt(0)} className="btn btn-ghost mt-3 !py-2 !text-xs">↺ Break it again</button>
          </div>
        )}
      </div>
    </div>
  );
}


const CONFETTI_COLORS = ["#8b5cf6", "#22d3ee", "#34d399", "#f472b6", "#fbbf24", "#a5b4fc"];


export function ConfettiBurst() {
  const [burst, setBurst] = useState(0);
  const pieces = burst ? Array.from({ length: 34 }) : [];
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(244,114,182,0.12),transparent_60%),#08090f] px-6">
      {/* stage */}
      <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-white/8 bg-white/4 p-6 text-center">
        <span className="chip !border-mint/25 !bg-mint/10 !text-mint">Launch complete</span>
        <div className="text-2xl font-black tracking-tight">motif/ui is live 🎉</div>
        <p className="text-[11px] text-ink-dim">your build shipped — celebrate once, then get back to work.</p>
        <button type="button" onClick={() => setBurst((n) => n + 1)} className="btn btn-primary !px-5 !py-2 !text-xs">
          🎉 Fire confetti
        </button>
      </div>
      {/* confetti layer, re-keyed per burst */}
      {burst > 0 && (
        <div key={burst} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {pieces.map((_, i) => {
            const hue = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
            const left = ((i * 37) % 100) + (i % 3 === 0 ? -6 : 4);
            const delay = (i % 11) * 0.045;
            const drift = (i % 5) - 2;
            const rot = (i * 61) % 360;
            return (
              <span
                key={i}
                className="absolute top-[-12px] block"
                style={{
                  left: `${left}%`,
                  width: i % 3 === 0 ? 8 : 6,
                  height: i % 4 === 0 ? 8 : 11,
                  background: hue,
                  borderRadius: i % 4 === 0 ? "99px" : "2px",
                  animation: `mf-confetti-fall ${1.6 + (i % 5) * 0.22}s cubic-bezier(.2,.6,.35,1) ${delay}s both`,
                  ["--cf-drift" as string]: `${drift * 30}px`,
                  ["--cf-rot" as string]: `${rot}deg`,
                }}
              />
            );
          })}
          <style>{`@keyframes mf-confetti-fall {
  0% { transform: translate(0, -10px) rotate(0deg); opacity: 1; }
  100% { transform: translate(var(--cf-drift), 130%) rotate(var(--cf-rot)); opacity: .2; }
}`}</style>
        </div>
      )}
      <p className="mt-4 max-w-xs text-center text-[11px] text-ink-faint">tasteful by default: one burst per milestone, never looping, and it cleans itself off the stage</p>
    </div>
  );
}


export function DotLeaderLoading() {
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  useEffect(() => {
    if (phase !== "running") return;
    const t = window.setTimeout(() => setPhase("done"), 2500);
    return () => window.clearTimeout(t);
  }, [phase]);
  return (
    <div className="flex h-full w-full flex-col justify-center gap-4 overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(52,211,153,0.09),transparent_60%),#08090f] px-6">
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-white/8 bg-black/45 font-mono text-[11px] leading-relaxed shadow-[0_24px_60px_rgba(0,0,0,.5)] backdrop-blur-sm">
        <div className="flex items-center gap-1.5 border-b border-white/6 px-3.5 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-[9px] uppercase tracking-[0.22em] text-ink-faint">install.sh</span>
        </div>
        <div className="space-y-2.5 px-4 py-4 text-ink-dim">
          <p>
            <span className="text-mint">$</span> npm run motif:install{" "}
            <span className="text-ink-faint">-- --theme aurora --registry ui</span>
          </p>
          {phase === "idle" && <p className="text-ink-faint">waiting for the first install…</p>}
          {phase === "running" && (
            <p role="status" className="flex items-center gap-2 text-emerald-200/90">
              installing 42 theme tokens
              <span aria-hidden className="flex gap-[3px]">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-[3px] w-[3px] rounded-full bg-emerald-300"
                    style={{ animation: `mf-dot .9s ease-in-out ${i * 0.18}s infinite` }}
                  />
                ))}
              </span>
            </p>
          )}
          {phase === "done" && (
            <>
              <p className="text-emerald-300">✔ 42 tokens installed · 1.4s</p>
              <p className="text-ink-dim">
                next: npm run motif:doctor <span className="text-ink-faint">— checks peer deps</span>
              </p>
            </>
          )}
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-md items-center justify-between gap-3">
        <p className="text-[10px] text-ink-faint">the leader reads as process — three beats, not a guessing spinner</p>
        <button
          type="button"
          onClick={() => setPhase("running")}
          disabled={phase === "running"}
          className="btn btn-primary shrink-0 !px-4 !py-1.5 !text-[11px] disabled:opacity-60"
        >
          {phase === "running" ? "running…" : phase === "done" ? "Run again" : "Run install"}
        </button>
      </div>
      <p role="status" className="sr-only">
        {phase === "running" ? "installing theme tokens" : phase === "done" ? "install finished" : ""}
      </p>
    </div>
  );
}


const LRD_ACTIONS = [
  { label: "✓ Snippet copied", tone: "ok", assertive: false },
  { label: "⏳ Loading 4 of 12 surfaces", tone: "busy", assertive: false },
  { label: "✕ Payment failed — card declined", tone: "err", assertive: true },
  { label: "✦ 3 updates are waiting for you", tone: "info", assertive: false },
] as const;


export function LiveRegionDemo() {
  const [log, setLog] = useState<{ id: number; label: string; tone: string; assertive: boolean }[]>([]);
  const [reveal, setReveal] = useState(false);
  const seq = useRef(0);
  const fire = (a: (typeof LRD_ACTIONS)[number]) => {
    seq.current += 1;
    setLog((prev) => [...prev.slice(-5), { id: seq.current, label: a.label, tone: a.tone, assertive: a.assertive }]);
  };
  const last = log.length > 0 ? log[log.length - 1] : null;
  const toneCls = (t: string) => {
    if (t === "ok") return "border-emerald-300/25 bg-emerald-300/10 text-emerald-200";
    if (t === "err") return "border-rose-300/25 bg-rose-300/10 text-rose-200";
    if (t === "busy") return "border-amber-300/25 bg-amber-300/10 text-amber-200";
    return "border-sky-300/25 bg-sky-300/10 text-sky-200";
  };
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(99,102,241,0.11),transparent_60%),#08090f] px-6">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-white/8 bg-white/4 p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">live region lab</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {LRD_ACTIONS.map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={() => fire(a)}
              className={`rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-transform active:scale-95 ${toneCls(a.tone)}`}
            >
              {a.label}
            </button>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">announcer log</span>
            <span className="font-mono text-[9px] text-ink-faint">
              {last ? (last.assertive ? "role=alert · assertive" : "role=status · polite") : "idle"}
            </span>
          </div>
          {log.length === 0 ? (
            <p className="rounded-lg border border-dashed border-white/10 py-3 text-center text-[10px] text-ink-faint">
              nothing announced yet — press a button above
            </p>
          ) : (
            log.map((l, idx) => (
              <p
                key={l.id}
                className={`rounded-lg border px-3 py-2 text-[11px] ${
                  idx === log.length - 1
                    ? "border-indigo-300/30 bg-indigo-300/10 text-indigo-100"
                    : "border-white/6 bg-black/25 text-ink-dim"
                }`}
              >
                {l.assertive ? "⚠ " : "· "}
                {l.label}
              </p>
            ))
          )}
        </div>
        <label className="mt-3 flex cursor-pointer items-center justify-between gap-3 border-t border-white/6 pt-3 text-[10px] text-ink-dim">
          <span>reveal the hidden announcer — the text screen readers hear</span>
          <input type="checkbox" checked={reveal} onChange={(e) => setReveal(e.target.checked)} className="accent-indigo-400" />
        </label>
      </div>
      {reveal && (
        <div className="mx-auto w-full max-w-md rounded-xl border border-dashed border-indigo-300/30 bg-indigo-950/40 px-3.5 py-2 font-mono text-[10px] text-indigo-200/90">
          {last ? last.label : "…"}
        </div>
      )}
      {/* the real regions stay mounted; announcing works even while visually hidden */}
      <div aria-live="polite" role="status" className={reveal ? "hidden" : "sr-only"}>
        {last && !last.assertive ? last.label : ""}
      </div>
      <div aria-live="assertive" role="alert" className={reveal ? "hidden" : "sr-only"}>
        {last && last.assertive ? last.label : ""}
      </div>
    </div>
  );
}


const LIQ_ITEMS = [
  { id: "ship", label: "Ship it", cls: "from-emerald-400 to-teal-500" },
  { id: "pro", label: "Get motif pro", cls: "from-violet-400 to-indigo-500" },
  { id: "draft", label: "Save draft", cls: "from-amber-300 to-orange-400" },
] as const;


export function LiquidButtonHover() {
  const [pos, setPos] = useState<Record<string, { x: number; y: number }>>({});
  const [hover, setHover] = useState<Record<string, boolean>>({});
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(167,139,250,0.12),transparent_60%),#08090f] px-6">
      <div className="flex w-full max-w-md flex-wrap items-center justify-center gap-3">
        {LIQ_ITEMS.map((it) => {
          const p = pos[it.id];
          const hot = hover[it.id];
          return (
            <button
              key={it.id}
              type="button"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setPos((prev) => ({ ...prev, [it.id]: { x: e.clientX - r.left, y: e.clientY - r.top } }));
              }}
              onMouseEnter={() => setHover((prev) => ({ ...prev, [it.id]: true }))}
              onMouseLeave={() => setHover((prev) => ({ ...prev, [it.id]: false }))}
              className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${it.cls} px-6 py-3 text-xs font-black text-[#0b0c12] shadow-[0_10px_30px_rgba(0,0,0,.35)] transition-transform duration-150 hover:-translate-y-0.5 active:scale-95`}
            >
              {hot && p && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute block h-28 w-28 rounded-full bg-white/60 mix-blend-overlay"
                  style={{ left: p.x, top: p.y, animation: "mf-liquid .75s cubic-bezier(.22,.68,.32,1) forwards" }}
                />
              )}
              <span className="relative">{it.label}</span>
            </button>
          );
        })}
      </div>
      <p className="max-w-md text-center text-[11px] leading-relaxed text-ink-dim">
        the fill starts where your cursor lands — liquid geometry, not a full-width sweep. Under{" "}
        <code className="rounded bg-white/8 px-1 py-0.5 font-mono text-[10px] text-violet-200">prefers-reduced-motion</code>{" "}
        the blob collapses to a plain opacity fade.
      </p>
    </div>
  );
}


const MAG_ITEMS: { id: string; label: string; cls: string; clip?: string }[] = [
  { id: "blob", label: "Blob", cls: "h-5 w-5 rounded-full bg-violet-300" },
  { id: "gem", label: "Gem", cls: "h-5 w-5 rotate-45 rounded-[4px] bg-cyan-300" },
  { id: "cone", label: "Cone", cls: "h-5 w-5 bg-emerald-300", clip: "polygon(50% 0%, 0% 100%, 100% 100%)" },
  { id: "orbit", label: "Orbit", cls: "h-5 w-5 rounded-full border-2 border-amber-300" },
  { id: "cross", label: "Cross", cls: "h-5 w-5 bg-rose-300", clip: "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)" },
];


export function MagneticIconRow() {
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [moves, setMoves] = useState<Record<number, { x: number; y: number; s: number }>>({});
  const [field, setField] = useState<{ x: number; y: number } | null>(null);
  const reset = () => {
    setMoves({});
    setField(null);
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(34,211,238,0.1),transparent_60%),#08090f] px-6">
      <div
        className="relative flex w-full max-w-md items-center justify-center gap-5 rounded-2xl border border-white/6 py-10"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setField({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          const next: Record<number, { x: number; y: number; s: number }> = {};
          iconRefs.current.forEach((el, i) => {
            if (!el) return;
            const r = el.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top + r.height / 2);
            const dist = Math.hypot(dx, dy);
            if (dist < 130 && dist > 0.01) {
              const pull = 1 - dist / 130;
              next[i] = { x: dx * pull * 0.55, y: dy * pull * 0.55, s: 1 + 0.1 * pull };
            } else {
              next[i] = { x: 0, y: 0, s: 1 };
            }
          });
          setMoves(next);
        }}
        onMouseLeave={reset}
      >
        {field && (
          <span
            aria-hidden
            className="pointer-events-none absolute h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/10"
            style={{ left: field.x, top: field.y }}
          />
        )}
        {MAG_ITEMS.map((it, i) => {
          const m = moves[i];
          return (
            <span key={it.id} className="flex flex-col items-center gap-2">
              <span
                ref={(el) => {
                  iconRefs.current[i] = el;
                }}
                className="flex h-12 w-12 items-center justify-center"
                style={{
                  transform: m ? `translate3d(${m.x.toFixed(1)}px, ${m.y.toFixed(1)}px, 0) scale(${m.s.toFixed(3)})` : "none",
                  transition: "transform .22s cubic-bezier(.22,.68,.32,1)",
                  willChange: "transform",
                }}
              >
                <span aria-hidden className={`block ${it.cls}`} style={it.clip ? { clipPath: it.clip } : undefined} />
              </span>
              <span className="text-[9px] uppercase tracking-[0.18em] text-ink-faint">{it.label}</span>
            </span>
          );
        })}
      </div>
      <p className="max-w-md text-center text-[11px] leading-relaxed text-ink-dim">
        each icon leans toward the pointer inside a 130px field and settles back with an ease-out — pure transform math, no library.
        <span className="text-ink-faint"> Icons stay decorative, so the row never competes with real links.</span>
      </p>
    </div>
  );
}


export function ScrollLinkedHueHero() {
  const scroller = useRef<HTMLDivElement>(null);
  const [hue, setHue] = useState(224);
  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const max = Math.max(1, el.scrollHeight - el.clientHeight);
    setHue(Math.round(212 + (el.scrollTop / max) * 130));
  };
  const h = hue;
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0c13]">
      <div className="flex items-center justify-between border-b border-white/6 px-4 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">aurora/hero — scroll to repaint</span>
        <span
          className="rounded-full border px-2.5 py-0.5 font-mono text-[10px]"
          style={{ color: `hsl(${h} 90% 72%)`, borderColor: `hsl(${h} 90% 45% / .4)` }}
        >
          hue {h}°
        </span>
      </div>
      <div ref={scroller} onScroll={onScroll} className="relative flex-1 overflow-y-auto">
        <div
          className="px-5 pb-6 pt-8 transition-[background] duration-150"
          style={{
            background: `linear-gradient(160deg, hsl(${h} 85% 12%) 0%, hsl(${(h + 55) % 360} 70% 20%) 58%, hsl(${(h + 110) % 360} 80% 9%) 100%)`,
          }}
        >
          <div className="mx-auto max-w-sm">
            <span className="rounded-full border border-white/15 bg-black/25 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.22em] text-white/70 backdrop-blur">
              scroll-linked
            </span>
            <div className="mt-3 text-xl font-black tracking-tight text-white" data-demo-heading="h3">the skyline repaints as you read</div>
            <p className="mt-2 text-[11px] leading-relaxed text-white/60">
              Hue is treated as data: one scroll handler converts scrollTop into a colour angle, and the section repaints
              through the whole journey — from indigo dusk to ember orange.
            </p>
            <div className="mt-4 space-y-2">
              {["read the caption", "watch the hue chip", "hit the bottom call-to-action"].map((t, i) => (
                <div key={t} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 backdrop-blur-sm">
                  <span className="font-mono text-[10px]" style={{ color: `hsl(${(h + i * 36) % 360} 90% 72%)` }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[11px] text-white/75">{t}</span>
                </div>
              ))}
            </div>
            <div
              className="mt-5 rounded-2xl border border-white/10 p-4 text-center backdrop-blur-md"
              style={{
                background: `hsl(${(h + 140) % 360} 80% 55% / .14)`,
                boxShadow: `0 0 60px hsl(${(h + 140) % 360} 90% 60% / .25)`,
              }}
            >
              <p className="text-[11px] font-bold text-white">CTA block — its glow is the same hue variable</p>
              <p className="mt-1 text-[9px] text-white/50">one variable drives sky, chip and glow; nothing else changes.</p>
            </div>
            <p className="mt-6 pb-2 text-center text-[9px] text-white/35">end of scroll · hue {h}° — scroll back up to rewind it</p>
          </div>
        </div>
      </div>
    </div>
  );
}


export function StaggeredListEntrance() {
  const scroller = useRef<HTMLDivElement>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const [run, setRun] = useState(0);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setSeen(true);
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const rows = [
    { name: "surface-aurora.svg", meta: "48KB · vector", dot: "#c4b5fd" },
    { name: "readme-quickstart.mdx", meta: "12KB · docs", dot: "#67e8f9" },
    { name: "theme-aurora.tokens.json", meta: "4KB · tokens", dot: "#6ee7b7" },
    { name: "og-aurora-1200x630.png", meta: "310KB · raster", dot: "#fcd34d" },
    { name: "motion-a11y-checklist.md", meta: "8KB · notes", dot: "#fda4af" },
    { name: "changelog-0.9.2.md", meta: "3KB · release", dot: "#a5b4fc" },
  ];
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0c13]">
      <div className="flex items-center justify-between border-b border-white/6 px-4 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">index rows — scroll to trigger</span>
        <button
          type="button"
          onClick={() => {
            setSeen(false);
            setRun((n) => n + 1);
            window.setTimeout(() => scroller.current?.scrollTo({ top: 9999, behavior: "smooth" }), 60);
            window.setTimeout(() => setSeen(true), 620);
          }}
          className="btn btn-ghost !px-3 !py-1 !text-[10px]"
        >
          ↻ Replay entrance
        </button>
      </div>
      <div ref={scroller} className="relative flex-1 overflow-y-auto px-5 py-4">
        <div className="mx-auto max-w-sm">
          <p className="text-[11px] leading-relaxed text-ink-dim">
            rows wait below the fold. Scroll down and each row rises in sequence — the classic index entrance, driven by
            one IntersectionObserver watching a sentinel.
          </p>
          <div style={{ height: 420 }} aria-hidden />
          <div ref={sentinel} className="h-px" aria-hidden />
          <div className="space-y-2">
            {seen &&
              rows.map((r, i) => (
                <div
                  key={`${run}-${r.name}`}
                  className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/3 px-3.5 py-2.5"
                  style={{ animation: `mf-rise .5s cubic-bezier(.22,.68,.32,1) ${i * 70}ms both` }}
                >
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: r.dot }} />
                  <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-ink">{r.name}</span>
                  <span className="shrink-0 text-[9px] text-ink-faint">{r.meta}</span>
                </div>
              ))}
            {seen && (
              <p className="pt-1 text-center text-[9px] text-ink-faint">
                {rows.length} rows · 70ms cascade · played {run > 0 ? `${run + 1}×` : "once"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

