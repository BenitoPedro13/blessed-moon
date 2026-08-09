import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { PageCta } from "@/components/page-cta";
import { PageHero } from "@/components/page-hero";
import { ProjectCover } from "@/components/project-media";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { STUDIO_PROJECTS } from "@/lib/studio-data";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected digital products from Blessed Moon Studio: scheduling, marketing analytics, and headless commerce systems built for real operations.",
};

export default function WorkPage() {
  return (
    <>
      <SiteNav />
      <main>
        <PageHero
          eyebrow="— Selected work"
          title="Selected Work"
          description="Built to last longer than the brief. Three systems where product clarity, interface craft, and reliable engineering had to arrive together."
          code="WORK"
        />

        <div className="mx-auto max-w-6xl px-7">
          {STUDIO_PROJECTS.map((project, index) => (
            <article
              key={project.slug}
              id={project.slug}
              data-ascii-keyframe={String(index + 2)}
              className="grid gap-8 border-b border-border/60 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:py-24"
            >
              <Reveal>
                <ProjectCover image={project.cover} title={project.title} />
              </Reveal>

              <div className="flex flex-col justify-between border border-border/60 bg-background/85 p-6 backdrop-blur-sm sm:p-8">
                <div>
                  <Reveal delay={0.06}>
                    <div className="flex items-center justify-between gap-4 font-mono text-[9px] tracking-[0.12em] text-muted-foreground uppercase">
                      <span>{project.index} / case study</span>
                      <span>{project.year}</span>
                    </div>
                    <h2 className="mt-5 font-sans text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl">
                      {project.title}
                    </h2>
                    <p className="mt-5 max-w-xl text-[13px] leading-[1.75] text-muted-foreground">
                      {project.description}
                    </p>
                  </Reveal>

                  <Reveal delay={0.12}>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-border/80 bg-background/60 px-2.5 py-1.5 font-mono text-[8.5px] tracking-[0.06em] text-muted-foreground uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Reveal>

                  <Reveal delay={0.18}>
                    <div className="mt-8 border-l border-primary pl-4">
                      <p className="font-mono text-[8.5px] tracking-[0.1em] text-primary uppercase">
                        shipped outcome
                      </p>
                      <p className="mt-2 max-w-xl text-[12.5px] leading-[1.7] text-foreground/80">
                        {project.outcome}
                      </p>
                    </div>
                  </Reveal>
                </div>

                <Reveal delay={0.24}>
                  <div className="mt-10 border-t border-border/60 pt-5">
                    <dl className="grid gap-5 text-[10.5px] sm:grid-cols-3">
                      <div>
                        <dt className="font-mono text-[8px] tracking-[0.1em] text-muted-foreground uppercase">
                          role
                        </dt>
                        <dd className="mt-1.5 text-foreground/80">{project.role}</dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[8px] tracking-[0.1em] text-muted-foreground uppercase">
                          timeline
                        </dt>
                        <dd className="mt-1.5 text-foreground/80">{project.timeline}</dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[8px] tracking-[0.1em] text-muted-foreground uppercase">
                          system
                        </dt>
                        <dd className="mt-1.5 text-foreground/80">
                          {project.stack.slice(0, 3).join(" · ")}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-6 flex flex-wrap gap-4">
                      <Link
                        href={`/work/${project.slug}`}
                        className="inline-flex items-center gap-1.5 border border-primary bg-primary px-3 py-2.5 font-mono text-[9.5px] tracking-[0.08em] text-primary-foreground uppercase transition-colors hover:bg-transparent hover:text-primary"
                      >
                        View case study
                        <ArrowRight className="size-3" aria-hidden="true" />
                      </Link>
                      {project.links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-1 py-2.5 font-mono text-[9.5px] tracking-[0.08em] text-primary uppercase transition-colors hover:text-foreground"
                        >
                          {link.label}
                          <ArrowUpRight className="size-3" aria-hidden="true" />
                        </a>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>
            </article>
          ))}
        </div>

        <div className="px-7 py-16">
          <div className="mx-auto max-w-6xl">
            <PageCta keyframe="5" />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
