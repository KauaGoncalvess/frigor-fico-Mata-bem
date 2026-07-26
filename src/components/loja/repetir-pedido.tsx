"use client";

import { useEffect, useState } from "react";
import { RotateCcw, X } from "lucide-react";
import { formatarPreco } from "@/lib/format";
import type { ProdutoVitrine } from "@/lib/vitrine";
import { useCarrinho } from "./carrinho-contexto";
import { lerUltimoPedido, limparUltimoPedido, type PedidoSalvo } from "./ultimo-pedido";

/**
 * Atalho de recompra.
 *
 * O pedido antigo guarda só id e quantidade, então o carrinho é remontado com
 * os preços de HOJE — nunca com os da semana passada. Item que saiu do catálogo
 * ou está sem estoque é avisado em vez de sumir calado.
 */
export function RepetirPedido({ produtos }: { produtos: ProdutoVitrine[] }) {
  const { adicionar, abrirPainel, itens } = useCarrinho();
  const [salvo, setSalvo] = useState<PedidoSalvo | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    setSalvo(lerUltimoPedido());
  }, []);

  // Com o carrinho já em uso, o atalho só atrapalharia.
  if (!salvo || itens.length > 0) return null;

  const porId = new Map(produtos.map((produto) => [produto.id, produto]));
  const disponiveis = salvo.itens.filter((item) => porId.get(item.produtoId)?.disponivel);
  const foraDoCatalogo = salvo.itens.length - disponiveis.length;

  if (disponiveis.length === 0) return null;

  const estimativa = disponiveis.reduce((soma, item) => {
    const produto = porId.get(item.produtoId)!;
    return soma + Math.round(produto.precoEfetivoCentavos * item.quantidade);
  }, 0);

  const repetir = () => {
    for (const item of disponiveis) {
      const produto = porId.get(item.produtoId)!;
      adicionar(
        {
          produtoId: produto.id,
          nome: produto.nome,
          unidade: produto.unidade,
          precoUnitarioCentavos: produto.precoEfetivoCentavos,
        },
        item.quantidade,
      );
    }

    if (foraDoCatalogo > 0) {
      setAviso(
        `${foraDoCatalogo} item do pedido anterior está sem estoque hoje e não entrou.`,
      );
    }
    abrirPainel();
  };

  return (
    <section className="mx-auto max-w-6xl px-4 pt-6">
      <div className="flex flex-wrap items-center gap-3 rounded-card border border-ambar-500/30 bg-ambar-500/[0.07] px-4 py-3.5">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ambar-500/15 text-ambar-400">
          <RotateCcw size={18} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold text-creme">
            Pedir o mesmo da última vez?
          </p>
          <p className="text-[12.5px] text-creme-muted">
            {disponiveis.length} {disponiveis.length === 1 ? "item" : "itens"} ·
            aproximadamente {formatarPreco(estimativa)} com os preços de hoje
            {foraDoCatalogo > 0 && ` · ${foraDoCatalogo} sem estoque`}
          </p>
          {aviso && <p className="mt-1 text-[12px] text-alerta">{aviso}</p>}
        </div>

        <button
          type="button"
          onClick={repetir}
          className="h-11 shrink-0 rounded-xl bg-creme px-5 text-[13.5px] font-bold text-carvao-950 transition hover:bg-white active:scale-[0.99]"
        >
          Repetir pedido
        </button>

        <button
          type="button"
          onClick={() => {
            limparUltimoPedido();
            setSalvo(null);
          }}
          aria-label="Dispensar sugestão"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-creme-muted transition hover:bg-carvao-850 hover:text-creme"
        >
          <X size={16} />
        </button>
      </div>
    </section>
  );
}
