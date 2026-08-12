"use client";

import Link from "next/link";

import { ParticleObject } from "@/components/canvasui/ParticleObject";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { useSound } from "@/components/sound-provider";

/**
 * Closing CTA band — a featured moment for ParticleObject (cursor-reactive
 * particle moon), distinct from the AsciiObject moon that runs the whole
 * page's background. Not in the original wireframe section list; added per
 * user direction ("the handoff was just a start") as a proper home for this
 * effect instead of a small, easy-to-miss footer icon.
 */
export function ClosingCta() {
  const { playHover, playClick } = useSound();

  return (
    <section
      data-ascii-keyframe="5"
      data-frame-label="START A PROJECT"
      className="relative flex flex-col items-center overflow-hidden px-7 py-20 text-center sm:py-28"
    >
      {/* Not pointer-events-none: ParticleObject listens for pointermove
          directly on its own canvas to drive the scatter interaction. */}
      <div className="absolute inset-0 flex items-center justify-center opacity-70">
        <ParticleObject
          src="/models/moon.glb"
          count={9000}
          size={1.8}
          scale={3.2}
          radius={140}
          strength={1.2}
          orbit={false}
          zoom={false}
          autoRotate
          autoRotateSpeed={1}
          floatIntensity={1.4}
          rotationIntensity={0.8}
          color="#ff6a1f"
          className="h-full w-full"
        />
      </div>
      <Reveal className="relative">
        <h2 className="max-w-xl font-sans text-3xl font-semibold tracking-[-0.01em] text-foreground sm:text-4xl">
          Let&apos;s build something that lasts.
        </h2>
        <p className="mx-auto mt-3.5 max-w-md text-[13px] leading-[1.55] text-muted-foreground">
          Tell us what you&apos;re building — we&apos;ll tell you what it takes.
        </p>
        <Button
          nativeButton={false}
          size="lg"
          render={<Link href="/contact" onMouseEnter={playHover} onClick={playClick} />}
          className="mt-8 rounded-none bg-primary font-mono text-[11px] tracking-[0.6px] text-primary-foreground uppercase hover:bg-primary/85"
        >
          Start a project
        </Button>
      </Reveal>
    </section>
  );
}
