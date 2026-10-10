import type { ProjectType } from "@/lib/project-types";

type EnquiryEvent =
  | { name: "service-enquiry-click"; data: { service: "social-media-strategy"; location: "home" | "service-page" } }
  | { name: "project-enquiry-start" | "project-enquiry-submit"; data: { project_type: ProjectType } }
  | { name: "booking-open"; data: { location: "contact" } };

declare global {
  interface Window {
    umami?: { track: (name: string, data?: Record<string, unknown>) => void };
  }
}

/** Homepage stage sections, in order. Enum-only, like every event here: it
 * says how far down the page a visit got, nothing about who. */
export type HomeSection = "about" | "services" | "process" | "work" | "pricing";

export function trackHomeSection(section: HomeSection) {
  if (typeof window === "undefined") return;
  try {
    window.umami?.track("home-section-reached", { section });
  } catch {
    // A blocked or unavailable tracker is an ordinary supported state.
  }
}

// Optional measurement must never prevent the real enquiry action. No form
// content, email addresses, storage or client-side attribution cache is sent.
export function trackEnquiry(event: EnquiryEvent) {
  if (typeof window === "undefined") return;
  try {
    window.umami?.track(event.name, event.data);
  } catch {
    // A blocked or unavailable tracker is an ordinary supported state.
  }
}
