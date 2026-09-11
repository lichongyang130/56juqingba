"use client";

// Scene set 3 of 7 — NAVIGATION, FEEDBACK AND STATUS SCREENS.
//
// Loaded on demand: a page that renders one demo downloads the set that
// holds it (plus the shared kit), not the other 191 scenes. The registry in
// ../Demo.tsx is the only thing that knows where each key lives.
import { useEffect, useRef, useState } from "react";
import { useSceneMotion, type DemoProps } from "../scene-kit";
import { COMPONENTS } from "@/lib/data";
import { LEARN_ARTICLES } from "@/lib/learn";

const TAG_POOL = ["motion", "dark", "glass", "svg", "vue", "3d"];


export function TagInput({ limit = 4 }: DemoProps) {
  const lim = typeof limit === "number" ? Math.max(2, Math.min(6, Math.round(limit))) : 4;
  const [tags, setTags] = useState<string[]>(["motion", "glass"]);
  const [val, setVal] = useState("");
  const add = (raw: string) => {
    const t = raw.trim().toLowerCase().replace(/,+$/, "");
    if (!t || tags.includes(t) || tags.length >= lim) return;
    setTags((p) => [...p, t]);
  };
  const remove = (t: string) => setTags((p) => p.filter((x) => x !== t));
  const pool = TAG_POOL.filter((t) => !tags.includes(t));
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(34,211,238,0.12),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-300/70">Filter tags</div>
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-white/10 bg-white/4 p-2 backdrop-blur-md">
          {tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-300/30 bg-cyan-400/10 px-2.5 py-1 text-xs font-semibold text-cyan-100" style={{ animation: "mf-pop .18s cubic-bezier(.34,1.56,.64,1) both" }}>
              {t}
              <button type="button" aria-label={`Remove ${t}`} onClick={() => remove(t)} className="text-cyan-200/60 transition-colors hover:text-white">×</button>
            </span>
          ))}
          <input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(val); setVal(""); }
              else if (e.key === "Backspace" && val === "" && tags.length) remove(tags[tags.length - 1]);
            }}
            placeholder={tags.length >= lim ? "full" : "add…"}
            disabled={tags.length >= lim}
            aria-label="Add a tag"
            className="input min-w-20 flex-1 !rounded-lg !border-transparent !bg-transparent !px-2 !py-1 !text-xs !shadow-none focus:!border-transparent disabled:opacity-40"
          />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-ink-faint">suggested</span>
          {pool.map((t) => (
            <button key={t} type="button" onClick={() => add(t)} className="chip !cursor-pointer !text-[10px] transition-colors hover:!border-cyan-300/40 hover:!text-cyan-100">
              + {t}
            </button>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-ink-faint">
          {tags.length}/{lim} used · Enter or comma adds · backspace removes the last chip
        </p>
      </div>
    </div>
  );
}


export function SliderWithTicks({ initial = 62 }: DemoProps) {
  const iv = typeof initial === "number" ? Math.max(0, Math.min(100, Math.round(initial))) : 62;
  const [v, setV] = useState(iv);
  const [drag, setDrag] = useState(false);
  const ticks = [0, 25, 50, 75, 100];
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-[radial-gradient(60%_90%_at_50%_100%,rgba(139,92,246,0.13),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-baseline justify-between">
          <span className="text-xs font-semibold text-ink-dim">Reveal threshold</span>
          <span className="font-mono text-sm font-extrabold text-violet-100">{v}%</span>
        </div>
        <div className="relative pt-9">
          {drag && (
            <span
              className={`pointer-events-none absolute top-0 -translate-x-1/2 rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold ${drag ? "border-violet-300/50 bg-violet-500/90 text-white" : "border-white/15 bg-black/70 text-ink"}`}
              style={{ left: `${v}%` }}
            >
              {v}%
            </span>
          )}
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={v}
            aria-label="Reveal threshold percentage"
            onChange={(e) => setV(Number(e.target.value))}
            onPointerDown={() => setDrag(true)}
            onPointerUp={() => setDrag(false)}
            onPointerLeave={() => setDrag(false)}
            className="relative w-full"
          />
          <div className="relative mx-0.5 mt-1.5 h-1.5">
            {ticks.map((t) => (
              <span key={t} aria-hidden className={`absolute top-0 h-1.5 w-px -translate-x-1/2 ${t <= v ? "bg-violet-300/70" : "bg-white/20"}`} style={{ left: `${t}%` }} />
            ))}
          </div>
          <div className="mt-1 flex justify-between text-[9px] font-semibold text-ink-faint">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
        <p className="mt-4 text-[11px] text-ink-faint">ticks mark quarter steps · the bubble rides the thumb while you drag</p>
      </div>
    </div>
  );
}


const PERK_OPTS = [
  { id: "tokens", glyph: "◍", t: "Token theming", d: "Restyle via CSS variables." },
  { id: "motion", glyph: "∿", t: "Motion presets", d: "Easings + spring packs." },
  { id: "logs", glyph: "☰", t: "Run logs", d: "Tested on 3 models." },
  { id: "export", glyph: "⇣", t: "Export kit", d: "Figma vars + Tailwind preset." },
];


export function CheckboxCard() {
  const [on, setOn] = useState<string[]>(["tokens"]);
  const toggle = (id: string) => setOn((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const all = on.length === PERK_OPTS.length;
  const toggleAll = () => setOn(all ? [] : PERK_OPTS.map((o) => o.id));
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(52,211,153,0.12),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-mint">Bundle add-ons</span>
          <button type="button" onClick={toggleAll} className="text-[11px] font-semibold text-ink-dim transition-colors hover:text-ink">
            {all ? "Clear all" : "Select all"}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {PERK_OPTS.map((o) => {
            const active = on.includes(o.id);
            return (
              <button
                key={o.id}
                type="button"
                role="checkbox"
                aria-checked={active}
                onClick={() => toggle(o.id)}
                className={`relative rounded-xl border p-3 text-left transition-all duration-200 ${active ? "border-mint/50 bg-mint/10 shadow-[0_0_24px_-8px_rgba(52,211,153,.4)]" : "border-white/8 bg-white/4 hover:border-white/18"}`}
              >
                <span className="flex items-center gap-2">
                  <span className={`text-base ${active ? "text-mint" : "text-ink-faint"}`}>{o.glyph}</span>
                  <span className="text-xs font-bold">{o.t}</span>
                </span>
                <span className={`mt-1 block text-[10px] leading-snug ${active ? "text-mint/80" : "text-ink-faint"}`}>{o.d}</span>
                <span className={`absolute right-2.5 top-2.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border ${active ? "border-mint/60 bg-mint/20" : "border-white/15"}`} aria-hidden>
                  {active && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 12.5 4.5 4.5L19 7.5" style={{ strokeDasharray: 14, strokeDashoffset: 14, animation: "mf-draw .25s ease-out forwards" }} />
                    </svg>
                  )}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-[11px] text-ink-faint">
          {on.length} of {PERK_OPTS.length} selected · a checkbox, not a radio — any mix is fair
        </p>
      </div>
    </div>
  );
}


export function QuantityStepper({ step = "1" }: DemoProps) {
  const st = Math.max(1, Math.min(5, Number(step) || 1));
  const [qty, setQty] = useState(3);
  const [hold, setHold] = useState<1 | -1 | null>(null);
  const clamp = (n: number) => Math.max(1, Math.min(24, n));
  // #25 — press-and-hold repeats on a 110ms interval. Reduced: one step per
  // press, no repeat while the button is held, which is also easier to control.
  const { reduced } = useSceneMotion();
  useEffect(() => {
    if (hold === null || reduced) return;
    const t = setInterval(() => setQty((p) => clamp(p + hold * st)), 110);
    return () => clearInterval(t);
  }, [hold, st, reduced]);
  const stepBtn = (d: 1 | -1) => (
    <button
      type="button"
      aria-label={d === 1 ? "Increase quantity" : "Decrease quantity"}
      disabled={(d === -1 && qty <= 1) || (d === 1 && qty >= 24)}
      onPointerDown={(e) => { e.preventDefault(); setQty((p) => clamp(p + d * st)); setHold(d); }}
      onPointerUp={() => setHold(null)}
      onPointerLeave={() => setHold(null)}
      onPointerCancel={() => setHold(null)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setQty((p) => clamp(p + d * st)); }
      }}
      className="flex h-11 w-11 select-none items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg font-bold text-ink transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
    >
      {d === 1 ? "+" : "−"}
    </button>
  );
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[radial-gradient(60%_90%_at_50%_100%,rgba(244,114,182,0.12),transparent_60%),#08090f] px-6">
      <div className="chip !border-pink-300/25 !bg-pink-400/10 !text-pink-200">quantity stepper · step +{st}</div>
      <div className="flex items-center gap-3">
        {stepBtn(-1)}
        <div className="w-16 text-center">
          <div key={qty} className="text-4xl font-black tabular-nums" style={{ animation: "mf-pop .16s cubic-bezier(.34,1.56,.64,1) both" }}>{qty}</div>
          <div className="text-[9px] uppercase tracking-widest text-ink-faint">tickets</div>
        </div>
        {stepBtn(1)}
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="text-ink-faint">subtotal</span>
        <span className="font-mono text-sm font-extrabold text-pink-100">${qty * 32}</span>
        <span className="chip !text-[9px] uppercase">£32 / ticket</span>
      </div>
      <p className="text-[11px] text-ink-faint">press and hold to repeat · pointer and keyboard both work</p>
    </div>
  );
}


const PLAN_POOL = [
  { n: "Starter", p: 0, d: "Community licence · MIT assets", f: [`${COMPONENTS.length} components`, `${LEARN_ARTICLES.length} Learn guides`, "Community prompts"] },
  { n: "Studio", p: 19, d: "For one solo builder shipping daily", f: ["Everything in Starter", "Prompt run logs + retries", "All Lab exports"] },
  { n: "Team", p: 49, d: "Up to 5 seats, shared library", f: ["Everything in Studio", "Team licence", "Private collections"] },
  { n: "Scale", p: 99, d: "Unlimited seats + component API", f: ["Everything in Team", "Component API", "Token-sync endpoints"] },
];


export function RadioPills({ count = 3 }: DemoProps) {
  const n = typeof count === "number" ? Math.max(2, Math.min(4, Math.round(count))) : 3;
  const opts = PLAN_POOL.slice(0, n);
  const [sel, setSel] = useState(1);
  const cur = opts[Math.min(sel, opts.length - 1)];
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(244,114,182,0.11),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-pink-300/70">Choose a plan</div>
        <fieldset className="flex gap-2" aria-label="Choose a plan">
          {opts.map((o, i) => (
            <label
              key={o.n}
              className={`flex-1 cursor-pointer rounded-xl border px-3 py-2.5 text-center transition-all focus-within:ring-2 focus-within:ring-violet-400/80 ${sel === i ? "border-pink-300/50 bg-pink-400/12" : "border-white/10 bg-white/4 hover:border-white/20"}`}
            >
              <input type="radio" name="plan-demo" value={o.n} checked={sel === i} onChange={() => setSel(i)} className="sr-only" />
              <span className={`block text-xs font-bold ${sel === i ? "text-white" : "text-ink-dim"}`}>{o.n}</span>
              <span className={`mt-0.5 block font-mono text-[10px] ${sel === i ? "text-pink-200" : "text-ink-faint"}`}>${o.p}/mo</span>
            </label>
          ))}
        </fieldset>
        <div key={cur.n} className="mt-3 rounded-xl border border-white/8 bg-black/25 p-4" style={{ animation: "mf-growin .18s ease-out both" }}>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-extrabold">{cur.n}</span>
            <span className="font-mono text-lg font-black text-pink-200">${cur.p}</span>
          </div>
          <p className="mt-0.5 text-[11px] text-ink-dim">{cur.d}</p>
          <ul className="mt-2 space-y-1">
            {cur.f.map((f) => (
              <li key={f} className="flex items-center gap-1.5 text-[11px] text-ink-dim">
                <span className="text-mint">✓</span> {f}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-3 text-[11px] text-ink-faint">role=radiogroup — arrow keys move the check · focus ring is visible</p>
      </div>
    </div>
  );
}



export function AutoGrowTextarea({ budget = 400 }: DemoProps) {
  const bd = typeof budget === "number" ? Math.max(80, Math.min(1200, Math.round(budget))) : 400;
  const [val, setVal] = useState("A launch page that loads in under a second and explains the product in one sentence — dark, glassy, no stock video.");
  const ref = useRef<HTMLTextAreaElement>(null);
  const [sent, setSent] = useState(false);
  const grow = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 168)}px`;
  };
  useEffect(grow, []);
  const left = bd - val.length;
  const tone = left < 0 ? "text-danger" : left < bd * 0.1 ? "text-amber-300" : "text-ink-faint";
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(60%_90%_at_50%_0%,rgba(139,92,246,0.13),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-md">
        <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.24em] text-violet-300/70">
          <span>Pitch the idea</span>
          <span className="normal-case tracking-normal text-ink-faint">auto-grows as you type</span>
        </div>
        <textarea
          ref={ref}
          value={val}
          onChange={(e) => { setVal(e.target.value); grow(); setSent(false); }}
          rows={3}
          maxLength={bd + 80}
          aria-label="Pitch text"
          placeholder="What are you shipping?"
          className="input w-full resize-none !rounded-2xl !py-3.5 leading-relaxed"
        />
        <div className="mt-1.5 flex items-center justify-between text-[11px]">
          <span className={sent ? "font-bold text-mint" : "text-ink-faint"}>
            {sent ? "✓ Sent to the build queue" : "no scrollbar — the box does the scrolling"}
          </span>
          <span className={`font-mono tabular-nums ${tone}`}>{left >= 0 ? `${left} left` : `${-left} over`}</span>
        </div>
        <div className="mt-3">
          <button
            type="button"
            onClick={() => { setSent(true); }}
            disabled={left < 0}
            className="btn btn-primary !w-full !py-2.5 !text-xs disabled:cursor-not-allowed disabled:opacity-40"
          >
            Send pitch
          </button>
        </div>
      </div>
    </div>
  );
}


const DATE_PRESETS = [
  { id: "today", label: "Today", days: 1 },
  { id: "7d", label: "7d", days: 7 },
  { id: "30d", label: "30d", days: 30 },
  { id: "90d", label: "90d", days: 90 },
] as const;


export function DatePresetsPicker() {
  const [preset, setPreset] = useState("30d");
  const [custom, setCustom] = useState({ a: "2026-08-10", b: "2026-09-09" });
  const days = preset === "custom" ? 0 : (DATE_PRESETS.find((p) => p.id === preset)?.days ?? 30);
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const end = new Date();
  const start = preset === "custom" ? new Date(custom.a) : new Date(end.getTime() - days * 864e5);
  const rangeText = `${fmt(start)} — ${fmt(preset === "custom" ? new Date(custom.b) : end)}`;
  const bars = Array.from({ length: 14 }).map((_, i) => 26 + Math.round(Math.sin(i * 1.9 + days / 9) * 16 + Math.cos(i * 0.7) * 10));
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(60%_90%_at_50%_100%,rgba(34,211,238,0.12),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-md">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-300/70">Report window</div>
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-white/8 bg-white/4 p-1.5">
          {DATE_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPreset(p.id)}
              aria-pressed={preset === p.id}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                preset === p.id
                  ? "bg-cyan-400/15 text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,.12)]"
                  : "text-ink-dim hover:text-ink"
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPreset("custom")}
            aria-pressed={preset === "custom"}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              preset === "custom"
                ? "bg-cyan-400/15 text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,.12)]"
                : "text-ink-dim hover:text-ink"
            }`}
          >
            Custom
          </button>
        </div>
        {preset === "custom" && (
          <div className="mt-2 flex items-center gap-2 text-xs" style={{ animation: "mf-growin .15s ease-out both" }}>
            <input type="date" value={custom.a} max={custom.b} aria-label="From date" onChange={(e) => setCustom((p) => ({ ...p, a: e.target.value }))} className="input !py-1.5 !text-xs" />
            <span className="text-ink-faint">→</span>
            <input type="date" value={custom.b} min={custom.a} aria-label="To date" onChange={(e) => setCustom((p) => ({ ...p, b: e.target.value }))} className="input !py-1.5 !text-xs" />
          </div>
        )}
        <div className="mt-3 rounded-xl border border-white/8 bg-black/25 p-4">
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-semibold text-ink">{preset === "custom" ? "Custom range" : `Last ${days} day${days === 1 ? "" : "s"}`}</span>
            <span className="font-mono text-[11px] text-cyan-200/80">{rangeText}</span>
          </div>
          <div className="mt-3 flex h-16 items-end gap-1.5" aria-hidden>
            {bars.map((h, i) => (
              <span key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: `linear-gradient(180deg, hsl(192 90% 65% / .85), hsl(192 70% 40% / .35))` }} />
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-ink-faint">
            <span>{preset === "custom" ? "custom range · compare on export" : "copies per day · daily rollup"}</span>
            <span className="chip !text-[9px] uppercase">updated 4m ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}


export function FileDropZone() {
  const [phase, setPhase] = useState<"idle" | "over" | "busy" | "done">("idle");
  const [file, setFile] = useState<{ name: string; size: string } | null>(null);
  const [pct, setPct] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const started = useRef(false);
  // #26 — the upload progress bar advances on a 90ms interval. Reduced: the
  // bar goes to done in one step, because the crawl is the animation.
  const { reduced } = useSceneMotion();
  useEffect(() => {
    // Reduced motion never reaches "busy": `accept` decides that, so this effect
    // only ever runs for the animated path.
    if (phase !== "busy" || reduced) return;
    started.current = true;
    const t = setInterval(() => {
      setPct((p) => {
        const n = p + 7 + Math.round(Math.random() * 6);
        if (n >= 100) {
          clearInterval(t);
          setTimeout(() => setPhase("done"), 250);
          return 100;
        }
        return n;
      });
    }, 90);
    return () => clearInterval(t);
  }, [phase, reduced]);
  const accept = (f?: File | null) => {
    const name = f?.name ?? "motif-build-spec.json";
    const size = f ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : "1.2 MB";
    setFile({ name, size });
    setPct(0);
    // #26 — the crawl is the animation, so under reduced motion the upload is
    // simply complete: decided here, where the work starts, rather than by an
    // effect correcting the state a frame later.
    setPhase(reduced ? "done" : "busy");
    if (reduced) setPct(100);
  };
  const reset = () => { setPhase("idle"); setFile(null); setPct(0); started.current = false; };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(60%_90%_at_50%_0%,rgba(52,211,153,0.12),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-sm">
        <input ref={inputRef} type="file" className="hidden" aria-hidden tabIndex={-1} onChange={(e) => accept(e.target.files?.[0])} />
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload a build spec"
          onDragOver={(e) => { e.preventDefault(); if (phase === "idle") setPhase("over"); }}
          onDragLeave={() => phase === "over" && setPhase("idle")}
          onDrop={(e) => { e.preventDefault(); accept(e.dataTransfer?.files?.[0]); }}
          onClick={() => phase === "idle" && inputRef.current?.click()}
          onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && phase === "idle") inputRef.current?.click(); }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-9 text-center outline-none transition-all duration-200 ${
            phase === "over"
              ? "border-mint/70 bg-mint/8 scale-[1.01]"
              : phase === "done"
                ? "border-mint/40 bg-mint/5"
                : "border-white/15 bg-white/3 hover:border-mint/40 hover:bg-white/5"
          }`}
        >
          {phase !== "done" ? (
            <>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/6 text-xl text-mint">⇪</span>
              <span className="text-sm font-bold">{phase === "over" ? "Drop it — we have it" : "Drag a build spec here"}</span>
              <span className="text-[11px] text-ink-faint">or <span className="font-semibold text-mint">browse files</span> · anything under 5 MB</span>
            </>
          ) : (
            <>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mint/15 text-xl text-mint">✓</span>
              <span className="text-sm font-bold text-mint">{file?.name}</span>
              <span className="text-[11px] text-ink-faint">{file?.size} · uploaded clean</span>
            </>
          )}
        </div>
        {phase === "busy" && (
          <div className="mt-3 rounded-xl border border-white/8 bg-black/25 p-3" style={{ animation: "mf-growin .15s ease-out both" }}>
            <div className="flex items-center justify-between text-[11px]">
              <span className="truncate font-semibold text-ink-dim">{file?.name}</span>
              <span className="font-mono text-mint">{pct}%</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/8">
              <div className="h-full rounded-full bg-gradient-to-r from-mint to-cyan-300 transition-[width] duration-100" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-1.5 text-[10px] text-ink-faint">auditing a11y + size before it lands in your stack…</p>
          </div>
        )}
        {phase === "done" && (
          <button type="button" onClick={reset} className="btn btn-ghost mt-3 !w-full !py-2 text-xs">
            ↺ Upload another
          </button>
        )}
      </div>
    </div>
  );
}


const SETTING_ROWS = [
  { id: "digest", t: "Weekly digest", d: "A Tuesday email of what shipped in the library.", def: true },
  { id: "deploys", t: "Build alerts", d: "Ping me when a copied asset changes or breaks.", def: true },
  { id: "updates", t: "Product updates", d: "New tools, lab features and Pro launches.", def: false },
];


export function ToggleLabelStack() {
  const [on, setOn] = useState<Record<string, boolean>>(() => Object.fromEntries(SETTING_ROWS.map((r) => [r.id, r.def])));
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(60%_90%_at_50%_0%,rgba(139,92,246,0.13),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-md">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-violet-300/70">Email preferences</div>
        <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/4">
          {SETTING_ROWS.map((r, i) => {
            const val = on[r.id];
            return (
              <div key={r.id} className={`flex items-center justify-between gap-4 px-4 py-3.5 ${i > 0 ? "border-t border-white/6" : ""}`}>
                <div className="min-w-0">
                  <div className="text-sm font-bold">{r.t}</div>
                  <div className="mt-0.5 text-[11px] leading-snug text-ink-faint">{r.d}</div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={val}
                  aria-label={r.t}
                  onClick={() => setOn((p) => ({ ...p, [r.id]: !val }))}
                  className={`flex h-6 w-11 shrink-0 items-center rounded-full border px-0.5 transition-colors duration-200 ${
                    val ? "justify-end border-violet-300/50 bg-gradient-to-r from-violet-500 to-indigo-500" : "justify-start border-white/15 bg-white/8"
                  }`}
                >
                  <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-white text-[8px] font-black text-violet-700 shadow" style={{ transition: "transform .15s" }}>
                    {val ? "✓" : ""}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] text-ink-faint">every switch announces its state — a label needs a description to be a real preference</p>
      </div>
    </div>
  );
}


function passwordScore(pw: string): number {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const PASSWORD_LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"];


export function PasswordStrength() {
  const [pw, setPw] = useState("motifui-2026");
  const [show, setShow] = useState(false);
  const score = passwordScore(pw);
  const colors = ["#f87171", "#f87171", "#fbbf24", "#34d399", "#34d399"];
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(60%_90%_at_50%_100%,rgba(244,114,182,0.11),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-pink-300/70">Create a password</div>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            aria-label="Password"
            aria-describedby="pw-meter"
            className="input !rounded-xl !py-2.5 !pr-16 font-mono"
            placeholder="Type something…"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-[11px] font-bold text-ink-faint transition-colors hover:bg-white/6 hover:text-ink"
          >
            {show ? "hide" : "show"}
          </button>
        </div>
        <div id="pw-meter" className="mt-3">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-ink-faint">strength</span>
            <span className="font-bold" style={{ color: colors[score] }}>{PASSWORD_LABELS[score]}</span>
          </div>
          <div className="mt-1.5 flex gap-1.5" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="h-1.5 flex-1 rounded-full transition-colors duration-300"
                style={{ background: i < score ? colors[score] : "rgba(255,255,255,.1)" }}
              />
            ))}
          </div>
          <ul className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] text-ink-faint">
            {[
              ["8+ characters", pw.length >= 8],
              ["upper + lower case", /[a-z]/.test(pw) && /[A-Z]/.test(pw)],
              ["a number", /[0-9]/.test(pw)],
              ["a symbol", /[^A-Za-z0-9]/.test(pw)],
            ].map(([label, ok]) => (
              <li key={String(label)} className={`flex items-center gap-1.5 ${ok ? "text-ink-dim" : ""}`}>
                <span style={{ color: ok ? colors[score] : "rgba(255,255,255,.25)" }}>{ok ? "✓" : "○"}</span> {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}


const DEPLOY_ACTIONS = [
  { label: "Preview build", note: "shareable URL · 2 min" },
  { label: "Deploy to staging", note: "no DNS change" },
  { label: "Roll back release", note: "last green build" },
];


export function SplitButtonMenu() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("Ready — nothing deployed yet.");
  const run = (label: string) => { setStatus(`→ ${label}…`); setOpen(false); setTimeout(() => setStatus("✓ done · build passed in 3.2s"), 700); };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(60%_90%_at_50%_0%,rgba(139,92,246,0.15),transparent_60%),#08090f] px-6">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => run("Deploying live")}
            className="btn btn-primary !h-11 rounded-r-none !px-6 !py-0"
          >
            Deploy live
          </button>
          <div className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={open}
              aria-label="More deploy actions"
              onClick={() => setOpen((v) => !v)}
              className="btn btn-primary !h-11 !w-11 rounded-l-none !border-l !border-white/20 !px-0 !py-0"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .15s" }} aria-hidden>
                <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {open && (
              <div role="menu" className="absolute right-0 top-[calc(100%+6px)] z-10 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#0d0f17] py-1.5 shadow-2xl" style={{ animation: "mf-growin .13s ease-out both" }}>
                {DEPLOY_ACTIONS.map((a) => (
                  <button
                    key={a.label}
                    type="button"
                    role="menuitem"
                    onClick={() => run(a.label)}
                    className="flex w-full items-center justify-between gap-3 px-3.5 py-2 text-left text-xs transition-colors hover:bg-white/8"
                  >
                    <span className="font-semibold text-ink">{a.label}</span>
                    <span className="text-[9px] text-ink-faint">{a.note}</span>
                  </button>
                ))}
                <div className="my-1 border-t border-white/6" />
                <button type="button" role="menuitem" onClick={() => setOpen(false)} className="w-full px-3.5 py-2 text-left text-xs text-ink-faint transition-colors hover:bg-white/8">
                  esc to close
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-ink-dim">{status}</p>
      </div>
    </div>
  );
}


const CRUMBS = [
  { label: "Home", href: "/" },
  { label: "Library", href: "/components" },
  { label: "Components", href: "/components" },
  { label: "Animated", href: "/components?kind=animated" },
  { label: "Prism Switch", href: "/components/prism-switch" },
];


export function BreadcrumbTrail() {
  const [full, setFull] = useState(false);
  const shown = full ? CRUMBS : CRUMBS.length > 4 ? [CRUMBS[0], CRUMBS[CRUMBS.length - 2], CRUMBS[CRUMBS.length - 1]] : CRUMBS;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(251,191,36,0.1),transparent_60%),#08090f] px-6">
      <nav aria-label="Breadcrumb" className="w-full max-w-md">
        <div className="chip !mb-3 !border-amber-300/25 !bg-amber-400/10 !text-amber-200">breadcrumb trail · separator-aware</div>
        <ol className="flex flex-wrap items-center gap-y-1 rounded-xl border border-white/8 bg-white/4 px-3.5 py-2.5 text-xs">
          {shown.map((c, i) => {
            const last = i === shown.length - 1;
            return (
              <li key={c.label + i} className="flex items-center">
                {last ? (
                  <span aria-current="page" className="flex items-center gap-1.5 rounded-lg bg-white/8 px-2 py-1 font-bold text-ink">
                    {c.label}
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-300/80" aria-hidden />
                  </span>
                ) : (
                  <>
                    <a href="#" onClick={(e) => e.preventDefault()} className="rounded-md px-2 py-1 font-medium text-ink-dim transition-colors hover:bg-white/6 hover:text-ink">{c.label}</a>
                    <svg className="mx-0.5 h-3 w-3 text-ink-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </li>
            );
          })}
          {!full && CRUMBS.length > 4 && (
            <li>
              <button
                type="button"
                onClick={() => setFull(true)}
                aria-label="Show full breadcrumb trail"
                title="Show full trail"
                className="mx-1 flex h-6 w-8 items-center justify-center rounded-md border border-dashed border-white/15 font-mono text-[11px] font-bold text-ink-faint transition-colors hover:border-amber-300/40 hover:text-amber-200"
              >
                …
              </button>
            </li>
          )}
        </ol>
      </nav>
      <p className="text-[11px] text-ink-faint">{full ? "full trail restored — tap the ellipsis collapses it again" : "collapsed to Home / … / current on small widths — the ellipsis expands it"}</p>
    </div>
  );
}


/* ------------------------------ NAVIGATION & SKELETON (batch 3) ------------------------------ */


function ellipsizedPages(page: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set<number>([1, 2, total - 1, total, page - 1, page, page + 1]);
  const sorted = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) out.push("…");
    out.push(n);
  });
  return out;
}


export function PaginationEllipsis({ pages = 12 }: DemoProps) {
  const total = typeof pages === "number" ? Math.max(5, Math.min(30, Math.round(pages))) : 12;
  const [page, setPage] = useState(1);
  const items = ellipsizedPages(page, total);
  const go = (p: number) => setPage(Math.max(1, Math.min(total, p)));
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(139,92,246,0.13),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-md">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-violet-300/70">Browse library — page {page} of {total}</span>
          <span className="chip !text-[9px] uppercase">12 per page</span>
        </div>
        <div className="flex items-center justify-between gap-2 rounded-xl border border-white/8 bg-white/4 p-1.5">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => go(page - 1)}
            aria-label="Previous page"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-xs transition-colors hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ←
          </button>
          <div className="flex items-center gap-1" role="navigation" aria-label="Pagination">
            {items.map((it, i) =>
              it === "…" ? (
                <span key={`e${i}`} className="px-1 font-mono text-[11px] text-ink-faint" aria-hidden>…</span>
              ) : (
                <button
                  key={it}
                  type="button"
                  onClick={() => go(it)}
                  aria-current={it === page ? "page" : undefined}
                  className={`h-8 min-w-8 rounded-lg px-1.5 text-xs font-bold transition-all ${
                    it === page
                      ? "bg-gradient-to-b from-violet-500 to-indigo-600 text-white shadow-[0_6px_14px_-6px_rgba(124,58,237,.8)]"
                      : "text-ink-dim hover:bg-white/8 hover:text-ink"
                  }`}
                >
                  {it}
                </button>
              ),
            )}
          </div>
          <button
            type="button"
            disabled={page === total}
            onClick={() => go(page + 1)}
            aria-label="Next page"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-xs transition-colors hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-30"
          >
            →
          </button>
        </div>
        <p className="mt-3 text-[11px] text-ink-faint">edges stay pinned · the active page never jumps — the window slides around it</p>
      </div>
    </div>
  );
}


const TOC_SECTIONS = [
  { id: "s-intro", t: "Introduction", fill: 0 },
  { id: "s-tokens", t: "Tokens & theming", fill: 1 },
  { id: "s-motion", t: "Motion language", fill: 2 },
  { id: "s-a11y", t: "Accessibility", fill: 3 },
  { id: "s-faq", t: "FAQ", fill: 4 },
];

const TOC_PARAS = [
  "Every surface on this page is built from the same ten tokens, so nothing can drift out of the system.",
  "Motion here is a language with a tiny vocabulary: enter, focus, state. Nothing decorates for its own sake.",
  "We treat reduced motion as a second design, not a deletion — the story survives without the theatre.",
  "If a component can't be reached with a keyboard and understood by a screen reader, it doesn't ship.",
  "The library grows weekly and the changelog says exactly what changed and why — no vague release notes.",
];


export function TocSpine() {
  const scroller = useRef<HTMLDivElement>(null);
  // #27 — a JS `behavior: "smooth"` overrides the stylesheet's
  // `scroll-behavior: auto`, so the jump has to read the preference itself.
  const { reduced } = useSceneMotion();
  const [active, setActive] = useState("s-intro");
  const jump = (id: string) => {
    const el = scroller.current;
    if (!el) return;
    const target = el.querySelector<HTMLElement>(`[data-sec="${id}"]`);
    if (target) el.scrollTo({ top: target.offsetTop - el.offsetTop - 8, behavior: reduced ? "auto" : "smooth" });
  };
  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    let cur = TOC_SECTIONS[0].id;
    for (const sec of TOC_SECTIONS) {
      const node = el.querySelector<HTMLElement>(`[data-sec="${sec.id}"]`);
      if (node && node.offsetTop - el.offsetTop - 24 <= el.scrollTop) cur = sec.id;
    }
    setActive(cur);
  };
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0c13]">
      <div className="flex items-center gap-2 border-b border-white/6 bg-[#0d1017]/95 px-4 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet-300/70">Guide · scroll the article</span>
        <span className="ml-auto font-mono text-[10px] text-ink-faint">TOC follows you</span>
      </div>
      <div className="flex min-h-0 flex-1">
        {/* article */}
        <div ref={scroller} onScroll={onScroll} className="min-w-0 flex-1 overflow-y-auto px-5 py-4">
          <div className="mx-auto max-w-sm space-y-3">
            {TOC_SECTIONS.map((sec, i) => (
              <div key={sec.id} data-sec={sec.id} className="rounded-xl border border-white/7 bg-white/3 p-3.5">
                <div className="text-xs font-extrabold tracking-tight">{sec.t}</div>
                <div className="mt-1.5 space-y-2">
                  <div className="h-1.5 w-full rounded-full bg-white/12" />
                  <div className="h-1.5 w-11/12 rounded-full bg-white/8" />
                  <div className="h-1.5 w-4/5 rounded-full bg-white/8" />
                </div>
                <p className="mt-2.5 text-[10px] leading-relaxed text-ink-dim">{TOC_PARAS[i]}</p>
              </div>
            ))}
          </div>
        </div>
        {/* toc spine */}
        <div className="hidden w-32 shrink-0 border-l border-white/6 bg-black/25 p-2.5 sm:block">
          <div className="px-1 pb-2 text-[8px] font-bold uppercase tracking-[0.22em] text-ink-faint">On this page</div>
          <ol className="space-y-0.5">
            {TOC_SECTIONS.map((sec) => (
              <li key={sec.id}>
                <button
                  type="button"
                  onClick={() => jump(sec.id)}
                  className={`flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-[9px] font-semibold transition-colors ${
                    active === sec.id ? "bg-violet-400/15 text-violet-100" : "text-ink-faint hover:text-ink-dim"
                  }`}
                >
                  <span className={`h-1 w-1 shrink-0 rounded-full ${active === sec.id ? "bg-violet-300" : "bg-white/20"}`} aria-hidden />
                  {sec.t}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}


const TAB_TITLES = [
  { t: "Overview", body: "A one-screen glance at the library: newest assets, top copies, and what shipped this week." },
  { t: "Components", body: "54 themeable assets across elements, animated pieces, sections and whole templates." },
  { t: "Prompts", body: "24 run-tested prompts with per-model fidelity scores and public run logs." },
  { t: "Learn", body: "10 original guides that teach the motion and craft behind the code you copy." },
];


export function TabsIndicator({ count = 3 }: DemoProps) {
  const n = typeof count === "number" ? Math.max(2, Math.min(4, Math.round(count))) : 3;
  const tabs = TAB_TITLES.slice(0, n);
  const [active, setActive] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);
  const [ind, setInd] = useState({ left: 0, width: 0 });
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    const el = btnRefs.current[active];
    const bar = barRef.current;
    if (el && bar) {
      setInd({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [active, n]);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(34,211,238,0.12),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-md">
        <div ref={barRef} role="tablist" aria-label="Sections" className="relative flex gap-1 border-b border-white/8">
          {tabs.map((t, i) => (
            <button
              key={t.t}
              ref={(el) => { btnRefs.current[i] = el; }}
              type="button"
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              className={`relative px-4 py-2.5 text-sm font-bold transition-colors ${active === i ? "text-cyan-100" : "text-ink-faint hover:text-ink-dim"}`}
            >
              {t.t}
            </button>
          ))}
          <span
            aria-hidden
            className="absolute -bottom-px h-0.5 rounded-full bg-gradient-to-r from-cyan-300 to-violet-400 shadow-[0_0_10px_rgba(34,211,238,.6)]"
            style={{ left: ind.left, width: ind.width, transition: "left .28s cubic-bezier(.65,0,.25,1), width .28s cubic-bezier(.65,0,.25,1)" }}
          />
        </div>
        <div key={active} className="mt-4 rounded-xl border border-white/8 bg-white/4 p-4" style={{ animation: "mf-growin .18s ease-out both" }}>
          <div className="text-sm font-extrabold text-cyan-100">{tabs[active].t}</div>
          <p className="mt-1 text-[11px] leading-relaxed text-ink-dim">{tabs[active].body}</p>
        </div>
        <p className="mt-3 text-[11px] text-ink-faint">the underline slides to the active tab&apos;s actual width — not a fixed fraction</p>
      </div>
    </div>
  );
}


const STICKY_SECS = [
  { id: "st-hero", t: "Hero" },
  { id: "st-features", t: "Features" },
  { id: "st-pricing", t: "Pricing" },
  { id: "st-faq", t: "FAQ" },
];


export function StickySubNav() {
  const scroller = useRef<HTMLDivElement>(null);
  // #27 — a JS `behavior: "smooth"` overrides the stylesheet's
  // `scroll-behavior: auto`, so the jump has to read the preference itself.
  const { reduced } = useSceneMotion();
  const [active, setActive] = useState("st-hero");
  const jump = (id: string) => {
    const el = scroller.current;
    if (!el) return;
    const target = el.querySelector<HTMLElement>(`[data-sec="${id}"]`);
    if (target) el.scrollTo({ top: target.offsetTop - el.offsetTop - 44, behavior: reduced ? "auto" : "smooth" });
  };
  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    let cur = STICKY_SECS[0].id;
    for (const sec of STICKY_SECS) {
      const node = el.querySelector<HTMLElement>(`[data-sec="${sec.id}"]`);
      if (node && node.offsetTop - el.offsetTop - 60 <= el.scrollTop) cur = sec.id;
    }
    setActive(cur);
  };
  const heights = [150, 170, 140, 160];
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0c13]">
      <div ref={scroller} onScroll={onScroll} className="relative min-h-0 flex-1 overflow-y-auto">
        {/* the row that pins while content scrolls under it */}
        <div className="sticky top-0 z-20 flex items-center gap-1 border-b border-white/8 bg-[#0d1017]/95 px-3 py-2 backdrop-blur-md">
          <span className="mr-1 text-[9px] font-bold uppercase tracking-[0.2em] text-ink-faint">On-page</span>
          {STICKY_SECS.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => jump(sec.id)}
              aria-current={active === sec.id ? "true" : undefined}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors ${
                active === sec.id ? "bg-cyan-400/15 text-cyan-100" : "text-ink-dim hover:text-ink"
              }`}
            >
              {sec.t}
            </button>
          ))}
          <span className="ml-auto hidden font-mono text-[9px] text-ink-faint sm:block">position: sticky · top: 0</span>
        </div>
        <div className="px-4 py-4">
          <div className="space-y-3">
            {STICKY_SECS.map((sec, i) => (
              <div key={sec.id} data-sec={sec.id} className="rounded-xl border border-white/7 bg-white/3 p-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-cyan-400/12 px-1.5 py-0.5 font-mono text-[9px] font-bold text-cyan-200">{sec.id.replace("st-", "")}</span>
                  <span className="text-xs font-extrabold">{sec.t} section</span>
                </div>
                <div className="mt-2 space-y-1.5" style={{ height: heights[i] }}>
                  <div className="h-1.5 w-full rounded-full bg-white/10" />
                  <div className="h-1.5 w-5/6 rounded-full bg-white/7" />
                  <div className="h-1.5 w-2/3 rounded-full bg-white/7" />
                  <div className="h-1.5 w-11/12 rounded-full bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


export function BackToTop() {
  const scroller = useRef<HTMLDivElement>(null);
  // #27 — a JS `behavior: "smooth"` overrides the stylesheet's
  // `scroll-behavior: auto`, so the jump has to read the preference itself.
  const { reduced } = useSceneMotion();
  const [show, setShow] = useState(false);
  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    setShow(el.scrollTop > 130);
  };
  const toTop = () => scroller.current?.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#0a0c13]">
      <div ref={scroller} onScroll={onScroll} className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <div className="mx-auto max-w-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet-300/70">Article · 60s read</span>
            <span className="ml-auto chip !text-[9px] uppercase">keep scrolling ↓</span>
          </div>
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/6 bg-white/3 p-3.5">
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-md bg-gradient-to-br from-violet-400/60 to-cyan-400/40" />
                <span className="text-xs font-bold">Section {i + 1}</span>
              </div>
              <div className="mt-2 space-y-1.5">
                <div className="h-1.5 w-full rounded-full bg-white/10" />
                <div className="h-1.5 w-10/12 rounded-full bg-white/7" />
                <div className="h-1.5 w-8/12 rounded-full bg-white/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* comet */}
      <button
        type="button"
        onClick={toTop}
        aria-label="Back to top"
        className={`absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-violet-300/40 bg-[#141728]/90 text-violet-200 shadow-[0_10px_30px_-8px_rgba(124,58,237,.7)] backdrop-blur transition-all duration-300 hover:scale-105 hover:bg-violet-500/25 ${
          show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
          <path d="M12 19V5m-6 6 6-6 6 6" />
        </svg>
      </button>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#0a0c13] to-transparent" aria-hidden />
      {show && <p className="pointer-events-none absolute bottom-5 right-16 text-[10px] font-semibold text-violet-200/70">comet appears after 2 screens</p>}
    </div>
  );
}

