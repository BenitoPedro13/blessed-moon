import type { Metadata } from "next";

import { PageCta } from "@/components/page-cta";
import { PageHero } from "@/components/page-hero";
import { ScrollMorphStage } from "@/components/scroll-morph-stage";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { WorkCase } from "@/components/work/work-case";
import { WorkIndex } from "@/components/work/work-index";
import { STUDIO_PROJECTS } from "@/lib/studio-data";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected digital products from Blessed Moon Studio: scheduling, marketing analytics, headless commerce, credit-qualification, motion portfolios, geospatial farm operations, multi-tenant brand platforms, restaurant menus, and furniture catalogues built for real operations.",
};

export default function WorkPage() {
  return (
    <>
      <SiteNav />
      <main>
        {/* Same outer shape as the homepage: the hero and the CTA keep their
            own pins, and everything between them is one window morphing
            through its views (TASK-subpage-morph-expansion.md). */}
        <PageHero
          eyebrow="— Selected work"
          title="Selected Work"
          description="Built to last longer than the brief. Nine systems where product clarity, interface craft, and reliable engineering had to arrive together."
          code="WORK"
        />

        {/* The window opens narrow on the listing and expands hard for each
            project, where a cover sits beside its meta — the width morph is
            carrying the difference between reading an index and reading an
            entry. `00 / INDEX` is a header record, not one of the seven,
            which is why the projects keep the numbers they carry in the
            listing rather than being renumbered 02–07 by their position
            here. */}
        <ScrollMorphStage
          heightPerLayer={1.6}
          layers={[
            { number: "00", keyframe: 1, label: "INDEX", width: 860, content: <WorkIndex /> },
            ...STUDIO_PROJECTS.map((project, i) => ({
              id: project.slug,
              number: project.index,
              keyframe: i + 2,
              label: project.title.toUpperCase(),
              width: 1140,
              content: (
                <WorkCase
                  project={project}
                  next={STUDIO_PROJECTS[i + 1]}
                  position={i + 1}
                  total={STUDIO_PROJECTS.length}
                />
              ),
            })),
          ]}
        />

        <PageCta keyframe="5" />
      </main>
      <SiteFooter />
    </>
  );
}
