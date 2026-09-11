// #26 — glyph coverage of the shipped woff2 subsets, decoded from the files
// themselves rather than read from a manifest someone wrote by hand.
//
// WOFF2 is a Brotli-compressed SFNT with a variable-length table directory in
// front of the compressed stream. Node's zlib can inflate the stream once the
// directory has been walked to find where it starts, and the cmap table is one
// of the "null transform" tables, so its bytes sit in the decompressed stream
// unchanged. This module only ever needs the cmap, so it does not reimplement
// the glyf/loca transforms — it reads the directory, inflates, slices out the
// cmap and parses its format-4 and format-12 subtables into a set of codepoints.
//
// Importable from the .mjs harnesses: node builtins only.

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

/** The WOFF2 "known tags" table, indexed by flags & 0x3F (matching the spec). */
const KNOWN_TAGS = [
  "cmap", "head", "hhea", "hmtx", "maxp", "name", "OS/2", "post", "cvt ", "fpgm",
  "glyf", "loca", "prep", "CFF ", "VORG", "EBDT", "EBLC", "gasp", "hdmx", "kern",
  "LTSH", "PCLT", "VDMX", "vhea", "vmtx", "BASE", "GDEF", "GPOS", "GSUB", "EBSC",
  "JSTF", "MATH", "CBDT", "CBLC", "COLR", "CPAL", "SVG ", "sbix", "acnt", "avar",
  "bdat", "bloc", "bsln", "cvar", "fdsc", "feat", "fmtx", "fvar", "gvar", "hsty",
  "just", "lcar", "mort", "morx", "opbd", "prop", "trak", "Zapf", "Silf", "Glat",
  "Gloc", "Feat", "Sill",
];

/** UIntBase128 from the WOFF2 spec: up to five 7-bit groups, high bit = more. */
function readBase128(buf, off) {
  let acc = 0;
  for (let i = 0; i < 5; i++) {
    const b = buf[off + i];
    acc = (acc << 7) | (b & 0x7f);
    if (!(b & 0x80)) return [acc, off + i + 1];
  }
  throw new Error("woff2-cmap: base128 overflow in table directory");
}

/** Walk the WOFF2 table directory, returning stream length per table in order. */
function tableDirectory(buf) {
  if (buf.length < 48 || buf.toString("ascii", 0, 4) !== "wOF2") {
    throw new Error("woff2-cmap: not a WOFF2 file");
  }
  const numTables = buf.readUInt16BE(12);
  const totalCompressed = buf.readUInt32BE(20);
  let off = 48;
  const tables = [];
  for (let i = 0; i < numTables; i++) {
    const flags = buf[off];
    off += 1;
    const index = flags & 0x3f;
    const transformVersion = flags >> 6;
    let tag;
    if (index === 0x3f) {
      tag = buf.toString("ascii", off, off + 4);
      off += 4;
    } else {
      tag = KNOWN_TAGS[index];
    }
    const [origLength, next] = readBase128(buf, off);
    off = next;
    // A null transform passes the original bytes straight through; a real one
    // writes a second length and a different on-stream size. (glyf/loca use
    // version 3 as their null transform; everything else uses 0.)
    const transformed = tag === "glyf" || tag === "loca" ? transformVersion !== 3 : transformVersion !== 0;
    let streamLength = origLength;
    if (transformed) {
      const [len, n2] = readBase128(buf, off);
      off = n2;
      streamLength = len;
    }
    tables.push({ tag, origLength, streamLength });
  }
  return { tables, offset: off, totalCompressed };
}

function parseFormat4(buf, off, out) {
  const segCountX2 = buf.readUInt16BE(off + 6);
  const segCount = segCountX2 / 2;
  const endCode = off + 14;
  const startCode = endCode + segCountX2 + 2;
  const idDelta = startCode + segCountX2;
  const idRangeOffset = idDelta + segCountX2;
  for (let i = 0; i < segCount; i++) {
    const end = buf.readUInt16BE(endCode + i * 2);
    const start = buf.readUInt16BE(startCode + i * 2);
    const delta = buf.readInt16BE(idDelta + i * 2);
    const rangeOffset = buf.readUInt16BE(idRangeOffset + i * 2);
    for (let cp = start; cp <= end; cp++) {
      if (cp === 0xffff) continue;
      let glyph;
      if (rangeOffset === 0) {
        glyph = (cp + delta) & 0xffff;
      } else {
        const gi = idRangeOffset + i * 2 + rangeOffset + (cp - start) * 2;
        glyph = buf.readUInt16BE(gi);
        if (glyph !== 0) glyph = (glyph + delta) & 0xffff;
      }
      if (glyph !== 0) out.add(cp);
    }
  }
}

function parseFormat12(buf, off, out) {
  const numGroups = buf.readUInt32BE(off + 12);
  for (let i = 0; i < numGroups; i++) {
    const g = off + 16 + i * 12;
    const start = buf.readUInt32BE(g);
    const end = buf.readUInt32BE(g + 4);
    for (let cp = start; cp <= end; cp++) out.add(cp);
  }
}

function parseCmap(buf) {
  const out = new Set();
  const numRecords = buf.readUInt16BE(2);
  for (let i = 0; i < numRecords; i++) {
    const recOff = buf.readUInt32BE(8 + i * 8);
    const format = buf.readUInt16BE(recOff);
    if (format === 4) parseFormat4(buf, recOff, out);
    else if (format === 12) parseFormat12(buf, recOff, out);
  }
  return out;
}

/** The set of codepoints a woff2 buffer's cmap actually maps to a glyph. */
export function coveredCodepoints(woff2) {
  const { tables, offset, totalCompressed } = tableDirectory(woff2);
  const stream = woff2.slice(offset, offset + totalCompressed);
  const decompressed = zlib.brotliDecompressSync(stream);
  let cursor = 0;
  let cmap = null;
  for (const t of tables) {
    if (t.tag === "cmap") cmap = { ...t, cursor };
    cursor += t.streamLength;
  }
  if (!cmap) return new Set();
  return parseCmap(decompressed.slice(cmap.cursor, cmap.cursor + cmap.origLength));
}

/** Characters the panels and copy actually use, probed against the cmap. */
export const GLYPH_PROBES = [
  { name: "em dash", char: "\u2014", cp: 0x2014 },
  { name: "arrow left", char: "\u2190", cp: 0x2190 },
  { name: "arrow up", char: "\u2191", cp: 0x2191 },
  { name: "arrow right", char: "\u2192", cp: 0x2192 },
  { name: "arrow down", char: "\u2193", cp: 0x2193 },
  { name: "middle dot", char: "\u00b7", cp: 0x00b7 },
  { name: "multiplication sign", char: "\u00d7", cp: 0x00d7 },
  { name: "degree", char: "\u00b0", cp: 0x00b0 },
  { name: "e acute", char: "\u00e9", cp: 0x00e9 },
  { name: "o acute", char: "\u00f3", cp: 0x00f3 },
  { name: "a acute", char: "\u00e1", cp: 0x00e1 },
  { name: "i acute", char: "\u00ed", cp: 0x00ed },
  { name: "u acute", char: "\u00fa", cp: 0x00fa },
  { name: "n tilde", char: "\u00f1", cp: 0x00f1 },
  { name: "pound", char: "\u00a3", cp: 0x00a3 },
];

/** Which of the probe glyphs a woff2 buffer covers, plus the full codepoint set. */
export function probeGlyphs(woff2) {
  const covered = coveredCodepoints(woff2);
  return {
    codepoints: covered.size,
    probes: GLYPH_PROBES.map((p) => ({ ...p, covered: covered.has(p.cp) })),
  };
}

/** Convenience for the measurer: probe every woff2 in a directory. */
export function probeFontFiles(mediaDir) {
  const out = [];
  let names;
  try {
    names = fs.readdirSync(mediaDir).filter((f) => f.endsWith(".woff2")).sort();
  } catch {
    return out;
  }
  for (const name of names) {
    try {
      const probe = probeGlyphs(fs.readFileSync(path.join(mediaDir, name)));
      const family = name.split("_")[0] ?? "unknown";
      out.push({ file: name, family: family.replace(/^./, (c) => c.toUpperCase()), ...probe });
    } catch {
      // A file this decoder cannot read is reported as absent, not guessed at.
      out.push({ file: name, family: "unknown", codepoints: null, probes: [], unreadable: true });
    }
  }
  return out;
}
