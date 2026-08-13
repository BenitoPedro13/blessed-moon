"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";

import { useSound } from "@/components/sound-provider";
import { BOOT_FACTS, BOOT_SWATCHES, bootLeader, type BootFact } from "@/lib/boot-info";
import { LOGO_BOUNDS, LOGO_PATH } from "@/lib/logo-mark";

/** How long the lockup's CSS sequence takes to settle, so the gate arrives
 * after it rather than on top of it. Kept in sync by hand with the delays
 * below — it's a presentation cue, not a correctness dependency. */
const SEQUENCE_MS = 1700;
/** The exit: the lockup takes itself apart, then the plate dissolves onto the
 * hero that has been sitting behind it the whole time. Long enough to read as
 * a handover rather than a cut, short enough that nobody waits on it. */
const EXIT_MS = 900;
/** Reduced motion gets the plain fade the overlay always had — no choreography
 * to sit through, and this path also runs at load, where the gate is skipped. */
const REDUCED_EXIT_MS = 300;
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

/** One raster cell of the art, in `em` so it tracks the lockup's type size.
 * 1.2em is what two monospace characters would have measured — the block-art
 * proportions, kept after the blocks themselves were dropped (see ART below). */
const ART_CELL_EM = 1.2;

/** Entry and exit offsets as custom properties rather than `animation-delay`
 * directly: the exit rules re-use the same elements, and an inline delay would
 * apply to whichever animation the cascade picked. */
function delay(inMs: number, outMs = 0): CSSProperties {
  return { "--boot-in": `${inMs}ms`, "--boot-out": `${outMs}ms` } as CSSProperties;
}

type Phase = "booting" | "gating" | "exiting" | "hidden";

/**
 * The lockup itself, presentational — `muted` comes in as a prop rather than
 * from `useSound()` so `/system` can render the real thing instead of a
 * hand-copied preview that would drift from it.
 */
export function BootLockup({ muted, exiting = false }: { muted: boolean; exiting?: boolean }) {
  // `sound` is the one live field: it's the state the gate is about to ask the
  // visitor to change, so it should already be on screen as a fact rather than
  // arrive only as a question.
  const facts: BootFact[] = [
    ...BOOT_FACTS,
    { key: "sound", value: muted ? "muted" : "on" },
    // The one word that changes: the gate's verb is "begin", so the machine
    // reports the state the visitor just put it in rather than being dismissed
    // mid-sentence.
    { key: "status", value: exiting ? "beginning" : "ready" },
  ];
  const factsStart = 120 + LOGO_BOUNDS.height * 40;

  // Stacked on phones the art sits above the facts and shares their left edge —
  // a narrow terminal wraps a fastfetch lockup exactly that way, and centred art
  // over left-aligned rows has no edge in common with them.
  return (
    <div className="flex w-full max-w-[660px] flex-col items-start gap-7 font-mono text-[12px] leading-[1.7] sm:flex-row sm:items-center sm:gap-10 sm:text-[13px]">
      {/* ART. Drawn from the mark's own outline path rather than as block
          characters (█), which is what this started as and could not be made
          exact: JetBrains Mono's latin subset has no Block Elements, and the
          system monos it falls through to don't agree — SF Mono renders █ from
          yet another fallback at 0.708em advance while its own digits are
          0.5em, so no line-height squares the cell; Menlo tiles horizontally
          but leaves a 15% gap between rows. The path is one seam-free outline
          at integer coordinates (that's why it exists — see logo-mark.ts), so
          the pixel-art crescent lands identical on every platform. Scanning it
          in row by row is a steps() clip on the whole shape, which is the same
          reveal the block rows were going to do. */}
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${LOGO_BOUNDS.width} ${LOGO_BOUNDS.height}`}
        shapeRendering="crispEdges"
        fill="currentColor"
        className="boot-art shrink-0 text-primary"
        style={{
          width: `${LOGO_BOUNDS.width * ART_CELL_EM}em`,
          height: `${LOGO_BOUNDS.height * ART_CELL_EM}em`,
          animationTimingFunction: `steps(${LOGO_BOUNDS.height})`,
          ...delay(80),
        }}
      >
        <path d={LOGO_PATH} />
      </svg>

      <div className="w-full min-w-0 sm:flex-1">
        <div className="boot-line whitespace-pre" style={delay(80, 0)}>
          <span className="text-primary">blessed_moon</span>
          <span className="text-muted-foreground">@</span>
          <span className="text-foreground">studio</span>
        </div>
        <div className="boot-line mt-1 mb-2 border-t border-border" style={delay(160, 0)} />

        {facts.map((fact, index) => (
          <div
            key={fact.key}
            className="boot-line flex items-baseline"
            style={delay(factsStart + index * 80, 30 + index * 25)}
          >
            <span className="whitespace-pre text-primary">{fact.key}</span>
            <span className="hidden whitespace-pre text-muted-foreground/35 sm:inline">
              {bootLeader(fact.key)}
            </span>
            <span className="whitespace-pre text-muted-foreground/60">{": "}</span>
            {/* min-w-0 so a long value wraps on a very narrow phone rather than
                pushing the fixed overlay into horizontal scroll. */}
            <span
              className="boot-value inline-block min-w-0 text-foreground"
              style={{
                ...delay(factsStart + index * 80 + 40),
                animationDuration: `${Math.min(460, 120 + fact.value.length * 12)}ms`,
                animationTimingFunction: `steps(${fact.value.length})`,
              }}
            >
              {fact.value}
            </span>
            {fact.key === "status" && (
              <span
                aria-hidden="true"
                className="boot-caret ml-1 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] bg-primary"
              />
            )}
          </div>
        ))}

        <div aria-hidden="true" className="mt-4 flex gap-1.5">
          {BOOT_SWATCHES.map((swatch, index) => (
            <div
              key={swatch.name}
              className="boot-swatch h-3.5 w-9 border border-panel-edge/70"
              style={{
                background: swatch.color,
                // Out in reverse: the warm end of the row leaves first, so the
                // last thing standing is the ground the site is about to be on.
                ...delay(
                  factsStart + facts.length * 80 + index * 45,
                  (BOOT_SWATCHES.length - 1 - index) * 30,
                ),
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * A fastfetch-style brand lockup — our own pixel crescent as block art on the
 * left, aligned `key: value` facts on the right, the site's palette as the
 * closing swatch row. fastfetch is a real terminal program that reports what a
 * machine *is*; that register (a machine describing itself, not marketing copy)
 * is why the form fits this brand. See `TASK-boot-fastfetch-lockup.md`.
 *
 * Two phases:
 *
 * 1. "booting" — the lockup. Any click/key fast-forwards past the loading wait
 *    straight to the gate (not past the gate itself).
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
 * **The animation is CSS-only, and its direction is load-bearing.** Two earlier
 * attempts at revealing this screen progressively — a recursive setTimeout
 * chain, then a mount-time reset to blank before re-revealing — could show
 * *nothing*, and a broken loading screen blocking real content is worse than one
 * that doesn't animate, so animation was removed rather than made safe. Here
 * every element's base style is its final visible state and the `@keyframes`
 * only supply an *earlier* hidden state to fill backwards from
 * (`animation-fill-mode: backwards`). If the animations never run — reduced
 * motion, a stalled main thread, a browser that drops them — the screen is
 * already complete and correct. That failure mode is structurally impossible
 * rather than avoided. No JS timers drive any of it.
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
    // Teardown is on a timer, never on `animationend` — this overlay covers the
    // entire site, so removing it must not depend on an event that a dropped or
    // disabled animation would never fire.
    window.setTimeout(() => setPhase("hidden"), reduceMotion ? REDUCED_EXIT_MS : EXIT_MS);
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
      window.setTimeout(advanceToGate, SEQUENCE_MS);
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
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-10 bg-background px-6 py-10 transition-opacity duration-300 ${
        phase === "exiting" ? "boot-exiting" : ""
      }`}
      // The inline opacity + transition is the reduced-motion path: there, the
      // exit @keyframes are `none`, so this is what fades the plate. When the
      // animation does run it outranks both (animations beat inline styles).
      style={{ opacity: phase === "exiting" ? 0 : 1 }}
    >
      <BootLockup muted={muted} exiting={phase === "exiting"} />

      {phase === "gating" && (
        <div className="boot-line boot-gate flex w-full max-w-[660px] flex-col gap-5 border-t border-border/60 pt-6 font-mono text-[11px]">
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
