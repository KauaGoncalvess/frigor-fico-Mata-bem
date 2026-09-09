import { ETAPAS } from "@/conteudo/operacao";
import { Revelar } from "./revelar";
import { Secao } from "./secao";

/**
 * 02 · Nossa operação — as seis etapas, do produtor à distribuição.
 *
 * Frigorífico é operação industrial, não "empresa que vende carne". Mostrar o
 * encadeamento prova qualidade melhor do que qualquer adjetivo.
 *
 * No celular vira um trilho horizontal: seis blocos empilhados dariam uma
 * rolagem longa e sem ritmo, e o gesto lateral reforça a ideia de linha.
 */
export function Operacao() {
  return (
    <Secao
      capitulo="02 · Nossa operação"
      numero="02"
      rotulo="Nossa operação"
      titulo="Qualidade como processo, não como slogan."
      fundo="alternado"
    >
      <Revelar>
        <ol className="rolagem-oculta -mx-[clamp(18px,5vw,60px)] flex snap-x snap-mandatory gap-5 overflow-x-auto px-[clamp(18px,5vw,60px)] pb-2 md:mx-0 md:grid md:snap-none md:overflow-visible md:px-0 md:[grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          {ETAPAS.map((etapa) => (
            <li
              key={etapa.numero}
              className="min-w-[74vw] snap-start border-t border-osso/20 pt-5 sm:min-w-[46vw] md:min-w-0"
            >
              <span
                className="font-display italic leading-none text-terra-500"
                style={{ fontSize: "clamp(28px,4vw,42px)" }}
              >
                {etapa.numero}
              </span>
              <h3 className="mt-3 font-display text-[clamp(22px,2.6vw,28px)] leading-tight">
                {etapa.titulo}
              </h3>
              <p className="mt-2.5 text-[14.5px] leading-[1.7] text-osso/60">
                {etapa.texto}
              </p>
            </li>
          ))}
        </ol>
      </Revelar>
    </Secao>
  );
}
