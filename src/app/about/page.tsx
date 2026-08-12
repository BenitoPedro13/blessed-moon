import type { Metadata } from "next";

import { AboutDynamic } from "@/components/about/about-dynamic";
import { AboutPillar } from "@/components/about/about-pillar";
import { AboutPrinciple } from "@/components/about/about-principle";
import { PageCta } from "@/components/page-cta";
import { PageHero } from "@/components/page-hero";
import { ScrollMorphStage } from "@/components/scroll-morph-stage";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { STUDIO_PILLARS } from "@/lib/studio-data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Blessed Moon Studio combines strategy, brand identity, enterprise architecture, and full-stack development in one direct senior partnership.",
};

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

        {/* One window, four views, with `A → B → 0` traveling through them —
            the page's own motif, not the homepage's count
            (TASK-subpage-morph-expansion.md §2.3). The window widens for the
            pillars, which are the only two-column views here, and contracts
            hard for the closing claim. */}
        <ScrollMorphStage
          heightPerLayer={1.6}
          layers={[
            {
              number: "01",
              keyframe: 1,
              label: "PRINCIPLE",
              width: 860,
              content: <AboutPrinciple />,
            },
            ...STUDIO_PILLARS.map((pillar, i) => ({
              number: String(i + 2).padStart(2, "0"),
              keyframe: i + 2,
              label: `PILLAR ${pillar.id}`,
              width: 1020,
              content: <AboutPillar pillar={pillar} />,
            })),
            {
              number: "04",
              keyframe: 4,
              label: "THE DYNAMIC",
              width: 720,
              content: <AboutDynamic />,
            },
          ]}
        />

        <PageCta keyframe="5" />
      </main>
      <SiteFooter />
    </>
  );
}
