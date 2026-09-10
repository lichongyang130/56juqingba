import { ExportReports } from "@/components/admin-ui-4";

export default function AdminExports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Export reports</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-dim">
          The asset table and a publish-month summary as CSV, built in the page from{" "}
          <span className="font-mono">src/lib/data.ts</span>. Nothing is sent anywhere, and every column is a field the
          catalog stores — the panel says which.
        </p>
      </div>
      <ExportReports />
    </div>
  );
}
