import { Abertura } from "@/components/site/abertura";
import { Contato, Rodape } from "@/components/site/contato";
import { Cromados } from "@/components/site/cromados";
import { DadosEstruturados } from "@/components/site/dados-estruturados";
import { Oficio } from "@/components/site/oficio";
import { Origem } from "@/components/site/origem";
import { Planta } from "@/components/site/planta";
import { Rigor } from "@/components/site/rigor";
import { Wagyu } from "@/components/site/wagyu";
import { urlDoSite } from "@/lib/url";

// Página institucional: conteúdo fixo, sem banco. Sai estática no build.
export default function Pagina() {
  return (
    <>
      <DadosEstruturados url={urlDoSite()} />
      <Cromados />

      <main>
        <Abertura />
        <Origem />
        <Planta />
        <Oficio />
        <Wagyu />
        <Rigor />
        <Contato />
      </main>

      <Rodape />
    </>
  );
}
