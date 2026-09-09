import { EVIDENCIAS, RIGOR } from "@/conteudo/empresa";
import { cn } from "@/lib/cn";
import { Capitulo } from "./capitulo";
import { Revelar } from "./revelar";

/**
 * 05 · O rigor — a tabela de evidências. É a seção que fecha a venda para um
 * comprador profissional: registro, órgão, licenciamento, validade.
 *
 * Cada linha vem de `EVIDENCIAS`, onde carrega `confirmado`. Enquanto o dono
 * não validar os números, o rodapé da seção diz de onde eles vieram — melhor
 * declarar a origem do que afirmar seco o que ainda não foi conferido.
 */
export function Rigor() {
  const pendentes = EVIDENCIAS.filter((evidencia) => !evidencia.confirmado);

  return (
    <section
      data-ch="05 · O rigor"
      className="mx-auto max-w-[1240px] px-[clamp(18px,5vw,60px)] py-[clamp(48px,6vw,86px)]"
    >
      <Revelar>
        <Capitulo
          numero={RIGOR.numero}
          rotulo={RIGOR.rotulo}
          className="mb-[clamp(20px,2.6vw,30px)]"
        />
      </Revelar>

      <Revelar>
        <h2
          className="mb-[clamp(24px,3.2vw,40px)] max-w-[22ch] font-display leading-[1.02]"
          style={{ fontSize: "clamp(30px,6vw,74px)" }}
        >
          {RIGOR.titulo}
        </h2>
      </Revelar>

      <dl className="m-0 grid gap-0">
        {EVIDENCIAS.map((evidencia, i) => (
          <Revelar key={evidencia.rotulo}>
            {/* `last:` não serve aqui: cada linha é filha única do seu Revelar. */}
            <div
              className={cn(
                "grid gap-x-[30px] gap-y-2 border-t border-osso/15 py-5 transition-colors duration-300 hover:bg-osso/3 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]",
                i === EVIDENCIAS.length - 1 && "border-b",
              )}
            >
              <dt className="rotulo text-osso/45">{evidencia.rotulo}</dt>
              <dd
                className="m-0 font-display"
                style={{ fontSize: "clamp(20px,3.2vw,28px)" }}
              >
                {evidencia.valor}
              </dd>
            </div>
          </Revelar>
        ))}
      </dl>

      {pendentes.length > 0 ? (
        <p className="mt-6 max-w-[62ch] text-[13px] leading-[1.7] text-osso/40">
          Dados levantados junto a {[...new Set(EVIDENCIAS.map((e) => e.fonte))].join(", ")}.
        </p>
      ) : null}
    </section>
  );
}
