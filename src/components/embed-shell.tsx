"use client";

// #9 — the embed shell honours the reduced-motion preference and says so.
//
// /embed/<slug> sits inside somebody else's page, so it has to behave like a
// guest: no chrome, no navigation, and no motion the reader did not ask for.
// The scenes already read `prefers-reduced-motion` themselves, and globals.css
// collapses CSS motion inside the frame exactly as on the site. This wrapper
// makes the preference the shell's own decision too, and reflects it as an
// attribute a test — or an embedding page — can read without trusting the
// scene to do the right thing.

import { useEffect, useState, type ReactNode } from "react";

export function EmbedShell({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState<"pending" | "reduce" | "no-preference">("pending");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches ? "reduce" : "no-preference");
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div data-embed-motion="honours-preference" data-prefers-reduced-motion={reduced}>
      {children}
    </div>
  );
}
