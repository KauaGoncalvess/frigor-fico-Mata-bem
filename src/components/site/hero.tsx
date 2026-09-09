import Link from "next/link";
import { CTA_COMERCIAL } from "@/conteudo/navegacao";
import { HERO } from "@/conteudo/home";
import { Moldura } from "./moldura";

const CINEMA = "cubic-bezier(.16,1,.3,1)";

/**
 * Hero de tela cheia.
 *
 * Sem promessa vaga: a manchete descreve o que a empresa faz, e a prova vem
 * nas seções seguintes. "O melhor frigorífico do Brasil" é o tipo de frase que
 * um comprador profissional desconta na hora.
 */
export function Hero() {
  return (
    <section
      data-ch="Início"
      className="relative grid min-h-[600px] h-svh items-center overflow-hidden"
    >
      <div
        className="absolute inset-x-0 -inset-y-[10%] overflow-hidden"
        style={{ animation: `aproximar 2.4s ${CINEMA} both` }}
      >
        <Moldura
          alt="Estrutura do frigorífico"
          foto="hero"
          posicao="50% 45%"
          className="h-full w-full"
        />
      </div>

      <div className="absolute inset-0 bg-linear-to-b from-noite-950/85 via-noite-950/60 via-45% to-noite-950/96" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(76% 56% at 50% 48%, rgba(11,10,9,.6), transparent 74%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1240px] px-[clamp(18px,5vw,60px)] pt-20">
        <div
          className="rotulo text-osso/75"
          style={{ animation: `letra 1.6s ${CINEMA} .3s both` }}
        >
          {HERO.kicker}
        </div>

        <h1
          className="mt-[clamp(16px,3vw,30px)] max-w-[16ch] font-display"
          style={{
            fontSize: "clamp(44px,9vw,116px)",
            lineHeight: 0.93,
            letterSpacing: "-.02em",
            animation: `subir 1.5s ${CINEMA} .5s both`,
          }}
        >
          {HERO.titulo}
          <br />
          <span className="text-terra-500">{HERO.tituloDestaque}</span>
        </h1>

        <div style={{ animation: `subir 1.4s ${CINEMA} .8s both` }}>
          <p
            className="mt-[clamp(20px,3vw,32px)] max-w-[48ch] leading-[1.7] text-osso/85"
            style={{ fontSize: "clamp(15px,2.4vw,19px)" }}
          >
            {HERO.lead}
          </p>

          <div className="mt-[clamp(26px,3.4vw,44px)] flex flex-wrap gap-3">
            <Link
              href={HERO.cta.href}
              className="rotulo border border-terra-500 bg-terra-500 px-6 py-4 text-noite-950 transition-colors hover:border-terra-400 hover:bg-terra-400"
            >
              {HERO.cta.rotulo}
            </Link>
            <Link
              href={CTA_COMERCIAL.href}
              className="rotulo border border-osso/30 px-6 py-4 text-osso transition-colors hover:border-osso"
            >
              {CTA_COMERCIAL.rotulo} →
            </Link>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="absolute bottom-6 left-1/2 h-[54px] w-px origin-top -translate-x-1/2 bg-linear-to-b from-transparent to-osso/50"
        style={{ animation: `barra 1.4s ${CINEMA} 1.3s both` }}
      />
    </section>
  );
}
