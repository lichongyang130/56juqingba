"use client";

// Scene set 6 of 7 — TEMPLATES AND PAGE-LEVEL LAYOUTS.
//
// Loaded on demand: a page that renders one demo downloads the set that
// holds it (plus the shared kit), not the other 195 scenes. The registry in
// ../Demo.tsx is the only thing that knows where each key lives.
import { useEffect, useRef, useState } from "react";
import { COMPONENTS } from "@/lib/data";

const FAQ_PAIRS = [
  { q: "Are the assets original?", a: "Every demo, token and copy block is authored in-house. Nothing is scraped from third-party libraries — that is the whole point of the library." },
  { q: "Can I use them commercially?", a: "Yes. Every asset ships under MIT, including agency client work. The only thing you cannot do is resell the library itself as a product." },
  { q: "Do demos ship with the code?", a: "Each component page carries the full React + CSS snippet and a design note. Figma tokens are a separate download on the Team plan." },
  { q: "What about screen readers?", a: "The a11y pass is part of definition-of-done: live regions, keyboard paths and reduced-motion are tested, not bolted on." },
] as const;


export function FaqTwoColumn() {
  const [open, setOpen] = useState(0);
  const cur = FAQ_PAIRS[open];
  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(99,102,241,0.1),transparent_60%),#08090f] px-6">
      <div className="grid w-full max-w-md grid-cols-[132px_minmax(0,1fr)] gap-3">
        <div className="flex flex-col gap-1.5">
          {FAQ_PAIRS.map((f, i) => (
            <button
              key={f.q}
              type="button"
              onClick={() => setOpen(i)}
              aria-expanded={open === i}
              className={`rounded-xl border px-3 py-2.5 text-left text-[10px] font-bold leading-snug transition-colors ${
                open === i ? "border-indigo-300/40 bg-indigo-300/10 text-indigo-100" : "border-white/6 bg-white/3 text-ink-dim hover:border-white/15"
              }`}
            >
              {f.q}
            </button>
          ))}
        </div>
        <div key={open} className="flex flex-col justify-center rounded-2xl border border-white/8 bg-white/4 px-5 py-6" style={{ animation: "mf-growin .3s ease-out both" }}>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-faint">answer {open + 1}/{FAQ_PAIRS.length}</span>
          <p className="mt-2 text-[11.5px] leading-relaxed text-white/85">{cur.a}</p>
          <div className="mt-4 flex items-center gap-2 text-[9px] text-ink-faint">
            <span className="rounded-full border border-white/10 px-2 py-0.5">{cur.q.length < 22 ? "quick one" : "the long read"}</span>
            <span>swap animates in place — no page jump</span>
          </div>
        </div>
      </div>
    </div>
  );
}


export function ComparisonSlider() {
  const track = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const [drag, setDrag] = useState(false);
  const moveTo = (clientX: number) => {
    const el = track.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(250,204,21,0.08),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-ink-faint">before / after</p>
          <span className="font-mono text-[9px] text-ink-faint">{Math.round(pos)}%</span>
        </div>
        <div
          ref={track}
          role="slider"
          aria-label="Comparison slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-orientation="horizontal"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowDown") setPos((p) => Math.max(4, p - 4));
            if (e.key === "ArrowRight" || e.key === "ArrowUp") setPos((p) => Math.min(96, p + 4));
          }}
          onPointerDown={(e) => {
            setDrag(true);
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            moveTo(e.clientX);
          }}
          onPointerMove={(e) => {
            if (drag) moveTo(e.clientX);
          }}
          onPointerUp={() => setDrag(false)}
          className="relative mt-3 h-48 w-full cursor-ew-resize touch-none overflow-hidden rounded-2xl border border-white/10 select-none"
          style={{ touchAction: "none" }}
        >
          {/* after (colour) */}
          <div className="absolute inset-0" aria-hidden style={{ background: "linear-gradient(135deg, hsl(262 80% 30%) 0%, hsl(199 90% 36%) 55%, hsl(172 80% 34%) 100%)" }}>
            <div className="absolute inset-x-5 top-4 flex items-center gap-2">
              <span className="rounded-full bg-black/30 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-100 backdrop-blur">after · aurora tokenised</span>
            </div>
            <p className="absolute inset-x-5 bottom-4 text-[10px] font-black tracking-tight text-white/90">one palette, four surfaces, no drift</p>
          </div>
          {/* before (flat) */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden style={{ width: `${pos}%` }}>
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(220 12% 18%) 0%, hsl(222 10% 26%) 60%, hsl(215 8% 22%) 100%)", filter: "saturate(.25)" }}>
              <div className="absolute inset-x-5 top-4 flex items-center gap-2">
                <span className="rounded-full bg-black/40 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/70 backdrop-blur">before · six hand-picked hexes</span>
              </div>
              <p className="absolute inset-x-5 bottom-4 text-[10px] font-black tracking-tight text-white/40">every screen a slightly different grey</p>
            </div>
          </div>
          {/* divider */}
          <div className="absolute inset-y-0" aria-hidden style={{ left: `${pos}%`, transform: "translateX(-50%)" }}>
            <div className="h-full w-[2px] bg-white/90 shadow-[0_0_14px_rgba(255,255,255,.6)]" />
            <span className="absolute left-1/2 top-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-black/60 text-[11px] text-white backdrop-blur">
              ⇄
            </span>
          </div>
        </div>
        <p className="mt-3 text-center text-[9px] leading-relaxed text-ink-faint">
          drag or arrow-key the divider — pointer-captured so the drag never leaves the handle behind. Both panes stay in the same box, so the diff reads honestly.
        </p>
      </div>
    </div>
  );
}


const TL_MILES = [
  { when: "week 1", what: "Scaffold", text: "palette + type ramp agreed on real screens, not swatches." },
  { when: "week 3", what: "Ship 8 inputs", text: "combo-box through radio-pills land with keyboard paths intact." },
  { when: "week 6", what: "Motion pass", text: "signature scenes — odometer, confetti, liquid buttons — join." },
  { when: "week 8", what: "a11y audit", text: "screen-reader tour finds 3 gaps; all three close same week." },
  { when: "week 10", what: "Public launch", text: "the library opens with 39 originals and zero borrowed code." },
] as const;


export function TimelineVertical() {
  const scroller = useRef<HTMLDivElement>(null);
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0c13]">
      <div className="flex items-center justify-between border-b border-white/6 px-4 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">milestone rail — scroll to walk it</span>
        <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[9px] text-amber-200/80">10 weeks</span>
      </div>
      <div ref={scroller} className="relative min-h-0 flex-1 overflow-y-auto px-6 py-5">
        <div className="relative mx-auto max-w-sm">
          <span aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-gradient-to-b from-violet-400/60 via-cyan-300/40 to-transparent" />
          <div className="space-y-4">
            {TL_MILES.map((m, i) => (
              <div key={m.what} className="relative flex gap-3.5">
                <span className="relative z-10 mt-1 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 border-cyan-300 bg-[#0a0c13]">
                  <span className="h-1 w-1 rounded-full bg-cyan-300" />
                </span>
                <div
                  className={`min-w-0 flex-1 rounded-xl border border-white/6 bg-white/3 px-3.5 py-2.5 transition-colors hover:border-white/15 ${i % 2 === 1 ? "sm:ml-6" : ""}`}
                  style={{ animation: "mf-rise .45s ease-out both" }}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[11px] font-black tracking-tight text-white">{m.what}</span>
                    <span className="shrink-0 font-mono text-[8.5px] uppercase tracking-[0.16em] text-ink-faint">{m.when}</span>
                  </div>
                  <p className="mt-1 text-[10px] leading-relaxed text-ink-dim">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


const NB_TIERS = ["weekly digest", "launch only", "deep dives"] as const;


export function NewsletterBandTiers() {
  const [tier, setTier] = useState<(typeof NB_TIERS)[number]>("weekly digest");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");
  const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const submit = () => {
    if (!valid) {
      setState("error");
      return;
    }
    setState("done");
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(52,211,153,0.12),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/8 bg-white/4 p-6 text-center">
        <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.22em] text-emerald-200">
          the motif post
        </span>
        <div className="mt-3 text-xl font-black tracking-tight text-white" data-demo-heading="h3">one useful letter a week</div>
        <p className="mx-auto mt-1.5 max-w-[300px] text-[11px] leading-relaxed text-ink-dim">
          design notes, fresh assets and honest a11y lessons — never a sales blast, unsubscribe in one click.
        </p>
        {state === "done" ? (
          <div className="mt-4 rounded-xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 text-sm font-bold text-emerald-200" role="status">
            ✓ You’re subscribed to “{tier}”.
          </div>
        ) : (
          <>
            <div className="mx-auto mt-4 flex max-w-[340px] gap-1 rounded-xl border border-white/10 bg-black/30 p-1">
              {NB_TIERS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTier(t)}
                  aria-pressed={tier === t}
                  className={`flex-1 rounded-lg px-2 py-1.5 text-[10px] font-bold capitalize transition-colors ${
                    tier === t ? "bg-emerald-400/20 text-emerald-100" : "text-ink-faint hover:text-ink-dim"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className={`mx-auto mt-3 flex max-w-[340px] items-center gap-2 rounded-xl border px-3 py-2 ${state === "error" ? "border-rose-300/50" : "border-white/10"}`}>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (state !== "idle") setState("idle");
                }}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="you@studio.dev"
                aria-label="Email address"
                className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-ink-faint"
              />
              <button type="button" onClick={submit} className="shrink-0 rounded-lg bg-emerald-300 px-4 py-1.5 text-[11px] font-black text-[#06120c] transition-colors hover:bg-emerald-200">
                Subscribe
              </button>
            </div>
            <p aria-live="polite" className="mt-2 h-3 text-[10px] text-rose-200">
              {state === "error" ? "Please use a real address — e.g. you@studio.dev" : ""}
            </p>
          </>
        )}
      </div>
      <p className="mt-4 max-w-md text-center text-[10px] leading-relaxed text-ink-faint">
        capture = email + frequency choice; the tier pill is part of the promise, so the welcome email can match it.
      </p>
    </div>
  );
}


export function HeroProductMock() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-4 overflow-hidden bg-[radial-gradient(70%_100%_at_70%_0%,rgba(139,92,246,0.18),transparent_55%),#08090f] px-6">
      <div className="mx-auto w-full max-w-md">
        <div className="flex items-end justify-between gap-3">
          <div className="max-w-[220px]">
            <span className="rounded-full border border-violet-300/25 bg-violet-300/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-violet-200">
              dev-tool hero
            </span>
            <div className="mt-2 text-2xl font-black leading-[1.05] tracking-tight text-white" data-demo-heading="h3">
              your UI, shipped <span className="text-violet-300">as systems</span>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
              components, tokens and motion language — assembled, not bolted on.
            </p>
            <div className="mt-3 flex gap-2">
              <button type="button" className="rounded-lg bg-white px-3.5 py-1.5 text-[11px] font-black text-[#0b0c12] transition-transform hover:-translate-y-0.5">
                Browse assets
              </button>
              <button type="button" className="rounded-lg border border-white/15 px-3.5 py-1.5 text-[11px] font-bold text-white/85 transition-colors hover:bg-white/5">
                Read the essay
              </button>
            </div>
          </div>
          <p className="pb-1 font-mono text-[9px] text-ink-faint">v0.9 · {COMPONENTS.length} assets</p>
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-[#0d1017]/95 shadow-[0_30px_80px_rgba(0,0,0,.5)] backdrop-blur">
          <div className="flex items-center gap-2 border-b border-white/6 px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-2 flex-1 rounded-md bg-white/5 px-2 py-0.5 font-mono text-[9px] text-ink-faint">motif.ui/demo/aurora</span>
          </div>
          <div className="grid grid-cols-3 gap-2 p-3">
            <div className="col-span-2 flex flex-col gap-2 rounded-xl border border-white/6 bg-white/3 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink-faint">surfaces shipped</span>
                <span className="font-mono text-[10px] text-violet-300">1,214</span>
              </div>
              <div className="flex h-12 items-end gap-1">
                {[38, 55, 30, 62, 48, 74, 58, 88, 66, 42].map((hgt, i) => (
                  <span key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-violet-500/40 to-violet-300/70" style={{ height: `${hgt}%`, animation: `mf-growin .4s ease-out ${i * 40}ms both` }} />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="rounded-xl border border-white/6 bg-white/3 p-2.5">
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-ink-faint">tokens</span>
                <span className="mt-1 block text-base font-black text-white">42</span>
              </div>
              <div className="rounded-xl border border-white/6 bg-white/3 p-2.5">
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-ink-faint">a11y</span>
                <span className="mt-1 block text-base font-black text-emerald-300">98</span>
              </div>
              <div className="rounded-xl border border-white/6 bg-white/3 p-2.5">
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-ink-faint">runtime</span>
                <span className="mt-1 block text-base font-black text-cyan-300">0kb</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


const SFR_ROWS = [
  {
    k: "01",
    t: "Tokens before components",
    body: "Colour, type and spacing decided on real screens first — the component palette is a consequence, not a starting point.",
    tags: ["foundations", "palette"],
    art: "linear-gradient(150deg, hsl(262 80% 30%), hsl(199 90% 38%))",
    mark: "◐",
  },
  {
    k: "02",
    t: "Motion with a budget",
    body: "Every animation earns its place: under 200ms for feedback, over 500ms only for story beats, and reduced-motion kills the whole theatre.",
    tags: ["motion", "principles"],
    art: "linear-gradient(150deg, hsl(172 80% 26%), hsl(199 90% 34%))",
    mark: "◒",
  },
] as const;


export function SplitFeatureRows() {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setSeen(true);
        });
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0c13]">
      <div className="flex items-center justify-between border-b border-white/6 px-4 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">feature rows — scroll for the fade</span>
        <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[9px] text-ink-faint">{seen ? "revealed" : "waiting…"}</span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <div className="mx-auto max-w-sm space-y-6">
          {SFR_ROWS.map((r, i) => {
            const flip = i % 2 === 1;
            return (
              <article
                key={r.k}
                className={`grid grid-cols-[110px_minmax(0,1fr)] gap-3 ${flip ? "direction-rtl" : ""}`}
                style={{ animation: seen ? `mf-rise .5s ease-out ${i * 140}ms both` : undefined, opacity: seen ? undefined : 0 }}
              >
                <div
                  className="group relative flex h-28 items-center justify-center overflow-hidden rounded-xl border border-white/10"
                  style={{ background: r.art }}
                >
                  <span className="text-4xl text-white/35 transition-transform duration-500 group-hover:scale-125" aria-hidden>
                    {r.mark}
                  </span>
                  <span aria-hidden className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                </div>
                <div className="flex min-w-0 flex-col justify-center">
                  <span className="font-mono text-[9px] text-ink-faint">{r.k}</span>
                  <div className="mt-0.5 text-sm font-black leading-tight tracking-tight text-white" data-demo-heading="h3">{r.t}</div>
                  <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-dim">{r.body}</p>
                  <div className="mt-2 flex gap-1.5">
                    {r.tags.map((t) => (
                      <span key={t} className="rounded-full border border-white/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.16em] text-ink-faint">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
          <p className="pb-1 text-center text-[9px] text-ink-faint">each row fades up 140ms after the last — and the art panel zooms gently on hover.</p>
        </div>
      </div>
      <style>{`.direction-rtl { direction: rtl } .direction-rtl > * { direction: ltr }`}</style>
    </div>
  );
}


const CSH_FACTS = [
  { k: "client", v: "Northwind Retail" },
  { k: "role", v: "Design system + build" },
  { k: "year", v: "2026" },
  { k: "stack", v: "React · Figma · tokens" },
] as const;


export function CaseStudyHeader() {
  return (
    <div className="flex h-full w-full flex-col justify-center overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(34,211,238,0.09),transparent_60%),#08090f] px-6">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-white/8 bg-white/3 p-5">
        <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.22em] text-ink-faint">
          <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-2 py-0.5 text-cyan-200">case study</span>
          <span>design systems</span>
        </div>
        <div className="mt-3 text-xl font-black leading-tight tracking-tight text-white" data-demo-heading="h3">
          Bringing 14 storefronts onto one design system — without a freeze
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
          How Northwind’s five squads shipped a token pipeline, a living component set and an a11y bar, all while the roadmap kept moving.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {CSH_FACTS.map((f) => (
            <div key={f.k} className="rounded-xl border border-white/6 bg-black/20 px-3 py-2">
              <span className="block text-[8px] font-bold uppercase tracking-[0.2em] text-ink-faint">{f.k}</span>
              <span className="mt-0.5 block truncate text-[11px] font-bold text-white/90">{f.v}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-white/6 pt-3">
          <span className="font-mono text-[9px] text-ink-faint">read time · 9 min</span>
          <button type="button" className="rounded-lg bg-white/10 px-3 py-1.5 text-[10px] font-black text-white transition-colors hover:bg-white/15">
            Read the study →
          </button>
        </div>
      </div>
      <p className="mx-auto mt-4 w-full max-w-md text-center text-[9px] leading-relaxed text-ink-faint">
        the labelled grid does the heavy lifting — client, role, year and stack answer the four questions every reader asks first.
      </p>
    </div>
  );
}


const CL_ITEMS = [
  { ver: "v1.3.0", day: "today", kind: "asset", tone: "mint", title: "Bento grid joins the library", body: "Eight marketing sections landed, from logo walls to comparison sliders." },
  { ver: "v1.2.1", day: "tue", kind: "fix", tone: "amber", title: "Marquee pause on hover", body: "Hovering a testimonial row now pauses both lanes; reduced-motion wraps instead of drifting." },
  { ver: "v1.2.0", day: "mon", kind: "feat", tone: "violet", title: "Pricing + newsletter sections", body: "Billing toggle, frequency pills — copy and code in one pass." },
  { ver: "v1.1.0", day: "last week", kind: "asset", tone: "mint", title: "Toast queue with undo", body: "Countdown bars, a batch cap of three, and an Undo action for mis-taps." },
  { ver: "v1.0.9", day: "last week", kind: "fix", tone: "amber", title: "Faster a11y audit", body: "The screen-reader pass now runs in CI on every demo change." },
] as const;


export function ChangelogFeed() {
  const [openVer, setOpenVer] = useState<string | null>("v1.3.0");
  const toneMap: Record<string, string> = {
    asset: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200",
    feat: "border-violet-300/25 bg-violet-300/10 text-violet-200",
    fix: "border-amber-300/25 bg-amber-300/10 text-amber-200",
  };
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0c13]">
      <div className="flex items-center justify-between border-b border-white/6 px-4 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">ship log</span>
        <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[9px] text-emerald-300">v1.3.0 · live</span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3">
        <div className="mx-auto max-w-sm space-y-2">
          {CL_ITEMS.map((it) => {
            const open = openVer === it.ver;
            return (
              <div key={it.ver} className={`rounded-xl border px-3.5 py-3 transition-colors ${open ? "border-white/15 bg-white/5" : "border-white/6 bg-white/2 hover:bg-white/4"}`}>
                <button
                  type="button"
                  onClick={() => setOpenVer(open ? null : it.ver)}
                  aria-expanded={open}
                  className="flex w-full items-center gap-2.5 text-left"
                >
                  <span className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-[9px] font-bold text-white/85">{it.ver}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.16em] ${toneMap[it.kind]}`}>{it.kind}</span>
                  <span className="min-w-0 flex-1 truncate text-[11px] font-bold text-white/90">{it.title}</span>
                  <span className="shrink-0 text-[8px] uppercase tracking-[0.14em] text-ink-faint">{it.day}</span>
                </button>
                {open && (
                  <p className="mt-2 border-t border-white/6 pt-2 text-[10.5px] leading-relaxed text-ink-dim" style={{ animation: "mf-fade .2s ease-out both" }}>
                    {it.body}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


const RD_FILES = [
  { name: "aurora-tokens.zip", fmt: "ZIP", size: "84 KB", note: "design tokens for Figma + code" },
  { name: "signature-motion-guide.pdf", fmt: "PDF", size: "2.1 MB", note: "the motion language in 18 pages" },
  { name: "motif-foundations.sketch", fmt: "FIG", size: "12 MB", note: "full source for the foundations" },
] as const;


export function ResourceDownloadCards() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(250,204,21,0.08),transparent_60%),#08090f] px-6">
      <div className="w-full max-w-md">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-ink-faint">downloads · free with the newsletter</p>
        <div className="mt-3 space-y-2">
          {RD_FILES.map((f) => (
            <div
              key={f.name}
              className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/3 px-3.5 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/5 hover:shadow-[0_12px_30px_rgba(0,0,0,.35)]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/8 font-mono text-[8px] font-black text-amber-200" style={{ fontSize: 7 }}>
                {f.fmt}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-[11px] text-white/90">{f.name}</p>
                <p className="text-[9px] text-ink-faint">
                  {f.size} · {f.note}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDone((d) => ({ ...d, [f.name]: true }))}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-[10px] font-black transition-colors ${
                  done[f.name] ? "bg-emerald-300/15 text-emerald-300" : "bg-white/10 text-white hover:bg-white/15"
                }`}
              >
                {done[f.name] ? "✓ grabbed" : "Download"}
              </button>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-[9px] leading-relaxed text-ink-faint">format badge + honest size first, action second — no mystery links, no “subscribe to reveal”.</p>
      </div>
    </div>
  );
}


const EV_SESSIONS = [
  { date: "wed · mar 11", when: "09:30", t: "Tokens as the contract", who: "Ada Lin", tag: "talk", room: "hall a" },
  { date: "wed · mar 11", when: "11:00", t: "Motion without the maths", who: "Rin Sato", tag: "workshop", room: "room 2" },
  { date: "wed · mar 11", when: "14:00", t: "The a11y audit that ran itself", who: "Temi Okafor", tag: "talk", room: "hall b" },
  { date: "thu · mar 12", when: "09:00", t: "Design systems on a deadline", who: "Jonas Varga", tag: "panel", room: "hall a" },
  { date: "thu · mar 12", when: "11:30", t: "Shipping a library in 10 weeks", who: "Nadia Haddad", tag: "talk", room: "room 1" },
] as const;


export function EventScheduleList() {
  const [pick, setPick] = useState<string | null>(null);
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0c13]">
      <div className="flex items-center justify-between border-b border-white/6 px-4 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">summit schedule</span>
        <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[9px] text-ink-faint">2 days · 5 sessions</span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3">
        <div className="mx-auto max-w-sm">
          {EV_SESSIONS.map((s, i) => {
            const sticky = i === 0 || EV_SESSIONS[i - 1].date !== s.date;
            const active = pick === `${s.date}-${s.when}`;
            return (
              <div key={`${s.date}-${s.when}`} className="relative pb-1.5">
                {sticky && (
                  <p className="sticky top-0 z-10 border-y border-white/6 bg-[#0a0c13]/95 py-1.5 text-[9px] font-black uppercase tracking-[0.22em] text-ink-dim backdrop-blur">
                    {s.date}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setPick(active ? null : `${s.date}-${s.when}`)}
                  aria-expanded={active}
                  className={`mt-1.5 flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors ${
                    active ? "border-amber-300/35 bg-amber-300/8" : "border-white/6 bg-white/3 hover:border-white/15"
                  }`}
                >
                  <span className="w-11 shrink-0 font-mono text-[10px] font-bold text-amber-200">{s.when}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11px] font-bold text-white/90">{s.t}</span>
                    <span className="block text-[9px] text-ink-faint">
                      {s.who} · {s.room}
                    </span>
                  </span>
                  <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.14em] ${
                    s.tag === "workshop" ? "border-cyan-300/25 text-cyan-200" : s.tag === "panel" ? "border-violet-300/25 text-violet-200" : "border-white/10 text-ink-dim"
                  }`}>
                    {s.tag}
                  </span>
                </button>
                {active && (
                  <p className="rounded-b-xl border border-t-0 border-amber-300/20 bg-amber-300/4 px-3.5 py-2 text-[9.5px] leading-relaxed text-ink-dim" style={{ animation: "mf-fade .2s ease-out both" }}>
                    Seat held for “{EV_SESSIONS.find((x) => x.date === s.date && x.when === s.when)?.t}”. Doors open 15 minutes before — see you there.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


const MF_CITIES = [
  { city: "Rotterdam", tz: "Europe/Amsterdam", note: "studio + workshop floor", hours: "mon–fri · 9–18" },
  { city: "Singapore", tz: "Asia/Singapore", note: "APAC hub · by appointment", hours: "tue + thu · 10–16" },
  { city: "Lisbon", tz: "Europe/Lisbon", note: "the remote-friendly attic", hours: "always online" },
] as const;


export function MapFreeLocalBand() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(t);
  }, []);
  const time = (tz: string) =>
    new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz }).format(now);
  return (
    <div className="flex h-full w-full flex-col justify-center overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(52,211,153,0.09),transparent_60%),#08090f] px-6">
      <div className="mx-auto w-full max-w-md">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-ink-faint">where we work · no map, no tracker</p>
        <div className="mt-3 space-y-2">
          {MF_CITIES.map((c) => {
            const t = time(c.tz);
            const late = Number(t.split(":")[0]) >= 18 || Number(t.split(":")[0]) < 9;
            return (
              <div key={c.city} className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/3 px-3.5 py-3">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className={`absolute inline-flex h-full w-full rounded-full opacity-60 ${late ? "bg-amber-300" : "bg-emerald-300"}`} style={{ animation: "mf-glow 2s ease-in-out infinite" }} />
                  <span className={`relative inline-flex h-2 w-2 rounded-full ${late ? "bg-amber-300" : "bg-emerald-300"}`} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[11px] font-black tracking-tight text-white">{c.city}</span>
                    <span className="shrink-0 font-mono text-[10px] text-ink-dim">
                      {t}
                      <span className="ml-1 text-[8px] text-ink-faint">{late ? "closed" : "open"}</span>
                    </span>
                  </div>
                  <p className="truncate text-[9px] text-ink-faint">
                    {c.note} · {c.hours}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-center text-[9px] leading-relaxed text-ink-faint">
          local time is computed live from the real timezone — a map-free band that still answers “is anyone awake there?”.
        </p>
      </div>
    </div>
  );
}


const AST_SHOTS = [
  {
    id: "shelf",
    cap: "The asset shelf — filters on the left, live previews on the right.",
    tag: "browse",
    art: "linear-gradient(160deg, hsl(262 70% 22%), hsl(262 80% 34%))",
  },
  {
    id: "detail",
    cap: "Every asset page carries code, tokens and a design note — no tab roulette.",
    tag: "inspect",
    art: "linear-gradient(160deg, hsl(199 80% 20%), hsl(199 90% 36%))",
  },
  {
    id: "admin",
    cap: "The admin updates the same localStorage store the site reads — no fake CRUD.",
    tag: "manage",
    art: "linear-gradient(160deg, hsl(172 70% 18%), hsl(172 80% 32%))",
  },
  {
    id: "learn",
    cap: "Learn essays sit next to the components they teach — theory 20cm from practice.",
    tag: "read",
    art: "linear-gradient(160deg, hsl(30 80% 20%), hsl(30 90% 34%))",
  },
] as const;


export function AppScreenshotTour() {
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    const t = window.setTimeout(() => setIdx((i) => (i + 1) % AST_SHOTS.length), 3400);
    return () => window.clearTimeout(t);
  }, [auto, idx]);
  const shot = AST_SHOTS[idx];
  return (
    <div className="flex h-full w-full flex-col justify-center overflow-hidden bg-[radial-gradient(60%_90%_at_50%_0%,rgba(139,92,246,0.12),transparent_60%),#08090f] px-6">
      <div className="mx-auto grid w-full max-w-md grid-cols-[150px_minmax(0,1fr)] items-center gap-4">
        <div className="flex justify-center">
          <div className="w-[122px] rounded-[26px] border border-white/12 bg-black/50 p-2 shadow-[0_24px_60px_rgba(0,0,0,.5)]">
            <div className="rounded-[19px] border border-white/6 p-1.5" style={{ background: shot.art }}>
              <div className="mx-auto mb-1.5 h-1 w-8 rounded-full bg-black/40" />
              <div className="space-y-1 rounded-lg bg-black/25 p-1.5">
                <div className="h-1 w-3/4 rounded-full bg-white/25" />
                <div className="h-1 w-1/2 rounded-full bg-white/15" />
                <div className="mt-1.5 grid grid-cols-2 gap-1">
                  <div className="h-6 rounded-md bg-white/15" />
                  <div className="h-6 rounded-md bg-white/15" />
                </div>
                <div className="mt-1.5 h-1 w-full rounded-full bg-white/15" />
                <div className="h-1 w-2/3 rounded-full bg-white/10" />
              </div>
              <p className="mt-1.5 text-center font-mono text-[7px] uppercase tracking-[0.18em] text-white/70">{shot.tag}</p>
            </div>
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-ink-faint">product tour · {idx + 1}/{AST_SHOTS.length}</p>
          <p className="mt-2 min-h-12 text-[12px] font-bold leading-relaxed text-white" style={{ animation: "mf-fade .3s ease-out both" }} key={shot.id}>
            {shot.cap}
          </p>
          <div className="mt-2 flex gap-1.5">
            {AST_SHOTS.map((sh, i) => (
              <button
                key={sh.id}
                type="button"
                aria-label={`Show ${sh.tag}`}
                onClick={() => {
                  setIdx(i);
                  setAuto(false);
                }}
                className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-violet-300" : "w-1.5 bg-white/20 hover:bg-white/40"}`}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAuto((a) => !a)}
              aria-pressed={auto}
              className={`btn ${auto ? "!border-white/12 !bg-white/6 !text-white" : "btn-ghost"} !px-3 !py-1 !text-[10px]`}
            >
              {auto ? "❚❚ stop auto" : "▶ auto tour"}
            </button>
            <span className="text-[9px] text-ink-faint">caption swaps with the screen; dots pick a stop</span>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-5 w-full max-w-md text-center text-[9px] leading-relaxed text-ink-faint">
        the phone stays put while the story changes — the sticky-frame pattern that lets a tour read like a scroll, not a slideshow.
      </p>
    </div>
  );
}


export function TemplateDocsSite() {
  const sections = ["overview", "install", "tokens", "components", "motion"];
  const [active, setActive] = useState("overview");
  const scroller = useRef<HTMLDivElement>(null);
  const jump = (id: string) => {
    setActive(id);
    const el = scroller.current?.querySelector(`[data-sec="${id}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0c13]">
      <div className="flex items-center gap-2 border-b border-white/6 px-4 py-2">
        <span className="rounded-md border border-white/10 px-2 py-0.5 font-mono text-[9px] text-ink-faint">docs</span>
        <span className="truncate text-[10px] font-bold text-white/80">Getting started · motif/ui</span>
        <span className="ml-auto rounded-full border border-white/10 px-2 py-0.5 font-mono text-[9px] text-emerald-300">v1.3</span>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[92px_minmax(0,1fr)]">
        <nav className="flex flex-col gap-0.5 overflow-y-auto border-r border-white/6 px-2 py-3" aria-label="Docs sections">
          {sections.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => jump(s)}
              aria-current={active === s ? "true" : undefined}
              className={`rounded-lg px-2 py-1.5 text-left text-[10px] font-bold capitalize transition-colors ${
                active === s ? "bg-white/10 text-white" : "text-ink-faint hover:bg-white/5 hover:text-ink-dim"
              }`}
            >
              {s}
            </button>
          ))}
        </nav>
        <div ref={scroller} onScroll={(e) => {
          const el = e.currentTarget;
          let cur = sections[0];
          sections.forEach((s) => {
            const node = el.querySelector(`[data-sec="${s}"]`) as HTMLElement | null;
            if (node && node.offsetTop - 70 <= el.scrollTop) cur = s;
          });
          setActive(cur);
        }} className="min-h-0 overflow-y-auto px-4 py-4">
          <div className="space-y-6">
            {[
              ["overview", "A library that reads like a book", "Every asset page ships code, tokens and a design note in one place, so onboarding is one scroll instead of five tabs."],
              ["install", "npm i motif-ui", "One command, no peer-dependency maze. The package is 4 kB gzipped and carries zero runtime."],
              ["tokens", "Tokens before themes", "Colour, type and spacing are data first; dark mode is a token swap, not a stylesheet rewrite."],
              ["components", `${COMPONENTS.length} assets and counting`, "Inputs, sections and signature motion pieces — each with an original demo, copy snippet and a11y score."],
              ["motion", "A motion language, not a toolbox", "Under 200ms for feedback, 500ms+ for story beats, and reduced-motion kills the theatre — by design."],
            ].map(([id, t, b]) => (
              <section key={id} data-sec={id} className="scroll-mt-4">
                <div className="text-[13px] font-black tracking-tight text-white" data-demo-heading="h3">{t}</div>
                <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-dim">{b}</p>
              </section>
            ))}
            <div className="flex items-center justify-between border-t border-white/6 pt-3">
              <button type="button" className="text-[10px] font-bold text-ink-dim hover:text-white">← Previous</button>
              <button type="button" onClick={() => jump(sections[(sections.indexOf(active) + 1) % sections.length])} className="rounded-lg bg-white/10 px-3 py-1.5 text-[10px] font-black text-white hover:bg-white/15">
                Next: {sections[(sections.indexOf(active) + 1) % sections.length]} →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export function TemplateLandingSaas() {
  const scroller = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const go = (id: string) => {
    setMenuOpen(false);
    scroller.current?.querySelector(`[data-sec="${id}"]`)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0c13]">
      <div className="flex items-center justify-between border-b border-white/6 px-4 py-2">
        <span className="text-[11px] font-black tracking-tight text-white">
          motif<span className="text-violet-300">/</span>ui
        </span>
        <nav className="hidden items-center gap-3 sm:flex" aria-label="Landing nav">
          {["features", "pricing", "faq"].map((n) => (
            <button key={n} type="button" onClick={() => go(n)} className="text-[10px] font-bold text-ink-dim hover:text-white">
              {n}
            </button>
          ))}
          <button type="button" onClick={() => go("cta")} className="rounded-lg bg-white px-3 py-1 text-[10px] font-black text-[#0b0c12]">
            Start free
          </button>
        </nav>
        <button
          type="button"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((m) => !m)}
          className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] sm:hidden"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
      {menuOpen && (
        <div className="flex flex-col gap-2 border-b border-white/6 bg-black/40 px-4 py-3 sm:hidden" style={{ animation: "mf-fade .15s ease-out both" }}>
          {["features", "pricing", "faq"].map((n) => (
            <button key={n} type="button" onClick={() => go(n)} className="rounded-lg px-2 py-1.5 text-left text-[11px] font-bold text-ink-dim hover:bg-white/5">
              {n}
            </button>
          ))}
        </div>
      )}
      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto">
        <section data-sec="hero" className="px-5 pb-8 pt-8 text-center" style={{ background: "radial-gradient(70% 100% at 50% 0%, rgba(139,92,246,.22), transparent 60%)" }}>
          <div className="mx-auto max-w-sm">
            <span className="rounded-full border border-violet-300/25 bg-violet-300/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-violet-200">
              dark SaaS template
            </span>
            <div className="mt-3 text-2xl font-black leading-tight tracking-tight text-white" data-demo-heading="h2">
              The component library your roadmap <span className="text-violet-300">kept promising</span>
            </div>
            <p className="mx-auto mt-2 max-w-[300px] text-[11px] leading-relaxed text-ink-dim">
              Original assets, honest a11y and a motion language — assembled from the same sections on this page.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <button type="button" onClick={() => go("features")} className="rounded-lg bg-white px-4 py-2 text-[11px] font-black text-[#0b0c12]">
                See features
              </button>
              <button type="button" onClick={() => go("pricing")} className="rounded-lg border border-white/15 px-4 py-2 text-[11px] font-bold text-white/85">
                View pricing
              </button>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[9px] text-ink-faint">
              {["northwind", "arclight", "hazel&co", "plainday", "solidpine"].map((l) => (
                <span key={l} className="rounded-full border border-white/8 bg-white/3 px-2.5 py-1 font-mono opacity-80 hover:opacity-100">
                  {l}
                </span>
              ))}
            </div>
          </div>
        </section>
        <section data-sec="features" className="border-t border-white/6 px-5 py-6">
          <div className="mx-auto grid max-w-sm grid-cols-3 gap-2">
            {[
              ["tokens", "one source of truth"],
              ["motion", "budgeted animation"],
              ["a11y", "tested, not bolted"],
            ].map(([t, b]) => (
              <div key={t} className="rounded-xl border border-white/6 bg-white/3 p-3">
                <span className="text-lg text-violet-300">◈</span>
                <p className="mt-1 text-[10px] font-black capitalize text-white">{t}</p>
                <p className="mt-0.5 text-[8.5px] leading-snug text-ink-dim">{b}</p>
              </div>
            ))}
          </div>
        </section>
        <section data-sec="pricing" className="border-t border-white/6 px-5 py-6">
          <div className="mx-auto grid max-w-sm grid-cols-3 gap-2">
            {[
              ["Studio", "$0"],
              ["Team", "$24"],
              ["Agency", "$64"],
            ].map(([n, p], i) => (
              <div key={n} className={`rounded-xl border p-3 text-center ${i === 1 ? "border-emerald-300/35 bg-emerald-300/8" : "border-white/8 bg-white/3"}`}>
                <p className="text-[10px] font-black text-white">{n}</p>
                <p className="mt-1 text-base font-black text-white">
                  {p}
                  <span className="text-[8px] text-ink-faint">/mo</span>
                </p>
                <button type="button" className={`mt-2 w-full rounded-lg px-2 py-1 text-[9px] font-black ${i === 1 ? "bg-emerald-300 text-[#06120c]" : "bg-white/10 text-white"}`}>
                  {i === 0 ? "Free" : "Choose"}
                </button>
              </div>
            ))}
          </div>
        </section>
        <section data-sec="faq" className="border-t border-white/6 px-5 py-6">
          <div className="mx-auto max-w-sm space-y-1.5">
            {[
              ["Original?", "Every asset is authored in-house."],
              ["Licence?", "MIT, including client work."],
              ["Fast?", "Zero runtime on your page."],
            ].map(([q, a]) => (
              <div key={q} className="flex items-baseline gap-2 rounded-lg border border-white/6 bg-white/2 px-3 py-2">
                <span className="shrink-0 text-[10px] font-black text-white">{q}</span>
                <span className="text-[9.5px] text-ink-dim">{a}</span>
              </div>
            ))}
          </div>
        </section>
        <section data-sec="cta" className="border-t border-white/6 px-5 py-6 text-center" style={{ background: "linear-gradient(180deg, transparent, rgba(52,211,153,.08))" }}>
          <p className="text-sm font-black text-white">Stop promising the library. Ship it.</p>
          <button type="button" onClick={() => go("hero")} className="mt-3 rounded-lg bg-emerald-300 px-5 py-2 text-[11px] font-black text-[#06120c]">
            Start building free
          </button>
        </section>
        <p className="border-t border-white/6 px-5 py-3 text-center text-[8px] text-ink-faint">
          assembled from shipped sections · hero → logos → features → pricing → faq → cta
        </p>
      </div>
    </div>
  );
}


export function TemplateWaitlist() {
  const [target] = useState(() => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + 1);
    d.setHours(9, 0, 0, 0);
    return d;
  });
  const [left, setLeft] = useState(() => target.getTime() - Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setLeft(target.getTime() - Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [target]);
  const seg = (ms: number) => Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(seg(left) / 86400);
  const hrs = Math.floor((seg(left) % 86400) / 3600);
  const mins = Math.floor((seg(left) % 3600) / 60);
  const secs = seg(left) % 60;
  const [code] = useState("MOTIF-EARLY-42");
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch { /* clipboard may be blocked in sandboxed iframes */ }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex h-full w-full flex-col justify-center overflow-hidden bg-[radial-gradient(70%_100%_at_50%_0%,rgba(52,211,153,0.14),transparent_60%),#08090f] px-6">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-white/8 bg-white/4 p-6 text-center">
        <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.22em] text-emerald-200">
          waitlist · batch {pad(hrs + days * 24)}h
        </span>
        <div className="mt-3 text-xl font-black tracking-tight text-white" data-demo-heading="h3">motif desktop is almost here</div>
        <p className="mx-auto mt-1.5 max-w-[300px] text-[11px] leading-relaxed text-ink-dim">
          invite-only access opens at 09:00 on the first of next month. Your spot is saved the moment you join.
        </p>
        <div className="mt-4 grid grid-cols-4 gap-1.5 font-mono">
          {[
            [pad(days), "days"],
            [pad(hrs), "hrs"],
            [pad(mins), "min"],
            [pad(secs), "sec"],
          ].map(([v, k]) => (
            <div key={k} className="rounded-xl border border-white/8 bg-black/30 py-2.5">
              <span className="block text-lg font-black leading-none text-white tabular-nums">{v}</span>
              <span className="mt-1 block text-[8px] uppercase tracking-[0.18em] text-ink-faint">{k}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-emerald-300/30 bg-emerald-300/5 px-3 py-2.5">
          <span className="min-w-0 flex-1 truncate text-left font-mono text-[11px] font-bold tracking-[0.14em] text-emerald-200">{code}</span>
          <button type="button" onClick={copy} className="shrink-0 rounded-lg bg-white/10 px-3 py-1.5 text-[10px] font-black text-white hover:bg-white/15">
            {copied ? "✓ copied" : "Copy invite"}
          </button>
        </div>
        <p className="mt-3 text-[9px] text-ink-faint">
          referral code: friends who join with it move one spot up the list — honesty, the countdown is real.
        </p>
      </div>
    </div>
  );
}


const TJ_ITEMS = [
  { kind: "essay", title: "Empty states are onboarding", meta: "learn · 6 min", tone: "border-violet-300/25 bg-violet-300/10 text-violet-200" },
  { kind: "release", title: "v1.3 — eight new sections", meta: "changelog · mar 2026", tone: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200" },
  { kind: "essay", title: "Motion on a budget", meta: "learn · 9 min", tone: "border-violet-300/25 bg-violet-300/10 text-violet-200" },
  { kind: "release", title: "v1.2 — pricing & newsletter", meta: "changelog · feb 2026", tone: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200" },
  { kind: "essay", title: "The audit that ran itself", meta: "learn · 7 min", tone: "border-violet-300/25 bg-violet-300/10 text-violet-200" },
] as const;


export function TemplateChangelogJournal() {
  const [pick, setPick] = useState<string | null>("Empty states are onboarding");
  return (
    <div className="flex h-full w-full flex-col bg-[#0a0c13]">
      <div className="flex items-center justify-between border-b border-white/6 px-4 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">journal · essays + releases</span>
        <span className="flex gap-1.5">
          <span className="rounded-full border border-violet-300/20 px-2 py-0.5 text-[8px] font-bold uppercase text-violet-200">essays</span>
          <span className="rounded-full border border-emerald-300/20 px-2 py-0.5 text-[8px] font-bold uppercase text-emerald-200">releases</span>
        </span>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)]">
        <div className="space-y-1.5 overflow-y-auto px-4 py-3">
          {TJ_ITEMS.map((it) => {
            const open = pick === it.title;
            return (
              <button
                key={it.title}
                type="button"
                onClick={() => setPick(open ? null : it.title)}
                aria-expanded={open}
                className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors ${open ? "border-white/15 bg-white/5" : "border-white/6 bg-white/2 hover:border-white/12"}`}
              >
                <span className={`rounded-full border px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.16em] ${it.tone}`}>{it.kind}</span>
                <span className="min-w-0 flex-1 truncate text-[11px] font-bold text-white/90">{it.title}</span>
                <span className="shrink-0 text-[8px] uppercase tracking-[0.14em] text-ink-faint">{it.meta.split("·")[1]?.trim()}</span>
              </button>
            );
          })}
          <p className="pt-2 text-center text-[9px] text-ink-faint">one index for both streams — a changelog that reads like a journal, or the reverse.</p>
        </div>
      </div>
    </div>
  );
}

