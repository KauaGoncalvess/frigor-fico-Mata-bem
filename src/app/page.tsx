import { CtaFinal } from "@/components/site/cta-final";
import { Estrutura } from "@/components/site/estrutura";
import { Hero } from "@/components/site/hero";
import { Institucional } from "@/components/site/institucional";
import { Numeros } from "@/components/site/numeros";
import { Operacao } from "@/components/site/operacao";
import { Produtos } from "@/components/site/produtos";
import { Qualidade } from "@/components/site/qualidade";
import { Wagyu } from "@/components/site/wagyu";

export default function Home() {
  return (
    <>
      <Hero />
      <Numeros />
      <Institucional />
      <Operacao />
      <Produtos />
      <Qualidade />
      <Wagyu />
      <Estrutura />
      <CtaFinal />
    </>
  );
}
