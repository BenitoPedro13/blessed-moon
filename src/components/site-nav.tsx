import Link from "next/link";

import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border/60 bg-background/90 px-7 py-4 backdrop-blur-sm">
      <Link
        href="/"
        className="font-mono text-sm font-semibold tracking-[2px] text-foreground"
      >
        {">|<"}
      </Link>
      <nav className="hidden items-center gap-6 font-mono text-[10.5px] tracking-[0.6px] text-muted-foreground uppercase md:flex">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="transition-colors hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <Button
        variant="outline"
        size="sm"
        render={<Link href="/contact" />}
        className="rounded-none border-primary font-mono text-[10px] tracking-[0.6px] text-primary uppercase hover:bg-primary hover:text-primary-foreground"
      >
        Book a call
      </Button>
    </header>
  );
}
