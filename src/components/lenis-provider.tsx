"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";

/**
 * Wraps the whole app in Lenis's eased scroll — the "buttery" scroll feel
 * behind every pinned/scroll-driven Apple-style product page. Deliberately
 * picked over a transform-based virtual-scroll library: Lenis eases the
 * *native* scrollTop/scrollY rather than faking scroll with a CSS
 * transform, which is what keeps every existing scroll-position reader
 * (ascii-canvas.tsx's scroll-progress.ts, site-nav.tsx's trackers,
 * hero.tsx's ParticleText gather, every Reveal's whileInView) working
 * completely unmodified — verified once actually installed, not just
 * assumed from the pre-install research.
 *
 * `root` mounts a single global instance driving the real document scroll
 * (not a wrapper/content pair) so nothing else about the page's DOM
 * structure has to change. Skipped entirely under prefers-reduced-motion —
 * same "don't partially tune it down, just don't run it" rule every other
 * motion piece on this site already follows (Reveal, BootSequence).
 *
 * `prevent` opts out any subtree marked `data-lenis-prevent` from Lenis's
 * smoothing (native scroll applies instead) — needed for a genuinely
 * separate nested scroll container that should handle its own wheel input.
 * Currently used by the homepage's ParticleScroll panel (`app/page.tsx`):
 * without it, Lenis intercepts wheel input at the window level before it
 * ever reaches that panel's own `overflow: auto` content div. A later
 * attempt to instead drive that panel's scrollTop programmatically from an
 * outer scroll-stage pin (removing the need for this exemption) visibly
 * corrupted its html-in-canvas capture and froze page scroll — reverted;
 * see the comment in `app/page.tsx` for what actually happened.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return children;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        smoothWheel: true,
        autoRaf: true,
        prevent: (node) => node.closest?.("[data-lenis-prevent]") != null,
      }}
    >
      {children}
    </ReactLenis>
  );
}
