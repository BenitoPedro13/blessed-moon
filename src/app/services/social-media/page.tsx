import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { TerminalPanel } from "@/components/terminal-panel";
import { StrategyEnquiryLink } from "@/components/social/enquiry-link";
import { SITE_URL } from "@/lib/site-config";

const TITLE = "Social Media Strategy & Content Planning";
const DESCRIPTION = "Audience research, positioning, content calendars and a website measurement plan. Work directly with Benito at Blessed Moon Studio.";
export const metadata: Metadata = {
  title: TITLE, description: DESCRIPTION, alternates: { canonical: "/services/social-media" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/services/social-media`, siteName: "Blessed Moon Studio", type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const DELIVERABLES = [
  ["Research with a purpose", "Understand your audience's questions and review public content from competitors and accounts serving the same audience. Use those observations to identify original content your business can support with real evidence."],
  ["A clear editorial direction", "Define positioning, priority channels, voice and content pillars so each post has a reason to exist."],
  ["A calendar you can use", "A 30-day content calendar with 12 ideas and four detailed example briefs: hook, format, caption direction, visual requirements and next step."],
  ["Measurement and handover", "A website measurement specification, campaign-link convention and handover session to help you review the work and plan the next month."],
] as const;

export default function SocialMediaServicePage() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-7 sm:py-20">
        <header data-ascii-keyframe="0" className="border border-panel-edge bg-background/90 p-6 sm:p-12">
          <p className="font-mono text-xs leading-6 text-primary">Social Media Strategy &amp; Content Planning</p>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.045em] sm:text-7xl">Content with a reason to exist.</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-foreground/75">We research your audience, define what your channels should say, and turn that direction into a practical content plan. Clear briefs and measurement connected to your website help you decide what to publish and what to improve.</p>
          <div className="mt-8"><StrategyEnquiryLink /></div>
          <p className="mt-5 font-mono text-xs leading-6 text-muted-foreground">Work directly with Benito · Fixed project scope · Quote agreed before work begins</p>
        </header>

        <section className="mt-10" data-ascii-keyframe="1">
          <TerminalPanel number="01" label="DIRECTION">
            <div className="grid gap-8 md:grid-cols-2">
              <h2 className="max-w-md text-3xl font-semibold tracking-tight">A better starting point than another list of post ideas.</h2>
              <div className="space-y-4 text-sm leading-7 text-foreground/75"><p>If you know your business but struggle to decide what to say online, the work starts with your buyers and the questions they need answered.</p><p>Built for businesses that want a clear plan their own team can execute, and founders who want their content and website to tell the same story.</p></div>
            </div>
          </TerminalPanel>
        </section>
        <section className="mt-8" data-ascii-keyframe="2">
          <TerminalPanel number="02" label="DELIVERABLES">
            <h2 className="text-3xl font-semibold tracking-tight">From research to a usable month.</h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2">{DELIVERABLES.map(([title, detail], index) => <article key={title} className="border-t border-border pt-5"><p className="font-mono text-xs text-primary">0{index + 1}</p><h3 className="mt-3 text-xl font-medium">{title}</h3><p className="mt-3 text-sm leading-7 text-foreground/75">{detail}</p></article>)}</div>
          </TerminalPanel>
        </section>
        <section className="mt-8" data-ascii-keyframe="3">
          <TerminalPanel number="03" label="PROJECT SCOPE">
            <div className="grid gap-8 md:grid-cols-2"><div><h2 className="text-3xl font-semibold tracking-tight">One clear scope, agreed up front.</h2><p className="mt-4 text-sm leading-7 text-foreground/75">A strategy project covers one business, one priority market and language, up to two channels, five competitor references, four content pillars, the calendar, example briefs and measurement specification.</p><p className="mt-4 text-sm leading-7 text-foreground/75">We finish with a handover session and one consolidated revision. Calendar ideas guide production; the example briefs show how to execute them.</p></div><div className="border border-border bg-background/70 p-5"><h3 className="text-xl font-medium">Keep the plan useful as you learn.</h3><p className="mt-4 text-sm leading-7 text-foreground/75">Optional monthly strategy review uses your available insights to update the calendar and recommend the next changes. You keep creating and publishing the content.</p><p className="mt-4 text-sm leading-7 text-muted-foreground">Content production, publishing, community management and paid campaigns each need their own agreed scope.</p></div></div>
          </TerminalPanel>
        </section>
        <section className="mt-8" data-ascii-keyframe="4">
          <TerminalPanel number="04" label="WORKING TOGETHER">
            <h2 className="text-3xl font-semibold tracking-tight">Research. Decide. Plan. Review.</h2>
            <ol className="mt-6 grid gap-5 text-sm leading-7 text-foreground/75 sm:grid-cols-2"><li><strong className="text-foreground">01 / Understand.</strong> Review your business, buyers, channels and evidence.</li><li><strong className="text-foreground">02 / Choose.</strong> Agree the audience, message, pillars and priorities.</li><li><strong className="text-foreground">03 / Prepare.</strong> Build the calendar, sample briefs and measurement plan.</li><li><strong className="text-foreground">04 / Handover.</strong> Review together, consolidate feedback and prepare the next steps.</li></ol>
            <p className="mt-7 text-sm leading-7 text-foreground/75">See how the studio turns business facts into clear website content: <Link href="/work/oishi" className="text-primary underline underline-offset-4">Oishi&apos;s offer</Link> and <Link href="/work/fa-moveis" className="text-primary underline underline-offset-4">F&amp;A Móveis&apos; catalogue</Link>.</p>
          </TerminalPanel>
        </section>
        <section className="mt-8 border border-panel-edge bg-background/90 p-6 sm:p-10" data-ascii-keyframe="5"><h2 className="text-3xl font-semibold tracking-tight">Give the next month a direction.</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-foreground/75">Tell Benito what your business offers, who you want to reach and where content feels unclear. We&apos;ll define the work and agree the quote before it begins.</p><div className="mt-7"><StrategyEnquiryLink /></div></section>
      </main>
      <SiteFooter />
    </>
  );
}
