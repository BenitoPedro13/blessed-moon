import type { Metadata } from "next";

import { PageCta } from "@/components/page-cta";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

export const metadata: Metadata = {
  title: "About",
  description:
    "Blessed Moon Studio combines strategy, brand identity, enterprise architecture, and full-stack development in one direct senior partnership.",
};

const VALUES = [
  "Clarity",
  "Craft",
  "Integrity",
  "Quiet confidence",
  "Long-term thinking",
  "Respect for attention and time",
] as const;

const PILLARS = [
  {
    id: "A",
    title: "Client Consultation, Strategy & Brand Identity",
    lead: "M D R",
    paragraphs: [
      "Serving as your primary partner for high-level consultations, ideation, and project-scoping sessions.",
      "This pillar directs the commercial growth strategy, market positioning, and corporate visual architecture.",
      "Every interface is engineered around conversion-focused UI/UX layouts, ensuring your product resonates deeply with international audiences while maintaining a hardened, secure infrastructure from the front-end up.",
    ],
  },
  {
    id: "B",
    title: "Enterprise Architecture & Full-Stack Development",
    lead: "Benito Pedro Xavier",
    paragraphs: [
      "Directing the heavy programmatic mechanics, server-side infrastructure, and database ecosystems.",
      "This pillar constructs enterprise-grade software frameworks capable of cross-border scaling.",
      "By developing custom API architectures and deep multi-language software logic, this engine ensures that the invisible foundations of your web application are lightning-fast, ultra-secure, and endlessly adaptable to future business requirements.",
    ],
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <SiteNav />
      <main>
        <PageHero
          eyebrow="— About"
          title="About Blessed Moon Studio"
          description="We develop, design and execute advanced software programs. With our innovative technology we resolve cases and help clients world-wide."
          code="ABOUT"
        />

        <section
          data-ascii-keyframe="2"
          className="border-b border-border/60 bg-background/70 px-7 py-16 backdrop-blur-sm sm:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <p className="font-mono text-[9.5px] tracking-[0.12em] text-primary uppercase">
                01 / operating principle
              </p>
              <h2 className="mt-4 max-w-2xl font-sans text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
                Technology that works with quiet excellence.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 flex max-w-4xl flex-wrap gap-2">
                {VALUES.map((value) => (
                  <span
                    key={value}
                    className="border border-border/80 bg-background/55 px-3 py-2 font-mono text-[9px] tracking-[0.06em] text-muted-foreground backdrop-blur-sm"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section data-ascii-keyframe="3" className="px-7 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <p className="font-mono text-[9.5px] tracking-[0.12em] text-primary uppercase">
                02 / how we&apos;re structured
              </p>
            </Reveal>

            <div className="mt-8 grid border border-border/60 bg-border/60 lg:grid-cols-2 lg:gap-px">
              {PILLARS.map((pillar, index) => (
                <div
                  key={pillar.id}
                  className={`bg-background/75 p-7 backdrop-blur-sm sm:p-10 ${
                    index === 0 ? "border-b border-border/60 lg:border-b-0" : ""
                  }`}
                >
                  <Reveal delay={index * 0.1}>
                    <div className="flex items-center justify-between gap-4 font-mono text-[8.5px] tracking-[0.12em] text-muted-foreground uppercase">
                      <span>Pillar {pillar.id}</span>
                      <span>executive / direct</span>
                    </div>
                    <h2 className="mt-8 max-w-lg font-sans text-2xl font-semibold tracking-[-0.025em] text-foreground">
                      {pillar.title}
                    </h2>
                    <p className="mt-3 font-mono text-[9px] tracking-[0.08em] text-primary uppercase">
                      Executive Lead — {pillar.lead}
                    </p>
                    <div className="mt-8 space-y-4">
                      {pillar.paragraphs.map((paragraph) => (
                        <p
                          key={paragraph}
                          className="max-w-xl text-[12.5px] leading-[1.72] text-muted-foreground"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          data-ascii-keyframe="4"
          className="border-y border-border/60 bg-background/55 px-7 py-16 backdrop-blur-sm sm:py-20"
        >
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.45fr_1fr]">
            <Reveal>
              <p className="font-mono text-[9.5px] tracking-[0.12em] text-primary uppercase">
                03 / why choose our dynamic
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-3xl font-sans text-xl leading-[1.55] tracking-[-0.015em] text-foreground/90 sm:text-2xl">
                By structuring our agency as a specialized duo, we eliminate layers of corporate bureaucracy. You consult directly with the executives executing your vision, ensuring rapid deployment, seamless communication, and a digital product that is both commercially dominant and technically unshakeable.
              </p>
            </Reveal>
          </div>
        </section>

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
