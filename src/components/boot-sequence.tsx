"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

const LINES = [
  "blessed_moon --boot",
  "loading brand tokens ......... ok",
  "compiling ascii pipeline ...... ok",
  "mounting scene ................ ok",
  "ready.",
] as const;

const LINE_DELAY_MS = 220;
/** Hard cap so this can never get stuck open — document.fonts.ready not
 * resolving (or resolving unexpectedly late) must not be able to leave a
 * solid overlay covering the site indefinitely. */
const MAX_WAIT_MS = 2200;

/**
 * A real terminal boot log — matches the TUI identity already established
 * by the nav's pixel-crescent logo mark and the section numbering. Dismisses on
 * document.fonts.ready, capped at MAX_WAIT_MS so it can never hang. Click
 * or any key skips straight to the exit. Respects prefers-reduced-motion.
 *
 * All lines render immediately rather than typing/revealing progressively —
 * a first version staggered them in via a recursive setTimeout chain and,
 * separately, a second version reset to a blank state on mount before
 * re-revealing; both risk showing nothing (root cause of the first was
 * never pinned down, but a broken loading screen blocking real content is
 * worse than one with no reveal animation). This trades that polish for
 * something that can't fail blank.
 */
export function BootSequence() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    function dismiss() {
      if (cancelled) return;
      setExiting(true);
      window.setTimeout(() => {
        if (!cancelled) setVisible(false);
      }, 300);
    }

    if (reduceMotion) {
      dismiss();
      return;
    }

    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    const capped = Promise.race([
      fontsReady,
      new Promise<void>((resolve) => window.setTimeout(resolve, MAX_WAIT_MS)),
    ]);
    capped.then(() => {
      if (cancelled) return;
      window.setTimeout(dismiss, LINES.length * LINE_DELAY_MS + 300);
    });

    function skip() {
      dismiss();
    }
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("keydown", skip, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, [reduceMotion]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end bg-background px-7 py-8 transition-opacity duration-300"
      style={{ opacity: exiting ? 0 : 1 }}
    >
      <div className="font-mono text-[11px] leading-[1.7] text-muted-foreground">
        {LINES.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
    </div>
  );
}
