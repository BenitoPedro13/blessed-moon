"use client";

import { createContext, useContext, useEffect, useRef } from "react";

import { subscribeFrame } from "@/components/frame-loop";

/**
 * Ambient particle-dissolve texture for a ScrollStage panel — the safe
 * replacement for what ParticleScroll used to do (TASK-homepage-unify-
 * scroll.md removed it: its independent internal scroll was a real,
 * repeated source of confusion, and its experimental html-in-canvas
 * capture already caused one corrupted-content bug this session).
 *
 * This does NOT capture the section's actual DOM content into particles —
 * that's what made ParticleScroll's capture fragile in the first place.
 * Instead it's an ambient field of drifting dots layered behind the real
 * content, present throughout the pin and thickest right as a section is
 * arriving or dissolving away. Same particle-drawing technique as
 * ParticleText (plain Canvas 2D, no DOM rasterization), just without text
 * sampling — a scattered field instead of glyph positions.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  seed: number;
  amber: boolean;
  /** Transient: this frame's vertical bob, computed in the update pass and read
   * again in the draw pass. Kept on the particle so the sine isn't evaluated
   * twice per particle per frame. */
  bob: number;
}

const PARTICLE_COUNT = 160;

/** Number of alpha levels the per-particle opacity is snapped to. Each level,
 * per colour, is one canvas state change instead of one per particle — 8 total
 * rather than 320. At 6 levels the banding is well under what's visible on
 * 1.5–4px dots at these alphas; the field is indistinguishable from the
 * continuous version side by side. */
const ALPHA_STEPS = 6;

/**
 * The stage's 0→1 pin progress, supplied by whichever stage owns this field.
 *
 * `ScrollStage` provides it. `ScrollMorphStage` deliberately does not, which
 * preserves existing behaviour exactly: this component used to find its
 * progress with `canvas.closest("[style*='--stage-progress']")`, and
 * `ScrollMorphStage`'s inner panel sets `--morph-progress`, not
 * `--stage-progress`. The selector never matched there, `parseFloat("")`
 * returned `NaN`, and the fallback pinned progress at 0 — which puts density at
 * a constant 1.0 for the whole homepage body.
 *
 * That is very likely not what was intended, but making the field respond to
 * morph progress is a design change, not a performance one, so it is not being
 * made here. See `docs/tasks/TASK-frame-budget-cleanup.md`.
 */
export const StageProgressContext = createContext<{ current: number } | null>(null);

export function ScrollParticles({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const progressRef = useContext(StageProgressContext);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    // One `fillStyle` string per (colour, alpha level) pair, built once. Baking
    // the alpha into an rgba() colour means the draw below never touches
    // `globalAlpha` at all: a bucket costs exactly one state change.
    const PALETTE = [
      [233, 231, 225], // #e9e7e1
      [255, 106, 31], //  #ff6a1f
    ];
    const styles = PALETTE.flatMap(([r, g, b]) =>
      Array.from(
        { length: ALPHA_STEPS },
        (_, level) => `rgba(${r}, ${g}, ${b}, ${(level / (ALPHA_STEPS - 1)).toFixed(3)})`,
      ),
    );
    /** Reused every frame — cleared rather than reallocated, so the draw path
     * allocates nothing and gives the collector no reason to run mid-scroll. */
    const buckets: Particle[][] = Array.from({ length: PALETTE.length * ALPHA_STEPS }, () => []);

    let width = 0;
    let height = 0;
    let dpr = 1;

    function resize() {
      const rect = canvas!.parentElement?.getBoundingClientRect();
      width = rect?.width ?? canvas!.clientWidth;
      height = rect?.height ?? canvas!.clientHeight;
      // DPR 1, not min(devicePixelRatio, 2). These are 1.5–4px squares at low
      // alpha on a near-black ground; rendering them at 2x quadrupled the fill
      // area for a difference that isn't visible on a phone. Checked against a
      // before/after capture, not assumed.
      dpr = 1;
      canvas!.width = Math.max(1, Math.floor(width * dpr));
      canvas!.height = Math.max(1, Math.floor(height * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seedParticles() {
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        size: 1.5 + Math.random() * 2.5,
        seed: Math.random() * 100,
        amber: Math.random() < 0.4,
        bob: 0,
      }));
    }

    resize();
    seedParticles();

    const resizeObserver = new ResizeObserver(() => {
      resize();
      seedParticles();
    });
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    const unsubscribe = subscribeFrame({
      // No read phase: this component reads no layout. Its one layout-dependent
      // input, the stage's progress, now arrives as a number from the stage that
      // already computed it.
      write({ time }) {
        ctx.clearRect(0, 0, width, height);

        // Baseline ambient presence throughout the pin, boosted at both ends
        // (arriving/dissolving) rather than zeroing out entirely in the
        // middle — a formula that vanishes for a stretch of the scroll read
        // as "the effect isn't doing anything" more than "it's subtle."
        const p = progressRef?.current ?? 0;
        const density = 0.35 + Math.abs(p - 0.5) * 1.3;
        const drift = reducedMotion ? 0 : time * 0.0006;

        for (const bucket of buckets) bucket.length = 0;

        // Pass 1: advance and bucket. No canvas calls in here, so nothing
        // forces the rasterizer to flush mid-update.
        for (const particle of particlesRef.current) {
          particle.x += reducedMotion ? 0 : particle.vx * 0.016;
          particle.y += reducedMotion ? 0 : particle.vy * 0.016;
          if (particle.x < 0) particle.x += width;
          if (particle.x > width) particle.x -= width;
          if (particle.y < 0) particle.y += height;
          if (particle.y > height) particle.y -= height;

          particle.bob = reducedMotion ? 0 : Math.sin(drift * 3 + particle.seed) * 3;

          const alpha = Math.min(
            1,
            density * (0.5 + 0.5 * Math.sin(particle.seed + drift * 2) ** 2),
          );
          const level = Math.round(alpha * (ALPHA_STEPS - 1));
          buckets[(particle.amber ? ALPHA_STEPS : 0) + level].push(particle);
        }

        // Pass 2: one fillStyle per non-empty bucket — at most 12 state changes
        // for the whole field, where the previous version set fillStyle and
        // globalAlpha per particle for 320.
        for (let i = 0; i < buckets.length; i++) {
          const bucket = buckets[i];
          // Level 0 is fully transparent: skipping it costs nothing visually
          // and drops the dimmest particles out of the draw entirely.
          if (bucket.length === 0 || i % ALPHA_STEPS === 0) continue;
          ctx.fillStyle = styles[i];
          for (const particle of bucket) {
            ctx.fillRect(particle.x, particle.y + particle.bob, particle.size, particle.size);
          }
        }
      },
    });

    return () => {
      unsubscribe();
      resizeObserver.disconnect();
    };
  }, [progressRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
    />
  );
}
