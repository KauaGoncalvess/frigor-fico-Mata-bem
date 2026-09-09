import type { Metadata } from "next";
import { CabecaDePagina } from "@/components/site/cabeca-de-pagina";
import { Qualidade } from "@/components/site/qualidade";
import { Rastreabilidade } from "@/components/site/rastreabilidade";
import { Revelar } from "@/components/site/revelar";
import { Secao } from "@/components/site/secao";
import { Wagyu } from "@/components/site/wagyu";

export const metadata: Metadata = {
  title: "Qualidade",
  description:
    "Segurança dos alimentos, rastreabilidade, controle de qualidade e bem-estar animal no Frigorífico Mata Bem.",
};

export default function PaginaQualidade() {
  return (
    <>
      <CabecaDePagina
        rotulo="Qualidade"
        titulo="O que pode ser comprovado."
        lead="Qualidade não é uma etapa isolada: aparece no controle da origem, no processo padronizado e no registro de cada passo."
      />

      <Qualidade completo />

      <Secao
        id="rastreabilidade"
        numero="—"
        rotulo="Rastreabilidade"
        titulo="Da origem ao produto final."
      >
        <Revelar>
          <Rastreabilidade />
        </Revelar>
      </Secao>

      <Wagyu />
    </>
  );
}
