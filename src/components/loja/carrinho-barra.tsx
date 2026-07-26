"use client";

import { AnimatePresence, motion } from "motion/react";
import { ShoppingBag } from "lucide-react";
import { formatarPreco } from "@/lib/format";
import { useCarrinho } from "./carrinho-contexto";

/**
 * Barra de carrinho sempre à vista.
 *
 * Fica fixa no rodapé no celular (onde está a maior parte dos clientes) e
 * flutua no canto inferior direito no desktop. O cliente nunca precisa rolar
 * para saber quanto já colocou no pedido.
 */
export function CarrinhoBarra() {
  const { totalItens, totalCentavos, abrirPainel } = useCarrinho();
  const visivel = totalItens > 0;

  return (
    <AnimatePresence>
      {visivel && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="fixed inset-x-0 bottom-0 z-50 p-3 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:p-0"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <button
            type="button"
            onClick={abrirPainel}
            className="flex w-full items-center gap-3 rounded-2xl bg-brasa-600 px-4 py-3.5 text-left text-white shadow-[0_18px_44px_-16px_rgba(224,75,35,0.95)] transition hover:bg-brasa-500 active:scale-[0.99] sm:w-auto sm:min-w-[300px]"
          >
            <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15">
              <ShoppingBag size={19} />
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-ambar-400 px-1 text-[11px] font-bold text-carvao-950">
                {totalItens}
              </span>
            </span>
            <span className="flex-1">
              <span className="block text-[11px] font-medium uppercase tracking-wider text-white/75">
                Total estimado
              </span>
              <span className="block text-lg font-bold leading-tight tabular-nums">
                {formatarPreco(totalCentavos)}
              </span>
            </span>
            <span className="rounded-lg bg-carvao-950/25 px-3 py-2 text-[13px] font-bold">
              Ver pedido
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
