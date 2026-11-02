"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useI18n } from "./locale-provider";
import { localizedHref } from "@/lib/i18n/shared";

export default function LocalizedLink({ href, ...props }: ComponentProps<typeof Link>) {
  const { locale } = useI18n();
  return <Link {...props} href={typeof href === "string" ? localizedHref(href, locale) : href} />;
}
