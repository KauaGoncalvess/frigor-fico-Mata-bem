import { NUMEROS } from "@/conteudo/home";
import { estaConfirmado } from "@/conteudo/tipos";
import { AConfirmar } from "./a-confirmar";
import { Revelar } from "./revelar";

/**
 * Faixa de números.
 *
 * Regra do briefing, e é uma boa regra: número inventado não entra. Se nenhum
 * estiver confirmado, a faixa inteira não vai ao ar — cinco caixinhas escritas
 * "a confirmar" fazem a empresa parecer menor, não maior.
 *
 * Hoje ela não renderiza. Assim que o dono confirmar o primeiro número, aparece
 * sozinha, já mostrando só os confirmados.
 */
export function Numeros() {
  const publicaveis = NUMEROS.filter((item) => estaConfirmado(item.valor));
  if (publicaveis.length === 0) return null;

  return (
    <section className="border-y border-osso/12 bg-noite-900">
      <div className="mx-auto max-w-[1240px] px-[clamp(18px,5vw,60px)] py-[clamp(36px,4.4vw,64px)]">
        <div className="grid gap-[clamp(22px,3vw,40px)] [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
          {publicaveis.map((item, i) => (
            <Revelar key={item.unidade} atraso={Math.min(i, 3) * 0.09}>
              <AConfirmar dado={item.valor}>
                <div className="border-t border-osso/20 pt-5">
                  <div
                    className="font-display leading-[.95]"
                    style={{ fontSize: "clamp(40px,6vw,72px)" }}
                  >
                    {item.valor.valor}
                  </div>
                  <div className="rotulo mt-2.5 text-terra-500">{item.unidade}</div>
                </div>
              </AConfirmar>
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  );
}
