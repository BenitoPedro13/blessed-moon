"use client";

import { useEffect, useRef } from "react";

import { subscribeFrame } from "@/components/frame-loop";
import { ParticleText, type ParticleTextHandle } from "@/components/react-bits/particle-text";
import { Reveal } from "@/components/reveal";
import { ScrollStage } from "@/components/scroll-stage";

const CORNER_LABELS = [
  { label: "B", className: "top-6 left-7 sm:top-8 sm:left-10" },
  { label: "S", className: "top-6 right-7 sm:top-8 sm:right-10" },
  { label: "M", className: "bottom-6 left-7 sm:bottom-8 sm:left-10" },
  { label: "26", className: "bottom-6 right-7 sm:bottom-8 sm:right-10" },
] as const;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<ParticleTextHandle>(null);
  const line2Ref = useRef<ParticleTextHandle>(null);

  /**
   * Ties the headline to scroll the same way `Reveal` ties every other
   * section's content to scroll — dissolving out as it leaves the viewport,
   * re-gathering if the visitor scrolls back up, replaying in both
   * directions rather than a one-shot mount animation. Reads the section's
   * own bounding rect on the shared frame loop and drives both ParticleText
   * instances imperatively (see ParticleTextHandle) rather than through
   * React state, for the same reason `ascii-canvas.tsx` drives AsciiObject
   * that way: a per-frame React re-render of the whole hero subtree isn't
   * needed just to update two canvases.
   *
   * Phase 1 of TASK-apple-scroll-journey.md wraps this section's content in
   * `ScrollStage`, which pins it for a taller scroll range instead of the
   * section's own natural (much shorter) height — this effect didn't need
   * to change at all to pick that up: `<section>` below has no height of
   * its own anymore (ScrollStage's wrapper dictates it), so it renders at
   * exactly ScrollStage's height automatically, and this formula keeps
   * reading the right thing.
   */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let progress = 0;

    return subscribeFrame({
      read() {
        const rect = section.getBoundingClientRect();
        progress = Math.min(1, Math.max(0, 1 - Math.max(0, -rect.top) / rect.height));
      },
      write() {
        line1Ref.current?.setGatherProgress(progress);
        line2Ref.current?.setGatherProgress(progress);
      },
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Hero"
      data-ascii-keyframe="0"
      data-frame-label="HERO"
      className="relative"
    >
      <ScrollStage heightMultiplier={2}>
        <div className="relative flex w-full flex-col items-center px-7 py-24 text-center">
          {CORNER_LABELS.map((corner) => (
            <span
              key={corner.label}
              aria-hidden="true"
              style={{ opacity: "calc(1 - var(--stage-progress, 0) * 0.85)" }}
              className={`absolute font-sans text-xs text-muted-foreground/50 ${corner.className}`}
            >
              {corner.label}
            </span>
          ))}
          {/* DecryptReveal was tried here and rejected — its idle state showed a
              scrambled cipher at low opacity, which camouflaged almost invisibly
              into the ASCII moon's own texture right behind it. ParticleText
              risks the same failure mode (sparse particles over a busy,
              similarly-light-toned moon), so it's tuned specifically against it:
              a low densityDivisor (particle count scales with container area,
              and a single text line has much less area than the big hero
              containers React Bits tuned its default divisor for), a soft glow
              the moon's flat ASCII glyphs don't have (a luminance cue, not just
              a hue one), and a tighter scatter/gather so it spends less time in
              a diffuse, blend-prone state. Two ParticleText instances (one per
              line) inside a real `h1` — the canvas text bypasses CSS, so the
              accessible name comes from the h1's aria-label instead.

              `w-full` has to be threaded through every level between the
              `section` (a real, definite width) and the ParticleText divs
              (`w-full`, needing a definite parent to resolve a percentage
              against): `Reveal`'s own wrapper div has no width class of its
              own, so under `items-center` it shrink-wraps to content just like
              an un-widthed h1 would — putting `w-full` on the h1 alone just
              moved the same ambiguity up one level instead of resolving it.

              This block also fades/scales out via `--stage-progress` (set by
              the ScrollStage wrapper above) as the pin plays out — layered on
              a plain wrapper div rather than on Reveal's own motion.div, so
              this scroll-pin transform and Reveal's independent mount
              animation don't fight over the same style properties. */}
          <div
            style={{
              opacity: "calc(1 - var(--stage-progress, 0))",
              transform: "scale(calc(1 - var(--stage-progress, 0) * 0.12))",
            }}
            className="w-full max-w-4xl"
          >
            <Reveal className="w-full max-w-4xl">
              <h1
                className="mx-auto flex w-full flex-col items-center font-sans font-semibold tracking-[-0.01em] uppercase"
                aria-label="Clarity is the feature."
              >
                <ParticleText
                  ref={line1Ref}
                  text="CLARITY IS"
                  fontSize="clamp(2.75rem, 8vw, 4.5rem)"
                  fontWeight={600}
                  density={1}
                  densityDivisor={28}
                  particleSize={2.6}
                  scatter={140}
                  gatherDuration={1400}
                  className="h-20 w-full sm:h-24 md:h-28"
                />
                <ParticleText
                  ref={line2Ref}
                  text="THE FEATURE."
                  fontSize="clamp(2.75rem, 8vw, 4.5rem)"
                  fontWeight={600}
                  density={1}
                  densityDivisor={28}
                  particleSize={2.6}
                  scatter={140}
                  gatherDuration={1400}
                  className="-mt-2 h-20 w-full sm:-mt-3 sm:h-24 md:h-28"
                />
              </h1>
            </Reveal>
          </div>
        </div>
      </ScrollStage>
    </section>
  );
}
