import { defineConfig } from '@playwright/test'

export default defineConfig({
  webServer: {
    command: 'pnpm run preview',
    port: 4173,
    reuseExistingServer: true,
    timeout: 120000
  },
  use: {
    baseURL: 'http://localhost:4173'
  },
  testDir: './e2e'
})
