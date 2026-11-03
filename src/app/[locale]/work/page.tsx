
import { getServerI18n, localizedMetadata } from "@/lib/i18n/server";
import type { Metadata } from "next";

import { PageCta } from "@/components/page-cta";
import { PageHero } from "@/components/page-hero";
import { ScrollMorphStage } from "@/components/scroll-morph-stage";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { WorkCase } from "@/components/work/work-case";
import { WorkIndex } from "@/components/work/work-index";
import { STUDIO_PROJECTS } from "@/lib/studio-data";

const pageMetadata: Metadata = {
  title: "Work",
  description:
    "Selected digital products from Blessed Moon Studio: scheduling, marketing analytics, headless commerce, credit-qualification, motion portfolios, geospatial farm operations, multi-tenant brand platforms, restaurant menus, furniture catalogues, university fair registration, a multilingual language-school site, a real-time energy data pipeline and a live public-transport map for Rio, built for real operations.",
};

export async function generateMetadata(): Promise<Metadata> {
  return localizedMetadata(pageMetadata, "/work");
}

export default async function WorkPage() {
  const { t, locale } = await getServerI18n();
  return (
    <>
      <SiteNav />
      <main>
        {/* Same outer shape as the homepage: the hero and the CTA keep their
            own pins, and everything between them is one window morphing
            through its views (TASK-subpage-morph-expansion.md). */}
        <PageHero
          eyebrow={t("— Selected work")}
          title={t("Selected Work")}
          description={locale === "pt" ? `Feito para durar além do briefing. ${STUDIO_PROJECTS.length} sistemas em que clareza de produto, cuidado com a interface e engenharia confiável precisaram caminhar juntos.` : `Built to last longer than the brief. ${STUDIO_PROJECTS.length} systems where product clarity, interface craft, and reliable engineering had to arrive together.`}
          code="WORK"
        />

        {/* The index is a six-column cover grid, so it takes the same width
            as the case views (it used to open narrow on a text listing; see
            TASK-work-index-grid.md). `00 / INDEX` is a header record, not one of the seven,
            which is why the projects keep the numbers they carry in the
            listing rather than being renumbered 02–07 by their position
            here. */}
        <ScrollMorphStage
          heightPerLayer={1}
          layers={[
            { number: "00", keyframe: 1, label: "INDEX", width: 1140, content: <WorkIndex /> },
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
