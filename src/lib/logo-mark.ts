/**
 * A literal pixel-art crescent — an outer disc minus an offset inner disc,
 * rasterized onto a 12x12 grid, then traced into a single outline path
 * (rather than one <rect> per cell) so there are no internal anti-aliasing
 * seams between adjacent squares when rendered. Plain data (no JSX) so it
 * can be shared by both client components (LogoMark) and next/og route
 * handlers (icon.tsx, apple-icon.tsx, opengraph-image.tsx), which run in a
 * separate server context and can't import "use client" modules.
 *
 * That 12x12 raster is how the mark was *made*; it is not the box the mark
 * fills, and it is deliberately not exported. Every consumer measures the
 * crescent by LOGO_BOUNDS below — scaling by 12 is what left the favicon, the
 * touch icon, the share image, and the nav all off-centre by the same six
 * empty columns (`TASK-logo-mark-centering.md`).
 */
export const LOGO_PATH =
  "M 5 0 L 6 0 L 6 2 L 4 2 L 4 3 L 3 3 L 3 8 L 4 8 L 4 9 L 6 9 L 6 11 L 5 11 L 5 10 L 2 10 L 2 9 L 1 9 L 1 6 L 0 6 L 0 5 L 1 5 L 1 2 L 2 2 L 2 1 L 5 1 Z";

/**
 * The cells `LOGO_PATH` actually covers: the crescent is 6 wide by 11 tall,
 * anchored at the origin. This is the mark's own box — use it as a viewBox, or
 * multiply it by a per-cell size to draw the mark at a known scale (keep that
 * multiplier an integer at small sizes, or the pixel edges soften).
 * Derived from the path above: keep the two in sync.
 */
export const LOGO_BOUNDS = { width: 6, height: 11 } as const;
