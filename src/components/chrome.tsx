"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV, SITE } from "@/lib/site";

/* One-line newsletter promise, shown in every footer. Cadence honesty included. */
export function NewsletterLine() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      window.localStorage.setItem("motif:newsletter-demo", email.trim().toLowerCase());
    } catch {
      /* private mode */
    }
    setDone(true);
  };
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
      <p className="max-w-md text-xs leading-relaxed text-ink-dim">
        <span className="font-bold text-ink">The Motif letter</span> — one email a month: new assets, one
        build story and the honest numbers. No weekly spam; the next issue ships on the first Friday.
      </p>
      {done ? (
        <span className="text-xs font-bold text-emerald-300">✓ You&apos;re on the list (demo save)</span>
      ) : (
        <form onSubmit={submit} className="flex w-full max-w-sm items-center gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-label="Email for the monthly letter"
            className="input !rounded-xl !py-2 text-xs"
          />
          <button type="submit" className="btn btn-ghost !rounded-xl !px-3.5 !py-2 text-xs">Join</button>
        </form>
      )}
    </div>
  );
}

/* Subtle bottom CTA rail — marketing pages only; dismissed once per browser. */
export function CtaRail() {
  const [gone, setGone] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [deep, setDeep] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        if (window.localStorage.getItem("motif:rail-dismissed")) setDismissed(true);
      } catch {
        /* private mode */
      }
    });
    const onScroll = () => setDeep(window.scrollY > 560);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (dismissed || !deep) return null;
  const hide = () => {
    setGone(true);
    try {
      window.localStorage.setItem("motif:rail-dismissed", "1");
    } catch {
      /* private mode */
    }
  };
  return (
    <div
      className={`fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 transition-all duration-500 ${
        gone ? "pointer-events-none translate-y-6 opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="flex w-full max-w-3xl flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/12 bg-[#10131c]/95 px-4 py-3 shadow-[0_24px_70px_-20px_rgba(0,0,0,.85)] backdrop-blur-xl md:px-5">
        <div className="min-w-0">
          <p className="text-sm font-extrabold tracking-tight">Every asset here is free to copy</p>
          <p className="mt-0.5 text-[11px] text-ink-dim">
            107 components · 74 run-tested prompts · 60 guides — no account, no signup.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Link href="/components" className="btn btn-primary !px-3.5 !py-2 text-xs">Browse the library</Link>
          <button
            type="button"
            onClick={hide}
            aria-label="Dismiss"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-white/5 hover:text-ink"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <defs>
        <linearGradient id="mf-logo" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#8b5cf6" />
          <stop offset="0.55" stopColor="#6366f1" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="29" height="29" rx="9" stroke="url(#mf-logo)" strokeWidth="2" />
      <rect x="7" y="7" width="6" height="6" rx="2" fill="url(#mf-logo)" />
      <rect x="19" y="7" width="6" height="6" rx="2" fill="url(#mf-logo)" opacity="0.55" />
      <rect x="7" y="19" width="6" height="6" rx="2" fill="url(#mf-logo)" opacity="0.55" />
      <rect x="19" y="19" width="6" height="6" rx="2" fill="url(#mf-logo)" />
    </svg>
  );
}

export function Header() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-bg/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="font-display text-[17px] font-extrabold tracking-tight">
            {SITE.name.split(" ")[0]}
            <span className="text-gradient"> {SITE.name.split(" ").slice(1).join(" ") || "UI"}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => {
            const active = path === n.href || path.startsWith(n.href + "/");
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-white/8 text-ink" : "text-ink-dim hover:text-ink"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/search"
            aria-label="Search the library"
            className="hidden h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/4 text-ink-dim transition-colors hover:border-white/20 hover:text-ink xl:flex"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </Link>
          <Link href="/admin" className="hidden text-xs font-medium text-ink-faint hover:text-ink-dim sm:block">
            Admin ↗
          </Link>
          <Link href="/components" className="btn btn-ghost hidden !py-2 text-xs sm:inline-flex">
            Sign in
          </Link>
          <Link href="/pricing" className="btn btn-primary !py-2 text-xs">
            Go Pro
          </Link>
        </div>
      </div>
      {/* mobile nav */}
      <nav className="no-scrollbar flex gap-1 overflow-x-auto px-4 pb-2 md:hidden">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${
              path.startsWith(n.href) ? "bg-white/8 text-ink" : "text-ink-dim"
            }`}
          >
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/search?q=${encodeURIComponent(q)}`);
      }}
      className={`relative ${compact ? "" : "w-full max-w-xl"}`}
      role="search"
    >
      <svg
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" strokeLinecap="round" />
      </svg>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search components, prompts, backgrounds…"
        className="input !rounded-full !py-2.5 !pl-10 !text-sm"
        aria-label="Search the library"
      />
    </form>
  );
}

export function Footer() {
  const groups: [string, string[]][] = [
    ["Library", ["Elements", "Animated", "Sections", "Templates", "Backgrounds"]],
    ["AI Prompts", ["All prompts", "Verified only", "Prompt builder", "Scoreboard"]],
    ["Lab & Learn", ["Easing Lab", "Spring Lab", "Theme Studio", "Guides & Blog"]],
    ["Company", ["Pricing", "About", "Community", "Quality bar", "License", "API docs", "Status"]],
  ];
  return (
    <footer className="mt-24 border-t border-white/6">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_repeat(4,1fr)] lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark size={22} />
            <span className="font-extrabold tracking-tight">{SITE.name}</span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-dim">{SITE.description}</p>
          <p className="mt-4 text-xs text-ink-faint">
            Original content only. Assets are MIT · guides are CC BY 4.0.
          </p>
          <div className="mt-5 rounded-2xl border border-white/6 bg-white/[.02] p-3.5">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-ink-faint">
              <LogoMark size={14} /> Press &amp; media kit
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-dim">
              Logo lockup · fact sheet · brand palette. One click, no forms.
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {(["json", "css"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => {
                    try {
                      const payload =
                        f === "json"
                          ? JSON.stringify(
                              {
                                brand: SITE.name,
                                tagline: SITE.description,
                                counts: "as of Sep 2026 — 107 components, 74 prompts, 60 guides, 33 backgrounds",
                                colors: {
                                  violet: "hsl(262 82% 60%)",
                                  cyan: "hsl(192 82% 55%)",
                                  rose: "hsl(330 82% 60%)",
                                  emerald: "hsl(152 60% 50%)",
                                  canvas: "#0b0d14",
                                },
                                typefaces: { display: "Sora", body: "Inter" },
                              },
                              null,
                              2
                            )
                          : `:root {
  /* Motif UI — press palette (original tokens) */
  --motif-violet: hsl(262 82% 60%);
  --motif-cyan: hsl(192 82% 55%);
  --motif-rose: hsl(330 82% 60%);
  --motif-emerald: hsl(152 60% 50%);
  --motif-canvas: #0b0d14;
  --motif-panel: #12151f;
  --motif-ink: #eef0f6;
}
/* Display: Sora · Body: Inter */`;
                      const url = URL.createObjectURL(
                        new Blob([payload], { type: f === "json" ? "application/json" : "text/css" })
                      );
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = f === "json" ? "motif-brand.json" : "motif-palette.css";
                      a.click();
                      setTimeout(() => URL.revokeObjectURL(url), 4000);
                    } catch {
                      /* sandboxed */
                    }
                  }}
                  className="rounded-lg border border-white/10 px-2.5 py-1.5 text-[10px] font-bold text-ink-dim transition-colors hover:border-white/25 hover:text-ink"
                >
                  {f === "json" ? "↓ brand.json" : "↓ palette.css"}
                </button>
              ))}
            </div>
          </div>
        </div>
        {groups.map(([title, links]) => (
          <div key={title}>
            <div className="text-xs font-bold uppercase tracking-widest text-ink-faint">{title}</div>
            <ul className="mt-3 space-y-2">
              {links.map((l) => {
                const href: string | null = { About: "/mission", Pricing: "/pricing", Community: "/community", "Quality bar": "/quality" }[l] ?? null;
                return (
                  <li key={l}>
                    {href ? (
                      <Link href={href} className="text-sm text-ink-dim transition-colors hover:text-ink">{l}</Link>
                    ) : (
                      <span className="cursor-pointer text-sm text-ink-dim transition-colors hover:text-ink">{l}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/5 px-5 py-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <NewsletterLine />
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-ink-faint">
        © 2026 {SITE.name}. Built for people who ship. · {SITE.twitter}
      </div>
    </footer>
  );
}
