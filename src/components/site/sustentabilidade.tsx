import Link from "next/link";
import { PRATICAS, SUSTENTABILIDADE } from "@/conteudo/sustentabilidade";
import { AConfirmar } from "./a-confirmar";
import { Revelar } from "./revelar";
import { Secao } from "./secao";

/**
 * 07 · Sustentabilidade.
 *
 * Sem folha verde e sem promessa vaga. A única coisa comprovável hoje é o
 * licenciamento ambiental; as cinco práticas ficam como estrutura, marcadas,
 * até a empresa dizer o que de fato faz.
 */
export function Sustentabilidade({ completo = false }: { completo?: boolean }) {
  return (
    <Secao
      id="sustentabilidade"
      capitulo="07 · Sustentabilidade"
      numero="07"
      rotulo="Sustentabilidade"
      titulo={SUSTENTABILIDADE.titulo}
      fundo="alternado"
    >
      <Revelar>
        <p
          className="-mt-4 mb-[clamp(26px,3vw,44px)] max-w-[54ch] leading-[1.8] text-osso/70"
          style={{ fontSize: "clamp(15px,2.4vw,17.5px)" }}
        >
          {SUSTENTABILIDADE.lead}
        </p>
      </Revelar>

      <div className="grid gap-[clamp(18px,2.4vw,30px)] [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
        {PRATICAS.map((pratica, i) => (
          <Revelar key={pratica.titulo} atraso={Math.min(i, 3) * 0.09}>
            <div className="border-t border-osso/20 pt-5">
              <span aria-hidden className="text-2xl">
                {pratica.emoji}
              </span>
              <h3 className="mt-3 font-display text-[clamp(20px,2.4vw,26px)] leading-tight">
                {pratica.titulo}
              </h3>
              <AConfirmar dado={pratica.texto}>
                <p className="mt-2.5 text-[14.5px] leading-[1.7] text-osso/60">
                  {pratica.texto.valor}
                </p>
              </AConfirmar>
            </div>
          </Revelar>
        ))}
      </div>

      <Revelar>
        <AConfirmar dado={SUSTENTABILIDADE.licenca} className="mt-[clamp(30px,3.6vw,50px)]">
          <p className="max-w-[62ch] border-l-2 border-osso/20 pl-5 leading-[1.8] text-osso/70">
            {SUSTENTABILIDADE.licenca.valor}
          </p>
        </AConfirmar>
      </Revelar>

      {completo ? null : (
        <Revelar>
          <Link
            href="/sustentabilidade"
            className="rotulo mt-10 inline-block border-b border-terra-500 pb-1.5 text-terra-500 transition-colors hover:border-terra-400 hover:text-terra-400"
          >
            Conheça nossas práticas →
          </Link>
        </Revelar>
      )}
    </Secao>
  );
}
