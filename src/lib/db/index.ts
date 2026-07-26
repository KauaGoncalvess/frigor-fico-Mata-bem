import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Conexão preguiçosa: o módulo pode ser importado durante o build (ou num
 * deploy ainda sem banco) sem estourar. Quem precisa do banco chama `db()`.
 */
const url = process.env.DATABASE_URL;

export const bancoConfigurado = Boolean(url && url.trim().length > 0);

type Cliente = ReturnType<typeof drizzle<typeof schema>>;

const cache = globalThis as unknown as {
  __sql?: ReturnType<typeof postgres>;
  __db?: Cliente;
};

export function db(): Cliente {
  if (!bancoConfigurado) {
    throw new Error(
      "DATABASE_URL não configurada. Configure a variável de ambiente para usar o banco.",
    );
  }
  if (!cache.__db) {
    cache.__sql = postgres(url!, {
      max: 1, // serverless: uma conexão por instância, o pooler do Neon cuida do resto
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false, // exigido por poolers em modo transaction
    });
    cache.__db = drizzle(cache.__sql, { schema });
  }
  return cache.__db;
}

export { schema };
