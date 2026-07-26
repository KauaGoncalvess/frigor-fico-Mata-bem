"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { ROTULO_CATEGORIA, type Categoria } from "@/lib/db/schema";
import type { ProdutoVitrine } from "@/lib/vitrine";
import { ProdutoCard } from "./produto-card";

const FILTROS: { id: string; rotulo: string }[] = [
  { id: "todos", rotulo: "Todos" },
  { id: "kits", rotulo: "Kits" },
  { id: "bovino", rotulo: ROTULO_CATEGORIA.bovino },
  { id: "suino", rotulo: ROTULO_CATEGORIA.suino },
  { id: "aves", rotulo: ROTULO_CATEGORIA.aves },
  { id: "embutidos", rotulo: ROTULO_CATEGORIA.embutidos },
];

/** Ignora acento e caixa: "picanha" acha "Picanha", "lombo" acha "Lombinho". */
function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function Catalogo({ produtos }: { produtos: ProdutoVitrine[] }) {
  const [categoria, setCategoria] = useState("todos");
  const [busca, setBusca] = useState("");

  const contagens = useMemo(() => {
    const mapa: Record<string, number> = { todos: produtos.length, kits: 0 };
    for (const produto of produtos) {
      mapa[produto.categoria] = (mapa[produto.categoria] ?? 0) + 1;
      if (produto.tipo === "kit") mapa.kits += 1;
    }
    return mapa;
  }, [produtos]);

  const visiveis = useMemo(() => {
    const termo = normalizar(busca);
    return produtos.filter((produto) => {
      // "Kits" corta por tipo, não por categoria de carne.
      if (categoria === "kits" && produto.tipo !== "kit") return false;
      if (categoria !== "todos" && categoria !== "kits" && produto.categoria !== categoria) {
        return false;
      }
      if (!termo) return true;
      return (
        normalizar(produto.nome).includes(termo) ||
        normalizar(produto.descricao ?? "").includes(termo) ||
        normalizar(produto.composicao ?? "").includes(termo) ||
        normalizar(ROTULO_CATEGORIA[produto.categoria as Categoria] ?? "").includes(termo)
      );
    });
  }, [produtos, categoria, busca]);

  return (
    <section id="catalogo" className="scroll-mt-20 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <header className="mb-6 flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ambar-500">
            Nosso balcão
          </span>
          <h2 className="text-3xl font-semibold sm:text-4xl">Escolha seus cortes</h2>
          <p className="max-w-xl text-sm text-creme-muted">
            Preço por quilo. Você monta o pedido aqui e finaliza a conversa no WhatsApp.
          </p>
        </header>

        <div className="sticky top-0 z-30 -mx-4 mb-6 border-b border-carvao-800 vidro px-4 py-3">
          <div className="relative mb-3">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-creme-muted"
            />
            <input
              type="search"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
              placeholder="Buscar corte (ex: picanha, costela...)"
              aria-label="Buscar corte"
              className="h-11 w-full rounded-xl border border-carvao-700 bg-carvao-900 pl-10 pr-10 text-sm text-creme placeholder:text-creme-muted/70 focus:border-ambar-500 focus:outline-none"
            />
            {busca && (
              <button
                type="button"
                onClick={() => setBusca("")}
                aria-label="Limpar busca"
                className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-creme-muted hover:bg-carvao-800 hover:text-creme"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div
            role="tablist"
            aria-label="Categorias"
            className="rolagem-oculta -mx-1 flex gap-2 overflow-x-auto px-1"
          >
            {FILTROS.map((filtro) => {
              const ativo = categoria === filtro.id;
              const total = contagens[filtro.id] ?? 0;
              if (filtro.id !== "todos" && total === 0) return null;
              return (
                <button
                  key={filtro.id}
                  type="button"
                  role="tab"
                  aria-selected={ativo}
                  onClick={() => setCategoria(filtro.id)}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition",
                    ativo
                      ? "bg-creme text-carvao-950"
                      : "border border-carvao-700 text-creme-muted hover:border-carvao-500 hover:text-creme",
                  )}
                >
                  {filtro.rotulo}
                  <span className={cn("ml-1.5 text-[11px]", ativo ? "text-carvao-600" : "opacity-60")}>
                    {total}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {visiveis.length === 0 ? (
          <div className="rounded-card borda-fina bg-carvao-900 px-6 py-14 text-center">
            <p className="font-display text-xl text-creme">Nada encontrado por aqui</p>
            <p className="mt-1 text-sm text-creme-muted">
              Tente outro termo ou fale com a gente pelo WhatsApp — o que não está no site a
              gente separa na hora.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {visiveis.map((produto) => (
              <ProdutoCard key={produto.id} produto={produto} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
