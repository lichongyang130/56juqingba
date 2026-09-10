"use client";

// #409 — intent prefetch.
//
// Next's default is to prefetch a <Link> when it scrolls into view. That is a
// good default for a page with five links and a bad one for a grid of 107
// catalog cards, each pointing at a route that is rendered on demand: a scroll
// through the library would fire a request per card regardless of where the
// reader is going. This wrapper opts the card out of viewport prefetch and
// fetches the route on intent instead — a pointer resting on the card, or the
// card taking keyboard focus — after a short dwell so a cursor sweeping across
// the grid does not trigger anything.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ComponentProps, ReactNode } from "react";

type IntentState = "idle" | "dwell" | "sent";

export function IntentLink({
  href,
  children,
  className,
  dwellMs = 140,
  ...rest
}: {
  href: string;
  children: ReactNode;
  className?: string;
  dwellMs?: number;
} & Omit<ComponentProps<typeof Link>, "href" | "children" | "className" | "prefetch">) {
  const router = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [state, setState] = useState<IntentState>("idle");

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const arm = () => {
    if (timer.current || state === "sent") return;
    setState("dwell");
    timer.current = setTimeout(() => {
      timer.current = null;
      router.prefetch(href);
      setState("sent");
    }, dwellMs);
  };

  const disarm = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (state !== "sent") setState("idle");
  };

  return (
    <Link
      href={href}
      prefetch={false}
      onPointerEnter={arm}
      onPointerLeave={disarm}
      onFocus={arm}
      onBlur={disarm}
      data-intent-prefetch={state}
      className={className}
      {...rest}
    >
      {children}
    </Link>
  );
}
