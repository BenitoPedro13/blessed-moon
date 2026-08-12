"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { ScrollStage } from "@/components/scroll-stage";
import { SectionHeading } from "@/components/section-heading";
import { useSound } from "@/components/sound-provider";

export function AboutTeaser() {
  const { playHover, playClick } = useSound();

  return (
    <section
      data-ascii-keyframe="1"
      data-frame-label="ABOUT"
      className="relative"
    >
      <ScrollStage heightMultiplier={1.6}>
        {/* Plain text, not ParticleText — Hero is the one particle-text
            spectacle on this page; About matching it (previously even
            bigger than Hero's own scale) read as a second hero rather
            than a distinct, secondary moment. What differentiates this
            section is the asymmetric split composition instead: label
            top, headline owning the vertical center, supporting text +
            CTA offset to the bottom-right — a diagonal reading path
            across the full pinned frame, `lg:` only (see the mobile note
            below). `h-full` matters for the lg grid: without it this
            wrapper only takes its own content's height inside
            ScrollStage's centered flex panel, not the panel's actual
            h-dvh, so grid-rows would have nothing real to distribute
            across. */}
        {/* Holds fully visible until 55% through the pin, then dissolves
            fast over the remaining 45% — not a linear fade the whole way
            through. ScrollStage's panels are full-viewport position:
            sticky, so About and Services are never simultaneously on
            screen (true overlap would need a bigger restructure — fixed-
            position cross-fade layering across the section boundary); this
            is the achievable version of "evolving into the next section":
            a held, legible statement that then snaps away right at the
            handoff instead of a slow fade-to-black followed by an abrupt
            appearance. About's own closing line ("eight kinds of
            systems") sets up Services' 8-card grid content-wise; this
            timing is what makes the handoff itself feel deliberate rather
            than a hard cut. */}
        <div
          style={{
            opacity: "calc(1 - max(0, var(--stage-progress, 0) - 0.55) * 2.2)",
            transform: "scale(calc(1 - max(0, var(--stage-progress, 0) - 0.55) * 0.16))",
          }}
          className="flex h-full w-full flex-col justify-center gap-8 px-7 py-14 sm:py-16 lg:grid lg:grid-rows-[auto_1fr_auto] lg:justify-normal lg:gap-0"
        >
          <Reveal>
            <SectionHeading number="01" label="ABOUT" />
          </Reveal>

          {/* Sized well under Hero's headline (Hero tops out at 4.5rem) —
              deliberately: this is the second-place statement on the
              page, not a rival to it. */}
          <div className="flex items-center">
            <Reveal>
              <h2 className="max-w-3xl font-sans text-4xl font-semibold tracking-[-0.02em] text-foreground sm:text-5xl md:text-[3.5rem]">
                Built to last longer than the brief.
              </h2>
            </Reveal>
          </div>

          <div className="max-w-md lg:ml-auto lg:text-right">
            <Reveal delay={0.1}>
              <p className="text-[14.5px] leading-[1.6] text-muted-foreground">
                We develop, design and execute advanced software programs.
                With our innovative technology we resolve cases and help
                clients world-wide.
              </p>
            </Reveal>
            {/* Previously ended on the "See what we build" link alone, with
                nothing actually bridging to Services — the section just
                stopped, and Services picked up as an unrelated list. This
                line is the bridge; the link stays as the action. */}
            <Reveal delay={0.18}>
              <p className="mt-4 text-[14.5px] leading-[1.6] text-muted-foreground">
                That starts with a clear answer to what we actually build —
                eight kinds of systems, each one we&apos;ve shipped enough
                times to know where it breaks.
              </p>
            </Reveal>
            <Reveal delay={0.26}>
              <Link
                href="#services"
                onMouseEnter={playHover}
                onClick={playClick}
                className="mt-6 inline-flex items-center gap-1.5 border border-primary/60 px-5 py-2.5 font-mono text-[10.5px] tracking-[0.5px] text-primary uppercase transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                See what we build
                <ArrowRight className="size-3" aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
        </div>
      </ScrollStage>
    </section>
  );
}
