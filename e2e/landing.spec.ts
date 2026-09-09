import { expect, test } from "@playwright/test";

const ROTAS = [
  "/",
  "/frigorifico",
  "/produtos",
  "/qualidade",
  "/sustentabilidade",
  "/mercado",
  "/contato",
];

test("todas as rotas respondem e têm um h1", async ({ page }) => {
  for (const rota of ROTAS) {
    const resposta = await page.goto(rota);
    expect(resposta?.status(), `${rota} não respondeu 200`).toBe(200);
    await expect(page.getByRole("heading", { level: 1 }), `${rota} sem h1`).toHaveCount(1);
  }
});

test("a home apresenta a empresa e leva ao comercial", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Da origem à mesa");
  await expect(page.getByRole("heading", { name: "Nossos produtos" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /certificar Wagyu/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Vamos conversar?" })).toBeVisible();
});

test("o telefone é clicável", async ({ page }) => {
  await page.goto("/contato");
  await expect(
    page.getByRole("link", { name: "(31) 2106-3355" }).first(),
  ).toHaveAttribute("href", "tel:+553121063355");
});

test("sustentabilidade e mercado saíram da home, mas seguem nas páginas", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Produzir hoje/ })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /Atuação regional/ })).toHaveCount(0);

  await page.goto("/sustentabilidade");
  await expect(page.getByRole("heading", { name: /Produzir hoje/ }).first()).toBeVisible();

  await page.goto("/mercado");
  await expect(page.getByRole("heading", { name: /Atuação regional/ }).first()).toBeVisible();
});

test("todo espaço de foto carrega o seu placeholder", async ({ page }) => {
  await page.goto("/");

  const imagens = page.locator("figure img");
  const total = await imagens.count();
  expect(total).toBeGreaterThan(10);

  for (let i = 0; i < total; i += 1) {
    const src = await imagens.nth(i).getAttribute("src");
    expect(src, "imagem sem src").toBeTruthy();
    // Imagem quebrada tem naturalWidth 0 — é assim que se pega um 404.
    const largura = await imagens.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
    expect(largura, `${src} não carregou`).toBeGreaterThan(0);
  }
});

test("a faixa de números não vai ao ar sem número confirmado", async ({ page }) => {
  await page.goto("/");
  // Regra do briefing: número inventado não entra. Enquanto nada estiver
  // confirmado, a seção inteira fica de fora.
  await expect(page.getByText("capacidade produtiva")).toHaveCount(0);
});

test("o que falta confirmar aparece marcado na página", async ({ page }) => {
  await page.goto("/qualidade");
  await expect(page.getByText("A confirmar").first()).toBeVisible();
});

test("o número do SIF não aparece enquanto está em disputa", async ({ page }) => {
  for (const rota of ROTAS) {
    await page.goto(rota);
    await expect(page.getByText(/SIF\s*4127/), `${rota} mostra o SIF`).toHaveCount(0);
  }
});

test("a rastreabilidade responde a clique e a teclado", async ({ page }) => {
  await page.goto("/qualidade");

  const transporte = page.getByRole("button", { name: "Transporte" });
  await transporte.click();
  await expect(transporte).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText(/deslocamento até a unidade/)).toBeVisible();

  // Sem mouse também: são botões de verdade, não divs com onClick.
  await page.getByRole("button", { name: "Cliente" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText(/próprio controle de qualidade/)).toBeVisible();
});

test("o menu do celular abre e navega", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const abrir = page.getByRole("button", { name: "Abrir menu" });
  await expect(abrir).toBeVisible();
  await abrir.click();

  await page.getByRole("navigation", { name: /celular/ }).getByRole("link", { name: "Produtos" }).click();
  await expect(page).toHaveURL(/\/produtos$/);

  // Trocar de página fecha o menu; senão ele fica por cima do destino.
  await expect(page.getByRole("button", { name: "Abrir menu" })).toBeVisible();
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

  const titulo = page.getByRole("heading", { name: /Construímos confiança/ });
  await expect(titulo).toBeVisible();
  await expect(titulo).toHaveCSS("opacity", "1");

  await ctx.close();
});
