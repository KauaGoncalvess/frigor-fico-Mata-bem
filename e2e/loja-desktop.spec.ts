import { expect, test } from "@playwright/test";

/**
 * O que só dá para conferir na tela grande, além do que a loja no celular já
 * cobre: a descoberta pelo Google e o compartilhamento de link.
 */

test("a home traz os dados estruturados de loja local", async ({ page }) => {
  await page.goto("/");

  const bruto = await page
    .locator('script[type="application/ld+json"]')
    .first()
    .textContent();

  const dados = JSON.parse(bruto ?? "{}");
  expect(dados["@type"]).toBe("Store");
  expect(dados.name).toBeTruthy();
  expect(dados.address?.streetAddress).toBeTruthy();
  // Sem horário no schema, o Google não mostra "aberto agora" na busca local.
  expect(Array.isArray(dados.openingHoursSpecification)).toBe(true);
  expect(dados.openingHoursSpecification.length).toBeGreaterThan(0);
});

test("o link compartilhado tem imagem de preview", async ({ page, request }) => {
  await page.goto("/");

  // Sem isso o link cai no grupo do WhatsApp como um retângulo cinza.
  const og = page.locator('meta[property="og:image"]');
  await expect(og).toHaveCount(1);

  const imagem = await request.get("/opengraph-image");
  expect(imagem.ok()).toBe(true);
  expect(imagem.headers()["content-type"]).toContain("image/png");
});

test("dá para salvar a loja na tela inicial do celular", async ({ request }) => {
  const manifest = await request.get("/manifest.webmanifest");
  expect(manifest.ok()).toBe(true);

  const dados = (await manifest.json()) as {
    name?: string;
    icons?: { src: string; sizes: string }[];
  };
  expect(dados.name).toBeTruthy();
  expect(dados.icons?.length).toBeGreaterThan(0);

  // Ícone declarado que devolve 404 faz a instalação falhar calada.
  for (const icone of dados.icons ?? []) {
    const resposta = await request.get(icone.src);
    expect(resposta.ok(), `${icone.src} não respondeu`).toBe(true);
    expect(resposta.headers()["content-type"]).toContain("image/png");
  }
});

test("o sitemap lista a home", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml).toContain("<urlset");
  expect(xml).toContain("<loc>");
});
