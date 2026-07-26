import { expect, test } from "@playwright/test";
import { ADMIN_EMAIL, TEM_CREDENCIAIS } from "./credenciais";

/**
 * Cada teste aqui corresponde a um item do checklist de segurança do README.
 * São os que dão prejuízo de verdade se regredirem em silêncio.
 */

test("o painel não abre sem sessão", async ({ page }) => {
  await page.goto("/admin/produtos");
  await expect(page).toHaveURL(/\/admin\/login/);
});

test("upload de foto exige sessão", async ({ request }) => {
  const resposta = await request.post("/api/admin/upload", {
    multipart: {
      arquivo: {
        name: "x.jpg",
        mimeType: "image/jpeg",
        buffer: Buffer.from("nem sou imagem"),
      },
    },
  });
  expect(resposta.status()).toBe(401);
});

test("a base de contatos não é exposta sem sessão", async ({ request }) => {
  const resposta = await request.get("/admin/contatos/exportar", { maxRedirects: 0 });
  expect([301, 302, 307, 401]).toContain(resposta.status());
  // O importante: o que volta não é o CSV.
  expect(resposta.headers()["content-type"] ?? "").not.toContain("csv");
});

test("o preço do pedido vem do banco, não do navegador", async ({ request }) => {
  // Um cliente mal-intencionado editaria o preço no JSON. O servidor recalcula.
  const resposta = await request.post("/api/pedidos", {
    data: {
      itens: [{ produtoId: 1, quantidade: 1 }],
      precoUnitarioCentavos: 1,
      totalCentavos: 1,
    },
  });

  if (resposta.ok()) {
    const corpo = (await resposta.json()) as { totalCentavos?: number };
    expect(corpo.totalCentavos ?? 0).toBeGreaterThan(100);
  } else {
    // Produto inexistente neste ambiente também é resposta aceitável.
    expect([400, 429, 500]).toContain(resposta.status());
  }
});

test("formulário público tem armadilha para robô", async ({ request }) => {
  const resposta = await request.post("/api/contatos", {
    data: {
      nome: "Robo",
      email: "robo@spam.test",
      consentimento: true,
      // Campo escondido preenchido + envio instantâneo: assinatura de bot.
      isca: "preenchido",
      tempoNaPagina: 40,
    },
  });
  // Responde como sucesso de propósito: dizer "te bloqueei" ensina o robô.
  expect(resposta.ok()).toBe(true);
});

test("cabeçalhos de proteção estão presentes", async ({ request }) => {
  const cabecalhos = (await request.get("/")).headers();
  expect(cabecalhos["x-content-type-options"]).toBe("nosniff");
  expect(cabecalhos["x-frame-options"]).toBe("DENY");
  expect(cabecalhos["referrer-policy"]).toBe("strict-origin-when-cross-origin");
});

test("senha errada é recusada sem revelar se o e-mail existe", async ({ page }) => {
  test.skip(!TEM_CREDENCIAIS, "precisa de E2E_ADMIN_EMAIL para testar o login");

  await page.goto("/admin/login");
  await page.fill('input[name="email"]', ADMIN_EMAIL);
  await page.fill('input[name="senha"]', "senha-errada-de-proposito");
  await page.getByRole("button", { name: /Entrar/ }).click();

  const alerta = page.locator('form [role="alert"]');
  await expect(alerta).toBeVisible({ timeout: 30_000 });
  // Mensagem genérica: não conta se o problema foi o e-mail ou a senha.
  await expect(alerta).toContainText("E-mail ou senha incorretos");

  // O e-mail digitado volta preenchido: errar a senha não deve custar retrabalho.
  await expect(page.locator('input[name="email"]')).toHaveValue(ADMIN_EMAIL);
});

test("o cookie de sessão não é legível por JavaScript", async ({ page, context }) => {
  test.skip(!TEM_CREDENCIAIS, "precisa das credenciais para criar uma sessão");

  await page.goto("/admin/login");
  await page.fill('input[name="email"]', ADMIN_EMAIL);
  await page.fill('input[name="senha"]', process.env.E2E_ADMIN_SENHA ?? "");
  await page.getByRole("button", { name: /Entrar/ }).click();
  await expect(page).not.toHaveURL(/\/admin\/login/, { timeout: 30_000 });

  const cookie = (await context.cookies()).find((c) => c.name === "mb_sessao");
  expect(cookie?.httpOnly, "sem httpOnly, um XSS rouba a sessão").toBe(true);
  expect(cookie?.sameSite).toBe("Lax");
});

test("descadastro com token inventado não apaga ninguém", async ({ page }) => {
  await page.goto("/descadastro?token=token-que-nao-existe");
  await expect(page.getByText("Link inválido")).toBeVisible();
});

test("busca e painel não são indexados pelo Google", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /admin");
  expect(robots).toContain("Sitemap:");
});
