import type { Produto } from "@/lib/db/schema";
import { ofertaAtiva, percentualDesconto, precoEfetivo } from "@/lib/produto";

/**
 * Forma serializável do produto entregue aos componentes de cliente.
 *
 * A validade da oferta é resolvida no servidor: se o cálculo ficasse no
 * navegador, o relógio adiantado do celular do cliente poderia exibir (ou
 * esconder) uma promoção fora de hora.
 */
export type ProdutoVitrine = {
  id: number;
  nome: string;
  categoria: string;
  descricao: string | null;
  unidade: string;
  precoCentavos: number;
  precoEfetivoCentavos: number;
  emOferta: boolean;
  desconto: number;
  imagemUrl: string | null;
  disponivel: boolean;
};

export function paraVitrine(produto: Produto, referencia = new Date()): ProdutoVitrine {
  return {
    id: produto.id,
    nome: produto.nome,
    categoria: produto.categoria,
    descricao: produto.descricao,
    unidade: produto.unidade,
    precoCentavos: produto.precoCentavos,
    precoEfetivoCentavos: precoEfetivo(produto, referencia),
    emOferta: ofertaAtiva(produto, referencia),
    desconto: percentualDesconto(produto, referencia),
    imagemUrl: produto.imagemUrl,
    disponivel: produto.disponivel,
  };
}
