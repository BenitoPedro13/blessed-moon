/**
 * The scroll-morph → camera-move mapping for the background moon, plus the
 * easing that turns it into a displayed transform.
 *
 * This lives in `src/lib/` rather than in `ascii-canvas.tsx` because both
 * threads need it: the main thread owns scroll (it is the only side with a
 * DOM to measure) and posts a single morph value per frame, while the worker
 * owns the easing and the render cadence, so the moon keeps converging and
 * floating at a steady rate even when the main thread stalls. That stall is
 * precisely the reported symptom — see `docs/tasks/TASK-ascii-offscreen-worker.md`.
 *
 * Nothing in here may touch `window`, `document`, or three.js: it is imported
 * into a worker.
 */

/** Zoom (scale) at morph values 0 (Hero) through 5 (closing CTA). Effective
 * world-space radius is scale/2 (see modelMaxDim in AsciiObject) — stays
 * under ~3 so there's always real clearance from the camera's fixed
 * 4.2-unit distance; a more aggressive close-up previously put the camera
 * almost inside the sphere, clipping it into a jagged wedge instead of a
 * circle. From keyframe 2 (Services) onward the pinned-focus sections put
 * large centered text in the middle of the viewport, so the moon shrinks
 * hard and moves to a corner there instead of competing with it — it was
 * previously sitting directly on top of the Services text, unreadable. */
export const SCALE_BY_MORPH = [6.0, 3.6, 1.3, 1.1, 1.0, 0.9];

/** Horizontal/vertical drift (scene units) at the same morph values — the
 * moon sweeps across the frame as the page scrolls, breaking the frame
 * edges at Hero, rather than spinning in place dead-center the whole time.
 * Modeled on the Dragonfly reference. From keyframe 2 onward it parks in a
 * corner (alternating per section) to stay clear of the pinned-focus
 * content's centered text. */
export const OFFSET_X_BY_MORPH = [1.3, 0.6, 1.7, -1.7, 1.7, -1.7];
export const OFFSET_Y_BY_MORPH = [0.3, 0.1, 0.9, 0.9, -0.9, -0.9];

/** How quickly the displayed transform eases toward the scroll-driven
 * target each frame (0–1, higher = snappier). Without this the moon
 * rotation/zoom tracks the scrollbar exactly 1:1, which reads as
 * mechanical; easing gives it weight/lag, closer to a directed camera
 * move than a scrollbar-driven puppet.
 *
 * This is a per-frame constant, so it assumes ~60fps steps. It is applied in
 * the worker, whose loop is not affected by main-thread jank — which makes the
 * assumption more true than it was before, not less. */
export const EASE = 0.07;

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
export const CADENCE_ACTIVE = 60;
export const CADENCE_SETTLED = 30;

export interface ViewportScale {
  scale: number;
  x: number;
  y: number;
}

/** Mobile shrinks the moon and pulls its drift in, so a 6.0-scale Hero moon
 * doesn't simply fill a 390px-wide viewport edge to edge. */
export function viewportScaleFor(innerWidth: number): ViewportScale {
  const mobile = innerWidth < 768;
  return {
    scale: mobile ? 0.42 : 1,
    x: mobile ? 0.9 : 1,
    y: mobile ? 0.7 : 1,
  };
}

export function interpolate(table: number[], morph: number): number {
  const idx = Math.max(0, Math.min(Math.floor(morph), table.length - 1));
  const next = Math.min(idx + 1, table.length - 1);
  const frac = idx === next ? 0 : morph - idx;
  return table[idx] + (table[next] - table[idx]) * frac;
}

/** Full presence through Hero/About, then recedes to a dim ambient corner
 * presence from Services onward (keyframe 2+) so it doesn't compete with the
 * pinned-focus sections' large centered text.
 *
 * It used to fade nearly to nothing across the Pricing → CTA transition,
 * because the closing CTA had its own ParticleObject moon and two moons
 * fighting for the same space was worse than one faint one. That section now
 * uses the site-wide `PageCta` band with no moon of its own, so the fade had
 * nothing left to get out of the way of — it just made the last screen of the
 * page go dead, against the "present all the way through the footer" rule this
 * background exists to satisfy. It holds its ambient level to the end instead.
 *
 * Stays on the main thread: it drives the wrapper element's opacity, which is
 * DOM, not scene. */
export function opacityForMorph(morph: number): number {
  // Full only at Hero, where nothing but the headline sits over it. It now
  // eases down across the Hero → About sweep instead of holding at 1 through
  // About: the moon is still near its largest there (scale 3.6) and centered
  // in the frame, so About's body copy ran straight across the glyph texture
  // and was genuinely hard to read (caught in videos/afterhomerework.mov).
  // Scale and drift are untouched — the big-to-small camera move is the point
  // of that beat, it just doesn't need full contrast behind live text.
  if (morph <= 1) return 1 - morph * 0.45;
  if (morph <= 2) return 0.55 - (morph - 1) * 0.15;
  return 0.4;
}

export interface MoonTransform {
  scale: number;
  rotateY: number;
  xOffset: number;
  yOffset: number;
}

/**
 * Holds the eased transform state and advances it one frame toward the target
 * implied by `morph`. Returns the transform to apply plus the cadence the
 * renderer should use, so the caller never has to re-derive "has it settled".
 */
export function createMoonEasing(viewport: ViewportScale) {
  let displayedScale = SCALE_BY_MORPH[0] * viewport.scale;
  let displayedRotation = 0;
  let displayedX = OFFSET_X_BY_MORPH[0] * viewport.x;
  let displayedY = OFFSET_Y_BY_MORPH[0] * viewport.y;
  let current = viewport;

  return {
    setViewport(next: ViewportScale) {
      current = next;
    },
    step(morph: number): { transform: MoonTransform; cadence: number } {
      const targetScale = interpolate(SCALE_BY_MORPH, morph) * current.scale;
      const targetRotation = morph * 24;
      const targetX = interpolate(OFFSET_X_BY_MORPH, morph) * current.x;
      const targetY = interpolate(OFFSET_Y_BY_MORPH, morph) * current.y;

      // Checked before easing, so a transform that has converged doesn't get
      // one more redundant full-rate frame on the way out.
      const settled =
        Math.abs(targetScale - displayedScale) < SETTLED_UNITS &&
        Math.abs(targetX - displayedX) < SETTLED_UNITS &&
        Math.abs(targetY - displayedY) < SETTLED_UNITS &&
        Math.abs(targetRotation - displayedRotation) < SETTLED_DEGREES;

      displayedScale += (targetScale - displayedScale) * EASE;
      displayedRotation += (targetRotation - displayedRotation) * EASE;
      displayedX += (targetX - displayedX) * EASE;
      displayedY += (targetY - displayedY) * EASE;

      return {
        transform: {
          scale: displayedScale,
          rotateY: displayedRotation,
          xOffset: displayedX,
          yOffset: displayedY,
        },
        cadence: settled ? CADENCE_SETTLED : CADENCE_ACTIVE,
      };
    },
  };
}
