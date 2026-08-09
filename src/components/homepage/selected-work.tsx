"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

import { Reveal } from "@/components/reveal";
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
              <Link
                href={`/work/${project.slug}`}
                onClick={playClick}
                className="block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                aria-label={`View ${project.name} case study`}
              >
                <Reveal className="flex items-start gap-5" delay={i * 0.09}>
                  <div className="relative hidden h-[84px] w-[130px] flex-none overflow-hidden border border-border/60 bg-muted/20 sm:block">
                    <Image
                      src={project.image}
                      alt={project.imageAlt}
                      fill
                      sizes="130px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="mb-1.5 font-sans text-[15px] text-foreground">
                        {project.name}
                      </h3>
                      <ArrowUpRight className="size-3.5 text-primary" aria-hidden="true" />
                    </div>
                    <p className="max-w-lg text-[11.5px] leading-[1.5] text-muted-foreground">
                      {project.description}
                    </p>
                  </div>
                </Reveal>
              </Link>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
