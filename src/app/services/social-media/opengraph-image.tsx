import { ImageResponse } from "next/og";

import { LOGO_BOUNDS, LOGO_PATH } from "@/lib/logo-mark";
import { loadGoogleFont } from "@/lib/og-fonts";

// TASK-service-share-card.md: the page sets its own openGraph, so it doesn't
// inherit the root card; this is its thumbnail on LinkedIn Featured and in shares.
export const alt = "Social Media Strategy & Content Planning — Blessed Moon Studio. The plan before the posts.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const STUDIO = "BLESSED MOON STUDIO";
const TITLE = "Social Media Strategy & Content Planning";
const LINE = "The plan before the posts.";

export default async function Image() {
  const [spaceGrotesk, jetbrainsMono] = await Promise.all([
    loadGoogleFont("Space Grotesk", 700, TITLE),
    loadGoogleFont("JetBrains Mono", 400, `${LINE}${STUDIO}`),
  ]);
  const cell = 26;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", gap: 72, padding: "0 96px", background: "#050505" }}>
        <svg width={LOGO_BOUNDS.width * cell} height={LOGO_BOUNDS.height * cell} viewBox={`0 0 ${LOGO_BOUNDS.width} ${LOGO_BOUNDS.height}`}>
          <path d={LOGO_PATH} fill="#ff6a1f" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 28, flex: 1 }}>
          <div style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 22, color: "#9a9a9a", letterSpacing: 4 }}>{STUDIO}</div>
          <div style={{ display: "flex", fontFamily: "Space Grotesk", fontSize: 68, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, color: "#eeeeee" }}>{TITLE}</div>
          <div style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 30, color: "#ff6a1f", letterSpacing: 1 }}>{LINE}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Space Grotesk", data: spaceGrotesk, style: "normal", weight: 700 },
        { name: "JetBrains Mono", data: jetbrainsMono, style: "normal", weight: 400 },
      ],
    },
  );
}
