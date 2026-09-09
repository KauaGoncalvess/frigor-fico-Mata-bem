import { EMPRESA, ORIGEM } from "@/conteudo/empresa";
import { Capitulo } from "./capitulo";
import { Moldura } from "./moldura";
import { Revelar } from "./revelar";

/**
 * 01 · A origem — texto e imagem lado a lado. O grid é `auto-fit`, então em
 * telas estreitas as duas colunas viram uma sem precisar de breakpoint.
 */
export function Origem() {
  return (
    <section
      data-ch="01 · A origem"
      className="mx-auto max-w-[1240px] px-[clamp(18px,5vw,60px)] py-[clamp(48px,6vw,86px)]"
    >
      <div className="grid items-center gap-[clamp(26px,3.6vw,52px)] [grid-template-columns:repeat(auto-fit,minmax(290px,1fr))]">
        <Revelar>
          <Capitulo numero={ORIGEM.numero} rotulo={ORIGEM.rotulo} className="mb-[22px]" />

          <h2
            className="mb-6 font-display leading-[1.05]"
            style={{ fontSize: "clamp(30px,5.6vw,62px)" }}
          >
            {ORIGEM.titulo}
          </h2>

          {ORIGEM.paragrafos.map((paragrafo) => (
            <p
              key={paragrafo}
              className="mb-[18px] max-w-[46ch] leading-[1.8] text-osso/75 last:mb-0"
              style={{ fontSize: "clamp(15px,2.4vw,17.5px)" }}
            >
              {paragrafo}
            </p>
          ))}

          {/* Quem é o cliente vem cedo: numa página B2B, essa linha qualifica
              o visitante antes que ele decida continuar rolando. */}
          <p className="rotulo mt-8 border-t border-osso/20 pt-4 text-osso/50">
            Atendemos {EMPRESA.atendemos.toLowerCase()}
          </p>
        </Revelar>

        <Revelar>
          <Moldura
            alt="Bovinos jovens em pastagem"
            legenda={ORIGEM.legenda}
            posicao="50% 30%"
            // A altura fica reservada desde já: quando a foto real entrar, a
            // página não pula.
            className="h-[clamp(340px,56vw,620px)] w-full"
          />
        </Revelar>
      </div>
    </section>
  );
}
