import Link from "next/link";
import TemplateHub from "@/components/template-hub";
import { COMPONENTS } from "@/lib/data";
import type { Asset } from "@/lib/types";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/templates" }, title: "Templates — Motif UI" };

export default function TemplatesPage() {
  const templates: Asset[] = COMPONENTS.filter(
    (c) => c.kind === "template" || c.slug.startsWith("template-")
  );
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">Templates · gallery</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          Whole pages, <span className="text-gradient">ready to rebrand</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          Full template builds composed from the library. Filter by mood and stack, preview any template inline,
          then open it to copy, re-theme and assemble — every template ships with its provenance, its audits and an
          honest time-to-build.
        </p>
      </div>
      <div className="mt-10">
        <TemplateHub templates={templates} />
      </div>
      <div className="mt-14 grid gap-4 rounded-3xl border border-white/8 bg-panel p-6 sm:grid-cols-3">
        <Link href="/samples" className="card-hover rounded-2xl border border-white/6 bg-white/[.02] p-4">
          <p className="text-xs font-bold">Made with Motif case studies</p>
          <p className="mt-1 text-[11px] text-ink-dim">Challenge → assets → result, for three real sample builds.</p>
        </Link>
        <Link href="/components" className="card-hover rounded-2xl border border-white/6 bg-white/[.02] p-4">
          <p className="text-xs font-bold">Browse every section</p>
          <p className="mt-1 text-[11px] text-ink-dim">Compose your own template from the full component catalog.</p>
        </Link>
        <Link href="/lab" className="card-hover rounded-2xl border border-white/6 bg-white/[.02] p-4">
          <p className="text-xs font-bold">Tune before you commit</p>
          <p className="mt-1 text-[11px] text-ink-dim">The Lab&apos;s timing, stagger and palette tools ship with every build.</p>
        </Link>
      </div>
    </div>
  );
}
