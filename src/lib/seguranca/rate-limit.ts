import "server-only";
import { sql } from "drizzle-orm";
import { bancoConfigurado, db } from "@/lib/db";

export type ResultadoLimite = {
  permitido: boolean;
  restantes: number;
  esperarSegundos: number;
};

/** Fallback em memória: vale por instância, some no cold start. */
const memoria = globalThis as unknown as {
  __limites?: Map<string, { contagem: number; inicio: number }>;
};
function mapa() {
  if (!memoria.__limites) memoria.__limites = new Map();
  return memoria.__limites;
}

function limitarEmMemoria(
  chave: string,
  maximo: number,
  janelaSegundos: number,
): ResultadoLimite {
  const agora = Date.now();
  const janelaMs = janelaSegundos * 1000;
  const atual = mapa().get(chave);

  if (!atual || agora - atual.inicio >= janelaMs) {
    mapa().set(chave, { contagem: 1, inicio: agora });
    return { permitido: true, restantes: maximo - 1, esperarSegundos: 0 };
  }

  atual.contagem += 1;
  if (atual.contagem > maximo) {
    return {
      permitido: false,
      restantes: 0,
      esperarSegundos: Math.ceil((atual.inicio + janelaMs - agora) / 1000),
    };
  }
  return { permitido: true, restantes: maximo - atual.contagem, esperarSegundos: 0 };
}

/**
 * Limite por janela fixa. Persiste no Postgres quando existe banco, porque
 * contador em memória em função serverless é zerado a cada instância nova —
 * o que deixaria a força bruta de login praticamente livre.
 */
export async function limitar(
  chave: string,
  maximo: number,
  janelaSegundos: number,
): Promise<ResultadoLimite> {
  if (!bancoConfigurado) return limitarEmMemoria(chave, maximo, janelaSegundos);

  try {
    // Um único statement atômico: incrementa dentro da janela ou reinicia.
    const linhas = await db().execute<{ contagem: number; janela_inicio: Date }>(sql`
      INSERT INTO rate_limits (chave, contagem, janela_inicio)
      VALUES (${chave}, 1, now())
      ON CONFLICT (chave) DO UPDATE SET
        contagem = CASE
          WHEN rate_limits.janela_inicio < now() - (${janelaSegundos} * interval '1 second')
          THEN 1
          ELSE rate_limits.contagem + 1
        END,
        janela_inicio = CASE
          WHEN rate_limits.janela_inicio < now() - (${janelaSegundos} * interval '1 second')
          THEN now()
          ELSE rate_limits.janela_inicio
        END
      RETURNING contagem, janela_inicio
    `);

    const linha = Array.isArray(linhas) ? linhas[0] : undefined;
    if (!linha) return { permitido: true, restantes: maximo - 1, esperarSegundos: 0 };

    const contagem = Number(linha.contagem);
    if (contagem > maximo) {
      const fim = new Date(linha.janela_inicio).getTime() + janelaSegundos * 1000;
      return {
        permitido: false,
        restantes: 0,
        esperarSegundos: Math.max(1, Math.ceil((fim - Date.now()) / 1000)),
      };
    }
    return { permitido: true, restantes: maximo - contagem, esperarSegundos: 0 };
  } catch {
    // Banco fora do ar não pode virar porta aberta: cai para o limite local.
    return limitarEmMemoria(chave, maximo, janelaSegundos);
  }
}

/** IP do cliente atrás do proxy da Vercel. */
export function ipDaRequisicao(req: Request): string {
  const encaminhado = req.headers.get("x-forwarded-for");
  if (encaminhado) return encaminhado.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "desconhecido";
}
