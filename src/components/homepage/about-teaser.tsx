"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { COUNT_INLINE } from "@/components/homepage/morph-count";
import { MorphToken, morphDrift } from "@/components/scroll-morph-stage";
import { useSound } from "@/components/sound-provider";

/**
 * Layer 0 of the homepage's `ScrollMorphStage`. Hands the **8** off to
 * Services — the first beat of the descending count (see morph-count.tsx).
 *
 * Composition is an asymmetric diagonal: label top-left, headline owning the
 * vertical center, supporting text and the handoff line offset to the
 * bottom-right. `lg:` only — a diagonal split has no room to read as
 * intentional on a phone, where it stacks instead.
 *
 * No `Reveal` and no wrapper transform: both are forbidden inside a morph
 * layer, and for different reasons — see scroll-morph-stage.tsx.
 */
export function AboutTeaser() {
  const { playHover, playClick } = useSound();

  return (
    <div className="flex flex-col gap-8 short:gap-5">
      {/* Sized well under Hero's headline (Hero tops out at 4.5rem) —
          deliberately: the second-place statement on the page, not a rival.
          short: trims it further — on a short/narrow viewport this headline
          alone can wrap to enough lines to push the layer past the window's
          86dvh clamp. */}
      <div className="flex items-center" style={morphDrift({ y: 46, order: 1 })}>
        <h2 className="max-w-3xl font-sans text-4xl font-semibold tracking-[-0.02em] text-foreground short:text-3xl sm:text-5xl short:sm:text-4xl md:text-[3.5rem]">
          Built to last longer than the brief.
        </h2>
      </div>

      {/* Untransformed on purpose: this column contains the token, and a
          transformed ancestor makes Motion's layout measurement drift
          mid-flight. Its opacity still moves — the layer's does. */}
      <div className="max-w-md lg:ml-auto lg:text-right">
        {/* Lead tier: brighter and a step larger than the supporting line
            below it. The body copy used to be binary — near-white headings
            and 55% grey for everything else — which is a flat page however
            good the words are. */}
        <p className="text-[15.5px] leading-[1.65] text-foreground/75">
          Two senior people on the work, end to end. No account layer, no
          handoff, no one learning your product on your time.
        </p>
        {/* leading-[2.1] wherever a token sits in a sentence: the inline
            numeral is 1.5em, and at normal body leading it overflows its own
            line box into the line above. Raise one, raise the other. */}
        <p className="mt-4 text-[13.5px] leading-[2.1] text-muted-foreground">
          Which is why we can name exactly what we build —{" "}
          <MorphToken id="count-8" side="from" className={COUNT_INLINE}>
            8
          </MorphToken>{" "}
          kinds of systems, each one shipped enough times that we know where it
          breaks.
        </p>
        <Link
          href="#services"
          onMouseEnter={playHover}
          onClick={playClick}
          className="mt-6 inline-flex items-center gap-1.5 border border-primary/60 px-5 py-2.5 font-mono text-[10.5px] tracking-[0.5px] text-primary uppercase transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          See what we build
          <ArrowRight className="size-3" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
