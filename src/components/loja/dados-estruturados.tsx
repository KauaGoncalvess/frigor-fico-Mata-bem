import type { ConfigLoja } from "@/lib/db/schema";
import { horariosParaSchema } from "@/lib/horario";
import { formatarTelefone } from "@/lib/format";

/**
 * JSON-LD de loja local.
 *
 * É o que faz o Google entender que aqui existe um açougue com endereço,
 * telefone e horário — e não só uma página qualquer. Para negócio de bairro,
 * busca local é a principal porta de entrada de cliente novo, então isso vale
 * mais do que qualquer otimização de texto.
 */
export function DadosEstruturados({
  config,
  url,
}: {
  config: ConfigLoja;
  url: string;
}) {
  const dados: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: config.nome,
    description:
      "Açougue e frigorífico com cortes selecionados. Monte seu pedido no site e envie pelo WhatsApp.",
    url,
    image: `${url}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      streetAddress: config.endereco,
      addressCountry: "BR",
    },
    priceRange: "$$",
    currenciesAccepted: "BRL",
    paymentAccepted: "Dinheiro, Pix, Cartão de débito, Cartão de crédito",
  };

  if (config.telefone) dados.telephone = formatarTelefone(config.telefone);
  if (config.mapsUrl) dados.hasMap = config.mapsUrl;

  const redes = [config.instagram, config.facebook].filter(Boolean);
  if (redes.length > 0) dados.sameAs = redes;

  const horarios = horariosParaSchema(config.horarios);
  if (horarios.length > 0) dados.openingHoursSpecification = horarios;

  return (
    <script
      type="application/ld+json"
      // Conteúdo próprio, montado a partir da configuração da loja — não é
      // entrada de usuário anônimo. JSON.stringify já escapa o necessário.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dados) }}
    />
  );
}
