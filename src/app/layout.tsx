import type { Metadata } from "next";
import Script from "next/script";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { AsciiCanvas } from "@/components/ascii-canvas";
import { StarsBackground } from "@/components/animate-ui/components/backgrounds/stars";
import { BootSequence } from "@/components/boot-sequence";
import { SoundProvider } from "@/components/sound-provider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blessed Moon Studio",
  description:
    "Blessed Moon Studio develops, designs, and executes advanced software programs — clarity is the feature.",
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
