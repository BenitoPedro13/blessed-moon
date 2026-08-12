"use client";

import { useEffect, useRef } from "react";

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
}

const PARTICLE_COUNT = 160;

export function ScrollParticles({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reads --stage-progress directly from the nearest ancestor that sets
    // it (ScrollStage's inner sticky panel) each frame, rather than taking
    // it as a React prop — the same reasoning as every other continuous
    // scroll-driven value in this codebase (ascii-canvas.tsx, site-nav.tsx,
    // ScrollStage itself): a per-frame value doesn't need a React
    // re-render, just a direct DOM read.
    const progressHost = canvas.closest<HTMLElement>("[style*='--stage-progress']") ?? canvas;
    function readProgress(): number {
      const raw = getComputedStyle(progressHost).getPropertyValue("--stage-progress");
      const value = parseFloat(raw);
      return Number.isFinite(value) ? value : 0;
    }

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    let width = 0;
    let height = 0;
    let dpr = 1;

    function resize() {
      const rect = canvas!.parentElement?.getBoundingClientRect();
      width = rect?.width ?? canvas!.clientWidth;
      height = rect?.height ?? canvas!.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
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
      }));
    }

    resize();
    seedParticles();

    const resizeObserver = new ResizeObserver(() => {
      resize();
      seedParticles();
    });
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    let raf = 0;
    function frame(now: number) {
      ctx!.clearRect(0, 0, width, height);

      // Baseline ambient presence throughout the pin, boosted at both ends
      // (arriving/dissolving) rather than zeroing out entirely in the
      // middle — a formula that vanishes for a stretch of the scroll read
      // as "the effect isn't doing anything" more than "it's subtle."
      const p = readProgress();
      const density = 0.35 + Math.abs(p - 0.5) * 1.3;
      const drift = reducedMotion ? 0 : now * 0.0006;
      for (const particle of particlesRef.current) {
        particle.x += reducedMotion ? 0 : particle.vx * 0.016;
        particle.y += reducedMotion ? 0 : particle.vy * 0.016;
        if (particle.x < 0) particle.x += width;
        if (particle.x > width) particle.x -= width;
        if (particle.y < 0) particle.y += height;
        if (particle.y > height) particle.y -= height;

        const bob = reducedMotion ? 0 : Math.sin(drift * 3 + particle.seed) * 3;
        ctx!.globalAlpha = Math.min(1, density * (0.5 + 0.5 * Math.sin(particle.seed + drift * 2) ** 2));
        ctx!.fillStyle = particle.amber ? "#ff6a1f" : "#e9e7e1";
        ctx!.fillRect(particle.x, particle.y + bob, particle.size, particle.size);
      }
      ctx!.globalAlpha = 1;

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
    />
  );
}
