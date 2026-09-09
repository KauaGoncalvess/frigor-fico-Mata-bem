import { expect, test } from "@playwright/test";

/**
 * A página pelo olho de um comprador: ele precisa entender de quem é a
 * empresa, o que ela comprova e como falar com alguém. Nada mais.
 */

test("os sete capítulos aparecem, na ordem", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Mata Bem");

  for (const titulo of [
    "Tudo começa antes do portão da fábrica.",
    "Seis mil metros quadrados sob um só registro.",
    "O que pode ser comprovado.",
  ]) {
    await expect(page.getByRole("heading", { name: titulo })).toBeVisible();
  }

  await expect(page.getByRole("heading", { name: /certificar Wagyu/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Fale com nossa/ })).toBeVisible();
});

test("o telefone é clicável e é o CTA da página", async ({ page }) => {
  await page.goto("/");

  const telefone = page.getByRole("link", { name: "(31) 2106-3355" });
  await expect(telefone).toHaveAttribute("href", "tel:+553121063355");

  // O atalho fixo do topo leva à seção de contato.
  await page.getByRole("link", { name: "Contato" }).click();
  await expect(page.locator("#contato")).toBeInViewport();
});

test("as evidências de inspeção estão na página", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("SIF 4127 — inspeção federal permanente")).toBeVisible();
  await expect(page.getByText(/DIPOA/).first()).toBeVisible();
  await expect(page.getByText("Válido até 22/02/2031")).toBeVisible();
});

test("a seção Wagyu inverte o contraste", async ({ page }) => {
  await page.goto("/");

  const wagyu = page.locator('[data-ch="04 · Wagyu"]');
  // #e8e0d2 — é a única seção clara, e essa inversão é o clímax do design.
  await expect(wagyu).toHaveCSS("background-color", "rgb(232, 224, 210)");
});

test("nenhuma sobra do sistema antigo responde", async ({ page }) => {
  for (const rota of ["/admin", "/admin/login", "/api/pedidos", "/descadastro"]) {
    const resposta = await page.goto(rota);
    expect(resposta?.status(), `${rota} ainda existe`).toBe(404);
  }
});

test("quem pediu menos movimento não recebe animação", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");

  // Com movimento reduzido o conteúdo chega posicionado, não translúcido.
  const titulo = page.getByRole("heading", { name: "Tudo começa antes do portão da fábrica." });
  await expect(titulo).toBeVisible();
  await expect(titulo).toHaveCSS("opacity", "1");

  await ctx.close();
});
