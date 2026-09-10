import type { NextConfig } from "next";
import { CACHE_RULES } from "./src/lib/cache-rules";

// #405 — cache headers. Immutable for fingerprinted assets (Next hashes them,
// so a changed file is a changed URL), and a short shared-cache window for
// HTML: long enough to absorb a traffic spike, short enough that a correction
// ships the same day. Everything here is verifiable with curl against the
// running build; the page that explains it also prints the invalidation plan
// for the day the catalog comes from a CMS instead of a file.
const nextConfig: NextConfig = {
  async headers() {
    // The rule list lives in src/lib/cache-rules.ts so that the page explaining
    // it and the build enforcing it cannot disagree.
    return CACHE_RULES.map((rule) => ({
      source: rule.source,
      headers: [{ key: "Cache-Control", value: rule.value }],
    }));
  },
};

export default nextConfig;
