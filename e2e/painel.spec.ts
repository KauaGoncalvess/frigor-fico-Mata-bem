import { expect, test } from "@playwright/test";
import { AVISO_SEM_CREDENCIAIS, TEM_CREDENCIAIS } from "./credenciais";

/**
 * O painel pelo olho do dono da loja. O que importa aqui é que ele consiga
 * mexer em preço, estoque e oferta sozinho, e que erro apareça em português.
 */

test.skip(!TEM_CREDENCIAIS, AVISO_SEM_CREDENCIAIS);

test("todas as telas do painel abrem logado", async ({ page }) => {
  for (const rota of [
    "/admin",
    "/admin/produtos",
    "/admin/produtos/novo",
    "/admin/ofertas",
    "/admin/pedidos",
    "/admin/contatos",
    "/admin/campanhas",
    "/admin/loja",
  ]) {
    await page.goto(rota);
    await expect(page, `${rota} caiu no login`).not.toHaveURL(/\/admin\/login/);
  }
});

test("cadastra um corte e ele aparece na loja", async ({ page }) => {
  const nome = `Cupim Teste ${Date.now()}`;

  await page.goto("/admin/produtos/novo");
  await page.fill('input[name="nome"]', nome);
  await page.selectOption('select[name="categoria"]', "bovino");
  await page.fill('input[name="preco"]', "45,50");
  await page.getByRole("button", { name: /Cadastrar corte/ }).click();

  await expect(page.getByText("Produto salvo com sucesso")).toBeVisible();
  await expect(page.getByText(nome).first()).toBeVisible();

  // Preço mudado no painel tem que valer na loja na hora.
  await page.goto("/");
  await page.getByLabel("Buscar corte").fill("cupim teste");
  await expect(page.getByText(nome).first()).toBeVisible();
});

test("preço inválido é recusado em português", async ({ page }) => {
  await page.goto("/admin/produtos/novo");
  await page.fill('input[name="nome"]', "Teste Preço Ruim");
  await page.fill('input[name="preco"]', "abc");
  await page.getByRole("button", { name: /Cadastrar corte/ }).click();

  const alerta = page.locator('[role="alert"]').first();
  await expect(alerta).toContainText("preço");
  // Sem stack trace nem nome de coluna do banco na cara do dono.
  await expect(alerta).not.toContainText("Error");
});

test("cadastro de kit avisa quando o kit sai mais caro que as peças", async ({ page }) => {
  await page.goto("/admin/produtos/novo");
  await page.getByText("Kit", { exact: true }).first().click();

  await page.fill('input[name="nome"]', `Kit Teste ${Date.now()}`);
  // Preço absurdo de propósito: o painel deve reclamar.
  await page.fill('input[name="preco"]', "999,00");
  await page.locator('select[name="kitProdutoId"]').first().selectOption({ index: 1 });

  await expect(page.getByText(/Comprando as peças separadas/)).toBeVisible();
  await expect(page.getByText(/o kit está mais caro que as peças/i)).toBeVisible();
});

test("kit exige composição", async ({ page }) => {
  await page.goto("/admin/produtos/novo");
  await page.getByText("Kit", { exact: true }).first().click();
  await page.fill('input[name="nome"]', "Kit Sem Nada");
  await page.fill('input[name="preco"]', "50,00");
  await page.getByRole("button", { name: /Cadastrar kit/ }).click();

  await expect(page.getByText(/precisa de pelo menos um corte/)).toBeVisible();
});

test("a grade de horário aparece com os sete dias", async ({ page }) => {
  await page.goto("/admin/loja");
  for (let dia = 0; dia < 7; dia += 1) {
    await expect(page.locator(`input[name="abre_${dia}"]`)).toHaveCount(1);
  }
});

/**
 * Este bloco liga a entrega, confere o efeito na loja e desliga de novo.
 * Roda em série e restaura o estado no fim: teste que deixa sujeira faz o
 * próximo falhar por motivo errado.
 */
test.describe.configure({ mode: "serial" });

test.describe("chave da entrega", () => {
  test("ligar mostra a escolha e o pedido mínimo; desligar volta a só retirada", async ({
    page,
  }) => {
    await page.goto("/admin/loja");
    await page.check('input[name="entregaAtiva"]');
    await page.fill('input[name="taxaEntrega"]', "8,00");
    await page.fill('input[name="pedidoMinimo"]', "60,00");
    await page.getByRole("button", { name: /Salvar dados da loja/ }).click();
    await expect(page.locator('[role="alert"]').first()).toContainText("entrega está ligada");

    try {
      await page.goto("/");
      await expect(
        page.getByRole("heading", { name: "Entrega na região" }),
      ).toBeVisible();

      // Item baratinho para ficar abaixo do mínimo de propósito.
      await page.getByLabel("Buscar corte").fill("coxa");
      await page
        .locator("#catalogo article")
        .first()
        .getByRole("button", { name: "Adicionar" })
        .click();
      await page.getByRole("button", { name: /Total estimado/ }).click();
      await page.getByRole("button", { name: /Receber em casa/ }).click();

      const painel = page.getByRole("dialog", { name: "Seu pedido" });
      await expect(painel.getByText("Endereço da entrega")).toBeVisible();
      await expect(painel.getByText("Taxa de entrega")).toBeVisible();
      await expect(painel.getByText(/Faltam R\$/)).toBeVisible();

      // Abaixo do mínimo o envio fica bloqueado, com o motivo escrito.
      await expect(
        painel.getByRole("button", { name: /Enviar pedido no WhatsApp/ }),
      ).toBeDisabled();
    } finally {
      // Restaura: a loja de verdade opera só com retirada hoje.
      await page.goto("/admin/loja");
      await page.uncheck('input[name="entregaAtiva"]');
      await page.getByRole("button", { name: /Salvar dados da loja/ }).click();
      await expect(page.locator('[role="alert"]').first()).toContainText(
        "só com retirada",
      );
    }
  });
});

test("contatos que não autorizaram WhatsApp aparecem marcados assim", async ({ page }) => {
  await page.goto("/admin/contatos");
  const vazio = await page
    .getByText("Ninguém cadastrado ainda")
    .isVisible()
    .catch(() => false);
  test.skip(vazio, "nenhum contato cadastrado neste ambiente");

  // A coluna existe para o dono saber quem ele pode alcançar por qual canal.
  await expect(page.getByRole("columnheader", { name: "WhatsApp" })).toBeVisible();
});
