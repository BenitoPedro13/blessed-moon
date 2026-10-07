import { ImageResponse } from "next/og";

import { LOGO_BOUNDS, LOGO_PATH } from "@/lib/logo-mark";
import { loadGoogleFont } from "@/lib/og-fonts";

// TASK-linkedin-setup-checklist.md: the LinkedIn profile banner, company cover
// and company logo, drawn from the same mark and fonts as opengraph-image.tsx.
// Statically generated; any other name 404s.

const HEADLINE = "BLESSED MOON STUDIO";
const TAGLINE = "Clarity is the feature.";
const LINE = "Websites and software for founders";
const ASSETS = ["banner.png", "cover.png", "logo.png"] as const;
type Asset = (typeof ASSETS)[number];

export const dynamicParams = false;
export function generateStaticParams() {
  return ASSETS.map((asset) => ({ asset }));
}

function Mark({ cell }: { cell: number }) {
  return (
    <svg width={LOGO_BOUNDS.width * cell} height={LOGO_BOUNDS.height * cell} viewBox={`0 0 ${LOGO_BOUNDS.width} ${LOGO_BOUNDS.height}`}>
      <path d={LOGO_PATH} fill="#ff6a1f" />
    </svg>
  );
}

function Lockup({ cell, headline, tagline, line }: { cell: number; headline: number; tagline: number; line?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: cell * 4 }}>
      <Mark cell={cell} />
      <div style={{ display: "flex", flexDirection: "column", gap: tagline * 0.6 }}>
        <div style={{ display: "flex", fontFamily: "Space Grotesk", fontSize: headline, fontWeight: 700, color: "#eeeeee", letterSpacing: headline * 0.1 }}>{HEADLINE}</div>
        <div style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: tagline, color: "#ff6a1f", letterSpacing: tagline * 0.06 }}>{TAGLINE}</div>
        {line && <div style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: line, color: "#97a1ae", letterSpacing: line * 0.04 }}>{LINE}</div>}
      </div>
    </div>
  );
}

const LAYOUTS: Record<Asset, { width: number; height: number; body: () => React.ReactElement }> = {
  // The profile photo covers the lower-left on desktop and the left on mobile,
  // so the lockup sits in the right half.
  "banner.png": { width: 1584, height: 396, body: () => (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 110, background: "#050505" }}>
      <Lockup cell={13} headline={46} tagline={24} line={19} />
    </div>
  ) },
  // Shown at ~1128×191 with the logo over the lower-left: centred and inset.
  "cover.png": { width: 4200, height: 700, body: () => (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#050505" }}>
      <Lockup cell={32} headline={120} tagline={60} />
    </div>
  ) },
  "logo.png": { width: 400, height: 400, body: () => (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#050505" }}>
      <Mark cell={22} />
    </div>
  ) },
};

export async function GET(_request: Request, { params }: { params: Promise<{ asset: string }> }) {
  const { asset } = await params;
  const layout = LAYOUTS[asset as Asset];
  if (!layout) return new Response("Not found", { status: 404 });
  const [spaceGrotesk, jetbrainsMono] = await Promise.all([
    loadGoogleFont("Space Grotesk", 700, HEADLINE),
    loadGoogleFont("JetBrains Mono", 400, TAGLINE + LINE),
  ]);
  return new ImageResponse(layout.body(), {
    width: layout.width,
    height: layout.height,
    headers: { "Content-Disposition": `inline; filename="blessed-moon-linkedin-${asset}"` },
    fonts: [
      { name: "Space Grotesk", data: spaceGrotesk, style: "normal", weight: 700 },
      { name: "JetBrains Mono", data: jetbrainsMono, style: "normal", weight: 400 },
    ],
  });
}
