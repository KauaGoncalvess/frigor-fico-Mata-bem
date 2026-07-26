import { SignJWT, jwtVerify } from "jose";

/**
 * Assinatura e verificação do token de sessão, sem nenhuma dependência de
 * Node ou de `next/headers` — o middleware roda no edge e só consegue importar
 * código assim. As funções que mexem no cookie ficam em `sessao.ts`.
 */

export const COOKIE_SESSAO = "mb_sessao";
export const DURACAO_SEGUNDOS = 60 * 60 * 8; // 8 horas: um turno de trabalho

export type Sessao = {
  sub: string;
  nome: string;
  email: string;
};

function chave(): Uint8Array {
  const segredo = process.env.AUTH_SECRET;
  if (!segredo || segredo.length < 32) {
    throw new Error(
      "AUTH_SECRET ausente ou curta demais (mínimo 32 caracteres). Gere com: openssl rand -base64 32",
    );
  }
  return new TextEncoder().encode(segredo);
}

export function segredoConfigurado(): boolean {
  const segredo = process.env.AUTH_SECRET;
  return Boolean(segredo && segredo.length >= 32);
}

export async function assinarSessao(dados: Sessao): Promise<string> {
  return new SignJWT({ nome: dados.nome, email: dados.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(dados.sub)
    .setIssuedAt()
    .setExpirationTime(`${DURACAO_SEGUNDOS}s`)
    .sign(chave());
}

export async function verificarSessao(token: string | undefined): Promise<Sessao | null> {
  if (!token || !segredoConfigurado()) return null;
  try {
    // `algorithms` fixo em HS256: sem isso um token forjado com alg "none"
    // seria aceito como válido.
    const { payload } = await jwtVerify(token, chave(), { algorithms: ["HS256"] });
    if (!payload.sub) return null;
    return {
      sub: payload.sub,
      nome: String(payload.nome ?? "Administrador"),
      email: String(payload.email ?? ""),
    };
  } catch {
    return null;
  }
}
