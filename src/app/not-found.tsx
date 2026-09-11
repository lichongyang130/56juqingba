import Link from "next/link";
import { Mascot } from "@/components/mascot";
import NotFoundCard from "@/components/not-found-card";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-bg px-5 py-16 text-ink">
      <div className="bg-grid absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-violet-600/20 blur-[130px]" aria-hidden />
      <div className="relative w-full max-w-2xl text-center">
        {/* #488 — the mascot's one job: make a dead end feel drawn on purpose. */}
        <div className="mb-2 flex justify-center">
          <Mascot pose="lost" size={88} />
        </div>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-violet-300">Error 404</p>
        <h1 className="mt-4 text-balance text-5xl font-black leading-[1.02] tracking-tight md:text-7xl">
          This page took a <span className="text-gradient">holiday</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ink-dim md:text-base">
          The URL doesn&apos;t match anything in the library — but the library is probably still here.
          Search the broken path below, or start from a known-good corner of the site.
        </p>
        <div className="mt-8">
          <NotFoundCard />
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn btn-primary px-6 py-2.5 text-sm">Back to the homepage</Link>
          <Link href="/components" className="btn btn-ghost px-6 py-2.5 text-sm">Browse components</Link>
          <Link href="/search" className="btn btn-ghost px-6 py-2.5 text-sm">Open search</Link>
        </div>
      </div>
    </main>
  );
}
