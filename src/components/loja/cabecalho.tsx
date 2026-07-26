import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { linkWhatsapp } from "@/lib/whatsapp";

export function Cabecalho({ nomeLoja, whatsapp }: { nomeLoja: string; whatsapp: string }) {
  const link = linkWhatsapp(whatsapp, `Olá! Vim pelo site do ${nomeLoja}.`);

  return (
    <header className="border-b border-carvao-800/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brasa-600 font-display text-lg font-bold text-white">
            M
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[17px] font-semibold text-creme">
              {nomeLoja}
            </span>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-creme-muted">
              Carnes selecionadas
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-4">
          <Link
            href="#ofertas"
            className="hidden rounded-lg px-3 py-2 text-[13px] font-medium text-creme-muted transition hover:text-creme sm:block"
          >
            Ofertas
          </Link>
          <Link
            href="#catalogo"
            className="hidden rounded-lg px-3 py-2 text-[13px] font-medium text-creme-muted transition hover:text-creme sm:block"
          >
            Cortes
          </Link>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-carvao-600 px-3 py-2 text-[13px] font-semibold text-creme transition hover:border-carvao-500 hover:bg-carvao-900"
          >
            <MessageCircle size={15} />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
