import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site-config";
import { STUDIO_PROJECTS } from "@/lib/studio-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/work", priority: 0.9 },
    ...STUDIO_PROJECTS.map((project) => ({
      path: `/work/${project.slug}`,
      priority: 0.8,
    })),
    { path: "/about", priority: 0.8 },
    { path: "/contact", priority: 0.9 },
  ];

  return routes.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  }));
}
