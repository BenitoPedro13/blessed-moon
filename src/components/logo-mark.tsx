import { LOGO_BOUNDS, LOGO_PATH } from "@/lib/logo-mark";

/**
 * The viewBox is the mark's own 6x11 box, not the 12x12 raster it was traced
 * from — with the grid's six empty columns included, a square className (the
 * nav's `h-4 w-4`) drew the crescent hard against the left edge of its own box.
 * Callers can keep passing square classes: preserveAspectRatio then centres it.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${LOGO_BOUNDS.width} ${LOGO_BOUNDS.height}`}
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={LOGO_PATH} />
    </svg>
  );
}
