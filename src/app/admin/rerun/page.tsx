import { PromptRerunConsole } from "@/components/admin-ui-3";

export default function AdminRerun() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Prompt re-run</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-dim">
          The three-model test cycle, as a labelled simulation: a deterministic pseudo-log compared against the prompt&apos;s
          real published scores. No model is called and no run is written to the log.
        </p>
      </div>
      <PromptRerunConsole />
    </div>
  );
}
