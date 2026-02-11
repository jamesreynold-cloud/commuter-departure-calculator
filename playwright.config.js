const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  timeout: 30000,
  use: {
    baseURL: process.env.LIVE_URL || 'https://commuter-app.vercel.app',
    headless: true
  }
});
