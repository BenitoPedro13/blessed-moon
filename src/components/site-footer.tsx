"use client";

import Link from "next/link";

import { useSound } from "@/components/sound-provider";

const FOOTER_LINKS = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/#services" },
  { label: "Pricing", href: "/#pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export function SiteFooter() {
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
              {link.label}
            </Link>
            {i < FOOTER_LINKS.length - 1 && (
              <span aria-hidden="true">&middot;</span>
            )}
          </span>
        ))}
      </div>
      <span>&copy; 2026 Blessed Moon Studio</span>
    </footer>
  );
}
