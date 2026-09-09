import { cn } from "@/lib/cn";

/**
 * Espaço de imagem.
 *
 * As fotos definitivas ainda não existem — serão feitas na própria planta. Até
 * lá esta moldura desenha um gradiente com grão no lugar, reservando a altura
 * exata da foto para que a página não pule quando ela entrar (CLS). Trocar por
 * imagem real é passar `src`: nada mais muda.
 */
export function Moldura({
  legenda,
  className,
  alt,
  src,
  posicao = "50% 50%",
}: {
  legenda?: string;
  className?: string;
  alt: string;
  src?: string;
  posicao?: string;
}) {
  return (
    <figure className={cn("relative m-0 overflow-hidden", className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- foto de sangria, sem otimização de layout
        <img
          src={src}
          alt={alt}
          style={{ objectPosition: posicao }}
          className="block h-full w-full object-cover"
        />
      ) : (
        <div role="img" aria-label={alt} className="absolute inset-0">
          <div className="absolute inset-0 bg-linear-135 from-noite-900 via-noite-950 to-black" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 30% 20%, rgba(194,101,60,.22), transparent 62%)",
            }}
          />
          <div className="grao absolute inset-0 opacity-25 mix-blend-soft-light" />
          {/* Sem o filete a moldura some no fundo escuro e a composição
              perde a marcação do lugar da foto. */}
          <div className="absolute inset-0 border border-osso/12" />
        </div>
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
