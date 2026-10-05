// ASCII rendering for social art (TASK-social-art-signatures.md §2.1). Pure and
// synchronous so the on-page preview and every export stay one SVG function:
// no canvas, no DOM. Screenshot grids are made elsewhere (build script for the
// approved portfolio images, the builder's canvas for uploads) and only read here.

/** Sparse to dense. Index 0 is empty space. */
export const ASCII_RAMP = " .:-=+*#%@";
/** Glyphs at or above this ramp index take the accent colour. */
export const ASCII_HOT = 7;
/** Rows of a stored grid hold only ramp characters. */
export const ASCII_PATTERN = /^[ .:\-=+*#%@\n]*$/;
export const MAX_ASCII_LENGTH = 24_000;
/** Grid size for screenshots, shared by the build script and the builder's uploads. */
export const SCREENSHOT_COLS = 112, SCREENSHOT_MAX_ROWS = 72;
/** A monospace cell is ~0.6em wide and is set at this line height (em). */
export const ASCII_LINE = 1.12;
export const ASCII_CELL = ASCII_LINE / 0.6;

export const glyphFor = (value: number) => ASCII_RAMP[Math.max(0, Math.min(ASCII_RAMP.length - 1, Math.round(value * (ASCII_RAMP.length - 1))))];

/**
 * Luminance (0–1, row-major) to a glyph grid. Light pages are inverted so the
 * page background reads as empty space and the content as glyphs, and the
 * range is stretched between percentiles so a low-contrast screenshot still
 * fills the ramp. A Sobel edge term keeps type and borders legible, the way the
 * site's moon engine favours contours.
 */
export function asciiFromLuminance(luma: ArrayLike<number>, width: number, height: number, cols: number, maxRows: number): string {
  const rows = Math.max(1, Math.min(maxRows, Math.round((cols * height) / width / ASCII_CELL)));
  const cellW = width / cols, cellH = cellW * ASCII_CELL;
  let mean = 0;
  for (let i = 0; i < luma.length; i++) mean += luma[i];
  const invert = mean / luma.length > 0.5;
  const at = (x: number, y: number) => { const v = luma[Math.min(height - 1, Math.max(0, y)) * width + Math.min(width - 1, Math.max(0, x))]; return invert ? 1 - v : v; };
  const values: number[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const x0 = Math.floor(c * cellW), y0 = Math.floor(r * cellH);
    const x1 = Math.max(x0 + 1, Math.floor((c + 1) * cellW)), y1 = Math.max(y0 + 1, Math.floor((r + 1) * cellH));
    let sum = 0, edge = 0, n = 0;
    for (let y = y0; y < y1; y += 2) for (let x = x0; x < x1; x += 2) {
      sum += at(x, y);
      edge += Math.abs(at(x + 1, y) - at(x - 1, y)) + Math.abs(at(x, y + 1) - at(x, y - 1));
      n++;
    }
    values.push(n ? 0.7 * (sum / n) + 0.9 * Math.min(1, edge / n) : 0);
  }
  const sorted = [...values].sort((a, b) => a - b);
  const lo = sorted[Math.floor(sorted.length * 0.4)], hi = sorted[Math.floor(sorted.length * 0.985)] || 1;
  const span = Math.max(0.05, hi - lo);
  const lines: string[] = [];
  for (let r = 0; r < rows; r++) {
    let line = "";
    for (let c = 0; c < cols; c++) line += glyphFor(Math.max(0, Math.min(1, (values[r * cols + c] - lo) / span)) ** 0.85);
    lines.push(line.replace(/\s+$/, ""));
  }
  return lines.join("\n");
}

// Deterministic hash so the moon is identical in every preview and export.
const hash = (n: number) => { const s = Math.sin(n * 127.1) * 43758.5453; return s - Math.floor(s); };
const CRATERS = Array.from({ length: 14 }, (_, i) => ({ x: hash(i + 1) * 1.6 - 0.8, y: hash(i + 31) * 1.6 - 0.8, r: 0.06 + hash(i + 61) * 0.16, depth: 0.25 + hash(i + 91) * 0.35 }));

/** A lit sphere with craters, as a glyph grid `cols` wide. The light comes
 * from the upper left, so the right limb falls into shadow: a moon, not a ball. */
export function asciiMoon(cols: number): string {
  const rows = Math.round(cols / ASCII_CELL);
  const light = (() => { const v = [-0.62, -0.42, 0.66]; const l = Math.hypot(...v); return v.map((x) => x / l); })();
  const lines: string[] = [];
  for (let r = 0; r < rows; r++) {
    let line = "";
    for (let c = 0; c < cols; c++) {
      const x = ((c + 0.5) / cols) * 2 - 1, y = ((r + 0.5) / rows) * 2 - 1;
      const d = x * x + y * y;
      if (d > 1) { line += " "; continue; }
      const z = Math.sqrt(1 - d);
      let shade = Math.max(0, x * light[0] + y * light[1] + z * light[2]);
      for (const crater of CRATERS) {
        const k = Math.hypot(x - crater.x, y - crater.y) / crater.r;
        if (k < 1) shade *= 1 - crater.depth * (1 - k * k);
        else if (k < 1.18) shade = Math.min(1, shade * 1.12);
      }
      line += glyphFor(shade ** 0.9);
    }
    lines.push(line.replace(/\s+$/, ""));
  }
  return lines.join("\n");
}
