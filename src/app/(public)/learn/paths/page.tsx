import type { Metadata } from "next";
import Link from "next/link";
import { LEARN_ARTICLES } from "@/lib/learn";
import { COMPONENTS } from "@/lib/data";
import { PathProgress, type Path } from "@/components/retention-ui";

export const metadata: Metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/learn/paths" },
  title: "Learning paths — Motif UI",
  description:
    "Three short sequences through the Motif guides and components — motion starter, springs, scroll — with progress dots stored in your browser.",
};

// Every step points at something that exists: the essays come from
// LEARN_ARTICLES and the practice pieces from the catalog, both filtered at
// build time. If a slug ever disappears the path drops the step rather than
// shipping a dead link, which is why these are built with helpers instead of
// typed out as hrefs.
const article = (slug: string) => LEARN_ARTICLES.find((a) => a.slug === slug);
const component = (slug: string) => COMPONENTS.find((c) => c.slug === slug);

const step = (href: string, label: string, meta: string) => ({ href, label, meta });

function pathFrom(
  id: string,
  title: string,
  promise: string,
  entries: { href: string; label?: string; meta?: string }[],
): Path {
  const steps = entries.map((e) => {
    if (e.href.startsWith("/learn/")) {
      const a = article(e.href.replace("/learn/", ""));
      return a ? step(e.href, a.title, `${a.minutes} min · ${a.level}`) : null;
    }
    const c = component(e.href.replace("/components/", ""));
    return c ? step(e.href, e.label ?? `${c.title} — practice piece`, `${c.bundleKb.toFixed(1)} KB · ${c.kind}`) : null;
  });
  return {
    id,
    title,
    promise,
    steps: steps.filter((s): s is { href: string; label: string; meta: string } => s !== null),
  };
}

export default function LearnPathsPage() {
  const paths: Path[] = [
    pathFrom("motion-starter", "Motion starter", "From “nothing moves” to a hero that breathes, in four sittings.", [
      { href: "/learn/hero-that-breathes-in-20-min" },
      { href: "/components/aurora-veil" },
      { href: "/learn/choreography-question" },
      { href: "/components/staggered-list-entrance" },
    ]),
    pathFrom("springs", "Springs, understood", "Why a spring is not a slow easing, and what to change first when one feels cheap.", [
      { href: "/learn/springs-are-not-easings" },
      { href: "/components/halo-button" },
      { href: "/learn/easing-cheatsheet-deep-dive" },
      { href: "/lab" },
    ]),
    pathFrom("scroll", "Scroll, honestly", "Scroll-linked work that stays on the compositor — and when to stop trying.", [
      { href: "/learn/scroll-timeline-honestly" },
      { href: "/components/draw-path" },
      { href: "/learn/reduced-motion-beyond-the-switch" },
      { href: "/components/reading-dots" },
    ]),
  ];

  const totalSteps = paths.reduce((a, p) => a + p.steps.length, 0);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <Link href="/learn" className="hover:text-ink">
          Learn
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Learning paths</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Learn · sequences</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Learning paths</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          The library is a shelf, not a course, so here are three orders that make sense if you are starting from zero: {totalSteps} steps
          across {paths.length} paths, each one an essay or a component you can actually open. Marking a step is a bookmark in this browser —
          no account, no streak, and the path never nags.
        </p>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {paths.map((path, i) => (
          <section key={path.id} className="rounded-3xl border border-white/8 bg-panel p-5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-violet-300">{`Path ${i + 1}`}</span>
              <span className="font-mono text-[10px] text-ink-faint">{path.steps.length} steps</span>
            </div>
            <h2 className="mt-2 text-xl font-extrabold tracking-tight">{path.title}</h2>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-dim">{path.promise}</p>
            <PathProgress path={path} />
          </section>
        ))}
      </div>

      <section className="mt-10 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">How these paths are assembled</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          Each path is generated at build time from the essay and component data: if a slug stops existing, the step disappears from the path
          instead of rendering a dead link. The step counts you see are the ones that survived that filter — {LEARN_ARTICLES.length} essays
          and {COMPONENTS.length} components are available to draw from, and these three paths use {totalSteps} of them.
        </p>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-faint">
          This is deliberately not a course platform: there is no certificate, no email gate, and no way for us to know who finished what. If
          you want to keep notes, the browser key is <span className="font-mono">motif:paths</span> and you can read it yourself.
        </p>
      </section>
    </div>
  );
}
