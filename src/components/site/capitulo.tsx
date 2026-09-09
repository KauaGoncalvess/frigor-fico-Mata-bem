import { cn } from "@/lib/cn";

/**
 * O par numeral + rótulo que abre cada capítulo. O numeral vai em serifada
 * itálica na cor de acento; o rótulo, em versalete espaçado. Repete-se seis
 * vezes na página, sempre alinhado pela linha de base.
 */
export function Capitulo({
  numero,
  rotulo,
  claro = false,
  centralizado = false,
  className,
}: {
  numero: string;
  rotulo: string;
  /** Na seção Wagyu o fundo é claro e as cores se invertem. */
  claro?: boolean;
  centralizado?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "items-baseline gap-3.5",
        centralizado ? "inline-flex" : "flex",
        className,
      )}
    >
      <span
        className={cn("font-display italic leading-none", claro ? "text-terra-600" : "text-terra-500")}
        style={{ fontSize: "clamp(34px,6vw,58px)" }}
      >
        {numero}
      </span>
      <span className={cn("rotulo", claro ? "text-tinta/55" : "text-osso/50")}>
        {rotulo}
      </span>
    </div>
  );
}
