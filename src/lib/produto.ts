import type { Produto } from "@/lib/db/schema";

/** Uma oferta só vale se estiver marcada, tiver preço promocional e não ter vencido. */
export function ofertaAtiva(produto: Produto, referencia: Date = new Date()): boolean {
  if (!produto.emOferta) return false;
  if (produto.precoPromoCentavos == null || produto.precoPromoCentavos <= 0) return false;
  if (produto.precoPromoCentavos >= produto.precoCentavos) return false;
  if (produto.ofertaAte && new Date(produto.ofertaAte).getTime() < referencia.getTime()) {
    return false;
  }
  return true;
}

/** Preço que o cliente realmente paga hoje. */
export function precoEfetivo(produto: Produto, referencia: Date = new Date()): number {
  return ofertaAtiva(produto, referencia) ? produto.precoPromoCentavos! : produto.precoCentavos;
}

export function percentualDesconto(produto: Produto, referencia: Date = new Date()): number {
  if (!ofertaAtiva(produto, referencia)) return 0;
  return Math.round((1 - produto.precoPromoCentavos! / produto.precoCentavos) * 100);
}

/** Avisos que o painel mostra ao dono — cadastro incompleto atrapalha a venda. */
export function avisosDoProduto(produto: Produto): string[] {
  const avisos: string[] = [];
  if (!produto.imagemUrl) avisos.push("sem foto");
  if (!produto.precoCentavos || produto.precoCentavos <= 0) avisos.push("sem preço");
  if (!produto.descricao?.trim()) avisos.push("sem descrição");
  if (produto.emOferta && !ofertaAtiva(produto)) avisos.push("oferta vencida ou inválida");
  return avisos;
}
