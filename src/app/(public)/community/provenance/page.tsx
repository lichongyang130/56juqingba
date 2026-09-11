import type { Metadata } from "next";
import Link from "next/link";
import { COMPONENTS } from "@/lib/data";
import { snippetProvenance } from "@/lib/community";

export const metadata: Metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/community/provenance" },
  title: "Snippet provenance",
  description: "Who touched this code: per-asset provenance built from the record the catalog actually keeps — version, author, publication date and matching changelog entries, with the rule printed.",
};

export default function ProvenancePage() {
  const sample = COMPONENTS.slice(0, 6).map((a) => ({ asset: a, p: snippetProvenance(a, 1) }));
  const mentioned = COMPONENTS.filter((a) => snippetProvenance(a, 1).mentions.length > 0);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <nav className="flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/community" className="hover:text-ink">Community</Link>
        <span>/</span>
        <span className="text-ink-dim">Snippet provenance</span>
      </nav>

      <div className="mt-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Snippet provenance · the honest blame</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Who touched this line?</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          A real blame view reads a commit log and attributes each line to the last change that touched it. This catalog
          keeps one record per asset — author, version, first publication — not a per-line history, so inventing line
          attribution would be exactly the kind of confident fiction this site tries to avoid. What we can do is print the
          provenance we actually hold, and say so.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { h: "What is recorded", b: "One author, one version, one publication date per asset — plus the licence and status the catalog ships with." },
          { h: "What is not recorded", b: "Line-level edits, who changed what and when, or review history on the source. Nothing here can reconstruct that." },
          { h: "What we do instead", b: "Attribute every line to the recorded version, list changelog entries that name the asset, and print the matching rule under each panel." },
        ].map((c) => (
          <div key={c.h} className="rounded-3xl border border-white/8 bg-panel p-5">
            <p className="text-sm font-extrabold">{c.h}</p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-dim">{c.b}</p>
          </div>
        ))}
      </div>

      <section className="mt-9">
        <h2 className="border-b border-white/6 pb-3 text-xs font-bold uppercase tracking-[0.24em] text-amber-200">
          Sample records
        </h2>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
          Six of {COMPONENTS.length} assets, in the same shape as the panel on every component page — where the line range
          comes from whichever snippet tab is open.
        </p>
        <div className="mt-4 space-y-3">
          {sample.map(({ asset, p }) => (
            <div key={asset.slug} className="rounded-2xl border border-white/8 bg-panel p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-ink">{asset.title}</p>
                  <p className="font-mono text-[10px] text-ink-faint">{asset.slug} · v{asset.version} · {asset.license}</p>
                </div>
                <Link href={`/components/${asset.slug}`} className="btn btn-ghost !px-3 !py-1.5 text-xs">
                  Open the panel →
                </Link>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <div className="rounded-xl border border-white/8 bg-white/[.02] px-3 py-2">
                  <p className="text-[10px] uppercase tracking-widest text-ink-faint">author</p>
                  <p className="mt-0.5 text-[12px] font-bold text-ink">{asset.author}</p>
                </div>
                <div className="rounded-xl border border-white/8 bg-white/[.02] px-3 py-2">
                  <p className="text-[10px] uppercase tracking-widest text-ink-faint">first published</p>
                  <p className="mt-0.5 font-mono text-[12px] font-bold text-ink">{asset.published}</p>
                </div>
                <div className="rounded-xl border border-white/8 bg-white/[.02] px-3 py-2">
                  <p className="text-[10px] uppercase tracking-widest text-ink-faint">changelog mentions</p>
                  <p className="mt-0.5 font-mono text-[12px] font-bold text-ink">{p.mentions.length}</p>
                </div>
              </div>
              <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">{p.rule}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-9 rounded-3xl border border-white/8 bg-panel p-6">
        <h2 className="text-sm font-extrabold">Assets named in a changelog entry</h2>
        <p className="mt-2 text-xs leading-relaxed text-ink-dim">
          {mentioned.length} of {COMPONENTS.length} assets are named in a changelog entry. The matcher is deliberately
          literal — an asset title appearing in an entry&apos;s title or body — so it misses paraphrases and never claims a
          change that was not written down.
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {mentioned.map((a) => (
            <Link key={a.slug} href={`/components/${a.slug}`} className="chip !text-[10px] transition-colors hover:!text-ink">
              {a.title}
            </Link>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
          The other {COMPONENTS.length - mentioned.length} assets carry no mention, which is not the same as no change — it
          means no changelog entry names them. We would rather show a gap than fill it with inference.
        </p>
      </section>
    </div>
  );
}
