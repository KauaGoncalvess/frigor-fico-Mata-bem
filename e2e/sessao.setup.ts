import { expect, test as setup } from "@playwright/test";
import {
  ADMIN_EMAIL,
  ADMIN_SENHA,
  ARQUIVO_SESSAO,
  AVISO_SEM_CREDENCIAIS,
  TEM_CREDENCIAIS,
} from "./credenciais";

/**
 * Loga uma vez e salva a sessão para os testes do painel reaproveitarem.
 *
 * O login tem rate limit por IP (8 tentativas em 15 minutos). Se cada teste
 * fizesse login, a suíte se bloquearia sozinha na metade.
 */
setup("faz login e guarda a sessão", async ({ page }) => {
  setup.skip(!TEM_CREDENCIAIS, AVISO_SEM_CREDENCIAIS);

  await page.goto("/admin/login");
  await page.fill('input[name="email"]', ADMIN_EMAIL);
  await page.fill('input[name="senha"]', ADMIN_SENHA);
  await page.getByRole("button", { name: /Entrar/ }).click();

  await expect(page).not.toHaveURL(/\/admin\/login/, { timeout: 30_000 });

  await page.context().storageState({ path: ARQUIVO_SESSAO });
});
