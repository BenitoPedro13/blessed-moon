"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ParticleText, type ParticleTextHandle } from "@/components/react-bits/particle-text";
import { Reveal } from "@/components/reveal";
import { ScrollStage } from "@/components/scroll-stage";
import { SectionHeading } from "@/components/section-heading";
import { useSound } from "@/components/sound-provider";

export function AboutTeaser() {
  const { playHover, playClick } = useSound();
  const headlineRef = useRef<ParticleTextHandle>(null);

  // Same pattern as hero.tsx: ScrollStage's pin progress drives the
  // headline's gather/scatter directly via the imperative ref, not a
  // generic ambient particle overlay layered on top of static text — the
  // actual words are what's built from particles, materializing as the
  // section pins and dissolving as it releases. Matches the surrounding
  // block's own `1 - stage-progress` opacity formula exactly — gather and
  // fade need to move together, not on two different schedules.
  const handleProgress = useCallback((progress: number) => {
    headlineRef.current?.setGatherProgress(1 - progress);
  }, []);

  return (
    <section
      data-ascii-keyframe="1"
      data-frame-label="ABOUT"
      className="relative"
    >
      <ScrollStage heightMultiplier={1.4} onProgress={handleProgress}>
        <div
          style={{
            opacity: "calc(1 - var(--stage-progress, 0))",
            transform: "scale(calc(1 - var(--stage-progress, 0) * 0.12))",
          }}
          className="w-full px-7 py-16 sm:py-20"
        >
          <Reveal>
            <SectionHeading number="01" label="ABOUT" />
          </Reveal>
          {/* align="left": ParticleText's default centers the sampled text
              within its container (right for Hero's centered headline,
              wrong here — About's other text is left-aligned, and a CSS
              text-align has no effect since particle x-positions are
              computed in JS, not laid out via CSS). See particle-text.tsx. */}
          <ParticleText
            ref={headlineRef}
            text="BUILT TO LAST LONGER THAN THE BRIEF."
            align="left"
            fontSize="clamp(1.5rem, 4vw, 1.75rem)"
            fontWeight={600}
            density={1}
            densityDivisor={40}
            particleSize={2}
            scatter={110}
            gatherDuration={1200}
            className="h-16 w-full max-w-2xl sm:h-14"
          />
          <Reveal delay={0.16}>
            <p className="mt-3.5 max-w-md text-[13px] leading-[1.55] text-muted-foreground">
              We develop, design and execute advanced software programs. With our
              innovative technology we resolve cases and help clients world-wide.
            </p>
          </Reveal>
          {/* Previously ended on the "See what we build" link alone, with
              nothing actually bridging to Services — the section just
              stopped, and Services picked up as an unrelated list. This
              line is the bridge; the link stays as the action. */}
          <Reveal delay={0.22}>
            <p className="mt-5 max-w-md text-[13px] leading-[1.55] text-muted-foreground">
              That starts with a clear answer to what we actually build —
              eight kinds of systems, each one we&apos;ve shipped enough times
              to know where it breaks.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <Link
              href="#services"
              onMouseEnter={playHover}
              onClick={playClick}
              className="mt-6 inline-flex items-center gap-1.5 border border-primary/60 px-4 py-2 font-mono text-[10.5px] tracking-[0.5px] text-primary uppercase transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              See what we build
              <ArrowRight className="size-3" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </ScrollStage>
    </section>
  );
}
