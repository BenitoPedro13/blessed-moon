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
      <ScrollStage heightMultiplier={1.7} particles>
        <div className="w-full px-7 py-14 sm:py-16">
          {/* Side-column composition, not centered-above-a-grid: a narrow
              statement column plus a wide grid reads as an editorial
              spread, distinct from About's diagonal split and from a plain
              "heading, then content below" stack — every section having
              the same shape is its own kind of monotony even once each
              one is individually bigger/bolder. Stacks on mobile — a
              side-by-side split has no room to read as intentional below
              `lg`, same reasoning as About's `lg:`-only grid.

              Each piece below moves on its own schedule as the section's
              pin plays out, instead of one wrapper fading as a block —
              label slides left, headline floats up, paragraph sinks down,
              grid follows slightly delayed. Same `--stage-progress` CSS
              variable everything else in this scroll system already reads
              (ScrollStage, ScrollParticles), just with a different
              coefficient/direction per element — this is the "components
              move independently, not just fade" request, built without a
              new dependency (checked React Bits' ScrollFloat/ScrollReveal
              first; both are GSAP+ScrollTrigger, which would mean a second
              animation library running alongside Motion for something this
              CSS-variable approach already covers). */}
          <div className="lg:grid lg:grid-cols-[0.85fr_2.15fr] lg:items-center lg:gap-12">
            <div>
              <Reveal>
                <div
                  style={{
                    opacity: "calc(1 - var(--stage-progress, 0))",
                    transform: "translateX(calc(var(--stage-progress, 0) * -32px))",
                  }}
                >
                  <SectionHeading number="02" label="SERVICES" />
                </div>
              </Reveal>
              <Reveal delay={0.05}>
                <h2
                  style={{
                    opacity: "calc(1 - var(--stage-progress, 0))",
                    transform:
                      "translateY(calc(var(--stage-progress, 0) * -36px)) scale(calc(1 - var(--stage-progress, 0) * 0.08))",
                  }}
                  className="max-w-md font-sans text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl"
                >
                  Different shape. Same standard.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p
                  style={{
                    opacity: "calc(1 - var(--stage-progress, 0))",
                    transform: "translateY(calc(var(--stage-progress, 0) * 28px))",
                  }}
                  className="mt-4 max-w-sm text-[14px] leading-[1.6] text-muted-foreground"
                >
                  Eight kinds of systems, built by the same senior partnership
                  end to end — not handed off between teams that never talk to
                  each other.
                </p>
              </Reveal>
            </div>
            {/* Card padding/description visibility is deliberately
                smaller at the base (mobile, 2-col × 4-row) breakpoint —
                the sm:px-6 sm:py-7 scale-up was tuned assuming a 4-col
                layout; at 2 columns the same padding stacks four full
                rows tall enough to exceed one pinned viewport, triggering
                ScrollStage's overflow-y-auto safety net (a second,
                independent scroll inside the pin — see selected-work.tsx
                for the same bug and the fuller explanation). Hiding the
                description below `sm` keeps each row short instead of
                needing that fallback at all. */}
            <div className="mt-8 grid grid-cols-2 gap-px border border-border/60 bg-border/60 sm:grid-cols-4 lg:mt-0">
              {SERVICES.map((service, i) => (
                <motion.div
                  key={service.index}
                  className="relative bg-background/55 px-3.5 py-4 backdrop-blur-sm sm:px-6 sm:py-7"
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
                      <span className="mb-1.5 block font-mono text-[9px] text-muted-foreground/70 sm:mb-3 sm:text-[10px]">
                        {service.index}
                      </span>
                      <span className="block font-sans text-[13px] text-foreground sm:mb-2 sm:text-base">
                        {service.name}
                      </span>
                      <span className="hidden text-[12px] leading-[1.55] text-muted-foreground sm:block">
                        {service.description}
                      </span>
                    </Reveal>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </ScrollStage>
    </section>
  );
}
