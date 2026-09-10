import { ChangelogComposer } from "@/components/admin-ui-3";
import { CHANGELOG } from "@/lib/data";

export default function AdminChangelog() {
  const dates = [...new Set(CHANGELOG.map((c) => c.date))];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Changelog composer</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-dim">
          Draft a shipping note and let the composer find the catalog items it names, with the matching rule printed
          underneath. It hands you the exact snippet for{" "}
          <span className="font-mono">src/lib/data.ts</span>; it does not write the file.
        </p>
      </div>
      <ChangelogComposer existingDates={dates} />
    </div>
  );
}
