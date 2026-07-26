import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import type { HorarioDia } from "@/lib/db/schema";
import { formatarPreco } from "@/lib/format";
import type { SituacaoLoja } from "@/lib/horario";
import type { ProdutoVitrine } from "@/lib/vitrine";
import { linkWhatsapp } from "@/lib/whatsapp";
import { ArteCorte } from "./arte-corte";
import { Revelar } from "./revelar";
import { SeloHorario } from "./selo-horario";

/**
 * Hero da loja.
 *
 * O acento visual é feito com camadas de gradiente e uma animação de brasa em
 * CSS — sem WebGL. Uma cena 3D de verdade custaria centenas de KB de JavaScript
 * e engasgaria justamente nos celulares mais simples, que são a maior parte do
 * público. O ganho visual não pagaria a conta.
 */
export function Hero({
  nomeLoja,
  whatsapp,
  horarios,
  situacao,
  entregaAtiva,
  destaque,
}: {
  nomeLoja: string;
  whatsapp: string;
  horarios: HorarioDia[] | null;
  situacao: SituacaoLoja;
  entregaAtiva: boolean;
  destaque?: ProdutoVitrine;
}) {
  const linkPedido = linkWhatsapp(
    whatsapp,
    `Olá! Vim pelo site do ${nomeLoja} e quero fazer um pedido.`,
  );

  return (
    <section className="grao relative overflow-hidden">
      {/* Camadas de profundidade: brasa quente subindo do rodapé da seção */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 85% at 50% 108%, rgba(224,75,35,0.30) 0%, rgba(122,20,36,0.18) 38%, transparent 72%)",
        }}
      />
      <div
        aria-hidden="true"
        className="animate-brasa pointer-events-none absolute -left-24 top-10 -z-10 h-72 w-72 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(233,161,59,0.22), transparent 68%)" }}
      />

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 pt-10 sm:pb-20 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <Revelar>
          <div className="flex flex-col items-start">
            <span className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-ambar-500/30 bg-ambar-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ambar-400">
                <span className="h-1.5 w-1.5 rounded-full bg-ambar-400" />
                Cortado na hora, todo dia
              </span>
              <SeloHorario horarios={horarios} inicial={situacao} className="md:hidden" />
            </span>

            <h1 className="text-[2.6rem] font-semibold leading-[1.03] sm:text-6xl lg:text-[4.1rem]">
              Peça sua carne
              <br />
              <span className="texto-marmore">pelo WhatsApp</span>
              <br />
              em poucos minutos.
            </h1>

            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-creme-muted sm:text-lg">
              Escolha os cortes aqui no site, veja o total estimado na hora e mande o pedido
              pronto para o nosso balcão.{" "}
              {entregaAtiva
                ? "A gente entrega na região ou você retira na loja."
                : "A gente separa, embala e você retira quando passar."}
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Link
                href="#catalogo"
                className="group flex h-14 items-center justify-center gap-2 rounded-xl bg-brasa-600 px-7 text-[15px] font-bold text-white shadow-[0_20px_46px_-18px_rgba(224,75,35,0.95)] transition hover:bg-brasa-500 active:scale-[0.99]"
              >
                Ver os cortes
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <a
                href={linkPedido}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 items-center justify-center gap-2 rounded-xl border border-carvao-600 px-6 text-[15px] font-semibold text-creme transition hover:border-carvao-500 hover:bg-carvao-900"
              >
                <MessageCircle size={18} />
                Falar com a loja
              </a>
            </div>
          </div>
        </Revelar>

        <Revelar atraso={0.12}>
          <div className="relative mx-auto w-full max-w-md">
            <div className="relative overflow-hidden rounded-[28px] border border-carvao-700 shadow-lift">
              <div className="aspect-[4/5]">
                <ArteCorte categoria={destaque?.categoria ?? "bovino"} semente={destaque?.id ?? 7} />
              </div>
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-carvao-950 via-transparent to-transparent"
              />

              <div className="absolute inset-x-5 bottom-5">
                <p className="font-display text-2xl font-semibold text-creme">
                  {destaque?.nome ?? "Cortes selecionados"}
                </p>
                <p className="text-[13px] text-creme-muted">
                  {destaque?.descricao ?? "Escolhidos peça a peça, todos os dias."}
                </p>
              </div>
            </div>

            {/* Etiqueta flutuante com uma oferta real — nunca preço inventado */}
            {destaque && (
              <div className="absolute -left-3 top-8 rotate-[-4deg] rounded-2xl border border-ambar-500/30 bg-carvao-900/95 px-4 py-3 shadow-lift backdrop-blur-sm sm:-left-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ambar-500">
                  Oferta da semana
                </p>
                <p className="font-display text-2xl font-semibold text-creme">
                  {formatarPreco(destaque.precoEfetivoCentavos)}
                  <span className="ml-1 text-[12px] font-normal text-creme-muted">
                    /{destaque.unidade}
                  </span>
                </p>
              </div>
            )}
          </div>
        </Revelar>
      </div>
    </section>
  );
}
