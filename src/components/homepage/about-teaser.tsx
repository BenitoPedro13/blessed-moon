"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { useSound } from "@/components/sound-provider";

export function AboutTeaser() {
  const { playHover, playClick } = useSound();

  return (
    <section data-ascii-keyframe="1" data-frame-label="ABOUT" className="px-7 py-16 sm:py-20">
      <Reveal>
        <SectionHeading number="01" label="ABOUT" />
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="max-w-2xl font-sans text-2xl font-semibold tracking-[-0.01em] text-foreground sm:text-[26px]">
          Built to last longer than the brief.
        </h2>
      </Reveal>
      <Reveal delay={0.16}>
        <p className="mt-3.5 max-w-md text-[13px] leading-[1.55] text-muted-foreground">
          We develop, design and execute advanced software programs. With our
          innovative technology we resolve cases and help clients world-wide.
        </p>
      </Reveal>
      <Reveal delay={0.24}>
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
    </section>
  );
}
