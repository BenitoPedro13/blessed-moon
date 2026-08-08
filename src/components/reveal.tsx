"use client";

import { motion, useReducedMotion } from "motion/react";

interface RevealProps {
  children: React.ReactNode;
  /** Stagger delay in seconds, for a sequence of siblings entering together. */
  delay?: number;
  className?: string;
}

/**
 * Fades/slides/dissolves content on scroll — replays every time it crosses
 * the viewport edge in either direction (scrolling back up dissolves it back
 * out, not just a one-shot entrance), so page content animates in step with
 * the ASCII background instead of just appearing statically. The blur term
 * is what gives it a "materializing" dissolve rather than a plain slide —
 * this replaces an earlier attempt to use canvasui's ParticleScroll for the
 * same idea, which turned out to be built around its own internal scroll
 * container rather than page scroll (see TASK-homepage-glass-sections.md
 * §5/§6). Respects prefers-reduced-motion.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 36, scale: 0.96, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{
        default: { type: "spring", stiffness: 260, damping: 22, delay },
        // A spring can overshoot past its target, and blur has no negative
        // value — that overshoot was producing "blur(-0.3px)", an invalid
        // CSS keyframe Framer Motion would throw on at runtime. Tween
        // doesn't overshoot, so it stays a plain 0..6px range.
        filter: { type: "tween", ease: "easeOut", duration: 0.5, delay },
      }}
    >
      {children}
    </motion.div>
  );
}
