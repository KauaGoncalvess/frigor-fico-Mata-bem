import { cn } from "@/lib/cn";

/**
 * Espaço de imagem.
 *
 * As fotos definitivas serão feitas na própria unidade. Até lá cada espaço usa
 * o placeholder de `public/placeholders/`, gerado por `npm run placeholders`:
 * grafite frio, com a legenda da foto que vai ali.
 *
 * Trocar por foto real é soltar um arquivo com o mesmo nome naquela pasta, ou
 * passar `src` aqui. A altura vem do `className` e fica reservada desde já,
 * para a página não pular quando a foto entrar.
 */
export function Moldura({
  alt,
  foto,
  src,
  legenda,
  posicao = "50% 50%",
  className,
}: {
  alt: string;
  /** Nome do arquivo em public/placeholders/, sem extensão. */
  foto?: string;
  /** Caminho explícito, quando a foto real já existe. */
  src?: string;
  legenda?: string;
  posicao?: string;
  className?: string;
}) {
  const endereco = src ?? (foto ? `/placeholders/${foto}.svg` : undefined);

  return (
    <figure className={cn("relative m-0 overflow-hidden", className)}>
      {endereco ? (
        // eslint-disable-next-line @next/next/no-img-element -- imagem de sangria, sem otimização de layout
        <img
          src={endereco}
          alt={alt}
          style={{ objectPosition: posicao }}
          className="block h-full w-full object-cover"
        />
      ) : (
        <div role="img" aria-label={alt} className="absolute inset-0 bg-noite-900" />
      )}

      {legenda ? (
        <>
          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent from-55% to-noite-950/70" />
          <figcaption className="rotulo absolute inset-x-5 bottom-[18px] text-osso/80">
            {legenda}
          </figcaption>
        </>
      ) : null}
    </figure>
  );
}
