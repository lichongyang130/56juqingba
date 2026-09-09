import Link from "next/link";
import { accentCss, COMPONENTS, PROMPTS } from "@/lib/data";

export const metadata = { title: "Mission — Motif UI" };

const PRINCIPLES = [
  {
    n: "01",
    title: "Original only",
    body: "Every asset, demo and guide is written in-house. We never mirror another library's components, copy its copy, or ship a screenshot we can't reproduce. If it looks similar to something famous, that's the genre, not the source.",
    tone: "text-violet-300",
    href: "/components",
    cta: "Browse the library",
  },
  {
    n: "02",
    title: "Tested or it doesn't ship",
    body: "A prompt isn't 'verified' because we liked the output once. Each one is run through multiple frontier models, scored for visual fidelity, and the failing runs stay in the public log — deleting them would fake the data.",
    tone: "text-cyan-300",
    href: "/prompts",
    cta: "See the run logs",
  },
  {
    n: "03",
    title: "Honest effort cues",
    body: "Templates say how many copies they take to build. Timelines say 'sample build', not 'effortless'. Claims like 'free forever' name exactly what stays free. Marketing copy is content too — and ours is original as well.",
    tone: "text-emerald-300",
    href: "/samples",
    cta: "Read the case studies",
  },
  {
    n: "04",
    title: "Small, loud, removable",
    body: "We optimise for components you can read in one file, dependencies you can count on one hand, and styles you can delete without archaeology. Your stack stays yours; we just make the front of it faster to build.",
    tone: "text-amber-200",
    href: "/lab",
    cta: "Try the Lab",
  },
];

export default function MissionPage() {
  const zeroDep = COMPONENTS.filter((c) => c.deps.length === 0).length;
  const avgFidelity = Math.round(PROMPTS.reduce((s, p) => s + p.avgFidelity, 0) / Math.max(1, PROMPTS.length));
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <span className="text-ink-dim">Mission</span>
      </nav>

      <p className="mt-10 text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">Mission</p>
      <h1 className="mt-2 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
        Original only. Tested, or it <span className="text-gradient">doesn&apos;t ship</span>.
      </h1>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-dim md:text-lg">
        Motif is a UI library with a publishing standard. Component sites usually compete on volume — thousands of
        copied cards, most of them untested and unmaintained. We compete on the opposite: fewer things, each one
        original, audited and honest about what it does.
      </p>

      {/* numbers that back the mission */}
      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        {[
          { v: String(COMPONENTS.length), l: "components, all studio-original", h: accentCss("halo-button", 85, 62) },
          { v: String(zeroDep), l: "of them run with zero dependencies", h: accentCss("star-motes", 85, 62) },
          { v: `${avgFidelity}%`, l: "average prompt fidelity across every run", h: accentCss("scramble-text", 85, 62) },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border border-white/8 bg-panel p-5">
            <div className="text-3xl font-extrabold tracking-tight" style={{ color: s.h }}>{s.v}</div>
            <div className="mt-1 text-xs text-ink-dim">{s.l}</div>
          </div>
        ))}
      </div>

      {/* principles */}
      <div className="mt-14 grid gap-4 md:grid-cols-2">
        {PRINCIPLES.map((pr) => (
          <div key={pr.n} className="rounded-3xl border border-white/8 bg-panel p-6">
            <div className={`font-mono text-xs font-bold ${pr.tone}`}>{pr.n}</div>
            <h2 className="mt-2 text-xl font-extrabold tracking-tight">{pr.title}</h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-dim">{pr.body}</p>
            <Link href={pr.href} className="mt-4 inline-block text-xs font-semibold text-ink-dim transition-colors hover:text-ink">
              {pr.cta} →
            </Link>
          </div>
        ))}
      </div>

      {/* what we will not do */}
      <div className="mt-12 rounded-3xl border border-amber-300/15 bg-amber-400/[.04] p-6 md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Things we won&apos;t do</p>
        <ul className="prose-list mt-4 list-none space-y-2.5">
          <li className="!text-sm">✕ Resell a competitor&apos;s components under our name, or paste their copy.</li>
          <li className="!text-sm">✕ Mark a prompt verified when its last run scored 61.</li>
          <li className="!text-sm">✕ Promise “build a site in 5 minutes” while the demo actually took an afternoon.</li>
          <li className="!text-sm">✕ Delete a failing run from the log to make the averages look better.</li>
          <li className="!text-sm">✕ Say “free forever” and quietly move the core behind a paywall.</li>
        </ul>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/8 bg-panel p-6">
        <div>
          <p className="text-sm font-extrabold">Want to see the standard in action?</p>
          <p className="mt-1 text-xs text-ink-dim">Audits, run logs and copy counts are public on every asset.</p>
        </div>
        <Link href="/components" className="btn btn-primary !py-2.5 text-sm">Start with the library</Link>
      </div>
    </div>
  );
}
