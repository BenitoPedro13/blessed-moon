"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

import { Reveal } from "@/components/reveal";
import { ScrollStage } from "@/components/scroll-stage";
import { SectionHeading } from "@/components/section-heading";
import { useSound } from "@/components/sound-provider";

const PROJECTS = [
  {
    name: "Markado",
    slug: "markado",
    image: "/projects/markado/agendamentos.png",
    imageAlt: "Markado appointments dashboard",
    description:
      "Booking website — one link, a slot, a payment, handled automatically.",
  },
  {
    name: "Bee Dash",
    slug: "bee-dash",
    image: "/projects/bee-dash/home.png",
    imageAlt: "Bee Dash campaign analytics dashboard",
    description: "Marketing dashboard, numbers pulled in automatically.",
  },
  {
    name: "Sua Mesa Fit",
    slug: "sua-mesa-fit",
    image: "/projects/sua-mesa-fit/product-hero.png",
    imageAlt: "Sua Mesa Fit product presentation page",
    description: "Custom storefront, Shopify underneath.",
  },
] as const;

export function SelectedWork() {
  const { playHover, playClick } = useSound();

  return (
    <section
      data-ascii-keyframe="3"
      data-frame-label="SELECTED WORK"
      className="relative"
    >
      <ScrollStage heightMultiplier={1.5} particles>
        <div
          style={{
            opacity: "calc(1 - var(--stage-progress, 0))",
            transform: "scale(calc(1 - var(--stage-progress, 0) * 0.12))",
          }}
          className="w-full px-7 py-16 sm:py-20"
        >
          <Reveal>
            <SectionHeading number="04" label="SELECTED WORK" />
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="max-w-2xl font-sans text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
              Three systems, still in production.
            </h2>
          </Reveal>
          <div className="mt-10 flex flex-col gap-px border border-border/60 bg-border/60 sm:mt-14">
            {PROJECTS.map((project, i) => (
              <motion.div
                key={project.name}
                className="relative bg-background/55 px-6 py-7 backdrop-blur-sm sm:px-8 sm:py-9"
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
                  <Link
                    href={`/work/${project.slug}`}
                    onClick={playClick}
                    className="block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    aria-label={`View ${project.name} case study`}
                  >
                    <Reveal className="flex items-start gap-7" delay={0.16 + i * 0.09}>
                      <div className="relative hidden h-[120px] w-[190px] flex-none overflow-hidden border border-border/60 bg-muted/20 sm:block">
                        <Image
                          src={project.image}
                          alt={project.imageAlt}
                          fill
                          sizes="190px"
                          className="object-cover object-top"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="mb-2 font-sans text-xl text-foreground sm:text-2xl">
                            {project.name}
                          </h3>
                          <ArrowUpRight className="size-4 text-primary" aria-hidden="true" />
                        </div>
                        <p className="max-w-lg text-[13px] leading-[1.55] text-muted-foreground">
                          {project.description}
                        </p>
                      </div>
                    </Reveal>
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollStage>
    </section>
  );
}
