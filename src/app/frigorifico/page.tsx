import type { Metadata } from "next";
import { CabecaDePagina } from "@/components/site/cabeca-de-pagina";
import { Estrutura } from "@/components/site/estrutura";
import { Institucional } from "@/components/site/institucional";
import { Operacao } from "@/components/site/operacao";
import { Revelar } from "@/components/site/revelar";
import { Secao } from "@/components/site/secao";
import { MODELOS } from "@/conteudo/produtos";

export const metadata: Metadata = {
  title: "O Frigorífico",
  description:
    "História, estrutura e operação do Frigorífico Mata Bem, em Sete Lagoas/MG.",
};

export default function PaginaFrigorifico() {
  return (
    <>
      <CabecaDePagina
        rotulo="O Frigorífico"
        titulo="Duas décadas processando carne em Sete Lagoas."
        lead="Fundado em 2004, o Mata Bem abate bovinos e suínos, industrializa e prepara subprodutos na mesma unidade, sob Inspeção Federal permanente."
      />

      <Institucional />

      <Secao numero="—" rotulo="Modelos de atendimento" titulo="Dois contratos, um só processo.">
        <div className="grid gap-[clamp(22px,3vw,40px)] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          {MODELOS.map((modelo) => (
            <Revelar key={modelo.titulo}>
              <div className="border-t border-osso/20 pt-5">
                <h3 className="font-display text-[clamp(22px,2.8vw,32px)] leading-tight">
                  {modelo.titulo}
                </h3>
                <p className="mt-3 leading-[1.7] text-osso/65">{modelo.texto}</p>
              </div>
            </Revelar>
          ))}
        </div>
      </Secao>

      <Operacao />
      <Estrutura />
    </>
  );
}
