import { ImageResponse } from "next/og";

import { LOGO_GRID_SIZE, LOGO_PATH } from "@/lib/logo-mark";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
        <svg
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${LOGO_GRID_SIZE} ${LOGO_GRID_SIZE}`}
        >
          <path d={LOGO_PATH} fill="#ff6a1f" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
