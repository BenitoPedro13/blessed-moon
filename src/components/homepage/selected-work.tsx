"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

import { COUNT_DISPLAY, COUNT_INLINE } from "@/components/homepage/morph-count";
import { MorphToken, morphDrift } from "@/components/scroll-morph-stage";
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

/**
 * Layer 3. Receives the **3** How We Work just claimed and immediately shows
 * the three — the token stops being an assertion and becomes evidence. Hands
 * the **1** on to Pricing.
 *
 * Alternating image-forward rows, not a uniform card list: image-left, then
 * reversed, then reversed again. Image heights are FIXED (h-24/h-32), never
 * aspect-ratio-driven off a flex width — that version sized images against
 * half the row's width, so on a wide viewport all three rows together
 * exceeded one pinned viewport and silently opened a second scroll context
 * inside the pin. Fixed heights keep total content height predictable
 * regardless of viewport width.
 */
export function SelectedWork() {
  const { playHover, playClick } = useSound();

  return (
    <div className="w-full px-7 py-10 sm:py-12">
      <div className="lg:grid lg:grid-cols-[0.85fr_2.15fr] lg:items-center lg:gap-12">
        {/* Untransformed: holds both tokens. */}
        <div>
          <div style={morphDrift({ y: 0, x: -34 })}>
            <SectionHeading number="04" label="SELECTED WORK" />
          </div>
          <p className="flex items-end gap-3">
            <MorphToken id="count-3" side="to" className={COUNT_DISPLAY}>
              3
            </MorphToken>
            <span className="pb-1.5 font-sans text-xl font-semibold tracking-[-0.02em] text-foreground sm:text-2xl">
              still in production.
            </span>
          </p>
          <p className="mt-5 max-w-sm text-[14px] leading-[1.75] text-muted-foreground">
            Every one of them priced the same way — a single{" "}
            <MorphToken id="count-1" side="from" className={COUNT_INLINE}>
              1
            </MorphToken>{" "}
            number, agreed before a line was written.
          </p>
        </div>

        <div
          className="mt-8 flex flex-col gap-5 sm:gap-6 lg:mt-0"
          style={morphDrift({ y: 52, order: 1 })}
        >
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
                <div className="relative h-24 w-36 flex-none overflow-hidden border border-border/60 bg-muted/20 transition-colors group-focus-visible:border-primary group-hover:border-primary/60 sm:h-32 sm:w-48">
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    sizes="(min-width: 640px) 192px, 144px"
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="min-w-0 flex-1">
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
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
