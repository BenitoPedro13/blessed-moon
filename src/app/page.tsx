import { ParticleScroll } from "@/components/canvasui/ParticleScroll";
import { HtmlInCanvasNotice } from "@/components/html-in-canvas-notice";
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
        <Hero />
        <hr className="border-border/60" />
        <div className="px-7 py-10 sm:py-14">
          {/* Everything below Hero lives inside one terminal-framed panel
              that dissolves into sand and reassembles as it scrolls — the
              signature move for this half of the page, the way the ASCII
              moon is Hero's. Needs an explicit height (not just "fits its
              content") for two reasons: ParticleScroll's dissolve effect
              only activates when this box is genuinely shorter than its
              content (real internal scroll for it to react to), and its own
              wrapper collapses to 0x0 without one, since in the real
              (non-fallback) capture mode the actual children move into an
              absolutely-positioned canvas, out of normal document flow.

              Tried driving this panel's internal scrollTop programmatically
              from an outer ScrollStage pin instead of native wheel input —
              reverted. It visibly corrupted the html-in-canvas capture
              (overlapping/ghosted content from more than one scroll
              position rendered at once) and froze page scroll partway
              through, worse than the UX problem it was meant to fix. Likely
              cause: `content` here renders inside a `<canvas
              layoutsubtree>` (ParticleScroll.tsx's experimental
              html-in-canvas capture mode) — programmatically driving its
              scrollTop may simply be incompatible with how that capture
              samples the subtree, not a tuning problem fixable by adjusting
              *how* it's driven. Not safe to retry without much better
              visibility into that capture's internals than a black-box
              scrollTop poll allows. `data-lenis-prevent` (see
              lenis-provider.tsx) is what actually matters here: it keeps
              this panel's native internal scroll working now that Lenis
              governs the rest of the page.

              Widened from max-w-6xl instead — doesn't fix the two-scroll-
              contexts problem (cursor still has to be over the panel for
              wheel input to reach it), but a wider target means a normally-
              centered cursor lands on it during regular scrolling more
              often, at zero risk to the capture effect. The "have to find
              the box" friction is reduced, not eliminated — accepted as a
              known limitation rather than chasing a fix that already broke
              the page once. */}
          <div data-lenis-prevent className="border border-primary/30">
            <div className="flex items-center justify-between border-b border-primary/30 bg-background/80 px-4 py-2 font-mono text-[10px] tracking-[0.5px] text-muted-foreground uppercase">
              <span>blessed_moon --explore</span>
              <span aria-hidden="true">scroll_</span>
            </div>
            <HtmlInCanvasNotice />
            <ParticleScroll className="h-[80vh] w-full">
              <div className="flex flex-col">
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
              </div>
            </ParticleScroll>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
