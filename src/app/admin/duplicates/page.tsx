import { DuplicateDetector } from "@/components/admin-ui-4";
import { duplicateReport } from "@/lib/admin-ops";

export default function AdminDuplicates() {
  const report = duplicateReport();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Duplicate detector</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-dim">
            Every queued title against the whole catalog: {report.flagged} of {report.checked} rows share enough title
            words with a published item to be worth a second look. Open a row to see the shared words.
          </p>
        </div>
      </div>
      <DuplicateDetector />
    </div>
  );
}
