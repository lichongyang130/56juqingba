import type { Metadata } from "next";
import Link from "next/link";
import { ROSTER } from "@/lib/community";

export const metadata: Metadata = {
  title: "Craft talk — Motif UI",
  description: "There is no Motif chat server yet. Here is the panel we would rather ship than an empty Discord: what the conversation is, and where it already happens today.",
};

export default function CraftTalkPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/community" className="hover:text-ink">Community</Link>
        <span>/</span>
        <span className="text-ink-dim">Craft talk</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Craft talk · not launched</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">We do not have a chat server</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          Every product page eventually grows a “Join our Discord” button, and most of them point at a channel where the
          last message is eight months old. {ROSTER.length} sample personas and zero real conversations is exactly the
          situation where that button would be a lie, so this page is the honest version: the conversation, the rules,
          and where it already happens without a server.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-sm font-extrabold">What would actually be discussed</p>
          <ul className="prose-list mt-3">
            <li>Where a component breaks in a real product — the bug reports that are too specific for an issues tracker and too useful to lose.</li>
            <li>Model drift: which brief stopped reproducing, on which model, on which day.</li>
            <li>Audit disagreements: “you scored this 94, my axe run says 89, here is the trace.”</li>
            <li>Bundle arguments. The 5 KB budget is a design opinion and it deserves to be argued with.</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-white/8 bg-panel p-6">
          <p className="text-sm font-extrabold">Rules we would set on day one</p>
          <ul className="prose-list mt-3">
            <li>No unpaid promotion, no “check out my thing” with no craft content.</li>
            <li>Critique the work, not the person — and lead with what the work is trying to do.</li>
            <li>Every claim of a defect comes with the environment it was seen in.</li>
            <li>Beginners welcome, unexplained jargon not. Explaining a term is not a distraction from the conversation, it is the conversation.</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-mint/25 bg-mint/[.04] p-6">
        <p className="text-sm font-extrabold text-mint">Where the conversation happens today</p>
        <p className="mt-2 text-xs leading-relaxed text-ink-dim">
          These surfaces exist right now, they are real, and none of them needs a server:
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {[
            { href: "/community/submit", h: "Submit a remix", b: "A submission is an argument: here is what I changed and why. It goes in front of the gates and a reviewer." },
            { href: "/components/combo-box", h: "Review threads", b: "Leave a note anchored to a line of a snippet on any component page. Arguments stick to the code they are about." },
            { href: "/community/challenges", h: "Monthly challenges", b: "One brief, published constraints, winner chosen by rule. The constraint list is the debate." },
            { href: "/community/requests", h: "Requests board", b: "Ask for the component or guide you are missing, with the coverage gap measured for you." },
          ].map((c) => (
            <Link key={c.href} href={c.href} className="card-hover rounded-2xl border border-white/8 bg-panel p-4">
              <p className="text-[13px] font-extrabold">{c.h}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-ink-dim">{c.b}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-sm font-extrabold">What would have to be true before we open a server</p>
        <ol className="prose-list mt-3">
          <li>Enough submissions arriving that moderators are talking to people anyway.</li>
          <li>A named person who answers there within a day, every week — a channel without a host is a dead channel.</li>
          <li>A moderation policy that survives contact with a bad week, not just a good one.</li>
          <li>Something better than a link: the audit gates, the challenge calendar and the requests board all feeding the same room.</li>
        </ol>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
          Until those four are true, this page stays up and the join button does not. If you want to argue with that
          decision, the requests board takes arguments too.
        </p>
      </div>
    </div>
  );
}
