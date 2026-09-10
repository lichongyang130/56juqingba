import { NotificationCentre } from "@/components/admin-ui-3";

export default function AdminNotifications() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Notifications</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-dim">
          An inbox with no server behind it, so every card is derived from data this build already holds and names its
          source. Where a real notification would need an event we cannot see, the page says that instead of inventing
          one.
        </p>
      </div>
      <NotificationCentre />
    </div>
  );
}
