"use client";

// Section 18 — engagement & retention surfaces.
//
// Four habits, all of them browser-local because that is the only honest
// option a static site has: nothing here phones home, and every panel says
// which key it writes and what it cannot know.
//
//  #457 NewSinceStrip     — "new since your last visit" strip on the home feed
//  #458 PathProgress      — progress dots for the Learn learning paths
//  #459 StackRecipe       — share prompt once your saved stack is worth sharing
//  #460 LibraryFitness    — a weekly self-score derived from real catalog numbers

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { COMPONENTS, PROMPTS } from "@/lib/data";

const FEED_KEY = "motif:feed-seen";
const PATHS_KEY = "motif:paths";

const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage blocked — the panel still works for this visit */
  }
};

const day = (ms: number) => new Date(ms).toISOString().slice(0, 10);
const parseDay = (iso: string) => new Date(`${iso}T00:00:00Z`).getTime();

/* ===================================================================
   #457 — the strip on the home feed
   =================================================================== */

export interface FeedBatchItem {
  slug: string;
  title: string;
  kind: string;
}

export function NewSinceStrip({ batch, latestDate }: { batch: FeedBatchItem[]; latestDate: string }) {
  // What the strip can honestly say before it reads your browser: the newest
  // batch in the catalog and when it landed. The local line is added on mount.
  const [seen, setSeen] = useState<number | null | undefined>(undefined);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      let previous: number | null = null;
      try {
        const raw = window.localStorage.getItem(FEED_KEY);
        previous = raw ? Number(raw) : null;
        window.localStorage.setItem(FEED_KEY, String(Date.now()));
      } catch {
        previous = null;
      }
      setSeen(previous && Number.isFinite(previous) && previous > 0 ? previous : null);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const since = seen ? day(seen) : null;
  const isNewToYou = typeof seen === "number" && seen < parseDay(latestDate);

  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-cyan-300/25 bg-cyan-400/[.05] px-4 py-3">
      <span className="chip !border-cyan-300/40 !bg-cyan-400/10 !text-cyan-100">
        {`${batch.length} new · ${latestDate}`}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-bold tracking-tight">
          {batch.map((b, i) => (
            <span key={b.slug}>
              <Link href={`/components/${b.slug}`} className="hover:underline">
                {b.title}
              </Link>
              {i < batch.length - 1 ? " · " : ""}
            </span>
          ))}
        </p>
        <p className="mt-0.5 text-[10px] leading-relaxed text-ink-dim">
          {seen === undefined ? (
            <>The newest batch in the component catalog. This line updates once the page can read your last visit from this browser.</>
          ) : seen === null ? (
            <>
              First visit from this browser — nothing to compare against yet, so the strip shows the newest batch rather than claiming
              anything about &ldquo;you&rdquo;.
            </>
          ) : isNewToYou ? (
            <>
              Published after your last visit on {since} — that visit time lives in <span className="font-mono">motif:feed-seen</span>, this
              browser only.
            </>
          ) : (
            <>
              You were here on {since}, on or after this batch landed, so nothing in the catalog is newer for you. The strip stays up because a
              count of zero is still an answer.
            </>
          )}
        </p>
      </div>
      <Link href="/components" className="text-[11px] font-semibold text-cyan-200 hover:text-cyan-100">
        Browse the library →
      </Link>
    </div>
  );
}

/* ===================================================================
   #458 — learning paths
   =================================================================== */

export interface PathStep {
  href: string;
  label: string;
  meta: string;
}

export interface Path {
  id: string;
  title: string;
  promise: string;
  steps: PathStep[];
}

export function PathProgress({ path }: { path: Path }) {
  const [done, setDone] = useState<string[] | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setDone(readJson<string[]>(PATHS_KEY, [])));
    return () => cancelAnimationFrame(raf);
  }, []);

  const toggle = (href: string) => {
    const current = done ?? [];
    const next = current.includes(href) ? current.filter((h) => h !== href) : [...current, href];
    setDone(next);
    writeJson(PATHS_KEY, next);
  };

  const marked = (href: string) => (done ?? []).includes(href);
  const count = path.steps.filter((s) => marked(s.href)).length;
  const pct = Math.round((count / path.steps.length) * 100);

  return (
    <div className="mt-4">
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/8" role="img" aria-label={`${count} of ${path.steps.length} steps marked`}>
          <span className="block h-full rounded-full bg-violet-400/80 transition-[width] duration-300" style={{ width: `${pct}%` }} />
        </div>
        <span className="shrink-0 text-[10px] font-bold tabular-nums text-ink-faint">
          {count}/{path.steps.length} marked · {pct}%
        </span>
      </div>

      <ol className="mt-3 space-y-1.5">
        {path.steps.map((step, i) => {
          const on = marked(step.href);
          return (
            <li key={step.href} className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/[.02] px-3 py-2">
              <button
                type="button"
                onClick={() => toggle(step.href)}
                aria-pressed={on}
                aria-label={`${on ? "Unmark" : "Mark"} step ${i + 1}: ${step.label}`}
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400 ${
                  on ? "border-violet-300/70 bg-violet-400/25 text-violet-100" : "border-white/15 text-transparent"
                }`}
              >
                ✓
              </button>
              <Link href={step.href} className="min-w-0 flex-1 text-[12px] font-semibold hover:underline">
                {step.label}
              </Link>
              <span className="shrink-0 font-mono text-[10px] text-ink-faint">{step.meta}</span>
            </li>
          );
        })}
      </ol>

      <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">
        {done === null ? (
          <>Reading progress for this path is stored in your browser; the dots fill once it loads.</>
        ) : (
          <>
            Marks live in <span className="font-mono">motif:paths</span> — one key for every path, no account, and no signal to us about
            which steps anybody finishes. Marking a step is a bookmark, not a claim that you read it.
          </>
        )}
      </p>
    </div>
  );
}

/* ===================================================================
   #459 — share prompt once a stack is worth sharing
   =================================================================== */

interface StarRef {
  slug: string;
  title: string;
  kind: "asset" | "prompt";
}

const THRESHOLD = 5;

export function StackRecipe() {
  const [stars, setStars] = useState<StarRef[] | null>(null);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const sync = () => {
      const list = readJson<StarRef[]>("motif:stars", []);
      setStars(Array.isArray(list) ? list.filter((s) => s && typeof s.slug === "string") : []);
    };
    sync();
    window.addEventListener("motif:stars-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("motif:stars-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const list = useMemo(() => stars ?? [], [stars]);
  const recipe = useMemo(() => {
    if (list.length < THRESHOLD) return "";
    const items = list.map((s) => `${s.kind === "asset" ? "a" : "p"}~${s.slug}`).join(",");
    return `/saved/stack?items=${encodeURIComponent(items)}`;
  }, [list]);

  const share = async () => {
    const url = `${window.location.origin}${recipe}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
    } catch {
      setCopied(url);
    }
  };

  const loaded = stars !== null;
  const short = THRESHOLD - list.length;

  return (
    <div className="rounded-3xl border border-violet-300/25 bg-violet-400/[.05] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-violet-200">Share the stack</p>
          <p className="mt-1 text-sm font-extrabold tracking-tight">
            {!loaded
              ? `A recipe link unlocks at ${THRESHOLD} saved items.`
              : list.length >= THRESHOLD
                ? `Your ${list.length} saved items make a recipe worth sending.`
                : `${list.length} saved item${list.length === 1 ? "" : "s"} — the share prompt unlocks at ${THRESHOLD}.`}
          </p>
        </div>
        {loaded && list.length >= THRESHOLD && (
          <button type="button" onClick={share} className="btn btn-primary !px-4 !py-2 text-[11px]">
            Copy the recipe link
          </button>
        )}
      </div>

      {!loaded ? (
        <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
          The count comes from <span className="font-mono">motif:stars</span> in this browser, so this sentence fills in once the page is
          running — nothing about your list is sent anywhere to compute it.
        </p>
      ) : list.length >= THRESHOLD ? (
        <>
          <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
            The link encodes your stack in the URL — {list.length} slugs, no id, nothing stored on a server. Whoever opens it sees the same
            list rendered from the catalog, and nothing about you.
          </p>
          <p className="mt-2 break-all rounded-xl border border-white/10 bg-black/30 px-3 py-2 font-mono text-[10px] text-violet-100">
            {recipe}
          </p>
          {copied && (
            <p aria-live="polite" className="mt-2 text-[10px] leading-relaxed text-mint">
              Copied {copied.length} characters to the clipboard. Paste it anywhere — the page works without the clipboard too, because the
              URL is the payload.
            </p>
          )}
          <Link href={recipe} className="mt-2 inline-block text-[11px] font-semibold text-violet-200 hover:text-violet-100">
            Open the recipe page →
          </Link>
        </>
      ) : (
        <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
          {short === 0 ? "One more star and the prompt unlocks." : `Star ${short} more component${short === 1 ? "" : "s"} or prompt${short === 1 ? "" : "s"} and this panel turns into a copyable recipe link.`}{" "}
          Stars live in this browser under <span className="font-mono">motif:stars</span>.
        </p>
      )}
    </div>
  );
}

/* ===================================================================
   #460 — weekly self-score
   =================================================================== */

const quantile = (values: number[], q: number) => {
  const sorted = [...values].sort((a, b) => a - b);
  if (!sorted.length) return 0;
  return sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))];
};

export function LibraryFitness() {
  const [stars, setStars] = useState<StarRef[] | null>(null);

  useEffect(() => {
    const sync = () => {
      const list = readJson<StarRef[]>("motif:stars", []);
      setStars(Array.isArray(list) ? list.filter((s) => s && typeof s.slug === "string") : []);
    };
    sync();
    window.addEventListener("motif:stars-changed", sync);
    return () => window.removeEventListener("motif:stars-changed", sync);
  }, []);

  const rows = useMemo(() => {
    const list = stars ?? [];
    const bySlug = new Map(COMPONENTS.map((c) => [c.slug, c]));
    const saved = list.map((s) => ({ ref: s, asset: bySlug.get(s.slug) })).filter((r) => r.asset);
    const known = saved.filter((r) => r.asset);
    const copies = known.map((r) => r.asset!.copies);
    const cutoff = quantile(COMPONENTS.map((c) => c.copies), 0.75);
    const top = known.filter((r) => r.asset!.copies >= cutoff).length;
    const kinds = new Set(known.map((r) => r.asset!.kind));
    const reach = copies.reduce((a, b) => a + b, 0);
    const medianReach = known.length ? quantile(copies, 0.5) : 0;
    const unknown = list.length - known.length;
    return { list, known, top, cutoff, kinds, reach, medianReach, unknown };
  }, [stars]);

  const loaded = stars !== null;
  const { known, top, cutoff, kinds, reach, medianReach, unknown } = rows;
  // Three named components, each worth up to 5, so a score of 15 means: a
  // stack of at least ten, mostly top-quartile picks, spanning three kinds.
  const breadth = Math.min(5, Math.round((known.length / 10) * 5));
  const taste = known.length ? Math.round((top / known.length) * 5) : 0;
  const range = Math.min(5, kinds.size);
  const total = breadth + taste + range;
  const verdict =
    total >= 12
      ? "a stack with a point of view"
      : total >= 8
        ? "a stack that is going somewhere"
        : total >= 4
          ? "early — the interesting part is still ahead"
          : "empty for now";

  return (
    <div className="rounded-3xl border border-white/8 bg-panel p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-200">Your library fitness</p>
          <p className="mt-1 text-2xl font-black tabular-nums tracking-tight">
            {loaded ? total : "–"}
            <span className="text-sm font-bold text-ink-faint"> / 15</span>
          </p>
        </div>
        <p className="text-[11px] text-ink-dim">{loaded ? verdict : "scored from this browser's saved list once the page is running"}</p>
      </div>

      {!loaded && (
        <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
          The meter reads <span className="font-mono">motif:stars</span> and the catalog&apos;s copy counts. A server-rendered page cannot see
          your storage, so the number arrives with the page rather than being guessed here.
        </p>
      )}

      <dl className={`mt-4 space-y-2 ${loaded ? "" : "opacity-40"}`}>
        {[
          {
            label: "Breadth",
            value: `${breadth}/5`,
            note: known.length ? `${known.length} saved items, scored up to ten` : "nothing saved yet",
          },
          {
            label: "Top-quartile taste",
            value: `${taste}/5`,
            note: known.length
              ? `${top} of your ${known.length} saved items are above ${cutoff.toLocaleString()} copies`
              : `the top quartile starts at ${cutoff.toLocaleString()} copies`,
          },
          {
            label: "Range",
            value: `${range}/5`,
            note: kinds.size ? `${[...kinds].join(", ")} — one point per kind, max five` : "no kinds represented",
          },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/[.02] px-3 py-2">
            <div className="min-w-0">
              <dt className="text-[11px] font-bold">{row.label}</dt>
              <dd className="text-[10px] leading-relaxed text-ink-faint">{row.note}</dd>
            </div>
            <span className="shrink-0 font-mono text-[12px] tabular-nums text-amber-100">{row.value}</span>
          </div>
        ))}
      </dl>

      <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
        The score is arithmetic on two real inputs — your browser&apos;s saved list and the catalog&apos;s copy counts — with the formula printed
        above so you can check it. Total copies in the stack: {reach.toLocaleString()}
        {known.length ? `, median ${medianReach.toLocaleString()} per item` : ""}. It measures the stack, not you: there is no streak, no
        streak-freeze, and no notification waiting if the number drops.
      </p>
      {unknown > 0 && (
        <p className="mt-2 text-[10px] leading-relaxed text-amber-200/80">
          {unknown} saved item{unknown === 1 ? "" : "s"} {unknown === 1 ? "is" : "are"} a prompt rather than a component, so{" "}
          {unknown === 1 ? "it sits" : "they sit"} outside this score — prompts carry fidelity, not copy counts.
        </p>
      )}
      <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">
        The catalog has {PROMPTS.length} prompts and {COMPONENTS.length} components; both are counted at build time, not typed here.
      </p>
    </div>
  );
}
