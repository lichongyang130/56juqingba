import type { Metadata } from "next";
import Link from "next/link";
import { Mascot, type MascotPose } from "@/components/mascot";

export const metadata: Metadata = {
  title: "The mascot — one dot that left the frame — Motif UI",
  description:
    "An original character for empty states and 404s: the logo's dot, escaped. Three poses, drawn in the same 6-unit geometry as the mark.",
};

const POSES: { pose: MascotPose; name: string; where: string; why: string }[] = [
  {
    pose: "lost",
    name: "Lost",
    where: "404 pages",
    why: "Tilted, ears down, one of its dots dropped behind it. A dead end should look like the site noticed.",
  },
  {
    pose: "found",
    name: "Found",
    where: "empty states with a next step",
    why: "Upright, holding the dot it was looking for, mouth curved up. Only ever used when there is an action to take.",
  },
  {
    pose: "idle",
    name: "Idle",
    where: "long-running panels, waiting states",
    why: "Eyes closed, no mouth movement, no animation loop. A character that never stops moving is a character people hate by week two.",
  },
];

export default function MascotPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Brand</span>
        <span>/</span>
        <span className="text-ink-dim">Mascot</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Brand · mascot</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">One dot, out of the frame</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          The logo is a frame holding four dots. The mascot is what happens when one of them leaves: same 6-unit geometry, same gradient, now with
          a nub, two eyes and exactly three moods. Original work — nothing borrowed from a meme library, and no emoji face bolted onto the mark.
        </p>
      </div>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {POSES.map((p) => (
          <div key={p.pose} className="rounded-3xl border border-white/8 bg-panel p-5 text-center">
            <div className="grid h-32 place-items-center rounded-2xl bg-black/25">
              <Mascot pose={p.pose} size={96} />
            </div>
            <h2 className="mt-3 text-sm font-extrabold tracking-tight">{p.name}</h2>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink-faint">{p.where}</p>
            <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">{p.why}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">It is already on the 404 page</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          A mascot that exists only on its own page is decoration. The &ldquo;lost&rdquo; pose ships in this build on the not-found route, at 88px,
          above the headline. Visit a URL that does not exist and it is what you will see — the same drawing, not a screenshot.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link href="/this-page-does-not-exist" className="btn btn-ghost px-5 py-2 text-xs">
            See a live 404
          </Link>
          <span className="text-[10px] leading-relaxed text-ink-faint">
            The link is intentional — one of the few places a broken URL is the point.
          </span>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">Rules, so it stays a character and not a sticker</h2>
        <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-ink-dim">
          <li>· It never appears on a page where something is working; it only shows up when the interface has nothing to show.</li>
          <li>· It never animates in a loop. Reduced-motion users should not have to opt out of a mascot.</li>
          <li>· It never speaks in a cute voice — the copy next to it stays in the site&apos;s normal register.</li>
          <li>· It is never redrawn ad hoc: the poses are three path sets in one component, so a new pose is a decision, not a doodle.</li>
        </ul>
        <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
          Geometry is in <span className="font-mono">src/components/mascot.tsx</span> — 64-unit viewBox, 15-unit corner radius, both eyes at y=33.
        </p>
      </section>
    </div>
  );
}
