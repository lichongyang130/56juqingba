import LibraryExplorer from "./library-client";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/components" }, title: "Component library — Motif UI" };

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
