"use client";

import { motion } from "motion/react";

import { COUNT_DISPLAY, COUNT_INLINE } from "@/components/homepage/morph-count";
import { MorphToken, morphDrift } from "@/components/scroll-morph-stage";
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

/**
 * Layer 1. Receives the **8** from About — it lands here as the display
 * numeral directly above the eight-card grid, so the number you just read in
 * a sentence turns out to be the label for the thing it was describing — then
 * hands the **4** on to How We Work.
 *
 * Side-column composition (narrow statement column, wide grid), distinct from
 * About's diagonal split: every section reading as "heading, then content
 * below" is its own kind of monotony.
 */
export function ServicesFocus() {
  const { playHover } = useSound();

  return (
    <div className="w-full px-7 py-14 sm:py-16">
      <div className="lg:grid lg:grid-cols-[0.9fr_2.1fr] lg:items-center lg:gap-12">
        {/* Untransformed: holds both tokens. */}
        <div>
          <div style={morphDrift({ y: 0, x: -34 })}>
            <SectionHeading number="02" label="SERVICES" />
          </div>
          <p className="flex items-end gap-3">
            <MorphToken id="count-8" side="to" className={COUNT_DISPLAY}>
              8
            </MorphToken>
            <span className="pb-1.5 font-sans text-xl font-semibold tracking-[-0.02em] text-foreground sm:text-2xl">
              kinds of systems.
            </span>
          </p>
          <p className="mt-5 max-w-sm text-[14px] leading-[1.6] text-muted-foreground">
            Different shape, same standard — one senior partnership across all
            eight, not a bench of specialists handed your project in turn.
          </p>
          <p className="mt-4 max-w-sm text-[14px] leading-[1.75] text-muted-foreground">
            Whichever one you need, the build runs the same{" "}
            <MorphToken id="count-4" side="from" className={COUNT_INLINE}>
              4
            </MorphToken>{" "}
            steps.
          </p>
        </div>

        {/* Card padding and description visibility are deliberately smaller at
            the base (mobile, 2-col × 4-row) breakpoint — the sm: scale-up was
            tuned for a 4-col layout; at 2 columns the same padding stacks four
            rows past one pinned viewport, which would trigger the layer's
            overflow-y-auto safety net (a second scroll inside the pin, the
            exact bug this whole redesign exists to keep out). */}
        <div
          className="mt-9 grid grid-cols-2 gap-px border border-border/60 bg-border/60 sm:grid-cols-4 lg:mt-0"
          style={morphDrift({ y: 56, order: 1 })}
        >
          {SERVICES.map((service) => (
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
                <span className="mb-1.5 block font-mono text-[9px] text-muted-foreground/70 sm:mb-3 sm:text-[10px]">
                  {service.index}
                </span>
                <span className="block font-sans text-[13px] text-foreground sm:mb-2 sm:text-base">
                  {service.name}
                </span>
                <span className="hidden text-[12px] leading-[1.55] text-muted-foreground sm:block">
                  {service.description}
                </span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
