import type { Metadata } from "next";
import { CabecaDePagina } from "@/components/site/cabeca-de-pagina";
import { Mercado } from "@/components/site/mercado";
import { Revelar } from "@/components/site/revelar";
import { Secao } from "@/components/site/secao";
import { RELACIONAMENTO } from "@/conteudo/mercado";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mercado",
  description:
    "Atuação regional do Frigorífico Mata Bem: casas de carnes, supermercados, distribuidores e indústrias de Minas Gerais.",
};

export default function PaginaMercado() {
  return (
    <>
      <CabecaDePagina
        rotulo="Mercado"
        titulo="Atuação regional, com estrutura de indústria."
        lead="Atendemos Sete Lagoas e região, com regularidade de entrega e padronização de corte."
      />

      <Mercado completo />

      <Secao
        numero="—"
        rotulo="Relacionamento"
        titulo="Construímos relações que vão além da negociação."
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
                <Link
                  href={bloco.href}
                  className="rotulo mt-5 inline-block border-b border-terra-500 pb-1.5 text-terra-500 transition-colors hover:border-terra-400 hover:text-terra-400"
                >
                  {bloco.cta} →
                </Link>
              </div>
            </Revelar>
          ))}
        </div>
      </Secao>
    </>
  );
}
