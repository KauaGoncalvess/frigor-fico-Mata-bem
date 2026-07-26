import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_SESSAO, verificarSessao } from "@/lib/auth/token";

/**
 * Primeira tranca do painel: quem não tem cookie de sessão válido nem chega a
 * carregar a página do admin. A tranca definitiva continua sendo a checagem
 * feita no servidor, dentro de cada página e cada Server Action.
 */
export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (pathname === "/admin/login") return NextResponse.next();

  const sessao = await verificarSessao(req.cookies.get(COOKIE_SESSAO)?.value);
  if (sessao) return NextResponse.next();

  const destino = req.nextUrl.clone();
  destino.pathname = "/admin/login";
  destino.search = "";
  // Guarda para onde a pessoa queria ir, para voltar lá depois do login.
  if (pathname !== "/admin") {
    destino.searchParams.set("proximo", `${pathname}${search}`);
  }
  return NextResponse.redirect(destino);
}

export const config = {
  matcher: ["/admin/:path*"],
};
