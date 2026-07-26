import "server-only";
import bcrypt from "bcryptjs";

const CUSTO = 12;

export async function gerarHash(senha: string): Promise<string> {
  return bcrypt.hash(senha, CUSTO);
}

export async function conferirSenha(senha: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(senha, hash);
  } catch {
    return false;
  }
}

/**
 * Hash descartável com o mesmo custo dos reais. Quando o e-mail não existe,
 * comparamos contra ele mesmo assim: sem isso, "usuário inexistente" responde
 * na hora e "senha errada" demora, e essa diferença de tempo entrega quais
 * e-mails são válidos.
 *
 * O hash é gerado de verdade na primeira chamada — um valor inventado seria
 * rejeitado de imediato pelo bcrypt e não gastaria tempo nenhum.
 */
let hashFalso: string | null = null;

export async function queimarTempo(senha: string): Promise<void> {
  if (!hashFalso) {
    hashFalso = await bcrypt.hash(`descartavel:${Math.random()}`, CUSTO);
  }
  await bcrypt.compare(senha, hashFalso).catch(() => false);
}

/** Regras mínimas de senha para o cadastro do admin. */
export function validarForcaSenha(senha: string): string | null {
  if (senha.length < 10) return "A senha precisa ter pelo menos 10 caracteres.";
  if (!/[a-zA-Z]/.test(senha)) return "A senha precisa ter pelo menos uma letra.";
  if (!/\d/.test(senha)) return "A senha precisa ter pelo menos um número.";
  return null;
}
