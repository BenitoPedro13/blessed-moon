import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { AboutTeaser } from "@/components/homepage/about-teaser";
import { Hero } from "@/components/homepage/hero";
import { HowWeWork } from "@/components/homepage/how-we-work";
import { PricingTable } from "@/components/homepage/pricing-table";
import { SelectedWork } from "@/components/homepage/selected-work";
import { ServicesGrid } from "@/components/homepage/services-grid";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main className="flex flex-col">
        <Hero />
        <hr className="border-border/60" />
        <AboutTeaser />
        <hr className="border-border/60" />
        <ServicesGrid />
        <hr className="border-border/60" />
        <HowWeWork />
        <hr className="border-border/60" />
        <SelectedWork />
        <hr className="border-border/60" />
        <PricingTable />
      </main>
      <SiteFooter />
    </>
  );
}
