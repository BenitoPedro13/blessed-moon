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
      <ScrollStage heightMultiplier={1.2} particles>
        <div
          style={{
            opacity: "calc(1 - var(--stage-progress, 0))",
            transform: "scale(calc(1 - var(--stage-progress, 0) * 0.12))",
          }}
          className="w-full px-7 py-16 sm:py-20"
        >
          <Reveal>
            <SectionHeading number="05" label="PRICING" />
          </Reveal>
          {/* Deliberately calmer than Services/Selected Work — Pricing is
              the "quiet confidence" beat, not another loud statement. A
              short line, not a big headline, matching the section's own
              restraint (no fixed numbers, per docs/design-handoff.md). */}
          <Reveal delay={0.05}>
            <p className="max-w-lg text-[14px] leading-[1.6] text-muted-foreground">
              Priced like the work it actually is — project-based, confirmed
              on a call, never a number pulled from a rate card.
            </p>
          </Reveal>
          <div className="mt-10 flex max-w-2xl flex-col sm:mt-12">
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
