export type Locale = "en" | "pt";
export const LOCALES: readonly Locale[] = ["en", "pt"];

export function isLocale(value: string): value is Locale {
  return value === "en" || value === "pt";
}

export function stripLocale(path: string) {
  return path.replace(/^\/(?:en|pt)(?=\/|\?|#|$)/, "") || "/";
}

/** The studio's public pages. Editorial plans and production tools keep their own language. */
export function hasTranslation(path: string) {
  const pathname = stripLocale(path).split(/[?#]/)[0];
  if (pathname === "/opengraph-image" || pathname === "/twitter-image" || pathname === "/services/social-media/opengraph-image") return true;
  return pathname === "/" || pathname === "" || ["/about", "/contact", "/work", "/services/social-media"].includes(pathname)
    || /^\/work\/[^/]+$/.test(pathname);
}

export function localizedHref(href: string, locale: Locale) {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const clean = stripLocale(href);
  if (locale === "en" || !hasTranslation(clean)) return clean;
  return `/pt${clean === "/" ? "" : clean.startsWith("/?") || clean.startsWith("/#") ? clean.slice(1) : clean}`;
}

export function localeFromPath(pathname: string): Locale {
  return /^\/pt(?:\/|$)/.test(pathname) ? "pt" : "en";
}
