import { AuditTrail } from "@/components/admin-ui-2";
import { ADMIN_ACTOR } from "@/lib/admin";

export default function AdminAudit() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Audit trail</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-dim">
          Every decision the console records on this device, append-only, with the actor, the action, the subject and a
          note. Actor is <span className="font-mono">{ADMIN_ACTOR}</span> — the role the console runs as.
        </p>
      </div>
      <AuditTrail />
    </div>
  );
}
