import { OFICIO } from "@/conteudo/empresa";
import { Capitulo } from "./capitulo";
import { Moldura } from "./moldura";
import { Revelar } from "./revelar";

/**
 * 03 · O ofício — a citação em serifada grande à esquerda, e à direita a peça
 * recortada, que flutua devagar sobre a própria sombra.
 */
export function Oficio() {
  return (
    <section
      data-ch="03 · O ofício"
      className="relative grid items-center overflow-hidden border-y border-osso/12 bg-noite-900"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 60% at 20% 30%, rgba(194,101,60,.1), transparent 70%)",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-[1240px] items-center gap-[clamp(26px,3.6vw,52px)] px-[clamp(18px,5vw,60px)] py-[clamp(48px,6vw,86px)] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
        <Revelar>
          <Capitulo numero={OFICIO.numero} rotulo={OFICIO.rotulo} className="mb-5" />

          <blockquote
            className="m-0 mb-[22px] font-display leading-[1.08]"
            style={{ fontSize: "clamp(26px,5vw,56px)" }}
          >
            {OFICIO.citacao}
          </blockquote>

          <p
            className="m-0 max-w-[52ch] leading-[1.8] text-osso/70"
            style={{ fontSize: "clamp(14.5px,2.4vw,17px)" }}
          >
            {OFICIO.paragrafo}
          </p>
        </Revelar>

        <Revelar className="w-full">
          <div className="relative mx-auto w-full max-w-[540px]">
            {/* Halo frio atrás da peça: separa o recorte do fundo quente. */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[46%] h-full w-[118%] -translate-x-1/2 -translate-y-1/2"
              style={{
                background:
                  "radial-gradient(closest-side, #232b31 0%, rgba(35,43,49,.5) 58%, transparent 82%)",
              }}
            />

            <div
              className="relative"
              style={{
                animation: "flutuar 7s ease-in-out infinite",
                maskImage:
                  "radial-gradient(78% 74% at 50% 44%, #000 56%, rgba(0,0,0,.55) 82%, transparent 99%)",
                WebkitMaskImage:
                  "radial-gradient(78% 74% at 50% 44%, #000 56%, rgba(0,0,0,.55) 82%, transparent 99%)",
              }}
            >
              <Moldura alt="Bovino e cortes de carne" className="aspect-4/3 w-full" />
            </div>

            <div
              aria-hidden
              className="relative mx-auto -mt-[6%] h-[clamp(16px,3vw,30px)] w-[62%] rounded-[50%] blur-[9px]"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(0,0,0,.72), rgba(0,0,0,.28) 62%, transparent 100%)",
                animation: "flutuar-sombra 7s ease-in-out infinite",
              }}
            />

            <p className="rotulo mt-[clamp(14px,2vw,22px)] text-center text-osso/50">
              {OFICIO.legenda}
            </p>
          </div>
        </Revelar>
      </div>
    </section>
  );
}
