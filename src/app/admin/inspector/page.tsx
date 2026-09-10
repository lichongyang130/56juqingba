import { CopyInspector } from "@/components/admin-ui-3";

export default function AdminInspector() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Copy inspector</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-dim">
          See your copy rendered by the real card and detail-header components before it goes near the catalog. Long
          descriptions, thin tag lists and over-long titles fail visibly here rather than quietly in production.
        </p>
      </div>
      <CopyInspector />
    </div>
  );
}
