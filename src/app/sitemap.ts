import type { MetadataRoute } from "next";
import { MENU } from "@/conteudo/navegacao";
import { urlDoSite } from "@/lib/url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = urlDoSite();
  const agora = new Date();

  return MENU.map((item) => ({
    url: item.href === "/" ? base : `${base}${item.href}`,
    lastModified: agora,
    changeFrequency: "monthly" as const,
    priority: item.href === "/" ? 1 : 0.7,
  }));
}
