"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

import { subscribeFrame } from "@/components/frame-loop";
import { LogoMark } from "@/components/logo-mark";
import { useSound } from "@/components/sound-provider";
import { SoundToggle } from "@/components/sound-toggle";
import { createScrollTracker } from "@/lib/ascii-canvas/scroll-progress";

const NAV_LINKS = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/#services" },
  { label: "Pricing", href: "/#pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/** How quickly the displayed background/border opacity eases toward the
 * scroll-driven target each frame — same easing constant and reasoning as
 * ascii-canvas.tsx's own EASE: without it, the nav's chrome would snap
 * exactly to the scrollbar instead of settling with a little weight. */
const EASE = 0.12;

export function SiteNav() {
  const { playHover, playClick } = useSound();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const chromeRef = useRef<HTMLElement>(null);

  function isActive(href: string) {
    if (href.startsWith("/#")) return false;
    if (href === "/work") return pathname === href || pathname.startsWith("/work/");
    return pathname === href;
  }

  // Reuses the exact scroll-position machinery that already drives the
  // ASCII moon (createScrollTracker) — the nav's chrome becomes part of the
  // same scroll-frame system instead of a static bar floating on top of it.
  // Own tracker instance rather than sharing AsciiCanvas's: these are
  // independent components, and a shared instance would mean threading state
  // through the tree for no real benefit — the tracker is now pure arithmetic
  // over cached offsets.
  //
  // The rAF loop *is* shared, via frame-loop.ts. It used to be its own, which
  // is exactly the pattern that made six loops interleave their layout reads
  // and writes; see that file for the measurement.
  //
  // A live section-name label used to render here too (a `[data-frame-
  // label]`-driven tracker, since removed along with the label) —
  // removed: variable-width text in a `justify-between` flex row shifted
  // the nav's balance every time the label changed, visibly throwing off
  // the link group's centering and making the links harder to hit
  // accurately. A follow-up sidebar version of the same idea was also
  // tried and also removed — see git history if this gets revisited.
  useEffect(() => {
    const morphTracker = createScrollTracker();
    morphTracker.measure();

    let displayedChrome = 0;
    let morph = 0;

    const unsubscribe = subscribeFrame({
      read({ scrollY, innerHeight }) {
        morph = morphTracker.read(scrollY, innerHeight);
      },
      write() {
        const targetChrome = Math.min(1, Math.max(0, morph));
        displayedChrome += (targetChrome - displayedChrome) * EASE;

        const chrome = chromeRef.current;
        if (chrome) {
          chrome.style.setProperty("--nav-chrome", displayedChrome.toFixed(3));
        }
      },
    });

    function handleResize() {
      morphTracker.measure();
    }
    window.addEventListener("resize", handleResize);
    const remeasure = window.setTimeout(handleResize, 500);

    return () => {
      unsubscribe();
      window.clearTimeout(remeasure);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header
      ref={chromeRef}
      style={{
        "--nav-chrome": 0,
        backgroundColor: "color-mix(in oklch, var(--background) calc(var(--nav-chrome) * 90%), transparent)",
        borderBottomColor: "color-mix(in oklch, var(--border) calc(var(--nav-chrome) * 100%), transparent)",
        backdropFilter: "blur(calc(var(--nav-chrome) * 6px))",
      } as React.CSSProperties}
      className="sticky top-0 z-50 flex items-center justify-between border-b px-4 py-4 transition-colors sm:px-7"
    >
      {/* The wordmark beside it is `hidden sm:inline` and the mark itself is
          aria-hidden, so below 640px this link had no accessible name at all —
          a screen reader announced it as bare "link". Caught by Lighthouse
          (mobile emulation) run against production. */}
      <Link
        href="/"
        onMouseEnter={playHover}
        onClick={playClick}
        className="group flex items-center gap-2"
        aria-label="Blessed Moon Studio — home"
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
        {/* A plain Link, not `<Button variant="outline">`. That variant carries
            `dark:hover:bg-input/50`, and a `.dark`-scoped selector outranks the
            plain `hover:bg-primary` passed in `className` — Tailwind resolves
            conflicts by specificity and stylesheet order, never by the order
            classes appear in the attribute. So the site's one persistent CTA
            filled pale grey on hover instead of amber. Same treatment as every
            other outlined CTA here (about-teaser, work-case), which has no
            variant to fight. */}
        <Link
          href="/contact"
          onMouseEnter={playHover}
          onClick={playClick}
          className="hidden items-center border border-primary px-4 py-2 font-mono text-[10px] tracking-[0.6px] text-primary uppercase transition-colors hover:bg-primary hover:text-primary-foreground sm:inline-flex"
        >
          Start a project
        </Link>
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
