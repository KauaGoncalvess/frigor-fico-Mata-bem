import type { ReactNode } from "react";

/**
 * Abertura das páginas internas. Curta de propósito: quem clicou em "Produtos"
 * já sabe onde está e quer ver o conteúdo, não outra tela cheia.
 *
 * O `pt` grande abre espaço para o cabeçalho fixo.
 */
export function CabecaDePagina({
  rotulo,
  titulo,
  lead,
}: {
  rotulo: string;
  titulo: ReactNode;
  lead?: string;
}) {
  return (
    <section className="border-b border-osso/12 bg-noite-900">
      <div className="mx-auto max-w-[1240px] px-[clamp(18px,5vw,60px)] pt-[clamp(110px,14vw,180px)] pb-[clamp(40px,5vw,72px)]">
        <p className="rotulo text-terra-500">{rotulo}</p>
        <h1
          className="mt-5 max-w-[20ch] font-display leading-[1]"
          style={{ fontSize: "clamp(36px,7.5vw,92px)" }}
        >
          {titulo}
        </h1>
        {lead ? (
          <p
            className="mt-6 max-w-[56ch] leading-[1.8] text-osso/75"
            style={{ fontSize: "clamp(15px,2.4vw,18px)" }}
          >
            {lead}
          </p>
        ) : null}
      </div>
    </section>
  );
}
