import "server-only";
import { eq, inArray } from "drizzle-orm";
import { bancoConfigurado, db } from "@/lib/db";
import { kitItens, type KitItem } from "@/lib/db/schema";
import { estadoDemo, proximoIdDemo } from "@/lib/demo/armazem";

export type ComponenteKit = { produtoId: number; quantidade: number };

export async function listarItensDoKit(kitId: number): Promise<KitItem[]> {
  if (!bancoConfigurado) {
    return estadoDemo().kitItens.filter((x) => x.kitId === kitId);
  }
  return db().select().from(kitItens).where(eq(kitItens.kitId, kitId));
}

/** Busca a composição de vários kits de uma vez — evita N+1 na home. */
export async function listarItensDeKits(kitIds: number[]): Promise<KitItem[]> {
  if (kitIds.length === 0) return [];
  if (!bancoConfigurado) {
    return estadoDemo().kitItens.filter((x) => kitIds.includes(x.kitId));
  }
  return db().select().from(kitItens).where(inArray(kitItens.kitId, kitIds));
}

/** Substitui a composição inteira do kit — mais simples que casar diferenças. */
export async function salvarItensDoKit(
  kitId: number,
  componentes: ComponenteKit[],
): Promise<void> {
  const validos = componentes.filter((x) => x.produtoId > 0 && x.quantidade > 0);

  if (!bancoConfigurado) {
    const estado = estadoDemo();
    estado.kitItens = estado.kitItens.filter((x) => x.kitId !== kitId);
    for (const componente of validos) {
      estado.kitItens.push({
        id: proximoIdDemo(),
        kitId,
        produtoId: componente.produtoId,
        quantidade: componente.quantidade,
      });
    }
    return;
  }

  await db().delete(kitItens).where(eq(kitItens.kitId, kitId));
  if (validos.length > 0) {
    await db()
      .insert(kitItens)
      .values(validos.map((x) => ({ kitId, produtoId: x.produtoId, quantidade: x.quantidade })));
  }
}

export async function excluirItensDoKit(kitId: number): Promise<void> {
  if (!bancoConfigurado) {
    const estado = estadoDemo();
    estado.kitItens = estado.kitItens.filter((x) => x.kitId !== kitId);
    return;
  }
  await db().delete(kitItens).where(eq(kitItens.kitId, kitId));
}
