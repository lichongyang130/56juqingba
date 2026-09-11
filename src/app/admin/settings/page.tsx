"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

export default function AdminSettings() {
  const [name, setName] = useState(SITE.name);
  const [tagline, setTagline] = useState(SITE.tagline);
  const [accentHue, setAccentHue] = useState(258);
  const [promoMode, setPromoMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Settings</h1>
          <p className="mt-1 text-sm text-ink-dim">Brand, site meta, feature flags and content policy.</p>
        </div>
        <button type="button" className="btn btn-primary !py-2 text-xs" onClick={save}>
          {saved ? "✓ Saved (demo)" : "Save changes"}
        </button>
      </div>

      {/* brand */}
      <section className="rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="font-extrabold tracking-tight">Brand & identity</h2>
        <p className="mt-1 text-xs text-ink-dim">These values drive the public chrome — one source of truth in src/lib/site.ts.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="field-label">Site name</span>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="block">
            <span className="field-label">Tagline</span>
            <input className="input" value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </label>
        </div>
        <div className="mt-4 flex items-center justify-between gap-6 rounded-2xl border border-white/7 bg-black/20 p-4">
          <div>
            <span className="field-label !mb-0">Accent hue (tokens)</span>
            <p className="mt-1 text-[11px] text-ink-faint">
              Re-maps every Motif UI demo accent at once — the Theme Studio idea, simplified here.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <input type="range" min={0} max={360} value={accentHue} onChange={(e) => setAccentHue(Number(e.target.value))} className="w-36" aria-label="Accent hue" />
            <span
              className="h-9 w-9 rounded-xl border border-white/20 shadow-lg"
              style={{ background: `linear-gradient(135deg, hsl(${accentHue} 85% 62%), hsl(${(accentHue + 60) % 360} 90% 60%))` }}
            />
          </div>
        </div>
      </section>

      {/* feature flags */}
      <section className="rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="font-extrabold tracking-tight">Feature flags</h2>
        <div className="mt-4 divide-y divide-white/5">
          {[
            { k: "community_submissions", label: "Community submissions open", on: true },
            { k: "prompt_retest_cron", label: "Weekly prompt re-test cron", on: true },
            { k: "vue_stack_view", label: "Vue stack views (beta)", on: false },
            { k: "light_theme", label: "Light theme experiment", on: false },
            { k: "stripe_checkout", label: "Stripe checkout (production)", on: false },
          ].map((f) => (
            <div key={f.k} className="flex items-center justify-between gap-4 py-3.5">
              <div>
                <div className="text-sm font-semibold">{f.label}</div>
                <div className="font-mono text-[11px] text-ink-faint">{f.k}</div>
              </div>
              {/* A switch has to be a control, not a span with a role: a span
                  cannot be reached by Tab, so role="switch" on one is a promise
                  the markup cannot keep. The one flag this demo actually wires
                  (the checkout promo) is operable; the rest are shown disabled
                  and say so. aria-checked reads the same value the colour does,
                  so the announcement and the picture agree. */}
              {(() => {
                const wired = f.k === "stripe_checkout";
                const on = wired ? promoMode : f.on;
                return (
                  <button
                    type="button"
                    role="switch"
                    aria-checked={on}
                    aria-label={f.label}
                    disabled={!wired}
                    title={wired ? "Toggles the promo banner in this demo" : "Not wired in this demo build — shown for layout"}
                    onClick={() => setPromoMode((v) => !v)}
                    className={`flex h-6 w-11 shrink-0 items-center rounded-full border px-0.5 transition-colors ${
                      on ? "justify-end border-mint/40 bg-mint/50" : "justify-start border-white/15 bg-white/8"
                    } ${wired ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
                  >
                    <span className="h-[18px] w-[18px] rounded-full bg-white shadow" />
                  </button>
                );
              })()}
            </div>
          ))}
        </div>
      </section>

      {/* content policy */}
      <section className="rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="font-extrabold tracking-tight">Content policy defaults</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            ["Default license for assets", "MIT"],
            ["Guides license", "CC BY 4.0"],
            ["Min a11y score to auto-approve", "≥ 95"],
            ["Max bundle for 'zero-dep' badge", "5 KB gzip"],
          ].map(([k, v]) => (
            <label key={k} className="block">
              <span className="field-label">{k}</span>
              <input className="input" defaultValue={v} />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-danger/20 bg-danger/4 p-6">
        <h2 className="font-extrabold tracking-tight text-danger">Danger zone</h2>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-ink-dim">Purge the demo dataset and start from an empty database.</p>
          <button type="button" className="btn !border-danger/40 !bg-danger/10 !text-danger hover:!bg-danger/20">Reset demo data…</button>
        </div>
      </section>
    </div>
  );
}
