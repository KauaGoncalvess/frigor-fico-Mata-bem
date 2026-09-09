import { WAGYU } from "@/conteudo/empresa";
import { Capitulo } from "./capitulo";
import { Moldura } from "./moldura";
import { Revelar } from "./revelar";

/**
 * 04 · Wagyu — a única seção clara. A inversão de contraste no meio da página
 * é o clímax: depois de cinco telas de quase preto, o linho força a pausa e
 * entrega o argumento mais forte da empresa.
 *
 * A afirmação é atribuída à FIEMG no corpo do texto de propósito — é uma
 * alegação de certificação, não deve aparecer como fato próprio sem fonte.
 */
export function Wagyu() {
  return (
    <section data-ch="04 · Wagyu" className="bg-linho text-tinta">
      <div className="mx-auto max-w-[1240px] px-[clamp(18px,5vw,60px)] py-[clamp(48px,6vw,86px)]">
        <Revelar className="mx-auto max-w-[800px] text-center">
          <Capitulo
            numero={WAGYU.numero}
            rotulo={WAGYU.rotulo}
            claro
            centralizado
            className="mb-[22px]"
          />

          <h2
            className="mb-[26px] font-display leading-[.98]"
            style={{ fontSize: "clamp(34px,8vw,96px)" }}
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

          <p className="mx-auto max-w-[54ch] text-[14.5px] leading-[1.75] text-tinta/60">
            {WAGYU.nota}
          </p>
        </Revelar>

        <Revelar className="mt-[clamp(24px,3.4vw,44px)]">
          <div className="grid gap-[clamp(14px,2.4vw,26px)] [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
            {WAGYU.galeria.map((foto) => (
              <Moldura
                key={foto.alt}
                alt={foto.alt}
                className="h-[clamp(220px,30vw,340px)] w-full"
              />
            ))}
          </div>
        </Revelar>
      </div>
    </section>
  );
}
