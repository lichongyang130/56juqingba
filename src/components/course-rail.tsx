"use client";

/* ============================================================
   Motif UI — Course rail. Detail-page enhancements that turn
   every asset page into a small course: variants, theming,
   recipes, performance, a11y, composition. Data-driven, so a
   generic asset still gets a useful rail.
   ============================================================ */

import Link from "next/link";
import { useMemo, useState } from "react";
import { DemoView } from "@/components/demos/Demo";
import { Stage } from "@/components/cards";
import { LEARN_ARTICLES } from "@/lib/learn";
import { accentHue, COMPONENTS, KIND_META } from "@/lib/data";
import type { Asset } from "@/lib/types";

function RailSection({ id, title, kicker, children }: { id: string; title: string; kicker: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-3xl border border-white/8 bg-panel p-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-faint">{kicker}</p>
      <h2 className="mt-1 text-xl font-extrabold tracking-tight">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

const TONE_VARIANTS = [
  { label: "Studio default", h: 262, note: "violet-ink — the library's home ambience" },
  { label: "Warm print", h: 32, note: "amber paper — reads editorial and calm" },
  { label: "Cool signal", h: 192, note: "cyan — crisp, technical, night-mode friendly" },
];

const KIND_PERF: Record<Asset["kind"], { cost: string; why: string; alt: string }> = {
  element: { cost: "negligible", why: "a single painted surface; nothing moves unless hovered.", alt: "if you need even lighter, the plain HTML version skips React entirely — same result, ~0 KB." },
  animated: { cost: "compositor-bound", why: "motion runs on transform/opacity layers; the cost scales with layer count and blur radius.", alt: "the static preview variant removes the animation loop and keeps the layout — a quieter, cheaper sibling." },
  section: { cost: "one-time layout", why: "text and cards paint once; the cost is in image weight and font loading, not the structure.", alt: "the minimal variant drops the decorative layers and keeps the content hierarchy." },
  template: { cost: "page-scale", why: "a whole page — budget images first; the interactive parts are a small fraction of the weight.", alt: "compose the same page from section assets to strip what you do not need." },
};

const KIND_FEATURES: Record<Asset["kind"], string[]> = {
  element: ["HTML semantics", "focus-visible", "custom properties", "prefers-reduced-motion"],
  animated: ["CSS transforms", "opacity compositing", "custom properties", "prefers-reduced-motion", "will-change"],
  section: ["CSS Grid", "flexbox", "custom properties", "container queries (optional)"],
  template: ["CSS Grid", "next/image or picture", "custom properties", "scroll-margin for anchors"],
};

const KIND_RECIPE: Record<Asset["kind"], { fits: string; pattern: string }> = {
  element: {
    fits: "Put it where a micro-decision happens: a toggle, a loader, a hover state — the small moments that make an interface feel considered.",
    pattern: "Drop it into the exact spot it belongs, keep the default props until the copy is final, then tune the one knob that matters for your context.",
  },
  animated: {
    fits: "Use it as the signature of a single screen — a hero backdrop, an entrance, a transition. One signature per screen; everything else stays quiet.",
    pattern: "Compose it with calm content around it: the motion earns attention only when the layout does not compete for it.",
  },
  section: {
    fits: "Assemble it between your own header and footer — sections are the middle of the page, where information architecture lives.",
    pattern: "Swap the demo copy for real content first, then reduce: cut decorative blocks until the section survives on its information alone.",
  },
  template: {
    fits: "Start here when a page shape is 80% of the battle — a landing, a changelog, a waitlist — then replace the demo voice with yours.",
    pattern: "Duplicate the template, re-theme the tokens, then replace sections one at a time so the layout never breaks mid-edit.",
  },
};

const KIND_WALK: Record<Asset["kind"], string[]> = {
  element: ["Tab to the element — the focus ring is visible before interaction", "Activate with Enter or Space — the state change announces itself", "Tab past — nothing traps focus; the next stop is in DOM order"],
  animated: ["Tab to the scene — motion is paused or non-essential for keyboard users", "Interact with any controls — they are real buttons with focus rings", "Tab through — the animation never intercepts the focus path"],
  section: ["Tab into the section via the skip link or heading anchor", "Walk its interactive children — each has a visible focus state", "Dismiss or close paths (if any) return focus to the trigger"],
  template: ["Skip link jumps to main content", "Walk the nav — current page is announced", "Every card and CTA is reachable; headings are in order throughout"],
};

export default function CourseRail({ asset }: { asset: Asset }) {
  const hue = accentHue(asset.slug);
  const accent = `hsl(${hue} 85% 62%)`;
  const kindLabel = KIND_META[asset.kind].label;
  const perf = KIND_PERF[asset.kind];
  const features = KIND_FEATURES[asset.kind];
  const recipe = KIND_RECIPE[asset.kind];
  const walk = KIND_WALK[asset.kind];
  const [step, setStep] = useState(0);
  const [variant, setVariant] = useState(0);
  const [theme, setTheme] = useState(0);

  const pairsWith = useMemo(
    () => COMPONENTS.filter((c) => c.kind === asset.kind && c.slug !== asset.slug).slice(0, 3),
    [asset]
  );

  const essays = useMemo(() => {
    const query = asset.tags.concat([asset.kind]).join(" ").toLowerCase();
    return LEARN_ARTICLES.filter((a) => {
      const hay = (a.title + " " + a.tags.join(" ") + " " + a.deck).toLowerCase();
      const terms = ["motion", "animation", "css", "button", "colour", "color", "form", "layout", "grid", "performance", "a11y", "accessibility", "easing", "scroll", "contrast"];
      return terms.some((t) => query.includes(t) && hay.includes(t));
    }).slice(0, 3);
  }, [asset]);

  return (
    <div className="mt-16 space-y-6">
      <h2 className="text-xl font-extrabold tracking-tight">Course rail — understand it before you ship it</h2>

      {/* variant gallery */}
      <RailSection id="variant-gallery" title="Variant gallery" kicker="Live variants">
        <p className="text-xs leading-relaxed text-ink-dim">The same {asset.title} demo re-lit in three tones — no code change, three personalities.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {TONE_VARIANTS.map((v, i) => (
            <button
              key={v.label}
              type="button"
              onClick={() => setVariant(i)}
              className={`rounded-2xl border p-2 text-left transition-colors ${variant === i ? "border-white/30 bg-white/[.05]" : "border-white/8 hover:border-white/20"}`}
            >
              <Stage className="rounded-xl">
                <DemoView demo={asset.demo} props={{}} />
                <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-soft-light" style={{ background: `radial-gradient(85% 95% at 18% 8%, hsl(${v.h} 90% 62% / 1), transparent 65%)`, opacity: 0.5 }} />
              </Stage>
              <span className="mt-2 block text-xs font-bold">{v.label}</span>
              <span className="block text-[10px] text-ink-faint">{v.note}</span>
            </button>
          ))}
        </div>
      </RailSection>

      {/* theming example */}
      <RailSection id="theming-example" title="Theming example — two token themes" kicker="Theme Studio preview">
        <p className="text-xs leading-relaxed text-ink-dim">Assets are token-driven ({asset.themeable ? "100% design-token driven" : "static palette today"}). Here the same scene runs under two theme presets from the token sheet.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            { name: "Midnight / violet", h: 262, bg: "#0b0d14", note: "--accent 262 · dark surfaces" },
            { name: "Bone / amber", h: 40, bg: "#f5f1e8", note: "--accent 40 · paper surfaces" },
          ].map((t, i) => (
            <div key={t.name}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold">{t.name}</span>
                <button type="button" onClick={() => setTheme(i)} className="chip cursor-pointer !text-[9px]">{theme === i ? "previewing" : "preview"}</button>
              </div>
              <div className="mt-2 overflow-hidden rounded-xl" style={{ background: t.bg }}>
                <Stage className="rounded-xl">
                  <DemoView demo={asset.demo} props={{}} />
                  <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-soft-light" style={{ background: `radial-gradient(85% 95% at 18% 8%, hsl(${t.h} 90% 62% / 1), transparent 65%)`, opacity: theme === i ? 0.45 : 0.12 }} />
                </Stage>
              </div>
              <p className="mt-1 text-[10px] text-ink-faint">{t.note}</p>
            </div>
          ))}
        </div>
      </RailSection>

      {/* usage recipe */}
      <RailSection id="usage-recipe" title="Usage recipe — where this fits" kicker="90-second read">
        <p className="text-xs leading-relaxed text-ink-dim"><b className="text-ink">{recipe.fits}</b></p>
        <p className="mt-2 text-xs leading-relaxed text-ink-dim">{recipe.pattern}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
          <span className="chip">belongs in {kindLabel.toLowerCase()}</span>
          {asset.behaviors.map((b) => <span key={b} className="chip capitalize">{b} behaviour</span>)}
        </div>
      </RailSection>

      {/* perf note */}
      <RailSection id="perf-note" title="Performance note" kicker="Cost honesty">
        <div className="flex items-center gap-3">
          <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: `${accent}1f`, color: accent }}>{asset.bundleKb} KB gzip</span>
          <span className="text-xs text-ink-dim"><b className="text-ink">{perf.cost}</b> — {perf.why}</span>
        </div>
        <p className="mt-3 rounded-xl border border-white/6 bg-white/[.02] px-3.5 py-2.5 text-xs leading-relaxed text-ink-dim">
          <b className="text-ink">Cheaper alternative — </b>{perf.alt}
        </p>
      </RailSection>

      {/* browser support strip */}
      <RailSection id="browser-support" title="Browser support strip" kicker="What it needs">
        <div className="flex flex-wrap gap-2">
          {features.map((f) => <span key={f} className="chip !text-[10px]">{f}</span>)}
          <span className="chip !border-mint/30 !text-mint">all evergreen browsers</span>
        </div>
        <p className="mt-2 text-[10px] text-ink-faint">No polyfills ship with the asset — if a listed feature is missing in a target browser, the graceful fallback is the static layout.</p>
      </RailSection>

      {/* reduced-motion note */}
      <RailSection id="reduced-motion-note" title="Reduced-motion fallback" kicker="prefers-reduced-motion">
        {asset.kind === "animated" || asset.kind === "element" ? (
          <>
            <p className="text-xs leading-relaxed text-ink-dim">
              With <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-[11px] text-cyan-200">prefers-reduced-motion: reduce</code>, the animation loop and travel are removed; state changes
              keep working through opacity and colour (≤ 300ms). The demo you see above honours the switch — try it in your OS settings and the loop will quiet down.
            </p>
            <p className="mt-2 rounded-xl border border-emerald-300/15 bg-emerald-400/5 px-3.5 py-2.5 text-xs leading-relaxed text-emerald-100/85">
              <b>Design rule:</b> the reduced branch is a second design, not a stripped page — every state change stays visible.
            </p>
          </>
        ) : (
          <p className="text-xs leading-relaxed text-ink-dim">
            This asset is not motion-first, so reduced-motion mainly affects its decorative extras (reveals, hovers). The content layer never depends on motion to be readable.
          </p>
        )}
      </RailSection>

      {/* keyboard walk */}
      <RailSection id="keyboard-walk" title="Keyboard walk demo" kicker="Pressable step-through">
        <p className="text-xs leading-relaxed text-ink-dim">Step through what a keyboard user experiences with this asset.</p>
        <div className="mt-4 flex items-start gap-4 rounded-2xl border border-white/8 bg-[#0b0d14] p-4">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black" style={{ background: `${accent}22`, color: accent }}>{step + 1}</span>
          <p className="text-[13px] leading-relaxed text-ink-dim">{walk[step]}</p>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-1.5">
            {walk.map((_, i) => (
              <button key={i} type="button" onClick={() => setStep(i)} aria-label={`step ${i + 1}`} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6" : "w-1.5 bg-white/15 hover:bg-white/30"}`} style={i === step ? { background: accent } : undefined} />
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="btn btn-ghost !px-3 !py-1 text-xs disabled:opacity-40">← back</button>
            <button type="button" onClick={() => setStep((s) => Math.min(walk.length - 1, s + 1))} disabled={step === walk.length - 1} className="btn btn-primary !px-3 !py-1 text-xs disabled:opacity-40">next →</button>
          </div>
        </div>
      </RailSection>

      {/* composition map */}
      <RailSection id="composition-map" title="Composition map — what pairs well" kicker="Auto-suggested">
        <p className="text-xs leading-relaxed text-ink-dim">Same-family assets that compose cleanly with this one:</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {pairsWith.length === 0 && <p className="text-xs text-ink-dim">The rest of this {kindLabel.toLowerCase()} family is still in the kiln — check the full catalog.</p>}
          {pairsWith.map((c) => (
            <Link key={c.slug} href={`/components/${c.slug}`} className="card-hover rounded-2xl border border-white/8 bg-white/[.02] p-4">
              <span className="chip !text-[9px]">{KIND_META[c.kind].label}</span>
              <p className="mt-2 text-sm font-bold leading-tight">{c.title}</p>
              <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-ink-dim">{c.description}</p>
            </Link>
          ))}
        </div>
        {essays.length > 0 && (
          <div className="mt-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-faint">Learn essays that teach the technique</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {essays.map((e) => (
                <Link key={e.slug} href={`/learn/${e.slug}`} className="chip cursor-pointer hover:!bg-white/10">{e.title}</Link>
              ))}
            </div>
          </div>
        )}
      </RailSection>
    </div>
  );
}

