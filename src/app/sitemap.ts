import type { MetadataRoute } from "next";
import { urlDoSite } from "@/lib/url";

// Uma página só: institucional, conteúdo estável.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: urlDoSite(),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
