import Link from "next/link";
import { ThemeControlRoom } from "@/components/admin-ui-4";
import { THEME_PRESETS, contrastChecks } from "@/lib/admin-ops";

export default function AdminTheme() {
  const worst = THEME_PRESETS.map((p) => {
    const checks = contrastChecks(p.values);
    return { id: p.id, label: p.label, worst: Math.min(...checks.map((c) => c.ratio)), fails: checks.filter((c) => !c.pass).length };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Theme control room</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-dim">
          Repaint this tab by overriding the nine tokens the site&apos;s{" "}
          <span className="font-mono">@theme</span> block defines. Every preset below is contrast-checked with the WCAG
          formula before it is offered.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {worst.map((p) => (
            <span key={p.id} className={`chip !text-[10px] ${p.fails ? "!text-amber-300" : "!text-mint"}`}>
              {p.label}: worst pair {p.worst.toFixed(2)}:1
            </span>
          ))}
        </div>
      </div>
      <ThemeControlRoom />

      <div className="rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-sm font-extrabold">Why this lives next to the public quality bar</p>
        <p className="mt-1.5 max-w-3xl text-[11px] leading-relaxed text-ink-dim">
          Contrast is a quality mechanism before it is a design choice, so the same ratio arithmetic that
          checks an asset&apos;s fingerprint on <span className="font-mono">/quality</span> runs here on the page chrome —
          the surfaces every visitor reads whether or not they open a component. Run this room&apos;s check once against
          the shipped palette and you have the accessibility audit for the frame itself.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/quality" className="btn btn-ghost !px-3 !py-1.5 text-xs">
            Public quality bar →
          </Link>
          <Link href="/admin/health" className="btn btn-ghost !px-3 !py-1.5 text-xs">
            Content health →
          </Link>
        </div>
      </div>
    </div>
  );
}
