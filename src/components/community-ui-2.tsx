"use client";

// Community client surfaces, part two (Section 12, batches 49-50).
// Requests votes, remix forks, and the local half of the moderation-outcomes
// view. Everything here reads and writes this browser only, and every panel
// says so in its own copy.

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FORK_KEY, SUBMISSION_KEY, VOTE_KEY, type ContentRequest, type Submission } from "@/lib/community";

/* ===================================================================
   #353 — content requests: vote on what gets built next
   =================================================================== */

function readVotes(): string[] {
  try {
    const raw = window.localStorage.getItem(VOTE_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

const EVENT = "motif:votes-changed";

export function RequestsBoard({ requests }: { requests: ContentRequest[] }) {
  const [votes, setVotes] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => setVotes(readVotes());
    const raf = requestAnimationFrame(() => {
      sync();
      setHydrated(true);
    });
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = (id: string) => {
    const cur = readVotes();
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    try {
      window.localStorage.setItem(VOTE_KEY, JSON.stringify(next));
    } catch {
      /* blocked storage — the vote still counts for this visit */
    }
    setVotes(next);
    window.dispatchEvent(new Event(EVENT));
  };

  const ordered = useMemo(() => {
    if (!votes.length) return requests;
    const mine = requests.filter((r) => votes.includes(r.id));
    return [...mine, ...requests.filter((r) => !votes.includes(r.id))];
  }, [requests, votes]);

  const KIND_STYLE: Record<string, string> = {
    component: "!border-violet-300/30 !text-violet-200",
    template: "!border-amber-300/30 !text-amber-200",
    prompt: "!border-cyan-300/30 !text-cyan-200",
    guide: "!border-mint/30 !text-mint",
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/[.02] px-4 py-3">
        <p className="text-xs text-ink-dim">
          {hydrated && votes.length
            ? `${votes.length} of ${requests.length} requests voted for in this browser — your picks sit on top.`
            : `You have not voted yet, so the board reads thinnest-coverage first.`}
        </p>
        <span className="chip !text-[10px]">localStorage · motif:content-votes</span>
      </div>

      {ordered.map((r) => {
        const voted = hydrated && votes.includes(r.id);
        return (
          <div key={r.id} className={`rounded-3xl border p-5 ${voted ? "border-violet-300/30 bg-violet-400/[.05]" : "border-white/8 bg-panel"}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`chip !text-[10px] ${KIND_STYLE[r.kind]}`}>{r.kind}</span>
                  <span className="font-mono text-[10px] text-ink-faint">{r.id}</span>
                </div>
                {/* h2: these requests are listed directly under the page h1, and h1 -> h3 skips a level. */}
                <h2 className="mt-2 text-[15px] font-extrabold tracking-tight">{r.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => toggle(r.id)}
                aria-pressed={voted}
                className={`btn shrink-0 ${voted ? "btn-primary" : "btn-ghost"} !px-4 !py-2 text-xs`}
              >
                {voted ? "✓ You asked for this" : "▲ Ask for this"}
              </button>
            </div>
            <p className="mt-2.5 text-[12px] leading-relaxed text-ink-dim">{r.ask}</p>
            <p className="mt-3 rounded-xl border border-white/6 bg-black/20 px-3 py-2 font-mono text-[10px] leading-relaxed text-ink-faint">
              measured: {r.evidence}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/* ===================================================================
   #355 — fork a remix into your own set
   =================================================================== */

export interface Forkable {
  id: string;
  title: string;
  kind: string;
  /** the published asset this remix was based on, when known */
  basedOn?: string;
  note?: string;
  origin: string;
}

interface Fork extends Forkable {
  forkedAt: string;
}

function readForks(): Fork[] {
  try {
    const raw = window.localStorage.getItem(FORK_KEY);
    const parsed = raw ? (JSON.parse(raw) as Fork[]) : [];
    return Array.isArray(parsed) ? parsed.filter((f) => f && typeof f.id === "string") : [];
  } catch {
    return [];
  }
}

const FORK_EVENT = "motif:forks-changed";

export function ForkButton({ remix, className = "btn btn-ghost !px-4 !py-2 text-xs" }: { remix: Forkable; className?: string }) {
  const [forked, setForked] = useState(false);
  useEffect(() => {
    const sync = () => setForked(readForks().some((f) => f.id === remix.id));
    const raf = requestAnimationFrame(sync);
    window.addEventListener(FORK_EVENT, sync);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener(FORK_EVENT, sync);
    };
  }, [remix.id]);

  const fork = () => {
    const cur = readForks();
    const next = cur.some((f) => f.id === remix.id) ? cur.filter((f) => f.id !== remix.id) : [{ ...remix, forkedAt: new Date().toISOString() }, ...cur];
    try {
      window.localStorage.setItem(FORK_KEY, JSON.stringify(next));
    } catch {
      /* blocked storage — still toggles for this visit */
    }
    setForked(next.some((f) => f.id === remix.id));
    window.dispatchEvent(new Event(FORK_EVENT));
  };

  return (
    <button type="button" onClick={fork} aria-pressed={forked} className={`${className} ${forked ? "!border-mint/40 !text-mint" : ""}`}>
      {forked ? "✓ In your set" : "Fork into my set"}
    </button>
  );
}

/** The forked remixes, shown on /saved and /community/remixes. */
export function ForkedList({ compact = false }: { compact?: boolean }) {
  const [forks, setForks] = useState<Fork[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => setForks(readForks());
    const raf = requestAnimationFrame(() => {
      sync();
      setHydrated(true);
    });
    window.addEventListener(FORK_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener(FORK_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const remove = (id: string) => {
    const next = readForks().filter((f) => f.id !== id);
    try {
      window.localStorage.setItem(FORK_KEY, JSON.stringify(next));
    } catch {
      /* memory only */
    }
    setForks(next);
    window.dispatchEvent(new Event(FORK_EVENT));
  };

  if (!hydrated) return <p className="text-xs text-ink-faint">Loading your set…</p>;

  if (forks.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-white/12 px-4 py-5 text-center text-[11px] text-ink-faint">
        Nothing forked yet. Remixes on{" "}
        <Link href="/community/remixes" className="font-semibold text-violet-300 hover:text-violet-200">
          the remix board
        </Link>{" "}
        can be copied into this set with one button.
      </p>
    );
  }

  return (
    <div className={compact ? "space-y-2" : "grid gap-3 sm:grid-cols-2"}>
      {forks.map((f) => (
        <div key={f.id} className="rounded-2xl border border-white/8 bg-panel p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink">{f.title}</p>
              <p className="mt-0.5 font-mono text-[10px] text-ink-faint">
                {f.kind} · from {f.origin}
                {f.basedOn ? ` · based on ${f.basedOn}` : ""} · forked {f.forkedAt.slice(0, 10)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => remove(f.id)}
              className="shrink-0 rounded-lg border border-white/10 px-2 py-1 text-[10px] font-semibold text-ink-dim transition-colors hover:border-danger/40 hover:text-danger"
            >
              Remove
            </button>
          </div>
          {f.note && <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">{f.note}</p>}
          {f.basedOn && (
            <Link href={`/components/${f.basedOn}`} className="mt-2 inline-block text-[11px] font-semibold text-violet-300 hover:text-violet-200">
              Open the original {f.basedOn} →
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}

/** Your local submissions, so the remix board has something real to fork.
 *  Parsing happens inside the client component because a server component
 *  cannot hand a function to a client one. */
function parseSubmissions(raw: string | null): Submission[] {
  const parsed = raw ? (JSON.parse(raw) as Submission[]) : [];
  return Array.isArray(parsed) ? parsed : [];
}

const KIND_LABEL: Record<string, string> = { element: "element", section: "section", animated: "animated", prompt: "prompt" };

export function LocalSubmissionList() {
  const [rows, setRows] = useState<Submission[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => {
      try {
        setRows(parseSubmissions(window.localStorage.getItem(SUBMISSION_KEY)));
      } catch {
        setRows([]);
      }
      setHydrated(true);
    };
    const raf = requestAnimationFrame(sync);
    window.addEventListener(FORK_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener(FORK_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (!hydrated) return <p className="text-xs text-ink-faint">Reading your submissions…</p>;
  if (rows.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-white/12 px-4 py-5 text-center text-[11px] text-ink-faint">
        You have not submitted a remix yet, so there is nothing of yours to fork.{" "}
        <Link href="/community/submit" className="font-semibold text-violet-300 hover:text-violet-200">
          Submit one
        </Link>{" "}
        and it appears here immediately, in this browser.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((s) => (
        <div key={s.id} className="rounded-2xl border border-white/8 bg-panel p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink">{s.title}</p>
              <p className="mt-0.5 font-mono text-[10px] text-ink-faint">
                {s.id} · {KIND_LABEL[s.kind] ?? s.kind} · @{s.author} · {s.stack}
                {s.submittedAt ? ` · sent ${s.submittedAt.slice(0, 10)}` : ""}
              </p>
            </div>
            <ForkButton
              remix={{
                id: s.id,
                title: s.title,
                kind: KIND_LABEL[s.kind] ?? s.kind,
                basedOn: s.basedOn,
                note: s.note,
                origin: "your submission",
              }}
            />
          </div>
          {s.note && <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">{s.note}</p>}
          <p className="mt-2 rounded-xl border border-violet-300/20 bg-violet-400/5 px-3 py-2 text-[10px] leading-relaxed text-violet-100/90">
            Gates read pending — this entry has not been audited. Forking copies the record into your set; it does not
            publish anything.
          </p>
        </div>
      ))}
    </div>
  );
}

/* ===================================================================
   #357 — the local half of the moderation outcomes view
   =================================================================== */

export interface DecisionSummary {
  decisions: Record<string, "approved" | "rejected">;
  at: string;
}

export function LocalDecisions({ storageKey }: { storageKey: string }) {
  const [summary, setSummary] = useState<DecisionSummary>({ decisions: {}, at: "" });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (raw) setSummary(JSON.parse(raw) as DecisionSummary);
      } catch {
        /* fresh */
      }
      setHydrated(true);
    });
    return () => cancelAnimationFrame(raf);
  }, [storageKey]);

  const entries = Object.entries(summary.decisions ?? {});
  const approved = entries.filter(([, d]) => d === "approved").length;
  const rejected = entries.length - approved;
  const rate = entries.length ? Math.round((approved / entries.length) * 100) : 0;

  return (
    <div className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Your reviews on this device</p>
          <p className="mt-1 text-xs text-ink-dim">
            Read from the same store the admin queue writes to. Nothing here is uploaded, so nothing here can appear in a
            public statistic.
          </p>
        </div>
        <span className="chip !text-[10px]">localStorage · {storageKey}</span>
      </div>

      {!hydrated ? (
        <p className="mt-4 text-xs text-ink-faint">Loading your reviews…</p>
      ) : entries.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-white/12 px-4 py-5 text-center text-[11px] text-ink-faint">
          You have not reviewed anything yet. Open the{" "}
          <Link href="/admin/moderation" className="font-semibold text-violet-300 hover:text-violet-200">
            moderation queue
          </Link>{" "}
          and approve or reject an entry — it will show up here with the accept rate that follows from your own calls.
        </p>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              { l: "approved", v: String(approved), c: "text-mint" },
              { l: "rejected", v: String(rejected), c: "text-danger" },
              { l: "your accept rate", v: `${rate}%`, c: "text-ink" },
            ].map((x) => (
              <div key={x.l} className="rounded-xl border border-white/7 bg-black/20 px-3 py-3">
                <p className={`text-lg font-extrabold ${x.c}`}>{x.v}</p>
                <p className="text-[9px] uppercase tracking-widest text-ink-faint">{x.l}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-1.5">
            {entries.map(([id, d]) => (
              <div key={id} className="flex items-center justify-between rounded-xl border border-white/6 bg-white/[.02] px-3 py-2">
                <span className="font-mono text-[10px] text-ink-dim">{id}</span>
                <span className={`text-[11px] font-bold ${d === "approved" ? "text-mint" : "text-danger"}`}>{d}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <p className="mt-4 border-t border-white/6 pt-3 text-[10px] leading-relaxed text-ink-faint">
        Decisions recorded {summary.at ? summary.at.slice(0, 19).replace("T", " ") : "—"}. Your accept rate is yours
        alone; the aggregate on this page is computed from the sample queue that ships with the build, so it cannot be
        skewed by anything a visitor does.
      </p>
    </div>
  );
}
