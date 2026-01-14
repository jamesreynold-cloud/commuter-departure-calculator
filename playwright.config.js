// Playwright config using LIVE_URL when available
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  use: {
    baseURL: process.env.LIVE_URL || 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 720 }
  },
});