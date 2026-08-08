"use client";

import Link from "next/link";

import { useSound } from "@/components/sound-provider";
import { SoundToggle } from "@/components/sound-toggle";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export function SiteNav() {
  const { playHover, playClick } = useSound();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border/60 bg-background/90 px-7 py-4 backdrop-blur-sm">
      <Link
        href="/"
        onMouseEnter={playHover}
        onClick={playClick}
        className="font-mono text-sm font-semibold tracking-[2px] text-foreground"
      >
        {">|<"}
      </Link>
      <nav className="hidden items-center gap-6 font-mono text-[10.5px] tracking-[0.6px] text-muted-foreground uppercase md:flex">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onMouseEnter={playHover}
            onClick={playClick}
            className="transition-colors hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <SoundToggle />
        <Button
          variant="outline"
          size="sm"
          render={<Link href="/contact" onMouseEnter={playHover} onClick={playClick} />}
          className="rounded-none border-primary font-mono text-[10px] tracking-[0.6px] text-primary uppercase hover:bg-primary hover:text-primary-foreground"
        >
          Book a call
        </Button>
      </div>
    </header>
  );
}
