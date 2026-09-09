import type { Metadata } from "next";
import { CabecaDePagina } from "@/components/site/cabeca-de-pagina";
import { AConfirmar } from "@/components/site/a-confirmar";
import { Revelar } from "@/components/site/revelar";
import { Secao } from "@/components/site/secao";
import { EMPRESA } from "@/conteudo/empresa";
import { RELACIONAMENTO, TRABALHE_CONOSCO } from "@/conteudo/mercado";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com o comercial do Frigorífico Mata Bem em Sete Lagoas/MG: telefone, e-mail e endereço da unidade.",
};

/**
 * Contato.
 *
 * Sem formulário: a página inteira é estática e o comprador B2B resolve
 * volume e contrato por voz. O telefone é o CTA; o e-mail, a alternativa
 * para quem prefere deixar registrado.
 */
export default function PaginaContato() {
  return (
    <>
      <CabecaDePagina
        rotulo="Contato"
        titulo="Fale com nossa equipe."
        lead="Atendimento comercial para casas de carnes, supermercados, distribuidores e indústrias."
      />

      <Secao id="comercial">
        <Revelar>
          <a
            href={EMPRESA.telefoneLink}
            className="inline-block border-b border-osso/30 font-display leading-[1.1] text-osso transition-colors hover:border-terra-500 hover:text-terra-500"
            style={{ fontSize: "clamp(32px,7vw,80px)" }}
          >
            {EMPRESA.telefone}
          </a>

          <dl className="mt-[clamp(30px,4vw,56px)] grid gap-[clamp(20px,3vw,40px)] [grid-template-columns:repeat(auto-fit,minmax(230px,1fr))]">
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
                <br />
                CEP {EMPRESA.endereco.cep}
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
      </Secao>

      <Secao
        id="fornecedores"
        numero="—"
        rotulo="Relacionamento"
        titulo="Produtor ou comprador?"
        fundo="alternado"
      >
        <div className="grid gap-[clamp(22px,3vw,40px)] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          {RELACIONAMENTO.map((bloco) => (
            <Revelar key={bloco.titulo}>
              <div className="border-t border-osso/20 pt-5">
                <h3 className="font-display text-[clamp(22px,2.8vw,32px)] leading-tight">
                  {bloco.titulo}
                </h3>
                <p className="mt-3 leading-[1.7] text-osso/65">{bloco.texto}</p>
                <a
                  href={EMPRESA.telefoneLink}
                  className="rotulo mt-5 inline-block border-b border-terra-500 pb-1.5 text-terra-500 transition-colors hover:border-terra-400 hover:text-terra-400"
                >
                  {EMPRESA.telefone} →
                </a>
              </div>
            </Revelar>
          ))}
        </div>
      </Secao>

      <Secao id="trabalhe-conosco" numero="—" rotulo="Trabalhe conosco" titulo={TRABALHE_CONOSCO.titulo}>
        <Revelar>
          <p className="max-w-[54ch] leading-[1.8] text-osso/75">{TRABALHE_CONOSCO.texto}</p>

          <AConfirmar dado={TRABALHE_CONOSCO.vagas} className="mt-6">
            {TRABALHE_CONOSCO.vagas.valor.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {TRABALHE_CONOSCO.vagas.valor.map((vaga) => (
                  <li key={vaga} className="border-t border-osso/15 pt-3 text-osso/80">
                    {vaga}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-osso/55">
                Sem vagas abertas divulgadas no momento. Currículos podem ser enviados
                para {EMPRESA.email}.
              </p>
            )}
          </AConfirmar>
        </Revelar>
      </Secao>
    </>
  );
}
