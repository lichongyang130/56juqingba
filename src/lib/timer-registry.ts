// #25 — a timer registry: every setInterval / setTimeout / requestAnimationFrame
// loop in the demo scene modules, with the scene it lives in, its interval, and
// whether the same function cleans it up. Extracted from source at build time,
// so a loop with no cleanup or a sub-100 ms interval is visible before a
// browser has to prove it.
//
// Importable from the .mjs harnesses: node builtins only, no path aliases.

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DEMO_DIR = path.join(ROOT, "src", "components", "demos");

export interface TimerLoop {
  scene: string;
  file: string;
  kind: "interval" | "timeout" | "raf";
  interval: number | null; // ms when a numeric literal, else null (a variable)
  intervalText: string;
  cleared: boolean;
  line: number;
}

function sceneFiles(): string[] {
  const out: string[] = [];
  try {
    for (const f of fs.readdirSync(path.join(DEMO_DIR, "scenes")).filter((f) => f.endsWith(".tsx"))) {
      out.push(path.join(DEMO_DIR, "scenes", f));
    }
    out.push(path.join(DEMO_DIR, "scenes-17.tsx"));
  } catch {
    /* the scenes live where they live; an unreadable tree yields an empty scan */
  }
  return out;
}

/** The text between a call's open paren (at `open`) and its matching close. */
function callBody(text: string, open: number): string | null {
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === "(") depth++;
    else if (text[i] === ")") {
      depth--;
      if (depth === 0) return text.slice(open + 1, i);
    }
  }
  return null;
}

/** Split a call's argument list on top-level commas. */
function topLevelArgs(body: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of body) {
    if (ch === "(" || ch === "{" || ch === "[") depth++;
    else if (ch === ")" || ch === "}" || ch === "]") depth--;
    if (ch === "," && depth === 0) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  if (cur.trim() !== "") out.push(cur);
  return out.map((a) => a.trim());
}

function numericMs(text: string): number | null {
  const t = text.replace(/;+$/, "").trim();
  if (!/^\d+(?:\.\d+)?$/.test(t)) return null;
  return Number(t);
}

function nearestFunction(fnLines: { name: string; line: number }[], line: number): string {
  let name = "unassigned";
  for (const fn of fnLines) {
    if (fn.line <= line) name = fn.name;
  }
  return name;
}

/** The per-scene loop table, plus the loops the item asks to make visible. */
export function timerRegistry() {
  const rows: TimerLoop[] = [];
  for (const file of sceneFiles()) {
    const text = fs.readFileSync(file, "utf8");
    const lines = text.split("\n");
    const fnLines = lines
      .map((l, i) => ({ l, i }))
      .filter(({ l }) => /^\s*(export\s+)?function\s+[A-Za-z0-9_]+/.test(l))
      .map(({ l, i }) => ({ name: (l.match(/function\s+([A-Za-z0-9_]+)/) || [])[1] ?? "?", line: i + 1 }));

    const kinds: { kind: TimerLoop["kind"]; re: RegExp; clear: RegExp }[] = [
      { kind: "interval", re: /setInterval\s*\(/g, clear: /clearInterval\s*\(/ },
      { kind: "timeout", re: /setTimeout\s*\(/g, clear: /clearTimeout\s*\(/ },
      { kind: "raf", re: /requestAnimationFrame\s*\(/g, clear: /cancelAnimationFrame\s*\(/ },
    ];

    for (const { kind, re, clear } of kinds) {
      for (const m of text.matchAll(re)) {
        const line = text.slice(0, m.index).split("\n").length;
        const body = callBody(text, m.index + m[0].length - 1);
        if (body === null) continue;
        const args = topLevelArgs(body);
        const scene = nearestFunction(fnLines, line);
        const intervalText = args[args.length - 1] ?? "";
        // The scene's own body: from its declaration to the next declaration.
        const fn = fnLines.find((f) => f.name === scene && f.line <= line);
        let bodyText = "";
        if (fn) {
          const next = fnLines.find((f) => f.line > fn.line);
          bodyText = lines.slice(fn.line - 1, next ? next.line - 1 : lines.length).join("\n");
        }
        rows.push({
          scene,
          file: file.slice(ROOT.length + 1),
          kind,
          interval: numericMs(intervalText),
          intervalText,
          cleared: clear.test(bodyText),
          line,
        });
      }
    }
  }
  rows.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);

  // A sub-100 ms *interval* is a tight loop; a sub-100 ms timeout is one shot
  // and is visible in the table but not flagged as a loop.
  const sub100ms = rows.filter((r) => r.kind === "interval" && r.interval !== null && r.interval < 100);
  const uncleanedIntervals = rows.filter((r) => r.kind === "interval" && !r.cleared);
  return {
    rows,
    totals: {
      loops: rows.length,
      intervals: rows.filter((r) => r.kind === "interval").length,
      timeouts: rows.filter((r) => r.kind === "timeout").length,
      rafs: rows.filter((r) => r.kind === "raf").length,
      uncleanedIntervals: uncleanedIntervals.length,
      sub100ms: sub100ms.length,
    },
    sub100ms,
    uncleanedIntervals,
  };
}
