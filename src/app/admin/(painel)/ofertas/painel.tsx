"use client";

import { useActionState } from "react";
import { AlertTriangle, CheckCircle2, Tag } from "lucide-react";
import { cn } from "@/lib/cn";
import { Cartao, VazioEstado } from "@/components/admin/ui";
import { ROTULO_CATEGORIA, type Categoria, type Produto } from "@/lib/db/schema";
import { formatarData, formatarPreco } from "@/lib/format";
import { percentualDesconto } from "@/lib/produto";
import type { RespostaAcao } from "@/lib/admin/guarda";
import { colocarEmOferta, encerrarOferta } from "./acoes";

const INICIAL: RespostaAcao = { ok: false, mensagem: "" };

const campo =
  "h-10 rounded-lg border border-carvao-700 bg-carvao-850 px-3 text-[13px] text-creme placeholder:text-creme-muted/60 focus:border-ambar-500 focus:outline-none";

export function PainelOfertas({
  emOferta,
  disponiveis,
}: {
  emOferta: Produto[];
  disponiveis: Produto[];
}) {
  const [estadoEntrar, acaoEntrar] = useActionState(colocarEmOferta, INICIAL);
  const [estadoSair, acaoSair] = useActionState(encerrarOferta, INICIAL);

  const recado = estadoEntrar.mensagem ? estadoEntrar : estadoSair;

  return (
    <div className="flex flex-col gap-8">
      {recado.mensagem && (
        <p
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-3 text-[13px]",
            recado.ok
              ? "border border-sucesso/40 bg-sucesso/10 text-creme"
              : "border border-erro/40 bg-erro/10 text-creme",
          )}
        >
          {recado.ok ? (
            <CheckCircle2 size={16} className="text-sucesso" />
          ) : (
            <AlertTriangle size={16} className="text-erro" />
          )}
          {recado.mensagem}
        </p>
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold">
          Em oferta agora ({emOferta.length})
        </h2>

        {emOferta.length === 0 ? (
          <VazioEstado
            titulo="Nenhuma oferta no ar"
            texto="Escolha um corte na lista abaixo, defina o preço promocional e ele aparece em destaque na home da loja."
          />
        ) : (
          <Cartao className="p-0">
            <ul className="divide-y divide-carvao-800">
              {emOferta.map((produto) => {
                const desconto = percentualDesconto(produto);
                const vencida =
                  produto.ofertaAte && new Date(produto.ofertaAte) < new Date();

                return (
                  <li
                    key={produto.id}
                    className="flex flex-wrap items-center gap-3 px-5 py-3.5"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brasa-600/15 text-brasa-400">
                      <Tag size={16} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold text-creme">
                        {produto.nome}
                      </p>
                      <p className="text-[12px] text-creme-muted">
                        <span className="line-through">
                          {formatarPreco(produto.precoCentavos)}
                        </span>{" "}
                        <span className="font-semibold text-ambar-400">
                          {formatarPreco(produto.precoPromoCentavos ?? 0)}
                        </span>
                        {desconto > 0 && ` · −${desconto}%`}
                        {produto.ofertaAte && ` · até ${formatarData(produto.ofertaAte)}`}
                      </p>
                      {vencida && (
                        <p className="mt-0.5 flex items-center gap-1 text-[11.5px] text-alerta">
                          <AlertTriangle size={12} />
                          Prazo vencido — já saiu da loja automaticamente.
                        </p>
                      )}
                    </div>

                    <form action={acaoSair}>
                      <input type="hidden" name="id" value={produto.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-carvao-600 px-3 py-2 text-[12.5px] font-semibold text-creme-muted transition hover:border-erro/60 hover:text-erro"
                      >
                        Encerrar
                      </button>
                    </form>
                  </li>
                );
              })}
            </ul>
          </Cartao>
        )}
      </section>

      <section>
        <h2 className="mb-1 text-lg font-semibold">Colocar em oferta</h2>
        <p className="mb-3 text-[13px] text-creme-muted">
          Defina o preço promocional e, se quiser, até quando vale. Passou da data, o preço
          normal volta sozinho.
        </p>

        {disponiveis.length === 0 ? (
          <Cartao>
            <p className="text-[13.5px] text-creme-muted">
              Todos os cortes disponíveis já estão em oferta.
            </p>
          </Cartao>
        ) : (
          <Cartao className="p-0">
            <ul className="divide-y divide-carvao-800">
              {disponiveis.map((produto) => (
                <li key={produto.id} className="px-5 py-3.5">
                  <form
                    action={acaoEntrar}
                    className="flex flex-wrap items-end gap-3"
                  >
                    <input type="hidden" name="id" value={produto.id} />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold text-creme">
                        {produto.nome}
                      </p>
                      <p className="text-[12px] text-creme-muted">
                        {ROTULO_CATEGORIA[produto.categoria as Categoria] ??
                          produto.categoria}{" "}
                        · normal {formatarPreco(produto.precoCentavos)}
                      </p>
                    </div>

                    <label className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold text-creme-muted">
                        Preço da oferta
                      </span>
                      <input
                        name="precoPromo"
                        inputMode="decimal"
                        placeholder="39,90"
                        className={`${campo} w-28`}
                      />
                    </label>

                    <label className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold text-creme-muted">
                        Vale até
                      </span>
                      <input name="ofertaAte" type="date" className={`${campo} w-40`} />
                    </label>

                    <button
                      type="submit"
                      className="h-10 rounded-lg bg-brasa-600 px-4 text-[12.5px] font-bold text-white transition hover:bg-brasa-500"
                    >
                      Colocar em oferta
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          </Cartao>
        )}
      </section>
    </div>
  );
}
