"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

import { COUNT_DISPLAY, COUNT_INLINE } from "@/components/homepage/morph-count";
import { MorphToken, morphDrift } from "@/components/scroll-morph-stage";
import { useSound } from "@/components/sound-provider";

const PROJECTS = [
  {
    name: "Prumo",
    slug: "prumo",
    image: "/projects/prumo/home.png",
    imageAlt: "Prumo homepage stating the credit-before-apartment order",
    description: "Credit pre-qualification before apartment browsing, for MCMV buyers.",
  },
  {
    name: "ART'hur",
    slug: "art-hur",
    image: "/projects/art-hur/home.png",
    imageAlt: "ART'hur's centered archive stage with the dashed route and walker glyph",
    description: "Motion-led archive for a visual director, one scene at a time.",
  },
  {
    name: "Flora",
    slug: "flora",
    image: "/projects/flora/stress-ndmi.png",
    imageAlt: "Flora Crop Stress screen reading NDMI over a real field boundary",
    description: "Farm operations console reading a real satellite pipeline.",
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
    <div>
      <div className="lg:grid lg:grid-cols-[0.85fr_2.15fr] lg:items-center lg:gap-12">
        {/* Untransformed: holds both tokens. */}
        <div>
          <p className="flex items-baseline gap-3">
            <MorphToken id="count-3" side="to" className={COUNT_DISPLAY}>
              3
            </MorphToken>
            <span className="font-sans text-xl font-semibold tracking-[-0.02em] text-foreground sm:text-2xl">
              still in production.
            </span>
          </p>
          <p className="mt-5 max-w-sm text-[14px] leading-[2.1] text-muted-foreground">
            Every one of them priced the same way:{" "}
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
                    // Held slightly back at rest, full on hover. These are
                    // screenshots of light-UI products, so at full strength
                    // they were the brightest thing in the window — brighter
                    // than the amber token, which inverts the hierarchy the
                    // whole page is built on. Hovering a row is the moment you
                    // actually want to look at the work.
                    className="object-cover object-top opacity-80 transition-all duration-300 group-hover:scale-[1.03] group-hover:opacity-100"
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
