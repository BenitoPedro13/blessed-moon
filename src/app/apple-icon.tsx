import { ImageResponse } from "next/og";

import { LOGO_BOUNDS, LOGO_PATH } from "@/lib/logo-mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS applies its own rounded mask on top, so the mark keeps padding rather
 * than filling the square edge to edge: 12px per raster cell is 72x132 inside
 * 180x180. */
const CELL = 12;

export default function AppleIcon() {
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
