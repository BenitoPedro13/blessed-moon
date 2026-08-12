import type { Metadata } from "next";
import { ArrowUpRight, CalendarClock, CalendarDays, Mail } from "lucide-react";

import { CellGrid } from "@/components/cell-grid";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { TerminalPanel } from "@/components/terminal-panel";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Prepare a project brief for Blessed Moon Studio. Agency email and scheduling channels will be published here when they are provisioned.",
};

/**
 * Chrome, deliberately without the stage (TASK-subpage-morph-expansion.md
 * §2.0). This page gets the window frame, the cool surfaces, and the cell-grid
 * ground so it is visibly the same system as the rest of the site — but not
 * the pin. It is the one conversion action here, and putting a form behind a
 * scroll journey would make the single thing this page exists to make easy the
 * hardest thing on the site. A form should open, not unfold.
 */
export default function ContactPage() {
  const agencyEmail = process.env.AGENCY_CONTACT_EMAIL?.trim() || null;
  const bookingUrl = process.env.AGENCY_BOOKING_URL?.trim() || null;

  return (
    <>
      <SiteNav />
      <main>
        <PageHero
          eyebrow="— Contact"
          title="Start a project"
          description="Clarity is the feature. Shape the brief now; the studio's own inbox and scheduling channel will appear here as soon as they are provisioned."
          code="CONTACT"
        />

        <section
          data-ascii-keyframe="2"
          data-frame-label="PROJECT ENQUIRY"
          className="relative px-7 py-16 sm:py-24"
        >
          <CellGrid />
          <div className="relative mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8">
            <Reveal>
              <TerminalPanel
                number="01"
                label="PROJECT ENQUIRY"
                status={agencyEmail ? "email ready" : "local draft"}
              >
                <ContactForm agencyEmail={agencyEmail} />
              </TerminalPanel>
            </Reveal>

            <div className="space-y-6">
              <Reveal delay={0.08}>
                {/* The 32px amber square grid that used to sit inside this card
                    is gone — same reason as the hero's (see page-hero.tsx):
                    the section already stands on a cell grid, and a second,
                    square one read as wallpaper. */}
                <TerminalPanel
                  number="02"
                  label="SCHEDULING"
                  status={bookingUrl ? "open" : "provisioning"}
                >
                  <CalendarDays className="size-6 text-primary" aria-hidden="true" />
                  <h2 className="mt-7 font-sans text-2xl font-semibold tracking-[-0.025em] text-foreground">
                    {bookingUrl
                      ? "Pick a clear 30-minute window."
                      : "Scheduling opens with the agency calendar."}
                  </h2>
                  <p className="mt-3 max-w-sm text-[12.5px] leading-[1.65] text-muted-foreground">
                    {bookingUrl
                      ? "Choose a time in your timezone. The invite and meeting details are handled automatically."
                      : "We are not substituting a personal calendar for a studio channel. Use the brief builder while the official calendar is being prepared."}
                  </p>
                  {bookingUrl ? (
                    <a
                      href={bookingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-7 inline-flex w-fit items-center gap-2 border border-primary bg-primary px-4 py-3 font-mono text-[10.5px] tracking-[0.5px] text-primary-foreground uppercase transition-colors hover:bg-transparent hover:text-primary"
                    >
                      Open booking calendar
                      <ArrowUpRight className="size-3" aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="mt-7 inline-flex w-fit items-center gap-2 border border-border/80 px-4 py-3 font-mono text-[10.5px] tracking-[0.5px] text-muted-foreground uppercase">
                      Calendar not live yet
                      <CalendarClock className="size-3" aria-hidden="true" />
                    </span>
                  )}
                </TerminalPanel>
              </Reveal>

              <Reveal delay={0.16}>
                <TerminalPanel
                  number="03"
                  label="AGENCY CHANNEL"
                  padded={false}
                  status={agencyEmail ? "live" : "pending"}
                >
                  {agencyEmail ? (
                    <a
                      href={`mailto:${agencyEmail}`}
                      className="group flex items-center gap-4 px-5 py-4 hover:bg-primary/[0.04]"
                    >
                      <Mail className="size-4 text-primary" aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <span className="block font-mono text-[8px] tracking-[0.1em] text-muted-foreground uppercase">
                          Email
                        </span>
                        <span className="mt-1 block truncate text-[12px] text-foreground/80 transition-colors group-hover:text-primary">
                          {agencyEmail}
                        </span>
                      </div>
                      <ArrowUpRight
                        className="size-3 text-muted-foreground transition-colors group-hover:text-primary"
                        aria-hidden="true"
                      />
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 px-5 py-4">
                      <Mail className="size-4 text-primary" aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <span className="block font-mono text-[8px] tracking-[0.1em] text-muted-foreground uppercase">
                          Email
                        </span>
                        <span className="mt-1 block text-[12px] text-foreground/80">
                          Agency inbox provisioning
                        </span>
                      </div>
                    </div>
                  )}
                </TerminalPanel>
              </Reveal>

              <Reveal delay={0.24}>
                <p className="font-mono text-[8.5px] leading-[1.7] text-muted-foreground">
                  No personal email, calendar, profile, address, or timezone is used as the studio identity.
                  <br />
                  Official agency channels will replace this status automatically when configured.
                </p>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
