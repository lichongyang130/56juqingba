import { QuickStats } from "@/components/admin-ui-4";
import { EXPORTABLE_NOTE } from "@/lib/admin-ops";

export default function AdminStats() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Quick stats</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-dim">
          Per content type, per kind and per publish month. Two of those can be charted from the catalog&apos;s own
          dates; the third — a 30-day copy trend — {EXPORTABLE_NOTE}
        </p>
      </div>
      <QuickStats />
    </div>
  );
}
