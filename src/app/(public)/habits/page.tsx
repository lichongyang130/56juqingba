import type { Metadata } from "next";
import Link from "next/link";
import { LibraryFitness } from "@/components/retention-ui";
import { QuietReminder, RateYourBuild, StreakBoard, TodayLine } from "@/components/retention-ui-2";
import { localDay } from "@/lib/retention";

export const metadata: Metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  // 519 — robots.txt only asks a crawler not to fetch this page; the noindex
  // is what keeps an empty browser-local surface out of the index itself.
  robots: { index: false },
  alternates: { canonical: "/habits" },
  title: "Maker habits — Motif UI",
  description:
    "Three optional, browser-local habits: a copy streak, a one-tap did-this-ship check-in, and a reminder that can only ever be one line on a visit.",
};

/**
 * The server renders the date it was built with so the page is honest in
 * no-JS HTML; the client panels replace it with the viewer's own clock and
 * say which one they are using.
 */
export default function HabitsPage() {
  const builtOn = localDay();

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <Link href="/saved" className="hover:text-ink">
          Saved list
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Maker habits</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Habits · opt-in, browser-local</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Three habits, none of them pushy</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          Streaks, check-ins and reminders are the usual machinery of engagement. On a static site with no accounts they can only ever be a
          local drawer, so that is what they are: a switch you flip, a log you can read, and a delete button that is just clearing a browser
          key. Nothing on this page is sent anywhere, and every panel says which key it writes.
        </p>
        <div className="mt-3">
          <TodayLine today={builtOn} />
        </div>
      </div>

      <div className="mt-10 grid gap-5">
        <StreakBoard />
        <RateYourBuild />
        <QuietReminder />
      </div>

      <section className="mt-10 grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <h2 className="text-sm font-extrabold tracking-tight">What these panels cannot do</h2>
          <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-ink-dim">
            <li>Send you an email — there is no list, and no address was ever collected.</li>
            <li>Push a notification — the permission is never requested, so the reminder can only appear while a page is open.</li>
            <li>Follow you between browsers — the log lives in this browser&apos;s storage and dies with it.</li>
            <li>Verify anything — &ldquo;shipped&rdquo; means you tapped shipped. We cannot see your repository.</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <h2 className="text-sm font-extrabold tracking-tight">The keys, in full</h2>
          <ul className="mt-3 space-y-2 font-mono text-[11px] text-ink-dim">
            <li>
              motif:streak-optin — <span className="font-sans">the master switch</span>
            </li>
            <li>
              motif:copy-log — <span className="font-sans">up to 120 dated copies, one per asset per day</span>
            </li>
            <li>
              motif:shipped — <span className="font-sans">your shipped / waiting answers</span>
            </li>
            <li>
              motif:reminder — <span className="font-sans">on or off</span>
            </li>
            <li>
              motif:reminder-snooze — <span className="font-sans">a date, nothing more</span>
            </li>
          </ul>
          <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
            Clearing site data resets all five. That is the whole account system: the delete button is in your browser settings, which is the
            honest place for it.
          </p>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">The score, still on the saved page</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          The library-fitness meter reads the same saved list this page reads, so it lives beside the stars rather than here. Same rule applies:
          the formula is printed next to the number.
        </p>
        <div className="mt-4">
          <LibraryFitness />
        </div>
      </section>
    </div>
  );
}
