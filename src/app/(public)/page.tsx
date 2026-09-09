import Link from "next/link";
import { AssetCard, BackgroundCard, Stage, ToolCard } from "@/components/cards";
import { DemoView } from "@/components/demos/Demo";
import { SearchBar } from "@/components/chrome";
import { BACKGROUNDS, COMMUNITY_STATS, COMPONENTS, LAB_TOOLS } from "@/lib/data";

const SUPER_POWERS = [
  {
    icon: "▦",
    title: "Component library",
    accent: "from-violet-500/20 to-transparent",
    text: "Elements, animated components, sections and whole templates — every one original, themeable and scored for quality, a11y and size.",
    href: "/components",
    cta: "Browse 600+ assets",
  },
  {
    icon: "◎",
    title: "AI prompts, actually tested",
    accent: "from-cyan-400/20 to-transparent",
    text: "Every prompt is run through three frontier models before it ships. You see the fidelity score, the screenshots and the failure modes — not just a pretty mock.",
    href: "/prompts",
    cta: "See the run logs",
  },
  {
    icon: "✧",
    title: "Background & texture lab",
    accent: "from-pink-400/20 to-transparent",
    text: "Aurora fields, star motes, grain, glass — CSS-first implementations with performance tiers and low-end fallbacks.",
    href: "/backgrounds",
    cta: "Explore backgrounds",
  },
  {
    icon: "∿",
    title: "Learn by feeling it",
    accent: "from-emerald-400/20 to-transparent",
    text: "Interactive labs for easing, springs and scroll choreography. Tune the physics, watch it move, export the code.",
    href: "/lab",
    cta: "Open the Lab",
  },
];

const DIFFERENTIATORS = [
  {
    them: "Screenshot-only prompt galleries",
    us: "Every prompt has a live preview plus multi-model test scores and a public run log.",
  },
  {
    them: "Copy-paste component graveyards",
    us: "Every asset passes automated a11y, size and dependency audits before it earns a card.",
  },
  {
    them: "Styles welded to the component",
    us: "100% design-token driven — restyle the whole library from Theme Studio in seconds.",
  },
  {
    them: "One stack or nothing",
    us: "React, HTML/CSS and Vue views with per-stack dependency notes for most assets.",
  },
  {
    them: "Links to docs, no hand-holding",
    us: "Interactive labs teach the motion math behind the code you're copying.",
  },
];

export default function HomePage() {
  const top = [...COMPONENTS].sort((a, b) => b.copies - a.copies).slice(0, 6);
  return (
    <>
      {/* ============================== HERO ============================== */}
      <section className="bg-canvas relative overflow-hidden">
        <div className="bg-grid absolute inset-0" aria-hidden />
        <div className="pointer-events-none absolute -left-40 top-24 h-96 w-96 rounded-full bg-violet-600/25 blur-[130px] animate-drift" aria-hidden />
        <div className="pointer-events-none absolute -right-32 top-10 h-[28rem] w-[28rem] rounded-full bg-cyan-500/20 blur-[130px] animate-drift" style={{ animationDelay: "-7s" }} aria-hidden />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-20 text-center lg:px-8 lg:pb-24 lg:pt-28">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-ink-dim backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
            </span>
            Now testing prompts on Claude · Codex · GLM-4.6
          </div>

          <h1 className="mx-auto mt-7 max-w-4xl text-balance text-5xl font-black leading-[1.02] tracking-tight md:text-7xl">
            Copy less.
            <br />
            <span className="text-gradient">Ship more.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-ink-dim md:text-lg">
            One open platform for the front of your web: original animated components, AI website
            prompts with <span className="text-ink">real test scores</span>, living backgrounds and
            interactive motion labs.
          </p>

          <div className="mt-9 flex justify-center">
            <SearchBar />
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link href="/components" className="btn btn-primary px-7 py-3 text-base">Browse the library</Link>
            <Link href="/lab" className="btn btn-ghost px-7 py-3 text-base">Try the Lab — free</Link>
          </div>

          <dl className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/5 md:grid-cols-4">
            {COMMUNITY_STATS.map((s) => (
              <div key={s.label} className="bg-bg/70 px-5 py-5 backdrop-blur">
                <dt className="order-2 mt-1 text-[11px] font-medium uppercase tracking-wider text-ink-faint">{s.label}</dt>
                <dd className="text-2xl font-extrabold tracking-tight text-ink">{s.value}</dd>
                <dd className="mt-0.5 text-[11px] font-semibold text-mint">{s.delta}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ============================== SUPER POWERS ============================== */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Everything in one place</p>
            <h2 className="mt-2 max-w-2xl text-3xl font-extrabold tracking-tight md:text-4xl">
              Four libraries that used to live on four different tabs
            </h2>
          </div>
          <Link href="/components" className="text-sm font-semibold text-ink-dim hover:text-ink">View everything →</Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {SUPER_POWERS.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              className="card-hover group relative overflow-hidden rounded-3xl border border-white/8 bg-panel p-7"
            >
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${p.accent} opacity-60`} aria-hidden />
              <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/5 text-2xl">
                {p.icon}
              </span>
              <h3 className="relative mt-5 text-xl font-bold tracking-tight">{p.title}</h3>
              <p className="relative mt-2 max-w-lg text-sm leading-relaxed text-ink-dim">{p.text}</p>
              <span className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-dim transition-colors group-hover:text-ink">
                {p.cta} <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================== FEATURED COMPONENTS ============================== */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Live previews</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">Featured this week</h2>
          </div>
          <div className="flex gap-2">
            <Link href="/components" className="btn btn-ghost !py-2 text-xs">All components</Link>
            <Link href="/backgrounds" className="btn btn-quiet !py-2 text-xs">Backgrounds</Link>
          </div>
        </div>
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {top.map((a) => (
            <AssetCard key={a.slug} asset={a} />
          ))}
        </div>
      </section>

      {/* ============================== DIFFERENTIATORS ============================== */}
      <section className="border-y border-white/6 bg-panel/40">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[0.9fr_1.3fr] lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">Raise the bar</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
              Most resource sites end at <span className="text-ink-faint line-through decoration-danger/60">“copy the code”</span>. We keep going.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-ink-dim">
              Everything is original, everything is audited, and nothing ships on a screenshot
              alone. This is what “the copy-paste library” should have been.
            </p>
            <div className="mt-7 flex gap-3">
              <Link href="/components" className="btn btn-primary text-sm">Start free</Link>
              <Link href="/pricing" className="btn btn-ghost text-sm">See Pro</Link>
            </div>
          </div>
          <ul className="space-y-3">
            {DIFFERENTIATORS.map((d, i) => (
              <li key={i} className="grid gap-3 rounded-2xl border border-white/7 bg-bg/60 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">The old way</div>
                  <div className="text-sm font-semibold text-ink-dim">{d.them}</div>
                </div>
                <div className="hidden h-full w-px bg-white/8 sm:block" aria-hidden />
                <div className="sm:max-w-sm">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-mint">Motif UI</div>
                  <div className="text-sm leading-relaxed text-ink">{d.us}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================== BACKGROUNDS STRIP ============================== */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-pink-300">Living canvases</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">Backgrounds with a performance tier</h2>
          </div>
          <Link href="/backgrounds" className="text-sm font-semibold text-ink-dim hover:text-ink">All backgrounds →</Link>
        </div>
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BACKGROUNDS.slice(0, 4).map((b) => (
            <BackgroundCard key={b.slug} bg={b} />
          ))}
        </div>
      </section>

      {/* ============================== LAB TEASER ============================== */}
      <section className="bg-canvas border-y border-white/6 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <div className="relative order-2 lg:order-1">
            <Stage className="border-white/12 shadow-2xl">
              <DemoView demo="scramble-text" props={{ speed: 42 }} />
            </Stage>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">The Lab</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
              Stop guessing the easing. <span className="text-gradient">Feel it.</span>
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink-dim">
              Easing curves, spring physics, scroll choreography — the interactive labs turn motion
              theory into muscle memory, then hand you production-ready exports.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {LAB_TOOLS.slice(0, 4).map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================== FINAL CTA ============================== */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-panel px-6 py-16 text-center md:py-20">
          <div className="mesh-glow pointer-events-none absolute inset-0 opacity-25" aria-hidden />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-balance text-3xl font-extrabold tracking-tight md:text-5xl">
              Your next site is already <span className="text-gradient">half-built</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-ink-dim md:text-base">
              Free forever for the core library. Pro adds test reports, template packs and the API.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/components" className="btn btn-primary px-8 py-3">Browse free assets</Link>
              <Link href="/pricing" className="btn btn-ghost px-8 py-3">Compare plans</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
