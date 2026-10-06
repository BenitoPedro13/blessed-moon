import { NextResponse, type NextRequest } from "next/server";
import { INSIGHTS_REALM, isInsightsAuthorized } from "@/lib/insights-auth";

// Gates only the live Umami view. Without INSIGHTS_PASSWORD the route 404s
// rather than prompting, so an unconfigured deployment never shows the gate.
export async function proxy(request: NextRequest) {
  if (!process.env.INSIGHTS_PASSWORD) return new NextResponse(null, { status: 404 });
  if (await isInsightsAuthorized(request.headers.get("authorization"))) {
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": INSIGHTS_REALM, "Cache-Control": "no-store" },
  });
}

export const config = {
  matcher: ["/analytics-plan/live", "/analytics-plan/live/:path*"],
};
