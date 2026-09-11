import Link from "next/link";
import { ProDemoBanner, ProSectionNav } from "@/components/pro-ui";
import { TokenForge } from "@/components/pro-ui-2";
import { API_SCOPES, TOKEN_PREFIX } from "@/lib/pro";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/pro/api" },
  title: "API token demo",
  description: "Mint a prefixed demo API key with scopes, see the request it would make, and read exactly what a real implementation still needs.",
};

export default function ProApiPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">API tokens · spec demo</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
          A key you can mint, <span className="text-gradient">that opens nothing</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          Five scopes, one label, and a deterministic string: the same inputs always produce the same{" "}
          <span className="font-mono">{TOKEN_PREFIX}</span> key, so it can be screenshotted, pasted into a demo and still be
          obviously not a credential. What a real key needs — storage, hashing at rest, quotas, revocation — is listed on the
          page rather than implied by a green checkmark.
        </p>
      </div>

      <div className="mt-8">
        <ProSectionNav current="/pro/api" />
      </div>

      <div className="mt-8">
        <ProDemoBanner scope="This page mints text; it does not issue credentials" />
      </div>

      <div className="mt-10">
        <TokenForge />
      </div>

      <div className="mt-10 rounded-3xl border border-white/8 bg-panel p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Scope reference</p>
        <ul className="mt-3 grid gap-2 md:grid-cols-2">
          {API_SCOPES.map((s) => (
            <li key={s.id} className="rounded-2xl border border-white/8 bg-white/[.02] px-3.5 py-2.5 text-[11px]">
              <span className="font-mono font-bold">{s.id}</span>
              <span className="ml-2 text-ink-dim">{s.note}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] leading-relaxed text-amber-100/80">
          Only one write scope is offered on purpose. A token that can publish content the editorial gates have not seen is a
          different kind of product, and this section is not going to imply it exists.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <Link href="/pro/trial" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          ← The trial rail
        </Link>
        <Link href="/pro/bundles" className="btn btn-ghost !px-3.5 !py-2 text-xs">
          Price it against the bundle →
        </Link>
      </div>
    </div>
  );
}
