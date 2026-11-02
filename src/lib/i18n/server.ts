import { locale as rootLocale } from "next/root-params";
import { isLocale, localizedHref } from "./shared";
import { translator } from "./translate";
import { SITE_URL } from "@/lib/site-config";
import type { Metadata } from "next";

export async function getServerI18n() {
  const language = await rootLocale();
  const locale = isLocale(language) ? language : "en";
  return { locale, t: translator(locale), href: (path: string) => localizedHref(path, locale) };
}

export function languageAlternates(path: string) {
  return { en: `${SITE_URL}${localizedHref(path, "en")}`, "pt-BR": `${SITE_URL}${localizedHref(path, "pt")}`, "x-default": `${SITE_URL}${localizedHref(path, "en")}` };
}

export async function localizedMetadata(metadata: Metadata, path: string): Promise<Metadata> {
  const { locale, t, href } = await getServerI18n();
  const description = t(metadata.description ?? "Blessed Moon Studio designs and builds digital systems for founders and product leaders who value craftsmanship over hype — clarity is the feature.");
  return {
    ...metadata,
    title: typeof metadata.title === "string" ? t(metadata.title) : metadata.title,
    description,
    alternates: { canonical: `${SITE_URL}${href(path)}`, languages: languageAlternates(path) },
    openGraph: { ...metadata.openGraph, title: typeof metadata.title === "string" ? t(metadata.title) : "Blessed Moon Studio", description, url: `${SITE_URL}${href(path)}`, locale: locale === "pt" ? "pt_BR" : "en_US", alternateLocale: locale === "pt" ? "en_US" : "pt_BR" },
    twitter: { ...metadata.twitter, description },
  };
}
