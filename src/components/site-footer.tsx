import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export function SiteFooter() {
  return (
    <footer className="flex flex-col gap-3 border-t border-border/60 px-7 py-6 font-mono text-[9.5px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {FOOTER_LINKS.map((link, i) => (
          <span key={link.label} className="flex items-center gap-2">
            <Link href={link.href} className="transition-colors hover:text-foreground">
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
