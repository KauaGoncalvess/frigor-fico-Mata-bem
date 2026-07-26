import type { MetadataRoute } from "next";
import { obterConfig } from "@/lib/repo/config";

/**
 * Manifest do PWA.
 *
 * Serve para o cliente salvar a loja como ícone no celular. Numa compra que se
 * repete toda semana, estar na tela inicial vale mais que qualquer campanha:
 * é um toque para pedir de novo, sem procurar link.
 */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  let nome = "Frigorífico Mata Bem";
  try {
    nome = (await obterConfig()).nome;
  } catch {
    // Banco fora do ar não pode impedir o manifest de existir.
  }

  return {
    name: `${nome} — carnes selecionadas`,
    short_name: nome.split(" ").slice(-1)[0] || nome,
    description:
      "Monte seu pedido de carnes e envie direto no WhatsApp da loja, em poucos minutos.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0706",
    theme_color: "#0a0706",
    lang: "pt-BR",
    orientation: "portrait",
    categories: ["food", "shopping"],
    icons: [
      { src: "/icone-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icone-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icone-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
