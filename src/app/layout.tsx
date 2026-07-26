import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Frigorífico Mata Bem — Carnes selecionadas com pedido pelo WhatsApp",
    template: "%s · Frigorífico Mata Bem",
  },
  description:
    "Cortes selecionados, maturados e cortados na hora. Monte seu pedido e envie direto no WhatsApp em poucos minutos.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Frigorífico Mata Bem",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0706",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
