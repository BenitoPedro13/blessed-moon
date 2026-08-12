import type { Metadata } from "next";
import { ArrowUpRight, CalendarClock, CalendarDays, Mail } from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Prepare a project brief for Blessed Moon Studio. Agency email and scheduling channels will be published here when they are provisioned.",
};

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

        <section data-ascii-keyframe="2" data-frame-label="PROJECT ENQUIRY" className="px-7 py-16 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
            <Reveal>
              <div className="border border-border/60 bg-background/70 p-6 backdrop-blur-sm sm:p-8">
                <div className="mb-8 flex items-center justify-between border-b border-border/60 pb-3 font-mono text-[8.5px] tracking-[0.12em] text-muted-foreground uppercase">
                  <span>project_enquiry.form</span>
                  <span className="text-primary">
                    {agencyEmail ? "email ready" : "local draft"}
                  </span>
                </div>
                <ContactForm agencyEmail={agencyEmail} />
              </div>
            </Reveal>

            <div className="space-y-5">
              <Reveal delay={0.08}>
                <div className="relative min-h-72 overflow-hidden border border-primary/40 bg-background/75 p-7 backdrop-blur-sm">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,106,31,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,106,31,0.12)_1px,transparent_1px)] [background-size:32px_32px]"
                  />
                  <div className="relative flex h-full min-h-56 flex-col justify-between">
                    <div>
                      <CalendarDays className="size-6 text-primary" aria-hidden="true" />
                      <p className="mt-8 font-mono text-[9px] tracking-[0.12em] text-primary uppercase">
                        {bookingUrl ? "agency scheduling" : "calendar provisioning"}
                      </p>
                      <h2 className="mt-3 font-sans text-2xl font-semibold tracking-[-0.025em] text-foreground">
                        {bookingUrl
                          ? "Pick a clear 30-minute window."
                          : "Scheduling opens with the agency calendar."}
                      </h2>
                      <p className="mt-3 max-w-sm text-[12.5px] leading-[1.65] text-muted-foreground">
                        {bookingUrl
                          ? "Choose a time in your timezone. The invite and meeting details are handled automatically."
                          : "We are not substituting a personal calendar for a studio channel. Use the brief builder while the official calendar is being prepared."}
                      </p>
                    </div>
                    {bookingUrl ? (
                      <a
                        href={bookingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-8 inline-flex w-fit items-center gap-2 border border-primary bg-primary px-4 py-3 font-mono text-[9.5px] tracking-[0.08em] text-primary-foreground uppercase transition-colors hover:bg-transparent hover:text-primary"
                      >
                        Open booking calendar
                        <ArrowUpRight className="size-3" aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="mt-8 inline-flex w-fit items-center gap-2 border border-border/80 px-4 py-3 font-mono text-[9.5px] tracking-[0.08em] text-muted-foreground uppercase">
                        Calendar not live yet
                        <CalendarClock className="size-3" aria-hidden="true" />
                      </span>
                    )}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.16}>
                <div className="border border-border/60 bg-background/70 backdrop-blur-sm">
                  <div className="border-b border-border/60 px-5 py-3 font-mono text-[8.5px] tracking-[0.12em] text-muted-foreground uppercase">
                    agency channel
                  </div>
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
                      <span className="font-mono text-[8px] tracking-[0.08em] text-primary uppercase">
                        pending
                      </span>
                    </div>
                  )}
                </div>
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
