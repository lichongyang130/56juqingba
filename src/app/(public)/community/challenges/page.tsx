import type { Metadata } from "next";
import Link from "next/link";
import { CHALLENGES, challengeWinner, winnersRail } from "@/lib/community";

export const metadata: Metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/community/challenges" },
  title: "Challenges — Motif UI",
  description: "Monthly build challenges with published constraints and a winner rule applied by code: every gate pass, then the highest score. One brief is open now.",
};

const GATE = (g: string) =>
  g === "pass" ? "!border-mint/25 !text-mint" : g === "warn" ? "!border-amber-300/25 !text-amber-300" : "!border-danger/25 !text-danger";

export default function ChallengesPage() {
  const winners = winnersRail();
  const open = CHALLENGES.filter((c) => c.status === "open");
  const closed = CHALLENGES.filter((c) => c.status === "closed");

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/community" className="hover:text-ink">Community</Link>
        <span>/</span>
        <span className="text-ink-dim">Challenges</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Monthly challenges</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">A brief, a deadline, a rule</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          Every challenge publishes its constraints up front and its winner rule in code — no judging committee, no
          vibes. The rule is the boring one: every gate must pass, then the highest score wins. Ties break on submission
          id, which is the order entries arrived.
        </p>
      </div>

      {open.map((c) => (
        <section key={c.slug} className="mt-9 rounded-3xl border border-mint/25 bg-mint/[.04] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-mint">Open now · closes {c.deadline}</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight">{c.title}</h2>
            </div>
            <span className="chip !text-[10px]">opened {c.opened}</span>
          </div>
          <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-ink-dim">{c.brief}</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-panel p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Constraints</p>
              <ul className="prose-list mt-2">
                {c.constraints.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/8 bg-panel p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Entries so far</p>
              <p className="mt-2 text-[12px] leading-relaxed text-ink-dim">
                None yet — the brief opened on {c.opened}. We would rather print a zero than seed a fake leaderboard:
                the first entry that arrives through the submit flow appears here with its gate line.
              </p>
              <Link href="/community/submit" className="btn btn-primary mt-3 !px-4 !py-2 text-xs">
                Enter the challenge →
              </Link>
            </div>
          </div>
        </section>
      ))}

      {closed.map((c) => {
        const winner = challengeWinner(c);
        return (
          <section key={c.slug} className="mt-8 rounded-3xl border border-white/8 bg-panel p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Closed · {c.opened} → {c.deadline}</p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight">{c.title}</h2>
              </div>
              <span className="chip !text-[10px]">{c.entries.length} entries</span>
            </div>
            <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-ink-dim">{c.brief}</p>
            <ul className="prose-list mt-3">
              {c.constraints.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>

            <div className="mt-5 space-y-2">
              {[...c.entries]
                .sort((a, b) => {
                  const clean = (e: typeof a) => (e.lint === "pass" ? 1 : 0) + (e.safety === "pass" ? 1 : 0);
                  return clean(b) - clean(a) || b.score - a.score || a.id.localeCompare(b.id);
                })
                .map((e) => (
                  <div key={e.id} className={`rounded-2xl border px-4 py-3 ${winner?.id === e.id ? "border-mint/30 bg-mint/[.05]" : "border-white/8"}`}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-ink">
                          {winner?.id === e.id && <span className="mr-1.5 text-mint">★ winner</span>}
                          {e.title}
                        </p>
                        <p className="mt-0.5 font-mono text-[10px] text-ink-faint">{e.id} · @{e.handle}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`chip !text-[10px] ${e.score >= 92 ? "!border-mint/25 !text-mint" : "!border-amber-300/25 !text-amber-300"}`}>score {e.score}</span>
                        <span className={`chip !text-[10px] ${GATE(e.lint)}`}>lint {e.lint}</span>
                        <span className={`chip !text-[10px] ${GATE(e.safety)}`}>safety {e.safety}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">{e.note}</p>
                  </div>
                ))}
            </div>
            {winner && (
              <p className="mt-4 rounded-2xl border border-mint/20 bg-mint/[.04] px-4 py-3 text-[11px] leading-relaxed text-ink-dim">
                <span className="font-bold text-mint">Winner by rule: </span>@{winner.handle} at {winner.score} with both
                gates clean.{c.entries.some((e) => e.score > winner.score) ? ` The higher-scoring entries above were filtered out by a gate first — that is the rule working as published, not a judgement call.` : ""} The
                entries are sample records from the demo queue, labelled here so the format is visible; real challenges
                would run the same function over real gate results.
              </p>
            )}
          </section>
        );
      })}

      <section className="mt-10">
        <h2 className="border-b border-white/6 pb-3 text-xs font-bold uppercase tracking-[0.24em] text-amber-200">Winners rail</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {winners.map((w) => (
            <div key={w.slug} className="rounded-3xl border border-white/8 bg-panel p-5">
              <p className="text-[10px] uppercase tracking-widest text-ink-faint">{w.challenge}</p>
              <p className="mt-2 text-[15px] font-extrabold tracking-tight">{w.entry.title}</p>
              <p className="mt-1 font-mono text-[10px] text-ink-faint">@{w.entry.handle} · score {w.entry.score}</p>
              <p className="mt-3 text-[11px] leading-relaxed text-ink-dim">{w.why}</p>
              <p className="mt-3 border-t border-white/6 pt-2 text-[10px] text-ink-faint">decided {w.when}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
