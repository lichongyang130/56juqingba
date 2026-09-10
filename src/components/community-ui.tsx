"use client";

// Community client surfaces — Section 12 (favourites, saved list, community
// re-run demo, remix submit form, line-anchored review notes). Everything
// here is browser-local: no account, no server, and every panel says so.

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { accentCss, COMPONENTS, PROMPTS } from "@/lib/data";
import { RERUN_MODELS, rerunFidelity, rerunScript, REVIEW_KEY, STAR_KEY, SUBMISSION_KEY, type Submission } from "@/lib/community";

/* ===================================================================
   #340 — favourites: star assets and prompts into a saved list
   =================================================================== */

export interface StarRef {
  slug: string;
  title: string;
  kind: "asset" | "prompt";
}

function readStars(): StarRef[] {
  try {
    const raw = window.localStorage.getItem(STAR_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StarRef[];
    return Array.isArray(parsed) ? parsed.filter((s) => s && typeof s.slug === "string") : [];
  } catch {
    return [];
  }
}

function writeStars(list: StarRef[]) {
  try {
    window.localStorage.setItem(STAR_KEY, JSON.stringify(list));
  } catch {
    /* blocked storage — the star still toggles for this visit */
  }
}

const EVENT = "motif:stars-changed";

export function useStars() {
  const [stars, setStars] = useState<StarRef[]>([]);
  useEffect(() => {
    const sync = () => setStars(readStars());
    const raf = requestAnimationFrame(sync);
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const toggle = (ref: StarRef) => {
    const cur = readStars();
    const next = cur.some((s) => s.slug === ref.slug && s.kind === ref.kind)
      ? cur.filter((s) => !(s.slug === ref.slug && s.kind === ref.kind))
      : [...cur, ref];
    writeStars(next);
    setStars(next);
    window.dispatchEvent(new Event(EVENT));
  };
  return { stars, toggle, has: (slug: string, kind: StarRef["kind"]) => stars.some((s) => s.slug === slug && s.kind === kind) };
}

export function StarButton({
  slug,
  title,
  kind,
  className = "btn btn-ghost",
}: {
  slug: string;
  title: string;
  kind: StarRef["kind"];
  className?: string;
}) {
  const { has, toggle } = useStars();
  const starred = has(slug, kind);
  return (
    <button
      type="button"
      onClick={() => toggle({ slug, title, kind })}
      aria-pressed={starred}
      title={starred ? "Remove from your saved list" : "Save to your list (stored in this browser)"}
      className={`${className} ${starred ? "!border-violet-300/50 !text-violet-200" : ""}`}
    >
      {starred ? "★ Saved" : "☆ Save"}
    </button>
  );
}

/* ===================================================================
   #340 — the saved list itself (/saved)
   =================================================================== */

interface StarterItem extends StarRef {
  note: string;
}

const STARTER: StarterItem[] = [
  { slug: "halo-button", title: "Halo Button", kind: "asset", note: "primary CTA with magnet + halo" },
  { slug: "aurora-veil", title: "Aurora Veil", kind: "asset", note: "ambient hero backdrop" },
  { slug: "combo-box", title: "Combo Box", kind: "asset", note: "filter input pattern" },
];

export function SavedBoard() {
  const { stars, toggle } = useStars();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setHydrated(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const items = useMemo<StarRef[]>(() => {
    const live = stars.length
      ? stars
      : STARTER.map(({ slug, title, kind }) => ({ slug, title, kind }));
    return live;
  }, [stars]);
  const [copied, setCopied] = useState(false);

  const slugList = items.map((s) => (s.kind === "prompt" ? `prompt:${s.slug}` : s.slug)).join("\n");

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">
            {stars.length ? `Your saved list · ${stars.length}` : "Starter list · nothing saved yet"}
          </p>
          <span className="chip !text-[10px]">localStorage · this browser only</span>
        </div>

        {!hydrated ? (
          <p className="mt-4 rounded-2xl border border-white/8 bg-white/[.02] px-4 py-6 text-center text-xs text-ink-faint">Loading your list…</p>
        ) : (
          <div className="mt-4 space-y-2">
            {items.map((s) => (
              <div key={`${s.kind}:${s.slug}`} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-panel px-4 py-3">
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: accentCss(s.slug, 88, 62) }} />
                <div className="min-w-0 flex-1">
                  <Link
                    href={s.kind === "prompt" ? `/prompts/${s.slug}` : `/components/${s.slug}`}
                    className="text-sm font-bold text-ink hover:text-violet-200"
                  >
                    {s.title}
                  </Link>
                  <p className="font-mono text-[10px] text-ink-faint">
                    {s.kind} · {s.slug}
                    {"note" in s ? ` · ${(s as StarterItem).note}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle({ slug: s.slug, title: s.title, kind: s.kind })}
                  className="rounded-lg border border-white/10 px-2.5 py-1 text-[10px] font-semibold text-ink-dim transition-colors hover:border-danger/40 hover:text-danger"
                >
                  {stars.length ? "Remove" : "Save this"}
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="mt-4 text-[11px] leading-relaxed text-ink-faint">
          Stars live in this browser&apos;s localStorage under <code className="font-mono">motif:stars</code>. Nothing
          is uploaded and no account is involved — a real favourites backend is the first server feature on the roadmap,
          and this page is the honest stand-in until then. The starter rows show what the list looks like once you star
          something; they are not saved until you press save.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl border border-white/8 bg-panel p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Where to star things</p>
          <ul className="prose-list mt-3">
            <li>
              Every <Link href="/components" className="font-semibold text-violet-300 hover:text-violet-200">component page</Link>{" "}
              has a Save button next to “Copy component”.
            </li>
            <li>
              Every <Link href="/prompts" className="font-semibold text-violet-300 hover:text-violet-200">prompt page</Link>{" "}
              has the same button beside the copy action.
            </li>
            <li>Stars survive refreshes and appear back here instantly.</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-white/8 bg-panel p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Take the list with you</p>
          <pre className="mt-3 max-h-40 overflow-auto rounded-xl border border-white/8 bg-[#07090f] p-3 font-mono text-[11px] leading-relaxed text-ink-dim">
            {slugList}
          </pre>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard
                ?.writeText(slugList)
                .then(() => setCopied(true))
                .catch(() => setCopied(false));
            }}
            className="btn btn-ghost mt-3 !px-3 !py-1.5 text-xs"
          >
            {copied ? "Copied ✓" : "Copy slugs"}
          </button>
          <p className="mt-2 text-[10px] text-ink-faint">
            The list as plain slugs — feed it to a script or paste it into a PR description.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ===================================================================
   #343 — community prompt re-run (simulated, labelled)
   =================================================================== */

export function RerunStudio({ slug, title, published }: { slug: string; title: string; published: number }) {
  const [model, setModel] = useState<string>(RERUN_MODELS[0]);
  const [step, setStep] = useState(0);
  const [runs, setRuns] = useState<{ model: string; fidelity: number; seed: number }[]>([]);

  const script = useMemo(() => rerunScript(slug, model, runs.length), [slug, model, runs.length]);
  const running = step > 0 && step < script.length;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setStep((s) => s + 1), 420);
    return () => window.clearTimeout(id);
  }, [running, step]);

  const start = () => {
    const seed = runs.length;
    setStep(1);
    setRuns((r) => [...r, { model, fidelity: rerunFidelity(slug, model, seed), seed }]);
  };

  const delta = runs.length ? runs[runs.length - 1].fidelity - published : 0;

  return (
    <div id={`rerun-${slug}`} className="scroll-mt-24 rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Community re-run · {title}</p>
          <p className="mt-1 text-xs text-ink-dim">
            Anyone can ask “does this still hold?” — pick a model and watch the run log stream, then compare with the
            published average.
          </p>
        </div>
        <span className="chip !text-[10px] !border-amber-300/40 !text-amber-300">simulated run · no model is called</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {RERUN_MODELS.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setModel(m)}
            className={`chip !cursor-pointer ${model === m ? "!border-violet-300/50 !text-ink" : ""}`}
          >
            {m}
          </button>
        ))}
        <button type="button" onClick={start} disabled={running} className="btn btn-primary !px-4 !py-2 text-xs">
          {running ? "Running…" : "▶ Re-run"}
        </button>
        <button
          type="button"
          onClick={() => {
            setStep(0);
            setRuns([]);
          }}
          className="btn btn-ghost !px-4 !py-2 text-xs"
        >
          Clear
        </button>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-white/8 bg-[#07090f] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Run log</p>
          <pre className="mt-3 min-h-[160px] overflow-x-auto whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
            {step === 0 ? (
              <span className="text-ink-faint">{"// press Re-run to stream the simulated log"}</span>
            ) : (
              script.slice(0, step).map((l, i) => (
                <span key={i} className={l.tone === "ok" ? "text-mint" : l.tone === "warn" ? "text-amber-300" : "text-ink-faint"}>
                  [{l.t}] {l.text}
                  {"\n"}
                </span>
              ))
            )}
          </pre>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Comparison</p>
          <div className="mt-3 space-y-2 text-[11px]">
            <div className="flex items-center justify-between rounded-xl bg-white/[.03] px-3 py-2">
              <span className="text-ink-dim">Published average</span>
              <span className="font-mono font-extrabold text-ink">{published}</span>
            </div>
            {runs.map((r, i) => (
              <div key={`${r.model}-${i}`} className="flex items-center justify-between rounded-xl bg-white/[.03] px-3 py-2">
                <span className="truncate text-ink-dim">{r.model}</span>
                <span className="ml-2 shrink-0 font-mono font-extrabold text-cyan-200">{r.fidelity}</span>
              </div>
            ))}
            {runs.length > 0 && (
              <p className={`rounded-xl px-3 py-2 text-[11px] font-bold ${delta >= 0 ? "bg-mint/[.06] text-mint" : "bg-amber-300/[.06] text-amber-300"}`}>
                {delta >= 0 ? `+${delta}` : delta} vs published on the latest run
              </p>
            )}
          </div>
          <p className="mt-3 border-t border-white/6 pt-2 text-[10px] leading-relaxed text-ink-faint">
            The queue keeps your runs in memory only, and the log is generated locally — the fidelity figures are a
            deterministic simulation, not a measurement. Published run logs on each prompt page remain the real record.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ===================================================================
   #342 — remix submit flow (writes into the moderation queue)
   =================================================================== */

export function SubmitForm({ initialBasedOn }: { initialBasedOn?: string }) {
  const [title, setTitle] = useState("");
  const [handle, setHandle] = useState("");
  const [basedOn, setBasedOn] = useState(initialBasedOn ?? "");
  const [kind, setKind] = useState<Submission["kind"]>("element");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const [queueCount, setQueueCount] = useState(0);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        const raw = window.localStorage.getItem(SUBMISSION_KEY);
        setQueueCount(raw ? (JSON.parse(raw) as Submission[]).length : 0);
      } catch {
        setQueueCount(0);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const submit = () => {
    const id = `SUB-C${Date.now().toString(36).slice(-4).toUpperCase()}`;
    const entry: Submission = {
      id,
      kind,
      title: title.trim() || "Untitled remix",
      author: handle.trim().replace(/^@/, "") || "anonymous",
      score: 0,
      lint: "warn",
      safety: "warn",
      stack: basedOn ? `remix of ${basedOn}` : "new submission",
      source: "community",
      basedOn: basedOn || undefined,
      note: note.trim() || undefined,
      submittedAt: new Date().toISOString(),
    };
    let list: Submission[] = [];
    try {
      const raw = window.localStorage.getItem(SUBMISSION_KEY);
      list = raw ? (JSON.parse(raw) as Submission[]) : [];
    } catch {
      list = [];
    }
    const next = [entry, ...list].slice(0, 20);
    try {
      window.localStorage.setItem(SUBMISSION_KEY, JSON.stringify(next));
    } catch {
      /* storage blocked — still show the confirmation */
    }
    setQueueCount(next.length);
    setDone(true);
    setTitle("");
    setNote("");
  };

  return (
    <div className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Remix submit flow</p>
          <p className="mt-2 text-xs leading-relaxed text-ink-dim">
            Submit a remix of any published asset. It lands in the moderation queue with the audit gate marked
            <span className="font-mono"> pending</span> — the same queue the team already reviews in the admin console.
            This form stores your entry in this browser (demo); the queue shows it immediately.
          </p>
        </div>
        <span className="chip !text-[10px]">{queueCount} in your local queue</span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="text-[11px] text-ink-faint">
          Remix title
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Soft ripple text field — 2 KB cut" className="input mt-1 !py-2 text-xs" />
        </label>
        <label className="text-[11px] text-ink-faint">
          Your handle
          <input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@yourname" className="input mt-1 !py-2 text-xs" />
        </label>
        <label className="text-[11px] text-ink-faint">
          Based on
          <input value={basedOn} onChange={(e) => setBasedOn(e.target.value)} placeholder="combo-box" list="motif-slugs" className="input mt-1 !py-2 font-mono text-xs" />
          <datalist id="motif-slugs">
            {COMPONENTS.slice(0, 40).map((c) => (
              <option key={c.slug} value={c.slug} />
            ))}
          </datalist>
        </label>
        <label className="text-[11px] text-ink-faint">
          Kind
          <select value={kind} onChange={(e) => setKind(e.target.value as Submission["kind"])} className="input mt-1 !py-2 text-xs">
            {(["element", "section", "animated", "prompt"] as const).map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="mt-3 block text-[11px] text-ink-faint">
        What did you change?
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Replaced the halo with a CSS-only ring, dropped the dependency, kept the keyboard behaviour." className="input mt-1 text-xs" />
      </label>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={submit} className="btn btn-primary !px-4 !py-2 text-xs">
          Submit for review
        </button>
        <Link href="/admin/moderation" className="btn btn-ghost !px-4 !py-2 text-xs">
          Open the moderation queue →
        </Link>
        {done && <span className="text-[11px] font-semibold text-mint">Queued — your entry is now first in the local queue.</span>}
      </div>

      <p className="mt-4 border-t border-white/6 pt-3 text-[10px] leading-relaxed text-ink-faint">
        Real submissions would run the audit gates (a11y for components, fidelity for prompts) before a human sees them.
        Score fields on your entry stay 0 and gates read <span className="font-mono">pending</span> because nothing was
        actually audited — the queue labels them that way on purpose.
      </p>
    </div>
  );
}

/* ===================================================================
   #346 — review notes anchored to code lines (demo)
   =================================================================== */

interface Note {
  id: string;
  line: number;
  handle: string;
  body: string;
  at: string;
}

export function ReviewNotes({ slug, lines }: { slug: string; lines: number }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [line, setLine] = useState(1);
  const [handle, setHandle] = useState("");
  const [body, setBody] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        const raw = window.localStorage.getItem(`${REVIEW_KEY}:${slug}`);
        if (raw) setNotes(JSON.parse(raw) as Note[]);
      } catch {
        /* fresh */
      }
      setHydrated(true);
    });
    return () => cancelAnimationFrame(raf);
  }, [slug]);

  const persist = (next: Note[]) => {
    setNotes(next);
    try {
      window.localStorage.setItem(`${REVIEW_KEY}:${slug}`, JSON.stringify(next));
    } catch {
      /* memory only */
    }
  };

  const add = () => {
    if (!body.trim()) return;
    persist([
      { id: `${Date.now()}`, line, handle: handle.trim().replace(/^@/, "") || "you", body: body.trim(), at: new Date().toISOString() },
      ...notes,
    ]);
    setBody("");
  };

  return (
    <div className="rounded-3xl border border-white/8 bg-panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Review notes · anchored to code lines</p>
          <p className="mt-1 text-xs text-ink-dim">
            Threads attach to a line number in this asset&apos;s snippet, so a remark about the focus trap stays next to it.
          </p>
        </div>
        <span className="chip !text-[10px]">demo · stored in this browser</span>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-2">
        <label className="text-[11px] text-ink-faint">
          Line
          <input
            type="number"
            min={1}
            max={lines}
            value={line}
            onChange={(e) => setLine(Math.max(1, Math.min(lines, Number(e.target.value) || 1)))}
            className="input mt-1 w-20 !py-2 font-mono text-xs"
          />
        </label>
        <label className="text-[11px] text-ink-faint">
          Handle
          <input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@you" className="input mt-1 w-32 !py-2 text-xs" />
        </label>
        <label className="min-w-[220px] flex-1 text-[11px] text-ink-faint">
          Note
          <input value={body} onChange={(e) => setBody(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="Line 12: consider focusing the first result after open" className="input mt-1 !py-2 text-xs" />
        </label>
        <button type="button" onClick={add} className="btn btn-ghost !px-3 !py-2 text-xs">
          Add note
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {!hydrated ? (
          <p className="text-[11px] text-ink-faint">Loading notes…</p>
        ) : notes.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/12 px-4 py-5 text-center text-[11px] text-ink-faint">
            No notes on <span className="font-mono">{slug}</span> yet — the first one is yours.
          </p>
        ) : (
          notes.map((n) => (
            <div key={n.id} className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[.02] px-3 py-2.5">
              <span className="shrink-0 rounded-md border border-violet-300/30 bg-violet-400/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-violet-200">
                L{n.line}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] leading-relaxed text-ink-dim">{n.body}</p>
                <p className="mt-0.5 font-mono text-[9px] text-ink-faint">
                  @{n.handle} · {n.at.slice(0, 10)}
                </p>
              </div>
              <button type="button" aria-label="Delete note" onClick={() => persist(notes.filter((x) => x.id !== n.id))} className="text-[10px] text-ink-faint transition-colors hover:text-danger">
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      <p className="mt-3 border-t border-white/6 pt-2 text-[10px] leading-relaxed text-ink-faint">
        The snippet on this page is {lines} lines long, so anchors run 1–{lines}. Notes are per-asset and per-browser;
        a shared review thread is a server feature, and this panel is the local stand-in that proves the anchoring works.
      </p>
    </div>
  );
}

/** Small helper the prompt page uses to star a prompt. */
export function PromptStar({ slug, title }: { slug: string; title: string }) {
  return <StarButton slug={slug} title={title} kind="prompt" className="btn btn-ghost !px-4 !py-2 !text-xs" />;
}

/** Count of published items currently present in the client star store —
 *  used by maker pages to show "your stars for their work" honestly. */
export function useLocalStars() {
  const { stars } = useStars();
  return stars;
}

export function authoredBy(handle: string) {
  return COMPONENTS.filter((a) => a.author.includes(handle)).length + PROMPTS.filter((p) => p.author.includes(handle)).length;
}
