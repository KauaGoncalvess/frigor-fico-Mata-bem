import type { KitItem, Produto } from "@/lib/db/schema";
import { formatarQuantidade } from "@/lib/format";
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
  tipo: string;
  descricao: string | null;
  unidade: string;
  precoCentavos: number;
  precoEfetivoCentavos: number;
  emOferta: boolean;
  desconto: number;
  imagemUrl: string | null;
  disponivel: boolean;
  /** Só em kit: "1,2 kg Picanha · 1 kg Fraldinha". */
  composicao: string | null;
  /** Só em kit: quanto o cliente economiza comprando o kit em vez das peças. */
  economiaCentavos: number;
};

function base(produto: Produto, referencia: Date): ProdutoVitrine {
  return {
    id: produto.id,
    nome: produto.nome,
    categoria: produto.categoria,
    tipo: produto.tipo,
    descricao: produto.descricao,
    unidade: produto.unidade,
    precoCentavos: produto.precoCentavos,
    precoEfetivoCentavos: precoEfetivo(produto, referencia),
    emOferta: ofertaAtiva(produto, referencia),
    desconto: percentualDesconto(produto, referencia),
    imagemUrl: produto.imagemUrl,
    disponivel: produto.disponivel,
    composicao: null,
    economiaCentavos: 0,
  };
}

/**
 * Monta a vitrine resolvendo os kits.
 *
 * Um kit fica indisponível sozinho quando falta qualquer peça dele — melhor
 * sumir da loja do que o cliente pedir um kit churrasco e descobrir no balcão
 * que não tem a picanha.
 */
export function montarVitrine(
  produtos: Produto[],
  itensDeKits: KitItem[],
  referencia = new Date(),
): ProdutoVitrine[] {
  const porId = new Map(produtos.map((produto) => [produto.id, produto]));

  return produtos.map((produto) => {
    const vitrine = base(produto, referencia);
    if (produto.tipo !== "kit") return vitrine;

    const componentes = itensDeKits.filter((item) => item.kitId === produto.id);

    if (componentes.length === 0) {
      // Kit sem composição cadastrada não vai para a loja: o cliente não teria
      // como saber o que está comprando.
      return { ...vitrine, disponivel: false };
    }

    let somaAvulsa = 0;
    let tudoDisponivel = true;
    const partes: string[] = [];

    for (const componente of componentes) {
      const peca = porId.get(componente.produtoId);
      if (!peca || !peca.disponivel) {
        tudoDisponivel = false;
        continue;
      }
      somaAvulsa += Math.round(precoEfetivo(peca, referencia) * componente.quantidade);
      partes.push(
        `${formatarQuantidade(componente.quantidade, peca.unidade)} ${peca.nome}`,
      );
    }

    const economia = Math.max(0, somaAvulsa - vitrine.precoEfetivoCentavos);

    return {
      ...vitrine,
      disponivel: produto.disponivel && tudoDisponivel,
      composicao: partes.join(" · ") || null,
      economiaCentavos: economia,
    };
  });
}
