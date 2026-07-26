import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import type { ConfigLoja } from "@/lib/db/schema";

/** O lucide-react parou de embarcar ícones de marca, então o glifo vem inline. */
function IconeInstagram({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

export function Rodape({ config }: { config: ConfigLoja }) {
  return (
    <footer className="border-t border-carvao-800 bg-carvao-900/60">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-xl font-semibold text-creme">{config.nome}</p>
            <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-creme-muted">
              Açougue de bairro com padrão de casa de carnes: corte na hora, atendimento
              olho no olho e pedido pelo WhatsApp.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-ambar-500">
              Onde estamos
            </h3>
            <p className="flex items-start gap-2 text-[13px] leading-relaxed text-creme-muted">
              <MapPin size={15} className="mt-0.5 shrink-0" />
              {config.endereco}
            </p>
            {config.mapsUrl && (
              <a
                href={config.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-[13px] font-semibold text-ambar-400 underline-offset-2 hover:underline"
              >
                Abrir no mapa
              </a>
            )}
          </div>

          <div>
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-ambar-500">
              Horário
            </h3>
            <p className="flex items-start gap-2 text-[13px] leading-relaxed text-creme-muted">
              <Clock size={15} className="mt-0.5 shrink-0" />
              {config.horario}
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-ambar-500">
              Contato
            </h3>
            {config.telefone && (
              <p className="flex items-center gap-2 text-[13px] text-creme-muted">
                <Phone size={15} className="shrink-0" />
                {config.telefone}
              </p>
            )}
            {config.instagram && (
              <a
                href={config.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center gap-2 text-[13px] text-creme-muted transition hover:text-creme"
              >
                <IconeInstagram size={15} />
                Instagram
              </a>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-carvao-800 pt-6 text-[12px] text-creme-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {config.nome}. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacidade" className="transition hover:text-creme">
              Privacidade
            </Link>
            <Link href="/admin" className="transition hover:text-creme">
              Área do lojista
            </Link>
          </div>
        </div>

        {/* Espaço para a barra fixa do carrinho não cobrir o rodapé no celular */}
        <div className="h-20 sm:hidden" />
      </div>
    </footer>
  );
}
