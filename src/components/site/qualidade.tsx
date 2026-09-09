import Link from "next/link";
import { CERTIFICACOES, PILARES } from "@/conteudo/qualidade";
import { AConfirmar } from "./a-confirmar";
import { Revelar } from "./revelar";
import { Secao } from "./secao";

/** 04 · Qualidade — os quatro pilares. Prática descrita, não selo prometido. */
export function Qualidade({ completo = false }: { completo?: boolean }) {
  return (
    <Secao
      id="qualidade"
      capitulo="04 · Qualidade"
      numero="04"
      rotulo="Qualidade"
      titulo={
        <>
          Qualidade não é uma etapa. É parte de <span className="italic">todo</span> o processo.
        </>
      }
      fundo="alternado"
    >
      <div className="grid gap-[clamp(22px,3vw,40px)] [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
        {PILARES.map((pilar, i) => (
          <Revelar key={pilar.titulo} atraso={Math.min(i, 3) * 0.09}>
            <div className="border-t border-osso/20 pt-5">
              <h3 className="font-display text-[clamp(22px,2.6vw,30px)] leading-tight">
                {pilar.titulo}
              </h3>
              <p className="mt-3 text-[14.5px] leading-[1.7] text-osso/60">{pilar.texto}</p>
            </div>
          </Revelar>
        ))}
      </div>

      {completo ? (
        <div className="mt-[clamp(36px,4.4vw,64px)]">
          <Revelar>
            <h3 className="rotulo mb-6 text-osso/45">Registros e certificações</h3>
          </Revelar>
          <dl className="m-0 grid gap-0">
            {CERTIFICACOES.map((cert, i) => (
              <Revelar key={cert.sigla}>
                <div
                  className={`grid gap-x-[30px] gap-y-2 border-t border-osso/15 py-5 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))] ${
                    i === CERTIFICACOES.length - 1 ? "border-b" : ""
                  }`}
                >
                  <dt className="rotulo text-osso/45">
                    {cert.sigla} · {cert.nome}
                  </dt>
                  <dd className="m-0">
                    <AConfirmar dado={cert.detalhe}>
                      <span
                        className="font-display"
                        style={{ fontSize: "clamp(18px,2.4vw,24px)" }}
                      >
                        {cert.detalhe.valor}
                      </span>
                    </AConfirmar>
                  </dd>
                </div>
              </Revelar>
            ))}
          </dl>
        </div>
      ) : (
        <Revelar>
          <Link
            href="/qualidade"
            className="rotulo mt-10 inline-block border-b border-terra-500 pb-1.5 text-terra-500 transition-colors hover:border-terra-400 hover:text-terra-400"
          >
            Como controlamos a qualidade →
          </Link>
        </Revelar>
      )}
    </Secao>
  );
}
