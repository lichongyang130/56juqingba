import LibraryExplorer from "./library-client";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/components" }, title: "Component library",
  // 520 — the hubs were listed in the sitemap and shared the layout's default
  // description, so twelve pages showed one snippet. Each now says what its own
  // page holds.
  description:
    "Elements, sections and whole templates built from original, audited parts: filter by stack, read the scores, and copy the code with no account.",
};

export default async function ComponentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const rawStack = typeof sp.stack === "string" ? sp.stack : "";
  const initialStack = rawStack.split(",").map((s) => s.trim()).filter(Boolean);
  return <LibraryExplorer initialQ={q} initialStack={initialStack} />;
}
