import Link from "next/link";
import { ProDemoBanner, ProSectionNav } from "@/components/pro-ui";
import { SeatDemo } from "@/components/pro-ui-2";
import { TEAM_EXTRA_SEAT_PRICE, TEAM_SEATS_INCLUDED, planOf } from "@/lib/pro";

export const metadata = {
  title: "Team seats — Motif UI",
  description: "An invite demo with role descriptions and the seat arithmetic the plan card leaves unsaid.",
};

export default function ProTeamsPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Team seats · demo</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          Invite people, <span className="text-gradient">watch the arithmetic</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          The Team plan is ${planOf("team").monthly}/month and said &ldquo;everything in Pro, per member&rdquo; without ever
          naming a seat count. This page names it ({TEAM_SEATS_INCLUDED} included, ${TEAM_EXTRA_SEAT_PRICE} per seat after),
          lets you build a team, and prints the sum as you go — including the count of invites that do not look like
          addresses, instead of quietly dropping them.
        </p>
      </div>

      <div className="mt-8">
        <ProSectionNav current="/pro/teams" />
      </div>

      <div className="mt-8">
        <ProDemoBanner scope="No invite leaves this browser and no seat is provisioned" />
      </div>

      <div className="mt-10">
        <SeatDemo />
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link href="/pro" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          ← The feature ledger
        </Link>
        <Link href="/pro/enterprise" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          What enterprise buyers ask for →
        </Link>
      </div>
    </div>
  );
}
