import { NextResponse, type NextRequest } from "next/server";
import { INSIGHTS_REALM, isInsightsAuthorized } from "@/lib/insights-auth";
import { hasTranslation, stripLocale } from "@/lib/i18n/shared";

// Gates only the live Umami view. Without INSIGHTS_PASSWORD the route 404s
// rather than prompting, so an unconfigured deployment never shows the gate.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!/^\/(?:en\/|pt\/)?analytics-plan\/live(?:\/|$)/.test(pathname)) {
    if (/^\/en(?:\/|$)/.test(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = stripLocale(pathname);
      return NextResponse.redirect(url, 308);
    }
    if (/^\/pt(?:\/|$)/.test(pathname)) {
      if (!hasTranslation(pathname)) {
        const url = request.nextUrl.clone();
        url.pathname = stripLocale(pathname);
        return NextResponse.redirect(url, 307);
      }
      return NextResponse.next();
    }
    const url = request.nextUrl.clone();
    url.pathname = `/en${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }
  if (!process.env.INSIGHTS_PASSWORD) return new NextResponse(null, { status: 404 });
  if (await isInsightsAuthorized(request.headers.get("authorization"))) {
    const url = request.nextUrl.clone();
    url.pathname = `/en${stripLocale(pathname)}`;
    const response = NextResponse.rewrite(url);
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
  matcher: ["/((?!api|_next|projects|sounds|fonts|brand|icon|apple-icon|.*\\..*).*)"],
};
