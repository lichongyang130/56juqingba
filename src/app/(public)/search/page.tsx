import SearchExplorer, { type Scope } from "./search-client";

export const metadata = {
  // canonical per page — the layout no longer sets one, so a page that
  // forgot its own would emit nothing rather than point at the homepage.
  alternates: { canonical: "/search" }, title: "Search the library — Motif UI" };

const SCOPES: Scope[] = ["all", "components", "prompts", "backgrounds", "guides"];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const get = (k: string): string => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  const type: Scope = SCOPES.includes(get("type") as Scope) ? (get("type") as Scope) : "all";
  const stack = get("stack") || "All";
  const sort = ["newest", "lightest", "fresh30"].includes(get("sort")) ? get("sort") : "best";
  return <SearchExplorer initial={{ q: get("q"), type, sort, stack }} />;
}
