"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "▤", exact: true },
  { href: "/admin/assets", label: "Assets", icon: "▦", count: null },
  { href: "/admin/prompts", label: "AI Prompts", icon: "◎", count: null },
  { href: "/admin/moderation", label: "Moderation", icon: "✓", count: 7 },
  { href: "/admin/settings", label: "Settings", icon: "⚙" },
];

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
              {n.count && (
                <span className="ml-auto rounded-full bg-danger/20 px-2 py-0.5 text-[10px] font-bold text-danger">
                  {n.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-2xl border border-white/7 bg-white/3 p-4">
        <div className="text-xs font-bold">MVP note</div>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-dim">
          Demo mode — data is mock, actions preview state locally. Production builds wire Prisma +
          auth (schema in /prisma).
        </p>
      </div>
    </aside>
  );
}

export function AdminTopbar() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-white/6 bg-[#08090f]/80 px-5 backdrop-blur-xl">
      <div className="flex items-center gap-2 text-sm">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
        </span>
        <span className="font-semibold">Live</span>
        <span className="text-ink-faint">· last sync just now</span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <span className="chip hidden sm:inline-flex">role: admin@motifui.dev</span>
        <Link href="/" className="btn btn-ghost !px-3 !py-1.5 !text-[11px]">View site ↗</Link>
      </div>
    </header>
  );
}
