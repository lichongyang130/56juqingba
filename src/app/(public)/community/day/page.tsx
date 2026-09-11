import type { Metadata } from "next";
import Link from "next/link";
import { CommunityDay, TodayLine } from "@/components/retention-ui-2";
import { localDay } from "@/lib/retention";

export const metadata: Metadata = {
  title: "Community day — every Thursday — Motif UI",
  description:
    "A weekly themed brief that runs every Thursday. The date and theme are computed from the calendar; the sticker is a local note, not a certificate.",
};

export default function CommunityDayPage() {
  const builtOn = localDay();
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <Link href="/community" className="hover:text-ink">
          Community
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Community day</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Weekly · Thursday</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Community day</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          One small brief, once a week, on the day most people have an hour to spare. The brief rotates with the ISO week number and the date is
          the next Thursday on the calendar, so this page cannot go stale and nobody has to approve the theme.
        </p>
        <div className="mt-3">
          <TodayLine today={builtOn} />
        </div>
      </div>

      <div className="mt-8">
        <CommunityDay today={builtOn} />
      </div>

      <section className="mt-10 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">Where the work goes</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          Nowhere automatic. Motif has no feed, no timeline and no upload box on this page — there is a{" "}
          <Link href="/community/remixes" className="font-semibold text-violet-300 hover:text-violet-200">
            remix board
          </Link>{" "}
          for things people want to publish here, and everything else happens where you normally post. The sticker exists because a small
          acknowledgement is useful, not because we can verify what you made.
        </p>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-faint">
          If you want the bigger monthly brief, it lives on the{" "}
          <Link href="/community/build-a-thon" className="font-semibold text-violet-300 hover:text-violet-200">
            build-a-thon calendar
          </Link>
          . Both pages read the same clock you do — your own.
        </p>
      </section>
    </div>
  );
}
