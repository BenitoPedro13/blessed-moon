"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

import { LogoMark } from "@/components/logo-mark";
import { useSound } from "@/components/sound-provider";
import { SoundToggle } from "@/components/sound-toggle";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/#services" },
  { label: "Pricing", href: "/#pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export function SiteNav() {
  const { playHover, playClick } = useSound();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function isActive(href: string) {
    if (href.startsWith("/#")) return false;
    if (href === "/work") return pathname === href || pathname.startsWith("/work/");
    return pathname === href;
  }

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-4 backdrop-blur-sm sm:px-7">
      <Link
        href="/"
        onMouseEnter={playHover}
        onClick={playClick}
        className="group flex items-center gap-2"
      >
        <LogoMark className="h-4 w-4 text-primary transition-colors group-hover:text-foreground" />
        <span className="hidden font-mono text-xs font-semibold tracking-[3px] text-foreground uppercase transition-colors group-hover:text-primary sm:inline">
          Blessed_Moon
        </span>
      </Link>
      <nav className="hidden items-center gap-6 font-mono text-[10.5px] tracking-[0.6px] text-muted-foreground uppercase md:flex">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onMouseEnter={playHover}
            onClick={playClick}
            aria-current={isActive(link.href) ? "page" : undefined}
            className={`transition-colors hover:text-foreground ${
              isActive(link.href) ? "text-primary" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <SoundToggle />
        <button
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onMouseEnter={playHover}
          onClick={() => {
            playClick();
            setMenuOpen((open) => !open);
          }}
          className="inline-flex size-7 items-center justify-center border border-border/80 text-muted-foreground transition-colors hover:border-primary hover:text-primary md:hidden"
        >
          {menuOpen ? <X className="size-3.5" /> : <Menu className="size-3.5" />}
        </button>
        <Button
          nativeButton={false}
          variant="outline"
          size="sm"
          render={<Link href="/contact" onMouseEnter={playHover} onClick={playClick} />}
          className="hidden rounded-none border-primary font-mono text-[10px] tracking-[0.6px] text-primary uppercase hover:bg-primary hover:text-primary-foreground sm:inline-flex"
        >
          Start a project
        </Button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="absolute inset-x-0 top-full border-b border-primary/30 bg-background/95 px-4 py-3 backdrop-blur-md md:hidden"
        >
          <div className="grid grid-cols-2 gap-px border border-border/60 bg-border/60">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onMouseEnter={playHover}
                onClick={() => {
                  playClick();
                  setMenuOpen(false);
                }}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`bg-background px-4 py-4 font-mono text-[9.5px] tracking-[0.08em] uppercase transition-colors hover:bg-primary hover:text-primary-foreground ${
                  isActive(link.href) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onMouseEnter={playHover}
              onClick={() => {
                playClick();
                setMenuOpen(false);
              }}
              className="col-span-2 bg-primary px-4 py-4 text-center font-mono text-[9.5px] tracking-[0.08em] text-primary-foreground uppercase"
            >
              Start a project
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
