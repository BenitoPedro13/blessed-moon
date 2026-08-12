"use client";

import { useEffect, useRef } from "react";

/**
 * Pins its content for a scroll range, exposing how far through that range
 * the visitor is as the CSS custom property `--stage-progress` (0 → 1) on
 * the sticky inner panel — children read it via `var(--stage-progress)` in
 * their own inline styles to fade/scale/transform as the pin plays out,
 * rather than this component knowing anything about what's inside it.
 *
 * Pure `position: sticky`, not scroll-jacking (no `wheel`/`preventDefault`
 * listeners) — the pin-and-release comes from the wrapper being taller than
 * the sticky inner panel, exactly like Apple's own product pages, and it
 * stays compatible with Lenis and every native scroll gesture (trackpad,
 * touch, keyboard) for free.
 *
 * Progress is written directly to the DOM each frame (not React state) for
 * the same reason ascii-canvas.tsx and site-nav.tsx's trackers do it that
 * way — a continuous scroll-driven value doesn't need to force a React
 * re-render every frame just to update a couple of CSS values.
 *
 * Phase 1 of TASK-apple-scroll-journey.md: proven once on the homepage's
 * Hero, not yet applied to other sections.
 */
export function ScrollStage({
  heightMultiplier = 2,
  className = "",
  onProgress,
  children,
}: {
  /** Wrapper height as a multiple of 100dvh — how much scroll room the pin
   * gets before releasing to whatever follows. This is the "increase the
   * scroll journey" lever: a bigger multiplier means slower, more deliberate
   * progress through the same content. */
  heightMultiplier?: number;
  className?: string;
  /** Called every frame with the same 0–1 value written to --stage-progress
   * — for a consumer that needs the number in JS (e.g. driving another
   * element's own scrollTop), not just CSS. Optional: most consumers just
   * read the CSS variable directly and don't need this. */
  onProgress?: (progress: number) => void;
  children: React.ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  // Ref rather than a dependency on the callback itself — an inline arrow
  // function passed by the caller would otherwise be a new reference every
  // render, tearing down and restarting the rAF loop each time for no reason.
  const onProgressRef = useRef(onProgress);

  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;

    let raf = 0;
    function frame() {
      const rect = wrapper!.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
      inner!.style.setProperty("--stage-progress", progress.toFixed(4));
      onProgressRef.current?.(progress);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={wrapperRef} style={{ height: `${heightMultiplier * 100}dvh` }} className={`relative ${className}`}>
      <div
        ref={innerRef}
        style={{ "--stage-progress": 0 } as React.CSSProperties}
        className="sticky top-0 flex h-dvh flex-col items-center justify-center overflow-hidden"
      >
        {children}
      </div>
    </div>
  );
}
