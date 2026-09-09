import Link from "next/link";
import { PRODUTOS, PRODUTOS_TEXTO } from "@/conteudo/produtos";
import { AConfirmar } from "./a-confirmar";
import { Moldura } from "./moldura";
import { Revelar } from "./revelar";
import { Secao } from "./secao";

/**
 * Produtos.
 *
 * `completo` mostra os seis; na home entram só os quatro primeiros, com link
 * para a página. O catálogo real ainda não foi confirmado — cada card carrega
 * a sua etiqueta.
 */
export function Produtos({ completo = false }: { completo?: boolean }) {
  const lista = completo ? PRODUTOS : PRODUTOS.slice(0, 4);

  return (
    <Secao
      id="produtos"
      capitulo="03 · Produtos"
      numero="03"
      rotulo="Produtos"
      titulo={PRODUTOS_TEXTO.titulo}
    >
      <Revelar>
        <p
          className="-mt-4 mb-[clamp(26px,3vw,44px)] max-w-[52ch] leading-[1.8] text-osso/70"
          style={{ fontSize: "clamp(15px,2.4vw,17.5px)" }}
        >
          {PRODUTOS_TEXTO.subtitulo}
        </p>
      </Revelar>

      <div className="grid gap-[clamp(18px,2.4vw,30px)] [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]">
        {lista.map((produto, i) => (
          <Revelar key={produto.id} atraso={Math.min(i, 3) * 0.09}>
            <article id={produto.id} className="border-t border-osso/20 pt-5">
              <Moldura
                alt={produto.nome}
                foto={`produto-${produto.id}`}
                className="mb-5 h-[clamp(180px,22vw,240px)] w-full"
              />
              <AConfirmar dado={produto.disponivel}>
                <h3 className="font-display text-[clamp(22px,2.6vw,28px)] leading-tight">
                  {produto.nome}
                </h3>
                <p className="mt-2.5 text-[14.5px] leading-[1.7] text-osso/60">
                  {produto.descricao}
                </p>
              </AConfirmar>
            </article>
          </Revelar>
        ))}
      </div>

      {completo ? null : (
        <Revelar>
          <Link
            href="/produtos"
            className="rotulo mt-10 inline-block border-b border-terra-500 pb-1.5 text-terra-500 transition-colors hover:border-terra-400 hover:text-terra-400"
          >
            Ver todos os produtos →
          </Link>
        </Revelar>
      )}
    </Secao>
  );
}
