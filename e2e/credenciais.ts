/**
 * Credenciais do painel usadas nos testes.
 *
 * Vêm do ambiente de propósito: senha de admin não entra no repositório, nem
 * de teste. Sem elas, os testes do painel são pulados com aviso claro em vez
 * de falharem por motivo enganoso.
 */
export const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? "";
export const ADMIN_SENHA = process.env.E2E_ADMIN_SENHA ?? "";

export const TEM_CREDENCIAIS = Boolean(ADMIN_EMAIL && ADMIN_SENHA);

export const AVISO_SEM_CREDENCIAIS =
  "Defina E2E_ADMIN_EMAIL e E2E_ADMIN_SENHA para testar o painel.";

export const ARQUIVO_SESSAO = "e2e/.sessao/admin.json";
