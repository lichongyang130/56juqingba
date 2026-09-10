import { EscalationLane } from "@/components/admin-ui-4";
import { MODERATION_SEED } from "@/lib/community";
import { SLA_HOURS } from "@/lib/admin-ops";

export default function AdminEscalation() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Escalation lane</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-dim">
            The {MODERATION_SEED.length} sample rows that have no decision yet, sorted by how long they have been waiting
            in this browser. The {SLA_HOURS}-hour mark is a flag on the row, not a notification — a static build cannot
            send one.
          </p>
        </div>
      </div>
      <EscalationLane />
    </div>
  );
}
