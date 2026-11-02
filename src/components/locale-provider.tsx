"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { translator } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/shared";

const LocaleContext = createContext<Locale>("en");

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext value={locale}>{children}</LocaleContext>;
}

export function useI18n() {
  const locale = useContext(LocaleContext);
  const t = useMemo(() => translator(locale), [locale]);
  return { locale, t };
}
