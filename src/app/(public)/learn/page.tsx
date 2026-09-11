import type { Metadata } from "next";
import Link from "next/link";
import { LEARN_ARTICLES } from "@/lib/learn";
import { accentHue } from "@/lib/data";

export const metadata: Metadata = {
  // The layout deliberately sets no canonical: a page that inherits "/" lies
  // about where it lives. This one declares its own.
  alternates: { canonical: "/learn" },
};

const LEVEL_STYLE: Record<string, string> = {
  Beginner: "text-mint",
  Intermediate: "text-amber-300",
  Advanced: "text-danger",
};

export default function LearnIndexPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">Learn · original editorial</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          Copying is fast. <span className="text-gradient">Knowing why is faster.</span>
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-dim">
          Short, opinionated guides that teach the craft behind the library — written by the same
          people who audit every component. No fluff, no &quot;level up your career&quot; filler;
          just the decisions that make UI feel expensive.
        </p>
      </div>

      <Link
        href="/community/spotlight"
        className="card-hover mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-violet-300/25 bg-violet-400/[.05] p-6"
      >
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-violet-200">Spotlight interview · one maker a month</p>
          <p className="mt-1.5 text-sm font-extrabold tracking-tight">The craft behind the queue — told by the people doing the work</p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-ink-dim">
            A monthly interview about the decisions, not the launch, drawing on each maker&apos;s submissions and gate
            results. Interviewees are the sample roster personas, and the page says so.
          </p>
        </div>
        <span className="text-xs font-semibold text-violet-300">Read the spotlights →</span>
      </Link>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {LEARN_ARTICLES.map((a) => {
          const hue = accentHue(a.slug);
          return (
            <Link
              key={a.slug}
              href={`/learn/${a.slug}`}
              className="card-hover group relative flex flex-col overflow-hidden rounded-3xl border border-white/8 bg-panel p-7"
            >
              <span
                className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full blur-3xl"
                style={{ background: `hsl(${hue} 85% 60% / 0.18)` }}
                aria-hidden
              />
              <div className="flex items-center justify-between">
                <span className="chip !text-[10px] uppercase tracking-widest" style={{ color: `hsl(${hue} 90% 72%)`, borderColor: `hsl(${hue} 90% 65% / .3)`, background: `hsl(${hue} 90% 60% / .08)` }}>
                  {a.kicker}
                </span>
                <span className={`text-xs font-extrabold ${LEVEL_STYLE[a.level]}`}>{a.level}</span>
              </div>
              <h2 className="mt-5 text-2xl font-extrabold leading-tight tracking-tight group-hover:text-white">
                {a.title}
              </h2>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-dim">{a.deck}</p>
              <div className="mt-auto flex items-center justify-between pt-6">
                <div className="flex flex-wrap gap-1.5">
                  {a.tags.slice(0, 3).map((t) => (
                    <span key={t} className="chip !text-[10px]">{t}</span>
                  ))}
                </div>
                <span className="flex items-center gap-2 text-xs text-ink-faint">
                  {a.minutes} min
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 rounded-3xl border border-white/8 bg-gradient-to-br from-emerald-400/8 to-transparent p-8 text-center">
        <h2 className="text-xl font-extrabold tracking-tight">Prefer to feel it instead of read it?</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-ink-dim">
          The Easing Lab and Spring Lab turn this page&apos;s theory into something you can push on.
          Tune, watch, export.
        </p>
        <Link href="/lab" className="btn btn-primary mt-5">Open the Lab</Link>
      </div>
    </div>
  );
}
