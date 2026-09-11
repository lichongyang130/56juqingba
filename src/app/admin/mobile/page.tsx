import Link from "next/link";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { MODERATION_SEED } from "@/lib/community";

// #380 — the admin mobile pass.
// The console's sidebar is `hidden lg:flex`, so every tool below 1024px had to
// be reached by typing a URL. This page is two things at once: the record of
// what changed, and a touch-sized index that is actually usable on a phone.

const CHANGES: { what: string; detail: string }[] = [
  {
    what: "A phone nav row on every admin page",
    detail:
      "Rendered under the topbar and hidden from 1024px up, so the desktop layout is unchanged. It scrolls horizontally and keeps the current section marked rather than hiding everything behind a hamburger.",
  },
  {
    what: "44px minimum tap targets",
    detail:
      "Each nav item sets min-h-11 (2.75rem) instead of the desktop 32px row. That is the size Apple's and Google's touch guidance agree on; the previous rows were 8px short.",
  },
  {
    what: "A touch index below",
    detail:
      "Every admin section as a full-width card with the route printed underneath, so the page works as a shortcut list from a home screen.",
  },
  {
    what: "The topbar stopped claiming to be live",
    detail:
      "It used to read \u201cLive · last sync just now\u201d above a pulsing dot, which described a server this build does not have. It now says what it is: a static build reading the catalog at build time.",
  },
];

export default function AdminMobile() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Admin mobile pass</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-dim">
          What changed for narrow screens, and a touch-sized index of all {ADMIN_NAV.length} admin sections. No layout is
          claimed to be tested on a device: the numbers below are the ones written in the markup, and you can check any
          of them in the source.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {CHANGES.map((c) => (
          <div key={c.what} className="rounded-3xl border border-white/8 bg-panel p-5">
            <p className="text-[13px] font-extrabold">{c.what}</p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-dim">{c.detail}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-white/8 bg-panel p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">
          Touch index — {ADMIN_NAV.length} sections, {MODERATION_SEED.length} queue rows waiting
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ADMIN_NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="flex min-h-14 items-center gap-3 rounded-2xl border border-white/8 bg-white/[.02] px-4 transition-colors hover:border-white/16"
            >
              <span className="text-lg text-violet-300">{n.icon}</span>
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-bold">{n.label}</span>
                <span className="block truncate font-mono text-[10px] text-ink-faint">{n.href}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-white/8 bg-panel p-5">
        <p className="text-sm font-extrabold">What this pass does not do</p>
        <ul className="prose-list mt-2 text-[11px] text-ink-dim">
          <li>No native app, no offline mode — the console is still a web page that needs a connection.</li>
          <li>
            No camera or share-sheet integration: approving from a phone works, but nothing here would make a phone the
            faster way to review a diff.
          </li>
          <li>
            The bulk bar keeps its desktop density where it can: stacking {MODERATION_SEED.length} rows of gate detail
            into an accordion would hide the reasons a row is blocked, which is the one thing that page exists to show.
          </li>
        </ul>
      </div>
    </div>
  );
}
