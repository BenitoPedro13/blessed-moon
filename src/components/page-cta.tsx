"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { useSound } from "@/components/sound-provider";
import { Button } from "@/components/ui/button";

interface PageCtaProps {
  title?: string;
  description?: string;
  keyframe?: string;
}

export function PageCta({
  title = "Have something similar in mind?",
  description = "Tell us what you are building. We will return with a clear next step.",
  keyframe = "5",
}: PageCtaProps) {
  const { playHover, playClick } = useSound();

  return (
    <section
      data-ascii-keyframe={keyframe}
      className="relative overflow-hidden border-y border-primary/30 bg-background/65 px-7 py-20 text-center backdrop-blur-sm sm:py-24"
    >
      <div aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-primary" />
      <div aria-hidden="true" className="absolute inset-y-0 right-0 w-px bg-primary" />
      <Reveal>
        <p className="font-mono text-[9.5px] tracking-[0.15em] text-primary uppercase">
          next transmission
        </p>
        <h2 className="mx-auto mt-4 max-w-2xl font-sans text-3xl font-semibold tracking-[-0.025em] text-foreground sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-[13px] leading-[1.65] text-muted-foreground">
          {description}
        </p>
        <Button
          nativeButton={false}
          size="lg"
          render={
            <Link
              href="/contact"
              onMouseEnter={playHover}
              onClick={playClick}
            />
          }
          className="mt-8 rounded-none bg-primary px-5 font-mono text-[10.5px] tracking-[0.08em] text-primary-foreground uppercase hover:bg-primary/85"
        >
          Start a project
          <ArrowRight aria-hidden="true" />
        </Button>
      </Reveal>
    </section>
  );
}
