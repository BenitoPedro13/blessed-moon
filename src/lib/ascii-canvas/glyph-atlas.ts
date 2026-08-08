const GLYPHS = [" ", ".", ":", "-", "+", "*", "#", "@"] as const;
const CELL_PX = 64;

export const GLYPH_COUNT = GLYPHS.length;

export function createGlyphAtlas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = CELL_PX * GLYPHS.length;
  canvas.height = CELL_PX;

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const monoFamily =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--font-geist-mono")
      .trim() || "monospace";

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = `700 ${Math.floor(CELL_PX * 0.72)}px ${monoFamily}, monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";

  GLYPHS.forEach((glyph, i) => {
    ctx.fillText(glyph, i * CELL_PX + CELL_PX / 2, CELL_PX / 2 + CELL_PX * 0.04);
  });

  return canvas;
}
