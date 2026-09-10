import { AdminSearch } from "@/components/admin-ui-2";

export default function AdminSearchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Search</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-dim">
          Find anything the console owns: catalog items, prompts, guides, backgrounds, lab tools, changelog entries and
          the moderation queue, by title, slug, tag, behaviour or gate result.
        </p>
      </div>
      <AdminSearch />
    </div>
  );
}
