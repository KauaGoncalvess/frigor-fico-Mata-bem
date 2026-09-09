import { ABERTURA } from "@/conteudo/empresa";
import { Moldura } from "./moldura";

const CINEMA = "cubic-bezier(.16,1,.3,1)";

/**
 * 00 · Abertura — tela cheia. O nome da empresa em corpo enorme sobre a
 * imagem, com os gradientes que rebaixam o fundo até o texto respirar.
 */
export function Abertura() {
  return (
    <section
      data-ch="00 · Abertura"
      className="relative grid min-h-[560px] h-svh items-center overflow-hidden"
    >
      {/* A imagem entra afastando lentamente — início de filme. */}
      <div
        className="absolute inset-x-0 -inset-y-[12%] overflow-hidden"
        style={{ animation: `aproximar 2.4s ${CINEMA} both` }}
      >
        <Moldura alt="Rebanho ao pôr do sol" posicao="50% 42%" className="h-full w-full" />
      </div>

      <div className="absolute inset-0 bg-linear-to-b from-noite-950/80 via-noite-950/60 via-42% to-noite-950/95" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(72% 52% at 50% 46%, rgba(11,10,9,.62), transparent 72%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1240px] px-[clamp(18px,5vw,60px)] text-center">
        <div
          className="font-medium uppercase text-osso/80"
          style={{
            fontSize: "clamp(9.5px,2.2vw,11.5px)",
            letterSpacing: ".28em",
            animation: `letra 1.6s ${CINEMA} .3s both`,
          }}
        >
          {ABERTURA.kicker}
        </div>

        <h1
          className="font-display"
          style={{
            fontSize: "clamp(52px,17vw,210px)",
            lineHeight: 0.84,
            letterSpacing: "-.02em",
            margin: "clamp(14px,3vw,28px) 0 0",
            animation: `subir 1.5s ${CINEMA} .5s both`,
          }}
        >
          {ABERTURA.titulo}
        </h1>

        <div
          className="mx-auto max-w-[640px]"
          style={{
            marginTop: "clamp(20px,3.4vw,34px)",
            animation: `subir 1.4s ${CINEMA} .8s both`,
          }}
        >
          <p
            className="m-0 leading-[1.7] text-osso/85"
            style={{ fontSize: "clamp(14.5px,2.5vw,19px)" }}
          >
            {ABERTURA.lead}
          </p>
        </div>
      </div>

      <div
        aria-hidden
        className="absolute bottom-6 left-1/2 h-[54px] w-px origin-top -translate-x-1/2 bg-linear-to-b from-transparent to-osso/55"
        style={{ animation: `barra 1.4s ${CINEMA} 1.3s both` }}
      />
    </section>
  );
}
