import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Capitulo } from "./capitulo";
import { Revelar } from "./revelar";

/**
 * A casca de uma seção: largura, respiro e o par numeral + rótulo que abre
 * cada capítulo. Estava copiada em cada arquivo de seção; agora mora aqui.
 */
export function Secao({
  id,
  capitulo,
  numero,
  rotulo,
  titulo,
  fundo = "escuro",
  centralizado = false,
  children,
  className,
}: {
  id?: string;
  /** Valor de `data-ch`, lido pelo indicador de capítulo do rodapé. */
  capitulo?: string;
  numero?: string;
  rotulo?: string;
  titulo?: ReactNode;
  fundo?: "escuro" | "alternado" | "claro";
  centralizado?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  const claro = fundo === "claro";

  return (
    <section
      id={id}
      data-ch={capitulo}
      className={cn(
        fundo === "alternado" && "border-y border-osso/12 bg-noite-900",
        claro && "bg-linho text-tinta",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-[1240px] px-[clamp(18px,5vw,60px)] py-[clamp(48px,6vw,86px)]",
          centralizado && "text-center",
        )}
      >
        {numero && rotulo ? (
          <Revelar>
            <Capitulo
              numero={numero}
              rotulo={rotulo}
              claro={claro}
              centralizado={centralizado}
              className="mb-[clamp(20px,2.6vw,30px)]"
            />
          </Revelar>
        ) : null}

        {titulo ? (
          <Revelar>
            <h2
              className={cn(
                "font-display leading-[1.02]",
                centralizado ? "mx-auto max-w-[24ch]" : "max-w-[22ch]",
                "mb-[clamp(24px,3.2vw,40px)]",
              )}
              style={{ fontSize: "clamp(30px,6vw,74px)" }}
            >
              {titulo}
            </h2>
          </Revelar>
        ) : null}

        {children}
      </div>
    </section>
  );
}
