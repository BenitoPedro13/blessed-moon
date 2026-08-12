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
            transform: "scale(calc(1 - var(--stage-progress, 0) * 0.1))",
          }}
          className="w-full px-7 py-10 sm:py-12"
        >
          <Reveal>
            <SectionHeading number="04" label="SELECTED WORK" />
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="max-w-2xl font-sans text-2xl font-semibold tracking-[-0.02em] text-foreground sm:text-3xl">
              Three systems, still in production.
            </h2>
          </Reveal>
          {/* Alternating image-forward rows, not a uniform bordered-card
              list — image-left/text-right, then reversed, then reversed
              again. Real editorial-spread rhythm instead of a stack of
              identical rows.

              Image height is a FIXED size (h-32/h-40/h-44), not aspect-
              ratio-driven flex-1 — that version sized images relative to
              half the row's width, which on a wide viewport at a 4:3 ratio
              produced tall enough images that all three rows together
              exceeded one pinned viewport height, silently triggering
              ScrollStage's overflow-y-auto safety net — a second,
              independent scroll context inside the pin, the exact bug this
              whole pass removed ParticleScroll to fix. Fixed height keeps
              total content height predictable regardless of viewport
              width, so all three actually fit in the frame at once. */}
          <div className="mt-6 flex flex-col gap-5 sm:mt-8 sm:gap-6">
            {PROJECTS.map((project, i) => (
              <motion.div key={project.name} initial={false} onHoverStart={playHover}>
                <Link
                  href={`/work/${project.slug}`}
                  onClick={playClick}
                  className={`group flex items-center gap-5 focus-visible:outline-none sm:gap-7 ${
                    i % 2 === 1 ? "flex-row-reverse" : ""
                  }`}
                  aria-label={`View ${project.name} case study`}
                >
                  <Reveal
                    delay={0.1 + i * 0.08}
                    className="relative h-24 w-36 flex-none overflow-hidden border border-border/60 bg-muted/20 transition-colors group-focus-visible:border-primary group-hover:border-primary/60 sm:h-32 sm:w-48"
                  >
                    <Image
                      src={project.image}
                      alt={project.imageAlt}
                      fill
                      sizes="(min-width: 640px) 192px, 144px"
                      className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </Reveal>
                  <div className="min-w-0 flex-1">
                    <Reveal delay={0.15 + i * 0.08}>
                      <span className="block font-mono text-[9.5px] tracking-[0.1em] text-muted-foreground/70 uppercase">
                        Project 0{i + 1}
                      </span>
                      <div className="mt-1.5 flex items-center gap-2.5">
                        <h3 className="font-sans text-xl text-foreground sm:text-2xl">
                          {project.name}
                        </h3>
                        <ArrowUpRight
                          className="size-4 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      </div>
                      <p className="mt-1.5 max-w-sm text-[12.5px] leading-[1.5] text-muted-foreground">
                        {project.description}
                      </p>
                    </Reveal>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollStage>
    </section>
  );
}
