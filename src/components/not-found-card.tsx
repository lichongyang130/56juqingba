"use client";

// NotFoundCard — captures the broken pathname and pre-fills search with it,
// so a typo becomes a query instead of a dead end.

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function NotFoundCard() {
  const path = usePathname();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const raw = path.split("/").filter(Boolean).pop() ?? "";
      setQuery(raw.replace(/[-_]/g, " "));
    });
    return () => cancelAnimationFrame(id);
  }, [path]);

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-3 rounded-3xl border border-white/10 bg-panel/80 p-5 text-left backdrop-blur">
      <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Search the broken path</p>
      <div className="flex items-center gap-2">
        <span className="min-w-0 flex-1 truncate rounded-xl border border-white/8 bg-black/25 px-3.5 py-2.5 font-mono text-xs text-ink-dim">
          {path || "/"}
        </span>
      </div>
      <Link
        href={`/search?q=${encodeURIComponent(query)}`}
        className="btn btn-primary w-full !py-2.5 text-sm"
      >
        {query ? `Search for “${query}”` : "Search the library"}
      </Link>
      <p className="text-[11px] text-ink-faint">
        Tip: this button pre-fills search with the path you typed — closest assets will surface first.
      </p>
    </div>
  );
}
