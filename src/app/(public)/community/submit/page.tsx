import type { Metadata } from "next";
import Link from "next/link";
import { SubmitForm } from "@/components/community-ui";
import { MODERATION_SEED } from "@/lib/community";

export const metadata: Metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/community/submit" },
  title: "Submit a remix",
  description: "Send a remix of any Motif asset into the moderation queue. The form is a browser-local demo; the queue, the gates and the review flow it feeds are real surfaces.",
};

export default async function SubmitPage({ searchParams }: { searchParams: Promise<{ basedOn?: string }> }) {
  const { basedOn } = await searchParams;
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/community" className="hover:text-ink">Community</Link>
        <span>/</span>
        <span className="text-ink-dim">Submit a remix</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Remix submit flow</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Send it through the gates</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          Every submission runs the automated audit gate first — accessibility and quality for components, fidelity and
          style-lint for prompts — and then a human decides. The form below is a browser-local demo, but the queue it
          feeds is the same surface the team reviews in the admin console.
        </p>
      </div>

      <div className="mt-8">
        <SubmitForm initialBasedOn={basedOn ? String(basedOn) : undefined} />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { n: "01", h: "You submit", b: "Title, handle, what you based it on and what changed. Nothing else is required — a remix note beats a description." },
          { n: "02", h: "Gates run first", b: "Components face the a11y audit, the lint pass and a sandbox check; prompts face fidelity scoring and style lint. Failing the sandbox is a default reject." },
          { n: "03", h: "A human decides", b: `The queue currently holds ${MODERATION_SEED.length} sample submissions with mixed gate outcomes — including one deliberate lint failure and one safety flag — so every decision path stays visible.` },
        ].map((c) => (
          <div key={c.n} className="rounded-3xl border border-white/8 bg-panel p-5">
            <span className="font-mono text-xs font-extrabold text-ink-faint">{c.n}</span>
            <p className="mt-1 text-sm font-extrabold">{c.h}</p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-dim">{c.b}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-sm font-extrabold">What we ask of a remix</p>
        <ul className="prose-list mt-3">
          <li>Keep it original: read the original before you change it, and do not paste in code you cannot explain.</li>
          <li>Name the trade you made — smaller bundle, better keyboard behaviour, calmer motion are all valid reasons.</li>
          <li>Respect the licence of what you fork (components are MIT, guides are CC BY 4.0) and credit the original.</li>
          <li>Expect the gates: a failing lint or sandbox check is a conversation, not a verdict on you.</li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/community/onboarding" className="btn btn-ghost !py-2 text-xs">Read the full submit guide →</Link>
          <Link href="/community/attribution" className="btn btn-ghost !py-2 text-xs">Attribution policy</Link>
          <Link href="/community/outcomes" className="btn btn-ghost !py-2 text-xs">What happens to submissions</Link>
        </div>
      </div>
    </div>
  );
}
