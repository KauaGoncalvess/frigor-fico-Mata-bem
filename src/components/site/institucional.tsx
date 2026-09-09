import Link from "next/link";
import { INSTITUCIONAL } from "@/conteudo/home";
import { Moldura } from "./moldura";
import { Revelar } from "./revelar";
import { Capitulo } from "./capitulo";

/** 01 · O Mata Bem — apresentação institucional, imagem à esquerda. */
export function Institucional() {
  return (
    <section
      data-ch="01 · O Mata Bem"
      className="mx-auto max-w-[1240px] px-[clamp(18px,5vw,60px)] py-[clamp(48px,6vw,86px)]"
    >
      <div className="grid items-center gap-[clamp(26px,3.6vw,52px)] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
        <Revelar>
          <Moldura
            alt="Planta industrial e equipe do Mata Bem"
            foto="institucional"
            className="h-[clamp(320px,50vw,560px)] w-full"
          />
        </Revelar>

        <Revelar>
          <Capitulo
            numero={INSTITUCIONAL.numero}
            rotulo={INSTITUCIONAL.rotulo}
            className="mb-[22px]"
          />

          <h2
            className="mb-6 font-display leading-[1.05]"
            style={{ fontSize: "clamp(28px,4.8vw,54px)" }}
          >
            {INSTITUCIONAL.titulo}
          </h2>

          {INSTITUCIONAL.paragrafos.map((paragrafo) => (
            <p
              key={paragrafo}
              className="mb-[18px] max-w-[48ch] leading-[1.8] text-osso/75 last:mb-0"
              style={{ fontSize: "clamp(15px,2.4vw,17.5px)" }}
            >
              {paragrafo}
            </p>
          ))}

          <Link
            href={INSTITUCIONAL.cta.href}
            className="rotulo mt-8 inline-block border-b border-terra-500 pb-1.5 text-terra-500 transition-colors hover:border-terra-400 hover:text-terra-400"
          >
            {INSTITUCIONAL.cta.rotulo} →
          </Link>
        </Revelar>
      </div>
    </section>
  );
}
