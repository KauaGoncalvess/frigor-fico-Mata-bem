import type { Metadata } from "next";
import { CabecaDePagina } from "@/components/site/cabeca-de-pagina";
import { Sustentabilidade } from "@/components/site/sustentabilidade";

export const metadata: Metadata = {
  title: "Sustentabilidade",
  description:
    "Licenciamento ambiental e práticas de uso de recursos, água, resíduos e bem-estar animal.",
};

export default function PaginaSustentabilidade() {
  return (
    <>
      <CabecaDePagina
        rotulo="Sustentabilidade"
        titulo="Produzir hoje. Pensar no amanhã."
        lead="Operar um frigorífico é lidar com água, resíduo e energia todos os dias. O que segue é o que a unidade mantém sob licença e controle."
      />
      <Sustentabilidade completo />
    </>
  );
}
