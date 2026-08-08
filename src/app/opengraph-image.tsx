import { ImageResponse } from "next/og";

import { LOGO_GRID_SIZE, LOGO_PATH } from "@/lib/logo-mark";
import { loadGoogleFont } from "@/lib/og-fonts";

export const alt = "Blessed Moon Studio — Clarity is the feature.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const HEADLINE = "BLESSED MOON STUDIO";
const TAGLINE = "Clarity is the feature.";

export default async function Image() {
  const [spaceGrotesk, jetbrainsMono] = await Promise.all([
    loadGoogleFont("Space Grotesk", 700, HEADLINE),
    loadGoogleFont("JetBrains Mono", 400, TAGLINE),
  ]);

  const gridPx = 220;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
          background: "#050505",
        }}
      >
        <svg width={gridPx} height={gridPx}>
          <path
            d={LOGO_PATH}
            fill="#ff6a1f"
            transform={`scale(${gridPx / LOGO_GRID_SIZE})`}
          />
        </svg>
        <div
          style={{
            display: "flex",
            fontFamily: "Space Grotesk",
            fontSize: 60,
            fontWeight: 700,
            color: "#eeeeee",
            letterSpacing: 6,
          }}
        >
          {HEADLINE}
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "JetBrains Mono",
            fontSize: 26,
            color: "#ff6a1f",
            letterSpacing: 2,
          }}
        >
          {TAGLINE}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Space Grotesk", data: spaceGrotesk, style: "normal", weight: 700 },
        { name: "JetBrains Mono", data: jetbrainsMono, style: "normal", weight: 400 },
      ],
    }
  );
}
