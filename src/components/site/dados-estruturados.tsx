import { EMPRESA } from "@/conteudo/empresa";

/**
 * JSON-LD da empresa. É um frigorífico, não uma loja: o tipo é `Organization`
 * combinado com `LocalBusiness` (a unidade tem endereço físico e telefone).
 *
 * Sem `openingHoursSpecification` de propósito — o horário de atendimento não
 * foi confirmado pela empresa, e horário errado no resultado de busca gera
 * cliente na porta fechada.
 */
export function DadosEstruturados({ url }: { url: string }) {
  const dados = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: "Frigorífico Mata Bem",
    legalName: EMPRESA.razaoSocial,
    taxID: EMPRESA.cnpj,
    vatID: EMPRESA.cnpj,
    url,
    telephone: "+55 31 2106-3355",
    email: EMPRESA.email,
    foundingDate: "2004",
    description:
      "Frigorífico com Inspeção Federal permanente em Sete Lagoas/MG. " +
      "Abate de bovinos e suínos, industrialização e preparação de subprodutos.",
    address: {
      "@type": "PostalAddress",
      streetAddress: EMPRESA.endereco.logradouro,
      addressLocality: EMPRESA.endereco.cidade,
      addressRegion: EMPRESA.endereco.uf,
      postalCode: EMPRESA.endereco.cep,
      addressCountry: "BR",
    },
    areaServed: { "@type": "State", name: "Minas Gerais" },
    knowsAbout: [
      "Abate de bovinos",
      "Abate de suínos",
      "Industrialização de produtos de carne",
      "Preparação de subprodutos do abate",
    ],
  };

  return (
    <script
      type="application/ld+json"
      // O JSON é montado aqui no servidor, a partir de constantes do próprio
      // projeto — não há entrada de usuário para escapar.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dados) }}
    />
  );
}
