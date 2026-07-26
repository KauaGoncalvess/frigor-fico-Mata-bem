import "server-only";
import { desc, eq } from "drizzle-orm";
import { bancoConfigurado, db } from "@/lib/db";
import { campanhas, envios, type Campanha } from "@/lib/db/schema";
import { estadoDemo, proximoIdDemo } from "@/lib/demo/armazem";

export async function listarCampanhas(limite = 30): Promise<Campanha[]> {
  if (!bancoConfigurado) return estadoDemo().campanhas.slice(0, limite);
  return db().select().from(campanhas).orderBy(desc(campanhas.criadoEm)).limit(limite);
}

export async function criarCampanha(dados: {
  assunto: string;
  conteudo: string;
  produtosIds: number[];
  canal: string;
}): Promise<Campanha> {
  if (!bancoConfigurado) {
    const estado = estadoDemo();
    const nova: Campanha = {
      id: proximoIdDemo(),
      assunto: dados.assunto,
      conteudo: dados.conteudo,
      produtosIds: dados.produtosIds,
      canal: dados.canal,
      status: "rascunho",
      totalEnviados: 0,
      totalFalhas: 0,
      criadoEm: new Date(),
      enviadoEm: null,
    };
    estado.campanhas.unshift(nova);
    return nova;
  }
  const [linha] = await db().insert(campanhas).values(dados).returning();
  return linha;
}

export async function concluirCampanha(
  id: number,
  resultado: { enviados: number; falhas: number },
): Promise<void> {
  if (!bancoConfigurado) {
    const alvo = estadoDemo().campanhas.find((x) => x.id === id);
    if (alvo) {
      alvo.status = resultado.falhas > 0 && resultado.enviados === 0 ? "falhou" : "enviada";
      alvo.totalEnviados = resultado.enviados;
      alvo.totalFalhas = resultado.falhas;
      alvo.enviadoEm = new Date();
    }
    return;
  }
  await db()
    .update(campanhas)
    .set({
      status: resultado.falhas > 0 && resultado.enviados === 0 ? "falhou" : "enviada",
      totalEnviados: resultado.enviados,
      totalFalhas: resultado.falhas,
      enviadoEm: new Date(),
    })
    .where(eq(campanhas.id, id));
}

/** Registro individual por destinatário — auditoria de quem recebeu o quê. */
export async function registrarEnvios(
  linhas: {
    campanhaId: number;
    contatoId: number;
    canal: string;
    status: string;
    erro?: string | null;
  }[],
): Promise<void> {
  if (linhas.length === 0) return;
  if (!bancoConfigurado) return; // modo demo não persiste auditoria
  await db().insert(envios).values(linhas);
}
