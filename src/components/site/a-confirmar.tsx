import type { ReactNode } from "react";
import type { Dado } from "@/conteudo/tipos";
import { cn } from "@/lib/cn";

/**
 * Etiqueta de pendência.
 *
 * Marca, sem estragar a página, tudo que ainda não foi confirmado pela empresa.
 * Não é um alerta de erro: é um bilhete para o dono, num site que ele vai abrir
 * na frente de cliente. Quando `confirmado` vira `true`, some sozinha.
 */
export function AConfirmar({
  dado,
  children,
  claro = false,
  className,
}: {
  dado: Dado<unknown>;
  children: ReactNode;
  claro?: boolean;
  className?: string;
}) {
  if (dado.confirmado) return <>{children}</>;

  return (
    <div className={cn("relative", className)}>
      {children}
      <p
        className={cn(
          "rotulo mt-3 inline-flex items-center gap-2 border-l-2 pl-2.5",
          claro ? "border-terra-600 text-tinta/45" : "border-terra-500 text-osso/40",
        )}
      >
        A confirmar
        {dado.fonte ? <span className="normal-case tracking-normal">· {dado.fonte}</span> : null}
      </p>
    </div>
  );
}
