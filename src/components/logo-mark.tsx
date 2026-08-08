import { LOGO_GRID_SIZE, LOGO_PATH } from "@/lib/logo-mark";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${LOGO_GRID_SIZE} ${LOGO_GRID_SIZE}`}
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={LOGO_PATH} />
    </svg>
  );
}
