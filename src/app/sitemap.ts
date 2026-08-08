import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site-config";

// /work, /about, /contact aren't built yet (see CLAUDE.md §0) — add them
// here once those routes ship, not before.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
