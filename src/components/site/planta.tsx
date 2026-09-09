import { PLANTA } from "@/conteudo/empresa";
import { Capitulo } from "./capitulo";
import { Revelar } from "./revelar";

/**
 * 02 · A planta — os quatro números que sustentam a conversa comercial.
 * Sem cartão, sem caixa: cada número é aberto por um filete no topo, à moda
 * de tabela de relatório.
 */
export function Planta() {
  return (
    <section
      data-ch="02 · A planta"
      className="relative border-y border-osso/12 bg-noite-900"
    >
      <div className="mx-auto max-w-[1240px] px-[clamp(18px,5vw,60px)] py-[clamp(48px,6vw,86px)]">
        <Revelar>
          <Capitulo
            numero={PLANTA.numero}
            rotulo={PLANTA.rotulo}
            className="mb-[clamp(20px,2.6vw,30px)]"
          />
        </Revelar>

        <Revelar>
          <h2
            className="mb-[clamp(26px,3.4vw,44px)] max-w-[20ch] font-display leading-none"
            style={{ fontSize: "clamp(32px,7vw,88px)" }}
          >
            {PLANTA.titulo}
          </h2>
        </Revelar>

        <div className="grid gap-[clamp(22px,3vw,40px)] [grid-template-columns:repeat(auto-fit,minmax(230px,1fr))]">
          {PLANTA.numeros.map((item, i) => (
            <Revelar key={item.unidade} atraso={Math.min(i, 3) * 0.09}>
              <div className="border-t border-osso/20 pt-[22px]">
                <div
                  className="font-display leading-[.95]"
                  style={{ fontSize: "clamp(44px,8vw,80px)" }}
                >
                  {item.valor}
                </div>
                <div className="rotulo my-2.5 mb-3 text-terra-500">{item.unidade}</div>
                <p className="m-0 text-[14.5px] leading-[1.7] text-osso/60">{item.nota}</p>
              </div>
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  );
}
