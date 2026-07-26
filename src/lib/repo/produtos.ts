import "server-only";
import { and, asc, eq, inArray } from "drizzle-orm";
import { bancoConfigurado, db } from "@/lib/db";
import { produtos, type NovoProduto, type Produto } from "@/lib/db/schema";
import { estadoDemo, proximoIdDemo } from "@/lib/demo/armazem";
import { ofertaAtiva } from "@/lib/produto";

function ordenar(lista: Produto[]): Produto[] {
  return [...lista].sort((a, b) => a.ordem - b.ordem || a.id - b.id);
}

export async function listarProdutos(): Promise<Produto[]> {
  if (!bancoConfigurado) return ordenar(estadoDemo().produtos);
  return db().select().from(produtos).orderBy(asc(produtos.ordem), asc(produtos.id));
}

export async function listarDisponiveis(): Promise<Produto[]> {
  if (!bancoConfigurado) {
    return ordenar(estadoDemo().produtos.filter((x) => x.disponivel));
  }
  return db()
    .select()
    .from(produtos)
    .where(eq(produtos.disponivel, true))
    .orderBy(asc(produtos.ordem), asc(produtos.id));
}

/** Ofertas da semana já filtradas por validade — a home nunca mostra promo vencida. */
export async function listarOfertas(): Promise<Produto[]> {
  const disponiveis = await listarDisponiveis();
  const agora = new Date();
  return disponiveis.filter((x) => ofertaAtiva(x, agora));
}

export async function obterProduto(id: number): Promise<Produto | null> {
  if (!bancoConfigurado) {
    return estadoDemo().produtos.find((x) => x.id === id) ?? null;
  }
  const [linha] = await db().select().from(produtos).where(eq(produtos.id, id)).limit(1);
  return linha ?? null;
}

export async function criarProduto(dados: NovoProduto): Promise<Produto> {
  if (!bancoConfigurado) {
    const estado = estadoDemo();
    const novo: Produto = {
      id: proximoIdDemo(),
      nome: dados.nome,
      categoria: dados.categoria,
      precoCentavos: dados.precoCentavos,
      unidade: dados.unidade ?? "kg",
      descricao: dados.descricao ?? null,
      imagemUrl: dados.imagemUrl ?? null,
      imagemPublicId: dados.imagemPublicId ?? null,
      disponivel: dados.disponivel ?? true,
      emOferta: dados.emOferta ?? false,
      precoPromoCentavos: dados.precoPromoCentavos ?? null,
      ofertaAte: dados.ofertaAte ?? null,
      ordem: dados.ordem ?? 999,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    };
    estado.produtos.push(novo);
    return novo;
  }
  const [linha] = await db().insert(produtos).values(dados).returning();
  return linha;
}

export async function atualizarProduto(
  id: number,
  dados: Partial<NovoProduto>,
): Promise<Produto | null> {
  if (!bancoConfigurado) {
    const estado = estadoDemo();
    const indice = estado.produtos.findIndex((x) => x.id === id);
    if (indice === -1) return null;
    estado.produtos[indice] = {
      ...estado.produtos[indice],
      ...dados,
      atualizadoEm: new Date(),
    } as Produto;
    return estado.produtos[indice];
  }
  const [linha] = await db()
    .update(produtos)
    .set({ ...dados, atualizadoEm: new Date() })
    .where(eq(produtos.id, id))
    .returning();
  return linha ?? null;
}

export async function excluirProduto(id: number): Promise<boolean> {
  if (!bancoConfigurado) {
    const estado = estadoDemo();
    const antes = estado.produtos.length;
    estado.produtos = estado.produtos.filter((x) => x.id !== id);
    return estado.produtos.length < antes;
  }
  const removidos = await db().delete(produtos).where(eq(produtos.id, id)).returning();
  return removidos.length > 0;
}

/** Ação em massa: marcar vários cortes como disponíveis/indisponíveis de uma vez. */
export async function definirDisponibilidade(
  ids: number[],
  disponivel: boolean,
): Promise<number> {
  if (ids.length === 0) return 0;
  if (!bancoConfigurado) {
    const estado = estadoDemo();
    let total = 0;
    for (const item of estado.produtos) {
      if (ids.includes(item.id)) {
        item.disponivel = disponivel;
        item.atualizadoEm = new Date();
        total += 1;
      }
    }
    return total;
  }
  const linhas = await db()
    .update(produtos)
    .set({ disponivel, atualizadoEm: new Date() })
    .where(inArray(produtos.id, ids))
    .returning({ id: produtos.id });
  return linhas.length;
}

export async function encerrarOfertas(ids: number[]): Promise<number> {
  if (ids.length === 0) return 0;
  if (!bancoConfigurado) {
    const estado = estadoDemo();
    let total = 0;
    for (const item of estado.produtos) {
      if (ids.includes(item.id)) {
        item.emOferta = false;
        item.precoPromoCentavos = null;
        item.ofertaAte = null;
        item.atualizadoEm = new Date();
        total += 1;
      }
    }
    return total;
  }
  const linhas = await db()
    .update(produtos)
    .set({
      emOferta: false,
      precoPromoCentavos: null,
      ofertaAte: null,
      atualizadoEm: new Date(),
    })
    .where(inArray(produtos.id, ids))
    .returning({ id: produtos.id });
  return linhas.length;
}

export async function obterProdutosPorIds(ids: number[]): Promise<Produto[]> {
  if (ids.length === 0) return [];
  if (!bancoConfigurado) {
    return ordenar(estadoDemo().produtos.filter((x) => ids.includes(x.id)));
  }
  return db()
    .select()
    .from(produtos)
    .where(and(inArray(produtos.id, ids), eq(produtos.disponivel, true)));
}
