import SearchExplorer, { type Scope } from "./search-client";

export const metadata = { title: "Search the library — Motif UI" };

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
