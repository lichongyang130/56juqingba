import { Scheduler } from "@/components/admin-ui-2";

export default function AdminSchedule() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Scheduling</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-dim">
          Queue a catalog change for a future date, with the reason attached. Publishing itself is not wired — the page
          says exactly what that would take rather than implying a cron job exists.
        </p>
      </div>
      <Scheduler />
    </div>
  );
}
