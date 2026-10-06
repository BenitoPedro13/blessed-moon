"use client";

import { useEffect, useRef, useState } from "react";

import { subscribeFrame } from "@/components/frame-loop";
import { usePageReducedMotion } from "@/lib/use-page-reduced-motion";
import { ScrollParticles, StageProgressContext } from "@/components/scroll-particles";

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
  particles = false,
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
  /** Ambient particle-dissolve texture (see scroll-particles.tsx) — the
   * ParticleScroll replacement. Opt-in, not automatic: nothing currently
   * on the site turns it on (see TASK-remove-hero-particles.md for the
   * headline's own canvas-particle effect, which was removed for
   * performance rather than left as a reason to skip this one). */
  particles?: boolean;
  children: React.ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePageReducedMotion();
  const [contentOverflow, setContentOverflow] = useState(false);
  const flow = reduceMotion || contentOverflow;
  // Ref rather than a dependency on the callback itself — an inline arrow
  // function passed by the caller would otherwise be a new reference every
  // render, tearing down and restarting the rAF loop each time for no reason.
  const onProgressRef = useRef(onProgress);
  // The same number that goes into --stage-progress, handed to ScrollParticles
  // as a value rather than left for it to read back out of the style engine.
  // It used to recover this with a getComputedStyle() call inside its own rAF
  // loop — a forced style recalc per frame to retrieve a number this component
  // had just computed in JS.
  const progressRef = useRef(0);

  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    if (reduceMotion) return;
    const inner = innerRef.current;
    if (!inner) return;
    function measure() {
      setContentOverflow(inner!.scrollHeight > window.innerHeight + 1);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(inner);
    Array.from(inner.children).forEach((child) => observer.observe(child));
    measure();
    window.addEventListener("resize", measure);
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, [reduceMotion, contentOverflow]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;
    if (flow) {
      // React does not restore a style value changed by the frame loop when
      // its JSX value is unchanged. Reset it explicitly on the flow fallback.
      progressRef.current = 0;
      inner.style.setProperty("--stage-progress", "0");
      onProgressRef.current?.(0);
      return;
    }

    return subscribeFrame({
      read() {
        const rect = wrapper.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        progressRef.current =
          scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
      },
      write() {
        const progress = progressRef.current;
        inner.style.setProperty("--stage-progress", progress.toFixed(4));
        onProgressRef.current?.(progress);
      },
    });
  }, [flow]);

  return (
    <div ref={wrapperRef} data-scroll-stage={flow ? "flow" : "pinned"} style={flow ? undefined : { height: `calc(${heightMultiplier} * var(--stage-pace, 1) * 100dvh)` }} className={`relative ${className}`}>
      {/* Oversized content uses document flow. A nested scrollable pin can
          consume the same gesture needed to advance or leave the stage. */}
      <div
        ref={innerRef}
        style={{ "--stage-progress": 0 } as React.CSSProperties}
        className={flow ? "relative flex min-h-dvh flex-col items-center justify-center" : "sticky top-0 flex h-dvh flex-col items-center justify-center overflow-hidden"}
      >
        {/* A ref object, so the value is stable and providing it costs no
            re-render — the number inside it changes every frame. */}
        <StageProgressContext.Provider value={progressRef}>
          {particles && <ScrollParticles />}
          {children}
        </StageProgressContext.Provider>
      </div>
    </div>
  );
}
