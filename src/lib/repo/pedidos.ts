import "server-only";
import { desc, gte } from "drizzle-orm";
import { bancoConfigurado, db } from "@/lib/db";
import { pedidos, type ItemPedido, type Pedido } from "@/lib/db/schema";
import { estadoDemo, proximoIdDemo } from "@/lib/demo/armazem";

export async function registrarPedido(dados: {
  itens: ItemPedido[];
  totalCentavos: number;
  clienteNome?: string | null;
  observacoes?: string | null;
}): Promise<Pedido> {
  if (!bancoConfigurado) {
    const estado = estadoDemo();
    const novo: Pedido = {
      id: proximoIdDemo(),
      itens: dados.itens,
      totalCentavos: dados.totalCentavos,
      clienteNome: dados.clienteNome ?? null,
      observacoes: dados.observacoes ?? null,
      canal: "whatsapp",
      criadoEm: new Date(),
    };
    estado.pedidos.unshift(novo);
    return novo;
  }
  const [linha] = await db()
    .insert(pedidos)
    .values({
      itens: dados.itens,
      totalCentavos: dados.totalCentavos,
      clienteNome: dados.clienteNome ?? null,
      observacoes: dados.observacoes ?? null,
      canal: "whatsapp",
    })
    .returning();
  return linha;
}

export async function listarPedidos(limite = 50): Promise<Pedido[]> {
  if (!bancoConfigurado) return estadoDemo().pedidos.slice(0, limite);
  return db().select().from(pedidos).orderBy(desc(pedidos.criadoEm)).limit(limite);
}

export async function listarPedidosDesde(inicio: Date): Promise<Pedido[]> {
  if (!bancoConfigurado) {
    return estadoDemo().pedidos.filter((x) => x.criadoEm.getTime() >= inicio.getTime());
  }
  return db()
    .select()
    .from(pedidos)
    .where(gte(pedidos.criadoEm, inicio))
    .orderBy(desc(pedidos.criadoEm));
}
