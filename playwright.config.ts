import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração do Playwright para testes E2E
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Executar testes em paralelo */
  fullyParallel: true,
  /* Falhar o build se você deixou test.only no código fonte */
  forbidOnly: !!process.env.CI,
  /* Retry nos testes apenas no CI */
  retries: process.env.CI ? 2 : 0,
  /* Opt out do paralelismo no CI */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter para usar. Veja https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Configurações compartilhadas para todos os projetos abaixo */
  use: {
    /* URL base para usar em ações como `await page.goto('/')` */
    baseURL: 'http://localhost:8081',

    /* Coletar trace quando retry um teste falhou */
    trace: 'on-first-retry',

    /* Capturar screenshot quando um teste falha */
    screenshot: 'only-on-failure',

    /* Capturar vídeo quando um teste falha */
    video: 'retain-on-failure',
  },

  /* Configurar projetos para dispositivos móveis */
  projects: [
    /* Android - Pixel 5 */
    {
      name: 'Android Chrome',
      use: { 
        ...devices['Pixel 5'],
        // Configurações específicas para Android
        viewport: { width: 393, height: 851 },
        hasTouch: true,
        userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36'
      },
    },

    /* Android - Galaxy S9+ */
    {
      name: 'Android Galaxy',
      use: { 
        ...devices['Galaxy S9+'],
        viewport: { width: 320, height: 658 },
        hasTouch: true,
      },
    },

    /* iOS - iPhone 12 */
    {
      name: 'iOS Safari',
      use: { 
        ...devices['iPhone 12'],
        viewport: { width: 390, height: 844 },
        hasTouch: true,
      },
    },

    /* iOS - iPhone SE */
    {
      name: 'iOS SE',
      use: { 
        ...devices['iPhone SE'],
        viewport: { width: 375, height: 667 },
        hasTouch: true,
      },
    },

    /* iPad */
    {
      name: 'iPad',
      use: { 
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 1366 },
        hasTouch: true,
      },
    },
  ],

  /* Executar seu servidor de desenvolvimento local antes de iniciar os testes */
  webServer: {
    command: 'npx expo start --web',
    url: 'http://localhost:8081',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});