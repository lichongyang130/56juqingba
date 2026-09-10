"use client";

// Section 14 — the interactive half: trial rail (#388), token demo (#389),
// cost meter (#391) and the lab gate (#390). Every one of these is a demo of
// a paid flow with no billing behind it; the copy says so on the surface, not
// only in a comment.

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  API_SCOPES,
  FEATURE_STATES,
  PACKS,
  PRO_FEATURES,
  TRIAL_DAYS,
  bundleMath,
  mintDemoToken,
} from "@/lib/pro";

/* -------------------------------------------------------------------
   #388 — the 7-day trial, day by day
   ------------------------------------------------------------------- */

export function TrialRail() {
  const [day, setDay] = useState(1);
  const reached = TRIAL_DAYS.filter((d) => d.day <= day);
  const unlocked = useMemo(() => new Set(reached.map((d) => d.unlock)), [reached]);
  const current = TRIAL_DAYS.find((d) => d.day === day) ?? TRIAL_DAYS[0];
  const unlockedFeatures = PRO_FEATURES.filter((f) => unlocked.has(f.id));
  const serverBound = unlockedFeatures.filter((f) => f.state === "needs-server").length;

  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Simulate the trial</p>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight">Day {day} of 7</h2>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="btn btn-ghost !px-3 !py-1.5 text-xs" onClick={() => setDay((d) => Math.max(1, d - 1))} disabled={day === 1}>
              ← Day {Math.max(1, day - 1)}
            </button>
            <button type="button" className="btn btn-primary !px-3 !py-1.5 text-xs" onClick={() => setDay((d) => Math.min(7, d + 1))} disabled={day === 7}>
              Day {Math.min(7, day + 1)} →
            </button>
            <button type="button" className="btn btn-ghost !px-3 !py-1.5 text-xs" onClick={() => setDay(1)}>
              Restart
            </button>
          </div>
        </div>

        <ol className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {TRIAL_DAYS.map((d) => {
            const isNow = d.day === day;
            const isPast = d.day < day;
            return (
              <li key={d.day}>
                <button
                  type="button"
                  onClick={() => setDay(d.day)}
                  aria-current={isNow ? "step" : undefined}
                  className={`h-full w-full rounded-2xl border px-3.5 py-3 text-left transition-colors ${
                    isNow
                      ? "border-violet-300/40 bg-violet-500/[.08]"
                      : isPast
                        ? "border-emerald-300/20 bg-emerald-400/[.03]"
                        : "border-white/8 bg-white/[.02] hover:border-white/16"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-extrabold">Day {d.day}</span>
                    <span className={`chip !text-[9px] ${FEATURE_STATES[d.state].chip}`}>{FEATURE_STATES[d.state].label}</span>
                  </div>
                  <p className="mt-1.5 text-[11px] leading-snug text-ink-dim">{PRO_FEATURES.find((f) => f.id === d.unlock)?.name}</p>
                  <p className="mt-1 text-[10px] leading-relaxed text-ink-faint">{d.note}</p>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="grid gap-5 md:grid-cols-[1.1fr_1fr]">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Unlocked by end of day {day}</p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-ink-dim">
            {unlockedFeatures.length} of {PRO_FEATURES.length} promises are open. Today&apos;s:{" "}
            <span className="font-bold text-ink">{PRO_FEATURES.find((f) => f.id === current.unlock)?.name}</span>.
          </p>
          <ul className="mt-4 space-y-2">
            {unlockedFeatures.map((f) => (
              <li key={f.id} className="flex items-center gap-2 text-[11px]">
                <span className={`chip !text-[9px] ${FEATURE_STATES[f.state].chip}`}>{FEATURE_STATES[f.state].label}</span>
                <span className="text-ink-dim">{f.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-dashed border-amber-300/25 bg-amber-300/[.04] p-6">
          <p className="text-sm font-extrabold text-amber-200">The trial ends where a server would have to begin</p>
          <p className="mt-2 text-[11px] leading-relaxed text-amber-100/80">
            By day {day} the trial has handed you {unlockedFeatures.filter((f) => f.state === "works-now").length} features that
            already work, {unlockedFeatures.filter((f) => f.state === "browser-demo").length} that live in this browser, and{" "}
            {serverBound} that cannot be delivered at all without one. A seven-day countdown over features that do not need a
            server would be theatre — the order here is the honest one, and day 7 says so out loud.
          </p>
          <p className="mt-3 text-[10px] leading-relaxed text-amber-100/60">
            No card is collected, no trial state persists beyond this page view, and nothing expires: reload and you are back
            on day 1 with the whole library still free.
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------
   #389 — API token demo
   ------------------------------------------------------------------- */

export function TokenForge() {
  const [label, setLabel] = useState("my-portfolio");
  const [scopes, setScopes] = useState<string[]>(["read:components"]);
  const [minted, setMinted] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const toggle = (id: string) =>
    setScopes((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const token = mintDemoToken(label || "unnamed", scopes);
  const writes = scopes.some((s) => s.startsWith("write:"));

  const copy = () => {
    setMinted(token);
    navigator.clipboard
      ?.writeText(token)
      .then(() => setNote("Copied. It is a demo string — no server would accept it."))
      .catch(() => setNote("Clipboard blocked here — select the string and copy it manually."));
  };

  return (
    <section className="space-y-5">
      <div className="grid gap-5 md:grid-cols-[1fr_1fr]">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">1 · Name the token</p>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            aria-label="Token label"
            placeholder="my-portfolio"
            className="mt-3 w-full rounded-xl border border-white/10 bg-white/[.03] px-3 py-2 font-mono text-xs text-ink outline-none focus:border-violet-300/50"
          />
          <p className="mt-1.5 text-[10px] text-ink-faint">
            The label changes the string but is not stored anywhere — this page keeps nothing.
          </p>

          <p className="mt-5 text-xs font-bold uppercase tracking-widest text-ink-faint">2 · Pick scopes</p>
          <div className="mt-3 space-y-2">
            {API_SCOPES.map((s) => {
              const on = scopes.includes(s.id);
              return (
                <label key={s.id} className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-white/8 bg-white/[.02] px-3 py-2">
                  <input type="checkbox" checked={on} onChange={() => toggle(s.id)} className="mt-0.5 accent-violet-400" />
                  <span>
                    <span className="font-mono text-[11px] font-bold">{s.id}</span>
                    <span className="ml-2 text-[11px] text-ink-dim">{s.note}</span>
                  </span>
                </label>
              );
            })}
          </div>
          {writes && (scopes.length === 1 || !scopes.includes("read:components")) && (
            <p className="mt-2 text-[10px] leading-relaxed text-amber-200/80">
              A write scope without a read scope is legal here but unusual — worth thinking about before it is real.
            </p>
          )}
        </div>

        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">3 · The string it would hand you</p>
          <div className="mt-3 rounded-2xl border border-white/8 bg-[#07090f] p-4">
            <code className="block break-all font-mono text-[12px] text-cyan-200">{token}</code>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary !px-3 !py-1.5 text-xs" onClick={copy}>
              Copy demo token
            </button>
            <button
              type="button"
              className="btn btn-ghost !px-3 !py-1.5 text-xs"
              onClick={() => {
                setScopes([]);
                setMinted(null);
                setNote("Scopes cleared. A real key with no scopes would be revoked, not kept.");
              }}
            >
              Revoke
            </button>
          </div>
          {minted && <p className="mt-2 break-all font-mono text-[10px] text-ink-faint">last minted: {minted}</p>}
          {note && <p className="mt-1 text-[11px] text-emerald-300/80">{note}</p>}

          <p className="mt-5 text-xs font-bold uppercase tracking-widest text-ink-faint">4 · The request it would make</p>
          <pre className="mt-2 overflow-x-auto rounded-2xl border border-white/8 bg-[#07090f] p-4 font-mono text-[10px] leading-relaxed text-ink-dim">{`GET /v1/components?kind=animated&limit=20
Authorization: Bearer ${token}
X-Motif-Scopes: ${scopes.length ? scopes.join(", ") : "(none)"}`}</pre>
          <p className="mt-3 text-[10px] leading-relaxed text-amber-100/70">
            Nothing answers that request. The <span className="font-mono">mto_demo_</span> prefix is deliberate: this token is
            deterministic from its label and scopes, so the same inputs always produce the same string, and a screenshot of it
            cannot be mistaken for a live credential. A real implementation needs key storage, hashing at rest, rate limits and a
            revocation list — an API design, not a page.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">What the endpoint would return</p>
        <p className="mt-1.5 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          The Studio already prints a spec preview of the theme endpoint&apos;s JSON shape, marked{" "}
          <span className="text-amber-300">not implemented</span>. This page stops at the credential, and links there rather
          than inventing a second, different response shape.
        </p>
        <Link href="/studio" className="btn btn-ghost mt-3 !px-3 !py-1.5 text-xs">
          Theme API preview →
        </Link>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------
   #391 — the cost meter
   ------------------------------------------------------------------- */

export function CostMeter() {
  const [selected, setSelected] = useState<string[]>(["templates", "kits"]);
  const math = bundleMath(selected);
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <section className="grid gap-5 md:grid-cols-[1fr_1fr]">
      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Pick what you would actually buy</p>
        <div className="mt-3 space-y-2">
          {PACKS.map((p) => {
            const on = selected.includes(p.id);
            const total = p.unitPrice * p.quantity;
            return (
              <label
                key={p.id}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-3.5 py-3 transition-colors ${
                  on ? "border-violet-300/30 bg-violet-500/[.06]" : "border-white/8 bg-white/[.02]"
                }`}
              >
                <input type="checkbox" checked={on} onChange={() => toggle(p.id)} className="mt-0.5 accent-violet-400" />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-[12px] font-bold">{p.name}</span>
                    <span className="font-mono text-[11px] text-ink-dim">
                      ${p.unitPrice} × {p.quantity} = ${total}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-[10px] leading-relaxed text-ink-faint">
                    {p.unit} · {p.note}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">The arithmetic</p>
          <dl className="mt-3 space-y-1.5 text-[11px]">
            {math.lines.map(({ pack, total }) => (
              <div key={pack.id} className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-dim">
                  {pack.name} <span className="font-mono text-ink-faint">×{pack.quantity}</span>
                </dt>
                <dd className="font-mono">${total}</dd>
              </div>
            ))}
            <div className="flex items-baseline justify-between gap-3 border-t border-white/8 pt-1.5">
              <dt className="font-bold">Ala-carte, this month</dt>
              <dd className="font-mono font-bold">${math.alaCarte}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-ink-dim">Pro, one month</dt>
              <dd className="font-mono">${math.bundleMonthly}</dd>
            </div>
          </dl>
          <p className={`mt-3 rounded-2xl border px-3.5 py-3 text-[11px] leading-relaxed ${
            math.difference > 0 ? "border-violet-300/25 bg-violet-500/[.06] text-ink-dim" : "border-emerald-300/25 bg-emerald-400/[.04] text-ink-dim"
          }`}>
            {math.verdict}
          </p>
          <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">
            Comparing one month against one-off purchases is deliberate and slightly unfair — a second month of Pro costs
            another ${math.bundleMonthly}, while the packs are bought once. Say that at the checkout, or the meter is a sales
            trick.
          </p>
        </div>

        <div className="rounded-3xl border border-dashed border-amber-300/25 bg-amber-300/[.04] p-6">
          <p className="text-sm font-extrabold text-amber-200">This meter reads from one price table</p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-amber-100/80">
            Unit prices, the Pro price and the yearly saving all come from the same module the plan cards use, so a change to
            the plan cannot leave a stale number here. The checkout button below is the demo boundary: it opens a receipt
            mock, not a payment page.
          </p>
          <button type="button" className="btn btn-ghost mt-3 !px-3 !py-1.5 text-xs" disabled>
            Checkout — not wired (no processor)
          </button>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------
   #390 — the Pro gate on the one non-free lab tool
   ------------------------------------------------------------------- */

const FREE_SECONDS = 180;

export function ProLabGate({
  children,
  tool,
  variant = "card",
}: {
  children: React.ReactNode;
  tool: string;
  variant?: "card" | "bare";
}) {
  const [seconds, setSeconds] = useState(FREE_SECONDS);
  const [gone, setGone] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || gone) return;
    const id = window.setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          window.clearInterval(id);
          setGone(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, gone]);

  const mm = Math.floor(seconds / 60);
  const ss = String(seconds % 60).padStart(2, "0");
  const expired = gone && !dismissed;

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/8 px-5 py-3">
      <div className="flex items-center gap-2">
        <span className="chip !text-[10px] !border-violet-300/40 !text-violet-200">Pro tool · gated demo</span>
        <span className="text-[11px] text-ink-dim">{tool}</span>
      </div>
      <span className="font-mono text-[11px] text-ink-faint" aria-live="polite">
        {running ? `${mm}:${ss} left of the free ${FREE_SECONDS / 60} minutes` : `free ${FREE_SECONDS / 60} minutes, unstarted`}
      </span>
    </div>
  );

  const upgradeCard = (
    <div className="px-6 py-10 text-center">
      <p className="text-lg font-extrabold">Your three minutes are up</p>
      <p className="mx-auto mt-2 max-w-xl text-[12px] leading-relaxed text-ink-dim">
        This is the upgrade card the free tier would see. It is a real gate in one sense — it really does cover the tool —
        and a demo in every other: no card is charged, no account exists, and the button below is not decoration. Press it
        and the tool comes straight back.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          className="btn btn-primary !px-4 !py-2 text-xs"
          onClick={() => {
            setDismissed(true);
            setSeconds(FREE_SECONDS);
          }}
        >
          Keep using it — no payment needed
        </button>
        <Link href="/pro" className="btn btn-ghost !px-4 !py-2 text-xs">
          What Pro would actually add →
        </Link>
      </div>
      <p className="mx-auto mt-4 max-w-xl text-[10px] leading-relaxed text-ink-faint">
        Dark patterns start at this exact moment, so the rules are written down: no fake countdown on the offer, no
        pre-ticked box, no &ldquo;are you sure&rdquo; maze, and one button that ends it. Dismissing restores the tool for this
        visit, because a gate that cannot be dismissed is a trap.
      </p>
    </div>
  );

  const body = expired ? (
    upgradeCard
  ) : (
    <div className="relative">
      {children}
      {!running && (
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-[#05060a] via-[#05060a]/70 to-transparent p-6">
          <div className="pointer-events-auto max-w-lg rounded-2xl border border-white/10 bg-panel/95 p-4 text-center backdrop-blur">
            <p className="text-[12px] font-bold">Start the three-minute preview</p>
            <p className="mt-1 text-[11px] leading-relaxed text-ink-dim">
              The timer only runs while you are using it, and nothing here is paywalled for real — the export panels below
              are the free ones either way.
            </p>
            <button type="button" className="btn btn-primary mt-3 !px-4 !py-1.5 text-xs" onClick={() => setRunning(true)}>
              Start the preview
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (variant === "bare") {
    return (
      <div className="space-y-3">
        <div className="rounded-2xl border border-violet-300/25 bg-violet-500/[.05]">{header}</div>
        {body}
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-3xl border border-white/8 bg-panel">
      {header}
      {body}
    </div>
  );
}
