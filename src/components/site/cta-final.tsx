import Link from "next/link";
import { CTA_FINAL } from "@/conteudo/home";
import { EMPRESA } from "@/conteudo/empresa";
import { Moldura } from "./moldura";
import { Revelar } from "./revelar";

/** Fechamento da página: uma pergunta e dois caminhos, nada mais. */
export function CtaFinal() {
  return (
    <section
      id="contato"
      data-ch="07 · Contato"
      className="relative overflow-hidden border-t border-osso/12"
    >
      <div className="absolute inset-0 opacity-50">
        <Moldura alt="Unidade do Mata Bem" foto="cta" posicao="50% 55%" className="h-full w-full" />
      </div>
      <div className="absolute inset-0 bg-linear-to-b from-noite-950/95 via-noite-950/80 to-noite-950/97" />

      <div className="relative mx-auto max-w-[1240px] px-[clamp(18px,5vw,60px)] py-[clamp(52px,7vw,96px)] text-center">
        <Revelar>
          <h2
            className="mb-6 font-display leading-[.96]"
            style={{ fontSize: "clamp(36px,8vw,104px)" }}
          >
            {CTA_FINAL.titulo}
          </h2>

          <p
            className="mx-auto mb-[clamp(28px,3.4vw,44px)] max-w-[58ch] leading-[1.8] text-osso/80"
            style={{ fontSize: "clamp(15px,2.4vw,18px)" }}
          >
            {CTA_FINAL.paragrafo}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contato#comercial"
              className="rotulo border border-terra-500 bg-terra-500 px-6 py-4 text-noite-950 transition-colors hover:border-terra-400 hover:bg-terra-400"
            >
              Falar com o comercial →
            </Link>
            <a
              href={EMPRESA.telefoneLink}
              className="rotulo border border-osso/30 px-6 py-4 text-osso transition-colors hover:border-osso"
            >
              {EMPRESA.telefone}
            </a>
          </div>
        </Revelar>
      </div>
    </section>
  );
}
