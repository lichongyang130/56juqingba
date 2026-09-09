/* ---------------------------------------------------------------------
   Theme Studio shared helpers — token shape, colour math and honest
   WCAG contrast calculations. Every number here is real arithmetic on
   the HSL values the editor produces (no simulated scores).
   --------------------------------------------------------------------- */

export interface Tokens {
  hue: number;
  sat: number;
  radius: number;
  mode: "dark" | "light";
}

export const DEFAULT_TOKENS: Tokens = { hue: 262, sat: 82, radius: 12, mode: "dark" };

export const hsl = (h: number, s: number, l: number, a = 1) => `hsl(${h} ${s}% ${l}% / ${a})`;

/** HSL → #rrggbb (for formats that want hex, e.g. the DTCG export). */
export function hslToHex(h: number, s: number, l: number) {
  const { r, g, b } = hslToRgb(h, s, l);
  const to = (v: number) => Math.max(0, Math.min(255, Math.round(v * 255))).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

/** Real Motif chrome colours (globals.css @theme), for honest reference rows. */
export const REAL_BG = "#06070b";
export const REAL_PANEL_DARK = "#0b0d14";
export const REAL_INK = "#edf0f7";
export const REAL_VIOLET = "#8b5cf6";
export const REAL_VIOLET_DEEP = "#7c3aed";
export const REAL_CYAN = "#22d3ee";
export const REAL_MINT = "#34d399";

/** Studio sample surfaces (what the mock previews actually paint on). */
export function studioSurfaces(mode: Tokens["mode"]) {
  return mode === "dark"
    ? { panel: "#12151f", ink: "#eef0f6", dim: "#98a0b3" }
    : { panel: "#ffffff", ink: "#141414", dim: "#57534e" };
}

/** HSL (degrees / % / %) → sRGB channels as 0..1 floats. */
export function hslToRgb(h: number, s: number, l: number) {
  const sn = Math.min(100, Math.max(0, s)) / 100;
  const ln = Math.min(100, Math.max(0, l)) / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0;
  let g = 0;
  let b = 0;
  if (hp < 1) [r, g, b] = [c, x, 0];
  else if (hp < 2) [r, g, b] = [x, c, 0];
  else if (hp < 3) [r, g, b] = [0, c, x];
  else if (hp < 4) [r, g, b] = [0, x, c];
  else if (hp < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = ln - c / 2;
  return { r: r + m, g: g + m, b: b + m };
}

/** WCAG relative luminance of an HSL colour. */
export function relLum(h: number, s: number, l: number) {
  const { r, g, b } = hslToRgb(h, s, l);
  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** WCAG contrast ratio between two HSL colours (≥1). */
export function contrastRatio(h1: number, s1: number, l1: number, h2: number, s2: number, l2: number) {
  const a = relLum(h1, s1, l1);
  const b = relLum(h2, s2, l2);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** #rrggbb → { h, s, l } (h/s/l rounded to whole numbers). */
export function hexToHsl(hex: string) {  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

/** Sample "derived" palette the exports and previews agree on. */
export function derivedPalette(t: Tokens) {
  return {
    accent: hsl(t.hue, t.sat, 62),
    accentStrong: hsl(t.hue, Math.min(100, t.sat + 6), 54),
    accentSoft: hsl(t.hue, t.sat, 62, 0.14),
    accentLine: hsl(t.hue, t.sat, 62, 0.45),
  };
}
