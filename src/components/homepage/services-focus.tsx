"use client";

import { motion } from "motion/react";

import { Reveal } from "@/components/reveal";
import { ScrollStage } from "@/components/scroll-stage";
import { SectionHeading } from "@/components/section-heading";
import { useSound } from "@/components/sound-provider";

const SERVICES = [
  {
    index: "01",
    name: "Web Apps",
    description:
      "Full-stack products, built to handle real traffic and real edge cases.",
  },
  {
    index: "02",
    name: "Mobile Apps",
    description:
      "Native-feeling apps for iOS and Android, from one codebase or two.",
  },
  {
    index: "03",
    name: "Landing Pages",
    description:
      "Fast, focused pages built to convert — no bloat, no dead weight.",
  },
  {
    index: "04",
    name: "Websites",
    description:
      "Marketing sites that load instantly and hold up under real content.",
  },
  {
    index: "05",
    name: "Design Systems",
    description:
      "Component libraries and tokens that keep teams shipping consistently.",
  },
  {
    index: "06",
    name: "Branding",
    description:
      "Identity systems — mark, type, voice — built to outlast a rebrand cycle.",
  },
  {
    index: "07",
    name: "E-Commerces",
    description:
      "Storefronts wired to real inventory, payments, and fulfillment.",
  },
  {
    index: "08",
    name: "Dashboards",
    description:
      "Dense data made legible — the numbers that actually run the business.",
  },
] as const;

export function ServicesFocus() {
  const { playHover } = useSound();

  return (
    <section
      id="services"
      data-ascii-keyframe="2"
      data-frame-label="SERVICES"
      className="relative"
    >
      <ScrollStage heightMultiplier={1.6} particles>
        <div
          style={{
            opacity: "calc(1 - var(--stage-progress, 0))",
            transform: "scale(calc(1 - var(--stage-progress, 0) * 0.12))",
          }}
          className="w-full px-7 py-16 sm:py-20"
        >
          <Reveal>
            <SectionHeading number="02" label="SERVICES" />
          </Reveal>
          {/* The grid used to appear with no framing at all — a bare list
              of eight names. This line is the question the grid answers,
              not decoration; without it "Web Apps, Mobile Apps, Landing
              Pages..." reads as a menu rather than a scope statement. */}
          <Reveal delay={0.05}>
            <p className="mb-6 max-w-xl text-[13px] leading-[1.55] text-muted-foreground">
              Eight kinds of systems. Different shape, same standard — built
              by the same senior partnership end to end, not handed off
              between teams that never talk to each other.
            </p>
          </Reveal>
          <div className="grid grid-cols-2 gap-px border border-border/60 bg-border/60 sm:grid-cols-4">
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.index}
                className="relative bg-background/55 px-4 py-5 backdrop-blur-sm"
                initial={false}
                whileHover="hover"
                onHoverStart={playHover}
              >
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 border border-transparent"
                  variants={{ hover: { borderColor: "var(--primary)" } }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                />
                <motion.div
                  variants={{ hover: { y: -3 } }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Reveal delay={0.1 + i * 0.04}>
                    <span className="mb-2.5 block font-mono text-[9.5px] text-muted-foreground/70">
                      {service.index}
                    </span>
                    <span className="mb-1.5 block font-sans text-sm text-foreground">
                      {service.name}
                    </span>
                    <span className="block text-[11px] leading-[1.5] text-muted-foreground">
                      {service.description}
                    </span>
                  </Reveal>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollStage>
    </section>
  );
}
