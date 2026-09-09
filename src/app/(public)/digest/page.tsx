import Link from "next/link";
import { accentCss, BACKGROUNDS, CHANGELOG, COMPONENTS, PROMPTS } from "@/lib/data";

export const metadata = { title: "This week at Motif — weekly digest" };

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

interface WeekEntry {
  slug: string;
  title: string;
  kind: string;
  stack: string[];
  bundleKb?: number;
  copies?: number;
  published: string;
  demo?: string;
}

export default function DigestPage() {
  const now = new Date();
  const nowIso = now.toISOString().slice(0, 10);
  const weekStart = new Date(now.getTime() - WEEK_MS);

  const fresh = (d: string) => {
    const t = new Date(d).getTime();
    return Number.isFinite(t) && t >= weekStart.getTime() && t <= now.getTime() + 24 * 60 * 60 * 1000;
  };

  const comps: WeekEntry[] = COMPONENTS.filter((c) => fresh(c.published)).map((c) => ({
    slug: c.slug,
    title: c.title,
    kind: c.kind,
    stack: c.stack,
    bundleKb: c.bundleKb,
    copies: c.copies,
    published: c.published,
    demo: c.demo,
  }));
  const prompts: WeekEntry[] = PROMPTS.filter((p) => fresh(p.published)).map((p) => ({
    slug: p.slug,
    title: p.title,
    kind: "prompt",
    stack: p.stacks.slice(0, 2),
    copies: p.avgFidelity,
    published: p.published,
  }));
  const log = CHANGELOG.filter((e) => fresh(e.date)).sort((a, b) => (a.date < b.date ? 1 : -1));
  const weekTotal = comps.length + prompts.length;

  const arrivals: WeekEntry[] = [...comps, ...prompts]
    .sort((a, b) => (a.published < b.published ? 1 : -1) || (b.copies ?? 0) - (a.copies ?? 0))
    .slice(0, 9);

  const top: WeekEntry[] = [...comps, ...prompts]
    .sort((a, b) => (b.copies ?? 0) - (a.copies ?? 0))
    .slice(0, 5);

  const bgFresh = [...BACKGROUNDS].sort((a, b) => b.copies - a.copies).slice(0, 3);

  const fmt = (n?: number) => (n ?? 0).toLocaleString();
  const hrefOf = (e: WeekEntry) =>
    e.kind === "prompt" ? `/prompts/${e.slug}` : `/components/${e.slug}`;

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <span className="text-ink-dim">Weekly digest</span>
      </nav>

      <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">This week at Motif · {nowIso}</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
        The weekly <span className="text-gradient">digest</span> — a real archive
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-dim">
        Every thing that landed in the last seven days: new library assets, the week&apos;s most-copied builds and the
        studio log. Each digest is a snapshot — earlier weeks stay in the changelog as the archive grows.
      </p>

      {/* headline numbers */}
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          { n: comps.length, label: "components published", tone: "text-violet-300" },
          { n: prompts.length, label: "prompts run-tested", tone: "text-cyan-300" },
          { n: log.length, label: "studio log entries", tone: "text-emerald-300" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/8 bg-panel p-5">
            <div className={`text-3xl font-extrabold tracking-tight ${s.tone}`}>{s.n}</div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-ink-faint">{s.label}</div>
          </div>
        ))}
      </div>

      {/* arrivals */}
      <section className="mt-12">
        <div className="flex items-baseline justify-between gap-2 border-b border-white/6 pb-3">
          <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-violet-300">New in the library</h2>
          <span className="text-[11px] text-ink-faint">{weekTotal} arrivals in the last 7 days</span>
        </div>
        <div className="mt-4 space-y-2">
          {arrivals.map((e) => (
            <Link key={`${e.kind}-${e.slug}`} href={hrefOf(e)} className="group flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-xl border border-white/5 bg-white/[.02] px-4 py-3 transition-colors hover:border-white/15 sm:flex-nowrap">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: accentCss(e.slug, 85, 62) }} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-sm font-extrabold group-hover:text-white">{e.title}</h3>
                  <span className="rounded-full border border-white/8 px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-ink-faint">{e.kind}</span>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-ink-faint">{e.published}{e.bundleKb ? ` · ~${e.bundleKb} KB` : ""}</p>
              </div>
              {e.copies !== undefined && (
                <span className="shrink-0 text-[10px] text-ink-faint">{e.kind === "prompt" ? `${e.copies}/100 fidelity` : `${fmt(e.copies)} copies`}</span>
              )}
              <span className="shrink-0 text-xs text-ink-faint transition-transform group-hover:translate-x-1">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* top of the week */}
      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="border-b border-white/6 pb-3 text-xs font-bold uppercase tracking-[0.24em] text-amber-200">Top of the week</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {top.map((e, i) => (
              <Link key={`${e.kind}-${e.slug}`} href={hrefOf(e)} className="card-hover rounded-xl border border-white/8 bg-panel px-3 py-2.5 text-xs">
                <span className="mr-1.5 font-bold text-amber-200/90">#{i + 1}</span>
                <span className="font-semibold text-ink-dim transition-colors group-hover:text-ink">{e.title}</span>
              </Link>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-ink-faint">Ranked by copy count among this week&apos;s arrivals — breadth taught by popularity.</p>
        </div>
        <div>
          <h2 className="border-b border-white/6 pb-3 text-xs font-bold uppercase tracking-[0.24em] text-pink-300">Background refresh</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {bgFresh.map((b) => (
              <Link key={b.slug} href={`/components/${b.slug}`} className="card-hover flex items-center gap-2 rounded-xl border border-white/8 bg-panel px-3 py-2.5 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ background: accentCss(b.slug, 85, 62) }} />
                <span className="font-semibold text-ink-dim">{b.title}</span>
                <span className="text-[10px] text-ink-faint">{fmt(b.copies)} copies</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* studio log */}
      <section className="mt-12">
        <h2 className="border-b border-white/6 pb-3 text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">Studio log</h2>
        <div className="mt-4 space-y-3">
          {log.length === 0 && (
            <p className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-xs text-ink-faint">
              Quiet week in the studio — the archive keeps every earlier entry.
            </p>
          )}
          {log.map((e) => (
            <div key={`${e.date}-${e.title}`} className="rounded-2xl border border-white/6 bg-white/[.02] p-5">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-faint">
                <span className="text-emerald-300">{e.tag}</span>
                <span>·</span>
                <span>{e.date}</span>
              </div>
              <h3 className="mt-2 text-base font-extrabold tracking-tight">{e.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-dim">{e.body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-14 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/8 bg-panel p-6">
        <div>
          <p className="text-sm font-extrabold">Want a longer look?</p>
          <p className="mt-1 text-xs text-ink-dim">Browse everything by type, or open an asset directly to copy it.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/components" className="btn btn-primary !py-2 text-xs">Browse components</Link>
          <Link href="/learn" className="btn btn-ghost !py-2 text-xs">Read the guides</Link>
        </div>
      </div>
    </div>
  );
}
