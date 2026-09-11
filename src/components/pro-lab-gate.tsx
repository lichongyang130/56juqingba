"use client";

// #390 — the Pro gate on the one lab tool marked non-free.
//
// Split out of pro-ui-2.tsx on purpose: /studio only needs the gate, and the
// Section 14 demos next door (trial rail, cost meter, seat invites, cancel
// flow, referral, token forge) are 850 lines of client code that would otherwise
// ride along in the studio's own chunk. The budget report caught it — /studio
// was the second-heaviest route in the build because of one import.

import { useEffect, useState } from "react";
import Link from "next/link";

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
