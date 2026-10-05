import type { ProjectType } from "@/lib/project-types";

type EnquiryEvent =
  | { name: "service-enquiry-click"; data: { service: "social-media-strategy"; location: "home" | "service-page" } }
  | { name: "project-enquiry-email-open" | "project-enquiry-brief-copy"; data: { project_type: ProjectType } }
  | { name: "booking-open"; data: { location: "contact" } };

declare global {
  interface Window {
    umami?: { track: (name: string, data?: Record<string, unknown>) => void };
  }
}

// Optional measurement must never prevent the real enquiry action. No form
// content, mailto URL, storage or client-side attribution cache is sent.
export function trackEnquiry(event: EnquiryEvent) {
  if (typeof window === "undefined") return;
  try {
    window.umami?.track(event.name, event.data);
  } catch {
    // A blocked or unavailable tracker is an ordinary supported state.
  }
}
