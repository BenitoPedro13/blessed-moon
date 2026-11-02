"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { useI18n } from "./locale-provider";
import { hasTranslation, localizedHref } from "@/lib/i18n/shared";

const urlSuffix = () => location.search + location.hash;
const serverSuffix = () => "";
function subscribeUrl(notify: () => void) {
  addEventListener("popstate", notify);
  addEventListener("hashchange", notify);
  return () => { removeEventListener("popstate", notify); removeEventListener("hashchange", notify); };
}

export function LanguageSwitch() {
  const pathname = usePathname();
  const { locale } = useI18n();
  const suffix = useSyncExternalStore(subscribeUrl, urlSuffix, serverSuffix);
  if (!hasTranslation(pathname)) return null;
  return (
    <nav aria-label={locale === "pt" ? "Idioma" : "Language"} className="flex shrink-0 items-center gap-1 font-mono text-[10px] tracking-[0.04em]">
      {(["en", "pt"] as const).map(language => (
        <a
          key={language}
          href={localizedHref(pathname, language) + suffix}
          hrefLang={language === "pt" ? "pt-BR" : "en"}
          lang={language === "pt" ? "pt-BR" : "en"}
          aria-current={locale === language ? "true" : undefined}
          aria-label={language === "pt" ? "Português" : "English"}
          onClick={event => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            // Search and fragment belong to the destination too (contact briefs and section links).
            event.currentTarget.href = localizedHref(pathname, language) + location.search + location.hash;
          }}
          className={`px-1.5 py-2 transition-colors hover:text-primary focus-visible:outline-1 focus-visible:outline-primary ${locale === language ? "text-primary underline underline-offset-4" : "text-muted-foreground"}`}
        >{language.toUpperCase()}</a>
      ))}
    </nav>
  );
}
