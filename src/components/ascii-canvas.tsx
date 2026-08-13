"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { createAsciiObject } from "@/components/canvasui/AsciiObject";
import { subscribeFrame } from "@/components/frame-loop";
import { createScrollTracker } from "@/lib/ascii-canvas/scroll-progress";

/** Zoom (scale) at morph values 0 (Hero) through 5 (closing CTA). Effective
 * world-space radius is scale/2 (see modelMaxDim in AsciiObject) — stays
 * under ~3 so there's always real clearance from the camera's fixed
 * 4.2-unit distance; a more aggressive close-up previously put the camera
 * almost inside the sphere, clipping it into a jagged wedge instead of a
 * circle. From keyframe 2 (Services) onward the pinned-focus sections put
 * large centered text in the middle of the viewport, so the moon shrinks
 * hard and moves to a corner there instead of competing with it — it was
 * previously sitting directly on top of the Services text, unreadable. */
const SCALE_BY_MORPH = [6.0, 3.6, 1.3, 1.1, 1.0, 0.9];

/** Horizontal/vertical drift (scene units) at the same morph values — the
 * moon sweeps across the frame as the page scrolls, breaking the frame
 * edges at Hero, rather than spinning in place dead-center the whole time.
 * Modeled on the Dragonfly reference. From keyframe 2 onward it parks in a
 * corner (alternating per section) to stay clear of the pinned-focus
 * content's centered text. */
const OFFSET_X_BY_MORPH = [1.3, 0.6, 1.7, -1.7, 1.7, -1.7];
const OFFSET_Y_BY_MORPH = [0.3, 0.1, 0.9, 0.9, -0.9, -0.9];

/** How quickly the displayed transform eases toward the scroll-driven
 * target each frame (0–1, higher = snappier). Without this the moon
 * rotation/zoom tracks the scrollbar exactly 1:1, which reads as
 * mechanical; easing gives it weight/lag, closer to a directed camera
 * move than a scrollbar-driven puppet. */
const EASE = 0.07;

/** Below this, the eased transform has effectively caught up with its
 * scroll-driven target and only the moon's own ambient float is still moving.
 * Scale/offsets are scene units and rotation is degrees, so they're compared
 * separately rather than against one shared number. */
const SETTLED_UNITS = 0.002;
const SETTLED_DEGREES = 0.05;

/** Render cadence while the transform is still converging, and once it has
 * settled. The float's slowest-moving components have periods of 1.5s and 4s
 * (see AsciiObject's `tick`), so 30fps is indistinguishable from 60 for the
 * ambient motion — but it is *very* distinguishable while a scroll-driven camera
 * move is in flight, which is why this isn't simply pinned at 30. */
const CADENCE_ACTIVE = 60;
const CADENCE_SETTLED = 30;

function viewportTransform() {
  const mobile = window.innerWidth < 768;
  return {
    scale: mobile ? 0.42 : 1,
    x: mobile ? 0.9 : 1,
    y: mobile ? 0.7 : 1,
  };
}

function interpolate(table: number[], morph: number): number {
  const idx = Math.max(0, Math.min(Math.floor(morph), table.length - 1));
  const next = Math.min(idx + 1, table.length - 1);
  const frac = idx === next ? 0 : morph - idx;
  return table[idx] + (table[next] - table[idx]) * frac;
}

/** Full presence through Hero/About, recedes to a dim ambient corner
 * presence from Services through Pricing (keyframe 2–4) so it doesn't
 * compete with the pinned-focus sections' large centered text, then fades
 * nearly all the way out across the Pricing → closing-CTA transition
 * (keyframe 5) — the CTA has its own dedicated ParticleObject moon, so
 * this one needs to get out of its way rather than visually collide with
 * it. "Nearly" rather than fully to 0: it should never go fully dead, per
 * the "don't stop before the footer" rule, but a redundant second moon
 * fighting the featured one for the same space is worse than a very faint
 * residual presence. */
function opacityForMorph(morph: number): number {
  // Full only at Hero, where nothing but the headline sits over it. It now
  // eases down across the Hero → About sweep instead of holding at 1 through
  // About: the moon is still near its largest there (scale 3.6) and centered
  // in the frame, so About's body copy ran straight across the glyph texture
  // and was genuinely hard to read (caught in videos/afterhomerework.mov).
  // Scale and drift are untouched — the big-to-small camera move is the point
  // of that beat, it just doesn't need full contrast behind live text.
  if (morph <= 1) return 1 - morph * 0.45;
  if (morph <= 2) return 0.55 - (morph - 1) * 0.15;
  if (morph <= 4) return 0.4;
  return 0.4 - Math.min(1, morph - 4) * 0.35;
}

/**
 * Full-bleed ASCII background: a single moon model, present for the whole
 * page, all the way through the footer — it should never stop animating or
 * fully disappear. Scroll drives its zoom, rotation, and drift continuously;
 * no swapping between unrelated objects. See TASK-ascii-canvas-layer.md: an
 * earlier version cross-faded between moon, microchip, and monitor models
 * per section, which read as a slideshow of random stock objects rather
 * than one coherent form,
 * so it was dropped in favor of this. The moon also happens to be the one
 * asset that's actually on-brand (the "circuit-moon" logo mark).
 */
export function AsciiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackerRef = useRef<ReturnType<typeof createScrollTracker> | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let viewport = viewportTransform();

    const instance = createAsciiObject(
      { canvas },
      {
        src: "/models/moon.glb",
        scale: SCALE_BY_MORPH[0] * viewport.scale,
        cellSize: 6,
        colored: false,
        color: "#c9c7c0",
        // Lower edgeContrast (was 2.4) so the crater/regolith shading
        // itself drives glyph choice instead of the algorithm snapping
        // almost everything to edge-tracing glyphs and flattening the
        // photographic tonal detail into a near-blank disc. Higher
        // contrast + exposure pull that subtle tonal range out further.
        contrast: 2.2,
        edgeContrast: 1.3,
        exposure: 1.4,
        orbit: false,
        zoom: false,
        autoRotate: false,
        floatIntensity: 0.6,
        rotationIntensity: 0.3,
        environmentIntensity: 0.8,
      },
    );
    if (!instance) return;

    const tracker = createScrollTracker();
    trackerRef.current = tracker;
    tracker.measure();
    let displayedScale = SCALE_BY_MORPH[0] * viewport.scale;
    let displayedRotation = 0;
    let displayedX = OFFSET_X_BY_MORPH[0] * viewport.x;
    let displayedY = OFFSET_Y_BY_MORPH[0] * viewport.y;
    let morph = 0;
    let cadence = CADENCE_ACTIVE;

    function read({ scrollY, innerHeight }: { scrollY: number; innerHeight: number }) {
      morph = tracker.read(scrollY, innerHeight);
    }

    function write() {
      const targetScale = interpolate(SCALE_BY_MORPH, morph) * viewport.scale;
      const targetRotation = morph * 24;
      const targetX = interpolate(OFFSET_X_BY_MORPH, morph) * viewport.x;
      const targetY = interpolate(OFFSET_Y_BY_MORPH, morph) * viewport.y;

      // Checked before easing, so a transform that has converged doesn't get
      // one more redundant full-rate frame on the way out.
      const settled =
        Math.abs(targetScale - displayedScale) < SETTLED_UNITS &&
        Math.abs(targetX - displayedX) < SETTLED_UNITS &&
        Math.abs(targetY - displayedY) < SETTLED_UNITS &&
        Math.abs(targetRotation - displayedRotation) < SETTLED_DEGREES;

      const nextCadence = settled ? CADENCE_SETTLED : CADENCE_ACTIVE;
      if (nextCadence !== cadence) {
        cadence = nextCadence;
        instance!.setCadence(cadence);
      }

      displayedScale += (targetScale - displayedScale) * EASE;
      displayedRotation += (targetRotation - displayedRotation) * EASE;
      displayedX += (targetX - displayedX) * EASE;
      displayedY += (targetY - displayedY) * EASE;

      instance!.setTransform({
        scale: displayedScale,
        rotateY: displayedRotation,
        xOffset: displayedX,
        yOffset: displayedY,
      });
      if (wrapperRef.current) {
        wrapperRef.current.style.opacity = String(opacityForMorph(morph));
      }
    }

    function handleResize() {
      viewport = viewportTransform();
      tracker.measure();
    }

    window.addEventListener("resize", handleResize);
    // Re-measure once more shortly after mount: fonts/images can still be
    // settling layout at effect-mount time, which would otherwise bake in
    // stale section boundaries for the rest of the page's life (the effect
    // only runs once).
    const remeasure = window.setTimeout(() => tracker.measure(), 500);
    const unsubscribe = subscribeFrame({ read, write });

    return () => {
      unsubscribe();
      window.clearTimeout(remeasure);
      window.removeEventListener("resize", handleResize);
      trackerRef.current = null;
      instance.destroy();
    };
  }, []);

  useEffect(() => {
    // The root layout persists during App Router navigation. Re-measure after
    // the new route commits instead of keeping the previous page's section
    // boundaries until a resize happens.
    const frame = requestAnimationFrame(() => trackerRef.current?.measure());
    const settled = window.setTimeout(() => trackerRef.current?.measure(), 300);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settled);
    };
  }, [pathname]);

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
