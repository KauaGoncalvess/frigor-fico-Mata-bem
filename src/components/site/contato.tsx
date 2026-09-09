import { CONTATO, EMPRESA } from "@/conteudo/empresa";
import { Moldura } from "./moldura";
import { Revelar } from "./revelar";

/**
 * 06 · Contato — o telefone em corpo de manchete, porque é o CTA da página:
 * comprador profissional resolve volume e contrato por voz, não por formulário.
 */
export function Contato() {
  return (
    <section
      id="contato"
      data-ch="06 · Contato"
      className="relative overflow-hidden border-t border-osso/12"
    >
      <div className="absolute inset-0 opacity-50">
        <Moldura alt="Rebanho" posicao="50% 55%" className="h-full w-full" />
      </div>
      <div className="absolute inset-0 bg-linear-to-b from-noite-950/95 via-noite-950/80 to-noite-950/97" />

      <div className="relative mx-auto max-w-[1240px] px-[clamp(18px,5vw,60px)] py-[clamp(52px,7vw,96px)] text-center">
        <Revelar>
          <div className="rotulo mb-[22px] text-terra-500" style={{ letterSpacing: ".3em" }}>
            {CONTATO.numero} · {CONTATO.rotulo}
          </div>

          <h2
            className="mb-[30px] font-display leading-[.96]"
            style={{ fontSize: "clamp(36px,9vw,118px)" }}
          >
            {CONTATO.tituloAntes}
            <span className="italic">{CONTATO.tituloDestaque}</span>
          </h2>

          <a
            href={EMPRESA.telefoneLink}
            className="inline-block border-b border-osso/30 font-display leading-[1.1] text-osso transition-colors duration-300 hover:border-terra-500 hover:text-terra-500"
            style={{ fontSize: "clamp(30px,6.4vw,66px)" }}
          >
            {EMPRESA.telefone}
          </a>

          <dl className="mx-auto mt-[clamp(26px,3.6vw,48px)] grid max-w-[900px] gap-[clamp(20px,3vw,40px)] text-left [grid-template-columns:repeat(auto-fit,minmax(230px,1fr))]">
            <div className="border-t border-osso/20 pt-[18px]">
              <dt className="rotulo mb-2.5 text-osso/45">E-mail</dt>
              <dd className="m-0">
                <a
                  href={`mailto:${EMPRESA.email}`}
                  className="break-all text-[15px] text-osso transition-colors hover:text-terra-500"
                >
                  {EMPRESA.email}
                </a>
              </dd>
            </div>

            <div className="border-t border-osso/20 pt-[18px]">
              <dt className="rotulo mb-2.5 text-osso/45">Unidade</dt>
              <dd className="m-0 text-[15px] leading-[1.6] text-osso/85">
                {EMPRESA.endereco.linha1}
                <br />
                {EMPRESA.endereco.linha2}
              </dd>
            </div>

            <div className="border-t border-osso/20 pt-[18px]">
              <dt className="rotulo mb-2.5 text-osso/45">Atendemos</dt>
              <dd className="m-0 text-[15px] leading-[1.6] text-osso/85">
                {EMPRESA.atendemos}
              </dd>
            </div>
          </dl>
        </Revelar>
      </div>
    </section>
  );
}

export function Rodape() {
  return (
    <footer className="border-t border-osso/12 bg-noite-950">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-baseline justify-between gap-x-[30px] gap-y-3.5 px-[clamp(18px,5vw,60px)] py-8">
        <span className="font-display text-[22px]">{EMPRESA.nome}</span>
        <span className="rotulo text-osso/40" style={{ letterSpacing: ".18em" }}>
          {EMPRESA.razaoSocial} · CNPJ {EMPRESA.cnpj}
        </span>
      </div>
    </footer>
  );
}
