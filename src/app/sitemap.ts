import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site-config";
import { STUDIO_PROJECTS } from "@/lib/studio-data";
import { localizedHref } from "@/lib/i18n/shared";

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
    { path: "/services/social-media", priority: 0.8 },
  ];

  return routes.flatMap(({ path, priority }) => (["en", "pt"] as const).map(locale => ({
    url: `${SITE_URL}${localizedHref(path || "/", locale)}`,
    alternates: { languages: { en: `${SITE_URL}${localizedHref(path || "/", "en")}`, "pt-BR": `${SITE_URL}${localizedHref(path || "/", "pt")}` } },
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority,
  })));
}
