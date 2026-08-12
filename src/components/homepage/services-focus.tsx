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
              of eight names, at a scale that read as small text lost in a
              mostly-empty pinned frame. A real statement (not particle-
              text — that's About and Hero's specific move; variety matters
              more than repeating the same effect everywhere) plus a
              shorter supporting line gives the grid the same visual weight
              Hero and About now have. */}
          <Reveal delay={0.05}>
            <h2 className="max-w-3xl font-sans text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl md:text-[2.75rem]">
              Different shape. Same standard.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-xl text-[14px] leading-[1.6] text-muted-foreground">
              Eight kinds of systems, built by the same senior partnership end
              to end — not handed off between teams that never talk to each
              other.
            </p>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-px border border-border/60 bg-border/60 sm:grid-cols-4 sm:mt-10">
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.index}
                className="relative bg-background/55 px-5 py-6 backdrop-blur-sm sm:px-6 sm:py-7"
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
                  <Reveal delay={0.16 + i * 0.04}>
                    <span className="mb-3 block font-mono text-[10px] text-muted-foreground/70">
                      {service.index}
                    </span>
                    <span className="mb-2 block font-sans text-base text-foreground">
                      {service.name}
                    </span>
                    <span className="block text-[12px] leading-[1.55] text-muted-foreground">
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
