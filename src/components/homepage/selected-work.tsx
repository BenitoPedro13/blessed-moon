"use client";

import { motion } from "motion/react";

import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { useSound } from "@/components/sound-provider";

const PROJECTS = [
  {
    name: "markado",
    description:
      "Booking website — one link, a slot, a payment, handled automatically.",
  },
  {
    name: "Bee Dash",
    description: "Marketing dashboard, numbers pulled in automatically.",
  },
  {
    name: "suamesafit",
    description: "Custom storefront, Shopify underneath.",
  },
] as const;

export function SelectedWork() {
  const { playHover } = useSound();

  return (
    <section data-ascii-keyframe="3" className="px-7 py-16 sm:py-20">
      <SectionHeading number="04" label="SELECTED WORK" />
      <div className="flex flex-col gap-px border border-border/60 bg-border/60">
        {PROJECTS.map((project, i) => (
          <motion.div
            key={project.name}
            className="relative bg-background/55 px-6 py-6 backdrop-blur-sm"
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
              variants={{ hover: { x: 4 } }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Reveal className="flex items-start gap-5" delay={i * 0.09}>
                <div className="hidden h-[84px] w-[130px] flex-none items-center justify-center border border-border/60 text-center font-mono text-[7px] text-muted-foreground/60 sm:flex">
                  [ visual ]
                </div>
                <div>
                  <h3 className="mb-1.5 font-sans text-[15px] text-foreground">
                    {project.name}
                  </h3>
                  <p className="max-w-lg text-[11.5px] leading-[1.5] text-muted-foreground">
                    {project.description}
                  </p>
                </div>
              </Reveal>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
