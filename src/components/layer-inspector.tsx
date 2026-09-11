"use client";

// #408 — the animation layer inspector.
//
// Two honest halves. The server half (src/lib/perf.ts, motionAudit) counts what
// the source asks the browser to animate. This half mounts a real demo from the
// catalog and reads the computed styles of the nodes it creates, reporting which
// ones request a compositor layer (transform, opacity, filter, backdrop-filter,
// will-change) and which ones animate something that forces paint or layout each
// frame. It also samples frame timing on the reader's own device.
//
// What it cannot do is count GPU layers: that needs the browser's own
// compositor view (DevTools' Layers panel or a trace). The page says so.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { COMPONENTS } from "@/lib/data";
import { DemoView } from "@/components/demos/Demo";

type Verdict = "compositor" | "paint" | "layout";

interface NodeFinding {
  path: string;
  verdict: Verdict;
  properties: string[];
  layerHint: string;
}

interface Report {
  nodes: number;
  depth: number;
  animated: number;
  layerHints: number;
  filters: number;
  backdrop: number;
  findings: NodeFinding[];
  byVerdict: Record<Verdict, number>;
  ms: number;
}

const LAYOUT_PROPS = ["width", "height", "top", "left", "right", "bottom", "margin", "padding", "gap", "border-width", "font-size", "inset"];
const PAINT_PROPS = ["background", "color", "box-shadow", "border-color", "filter", "outline", "text-shadow", "fill", "stroke", "clip-path"];
const COMPOSITOR_PROPS = ["transform", "opacity", "translate", "scale", "rotate"];

function classify(prop: string): Verdict {
  if (LAYOUT_PROPS.some((p) => prop.includes(p))) return "layout";
  if (PAINT_PROPS.some((p) => prop.includes(p))) return "paint";
  if (COMPOSITOR_PROPS.some((p) => prop.includes(p))) return "compositor";
  return "paint";
}

function inspect(root: HTMLElement): Report {
  const started = performance.now();
  const findings: NodeFinding[] = [];
  const byVerdict: Record<Verdict, number> = { compositor: 0, paint: 0, layout: 0 };
  let nodes = 0;
  let depth = 0;
  let animated = 0;
  let layerHints = 0;
  let filters = 0;
  let backdrop = 0;

  const walk = (el: Element, level: number) => {
    if (nodes > 2000) return; // a runaway scene should not freeze the tab
    nodes++;
    depth = Math.max(depth, level);
    const style = getComputedStyle(el);
    const animatedHere = style.animationName !== "none";
    if (animatedHere) animated++;
    if (style.willChange !== "auto") layerHints++;
    if (style.filter !== "none") filters++;
    if (style.backdropFilter && style.backdropFilter !== "none") backdrop++;

    const props = animatedHere
      ? ["animation:" + style.animationName]
      : style.transitionProperty === "all"
        ? ["all"]
        : style.transitionProperty.split(",").map((p) => p.trim()).filter((p) => p && p !== "none");

    const interesting =
      animatedHere || props.length > 0 || style.transform !== "none" || style.filter !== "none" || style.backdropFilter !== "none";
    if (interesting) {
      // An explicit hint outranks a derived verdict: it says the author asked
      // the browser to keep this on its own layer.
      const verdict: Verdict =
        style.willChange !== "auto"
          ? "compositor"
          : props.length === 0
            ? "compositor"
            : (props.map(classify).sort((a, b) => (a === "layout" ? -1 : b === "layout" ? 1 : a === "paint" ? -1 : 1))[0] as Verdict);
      byVerdict[verdict]++;
      const cls = typeof el.className === "string" ? el.className.split(" ").slice(0, 3).join(".") : "";
      findings.push({
        path: `${el.tagName.toLowerCase()}${cls ? "." + cls : ""}`,
        verdict,
        properties: [
          ...props,
          ...(style.transform !== "none" ? ["transform"] : []),
          ...(style.filter !== "none" ? ["filter"] : []),
          ...(style.backdropFilter !== "none" ? ["backdrop-filter"] : []),
          ...(style.willChange !== "auto" ? [`will-change: ${style.willChange}`] : []),
        ].slice(0, 6),
        layerHint: style.willChange !== "auto" ? style.willChange : "",
      });
    }
    for (const child of el.children) walk(child, level + 1);
  };

  walk(root, 1);
  return {
    nodes,
    depth,
    animated,
    layerHints,
    filters,
    backdrop,
    findings: findings.sort((a, b) => (a.verdict === "layout" ? -1 : b.verdict === "layout" ? 1 : 0)).slice(0, 14),
    byVerdict,
    ms: Math.round((performance.now() - started) * 10) / 10,
  };
}

export function LayerInspector({ heaviest }: { heaviest: { slug: string; title: string; lines: number }[] }) {
  const [slug, setSlug] = useState(COMPONENTS[0]?.slug ?? "");
  const [report, setReport] = useState<Report | null>(null);
  const [frame, setFrame] = useState<{ fps: number; worst: number; samples: number } | null>(null);
  const [sampling, setSampling] = useState(false);
  const stage = useRef<HTMLDivElement>(null);

  const asset = useMemo(() => COMPONENTS.find((c) => c.slug === slug) ?? COMPONENTS[0], [slug]);

  const run = useCallback(() => {
    if (!stage.current) return;
    setReport(inspect(stage.current));
  }, []);

  // Picking a scene clears the previous reading and re-inspects twice: once when
  // the scene mounts and once after the entrance animations have started.
  const pick = (next: string) => {
    setSlug(next);
    setReport(null);
    setFrame(null);
  };

  useEffect(() => {
    const first = setTimeout(run, 120);
    const second = setTimeout(run, 900);
    return () => {
      clearTimeout(first);
      clearTimeout(second);
    };
  }, [slug, run]);

  const sample = () => {
    setSampling(true);
    const times: number[] = [];
    let last = performance.now();
    const tick = (now: number) => {
      times.push(now - last);
      last = now;
      if (times.length < 90) requestAnimationFrame(tick);
      else {
        const sorted = [...times].sort((a, b) => a - b);
        const mean = times.reduce((a, b) => a + b, 0) / times.length;
        setFrame({ fps: Math.round(1000 / mean), worst: Math.round(sorted[sorted.length - 1]), samples: times.length });
        setSampling(false);
      }
    };
    requestAnimationFrame(tick);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3 rounded-3xl border border-white/8 bg-panel p-5">
        <label className="min-w-[16rem] flex-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">Demo under inspection</span>
          <select
            value={slug}
            onChange={(e) => pick(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-ink"
          >
            {COMPONENTS.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title} · {c.kind}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-wrap gap-2">
          {heaviest.slice(0, 4).map((h) => (
            <button key={h.slug} type="button" onClick={() => pick(h.slug)} className="chip !text-[10px]">
              {h.title}
            </button>
          ))}
          <button type="button" onClick={run} className="btn btn-ghost !px-3.5 !py-2 text-xs">
            Re-inspect
          </button>
          <button type="button" onClick={sample} disabled={sampling} className="btn btn-primary !px-3.5 !py-2 text-xs">
            {sampling ? "Sampling…" : "Sample frame timing"}
          </button>
        </div>
      </div>

      <div
        ref={stage}
        data-layer-stage={asset.slug}
        className="relative overflow-hidden rounded-3xl border border-white/8 bg-[#07090f] p-6"
      >
        <div className="flex min-h-[220px] items-center justify-center">
          <DemoView demo={asset.demo} props={{}} />
        </div>
      </div>

      {report && (
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl border border-white/8 bg-panel p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">
              What {asset.title} asks the browser for
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] sm:grid-cols-4">
              <Readout label="Nodes" value={report.nodes} />
              <Readout label="Animating" value={report.animated} tone="cyan" />
              <Readout label="Layer hints" value={report.layerHints} tone="emerald" />
              <Readout label="Blur or filter" value={report.filters + report.backdrop} tone="amber" />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
              <Readout label="Compositor-safe" value={report.byVerdict.compositor} tone="emerald" />
              <Readout label="Paints per frame" value={report.byVerdict.paint} tone="amber" />
              <Readout label="Layout per frame" value={report.byVerdict.layout} tone="rose" />
            </div>
            <ul className="mt-4 space-y-1.5">
              {report.findings.map((f) => (
                <li key={f.path + f.properties.join()} className="flex items-start gap-2 rounded-xl border border-white/8 bg-white/[.02] px-3 py-2">
                  <span
                    className={`mt-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                      f.verdict === "compositor"
                        ? "bg-emerald-400/15 text-emerald-200"
                        : f.verdict === "paint"
                          ? "bg-amber-400/15 text-amber-200"
                          : "bg-rose-400/15 text-rose-200"
                    }`}
                  >
                    {f.verdict}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-mono text-[10px] text-ink-dim">{f.path}</span>
                    <span className="mt-0.5 block text-[10px] leading-relaxed text-ink-faint">{f.properties.join(" · ")}</span>
                  </span>
                </li>
              ))}
              {report.findings.length === 0 && (
                <li className="rounded-xl border border-dashed border-white/10 px-3 py-2 text-[11px] text-ink-faint">
                  This demo reads as static at the moment of inspection — it may animate only on interaction.
                </li>
              )}
            </ul>
            <p className="mt-3 text-[10px] leading-relaxed text-ink-faint">
              Read from computed styles in {report.ms} ms; scene depth {report.depth} levels. &ldquo;Layer hints&rdquo; counts{" "}
              <span className="font-mono">will-change</span>, which is a request rather than a guarantee.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-white/8 bg-panel p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-ink-faint">Frame timing on your device</p>
              {frame ? (
                <>
                  <p className="mt-2 text-3xl font-extrabold tabular-nums">
                    {frame.fps} <span className="text-sm font-bold text-ink-dim">fps mean</span>
                  </p>
                  <p className="mt-1 text-[11px] text-ink-dim">
                    longest frame {frame.worst} ms over {frame.samples} frames. Your machine, your browser, your power state —
                    this is a measurement of the device in front of you, not a claim about anyone else&apos;s.
                  </p>
                </>
              ) : (
                <p className="mt-2 text-[11px] leading-relaxed text-ink-dim">
                  Nothing sampled yet. The button above measures 90 consecutive frames of the running scene and reports the mean
                  and the worst. A demo that keeps 60 fps here animates off the main thread; one that stutters is doing work the
                  compositor cannot take over.
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-dashed border-amber-300/25 bg-amber-300/[.04] p-5">
              <p className="text-sm font-extrabold text-amber-200">What this inspector cannot see</p>
              <ul className="mt-2 space-y-2 text-[11px] leading-relaxed text-amber-100/80">
                <li>
                  The real layer count. A browser decides that in its compositor, and the only honest ways to read it are the
                  DevTools Layers panel or a performance trace — neither of which a page can open for you.
                </li>
                <li>
                  Keyframe contents. When an element runs an <span className="font-mono">animation</span>, the computed style
                  gives the name and nothing else, so the properties it animates are classified as unknown rather than guessed.
                </li>
                <li>
                  Anything off-screen or unmounted. Scenes that animate on scroll report as static until they are on screen.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Readout({ label, value, tone = "plain" }: { label: string; value: number; tone?: "plain" | "cyan" | "emerald" | "amber" | "rose" }) {
  const color =
    tone === "cyan"
      ? "text-cyan-200"
      : tone === "emerald"
        ? "text-emerald-200"
        : tone === "amber"
          ? "text-amber-200"
          : tone === "rose"
            ? "text-rose-200"
            : "text-ink";
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[.02] px-3 py-2">
      <span className="block text-[10px] text-ink-faint">{label}</span>
      <span className={`text-sm font-extrabold tabular-nums ${color}`}>{value}</span>
    </div>
  );
}
