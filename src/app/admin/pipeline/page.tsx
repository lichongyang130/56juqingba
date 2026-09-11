"use client";

import Link from "next/link";
import { ADMIN_ACTOR, medianGapMinutes, newestCatalogDate, pipelineStages } from "@/lib/admin";
import { AuditTrail, useAuditTrail } from "@/components/admin-ui-2";
import { MODERATION_SEED, MODERATION_STORAGE_KEY } from "@/lib/community";
import { useEffect, useState } from "react";

export default function AdminPipeline() {
  const { trail } = useAuditTrail();
  const [decided, setDecided] = useState<Record<string, string>>({});
  useEffect(() => {
    const sync = () => {
      try {
        const raw = window.localStorage.getItem(MODERATION_STORAGE_KEY);
        const p = raw ? (JSON.parse(raw) as { decisions?: Record<string, string> }) : {};
        setDecided(p.decisions ?? {});
      } catch {
        setDecided({});
      }
    };
    const raf = requestAnimationFrame(sync);
    window.addEventListener("storage", sync);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const stages = pipelineStages(trail, Object.keys(decided).length);
  const median = medianGapMinutes(trail);
  const widest = Math.max(...stages.map((s) => s.n), 1);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Pipeline</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-dim">
            Where submissions sit between arriving and going live. Every count below names its source: the sample queue
            that ships with this build, or the records this console wrote on your device. Nothing here is estimated.
          </p>
        </div>
        <span className="chip !text-[10px]">last catalog date {newestCatalogDate()}</span>
      </div>

      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <div className="space-y-4">
          {stages.map((s, i) => (
            <div key={s.stage}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-bold text-ink">
                  <span className="mr-2 font-mono text-[10px] text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                  {s.stage}
                </p>
                <span className="font-mono text-lg font-extrabold text-ink">{s.n}</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-400/80 to-cyan-300/80"
                  style={{ width: `${Math.max(4, (s.n / widest) * 100)}%` }}
                />
              </div>
              <p className="mt-1.5 text-[10px] leading-relaxed text-ink-faint">
                <span className="font-semibold text-ink-dim">source:</span> {s.source} · {s.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-3 border-t border-white/6 pt-5 md:grid-cols-3">
          <div className="rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3">
            <p className="text-[10px] uppercase tracking-widest text-ink-faint">your decisions</p>
            <p className="mt-1 font-mono text-lg font-extrabold text-ink">{Object.keys(decided).length}</p>
            <p className="mt-0.5 text-[10px] text-ink-faint">of {MODERATION_SEED.length} sample rows</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3">
            <p className="text-[10px] uppercase tracking-widest text-ink-faint">audit entries</p>
            <p className="mt-1 font-mono text-lg font-extrabold text-ink">{trail.length}</p>
            <p className="mt-0.5 text-[10px] text-ink-faint">actor {ADMIN_ACTOR}</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3">
            <p className="text-[10px] uppercase tracking-widest text-ink-faint">median gap between actions</p>
            <p className="mt-1 font-mono text-lg font-extrabold text-ink">{median === null ? "—" : `${median} min`}</p>
            <p className="mt-0.5 text-[10px] text-ink-faint">
              {median === null ? "needs two audit entries — we do not invent a review latency" : "from your own audit timestamps"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-sm font-extrabold">What the sample queue says about the standard</p>
          <p className="mt-2 text-xs leading-relaxed text-ink-dim">
            {MODERATION_SEED.filter((s) => s.safety === "fail").length} of {MODERATION_SEED.length} rows carry a safety
            failure and can never be bulk-approved; {MODERATION_SEED.filter((s) => s.lint !== "pass").length} carry a lint
            warning that a reviewer has to look at. The funnel above keeps those in the review stage rather than smoothing
            them away.
          </p>
          <Link href="/admin/moderation" className="btn btn-primary mt-3 !py-2 text-xs">
            Open the queue →
          </Link>
        </div>
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-sm font-extrabold">Pipeline times we cannot show</p>
          <ul className="prose-list mt-2">
            <li>Time from submission to first human read: needs a real submission store; the sample rows have no clock on them.</li>
            <li>Approval rate: your own rate is on the outcomes page; a <em>plant-wide</em> rate needs more than one reviewer.</li>
            <li>Publishing latency: nothing publishes from this build, so there is no publish event to measure.</li>
          </ul>
          <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">
            Each of those would come from the same table that replaces the sample queue. Until then they are named as
            gaps instead of filled with plausible-looking numbers.
          </p>
        </div>
      </div>

      <AuditTrail />
    </div>
  );
}
