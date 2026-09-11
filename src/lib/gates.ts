import fs from "node:fs";
import path from "node:path";

/**
 * #35 — the check index behind /quality/gates.
 *
 * The page answers "what does this project actually check, and what does each
 * check stand for" without a human retyping the list, because a typed list is a
 * second copy of the harness and the two drift. Everything here is read from the
 * sources at render time:
 *
 *   - the names and the assertions come from `ok(…)` calls in the two scripts;
 *   - the commit that last wrote each call comes from a `git blame` index that
 *     `npm run gates:index` regenerates (machine-derived, checked in, and gated
 *     for freshness by check:exports). It is keyed by check name, so inserting a
 *     check above another one does not rewrite the file;
 *   - the accessibility rules come from `MARKUP_CHECKS` and the manual checks
 *     from `MANUAL_CHECKS`, which the a11y suites already read;
 *   - the pass counts come from `docs/check-report.json`, the last recorded run.
 *
 * The harness prints 188 checks from 143 calls: the difference is loops, so the
 * page states both numbers rather than pretending one is the other.
 */

export type GateCall = {
  suite: string;
  file: string;
  line: number;
  /** The name as the harness prints it; `${…}` slots become `…`. */
  name: string;
  /** True when the printed name is composed at run time (a loop or a template). */
  dynamic: boolean;
  /** The condition the check asserts — the failure it prevents, in code. */
  assertion: string;
};

export const HARNESSES: { file: string; suite: string; what: string }[] = [
  { file: "scripts/check-exports.mjs", suite: "check:exports", what: "pages, endpoints and data against the copy that documents them" },
  { file: "scripts/check-demos.mjs", suite: "check:demos", what: "the demo registry, the catalog and the suggestion register" },
];

/** Read a file from the repository root, or null when it is not there. */
function read(rel: string): string | null {
  try {
    return fs.readFileSync(path.join(process.cwd(), rel), "utf8");
  } catch {
    return null;
  }
}

/**
 * The index of `ok(…)` calls, as text.
 *
 * A regex over `ok(` and then a bracket walk, rather than a parser: the two
 * scripts are plain data-carrying modules, and the only structure that matters is
 * where the call ends and where its arguments part. Strings are skipped so a
 * `)` inside a message cannot end a call early.
 */
export function parseGateCalls(file: string, suite: string, source: string): GateCall[] {
  const out: GateCall[] = [];
  const seen = new Set<string>();
  const re = /\bok\(/g;
  let m: RegExpExecArray | null;

  while ((m = re.exec(source))) {
    const args = splitArgs(source, m.index + m[0].length - 1);
    if (!args.length) continue;
    const rawName = args[0].trim();
    const parsed = literalName(rawName);
    if (!parsed) continue;
    const line = source.slice(0, m.index).split("\n").length;
    const key = `${parsed.name}|${parsed.dynamic}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      suite,
      file,
      line,
      name: parsed.name,
      dynamic: parsed.dynamic,
      assertion: (args[1] ?? "").replace(/\s+/g, " ").trim(),
    });
  }
  return out.sort((a, b) => a.line - b.line);
}

/** Split a call's arguments on commas that are not inside a string or a bracket. */
function splitArgs(source: string, openParen: number): string[] {
  const args: string[] = [];
  let depth = 0;
  let start = openParen + 1;
  let i = start;
  while (i < source.length) {
    const ch = source[i];
    if (ch === '"' || ch === "'" || ch === "`") {
      i = skipString(source, i);
      continue;
    }
    if (ch === "(" || ch === "[" || ch === "{") depth++;
    else if (ch === ")" || ch === "]" || ch === "}") {
      if (depth === 0 && ch === ")") {
        args.push(source.slice(start, i));
        return args;
      }
      depth--;
    } else if (ch === "," && depth === 0) {
      args.push(source.slice(start, i));
      start = i + 1;
    }
    i++;
  }
  return args;
}

/** Index of the character after the string that starts at `from`. */
function skipString(source: string, from: number): number {
  const quote = source[from];
  let i = from + 1;
  while (i < source.length) {
    if (source[i] === "\\") {
      i += 2;
      continue;
    }
    if (source[i] === quote) return i + 1;
    i++;
  }
  return i;
}

/**
 * The first argument as a printable name.
 *
 * A quoted string is its own name. A template literal keeps its words and every
 * `${…}` becomes `…`, flagged as dynamic — the harness then prints a different
 * name per iteration, and the page says so instead of inventing one.
 */
function literalName(raw: string): { name: string; dynamic: boolean } | null {
  if (raw.startsWith('"') || raw.startsWith("'")) {
    const text = raw.slice(1, skipString(raw, 0) - 1);
    return text ? { name: text, dynamic: false } : null;
  }
  if (raw.startsWith("`")) {
    const body = raw.slice(1);
    const dynamic = body.includes("${");
    let depth = 0;
    let visible = "";
    for (let i = 0; i < body.length; i++) {
      if (body[i] === "\\") {
        i++;
        continue;
      }
      if (body.startsWith("${", i)) {
        depth = 1;
        i++;
        continue;
      }
      if (depth > 0) {
        if (body[i] === "{") depth++;
        else if (body[i] === "}") {
          depth--;
          if (depth === 0) visible += "…";
        }
        continue;
      }
      if (body[i] === "`") break;
      visible += body[i];
    }
    const name = visible.replace(/\s+/g, " ").trim();
    return name ? { name, dynamic } : null;
  }
  return null;
}

/** One check as the page prints it: the call, plus who last wrote the line. */
export type GateEntry = GateCall & {
  /** Short hash of the commit that last wrote the scan line, when blame data exists. */
  commit: string | null;
  subject: string | null;
  date: string | null;
};

type BlameIndex = {
  generatedFrom?: string;
  /** Keyed `suite|name`, not by line: adding a check above another one must not
   *  rewrite the index, only a check whose own line was rewritten. */
  checks?: Record<string, { c: string; s: string; d: string }>;
};

/**
 * The blame index, read from the file `npm run gates:index` writes.
 *
 * Missing file → every entry simply carries no commit, which the page shows as
 * an absence rather than as a guess. That is also what a checkout without git
 * looks like, so the page still renders.
 */
export function loadBlameIndex(): BlameIndex {
  const raw = read("src/lib/gates-added.json");
  if (!raw) return {};
  try {
    return JSON.parse(raw) as BlameIndex;
  } catch {
    return {};
  }
}

/** Every check in both harnesses, with the commit that last wrote each call. */
export function gateEntries(): GateEntry[] {
  const blame = loadBlameIndex();
  const entries: GateEntry[] = [];
  for (const h of HARNESSES) {
    const source = read(h.file);
    if (!source) continue;
    for (const call of parseGateCalls(h.file, h.suite, source)) {
      const hit = blame.checks?.[`${h.suite}|${call.name}`];
      entries.push({
        ...call,
        commit: hit?.c ?? null,
        subject: hit?.s ?? null,
        date: hit?.d ?? null,
      });
    }
  }
  return entries;
}

/** The last recorded run, so the page can print what came out of it. */
export function lastRun(): {
  measuredAt: string | null;
  suites: Record<string, { ms: number; summary: string; ok: boolean }>;
} {
  const raw = read("docs/check-report.json");
  if (!raw) return { measuredAt: null, suites: {} };
  try {
    const parsed = JSON.parse(raw) as {
      measuredAt?: string;
      suites?: Record<string, { ms: number; summary: string; ok: boolean }>;
    };
    return { measuredAt: parsed.measuredAt ?? null, suites: parsed.suites ?? {} };
  } catch {
    return { measuredAt: null, suites: {} };
  }
}

/** How many checks each suite printed, and how many calls produced them. */
export function gateCounts(entries: GateEntry[]): { suite: string; calls: number; dynamic: number; printed: string | null; ms: number | null }[] {
  const { suites } = lastRun();
  return HARNESSES.map((h) => {
    const mine = entries.filter((e) => e.suite === h.suite);
    const summary = suites[h.suite]?.summary ?? null;
    const printed = summary?.match(/(\d+) passed/)?.[1] ?? null;
    return {
      suite: h.suite,
      calls: mine.length,
      dynamic: mine.filter((e) => e.dynamic).length,
      printed,
      ms: suites[h.suite]?.ms ?? null,
    };
  });
}
