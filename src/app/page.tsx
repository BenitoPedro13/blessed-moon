import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
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
        {/* Every section below used to live inside one terminal-framed
            ParticleScroll panel with its own independent internal scroll,
            separate from the page's own — see TASK-homepage-unify-scroll.md
            for why that got removed: two disconnected scroll contexts was a
            real, repeated point of confusion, and a box that has to stay
            shorter than its content put a hard cap on how much room any
            section could have. Each section now pins itself via ScrollStage
            (same pattern as Hero) in normal document flow, one scroll
            context for the whole page — matching how /about, /work, and
            /contact already work. */}
        <Hero />
        <hr className="border-border/60" />
        <AboutTeaser />
        <hr className="border-border/60" />
        <ServicesFocus />
        <hr className="border-border/60" />
        <HowWeWork />
        <hr className="border-border/60" />
        <SelectedWork />
        <hr className="border-border/60" />
        <PricingTable />
        <hr className="border-border/60" />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  );
}
