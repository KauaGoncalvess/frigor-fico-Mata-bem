import { cookies } from "next/headers";
import {
  COOKIE_SESSAO,
  DURACAO_SEGUNDOS,
  assinarSessao,
  segredoConfigurado,
  verificarSessao,
  type Sessao,
} from "./token";

export { COOKIE_SESSAO, segredoConfigurado, verificarSessao };
export type { Sessao };

export async function criarCookieSessao(dados: Sessao): Promise<void> {
  const token = await assinarSessao(dados);
  const jar = await cookies();
  jar.set(COOKIE_SESSAO, token, {
    httpOnly: true, // fora do alcance de JavaScript, inclusive de um XSS
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // não viaja em requisição disparada por outro site
    path: "/",
    maxAge: DURACAO_SEGUNDOS,
  });
}

export async function apagarCookieSessao(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_SESSAO, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/** Sessão atual, lida do cookie assinado. `null` quando não há sessão válida. */
export async function sessaoAtual(): Promise<Sessao | null> {
  const jar = await cookies();
  return verificarSessao(jar.get(COOKIE_SESSAO)?.value);
}
