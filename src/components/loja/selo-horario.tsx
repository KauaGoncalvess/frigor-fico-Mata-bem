"use client";

import { useEffect, useState } from "react";
import type { HorarioDia } from "@/lib/db/schema";
import { situacaoDaLoja, type SituacaoLoja } from "@/lib/horario";

/**
 * Selo "aberto agora / fechado".
 *
 * O valor inicial vem calculado do servidor para o primeiro pixel já sair
 * certo. Depois o componente recalcula sozinho a cada minuto: quem deixa a aba
 * aberta a tarde toda não pode ver "aberto" às 20h e mandar pedido no vazio.
 */
export function SeloHorario({
  horarios,
  inicial,
  className,
}: {
  horarios: HorarioDia[] | null;
  inicial: SituacaoLoja;
  className?: string;
}) {
  const [situacao, setSituacao] = useState(inicial);

  useEffect(() => {
    const recalcular = () => setSituacao(situacaoDaLoja(horarios));
    recalcular();
    const intervalo = setInterval(recalcular, 60_000);
    return () => clearInterval(intervalo);
  }, [horarios]);

  if (situacao.aberta === null) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
        situacao.aberta
          ? "border-sucesso/40 bg-sucesso/10 text-sucesso"
          : "border-carvao-600 bg-carvao-850 text-creme-muted"
      } ${className ?? ""}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          situacao.aberta ? "bg-sucesso" : "bg-creme-muted"
        }`}
      />
      {situacao.aberta ? "Aberto agora" : "Fechado"}
      <span className="font-normal opacity-80">· {situacao.detalhe}</span>
    </span>
  );
}
