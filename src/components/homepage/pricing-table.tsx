"use client";

import { motion } from "motion/react";

import { Reveal } from "@/components/reveal";
import { ScrollStage } from "@/components/scroll-stage";
import { SectionHeading } from "@/components/section-heading";
import { useSound } from "@/components/sound-provider";

const TIERS = [
  { name: "Landing Page / Website" },
  { name: "Web App / Dashboard" },
  { name: "Full product build" },
] as const;

export function PricingTable() {
  const { playHover } = useSound();

  return (
    <section
      id="pricing"
      data-ascii-keyframe="4"
      data-frame-label="PRICING"
      className="relative"
    >
      <ScrollStage heightMultiplier={1.3} particles>
        {/* Deliberately the calm counterpoint — every other section this
            pass got louder (bigger type, more layout invention); Pricing
            stays quiet on purpose, matching its own restraint (no fixed
            numbers, per docs/design-handoff.md). Centered within generous
            surrounding space rather than another asymmetric composition —
            negative space is the distinguishing move here, not more
            visual weight. */}
        <div
          style={{
            opacity: "calc(1 - var(--stage-progress, 0))",
            transform: "scale(calc(1 - var(--stage-progress, 0) * 0.1))",
          }}
          className="mx-auto w-full max-w-xl px-7 py-14 text-center sm:py-16"
        >
          <Reveal>
            <div className="mx-auto w-fit">
              <SectionHeading number="05" label="PRICING" />
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mx-auto max-w-md text-[14px] leading-[1.6] text-muted-foreground">
              Priced like the work it actually is — project-based, confirmed
              on a call, never a number pulled from a rate card.
            </p>
          </Reveal>
          <div className="mt-10 flex flex-col text-left sm:mt-12">
            {TIERS.map((tier, i) => (
              <motion.div
                key={tier.name}
                className={`-mx-4 px-4 py-5 text-[13px] ${
                  i < TIERS.length - 1 ? "border-b border-border/60" : ""
                }`}
                initial={false}
                whileHover={{ backgroundColor: "var(--accent)", x: 4 }}
                onHoverStart={playHover}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
              >
                <Reveal
                  className="flex items-baseline justify-between gap-4"
                  delay={0.12 + i * 0.07}
                >
                  <span className="font-sans text-base text-foreground">
                    {tier.name}
                  </span>
                  <span className="text-right text-muted-foreground">
                    range confirmed on call
                  </span>
                </Reveal>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollStage>
    </section>
  );
}
