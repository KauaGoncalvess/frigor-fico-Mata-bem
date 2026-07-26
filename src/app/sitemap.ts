import type { MetadataRoute } from "next";
import { urlDoSite } from "@/lib/url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = urlDoSite();
  const agora = new Date();

  return [
    {
      url: base,
      lastModified: agora,
      changeFrequency: "daily", // preço de carne muda toda semana
      priority: 1,
    },
    {
      url: `${base}/privacidade`,
      lastModified: agora,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
