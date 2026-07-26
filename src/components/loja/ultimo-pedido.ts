"use client";

/**
 * Guarda o último pedido no próprio aparelho do cliente.
 *
 * Carne é compra de repetição: quem pede toda semana pede quase sempre a mesma
 * coisa. Guardar só id e quantidade (nunca preço) faz o "repetir pedido"
 * remontar o carrinho com os preços de hoje, não com os da semana passada.
 * Fica no localStorage de propósito — sem cadastro, sem login, sem dado nosso.
 */

const CHAVE = "matabem:ultimoPedido:v1";

export type PedidoSalvo = {
  itens: { produtoId: number; quantidade: number }[];
  em: number;
};

/** Depois de um mês a lista provavelmente mudou; não vale mais oferecer. */
const VALIDADE_MS = 30 * 24 * 60 * 60 * 1000;

export function salvarUltimoPedido(
  itens: { produtoId: number; quantidade: number }[],
): void {
  if (typeof window === "undefined" || itens.length === 0) return;
  try {
    const dados: PedidoSalvo = {
      itens: itens.map((x) => ({ produtoId: x.produtoId, quantidade: x.quantidade })),
      em: Date.now(),
    };
    window.localStorage.setItem(CHAVE, JSON.stringify(dados));
  } catch {
    // Modo privado bloqueia escrita: só perdemos a comodidade do atalho.
  }
}

export function lerUltimoPedido(): PedidoSalvo | null {
  if (typeof window === "undefined") return null;
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    if (!bruto) return null;
    const dados = JSON.parse(bruto) as PedidoSalvo;
    if (!Array.isArray(dados?.itens) || dados.itens.length === 0) return null;
    if (typeof dados.em !== "number" || Date.now() - dados.em > VALIDADE_MS) return null;
    return {
      em: dados.em,
      itens: dados.itens.filter(
        (x) => typeof x?.produtoId === "number" && typeof x?.quantidade === "number" && x.quantidade > 0,
      ),
    };
  } catch {
    return null;
  }
}

export function limparUltimoPedido(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CHAVE);
  } catch {
    // Sem problema: o atalho só deixa de aparecer na próxima visita.
  }
}
