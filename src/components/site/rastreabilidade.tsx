"use client";

import { useState } from "react";
import { RASTREIO } from "@/conteudo/operacao";
import { cn } from "@/lib/cn";

/**
 * A cadeia da rastreabilidade, do produtor ao cliente.
 *
 * Clicar numa etapa abre a explicação. São botões de verdade, não divs com
 * onClick: teclado e leitor de tela funcionam sem gambiarra. A explicação
 * ocupa altura fixa para a página não pular a cada troca.
 */
export function Rastreabilidade({ claro = false }: { claro?: boolean }) {
  const [aberta, setAberta] = useState(0);

  return (
    <div>
      <ol className="rolagem-oculta -mx-[clamp(18px,5vw,60px)] flex items-stretch gap-1.5 overflow-x-auto px-[clamp(18px,5vw,60px)] md:mx-0 md:px-0">
        {RASTREIO.map((passo, i) => {
          const ativa = i === aberta;
          return (
            <li key={passo.etapa} className="flex min-w-fit flex-1 items-center gap-1.5">
              <button
                type="button"
                onClick={() => setAberta(i)}
                aria-pressed={ativa}
                className={cn(
                  "rotulo w-full border px-3 py-3.5 text-center transition-colors duration-300",
                  ativa
                    ? claro
                      ? "border-terra-600 bg-terra-600 text-linho"
                      : "border-terra-500 bg-terra-500 text-noite-950"
                    : claro
                      ? "border-tinta/20 text-tinta/60 hover:border-tinta/50"
                      : "border-osso/20 text-osso/60 hover:border-osso/50",
                )}
              >
                {passo.etapa}
              </button>
              {i < RASTREIO.length - 1 ? (
                <span aria-hidden className={cn("text-sm", claro ? "text-tinta/30" : "text-osso/30")}>
                  →
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>

      <p
        className={cn(
          "mt-7 min-h-[5.5rem] max-w-[62ch] leading-[1.8]",
          claro ? "text-tinta/75" : "text-osso/75",
        )}
        style={{ fontSize: "clamp(15px,2.4vw,17.5px)" }}
      >
        {RASTREIO[aberta].detalhe}
      </p>
    </div>
  );
}
