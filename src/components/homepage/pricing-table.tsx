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
          <div className="flex flex-col">
            {TIERS.map((tier, i) => (
              <motion.div
                key={tier.name}
                className={`-mx-3 px-3 py-3.5 text-[12.5px] ${
                  i < TIERS.length - 1 ? "border-b border-border/60" : ""
                }`}
                initial={false}
                whileHover={{ backgroundColor: "var(--accent)", x: 4 }}
                onHoverStart={playHover}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
              >
                <Reveal
                  className="flex items-baseline justify-between gap-4"
                  delay={0.06 + i * 0.07}
                >
                  <span className="font-sans text-[13.5px] text-foreground">
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
