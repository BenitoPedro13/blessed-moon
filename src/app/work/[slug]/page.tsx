import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

import { PageCta } from "@/components/page-cta";
import { PageHero } from "@/components/page-hero";
import { ProjectCover, ProjectGallery } from "@/components/project-media";
import { ProjectVisual } from "@/components/project-visual";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { getStudioProject, STUDIO_PROJECTS } from "@/lib/studio-data";
import { SITE_URL } from "@/lib/site-config";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return STUDIO_PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getStudioProject(slug);

  if (!project) return {};

  const title = `${project.title} case study`;
  const description = `${project.description} ${project.outcome}`;
  const url = `${SITE_URL}/work/${project.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: "Blessed Moon Studio",
      images: [
        {
          url: project.cover.src,
          width: project.cover.width,
          height: project.cover.height,
          alt: project.cover.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [project.cover.src],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getStudioProject(slug);

  if (!project) notFound();

  const projectIndex = STUDIO_PROJECTS.findIndex((item) => item.slug === project.slug);
  const nextProject = STUDIO_PROJECTS[(projectIndex + 1) % STUDIO_PROJECTS.length];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.tagline,
    description: project.description,
    dateCreated: project.year,
    url: `${SITE_URL}/work/${project.slug}`,
    creator: {
      "@type": "Organization",
      name: "Blessed Moon Studio",
      url: SITE_URL,
    },
    keywords: [...project.tags, ...project.stack].join(", "),
  };

  return (
    <>
      <SiteNav />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <PageHero
          eyebrow={`— Case study ${project.index}`}
          title={project.title}
          description={project.tagline}
          code={`CASE_${project.index}`}
        />

        <section data-ascii-keyframe="1" data-frame-label="PROJECT OVERVIEW" className="px-7 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <Link
                href="/work"
                className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase transition-colors hover:text-primary"
              >
                <ArrowLeft className="size-3" aria-hidden="true" />
                All work
              </Link>
            </Reveal>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
              <Reveal>
                <ProjectCover image={project.cover} title={project.title} />
              </Reveal>

              <Reveal delay={0.1}>
                <div className="flex h-full flex-col justify-between border border-border/60 bg-background/80 p-6 backdrop-blur-sm sm:p-8">
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.12em] text-primary uppercase">
                      project overview
                    </p>
                    <p className="mt-5 text-[14px] leading-[1.8] text-foreground/85">
                      {project.description}
                    </p>
                    <div className="mt-7 border-l border-primary pl-4">
                      <p className="font-mono text-[8.5px] tracking-[0.1em] text-primary uppercase">
                        shipped outcome
                      </p>
                      <p className="mt-2 text-[12.5px] leading-[1.7] text-muted-foreground">
                        {project.outcome}
                      </p>
                    </div>
                  </div>

                  <dl className="mt-10 grid gap-x-6 gap-y-5 border-t border-border/60 pt-6 sm:grid-cols-2">
                    <ProjectFact label="Role" value={project.role} />
                    <ProjectFact label="Timeline" value={project.timeline} />
                    <ProjectFact label="Year" value={project.year} />
                    <ProjectFact label="Team" value={project.team} />
                  </dl>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section data-ascii-keyframe="2" data-frame-label="CASE STUDY" className="border-y border-border/60 bg-background/55 px-7 py-16 backdrop-blur-sm sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-px border border-border/60 bg-border/60 lg:grid-cols-3">
            <CaseTextBlock index="01" label="The problem" body={project.problem} />
            <CaseTextBlock index="02" label="The approach" body={project.approach} />
            <CaseTextBlock index="03" label="The result" body={project.outcome} />
          </div>
        </section>

        <section data-ascii-keyframe="3" data-frame-label="INTERFACE EVIDENCE" className="px-7 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <SectionIntro
                eyebrow="— Interface evidence"
                title="The product, not a placeholder"
                body="These are the verified interface captures from the project build. Scroll inside taller frames to inspect each complete page."
              />
            </Reveal>
            <div className="mt-10">
              <ProjectGallery images={project.screenshots} title={project.title} />
            </div>
          </div>
        </section>

        <section data-ascii-keyframe="4" data-frame-label="DELIVERY PROCESS" className="border-y border-border/60 bg-background/55 px-7 py-16 backdrop-blur-sm sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <SectionIntro
                eyebrow="— Delivery process"
                title="From operating constraint to shipped system"
                body="The work is sequenced around risk. Domain rules and failure states come before interface polish; automation arrives before handoff."
              />
            </Reveal>

            <div className="mt-10 grid gap-px border border-border/60 bg-border/60 sm:grid-cols-2 lg:grid-cols-4">
              {project.process.map((step, index) => (
                <Reveal key={step.phase} delay={index * 0.06}>
                  <article className="h-full bg-background/90 p-6">
                    <span className="font-mono text-[9px] tracking-[0.12em] text-primary">
                      {step.phase}
                    </span>
                    <h2 className="mt-8 font-sans text-xl font-semibold tracking-[-0.025em] text-foreground">
                      {step.title}
                    </h2>
                    <p className="mt-3 text-[12px] leading-[1.7] text-muted-foreground">
                      {step.body}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section data-ascii-keyframe="5" data-frame-label="SYSTEM ARCHITECTURE" className="px-7 py-16 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
            <Reveal>
              <div>
                <SectionIntro
                  eyebrow="— System architecture"
                  title="Clear boundaries, explicit responsibilities"
                  body="Each layer has one job and a narrow contract. That keeps external services replaceable and product behavior testable."
                />
                <div className="mt-8 flex flex-wrap gap-2">
                  {project.stack.map((technology) => (
                    <span
                      key={technology}
                      className="border border-border/80 bg-background/70 px-2.5 py-1.5 font-mono text-[8.5px] tracking-[0.06em] text-muted-foreground uppercase"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
                <div className="mt-8">
                  <ProjectVisual title={project.title} variant={project.visual} />
                </div>
              </div>
            </Reveal>

            <div className="border border-border/60 bg-background/85">
              {project.architecture.map((item, index) => (
                <Reveal key={item.layer} delay={index * 0.06}>
                  <div className="grid gap-3 border-b border-border/60 p-5 last:border-b-0 sm:grid-cols-[7rem_1fr] sm:p-6">
                    <span className="font-mono text-[8.5px] tracking-[0.1em] text-primary uppercase">
                      {item.layer}
                    </span>
                    <div>
                      <h2 className="font-sans text-base font-semibold text-foreground">
                        {item.label}
                      </h2>
                      <p className="mt-1.5 text-[11.5px] leading-[1.65] text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section data-ascii-keyframe="5" data-frame-label="WHAT SHIPPED" className="border-t border-border/60 bg-background/55 px-7 py-16 backdrop-blur-sm sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <DetailList
                eyebrow="— What shipped"
                title="Product capabilities"
                items={project.features}
              />
              <DetailList
                eyebrow="— Engineering pressure"
                title="Challenges resolved"
                items={project.challenges}
              />
            </div>

            <Reveal>
              <div className="mt-16 flex flex-col gap-8 border-y border-border/60 py-8 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-mono text-[8.5px] tracking-[0.1em] text-muted-foreground uppercase">
                    verified project destinations
                  </p>
                  <div className="mt-3 flex flex-wrap gap-5">
                    {project.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-[9.5px] tracking-[0.08em] text-primary uppercase transition-colors hover:text-foreground"
                      >
                        {link.label}
                        <ArrowUpRight className="size-3" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/work/${nextProject.slug}`}
                  className="group inline-flex items-center justify-between gap-8 border border-primary/50 px-5 py-4 transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <span>
                    <span className="block font-mono text-[8px] tracking-[0.1em] text-muted-foreground uppercase group-hover:text-primary-foreground/70">
                      next case study
                    </span>
                    <span className="mt-1 block font-sans text-base font-semibold">
                      {nextProject.title}
                    </span>
                  </span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        <div className="px-7 pb-16">
          <div className="mx-auto max-w-6xl">
            <PageCta
              keyframe="5"
              title="Need a system this deliberate?"
              description="Bring the operating problem. We will shape it into a clear product brief and a buildable next step."
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function ProjectFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[8px] tracking-[0.1em] text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-1.5 text-[11.5px] text-foreground/80">{value}</dd>
    </div>
  );
}

function CaseTextBlock({ index, label, body }: { index: string; label: string; body: string }) {
  return (
    <Reveal>
      <article className="h-full bg-background/90 p-6 sm:p-8">
        <div className="flex items-center justify-between font-mono text-[8.5px] tracking-[0.1em] uppercase">
          <span className="text-primary">{label}</span>
          <span className="text-muted-foreground">{index}</span>
        </div>
        <p className="mt-8 text-[12.5px] leading-[1.8] text-foreground/80">{body}</p>
      </article>
    </Reveal>
  );
}

function SectionIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-[9px] tracking-[0.12em] text-primary uppercase">{eyebrow}</p>
      <h2 className="mt-4 font-sans text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 max-w-xl text-[12.5px] leading-[1.75] text-muted-foreground">{body}</p>
    </div>
  );
}

function DetailList({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: readonly { title: string; body: string }[];
}) {
  return (
    <Reveal>
      <div>
        <p className="font-mono text-[9px] tracking-[0.12em] text-primary uppercase">{eyebrow}</p>
        <h2 className="mt-4 font-sans text-3xl font-semibold tracking-[-0.035em] text-foreground">
          {title}
        </h2>
        <div className="mt-8 border-t border-border/60">
          {items.map((item, index) => (
            <article key={item.title} className="grid gap-3 border-b border-border/60 py-5 sm:grid-cols-[2rem_1fr]">
              <span className="font-mono text-[8.5px] text-primary">0{index + 1}</span>
              <div>
                <h3 className="font-sans text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-[11.5px] leading-[1.7] text-muted-foreground">{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
