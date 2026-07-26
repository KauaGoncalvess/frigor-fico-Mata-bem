"use client";

import { Flame } from "lucide-react";
import type { ProdutoVitrine } from "@/lib/vitrine";
import { ProdutoCard } from "./produto-card";

export function Ofertas({ produtos }: { produtos: ProdutoVitrine[] }) {
  if (produtos.length === 0) return null;

  return (
    <section id="ofertas" className="relative scroll-mt-20 overflow-hidden py-14 sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(85% 100% at 15% 0%, rgba(122,20,36,0.32) 0%, transparent 62%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-4">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brasa-600/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-brasa-400">
              <Flame size={13} />
              Ofertas da semana
            </span>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Aproveite enquanto dura
            </h2>
          </div>
          <p className="text-[13px] text-creme-muted">
            Preços válidos até o fim da semana ou enquanto houver estoque.
          </p>
        </header>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {produtos.slice(0, 8).map((produto) => (
            <ProdutoCard key={produto.id} produto={produto} />
          ))}
        </div>
      </div>
    </section>
  );
}
