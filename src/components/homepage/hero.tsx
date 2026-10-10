"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { ScrollStage } from "@/components/scroll-stage";
import { useSound } from "@/components/sound-provider";
import { Button } from "@/components/ui/button";

const CORNER_LABELS = [
  { label: "B", className: "top-6 left-7 sm:top-8 sm:left-10" },
  { label: "S", className: "top-6 right-7 sm:top-8 sm:right-10" },
  { label: "M", className: "bottom-6 left-7 sm:bottom-8 sm:left-10" },
  { label: "26", className: "bottom-6 right-7 sm:bottom-8 sm:right-10" },
] as const;

export function Hero() {
  const { playHover, playClick } = useSound();

  return (
    <section
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
          {/* This block fades/scales out via `--stage-progress` (set by the
              ScrollStage wrapper above) as the pin plays out — layered on a
              plain wrapper div rather than on Reveal's own motion.div, so
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
              <h1 className="mx-auto flex w-full flex-col items-center font-sans font-semibold tracking-[-0.01em] text-primary uppercase">
                <span className="text-[clamp(2.75rem,8vw,4.5rem)] leading-none text-primary">CLARITY IS</span>
                <span className="text-[clamp(2.75rem,8vw,4.5rem)] leading-none text-primary">THE FEATURE.</span>
              </h1>
              {/* The first screen says what the studio does and offers the two
                  next steps, instead of leaving both to the end of the page
                  (TASK-homepage-conversion-and-navigation.md §2). */}
              <p className="mx-auto mt-6 max-w-md text-[14px] leading-[1.65] text-muted-foreground sm:text-[15px]">
                Strategy, design and engineering for founders who need software that holds up.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button
                  nativeButton={false}
                  size="lg"
                  render={<Link href="/contact" onMouseEnter={playHover} onClick={playClick} />}
                  className="rounded-none bg-primary px-5 font-mono text-[10.5px] tracking-[0.08em] text-primary-foreground uppercase hover:bg-primary/85"
                >
                  Start a project
                  <ArrowRight aria-hidden="true" />
                </Button>
                <Link
                  href="/work"
                  onMouseEnter={playHover}
                  onClick={playClick}
                  className="inline-flex h-9 items-center border border-border px-5 font-mono text-[10.5px] tracking-[0.08em] text-foreground uppercase transition-colors hover:border-primary hover:text-primary focus-visible:border-primary focus-visible:outline-none"
                >
                  See the work
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </ScrollStage>
    </section>
  );
}
