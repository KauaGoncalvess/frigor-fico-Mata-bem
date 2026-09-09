import type { Metadata } from "next";
import { CabecaDePagina } from "@/components/site/cabeca-de-pagina";
import { Produtos } from "@/components/site/produtos";
import { Revelar } from "@/components/site/revelar";
import { Secao } from "@/components/site/secao";
import { MODELOS } from "@/conteudo/produtos";

export const metadata: Metadata = {
  title: "Produtos",
  description:
    "Cortes bovinos e suínos, resfriados, congelados, miúdos e subprodutos do Frigorífico Mata Bem.",
};

export default function PaginaProdutos() {
  return (
    <>
      <CabecaDePagina
        rotulo="Produtos"
        titulo="Qualidade e padronização para diferentes necessidades."
        lead="Atendemos casas de carnes, supermercados, distribuidores e indústrias, em prestação de serviço de abate ou por demanda própria."
      />

      <Produtos completo />

      <Secao numero="—" rotulo="Como trabalhamos" titulo="Dois contratos, um só processo." fundo="alternado">
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
    </>
  );
}
