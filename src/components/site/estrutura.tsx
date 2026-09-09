import { ESTRUTURA } from "@/conteudo/qualidade";
import { Moldura } from "./moldura";
import { Revelar } from "./revelar";
import { Secao } from "./secao";

/**
 * 06 · Estrutura — o frigorífico como indústria.
 *
 * Esta seção é a que mais depende de foto real. Enquanto o ensaio na unidade
 * não acontece, as molduras marcam o lugar e a legenda diz o que vai ali —
 * assim o dono sabe exatamente quais imagens precisa providenciar.
 */
export function Estrutura() {
  return (
    <Secao
      id="estrutura"
      capitulo="06 · Estrutura"
      numero="06"
      rotulo="Estrutura"
      titulo={ESTRUTURA.titulo}
    >
      <div className="grid gap-[clamp(14px,2vw,22px)] [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
        {ESTRUTURA.fotos.map((legenda, i) => (
          <Revelar key={legenda} atraso={Math.min(i, 3) * 0.09}>
            <Moldura
              alt={legenda}
              legenda={legenda}
              className="h-[clamp(200px,24vw,290px)] w-full"
            />
          </Revelar>
        ))}
      </div>

      <Revelar>
        <p className="rotulo mt-8 border-l-2 border-terra-500 pl-2.5 text-osso/40">
          A confirmar · fotografia da própria unidade
        </p>
      </Revelar>
    </Secao>
  );
}
