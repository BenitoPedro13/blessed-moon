"use client";

import { useI18n } from "@/components/locale-provider";

import Link from "@/components/localized-link";

import { useSound } from "@/components/sound-provider";

const FOOTER_LINKS = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/#services" },
  { label: "Pricing", href: "/#pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Social Strategy", href: "/services/social-media" },
] as const;

export function SiteFooter() {
  const { t } = useI18n();
  const { playHover, playClick } = useSound();

  return (
    <footer className="flex flex-col gap-3 border-t border-border/60 px-7 py-6 font-mono text-[9.5px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {FOOTER_LINKS.map((link, i) => (
          <span key={link.label} className="flex items-center gap-2">
            <Link
              href={link.href}
              onMouseEnter={playHover}
              onClick={playClick}
              className="transition-colors hover:text-foreground"
            >
              {t(link.label)}
            </Link>
            {i < FOOTER_LINKS.length - 1 && (
              <span aria-hidden="true">&middot;</span>
            )}
          </span>
        ))}
      </div>
      <span>{t("© 2026 Blessed Moon Studio")}</span>
    </footer>
  );
}
