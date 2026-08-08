import { ImageResponse } from "next/og";

import { LOGO_GRID_SIZE, LOGO_PATH } from "@/lib/logo-mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  // iOS applies its own rounded mask on top, so the mark is scaled down
  // with padding rather than filling the full square edge-to-edge.
  const gridPx = size.width * 0.62;
  const offset = (size.width - gridPx) / 2;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#050505",
        }}
      >
        <svg width={size.width} height={size.height}>
          <path
            d={LOGO_PATH}
            fill="#ff6a1f"
            transform={`translate(${offset} ${offset}) scale(${gridPx / LOGO_GRID_SIZE})`}
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
