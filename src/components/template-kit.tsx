"use client";

/* ============================================================
   Motif UI — TemplateKit. Extra course content shown only on
   whole-page template assets: build facts, rebrands, swaps,
   and export tooling. Data-driven and hand-built originals.
   ============================================================ */

import Link from "next/link";
import { useMemo, useState } from "react";
import { RailSection } from "@/components/course-rail";
import { DemoView } from "@/components/demos/Demo";
import { COMPONENTS, KIND_META } from "@/lib/data";
import type { Asset } from "@/lib/types";

const LEAD_ALTERNATIVES = ["hero-aurora", "terminal-hero", "particle-trail-hero", "wipe-reveal"];

const SECTION_CHECKLIST = [
  { id: "hero", label: "Hero / first screen", hint: "one idea, one action" },
  { id: "social", label: "Proof band", hint: "logos, stats, or testimonials" },
  { id: "feature", label: "Feature grid", hint: "3–6 capabilities, scannable" },
  { id: "pricing", label: "Pricing", hint: "only if you are ready to price" },
  { id: "faq", label: "FAQ", hint: "the five questions support gets" },
  { id: "footer", label: "Footer / close", hint: "repeat the single action" },
];

export default function TemplateKit({ asset, cssCode }: { asset: Asset; cssCode: string }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [swap, setSwap] = useState(0);
  const [checked, setChecked] = useState<string[]>(["hero", "proof", "feature", "footer"]);

  const alt = COMPONENTS.find((c) => c.slug === LEAD_ALTERNATIVES[swap % LEAD_ALTERNATIVES.length]);
  const kb = asset.bundleKb;
  const estRequests = Math.max(4, Math.round(kb / 18) + 2);
  const copyEstimate = Math.max(3, Math.round(kb / 7) + 2);

  const toggleCheck = (id: string) =>
    setChecked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const spec = useMemo(
    () =>
      JSON.stringify(
        {
          spec: "motif-build/v1",
          template: asset.slug,
          title: asset.title,
          author: asset.author,
          published: asset.published,
          stack: asset.stack,
          theme: { mode: theme, hue: 262 },
          sections: checked,
          lead: alt ? alt.slug : null,
          license: asset.license,
        },
        null,
        2
      ),
    [asset, theme, checked, alt]
  );

  const exportSpec = () => {
    try {
      const url = URL.createObjectURL(new Blob([spec], { type: "application/json" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${asset.slug}.build.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch { /* sandboxed */ }
  };

  const downloadBundle = () => {
    const html = `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8" />\n<title>${asset.title} — template bundle</title>\n<style>\n${cssCode}\n</style>\n</head>\n<body>\n  <h1>${asset.title}</h1>\n  <p>Template bundle — original Motif UI build (${asset.license}). Paste the\n  template markup into this document; the stylesheet is inlined above.</p>\n  <p>Assets in this build: ${checked.join(", ")}. Lead section: ${alt?.title ?? "as shipped"}.</p>\n</body>\n</html>`;
    try {
      const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${asset.slug}-bundle.html`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch { /* sandboxed */ }
  };

  return (
    <div className="mt-6 space-y-6">
      <RailSection id="template-provenance" title="Provenance tags" kicker="Who made it, when, audited">
        <div className="flex flex-wrap gap-2">
          <span className="chip">studio original</span>
          <span className="chip">by {asset.author}</span>
          <span className="chip">published {asset.published}</span>
          <span className="chip">{asset.license}</span>
          <span className="chip !border-mint/30 !text-mint">a11y audit {asset.a11yScore}/100</span>
          <span className="chip !border-mint/30 !text-mint">editorial audit {asset.qualityScore}/100</span>
          <span className="chip">v{asset.version}</span>
        </div>
        <p className="mt-2 text-[10px] text-ink-faint">Every template ships with its origin and its audits visible — provenance is part of the product.</p>
      </RailSection>

      <RailSection id="time-to-build" title="Time-to-build meter" kicker="Honest effort cue">
        <div className="flex items-center gap-4">
          <span className="text-3xl font-extrabold">~{copyEstimate}</span>
          <div>
            <p className="text-xs font-bold text-ink">copy-copies to assemble this build</p>
            <p className="text-[11px] text-ink-dim">(copy a section, paste your copy, move on)</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          {Array.from({ length: Math.min(copyEstimate, 14) }, (_, i) => (
            <span key={i} className="h-3 w-3 rounded-sm bg-violet-400/60" />
          ))}
          <span className="ml-2 text-[10px] text-ink-faint">one tile = one copy-paste round trip</span>
        </div>
      </RailSection>

      <RailSection id="case-study-numbers" title="Case-study numbers" kicker="The build, measured">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { k: "Page weight", v: `~${kb} KB gzip`, note: "stylesheet + template markup, before your images" },
            { k: "Requests", v: `~${estRequests}`, note: "estimates CSS + fonts + the first screen's assets" },
            { k: "Copies / mo", v: asset.copies.toLocaleString(), note: "how often this template was copied this month" },
          ].map((s) => (
            <div key={s.k} className="rounded-xl border border-white/6 bg-white/[.02] p-3.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">{s.k}</p>
              <p className="mt-1 text-lg font-extrabold text-white">{s.v}</p>
              <p className="mt-1 text-[10px] leading-relaxed text-ink-dim">{s.note}</p>
            </div>
          ))}
        </div>
      </RailSection>

      <RailSection id="rebrand-playback" title="Rebrand playbacks" kicker="Two token themes, live">
        <div className="flex flex-wrap gap-2">
          {([
            { id: "dark", label: "Midnight / violet" },
            { id: "light", label: "Bone / amber" },
          ] as const).map((t) => (
            <button key={t.id} type="button" onClick={() => setTheme(t.id)} className={`chip cursor-pointer ${theme === t.id ? "!bg-violet-400/20 !text-violet-200" : "opacity-60 hover:opacity-100"}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="mt-3 overflow-hidden rounded-2xl border border-white/10" style={{ background: theme === "dark" ? "#0b0d14" : "#f5f1e8" }}>
          <div className="relative aspect-[16/10]">
            <DemoView demo={asset.demo} props={{}} />
            <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-soft-light" style={{ background: `radial-gradient(85% 95% at 18% 8%, hsl(${theme === "dark" ? 262 : 40} 90% 62% / 1), transparent 65%)`, opacity: theme === "dark" ? 0.3 : 0.42 }} />
          </div>
        </div>
        <p className="mt-2 text-[11px] text-ink-faint">One template, two token sheets — the build survives a rebrand without structural edits.</p>
      </RailSection>

      <RailSection id="dark-light-twins" title="Dark / light template twins" kicker="Same build, both modes">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { id: "dark", bg: "#0b0d14", label: "dark twin" },
            { id: "light", bg: "#f5f1e8", label: "light twin" },
          ].map((t) => (
            <div key={t.id} className="overflow-hidden rounded-2xl border border-white/10" style={{ background: t.bg }}>
              <div className="flex items-center justify-between px-3 pt-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">{t.label}</span>
                <span className="chip !text-[9px]">{t.id === "dark" ? "prefers-dark" : "prefers-light"}</span>
              </div>
              <div className="relative aspect-[16/11]">
                <DemoView demo={asset.demo} props={{}} />
                <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: t.id === "dark" ? "transparent" : "rgba(245,241,232,.28)", mixBlendMode: "multiply" }} />
              </div>
            </div>
          ))}
        </div>
      </RailSection>

      <RailSection id="section-swap-explorer" title="Section swap explorer" kicker="Swap the lead, compare pairings">
        <p className="text-xs leading-relaxed text-ink-dim">Try a different lead section under this template&apos;s frame:</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {LEAD_ALTERNATIVES.map((slug, i) => {
            const c = COMPONENTS.find((x) => x.slug === slug);
            return c ? (
              <button key={slug} type="button" onClick={() => setSwap(i)} className={`chip cursor-pointer ${swap % LEAD_ALTERNATIVES.length === i ? "!bg-cyan-400/20 !text-cyan-200" : "opacity-60 hover:opacity-100"}`}>
                {c.title}
              </button>
            ) : null;
          })}
        </div>
        {alt && (
          <div className="mt-3 overflow-hidden rounded-2xl border border-white/10">
            <div className="relative aspect-[16/9]">
              <DemoView demo={alt.demo} props={{}} />
            </div>
            <div className="flex items-center justify-between border-t border-white/6 px-3 py-2 text-[11px]">
              <span className="font-semibold text-ink-dim">{alt.title} — {KIND_META[alt.kind].label}</span>
              <LinkTo slug={alt.slug} />
            </div>
          </div>
        )}
        <p className="mt-2 text-[10px] text-ink-faint">Swap comparisons: which lead says more about the template&apos;s audience? The best pairing is the one whose voice matches your copy.</p>
      </RailSection>

      <RailSection id="blank-canvas-pack" title="Blank-canvas pack" kicker="Start your own build">
        <p className="text-xs leading-relaxed text-ink-dim">Build a template from a checklist instead of a blank page. Tick the sections your page needs:</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {SECTION_CHECKLIST.map((s) => {
            const on = checked.includes(s.id);
            return (
              <button key={s.id} type="button" onClick={() => toggleCheck(s.id)} aria-pressed={on} className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors ${on ? "border-violet-300/40 bg-violet-400/10" : "border-white/6 bg-white/[.02] hover:border-white/15"}`}>
                <span className={`flex h-4 w-4 items-center justify-center rounded border text-[10px] ${on ? "border-violet-300 bg-violet-500 text-white" : "border-white/20"}`}>{on ? "✓" : ""}</span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold">{s.label}</span>
                  <span className="block text-[10px] text-ink-dim">{s.hint}</span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[10px] text-ink-faint">{checked.length} sections chosen — a sane first build is 3–5. The checklist rides along in the JSON export.</p>
      </RailSection>

      <RailSection id="build-spec-export" title="Copy the entire build — JSON spec" kicker="CLI-ready">
        <p className="text-xs leading-relaxed text-ink-dim">Export this template&apos;s build as a machine-readable spec — paste it into a future Motif CLI to reproduce the assembly.</p>
        <pre className="mt-3 max-h-52 overflow-auto rounded-xl border border-white/8 bg-[#07090f] p-3 font-mono text-[10.5px] leading-relaxed text-cyan-100/85">{spec}</pre>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={exportSpec} className="btn btn-primary !px-3 !py-1.5 text-xs">↓ download build.json</button>
          <button type="button" onClick={downloadBundle} className="btn btn-ghost !px-3 !py-1.5 text-xs">↓ template bundle (.html)</button>
        </div>
      </RailSection>
    </div>
  );
}

function LinkTo({ slug }: { slug: string }) {
  return (
    <Link href={`/components/${slug}`} className="font-semibold text-ink-faint hover:text-ink">open asset →</Link>
  );
}

/* ---------- TemplateKitMore: recipes, stack diff, submissions ---------- */

const RECIPES: Record<string, { part: string; note: string; pick: string[] }[]> = {
  "template-landing-saas": [
    { part: "Lead", note: "one idea, one action — the hero sets the page's voice", pick: ["hero-aurora", "wipe-reveal"] },
    { part: "Proof", note: "logos or counters right under the fold", pick: ["marquee-logos", "counter-stats"] },
    { part: "Features", note: "the capabilities grid, scannable in one pass", pick: ["bento-feature-grid", "split-feature-rows"] },
    { part: "Pricing", note: "three tiers with a real 'most chosen' cue", pick: ["glass-pricing", "pricing-table-three"] },
    { part: "FAQ", note: "the questions support actually gets", pick: ["faq-two-column", "faq-orbit"] },
    { part: "CTA", note: "repeat the single action, calmly", pick: ["halo-button", "newsletter-band-tiers"] },
  ],
  "template-waitlist": [
    { part: "Tease", note: "the countdown builds the launch moment", pick: ["countdown-drop", "scramble-text"] },
    { part: "Social", note: "faces and names beat logos for trust", pick: ["avatar-stack", "testimonial-marquee"] },
    { part: "Signup", note: "one field, one promise", pick: ["newsletter-band-tiers", "halo-button"] },
  ],
  "template-docs-site": [
    { part: "Search", note: "docs live or die on findability", pick: ["command-palette", "combo-box"] },
    { part: "Navigation", note: "the spine that never gets lost", pick: ["nav-dock", "toc-spine", "breadcrumb-trail"] },
    { part: "Code examples", note: "readable snippets with copy affordance", pick: ["resource-download-cards", "tag-input"] },
    { part: "Status", note: "version and health signals", pick: ["status-banner", "changelog-feed"] },
  ],
  "template-changelog": [
    { part: "Timeline", note: "entries as a scannable feed", pick: ["changelog-feed", "timeline-vertical"] },
    { part: "Releases", note: "dated, versioned, honest", pick: ["event-schedule-list", "pagination-ellipsis"] },
    { part: "Subscribe", note: "catch readers before they leave", pick: ["newsletter-band-tiers"] },
  ],
  "template-gallery": [
    { part: "Grid", note: "the work speaks in thumbs", pick: ["shuffle-kenburns-gallery", "polaroid-stack"] },
    { part: "Filters", note: "narrowing without overwhelm", pick: ["segmented-control", "tab-morph"] },
    { part: "Case opener", note: "one client story up top", pick: ["case-study-header", "testimonial-rotator"] },
  ],
};

const GENERIC_RECIPE = [
  { part: "Lead", note: "the hero every page needs", pick: ["hero-aurora", "terminal-hero"] },
  { part: "Proof", note: "trust, early", pick: ["marquee-logos", "stats-band"] },
  { part: "Features", note: "capabilities at a glance", pick: ["bento-feature-grid"] },
  { part: "Close", note: "one calm action to end on", pick: ["halo-button"] },
];

export function TemplateKitMore({ asset, cssCode }: { asset: Asset; cssCode: string }) {
  const recipe = RECIPES[asset.slug] ?? GENERIC_RECIPE;
  const [stackTab, setStackTab] = useState<"html" | "react">("html");
  const htmlLines = cssCode.split("\n").length;
  const reactHint = "props, events and state wrap the same structure";
  const downloadZip = () => {
    try {
      const build = {
        spec: "motif-build/v1",
        template: asset.slug,
        title: asset.title,
        author: asset.author,
        published: asset.published,
        license: asset.license,
        stack: asset.stack,
        bundleKb: asset.bundleKb,
        files: ["README.md", "build.json", "styles.css", "index.html"],
        note: "Unzip, open index.html, paste your copy — the stylesheet ships inline.",
      };
      const readme = [
        `# ${asset.title}`,
        ``,
        `An original Motif UI template build by ${asset.author} (${asset.published}), ${asset.license}.`,
        ``,
        `What is inside`,
        `- build.json - the build spec (paste into a future Motif CLI)`,
        `- styles.css - the full dependency-free stylesheet for this template`,
        `- index.html - a blank document with the stylesheet wired in`,
        ``,
        `Rebrand: change the custom properties at the top of styles.css.`,
        `Compose: the recipe cards on the live template page list the exact assets used here.`,
      ].join("\n");
      const indexHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${asset.title}</title>
<style>
${cssCode}
</style>
</head>
<body>
  <p style="padding:1rem;font:14px/1.6 system-ui,sans-serif">Blank template shell — stylesheet inlined above. Paste the page structure for the sections you kept in build.json.</p>
</body>
</html>`;
      const files = [
        { name: "README.md", data: new TextEncoder().encode(readme) },
        { name: "build.json", data: new TextEncoder().encode(JSON.stringify(build, null, 2)) },
        { name: "styles.css", data: new TextEncoder().encode(cssCode) },
        { name: "index.html", data: new TextEncoder().encode(indexHtml) },
      ];
      const url = URL.createObjectURL(makeZipBlob(files));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${asset.slug}-bundle.zip`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch { /* sandboxed */ }
  };
  return (
    <div className="mt-6 space-y-6">
      <RailSection id="recipe-cards" title="Recipe cards" kicker="How this page is assembled">
        <p className="text-xs leading-relaxed text-ink-dim">The parts that make up this build, and the library assets that play each part:</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {recipe.map((r) => (
            <div key={r.part} className="rounded-2xl border border-white/6 bg-white/[.02] p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-extrabold">{r.part}</p>
                <span className="text-[10px] text-ink-faint">{r.note}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {r.pick.map((slug) => {
                  const c = COMPONENTS.find((x) => x.slug === slug);
                  return c ? (
                    <Link key={slug} href={`/components/${slug}`} className="chip !cursor-pointer !text-[10px] hover:!border-white/30 hover:!text-ink">
                      {c.title} →
                    </Link>
                  ) : null;
                })}
              </div>
            </div>
          ))}
        </div>
      </RailSection>

      <RailSection id="stack-selector-diff" title="One-click stack selector" kicker="React vs HTML — see the diff">
        <div className="flex items-center gap-2">
          {(["html", "react"] as const).map((s) => (
            <button key={s} type="button" onClick={() => setStackTab(s)} className={`chip cursor-pointer ${stackTab === s ? "!bg-cyan-400/20 !text-cyan-200" : "opacity-60 hover:opacity-100"}`}>
              {s === "html" ? "HTML / CSS" : "React + Tailwind"}
            </button>
          ))}
        </div>
        <div className="mt-3 rounded-2xl border border-white/8 bg-[#07090f] p-4">
          {stackTab === "html" ? (
            <>
              <p className="text-xs font-bold text-ink">The static build</p>
              <p className="mt-1 font-mono text-[11px] text-cyan-100/80">{htmlLines} lines of dependency-free CSS{asset.deps.length ? ` + ${asset.deps.join(", ")}` : ""} — paste and run.</p>
              <p className="mt-2 text-[10px] text-ink-faint">Sample of the stylesheet ready in this template:</p>
              <pre className="mt-1 max-h-32 overflow-auto rounded-lg bg-black/30 p-2 font-mono text-[10px] text-ink-dim">{cssCode.slice(0, 420)}{cssCode.length > 420 ? "…" : ""}</pre>
            </>
          ) : (
            <>
              <p className="text-xs font-bold text-ink">The React build</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-dim">{reactHint}. What changes:</p>
              <ul className="prose-list mt-2 list-none space-y-1.5">
                <li className="!text-xs">Inline values become props with defaults — the defaults match the CSS exactly.</li>
                <li className="!text-xs">Hover / focus become handlers; the transitions stay in CSS.</li>
                <li className="!text-xs">The stylesheet is identical — the diff is the wrapper, not the design.</li>
              </ul>
            </>
          )}
        </div>
        <p className="mt-2 text-[10px] text-ink-faint">Diff verdict: same visuals, {stackTab === "html" ? "zero runtime — the cheapest version" : "behaviour on top — the interactive version"}.</p>
      </RailSection>

      <RailSection id="community-submissions" title="Community template submissions" kicker="Accept & moderate">
        <p className="text-xs leading-relaxed text-ink-dim">
          Templates built by the community can join this gallery. The flow is explicit: <b className="text-ink">submit a build URL + the asset list → studio audit (originality, a11y, size) → published beside the originals with credit</b>.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
          <span className="chip">queue opens after launch</span>
          <span className="chip">audit: originality · a11y · size</span>
          <span className="chip">credit + backlink to the builder</span>
        </div>
      </RailSection>
      <RailSection id="template-bundle-downloads" title="Template bundle downloads" kicker="Zip of assets + README">
        <p className="text-xs leading-relaxed text-ink-dim">
          One zip for offline use: the stylesheet, a blank index.html shell with it wired in, the JSON build spec and
          a README that tells the next person how to rebrand and where the recipe lives. No account, no build step.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="chip">README.md</span>
          <span className="chip">build.json</span>
          <span className="chip">styles.css</span>
          <span className="chip">index.html</span>
          <button type="button" onClick={downloadZip} className="btn btn-primary !px-3 !py-1.5 text-xs">↓ download {asset.slug}-bundle.zip</button>
        </div>
        <p className="mt-2 text-[10px] text-ink-faint">Packaged client-side as a classic (uncompressed) zip — open with any OS unzip tool.</p>
      </RailSection>
    </div>
  );
}

/* ---------- minimal ZIP writer (STORE, no compression) ---------- */

const CRC_TABLE: number[] = (() => {
  const t: number[] = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf: Uint8Array<ArrayBuffer>): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function concatBytes(list: Uint8Array<ArrayBuffer>[]): Uint8Array<ArrayBuffer> {
  const total = list.reduce((n, c) => n + c.length, 0);
  const out = new Uint8Array(total);
  let p = 0;
  for (const c of list) {
    out.set(c, p);
    p += c.length;
  }
  return out;
}

function makeZipBlob(files: { name: string; data: Uint8Array<ArrayBuffer> }[]): Blob {
  const enc = new TextEncoder();
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  const central: Uint8Array<ArrayBuffer>[] = [];
  const d = (() => {
    const now = new Date();
    const year = Math.max(0, now.getFullYear() - 1980);
    return (year << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
  })();
  const t = 0;
  let offset = 0;
  for (const f of files) {
    const name = enc.encode(f.name);
    const crc = crc32(f.data);
    const header = new Uint8Array(30);
    const dv = new DataView(header.buffer);
    dv.setUint32(0, 0x04034b50, true);
    dv.setUint16(4, 20, true);
    dv.setUint16(8, 0, true);
    dv.setUint16(10, t, true);
    dv.setUint16(12, d, true);
    dv.setUint32(14, crc, true);
    dv.setUint32(18, f.data.length, true);
    dv.setUint32(22, f.data.length, true);
    dv.setUint16(26, name.length, true);
    chunks.push(header, name, f.data);
    const rec = new Uint8Array(46);
    const dv2 = new DataView(rec.buffer);
    dv2.setUint32(0, 0x02014b50, true);
    dv2.setUint16(4, 20, true);
    dv2.setUint16(6, 20, true);
    dv2.setUint32(16, crc, true);
    dv2.setUint32(20, f.data.length, true);
    dv2.setUint32(24, f.data.length, true);
    dv2.setUint16(28, name.length, true);
    dv2.setUint32(42, offset, true);
    central.push(rec, name);
    offset += 30 + name.length + f.data.length;
  }
  const centralBlob = concatBytes(central);
  const eocd = new Uint8Array(22);
  const dv3 = new DataView(eocd.buffer);
  dv3.setUint32(0, 0x06054b50, true);
  dv3.setUint16(8, files.length, true);
  dv3.setUint16(10, files.length, true);
  dv3.setUint32(12, centralBlob.length, true);
  dv3.setUint32(16, offset, true);
  return new Blob([...chunks, centralBlob, eocd], { type: "application/zip" });
}
