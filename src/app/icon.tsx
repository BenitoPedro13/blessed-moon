import { ImageResponse } from "next/og";

import { LOGO_BOUNDS, LOGO_PATH } from "@/lib/logo-mark";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Whole pixels per raster cell — 12x22 of the 32px square. Fitting the mark to
 * the full height instead would put cells on 2.5px boundaries, and a favicon is
 * the last place to soften pixel art. */
const CELL = 2;

export default function Icon() {
  const width = LOGO_BOUNDS.width * CELL;
  const height = LOGO_BOUNDS.height * CELL;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
        }}
      >
        <svg width={width} height={height} viewBox={`0 0 ${LOGO_BOUNDS.width} ${LOGO_BOUNDS.height}`}>
          <path d={LOGO_PATH} fill="#ff6a1f" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
