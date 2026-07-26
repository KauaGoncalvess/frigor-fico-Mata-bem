"use client";

import { Check, Package, Plus } from "lucide-react";
import { formatarPreco } from "@/lib/format";
import type { ProdutoVitrine } from "@/lib/vitrine";
import { ArteCorte } from "./arte-corte";
import { useCarrinho } from "./carrinho-contexto";
import { Revelar } from "./revelar";

/**
 * Kits prontos.
 *
 * Existe para subir o ticket médio: em vez de escolher quatro cortes, o cliente
 * resolve o churrasco inteiro num toque. Por isso o bloco mostra a composição
 * aberta e o quanto ele economiza — é o argumento da venda.
 */
export function Kits({ kits }: { kits: ProdutoVitrine[] }) {
  const { adicionar, quantidadeDe } = useCarrinho();

  if (kits.length === 0) return null;

  return (
    <section id="kits" className="relative scroll-mt-20 py-14 sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(80% 100% at 85% 0%, rgba(233,161,59,0.14) 0%, transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-4">
        <header className="mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ambar-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-ambar-400">
            <Package size={13} />
            Kits prontos
          </span>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Resolva o churrasco num toque
          </h2>
          <p className="mt-1 max-w-xl text-sm text-creme-muted">
            A gente já montou a combinação e fechou o preço. Você só escolhe para
            quantas pessoas.
          </p>
        </header>

        {/* Com um kit só, duas colunas deixariam metade da fileira vazia. */}
        <div className={`grid gap-4 ${kits.length > 1 ? "md:grid-cols-2" : "md:max-w-2xl"}`}>
          {kits.map((kit, indice) => {
            const noCarrinho = quantidadeDe(kit.id) > 0;

            return (
              <Revelar key={kit.id} atraso={indice * 0.06}>
                <article className="flex h-full overflow-hidden rounded-card border border-ambar-500/25 bg-carvao-900 transition hover:border-ambar-500/50 hover:shadow-lift">
                  <div className="relative w-28 shrink-0 sm:w-36">
                    <ArteCorte
                      categoria={kit.categoria}
                      semente={kit.id}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    {kit.economiaCentavos > 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-sucesso px-2 py-0.5 text-[10.5px] font-bold text-white">
                        −{formatarPreco(kit.economiaCentavos)}
                      </span>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
                    <h3 className="text-[17px] font-semibold leading-snug text-creme">
                      {kit.nome}
                    </h3>

                    {kit.composicao && (
                      <ul className="flex flex-col gap-0.5">
                        {kit.composicao.split(" · ").map((parte) => (
                          <li
                            key={parte}
                            className="flex items-start gap-1.5 text-[12.5px] leading-snug text-creme-muted"
                          >
                            <Check size={13} className="mt-0.5 shrink-0 text-ambar-400" />
                            {parte}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-2">
                      <div>
                        <span className="block font-display text-[26px] font-semibold leading-none text-ambar-400">
                          {formatarPreco(kit.precoEfetivoCentavos)}
                        </span>
                        {kit.economiaCentavos > 0 && (
                          <span className="text-[11.5px] font-semibold text-sucesso">
                            economia de {formatarPreco(kit.economiaCentavos)}
                          </span>
                        )}
                      </div>

                      {kit.disponivel ? (
                        <button
                          type="button"
                          onClick={() =>
                            adicionar({
                              produtoId: kit.id,
                              nome: kit.nome,
                              unidade: kit.unidade,
                              precoUnitarioCentavos: kit.precoEfetivoCentavos,
                            })
                          }
                          className="flex h-11 items-center gap-1.5 rounded-xl bg-brasa-600 px-5 text-[13.5px] font-bold text-white transition hover:bg-brasa-500 active:scale-[0.98]"
                        >
                          {noCarrinho ? (
                            <>
                              <Plus size={16} strokeWidth={2.6} />
                              Mais um
                            </>
                          ) : (
                            <>
                              <Plus size={16} strokeWidth={2.6} />
                              Adicionar kit
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="rounded-lg bg-carvao-850 px-3 py-2 text-[12px] text-creme-muted">
                          Indisponível hoje
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              </Revelar>
            );
          })}
        </div>
      </div>
    </section>
  );
}
