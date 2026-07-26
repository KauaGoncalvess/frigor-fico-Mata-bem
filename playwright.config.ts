import { defineConfig, devices } from "@playwright/test";

/**
 * Testes de ponta a ponta.
 *
 * Rodam contra o build de produção (`next start`), não contra o dev server:
 * é nele que o cliente entra, e é onde bugs de Server Action e de cache
 * aparecem. Antes de rodar, faça `npm run build`.
 *
 * Os testes esperam o catálogo de exemplo (`npm run db:semear`, ou o modo
 * demonstração sem banco), porque conferem cortes com nome conhecido.
 */
const PORTA = Number(process.env.E2E_PORTA ?? 3100);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  // Um worker de propósito: a loja tem estado compartilhado (catálogo,
  // configuração, rate limit). Em paralelo os testes atrapalhariam uns aos
  // outros e o resultado viraria loteria.
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : [["list"]],
  timeout: 60_000,
  expect: { timeout: 15_000 },

  use: {
    baseURL: `http://localhost:${PORTA}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    locale: "pt-BR",
    timezoneId: "America/Sao_Paulo",
    // Escape para imagens de CI que já trazem o Chromium instalado fora do
    // caminho padrão. Em máquina normal, use `npx playwright install chromium`.
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
      : undefined,
  },

  projects: [
    // Faz login uma única vez e guarda a sessão. Sem isso, cada teste do
    // painel gastaria uma tentativa e o rate limit do login (8 por 15 min)
    // reprovaria a própria suíte.
    { name: "sessao", testMatch: /sessao\.setup\.ts/ },

    {
      name: "loja-celular",
      use: { ...devices["Pixel 7"] },
      testMatch: /loja\.spec\.ts/,
    },
    {
      name: "loja-desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
      testMatch: /loja-desktop\.spec\.ts/,
    },
    {
      name: "painel",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        storageState: "e2e/.sessao/admin.json",
      },
      dependencies: ["sessao"],
      testMatch: /painel\.spec\.ts/,
    },
    {
      name: "seguranca",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /seguranca\.spec\.ts/,
    },
  ],

  webServer: {
    command: `npx next start -p ${PORTA}`,
    url: `http://localhost:${PORTA}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
