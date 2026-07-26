import { expect, test } from "@playwright/test";

/**
 * A loja pelo olho do cliente, no celular — que é de onde vem a maior parte
 * dos pedidos. Cada teste aqui protege um comportamento que, se quebrar,
 * custa venda.
 */

test.describe("vitrine", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("não rola para o lado no celular", async ({ page }) => {
    const estoura = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(estoura, "rolagem horizontal deixa o site com cara de quebrado").toBe(false);
  });

  test("mostra se a loja está aberta agora", async ({ page }) => {
    await expect(page.getByText(/Aberto agora|Fechado/).first()).toBeVisible();
  });

  test("não promete entrega quando a entrega está desligada", async ({ page }) => {
    // Pelo título do selo: "entrega na região" também aparece no texto do hero.
    const entregaLigada = await page
      .getByRole("heading", { name: "Entrega na região" })
      .isVisible()
      .catch(() => false);
    test.skip(entregaLigada, "a loja está com entrega ligada neste ambiente");

    // Prometer entrega que a loja não faz queima a confiança na primeira compra.
    await expect(page.getByText(/chega no mesmo dia/i)).toHaveCount(0);
    await expect(page.getByText(/Retire no balcão/i)).toBeVisible();
  });

  test("busca ignora acento e filtra o catálogo", async ({ page }) => {
    const cards = page.locator("#catalogo article");
    const total = await cards.count();
    expect(total).toBeGreaterThan(0);

    await page.getByLabel("Buscar corte").fill("linguica");
    await expect(cards).not.toHaveCount(total);
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test("filtro de kits mostra só kit", async ({ page }) => {
    const cards = page.locator("#catalogo article");
    const total = await cards.count();

    await page.getByRole("tab", { name: /^Kits/ }).click();
    const kits = await cards.count();

    expect(kits).toBeGreaterThan(0);
    expect(kits).toBeLessThan(total);
  });
});

test.describe("quantidade respeita a unidade de venda", () => {
  test("corte por quilo vai de meio em meio", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Buscar corte").fill("picanha maturada");

    const card = page
      .locator("#catalogo article")
      .filter({ has: page.getByRole("heading", { name: "Picanha Maturada", exact: true }) })
      .first();

    await card.getByRole("button", { name: "Adicionar" }).click();
    await expect(card.getByText("1 kg")).toBeVisible();

    await card.getByRole("button", { name: /Diminuir/ }).click();
    await expect(card.getByText("0,5 kg")).toBeVisible();
  });

  test("item por peça vai de um em um", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Buscar corte").fill("frango caipira");

    const card = page.locator("#catalogo article").first();
    await card.getByRole("button", { name: "Adicionar" }).click();

    // Meia peça de frango inteiro não existe.
    await expect(card.getByText("1 un")).toBeVisible();
    await card.getByRole("button", { name: /Aumentar/ }).click();
    await expect(card.getByText("2 un")).toBeVisible();
  });
});

test.describe("kits", () => {
  test("mostram composição e a economia frente às peças avulsas", async ({ page }) => {
    await page.goto("/");
    const secao = page.locator("#kits");
    await expect(secao).toBeVisible();

    // A economia é o argumento de venda do kit; se der zero, o kit está mal
    // precificado e não deveria estar no ar.
    await expect(secao.getByText(/economia de R\$/).first()).toBeVisible();
    await expect(secao.getByText(/kg /).first()).toBeVisible();
  });
});

test.describe("carrinho e fechamento", () => {
  test("barra fica visível e o pedido vira link do WhatsApp", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Buscar corte").fill("picanha maturada");
    await page
      .locator("#catalogo article")
      .filter({ has: page.getByRole("heading", { name: "Picanha Maturada", exact: true }) })
      .first()
      .getByRole("button", { name: "Adicionar" })
      .click();

    const barra = page.getByRole("button", { name: /Total estimado/ });
    await expect(barra).toBeVisible();
    await barra.click();

    const link = page.getByRole("link", { name: /Enviar pedido no WhatsApp/ });
    const href = await link.getAttribute("href");
    expect(href).toContain("https://wa.me/");

    const mensagem = decodeURIComponent(href!.split("text=")[1] ?? "");
    expect(mensagem).toContain("Picanha Maturada");
    expect(mensagem).toContain("Total estimado");
    // A modalidade é a primeira coisa que o atendente precisa saber.
    expect(mensagem).toMatch(/Retirada no local|Entrega no endereço/);
    // Carne é vendida por peso: o total não pode parecer definitivo.
    expect(mensagem).toContain("depende do peso exato");
  });

  test("o pedido sobrevive a recarregar a página", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Buscar corte").fill("costela");
    await page
      .locator("#catalogo article")
      .first()
      .getByRole("button", { name: "Adicionar" })
      .click();

    await expect(page.getByRole("button", { name: /Total estimado/ })).toBeVisible();
    await page.reload();
    await expect(page.getByRole("button", { name: /Total estimado/ })).toBeVisible();
  });

  test("oferece repetir o último pedido na volta do cliente", async ({ page }) => {
    await page.goto("/");

    // Simula quem já pediu antes: é assim que o atalho fica disponível.
    await page.evaluate(() => {
      localStorage.setItem(
        "matabem:ultimoPedido:v1",
        JSON.stringify({ itens: [{ produtoId: 2, quantidade: 1 }], em: Date.now() }),
      );
      localStorage.removeItem("matabem:carrinho:v1");
    });
    await page.reload();

    const repetir = page.getByRole("button", { name: "Repetir pedido" });
    await expect(repetir).toBeVisible();
    await repetir.click();

    // Remontou o carrinho e já abriu a revisão.
    await expect(page.getByRole("dialog", { name: "Seu pedido" })).toBeVisible();
  });
});

test("cadastro na lista de ofertas exige o consentimento", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Seu nome").fill("Cliente Teste");
  await page.getByPlaceholder("seu@email.com").fill("cliente.teste@exemplo.com");

  // Sem marcar a autorização, não envia — consentimento é opt-in explícito.
  await page.getByRole("button", { name: /Quero receber as ofertas/ }).click();
  await expect(page.getByText(/Marque a autorização/)).toBeVisible();
});
