import "server-only";
import { eq } from "drizzle-orm";
import { bancoConfigurado, db } from "@/lib/db";
import { adminUsers, type AdminUser } from "@/lib/db/schema";

export type CredencialAdmin = {
  id: number;
  nome: string;
  email: string;
  senhaHash: string;
};

/**
 * Busca as credenciais do admin.
 *
 * Ordem: tabela `admin_users` quando há banco; senão, o par de variáveis de
 * ambiente ADMIN_EMAIL / ADMIN_SENHA_HASH. Não existe credencial padrão em
 * lugar nenhum — sem nenhuma das duas fontes, o login simplesmente não entra.
 */
export async function buscarCredencial(email: string): Promise<CredencialAdmin | null> {
  const alvo = email.trim().toLowerCase();

  if (bancoConfigurado) {
    try {
      const [linha] = await db()
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.email, alvo))
        .limit(1);
      if (linha) {
        return {
          id: linha.id,
          nome: linha.nome,
          email: linha.email,
          senhaHash: linha.senhaHash,
        };
      }
    } catch {
      // Banco indisponível: cai para as variáveis de ambiente abaixo.
    }
  }

  const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const envHash = process.env.ADMIN_SENHA_HASH?.trim();
  if (envEmail && envHash && envEmail === alvo) {
    return {
      id: 0,
      nome: process.env.ADMIN_NOME?.trim() || "Administrador",
      email: envEmail,
      senhaHash: envHash,
    };
  }

  return null;
}

/** Há pelo menos uma forma de entrar? Usado para avisar quando não há nenhuma. */
export function autenticacaoConfigurada(): boolean {
  return Boolean(
    (process.env.ADMIN_EMAIL && process.env.ADMIN_SENHA_HASH) || bancoConfigurado,
  );
}

const BCRYPT = /^\$2[aby]?\$\d{2}\$.{53}$/;

/**
 * Explica por que não dá para entrar, quando dá para saber.
 *
 * O caso chato: o leitor de .env do Next expande `$VAR`, e hash bcrypt é cheio
 * de `$` (`$2b$12$...`). Num arquivo .env o valor chega VAZIO se cada cifrão
 * não estiver escapado com barra invertida — e aspas não resolvem. O login
 * então recusa a senha certa sem explicar nada. Aqui a gente detecta e diz o
 * que arrumar.
 */
export function diagnosticoAdmin(): string | null {
  const email = process.env.ADMIN_EMAIL?.trim();
  const hash = process.env.ADMIN_SENHA_HASH?.trim();

  if (!email && !hash) {
    return bancoConfigurado
      ? null
      : "Nenhum administrador cadastrado. Rode `npm run admin:criar` e configure ADMIN_EMAIL e ADMIN_SENHA_HASH.";
  }

  if (email && !hash) {
    return "ADMIN_EMAIL está configurado, mas ADMIN_SENHA_HASH chegou vazio. Num arquivo .env escape os cifrões do hash com barra invertida: ADMIN_SENHA_HASH=\\$2b\\$12\\$...";
  }

  if (hash && !BCRYPT.test(hash)) {
    return "O valor de ADMIN_SENHA_HASH não parece um hash bcrypt completo. Num arquivo .env escape os cifrões com barra invertida (\\$); no painel da Vercel cole o hash cru.";
  }

  return null;
}

export async function registrarLogin(id: number): Promise<void> {
  if (!bancoConfigurado || id === 0) return;
  try {
    await db()
      .update(adminUsers)
      .set({ ultimoLogin: new Date() })
      .where(eq(adminUsers.id, id));
  } catch {
    // Registrar o último login é acessório: nunca deve derrubar a autenticação.
  }
}

export type { AdminUser };
