import { defineConfig, devices } from "@playwright/test";

// Alguns ambientes trazem o Chromium numa build diferente da que o Playwright
// espera baixar. Quando isso acontece, aponte o binário existente por aqui.
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined;

/**
 * A suíte roda contra o build de produção: é nele que a página sai estática,
 * e é isso que precisa ser verificado.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3100",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "celular",
      use: { ...devices["Pixel 7"], launchOptions: { executablePath } },
    },
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], launchOptions: { executablePath } },
    },
  ],
  webServer: {
    command: "npx next build && npx next start -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
