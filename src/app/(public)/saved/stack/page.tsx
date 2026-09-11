import type { Metadata } from "next";
import Link from "next/link";
import { COMPONENTS, PROMPTS, accentCss } from "@/lib/data";

export const metadata: Metadata = {
  title: "Shared stack",
  description:
    "A saved list passed in the URL. The page renders the stack from the catalog, names anything that is missing, and stores nothing.",
  robots: { index: false },
};

// The URL is the payload: /saved/stack?items=a~halo-button,p~saas-onboarding.
// No id, no server row, nothing to leak. Anything that is not in the catalog is
// named as missing rather than quietly dropped, because a recipe that silently
// loses ingredients is worse than one that admits the gap.
const KIND_LABEL: Record<string, string> = { a: "component", p: "prompt" };

function parseItems(raw: string | undefined) {
  if (!raw) return [];
  return raw
    .split(",")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .slice(0, 40)
    .map((chunk) => {
      const [kind, ...rest] = chunk.split("~");
      return { kind: kind === "p" ? "p" : "a", slug: rest.join("~") };
    });
}

export default async function SharedStackPage({ searchParams }: { searchParams: Promise<{ items?: string }> }) {
  const { items } = await searchParams;
  const parsed = parseItems(items);

  const resolved = parsed.map((entry) => {
    const component = entry.kind === "a" ? COMPONENTS.find((c) => c.slug === entry.slug) : undefined;
    const prompt = entry.kind === "p" ? PROMPTS.find((p) => p.slug === entry.slug) : undefined;
    return {
      kind: entry.kind,
      slug: entry.slug,
      label: KIND_LABEL[entry.kind],
      title: component?.title ?? prompt?.title ?? entry.slug,
      component,
      missing: !component && !prompt,
    };
  });

  const found = resolved.filter((r) => r.component);
  const prompts = resolved.filter((r) => r.kind === "p" && !r.missing);
  const missing = resolved.filter((r) => r.missing);
  const copies = found.reduce((a, r) => a + (r.component?.copies ?? 0), 0);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <Link href="/saved" className="hover:text-ink">
          Saved list
        </Link>
        <span>/</span>
        <span className="text-ink-dim">Shared stack</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Shared stack · URL-encoded</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Someone sent you a stack</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          This page is rendered from the query string alone. Nothing was stored, nothing was looked up, and the person who sent it had no
          account here — the link carried the whole recipe.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Components in this stack", value: String(found.length) },
          { label: "Prompt entries", value: String(prompts.length) },
          { label: "Copies across the stack", value: copies.toLocaleString() },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/8 bg-panel p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">{s.label}</p>
            <p className="mt-1 font-mono text-2xl tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>

      {found.length > 0 ? (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {found.map((r) => {
            const c = r.component!;
            return (
              <li key={c.slug}>
                <Link href={`/components/${c.slug}`} className="card-hover flex h-full flex-col rounded-2xl border border-white/8 bg-panel p-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: accentCss(c.slug, 85, 62) }} />
                    <span className="text-[13px] font-bold">{c.title}</span>
                    <span className="ml-auto chip !text-[9px] uppercase">{c.kind}</span>
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">{c.description}</p>
                  <p className="mt-3 font-mono text-[10px] text-ink-faint">
                    {c.bundleKb.toFixed(1)} KB · {c.copies.toLocaleString()} copies · {c.tags.slice(0, 3).join(" / ")}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-8 rounded-2xl border border-white/8 bg-panel p-5 text-[12px] leading-relaxed text-ink-dim">
          No component slugs in this URL. A recipe link looks like{" "}
          <span className="font-mono">/saved/stack?items=a~halo-button,a~aurora-veil</span> — build one from your own saved list at{" "}
          <Link href="/saved" className="font-semibold text-violet-300 hover:text-violet-200">
            /saved
          </Link>
          .
        </p>
      )}

      {prompts.length > 0 && (
        <p className="mt-4 text-[11px] leading-relaxed text-ink-faint">
          {prompts.length} prompt entr{prompts.length === 1 ? "y is" : "ies are"} referenced but not previewed here: prompts are matched by slug
          on the prompts hub, and a shared-stack page is the wrong place to invent a card for one.
        </p>
      )}

      {missing.length > 0 && (
        <div className="mt-4 rounded-2xl border border-amber-300/30 bg-amber-400/[.06] p-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-amber-200">
            {missing.length} entr{missing.length === 1 ? "y" : "ies"} not found in the catalog
          </p>
          <p className="mt-1 font-mono text-[10px] text-amber-100/90">
            {missing.map((m) => `${m.kind}~${m.slug || "(empty)"}`).join(", ")}
          </p>
          <p className="mt-1.5 text-[10px] leading-relaxed text-ink-dim">
            Named rather than hidden: an asset may have been renamed since the link was made, and you should see that instead of a shorter
            list than the sender had.
          </p>
        </div>
      )}

      <section className="mt-10 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold tracking-tight">Why this lives in the URL</h2>
        <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
          A share feature on a static site has two options: put the stack in the URL, or pretend a backend existed and hide the failure. The
          URL version is honest, portable, and works offline once the font and page are cached. The cost is that anyone with the link can read
          the list — which is the same list they were sent, so it is not a leak.
        </p>
        <p className="mt-2 text-[11px] leading-relaxed text-ink-faint">
          The stack on this page is capped at 40 entries, and the catalog it resolves against holds {COMPONENTS.length} components. Build your
          own from the prompt on{" "}
          <Link href="/saved" className="font-semibold text-violet-300 hover:text-violet-200">
            your saved list
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
