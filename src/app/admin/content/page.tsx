import Link from "next/link";
import { COMPONENTS, PROMPTS } from "@/lib/data";
import { CmsEditor } from "@/components/admin-ui-2";

export default function AdminContent() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Content</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-dim">
            A local-first editor for the catalog: change a field, watch the catalog&apos;s own rules validate it, stage the
            draft on your device and export a patch for {COMPONENTS.length} components and {PROMPTS.length} prompts.
          </p>
        </div>
        <Link href="/admin/audit" className="btn btn-ghost !py-2 text-xs">
          Audit trail →
        </Link>
      </div>
      <CmsEditor />
    </div>
  );
}
