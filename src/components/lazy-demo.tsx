"use client";

// #403 — lazy scene mounting.
//
// The catalog grid used to mount every card's demo on first paint: on
// /components that means 107 live React subtrees, each with its own timers and
// CSS animations, running in rows the visitor has not reached yet. This wrapper
// holds the demo back until the card is within one screen of the viewport, then
// mounts it for good. Nothing is hidden from assistive tech or from the HTML:
// the card's title, kind, scores and stack are rendered by the card itself, and
// all that waits is the animation.
//
// The height is reserved so the grid cannot reflow when a demo appears — the
// placeholder occupies exactly the space the stage will.

import { useEffect, useRef, useState } from "react";
import { DemoView, type DemoProps } from "@/components/demos/Demo";

/** One screen of slack: mounts slightly before the card is visible, so a fast
 *  scroll does not show a placeholder where a demo should already be running. */
const ROOT_MARGIN = "320px 0px";

export function LazyDemo({
  demo,
  props = {},
  minHeight = 168,
  label = "Live demo",
}: {
  demo: string;
  props?: DemoProps;
  minHeight?: number;
  label?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;
    const el = host.current;
    if (!el) return;
    let io: IntersectionObserver | null = null;
    // The observer is created inside a frame so no state is set synchronously
    // from the effect body, and so layout is settled before it observes.
    const raf = requestAnimationFrame(() => {
      if (typeof IntersectionObserver === "undefined") {
        setMounted(true);
        return;
      }
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            setMounted(true);
            io?.disconnect();
          }
        },
        { rootMargin: ROOT_MARGIN }
      );
      io.observe(el);
    });
    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, [mounted]);

  return (
    <div
      ref={host}
      data-lazy-demo={demo}
      data-lazy-state={mounted ? "mounted" : "pending"}
      style={{ minHeight }}
      className="relative grid h-full w-full place-items-center"
    >
      {mounted ? (
        <DemoView demo={demo} props={props} />
      ) : (
        <span className="pointer-events-none flex flex-col items-center gap-1 text-center" aria-hidden>
          <span className="h-px w-10 bg-white/15" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-ink-faint/70">
            {label} mounts on scroll
          </span>
        </span>
      )}
    </div>
  );
}
