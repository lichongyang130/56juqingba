"use client";

// Scene set 2 of 7 — OVERLAYS, INPUTS AND FORM CONTROLS.
//
// Loaded on demand: a page that renders one demo downloads the set that
// holds it (plus the shared kit), not the other 191 scenes. The registry in
// ../Demo.tsx is the only thing that knows where each key lives.
import { useEffect, useRef, useState } from "react";
import { useSceneMotion, type DemoProps } from "../scene-kit";
import { COMPONENTS, PROMPTS } from "@/lib/data";
import { LEARN_ARTICLES } from "@/lib/learn";

export function SkeletonShimmer({ speed = 1.8 }: DemoProps) {
  const sp = typeof speed === "number" ? speed : 1.8;
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#0a0c13] px-8">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-white/8 bg-white/4 p-5 shadow-2xl">
        <div className="flex items-center gap-4">
          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white/8">
            <Shimmer speed={sp} />
          </span>
          <div className="flex-1 space-y-2">
            <div className="relative h-3 w-3/5 overflow-hidden rounded-full bg-white/8"><Shimmer speed={sp} /></div>
            <div className="relative h-2.5 w-2/5 overflow-hidden rounded-full bg-white/6"><Shimmer speed={sp} /></div>
          </div>
        </div>
        <div className="relative mt-5 h-3 w-full overflow-hidden rounded-full bg-white/6"><Shimmer speed={sp} /></div>
        <div className="relative mt-2.5 h-3 w-11/12 overflow-hidden rounded-full bg-white/6"><Shimmer speed={sp} /></div>
        <div className="relative mt-2.5 h-3 w-2/3 overflow-hidden rounded-full bg-white/6"><Shimmer speed={sp} /></div>
        <div className="relative mt-5 h-9 w-28 overflow-hidden rounded-xl bg-white/8"><Shimmer speed={sp} /></div>
        <style>{`@keyframes mf-shimmer { from { transform: translateX(-100%) } to { transform: translateX(240%) } }`}</style>
        <div className="mt-4 text-center text-[10px] uppercase tracking-[0.25em] text-ink-faint">profile feed · loading…</div>
      </div>
    </div>
  );
}


function Shimmer({ speed = 1.8 }: { speed?: number }) {
  return (
    <span
      className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/14 to-transparent"
      style={{ animation: `mf-shimmer ${speed}s ease-in-out infinite` }}
      aria-hidden
    />
  );
}


export function ChartCard({ bars = 12 }: DemoProps) {
  const n = typeof bars === "number" ? Math.max(6, Math.min(16, Math.round(bars))) : 12;
  const heights = [38, 62, 45, 78, 58, 92, 66, 84, 50, 72, 96, 88, 54, 70, 61, 90].slice(0, n);
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  // #21 — the bars grow on entry, driven by an observer that sets a CSS
  // transition. Reduced: the chart is drawn at full height with no growth.
  const { reduced } = useSceneMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setOn(true); obs.disconnect(); }
    }, { threshold: 0.35 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced]);
  const visible = reduced || on;
  return (
    <div ref={ref} className="flex h-full w-full items-center justify-center bg-[radial-gradient(80%_100%_at_50%_0%,rgba(52,211,153,0.13),transparent_60%),#0a0c12] px-8">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/4 p-5 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Weekly activity</div>
            <div className="mt-1 text-xl font-black tracking-tight text-white">Build momentum</div>
          </div>
          <span className="chip !border-mint/30 !bg-mint/10 !text-mint">▲ 18.4%</span>
        </div>
        <div className="mt-5 flex h-24 items-end gap-1.5">
          {heights.map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-t-md"
              style={{
                height: visible ? `${h}%` : "4%",
                background: i % 3 === 2 ? "linear-gradient(180deg,#34d399,#0d9488)" : "linear-gradient(180deg,#a78bfa,#5b21b6)",
                transition: `height .9s cubic-bezier(.3,1,.4,1) ${reduced ? 0 : i * 60}ms`,
                opacity: 0.45 + (h / 110),
              }}
            />
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between text-[10px] text-ink-faint">
          <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-violet-400" /> pushes</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-mint" /> deploys</span>
        </div>
      </div>
    </div>
  );
}


const AVATAR_PEOPLE = [
  { n: "Lena K.", hue: 258 },
  { n: "Marco T.", hue: 192 },
  { n: "Aiko S.", hue: 330 },
  { n: "Dev R.", hue: 152 },
  { n: "Noa P.", hue: 28 },
  { n: "Ivy L.", hue: 210 },
];


export function AvatarStack({ count = 5, size = 40 }: DemoProps) {
  const n = typeof count === "number" ? Math.max(2, Math.min(8, Math.round(count))) : 5;
  const s = typeof size === "number" ? Math.max(28, Math.min(72, size)) : 40;
  const people = AVATAR_PEOPLE.slice(0, n);
  const [hot, setHot] = useState<number | null>(null);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[#080a11] px-6">
      <div className="flex items-center pl-4" onMouseLeave={() => setHot(null)}>
        {people.map((p, i) => {
          const spread = hot !== null && i >= hot ? 1 : 0;
          return (
            <div
              key={p.n}
              className="group relative -ml-3 flex items-center"
              onMouseEnter={() => setHot(i)}
              style={{
                marginLeft: i === 0 ? 0 : -12,
                transform: `translateX(${spread * (i - hot!) * 8}px)`,
                transition: "transform .3s cubic-bezier(.34,1.56,.64,1)",
                zIndex: hot === i ? 20 : people.length - i,
              }}
            >
              <span
                className="flex items-center justify-center rounded-full border-2 border-[#0a0b10] font-bold text-white shadow-lg"
                style={{
                  width: s, height: s, fontSize: s * 0.36,
                  background: `linear-gradient(135deg, hsl(${p.hue} 85% 60%), hsl(${(p.hue + 45) % 360} 80% 45%))`,
                  boxShadow: hot === i ? `0 0 0 3px rgba(255,255,255,.12), 0 0 22px hsl(${p.hue} 90% 60% / .5)` : undefined,
                }}
              >
                {p.n.split(" ")[1]?.[0] ?? p.n[0]}
              </span>
              <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-white px-2.5 py-1 text-[10px] font-bold text-black opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                {p.n}
              </span>
            </div>
          );
        })}
        <span className="relative -ml-3 flex items-center justify-center rounded-full border-2 border-[#0a0b10] bg-white/10 font-bold text-ink-dim backdrop-blur" style={{ width: s, height: s, fontSize: s * 0.32 }}>
          +{214}
        </span>
      </div>
      <p className="text-center text-[11px] text-ink-faint">
        hover a face — the stack parts like a crowd · then settle back
      </p>
    </div>
  );
}

/* ------------------------------ OVERLAY WIDGETS (2026-09) ------------------------------ */


const PALETTE_SOURCES = [
  ...COMPONENTS.map((c) => ({ grp: "Components", icon: "▦", label: c.title, meta: `${c.kind} · ${c.slug}`, href: `/components/${c.slug}` })),
  ...PROMPTS.map((p) => ({ grp: "Prompts", icon: "◎", label: p.title, meta: `${p.industry} · ${p.avgFidelity}/100`, href: `/prompts/${p.slug}` })),
  ...LEARN_ARTICLES.map((g) => ({ grp: "Guides", icon: "✎", label: g.title, meta: `${g.level} · ${g.minutes} min`, href: `/learn/${g.slug}` })),
  { grp: "Pages", icon: "⌂", label: "Component library", meta: "browse all", href: "/components" },
  { grp: "Pages", icon: "◉", label: "Backgrounds", meta: "living canvases", href: "/backgrounds" },
  { grp: "Admin", icon: "⚙", label: "Moderation queue", meta: "admin", href: "/admin/moderation" },
];


export function CommandPalette() {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const [flash, setFlash] = useState<string | null>(null);
  const needle = q.trim().toLowerCase();
  const filtered = PALETTE_SOURCES.filter(
    (it) => !needle || it.label.toLowerCase().includes(needle) || it.meta.toLowerCase().includes(needle),
  );
  const groups = [...new Set(filtered.map((f) => f.grp))];
  const open = (href: string) => {
    setFlash(href);
    setQ("");
    setSel(0);
    setTimeout(() => setFlash(null), 1400);
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(70%_90%_at_50%_0%,rgba(139,92,246,0.16),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/12 bg-[#0d0f17]/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
        <div className="flex items-center gap-2.5 border-b border-white/6 px-4 py-3">
          <span className="text-violet-300">⌘</span>
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setSel(0); }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setSel((v) => Math.min(filtered.length - 1, v + 1)); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setSel((v) => Math.max(0, v - 1)); }
              else if (e.key === "Enter") { e.preventDefault(); const hit = filtered[sel]; if (hit) open(hit.href); }
              else if (e.key === "Escape") { e.preventDefault(); setQ(""); setFlash(null); }
            }}
            placeholder={`Search ${COMPONENTS.length} assets, ${PROMPTS.length} prompts, guides…`}
            className="w-full bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
            aria-label="Search the whole library"
          />
          <span className="chip !text-[9px] !py-0.5 text-white/40">esc</span>
        </div>
        <div className="max-h-48 overflow-y-auto p-2">
          {filtered.length === 0 && <p className="px-3 py-5 text-center text-xs text-ink-faint">Nothing matches “{q}” — try “glass”, “pricing”, “admin”.</p>}
          {groups.map((g) => (
            <div key={g}>
              <div className="px-3 pb-1 pt-2 text-[9px] font-bold uppercase tracking-[0.25em] text-ink-faint">{g}</div>
              {filtered.filter((f) => f.grp === g).map((it) => {
                const idx = filtered.indexOf(it);
                return (
                  <button
                    key={it.href + it.label}
                    type="button"
                    onMouseEnter={() => setSel(idx)}
                    onClick={() => open(it.href)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); open(it.href); } }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-1.5 text-left text-[13px] transition-colors ${
                      sel === idx ? "bg-white/10 text-white" : "text-ink-dim"
                    }`}
                  >
                    <span className="w-4 text-center text-violet-300">{it.icon}</span>
                    <span className="flex-1 truncate font-medium">{it.label}</span>
                    <span className="shrink-0 text-[9px] text-ink-faint">{it.meta}</span>
                    {sel === idx && <span className="text-[9px] text-white/35">↵</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 border-t border-white/6 px-4 py-2 text-[9px] text-ink-faint">
          {flash ? (
            <span className="font-bold text-violet-300">↵ would open {flash}</span>
          ) : (
            <>
              <span><kbd className="rounded bg-white/8 px-1">↑</kbd><kbd className="ml-0.5 rounded bg-white/8 px-1">↓</kbd> navigate</span>
              <span><kbd className="rounded bg-white/8 px-1">↵</kbd> open</span>
              <span className="ml-auto">searches the real catalog</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


const TOAST_POOL: { text: string; tone: number; kind: "ok" | "undo" | "info" }[] = [
  { text: "Build passed · 3.2s", tone: 152, kind: "ok" },
  { text: "Wipe Reveal copied to clipboard", tone: 262, kind: "info" },
  { text: "Changed 3 theme tokens — undo?", tone: 32, kind: "undo" },
  { text: "New run log: 3/3 models clean", tone: 152, kind: "ok" },
  { text: `Theme applied to ${COMPONENTS.length} assets`, tone: 262, kind: "info" },
];


interface ToastItem {
  id: number;
  text: string;
  tone: number;
  kind: "ok" | "undo" | "info";
  undone?: boolean;
}


export function ToastStack({ time = 4 }: DemoProps) {
  const ttl = typeof time === "number" ? Math.max(1, Math.min(10, time)) * 1000 : 4000;
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);
  const push = () => {
    const src = TOAST_POOL[idRef.current % TOAST_POOL.length];
    const id = ++idRef.current;
    const item: ToastItem = { id, text: src.text, tone: src.tone, kind: src.kind };
    setToasts((prev) => [...prev.slice(-2), item]);
    window.setTimeout(() => dismiss(id), ttl);
  };
  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));
  const undo = (id: number) =>
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, text: "✓ Tokens restored", tone: 152, kind: "ok", undone: true } : t)));
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[radial-gradient(60%_80%_at_80%_100%,rgba(34,211,238,0.12),transparent_60%),#0a0c13]">
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300/70">Toast queue · auto-dismiss + undo</span>
        <span className="chip !text-[9px] uppercase">{toasts.length}/3 on screen</span>
      </div>
      <div className="relative flex flex-1 items-center justify-center">
        <button type="button" onClick={push} className="btn btn-primary !px-5 !py-2.5 text-xs">
          Ping a toast
        </button>
      </div>
      <div className="pointer-events-none absolute inset-x-4 bottom-4 flex flex-col items-stretch gap-2 sm:items-end" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto w-full max-w-xs overflow-hidden rounded-xl border border-white/12 bg-[#0d0f17]/95 shadow-2xl backdrop-blur-md"
            style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,.1), 0 12px 30px -10px hsl(${t.tone} 80% 55% / .4)`, animation: "mf-toast-in .3s cubic-bezier(.34,1.56,.64,1) both" }}
          >
            <div className="flex items-center gap-2.5 py-2.5 pl-3 pr-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px]" style={{ background: `hsl(${t.tone} 85% 60% / .2)`, color: `hsl(${t.tone} 90% 72%)` }}>
                {t.kind === "undo" && !t.undone ? "↶" : "✓"}
              </span>
              <span className="min-w-0 flex-1 truncate text-xs font-medium text-white">{t.text}</span>
              {t.kind === "undo" && !t.undone && (
                <button type="button" onClick={() => undo(t.id)} className="rounded-md px-2 py-1 text-[10px] font-bold text-cyan-200 transition-colors hover:bg-white/10">
                  Undo
                </button>
              )}
              <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss notification" className="flex h-5 w-5 items-center justify-center rounded-md text-ink-faint transition-colors hover:bg-white/10 hover:text-ink">
                ✕
              </button>
            </div>
            {/* countdown bar */}
            <span aria-hidden className="block h-0.5 w-full overflow-hidden bg-white/5">
              <span className="block h-full" style={{ background: `hsl(${t.tone} 90% 65%)`, animation: `mf-shrink ${ttl}ms linear forwards` }} />
            </span>
          </div>
        ))}
      </div>
      <style>{`@keyframes mf-toast-in { from { opacity: 0; transform: translateY(14px) scale(.97) } }
@keyframes mf-shrink { from { width: 100% } to { width: 0% } }`}</style>
    </div>
  );
}


export function SheetMenu() {
  const [open, setOpen] = useState(true);
  const navs = ["Home", "Library", "AI Prompts", "Lab", "Pricing"];
  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(70%_100%_at_50%_0%,rgba(244,114,182,0.14),transparent_60%),#0a0c13] px-6">
      {/* phone frame */}
      <div className="relative h-[280px] w-[190px] overflow-hidden rounded-[26px] border border-white/15 bg-[#0b0d14] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.85)]">
        <div className="flex items-center justify-between px-4 pb-2 pt-4">
          <span className="text-[11px] font-black tracking-tight text-white">Motif</span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex h-7 w-7 flex-col items-center justify-center gap-[5px] rounded-lg border border-white/10 bg-white/5"
          >
            <span className="h-px w-3.5 bg-white/80" />
            <span className="h-px w-3.5 bg-white/80" />
            <span className="h-px w-3.5 bg-white/80" />
          </button>
        </div>
        <div className="px-4">
          <div className="h-2 w-20 rounded-full bg-white/20" />
          <div className="mt-2 h-2 w-14 rounded-full bg-white/8" />
          <div className="mt-4 space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-2 rounded-xl border border-white/6 bg-white/3 p-2">
                <span className="h-6 w-6 rounded-lg" style={{ background: `linear-gradient(135deg, hsl(${200 + i * 90} 80% 60% / .6), hsl(${(200 + i * 90 + 50) % 360} 80% 50% / .3))` }} />
                <span className="h-1.5 w-16 rounded-full bg-white/15" />
              </div>
            ))}
          </div>
        </div>

        {/* backdrop under the sheet */}
        {open && (
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 z-0 cursor-default"
            style={{ background: "rgba(0,0,0,0)" }}
            tabIndex={-1}
          />
        )}
        {/* bottom sheet */}
        <div
          className={`absolute inset-x-0 bottom-0 z-10 rounded-t-2xl border-t border-white/12 bg-[#0d0f17]/98 backdrop-blur-xl transition-transform duration-300 ${
            open ? "translate-y-0" : "translate-y-full"
          }`}
          style={{ transitionTimingFunction: "cubic-bezier(.34,1.4,.4,1)" }}
        >
          <div className="mx-auto mt-2 h-1 w-8 rounded-full bg-white/15" />
          <div className="px-3 pb-3 pt-2">
            {navs.map((nv) => (
              <button
                key={nv}
                type="button"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[12px] font-semibold text-white/85 transition-colors hover:bg-white/6 hover:text-white"
              >
                {nv}
                <span className="text-white/25">›</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="ml-6 hidden max-w-[170px] sm:block">
        <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink-faint">Bottom sheet</div>
        <div className="mt-2 text-base font-black leading-tight text-white">Tap the ☰ to open, tap a row to close</div>
        <p className="mt-2 text-[10px] leading-relaxed text-ink-dim">
          Mobile nav pattern with a springy sheet — draggable handle &amp; backdrop included in the code.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------ WAVE 4 SCENES (2026-09) ------------------------------ */


export function SegmentedControl({ count = 3 }: DemoProps) {
  const pool = ["Essential", "Pro", "Scale", "Enterprise"];
  const n = typeof count === "number" ? Math.max(2, Math.min(5, Math.round(count))) : 3;
  const opts = pool.slice(0, n);
  const [sel, setSel] = useState(1);
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(34,211,238,0.13),transparent_60%),#08090f] px-6">
      <div className="relative flex items-center rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-md" style={{ gap: 2 }}>
        {opts.map((o, i) => {
          const active = sel === i;
          return (
            <button
              key={o}
              type="button"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setSel(i)}
              aria-pressed={active}
              className="relative z-10 rounded-xl px-5 py-2.5 text-sm font-bold transition-colors"
              style={{ color: active ? "#fff" : hover === i ? "#d7dae3" : "#8a93a6" }}
            >
              {o}
            </button>
          );
        })}
        {/* sliding thumb */}
        <span
          className="absolute rounded-xl border border-white/20 bg-white/12 shadow-[0_0_20px_rgba(34,211,238,0.25)]"
          aria-hidden
          style={{
            top: 6, bottom: 6, width: `calc((100% - 12px) / ${n})`,
            left: `calc(6px + ${sel} * (100% - 12px) / ${n})`,
            transition: "left .3s cubic-bezier(.65,0,.25,1)",
          }}
        />
      </div>
      <div className="flex items-center gap-2 text-xs text-ink-dim">
        <span className="chip !text-[10px] uppercase tracking-wider text-cyan-200/70">selected</span>
        <span className="font-mono text-cyan-200/90">{opts[sel]}</span>
        <span className="text-ink-faint">— tap to slide · segmented control</span>
      </div>
    </div>
  );
}


const NOTIFICATIONS = [
  { who: "lena.dev", text: "left a like on Aurora Veil", when: "2m", tone: 258 },
  { who: "Prompt runner", text: "GLM-4.6 finished · fidelity 94/100", when: "14m", tone: 192 },
  { who: "studio.noir", text: "published a new template", when: "1h", tone: 330 },
];


export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(NOTIFICATIONS.length);
  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(60%_80%_at_50%_110%,rgba(244,114,182,0.13),transparent_60%),#0a0c13] px-6">
      <div className="relative w-full max-w-sm">
        {/* fake app header */}
        <div className="flex items-center justify-between rounded-t-2xl border border-white/10 bg-white/4 px-4 py-3 backdrop-blur-sm">
          <span className="text-sm font-black tracking-tight text-white">Motif Mail</span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={`Notifications, ${unread} unread`}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/6 text-base transition-all hover:bg-white/10"
            >
              🔔
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[9px] font-black text-white">
                  {unread}
                </span>
              )}
            </button>
            {open && (
              <>
                <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="fixed inset-0 cursor-default" tabIndex={-1} />
                <div
                  className="absolute right-0 z-20 mt-2 w-72 origin-top-right overflow-hidden rounded-2xl border border-white/12 bg-[#0d0f17]/98 shadow-2xl backdrop-blur-xl"
                  style={{ animation: "mf-drop .18s ease-out both" }}
                >
                  <style>{`@keyframes mf-drop { from { opacity: 0; transform: translateY(-6px) scale(.98) } }`}</style>
                  <div className="flex items-center justify-between border-b border-white/6 px-4 py-2.5">
                    <span className="text-xs font-bold text-ink">Notifications</span>
                    <button
                      type="button"
                      onClick={() => setUnread(0)}
                      className="text-[10px] font-semibold text-violet-300 hover:text-violet-200"
                    >
                      Mark all read
                    </button>
                  </div>
                  <ul className="divide-y divide-white/5">
                    {NOTIFICATIONS.map((nt, i) => (
                      <li key={nt.text} className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-white/4">
                        <span
                          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white"
                          style={{ background: `linear-gradient(135deg, hsl(${nt.tone} 85% 60%), hsl(${(nt.tone + 50) % 360} 80% 45%))` }}
                        >
                          {nt.who[0].toUpperCase()}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[12px] leading-snug text-ink-dim">
                            <b className="text-ink">{nt.who}</b> {nt.text}
                          </span>
                          <span className="mt-0.5 block text-[10px] text-ink-faint">{nt.when} ago{i < unread ? " · unread" : ""}</span>
                        </span>
                        {i < unread && <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />}
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-white/6 px-4 py-2 text-center text-[10px] font-semibold text-ink-faint">See all activity</div>
                </div>
              </>
            )}
          </div>
        </div>
        {/* pretend inbox rows */}
        <div className="divide-y divide-white/4 rounded-b-2xl border border-t-0 border-white/10 bg-white/2 p-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 px-2 py-2.5">
              <span className="h-8 w-8 rounded-xl" style={{ background: `linear-gradient(135deg, hsl(${200 + i * 70} 75% 60% / .5), hsl(${(200 + i * 70 + 40) % 360} 80% 50% / .2))` }} />
              <div className="flex-1 space-y-1.5">
                <div className="h-1.5 w-4/5 rounded-full bg-white/12" />
                <div className="h-1.5 w-3/5 rounded-full bg-white/6" />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-[10px] text-ink-faint">click the bell — unread badge, mark-all-read, aria-expanded wiring</p>
      </div>
    </div>
  );
}


const LONG_FEED = Array.from({ length: 24 }).map((_, i) => ({
  t: `Post ${String(i + 1).padStart(2, "0")}`,
  h: 12 + ((i * 37) % 40),
  c: 180 + i * 14,
}));


export function ScrollProgress({ thickness = 6 }: DemoProps) {
  const th = typeof thickness === "number" ? Math.max(2, Math.min(12, Math.round(thickness))) : 6;
  const scroller = useRef<HTMLDivElement>(null);
  const [prog, setProg] = useState(0);
  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setProg(max > 0 ? el.scrollTop / max : 0);
  };
  return (
    <div className="relative flex h-full w-full flex-col bg-[#0a0c13]">
      {/* progress rail pinned to the stage's fake window */}
      <div className="relative z-10 flex items-center gap-2 border-b border-white/6 bg-[#0d1017]/95 px-4 py-2 backdrop-blur">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">Article · scroll to read</span>
        <span className="ml-auto font-mono text-[10px] text-cyan-200/80">{Math.round(prog * 100)}%</span>
        <span
          className="block rounded-full bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-300"
          aria-hidden
          style={{ height: th, width: "100%", maxWidth: 90, boxShadow: "0 0 12px rgba(139,92,246,.4)" }}
        >
          <span className="block h-full rounded-full bg-white/20" style={{ width: `${prog * 100}%` }} />
        </span>
      </div>
      <div ref={scroller} onScroll={onScroll} className="relative flex-1 overflow-y-auto px-5 py-4">
        <div className="mx-auto max-w-sm space-y-3">
          <div className="h-2.5 w-3/4 rounded-full bg-white/20" />
          <div className="h-2 w-1/2 rounded-full bg-white/8" />
          {LONG_FEED.map((f) => (
            <div key={f.t} className="rounded-xl border border-white/6 bg-white/3 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-ink-dim">{f.t}</span>
                <span className="text-[9px] text-ink-faint">reading time · {f.c}s</span>
              </div>
              <div className="mt-2 space-y-1.5">
                <div className="h-1.5 w-full rounded-full bg-white/10" />
                <div className="h-1.5 w-4/5 rounded-full bg-white/6" style={{ height: f.h > 30 ? 3 : undefined }} />
              </div>
            </div>
          ))}
          <p className="py-3 text-center text-[10px] text-ink-faint">— scroll inside this window —</p>
        </div>
      </div>
      <div className="absolute inset-y-0 right-0 top-0 z-0 flex w-1 flex-col bg-white/4">
        <div className="rounded-full bg-gradient-to-b from-violet-400 to-cyan-300 transition-[height] duration-75" style={{ height: `${prog * 100}%`, boxShadow: "0 0 10px rgba(139,92,246,.5)" }} />
      </div>
    </div>
  );
}


const QUOTES = [
  { q: "The only library where the demo isn't lying. What you see is what you copy.", who: "Lena K.", role: "Founder · linnea.dev", tone: 258 },
  { q: "I stopped screenshotting other people's heroes. Everything I need is here, themed to my brand in seconds.", who: "Marco T.", role: "Design engineer", tone: 192 },
  { q: "The prompt run logs are genius — I pick the model with the highest score and it just works.", who: "Aiko S.", role: "Solo builder", tone: 330 },
];


export function TestimonialRotator({ speed = 5 }: DemoProps) {
  const sp = typeof speed === "number" ? Math.max(2, Math.min(14, speed)) * 1000 : 5000;
  const [i, setI] = useState(0);
  // #22 — one quote, held. Reduced: the rotation stops on the first quote
  // instead of advancing every ${sp}ms.
  const { reduced } = useSceneMotion();
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setI((v) => (v + 1) % QUOTES.length), sp);
    return () => clearInterval(t);
  }, [sp, reduced]);
  const q = QUOTES[reduced ? 0 : i];
  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(70%_90%_at_50%_0%,rgba(167,139,250,0.15),transparent_60%),#080a11] px-6">
      <div className="w-full max-w-md text-center">
        <div className="flex items-center justify-center gap-1 text-violet-300">
          {Array.from({ length: 5 }).map((_, s) => (
            <span key={s} className="text-sm">★</span>
          ))}
        </div>
        <blockquote
          key={i}
          className="mt-4 text-lg font-semibold leading-snug tracking-tight text-white md:text-xl"
          style={{ animation: "mf-rise .4s cubic-bezier(.16,1,.3,1) both" }}
        >
          “{q.q}”
        </blockquote>
        <div key={`${i}-who`} className="mt-4 flex items-center justify-center gap-2.5" style={{ animation: "mf-rise .4s .06s cubic-bezier(.16,1,.3,1) both" }}>
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-black text-white"
            style={{ background: `linear-gradient(135deg, hsl(${q.tone} 85% 60%), hsl(${(q.tone + 50) % 360} 80% 45%))` }}
          >
            {q.who[0]}
          </span>
          <span className="text-left">
            <span className="block text-xs font-bold text-ink">{q.who}</span>
            <span className="block text-[10px] text-ink-faint">{q.role}</span>
          </span>
        </div>
        <div className="mt-5 flex items-center justify-center gap-2">
          <button type="button" aria-label="Previous quote" onClick={() => setI((v) => (v - 1 + QUOTES.length) % QUOTES.length)} className="btn btn-quiet !h-7 !w-7 !rounded-full !p-0 text-xs">←</button>
          <div className="flex gap-1.5">
            {QUOTES.map((_, d) => (
              <button
                key={d} type="button" aria-label={`Quote ${d + 1}`} onClick={() => setI(d)}
                className={`h-1.5 rounded-full transition-all ${d === i ? "w-5 bg-violet-300" : "w-1.5 bg-white/20 hover:bg-white/35"}`}
              />
            ))}
          </div>
          <button type="button" aria-label="Next quote" onClick={() => setI((v) => (v + 1) % QUOTES.length)} className="btn btn-quiet !h-7 !w-7 !rounded-full !p-0 text-xs">→</button>
        </div>
        <p className="mt-3 text-[10px] text-ink-faint">auto-rotates every {Math.round(sp / 1000)}s · pauses nothing, respects readers</p>
      </div>
    </div>
  );
}


const COUNTDOWN_TOTAL_S = 2 * 86400 + 7 * 3600 + 22 * 60 + 19;

const COUNTDOWN_ENDS_AT = Date.now() + COUNTDOWN_TOTAL_S * 1000;


export function CountdownDrop() {
  const [left, setLeft] = useState(COUNTDOWN_TOTAL_S);
  // #23 — a countdown is information, not decoration, so the numbers keep
  // ticking under reduced motion; what stops is the per-digit flip, which the
  // stylesheet would collapse anyway. The scene says so where the reader can
  // see it, rather than leaving the choice to a global rule they cannot see.
  const { reduced } = useSceneMotion();
  useEffect(() => {
    const t = setInterval(() => {
      const rem = Math.max(0, Math.round((COUNTDOWN_ENDS_AT - Date.now()) / 1000));
      setLeft(rem);
      if (rem === 0) clearInterval(t);
    }, 1000);
    return () => clearInterval(t);
  }, []);
  const d = Math.floor(left / 86400);
  const h = Math.floor((left % 86400) / 3600);
  const m = Math.floor((left % 3600) / 60);
  const s = left % 60;
  const cells = [
    { v: d, l: "days" }, { v: h, l: "hrs" }, { v: m, l: "min" }, { v: s, l: "sec" },
  ];
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-[radial-gradient(70%_100%_at_50%_100%,rgba(34,211,238,0.16),transparent_62%),#07080d] px-6">
      <div className="text-center">
        <div className="chip !mb-2 !text-[9px] uppercase tracking-[0.3em] text-cyan-200/70">DROP 004 · limited run</div>
        <div className="text-3xl font-black tracking-tight text-white md:text-4xl">The 004 ships in</div>
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        {cells.map((c, idx) => (
          <div key={c.l} className="flex items-center gap-2 md:gap-3">
            <div className="relative flex h-16 w-16 flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/12 bg-white/5 backdrop-blur-md md:h-20 md:w-20" style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,.15)" }}>
              <span
                key={c.v}
                className="text-2xl font-black tabular-nums text-white md:text-4xl"
                style={{ animation: reduced ? undefined : "mf-flipin .4s cubic-bezier(.16,1,.3,1) both" }}
              >
                {String(c.v).padStart(2, "0")}
              </span>
              <style>{`@keyframes mf-flipin { from { opacity: 0; transform: translateY(-10px) } }`}</style>
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/40 md:text-[9px]">{c.l}</span>
            </div>
            {idx < cells.length - 1 && <span className="text-lg font-black text-white/30 md:text-2xl">:</span>}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="btn btn-primary !px-6 !py-2.5 text-xs">Notify me</span>
        <span className="text-[10px] text-ink-faint">live countdown · 60fps · no deps</span>
      </div>
    </div>
  );
}


const TERM_LINES = [
  { t: "$ npx create-motif --template saas", c: "text-emerald-300/90" },
  { t: "✓ scaffolded in 2.4s · 14 files", c: "text-white/70" },
  { t: "$ motif add aurora-veil", c: "text-emerald-300/90" },
  { t: "✓ asset installed (MIT · zero deps)", c: "text-white/70" },
  { t: "$ motif test prompt dark-saas-launch", c: "text-emerald-300/90" },
  { t: "claude ······ 95/100 ✓ clean", c: "text-violet-300/90" },
  { t: "codex ········ 91/100 ✓ clean", c: "text-cyan-300/90" },
  { t: "glm-4.6 ······· 90/100 ⚠ 1 fix", c: "text-pink-300/80" },
];


export function TerminalHero({ speed = 34 }: DemoProps) {
  const sp = typeof speed === "number" ? Math.max(12, Math.min(140, Math.round(speed))) : 34;
  const joined = TERM_LINES.map((l) => l.t).join("\n");
  const [count, setCount] = useState(0);
  const done = count >= joined.length;
  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => setCount((c) => c + 1), sp);
    return () => clearTimeout(t);
  }, [count, done, sp]);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setCount(0), 4200);
    return () => clearTimeout(t);
  }, [done]);
  // build displayed segments
  const typed = joined.slice(0, count);
  const parts = typed.split("\n");
  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(60%_90%_at_50%_0%,rgba(139,92,246,0.16),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2 border-b border-white/8 bg-[#0d0f17] px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-[10px] font-mono text-ink-faint">motif — zsh</span>
          <span className="ml-auto text-[9px] font-bold uppercase tracking-widest text-violet-300/70">dev workflow</span>
        </div>
        <div className="h-44 overflow-hidden bg-[#07080d] p-4 font-mono text-[11.5px] leading-[1.8]">
          {parts.map((ln, idx) => {
            const base = TERM_LINES[idx];
            if (!base) return null;
            return (
              <div key={idx} className={base.c}>
                {ln}
                {idx === parts.length - 1 && !done && <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse-soft bg-cyan-300 align-middle" />}
              </div>
            );
          })}
          {done && <span className="inline-block h-3 w-1.5 animate-pulse-soft bg-cyan-300" />}
          <span className="sr-only" role="status">{done ? "Command sequence finished" : "Typing command sequence"}</span>
        </div>
        <p className="mt-2 text-center text-[10px] text-ink-faint">a self-typing terminal story — the AI-tool landing motif, without a video file</p>
      </div>
    </div>
  );
}


const POLAROID_SHOTS = [
  { label: "coast / 01", grad: "linear-gradient(135deg,#8b5cf6,#6366f1 55%,#0ea5e9)" },
  { label: "alpine / 02", grad: "linear-gradient(135deg,#34d399,#0ea5e9 60%,#6366f1)" },
  { label: "desert / 03", grad: "linear-gradient(135deg,#fbbf24,#f472b6 60%,#8b5cf6)" },
  { label: "forest / 04", grad: "linear-gradient(135deg,#f472b6,#a78bfa 55%,#34d399)" },
  { label: "night / 05", grad: "linear-gradient(135deg,#6366f1,#0ea5e9 60%,#34d399)" },
  { label: "fields / 06", grad: "linear-gradient(135deg,#f59e0b,#ef4444 55%,#a78bfa)" },
  { label: "tide / 07", grad: "linear-gradient(135deg,#06b6d4,#8b5cf6 60%,#f472b6)" },
];


export function PolaroidStack({ count = 4 }: DemoProps) {
  const n = typeof count === "number" ? Math.max(2, Math.min(7, Math.round(count))) : 4;
  const shots = POLAROID_SHOTS.slice(0, n);
  const [order, setOrder] = useState(shots.map((_, i) => i));
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const bring = (id: number) => setOrder((o) => [id, ...o.filter((x) => x !== id)]);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(244,114,182,0.12),transparent_62%),#0a0b10] px-6">
      <div className="relative h-52 w-64">
        {order.map((shotIdx, pos) => {
          const shot = shots[shotIdx];
          const isTop = pos === 0;
          const rot = (shotIdx - (n - 1) / 2) * 9 + (pos % 2 === 0 ? 2 : -2);
          const lifted = hoverIdx === shotIdx;
          return (
            <button
              key={shotIdx}
              type="button"
              aria-label={`Bring ${shot.label} to front`}
              onMouseEnter={() => setHoverIdx(shotIdx)}
              onMouseLeave={() => setHoverIdx(null)}
              onClick={() => bring(shotIdx)}
              className="absolute inset-0 origin-bottom rounded-[6px] bg-white p-2 pb-8 text-left shadow-[0_18px_40px_-16px_rgba(0,0,0,0.8)] transition-transform duration-300"
              style={{
                transform: `rotate(${rot}deg) ${isTop ? "translateY(-6px) scale(1.06)" : ""} ${lifted ? "translateY(-12px)" : ""}`,
                zIndex: isTop ? 30 : pos + 1,
                filter: !isTop && hoverIdx !== null && !lifted ? "brightness(.75)" : undefined,
                transitionTimingFunction: "cubic-bezier(.34,1.4,.4,1)",
              }}
            >
              <span className="block h-full w-full rounded-[3px]" style={{ background: shot.grad }} />
              <span className="absolute bottom-2.5 left-3 text-[10px] font-semibold tracking-wide text-black/70">{shot.label}</span>
            </button>
          );
        })}
      </div>
      <p className="max-w-xs text-center text-[10px] leading-relaxed text-ink-faint">
        hover lifts a photo · <b className="text-ink-dim">click brings it to the front</b> — a gallery that feels like a table
      </p>
    </div>
  );
}


const TEAM_MEMBERS = [
  { n: "Lena K.", r: "Founder / code", hue: 258 },
  { n: "Marco T.", r: "Motion design", hue: 192 },
  { n: "Aiko S.", r: "Systems", hue: 330 },
  { n: "Dev R.", r: "Infra", hue: 152 },
  { n: "Noa P.", r: "Content", hue: 28 },
  { n: "Ivy L.", r: "Research", hue: 210 },
];


export function TeamSpotlightGrid() {
  const [spot, setSpot] = useState<Record<number, { x: number; y: number }>>({});
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 bg-[radial-gradient(70%_90%_at_50%_0%,rgba(34,211,238,0.12),transparent_60%),#0a0c13] px-6">
      <div className="text-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink-faint">The people behind the pixels</span>
      </div>
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        {TEAM_MEMBERS.map((m, i) => {
          const s = spot[i];
          return (
            <div
              key={m.n}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => { setHovered((h) => (h === i ? null : h)); setSpot((p) => { const c = { ...p }; delete c[i]; return c; }); }}
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setSpot((p) => ({ ...p, [i]: { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 } }));
              }}
              className="group relative flex cursor-default flex-col items-center overflow-hidden rounded-2xl border border-white/8 bg-white/4 px-3 py-5 text-center transition-transform duration-200 hover:scale-[1.03]"
            >
              {s && (
                <span
                  className="pointer-events-none absolute inset-0"
                  style={{ background: `radial-gradient(120px circle at ${s.x}% ${s.y}%, hsl(${m.hue} 85% 65% / .28), transparent 65%)` }}
                />
              )}
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-black text-white transition-shadow duration-200"
                style={{
                  background: `linear-gradient(135deg, hsl(${m.hue} 85% 60%), hsl(${(m.hue + 50) % 360} 80% 45%))`,
                  boxShadow: hovered === i ? `0 0 0 3px hsl(${m.hue} 85% 65% / .3), 0 6px 18px -4px hsl(${m.hue} 85% 55% / .5)` : "none",
                }}
              >
                {m.n.split(" ")[1]?.[0] ?? m.n[0]}
              </span>
              <div className="mt-2.5 text-xs font-bold text-white">{m.n}</div>
              <div className="mt-0.5 text-[9px] font-medium uppercase tracking-wider text-white/40">{m.r}</div>
            </div>
          );
        })}
      </div>
      <p className="text-center text-[10px] text-ink-faint">per-card cursor spotlight — a team grid that feels lit, not flat</p>
    </div>
  );
}



const COMBO_POOL = [
  { v: "wipe-reveal", l: "Wipe Reveal", m: "section · CSS only" },
  { v: "aurora-veil", l: "Aurora Veil", m: "background · layered" },
  { v: "tilt-card", l: "Tilt Card", m: "element · pointer" },
  { v: "terminal-hero", l: "Terminal Hero", m: "section · typed" },
  { v: "counter-stats", l: "Counter Stats", m: "animated · data" },
  { v: "sheet-menu", l: "Sheet Menu", m: "element · mobile" },
];


export function ComboBox() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [act, setAct] = useState(0);
  const [sel, setSel] = useState<string | null>(COMBO_POOL[0].v);
  const needle = q.trim().toLowerCase();
  const list = COMBO_POOL.filter(
    (o) => !needle || o.l.toLowerCase().includes(needle) || o.m.includes(needle) || o.v.includes(needle),
  );
  const pick = (v: string) => { setSel(v); setQ(""); setOpen(false); setAct(0); };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(139,92,246,0.14),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.24em] text-violet-300/70">
          <span>Add to build</span>
          <span className="normal-case tracking-normal text-ink-faint">{list.length} components</span>
        </div>
        <div className="relative">
          <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setOpen(true); setAct(0); }}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onKeyDown={(e) => {
              const len = Math.max(1, list.length);
              if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setAct((a) => (a + 1) % len); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setOpen(true); setAct((a) => (a - 1 + len) % len); }
              else if (e.key === "Enter") { e.preventDefault(); const hit = list[act] ?? list[0]; if (hit) pick(hit.v); }
              else if (e.key === "Escape") setOpen(false);
            }}
            role="combobox"
            aria-expanded={open}
            aria-controls="cb-list"
            aria-label="Search the component library"
            aria-activedescendant={open && list[act] ? `cb-${list[act].v}` : undefined}
            className="input !rounded-xl !py-2.5 !pl-10 !pr-9"
            placeholder="Find a component…"
          />
          <svg className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-ink-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {/* The listbox stays in the document and is hidden when closed: an
              aria-controls that points at an element which is not there is a
              reference to nothing, and the markup pass fails on one. */}
          <ul
            id="cb-list"
            role="listbox"
            aria-label="Components"
            hidden={!open}
            className="absolute inset-x-0 top-[calc(100%+6px)] z-10 overflow-hidden rounded-xl border border-white/10 bg-[#0d0f17] py-1 shadow-2xl"
            style={{ animation: "mf-growin .14s ease-out both" }}
          >
              {list.length === 0 && <li className="px-3.5 py-3 text-xs text-ink-faint">No matches — try “aurora” or “card”.</li>}
              {list.map((o, i) => (
                <li
                  key={o.v}
                  id={`cb-${o.v}`}
                  role="option"
                  aria-selected={act === i}
                  onMouseEnter={() => setAct(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(o.v)}
                  className={`flex cursor-pointer items-center justify-between gap-3 px-3.5 py-2 text-sm ${act === i ? "bg-violet-400/12 text-ink" : "text-ink-dim"}`}
                >
                  <span>
                    <span className="font-semibold">{o.l}</span>
                    <span className="ml-2 text-[10px] uppercase tracking-wider text-ink-faint">{o.m}</span>
                  </span>
                  {sel === o.v && <span className="text-violet-300">✓</span>}
                </li>
            ))}
          </ul>
        </div>
        <p className="mt-2 text-[11px] text-ink-faint">↑↓ move · ↵ choose · esc close · typed filtering with a no-match row</p>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="chip !text-[10px] uppercase tracking-wider text-violet-200/70">selected</span>
        <span className="font-mono text-violet-100/90">{COMBO_POOL.find((o) => o.v === sel)?.l ?? "—"}</span>
      </div>
    </div>
  );
}


export function OdometerCounter({ target = 18624 }: DemoProps) {
  const goal = typeof target === "number" ? Math.max(100, Math.min(999999, Math.round(target))) : 18624;
  const [v, setV] = useState(0);
  const done = v >= goal;
  // #24 — the odometer rolls to its target on a 42ms interval. Reduced: the
  // target is printed immediately, which is also what the roll ends on.
  const { reduced } = useSceneMotion();
  useEffect(() => {
    // Reduced: no roll at all — the target is derived at render instead of
    // being counted up into state.
    if (done || reduced) return;
    const per = Math.max(1, Math.round(goal / 110));
    const t = setInterval(
      () => setV((p) => { const n = p + per + Math.round(Math.random() * 3); return n >= goal ? goal : n; }),
      42,
    );
    return () => clearInterval(t);
  }, [done, goal, reduced]);
  const shown = reduced ? goal : v;
  const cells = String(shown).padStart(6, "0").split("");
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[radial-gradient(60%_90%_at_50%_100%,rgba(52,211,153,0.13),transparent_62%),#08090f] px-6">
      <div className="chip !border-mint/25 !bg-mint/10 !text-mint">RUN 07 · copies this month</div>
      <div className="flex items-center gap-1.5" role="img" aria-label={`${shown.toLocaleString("en-US")} copies`}>
        {cells.map((d, i) => (
          <span
            key={i}
            className="relative flex h-12 w-8 items-center justify-center overflow-hidden rounded-lg border border-white/12 bg-black/40 md:h-14 md:w-9"
            style={{ boxShadow: "inset 0 2px 7px rgba(0,0,0,.75), inset 0 -2px 7px rgba(0,0,0,.55)" }}
          >
            <span key={`${i}-${d}`} className="relative flex h-full w-full items-center justify-center font-mono text-xl font-black tabular-nums text-white md:text-2xl" style={{ animation: "mf-roll .18s cubic-bezier(.2,.7,.3,1) both" }}>
              {d}
            </span>
            <span aria-hidden className="pointer-events-none absolute -top-3.5 inset-x-0 flex justify-center font-mono text-lg font-black tabular-nums text-white/25 blur-[1.5px]">{(Number(d) + 9) % 10}</span>
            <span aria-hidden className="pointer-events-none absolute -bottom-3.5 inset-x-0 flex justify-center font-mono text-lg font-black tabular-nums text-white/25 blur-[1.5px]">{(Number(d) + 1) % 10}</span>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2 text-[11px] text-ink-dim">
        {done ? (
          <span className="font-bold text-mint">✓ counted to {v.toLocaleString("en-US")}</span>
        ) : (
          <span className="text-ink-faint">counting… mechanical wheels, no easing shortcut</span>
        )}
      </div>
    </div>
  );
}


export function StarRating() {
  const [rating, setRating] = useState(3.5);
  const [hover, setHover] = useState<number | null>(null);
  const shown = Math.max(0, Math.min(5, hover ?? rating));
  const pct = (shown / 5) * 100;
  const valueFromEvent = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const seg = r.width / 5;
    const i = Math.max(0, Math.min(4, Math.floor((e.clientX - r.left) / seg)));
    const half = e.clientX - r.left - i * seg < seg / 2;
    return i + (half ? 0.5 : 1);
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(251,191,36,0.12),transparent_60%),#08090f] px-6">
      <div className="chip !border-amber-300/25 !bg-amber-400/10 !text-amber-200">rating input · half-star precision</div>
      <div
        role="slider"
        tabIndex={0}
        aria-label="Rate this component"
        aria-valuemin={0}
        aria-valuemax={5}
        aria-valuenow={shown}
        aria-valuetext={`${shown} out of 5 stars`}
        className="relative inline-block cursor-pointer select-none text-[46px] leading-none outline-none"
        onMouseMove={(e) => setHover(valueFromEvent(e))}
        onMouseLeave={() => setHover(null)}
        onClick={(e) => setRating(valueFromEvent(e))}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); setRating((r) => Math.min(5, Math.round((r + 0.5) * 10) / 10)); }
          else if (e.key === "ArrowLeft") { e.preventDefault(); setRating((r) => Math.max(0, Math.round((r - 0.5) * 10) / 10)); }
          else if (e.key === "Home") { e.preventDefault(); setRating(0); }
          else if (e.key === "End") { e.preventDefault(); setRating(5); }
        }}
      >
        <span className="tracking-[0.12em] text-white/12" aria-hidden>★★★★★</span>
        <span className="absolute inset-0 overflow-hidden whitespace-nowrap" style={{ width: `${pct}%` }} aria-hidden>
          <span className="tracking-[0.12em] text-amber-300" style={{ textShadow: "0 0 14px rgba(251,191,36,.45)" }}>★★★★★</span>
        </span>
      </div>
      <div className="flex items-center gap-3 text-xs">
        <span className="font-mono text-amber-100/90">{shown.toFixed(1)} / 5</span>
        <button type="button" onClick={() => setRating(0)} className="rounded-full border border-white/12 px-2.5 py-1 text-[10px] font-semibold text-ink-faint transition-colors hover:border-white/30 hover:text-ink">
          Clear ↺
        </button>
        <span className="text-ink-faint">← hover to preview · click to set · arrows nudge</span>
      </div>
    </div>
  );
}

