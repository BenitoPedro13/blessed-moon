import type { Metadata } from "next";
import Script from "next/script";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { AsciiCanvas } from "@/components/ascii-canvas";
import { StarsBackground } from "@/components/animate-ui/components/backgrounds/stars";
import { BootSequence } from "@/components/boot-sequence";
import { SoundProvider } from "@/components/sound-provider";
import { SITE_URL } from "@/lib/site-config";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DESCRIPTION =
  "Blessed Moon Studio designs and builds digital systems for founders and product leaders who value craftsmanship over hype — clarity is the feature.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Blessed Moon Studio",
    template: "%s · Blessed Moon Studio",
  },
  description: DESCRIPTION,
  keywords: [
    "Blessed Moon Studio",
    "software studio",
    "web design agency",
    "product engineering",
    "brand and web systems",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Blessed Moon Studio",
    title: "Blessed Moon Studio",
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blessed Moon Studio",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* The scroll-driven sections make the page taller/deeper than a
            typical marketing page, so the browser's default scroll-position
            restore-on-reload (history.scrollRestoration = "auto") now lands
            somewhere jarring instead of a barely-noticeable offset.
            beforeInteractive so it runs before the browser applies its own
            restoration. */}
        <Script id="disable-scroll-restoration" strategy="beforeInteractive">
          {`if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }`}
        </Script>
        <StarsBackground
          className="fixed inset-0 -z-10 bg-transparent"
          starColor="#e9e7e1"
          factor={0.02}
          speed={80}
        />
        <AsciiCanvas />
        <BootSequence />
        <SoundProvider>
          <div className="relative z-10 flex min-h-full flex-1 flex-col">
            {children}
          </div>
        </SoundProvider>
      </body>
    </html>
  );
}
