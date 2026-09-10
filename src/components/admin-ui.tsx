"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CommandPalette } from "@/components/admin-ui-3";

import { ADMIN_NAV as NAV } from "@/lib/admin-nav";

export function AdminSidebar() {
  const path = usePathname();
  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-white/6 bg-[#08090f] px-3 py-5 lg:flex">
      <Link href="/" className="flex items-center gap-2.5 px-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-sm font-black text-white">
          M
        </span>
        <div>
          <div className="text-sm font-extrabold leading-none tracking-tight">Motif Admin</div>
          <div className="mt-1 text-[10px] text-ink-faint">studio console</div>
        </div>
      </Link>

      <nav className="mt-8 flex-1 space-y-1">
        {NAV.map((n) => {
          const active = n.exact ? path === n.href : path.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                active ? "bg-white/8 text-ink" : "text-ink-dim hover:bg-white/4 hover:text-ink"
              }`}
            >
              <span className="w-4 text-center text-violet-300">{n.icon}</span>
              {n.label}

            </Link>
          );
        })}
      </nav>

      <div className="rounded-2xl border border-white/7 bg-white/3 p-4">
        <div className="text-xs font-bold">MVP note</div>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-dim">
          Demo console — catalog figures are read from the real data files, queue rows are sample
          records, and every action stays in this browser. Production builds wire Prisma + auth
          (schema in /prisma).
        </p>
      </div>
    </aside>
  );
}

export function AdminTopbar() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-white/6 bg-[#08090f]/80 px-5 backdrop-blur-xl">
      <div className="flex min-w-0 items-center gap-2 text-sm">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-300" />
        </span>
        <span className="font-semibold">Static build</span>
        <span className="truncate text-ink-faint">· catalog read at build time, no server attached</span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <CommandPalette />
        <span className="chip hidden sm:inline-flex">role: admin@motifui.dev</span>
        <Link href="/" className="btn btn-ghost !px-3 !py-1.5 !text-[11px]">View site ↗</Link>
      </div>
    </header>
  );
}

/** #380 — the admin nav for phones. The sidebar is `hidden lg:flex`, so before
 *  this the console had no navigation at all below 1024px: the only way to
 *  reach a tool was to type the URL. Targets are 44px tall and scroll
 *  horizontally rather than collapsing into a menu that hides the current
 *  section. */
export function AdminMobileNav() {
  const path = usePathname();
  return (
    <nav
      aria-label="Admin sections"
      className="flex snap-x gap-1.5 overflow-x-auto border-b border-white/6 bg-[#08090f] px-4 py-2 lg:hidden"
    >
      {NAV.map((n) => {
        const active = n.exact ? path === n.href : path.startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            className={`flex min-h-11 shrink-0 snap-start items-center gap-1.5 rounded-xl px-3 text-[12px] font-semibold transition-colors ${
              active ? "bg-white/10 text-ink" : "text-ink-dim hover:bg-white/5 hover:text-ink"
            }`}
          >
            <span className="text-violet-300">{n.icon}</span>
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}
