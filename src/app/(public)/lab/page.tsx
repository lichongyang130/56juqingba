import { EasingLab, GradientForge, SpringLab } from "@/components/lab-tools";
import { ToolCard } from "@/components/cards";
import { LAB_TOOLS } from "@/lib/data";

export default function LabPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">The Lab · free tools</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          Motion you can <span className="text-gradient">feel before you ship</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          Interactive playgrounds for the craft behind great interfaces. Tune a spring, sketch a
          scroll sequence, forge a gradient — then export production-ready output. All tools run in
          your browser; nothing is uploaded.
        </p>
      </div>

      {/* live tools */}
      <div className="mt-12 space-y-6">
        <EasingLab />
        <SpringLab />
        <GradientForge />
      </div>

      {/* more tools */}
      <div className="mt-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">More tools</h2>
            <p className="mt-1 text-sm text-ink-dim">Some require Pro — they&apos;re marked.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LAB_TOOLS.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </div>
    </div>
  );
}
