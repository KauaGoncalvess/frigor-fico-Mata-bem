import { WAGYU } from "@/conteudo/qualidade";
import { AConfirmar } from "./a-confirmar";
import { Capitulo } from "./capitulo";
import { Moldura } from "./moldura";
import { Revelar } from "./revelar";

/**
 * 05 · Wagyu — a única seção clara.
 *
 * Depois de várias telas de quase preto, o linho força a pausa e entrega o
 * diferencial mais forte da empresa. A afirmação é atribuída à FIEMG no corpo
 * do texto de propósito: é alegação de certificação, não fato próprio.
 */
export function Wagyu() {
  return (
    <section data-ch="05 · Wagyu" className="bg-linho text-tinta">
      <div className="mx-auto max-w-[1240px] px-[clamp(18px,5vw,60px)] py-[clamp(48px,6vw,86px)]">
        <Revelar className="mx-auto max-w-[800px] text-center">
          <Capitulo numero="05" rotulo={WAGYU.rotulo} claro centralizado className="mb-[22px]" />

          <h2
            className="mb-[26px] font-display leading-[.98]"
            style={{ fontSize: "clamp(34px,7vw,88px)" }}
          >
            {WAGYU.tituloAntes}
            <span className="italic text-terra-600">{WAGYU.tituloDestaque}</span>.
          </h2>

          <p
            className="mx-auto mb-4 max-w-[56ch] leading-[1.75] text-tinta/80"
            style={{ fontSize: "clamp(15px,2.5vw,18.5px)" }}
          >
            {WAGYU.paragrafo}
          </p>

          <AConfirmar dado={WAGYU.nota} claro className="mx-auto max-w-[54ch]">
            <p className="text-[14.5px] leading-[1.75] text-tinta/60">{WAGYU.nota.valor}</p>
          </AConfirmar>
        </Revelar>

        <Revelar className="mt-[clamp(24px,3.4vw,44px)]">
          <div className="grid gap-[clamp(14px,2.4vw,26px)] [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
            {[
              { alt: "Rebanho", foto: "wagyu-1" },
              { alt: "Bovinos em pastagem", foto: "wagyu-2" },
              { alt: "Suínos", foto: "wagyu-3" },
            ].map((item) => (
              <Moldura
                key={item.foto}
                alt={item.alt}
                foto={item.foto}
                className="h-[clamp(200px,26vw,300px)] w-full"
              />
            ))}
          </div>
        </Revelar>
      </div>
    </section>
  );
}
