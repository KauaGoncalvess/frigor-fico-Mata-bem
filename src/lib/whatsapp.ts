import { formatarPreco, formatarQuantidade, somenteDigitos } from "@/lib/format";
import type { Modalidade } from "@/lib/db/schema";

export type ItemMensagem = {
  nome: string;
  quantidade: number;
  unidade: string;
  precoUnitarioCentavos: number;
  /** Só em kit: o que vai dentro. */
  composicao?: string | null;
};

/**
 * Monta o texto do pedido já pronto para o WhatsApp da loja.
 *
 * O total é ESTIMADO: carne é vendida por peso e a peça real varia — deixar
 * isso explícito na mensagem evita discussão na entrega. A modalidade vai
 * escrita porque é a primeira coisa que o atendente precisa saber para
 * separar (embalar para o balcão ou despachar).
 */
export function montarMensagemPedido(dados: {
  nomeLoja: string;
  itens: ItemMensagem[];
  subtotalCentavos: number;
  taxaCentavos: number;
  totalCentavos: number;
  modalidade: Modalidade;
  enderecoLoja?: string | null;
  enderecoEntrega?: string | null;
  clienteNome?: string;
  observacoes?: string;
}): string {
  const linhas: string[] = [];

  linhas.push(`*Novo pedido — ${dados.nomeLoja}*`);
  linhas.push("");

  if (dados.clienteNome?.trim()) {
    linhas.push(`*Cliente:* ${dados.clienteNome.trim()}`);
    linhas.push("");
  }

  linhas.push("*Itens:*");
  for (const item of dados.itens) {
    const subtotal = Math.round(item.precoUnitarioCentavos * item.quantidade);
    linhas.push(
      `• ${item.nome} — ${formatarQuantidade(item.quantidade, item.unidade)} × ${formatarPreco(
        item.precoUnitarioCentavos,
      )} = ${formatarPreco(subtotal)}`,
    );
    if (item.composicao) {
      linhas.push(`   _(${item.composicao})_`);
    }
  }

  linhas.push("");
  if (dados.modalidade === "entrega") {
    linhas.push("*Entrega no endereço:*");
    linhas.push(dados.enderecoEntrega?.trim() || "(endereço não informado)");
  } else {
    linhas.push("*Retirada no local*");
    if (dados.enderecoLoja?.trim()) linhas.push(dados.enderecoLoja.trim());
  }

  linhas.push("");
  if (dados.taxaCentavos > 0) {
    linhas.push(`Subtotal: ${formatarPreco(dados.subtotalCentavos)}`);
    linhas.push(`Taxa de entrega: ${formatarPreco(dados.taxaCentavos)}`);
  }
  linhas.push(`*Total estimado:* ${formatarPreco(dados.totalCentavos)}`);
  // A ressalva de peso só faz sentido se houver algo vendido por quilo. Num
  // pedido só de frango inteiro ou carvão o preço já é exato.
  if (dados.itens.some((item) => item.unidade === "kg")) {
    linhas.push("_O valor final depende do peso exato das peças._");
  }

  if (dados.observacoes?.trim()) {
    linhas.push("");
    linhas.push(`*Observações:* ${dados.observacoes.trim()}`);
  }

  return linhas.join("\n");
}

/** Link universal do WhatsApp — funciona no app do celular e no WhatsApp Web. */
export function linkWhatsapp(numero: string, mensagem: string): string {
  const destino = somenteDigitos(numero);
  return `https://wa.me/${destino}?text=${encodeURIComponent(mensagem)}`;
}
