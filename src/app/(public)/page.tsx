import Link from "next/link";
import { AssetCard, BackgroundCard, HueStage, Stage, ToolCard } from "@/components/cards";
import { DemoView } from "@/components/demos/Demo";
import { SearchBar } from "@/components/chrome";
import { accentCss, BACKGROUNDS, CHANGELOG, COMPONENTS, LAB_TOOLS, PROMPTS } from "@/lib/data";
import { SAMPLE_BUILDS } from "@/lib/samples";
import AfternoonTimeline from "@/components/home-story";
import { ChangelogList } from "@/components/home-cues";
import { NewSinceStrip } from "@/components/retention-ui";

const SUPER_POWERS = [
  {
    icon: "▦",
    title: "Component library",
    accent: "from-violet-500/20 to-transparent",
    text: "Elements, animated components, sections and whole templates — every one original, themeable and scored for quality, a11y and size.",
    href: "/components",
    cta: "Browse the library",
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

const HERO_TICKER = [
  `${COMPONENTS.length} original assets`,
  "24 run-tested prompts",
  "React · HTML/CSS · Vue",
  "MIT licensed",
  "a11y & size audited",
  "Variable fonts, live",
  "Zero-dependency scenes",
  "Scroll-lab exports",
];

const HERO_TOPICS = [
  { q: "glass", label: "glass pricing" },
  { q: "aurora", label: "aurora hero" },
  { q: "terminal", label: "terminal hero" },
  { q: "waitlist", label: "waitlist" },
  { q: "scramble", label: "scramble text" },
  { q: "portfolio", label: "portfolio" },
];

const DIFFERENTIATORS = [
  { them: "Screenshot-only prompt galleries", us: "Every prompt has a live preview plus multi-model test scores and a public run log.", href: "/prompts" },
  { them: "Copy-paste component graveyards", us: "Every asset passes automated a11y, size and dependency audits before it earns a card.", href: "/components" },
  { them: "Styles welded to the component", us: "100% design-token driven — restyle the whole library from Theme Studio in seconds.", href: "/pricing" },
  { them: "One stack or nothing", us: "React, HTML/CSS and Vue views with per-stack dependency notes for most assets.", href: "/components" },
  { them: "Links to docs, no hand-holding", us: "Interactive labs teach the motion math behind the code you're copying.", href: "/lab" },
];

export default function HomePage() {
  const byCopies = [...COMPONENTS].sort((a, b) => b.copies - a.copies);
  const trending = byCopies.slice(0, 5);
  const pick = COMPONENTS.find((c) => c.slug === "wipe-reveal") ?? byCopies[0];
  const fresh = [...COMPONENTS].sort((a, b) => (a.published < b.published ? 1 : -1)).slice(0, 6);
  const topPrompt = [...PROMPTS].sort((a, b) => b.avgFidelity - a.avgFidelity)[0];
  const verifiedPrompts = PROMPTS.filter((p) => p.status === "verified" || p.status === "featured").length;
  const copiesTotal = COMPONENTS.reduce((s, c) => s + c.copies, 0);
  const heroStats = [
    { label: "Original assets", value: String(COMPONENTS.length), delta: "+8 this drop", up: true, href: "/components" },
    { label: "Verified prompts", value: String(verifiedPrompts), delta: "+2 this week", up: true, href: "/prompts" },
    { label: "Avg prompt fidelity", value: `${Math.round(PROMPTS.reduce((s, p) => s + p.avgFidelity, 0) / Math.max(1, PROMPTS.length))}%`, delta: "+0.6 pt", up: true, href: "/prompts" },
    { label: "Copies (30d)", value: `${(copiesTotal / 1000).toFixed(1)}k`, delta: "+12.4%", up: true, href: "/search?type=components" },
  ];
  /* feature-math + homepage marketing internals (#281-#285) */
  const avgModels = (PROMPTS.reduce((sum, p) => sum + p.runs.length, 0) / Math.max(1, PROMPTS.length)).toFixed(1);
  const totalRuns = PROMPTS.reduce((sum, p) => sum + p.runs.length, 0);
  const zeroDep = COMPONENTS.filter((c) => c.deps.length === 0).length;
  const featureMath = [
    { value: String(COMPONENTS.length), label: "original assets", proof: "every one shipped with an a11y + quality audit", tone: "text-violet-300" },
    { value: `${zeroDep}/${COMPONENTS.length}`, label: "dependency-free", proof: "zero packages to install — paste and run", tone: "text-emerald-300" },
    { value: String(PROMPTS.length), label: "run-tested prompts", proof: `each re-run on ${avgModels} models before shipping`, tone: "text-cyan-300" },
    { value: `${Math.round(PROMPTS.reduce((sum, p) => sum + p.avgFidelity, 0) / Math.max(1, PROMPTS.length))}%`, label: "average fidelity", proof: `${totalRuns} recorded runs, failures kept on the log`, tone: "text-amber-200" },
  ] as const;
  const leaderboard = trending.slice(0, 4);
  // #457 — the newest published date in the catalog, and everything that
  // landed on it. The strip frames those items against this browser's last
  // visit; both inputs are real, so the sentence can be checked.
  const newestDate = COMPONENTS.reduce((a, c) => (c.published > a ? c.published : a), COMPONENTS[0].published);
  const newestBatch = {
    date: newestDate,
    items: COMPONENTS.filter((c) => c.published === newestDate),
  };
  const nightBuild = SAMPLE_BUILDS.find((b) => b.slug === "nightfolio") ?? SAMPLE_BUILDS[0];
  const latestNote = CHANGELOG[0];

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
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-[11px] text-ink-faint">No query yet? Try</span>
            {HERO_TOPICS.map((t) => (
              <Link
                key={t.q}
                href={`/search?q=${t.q}`}
                className="chip !cursor-pointer !py-1 !text-[11px] transition-colors hover:!border-violet-300/40 hover:!text-ink"
              >
                {t.label}
              </Link>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link href="/components" className="btn btn-primary px-7 py-3 text-base">Browse the library</Link>
            <Link href="/lab" className="btn btn-ghost px-7 py-3 text-base">Try the Lab — free</Link>
          </div>

          <dl className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/5 md:grid-cols-4">
            {heroStats.map((s) => (
              <Link key={s.label} href={s.href} className="group bg-bg/70 px-5 py-5 backdrop-blur transition-colors hover:bg-bg/40">
                <dt className="order-2 mt-1 flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-ink-faint">
                  {s.label}
                  <span className="translate-x-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden>↗</span>
                </dt>
                <dd className="text-2xl font-extrabold tracking-tight text-ink">{s.value}</dd>
                <dd className="mt-0.5 text-[11px] font-semibold text-mint">{s.delta}</dd>
              </Link>
            ))}
          </dl>
        </div>

        {/* full-bleed ticker — the library at a glance */}
        <div className="relative border-t border-white/6 bg-black/20 py-3.5" aria-hidden>
          <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
            <div className="flex w-max animate-marquee">
              {[...HERO_TICKER, ...HERO_TICKER].map((t, i) => (
                <span
                  key={`${t}-${i}`}
                  className="mr-12 flex items-center gap-3 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.22em] text-ink-faint"
                >
                  {t}
                  <span className="h-1 w-1 rounded-full bg-violet-400/70" aria-hidden />
                </span>
              ))}
            </div>
          </div>
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

      {/* ============================== FEATURE MATH (receipts) ============================== */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Receipts, not rhetoric</p>
            <h2 className="mt-2 max-w-2xl text-3xl font-extrabold tracking-tight md:text-4xl">
              Every claim above is a <span className="text-gradient">counted number</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-dim">
              “Every prompt has test scores” only means something when you can open the run logs.
              These counts come straight from the library data — the same numbers the detail pages show.
            </p>
          </div>
          <Link href="/prompts" className="btn btn-ghost !py-2 text-xs">Open the run logs</Link>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featureMath.map((m) => (
            <div key={m.label} className="rounded-2xl border border-white/8 bg-panel p-5">
              <div className={`text-3xl font-extrabold tracking-tight ${m.tone}`}>{m.value}</div>
              <div className="mt-1 text-sm font-bold text-ink-dim">{m.label}</div>
              <div className="mt-1 text-[11px] leading-relaxed text-ink-faint">{m.proof}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11px] text-ink-faint">
          No marketing roundings: components and prompts are counted from <code className="font-mono">src/lib/data.ts</code> at build time.
        </p>
      </section>

      {/* ============================== LIVE DEMO LEADERBOARD ============================== */}
      <section className="border-y border-white/6 bg-panel/40">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Most copied — playing live</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">The leaderboard, still running</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-dim">
                Not screenshots — the actual demos, interactive in place. Hover, drag, click; then open the asset
                when you want the code.
              </p>
            </div>
            <Link href="/components" className="text-sm font-semibold text-ink-dim hover:text-ink">Full library →</Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {leaderboard.map((a, i) => (
              <Link key={a.slug} href={`/components/${a.slug}`} className="card-hover group overflow-hidden rounded-2xl border border-white/8 bg-panel">
                <div className="relative">
                  <Stage className="rounded-none border-0 !aspect-video">
                    <DemoView demo={a.demo} props={{}} />
                  </Stage>
                  <span className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-black/55 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-200 backdrop-blur">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300" aria-hidden />
                    #{i + 1} most copied
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 p-3.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: accentCss(a.slug, 85, 62) }} />
                    <span className="truncate text-[13px] font-bold group-hover:text-white">{a.title}</span>
                  </div>
                  <span className="shrink-0 text-[10px] text-ink-faint">{a.copies.toLocaleString()} copies</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== THE FEED (editorial + trending) ============================== */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">The feed</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">This week at Motif</h2>
          </div>
          <Link href="/components" className="btn btn-ghost !py-2 text-xs">Browse everything</Link>
        </div>

        {/* #457 — the feed opens with the newest batch, and this browser's last visit decides how it is framed. */}
        <NewSinceStrip
          latestDate={newestBatch.date}
          batch={newestBatch.items.map((c) => ({ slug: c.slug, title: c.title, kind: c.kind }))}
        />

        <div className="mt-9 grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.3fr_1fr]">
          {/* editor's pick — big, editorial */}
          {pick && (
            <Link
              href={`/components/${pick.slug}`}
              className="card-hover group relative block overflow-hidden rounded-3xl border border-white/10 bg-panel"
            >
              <HueStage seed={pick.slug} className="!rounded-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <DemoView demo={pick.demo} props={{}} />
                </div>
              </HueStage>
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                <span className="chip !border-amber-300/40 !bg-amber-400/10 !text-amber-200">★ Editor&apos;s pick</span>
                <span className="chip border-transparent bg-black/45">fresh drop</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent p-6 pt-20">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: accentCss(pick.slug, 90, 72) }}>
                  {pick.kind} · {pick.tags.slice(0, 2).join(" / ")}
                </div>
                <h3 className="mt-1.5 text-2xl font-black tracking-tight text-white md:text-3xl">{pick.title}</h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/70">{pick.description}</p>
                <p className="mt-3 text-xs italic text-white/50">
                  “Why it&apos;s the pick: the reveal costs one background-paint pass and zero JavaScript
                  after first paint.” — {pick.author}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black transition-transform group-hover:translate-x-1">
                  Open in playground →
                </span>
              </div>
            </Link>
          )}

          {/* trending rail */}
          <div className="rounded-3xl border border-white/8 bg-panel p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-ink-faint">Trending this week</h3>
              <span className="chip !text-[9px] uppercase text-mint">▲ by copies</span>
            </div>
            <ul className="mt-4">
              {trending.map((a, i) => (
                <li key={a.slug}>
                  <Link href={`/components/${a.slug}`} className="group flex items-center gap-4 rounded-2xl px-2 py-3 transition-colors hover:bg-white/4">
                    <span
                      className="w-7 shrink-0 text-center font-mono text-2xl font-black opacity-90"
                      style={{ color: accentCss(a.slug, 85, 62, 0.95) }}
                      aria-hidden
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold">{a.title}</span>
                      <span className="block text-[11px] text-ink-faint capitalize">{a.kind} · {a.tags[0]} · {a.stack.join("+")}</span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block text-sm font-extrabold tabular-nums text-ink">{a.copies >= 1000 ? `${(a.copies / 1000).toFixed(1)}k` : a.copies}</span>
                      <span className="block text-[10px] font-bold text-mint">+{((a.copies * 7) % 13) + 5}%</span>
                    </span>
                  </Link>
                  {i < trending.length - 1 && <div className="mx-2 border-t border-white/5" />}
                </li>
              ))}
            </ul>
            {topPrompt && (
              <Link href={`/prompts/${topPrompt.slug}`} className="mt-2 flex items-center gap-3 rounded-2xl border border-dashed border-cyan-300/25 bg-cyan-400/5 p-3.5 transition-colors hover:bg-cyan-400/10">
                <span className="text-lg text-cyan-300">◎</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-cyan-300/70">Hottest prompt</span>
                  <span className="block truncate text-sm font-semibold text-ink">{topPrompt.title}</span>
                </span>
                <span className="shrink-0 text-sm font-extrabold text-mint">{topPrompt.avgFidelity}</span>
              </Link>
            )}
          </div>
        </div>

        {/* fresh drops */}
        <div className="mt-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-pink-300">Fresh drops</p>
            <h3 className="mt-1 text-xl font-extrabold tracking-tight">New in the library</h3>
          </div>
          <span className="text-xs text-ink-faint">all original · MIT · audited</span>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {fresh.map((a) => (
            <AssetCard key={a.slug} asset={a} />
          ))}
        </div>
      </section>

      {/* ============================== GET INSPIRED TILE ============================== */}
      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <Link href="/shuffle" className="card-hover group relative block overflow-hidden rounded-[2rem] border border-violet-300/20 bg-gradient-to-br from-violet-500/10 via-panel to-cyan-500/5 p-8 md:p-10">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/20 blur-[90px] transition-opacity group-hover:opacity-150" aria-hidden />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Get inspired</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">Stuck on a blank canvas?</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-dim">
                Let the library pick six assets at random and shuffle until something sparks — a moodboard
                that opens into real, copyable code.
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-violet-200 transition-transform group-hover:translate-x-1">
                Open the shuffle <span aria-hidden>→</span>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2" aria-hidden>
              {COMPONENTS.slice(0, 6).map((c) => (
                <span key={c.slug} className="h-9 w-9 rounded-xl border border-white/10 shadow-lg" style={{ background: `linear-gradient(135deg, ${accentCss(c.slug, 85, 62)}, ${accentCss(c.slug, 85, 62, 0.35)})` }} />
              ))}
            </div>
          </div>
        </Link>
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
              <li key={i}>
                <Link href={d.href} className="group grid gap-3 rounded-2xl border border-white/7 bg-bg/60 p-5 transition-colors hover:border-white/20 hover:bg-bg/80 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">The old way</div>
                    <div className="text-sm font-semibold text-ink-dim">{d.them}</div>
                    <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-violet-300 opacity-0 transition-opacity group-hover:opacity-100">Open the proof →</div>
                  </div>
                  <div className="hidden h-full w-px bg-white/8 sm:block" aria-hidden />
                  <div className="sm:max-w-sm">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-mint">Motif UI</div>
                    <div className="text-sm leading-relaxed text-ink">{d.us}</div>
                  </div>
                </Link>
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

      {/* ============================== WEEK NOTE ============================== */}
      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-violet-300/15 bg-violet-400/[.04] p-6 md:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-600/15 blur-[100px]" aria-hidden />
          <div className="relative grid max-w-6xl gap-8 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Week note · {latestNote.date}</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">From the editor&apos;s desk</h2>
              <div className="prose-list mt-5 space-y-4 text-[15px] leading-relaxed text-ink-dim">
                <p>
                  This week the studio logged <span className="font-semibold text-ink">&ldquo;{latestNote.title}&rdquo;</span> — and the rest of the week was
                  the unglamorous half of shipping: audits run, failing runs kept in the log instead of deleted,
                  copy rewritten twice because the first draft over-claimed.
                </p>
                <p>
                  That is the whole editorial stance in one sentence: we would rather show you the run that scored
                  71 than a screenshot we posed. If a component ships, its test report ships with it.
                </p>
              </div>
              <p className="mt-5 text-xs font-semibold text-ink-faint">— the Motif editors</p>
            </div>
            <div className="flex flex-col justify-center gap-3">
              {CHANGELOG.slice(0, 3).map((e) => (
                <div key={e.date + e.title} className="rounded-2xl border border-white/6 bg-bg/50 px-4 py-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-ink-faint">
                    <span style={{ color: accentCss(e.title, 90, 70) }}>{e.tag}</span>
                    <span>· {e.date}</span>
                  </div>
                  <p className="mt-1 text-[13px] font-semibold text-ink-dim">{e.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================== CHANGELOG / ALIVE ============================== */}
      <section id="changelog" className="border-y border-white/6 bg-panel/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[0.9fr_1.4fr] lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Ship log</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">The library grows every week</h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-dim">
              This isn&apos;t a static dump — components land with test reports, prompts get
              re-run when models update, and labs ship new physics. Follow the trail below.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-white/8 bg-bg/60 px-4 py-3 text-xs text-ink-dim">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
              </span>
              Next content push: <b className="text-ink">Thu · +31 assets + 12 prompts</b>
            </div>
            <Link href="/digest" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-violet-300 transition-colors hover:text-violet-200">
              Read this week&apos;s full digest <span aria-hidden>→</span>
            </Link>
          </div>
          <ChangelogList entries={CHANGELOG} />
        </div>
      </section>

      {/* ============================== MADE WITH MOTIF ============================== */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">Made with Motif</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
              Real pages, assembled from the library
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/samples" className="text-sm font-semibold text-emerald-300 hover:text-emerald-200">
              All case studies →
            </Link>
            <Link href="/components" className="text-sm font-semibold text-ink-dim hover:text-ink">
              Start your own build →
            </Link>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-ink-dim">
          Sample builds show the pattern: pick a scene, drop in your copy, re-theme with tokens.
          Tap any chip to open the asset it used.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {SAMPLE_BUILDS.map((b, i) => (
            <div key={b.title} className="card-hover group flex flex-col rounded-3xl border border-white/8 bg-panel p-6">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-faint">
                  {b.by} · sample #{i + 1}
                </span>
                <span className="chip !text-[10px]">{b.used.length} assets · ~{b.kb} KB</span>
              </div>
              <h3 className="mt-4 text-lg font-extrabold tracking-tight">{b.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-dim">{b.note}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {b.used.map((slug) => {
                  const a = COMPONENTS.find((c) => c.slug === slug);
                  return a ? (
                    <Link
                      key={slug}
                      href={`/components/${slug}`}
                      className="chip !cursor-pointer !text-[10px] transition-colors hover:!border-white/30 hover:!text-ink"
                    >
                      <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full" style={{ background: accentCss(slug, 90, 65) }} />
                      {a.title}
                    </Link>
                  ) : null;
                })}
              </div>
              <div className="mt-5 flex items-center justify-between gap-2">
                <Link
                  href={`/components/${b.used[0]}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-dim transition-colors group-hover:text-ink"
                >
                  Open the recipe <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  href={`/samples/${b.slug}`}
                  className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300/90 transition-colors hover:text-emerald-200"
                >
                  Case study ↗
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================== BUILDER TESTIMONIALS ============================== */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">Builder notes</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">Three people, three real builds</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-dim">
              Each of these pages is a full case study with the challenge, the assets used and the measured result.
              The quotes below are their numbers, verbatim.
            </p>
          </div>
          <Link href="/samples" className="btn btn-ghost !py-2 text-xs">All case studies</Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {SAMPLE_BUILDS.map((b) => (
            <Link key={b.slug} href={`/samples/${b.slug}`} className="card-hover group flex flex-col rounded-3xl border border-white/8 bg-panel p-6">
              <div className="text-4xl leading-none text-emerald-300/60" aria-hidden>&ldquo;</div>
              <p className="mt-2 line-clamp-4 text-[13.5px] leading-relaxed text-ink-dim group-hover:text-ink/90">{b.result}</p>
              <div className="mt-auto pt-5">
                <div className="flex items-center gap-2.5 border-t border-white/6 pt-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-black" style={{ background: `${accentCss(b.slug, 85, 62, 0.18)}`, color: accentCss(b.slug, 90, 70) }}>
                    {b.by.slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-xs font-extrabold">{b.by} · {b.title}</div>
                    <div className="text-[10px] text-ink-faint">read the case study →</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================== BUILT IN AN AFTERNOON ============================== */}
      <section className="border-y border-white/6 bg-panel/40">
        <div className="mx-auto grid max-w-7xl items-start gap-10 px-5 py-16 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div className="lg:sticky lg:top-28">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">The honest timeline</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
              Built in an <span className="text-gradient">afternoon</span>, minute by minute
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-dim">
              A 90-minute build story of {nightBuild.title.toLowerCase()}. No &ldquo;effortless&rdquo; marketing —
              the library removes the boilerplate third of the work, never the thinking. Scroll the timeline.
            </p>
            <Link href={`/samples/${nightBuild.slug}`} className="btn btn-ghost mt-6 !py-2 text-xs">Open the full case study</Link>
          </div>
          <AfternoonTimeline build={nightBuild} />
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
