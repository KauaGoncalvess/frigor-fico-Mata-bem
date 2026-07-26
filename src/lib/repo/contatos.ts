import "server-only";
import { randomBytes } from "node:crypto";
import { desc, eq, isNull } from "drizzle-orm";
import { bancoConfigurado, db } from "@/lib/db";
import { contatos, type Contato } from "@/lib/db/schema";
import { estadoDemo, proximoIdDemo } from "@/lib/demo/armazem";

function novoToken(): string {
  return randomBytes(24).toString("base64url");
}

export type ResultadoInscricao = "criado" | "reativado" | "ja_inscrito";

/**
 * Inscreve na lista de ofertas. Idempotente por e-mail: se a pessoa já existe
 * mas havia se descadastrado, reativa; se já está ativa, não duplica.
 */
export async function inscreverContato(dados: {
  nome: string;
  email: string;
  origem?: string;
}): Promise<ResultadoInscricao> {
  const email = dados.email.trim().toLowerCase();
  const agora = new Date();

  if (!bancoConfigurado) {
    const estado = estadoDemo();
    const existente = estado.contatos.find((x) => x.email === email);
    if (existente) {
      if (existente.descadastradoEm) {
        existente.descadastradoEm = null;
        existente.consentimento = true;
        existente.consentimentoEm = agora;
        return "reativado";
      }
      return "ja_inscrito";
    }
    estado.contatos.push({
      id: proximoIdDemo(),
      nome: dados.nome.trim(),
      email,
      consentimento: true,
      consentimentoEm: agora,
      origem: dados.origem ?? "site",
      tokenDescadastro: novoToken(),
      descadastradoEm: null,
      criadoEm: agora,
    });
    return "criado";
  }

  const [existente] = await db()
    .select()
    .from(contatos)
    .where(eq(contatos.email, email))
    .limit(1);

  if (existente) {
    if (existente.descadastradoEm) {
      await db()
        .update(contatos)
        .set({ descadastradoEm: null, consentimento: true, consentimentoEm: agora })
        .where(eq(contatos.id, existente.id));
      return "reativado";
    }
    return "ja_inscrito";
  }

  await db().insert(contatos).values({
    nome: dados.nome.trim(),
    email,
    consentimento: true,
    consentimentoEm: agora,
    origem: dados.origem ?? "site",
    tokenDescadastro: novoToken(),
  });
  return "criado";
}

export async function listarContatos(): Promise<Contato[]> {
  if (!bancoConfigurado) {
    return [...estadoDemo().contatos].sort(
      (a, b) => b.criadoEm.getTime() - a.criadoEm.getTime(),
    );
  }
  return db().select().from(contatos).orderBy(desc(contatos.criadoEm));
}

/** Destinatários elegíveis: com consentimento e sem descadastro. */
export async function listarInscritosAtivos(): Promise<Contato[]> {
  if (!bancoConfigurado) {
    return estadoDemo().contatos.filter((x) => x.consentimento && !x.descadastradoEm);
  }
  return db()
    .select()
    .from(contatos)
    .where(isNull(contatos.descadastradoEm))
    .orderBy(desc(contatos.criadoEm))
    .then((linhas) => linhas.filter((x) => x.consentimento));
}

export async function descadastrarPorToken(token: string): Promise<Contato | null> {
  if (!token) return null;
  if (!bancoConfigurado) {
    const alvo = estadoDemo().contatos.find((x) => x.tokenDescadastro === token);
    if (!alvo) return null;
    alvo.descadastradoEm = alvo.descadastradoEm ?? new Date();
    return alvo;
  }
  const [linha] = await db()
    .update(contatos)
    .set({ descadastradoEm: new Date() })
    .where(eq(contatos.tokenDescadastro, token))
    .returning();
  return linha ?? null;
}

export async function excluirContato(id: number): Promise<boolean> {
  if (!bancoConfigurado) {
    const estado = estadoDemo();
    const antes = estado.contatos.length;
    estado.contatos = estado.contatos.filter((x) => x.id !== id);
    return estado.contatos.length < antes;
  }
  const linhas = await db().delete(contatos).where(eq(contatos.id, id)).returning();
  return linhas.length > 0;
}
