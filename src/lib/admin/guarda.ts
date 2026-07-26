import "server-only";
import { redirect } from "next/navigation";
import { sessaoAtual, type Sessao } from "@/lib/auth/sessao";

/**
 * Porteiro do painel. Todo carregamento de página e toda Server Action do
 * admin passa por aqui.
 *
 * O middleware também barra /admin, mas ele é só a primeira tranca: quem
 * garante a autorização é esta checagem no servidor, junto do dado. Esconder
 * botão no frontend não protege nada — a ação é uma requisição como outra
 * qualquer e pode ser chamada direto.
 */
export async function exigirSessao(): Promise<Sessao> {
  const sessao = await sessaoAtual();
  if (!sessao) redirect("/admin/login");
  return sessao;
}

export type RespostaAcao = {
  ok: boolean;
  mensagem: string;
  campo?: string;
};

/** Erro em linguagem de gente, nunca stack trace na cara do dono da loja. */
export function falha(mensagem: string, campo?: string): RespostaAcao {
  return { ok: false, mensagem, campo };
}

export function sucesso(mensagem: string): RespostaAcao {
  return { ok: true, mensagem };
}
