"use client";

import Link from "next/link";
import { trackEnquiry } from "@/lib/analytics";

export function StrategyEnquiryLink({ location = "service-page" }: { location?: "home" | "service-page" }) {
  return (
    <Link href="/contact?project=Social%20Media%20Strategy#project-enquiry"
      onClick={() => trackEnquiry({ name: "service-enquiry-click", data: { service: "social-media-strategy", location } })}
      className="inline-flex items-center justify-center border border-primary bg-primary px-5 py-3 font-mono text-xs leading-5 text-primary-foreground transition-colors hover:bg-transparent hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
      Discuss your content strategy →
    </Link>
  );
}

export function BookingLink({ href }: { href: string }) {
  return <a href={href} target="_blank" rel="noreferrer" onClick={() => trackEnquiry({ name: "booking-open", data: { location: "contact" } })}
    className="mt-7 inline-flex w-fit items-center gap-2 border border-primary bg-primary px-4 py-3 font-mono text-[10.5px] tracking-[0.5px] text-primary-foreground uppercase transition-colors hover:bg-transparent hover:text-primary">Open booking calendar ↗</a>;
}
