import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { ScrollMorphStage } from "@/components/scroll-morph-stage";
import { AboutTeaser } from "@/components/homepage/about-teaser";
import { ClosingCta } from "@/components/homepage/closing-cta";
import { Hero } from "@/components/homepage/hero";
import { HowWeWork } from "@/components/homepage/how-we-work";
import { PricingTable } from "@/components/homepage/pricing-table";
import { SelectedWork } from "@/components/homepage/selected-work";
import { ServicesFocus } from "@/components/homepage/services-focus";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main className="flex flex-col">
        {/* Hero and the closing CTA keep their own pins. Hero's scroll-linked
            ParticleText gather is the page's one thesis moment and shouldn't
            be diluted into a shared sequence; the CTA is the landing beat,
            with its own ParticleObject. The five beats between them are the
            journey, and they now share ONE pinned frame.

            Why one frame: each of those five used to be its own ScrollStage,
            and two independently-pinned full-viewport panels are never
            simultaneously on screen — section A's sticky panel releases the
            exact instant B's begins. Adjusting A's fade curve makes the cut
            feel better but can never make it a morph, because there is no
            moment when an element could exist in both. Mounted together in
            one frame, they overlap for real, which is what lets a single
            numeral physically travel between them: 8 kinds of systems → 4
            steps → 3 in production → 1 number. See
            TASK-homepage-morph-redesign.md. */}
        <Hero />
        <hr className="border-border/60" />
        {/* `width` per layer is what makes the window itself morph: it eases
            between neighbours as you scroll, so the terminal expands for the
            wide grids and contracts hard for Pricing, whose restraint is the
            content. One window, five views — not five windows. */}
        <ScrollMorphStage
          heightPerLayer={1.6}
          layers={[
            { number: "01", keyframe: 1, label: "ABOUT", width: 900, content: <AboutTeaser /> },
            { number: "02", id: "services", keyframe: 2, label: "SERVICES", width: 1120, content: <ServicesFocus /> },
            { number: "03", keyframe: 2, label: "PROCESS", width: 980, content: <HowWeWork /> },
            { number: "04", keyframe: 3, label: "SELECTED WORK", width: 1120, content: <SelectedWork /> },
            { number: "05", id: "pricing", keyframe: 4, label: "PRICING", width: 660, content: <PricingTable /> },
          ]}
        />
        <hr className="border-border/60" />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  );
}
