"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

import { useSound } from "@/components/sound-provider";

const LINES = [
  "blessed_moon --boot",
  "loading brand tokens ......... ok",
  "compiling ascii pipeline ...... ok",
  "mounting scene ................ ok",
  "ready.",
] as const;

const LINE_DELAY_MS = 220;
/** Hard cap so the boot log itself can never get stuck open — document.fonts.ready
 * not resolving (or resolving unexpectedly late) must not be able to leave a solid
 * overlay covering the site indefinitely. */
const MAX_WAIT_MS = 2200;
/** Safety net for the gate phase, not an expected path — mirrors MAX_WAIT_MS's
 * "can never get stuck open" principle, scoped longer since this phase is now an
 * intentional gate a visitor is meant to interact with, not a loading wait. */
const GATE_TIMEOUT_MS = 15000;
const WHEEL_THRESHOLD = 12;
const TOUCH_THRESHOLD = 24;
const GATE_KEYS = new Set(["ArrowDown", "PageDown", " ", "Space", "End"]);

type Phase = "booting" | "gating" | "exiting" | "hidden";

/**
 * A real terminal boot log — matches the TUI identity already established by the
 * nav's pixel-crescent logo mark and the section numbering. Two phases:
 *
 * 1. "booting" — the log lines, same as before. Any click/key fast-forwards past
 *    the loading wait straight to the gate (not past the gate itself).
 * 2. "gating" — a sound prompt and a "scroll to begin" affordance. Deliberately
 *    requires a real scroll-equivalent action (wheel, touch, ArrowDown/PageDown/
 *    Space/End, or the visible "Begin" button) rather than any arbitrary click —
 *    a plain click not landing on Begin does NOT dismiss it, otherwise it isn't
 *    actually gated. The Begin button exists specifically because a scroll/wheel-
 *    only gate with no alternative would be a real operability gap for anyone who
 *    can't perform that gesture, not just a style choice to cut.
 *
 * `GATE_TIMEOUT_MS` is a fallback, not an expected path — this can still never
 * trap a visitor forever, same principle as the original's MAX_WAIT_MS.
 *
 * All boot lines render immediately rather than typing/revealing progressively —
 * a first version staggered them in via a recursive setTimeout chain and,
 * separately, a second version reset to a blank state on mount before
 * re-revealing; both risk showing nothing (root cause of the first was never
 * pinned down, but a broken loading screen blocking real content is worse than
 * one with no reveal animation). The gate phase follows the same rule: the sound
 * prompt and scroll hint appear as static blocks, no new stagger machinery.
 * Respects prefers-reduced-motion by skipping the gate entirely.
 */
export function BootSequence() {
  const reduceMotion = useReducedMotion();
  const { muted, toggleMuted } = useSound();
  const [phase, setPhase] = useState<Phase>("booting");
  const [soundChoice, setSoundChoice] = useState<"unset" | "enabled" | "muted">("unset");
  const phaseRef = useRef<Phase>("booting");

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  function exit() {
    if (phaseRef.current === "exiting" || phaseRef.current === "hidden") return;
    setPhase("exiting");
    window.setTimeout(() => setPhase("hidden"), 300);
  }

  // Phase 1: booting → gating (or straight to hidden under reduced motion).
  useEffect(() => {
    if (reduceMotion) {
      exit();
      return;
    }

    let cancelled = false;

    function advanceToGate() {
      if (cancelled || phaseRef.current !== "booting") return;
      setPhase("gating");
    }

    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    const capped = Promise.race([
      fontsReady,
      new Promise<void>((resolve) => window.setTimeout(resolve, MAX_WAIT_MS)),
    ]);
    capped.then(() => {
      if (cancelled) return;
      window.setTimeout(advanceToGate, LINES.length * LINE_DELAY_MS + 300);
    });

    function skipBoot() {
      advanceToGate();
    }
    window.addEventListener("pointerdown", skipBoot, { once: true });
    window.addEventListener("keydown", skipBoot, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("pointerdown", skipBoot);
      window.removeEventListener("keydown", skipBoot);
    };
  }, [reduceMotion]);

  // Phase 2: gating → exiting. Locks body scroll for the duration, listens for a
  // real scroll-equivalent gesture, and falls back to a timeout so it can never
  // trap a visitor indefinitely.
  useEffect(() => {
    if (phase !== "gating") return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onWheel(event: WheelEvent) {
      if (Math.abs(event.deltaY) > WHEEL_THRESHOLD) exit();
    }

    let touchStartY: number | null = null;
    function onTouchStart(event: TouchEvent) {
      touchStartY = event.touches[0]?.clientY ?? null;
    }
    function onTouchMove(event: TouchEvent) {
      if (touchStartY === null) return;
      const currentY = event.touches[0]?.clientY;
      if (currentY === undefined) return;
      if (Math.abs(touchStartY - currentY) > TOUCH_THRESHOLD) exit();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (GATE_KEYS.has(event.key)) exit();
    }

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    const fallback = window.setTimeout(exit, GATE_TIMEOUT_MS);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(fallback);
    };
  }, [phase]);

  if (phase === "hidden") return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col justify-end gap-6 bg-background px-7 py-8 transition-opacity duration-300"
      style={{ opacity: phase === "exiting" ? 0 : 1 }}
    >
      <div className="font-mono text-[11px] leading-[1.7] text-muted-foreground">
        {LINES.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>

      {phase === "gating" && (
        <div className="flex flex-col gap-5 border-t border-border/60 pt-6 font-mono text-[11px]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-muted-foreground">enable sound for the full experience?</span>
            <button
              type="button"
              onClick={() => {
                if (muted) toggleMuted();
                setSoundChoice("enabled");
              }}
              className={`border px-3 py-1.5 uppercase tracking-[0.06em] transition-colors ${
                soundChoice === "enabled"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-primary/60 text-primary hover:bg-primary hover:text-primary-foreground"
              }`}
            >
              {soundChoice === "enabled" ? "sound on" : "enable sound"}
            </button>
            <button
              type="button"
              onClick={() => setSoundChoice("muted")}
              className={`border px-3 py-1.5 uppercase tracking-[0.06em] transition-colors ${
                soundChoice === "muted"
                  ? "border-border bg-muted text-foreground"
                  : "border-border/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              continue muted
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">scroll to begin</span>
            <button
              type="button"
              onClick={exit}
              className="inline-flex items-center gap-2 border border-primary/60 px-4 py-2 text-primary uppercase tracking-[0.06em] transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              begin
              <span aria-hidden="true" className="animate-bounce">
                ↓
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
