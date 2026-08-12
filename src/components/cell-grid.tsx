/**
 * The character-cell substrate a terminal is actually made of, as a faint
 * ground behind the homepage's morph stage.
 *
 * The complaint this answers: content sitting on a drifting particle field
 * read as "without clothes." Particles are atmosphere with no structure —
 * nothing to measure position against, so text floats in an undefined void.
 * A cell grid is the opposite: it's the material, and it gives every element
 * on top of it something to sit against.
 *
 * The cell is 1:2 (`--cell-w` × `--cell-h`), not square. That's the whole
 * point — a square grid is graph paper and reads as generic dev-tool
 * wallpaper; a 1:2 cell is the shape of a monospace character, so the ground
 * reads as a terminal buffer rather than as a background pattern.
 *
 * Masked to a soft ellipse so it's densest behind the content and gone by the
 * frame edges — a flat edge-to-edge tile would read as wallpaper, which is
 * exactly the decoration this is meant to replace.
 */
export function CellGrid({ className = "" }: { className?: string }) {
  const mask =
    "radial-gradient(ellipse 115% 80% at 50% 45%, #000 30%, rgba(0,0,0,0.35) 65%, transparent 100%)";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage: `repeating-linear-gradient(to right, var(--cell-line) 0 1px, transparent 1px var(--cell-w)), repeating-linear-gradient(to bottom, var(--cell-line) 0 1px, transparent 1px var(--cell-h))`,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  );
}
