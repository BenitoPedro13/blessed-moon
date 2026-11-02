import type { Metadata } from "next";
import Script from "next/script";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { AsciiCanvas } from "@/components/ascii-canvas";
import { StarsBackground } from "@/components/animate-ui/components/backgrounds/stars";
import { BootSequence } from "@/components/boot-sequence";
import { LenisProvider } from "@/components/lenis-provider";
import { SoundProvider } from "@/components/sound-provider";
import { SITE_URL } from "@/lib/site-config";
import { LocaleProvider } from "@/components/locale-provider";
import { isLocale } from "@/lib/i18n/shared";
import { translator } from "@/lib/i18n/translate";
import { notFound } from "next/navigation";
import "@/app/globals.css";

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

const baseMetadata: Metadata = {
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

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "pt" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = translator(locale === "pt" ? "pt" : "en");
  return {
    ...baseMetadata,
    description: t(DESCRIPTION),
    openGraph: { ...baseMetadata.openGraph, description: t(DESCRIPTION), locale: locale === "pt" ? "pt_BR" : "en_US", alternateLocale: locale === "pt" ? "en_US" : "pt_BR" },
    twitter: { ...baseMetadata.twitter, description: t(DESCRIPTION) },
  };
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html
      lang={locale === "pt" ? "pt-BR" : "en"}
      // boot-seen-flag below sets data-boot-seen before hydration.
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`dark ${spaceGrotesk.variable} ${jetbrainsMono.variable} min-h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col bg-background text-foreground">
        {/* The scroll-driven sections make the page taller/deeper than a
            typical marketing page, so the browser's default scroll-position
            restore-on-reload (history.scrollRestoration = "auto") now lands
            somewhere jarring instead of a barely-noticeable offset.
            beforeInteractive so it runs before the browser applies its own
            restoration. */}
        <Script id="disable-scroll-restoration" strategy="beforeInteractive">
          {`if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }`}
        </Script>
        {/* The boot screen plays once per visitor. Marked before first paint so
            a returning visitor never sees the server-rendered overlay flash
            (globals.css hides it under this attribute). Storage failing just
            means a first visit. */}
        <Script id="boot-seen-flag" strategy="beforeInteractive">
          {`try { if (localStorage.getItem('bm-boot-seen')) document.documentElement.setAttribute('data-boot-seen', ''); } catch (e) {}`}
        </Script>
        {process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_UMAMI_SRC && process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script src="/analytics-policy.js" strategy="beforeInteractive" />
        )}
        {process.env.NODE_ENV === "production" &&
          process.env.NEXT_PUBLIC_UMAMI_SRC &&
          process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
            <Script
              src={process.env.NEXT_PUBLIC_UMAMI_SRC}
              data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
              data-domains={new URL(SITE_URL).hostname}
              data-do-not-track="true"
              data-exclude-hash="true"
              data-performance="true"
              data-before-send="blessedMoonBeforeSend"
              strategy="afterInteractive"
            />
          )}
        {process.env.NODE_ENV === "production" &&
          process.env.NEXT_PUBLIC_UMAMI_SRC &&
          process.env.NEXT_PUBLIC_UMAMI_RECORDER_SRC &&
          process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
            <Script
              src={process.env.NEXT_PUBLIC_UMAMI_RECORDER_SRC}
              data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
              strategy="afterInteractive"
            />
          )}
        <LocaleProvider locale={locale}>
        <LenisProvider>
          <StarsBackground
            className="fixed inset-0 -z-10 bg-transparent"
            starColor="#e9e7e1"
            factor={0.02}
            speed={80}
          />
          <AsciiCanvas />
          <SoundProvider>
            <BootSequence />
            <div className="relative z-10 flex min-h-full flex-1 flex-col">
              {children}
            </div>
          </SoundProvider>
        </LenisProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
