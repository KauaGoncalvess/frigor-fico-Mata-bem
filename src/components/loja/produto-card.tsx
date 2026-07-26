"use client";

import Image from "next/image";
import { Check, Minus, Package, Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatarPreco, formatarQuantidade } from "@/lib/format";
import type { ProdutoVitrine } from "@/lib/vitrine";
import { ArteCorte } from "./arte-corte";
import { passoDaUnidade, useCarrinho } from "./carrinho-contexto";

export function ProdutoCard({ produto }: { produto: ProdutoVitrine }) {
  const { adicionar, definirQuantidade, quantidadeDe } = useCarrinho();
  const quantidade = quantidadeDe(produto.id);
  const noCarrinho = quantidade > 0;
  const passo = passoDaUnidade(produto.unidade);
  const ehKit = produto.tipo === "kit";

  const adicionarAoCarrinho = () => {
    adicionar({
      produtoId: produto.id,
      nome: produto.nome,
      unidade: produto.unidade,
      precoUnitarioCentavos: produto.precoEfetivoCentavos,
    });
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-card borda-fina bg-carvao-900",
        "transition-[transform,box-shadow,border-color] duration-300 will-change-transform",
        "hover:-translate-y-1 hover:border-carvao-500 hover:shadow-lift",
        ehKit && "border-ambar-500/30",
        !produto.disponivel && "opacity-60",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-carvao-850">
        {produto.imagemUrl ? (
          <Image
            src={produto.imagemUrl}
            alt={produto.nome}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 260px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <ArteCorte
            categoria={produto.categoria}
            semente={produto.id}
            className="transition-transform duration-500 group-hover:scale-105"
          />
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-linear-to-t from-carvao-900 to-transparent" />

        {produto.emOferta && (
          <span className="absolute left-2 top-2 rounded-full bg-brasa-600 px-2 py-0.5 text-[11px] font-bold tracking-wide text-white shadow-sm">
            −{produto.desconto}%
          </span>
        )}

        {ehKit && !produto.emOferta && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-ambar-500 px-2 py-0.5 text-[11px] font-bold text-carvao-950 shadow-sm">
            <Package size={11} strokeWidth={2.8} />
            Kit
          </span>
        )}

        {!produto.disponivel && (
          <span className="absolute right-2 top-2 rounded-full bg-carvao-950/90 px-2 py-0.5 text-[11px] font-semibold text-creme-muted">
            Esgotado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex-1">
          <h3 className="text-[15px] leading-snug font-semibold text-creme">
            {produto.nome}
          </h3>
          {produto.composicao ? (
            <p className="mt-1 line-clamp-3 text-[11.5px] leading-snug text-ambar-400/90">
              {produto.composicao}
            </p>
          ) : (
            produto.descricao && (
              <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-creme-muted">
                {produto.descricao}
              </p>
            )
          )}
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-[22px] font-semibold leading-none text-ambar-400">
            {formatarPreco(produto.precoEfetivoCentavos)}
          </span>
          {!ehKit && <span className="text-[11px] text-creme-muted">/{produto.unidade}</span>}
          {produto.emOferta && (
            <span className="ml-auto text-[12px] text-creme-muted line-through">
              {formatarPreco(produto.precoCentavos)}
            </span>
          )}
        </div>

        {ehKit && produto.economiaCentavos > 0 && (
          <p className="-mt-1 text-[11.5px] font-semibold text-sucesso">
            Economize {formatarPreco(produto.economiaCentavos)}
          </p>
        )}

        {!produto.disponivel ? (
          <p className="rounded-lg bg-carvao-850 px-3 py-2 text-center text-[12px] text-creme-muted">
            {ehKit ? "Kit indisponível hoje" : "Sem estoque hoje"}
          </p>
        ) : noCarrinho ? (
          <div className="flex items-center justify-between rounded-lg bg-carvao-800 p-1">
            <button
              type="button"
              onClick={() => definirQuantidade(produto.id, quantidade - passo)}
              aria-label={`Diminuir ${produto.nome}`}
              className="grid h-8 w-8 place-items-center rounded-md text-creme transition hover:bg-carvao-700 active:scale-95"
            >
              <Minus size={16} />
            </button>
            <span className="text-[13px] font-semibold tabular-nums text-creme">
              {formatarQuantidade(quantidade, produto.unidade)}
            </span>
            <button
              type="button"
              onClick={() => definirQuantidade(produto.id, quantidade + passo)}
              aria-label={`Aumentar ${produto.nome}`}
              className="grid h-8 w-8 place-items-center rounded-md bg-brasa-600 text-white transition hover:bg-brasa-500 active:scale-95"
            >
              <Plus size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={adicionarAoCarrinho}
            className={cn(
              "flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-brasa-600 text-[13px] font-bold text-white",
              "transition hover:bg-brasa-500 active:scale-[0.98]",
              "shadow-[0_6px_18px_-8px_rgba(224,75,35,0.9)]",
            )}
          >
            <Plus size={16} strokeWidth={2.6} />
            Adicionar
          </button>
        )}
      </div>

      {noCarrinho && (
        <span className="pointer-events-none absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-sucesso text-white shadow-sm">
          <Check size={14} strokeWidth={3} />
        </span>
      )}
    </article>
  );
}
