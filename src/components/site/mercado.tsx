import Link from "next/link";
import { MERCADO, PUBLICOS } from "@/conteudo/mercado";
import { AConfirmar } from "./a-confirmar";
import { Revelar } from "./revelar";
import { Secao } from "./secao";

/**
 * 08 · Mercado.
 *
 * Sem evidência de exportação, a história é a atuação regional — e ela é
 * verdadeira. Forçar narrativa internacional é o tipo de coisa que um
 * comprador confere em cinco minutos.
 */
export function Mercado({ completo = false }: { completo?: boolean }) {
  return (
    <Secao
      id="mercado"
      capitulo="08 · Mercado"
      numero="08"
      rotulo="Mercado"
      titulo={MERCADO.titulo}
    >
      <Revelar>
        <p
          className="-mt-4 mb-4 max-w-[54ch] leading-[1.8] text-osso/75"
          style={{ fontSize: "clamp(15px,2.4vw,17.5px)" }}
        >
          {MERCADO.lead}
        </p>

        <AConfirmar dado={MERCADO.regiao} className="mb-[clamp(26px,3vw,44px)]">
          <p className="rotulo text-terra-500">{MERCADO.regiao.valor}</p>
        </AConfirmar>
      </Revelar>

      <div className="grid gap-[clamp(18px,2.4vw,30px)] [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
        {PUBLICOS.map((publico, i) => (
          <Revelar key={publico.titulo} atraso={Math.min(i, 3) * 0.09}>
            <div className="border-t border-osso/20 pt-5">
              <h3 className="font-display text-[clamp(20px,2.4vw,26px)] leading-tight">
                {publico.titulo}
              </h3>
              <p className="mt-2.5 text-[14.5px] leading-[1.7] text-osso/60">
                {publico.texto}
              </p>
            </div>
          </Revelar>
        ))}
      </div>

      {completo ? null : (
        <Revelar>
          <Link
            href="/mercado"
            className="rotulo mt-10 inline-block border-b border-terra-500 pb-1.5 text-terra-500 transition-colors hover:border-terra-400 hover:text-terra-400"
          >
            Onde atuamos →
          </Link>
        </Revelar>
      )}
    </Secao>
  );
}
