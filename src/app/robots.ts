import type { MetadataRoute } from "next";
import { urlDoSite } from "@/lib/url";

export default function robots(): MetadataRoute.Robots {
  const base = urlDoSite();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // O painel e as rotas de API não têm nada de útil para busca, e a
        // página de descadastro não deve ser rastreada (é link pessoal).
        disallow: ["/admin", "/admin/", "/api/", "/descadastro"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
