import type { Metadata } from "next";
import Link from "next/link";
import { CHANGELOG } from "@/lib/data";
import { changeLogSlug } from "@/lib/spine";

export const metadata: Metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/changelog" },
  title: "Studio log — every entry, addressable — Motif UI",
  description:
    "The full changelog with a permalink per entry: what changed, when, and the measured size effect where one was recorded.",
};

const TAG_HUE: Record<string, number> = {
  Components: 262,
  Prompts: 192,
  Backgrounds: 330,
  Lab: 152,
  Platform: 40,
};

export default function ChangelogIndexPage() {
  const measured = CHANGELOG.filter((e) => e.perf).length;
  const lighter = CHANGELOG.filter((e) => e.perf && e.perf.deltaKb < 0).length;

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Studio log</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Studio log · {CHANGELOG.length} entries</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Every entry has an address</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          The homepage shows the latest five in a list. Here each entry keeps its own URL so it can be cited, and keeps its own measurement
          where one was taken: {measured} of {CHANGELOG.length} carry a size figure, {lighter} of those made the site lighter. Entries that
          predate the build report say <span className="font-mono">no measurement</span> instead of borrowing a number.
        </p>
      </div>

      <ol className="mt-10 space-y-4">
        {CHANGELOG.map((entry) => {
          const hue = TAG_HUE[entry.tag] ?? 220;
          return (
            <li key={changeLogSlug(entry)}>
              <Link
                href={`/changelog/${changeLogSlug(entry)}`}
                className="card-hover block rounded-2xl border border-white/8 bg-panel p-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="chip !px-2.5 !text-[9px] font-bold uppercase tracking-wider"
                    style={{ color: `hsl(${hue} 90% 72%)`, borderColor: `hsl(${hue} 90% 72% / 0.35)`, background: `hsl(${hue} 90% 72% / 0.1)` }}
                  >
                    {entry.tag}
                  </span>
                  <span className="font-mono text-[11px] tabular-nums text-ink-faint">{entry.date}</span>
                  {entry.perf ? (
                    <span
                      className={`ml-auto font-mono text-[10px] tabular-nums ${entry.perf.deltaKb < 0 ? "text-emerald-200" : "text-amber-200"}`}
                    >
                      {entry.perf.deltaKb < 0 ? "" : "+"}
                      {entry.perf.deltaKb.toFixed(1)} KB · {entry.perf.scope}
                    </span>
                  ) : (
                    <span className="ml-auto font-mono text-[10px] text-ink-faint">no measurement</span>
                  )}
                </div>
                <h2 className="mt-2 text-base font-extrabold tracking-tight">{entry.title}</h2>
                <p className="mt-1.5 text-[12px] leading-relaxed text-ink-dim">{entry.body}</p>
                <p className="mt-2 font-mono text-[10px] text-violet-300">/changelog/{changeLogSlug(entry)} →</p>
              </Link>
            </li>
          );
        })}
      </ol>

      <section className="mt-10 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">Why split it</h2>
        <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
          One long page can only be linked as a whole. A permalink per entry means a specific claim — &ldquo;the demo module was split out,
          measured 315.5 KB lighter on routes that render none&rdquo; — has a URL that survives the next release, which is what makes a
          changelog citable instead of decorative. The slug is derived from the date and title, so two entries on the same day cannot collide.
        </p>
        <p className="mt-2 text-[11px] leading-relaxed text-ink-faint">
          The list is generated from the same array the homepage reads, so an entry cannot exist in one place and be missing in the other.
        </p>
      </section>
    </div>
  );
}
