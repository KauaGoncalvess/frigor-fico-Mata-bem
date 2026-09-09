import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Space_Grotesk } from "next/font/google";
import { EMPRESA } from "@/conteudo/empresa";
import { urlDoSite } from "@/lib/url";
import "./globals.css";

// A serifada só existe em 400, e o itálico é usado nos numerais de capítulo
// e no destaque de "Wagyu" — por isso as duas variações entram.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  // Sem isto o Next resolve a imagem de compartilhamento contra localhost.
  metadataBase: new URL(urlDoSite()),
  title: {
    default: "Frigorífico Mata Bem — Abate e processamento com SIF em Sete Lagoas",
    template: `%s · ${EMPRESA.razaoSocial}`,
  },
  description:
    "Frigorífico com Inspeção Federal permanente em Sete Lagoas/MG. Abate de bovinos e " +
    "suínos, industrialização e preparação de subprodutos para casas de carnes, " +
    "supermercados, distribuidores e indústrias.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Frigorífico Mata Bem",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b0a09",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${instrumentSerif.variable} ${spaceGrotesk.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
